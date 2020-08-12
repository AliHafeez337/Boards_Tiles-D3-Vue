
// import { back_end_url } from './VARIABLES'
const path = require('path');

module.exports = {
  css: {
    // Enable CSS source maps.
    sourceMap: process.env.NODE_ENV !== 'production'
  },
  outputDir: path.resolve(__dirname, '../back-end/public'),
  devServer: {
    proxy: {
      '/api': {
        // target: 'http://localhost:3000'
        target: 'http://192.168.10.6:3000'
      }
    }
  }
};
