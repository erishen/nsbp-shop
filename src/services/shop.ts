// Shop Service - 调用 nsgm-shop GraphQL 服务

import { graphqlRequest, graphqlQuery, graphqlMutation } from '../utils/graphql'

// ==================== 类型定义 ====================

export interface Banner {
  id: number
  title: string
  image_url: string
  link_url?: string
  status: string
}

export interface Product {
  id: number
  name: string
  description: string
  price: number
  original_price: number
  category_id: number
  stock: number
  image_url: string
  images: string[] | string
  sales: number
  status: string
}

export interface Category {
  id: number
  name: string
  icon: string
  parent_id: number
  sort_order: number
  status: string
}

export interface CartItem {
  id: number
  user_id: number
  product_id: number
  quantity: number
  product?: Product
}

export interface Order {
  id: number
  user_id: number
  order_no: string
  total_amount: number
}

export interface User {
  id: number
  username: string
  nickname?: string
  avatar?: string
  email?: string
  phone?: string
  status: string
  created_at: string
}

export interface PaginationResult<T> {
  totalCounts: number
  items: T[]
}

export interface GraphQLResponse<T> {
  data?: T
  errors?: Array<{ message: string }>
}

// ==================== Banner 服务 ====================

export const getBanners = async (page = 0, pageSize = 10): Promise<PaginationResult<Banner>> => {
  const query = `
    query ($page: Int, $pageSize: Int) {
      banner(page: $page, pageSize: $pageSize) {
        totalCounts
        items {
          id
          title
          image_url
          link_url
          status
        }
      }
    }
  `

  const response: GraphQLResponse<{ banner: PaginationResult<Banner> }> = await graphqlQuery(query, {
    page,
    pageSize,
  })

  if (response.errors) {
    throw new Error(response.errors[0].message)
  }

  return response.data!.banner
}

export const getBannerById = async (id: number): Promise<Banner> => {
  const query = `
    query ($id: Int) {
      bannerGet(id: $id) {
        id
        title
        image_url
        link_url
        status
      }
    }
  `

  const response: GraphQLResponse<{ bannerGet: Banner }> = await graphqlQuery(query, { id })

  if (response.errors) {
    throw new Error(response.errors[0].message)
  }

  return response.data!.bannerGet
}

// ==================== Product 服务 ====================

export const getProducts = async (page = 0, pageSize = 10): Promise<PaginationResult<Product>> => {
  const query = `
    query ($page: Int, $pageSize: Int) {
      product(page: $page, pageSize: $pageSize) {
        totalCounts
        items {
          id
          name
          description
          price
          original_price
          category_id
          stock
          image_url
          images
          sales
          status
        }
      }
    }
  `

  const response: GraphQLResponse<{ product: PaginationResult<Product> }> = await graphqlQuery(query, {
    page,
    pageSize,
  })

  if (response.errors) {
    throw new Error(response.errors[0].message)
  }

  return response.data!.product
}

export const getProductById = async (id: number): Promise<Product> => {
  const query = `
    query ($id: Int) {
      productGet(id: $id) {
        id
        name
        description
        price
        original_price
        category_id
        stock
        image_url
        images
        sales
        status
      }
    }
  `

  const response: GraphQLResponse<{ productGet: Product }> = await graphqlQuery(query, { id })

  if (response.errors) {
    throw new Error(response.errors[0].message)
  }

  return response.data!.productGet
}

export const searchProducts = async (
  page = 0,
  pageSize = 10,
  keyword?: string,
  categoryId?: number
): Promise<PaginationResult<Product>> => {
  const query = `
    query ($page: Int, $pageSize: Int, $data: ProductSearchInput) {
      productSearch(page: $page, pageSize: $pageSize, data: $data) {
        totalCounts
        items {
          id
          name
          description
          price
          original_price
          category_id
          stock
          image_url
          images
          sales
          status
        }
      }
    }
  `

  const searchData: any = {}
  if (keyword) searchData.name = keyword
  if (categoryId) searchData.category_id = categoryId

  const response: GraphQLResponse<{ productSearch: PaginationResult<Product> }> = await graphqlQuery(query, {
    page,
    pageSize,
    data: searchData,
  })

  if (response.errors) {
    throw new Error(response.errors[0].message)
  }

  return response.data!.productSearch
}

// ==================== Category 服务 ====================

export const getCategories = async (page = 0, pageSize = 100): Promise<PaginationResult<Category>> => {
  const query = `
    query ($page: Int, $pageSize: Int) {
      category(page: $page, pageSize: $pageSize) {
        totalCounts
        items {
          id
          name
          icon
          parent_id
          sort_order
          status
        }
      }
    }
  `

  const response: GraphQLResponse<{ category: PaginationResult<Category> }> = await graphqlQuery(query, {
    page,
    pageSize,
  })

  if (response.errors) {
    throw new Error(response.errors[0].message)
  }

  return response.data!.category
}

export const getCategoryById = async (id: number): Promise<Category> => {
  const query = `
    query ($id: Int) {
      categoryGet(id: $id) {
        id
        name
        icon
        parent_id
        sort_order
        status
      }
    }
  `

  const response: GraphQLResponse<{ categoryGet: Category }> = await graphqlQuery(query, { id })

  if (response.errors) {
    throw new Error(response.errors[0].message)
  }

  return response.data!.categoryGet
}

// ==================== Cart 服务 ====================

