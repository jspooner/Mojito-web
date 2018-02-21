'use strict';
// Node
const path = require('path');
// NPM
const webpack = require('webpack');
// Local
let config = require('./webpack.config');
// Fast Rebuild 	quality: original source (lines only)
config.devtool = 'cheap-module-eval-source-map';
// Add Hot Reload Entries
config.entry.hot = 'webpack/hot/only-dev-server';
config.devServer = {
  contentBase: path.resolve(__dirname, 'src'),
  host: '127.0.0.1',
  port: 3001,
  compress: false,
  inline: true,
  watchContentBase: true,
  stats: {
    assets: true,
    children: false,
    chunks: false,
    hash: false,
    modules: false,
    publicPath: true,
    timings: true,
    version: true,
    warnings: true
  }
};
module.exports = config;