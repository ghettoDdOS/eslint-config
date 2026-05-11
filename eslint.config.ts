import { config } from './src'

export default config(
  {
    vue: {
      a11y: true,
    },
    baseline: true,
    sonarjs: false,
    react: true,
    nextjs: false,
    typescript: {
      erasableOnly: true,
    },
    markdown: {
      overrides: {
        'no-dupe-keys': 'off',
      },
    },
    formatters: true,
    perfectionist: true,
    pnpm: true,
    type: 'lib',
    jsx: {
      a11y: true,
    },
  },
  {
    files: ['src/**/*.ts'],
    rules: {
      'perfectionist/sort-objects': 'error',
    },
  },
)
