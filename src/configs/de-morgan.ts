import type { TypedFlatConfigItem } from '../types'
import { pluginDeMorgan } from '../plugins'

export async function deMorgan(): Promise<TypedFlatConfigItem[]> {
  return [
    {
      ...pluginDeMorgan.configs.recommended,
      name: 'de-morgan/rules',
    },
  ]
}
