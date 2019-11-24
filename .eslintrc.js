module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es6: true,
    "node": true,
  },
  extends: [
    'airbnb-base',
    'plugin:promise/recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
  ],
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
    ecmaFeatures: {
      impliedStrict: true,
    },
  },
  plugins: [
    'import',
    'promise',
  ],
  rules: {
    'linebreak-style': 0, // Avoid LF/CRLF on Win/Linux/Mac
    'no-param-reassign': 0,
    'no-underscore-dangle': 0,
    'import/prefer-default-export': 0,
  },
};
