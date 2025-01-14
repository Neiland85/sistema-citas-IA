const eslintPluginPrettier = require('eslint-plugin-prettier');

module.exports = {
  ignores: ['node_modules', 'venv'],
  languageOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: {
    prettier: eslintPluginPrettier,
  },
  rules: {
    'prettier/prettier': 'error',
  },
};
