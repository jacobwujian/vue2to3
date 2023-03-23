const webpack = require('webpack')
const path = require('path')
const CompressionWebpackPlugin = require('compression-webpack-plugin')
const isProduction = process.env.NODE_ENV !== 'development'

module.exports = {
  productionSourceMap: false,
  chainWebpack: config => {
    config.plugins.delete('preload')
    config.plugins.delete('prefetch')

    config.entry('main').add('@babel/polyfill') // main是入口js文件
    config.plugin('ignore')
        .use(new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /zh-cn/))//忽略/moment/locale下的所有文件

    config.resolve.alias
        .set('@ant-design/icons/lib/dist$', path.resolve(__dirname, 'src/utils/antd-icons.js'))
  },
  configureWebpack: config => {
    if (isProduction) {
      const productionGzipExtensions = ['js', 'css']
      config.plugins.push(
        new CompressionWebpackPlugin({
          filename: '[path].gz[query]',
          algorithm: 'gzip',
          compressionOptions: { level: 6 },
          test: new RegExp('\\.(' + productionGzipExtensions.join('|') + ')$'),
          threshold: 10240, // 只有大小大于该值的资源会被处理 10240
          minRatio: 0.8, // 只有压缩率小于这个值的资源才会被处理
          deleteOriginalAssets: false // 删除原文件
        })
      )
    }
  },
  css: {
    sourceMap: false,
    modules: false,
    loaderOptions: {
      less: {
        globalVars: {
          'text-color': '#333',
          'text-gray': '#999'
        }
      }
    }
  }
}
