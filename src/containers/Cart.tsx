import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
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
  Button,
  EmptyContainer,
  EmptyIcon,
  EmptyText
} from '../styled/shop'
import { getCart, getProductById, updateCartItem, removeFromCart, isLoggedIn, type CartItem as CartItemType } from '../services/shop'

const CartContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: 24px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`

const CartList = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
`

const CartHeader = styled.div`
  display: grid;
  grid-template-columns: 80px 1fr 120px 120px 40px;
  gap: 16px;
  padding: 16px 24px;
  border-bottom: 1px solid #f0f0f0;
  font-weight: 500;
  color: #666;
  font-size: 14px;
  
  @media (max-width: 768px) {
    display: none;
  }
`

const CartItem = styled.div`
  display: grid;
  grid-template-columns: 80px 1fr 120px 120px 40px;
  gap: 16px;
  padding: 16px 24px;
  border-bottom: 1px solid #f0f0f0;
  align-items: center;
  
  @media (max-width: 768px) {
    grid-template-columns: 80px 1fr;
    gap: 12px;
  }
`

const ItemImage = styled.img`
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 8px;
`

const ItemInfo = styled.div`
  min-width: 0;
`

const ItemName = styled(Link)`
  font-size: 16px;
  font-weight: 500;
  color: #333;
  text-decoration: none;
  display: block;
  margin-bottom: 4px;
  
  &:hover {
    color: #667eea;
  }
`

const ItemDesc = styled.div`
  font-size: 12px;
  color: #999;
`

const ItemPrice = styled.div`
  font-size: 16px;
  color: #ff4d4f;
  font-weight: 500;
  
  @media (max-width: 768px) {
    margin-top: 8px;
  }
`

const QuantitySelector = styled.div`
  display: flex;
  align-items: center;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  overflow: hidden;
  width: fit-content;
`

const QuantityButton = styled.button`
  width: 32px;
  height: 32px;
  border: none;
  background: #f5f5f5;
  cursor: pointer;
  font-size: 16px;
  
  &:hover {
    background: #e8e8e8;
  }
`

const QuantityInput = styled.input`
  width: 50px;
  height: 32px;
  border: none;
  text-align: center;
  font-size: 14px;
`

const DeleteButton = styled.button`
  background: none;
  border: none;
  color: #999;
  cursor: pointer;
  font-size: 18px;
  
  &:hover {
    color: #ff4d4f;
  }
`

const SummaryCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  height: fit-content;
`

const SummaryTitle = styled.h3`
  font-size: 18px;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid #f0f0f0;
`

const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
  font-size: 14px;
  color: #666;
`

const SummaryTotal = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #f0f0f0;
  font-size: 18px;
  font-weight: bold;
  
  .price {
    color: #ff4d4f;
  }
`

const CheckoutButton = styled(Button)`
  width: 100%;
  margin-top: 16px;
