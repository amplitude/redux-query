'use strict';

const path = require('path');
const webpack = require('webpack');

var env = process.env.NODE_ENV;

var reactExternal = {
  root: 'React',
  commonjs2: 'react',
  commonjs: 'react',
  amd: 'react',
};

var reduxExternal = {
  root: 'Redux',
  commonjs2: 'redux',
  commonjs: 'redux',
  amd: 'redux',
};

module.exports = {
  externals: {
    'react': reactExternal,
    'redux': reduxExternal,
  },
  entry: {
    'redux-query': './src/index.js',
    'redux-query/advanced': './src/advanced.js',
  },
  output: {
    path: 'dist/umd',
    filename: '[name].js',
    libraryTarget: 'umd',
    library: 'ReduxQuery',
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(env),
    }),
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        pure_getters: true,
        unsafe: true,
        unsafe_comps: true,
        screw_ie8: true,
        warnings: false
      }
    }),
  ],
  module: {
    loaders: [
      {
        test: /\.js$/,
        loaders: ['babel'],
        include: path.join(__dirname, 'src'),
      },
    ]
  }
};
