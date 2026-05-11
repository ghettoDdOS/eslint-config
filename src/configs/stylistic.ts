import type { OptionsOverrides, StylisticConfig, TypedFlatConfigItem } from '../types'
import { pluginAntfu } from '../plugins'
import { interopDefault } from '../utils'

export const StylisticConfigDefaults: StylisticConfig = {
  braceStyle: 'stroustrup',
  experimental: false,
  indent: 2,
  jsx: true,
  printWidth: 100,
  quotes: 'single',
  semi: false,
  tabWidth: 4,
}

export interface StylisticOptions extends StylisticConfig, OptionsOverrides {
  lessOpinionated?: boolean
}

export async function stylistic(
  options: StylisticOptions = {},
): Promise<TypedFlatConfigItem[]> {
  const {
    braceStyle,
    experimental,
    indent,
    jsx,
    lessOpinionated = false,
    overrides = {},
    printWidth,
    quotes,
    semi,
    tabWidth,
  } = {
    ...StylisticConfigDefaults,
    ...options,
  }

  const pluginStylistic = await interopDefault(import('@stylistic/eslint-plugin'))

  const config = pluginStylistic.configs.customize({
    braceStyle,
    experimental,
    indent,
    jsx,
    pluginName: 'style',
    quotes,
    semi,
  }) as TypedFlatConfigItem

  return [
    {
      name: 'stylistic/rules',
      plugins: {
        antfu: pluginAntfu,
        style: pluginStylistic,
      },
      rules: {
        ...config.rules,

        ...experimental
          ? {}
          : {
              'antfu/consistent-list-newline': 'error',
            },

        'antfu/consistent-chaining': 'error',

        ...(lessOpinionated
          ? {
              curly: ['error', 'all'],
            }
          : {
              'antfu/curly': 'error',
              'antfu/if-newline': 'error',
              'antfu/top-level-function': 'error',
            }
        ),

        'style/generator-star-spacing': ['error', { after: true, before: false }],
        'style/max-len': [
          'warn',
          {
            code: printWidth,
            ignoreComments: true,
            ignoreRegExpLiterals: true,
            ignoreTrailingComments: true,
            ignoreUrls: true,
            tabWidth: typeof indent === 'number' ? indent : indent === 'tab' ? tabWidth : 2,
          },
        ],
        'style/yield-star-spacing': ['error', { after: true, before: false }],

        ...overrides,
      },
    },
  ]
}
