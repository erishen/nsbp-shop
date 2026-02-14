/**
 * 响应式图片组件
 * 支持 srcset 和 sizes，根据屏幕密度和视口加载最佳尺寸
 */

import React, { useState, useEffect, useRef, useMemo } from 'react'

interface ResponsiveImageProps {
  /** 图片基础路径 (JPG/PNG 格式) */
  src: string
  /** WebP 版本路径，可选 */
  webpSrc?: string
  /** 图片 alt 文本 */
  alt?: string
  /** 容器宽度 */
  width?: number | string
  /** 容器高度 */
  height?: number | string
  /** 是否启用懒加载 */
  lazy?: boolean
  /** 占位图 URL */
  placeholder?: string
  /** 加载完成回调 */
  onLoad?: () => void
  /** 加载失败回调 */
  onError?: () => void
  /** 自定义样式 */
  style?: React.CSSProperties
  /** 自定义 className */
  className?: string
  /** 图片样式（object-fit 等） */
  imgStyle?: React.CSSProperties
  /** 是否自动根据 src 生成 srcset */
  autoSrcset?: boolean
  /** 手动指定 srcset */
  srcSet?: string
  /** 手动指定 sizes */
  sizes?: string
  /** 图片在布局中的实际显示尺寸 */
  layoutWidth?: number
}

// 响应式尺寸断点
const DEFAULT_SIZES = [
  '(max-width: 320px) 320px',
  '(max-width: 640px) 640px',
  '(max-width: 960px) 960px',
  '(max-width: 1280px) 1280px',
  '1920px'
].join(', ')

// 目标尺寸
const TARGET_WIDTHS = [320, 640, 960, 1280, 1920]

/**
 * 自动生成 srcset
 */
function generateSrcset(basePath: string): string {
  const ext = basePath.split('.').pop()?.toLowerCase() || ''
  const baseWithoutExt = basePath.replace(/\.[^/.]+$/, '')
  const dir = basePath.substring(0, basePath.lastIndexOf('/') + 1)
  const filename = baseWithoutExt.split('/').pop() || ''

  const srcsetParts: string[] = []

  // 生成各尺寸版本
  for (const width of TARGET_WIDTHS) {
    const responsivePath = `${dir}${filename}-${width}.webp`
    srcsetParts.push(`${responsivePath} ${width}w`)
  }

  // 添加原图 WebP
  srcsetParts.push(`${baseWithoutExt}.webp 1920w`)

  return srcsetParts.join(', ')
}

/**
 * 根据布局宽度生成最优 sizes
 */
function generateSizes(layoutWidth?: number): string {
  if (!layoutWidth) return DEFAULT_SIZES

  // 根据布局宽度生成合适的 sizes
  const sizes: string[] = []

  for (const breakpoint of [320, 640, 960, 1280]) {
    if (layoutWidth <= breakpoint) {
      sizes.push(`(max-width: ${breakpoint}px) 100vw`)
    }
  }

  sizes.push(`${layoutWidth}px`)
  return sizes.join(', ')
}

/**
 * 检测浏览器是否支持 WebP
 */
let webpSupport: boolean | null = null

const checkWebpSupport = (): Promise<boolean> => {
  if (webpSupport !== null) {
    return Promise.resolve(webpSupport)
  }

  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => {
      webpSupport = img.width > 0 && img.height > 0
      resolve(webpSupport)
    }
    img.onerror = () => {
      webpSupport = false
      resolve(false)
    }
    img.src = 'data:image/webp;base64,UklGRhoAAABXRUJQVlA4TA0AAAAvAAAAEAcQERGIiP4HAA=='
  })
}

/**
 * 响应式图片组件
 */
