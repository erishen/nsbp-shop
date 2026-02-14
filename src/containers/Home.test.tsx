/**
 * Home 组件测试
 */

import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import Home from './Home'

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

// Mock react-router-dom
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  Link: ({ children, to }: { children: React.ReactNode; to: string }) => (
    <a href={to}>{children}</a>
  )
}))

// Mock @loadable/component
jest.mock('@loadable/component', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Component = (props: any): React.ReactNode => <div {...props} />
  Component.preload = jest.fn()
  return Component
})

// Mock @/utils
jest.mock('@/utils', () => ({
  isSEO: () => 1,
  usePreserveNSBP: () => ({ withNSBP: (path: string) => path })
}))

// Mock @components/Layout
jest.mock('@components/Layout', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="layout">{children}</div>
  )
}))

// Mock styled/home
jest.mock('../styled/home', () => ({
  GlobalStyle: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  PageWrapper: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="page-wrapper">{children}</div>
  ),
  HeroSection: ({ children }: { children: React.ReactNode }) => (
    <section data-testid="hero-section">{children}</section>
  ),
  HeroContent: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="hero-content">{children}</div>
  ),
  HeroTitle: ({ children }: { children: React.ReactNode }) => (
    <h1 data-testid="hero-title">{children}</h1>
  ),
  HeroSubtitle: ({ children }: { children: React.ReactNode }) => (
    <p data-testid="hero-subtitle">{children}</p>
  ),
  HeroBadge: ({ children }: { children: React.ReactNode }) => (
    <span data-testid="hero-badge">{children}</span>
  ),
  HeroStats: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="hero-stats">{children}</div>
  ),
  StatCard: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="stat-card">{children}</div>
  ),
  StatValue: ({ children }: { children: React.ReactNode }) => (
    <span>{children}</span>
  ),
  StatLabel: ({ children }: { children: React.ReactNode }) => (
    <span>{children}</span>
  ),
  TechSection: ({ children }: { children: React.ReactNode }) => (
    <section data-testid="tech-section">{children}</section>
  ),
  SectionHeader: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  SectionTitle: ({ children }: { children: React.ReactNode }) => (
    <h2>{children}</h2>
  ),
  SectionDescription: ({ children }: { children: React.ReactNode }) => (
    <p>{children}</p>
  ),
  FeatureGrid: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="feature-grid">{children}</div>
  ),
  FeatureCard: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="feature-card">{children}</div>
  ),
  CardIcon: ({ children }: { children: React.ReactNode }) => (
    <span>{children}</span>
  ),
  CardTitle: ({ children }: { children: React.ReactNode }) => (
    <h3>{children}</h3>
  ),
  CardDescription: ({ children }: { children: React.ReactNode }) => (
    <p>{children}</p>
  ),
  CodeExample: ({ children }: { children: React.ReactNode }) => (
    <pre>{children}</pre>
  ),
  ComparisonSection: ({ children }: { children: React.ReactNode }) => (
    <section data-testid="comparison-section">{children}</section>
  ),
  ComparisonTable: ({ children }: { children: React.ReactNode }) => (
    <table>{children}</table>
  ),
  TableHeader: ({ children }: { children: React.ReactNode }) => (
    <thead>{children}</thead>
  ),
  TableRow: ({ children }: { children: React.ReactNode }) => (
    <tr>{children}</tr>
  ),
  TableCell: ({ children }: { children: React.ReactNode }) => (
    <td>{children}</td>
  ),
  TableHeaderCell: ({ children }: { children: React.ReactNode }) => (
    <th>{children}</th>
  ),
  NsbpJSBadge: ({ children }: { children: React.ReactNode }) => (
    <span>{children}</span>
  ),
  NextJSBadge: ({ children }: { children: React.ReactNode }) => (
    <span>{children}</span>
  ),
  PhotoSection: ({ children }: { children: React.ReactNode }) => (
    <section data-testid="photo-section">{children}</section>
  ),
  PhotoGrid: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="photo-grid">{children}</div>
  ),
  PhotoCard: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="photo-card">{children}</div>
  ),
  PhotoImageWrapper: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  PhotoImage: (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
    <img {...props} />
  ),
  PhotoName: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  PhotoTitle: ({ children }: { children: React.ReactNode }) => (
    <span>{children}</span>
  ),
  PhotoCount: ({ children }: { children: React.ReactNode }) => (
    <span>{children}</span>
  ),
  LoadingContainer: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="loading-container">{children}</div>
  ),
  LoadingSpinner: () => <div data-testid="loading-spinner" />,
  LoadingText: ({ children }: { children: React.ReactNode }) => (
    <span>{children}</span>
  ),
  ErrorContainer: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="error-container">{children}</div>
  ),
  ErrorTitle: ({ children }: { children: React.ReactNode }) => (
    <h3>{children}</h3>
  ),
  ErrorMessage: ({ children }: { children: React.ReactNode }) => (
    <p>{children}</p>
  ),
  QuickStartSection: ({ children }: { children: React.ReactNode }) => (
    <section data-testid="quick-start-section">{children}</section>
  ),
  QuickStartGrid: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  QuickStartCard: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  QuickStartTitle: ({ children }: { children: React.ReactNode }) => (
    <h3>{children}</h3>
  ),
  QuickStartCode: ({ children }: { children: React.ReactNode }) => (
    <code>{children}</code>
  ),
  QuickStartDescription: ({ children }: { children: React.ReactNode }) => (
    <p>{children}</p>
  ),
  DemoButtonLink: ({
    children,
    href
  }: {
    children: React.ReactNode
    href: string
  }) => (
    <a href={href} data-testid="demo-button">
      {children}
    </a>
  ),
  DemoButtonIcon: ({ children }: { children: React.ReactNode }) => (
    <span>{children}</span>
  ),
  Footer: ({ children }: { children: React.ReactNode }) => (
    <footer data-testid="footer">{children}</footer>
  )
}))

// Mock fetch
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ data: [] })
  })
) as jest.Mock

// Mock window.context for photo menu data
interface PhotoMenuItem {
  name: string
  cover?: string
  count?: number
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
;(window as any).context = {
  state: {
    photo: {
      menu: [] as PhotoMenuItem[]
    }
  }
}

describe('Home 组件', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('组件应该存在', () => {
    expect(Home).toBeDefined()
  })

  it('应该渲染页面标题', async () => {
    render(<Home />)
    await waitFor(() => {
      expect(screen.getByTestId('hero-title')).toBeInTheDocument()
    })
  })

  it('应该渲染演示链接', async () => {
    render(<Home />)
    await waitFor(() => {
      expect(screen.getByTestId('demo-button')).toBeInTheDocument()
    })
  })

  it('应该渲染特性卡片', async () => {
    render(<Home />)
    await waitFor(() => {
      expect(screen.getByTestId('feature-grid')).toBeInTheDocument()
    })
  })

  it('应该渲染页脚', async () => {
    render(<Home />)
    await waitFor(() => {
      expect(screen.getByTestId('footer')).toBeInTheDocument()
    })
  })
})
