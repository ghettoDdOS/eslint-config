import type { Linter } from 'eslint'

import type { RuleOptions } from './typegen'
import type {
  Awaitable,
  ConfigNames,
  OptionsConfig,
  TypedFlatConfigItem,
} from './types'

import { FlatConfigComposer } from 'eslint-flat-config-utils'
import { isPackageExists } from 'local-pkg'

import {
  comments,
  disables,
  effector,
  ignores,
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
  sortPackageJson,
  sortTsconfig,
  stylistic,
  toml,
  typescript,
  unicorn,
  unocss,
  yaml,
} from './configs'
import { formatters } from './configs/formatters'
import { regexp } from './configs/regexp'
import { NextJsPackages, ReactPackages } from './constants'
import { interopDefault, isInEditorEnv } from './utils'

const flatConfigProps = [
  'name',
  'languageOptions',
  'linterOptions',
  'processor',
  'plugins',
  'rules',
  'settings',
] satisfies (keyof TypedFlatConfigItem)[]

export const defaultPluginRenaming = {
  '@eslint-react': 'react',
  '@eslint-react/dom': 'react-dom',
  '@eslint-react/hooks-extra': 'react-hooks-extra',
  '@eslint-react/naming-convention': 'react-naming-convention',

  '@stylistic': 'style',
  '@typescript-eslint': 'ts',
  'import-x': 'import',
  'n': 'node',
  'yml': 'yaml',
}

/**
 * Construct an array of ESLint flat config items.
 *
 * @param {OptionsConfig & TypedFlatConfigItem} options
 *  The options for generating the ESLint configurations.
 * @param {Awaitable<TypedFlatConfigItem | TypedFlatConfigItem[]>[]} userConfigs
 *  The user configurations to be merged with the generated configurations.
 * @returns {Promise<TypedFlatConfigItem[]>}
 *  The merged ESLint configurations.
 */
