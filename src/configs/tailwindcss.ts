import type {
  OptionsStylistic,
  OptionsTailwindCSS,
  OptionsTypeScriptWithTypes,
  TypedFlatConfigItem,
} from '../types'

import { ensurePackages, interopDefault } from '../utils'

// Hold the reference so we don't redeclare the plugin on each call
let _pluginTailwindCSS: any

export async function tailwindcss(
  options: OptionsTailwindCSS & OptionsStylistic & OptionsTypeScriptWithTypes,
): Promise<TypedFlatConfigItem[]> {
  const {
    detectComponentClasses,
    entryPoint,
    overrides = {},
    rootFontSize,
    selectors,
    stylistic = true,
    tsconfigPath,
  } = options

  await ensurePackages(['eslint-plugin-better-tailwindcss'])

  const [pluginTailwindCSS] = await Promise.all([
    interopDefault(import('eslint-plugin-better-tailwindcss')),
  ] as const)

  _pluginTailwindCSS = _pluginTailwindCSS || {
    ...pluginTailwindCSS,
    rules: {
      ...pluginTailwindCSS.rules,
      // https://github.com/schoero/eslint-plugin-better-tailwindcss/issues/269
      'multiline-classname': {
        create(context: any) {
          return {
            JSXAttribute(node: any) {
              if (node.name?.type !== 'JSXIdentifier')
                return
              if (node.name.name !== 'className')
                return
              if (
                node.value?.type === 'Literal'
                && typeof node.value.value === 'string'
                && node.value.value.includes('\n')
              ) {
                const raw = node.value.value

                context.report({
                  fix(fixer: any) {
                    const escaped = raw.replace(/`/g, '\\`').replace(/\$\{/g, '\\${')
                    return fixer.replaceText(node.value, `{\`${escaped}\`}`)
                  },
                  message:
                    'Multiline className strings can cause hydration errors. '
                    + 'Use a template literal/expression instead.',
                  node: node.value,
                })
              }
            },
          }
        },
        meta: {
          fixable: 'code',
          schema: [],
          type: 'suggestion',
        },
      },
    },
  }

  const {
    indent = 2,
    printWidth = 100,
    tabWidth = 4,
  } = typeof stylistic === 'boolean' ? {} : stylistic

  return [
    {
      name: 'tailwindcss',
      plugins: {
        'better-tailwindcss': _pluginTailwindCSS,
      },
      rules: {
        // recommended rules stylistics rules from eslint-plugin-better-tailwindcss https://github.com/schoero/eslint-plugin-better-tailwindcss/tree/main?tab=readme-ov-file#stylistic-rules
        ...(stylistic
          ? {
              ...pluginTailwindCSS.configs.stylistic.rules,
              'better-tailwindcss/enforce-consistent-line-wrapping': [
                'warn',
                {
                  indent: typeof indent === 'number' ? indent : indent === 'tab' ? 'tab' : 2,
                  printWidth,
                  tabWidth: typeof indent === 'number' ? indent : indent === 'tab' ? tabWidth : 2,
                },
              ],
              'better-tailwindcss/multiline-classname': 'error',
            }
          : {}),

        // recommended rules correctness rules from eslint-plugin-better-tailwindcss https://github.com/schoero/eslint-plugin-better-tailwindcss/tree/main?tab=readme-ov-file#correctness-rules
        ...pluginTailwindCSS.configs.correctness.rules,

        ...overrides,
      },
      settings: {
        'better-tailwindcss': {
          detectComponentClasses,
          entryPoint,
          rootFontSize,
          selectors,
          tsconfig: tsconfigPath,
        },
      },
    },
  ]
}
