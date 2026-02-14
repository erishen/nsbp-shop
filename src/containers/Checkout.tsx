import React, { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'
import { Link, useNavigate } from 'react-router-dom'
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
  LoadingContainer,
  LoadingSpinner,
  EmptyContainer,
  EmptyIcon,
  EmptyText
} from '../styled/shop'
import {
  getCart,
  createOrder,
  isLoggedIn,
  clearCart,
  getUserId,
  type CartItem as CartItemType,
  type CreateOrderData
} from '../services/shop'

const CheckoutContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
`

const CheckoutTitle = styled.h1`
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin-bottom: 24px;
`

const CheckoutContent = styled.div`
  display: grid;
  grid-template-columns: 1fr 360px;
  gap: 24px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`

const MainSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`

const SectionCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
`

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
`

const SectionTitle = styled.h2`
  font-size: 18px;
  font-weight: 600;
  color: #333;
  display: flex;
  align-items: center;
  gap: 8px;
`

const AddressList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`

const AddressCard = styled.div<{ $selected?: boolean }>`
  border: 2px solid ${(props) => (props.$selected ? '#667eea' : '#f0f0f0')};
  border-radius: 8px;
  padding: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  background: ${(props) => (props.$selected ? '#f0f5ff' : 'white')};

  &:hover {
    border-color: ${(props) => (props.$selected ? '#667eea' : '#d9d9d9')};
  }
`

const AddressHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
`

const AddressName = styled.span`
  font-weight: 500;
  color: #333;
`

const AddressPhone = styled.span`
  color: #666;
  font-size: 14px;
`

const AddressDefault = styled.span`
  background: #667eea;
  color: white;
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 4px;
`

const AddressDetail = styled.div`
  color: #666;
  font-size: 14px;
  line-height: 1.5;
`

const AddAddressButton = styled.button`
  width: 100%;
  padding: 16px;
  border: 2px dashed #d9d9d9;
  border-radius: 8px;
  background: white;
  color: #667eea;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    border-color: #667eea;
    background: #f0f5ff;
  }
`

const CartList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`

const CartItem = styled.div`
  display: flex;
  gap: 16px;
  padding: 16px 0;
  border-bottom: 1px solid #f0f0f0;

  &:last-child {
    border-bottom: none;
  }
`

const ItemImage = styled.img`
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 8px;
`

const ItemInfo = styled.div`
  flex: 1;
`

const ItemName = styled.div`
  font-weight: 500;
  color: #333;
  margin-bottom: 4px;
`

const ItemPrice = styled.div`
  color: #ff4d4f;
  font-weight: 500;
`

const ItemQuantity = styled.div`
  color: #999;
  font-size: 14px;
`

const Sidebar = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`

const SummaryCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  position: sticky;
  top: 24px;
`

const SummaryTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 16px;
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
  align-items: center;
  padding-top: 16px;
  margin-top: 16px;
  border-top: 1px solid #f0f0f0;
`

const TotalLabel = styled.span`
  font-size: 16px;
  font-weight: 500;
  color: #333;
`

const TotalPrice = styled.span`
  font-size: 24px;
  font-weight: 600;
  color: #ff4d4f;
`

const SubmitButton = styled(Button)`
  width: 100%;
  margin-top: 16px;
`

const PaymentMethods = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`

const PaymentMethod = styled.label<{ $selected?: boolean }>`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  border: 2px solid ${(props) => (props.$selected ? '#667eea' : '#f0f0f0')};
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  background: ${(props) => (props.$selected ? '#f0f5ff' : 'white')};

  &:hover {
    border-color: ${(props) => (props.$selected ? '#667eea' : '#d9d9d9')};
  }

  input {
    margin: 0;
  }
`

const PaymentIcon = styled.span`
  font-size: 24px;
`

const PaymentInfo = styled.div`
  flex: 1;
`

const PaymentName = styled.div`
  font-weight: 500;
  color: #333;
`

const PaymentDesc = styled.div`
  font-size: 12px;
  color: #999;
`

const ErrorMessage = styled.div`
  color: #ff4d4f;
  font-size: 14px;
  padding: 12px;
  background: #fff2f0;
  border-radius: 6px;
  margin-bottom: 16px;
