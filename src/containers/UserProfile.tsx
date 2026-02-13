import React, { useState, useEffect } from 'react'
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom'
import styled from 'styled-components'
import { Helmet } from 'react-helmet'
import { logout, isLoggedIn, getUserId, type User } from '../services/shop'
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
  ShopFooter
} from '../styled/shop'

const ProfileContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
`

const ProfileLayout = styled.div`
  display: grid;
  grid-template-columns: 240px 1fr;
  gap: 32px;
  min-height: calc(100vh - 200px);

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`

const Sidebar = styled.div`
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
`

const SidebarTitle = styled.h2`
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin-bottom: 20px;
`

const MenuList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`

const MenuItem = styled.li<{ $active?: boolean }>`
  margin-bottom: 4px;

  a {
    display: block;
    padding: 12px 16px;
    border-radius: 8px;
    color: ${props => props.$active ? '#667eea' : '#666'};
    text-decoration: none;
    transition: all 0.3s ease;
    background: ${props => props.$active ? '#f0f5ff' : 'transparent'};

    &:hover {
      background: ${props => props.$active ? '#e0eaff' : '#f5f5f5'};
      color: #667eea;
    }
  }
`

const Content = styled.div`
  background: white;
  border-radius: 12px;
  padding: 32px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
`

const Title = styled.h1`
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin-bottom: 24px;
`

const menuItems = [
  { path: '/profile', label: '个人信息', icon: '👤' },
  { path: '/profile/address', label: '收货地址', icon: '📍' },
  { path: '/profile/orders', label: '我的订单', icon: '📦' },
  { path: '/profile/security', label: '安全设置', icon: '🔒' },
]

const Profile: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    if (!isLoggedIn()) {
      navigate('/login')
      return
    }
  }, [navigate])

  const handleLogout = () => {
    if (confirm('确定要退出登录吗？')) {
      logout()
      navigate('/')
    }
  }

  return (
    <>
      <GlobalStyle />
      <Helmet>
        <title>个人中心 - 精品商城</title>
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
              <AuthLink onClick={handleLogout}>退出</AuthLink>
            </NavMenu>
          </HeaderContent>
        </ShopHeader>

        <ShopMain>
          <ProfileContainer>
            <Title>个人中心</Title>
            <ProfileLayout>
              <Sidebar>
                <SidebarTitle>👤 个人中心</SidebarTitle>
                <MenuList>
                  {menuItems.map((item) => (
                    <MenuItem
                      key={item.path}
                      $active={location.pathname === item.path || (item.path === '/profile' && location.pathname === '/profile')}
                    >
                      <Link to={item.path}>{item.icon} {item.label}</Link>
                    </MenuItem>
                  ))}
                </MenuList>
              </Sidebar>
              <Content>
                <Outlet />
              </Content>
            </ProfileLayout>
          </ProfileContainer>
        </ShopMain>

        <ShopFooter>
          <p>© 2025 精品商城 - 品质生活，从这里开始</p>
        </ShopFooter>
      </ShopLayout>
    </>
  )
}

export default Profile
