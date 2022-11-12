module.exports = {
  extends: require.resolve('umi/eslint'),
  plugins: ['import'],
  settings: {
    'import/internal-regex': '^@/',
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    },
  },
  rules: {
    '@typescript-eslint/no-use-before-define': off,
    'import/no-dynamic-require': off,
    'import/extensions': off,
    'import/prefer-default-export': off,
    'import/order': [
      error,
      {
        groups: [
          ['builtin', 'external'],
          ['internal', 'parent'],
          ['sibling', 'index'],
        ],
        'newlines-between': 'always-and-inside-groups',
        alphabetize: {
          order: 'desc',
          caseInsensitive: false,
        },
      },
    ],
  },
};
