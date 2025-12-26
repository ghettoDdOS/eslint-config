import type { OptionsConfig } from './types'

// @keep-sorted
export const CONFIG_PRESET_FULL_ON: OptionsConfig = {
  effector: { future: true, patronum: true, react: true, scope: true },
  formatters: true,
  gitignore: true,
  imports: true,
  jsdoc: true,
  jsonc: true,
  jsx: {
    a11y: true,
  },
  markdown: true,
  nextjs: true,
  node: true,
  pnpm: true,
  react: {
    reactCompiler: true,
  },
  reactNative: { expo: true },
  regexp: true,
  stylistic: {
    experimental: true,
  },
  tailwindcss: true,
  test: true,
  toml: true,
  typescript: {
    erasableOnly: true,
    tsconfigPath: 'tsconfig.json',
  },
  unicorn: true,
  unocss: true,
  vue: {
    a11y: true,
  },
  yaml: true,
}

export const CONFIG_PRESET_FULL_OFF: OptionsConfig = {
  effector: false,
  formatters: false,
  gitignore: false,
  imports: false,
  jsdoc: false,
  jsonc: false,
  jsx: false,
  markdown: false,
  nextjs: false,
  node: false,
  pnpm: false,
  react: false,
  reactNative: false,
  regexp: false,
  stylistic: false,
  tailwindcss: false,
  test: false,
  toml: false,
  typescript: false,
  unicorn: false,
  unocss: false,
  vue: false,
  yaml: false,
}
