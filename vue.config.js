// TODO: 如何区分 GitHub Actions 与 Vercel 打包环境？

module.exports = {
  publicPath: '/svg-filter-graph-builder/',
  chainWebpack(config) {
    config.plugin('html').tap(args => {
      args[0].title = 'SVG Filter Graph Builder (by @gogoend)'
      return args
    })
  }
}
