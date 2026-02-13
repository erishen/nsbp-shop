import React, { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'
import { Link, useParams, useNavigate } from 'react-router-dom'
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
  LoadingSpinner
} from '../styled/shop'
import { getOrders, getCart, isLoggedIn, type Order } from '../services/shop'

const OrderDetailContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
`

const BackLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #667eea;
  text-decoration: none;
  margin-bottom: 16px;
  font-size: 14px;

  &:hover {
    text-decoration: underline;
  }
`

const OrderHeader = styled.div`
  background: white;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
`

const OrderTitle = styled.h1`
  font-size: 20px;
  font-weight: 600;
  color: #333;
  margin-bottom: 16px;
`

const OrderMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  font-size: 14px;
  color: #666;
`

const MetaItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`

const MetaLabel = styled.span`
  color: #999;
  font-size: 12px;
`

const MetaValue = styled.span`
  color: #333;
  font-weight: 500;
`

const OrderStatus = styled.div<{ $status: string }>`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
  background: ${props => {
    switch (props.$status) {
      case 'completed': return '#f6ffed'
      case 'processing': return '#fff7e6'
      case 'shipped': return '#e6f7ff'
      case 'pending': return '#fff2f0'
      default: return '#f5f5f5'
    }
  }};
  color: ${props => {
    switch (props.$status) {
      case 'completed': return '#52c41a'
      case 'processing': return '#fa8c16'
      case 'shipped': return '#1890ff'
      case 'pending': return '#ff4d4f'
      default: return '#666'
    }
  }};
`

const SectionCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
`

const SectionTitle = styled.h2`
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
`

const Timeline = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
  position: relative;
  padding-left: 24px;

  &::before {
    content: '';
    position: absolute;
    left: 7px;
    top: 8px;
    bottom: 8px;
    width: 2px;
    background: #f0f0f0;
  }
`

const TimelineItem = styled.div<{ $active?: boolean }>`
  display: flex;
  gap: 16px;
  padding: 16px 0;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    left: -20px;
    top: 20px;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: ${props => props.$active ? '#52c41a' : '#f0f0f0'};
    border: 2px solid white;
    box-shadow: 0 0 0 2px ${props => props.$active ? '#52c41a' : '#f0f0f0'};
    z-index: 1;
  }
`

const TimelineContent = styled.div`
  flex: 1;
`

const TimelineTitle = styled.div`
  font-weight: 500;
  color: #333;
  margin-bottom: 4px;
`

const TimelineTime = styled.div`
  font-size: 12px;
  color: #999;
`

const AddressCard = styled.div`
  background: #f8f9fa;
  border-radius: 8px;
  padding: 16px;
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

const AddressDetail = styled.div`
  color: #666;
  font-size: 14px;
  line-height: 1.5;
`

const ProductList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`

const ProductItem = styled.div`
  display: flex;
  gap: 16px;
  padding: 16px 0;
  border-bottom: 1px solid #f0f0f0;

  &:last-child {
    border-bottom: none;
  }
`

const ProductImage = styled.img`
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 8px;
`

const ProductInfo = styled.div`
  flex: 1;
`

const ProductName = styled.div`
  font-weight: 500;
  color: #333;
  margin-bottom: 4px;
`

const ProductPrice = styled.div`
  color: #ff4d4f;
  font-weight: 500;
`

const ProductQuantity = styled.div`
  color: #999;
  font-size: 14px;
  margin-top: 4px;
`

const SummaryTable = styled.div`
  border-top: 1px solid #f0f0f0;
  padding-top: 16px;
  margin-top: 16px;
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

const ActionBar = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 24px;
`

const EmptyState = styled.div`
  text-align: center;
  padding: 80px 0;
  color: #999;
`

const EmptyIcon = styled.div`
  font-size: 64px;
  margin-bottom: 16px;
`

const EmptyText = styled.div`
  font-size: 16px;
`

// 模拟订单详情数据
const generateMockOrderDetail = (orderId: string): Order & { items: any[]; timeline: any[] } => ({
  id: parseInt(orderId),
  order_no: `ORD${Date.now()}`,
  user_id: 1,
  total_amount: 599.00,
  status: 'processing',
  created_at: new Date().toISOString(),
  items: [
    {
      id: 1,
      product_id: 1,
      product_name: '精品商品 A',
      product_image: '/placeholder.png',
      price: 299.00,
      quantity: 1
    },
    {
      id: 2,
      product_id: 2,
      product_name: '精品商品 B',
      product_image: '/placeholder.png',
      price: 150.00,
      quantity: 2
    }
  ],
  timeline: [
    {
      title: '订单提交',
      time: new Date(Date.now() - 86400000).toLocaleString(),
      active: true
    },
    {
      title: '支付成功',
      time: new Date(Date.now() - 86000000).toLocaleString(),
      active: true
    },
    {
      title: '商品出库',
      time: new Date(Date.now() - 43200000).toLocaleString(),
      active: true
    },
    {
      title: '等待收货',
      time: '预计明天送达',
      active: false
    }
  ]
})

