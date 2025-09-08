module.exports = {
  env: {
    NODE_ENV: '"development"'
  },
  defineConstants: {
    TARO_APP_API_BASE_URL: JSON.stringify(process.env.TARO_APP_API_BASE_URL || 'http://localhost:3001/api'),
    TARO_APP_USE_MOCK: JSON.stringify(process.env.TARO_APP_USE_MOCK || 'true'),
  },
  mini: {},
  h5: {}
}
