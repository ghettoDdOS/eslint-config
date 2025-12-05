import { config } from './src'

export default config(
  {
    typescript: {
      erasableOnly: true,
    },
    formatters: true,
    pnpm: true,
    type: 'lib',
  },
  {
    files: ['src/**/*.ts'],
    rules: {
      'perfectionist/sort-objects': 'error',
    },
  },
)
