// TODO: 如何区分 GitHub Actions 与 Vercel 打包环境？

module.exports = {
  publicPath: '/svg-filter-graph-builder/',
  outputDir: './dist/svg-filter-graph-builder/',
  css: {
    loaderOptions: {
      scss: {
        // 全局注入这个文件
        prependData: '@use "~@/styles/overrides/index.scss";'
      }
    }
  },
  chainWebpack(config) {
    config.plugin('html').tap(args => {
      args[0].title = 'SVG Filter Graph Builder (by @gogoend)'
      return args
    })
  },
  pwa: {
    name: 'SVG Filter Graph Builder',
    themeColor: '#333' //
  }
}
