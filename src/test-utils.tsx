/**
 * 测试工具文件
 */

import React from 'react'

// 通用的 styled-components mock
export const mockStyledComponents = () => {
  jest.mock('styled-components', () => {
    const StyledComponent = (): null => null
    const styled = new Proxy(
      {},
      {
        get: (): (() => null) => StyledComponent
      }
    )

    const createGlobalStyle = (): (() => null) => () => null
    const ThemeProvider = ({ children }: { children: React.ReactNode }) =>
      children
    const css = (): string => ''

    return {
      default: styled,
      styled,
      createGlobalStyle,
      ThemeProvider,
      css
    }
  })
}

// 通用的 react-helmet mock
export const mockReactHelmet = () => {
  jest.mock('react-helmet', () => ({
    Helmet: ({ children }: { children: React.ReactNode }) => (
      <div>{children}</div>
    )
  }))
}

// 通用的 @loadable/component mock
export const mockLoadableComponent = () => {
  jest.mock('@loadable/component', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const Component = (props: any) => <div {...props} />
    Component.preload = jest.fn()
    return Component
  })
}

// 通用的 react-router-dom mock
export const mockReactRouterDom = () => {
  jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => jest.fn(),
    useParams: () => ({}),
    useLocation: () => ({ pathname: '/', search: '', hash: '', state: null }),
    Link: ({ children, to }: { children: React.ReactNode; to: string }) => (
      <a href={to}>{children}</a>
    )
  }))
}

// 通用的 styled/shop mock
export const mockStyledShop = () => {
  jest.mock('./styled/shop', () => ({
    ShopLayout: ({ children }: { children: React.ReactNode }) => (
      <div>{children}</div>
    ),
    ShopHeader: ({ children }: { children: React.ReactNode }) => (
      <div>{children}</div>
    ),
    HeaderContent: ({ children }: { children: React.ReactNode }) => (
      <div>{children}</div>
    ),
    Logo: () => <span>Logo</span>,
    NavMenu: ({ children }: { children: React.ReactNode }) => (
      <div>{children}</div>
    ),
    NavLink: ({ children, to }: { children: React.ReactNode; to: string }) => (
      <a href={to}>{children}</a>
    ),
    CartButton: () => <button>Cart</button>,
    CartBadge: ({ children }: { children: React.ReactNode }) => (
      <span>{children}</span>
    ),
    ShopMain: ({ children }: { children: React.ReactNode }) => (
      <main>{children}</main>
    ),
    ShopFooter: () => <footer>Footer</footer>,
    Button: ({
      children,
      onClick
    }: {
      children: React.ReactNode
      onClick?: () => void
    }) => <button onClick={onClick}>{children}</button>,
    EmptyContainer: ({ children }: { children: React.ReactNode }) => (
      <div>{children}</div>
    ),
    Container: ({ children }: { children: React.ReactNode }) => (
      <div>{children}</div>
    ),
    HeroSection: ({ children }: { children: React.ReactNode }) => (
      <div>{children}</div>
    ),
    HeroTitle: ({ children }: { children: React.ReactNode }) => (
      <h1>{children}</h1>
    ),
    ProductsGrid: ({ children }: { children: React.ReactNode }) => (
      <div>{children}</div>
    ),
    ProductCard: ({ children }: { children: React.ReactNode }) => (
      <div>{children}</div>
    ),
    ProductImage: () => <div />,
    ProductInfo: ({ children }: { children: React.ReactNode }) => (
      <div>{children}</div>
    ),
    ProductName: ({ children }: { children: React.ReactNode }) => (
      <h3>{children}</h3>
    ),
    ProductPrice: ({ children }: { children: React.ReactNode }) => (
      <p>{children}</p>
    ),
    ProductButton: ({ children }: { children: React.ReactNode }) => (
      <button>{children}</button>
    ),
    CategoriesSection: ({ children }: { children: React.ReactNode }) => (
      <div>{children}</div>
    ),
    CategoriesGrid: ({ children }: { children: React.ReactNode }) => (
      <div>{children}</div>
    ),
    CategoryCard: ({ children }: { children: React.ReactNode }) => (
      <div>{children}</div>
    ),
    CategoryIcon: () => <div />,
    CategoryName: ({ children }: { children: React.ReactNode }) => (
      <span>{children}</span>
    )
  }))
}
