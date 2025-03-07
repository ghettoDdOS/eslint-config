import { config } from './src'

export default config(
  {
    typescript: true,
    formatters: true,
    type: 'lib',
  },
  {
    files: ['src/**/*.ts'],
    rules: {
      'perfectionist/sort-objects': 'error',
    },
  },
)