`

interface CartItemWithProduct extends CartItemType {
  product?: {
    id: number
    name: string
    description: string
    price: number
    image_url: string
  }
}

const Cart: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItemWithProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCart = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // 获取购物车列表
        const cartData = await getCart()
        
        // 获取每个商品的详细信息
        const itemsWithProducts = await Promise.all(
          cartData.items.map(async (item) => {
            try {
              const product = await getProductById(item.product_id)
              return { ...item, product }
            } catch (err) {
              console.error(`Failed to load product ${item.product_id}:`, err)
              return { ...item, product: undefined }
            }
          })
        )
        
        setCartItems(itemsWithProducts)
      } catch (err) {
        console.error('Failed to load cart:', err)
        setError('加载购物车失败，请稍后重试')
        setCartItems([])
      } finally {
        setLoading(false)
      }
    }

    fetchCart()
  }, [])

  const updateQuantity = async (id: number, quantity: number) => {
    if (quantity < 1) return
    
    try {
      await updateCartItem(id, quantity)
      setCartItems(items => items.map(item => 
        item.id === id ? { ...item, quantity } : item
      ))
    } catch (err) {
      console.error('Failed to update cart:', err)
      alert('更新数量失败，请稍后重试')
    }
  }

  const removeItem = async (id: number) => {
    try {
      await removeFromCart(id)
      setCartItems(items => items.filter(item => item.id !== id))
    } catch (err) {
      console.error('Failed to remove from cart:', err)
      alert('删除商品失败，请稍后重试')
    }
  }

  const totalPrice = cartItems.reduce((sum, item) => sum + (item.product?.price || 0) * item.quantity, 0)
  const totalCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)

  if (loading) {
    return (
      <>
        <GlobalStyle />
        <ShopLayout>
          <ShopHeader>
            <HeaderContent>
              <Logo href="/shop">🛍️ 精品商城</Logo>
            </HeaderContent>
          </ShopHeader>
          <ShopMain>
            <div style={{ textAlign: 'center', padding: '80px' }}>
              <EmptyIcon>⏳</EmptyIcon>
              <EmptyText>加载购物车...</EmptyText>
            </div>
          </ShopMain>
        </ShopLayout>
      </>
    )
  }

  return (
    <>
      <GlobalStyle />
      <Helmet>
        <title>购物车 - 精品商城</title>
        <meta name="description" content="查看购物车商品" />
      </Helmet>
      
      <ShopLayout>
        <ShopHeader>
          <HeaderContent>
            <Logo href="/shop">🛍️ 精品商城</Logo>
            <NavMenu>
              <NavLink href="/shop">首页</NavLink>
              <NavLink href="/shop/products">全部商品</NavLink>
              <NavLink href="/shop/categories">分类</NavLink>
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
                {totalCount > 0 && <CartBadge>{totalCount}</CartBadge>}
              </CartButton>
            </NavMenu>
          </HeaderContent>
        </ShopHeader>

        <ShopMain>
          <h1 style={{ marginBottom: '24px', fontSize: '24px' }}>🛒 购物车 ({totalCount})</h1>
          
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
          
          {cartItems.length > 0 ? (
            <CartContainer>
              <CartList>
                <CartHeader>
                  <div>商品</div>
                  <div></div>
                  <div>单价</div>
                  <div>数量</div>
                  <div></div>
                </CartHeader>
                {cartItems.map(item => (
                  <CartItem key={item.id}>
                    <ItemImage src={item.product?.image_url || 'https://via.placeholder.com/80'} alt={item.product?.name} />
                    <ItemInfo>
                      <ItemName to={`/shop/product/${item.product_id}`}>
                        {item.product?.name || '商品已下架'}
                      </ItemName>
                      <ItemDesc>{item.product?.description?.substring(0, 30)}...</ItemDesc>
                      <ItemPrice style={{ display: 'none' }} className="mobile-price">
                        ¥{item.product?.price || 0}
                      </ItemPrice>
                    </ItemInfo>
                    <ItemPrice className="desktop-price">¥{item.product?.price || 0}</ItemPrice>
                    <QuantitySelector>
                      <QuantityButton onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</QuantityButton>
                      <QuantityInput value={item.quantity} readOnly />
                      <QuantityButton onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</QuantityButton>
                    </QuantitySelector>
                    <DeleteButton onClick={() => removeItem(item.id)}>🗑️</DeleteButton>
                  </CartItem>
                ))}
              </CartList>

              <SummaryCard>
                <SummaryTitle>订单摘要</SummaryTitle>
                <SummaryRow>
                  <span>商品总数</span>
                  <span>{totalCount} 件</span>
                </SummaryRow>
                <SummaryRow>
                  <span>商品总额</span>
                  <span>¥{totalPrice}</span>
                </SummaryRow>
                <SummaryRow>
                  <span>运费</span>
                  <span>免运费</span>
                </SummaryRow>
                <SummaryTotal>
                  <span>合计</span>
                  <span className="price">¥{totalPrice}</span>
                </SummaryTotal>
                <CheckoutButton $type="primary" $size="large">
                  去结算
                </CheckoutButton>
                <Link to="/shop/products">
                  <CheckoutButton $size="medium" style={{ marginTop: '8px' }}>
                    继续购物
                  </CheckoutButton>
                </Link>
              </SummaryCard>
            </CartContainer>
          ) : (
            <EmptyContainer>
              <EmptyIcon>🛒</EmptyIcon>
              <EmptyText>购物车是空的</EmptyText>
              <Link to="/shop/products">
                <Button $type="primary" style={{ marginTop: '16px' }}>
                  去逛逛
                </Button>
              </Link>
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

export default Cart
