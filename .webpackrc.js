const path = require('path');
var SERVICE_URL = 'http://124.232.150.3:9001';
export default {
  outputPath: 'maijiuweb',

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
    '/maijiu': {
      target: SERVICE_URL,
      pathRewrite: { '^/maijiu': '' },
      changeOrigin: true,
      secure: false,
    },
    '/cos': {
      target: 'http://124.232.150.3:8180',
      pathRewrite: { '^/cos': '' },
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
  publicPath: '/maijiuweb/',
  hash: true,
};
