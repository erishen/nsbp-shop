/**
 * Photo 组件测试
 */

import React from 'react'
import Photo from './Photo'

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
    <div>{children}</div>
  )
}))

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    img: (props: React.ImgHTMLAttributes<HTMLImageElement>) => <img {...props} />
  }
}))

// Mock react-router-dom
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: () => ({ pathname: '/photo', search: '?dic=test', hash: '' }),
  Link: ({ children, to }: { children: React.ReactNode; to: string }) => (
    <a href={to}>{children}</a>
  )
}))

// Mock @components/Header
jest.mock('@components/Header', () => ({
  __esModule: true,
  default: () => <header>Header</header>
}))

// Mock @components/Layout
jest.mock('@components/Layout', () => ({
  __esModule: true,
  default: ({
    children
  }: {
    children: React.ReactNode
    query?: Record<string, string>
  }) => <div>{children}</div>
}))

// Mock @styled/photo
jest.mock('@styled/photo', () => ({
  Container: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Row: ({ children }: { children: React.ReactNode }) => <div>{children}</div>
}))

// Mock @/utils
jest.mock('@/utils', () => ({
  isSEO: () => 1,
  getLocationParams: () => 'test',
  usePreserveNSBP: () => ({ withNSBP: (path: string) => path })
}))

// Mock lodash
jest.mock('lodash', () => ({
  map: jest.fn((arr, fn) => (arr ? arr.map(fn) : []))
}))

// Mock @services/photo
jest.mock('@services/photo', () => ({
  loadDataForContainer: jest.fn()
}))

describe('Photo 组件', () => {
  it('组件应该存在', () => {
    expect(Photo).toBeDefined()
  })
})
