import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { Helmet } from 'react-helmet'
import { getOrders, Order } from '../services/shop'
import { getUserId } from '../services/shop'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`

const Tabs = styled.div`
  display: flex;
  gap: 8px;
  border-bottom: 1px solid #f0f0f0;
  padding-bottom: 16px;
  margin-bottom: 24px;
`

const Tab = styled.button<{ $active?: boolean }>`
  padding: 10px 20px;
  border: none;
  background: ${(props) => (props.$active ? '#667eea' : 'transparent')};
  color: ${(props) => (props.$active ? 'white' : '#666')};
  font-size: 14px;
  cursor: pointer;
  border-radius: 6px;
  transition: all 0.3s ease;

  &:hover {
    background: ${(props) => (props.$active ? '#5568d3' : '#f5f5f5')};
  }
`

const OrderList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`

const OrderCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
  }
`

const OrderHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 16px;
  border-bottom: 1px solid #f0f0f0;
  margin-bottom: 16px;
`

const OrderNo = styled.span`
  color: #999;
  font-size: 13px;
`

const OrderTime = styled.span`
  color: #999;
  font-size: 13px;
`

const OrderStatus = styled.span<{ $status: string }>`
  padding: 4px 12px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  background: ${(props) => {
    switch (props.$status) {
      case 'pending':
        return '#fff7e6'
      case 'paid':
        return '#e6f7ff'
      case 'shipped':
        return '#d4edda'
      case 'delivered':
        return '#d1e7dd'
      case 'cancelled':
        return '#f8d7da'
      default:
        return '#f8f9fa'
    }
  }};
  color: ${(props) => {
    switch (props.$status) {
      case 'pending':
        return '#d97706'
      case 'paid':
        return '#084298'
      case 'shipped':
        return '#198754'
      case 'delivered':
        return '#0f5132'
      case 'cancelled':
        return '#721c24'
      default:
        return '#6c757d'
    }
  }};
`

const StatusMap: Record<string, string> = {
  pending: '待支付',
  paid: '已支付',
  shipped: '已发货',
  delivered: '已完成',
  cancelled: '已取消'
}

const OrderContent = styled.div`
  display: flex;
  gap: 16px;
`

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const OrderImage = styled.img`
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 8px;
`

const OrderInfo = styled.div`
  flex: 1;
`

const OrderTitle = styled.div`
  font-weight: 500;
  color: #333;
  margin-bottom: 8px;
`

const OrderPrice = styled.div`
  color: #ff4d4f;
  font-weight: 600;
  font-size: 18px;
`

const OrderMeta = styled.div`
  color: #666;
  font-size: 13px;
  margin-top: 4px;
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

const UserOrders: React.FC = () => {
  const [activeTab, setActiveTab] = useState('all')
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true)
        const userId = getUserId()
        if (userId) {
          const result = await getOrders(0, 100, userId)
          setOrders(result.items)
        } else {
          setOrders([])
        }
      } catch (error) {
        console.error('获取订单失败:', error)
        setOrders([])
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [])

  const filteredOrders =
    activeTab === 'all'
      ? orders
      : orders.filter((order) => {
          if (activeTab === 'completed') return order.status === 'delivered'
          return order.status === activeTab
        })

  return (
    <>
      <Helmet>
        <title>我的订单 - 精品商城</title>
      </Helmet>

      <Container>
        <Tabs>
          <Tab
            $active={activeTab === 'all'}
            onClick={() => setActiveTab('all')}
          >
            全部订单
          </Tab>
          <Tab
            $active={activeTab === 'pending'}
            onClick={() => setActiveTab('pending')}
          >
            待支付
          </Tab>
          <Tab
            $active={activeTab === 'shipped'}
            onClick={() => setActiveTab('shipped')}
          >
            待收货
          </Tab>
          <Tab
            $active={activeTab === 'completed'}
            onClick={() => setActiveTab('completed')}
          >
            已完成
          </Tab>
        </Tabs>

        {loading ? (
          <EmptyState>
            <div>加载中...</div>
          </EmptyState>
        ) : filteredOrders.length === 0 ? (
          <EmptyState>
            <EmptyIcon>📦</EmptyIcon>
            <div>暂无订单</div>
            <Link
              to="/products"
              style={{ color: '#667eea', textDecoration: 'none' }}
            >
              去逛逛
            </Link>
          </EmptyState>
        ) : (
          <OrderList>
            {filteredOrders.map((order) => (
              <OrderCard key={order.id} as={Link} to={`/order/${order.id}`}>
                <OrderHeader>
                  <OrderNo>订单号：{order.order_no}</OrderNo>
                  <OrderTime>{order.create_date}</OrderTime>
                  <OrderStatus $status={order.status}>
                    {StatusMap[order.status] || order.status}
                  </OrderStatus>
                </OrderHeader>
                <OrderContent>
                  <OrderInfo>
                    <OrderTitle>
                      {order.receiver_name} {order.receiver_phone}
                    </OrderTitle>
                    <OrderPrice>¥{order.total_amount.toFixed(2)}</OrderPrice>
                    <OrderMeta>{order.receiver_address}</OrderMeta>
                  </OrderInfo>
                  <div style={{ textAlign: 'right', minWidth: '120px' }}>
                    <div style={{ color: '#999', fontSize: '13px' }}>
                      实付金额
                    </div>
                    <div
                      style={{
                        color: '#ff4d4f',
                        fontSize: '20px',
                        fontWeight: '600'
                      }}
                    >
                      ¥{order.pay_amount.toFixed(2)}
                    </div>
                  </div>
                </OrderContent>
              </OrderCard>
            ))}
          </OrderList>
        )}
      </Container>
    </>
  )
}

export default UserOrders
