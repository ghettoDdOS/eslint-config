import type { OptionsBaseline, TypedFlatConfigItem } from '../types'
import { pluginBaselineJs } from '../plugins'

export async function baseline(options: OptionsBaseline = {}): Promise<TypedFlatConfigItem[]> {
  const {
    available,
    baseline,
    ignoreFeatures = ['functions-caller-arguments'],
    overrides = {},
  } = options

  return [
    {
      name: 'baseline/rules',
      plugins: {
        'baseline-js': pluginBaselineJs,
      },
      rules: {
        'baseline-js/use-baseline': [
          'warn',
          {
            available,
            baseline,
            ignoreFeatures,
            includeJsBuiltins: { preset: 'auto' },
            includeWebApis: { preset: 'auto' },
            ...options,
          },
        ],

        ...overrides,
      },
    },
  ]
}
