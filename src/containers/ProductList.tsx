import React, { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import styled from 'styled-components'
import {
  GlobalStyle,
  ShopLayout,
  ShopHeader,
  HeaderContent,
  Logo,
  NavMenu,
  NavLink,
  CartButton,
  CartBadge,
  AuthLink,
  ShopMain,
  ShopFooter,
  SectionTitle,
  ProductGrid,
  ProductCard,
  ProductImageWrapper,
  ProductImage,
  ProductBadge,
  ProductInfo,
  ProductName,
  ProductPrice,
  CurrentPrice,
  OriginalPrice,
  ProductSales,
  LoadingContainer,
  LoadingSpinner,
  EmptyContainer,
  EmptyIcon,
  EmptyText,
  Button
} from '../styled/shop'
import { getProducts, searchProducts, getCart, isLoggedIn, type Product } from '../services/shop'

const FilterBar = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
  flex-wrap: wrap;
  align-items: center;
`

const FilterGroup = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`

const FilterLabel = styled.span`
  font-size: 14px;
  color: #666;
`

const Select = styled.select`
  padding: 8px 12px;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  
  &:focus {
    outline: none;
    border-color: #667eea;
  }
`

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: 40px;
`

const PageButton = styled.button<{ $active?: boolean }>`
  padding: 8px 16px;
  border: 1px solid ${props => props.$active ? '#667eea' : '#d9d9d9'};
  background: ${props => props.$active ? '#667eea' : 'white'};
  color: ${props => props.$active ? 'white' : '#333'};
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  
  &:hover {
    border-color: #667eea;
    color: ${props => props.$active ? 'white' : '#667eea'};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`

const ProductList: React.FC = () => {
  const [searchParams] = useSearchParams()
  const categoryId = searchParams.get('category')
  
  const [loading, setLoading] = useState(true)
  const [products, setProducts] = useState<Product[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [cartCount, setCartCount] = useState(0)
  const [sortBy, setSortBy] = useState('default')
  const [page, setPage] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const pageSize = 12

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setError(null)
      
      try {
        let result
        
        if (categoryId) {
          // 按分类搜索
          result = await searchProducts(page, pageSize, undefined, parseInt(categoryId))
        } else {
          // 获取全部商品
          result = await getProducts(page, pageSize)
        }
        
        let sortedProducts = [...result.items]
        
        // 客户端排序
        if (sortBy === 'price-asc') {
          sortedProducts.sort((a, b) => a.price - b.price)
        } else if (sortBy === 'price-desc') {
          sortedProducts.sort((a, b) => b.price - a.price)
        } else if (sortBy === 'sales') {
          sortedProducts.sort((a, b) => b.sales - a.sales)
        }
        
        setProducts(sortedProducts)
        setTotalCount(result.totalCounts)
      } catch (err) {
        console.error('Failed to load products:', err)
        setError('加载商品失败，请稍后重试')
        setProducts([])
        setTotalCount(0)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [categoryId, sortBy, page])

  // 加载购物车数量
  useEffect(() => {
    const fetchCartCount = async () => {
      try {
        const cartData = await getCart()
        const totalCount = cartData.items.reduce((sum, item) => sum + item.quantity, 0)
        setCartCount(totalCount)
      } catch (err) {
        setCartCount(0)
      }
    }

    fetchCartCount()
  }, [])

  const totalPages = Math.ceil(totalCount / pageSize)

  if (loading) {
    return (
      <>
        <GlobalStyle />
        <LoadingContainer>
          <LoadingSpinner />
          <div>加载商品中...</div>
        </LoadingContainer>
      </>
    )
  }

  return (
    <>
      <GlobalStyle />
      <Helmet>
        <title>全部商品 - 精品商城</title>
        <meta name="description" content="浏览全部商品，发现优质好物" />
      </Helmet>
      
      <ShopLayout>
          <ShopHeader>
            <HeaderContent>
              <Logo href="/">🛍️ 精品商城</Logo>
              <NavMenu>
                <NavLink href="/">首页</NavLink>
                <NavLink href="/products" $active>全部商品</NavLink>
                <NavLink href="/categories">分类</NavLink>
                <NavLink href="/deals">优惠</NavLink>
                {isLoggedIn() ? (
                  <AuthLink href="/profile">个人中心</AuthLink>
                ) : (
                  <>
                    <AuthLink href="/login">登录</AuthLink>
                    <AuthLink href="/register">注册</AuthLink>
                </>
              )}
              <CartButton href="/cart">
                🛒 购物车
                {cartCount > 0 && <CartBadge>{cartCount}</CartBadge>}
              </CartButton>
            </NavMenu>
          </HeaderContent>
        </ShopHeader>

        <ShopMain>
          {error && (
            <div style={{ 
              padding: '12px 16px', 
              background: '#fff2f0', 
              border: '1px solid #ffccc7',
              borderRadius: '8px',
              marginBottom: '24px',
              color: '#ff4d4f'
            }}>
              {error}
            </div>
          )}

          <SectionTitle>
            <span className="icon">📦</span>
            {categoryId ? '分类商品' : '全部商品'}
            <span style={{ fontSize: '14px', color: '#999', marginLeft: '12px' }}>
              共 {totalCount} 件商品
            </span>
          </SectionTitle>

          <FilterBar>
            <FilterGroup>
              <FilterLabel>排序：</FilterLabel>
              <Select value={sortBy} onChange={e => setSortBy(e.target.value)}>
                <option value="default">默认排序</option>
                <option value="price-asc">价格从低到高</option>
                <option value="price-desc">价格从高到低</option>
                <option value="sales">销量优先</option>
              </Select>
            </FilterGroup>
          </FilterBar>

          {products.length > 0 ? (
            <>
              <ProductGrid>
                {products.map(product => (
                  <Link key={product.id} to={`/shop/product/${product.id}`}>
                    <ProductCard>
                      <ProductImageWrapper>
                        <ProductImage src={product.image_url} alt={product.name} />
                        {product.original_price > product.price && (
                          <ProductBadge>
                            {Math.round(((product.original_price - product.price) / product.original_price) * 100)}% OFF
                          </ProductBadge>
                        )}
                      </ProductImageWrapper>
                      <ProductInfo>
                        <ProductName>{product.name}</ProductName>
                        <ProductPrice>
                          <CurrentPrice>¥{product.price}</CurrentPrice>
                          {product.original_price > product.price && (
                            <OriginalPrice>¥{product.original_price}</OriginalPrice>
                          )}
                        </ProductPrice>
                        <ProductSales>
                          <span className="star">⭐</span>
                          {product.sales} 已售
                        </ProductSales>
                      </ProductInfo>
                    </ProductCard>
                  </Link>
                ))}
              </ProductGrid>

              {totalPages > 1 && (
                <Pagination>
                  <PageButton 
                    onClick={() => setPage(p => Math.max(0, p - 1))}
                    disabled={page === 0}
                  >
                    上一页
                  </PageButton>
                  
                  {Array.from({ length: totalPages }, (_, i) => (
                    <PageButton
                      key={i}
                      $active={page === i}
                      onClick={() => setPage(i)}
                    >
                      {i + 1}
                    </PageButton>
                  ))}
                  
                  <PageButton 
                    onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                    disabled={page >= totalPages - 1}
                  >
                    下一页
                  </PageButton>
                </Pagination>
              )}
            </>
          ) : (
            <EmptyContainer>
              <EmptyIcon>📦</EmptyIcon>
              <EmptyText>暂无商品</EmptyText>
            </EmptyContainer>
          )}
        </ShopMain>

        <ShopFooter>
          <p>© 2025 精品商城 - 品质生活，从这里开始</p>
        </ShopFooter>
      </ShopLayout>
    </>
  )
}

export default ProductList
