import type { OptionsStylistic, OptionsTailwindCSS, OptionsTypeScriptWithTypes, TypedFlatConfigItem } from '../types'

import { ensurePackages, interopDefault } from '../utils'

export async function tailwindcss(
  options: OptionsTailwindCSS & OptionsStylistic & OptionsTypeScriptWithTypes = {},
): Promise<TypedFlatConfigItem[]> {
  const { entryPoint, overrides = {}, stylistic = true, tsconfigPath } = options

  await ensurePackages(['eslint-plugin-better-tailwindcss'])

  const [pluginTailwindCSS] = await Promise.all([
    interopDefault(import('eslint-plugin-better-tailwindcss')),
  ] as const)

  const {
    indent = 2,
  } = typeof stylistic === 'boolean' ? {} : stylistic

  return [
    {
      name: 'tailwindcss',
      plugins: {
        tailwindcss: pluginTailwindCSS,
      },
      rules: {
        // recommended rules stylistics rules from eslint-plugin-better-tailwindcss https://github.com/schoero/eslint-plugin-better-tailwindcss/tree/main?tab=readme-ov-file#stylistic-rules
        ...(stylistic
          ? {
              'tailwindcss/enforce-consistent-class-order': 'warn',
              'tailwindcss/enforce-consistent-line-wrapping': ['warn', { indent }],
              'tailwindcss/no-duplicate-classes': 'warn',
              'tailwindcss/no-unnecessary-whitespace': 'warn',
            }
          : {}),

        // recommended rules correctness rules from eslint-plugin-better-tailwindcss https://github.com/schoero/eslint-plugin-better-tailwindcss/tree/main?tab=readme-ov-file#correctness-rules
        'tailwindcss/no-conflicting-classes': 'error',
        'tailwindcss/no-unregistered-classes': 'error',

        ...overrides,
      },
      settings: {
        tailwindcss: {
          entryPoint,
          tsconfig: tsconfigPath,
        },
      },
    },
  ]
}
