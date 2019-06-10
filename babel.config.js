/* eslint-env node */

'use strict';

// NOTE(ryan): Set node target to current for @babel/preset-env to avoid errors when running jest
// `async` test functions ("ReferenceError: regeneratorRuntime is not defined").
// https://github.com/facebook/jest/issues/3126#issuecomment-483320742

module.exports = {
  presets: ['@babel/preset-flow', '@babel/preset-react', '@babel/preset-env'],
  plugins: ['@babel/plugin-proposal-object-rest-spread', 'babel-plugin-idx'],
  env: {
    test: {
      presets: [
        [
          '@babel/preset-env',
          {
            targets: {
              node: 'current',
            },
          },
        ],
      ],
    },
  },
};
