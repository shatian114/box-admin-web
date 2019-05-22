const path = require('path');
var SERVICE_URL = 'http://124.232.150.3:8088';
export default {
  outputPath: 'clzweb',

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

  externals: {
    'AMap': 'AMap',
  },

  proxy: {
    '/clz': {
      target: SERVICE_URL,
      pathRewrite: { '^/clz': '' },
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
  publicPath: '/clzweb/',
  hash: true,
};
