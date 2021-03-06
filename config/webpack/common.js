const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const webpack           = require('webpack');
const path              = require('path');

const NODE_ENV = process.env.NODE_ENV || 'development';

const extractSass = new ExtractTextPlugin({
  filename: "[name].css",
  disable: NODE_ENV === 'development',
  allChunks: true
});
console.log("__dirname", __dirname)
module.exports = {
  entry: {
    app: './src/javascripts/app.js'
  },
  output: {
    path: path.resolve(__dirname, '../../public'),
    filename: '[name].js'
  },
  module: {
    rules: [
      { test: /\.js$/, loader: 'babel-loader', exclude: /node_modules/  },
      {
        test: /\.(scss|css)$/,
        loader: extractSass.extract({
          fallback: "style-loader",
          use: [{
            loader: "css-loader",
            options: {
              sourceMap: true
            }
          }, {
            loader: "sass-loader",
            options: {
              sourceMap: true
            }
          }]
        })
      }
    ]
  },
  plugins: [
    extractSass,
    new HtmlWebpackPlugin({
      template: './src/index.html',
      output: {
        publicPath: ''
      }
    })
  ],
};