`

// 模拟地址数据
const mockAddresses = [
  {
    id: 1,
    name: '张三',
    phone: '13800138000',
    province: '北京市',
    city: '北京市',
    district: '朝阳区',
    detail: '建国路88号SOHO现代城A座1201',
    isDefault: true
  },
  {
    id: 2,
    name: '李四',
    phone: '13900139000',
    province: '上海市',
    city: '上海市',
    district: '浦东新区',
    detail: '陆家嘴环路1000号恒生银行大厦',
    isDefault: false
  }
]

const Checkout: React.FC = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [cartItems, setCartItems] = useState<CartItemType[]>([])
  const [cartCount, setCartCount] = useState(0)
  const [selectedAddress, setSelectedAddress] = useState(1)
  const [paymentMethod, setPaymentMethod] = useState('alipay')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const cartData = await getCart()
        setCartItems(cartData.items)
        const totalCount = cartData.items.reduce(
          (sum, item) => sum + item.quantity,
          0
        )
        setCartCount(totalCount)
      } catch (err) {
        console.error('Failed to load cart:', err)
        setError('加载购物车失败，请稍后重试')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const totalAmount = cartItems.reduce(
    (sum, item) => sum + (item.product?.price || 0) * item.quantity,
    0
  )
  const shippingFee = totalAmount >= 99 ? 0 : 10
  const finalAmount = totalAmount + shippingFee

  const generateOrderNo = () => {
    const now = new Date()
    const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '')
    const randomStr = Math.floor(Math.random() * 1000000)
      .toString()
      .padStart(6, '0')
    return `ORD${dateStr}${randomStr}`
  }

  const handleSubmit = async () => {
    if (cartItems.length === 0) {
      setError('购物车为空，无法提交订单')
      return
    }

    const userId = getUserId()
    if (!userId) {
      setError('请先登录')
      navigate('/login')
      return
    }

    const address = mockAddresses.find((addr) => addr.id === selectedAddress)
    if (!address) {
      setError('请选择收货地址')
      return
    }

    setSubmitting(true)
    setError('')

    try {
      const orderData: CreateOrderData = {
        user_id: userId,
        order_no: generateOrderNo(),
        total_amount: totalAmount,
        pay_amount: finalAmount,
        receiver_name: address.name,
        receiver_phone: address.phone,
        receiver_address: `${address.province} ${address.city} ${address.district} ${address.detail}`,
        remark: ''
      }

      const orderId = await createOrder(orderData)

      // 清空购物车
      await clearCart(cartItems.map((item) => item.id))

      // 跳转到订单详情页
      navigate(`/order/${orderId}`)
    } catch (err) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setError((err as any)?.message || '创建订单失败，请稍后重试')
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <>
        <GlobalStyle />
        <ShopLayout>
          <ShopHeader>
            <HeaderContent>
              <Logo href="/">🛍️ 精品商城</Logo>
              <NavMenu>
                <NavLink href="/">首页</NavLink>
                <NavLink href="/products">全部商品</NavLink>
                <NavLink href="/categories">分类</NavLink>
                <NavLink href="/deals">优惠</NavLink>
                <CartButton href="/cart">
                  🛒 购物车
                  {cartCount > 0 && <CartBadge>{cartCount}</CartBadge>}
                </CartButton>
                {isLoggedIn() ? (
                  <AuthLink href="/profile">个人中心</AuthLink>
                ) : (
                  <>
                    <AuthLink href="/login">登录</AuthLink>
                    <AuthLink href="/register">注册</AuthLink>
                  </>
                )}
              </NavMenu>
            </HeaderContent>
          </ShopHeader>
          <ShopMain>
            <LoadingContainer>
              <LoadingSpinner />
              <div>加载中...</div>
            </LoadingContainer>
          </ShopMain>
          <ShopFooter>
            <p>© 2025 精品商城 - 品质生活，从这里开始</p>
          </ShopFooter>
        </ShopLayout>
      </>
    )
  }

  if (cartItems.length === 0) {
    return (
      <>
        <GlobalStyle />
        <Helmet>
          <title>结算 - 精品商城</title>
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
                <CartButton href="/cart">🛒 购物车</CartButton>
                {isLoggedIn() ? (
                  <AuthLink href="/profile">个人中心</AuthLink>
                ) : (
                  <>
                    <AuthLink href="/login">登录</AuthLink>
                    <AuthLink href="/register">注册</AuthLink>
                  </>
                )}
              </NavMenu>
            </HeaderContent>
          </ShopHeader>
          <ShopMain>
            <EmptyContainer>
              <EmptyIcon>🛒</EmptyIcon>
              <EmptyText>购物车为空，无法结算</EmptyText>
              <Button $type="primary" as={Link} to="/products">
                去购物
              </Button>
            </EmptyContainer>
          </ShopMain>
          <ShopFooter>
            <p>© 2025 精品商城 - 品质生活，从这里开始</p>
          </ShopFooter>
        </ShopLayout>
      </>
    )
  }

  return (
    <>
      <GlobalStyle />
      <Helmet>
        <title>结算 - 精品商城</title>
        <meta name="description" content="订单结算" />
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
              <CartButton href="/cart">
                🛒 购物车
                {cartCount > 0 && <CartBadge>{cartCount}</CartBadge>}
              </CartButton>
              {isLoggedIn() ? (
                <AuthLink href="/profile">个人中心</AuthLink>
              ) : (
                <>
                  <AuthLink href="/login">登录</AuthLink>
                  <AuthLink href="/register">注册</AuthLink>
                </>
              )}
            </NavMenu>
          </HeaderContent>
        </ShopHeader>

        <ShopMain>
          <CheckoutContainer>
            <CheckoutTitle>订单结算</CheckoutTitle>

            {error && <ErrorMessage>{error}</ErrorMessage>}

            <CheckoutContent>
              <MainSection>
                {/* 收货地址 */}
                <SectionCard>
                  <SectionHeader>
                    <SectionTitle>📍 收货地址</SectionTitle>
                    <Link
                      to="/profile/address"
                      style={{ color: '#667eea', fontSize: '14px' }}
                    >
                      管理地址
                    </Link>
                  </SectionHeader>
                  <AddressList>
                    {mockAddresses.map((address) => (
                      <AddressCard
                        key={address.id}
                        $selected={selectedAddress === address.id}
                        onClick={() => setSelectedAddress(address.id)}
                      >
                        <AddressHeader>
                          <AddressName>{address.name}</AddressName>
                          <AddressPhone>{address.phone}</AddressPhone>
                          {address.isDefault && (
                            <AddressDefault>默认</AddressDefault>
                          )}
                        </AddressHeader>
                        <AddressDetail>
                          {address.province} {address.city} {address.district}{' '}
                          {address.detail}
                        </AddressDetail>
                      </AddressCard>
                    ))}
                    <AddAddressButton
                      onClick={() => navigate('/profile/address')}
                    >
                      + 添加新地址
                    </AddAddressButton>
                  </AddressList>
                </SectionCard>

                {/* 商品清单 */}
                <SectionCard>
                  <SectionTitle>📦 商品清单</SectionTitle>
                  <CartList>
                    {cartItems.map((item) => (
                      <CartItem key={item.id}>
                        <ItemImage
                          src={
                            item.product?.image_url ||
                            'https://via.placeholder.com/80'
                          }
                          alt={item.product?.name}
                        />
                        <ItemInfo>
                          <ItemName>{item.product?.name}</ItemName>
                          <ItemPrice>
                            ¥{(item.product?.price || 0).toFixed(2)}
                          </ItemPrice>
                        </ItemInfo>
                        <ItemQuantity>x{item.quantity}</ItemQuantity>
                      </CartItem>
                    ))}
                  </CartList>
                </SectionCard>

                {/* 支付方式 */}
                <SectionCard>
                  <SectionTitle>💳 支付方式</SectionTitle>
                  <PaymentMethods>
                    <PaymentMethod $selected={paymentMethod === 'alipay'}>
                      <input
                        type="radio"
                        name="payment"
                        value="alipay"
                        checked={paymentMethod === 'alipay'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                      />
                      <PaymentIcon>💙</PaymentIcon>
                      <PaymentInfo>
                        <PaymentName>支付宝</PaymentName>
                        <PaymentDesc>推荐使用，支持花呗</PaymentDesc>
                      </PaymentInfo>
                    </PaymentMethod>
                    <PaymentMethod $selected={paymentMethod === 'wechat'}>
                      <input
                        type="radio"
                        name="payment"
                        value="wechat"
                        checked={paymentMethod === 'wechat'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                      />
                      <PaymentIcon>💚</PaymentIcon>
                      <PaymentInfo>
                        <PaymentName>微信支付</PaymentName>
                        <PaymentDesc>微信用户便捷支付</PaymentDesc>
                      </PaymentInfo>
                    </PaymentMethod>
                  </PaymentMethods>
                </SectionCard>
              </MainSection>

              <Sidebar>
                <SummaryCard>
                  <SummaryTitle>订单 summary</SummaryTitle>
                  <SummaryRow>
                    <span>商品总额</span>
                    <span>¥{totalAmount.toFixed(2)}</span>
                  </SummaryRow>
                  <SummaryRow>
                    <span>运费</span>
                    <span>
                      {shippingFee === 0
                        ? '免运费'
                        : `¥${shippingFee.toFixed(2)}`}
                    </span>
                  </SummaryRow>
                  <SummaryRow>
                    <span>优惠</span>
                    <span>-¥0.00</span>
                  </SummaryRow>
                  <SummaryTotal>
                    <TotalLabel>应付总额</TotalLabel>
                    <TotalPrice>¥{finalAmount.toFixed(2)}</TotalPrice>
                  </SummaryTotal>
                  <SubmitButton
                    $type="primary"
                    $size="large"
                    onClick={handleSubmit}
                    disabled={submitting}
                  >
                    {submitting ? '提交中...' : '提交订单'}
                  </SubmitButton>
                </SummaryCard>
              </Sidebar>
            </CheckoutContent>
          </CheckoutContainer>
        </ShopMain>

        <ShopFooter>
          <p>© 2025 精品商城 - 品质生活，从这里开始</p>
        </ShopFooter>
      </ShopLayout>
    </>
  )
}

export default Checkout
