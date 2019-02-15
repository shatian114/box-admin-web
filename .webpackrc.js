const path = require('path');
var SERVICE_URL = 'http://124.232.150.3:8086';
export default {
  outputPath: 'cpzhsqweb',

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
    '/cpzhsq': {
      target: SERVICE_URL,
      pathRewrite: { '^/cpzhsq': '' },
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
  publicPath: '/cpzhsqweb/',
  hash: true,
};