const getStatusText = (status: string): string => {
  const statusMap: Record<string, string> = {
    pending: '待付款',
    processing: '处理中',
    shipped: '已发货',
    completed: '已完成',
    cancelled: '已取消'
  }
  return statusMap[status] || status
}

const OrderDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [order, setOrder] = useState<(Order & { items: any[]; timeline: any[] }) | null>(null)
  const [cartCount, setCartCount] = useState(0)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        // 模拟获取订单详情
        await new Promise(resolve => setTimeout(resolve, 500))
        const mockOrder = generateMockOrderDetail(id || '1')
        setOrder(mockOrder)

        // 获取购物车数量
        const cartData = await getCart()
        const totalCount = cartData.items.reduce((sum, item) => sum + item.quantity, 0)
        setCartCount(totalCount)
      } catch (err) {
        console.error('Failed to load order:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [id])

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

  if (!order) {
    return (
      <>
        <GlobalStyle />
        <Helmet>
          <title>订单不存在 - 精品商城</title>
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
            <EmptyState>
              <EmptyIcon>📦</EmptyIcon>
              <EmptyText>订单不存在或已删除</EmptyText>
              <Button $type="primary" as={Link} to="/profile">
                返回个人中心
              </Button>
            </EmptyState>
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
        <title>订单详情 - 精品商城</title>
        <meta name="description" content={`订单号: ${order.order_no}`} />
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
          <OrderDetailContainer>
            <BackLink to="/profile">← 返回个人中心</BackLink>

            <OrderHeader>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <OrderTitle>订单详情</OrderTitle>
                <OrderStatus $status={order.status}>
                  {getStatusText(order.status)}
                </OrderStatus>
              </div>
              <OrderMeta>
                <MetaItem>
                  <MetaLabel>订单编号</MetaLabel>
                  <MetaValue>{order.order_no}</MetaValue>
                </MetaItem>
                <MetaItem>
                  <MetaLabel>下单时间</MetaLabel>
                  <MetaValue>{new Date(order.created_at).toLocaleString()}</MetaValue>
                </MetaItem>
                <MetaItem>
                  <MetaLabel>订单金额</MetaLabel>
                  <MetaValue style={{ color: '#ff4d4f' }}>¥{order.total_amount.toFixed(2)}</MetaValue>
                </MetaItem>
              </OrderMeta>
            </OrderHeader>

            <SectionCard>
              <SectionTitle>📋 订单进度</SectionTitle>
              <Timeline>
                {order.timeline.map((item, index) => (
                  <TimelineItem key={index} $active={item.active}>
                    <TimelineContent>
                      <TimelineTitle>{item.title}</TimelineTitle>
                      <TimelineTime>{item.time}</TimelineTime>
                    </TimelineContent>
                  </TimelineItem>
                ))}
              </Timeline>
            </SectionCard>

            <SectionCard>
              <SectionTitle>📍 收货信息</SectionTitle>
              <AddressCard>
                <AddressHeader>
                  <AddressName>张三</AddressName>
                  <AddressPhone>13800138000</AddressPhone>
                </AddressHeader>
                <AddressDetail>
                  北京市 北京市 朝阳区 建国路88号SOHO现代城A座1201
                </AddressDetail>
              </AddressCard>
            </SectionCard>

            <SectionCard>
              <SectionTitle>🛍️ 商品信息</SectionTitle>
              <ProductList>
                {order.items.map((item) => (
                  <ProductItem key={item.id}>
                    <ProductImage src={item.product_image} alt={item.product_name} />
                    <ProductInfo>
                      <ProductName>{item.product_name}</ProductName>
                      <ProductPrice>¥{item.price.toFixed(2)}</ProductPrice>
                      <ProductQuantity>数量: {item.quantity}</ProductQuantity>
                    </ProductInfo>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontWeight: 500, color: '#333' }}>
                        ¥{(item.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  </ProductItem>
                ))}
              </ProductList>
              <SummaryTable>
                <SummaryRow>
                  <span>商品总额</span>
                  <span>¥{order.total_amount.toFixed(2)}</span>
                </SummaryRow>
                <SummaryRow>
                  <span>运费</span>
                  <span>¥0.00</span>
                </SummaryRow>
                <SummaryRow>
                  <span>优惠</span>
                  <span>-¥0.00</span>
                </SummaryRow>
                <SummaryTotal>
                  <TotalLabel>实付金额</TotalLabel>
                  <TotalPrice>¥{order.total_amount.toFixed(2)}</TotalPrice>
                </SummaryTotal>
              </SummaryTable>
            </SectionCard>

            <ActionBar>
              {order.status === 'pending' && (
                <Button $type="primary">立即支付</Button>
              )}
              {order.status === 'shipped' && (
                <Button $type="primary">确认收货</Button>
              )}
              <Button $type="default" as={Link} to="/products">再次购买</Button>
              <Button $type="default">申请售后</Button>
            </ActionBar>
          </OrderDetailContainer>
        </ShopMain>

        <ShopFooter>
          <p>© 2025 精品商城 - 品质生活，从这里开始</p>
        </ShopFooter>
      </ShopLayout>
    </>
  )
}

export default OrderDetail
