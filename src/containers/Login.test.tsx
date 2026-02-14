/**
 * Login 组件测试
 */

import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import Login from './Login'

// Mock styled-components
jest.mock('styled-components', () => {
  const StyledComponent = (): null => null
  const styled = new Proxy(
    {},
    {
      get: () => (): (() => null) => StyledComponent
    }
  )
  const createGlobalStyle = (): (() => null) => () => null
  const ThemeProvider = ({
    children
  }: {
    children: React.ReactNode
  }): React.ReactNode => children
  const css = (): string => ''
  return {
    default: styled,
    styled,
    createGlobalStyle,
    ThemeProvider,
    css
  }
})

// Mock react-helmet
jest.mock('react-helmet', () => ({
  Helmet: ({ children }: { children: React.ReactNode }): React.ReactNode => (
    <div data-testid="helmet">{children}</div>
  )
}))

// Mock @components/Header
jest.mock('@components/Header', () => ({
  __esModule: true,
  default: () => <header data-testid="header">Header</header>
}))

// Mock @components/Layout
jest.mock('@components/Layout', () => ({
  __esModule: true,
  default: ({
    children
  }: {
    children: React.ReactNode
    query?: Record<string, string>
  }) => <div data-testid="layout">{children}</div>
}))

// Mock @styled/test
jest.mock('@styled/test', () => ({
  Container: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="container">{children}</div>
  )
}))

// Mock CSS imports
jest.mock('../css/test.css', () => ({}))
jest.mock('../css/test.less', () => ({}))
jest.mock('../css/test2.sass', () => ({}))
jest.mock('../css/test3.scss', () => ({}))

describe('Login 组件', () => {
  it('组件应该存在', () => {
    expect(Login).toBeDefined()
  })

  it('应该渲染 Header 组件', () => {
    render(<Login />)
    expect(screen.getByTestId('header')).toBeInTheDocument()
  })

  it('应该渲染 Layout 组件', () => {
    render(<Login />)
    expect(screen.getByTestId('layout')).toBeInTheDocument()
  })

  it('应该渲染 login 文本', () => {
    render(<Login />)
    expect(screen.getByText('login')).toBeInTheDocument()
  })

  it('应该接受 query 参数', () => {
    const query = { redirect: '/home' }
    render(<Login query={query} />)
    expect(screen.getByTestId('layout')).toBeInTheDocument()
  })
})
