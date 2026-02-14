/**
 * GraphQL Utils 测试
 */

import {
  GraphQLUtils,
  GRAPHQL_CONFIG,
  GraphQLOperationType,
  hasGraphqlErrors,
  getGraphqlErrorMessage
} from './graphql'

describe('GraphQL Utils Tests', () => {
  describe('GraphQLUtils.getOperationType', () => {
    it('应该正确识别 query', () => {
      const query = `query { users { id } }`
      expect(GraphQLUtils.getOperationType(query)).toBe(
        GraphQLOperationType.QUERY
      )
    })

    it('应该正确识别 mutation', () => {
      const mutation = `mutation { createUser { id } }`
      expect(GraphQLUtils.getOperationType(mutation)).toBe(
        GraphQLOperationType.MUTATION
      )
    })

    it('应该正确识别 subscription', () => {
      const subscription = `subscription { userAdded { id } }`
      expect(GraphQLUtils.getOperationType(subscription)).toBe(
        GraphQLOperationType.SUBSCRIPTION
      )
    })

    it('空字符串应该返回 query', () => {
      expect(GraphQLUtils.getOperationType('')).toBe(GraphQLOperationType.QUERY)
    })
  })

  describe('GraphQLUtils.getOperationName', () => {
    it('应该正确提取操作名称', () => {
      const query = `query GetUsers { users { id } }`
      expect(GraphQLUtils.getOperationName(query)).toBe('GetUsers')
    })

    it('没有操作名称时应该返回 null', () => {
      const query = `query { users { id } }`
      expect(GraphQLUtils.getOperationName(query)).toBeNull()
    })

    it('应该正确识别 mutation 操作名称', () => {
      const mutation = `mutation CreateUser { createUser { id } }`
      expect(GraphQLUtils.getOperationName(mutation)).toBe('CreateUser')
    })
  })

  describe('GraphQLUtils.isValidQuery', () => {
    it('有效的 query 应该返回 true', () => {
      const query = `query { users { id } }`
      expect(GraphQLUtils.isValidQuery(query)).toBe(true)
    })

    it('有效的 mutation 应该返回 true', () => {
      const mutation = `mutation { createUser { id } }`
      expect(GraphQLUtils.isValidQuery(mutation)).toBe(true)
    })

    it('空字符串应该返回 false', () => {
      expect(GraphQLUtils.isValidQuery('')).toBe(false)
    })

    it('缺少花括号应该返回 false', () => {
      const query = `query { users `
      expect(GraphQLUtils.isValidQuery(query)).toBe(false)
    })

    it('不包含 query/mutation/subscription 应该返回 false', () => {
      const query = `{ users { id } }`
      expect(GraphQLUtils.isValidQuery(query)).toBe(false)
    })
  })

  describe('hasGraphqlErrors', () => {
    it('有 errors 时应该返回 true', () => {
      const response = { errors: [{ message: 'Error' }] }
      expect(hasGraphqlErrors(response)).toBe(true)
    })

    it('没有 errors 时应该返回 false', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const response = { data: { users: [] as any[] } }
      expect(hasGraphqlErrors(response)).toBe(false)
    })

    it('undefined 应该返回 false', () => {
      expect(hasGraphqlErrors(undefined)).toBe(false)
    })

    it('null 应该返回 false', () => {
      expect(hasGraphqlErrors(null)).toBe(false)
    })
  })

  describe('getGraphqlErrorMessage', () => {
    it('有错误时应该返回错误消息', () => {
      const response = {
        errors: [{ message: 'Error 1' }, { message: 'Error 2' }]
      }
      expect(getGraphqlErrorMessage(response)).toBe('Error 1; Error 2')
    })

    it('没有错误时应该返回空字符串', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const response = { data: { users: [] as any[] } }
      expect(getGraphqlErrorMessage(response)).toBe('')
    })
  })

  describe('GRAPHQL_CONFIG', () => {
    it('应该包含正确的 endpoint', () => {
      expect(GRAPHQL_CONFIG.endpoint).toBeDefined()
      expect(GRAPHQL_CONFIG.endpoint).toContain('/graphql')
    })

    it('应该包含正确的默认 headers', () => {
      expect(GRAPHQL_CONFIG.defaultHeaders['Content-Type']).toBe(
        'application/json'
      )
    })

    it('应该包含 CSRF 配置', () => {
      expect(GRAPHQL_CONFIG.csrf).toBeDefined()
      expect(GRAPHQL_CONFIG.csrf.enabled).toBe(true)
    })
  })
})
