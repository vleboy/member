module.exports = {
  productionSourceMap: false,

  pwa: {
    name: '会员系统后台',
    msTileColor: '#4DBA87'
  },

  configureWebpack: {
    optimization: {
      splitChunks: {
        minSize: 10000,
        maxSize: 250000,
      }
    }
  },

  // baseUrl: '/nodetracing/web/',
  // outputDir: '../server/web/',
  baseUrl: undefined,
  outputDir: undefined,
  assetsDir: undefined,
  runtimeCompiler: undefined,
  parallel: undefined,
  css: undefined
}