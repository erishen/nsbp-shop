import express from 'express'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import { render } from '@server/utils'
import { getPhotoWH, getPhotoMenu } from '@server/photo'
import { useCurrentFlag, outPhotoDicPath } from '@utils/config'

const app = express()

// 0. Trust proxy - Important for HTTPS reverse proxy (nginx)
app.set('trust proxy', true)

// 1. Security headers (helmet)
// 注意：由于 styled-components SSR 需要 'unsafe-inline'，暂时保留该配置
// 未来可考虑迁移到 CSS-in-JS 的静态提取方案后移除
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: [
          "'self'",
          "'unsafe-inline'",  // styled-components SSR 需要
          "'unsafe-eval'"     // 某些动态代码执行需要
        ],
        styleSrc: [
          "'self'",
          "'unsafe-inline'"   // styled-components SSR 需要
        ],
        imgSrc: ["'self'", 'data:', 'https:', 'http:'],
        connectSrc: [
          "'self'",
          'https:',
          'http://localhost:3000',
          'http://localhost:8080'
        ],
        fontSrc: ["'self'", 'data:'],
        objectSrc: ["'none'"],
        mediaSrc: ["'self'"],
        frameSrc: ["'none'"],
        // 安全增强：添加 base-uri 和 form-action 限制
        baseUri: ["'self'"],
        formAction: ["'self'"],
        // 防止 MIME 类型混淆攻击
        upgradeInsecureRequests: process.env.NODE_ENV === 'production' ? [] : null
      }
    },
    crossOriginEmbedderPolicy: false, // Allow inline scripts for SSR
    crossOriginOpenerPolicy: false // Allow window.open for development
  })
)

// 2. Hide X-Powered-By header
app.disable('x-powered-by')

// 3. Rate limiting (optional, controlled by environment variable)
if (process.env.ENABLE_RATE_LIMIT === '1') {
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false // Disable the `X-RateLimit-*` headers
  })
  app.use('/api', limiter)
}

// 4. Static file serving (disable dotfiles access)
app.use(
  express.static('public', {
    dotfiles: 'ignore',
    setHeaders: (res, filePath) => {
      // 开发环境使用较短的缓存时间，避免代码更新后浏览器使用旧缓存
      // 生产环境使用 1 年缓存（配合 hash 文件名）
      const isDev = process.env.NODE_ENV !== 'production'

      if (
        filePath.match(
          /\.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot)$/
        )
      ) {
        if (isDev) {
          // 开发环境：缓存 1 小时，便于开发调试
          res.setHeader('Cache-Control', 'public, max-age=3600')
        } else {
          // 生产环境：缓存 1 年（配合 webpack 的 contenthash）
          res.setHeader('Cache-Control', 'public, max-age=31536000, immutable')
        }
      }
    }
  })
)
!useCurrentFlag &&
  app.use(express.static(outPhotoDicPath, { dotfiles: 'ignore' }))

// 5. Body parsing with size limits
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ limit: '10mb', extended: true }))

//使用express提供的static中间件,中间件会将所有静态文件的路由指向public文件夹

app.get('/getPhotoWH', (req, res) => {
  getPhotoWH(req, res)
})

app.get('/getPhotoMenu', (req, res) => {
  getPhotoMenu(req, res)
})

// 开发环境：LiveReload 检查更新端点
if (process.env.NODE_ENV !== 'production') {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const fs = require('fs')
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const path = require('path')

  // 获取文件内容的简单 hash
  const getFileHash = (filePath: string): string => {
    try {
      const content = fs.readFileSync(filePath)
      let hash = 0
      for (let i = 0; i < content.length; i++) {
        const char = content.charCodeAt(i)
        hash = (hash << 5) - hash + char
        hash = hash & hash
      }
      return hash.toString()
    } catch {
      return '0'
    }
  }

  // 获取所有相关文件的组合 hash
  const getCombinedHash = (): string => {
    const buildDir = path.resolve(__dirname, '../build')
    const publicDir = path.resolve(__dirname, '../public/js')
    let combinedHash = ''

    try {
      // 服务端代码
      if (fs.existsSync(buildDir)) {
        const files = fs.readdirSync(buildDir).sort()
        files.forEach((file: string) => {
          if (file.endsWith('.js')) {
            combinedHash += getFileHash(path.join(buildDir, file))
          }
        })
      }

      // 客户端代码
      if (fs.existsSync(publicDir)) {
        const files = fs.readdirSync(publicDir).sort()
        files.forEach((file: string) => {
          if (file.endsWith('.js')) {
            combinedHash += getFileHash(path.join(publicDir, file))
          }
        })
      }
    } catch (e) {
      console.error('Error calculating hash:', e)
    }

    return combinedHash || Date.now().toString()
  }

  // 存储客户端已知的 hash（按 session）
  const clientHashes = new Map<string, string>()
  // 服务器当前已知的 hash，用于检测文件是否变化
  let serverKnownHash = getCombinedHash()
  // 记录 hash 变化的时间戳
  let hashChangedAt: number | null = null

  app.get('/check-update', (req, res) => {
    const clientId = (req.query.clientId as string) || 'default'
    const currentHash = getCombinedHash()
    const clientLastHash = clientHashes.get(clientId)

    // 检测文件是否刚发生变化
    if (currentHash !== serverKnownHash) {
      // eslint-disable-next-line no-console
      console.log(`[LiveReload] File changed, new hash: ${currentHash}`)
      serverKnownHash = currentHash
      hashChangedAt = Date.now()
    }

    // 判断对客户端是否是新内容：
    // 1. 客户端没有记录（首次访问）
    // 2. 或者客户端记录的 hash 与当前 hash 不同
    const isNew = !clientLastHash || clientLastHash !== currentHash

    if (isNew && clientLastHash) {
      // eslint-disable-next-line no-console
      console.log(`[LiveReload] Client ${clientId} detected update`)
    }

    // 更新客户端 hash
    clientHashes.set(clientId, currentHash)

    res.json({
      hash: currentHash,
      isNew,
      changedAt: hashChangedAt
    })
  })
}

// Catch-all middleware for SSR
app.use((req, res) => {
  render(req, res)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  if (process.env.ENABLE_RATE_LIMIT === '1') {
    // Rate limiting active
  }
})
