import type { OptionsEffector, TypedFlatConfigItem } from '../types'

import { fixupPluginRules } from '@eslint/compat'
import { isPackageExists } from 'local-pkg'

import { ReactPackages } from '../constants'
import { ensurePackages, interopDefault } from '../utils'

export async function effector(
  options: OptionsEffector = {},
): Promise<TypedFlatConfigItem[]> {
  const {
    future = false,
    overrides = {},
    patronum = isPackageExists('patronum'),
    react = ReactPackages.some(i => isPackageExists(i)),
    scope = false,
  } = options

  await ensurePackages(['eslint-plugin-effector'])

  const [pluginEffector] = await Promise.all([
    interopDefault(import('eslint-plugin-effector')),
  ] as const)

  return [
    {
      name: 'effector/setup',
      plugins: {
        effector: fixupPluginRules(pluginEffector),
      },
    },
    {
      name: 'effector/rules',
      rules: {
        'effector/enforce-effect-naming-convention': 'error',
        'effector/enforce-store-naming-convention': 'error',
        'effector/keep-options-order': 'warn',
        'effector/no-ambiguity-target': 'warn',
        'effector/no-duplicate-on': 'error',
        'effector/no-getState': 'error',
        'effector/no-unnecessary-combination': 'warn',
        'effector/no-unnecessary-duplication': 'warn',
        'effector/no-useless-methods': 'error',
        'effector/no-watch': 'warn',
        'effector/prefer-sample-over-forward-with-mapping': 'warn',

        ...(react
          ? {
              'effector/enforce-gate-naming-convention': 'error',
              'effector/mandatory-scope-binding': 'error',
              'effector/prefer-useUnit': 'warn',
            }
          : {}),

        ...(patronum
          ? {
              'effector/no-patronum-debug': 'error',
            }
          : {}),

        ...(scope
          ? {
              'effector/require-pickup-in-persist': 'error',
              'effector/strict-effect-handlers': 'error',
            }
          : {}),

        ...(future
          ? {
              'effector/no-forward': 'warn',
              'effector/no-guard': 'warn',
              'effector/prefer-sample-over-forward-with-mapping': 'off',
            }
          : {}),

        ...overrides,
      },
    },
  ]
}
