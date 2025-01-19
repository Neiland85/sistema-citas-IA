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
    'prettier/prettier': 'error', // Enforce Prettier formatting
    '@typescript-eslint/no-explicit-any': 'off', // Temporarily allow 'any'
    '@typescript-eslint/no-empty-interface': 'off', // Allow empty interfaces
    '@typescript-eslint/no-redeclare': 'error', // Prevent redeclaration of variables
  },
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'], // Support for TypeScript extensions
      },
    },
  },
  overrides: [
    {
      files: ['*.ts', '*.tsx'], // Apply TypeScript-specific rules
      parser: '@typescript-eslint/parser',
      plugins: ['@typescript-eslint'],
      rules: {
        '@typescript-eslint/explicit-module-boundary-types': 'off', // Disable explicit return type requirement
        '@typescript-eslint/no-unused-vars': [
          'error',
          { argsIgnorePattern: '^_' }, // Allow unused variables starting with '_'
        ],
      },
    },
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true, // Support for JSX
    },
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
};
