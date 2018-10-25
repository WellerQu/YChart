const merge = require('webpack-merge');
const ManifestPlugin = require('webpack-manifest-plugin');

const baseConfig = require('./webpack.base.config');

module.exports = merge(baseConfig, {
  devtool: false,
  plugins: [
    new ManifestPlugin(),
  ],
});
