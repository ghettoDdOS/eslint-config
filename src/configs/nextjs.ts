import type { OptionsFiles, OptionsOverrides, TypedFlatConfigItem } from '../types'

import { GLOB_SRC } from '../globs'
import { ensurePackages, interopDefault } from '../utils'

export async function nextjs(
  options: OptionsOverrides & OptionsFiles = {},
): Promise<TypedFlatConfigItem[]> {
  const {
    files = [GLOB_SRC],
    overrides = {},
  } = options

  await ensurePackages(['@next/eslint-plugin-next'])

  const pluginNextJS = await interopDefault(import('@next/eslint-plugin-next'))

  return [
    {
      name: 'next/setup',
      plugins: {
        next: pluginNextJS,
      },
    },
    {
      files,
      languageOptions: {
        parserOptions: {
          ecmaFeatures: {
            jsx: true,
          },
        },
        sourceType: 'module',
      },
      name: 'next/rules',
      rules: {
        'next/google-font-display': 'warn',
        'next/google-font-preconnect': 'warn',
        'next/inline-script-id': 'error',
        'next/next-script-for-ga': 'warn',
        'next/no-assign-module-variable': 'error',
        'next/no-async-client-component': 'warn',
        'next/no-before-interactive-script-outside-document': 'warn',
        'next/no-css-tags': 'warn',
        'next/no-document-import-in-page': 'error',
        'next/no-duplicate-head': 'error',
        'next/no-head-element': 'warn',
        'next/no-head-import-in-document': 'error',
        'next/no-html-link-for-pages': 'warn',
        'next/no-img-element': 'warn',
        'next/no-page-custom-font': 'warn',
        'next/no-script-component-in-head': 'error',
        'next/no-styled-jsx-in-document': 'warn',
        'next/no-sync-scripts': 'warn',
        'next/no-title-in-document-head': 'warn',
        'next/no-typos': 'warn',
        'next/no-unwanted-polyfillio': 'warn',

        ...overrides,
      },
      settings: {
        react: {
          version: 'detect',
        },
      },
    },
  ]
}
