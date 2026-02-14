import React, { useState } from 'react'
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
  padding: 12px 16px;
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
  margin-bottom: 16px;
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

const Steps = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 24px;
`

const Step = styled.div<{ $active?: boolean; $completed?: boolean }>`
  display: flex;
  align-items: center;
  color: ${(props) => (props.$active || props.$completed ? '#667eea' : '#999')};
  font-size: 14px;
  font-weight: ${(props) => (props.$active ? '500' : 'normal')};

  &::after {
    content: '>';
    margin: 0 12px;
    color: #ccc;
  }

  &:last-child::after {
    display: none;
  }
`

const validateEmail = (value: string): string => {
  if (!value) return '请输入邮箱'
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(value)) return '请输入正确的邮箱格式'
  return ''
}

const ForgotPassword: React.FC = () => {
  const [step, setStep] = useState(1)
  const [email, setEmail] = useState('')
  const [verificationCode, setVerificationCode] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [fieldErrors, setFieldErrors] = useState<{
    email?: string
    code?: string
    password?: string
    confirmPassword?: string
  }>({})

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault()
    const emailError = validateEmail(email)
    if (emailError) {
      setFieldErrors({ email: emailError })
      return
    }

    setLoading(true)
    setError('')

    // 模拟发送验证码
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setSuccess('验证码已发送到您的邮箱')
    setStep(2)
    setLoading(false)
  }

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!verificationCode) {
      setFieldErrors({ code: '请输入验证码' })
      return
    }

    setLoading(true)
    setError('')

    // 模拟验证验证码
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setSuccess('验证成功，请设置新密码')
    setStep(3)
    setLoading(false)
  }

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    const errors: typeof fieldErrors = {}

    if (!newPassword) {
      errors.password = '请输入新密码'
    } else if (newPassword.length < 6) {
      errors.password = '密码至少需要6个字符'
    }

    if (newPassword !== confirmPassword) {
      errors.confirmPassword = '两次输入的密码不一致'
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      return
    }

    setLoading(true)
    setError('')

    // 模拟重置密码
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setSuccess('密码重置成功！即将跳转到登录页面...')
    setStep(4)
    setLoading(false)

    // 3秒后跳转到登录页
    setTimeout(() => {
      window.location.href = '/login'
    }, 3000)
  }

  return (
    <>
      <GlobalStyle />
      <Helmet>
        <title>忘记密码 - 精品商城</title>
        <meta name="description" content="找回密码" />
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
              <AuthTitle>找回密码</AuthTitle>
              <AuthSubtitle>通过邮箱验证重置您的密码</AuthSubtitle>

              <Steps>
                <Step $active={step === 1} $completed={step > 1}>
                  验证邮箱
                </Step>
                <Step $active={step === 2} $completed={step > 2}>
                  输入验证码
                </Step>
                <Step $active={step === 3} $completed={step > 3}>
                  重置密码
                </Step>
              </Steps>

              {error && <ErrorMessage>{error}</ErrorMessage>}
              {success && <SuccessMessage>{success}</SuccessMessage>}

              {step === 1 && (
                <Form onSubmit={handleSendCode}>
                  <FormGroup>
                    <Label>注册邮箱</Label>
                    <InputWrapper>
                      <Input
                        type="email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value)
                          setFieldErrors((prev) => ({
                            ...prev,
                            email: validateEmail(e.target.value)
                          }))
                        }}
                        placeholder="请输入注册时使用的邮箱"
                        $error={!!fieldErrors.email}
                        disabled={loading}
                      />
                    </InputWrapper>
                    <FieldError>{fieldErrors.email}</FieldError>
                  </FormGroup>

                  <Button
                    type="submit"
                    $type="primary"
                    $size="large"
                    disabled={loading}
                  >
                    {loading ? '发送中...' : '发送验证码'}
                  </Button>
                </Form>
              )}

              {step === 2 && (
                <Form onSubmit={handleVerifyCode}>
                  <FormGroup>
                    <Label>验证码</Label>
                    <InputWrapper>
                      <Input
                        type="text"
                        value={verificationCode}
                        onChange={(e) => {
                          setVerificationCode(e.target.value)
                          setFieldErrors((prev) => ({ ...prev, code: '' }))
                        }}
                        placeholder="请输入6位验证码"
                        $error={!!fieldErrors.code}
                        disabled={loading}
                        maxLength={6}
                      />
                    </InputWrapper>
                    <FieldError>{fieldErrors.code}</FieldError>
                  </FormGroup>

                  <Button
                    type="submit"
                    $type="primary"
                    $size="large"
                    disabled={loading}
                  >
                    {loading ? '验证中...' : '下一步'}
                  </Button>

                  <SwitchText>
                    没有收到验证码？{' '}
                    <LinkText
                      to="#"
                      onClick={(e) => {
                        e.preventDefault()
                        handleSendCode(e)
                      }}
                    >
                      重新发送
                    </LinkText>
                  </SwitchText>
                </Form>
              )}

              {step === 3 && (
                <Form onSubmit={handleResetPassword}>
                  <FormGroup>
                    <Label>新密码</Label>
                    <InputWrapper>
                      <Input
                        type="password"
                        value={newPassword}
                        onChange={(e) => {
                          setNewPassword(e.target.value)
                          setFieldErrors((prev) => ({ ...prev, password: '' }))
                        }}
                        placeholder="请输入新密码（至少6位）"
                        $error={!!fieldErrors.password}
                        disabled={loading}
                      />
                    </InputWrapper>
                    <FieldError>{fieldErrors.password}</FieldError>
                  </FormGroup>

                  <FormGroup>
                    <Label>确认新密码</Label>
                    <InputWrapper>
                      <Input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => {
                          setConfirmPassword(e.target.value)
                          setFieldErrors((prev) => ({
                            ...prev,
                            confirmPassword: ''
                          }))
                        }}
                        placeholder="请再次输入新密码"
                        $error={!!fieldErrors.confirmPassword}
                        disabled={loading}
                      />
                    </InputWrapper>
                    <FieldError>{fieldErrors.confirmPassword}</FieldError>
                  </FormGroup>

                  <Button
                    type="submit"
                    $type="primary"
                    $size="large"
                    disabled={loading}
                  >
                    {loading ? '重置中...' : '重置密码'}
                  </Button>
                </Form>
              )}

              {step === 4 && (
                <div style={{ textAlign: 'center', padding: '20px 0' }}>
                  <div style={{ fontSize: '48px', marginBottom: '16px' }}>
                    ✅
                  </div>
                  <p style={{ color: '#52c41a', fontSize: '16px' }}>
                    密码重置成功！
                  </p>
                  <p
                    style={{
                      color: '#999',
                      fontSize: '14px',
                      marginTop: '8px'
                    }}
                  >
                    即将跳转到登录页面...
                  </p>
                </div>
              )}

              {step < 4 && (
                <SwitchText>
                  记起密码了？ <LinkText to="/login">返回登录</LinkText>
                </SwitchText>
              )}
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

export default ForgotPassword
