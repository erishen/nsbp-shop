import React, { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'
import { searchProducts, getCart, isLoggedIn as checkIsLoggedIn } from '../services/shop'
import type { Product } from '../services/shop'
import {
  ShopLayout,
  ShopHeader,
  ShopMain,
  ShopFooter,
  HeaderContent,
  Logo,
  NavMenu,
  NavLink,
  CartButton,
  CartBadge,
  AuthLink,
  SectionTitle,
  ProductGrid,
  ProductCard,
  ProductImage,
  ProductInfo,
  ProductName,
  ProductPrice,
  OriginalPrice,
  ProductBadge,
  EmptyContainer,
  EmptyIcon,
  EmptyText,
  LoadingContainer
} from '../styled/shop'

const Deals: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [cartCount, setCartCount] = useState(0)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // 在客户端检查登录状态
    setIsLoggedIn(checkIsLoggedIn())
  }, [])

  useEffect(() => {
    const loadDeals = async () => {
      try {
        setLoading(true)
        // 获取所有商品，筛选出有优惠的（original_price > price）
        const result = await searchProducts(0, 100)
        const deals = result.items.filter(
          (p) => p.original_price > p.price
        )
        setProducts(deals)
      } catch (err: any) {
        console.error('Failed to load deals:', err)
        setError(`加载优惠商品失败: ${err?.message || '请稍后重试'}`)
      } finally {
        setLoading(false)
      }
    }

    const loadCartCount = async () => {
      try {
        const cartData = await getCart()
        const totalCount = cartData.items.reduce((sum, item) => sum + item.quantity, 0)
        setCartCount(totalCount)
      } catch (err) {
        console.error('Failed to load cart count:', err)
      }
    }

    loadDeals()
    loadCartCount()
  }, [])

  const calculateDiscount = (original: number, current: number) => {
    return Math.round(((original - current) / original) * 100)
  }

  return (
    <ShopLayout>
      <Helmet>
        <title>优惠专区 - NSBP Shop</title>
      </Helmet>

      <ShopHeader>
        <HeaderContent>
          <Logo href="/shop">🛍️ 精品商城</Logo>
            <NavMenu>
              <NavLink href="/shop">首页</NavLink>
              <NavLink href="/shop/products">全部商品</NavLink>
              <NavLink href="/shop/categories">分类</NavLink>
              <NavLink href="/shop/deals" $active>优惠</NavLink>
              {mounted && isLoggedIn ? (
                <AuthLink href="/shop/profile">个人中心</AuthLink>
              ) : (
                <>
                  <AuthLink href="/shop/login">登录</AuthLink>
                  <AuthLink href="/shop/register">注册</AuthLink>
                </>
              )}
              <CartButton href="/shop/cart">
                🛒 购物车
                {cartCount > 0 && <CartBadge>{cartCount}</CartBadge>}
              </CartButton>
            </NavMenu>
        </HeaderContent>
      </ShopHeader>

      <ShopMain>
        <div style={{ padding: '24px 0' }}>
          <SectionTitle>
            <span style={{ color: '#ff4d4f' }}>🔥 优惠专区</span>
          </SectionTitle>

          {loading && (
            <LoadingContainer>
              <div className="spinner" />
              <p>加载中...</p>
            </LoadingContainer>
          )}

          {error && (
            <div
              style={{
                padding: '12px 16px',
                background: '#fff2f0',
                border: '1px solid #ffccc7',
                borderRadius: '8px',
                marginBottom: '24px',
                color: '#ff4d4f'
              }}
            >
              {error}
            </div>
          )}

          {!loading && !error && products.length === 0 && (
            <EmptyContainer>
              <EmptyIcon>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                </svg>
              </EmptyIcon>
              <EmptyText>暂无优惠商品</EmptyText>
              <a href="/shop/products" style={{ color: '#667eea', textDecoration: 'none' }}>
                去逛逛其他商品 →
              </a>
            </EmptyContainer>
          )}

          {!loading && products.length > 0 && (
            <>
              <p style={{ marginBottom: '16px', color: '#666' }}>
                共找到 {products.length} 件优惠商品
              </p>
              <ProductGrid>
                {products.map((product) => {
                  const discount = calculateDiscount(
                    product.original_price,
                    product.price
                  )
                  return (
                    <a
                      key={product.id}
                      href={`/shop/product/${product.id}`}
                      style={{ textDecoration: 'none', color: 'inherit' }}
                    >
                      <ProductCard style={{ position: 'relative' }}>
                        <ProductBadge $discount>-{discount}%</ProductBadge>
                        <ProductImage
                          src={product.image_url}
                          alt={product.name}
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              'https://via.placeholder.com/300x300?text=No+Image'
                          }}
                        />
                        <ProductInfo>
                          <ProductName>{product.name}</ProductName>
                          <ProductPrice>
                            ¥{product.price}
                            <OriginalPrice>
                              ¥{product.original_price}
                            </OriginalPrice>
                          </ProductPrice>
                        </ProductInfo>
                      </ProductCard>
                    </a>
                  )
                })}
              </ProductGrid>
            </>
          )}
        </div>
      </ShopMain>

      <ShopFooter>
        <p>© 2024 NSBP Shop. All rights reserved.</p>
      </ShopFooter>
    </ShopLayout>
  )
}

export default Deals
