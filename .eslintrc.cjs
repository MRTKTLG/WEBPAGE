module.exports = {
  env: {
    browser: true,
    es2022: true
  },
  extends: ['eslint:recommended'],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'script'
  },
  globals: {
    bootstrap: 'readonly'
  },
  rules: {
    'no-console': 'off'
  }
};
