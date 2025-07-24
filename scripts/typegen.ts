import fs from 'node:fs/promises'

import { flatConfigsToRulesDTS } from 'eslint-typegen/core'
import { builtinRules } from 'eslint/use-at-your-own-risk'

import {
  combine,
  comments,
  effector,
  formatters,
  imports,
  javascript,
  jsonc,
  jsx,
  jsxA11y,
  markdown,
  next,
  node,
  perfectionist,
  pnpm,
  react,
  regexp,
  sortPackageJson,
  stylistic,
  toml,
  typescript,
  unicorn,
  unocss,
  vue,
  yaml,
} from '../src'

const configs = await combine(
  {
    plugins: {
      '': {
        rules: Object.fromEntries(builtinRules.entries()),
      },
    },
  },
  comments(),
  formatters(),
  imports(),
  javascript(),
  jsx(),
  jsonc(),
  markdown(),
  node(),
  perfectionist(),
  pnpm(),
  react(),
  sortPackageJson(),
  stylistic(),
  toml(),
  regexp(),
  typescript(),
  unicorn(),
  unocss(),
  vue(),
  yaml(),
  next(),
  jsxA11y(),
  effector(),
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
