var path = require('path')
var config = require('../config')
var utils = require('./utils')
var projectRoot = path.resolve(__dirname, '../')
const ESLintPlugin = require('eslint-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { VueLoaderPlugin } = require('vue-loader')

var env = process.env.NODE_ENV
// check env & config/index.js to decide weither to enable CSS Sourcemaps for the
// various preprocessor loaders added to vue-loader at the end of this file

module.exports = {
  entry: {
    app: './src/main.js'
  },
  output: {
    path: config.build.assetsRoot,
    publicPath: env === 'production' ? config.build.assetsPublicPath : config.dev.assetsPublicPath,
    filename: '[name].js'
  },
  resolve: {
    extensions: ['', '.js', '.vue'],
    alias: {
      'vue$': 'vue/dist/vue',
      'src': path.resolve(__dirname, '../src'),
      'assets': path.resolve(__dirname, '../src/assets'),
      'components': path.resolve(__dirname, '../src/components')
    }
  },
  plugins: [new ESLintPlugin({'extensions': ['js', 'vue']}), new VueLoaderPlugin()
].concat(env === 'production' ? [new MiniCssExtractPlugin({filename: "[name].[contenthash].css", chunkFilename: "[id].[contenthash].css"})] : []),
  module: { // rules
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        // TODO If you have rules defined for loading assets using raw-loader,
        // url-loader, or file-loader, please use Asset Modules instead as
        // they're going to be deprecated in near future.
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        type: 'asset/resource'
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        type: 'asset/resource',
        generator: {
          filename: 'static/[hash][ext][query]'
        }
      },
      {
        test: /\.(?:js|mjs|cjs)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/preset-env', { targets: "defaults" }]
            ]
          }
        },
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          env === 'production' ? MiniCssExtractPlugin.loader : "vue-style-loader",
          "css-loader",
// FIXME: is this needed?
//          "postcss-loader",
          "sass-loader",
        ],
      },
    ]
  }
}
