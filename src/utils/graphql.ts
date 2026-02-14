// GraphQL 客户端 - 调用 nsgm-shop 服务

import axios from 'axios'

// nsgm-shop GraphQL 端点配置
const NSGM_SHOP_API = process.env.NSGM_SHOP_API || 'http://localhost:3000'

// ==================== 缓存配置 ====================

interface CacheItem<T> {
  data: T
  timestamp: number
  ttl: number
}

class GraphQLCache {
  private cache = new Map<string, CacheItem<unknown>>()
  private defaultTTL: number

  constructor(defaultTTL = 60000) { // 默认缓存 60 秒
    this.defaultTTL = defaultTTL
  }

  // 生成缓存键
  private getCacheKey(query: string, variables?: Record<string, unknown>): string {
    const normalizedQuery = query.trim().replace(/\s+/g, ' ')
    const variablesStr = variables ? JSON.stringify(variables) : ''
    return `${normalizedQuery}:${variablesStr}`
  }

  // 获取缓存
  get<T>(query: string, variables?: Record<string, unknown>): T | null {
    const key = this.getCacheKey(query, variables)
    const item = this.cache.get(key)
    
    if (!item) return null
    
    // 检查是否过期
    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key)
      return null
    }
    
    return item.data as T
  }

  // 设置缓存
  set<T>(query: string, data: T, variables?: Record<string, unknown>, ttl?: number): void {
    const key = this.getCacheKey(query, variables)
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttl ?? this.defaultTTL
    })
  }

  // 清除所有缓存
  clear(): void {
    this.cache.clear()
  }

  // 清除特定查询的缓存
  clearQuery(query: string, variables?: Record<string, unknown>): void {
    const key = this.getCacheKey(query, variables)
    this.cache.delete(key)
  }

  // 清除过期的缓存
  clearExpired(): void {
    const now = Date.now()
    for (const [key, item] of this.cache.entries()) {
      if (now - item.timestamp > item.ttl) {
        this.cache.delete(key)
      }
    }
  }

  // 获取缓存统计
  getStats() {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
    }
  }
}

// 全局缓存实例
const graphqlCache = new GraphQLCache(60000) // 默认 60 秒缓存

// 定期清理过期缓存（每 5 分钟）
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    graphqlCache.clearExpired()
  }, 5 * 60 * 1000)
}

// GraphQL 配置
export const GRAPHQL_CONFIG = {
  endpoint: `${NSGM_SHOP_API}/graphql`,
  csrfEndpoint: `${NSGM_SHOP_API}/csrf-token`,
  defaultHeaders: {
    'Content-Type': 'application/json',
    Accept: 'application/json'
  },
  csrf: {
    enabled: true,
    tokenHeader: 'X-CSRF-Token',
    cookieName: 'csrfToken'
  }
}

// GraphQL 操作类型
export enum GraphQLOperationType {
  QUERY = 'query',
  MUTATION = 'mutation',
  SUBSCRIPTION = 'subscription'
}

// GraphQL 工具函数
export const GraphQLUtils = {
  getOperationType(query: string): GraphQLOperationType {
    const trimmed = query.trim().toLowerCase()
    if (trimmed.startsWith('mutation')) return GraphQLOperationType.MUTATION
    if (trimmed.startsWith('subscription'))
      return GraphQLOperationType.SUBSCRIPTION
    return GraphQLOperationType.QUERY
  },

  getOperationName(query: string): string | null {
    const match = query.match(/(?:query|mutation|subscription)\s+(\w+)/)
    return match ? match[1] : null
  },

  isValidQuery(query: string): boolean {
    try {
      const trimmed = query.trim()
      return (
        trimmed.length > 0 &&
        (trimmed.includes('query') ||
          trimmed.includes('mutation') ||
          trimmed.includes('subscription')) &&
        trimmed.includes('{') &&
        trimmed.includes('}')
      )
    } catch {
      return false
    }
  }
}

// 获取 CSRF Token
export const getCSRFToken = async (): Promise<string> => {
  try {
    const response = await axios.get(GRAPHQL_CONFIG.csrfEndpoint, {
      withCredentials: true
    })

    if (!response.data?.csrfToken) {
      throw new Error('服务器返回的 CSRF token 为空')
    }

    return response.data.csrfToken
  } catch (error) {
    console.error('获取 CSRF token 错误:', error)
    throw error
  }
}

// GraphQL 主函数
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const graphqlRequest = async (query: string, variables: any = {}, options?: { 
  skipCache?: boolean
  cacheTTL?: number 
}) => {
  if (!GraphQLUtils.isValidQuery(query)) {
    throw new Error('Invalid GraphQL query syntax')
  }

  const { skipCache = false, cacheTTL } = options || {}
  const operationType = GraphQLUtils.getOperationType(query)
  const isMutation = operationType === GraphQLOperationType.MUTATION

  // Query 请求使用缓存（除非明确跳过）
  if (!isMutation && !skipCache) {
    const cachedData = graphqlCache.get(query, variables)
    if (cachedData) {
      return cachedData
    }
  }

  try {
    const headers: Record<string, string> = {
      ...GRAPHQL_CONFIG.defaultHeaders
    }

    let response

    if (isMutation) {
      // Mutation 需要 CSRF token
      if (GRAPHQL_CONFIG.csrf.enabled) {
        try {
          const csrfToken = await getCSRFToken()
          headers[GRAPHQL_CONFIG.csrf.tokenHeader] = csrfToken
        } catch (csrfError) {
          console.warn('获取 CSRF token 失败:', csrfError)
        }
      }

      response = await axios.post(
        GRAPHQL_CONFIG.endpoint,
        { query, variables },
        { headers, withCredentials: true }
      )
      
      // Mutation 成功后清除相关缓存
      graphqlCache.clear()
    } else {
      // Query 使用 GET
      const params = new URLSearchParams()
      params.append('query', query)
      if (variables && Object.keys(variables).length > 0) {
        params.append('variables', JSON.stringify(variables))
      }

      response = await axios.get(
        `${GRAPHQL_CONFIG.endpoint}?${params.toString()}`,
        {
          headers: { Accept: 'application/json' },
          withCredentials: true
        }
      )
    }

    if (response?.data) {
      // Query 请求缓存结果
      if (!isMutation && response.data) {
        graphqlCache.set(query, response.data, variables, cacheTTL)
      }
      return response.data
    } else {
      throw new Error('GraphQL response is empty')
    }
  } catch (error) {
    console.error('GraphQL request failed:', error)
    throw error
  }
}

// 快捷函数
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const graphqlQuery = async (query: string, variables?: any) => {
  return graphqlRequest(query, variables)
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const graphqlMutation = async (mutation: string, variables?: any) => {
  return graphqlRequest(mutation, variables)
}

// 检查错误
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const hasGraphqlErrors = (response: any): boolean => {
  return !!(response?.errors && response.errors.length > 0)
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getGraphqlErrorMessage = (response: any): string => {
  if (hasGraphqlErrors(response)) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return response.errors.map((error: any) => error.message).join('; ')
  }
  return ''
}

// ==================== 缓存管理 API ====================

// 清除所有 GraphQL 缓存
export const clearGraphQLCache = (): void => {
  graphqlCache.clear()
}

// 清除特定查询的缓存
export const clearGraphQLQueryCache = (query: string, variables?: Record<string, unknown>): void => {
  graphqlCache.clearQuery(query, variables)
}

// 获取缓存统计信息
export const getGraphQLCacheStats = () => {
  return graphqlCache.getStats()
}

// 手动清理过期缓存
export const cleanupGraphQLCache = (): void => {
  graphqlCache.clearExpired()
}
