const path = require('path');

// require('dotenv').config({ path: path.dirname('../.env') })
require('dotenv').config()
const { VUE_APP_URL } = process.env;

const backendURL = 'https://board-d3-vue.herokuapp.com/'

module.exports = {
  css: {
    // Enable CSS source maps.
    sourceMap: process.env.NODE_ENV !== 'production'
  },
  outputDir: path.resolve(__dirname, '../back-end/public'),
  devServer: {
    proxy: {
      '/api': {
        target: backendURL
      }
    }
  }
};
