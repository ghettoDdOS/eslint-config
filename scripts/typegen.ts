import fs from 'node:fs/promises'

import { flatConfigsToRulesDTS } from 'eslint-typegen/core'
import { builtinRules } from 'eslint/use-at-your-own-risk'

import { config } from '../src/factory'

const configs = await config({
  formatters: true,
  imports: true,
  jsx: {
    a11y: true,
  },
  jsonc: true,
  markdown: true,
  nextjs: true,
  react: true,
  pnpm: true,
  regexp: true,
  stylistic: true,
  gitignore: true,
  typescript: {
    tsconfigPath: 'tsconfig.json',
    erasableOnly: true,
  },
  test: true,
  unicorn: true,
  unocss: true,
  tailwindcss: true,
  vue: {
    a11y: true,
  },
  yaml: true,
  toml: true,
  effector: {
    future: true,
    patronum: true,
    react: true,
    scope: true,
  },
  reactNative: {
    expo: true,
  },
}).prepend(
  {
    plugins: {
      '': {
        rules: Object.fromEntries(builtinRules.entries()),
      },
    },
  },
)

const configNames = configs.map(i => i.name).filter(Boolean) as string[]

let dts = await flatConfigsToRulesDTS(configs, {
  includeAugmentation: false,
})

dts += `
// Names of all the configs
export type ConfigNames = ${configNames.map(i => `'${i}'`).join(' | ')}
`

await fs.writeFile('src/typegen.d.ts', dts)
