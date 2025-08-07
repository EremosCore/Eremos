module.exports = {
  parser: '@typescript-eslint/parser',
  extends: [
    'eslint:recommended',
    'prettier'
  ],
  plugins: ['@typescript-eslint', 'prettier'],
  env: {
    node: true,
    es2020: true,
    jest: true
  },
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module'
  },
  rules: {
    'prettier/prettier': 'error',
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'warn',
    'no-console': 'off', // Allow console.log for agent logging
    'prefer-const': 'error',
    'no-var': 'error'
  },
  ignorePatterns: ['dist/', 'node_modules/', 'coverage/']
};
