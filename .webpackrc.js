const path = require('path');
var SERVICE_URL = 'http://124.232.150.3:8084';
export default {
  outputPath: 'commonweb',

  entry: 'src/index.js',
  extraBabelPlugins: [['import', { libraryName: 'antd', libraryDirectory: 'es', style: true }]],
  env: {
    development: {
      extraBabelPlugins: ['dva-hmr'],
    },
  },
  alias: {
    components: path.resolve(__dirname, 'src/components/'),
  },

  proxy: {
    /*'/box/api/**': {
      target: SERVICE_URL,
      changeOrigin: true,
      secure: false,
    },*/
    '/common': {
      target: SERVICE_URL,
      pathRewrite: { '^/common': '' },
      changeOrigin: true,
      secure: false,
    },
  },
  ignoreMomentLocale: true,
  theme: './src/theme.js',
  html: {
    template: './src/index.ejs',
  },
  disableDynamicImport: true,
  publicPath: '/commonweb/',
  hash: true,
};
