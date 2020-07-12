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
        target: 'https://board-d3-vue.herokuapp.com:3000'
      }
    }
  }
};