export const getCart = async (page = 0, pageSize = 100): Promise<PaginationResult<CartItem>> => {
  const query = `
    query ($page: Int, $pageSize: Int) {
      cart(page: $page, pageSize: $pageSize) {
        totalCounts
        items {
          id
          user_id
          product_id
          quantity
        }
      }
    }
  `

  const response: GraphQLResponse<{ cart: PaginationResult<CartItem> }> = await graphqlQuery(query, {
    page,
    pageSize,
  })

  if (response.errors) {
    throw new Error(response.errors[0].message)
  }

  return response.data!.cart
}

export const addToCart = async (productId: number, quantity: number): Promise<number> => {
  const mutation = `
    mutation ($data: CartAddInput) {
      cartAdd(data: $data)
    }
  `

  const response: GraphQLResponse<{ cartAdd: number }> = await graphqlMutation(mutation, {
    data: {
      product_id: productId,
      quantity,
    },
  })

  if (response.errors) {
    throw new Error(response.errors[0].message)
  }

  return response.data!.cartAdd
}

export const updateCartItem = async (id: number, quantity: number): Promise<number> => {
  const mutation = `
    mutation ($id: Int, $data: CartAddInput) {
      cartUpdate(id: $id, data: $data)
    }
  `

  const response: GraphQLResponse<{ cartUpdate: number }> = await graphqlMutation(mutation, {
    id,
    data: { quantity },
  })

  if (response.errors) {
    throw new Error(response.errors[0].message)
  }

  return response.data!.cartUpdate
}

export const removeFromCart = async (id: number): Promise<number> => {
  const mutation = `
    mutation ($id: Int) {
      cartDelete(id: $id)
    }
  `

  const response: GraphQLResponse<{ cartDelete: number }> = await graphqlMutation(mutation, { id })

  if (response.errors) {
    throw new Error(response.errors[0].message)
  }

  return response.data!.cartDelete
}

// ==================== Order 服务 ====================

export const createOrder = async (cartIds: number[], addressId: number): Promise<number> => {
  const mutation = `
    mutation ($data: OrderAddInput) {
      orderAdd(data: $data)
    }
  `

  const response: GraphQLResponse<{ orderAdd: number }> = await graphqlMutation(mutation, {
    data: {
      cart_ids: cartIds,
      address_id: addressId,
    },
  })

  if (response.errors) {
    throw new Error(response.errors[0].message)
  }

  return response.data!.orderAdd
}

export const getOrders = async (page = 0, pageSize = 10): Promise<PaginationResult<Order>> => {
  const query = `
    query ($page: Int, $pageSize: Int) {
      order(page: $page, pageSize: $pageSize) {
        totalCounts
        items {
          id
          user_id
          order_no
          total_amount
          status
          created_at
        }
      }
    }
  `

  const response: GraphQLResponse<{ order: PaginationResult<Order> }> = await graphqlQuery(query, {
    page,
    pageSize,
  })

  if (response.errors) {
    throw new Error(response.errors[0].message)
  }

  return response.data!.order
}

// ==================== 首页数据聚合 ====================

export interface HomePageData {
  banners: Banner[]
  featuredProducts: Product[]
  categories: Category[]
}

export const getHomePageData = async (): Promise<HomePageData> => {
  const query = `
    query {
      banner(page: 0, pageSize: 5) {
        items {
          id
          title
          image_url
          link_url
          status
        }
      }
      product(page: 0, pageSize: 8) {
        items {
          id
          name
          description
          price
          original_price
          category_id
          stock
          image_url
          images
          sales
          status
        }
      }
      category(page: 0, pageSize: 6) {
        items {
          id
          name
          icon
          parent_id
          sort_order
          status
        }
      }
    }
  `

  const response: GraphQLResponse<{
    banner: { items: Banner[] }
    product: { items: Product[] }
    category: { items: Category[] }
  }> = await graphqlQuery(query)

  if (response.errors) {
    throw new Error(response.errors[0].message)
  }

  return {
    banners: response.data!.banner.items,
    featuredProducts: response.data!.product.items,
    categories: response.data!.category.items,
  }
}

// ==================== Auth 服务 ====================

export const login = async (username: string, password: string): Promise<string> => {
  const mutation = `
    mutation ($username: String, $password: String) {
      login(username: $username, password: $password)
    }
  `

  const response: GraphQLResponse<{ login: string }> = await graphqlMutation(mutation, {
    username,
    password,
  })

  if (response.errors) {
    throw new Error(response.errors[0].message)
  }

  const token = response.data!.login
  // 保存 token 到 localStorage
  if (typeof window !== 'undefined') {
    localStorage.setItem('token', token)
  }
  return token
}

export const register = async (data: {
  username: string
  password: string
  nickname?: string
  email?: string
  phone?: string
}): Promise<number> => {
  const mutation = `
    mutation ($data: UserAddInput) {
      userAdd(data: $data)
    }
  `

  const response: GraphQLResponse<{ userAdd: number }> = await graphqlMutation(mutation, {
    data: {
      username: data.username,
      password: data.password,
      nickname: data.nickname || data.username,
      email: data.email,
      phone: data.phone,
      status: 'active',
    },
  })

  if (response.errors) {
    throw new Error(response.errors[0].message)
  }

  return response.data!.userAdd
}

export const logout = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('token')
    localStorage.removeItem('userId')
  }
}

export const getToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token')
  }
  return null
}

export const isLoggedIn = (): boolean => {
  const token = getToken()
  console.log('isLoggedIn token:', token)
  return token !== null
}
