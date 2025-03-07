import type { TypedFlatConfigItem } from '../types'

import { GLOB_SRC } from '../globs'

export async function disables(): Promise<TypedFlatConfigItem[]> {
  return [
    {
      files: [`**/scripts/${GLOB_SRC}`],
      name: 'disables/scripts',
      rules: {
        'no-console': 'off',
        'ts/explicit-function-return-type': 'off',
      },
    },
    {
      files: ['**/*.d.?([cm])ts'],
      name: 'disables/dts',
      rules: {
        'eslint-comments/no-unlimited-disable': 'off',
        'import/no-duplicates': 'off',
        'no-restricted-syntax': 'off',
        'unused-imports/no-unused-vars': 'off',
      },
    },
    {
      files: ['**/*.js', '**/*.cjs'],
      name: 'disables/cjs',
      rules: {
        'ts/no-require-imports': 'off',
      },
    },
  ]
}
