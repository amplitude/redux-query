'use strict';

const path = require('path');
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');

const mode = process.env.NODE_ENV;

module.exports = {
  mode,
  externals: {
    react: {
      root: 'React',
      commonjs2: 'react',
      commonjs: 'react',
      amd: 'react',
    },
    'react-redux': {
      root: 'ReactRedux',
      commonjs2: 'react-redux',
      commonjs: 'react-redux',
      amd: 'react-redux',
    },
    'redux-query': {
      root: 'ReduxQuery',
      commonjs2: 'redux-query',
      commonjs: 'redux-query',
      amd: 'redux-query',
    },
  },
  entry: {
    'redux-query-react': './src/index.ts',
  },
  output: {
    path: path.join(__dirname, 'dist/umd'),
    filename: '[name].js',
    libraryTarget: 'umd',
    library: 'ReduxQueryReact',
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
      // ts-loader: convert typescript (es6) to javascript (es6),
      // babel-loader: converts javascript (es6) to javascript (es5)
      {
        test: /\.tsx?$/,
        loaders: ['babel-loader', 'ts-loader'],
        include: [path.join(__dirname, 'src'), path.join(__dirname, '..', 'redux-query', 'src')],
      },
      // babel-loader for pure javascript (es6) => javascript (es5)
      {
        test: /\.(jsx?)$/,
        loaders: ['babel'],
        include: [path.join(__dirname, 'src'), path.join(__dirname, '..', 'redux-query', 'src')],
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.tsx'],
  },
};
