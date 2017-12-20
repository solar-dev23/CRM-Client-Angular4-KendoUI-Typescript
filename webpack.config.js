const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const webpack = require('webpack');
const path = require('path');
const ExtractTextPlugin = require("extract-text-webpack-plugin");

const root = function () {
  let args = Array.prototype.slice.call(arguments, 0);
  return path.join.apply(path, [__dirname].concat(args));
};

const src = function () {
  return root('src', ...arguments);
};

const distr = function() {
  return root('distr', ...arguments);
};

const SRC_DIR = src();
const DISTR_DIR = distr();

const ENV_TYPE = {
  development: 'development',
  production: 'production'
};

const NODE_ENV = process.env.NODE_ENV || ENV_TYPE.development;

console.info(NODE_ENV + ' environment');

module.exports = {
  entry: {
    polyfills: src('polyfills.ts'),
    main: src('main.ts'),
    vendor: src('vendor.ts')
  },

  resolve: {
    extensions: ['.ts', '.js'],
    modules: [SRC_DIR, 'node_modules'],
  },

  output: {
    path: DISTR_DIR,
    filename: '[name]-[hash].js',
    library: '[name]'
  },

  module: {
    rules: [
      {
        test: /\.ts$/,
        loaders: ['awesome-typescript-loader', 'angular2-template-loader']
      },
      {
        test: /\.html$/,
        loader: 'html-loader'
      },
      {
        test: /\.less$/,
        loader: ExtractTextPlugin.extract(['css-loader', 'less-loader'])
      },
      {
        test: /\.scss$/,
        loaders: ['css-loader', 'sass-loader']
      },
      {
        test: /\.(jpg|svg|png)$/i,
        loader: 'url-loader?limit=1&name=assets/img/[name]-[hash].[ext]'
      },
      {
        test: /\.(woff|woff2|eot|ttf)(\?.*$|$)/,
        loader: 'url-loader?limit=1000&name=assets/fonts/[name]-[hash].[ext]'
      }
    ]

  },

  devtool: NODE_ENV === ENV_TYPE.development ? 'eval' : false,

  plugins: [
    new CleanWebpackPlugin([distr('*')], {
      verbose: true,
      dry: false
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: ['app', 'vendor', 'polyfills']
    }),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(NODE_ENV)
    }),
    new HtmlWebpackPlugin({
      template: src('index.html'),
      favicon: src('assets/favicon.png')
    }),
    new ExtractTextPlugin('[name]-[hash].css')
  ]
};

if (NODE_ENV === ENV_TYPE.production) {
  module.exports.plugins.push(
    new webpack.optimize.UglifyJsPlugin({
      compress: {unused: true, dead_code: true}
    })
  );
}