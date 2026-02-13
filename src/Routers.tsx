import React from 'react'
import { loadData as photoLoadData } from '@services/photo'
import loadable from '@loadable/component'

const Loading = () => {
  return <div>Loading...</div>
}

const Photo = loadable(() => import('@containers/Photo'), {
  fallback: <Loading />
})

// Shop pages
const ShopHome = loadable(() => import('@containers/ShopHome'), {
  fallback: <Loading />
})

const ProductList = loadable(() => import('@containers/ProductList'), {
  fallback: <Loading />
})

const ProductDetail = loadable(() => import('@containers/ProductDetail'), {
  fallback: <Loading />
})

const Cart = loadable(() => import('@containers/Cart'), {
  fallback: <Loading />
})

const Category = loadable(() => import('@containers/Category'), {
  fallback: <Loading />
})

const Deals = loadable(() => import('@containers/Deals'), {
  fallback: <Loading />
})

const ShopLogin = loadable(() => import('@containers/ShopLogin'), {
  fallback: <Loading />
})

const ShopRegister = loadable(() => import('@containers/ShopRegister'), {
  fallback: <Loading />
})

const UserProfile = loadable(() => import('@containers/UserProfile'), {
  fallback: <Loading />
})

const UserInfo = loadable(() => import('@containers/UserInfo'), {
  fallback: <Loading />
})

const Address = loadable(() => import('@containers/Address'), {
  fallback: <Loading />
})

const UserOrders = loadable(() => import('@containers/UserOrders'), {
  fallback: <Loading />
})

const Security = loadable(() => import('@containers/Security'), {
  fallback: <Loading />
})

const ForgotPassword = loadable(() => import('@containers/ForgotPassword'), {
  fallback: <Loading />
})

const Checkout = loadable(() => import('@containers/Checkout'), {
  fallback: <Loading />
})

const OrderDetail = loadable(() => import('@containers/OrderDetail'), {
  fallback: <Loading />
})

export default [
  {
    path: '/',
    element: <ShopHome />,
    key: 'shop-home'
  },
  {
    path: '/photo',
    element: <Photo />,
    loadData: photoLoadData,
    key: 'photo'
  },
  // Shop routes
  {
    path: '/products',
    element: <ProductList />,
    key: 'shop-products'
  },
  {
    path: '/product/:id',
    element: <ProductDetail />,
    key: 'shop-product-detail'
  },
  {
    path: '/categories',
    element: <Category />,
    key: 'shop-categories'
  },
  {
    path: '/category/:id',
    element: <Category />,
    key: 'shop-category'
  },
  {
    path: '/cart',
    element: <Cart />,
    key: 'shop-cart'
  },
  {
    path: '/deals',
    element: <Deals />,
    key: 'shop-deals'
  },
  {
    path: '/login',
    element: <ShopLogin />,
    key: 'shop-login'
  },
  {
    path: '/register',
    element: <ShopRegister />,
    key: 'shop-register'
  },
  {
    path: '/profile',
    element: <UserProfile />,
    key: 'shop-profile',
    children: [
      {
        index: true,
        element: <UserInfo />,
        key: 'profile-info'
      },
      {
        path: 'info',
        element: <UserInfo />,
        key: 'profile-info'
      },
      {
        path: 'address',
        element: <Address />,
        key: 'profile-address'
      },
      {
        path: 'orders',
        element: <UserOrders />,
        key: 'profile-orders'
      },
      {
        path: 'security',
        element: <Security />,
        key: 'profile-security'
      }
    ]
  },
  {
    path: '/forgot-password',
    element: <ForgotPassword />,
    key: 'shop-forgot-password'
  },
  {
    path: '/checkout',
    element: <Checkout />,
    key: 'shop-checkout'
  },
  {
    path: '/order/:id',
    element: <OrderDetail />,
    key: 'shop-order-detail'
  }
]
