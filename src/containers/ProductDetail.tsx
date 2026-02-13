// 强制 webpack 重新编译 - 2025
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
  LoadingContainer,
  LoadingSpinner,
  Button
} from '../styled/shop'
import { getProductById, getCart, addToCart, isLoggedIn, type Product } from '../services/shop'

const ProductContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  margin-bottom: 40px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`

const ImageSection = styled.div`
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
`

const MainImage = styled.img`
  width: 100%;
  height: 400px;
  object-fit: cover;
`

const ThumbnailList = styled.div`
  display: flex;
  gap: 8px;
  padding: 16px;
`

const Thumbnail = styled.img<{ $active?: boolean }>`
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 6px;
  cursor: pointer;
  border: 2px solid ${props => props.$active ? '#667eea' : 'transparent'};
  
  &:hover {
    border-color: #667eea;
  }
`

const InfoSection = styled.div`
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
`

const ProductTitle = styled.h1`
  font-size: 24px;
  margin-bottom: 16px;
  color: #333;
`

const ProductDesc = styled.p`
  font-size: 14px;
  color: #666;
  margin-bottom: 24px;
  line-height: 1.6;
`

const PriceSection = styled.div`
  background: #f5f5f5;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 24px;
`

const CurrentPrice = styled.div`
  font-size: 32px;
  font-weight: bold;
  color: #ff4d4f;
`

const OriginalPrice = styled.div`
  font-size: 16px;
  color: #999;
  text-decoration: line-through;
  margin-top: 4px;
`

const DiscountBadge = styled.span`
  background: #ff4d4f;
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  margin-left: 8px;
`

const MetaList = styled.div`
  margin-bottom: 24px;
`

const MetaItem = styled.div`
  display: flex;
  margin-bottom: 12px;
  font-size: 14px;
`

const MetaLabel = styled.span`
  color: #999;
  width: 80px;
`

const MetaValue = styled.span`
  color: #333;
`

const ActionSection = styled.div`
  display: flex;
  gap: 12px;
`

const QuantitySelector = styled.div`
  display: flex;
  align-items: center;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  overflow: hidden;
`

const QuantityButton = styled.button`
  width: 40px;
  height: 40px;
  border: none;
  background: #f5f5f5;
  cursor: pointer;
  font-size: 18px;
  
  &:hover {
    background: #e8e8e8;
  }
`

const QuantityInput = styled.input`
  width: 60px;
  height: 40px;
  border: none;
  text-align: center;
  font-size: 16px;
`

const DetailSection = styled.div`
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
`

const DetailTitle = styled.h2`
  font-size: 18px;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid #f0f0f0;
`

const DetailContent = styled.div`
  font-size: 14px;
  color: #666;
  line-height: 1.8;
  
  img {
    max-width: 100%;
    border-radius: 8px;
    margin: 16px 0;
  }
