# 响应式图片使用指南

本项目支持响应式图片，可以根据设备的屏幕密度（DPR）和视口大小自动加载最佳尺寸的图片。

## 🎯 核心特性

- **自动尺寸适配**: 根据设备屏幕宽度加载合适尺寸的图片
- **WebP 格式支持**: 自动使用 WebP 格式，节省 25-35% 流量
- **懒加载**: 图片进入视口前不会加载
- **平滑过渡**: 加载时有平滑的淡入效果

## 📦 组件

### ResponsiveImage

基础响应式图片组件，支持 srcset 和 sizes。

```tsx
import { ResponsiveImage } from '@components/ResponsiveImage'

// 基础用法
<ResponsiveImage
  src="/images/photo.jpg"
  alt="描述"
/>

// 完整用法
<ResponsiveImage
  src="/images/photo.jpg"
  alt="描述"
  width={800}
  height={600}
  lazy={true}
  placeholder="/images/placeholder.jpg"
  layoutWidth={800}
/>
```

#### Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `src` | string | 必填 | 图片基础路径 |
| `webpSrc` | string | auto | WebP 版本路径 |
| `alt` | string | '' | 图片描述 |
| `width` | number \| string | '100%' | 容器宽度 |
| `height` | number \| string | 'auto' | 容器高度 |
| `lazy` | boolean | true | 是否懒加载 |
| `autoSrcset` | boolean | true | 自动生成 srcset |
| `srcSet` | string | - | 手动指定 srcset |
| `sizes` | string | - | 手动指定 sizes |
| `layoutWidth` | number | - | 布局宽度，用于计算 sizes |

### useResponsiveImage Hook

用于获取图片的响应式配置。

```tsx
import { useResponsiveImage } from '@components/ResponsiveImage'

function MyComponent() {
  const { srcset, sizes, webpSrc, src } = useResponsiveImage('/images/photo.jpg')
  
  return (
    <picture>
      <source srcSet={srcset} sizes={sizes} type="image/webp" />
      <img src={src} />
    </picture>
  )
}
```

## 🛠️ 生成响应式图片

### 命令

```bash
# 生成所有响应式尺寸
pnpm run generate:responsive

# 或作为构建的一部分
pnpm run build:prod
```

### 生成的文件结构

```
public/images/
├── photo.jpg              # 原图
├── photo.webp             # WebP 版本
├── photo-320.webp         # 320px 宽版本
├── photo-640.webp         # 640px 宽版本
├── photo-960.webp         # 960px 宽版本
├── photo-1280.webp        # 1280px 宽版本
└── photo-1920.webp        # 1920px 宽版本
```

### 生成的 srcset 示例

```html
<picture>
  <source 
    srcset="/images/photo-320.webp 320w,
            /images/photo-640.webp 640w,
            /images/photo-960.webp 960w,
            /images/photo-1280.webp 1280w,
            /images/photo-1920.webp 1920w"
    sizes="(max-width: 320px) 320px,
           (max-width: 640px) 640px,
           (max-width: 960px) 960px,
           (max-width: 1280px) 1280px,
           1920px"
    type="image/webp"
  />
  <source srcset="/images/photo.webp" type="image/webp" />
  <img src="/images/photo.jpg" />
</picture>
```

## 📱 浏览器行为

### 桌面端 (1920px)
- DPR 1.0: 加载 1920w 版本
- DPR 2.0 (Retina): 加载原图 WebP 或 1920w

### 平板 (768px)
- 加载 960w 或 640w 版本

### 手机 (375px)
- DPR 2.0: 加载 640w 版本
- DPR 3.0: 加载 960w 版本

## 🎨 使用示例

### 商品列表图片

```tsx
<ResponsiveImage
  src="/images/products/shoe.jpg"
  alt="运动鞋"
  width="100%"
  height={200}
  layoutWidth={300}
/>
```

### 详情页大图

```tsx
<ResponsiveImage
  src="/images/products/shoe-detail.jpg"
  alt="运动鞋详情"
  width="100%"
  height={400}
  lazy={false}  // 首屏图片不懒加载
  layoutWidth={800}
/>
```

### 背景图片

```tsx
<ResponsiveImage
  src="/images/banner.jpg"
  alt="Banner"
  width="100%"
  height="100vh"
  imgStyle={{ objectFit: 'cover' }}
/>
```

## ⚡ 性能优化建议

### 1. 合理设置 layoutWidth

`layoutWidth` 应该接近图片在页面中的实际显示宽度：

```tsx
// 商品卡片图片实际显示 300px
<ResponsiveImage layoutWidth={300} />

// Banner 大图实际显示 1200px
<ResponsiveImage layoutWidth={1200} />
```

### 2. 首屏图片不懒加载

```tsx
// 首屏 Banner 立即加载
<ResponsiveImage lazy={false} />

// 列表图片懒加载
<ResponsiveImage lazy={true} />
```

### 3. 使用占位图

```tsx
<ResponsiveImage
  src="/images/photo.jpg"
  placeholder="/images/photo-placeholder.jpg"
/>
```

## 🔧 自定义尺寸

编辑 `scripts/generate-responsive-images.js` 修改目标尺寸：

```javascript
// 生成的目标尺寸（宽度）
const TARGET_SIZES = [320, 640, 960, 1280, 1920]
```

## 🐛 调试

浏览器 DevTools Network 面板可以看到实际加载的图片尺寸：

1. 打开 Network 面板
2. 筛选 Img
3. 查看 Size 列
4. 不同 DPR 设备会加载不同尺寸

使用 Chrome DevTools 的设备模拟器测试不同屏幕尺寸下的加载行为。
