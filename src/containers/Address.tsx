import React from 'react'
import styled from 'styled-components'
import { Helmet } from 'react-helmet'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`

const Title = styled.h1`
  font-size: 24px;
  font-weight: 600;
  color: #333;
`

const AddButton = styled.button`
  padding: 10px 24px;
  border: none;
  border-radius: 8px;
  background: #667eea;
  color: white;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #5568d3;
  }
`

const AddressList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px;
`

const AddressCard = styled.div<{ $default?: boolean }>`
  background: ${(props) => (props.$default ? '#f0f5ff' : 'white')};
  border: 2px solid ${(props) => (props.$default ? '#667eea' : '#f0f0f0')};
  border-radius: 12px;
  padding: 20px;
  transition: all 0.3s ease;

  &:hover {
    border-color: #d9d9d9;
  }
`

const AddressHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: start;
  margin-bottom: 12px;
`

const DefaultBadge = styled.span`
  background: #667eea;
  color: white;
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 4px;
`

const Name = styled.div`
  font-weight: 600;
  color: #333;
  font-size: 16px;
`

const Phone = styled.div`
  color: #666;
  font-size: 14px;
  margin-top: 4px;
`

const Address = styled.div`
  color: #666;
  font-size: 14px;
  margin-top: 12px;
  line-height: 1.6;
`

const Actions = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 16px;
`

const ActionButton = styled.button<{ $danger?: boolean }>`
  padding: 6px 16px;
  border: none;
  border-radius: 6px;
  background: transparent;
  color: ${(props) => (props.$danger ? '#ff4d4f' : '#667eea')};
  font-size: 13px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: ${(props) => (props.$danger ? '#fff2f0' : '#f0f5ff')};
  }
`

const EmptyState = styled.div`
  text-align: center;
  padding: 80px 20px;
  color: #999;
`

const EmptyIcon = styled.div`
  font-size: 64px;
  margin-bottom: 16px;
`

const addresses = [
  {
    id: 1,
    name: '张三',
    phone: '13800138000',
    province: '北京市',
    city: '北京市',
    district: '朝阳区',
    detail: '建国路88号SOHO现代城A座1201',
    isDefault: true
  },
  {
    id: 2,
    name: '李四',
    phone: '13900139000',
    province: '上海市',
    city: '上海市',
    district: '浦东新区',
    detail: '陆家嘴环路1000号恒生银行大厦',
    isDefault: false
  }
]

const AddressPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>收货地址 - 精品商城</title>
      </Helmet>

      <Container>
        <Header>
          <Title>收货地址</Title>
          <AddButton>+ 添加新地址</AddButton>
        </Header>

        {addresses.length === 0 ? (
          <EmptyState>
            <EmptyIcon>📍</EmptyIcon>
            <div>还没有收货地址</div>
            <AddButton style={{ marginTop: '24px' }}>添加第一个地址</AddButton>
          </EmptyState>
        ) : (
          <AddressList>
            {addresses.map((addr) => (
              <AddressCard key={addr.id} $default={addr.isDefault}>
                <AddressHeader>
                  <Name>{addr.name}</Name>
                  {addr.isDefault && <DefaultBadge>默认</DefaultBadge>}
                </AddressHeader>
                <Phone>{addr.phone}</Phone>
                <Address>
                  {addr.province} {addr.city} {addr.district} {addr.detail}
                </Address>
                <Actions>
                  <ActionButton>编辑</ActionButton>
                  {addr.isDefault || <ActionButton>设为默认</ActionButton>}
                  <ActionButton $danger>删除</ActionButton>
                </Actions>
              </AddressCard>
            ))}
          </AddressList>
        )}
      </Container>
    </>
  )
}

export default AddressPage
