import React from 'react'
import { renderToString } from 'react-dom/server'
import { StaticRouter, Route, matchPath } from 'react-router-dom'
import { Routes } from 'react-router-dom'
import routers from '@/Routers'
import { Provider } from 'react-redux'
import getStore from '@store'
import serialize from 'serialize-javascript'
import { REQUEST_QUERY } from '@store/constants'
import { Helmet } from 'react-helmet'
import { ServerStyleSheet } from 'styled-components'
import Theme from '@components/Theme'
import path from 'path'
import { ChunkExtractor } from '@loadable/server'

interface Request {
  path: string
  query: Record<string, string | string[] | ParsedQs | undefined>
}

interface Response {
  send: (html: string) => void
  status: (code: number) => { send: (msg: string) => void }
}

export const render = (req: Request, res: Response) => {
  const store = getStore()
  const { path: reqPath, query } = req
  const matchRoutes: {
    loadData?: (
      resolve: (data?: unknown) => void,
      query: Request['query']
    ) => unknown
  }[] = []
  const promises = []

  let { nsbp } = query

  if (nsbp !== undefined && nsbp !== '') {
    nsbp = parseInt(nsbp, 10)
  }

  routers.some((route) => {
    matchPath(reqPath, route.path) ? matchRoutes.push(route) : ''
  })

  matchRoutes.forEach((item) => {
    if (item?.loadData) {
      const promise = new Promise((resolve, reject) => {
        try {
          // 将 query 参数传递给 loadData，确保能正确预取数据
          store.dispatch(item?.loadData(resolve, query))
        } catch {
          reject()
        }
      })

      promises.push(promise)
    }
  })

  const queryDispatch = (callback: (() => void) | null) => {
    return (
      dispatch: (action: { type: string; query: Request['query'] }) => void
    ) => {
      // 直接同步执行，避免 setTimeout 导致的竞态条件
      dispatch({ type: REQUEST_QUERY, query })
      callback && callback()
    }
  }

  const queryPromise = new Promise((resolve, reject) => {
    try {
      store.dispatch(queryDispatch(() => resolve()))
    } catch {
      reject()
    }
  })

  promises.push(queryPromise)

  Promise.all(promises)
    .then(() => {
      const nodeEnv = process.env.NODE_ENV
      const sheet = new ServerStyleSheet()
      const serverState = store.getState()

      const helmet = Helmet.renderStatic()

      const webStats = path.resolve(__dirname, '../public/loadable-stats.json')

      try {
        let webEntryPoints = ['client', 'vendor']

        if (nodeEnv === 'production') {
          webEntryPoints = ['client']
        }

        const webExtractor = new ChunkExtractor({
          statsFile: webStats,
          entrypoints: webEntryPoints,
          publicPath: '/'
        })

        const jsx = webExtractor.collectChunks(
          sheet.collectStyles(
            <Theme>
              <Provider store={store}>
                <StaticRouter location={reqPath}>
                  <Routes>
                    {routers.map((router) => (
                      <Route
                        key={router.key}
                        path={router.path}
                        element={router.element}
                      />
                    ))}
                  </Routes>
                </StaticRouter>
              </Provider>
            </Theme>
          )
        )

        const content = renderToString(jsx)
        const styleTags = sheet.getStyleTags()

        // 开发环境：添加 LiveReload 脚本
        const liveReloadScript =
          nodeEnv === 'development'
            ? `<script>
              (function() {
                const clientId = Math.random().toString(36).substring(2, 15);
                let lastHash = '';
                let lastChangedAt = 0;
                let isFirstCheck = true;
                let consecutiveErrors = 0;
                
                const checkUpdate = async () => {
                  try {
                    const response = await fetch('/check-update?clientId=' + clientId, {
                      cache: 'no-store'
                    });
                    if (!response.ok) {
                      consecutiveErrors++;
                      return;
                    }
                    consecutiveErrors = 0;
                    
                    const data = await response.json();
                    const currentHash = data.hash;
                    const serverChangedAt = data.changedAt || 0;
                    
                    // 首次加载，只记录状态，不刷新
                    if (isFirstCheck) {
                      lastHash = currentHash;
                      lastChangedAt = serverChangedAt;
                      isFirstCheck = false;
                      console.log('[LiveReload] 已连接，hash:', currentHash.slice(0, 8) + '...');
                      return;
                    }
                    
                    // 服务器检测到新变更（变化时间戳更新）
                    if (serverChangedAt > lastChangedAt) {
                      console.log('[LiveReload] 服务器报告新变更，准备刷新...');
                      lastChangedAt = serverChangedAt;
                      lastHash = currentHash;
                      setTimeout(() => window.location.reload(), 1500);
                      return;
                    }
                    
                    // 兜底：hash 变了但时间戳没变（服务器重启等情况）
                    if (currentHash !== lastHash && !isFirstCheck) {
                      // 确保不是刚加载后的首次比对，给 5 秒缓冲
                      const timeSinceFirstCheck = Date.now() - window.performance.timing.loadEventEnd;
                      if (timeSinceFirstCheck > 5000) {
                        console.log('[LiveReload] Hash 变化，刷新页面...');
                        lastHash = currentHash;
                        setTimeout(() => window.location.reload(), 1500);
                      }
                    }
                  } catch (e) {
                    consecutiveErrors++;
                    // 连续错误超过5次可能是服务器重启，刷新一下
                    if (consecutiveErrors > 5) {
                      console.log('[LiveReload] 连接恢复，刷新页面...');
                      window.location.reload();
                    }
                  }
                };
                
                // 每2秒检查一次更新
                setInterval(checkUpdate, 2000);
                // 页面可见时立即检查
                document.addEventListener('visibilitychange', () => {
                  if (!document.hidden) checkUpdate();
                });
                checkUpdate();
              })();
            </script>`
            : ''

        const html = `
              <!DOCTYPE html>
              <html>
                  <head>
                      <meta charset="utf-8">
                      <link rel="icon" type="image/x-icon" href="/favicon.ico">
                      <link rel="icon" type="image/svg+xml" href="/favicon.svg">
                      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
                      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
                      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
                      <link rel="manifest" href="/site.webmanifest">
                      <meta name="theme-color" content="#2563eb">
                      ${helmet?.title?.toString()}
                      ${helmet?.meta?.toString()}
                      ${styleTags}
                      ${webExtractor.getLinkTags()}
                      ${webExtractor.getStyleTags()}
                      ${liveReloadScript}
                  </head>
                  <body>
                      <div id="root">${content}</div>
                      <script type="text/javascript">
                          window.context = { state: ${serialize(serverState)} }
                          window.query = ${serialize(query)}
                      </script>
                      ${webExtractor.getScriptTags()}
                  </body>
              </html>
          `

        res.send(html)
      } catch (e: Error) {
        console.error('SSR rendering error:', e.message)
        res.status(500).send('Internal Server Error')
      }
    })
    .catch((e: Error) => {
      console.error('Data loading error:', e.message)
      res.status(500).send('Data loading failed')
    })
}
