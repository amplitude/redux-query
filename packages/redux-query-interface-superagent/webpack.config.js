'use strict';

const path = require('path');
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');

const mode = process.env.NODE_ENV;

module.exports = {
  mode,
  externals: {
    'redux-query': {
      root: 'ReduxQuery',
      commonjs2: 'redux-query',
      commonjs: 'redux-query',
      amd: 'redux-query',
    },
  },
  entry: {
    'redux-query-interface-superagent': './src/index.js',
  },
  output: {
    path: path.join(__dirname, 'dist/umd'),
    filename: '[name].js',
    libraryTarget: 'umd',
    library: 'ReduxQueryInterfaceSuperagent',
  },
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin()],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(mode),
    }),
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [path.join(__dirname, 'src'), path.join(__dirname, '..', 'redux-query', 'src')],
      },
    ],
  },
};
