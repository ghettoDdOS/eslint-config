import type { OptionsJSX, Rules, TypedFlatConfigItem } from '../types'

import { isPackageExists } from 'local-pkg'

import { NextJsPackages } from '../constants'
import { GLOB_JSX, GLOB_TSX } from '../globs'
import { ensurePackages, interopDefault } from '../utils'

export async function jsx(options: OptionsJSX = {}): Promise<TypedFlatConfigItem[]> {
  const { a11y } = options

  // Base JSX configuration without a11y
  const baseConfig: TypedFlatConfigItem = {
    files: [GLOB_JSX, GLOB_TSX],
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    name: 'jsx/setup',
    plugins: {},
    rules: {},
  }

  if (!a11y) {
    return [baseConfig]
  }

  await ensurePackages(['eslint-plugin-jsx-a11y'])
  const jsxA11yPlugin = await interopDefault(import('eslint-plugin-jsx-a11y'))
  const a11yConfig = jsxA11yPlugin.flatConfigs.recommended

  const isUsingNext = NextJsPackages.some(i => isPackageExists(i))

  const a11yRules: Rules = {
    ...(a11yConfig.rules || {}),
    'jsx-a11y/alt-text': [
      'error',
      {
        elements: ['img'],
        img: [...(isUsingNext ? ['Image'] : [])],
      },
    ],
    ...(typeof a11y === 'object' && a11y.overrides ? a11y.overrides : {}),
  }

  // Merge base config with a11y configuration
  return [
    {
      ...baseConfig,
      ...a11yConfig,
      files: baseConfig.files,
      languageOptions: {
        ...baseConfig.languageOptions,
        ...a11yConfig.languageOptions,
      },
      name: baseConfig.name,
      plugins: {
        ...baseConfig.plugins,
        'jsx-a11y': jsxA11yPlugin,
      },
      rules: {
        ...baseConfig.rules,
        ...a11yRules,
      },
    },
  ]
}
