import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { Helmet } from 'react-helmet'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`

const Section = styled.div`
  background: #fafafa;
  border-radius: 8px;
  padding: 24px;
`

const SectionTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 16px;
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

const Input = styled.input`
  padding: 12px 16px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
`

const Button = styled.button<{ $type?: 'primary' | 'default' }>`
  padding: 12px 32px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  background: ${(props) => (props.$type === 'primary' ? '#667eea' : '#f5f5f5')};
  color: ${(props) => (props.$type === 'primary' ? 'white' : '#333')};

  &:hover {
    background: ${(props) =>
      props.$type === 'primary' ? '#5568d3' : '#e8e8e8'};
  }
`

const AvatarSection = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;
`

const Avatar = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`

const UploadButton = styled.button`
  padding: 8px 16px;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  background: white;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    border-color: #667eea;
    color: #667eea;
  }
`

const UserInfo: React.FC = () => {
  const [loading, setLoading] = useState(true)
  const [userInfo, setUserInfo] = useState({
    nickname: '管理员',
    real_name: '系统管理员',
    email: 'admin@nsgm-shop.com',
    phone: '13800138000'
  })

  useEffect(() => {
    setLoading(false)
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    alert('保存成功！')
  }

  if (loading) return <div>加载中...</div>

  return (
    <>
      <Helmet>
        <title>个人信息 - 精品商城</title>
      </Helmet>

      <Form onSubmit={handleSubmit}>
        <Container>
          <AvatarSection>
            <Avatar>
              <img
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=admin"
                alt="头像"
              />
            </Avatar>
            <UploadButton>更换头像</UploadButton>
          </AvatarSection>

          <Section>
            <SectionTitle>基本信息</SectionTitle>
            <FormGroup>
              <Label>用户名</Label>
              <Input type="text" value="admin" disabled />
            </FormGroup>
            <FormGroup>
              <Label>昵称</Label>
              <Input
                type="text"
                value={userInfo.nickname}
                onChange={(e) =>
                  setUserInfo({ ...userInfo, nickname: e.target.value })
                }
              />
            </FormGroup>
            <FormGroup>
              <Label>真实姓名</Label>
              <Input
                type="text"
                value={userInfo.real_name}
                onChange={(e) =>
                  setUserInfo({ ...userInfo, real_name: e.target.value })
                }
              />
            </FormGroup>
          </Section>

          <Section>
            <SectionTitle>联系方式</SectionTitle>
            <FormGroup>
              <Label>手机号</Label>
              <Input
                type="tel"
                value={userInfo.phone}
                onChange={(e) =>
                  setUserInfo({ ...userInfo, phone: e.target.value })
                }
              />
            </FormGroup>
            <FormGroup>
              <Label>邮箱</Label>
              <Input
                type="email"
                value={userInfo.email}
                onChange={(e) =>
                  setUserInfo({ ...userInfo, email: e.target.value })
                }
              />
            </FormGroup>
          </Section>

          <div
            style={{ display: 'flex', gap: '16px', justifyContent: 'flex-end' }}
          >
            <Button type="default">取消</Button>
            <Button type="primary">保存</Button>
          </div>
        </Container>
      </Form>
    </>
  )
}

export default UserInfo
