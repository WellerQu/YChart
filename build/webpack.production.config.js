const webpack = require('webpack');
const merge = require('webpack-merge');

const ManifestPlugin = require('webpack-manifest-plugin');
const BannerPlugin = webpack.BannerPlugin;
// const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const baseConfig = require('./webpack.base.config');
const pkg = require('../package.json');

module.exports = merge(baseConfig, {
  devtool: false,
  plugins: [
    new BannerPlugin({
      banner: `Y chart engine version:${pkg.version} from: https://github.com/WellerQu/YChart`,
      entryOnly: true,
    }),
    new ManifestPlugin(),
    // new UglifyJsPlugin({
    //   cache: true,
    // }),
  ],
});
