const path = require('path') //node的path模块
const { merge } = require('webpack-merge')
const config = require('./webpack.base.js')
const { version } = require('../package.json')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const server = false

const entry = {
  client: ['./src/client/index.tsx']
}

const clientConfig = {
  output: {
    //打包出口
    path: path.resolve(__dirname, '../public'),
    filename: ({ chunk }) => {
      const { name } = chunk
      // console.log('name', name)
      return `js/[name].${version}.bundle.js`
    },
    chunkFilename: `js/[name].${version}.chunk.js`,
    publicPath: '/'
  }
}

module.exports = (_, { mode }) => {
  const baseConfig = config({ mode, entry, server })
  const mergedConfig = merge(baseConfig, clientConfig)

  // 开发环境配置：使用 watch 模式，不使用 devServer
  if (mode === 'development') {
    // 在开发环境中启用 HMR 相关的插件
    mergedConfig.target = 'web'
  }

  return mergedConfig
}
