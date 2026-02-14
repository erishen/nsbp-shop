import React, { useState } from 'react'
import { Helmet } from 'react-helmet'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { register } from '../services/shop'
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
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  padding: 40px;
  width: 100%;
  max-width: 480px;
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

const RequiredLabel = styled.span`
  color: #ff4d4f;
  margin-left: 2px;
`

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
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
  border: 1px solid ${(props) => (props.$error ? '#ff4d4f' : '#d9d9d9')};
  border-radius: 6px;
  font-size: 14px;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: ${(props) => (props.$error ? '#ff4d4f' : '#667eea')};
    box-shadow: ${(props) =>
      props.$error
        ? '0 0 0 2px rgba(255,77,79,0.1)'
        : '0 0 0 2px rgba(102,126,234,0.1)'};
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

const SuccessMessage = styled.div`
  color: #52c41a;
  font-size: 14px;
  padding: 12px;
  background: #f6ffed;
  border-radius: 6px;
`

const PasswordStrength = styled.div<{ $strength: number }>`
  height: 4px;
  background: #f0f0f0;
  border-radius: 2px;
  overflow: hidden;
  margin-top: 4px;

  &::after {
    content: '';
    display: block;
    height: 100%;
    width: ${(props) => props.$strength * 33.33}%;
    background: ${(props) => {
      if (props.$strength <= 1) return '#ff4d4f'
      if (props.$strength === 2) return '#faad14'
      return '#52c41a'
    }};
    transition:
      width 0.3s ease,
      background 0.3s ease;
  }
`

