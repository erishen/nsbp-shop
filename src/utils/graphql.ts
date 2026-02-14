// GraphQL 客户端 - 调用 nsgm-shop 服务

import axios from 'axios'

// nsgm-shop GraphQL 端点配置
const NSGM_SHOP_API = process.env.NSGM_SHOP_API || 'http://localhost:3000'

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
export const graphqlRequest = async (query: string, variables: any = {}) => {
  if (!GraphQLUtils.isValidQuery(query)) {
    throw new Error('Invalid GraphQL query syntax')
  }

  try {
    const operationType = GraphQLUtils.getOperationType(query)
    const isMutation = operationType === GraphQLOperationType.MUTATION

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
