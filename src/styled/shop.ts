import styled, { createGlobalStyle } from 'styled-components'

export const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  
  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    background-color: #f5f5f5;
  }
`

// 布局组件
export const ShopLayout = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`

export const ShopHeader = styled.header`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 16px 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
`

export const HeaderContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`

export const Logo = styled.a`
  font-size: 24px;
  font-weight: bold;
  color: white;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 8px;
`

export const NavMenu = styled.nav`
  display: flex;
  gap: 24px;
  align-items: center;

  a {
    text-decoration: none;
  }
`

export const NavLink = styled.a<{ $active?: boolean }>`
  color: white;
  text-decoration: none;
  font-size: 14px;
  padding: 8px 16px;
  border-radius: 20px;
  transition: all 0.3s ease;
  background: ${(props) =>
    props.$active ? 'rgba(255,255,255,0.2)' : 'transparent'};

  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
`

export const CartButton = styled.a<{ $active?: boolean }>`
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  transition: all 0.3s ease;
  position: relative;
  text-decoration: none;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
  }
`

export const CartBadge = styled.span`
  background: #ff4d4f;
  color: white;
  font-size: 12px;
  padding: 2px 6px;
  border-radius: 10px;
`

export const AuthLink = styled.a<{ $active?: boolean }>`
  color: white;
  font-size: 14px;
  padding: 8px 16px;
  border-radius: 20px;
  transition: all 0.3s ease;
  text-decoration: none;
  font-weight: 500;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  background: ${(props) =>
    props.$active ? 'rgba(255,255,255,0.2)' : 'transparent'};

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-1px);
  }
`

export const ShopMain = styled.main`
  flex: 1;
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  padding: 24px;
`

export const ShopFooter = styled.footer`
  background: #1a1a2e;
  color: white;
  padding: 40px 24px;
  text-align: center;
`

// 轮播图组件
export const Carousel = styled.div`
  position: relative;
  height: 400px;
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 40px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`

export const CarouselItem = styled.div<{ $bgImage: string }>`
  height: 100%;
  background-image: url(${(props) => props.$bgImage});
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: flex-end;
  padding: 40px;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 50%;
    background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
  }
`

export const CarouselContent = styled.div`
  position: relative;
  z-index: 1;
  color: white;
`

export const CarouselTitle = styled.h2`
  font-size: 32px;
  margin-bottom: 8px;
`

// 标题组件
export const SectionTitle = styled.h2`
  font-size: 24px;
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  gap: 8px;
  color: #333;

  .icon {
    color: #667eea;
  }
`

// 分类卡片
export const CategoryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 16px;
  margin-bottom: 40px;
`

export const CategoryCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 24px;
  text-align: center;
  text-decoration: none;
  color: #333;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  }
`

export const CategoryIcon = styled.div`
  width: 64px;
  height: 64px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 12px;
  font-size: 28px;
`

export const CategoryName = styled.div`
  font-size: 14px;
  font-weight: 500;
`

// 商品卡片
export const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 24px;
  margin-bottom: 40px;
`

export const ProductCard = styled.div`
  background: white;
  border-radius: 12px;
  overflow: hidden;
  text-decoration: none;
  color: inherit;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  }
`

export const ProductImageWrapper = styled.div`
  position: relative;
  height: 200px;
  overflow: hidden;
  background: #f0f2f5;
`

export const ProductImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;

  ${ProductCard}:hover & {
    transform: scale(1.05);
  }
`

export const ProductBadge = styled.span<{ $discount?: boolean }>`
  position: absolute;
  top: 12px;
  left: 12px;
  background: #ff4d4f;
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
`

export const ProductInfo = styled.div`
  padding: 16px;
`

export const ProductName = styled.h3`
  font-size: 16px;
  margin-bottom: 8px;
  color: #333;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

export const ProductPrice = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
`

export const CurrentPrice = styled.span`
  font-size: 20px;
  font-weight: bold;
  color: #ff4d4f;
`

export const OriginalPrice = styled.span`
  font-size: 14px;
  color: #999;
  text-decoration: line-through;
`

export const ProductSales = styled.div`
  font-size: 12px;
  color: #666;
  display: flex;
  align-items: center;
  gap: 4px;

  .star {
    color: #faad14;
  }
`

// 特色功能区
export const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  margin-bottom: 40px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`

export const FeatureCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
`

export const FeatureTitle = styled.h3`
  font-size: 16px;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
  color: #333;

  .icon {
    color: #667eea;
  }
`

export const FeatureDesc = styled.p`
  font-size: 14px;
  color: #666;
  line-height: 1.6;
`

// 加载状态
export const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px;
  color: #999;
`

export const LoadingSpinner = styled.div`
  width: 40px;
  height: 40px;
  border: 3px solid #f0f2f5;
  border-top-color: #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`

// 空状态
export const EmptyContainer = styled.div`
  text-align: center;
  padding: 80px 24px;
  color: #999;
`

export const EmptyIcon = styled.div`
  font-size: 64px;
  margin-bottom: 16px;
`

export const EmptyText = styled.div`
  font-size: 16px;
`

// 按钮
export const Button = styled.button<{
  $type?: 'primary' | 'default'
  $size?: 'small' | 'medium' | 'large'
}>`
  padding: ${(props) =>
    props.$size === 'small'
      ? '6px 12px'
      : props.$size === 'large'
        ? '12px 24px'
        : '8px 16px'};
  border-radius: 6px;
  border: none;
  cursor: pointer;
  font-size: ${(props) =>
    props.$size === 'small'
      ? '12px'
      : props.$size === 'large'
        ? '16px'
        : '14px'};
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  ${(props) =>
    props.$type === 'primary'
      ? `
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    
    &:hover {
      opacity: 0.9;
      transform: translateY(-1px);
    }
  `
      : `
    background: white;
    color: #333;
    border: 1px solid #d9d9d9;
    
    &:hover {
      border-color: #667eea;
      color: #667eea;
    }
  `}
`

// 简单的导航链接样式（避免 SSR hydration 问题）
export const SimpleNavLink = styled.a<{ $active?: boolean }>`
  color: white;
  text-decoration: none;
  font-size: 14px;
  padding: 8px 16px;
  border-radius: 20px;
  transition: all 0.3s ease;
  background: ${(props) =>
    props.$active ? 'rgba(255,255,255,0.2)' : 'transparent'};

  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
`

export const SimpleLogo = styled.a`
  font-size: 24px;
  font-weight: bold;
  color: white;
  text-decoration: none;
  display: flex;
  align-items: center;
`

export const SimpleCartButton = styled.a`
  background: rgba(255, 255, 255, 0.2);
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  transition: all 0.3s ease;
  position: relative;
  text-decoration: none;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
  }
`

export const SimpleCartBadge = styled.span`
  background: #ff4d4f;
  color: white;
  font-size: 12px;
  padding: 2px 6px;
  border-radius: 10px;
  position: absolute;
  top: -5px;
  right: -5px;
`
