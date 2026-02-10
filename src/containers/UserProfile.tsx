import React, { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'
import { Link } from 'react-router-dom'
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
import { getToken, logout } from '../services/shop'

const ProfileContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
`

const ProfileHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;
  margin-bottom: 40px;
  padding-bottom: 24px;
  border-bottom: 1px solid #f0f0f0;
`

const Avatar = styled.div`
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  color: white;
  font-weight: bold;
`

const UserInfo = styled.div`
  flex: 1;
`

const UserName = styled.h1`
  font-size: 28px;
  margin-bottom: 8px;
  color: #333;
`

const UserMeta = styled.div`
  display: flex;
  gap: 24px;
  color: #666;
  font-size: 14px;
`

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`

const ProfileContent = styled.div`
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 24px;
`

const Sidebar = styled.div`
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
`

const SidebarMenu = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`

const SidebarItem = styled.li<{ $active?: boolean }>`
  margin-bottom: 12px;
`

const SidebarLink = styled(Link)<{ $active?: boolean }>`
  display: block;
  padding: 12px 16px;
  border-radius: 8px;
  color: ${props => props.$active ? '#667eea' : '#333'};
  background: ${props => props.$active ? '#f0f5ff' : 'transparent'};
  text-decoration: none;
  font-weight: ${props => props.$active ? '500' : 'normal'};
  transition: all 0.3s ease;

  &:hover {
    background: #f0f5ff;
    color: #667eea;
  }
`

const MainContent = styled.div`
  background: white;
  border-radius: 12px;
  padding: 32px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
`

const SectionTitle = styled.h2`
  font-size: 20px;
  margin-bottom: 24px;
  color: #333;
  padding-bottom: 12px;
  border-bottom: 1px solid #f0f0f0;
`

const OrderList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`

const OrderCard = styled.div`
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  padding: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const OrderInfo = styled.div`
  flex: 1;
`

const OrderId = styled.div`
  font-weight: 500;
  margin-bottom: 4px;
  color: #333;
`

const OrderDate = styled.div`
  font-size: 12px;
  color: #999;
  margin-bottom: 8px;
`

const OrderStatus = styled.span<{ $status: string }>`
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  background: ${props => props.$status === 'completed' ? '#f6ffed' : props.$status === 'processing' ? '#fff7e6' : '#fff2f0'};
  color: ${props => props.$status === 'completed' ? '#52c41a' : props.$status === 'processing' ? '#fa8c16' : '#ff4d4f'};
`

const OrderAmount = styled.div`
  font-weight: 500;
  color: #ff4d4f;
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

const ActionButton = styled(Button)`
  margin-top: 16px;
`

const UserProfile: React.FC = () => {
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [orders, setOrders] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState('orders')

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      // 模拟延迟
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // 从 localStorage 获取用户信息（简化版）
      const token = getToken()
      if (token) {
        // 解析 token 获取用户 ID（简化版）
        // 实际应该调用 API 获取用户信息
        const userId = localStorage.getItem('userId') || '1'
        setUser({
          id: userId,
          username: 'demo_user',
          nickname: 'Demo User',
          email: 'demo@example.com',
          phone: '13800138000',
          joinDate: '2025-01-01'
        })
        
        // 模拟订单数据
        setOrders([
          { id: '202501011234', date: '2025-01-01', status: 'completed', amount: 299.00 },
          { id: '202501021235', date: '2025-01-02', status: 'processing', amount: 499.00 },
          { id: '202501031236', date: '2025-01-03', status: 'pending', amount: 199.00 },
        ])
      }
      setLoading(false)
    }

    fetchData()
  }, [])

  const handleLogout = () => {
    logout()
    window.location.href = '/shop/login'
  }

  if (loading) {
    return (
      <>
        <GlobalStyle />
        <ShopLayout>
          <ShopHeader>
            <HeaderContent>
              <Logo href="/shop">🛍️ 精品商城</Logo>
              <NavMenu>
                <NavLink href="/shop">首页</NavLink>
                <NavLink href="/shop/products">全部商品</NavLink>
                <NavLink href="/shop/categories">分类</NavLink>
                <NavLink href="/shop/deals">优惠</NavLink>
                <CartButton href="/shop/cart">
                  🛒 购物车
                </CartButton>
                <AuthLink href="/shop/login">登录</AuthLink>
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

  if (!user) {
    return (
      <>
        <GlobalStyle />
        <Helmet>
          <title>请先登录 - 精品商城</title>
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
                <CartButton href="/shop/cart">
                  🛒 购物车
                </CartButton>
                <AuthLink href="/shop/login">登录</AuthLink>
              </NavMenu>
            </HeaderContent>
          </ShopHeader>
          <ShopMain>
            <EmptyState>
              <EmptyIcon>🔒</EmptyIcon>
              <EmptyText>请先登录以查看个人中心</EmptyText>
              <ActionButton $type="primary" as={Link} to="/shop/login">
                前往登录
              </ActionButton>
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
        <title>个人中心 - 精品商城</title>
        <meta name="description" content="用户个人中心" />
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
              <CartButton href="/shop/cart">
                🛒 购物车
              </CartButton>
              <AuthLink href="/shop/profile" $active>个人中心</AuthLink>
            </NavMenu>
          </HeaderContent>
        </ShopHeader>

        <ShopMain>
          <ProfileContainer>
            <ProfileHeader>
              <Avatar>{user.nickname.charAt(0).toUpperCase()}</Avatar>
              <UserInfo>
                <UserName>{user.nickname}</UserName>
                <UserMeta>
                  <MetaItem>👤 {user.username}</MetaItem>
                  <MetaItem>📧 {user.email}</MetaItem>
                  <MetaItem>📱 {user.phone}</MetaItem>
                  <MetaItem>📅 加入于 {user.joinDate}</MetaItem>
                </UserMeta>
              </UserInfo>
              <Button $type="default" onClick={handleLogout}>
                退出登录
              </Button>
            </ProfileHeader>

            <ProfileContent>
              <Sidebar>
                <SidebarMenu>
                  <SidebarItem>
                    <SidebarLink to="/shop/profile" $active={activeTab === 'orders'} onClick={() => setActiveTab('orders')}>
                      我的订单
                    </SidebarLink>
                  </SidebarItem>
                  <SidebarItem>
                    <SidebarLink to="/shop/profile/info" $active={activeTab === 'info'} onClick={() => setActiveTab('info')}>
                      个人信息
                    </SidebarLink>
                  </SidebarItem>
                  <SidebarItem>
                    <SidebarLink to="/shop/profile/address" $active={activeTab === 'address'} onClick={() => setActiveTab('address')}>
                      收货地址
                    </SidebarLink>
                  </SidebarItem>
                  <SidebarItem>
                    <SidebarLink to="/shop/profile/security" $active={activeTab === 'security'} onClick={() => setActiveTab('security')}>
                      安全设置
                    </SidebarLink>
                  </SidebarItem>
                </SidebarMenu>
              </Sidebar>

              <MainContent>
                {activeTab === 'orders' && (
                  <>
                    <SectionTitle>我的订单</SectionTitle>
                    {orders.length > 0 ? (
                      <OrderList>
                        {orders.map(order => (
                          <OrderCard key={order.id}>
                            <OrderInfo>
                              <OrderId>订单号: {order.id}</OrderId>
                              <OrderDate>下单时间: {order.date}</OrderDate>
                              <OrderStatus $status={order.status}>
                                {order.status === 'completed' ? '已完成' : order.status === 'processing' ? '处理中' : '待付款'}
                              </OrderStatus>
                            </OrderInfo>
                            <OrderAmount>¥{order.amount.toFixed(2)}</OrderAmount>
                          </OrderCard>
                        ))}
                      </OrderList>
                    ) : (
                      <EmptyState>
                        <EmptyIcon>📦</EmptyIcon>
                        <EmptyText>暂无订单记录</EmptyText>
                        <ActionButton $type="primary" as={Link} to="/shop/products">
                          去购物
                        </ActionButton>
                      </EmptyState>
                    )}
                  </>
                )}

                {activeTab === 'info' && (
                  <>
                    <SectionTitle>个人信息</SectionTitle>
                    <EmptyState>
                      <EmptyIcon>👤</EmptyIcon>
                      <EmptyText>个人信息页面开发中...</EmptyText>
                    </EmptyState>
                  </>
                )}

                {activeTab === 'address' && (
                  <>
                    <SectionTitle>收货地址</SectionTitle>
                    <EmptyState>
                      <EmptyIcon>🏠</EmptyIcon>
                      <EmptyText>收货地址页面开发中...</EmptyText>
                    </EmptyState>
                  </>
                )}

                {activeTab === 'security' && (
                  <>
                    <SectionTitle>安全设置</SectionTitle>
                    <EmptyState>
                      <EmptyIcon>🔒</EmptyIcon>
                      <EmptyText>安全设置页面开发中...</EmptyText>
                    </EmptyState>
                  </>
                )}
              </MainContent>
            </ProfileContent>
          </ProfileContainer>
        </ShopMain>

        <ShopFooter>
          <p>© 2025 精品商城 - 品质生活，从这里开始</p>
        </ShopFooter>
      </ShopLayout>
    </>
  )
}

export default UserProfile