/**
 * WebP 图片组件
 * 自动检测浏览器是否支持 WebP，并提供懒加载支持
 */

import React, { useState, useEffect, useRef } from 'react'

interface WebpImageProps {
  /** 图片 URL (JPG/PNG 格式) */
  src: string
  /** WebP 格式图片 URL，如果不提供则自动替换后缀 */
  webpSrc?: string
  /** 图片 alt 文本 */
  alt?: string
  /** 图片宽度 */
  width?: number | string
  /** 图片高度 */
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
}

// 检测浏览器是否支持 WebP
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
 * WebP 图片组件
 * 自动检测 WebP 支持并使用最佳格式
 */
const WebpImage: React.FC<WebpImageProps> = ({
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
  className
}) => {
  const [supportsWebp, setSupportsWebp] = useState<boolean>(false)
  const [isLoaded, setIsLoaded] = useState<boolean>(false)
  const [isInViewport, setIsInViewport] = useState<boolean>(!lazy)
  const [hasError, setHasError] = useState<boolean>(false)
  const imgRef = useRef<HTMLImageElement>(null)
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
        rootMargin: '50px', // 提前 50px 开始加载
        threshold: 0.01
      }
    )

    if (containerRef.current) {
      observer.observe(containerRef.current)
    }

    return () => observer.disconnect()
  }, [lazy])

  // 计算实际使用的图片 URL
  const getImageSrc = (): string => {
    if (!supportsWebp) return src

    // 如果提供了 webpSrc 直接使用
    if (webpSrc) return webpSrc

    // 自动替换后缀为 .webp
    return src.replace(/\.(jpg|jpeg|png)$/i, '.webp')
  }

  const actualSrc = isInViewport ? getImageSrc() : (placeholder || '')

  const handleLoad = () => {
    setIsLoaded(true)
    onLoad?.()
  }

  const handleError = () => {
    // WebP 加载失败，回退到原始格式
    if (supportsWebp && !hasError) {
      setHasError(true)
      if (imgRef.current) {
        imgRef.current.src = src
      }
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
    transition: 'opacity 0.3s ease'
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
      {/* 占位图或加载动画 */}
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
                width: '40px',
                height: '40px',
                border: '3px solid #f3f3f3',
                borderTop: '3px solid #3498db',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }}
            />
          )}
        </div>
      )}

      {/* 实际图片 */}
      {isInViewport && (
        <img
          ref={imgRef}
          src={actualSrc}
          alt={alt}
          style={imageStyle}
          onLoad={handleLoad}
          onError={handleError}
          loading={lazy ? 'lazy' : 'eager'}
        />
      )}

      {/* CSS 动画 */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}

/**
 * Picture 标签方式的支持 WebP 的图片组件
 * 更优雅的方式，但不支持懒加载的细粒度控制
 */
export const PictureImage: React.FC<WebpImageProps> = ({
  src,
  webpSrc,
  alt = '',
  width,
  height,
  style = {},
  className,
  onLoad,
  onError
}) => {
  const webpUrl = webpSrc || src.replace(/\.(jpg|jpeg|png)$/i, '.webp')

  return (
    <picture style={{ display: 'block', width, height, ...style }} className={className}>
      <source srcSet={webpUrl} type="image/webp" />
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        onLoad={onLoad}
        onError={onError}
        loading="lazy"
      />
    </picture>
  )
}

export default WebpImage