const PasswordHint = styled.div`
  font-size: 12px;
  color: #999;
  margin-top: 4px;
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

const validateConfirmPassword = (
  password: string,
  confirmPassword: string
): string => {
  if (!confirmPassword) return '请确认密码'
  if (password !== confirmPassword) return '两次输入的密码不一致'
  return ''
}

const validateEmail = (value: string): string => {
  if (!value) return ''
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(value)) return '请输入正确的邮箱格式'
  return ''
}

const validatePhone = (value: string): string => {
  if (!value) return ''
  const phoneRegex = /^1[3-9]\d{9}$/
  if (!phoneRegex.test(value)) return '请输入正确的手机号格式'
  return ''
}

const getPasswordStrength = (password: string): number => {
  if (!password) return 0
  let strength = 0
  if (password.length >= 6) strength++
  if (password.length >= 8) strength++
  if (
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /[0-9]/.test(password)
  )
    strength++
  return Math.min(strength, 3)
}

const ShopRegister: React.FC = () => {
  const [formData, setFormData] = useState({
    username: '',
    nickname: '',
    password: '',
    confirmPassword: '',
    email: '',
    phone: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<{
    username?: string
    password?: string
    confirmPassword?: string
    email?: string
    phone?: string
  }>({})

  const handleFieldChange =
    (field: keyof typeof formData) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value
      setFormData((prev) => ({ ...prev, [field]: value }))

      // 实时验证
      switch (field) {
        case 'username':
          setFieldErrors((prev) => ({
            ...prev,
            username: validateUsername(value)
          }))
          break
        case 'password':
          setFieldErrors((prev) => ({
            ...prev,
            password: validatePassword(value)
          }))
          if (formData.confirmPassword) {
            setFieldErrors((prev) => ({
              ...prev,
              confirmPassword: validateConfirmPassword(
                value,
                formData.confirmPassword
              )
            }))
          }
          break
        case 'confirmPassword':
          setFieldErrors((prev) => ({
            ...prev,
            confirmPassword: validateConfirmPassword(formData.password, value)
          }))
          break
        case 'email':
          setFieldErrors((prev) => ({ ...prev, email: validateEmail(value) }))
          break
        case 'phone':
          setFieldErrors((prev) => ({ ...prev, phone: validatePhone(value) }))
          break
      }
    }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // 表单验证
    const errors = {
      username: validateUsername(formData.username),
      password: validatePassword(formData.password),
      confirmPassword: validateConfirmPassword(
        formData.password,
        formData.confirmPassword
      ),
      email: formData.email ? validateEmail(formData.email) : '',
      phone: formData.phone ? validatePhone(formData.phone) : ''
    }

    const hasErrors = Object.values(errors).some((error) => error)
    if (hasErrors) {
      setFieldErrors(errors)
      return
    }

    setLoading(true)
    setError('')

    try {
      await register({
        username: formData.username,
        password: formData.password,
        nickname: formData.nickname || formData.username,
        email: formData.email || undefined,
        phone: formData.phone || undefined
      })
      setSuccess(true)
      setTimeout(() => {
        window.location.href = '/login'
      }, 2000)
    } catch (err) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setError((err as any)?.message || '注册失败，请稍后重试')
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
              <Logo href="/">🛍️ 精品商城</Logo>
              <NavMenu>
                <NavLink href="/">返回首页</NavLink>
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

  const passwordStrength = getPasswordStrength(formData.password)

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
            <Logo href="/">🛍️ 精品商城</Logo>
            <NavMenu>
              <NavLink href="/">返回首页</NavLink>
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
                  <Label>
                    用户名<RequiredLabel>*</RequiredLabel>
                  </Label>
                  <InputWrapper>
                    <Input
                      type="text"
                      value={formData.username}
                      onChange={handleFieldChange('username')}
                      placeholder="3-20位字母、数字或下划线"
                      $error={!!fieldErrors.username}
                      disabled={loading}
                      autoComplete="username"
                    />
                  </InputWrapper>
                  <FieldError>{fieldErrors.username}</FieldError>
                </FormGroup>

                <FormGroup>
                  <Label>昵称</Label>
                  <InputWrapper>
                    <Input
                      type="text"
                      value={formData.nickname}
                      onChange={handleFieldChange('nickname')}
                      placeholder="请输入昵称（可选）"
                      disabled={loading}
                      autoComplete="nickname"
                    />
                  </InputWrapper>
                  <FieldError></FieldError>
                </FormGroup>

                <FormGroup>
                  <Label>
                    密码<RequiredLabel>*</RequiredLabel>
                  </Label>
                  <InputWrapper>
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={handleFieldChange('password')}
                      placeholder="请输入密码（至少6位）"
                      $error={!!fieldErrors.password}
                      disabled={loading}
                      autoComplete="new-password"
                    />
                    <PasswordToggle
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={loading}
                    >
                      {showPassword ? '👁️' : '👁️‍🗨️'}
                    </PasswordToggle>
                  </InputWrapper>
                  {formData.password && (
                    <>
                      <PasswordStrength $strength={passwordStrength} />
                      <PasswordHint>
                        {passwordStrength === 1 && '密码强度：弱'}
                        {passwordStrength === 2 && '密码强度：中'}
                        {passwordStrength === 3 && '密码强度：强'}
                        {passwordStrength === 0 && '至少6个字符'}
                      </PasswordHint>
                    </>
                  )}
                  <FieldError>{fieldErrors.password}</FieldError>
                </FormGroup>

                <FormGroup>
                  <Label>
                    确认密码<RequiredLabel>*</RequiredLabel>
                  </Label>
                  <InputWrapper>
                    <Input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={formData.confirmPassword}
                      onChange={handleFieldChange('confirmPassword')}
                      placeholder="请再次输入密码"
                      $error={!!fieldErrors.confirmPassword}
                      disabled={loading}
                      autoComplete="new-password"
                    />
                    <PasswordToggle
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      disabled={loading}
                    >
                      {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                    </PasswordToggle>
                  </InputWrapper>
                  <FieldError>{fieldErrors.confirmPassword}</FieldError>
                </FormGroup>

                <FormGroup>
                  <Label>邮箱</Label>
                  <InputWrapper>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={handleFieldChange('email')}
                      placeholder="请输入邮箱（可选）"
                      $error={!!fieldErrors.email}
                      disabled={loading}
                      autoComplete="email"
                    />
                  </InputWrapper>
                  <FieldError>{fieldErrors.email}</FieldError>
                </FormGroup>

                <FormGroup>
                  <Label>手机号</Label>
                  <InputWrapper>
                    <Input
                      type="tel"
                      value={formData.phone}
                      onChange={handleFieldChange('phone')}
                      placeholder="请输入手机号（可选）"
                      $error={!!fieldErrors.phone}
                      disabled={loading}
                      autoComplete="tel"
                    />
                  </InputWrapper>
                  <FieldError>{fieldErrors.phone}</FieldError>
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
                已有账号？ <LinkText to="/login">立即登录</LinkText>
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
