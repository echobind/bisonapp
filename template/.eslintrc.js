module.exports = {
  extends: ['plugin:echobind/react'],
  ignorePatterns: ['generated', 'node_modules/'],
  plugins: ['import'],
  rules: {
    'import/order': [
      'warn',
      {
        groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
        'newlines-between': 'always',
      },
    ],
  },
};
