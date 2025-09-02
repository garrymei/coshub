module.exports = {
  root: true,
  extends: [require.resolve('@coshub/config/eslint.cjs')],
  rules: {
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
  },
};


