import type { OptionsOverrides, TypedFlatConfigItem } from '../types'
import pluginSonarJs from 'eslint-plugin-sonarjs'

export async function sonarjs(options: OptionsOverrides = {}): Promise<TypedFlatConfigItem[]> {
  return [
    {
      name: 'sonarjs/rules',
      plugins: {
        sonarjs: pluginSonarJs,
      },
      rules: {
        ...(pluginSonarJs!.configs!.recommended as any).rules,
        ...options.overrides,
      },
    },
  ]
}
