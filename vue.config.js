/**
 * @type {import('@vue/cli-service').ProjectOptions}
 */
module.exports = {
  publicPath: '/svg-filter-graph-builder/', // TODO: 如何区分 GitHub Actions 与 Vercel 打包环境？
  css: {
    loaderOptions: {
      scss: {
        // 全局注入这个文件
        prependData: '@use "~@/styles/overrides/index.scss";'
      }
    }
  },
  productionSourceMap: false,
  chainWebpack(config) {
    config.plugin('html')
      .tap(args => {
        args[0].title = 'SVG Filter Graph Builder (by @gogoend)'
        return args
      })
      .end()
      .optimization.minimizer('terser').tap((args) => {
        Object.assign(
          args[0].terserOptions.compress,
          {
            warnings: true,
            drop_console: true,
            drop_debugger: true
          }
        )
        return args
      })
      .end()
  },
  pwa: {
    name: 'SVG Filter Graph Builder',
    themeColor: '#333' //
  }
}
