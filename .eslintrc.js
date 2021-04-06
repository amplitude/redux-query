module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: ['./tsconfig.json', './tsconfig.eslint.json'],
    tsconfigRootDir: __dirname,
  },
  env: {
    browser: true,
    es6: true,
    jest: true,
    node: true,
  },
  plugins: [
    '@amplitude/amplitude',
    '@typescript-eslint',
    'css-modules',
    'import', // <-- I don't think `import` is being used
    'jsx-a11y',
    'react',
    'react-hooks',
  ],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:css-modules/recommended',
    'plugin:jsx-a11y/recommended',
    'plugin:react/recommended',
    // 'plugin:react-hooks/recommended', // <-- can't be turned on until CRAv4
    // These configs turn off rules that would conflict with Prettier formatting.
    'prettier',
  ],
  settings: {
    react: {
      version: 'detect',
    },
  },
  rules: {
    /* ~~ START `react-hooks` RULES (EVENTUALLY WE CAN USE `plugin:react-hooks/recommended` FOR THIS ~~*/
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'error',
    /* ~~ END `react-hooks` RULES (EVENTUALLY WE CAN USE `plugin:react-hooks/recommended` FOR THIS ~~*/

    /* ~~ START RULES THAT MAKE OUR CONFIG MORE STRICT (RELATIVE TO WHAT'S IN `extends`) ~~ */
    '@typescript-eslint/keyword-spacing': ['error', { before: true, after: true, overrides: {} }],
    '@typescript-eslint/no-throw-literal': 'error',
    'accessor-pairs': 'error',
    'array-callback-return': 'error',
    curly: 'error',
    eqeqeq: 'error',
    'func-names': 'error',
    'func-style': ['error', 'expression'],
    'guard-for-in': 'error',
    'linebreak-style': 'error',
    'no-bitwise': 'error',
    'no-cond-assign': ['error', 'always'],
    'no-console': ['error', { allow: ['warn', 'error', 'debug'] }],
    'no-div-regex': 'error',
    'no-multi-str': 'error',
    'no-nested-ternary': 'error',
    'no-octal-escape': 'error',
    'no-param-reassign': 'error',
    'no-restricted-imports': [
      'error',
      {
        name: 'lodash',
        message: 'Please use native JavaScript expressions instead.',
      },
      'react-fontawesome',
      'lightning/src/components/LegacyButton/LegacyButton',
      'lightning/src/components/LegacyIcon/LegacyIcon',
    ],
    'no-restricted-syntax': [
      'warn',
      {
        selector: "VariableDeclarator[id.name='mapDispatchToProps'][init.params.length>1]",
        message: 'no-map-dispatch-to-props-own-props',
      },
      {
        selector: "FunctionDeclaration[id.name='mapDispatchToProps'][params.length>1]",
        message: 'no-map-dispatch-to-props-own-props',
      },
    ],
    'no-return-assign': 'error',
    'no-script-url': 'error',
    'no-self-compare': 'error',
    'no-unneeded-ternary': 'error',
    'padding-line-between-statements': [
      'error',
      { blankLine: 'always', prev: '*', next: 'return' },
    ],
    'no-useless-call': 'error',
    'no-useless-concat': 'error',
    'no-var': 'error',
    'no-void': 'error',
    'object-shorthand': ['error', 'always'],
    'one-var': ['error', 'never'],
    'operator-assignment': ['error', 'always'],
    'prefer-arrow-callback': 'error',
    'prefer-const': 'error',
    'prefer-spread': 'error',
    'prefer-template': 'error',
    radix: 'error',
    'spaced-comment': ['error', 'always'],
    strict: ['error', 'safe'],
    yoda: ['error', 'never'],
    /* ~~ END RULES THAT MAKE OUR CONFIG MORE STRICT (RELATIVE TO WHAT'S IN `extends`) ~~ */

    /* ~~ START RULES THAT MAKE OUR CONFIG LESS STRICT (RELATIVE TO WHAT'S IN `extends`) ~~ */
    '@typescript-eslint/no-shadow': 'off',
    '@typescript-eslint/no-unused-vars': [
      'error',
      { vars: 'all', args: 'after-used', ignoreRestSiblings: true },
    ],
    'consistent-this': ['off', 'just_dont_do_it_at_all'],
    'no-underscore-dangle': 'off',
    'no-prototype-builtins': 'off',

    /* ~~ END RULES THAT MAKE OUR CONFIG LESS STRICT (RELATIVE TO WHAT'S IN `extends`) ~~ */

    /* ~~ CUSTOM RULE THAT BROKE FOLLOWING THE TYPESCRIPT MIGRATION  */
    // '@amplitude/amplitude/sort-imports': 'error',
  },
  overrides: [
    {
      files: ['/**/*.test.ts'],
      rules: {
        '@typescript-eslint/ban-ts-comment': 'warn',
      },
    },
  ],
};
