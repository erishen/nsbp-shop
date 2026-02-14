import React, { useMemo } from 'react'
import { hydrateRoot, createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { StyleSheetManager } from 'styled-components'
import routers from '@/Routers'
import { Provider } from 'react-redux'
import getStore from '@/store'
import { isSEO } from '@/utils'
import Theme from '@components/Theme'
import { loadableReady } from '@loadable/component'

const isDevelopment = process.env.NODE_ENV === 'development'

// 类型声明
declare const module: NodeModule & {
  hot?: {
    accept: (deps: string[], callback: () => void) => void
  }
}

const App = () => {
  // 使用 useMemo 确保 store 只创建一次，避免每次渲染都创建新 store
  const store = useMemo(() => {
    if (isSEO() && window?.context?.state) {
      return getStore(window.context.state)
    }
    return getStore()
  }, []) // 空依赖数组，只执行一次

  return (
    <StyleSheetManager disableCSSOMInjection>
      <Theme>
        <Provider store={store}>
          <BrowserRouter>
            <Routes>
              {routers.map((router) => (
                <Route
                  key={router.key}
                  path={router.path}
                  element={router.element}
                >
                  {router.children?.map((child) => (
                    <Route
                      key={child.key}
                      path={child.path}
                      element={child.element}
                      index={child.index}
                    />
                  ))}
                </Route>
              ))}
            </Routes>
          </BrowserRouter>
        </Provider>
      </Theme>
    </StyleSheetManager>
  )
}

// 渲染函数
const render = () => {
  const container = document.getElementById('root')!
  if (isDevelopment) {
    // 开发环境：使用 createRoot 支持 HMR
    const root = container._reactRoot || createRoot(container)
    container._reactRoot = root
    root.render(<App />)
  } else {
    // 生产环境：使用 hydrateRoot 进行水合
    loadableReady(() => {
      hydrateRoot(container, <App />)
    })
  }
}

// 初始化渲染
render()

// 开发环境启用 HMR
if (isDevelopment && module.hot) {
  module.hot.accept(['../Routers'], () => {
    // eslint-disable-next-line no-console
    console.log('HMR: 模块热替换中...')
    render()
  })
}