export const ResponsiveImage: React.FC<ResponsiveImageProps> = ({
  src,
  webpSrc,
  alt = '',
  width,
  height,
  lazy = true,
  placeholder,
  onLoad,
  onError,
  style = {},
  className,
  imgStyle = {},
  autoSrcset = true,
  srcSet: customSrcSet,
  sizes: customSizes,
  layoutWidth
}) => {
  const [supportsWebp, setSupportsWebp] = useState<boolean>(false)
  const [isLoaded, setIsLoaded] = useState<boolean>(false)
  const [isInViewport, setIsInViewport] = useState<boolean>(!lazy)
  const [hasError, setHasError] = useState<boolean>(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // 检测 WebP 支持
  useEffect(() => {
    checkWebpSupport().then(setSupportsWebp)
  }, [])

  // 懒加载：使用 Intersection Observer
  useEffect(() => {
    if (!lazy || isInViewport) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInViewport(true)
            observer.disconnect()
          }
        })
      },
      {
        rootMargin: '100px', // 提前 100px 开始加载
        threshold: 0.01
      }
    )

    if (containerRef.current) {
      observer.observe(containerRef.current)
    }

    return () => observer.disconnect()
  }, [lazy])

  // 计算 srcset 和 sizes
  const { srcSet, sizes, actualSrc, actualWebpSrc } = useMemo(() => {
    // 如果不支持 WebP，使用原图
    if (!supportsWebp) {
      return {
        srcSet: undefined,
        sizes: undefined,
        actualSrc: src,
        actualWebpSrc: undefined
      }
    }

    // 使用自定义或自动生成 srcset
    const finalSrcSet = customSrcSet || (autoSrcset ? generateSrcset(src) : undefined)
    const finalSizes = customSizes || generateSizes(layoutWidth)

    // 计算 WebP 路径
    const finalWebpSrc = webpSrc || src.replace(/\.(jpg|jpeg|png)$/i, '.webp')

    return {
      srcSet: finalSrcSet,
      sizes: finalSizes,
      actualSrc: src,
      actualWebpSrc: finalWebpSrc
    }
  }, [src, webpSrc, supportsWebp, autoSrcset, customSrcSet, customSizes, layoutWidth])

  const handleLoad = () => {
    setIsLoaded(true)
    onLoad?.()
  }

  const handleError = () => {
    if (supportsWebp && !hasError) {
      setHasError(true)
      // 回退到原图
    } else {
      onError?.()
    }
  }

  // 容器样式
  const containerStyle: React.CSSProperties = {
    position: 'relative',
    width: width || '100%',
    height: height || 'auto',
    overflow: 'hidden',
    ...style
  }

  // 图片样式
  const imageStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    opacity: isLoaded ? 1 : 0,
    transition: 'opacity 0.3s ease',
    ...imgStyle
  }

  // 占位样式
  const placeholderStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: '#f0f0f0',
    display: isLoaded ? 'none' : 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }

  return (
    <div ref={containerRef} style={containerStyle} className={className}>
      {/* 占位图 */}
      {!isLoaded && (
        <div style={placeholderStyle}>
          {placeholder ? (
            <img
              src={placeholder}
              alt=""
              style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.5 }}
            />
          ) : (
            <div
              style={{
                width: '32px',
                height: '32px',
                border: '3px solid #f3f3f3',
                borderTop: '3px solid #3498db',
                borderRadius: '50%',
                animation: 'responsive-image-spin 1s linear infinite'
              }}
            />
          )}
        </div>
      )}

      {/* 实际图片 */}
      {isInViewport && (
        <picture>
          {supportsWebp && actualWebpSrc && (
            <>
              {srcSet && <source srcSet={srcSet} sizes={sizes} type="image/webp" />}
              <source srcSet={actualWebpSrc} type="image/webp" />
            </>
          )}
          <img
            src={actualSrc}
            alt={alt}
            style={imageStyle}
            onLoad={handleLoad}
            onError={handleError}
            loading={lazy ? 'lazy' : 'eager'}
            {...(srcSet ? { srcSet, sizes } : {})}
          />
        </picture>
      )}

      {/* CSS 动画 */}
      <style>{`
        @keyframes responsive-image-spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}

/**
 * 简化的响应式图片 Hook
 * 用于获取图片的 srcset 配置
 */
export function useResponsiveImage(src: string) {
  return useMemo(() => {
    const srcset = generateSrcset(src)
    const sizes = DEFAULT_SIZES
    const webpSrc = src.replace(/\.(jpg|jpeg|png)$/i, '.webp')

    return {
      srcset,
      sizes,
      webpSrc,
      src
    }
  }, [src])
}

export default ResponsiveImage
