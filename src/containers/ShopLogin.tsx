import React, { useState } from 'react'
import { Helmet } from 'react-helmet'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { login } from '../services/shop'
import {
  GlobalStyle,
  ShopLayout,
  ShopHeader,
  HeaderContent,
  Logo,
  NavMenu,
  NavLink,
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
  max-width: 420px;
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
  margin-bottom: 24px;
  font-size: 14px;
`

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 18px;
`

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`

const Label = styled.label`
  font-size: 14px;
  color: #666;
  font-weight: 500;
`

const InputWrapper = styled.div`
  position: relative;
`

const Input = styled.input<{ $error?: boolean }>`
  width: 100%;
  padding: 12px 40px 12px 16px;
  border: 1px solid ${props => props.$error ? '#ff4d4f' : '#d9d9d9'};
  border-radius: 6px;
  font-size: 14px;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: ${props => props.$error ? '#ff4d4f' : '#667eea'};
    box-shadow: ${props => props.$error ? '0 0 0 2px rgba(255,77,79,0.1)' : '0 0 0 2px rgba(102,126,234,0.1)'};
  }

  &:disabled {
    background-color: #f5f5f5;
    cursor: not-allowed;
  }
`

const PasswordToggle = styled.button`
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #999;
  cursor: pointer;
  font-size: 18px;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    color: #667eea;
  }
`

const FieldError = styled.div`
  color: #ff4d4f;
  font-size: 12px;
  min-height: 16px;
  margin-top: 2px;
`

const ErrorMessage = styled.div`
  color: #ff4d4f;
  font-size: 14px;
  padding: 12px;
  background: #fff2f0;
  border-radius: 6px;
  margin-bottom: 16px;
`

const RememberMe = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #666;
  cursor: pointer;
  user-select: none;

  input {
    cursor: pointer;
  }
`

const LinkText = styled(Link)`
  color: #667eea;
  text-decoration: none;
  font-size: 13px;

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

const validateUsername = (value: string): string => {
  if (!value) return '请输入用户名'
  if (value.length < 3) return '用户名至少需要3个字符'
  if (value.length > 20) return '用户名不能超过20个字符'
  if (!/^[a-zA-Z0-9_]+$/.test(value)) return '用户名只能包含字母、数字和下划线'
  return ''
}

const validatePassword = (value: string): string => {
  if (!value) return '请输入密码'
  if (value.length < 6) return '密码至少需要6个字符'
  return ''
}

const ShopLogin: React.FC = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState<{ username?: string; password?: string }>({})

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value)
    setFieldErrors(prev => ({ ...prev, username: validateUsername(e.target.value) }))
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value)
    setFieldErrors(prev => ({ ...prev, password: validatePassword(e.target.value) }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // 表单验证
    const usernameError = validateUsername(username)
    const passwordError = validatePassword(password)

    if (usernameError || passwordError) {
      setFieldErrors({ username: usernameError, password: passwordError })
      return
    }

    setLoading(true)
    setError('')

    try {
      await login(username, password)
      window.location.href = '/'
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
            <Logo href="/">🛍️ 精品商城</Logo>
            <NavMenu>
              <NavLink href="/">返回首页</NavLink>
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
                  <InputWrapper>
                    <Input
                      type="text"
                      value={username}
                      onChange={handleUsernameChange}
                      placeholder="请输入用户名"
                      $error={!!fieldErrors.username}
                      disabled={loading}
                      autoComplete="username"
                    />
                  </InputWrapper>
                  <FieldError>{fieldErrors.username}</FieldError>
                </FormGroup>

                <FormGroup>
                  <Label>密码</Label>
                  <InputWrapper>
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={handlePasswordChange}
                      placeholder="请输入密码"
                      $error={!!fieldErrors.password}
                      disabled={loading}
                      autoComplete="current-password"
                    />
                    <PasswordToggle
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={loading}
                    >
                      {showPassword ? '👁️' : '👁️‍🗨️'}
                    </PasswordToggle>
                  </InputWrapper>
                  <FieldError>{fieldErrors.password}</FieldError>
                </FormGroup>

                <FormGroup>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <RememberMe>
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        disabled={loading}
                      />
                      <span>记住我</span>
                    </RememberMe>
                    <LinkText to="/forgot-password">忘记密码？</LinkText>
                  </div>
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
                还没有账号？ <LinkText to="/register">立即注册</LinkText>
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
