/* eslint-env node */
module.exports = {
  root: true,
  extends: ['next/core-web-vitals', 'prettier'],
  plugins: ['@typescript-eslint', 'tailwindcss'],
  parser: '@typescript-eslint/parser',
  rules: {
    'tailwindcss/classnames-order': 'off',
  },
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      parserOptions: {
        project: ['./tsconfig.json'],
        tsconfigRootDir: __dirname,
      },
      extends: ['plugin:@typescript-eslint/recommended', 'plugin:tailwindcss/recommended'],
    },
  ],
};
