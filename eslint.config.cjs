const eslintPluginPrettier = require('eslint-plugin-prettier');

module.exports = {
  ignores: ['node_modules', 'venv'], // Ignora estas carpetas
  env: {
    browser: true, // Habilita el entorno de navegador
    node: true, // Habilita el entorno Node.js
    es2021: true, // Establece ES2021 como estándar de ECMAScript
  },
  languageOptions: {
    ecmaVersion: 'latest', // Usa la última versión de ECMAScript
    sourceType: 'module', // Define los archivos como módulos (ESM)
  },
  plugins: {
    prettier: eslintPluginPrettier, // Integra Prettier como un plugin
  },
  extends: [
    'eslint:recommended', // Usa las reglas recomendadas de ESLint
    'plugin:react/recommended', // Usa las reglas recomendadas de React
  ],
  settings: {
    react: {
      version: 'detect', // Detecta automáticamente la versión de React
    },
  },
  rules: {
    'prettier/prettier': 'error', // Aplica las reglas de Prettier como errores
    'no-console': 'warn', // Genera advertencias para `console.log`
    'no-unused-vars': 'warn', // Genera advertencias para variables no usadas
  },
};
