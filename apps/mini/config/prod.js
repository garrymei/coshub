module.exports = {
  env: {
    NODE_ENV: '"production"'
  },
  defineConstants: {
  },
  mini: {
    // 启用JS文件压缩
    minifyOption: {
      enable: true,
      config: {
        // 启用JS压缩
        jsMinifier: 'terser',
        jsMinifierOptions: {
          compress: {
            drop_console: true,
            drop_debugger: true
          },
          mangle: true
        },
        // 启用CSS压缩
        cssMinifier: 'csso',
        // 启用HTML压缩
        htmlMinifier: 'html-minifier-terser'
      }
    },
    // 启用组件按需注入
    optimizeMainPackage: {
      enable: true
    },
    // 启用分包优化
    subPackages: true
  },
  h5: {
    /**
     * WebpackChain 插件配置
     * @docs https://github.com/neutrinojs/webpack-chain
     */
    // webpackChain (chain) {
    //   /**
    //    * 如果 h5 端编译后体积过大，可以使用 webpack-bundle-analyzer 插件对打包体积进行分析。
    //    * @docs https://github.com/webpack-contrib/webpack-bundle-analyzer
    //    */
    //   chain.plugin('analyzer')
    //     .use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin, [])
    // }
  }
}
