const path = require('path');
const merge = require('webpack-merge');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const common = require('./common');

module.exports = merge(common, {
  devtool: 'source-map',
  plugins: [
    new UglifyJSPlugin({sourceMap: true})
  ],
  output: {
    path: path.resolve(__dirname, '../../dist'),
    filename: '[name].js'
  },
});