export function config(
  options: OptionsConfig & Omit<TypedFlatConfigItem, 'files'> = {},
  ...userConfigs: Awaitable<
    | TypedFlatConfigItem
    | TypedFlatConfigItem[]
    | FlatConfigComposer<any, any>
    | Linter.Config[]
  >[]
): FlatConfigComposer<TypedFlatConfigItem, ConfigNames> {
  const isUsingReact = ReactPackages.some(i => isPackageExists(i))
  const {
    autoRenamePlugins = true,
    componentExts = [],
    effector: enableEffector = isPackageExists('effector'),
    gitignore: enableGitignore = true,
    jsx: enableJsx = true,
    jsxA11y: enableJsxA11y = isUsingReact,
    next: enableNext = NextJsPackages.some(i => isPackageExists(i)),
    pnpm: enableCatalogs = false,
    react: enableReact = isUsingReact,
    regexp: enableRegexp = true,
    typescript: enableTypeScript = isPackageExists('typescript'),
    unicorn: enableUnicorn = true,
    unocss: enableUnoCSS = false,
  } = options

  let isInEditor = options.isInEditor
  if (isInEditor == null) {
    isInEditor = isInEditorEnv()
    if (isInEditor) {
      // eslint-disable-next-line no-console
      console.log(
        '[@ghettoddos/eslint-config] Detected running in editor, some rules are disabled.',
      )
    }
  }

  const stylisticOptions
    = options.stylistic === false
      ? false
      : typeof options.stylistic === 'object'
        ? options.stylistic
        : {}

  if (stylisticOptions && !('jsx' in stylisticOptions)) {
    stylisticOptions.jsx = enableJsx
  }

  const configs: Awaitable<TypedFlatConfigItem[]>[] = []

  if (enableGitignore) {
    if (typeof enableGitignore !== 'boolean') {
      configs.push(
        interopDefault(import('eslint-config-flat-gitignore')).then(r => [
          r({
            name: 'gitignore',
            ...enableGitignore,
          }),
        ]),
      )
    }
    else {
      configs.push(
        interopDefault(import('eslint-config-flat-gitignore')).then(r => [
          r({
            name: 'gitignore',
            strict: false,
          }),
        ]),
      )
    }
  }

  const typescriptOptions = resolveSubOptions(options, 'typescript')
  const tsconfigPath
    = 'tsconfigPath' in typescriptOptions
      ? typescriptOptions.tsconfigPath
      : undefined

  // Base configs
  configs.push(
    ignores(options.ignores),
    javascript({
      isInEditor,
      overrides: getOverrides(options, 'javascript'),
    }),
    comments(),
    node(),
    imports({
      stylistic: stylisticOptions,
    }),

    // Optional plugins (installed but not enabled by default)
    perfectionist(),
  )

  if (enableUnicorn) {
    configs.push(unicorn(enableUnicorn === true ? {} : enableUnicorn))
  }

  if (enableJsx) {
    configs.push(jsx())
  }

  if (enableTypeScript) {
    configs.push(
      typescript({
        ...typescriptOptions,
        componentExts,
        overrides: getOverrides(options, 'typescript'),
        type: options.type,
      }),
    )
  }

  if (stylisticOptions) {
    configs.push(
      stylistic({
        ...stylisticOptions,
        overrides: getOverrides(options, 'stylistic'),
      }),
    )
  }

  if (enableRegexp) {
    configs.push(regexp(typeof enableRegexp === 'boolean' ? {} : enableRegexp))
  }

  if (enableReact) {
    configs.push(
      react({
        ...typescriptOptions,
        overrides: getOverrides(options, 'react'),
        tsconfigPath,
      }),
    )
  }

  if (enableJsxA11y) {
    configs.push(
      jsxA11y({
        overrides: getOverrides(options, 'jsxA11y'),
      }),
    )
  }

  if (enableNext) {
    configs.push(
      next({
        overrides: getOverrides(options, 'next'),
      }),
    )
  }

  if (enableEffector) {
    configs.push(
      effector({
        ...resolveSubOptions(options, 'effector'),
        overrides: getOverrides(options, 'effector'),
      }),
    )
  }

  if (enableUnoCSS) {
    configs.push(
      unocss({
        ...resolveSubOptions(options, 'unocss'),
        overrides: getOverrides(options, 'unocss'),
      }),
    )
  }

  if (options.jsonc ?? true) {
    configs.push(
      jsonc({
        overrides: getOverrides(options, 'jsonc'),
        stylistic: stylisticOptions,
      }),
      sortPackageJson(),
      sortTsconfig(),
    )
  }

  if (enableCatalogs) {
    configs.push(
      pnpm(),
    )
  }

  if (options.yaml ?? true) {
    configs.push(
      yaml({
        overrides: getOverrides(options, 'yaml'),
        stylistic: stylisticOptions,
      }),
    )
  }

  if (options.toml ?? true) {
    configs.push(
      toml({
        overrides: getOverrides(options, 'toml'),
        stylistic: stylisticOptions,
      }),
    )
  }

  if (options.markdown ?? true) {
    configs.push(
      markdown({
        componentExts,
        overrides: getOverrides(options, 'markdown'),
      }),
    )
  }

  if (options.formatters) {
    configs.push(
      formatters(
        options.formatters,
        typeof stylisticOptions === 'boolean' ? {} : stylisticOptions,
      ),
    )
  }

  configs.push(disables())

  if ('files' in options) {
    throw new Error(
      '[@ghettoddos/eslint-config] The first argument should not contain the "files" property as the options are supposed to be global. Place it in the second or later config instead.',
    )
  }

  // User can optionally pass a flat config item to the first argument
  // We pick the known keys as ESLint would do schema validation
  const fusedConfig = flatConfigProps.reduce((acc, key) => {
    if (key in options) {
      acc[key] = options[key] as any
    }
    return acc
  }, {} as TypedFlatConfigItem)
  if (Object.keys(fusedConfig).length) {
    configs.push([fusedConfig])
  }

  let composer = new FlatConfigComposer<TypedFlatConfigItem, ConfigNames>()

  composer = composer.append(...configs, ...(userConfigs as any))

  if (autoRenamePlugins) {
    composer = composer.renamePlugins(defaultPluginRenaming)
  }

  if (isInEditor) {
    composer = composer.disableRulesFix(
      ['unused-imports/no-unused-imports', 'prefer-const'],
      {
        builtinRules: () =>
          import(['eslint', 'use-at-your-own-risk'].join('/')).then(
            r => r.builtinRules,
          ),
      },
    )
  }

  return composer
}

export type ResolvedOptions<T> = T extends boolean ? never : NonNullable<T>

export function resolveSubOptions<K extends keyof OptionsConfig>(
  options: OptionsConfig,
  key: K,
): ResolvedOptions<OptionsConfig[K]> {
  return typeof options[key] === 'boolean'
    ? ({} as any)
    : options[key] || ({} as any)
}

export function getOverrides<K extends keyof OptionsConfig>(
  options: OptionsConfig,
  key: K,
): Partial<Linter.RulesRecord & RuleOptions> {
  const sub = resolveSubOptions(options, key)
  return {
    ...(options.overrides as any)?.[key],
    ...('overrides' in sub ? sub.overrides : {}),
  }
}
