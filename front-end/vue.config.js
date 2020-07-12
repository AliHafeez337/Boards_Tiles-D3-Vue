const path = require('path');

require('dotenv').config({ path: path.dirname('../.env') })
const { VUE_APP_URL } = process.env;

module.exports = {
  css: {
    // Enable CSS source maps.
    sourceMap: process.env.NODE_ENV !== 'production'
  },
  outputDir: path.resolve(__dirname, '../back-end/public'),
  devServer: {
    proxy: {
      '/api': {
        target: VUE_APP_URL
      }
    }
  }
};
