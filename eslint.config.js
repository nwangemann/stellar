const { defineConfig } = require('eslint/config');
const expo = require('eslint-config-expo/flat');
const prettier = require('eslint-config-prettier');

module.exports = defineConfig([
  { ignores: ['dist/*', 'docs/api/*', 'public/*', '.expo/*'] },
  expo,
  prettier,
  {
    files: ['src/core/**/*.ts'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            'react',
            'react-*',
            '@shopify/*',
            'expo*',
            '@/features/*',
            '@/ui/*',
            '@/services/*',
            '@/state/*',
          ],
        },
      ],
    },
  },
  {
    // Reanimated shared values are mutable by design.
    files: ['src/features/**/*.tsx', 'src/features/**/*.ts', 'src/ui/**/*.tsx'],
    rules: { 'react-hooks/immutability': 'off' },
  },
]);
