module.exports = {
  productionSourceMap: false,

  pwa: {
    name: '会员系统',
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

  baseUrl: '/mobile/',
  outputDir: undefined,
  assetsDir: undefined,
  runtimeCompiler: undefined,
  parallel: undefined,
  css: undefined
}