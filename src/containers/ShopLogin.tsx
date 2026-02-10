import React, { useState } from 'react'
import { Helmet } from 'react-helmet'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { login, isLoggedIn } from '../services/shop'
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
  Button
} from '../styled/shop'

const AuthContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  padding: 40px 0;
`

const AuthCard = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.1);
  padding: 40px;
  width: 100%;
  max-width: 400px;
`

const AuthTitle = styled.h1`
  font-size: 28px;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
  text-align: center;
`

const AuthSubtitle = styled.p`
  color: #666;
  text-align: center;
  margin-bottom: 32px;
`

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

const Label = styled.label`
  font-size: 14px;
  color: #666;
  font-weight: 500;
`

const Input = styled.input`
  padding: 12px 16px;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  font-size: 14px;
  transition: border-color 0.3s ease;

  &:focus {
    outline: none;
    border-color: #667eea;
  }
`

const ErrorMessage = styled.div`
  color: #ff4d4f;
  font-size: 14px;
  padding: 12px;
  background: #fff2f0;
  border-radius: 6px;
`

const LinkText = styled(Link)`
  color: #667eea;
  text-decoration: none;
  font-size: 14px;

  &:hover {
    text-decoration: underline;
  }
`

const SwitchText = styled.p`
  text-align: center;
  color: #666;
  font-size: 14px;
  margin-top: 20px;
`

const ShopLogin: React.FC = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      await login(username, password)
      window.location.href = '/shop'
    } catch (err: any) {
      setError(err?.message || '登录失败，请稍后重试')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <GlobalStyle />
      <Helmet>
        <title>登录 - 精品商城</title>
        <meta name="description" content="用户登录" />
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
              </CartButton>
            </NavMenu>
          </HeaderContent>
        </ShopHeader>

        <ShopMain>
          <AuthContainer>
            <AuthCard>
              <AuthTitle>欢迎登录</AuthTitle>
              <AuthSubtitle>登录您的账号，享受购物体验</AuthSubtitle>

              {error && <ErrorMessage>{error}</ErrorMessage>}

              <Form onSubmit={handleSubmit}>
                <FormGroup>
                  <Label>用户名</Label>
                  <Input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="请输入用户名"
                    required
                  />
                </FormGroup>

                <FormGroup>
                  <Label>密码</Label>
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="请输入密码"
                    required
                  />
                </FormGroup>

                <Button
                  type="submit"
                  $type="primary"
                  $size="large"
                  disabled={loading}
                >
                  {loading ? '登录中...' : '登录'}
                </Button>
              </Form>

              <SwitchText>
                还没有账号？ <LinkText to="/shop/register">立即注册</LinkText>
              </SwitchText>
            </AuthCard>
          </AuthContainer>
        </ShopMain>

        <ShopFooter>
          <p>© 2025 精品商城 - 品质生活，从这里开始</p>
        </ShopFooter>
      </ShopLayout>
    </>
  )
}

export default ShopLogin
