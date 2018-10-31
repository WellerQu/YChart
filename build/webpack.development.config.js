const merge = require('webpack-merge');
const baseConfig = require('./webpack.base.config');
const webpack = require('webpack');
const path = require('path');

module.exports = merge(baseConfig, {
  devtool: 'inline-source-map',
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
  ],
  devServer: {
    hot: true,
    contentBase: path.join(__dirname, '../assets'),
    compress: true,
    port: 9000,
    compress: true,
    headers: {
      'X-Webpack-Dev-Server': 'Demo',
    },
  },
});