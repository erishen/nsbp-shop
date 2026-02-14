const path = require('path')
const webpack = require('webpack')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const CompressionPlugin = require('compression-webpack-plugin')
const { version } = require('../package.json')
const LoadablePlugin = require('@loadable/webpack-plugin')
const BrowserSyncPlugin = require('browser-sync-webpack-plugin')

// 可选依赖：Bundle Analyzer（仅在 ANALYZE=1 且已安装时启用）
let BundleAnalyzerPlugin = null
try {
  if (process.env.ANALYZE === '1') {
    BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
  }
} catch (e) {
  console.warn('webpack-bundle-analyzer not installed. Run: pnpm add -D webpack-bundle-analyzer')
}

// 加载环境变量
require('dotenv').config()
require('dotenv').config({ path: '.env.local' })

module.exports = ({ mode, entry, server, init }) => {
  const config = {
    mode,
    entry,
    devtool: 'source-map',
    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
      alias: {
        '@': path.resolve(__dirname, '../src'),
        '@components': path.resolve(__dirname, '../src/component'),
        '@utils': path.resolve(__dirname, '../src/utils'),
        '@services': path.resolve(__dirname, '../src/services'),
        '@styled': path.resolve(__dirname, '../src/styled'),
        '@store': path.resolve(__dirname, '../src/store'),
        '@reducers': path.resolve(__dirname, '../src/reducers'),
        '@containers': path.resolve(__dirname, '../src/containers'),
        '@server': path.resolve(__dirname, '../src/server'),
        '@client': path.resolve(__dirname, '../src/client'),
        '@css': path.resolve(__dirname, '../src/css'),
        '@externals': path.resolve(__dirname, '../src/externals')
      }
    },
    module: {
      rules: [
        {
          test: /\.(ts|tsx|js|jsx)$/,
          exclude: /node_modules/,
          use: ['babel-loader']
        },
        {
          test: /\.less$/,
          use: [
            mode === 'production' || server
              ? MiniCssExtractPlugin.loader
              : 'style-loader',
            {
              loader: 'css-loader',
              options: {
                importLoaders: 1,
              }
            },
            'postcss-loader',
            {
              loader: 'less-loader',
              options: {
                lessOptions: {
                  javascriptEnabled: true,
                }
              }
            },
          ]
        },
        {
          test: /\.s(a|c)ss$/,
          use: [
            mode === 'production' || server
              ? MiniCssExtractPlugin.loader
              : 'style-loader',
            {
              loader: 'css-loader',
              options: {
                importLoaders: 1,
              }
            },
            'postcss-loader',
            'sass-loader'
          ]
        },
        {
          test: /\.css$/,
          use: [
            mode === 'production' || server
              ? MiniCssExtractPlugin.loader
              : 'style-loader',
            {
              loader: 'css-loader',
              options: {
                importLoaders: 1,
              }
            },
            'postcss-loader'
          ]
        },
        {
          test: /\.(png|svg|jp?g|webp|gif)$/i,
          type: 'asset/resource'
        },
        {
          test: /\.(woff|woff2|eot|ttf|otf)$/,
          type: 'asset/resource',
          generator: {
            filename: 'fonts/[name][ext]'
          }
        }
      ]
    },
    plugins: [
      new LoadablePlugin({
        writeToDisk: true
      }),
      new webpack.DefinePlugin({
        'process.env.NSGM_SHOP_API': JSON.stringify(process.env.NSGM_SHOP_API || 'http://localhost:3000'),
      }),
      // Bundle 分析工具 - 仅在 ANALYZE=1 且已安装时启用
      ...(process.env.ANALYZE === '1' && BundleAnalyzerPlugin ? [
        new BundleAnalyzerPlugin({
          analyzerMode: 'static',
          openAnalyzer: true,
          reportFilename: 'bundle-report.html',
          defaultSizes: 'gzip'
        })
      ] : [])
    ],
    optimization: {
      minimize: mode === 'production' || server ? true : false,
      minimizer: [`...`, new CssMinimizerPlugin()]
    },
    performance: {
      hints: 'warning',
      maxAssetSize: 500000,
      maxEntrypointSize: 500000
    }
  }

  // BrowserSync 在开发 nsgm-shop 集成时禁用，避免端口冲突
  // 如需启用，取消下面注释
  // if(mode === 'development' && !server){
  //   config.plugins.push(
  //     new BrowserSyncPlugin(
  //       {
  //         host: 'localhost',
  //         port: 3000,
  //         proxy: 'http://localhost:3001/'
  //       }
  //     )
  //   )
  // }

  if(mode === 'production' || server){
    config.plugins.push(
      new MiniCssExtractPlugin({
        filename: `css/[name].${version}.css`
      })
    )
  }

  if (!server) {
    if (mode === 'development') {
      config.entry['vendor'] = ['react', 'react-dom']
    } else if (mode === 'production') {
      // 启用 Gzip 压缩
      config.plugins.push(
        new CompressionPlugin({
          algorithm: 'gzip',
          test: /\.(js|css|html|svg)$/,
          threshold: 10240, // 10KB 以上的文件才压缩
          minRatio: 0.8
        })
      )

      config.optimization.minimizer.push(
        new TerserPlugin({
          terserOptions: {
            compress: {
              drop_debugger: true,
              //drop_console: true,
              pure_funcs: ['console.log']
            }
          }
        })
      )

      config.optimization['splitChunks'] = {
        chunks: 'all',
        minSize: 20000,
        minRemainingSize: 0,
        minChunks: 1,
        maxAsyncRequests: 30,
        maxInitialRequests: 30,
        enforceSizeThreshold: 50000,
        name: false,
        cacheGroups: {
          // React 核心库 - 最高优先级
          framework: {
            name: 'framework',
            test: /[\\/]node_modules[\\/](react|react-dom|react-router|react-router-dom)[\\]/,
            priority: 50,
            reuseExistingChunk: true
          },
          // Redux 相关
          redux: {
            name: 'redux',
            test: /[\\/]node_modules[\\/](redux|react-redux|@reduxjs\/toolkit)[\\]/,
            priority: 45,
            reuseExistingChunk: true
          },
          // UI 相关库
          ui: {
            name: 'ui',
            test: /[\\/]node_modules[\\/](styled-components|framer-motion|@emotion)[\\]/,
            priority: 40,
            reuseExistingChunk: true,
            minSize: 40000
          },
          // 工具库
          utils: {
            name: 'utils',
            test: /[\\/]node_modules[\\/](lodash|axios)[\\]/,
            priority: 35,
            reuseExistingChunk: true
          },
          // 通用 vendor
          vendor: {
            name: 'vendor',
            test: /[\\/]node_modules[\\]/,
            priority: 20,
            reuseExistingChunk: true
          },
          // 共用代码
          common: {
            name: 'common',
            minChunks: 2,
            priority: 10,
            reuseExistingChunk: true
          }
        }
      }

      config.optimization['runtimeChunk'] = {
        name: 'runtime'
      }
    }
  }

  return config
}
