/**
 * Shop Service 测试 - GraphQL API 调用
 */

import {
  getBanners,
  getProducts,
  getProductById,
  getCategories,
  getCart,
  addToCart,
  removeFromCart,
  updateCartItem,
  createOrder,
  getOrders,
  login,
  register,
  isLoggedIn,
  getUserId,
  logout
} from './shop'

// Mock graphql utils
jest.mock('../utils/graphql', () => ({
  graphqlRequest: jest.fn(),
  graphqlQuery: jest.fn(),
  graphqlMutation: jest.fn()
}))

describe('Shop Service Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    localStorage.clear()
  })

  describe('导出函数', () => {
    it('应该导出所有必要的函数', () => {
      expect(getBanners).toBeDefined()
      expect(getProducts).toBeDefined()
      expect(getProductById).toBeDefined()
      expect(getCategories).toBeDefined()
      expect(getCart).toBeDefined()
      expect(addToCart).toBeDefined()
      expect(removeFromCart).toBeDefined()
      expect(updateCartItem).toBeDefined()
      expect(createOrder).toBeDefined()
      expect(getOrders).toBeDefined()
      expect(login).toBeDefined()
      expect(register).toBeDefined()
      expect(isLoggedIn).toBeDefined()
      expect(getUserId).toBeDefined()
      expect(logout).toBeDefined()
    })
  })

  describe('isLoggedIn', () => {
    it('token 存在时应该返回 true', () => {
      localStorage.setItem('token', 'test-token')
      expect(isLoggedIn()).toBe(true)
    })

    it('token 不存在时应该返回 false', () => {
      expect(isLoggedIn()).toBe(false)
    })
  })

  describe('getUserId', () => {
    it('应该从 localStorage userId 获取用户 ID', () => {
      localStorage.setItem('userId', '123')
      expect(getUserId()).toBe(123)
    })

    it('应该从 token 解析用户 ID（备用方案）', () => {
      localStorage.setItem('token', 'user_456_1770821275202')
      expect(getUserId()).toBe(456)
    })

    it('userId 和 token 都不存在时应该返回 null', () => {
      expect(getUserId()).toBeNull()
    })
  })

  describe('logout', () => {
    it('应该清除 localStorage 中的 token 和 userId', () => {
      localStorage.setItem('token', 'test-token')
      localStorage.setItem('userId', '123')

      logout()

      expect(localStorage.getItem('token')).toBeNull()
      expect(localStorage.getItem('userId')).toBeNull()
    })
  })
})
