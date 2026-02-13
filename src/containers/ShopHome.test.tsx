/**
 * ShopHome 组件测试
 */

import React from 'react'
import ShopHome from './ShopHome'

// Mock styled-components
jest.mock('styled-components', () => {
  const StyledComponent = (): null => null
  const styled = new Proxy(
    {},
    {
      get: () => (): (() => null) => StyledComponent,
    },
  )
  const createGlobalStyle = (): (() => null) => () => null
  const ThemeProvider = ({ children }: { children: React.ReactNode }): React.ReactNode => children
  const css = (): string => ''
  return {
    default: styled,
    styled,
    createGlobalStyle,
    ThemeProvider,
    css,
  }
})

// Mock react-helmet
jest.mock('react-helmet', () => ({
  Helmet: ({ children }: { children: React.ReactNode }): React.ReactNode => <div>{children}</div>,
}))

// Mock @loadable/component
jest.mock('@loadable/component', () => {
  const Component = (props: any): React.ReactNode => <div {...props} />
  Component.preload = jest.fn()
  return Component
})

// Mock styled modules
jest.mock('../styled/shop', () => ({
  ShopLayout: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  ShopHeader: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  HeaderContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Logo: () => <span>Logo</span>,
  NavMenu: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  NavLink: ({ children, to }: { children: React.ReactNode; to: string }) => <a href={to}>{children}</a>,
  CartButton: () => <button>Cart</button>,
  CartBadge: ({ children }: { children: React.ReactNode }) => <span>{children}</span>,
  ShopMain: ({ children }: { children: React.ReactNode }) => <main>{children}</main>,
  ShopFooter: () => <footer>Footer</footer>,
  Button: ({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) => <button onClick={onClick}>{children}</button>,
  EmptyContainer: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Container: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  HeroSection: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  HeroTitle: ({ children }: { children: React.ReactNode }) => <h1>{children}</h1>,
  ProductsGrid: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  ProductCard: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  ProductImage: () => <div />,
  ProductInfo: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  ProductName: ({ children }: { children: React.ReactNode }) => <h3>{children}</h3>,
  ProductPrice: ({ children }: { children: React.ReactNode }) => <p>{children}</p>,
  ProductButton: ({ children }: { children: React.ReactNode }) => <button>{children}</button>,
  CategoriesSection: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  CategoriesGrid: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  CategoryCard: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  CategoryIcon: () => <div />,
  CategoryName: ({ children }: { children: React.ReactNode }) => <span>{children}</span>,
}))

describe('ShopHome 组件', () => {
  it('组件应该存在', () => {
    expect(ShopHome).toBeDefined()
  })
})
