import React from 'react'
import { loadData as homeLoadData } from '@services/home'
import { loadData as photoLoadData } from '@services/photo'
import loadable from '@loadable/component'

const Loading = () => {
  return <div>Loading...</div>
}

const Home = loadable(() => import('@containers/Home'), {
  fallback: <Loading />
})

const Login = loadable(() => import('@containers/Login'), {
  fallback: <Loading />
})

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

export default [
  {
    path: '/',
    element: <Home />,
    loadData: homeLoadData,
    key: 'home'
  },
  {
    path: '/login',
    element: <Login />,
    key: 'login'
  },
  {
    path: '/photo',
    element: <Photo />,
    loadData: photoLoadData,
    key: 'photo'
  },
  // Shop routes
  {
    path: '/shop',
    element: <ShopHome />,
    key: 'shop-home'
  },
  {
    path: '/shop/products',
    element: <ProductList />,
    key: 'shop-products'
  },
  {
    path: '/shop/product/:id',
    element: <ProductDetail />,
    key: 'shop-product-detail'
  },
  {
    path: '/shop/categories',
    element: <Category />,
    key: 'shop-categories'
  },
  {
    path: '/shop/category/:id',
    element: <Category />,
    key: 'shop-category'
  },
  {
    path: '/shop/cart',
    element: <Cart />,
    key: 'shop-cart'
  },
  {
    path: '/shop/deals',
    element: <Deals />,
    key: 'shop-deals'
  },
  {
    path: '/shop/login',
    element: <ShopLogin />,
    key: 'shop-login'
  },
  {
    path: '/shop/register',
    element: <ShopRegister />,
    key: 'shop-register'
  },
  {
    path: '/shop/profile',
    element: <UserProfile />,
    key: 'shop-profile'
  }
]
