import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet'
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
  Carousel,
  CarouselItem,
  CarouselContent,
  CarouselTitle,
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
  FeatureGrid,
  FeatureCard,
  FeatureTitle,
  FeatureDesc,
  LoadingContainer,
  LoadingSpinner,
  EmptyContainer,
  EmptyIcon,
  EmptyText
} from '../styled/shop'
import { getHomePageData, getCart, isLoggedIn as checkIsLoggedIn, type Banner, type Product, type Category } from '../services/shop'

const ShopHome: React.FC = () => {
  const [loading, setLoading] = useState(true)
  const [banners, setBanners] = useState<Banner[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [cartCount, setCartCount] = useState(0)
  const [currentBanner, setCurrentBanner] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted) {
      setIsLoggedIn(checkIsLoggedIn())
    }
  }, [mounted])

  // 加载首页数据
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // 获取首页数据
        const homeData = await getHomePageData()
        setBanners(homeData.banners)
        setCategories(homeData.categories)
        setProducts(homeData.featuredProducts)
      } catch (err) {
        console.error('Failed to load home page data:', err)
        setError('加载数据失败，请稍后重试')
        // 使用空数据
        setBanners([])
        setCategories([])
        setProducts([])
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // 加载购物车数量
  useEffect(() => {
    const fetchCartCount = async () => {
      try {
        const cartData = await getCart()
        const totalCount = cartData.items.reduce((sum, item) => sum + item.quantity, 0)
        setCartCount(totalCount)
      } catch (err) {
        console.error('Failed to load cart:', err)
        setCartCount(0)
      }
    }

    fetchCartCount()
  }, [])

  // 自动轮播
  useEffect(() => {
    if (banners.length === 0) return
    
    const timer = setInterval(() => {
      setCurrentBanner(prev => (prev + 1) % banners.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [banners.length])

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
        <title>Shop - 精品商城</title>
        <meta name="description" content="精品商城 - 优质商品，品质生活" />
      </Helmet>
      
      <ShopLayout>
        {/* Header */}
        <ShopHeader>
          <HeaderContent>
            <Logo href="/shop">
              🛍️ 精品商城
            </Logo>
            <NavMenu>
              <NavLink href="/shop" $active>首页</NavLink>
              <NavLink href="/shop/products">全部商品</NavLink>
              <NavLink href="/shop/categories">分类</NavLink>
              <NavLink href="/shop/deals">优惠</NavLink>
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

          {/* 轮播图 */}
          {banners.length > 0 && (
            <Carousel>
              <CarouselItem $bgImage={banners[currentBanner]?.image_url || ''}>
                <CarouselContent>
                  <CarouselTitle>{banners[currentBanner]?.title}</CarouselTitle>
                </CarouselContent>
              </CarouselItem>
            </Carousel>
          )}

          {/* 商品分类 */}
          <section>
            <SectionTitle>
              <span className="icon">🛍️</span>
              热门分类
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
                <EmptyIcon>📦</EmptyIcon>
                <EmptyText>暂无分类</EmptyText>
              </EmptyContainer>
            )}
          </section>

          {/* 热门商品 */}
          <section>
            <SectionTitle>
              <span className="icon">🔥</span>
              热门商品
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
                <EmptyText>暂无商品</EmptyText>
              </EmptyContainer>
            )}
          </section>

          {/* 特色功能 */}
          <section>
            <SectionTitle>
              <span className="icon">✨</span>
              我们的优势
            </SectionTitle>
            <FeatureGrid>
              <FeatureCard>
                <FeatureTitle>
                  <span className="icon">🔥</span>
                  超值优惠
                </FeatureTitle>
                <FeatureDesc>每日精选超值商品，限时抢购，让你省钱又省心</FeatureDesc>
              </FeatureCard>
              <FeatureCard>
                <FeatureTitle>
                  <span className="icon">⭐</span>
                  品质保证
                </FeatureTitle>
                <FeatureDesc>严选品牌供应商，正品保证，假一赔十</FeatureDesc>
              </FeatureCard>
              <FeatureCard>
                <FeatureTitle>
                  <span className="icon">🚚</span>
                  极速配送
                </FeatureTitle>
                <FeatureDesc>全国包邮，24小时发货，7天无理由退换</FeatureDesc>
              </FeatureCard>
            </FeatureGrid>
          </section>
        </ShopMain>

        <ShopFooter>
          <p>© 2025 精品商城 - 品质生活，从这里开始</p>
        </ShopFooter>
      </ShopLayout>
    </>
  )
}

export default ShopHome
