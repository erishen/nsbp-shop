import React, { useState } from 'react'
import styled from 'styled-components'
import { Helmet } from 'react-helmet'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`

const Card = styled.div`
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
`

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
`

const CardIcon = styled.div`
  font-size: 32px;
`

const CardTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: #333;
`

const CardDesc = styled.p`
  color: #666;
  font-size: 14px;
  line-height: 1.6;
`

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
`

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

const Label = styled.label`
  font-size: 14px;
  font-weight: 500;
  color: #666;
`

const Input = styled.input<{ $error?: boolean }>`
  padding: 12px 16px;
  border: 1px solid ${(props) => (props.$error ? '#ff4d4f' : '#e0e0e0')};
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #667eea;
  }
`

const Button = styled.button<{ $type?: 'primary' | 'danger' }>`
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  background: ${(props) =>
    props.$type === 'primary'
      ? '#667eea'
      : props.$type === 'danger'
        ? '#ff4d4f'
        : '#f5f5f5'};
  color: ${(props) =>
    props.$type === 'primary' || props.$type === 'danger' ? 'white' : '#333'};

  &:hover {
    background: ${(props) =>
      props.$type === 'primary'
        ? '#5568d3'
        : props.$type === 'danger'
          ? '#cf1322'
          : '#e8e8e8'};
  }
`

const Actions = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
`

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ErrorMessage = styled.div`
  color: #ff4d4f;
  font-size: 13px;
`

const InfoItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0;
  border-bottom: 1px solid #f0f0f0;

  &:last-child {
    border-bottom: none;
  }
`

const InfoLabel = styled.span`
  color: #666;
  font-size: 14px;
`

const InfoValue = styled.span`
  color: #333;
  font-size: 14px;
  font-weight: 500;
`

const ChangeLink = styled.span`
  color: #667eea;
  cursor: pointer;
  font-size: 14px;

  &:hover {
    text-decoration: underline;
  }
`

const Security: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [activeTab, setActiveTab] = useState<'password' | 'phone' | 'email'>(
    'password'
  )
  const [showPasswordForm, setShowPasswordForm] = useState(false)

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    alert('密码修改成功！')
    setShowPasswordForm(false)
  }

  return (
    <>
      <Helmet>
        <title>安全设置 - 精品商城</title>
      </Helmet>

      <Container>
        {/* 账号信息 */}
        <Card>
          <CardHeader>
            <CardIcon>👤</CardIcon>
            <CardTitle>账号信息</CardTitle>
          </CardHeader>
          <CardDesc>管理您的基本账号信息</CardDesc>
          <InfoItem>
            <InfoLabel>用户名</InfoLabel>
            <InfoValue>admin</InfoValue>
          </InfoItem>
          <InfoItem>
            <InfoLabel>注册时间</InfoLabel>
            <InfoValue>2025-02-10</InfoValue>
          </InfoItem>
        </Card>

        {/* 修改密码 */}
        <Card>
          <CardHeader>
            <CardIcon>🔒</CardIcon>
            <CardTitle>修改密码</CardTitle>
          </CardHeader>
          <CardDesc>定期修改密码可以提高账号安全性</CardDesc>

          {!showPasswordForm ? (
            <ChangeLink onClick={() => setShowPasswordForm(true)}>
              点击修改密码
            </ChangeLink>
          ) : (
            <Form onSubmit={handlePasswordSubmit}>
              <FormGroup>
                <Label>当前密码</Label>
                <Input type="password" placeholder="请输入当前密码" />
              </FormGroup>
              <FormGroup>
                <Label>新密码</Label>
                <Input type="password" placeholder="请输入新密码（至少6位）" />
              </FormGroup>
              <FormGroup>
                <Label>确认新密码</Label>
                <Input type="password" placeholder="请再次输入新密码" />
              </FormGroup>
              <Actions>
                <Button
                  $type="danger"
                  onClick={() => setShowPasswordForm(false)}
                >
                  取消
                </Button>
                <Button $type="primary">确认修改</Button>
              </Actions>
            </Form>
          )}
        </Card>

        {/* 绑定手机 */}
        <Card>
          <CardHeader>
            <CardIcon>📱</CardIcon>
            <CardTitle>绑定手机</CardTitle>
          </CardHeader>
          <CardDesc>绑定手机后可用于登录和找回密码</CardDesc>
          <InfoItem>
            <InfoLabel>已绑定手机</InfoLabel>
            <InfoValue>138****8000</InfoValue>
          </InfoItem>
        </Card>

        {/* 绑定邮箱 */}
        <Card>
          <CardHeader>
            <CardIcon>📧</CardIcon>
            <CardTitle>绑定邮箱</CardTitle>
          </CardHeader>
          <CardDesc>绑定邮箱后可用于接收订单通知和找回密码</CardDesc>
          <InfoItem>
            <InfoLabel>已绑定邮箱</InfoLabel>
            <InfoValue>a***@nsgm-shop.com</InfoValue>
          </InfoItem>
        </Card>
      </Container>
    </>
  )
}

export default Security
