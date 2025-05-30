import type { OptionsOverrides, TypedFlatConfigItem } from '../types'

import { isPackageExists } from 'local-pkg'

import { NextJsPackages } from '../constants'
import { ensurePackages, interopDefault } from '../utils'

export async function jsxA11y(options: OptionsOverrides = {}): Promise<TypedFlatConfigItem[]> {
  const { overrides = {} } = options

  await ensurePackages(['eslint-plugin-jsx-a11y'])

  const [pluginJsxA11y] = await Promise.all([
    interopDefault(import('eslint-plugin-jsx-a11y')),
  ] as const)

  const isUsingNext = NextJsPackages.some(i => isPackageExists(i))

  return [
    {
      name: 'jsx-a11y/rules',
      plugins: {
        'jsx-a11y': pluginJsxA11y,
      },
      rules: {
        'jsx-a11y/alt-text': [
          'warn',
          {
            elements: ['img'],
            img: [
              ...(isUsingNext
                ? [
                    'Image',
                  ]
                : []
              ),
            ],
          },
        ],
        'jsx-a11y/aria-props': 'warn',
        'jsx-a11y/aria-proptypes': 'warn',
        'jsx-a11y/aria-unsupported-elements': 'warn',
        'jsx-a11y/role-has-required-aria-props': 'warn',
        'jsx-a11y/role-supports-aria-props': 'warn',

        ...overrides,
      },
    },
  ]
}
