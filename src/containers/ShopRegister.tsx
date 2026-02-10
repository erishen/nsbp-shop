import React, { useState } from 'react'
import { Helmet } from 'react-helmet'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { register, isLoggedIn } from '../services/shop'
import {
  GlobalStyle,
  ShopLayout,
  ShopHeader,
  HeaderContent,
  Logo,
  NavMenu,
  NavLink,
  CartButton,
  AuthLink,
  ShopMain,
  ShopFooter,
  Button
} from '../styled/shop'

const AuthContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 500px;
  padding: 40px 0;
`

const AuthCard = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.1);
  padding: 40px;
  width: 100%;
  max-width: 450px;
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
  gap: 18px;
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

const SuccessMessage = styled.div`
  color: #52c41a;
  font-size: 14px;
  padding: 12px;
  background: #f6ffed;
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

const ShopRegister: React.FC = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [nickname, setNickname] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess(false)

    if (password !== confirmPassword) {
      setError('两次输入的密码不一致')
      setLoading(false)
      return
    }

    try {
      await register({ username, password, nickname, email, phone })
      setSuccess(true)
      setTimeout(() => {
        window.location.href = '/shop/login'
      }, 2000)
    } catch (err: any) {
      setError(err?.message || '注册失败，请稍后重试')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <>
        <GlobalStyle />
        <Helmet>
          <title>注册成功 - 精品商城</title>
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
              </NavMenu>
            </HeaderContent>
          </ShopHeader>

          <ShopMain>
            <AuthContainer>
              <AuthCard>
                <AuthTitle>注册成功</AuthTitle>
                <SuccessMessage>
                  恭喜您，账号创建成功！即将跳转到登录页面...
                </SuccessMessage>
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

  return (
    <>
      <GlobalStyle />
      <Helmet>
        <title>注册 - 精品商城</title>
        <meta name="description" content="用户注册" />
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
            </NavMenu>
          </HeaderContent>
        </ShopHeader>

        <ShopMain>
          <AuthContainer>
            <AuthCard>
              <AuthTitle>创建账号</AuthTitle>
              <AuthSubtitle>填写信息，开启您的购物之旅</AuthSubtitle>

              {error && <ErrorMessage>{error}</ErrorMessage>}

              <Form onSubmit={handleSubmit}>
                <FormGroup>
                  <Label>用户名 *</Label>
                  <Input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="请输入用户名"
                    required
                  />
                </FormGroup>

                <FormGroup>
                  <Label>昵称</Label>
                  <Input
                    type="text"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    placeholder="请输入昵称（可选）"
                  />
                </FormGroup>

                <FormGroup>
                  <Label>密码 *</Label>
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="请输入密码"
                    required
                    minLength={6}
                  />
                </FormGroup>

                <FormGroup>
                  <Label>确认密码 *</Label>
                  <Input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="请再次输入密码"
                    required
                    minLength={6}
                  />
                </FormGroup>

                <FormGroup>
                  <Label>邮箱</Label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="请输入邮箱（可选）"
                  />
                </FormGroup>

                <FormGroup>
                  <Label>手机号</Label>
                  <Input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="请输入手机号（可选）"
                  />
                </FormGroup>

                <Button
                  type="submit"
                  $type="primary"
                  $size="large"
                  disabled={loading}
                >
                  {loading ? '注册中...' : '立即注册'}
                </Button>
              </Form>

              <SwitchText>
                已有账号？ <LinkText to="/shop/login">立即登录</LinkText>
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

export default ShopRegister
