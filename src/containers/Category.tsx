import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
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
  CategoryGrid,
  CategoryCard,
  CategoryIcon,
  CategoryName,
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
  EmptyText
} from '../styled/shop'
import { getCategories, getCategoryById, searchProducts, getCart, isLoggedIn, type Category as CategoryType, type Product } from '../services/shop'

const Breadcrumb = styled.div`
  margin-bottom: 24px;
  font-size: 14px;
  color: #666;
  
  a {
    color: #667eea;
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }
  
  span {
    margin: 0 8px;
  }
`

const Category: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const categoryId = id ? parseInt(id) : null
  
  const [loading, setLoading] = useState(true)
  const [categories, setCategories] = useState<CategoryType[]>([])
  const [currentCategory, setCurrentCategory] = useState<CategoryType | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [cartCount, setCartCount] = useState(0)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setError(null)
      
      try {
        if (categoryId) {
          // 获取当前分类信息
          const category = await getCategoryById(categoryId)
          setCurrentCategory(category)
          
          // 获取该分类的商品
          const productResult = await searchProducts(0, 20, undefined, categoryId)
          setProducts(productResult.items)
        } else {
          // 获取全部分类
          const categoryResult = await getCategories(0, 20)
          setCategories(categoryResult.items)
          setCurrentCategory(null)
          setProducts([])
        }
      } catch (err: any) {
        console.error('Failed to load data:', err)
        setError(`加载数据失败: ${err?.message || '请稍后重试'}`)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [categoryId])

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

  if (loading) {
    return (
      <>
        <GlobalStyle />
        <LoadingContainer>
          <LoadingSpinner />
          <div>加载中...</div>
        </LoadingContainer>
      </>
    )
  }

  return (
    <>
      <GlobalStyle />
      <Helmet>
        <title>{currentCategory ? `${currentCategory.name} - ` : ''}商品分类 - 精品商城</title>
        <meta name="description" content="浏览商品分类，发现心仪好物" />
      </Helmet>
      
      <ShopLayout>
        <ShopHeader>
          <HeaderContent>
            <Logo href="/shop">🛍️ 精品商城</Logo>
            <NavMenu>
              <NavLink href="/shop">首页</NavLink>
              <NavLink href="/shop/products">全部商品</NavLink>
              <NavLink href="/shop/categories" $active>分类</NavLink>
              <NavLink href="/shop/deals">优惠</NavLink>
              {isLoggedIn() ? (
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
              <div style={{ marginTop: '8px', fontSize: '12px' }}>
                请检查: 1) nsgm-shop 是否运行在 http://localhost:8080
                2) 浏览器控制台是否有 CORS 错误
              </div>
            </div>
          )}

          <Breadcrumb>
            <Link to="/shop">首页</Link>
            <span>/</span>
            <Link to="/shop/categories">分类</Link>
            {currentCategory && (
              <>
                <span>/</span>
                {currentCategory.name}
              </>
            )}
          </Breadcrumb>

          {!currentCategory ? (
            <>
              <SectionTitle>
                <span className="icon">🗂️</span>
                全部分类
              </SectionTitle>
              {categories.length > 0 ? (
                <CategoryGrid>
                  {categories.map(category => (
                    <Link key={category.id} to={`/shop/category/${category.id}`}>
                      <CategoryCard>
                        <CategoryIcon>{category.icon || '📦'}</CategoryIcon>
                        <CategoryName>{category.name}</CategoryName>
                      </CategoryCard>
                    </Link>
                  ))}
                </CategoryGrid>
              ) : (
                <EmptyContainer>
                  <EmptyIcon>🗂️</EmptyIcon>
                  <EmptyText>暂无分类</EmptyText>
                </EmptyContainer>
              )}
            </>
          ) : (
            <>
              <SectionTitle>
                <span className="icon">📂</span>
                {currentCategory.name}
                <span style={{ fontSize: '14px', color: '#999', marginLeft: '12px' }}>
                  共 {products.length} 件商品
                </span>
              </SectionTitle>
              {products.length > 0 ? (
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
              ) : (
                <EmptyContainer>
                  <EmptyIcon>📦</EmptyIcon>
                  <EmptyText>该分类暂无商品</EmptyText>
                  <Link to="/shop/categories">
                    <button style={{ 
                      marginTop: '16px',
                      padding: '8px 16px',
                      background: '#667eea',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer'
                    }}>
                      查看其他分类
                    </button>
                  </Link>
                </EmptyContainer>
              )}
            </>
          )}
        </ShopMain>

        <ShopFooter>
          <p>© 2025 精品商城 - 品质生活，从这里开始</p>
        </ShopFooter>
      </ShopLayout>
    </>
  )
}

export default Category