`

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const [loading, setLoading] = useState(true)
  const [product, setProduct] = useState<Product | null>(null)
  const [cartCount, setCartCount] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [addingToCart, setAddingToCart] = useState(false)

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return
      
      setLoading(true)
      setError(null)
      
      try {
        const data = await getProductById(parseInt(id))
        setProduct(data)
      } catch (err) {
        console.error('Failed to load product:', err)
        setError('加载商品失败，请稍后重试')
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [id])

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

  const handleAddToCart = async () => {
    if (!product) return
    
    setAddingToCart(true)
    try {
      await addToCart(product.id, quantity)
      setCartCount(prev => prev + quantity)
      alert(`已添加 ${quantity} 件商品到购物车`)
    } catch (err) {
      console.error('Failed to add to cart:', err)
      alert('添加到购物车失败，请稍后重试')
    } finally {
      setAddingToCart(false)
    }
  }

  if (loading) {
    return (
      <>
        <GlobalStyle />
        <LoadingContainer>
          <LoadingSpinner />
          <div>加载商品详情...</div>
        </LoadingContainer>
      </>
    )
  }

  if (!product) {
    return (
      <>
        <GlobalStyle />
        <ShopLayout>
          <ShopHeader>
            <HeaderContent>
              <Logo href="/">🛍️ 精品商城</Logo>
            </HeaderContent>
          </ShopHeader>
          <ShopMain>
            <div style={{ textAlign: 'center', padding: '80px' }}>
              <h2>{error || '商品不存在'}</h2>
              <Link to="/products">
                <Button $type="primary" style={{ marginTop: '16px' }}>返回商品列表</Button>
              </Link>
            </div>
          </ShopMain>
        </ShopLayout>
      </>
    )
  }

  const images = typeof product.images === 'string'
    ? JSON.parse(product.images)
    : (product.images?.length > 0 ? product.images : [product.image_url])

  return (
    <>
      <GlobalStyle />
      <Helmet>
        <title>{product.name} - 精品商城</title>
        <meta name="description" content={product.description} />
      </Helmet>
      
      <ShopLayout>
        <ShopHeader>
          <HeaderContent>
            <Logo href="/">🛍️ 精品商城</Logo>
            <NavMenu>
              <NavLink href="/">首页</NavLink>
              <NavLink href="/products">全部商品</NavLink>
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

          <ProductContainer>
            <ImageSection>
              <MainImage src={images[selectedImage]} alt={product.name} />
              {images.length > 1 && (
                <ThumbnailList>
                  {images.map((img: string, index: number) => (
                    <Thumbnail
                      key={index}
                      src={img}
                      $active={selectedImage === index}
                      onClick={() => setSelectedImage(index)}
                    />
                  ))}
                </ThumbnailList>
              )}
            </ImageSection>

            <InfoSection>
              <ProductTitle>{product.name}</ProductTitle>
              <ProductDesc>{product.description}</ProductDesc>
              
              <PriceSection>
                <CurrentPrice>
                  ¥{product.price}
                  {product.original_price > product.price && (
                    <DiscountBadge>
                      {Math.round(((product.original_price - product.price) / product.original_price) * 100)}% OFF
                    </DiscountBadge>
                  )}
                </CurrentPrice>
                {product.original_price > product.price && (
                  <OriginalPrice>原价：¥{product.original_price}</OriginalPrice>
                )}
              </PriceSection>

              <MetaList>
                <MetaItem>
                  <MetaLabel>库存</MetaLabel>
                  <MetaValue>{product.stock} 件</MetaValue>
                </MetaItem>
                <MetaItem>
                  <MetaLabel>销量</MetaLabel>
                  <MetaValue>{product.sales} 件</MetaValue>
                </MetaItem>
                <MetaItem>
                  <MetaLabel>状态</MetaLabel>
                  <MetaValue>{product.status === 'active' ? '在售' : '下架'}</MetaValue>
                </MetaItem>
              </MetaList>

              <ActionSection>
                <QuantitySelector>
                  <QuantityButton onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</QuantityButton>
                  <QuantityInput value={quantity} readOnly />
                  <QuantityButton onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}>+</QuantityButton>
                </QuantitySelector>
                <Button 
                  $type="primary" 
                  $size="large" 
                  onClick={handleAddToCart}
                  disabled={addingToCart || product.stock === 0}
                >
                  {addingToCart ? '添加中...' : product.stock === 0 ? '暂时缺货' : '🛒 加入购物车'}
                </Button>
              </ActionSection>
            </InfoSection>
          </ProductContainer>

          <DetailSection>
            <DetailTitle>商品详情</DetailTitle>
            <DetailContent>
              <p>{product.description}</p>
              <p>这是一款优质的商品，具有以下特点：</p>
              <ul>
                <li>高品质材料制作，经久耐用</li>
                <li>精致工艺，细节考究</li>
                <li>时尚设计，引领潮流</li>
                <li>售后无忧，7天无理由退换</li>
              </ul>
              <img src={product.image_url} alt="商品详情" />
              <p>更多商品信息，请咨询客服...</p>
            </DetailContent>
          </DetailSection>
        </ShopMain>

        <ShopFooter>
          <p>© 2025 精品商城 - 品质生活，从这里开始</p>
        </ShopFooter>
      </ShopLayout>
    </>
  )
}

export default ProductDetail
