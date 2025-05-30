import type { StylisticCustomizeOptions } from '@stylistic/eslint-plugin'
import type { ParserOptions } from '@typescript-eslint/parser'
import type { Linter } from 'eslint'
import type { FlatGitignoreOptions } from 'eslint-config-flat-gitignore'

import type { ConfigNames, RuleOptions } from './typegen'
import type { VendoredPrettierOptions } from './vendor/prettier-types'

export type Awaitable<T> = T | Promise<T>

export interface Rules extends RuleOptions {}

export type { ConfigNames }

export type TypedFlatConfigItem = Omit<
  Linter.Config<Linter.RulesRecord & Rules>,
  'plugins'
> & {
  // Relax plugins type limitation, as most of the plugins did not have correct type info yet.
  /**
   * An object containing a name-value mapping of plugin names to plugin objects. When `files` is specified, these plugins are only available to the matching files.
   *
   * @see [Using plugins in your configuration](https://eslint.org/docs/latest/user-guide/configuring/configuration-files-new#using-plugins-in-your-configuration)
   */
  plugins?: Record<string, any>
}

export interface OptionsFiles {
  /**
   * Override the `files` option to provide custom globs.
   */
  files?: string[]
}

export type OptionsTypescript =
  | (OptionsTypeScriptWithTypes & OptionsOverrides)
  | (OptionsTypeScriptParserOptions & OptionsOverrides)

export interface OptionsFormatters {
  /**
   * Enable formatting support for CSS, Less, Sass, and SCSS.
   *
   * Currently only support Prettier.
   */
  css?: 'prettier' | boolean

  /**
   * Enable formatting support for HTML.
   *
   * Currently only support Prettier.
   */
  html?: 'prettier' | boolean

  /**
   * Enable formatting support for XML.
   *
   * Currently only support Prettier.
   */
  xml?: 'prettier' | boolean

  /**
   * Enable formatting support for SVG.
   *
   * Currently only support Prettier.
   */
  svg?: 'prettier' | boolean

  /**
   * Enable formatting support for Markdown.
   *
   * Currently only support Prettier.
   */
  markdown?: 'prettier' | boolean

  /**
   * Custom options for Prettier.
   *
   * By default it's controlled by our own config.
   */
  prettierOptions?: VendoredPrettierOptions
}

export interface OptionsComponentExts {
  /**
   * Additional extensions for components.
   *
   * @example ['vue']
   * @default []
   */
  componentExts?: string[]
}

export interface OptionsUnicorn extends OptionsOverrides {
  /**
   * Include all rules recommended by `eslint-plugin-unicorn`, instead of only ones picked by author.
   *
   * @default false
   */
  allRecommended?: boolean
}

export interface OptionsEffector extends OptionsOverrides {
  /**
   * Include react rules.
   *
   * @default auto-detect based on the dependencies
   */
  react?: boolean
  /**
   * Include patronum rules.
   *
   * @default auto-detect based on the dependencies
   */
  patronum?: boolean
  /**
   * Include future rules.
   *
   * @default false
   */
  future?: boolean
  /**
   * Include scope rules.
   *
   * @default false
   */
  scope?: boolean
}

export interface OptionsTypeScriptParserOptions {
  /**
   * Additional parser options for TypeScript.
   */
  parserOptions?: Partial<ParserOptions>

  /**
   * Glob patterns for files that should be type aware.
   * @default ['**\/*.{ts,tsx}']
   */
  filesTypeAware?: string[]

  /**
   * Glob patterns for files that should not be type aware.
   * @default ['**\/*.md\/**']
   */
  ignoresTypeAware?: string[]
}

export interface OptionsTypeScriptWithTypes {
  /**
   * When this options is provided, type aware rules will be enabled.
   * @see https://typescript-eslint.io/linting/typed-linting/
   */
  tsconfigPath?: string

  /**
   * Override type aware rules.
   */
  overridesTypeAware?: TypedFlatConfigItem['rules']
}

export interface OptionsHasTypeScript {
  typescript?: boolean
}

export interface OptionsStylistic {
  stylistic?: boolean | StylisticConfig
}

export interface StylisticConfig
  extends Pick<
    StylisticCustomizeOptions,
    'indent' | 'quotes' | 'jsx' | 'semi'
  > {}

export interface OptionsOverrides {
  overrides?: TypedFlatConfigItem['rules']
}

export interface OptionsProjectType {
  /**
   * Type of the project. `lib` will enable more strict rules for libraries.
   *
   * @default 'app'
   */
  type?: 'app' | 'lib'
}

export interface OptionsRegExp {
  /**
   * Override rulelevels
   */
  level?: 'error' | 'warn'
}

export interface OptionsIsInEditor {
  isInEditor?: boolean
}

export interface OptionsUnoCSS extends OptionsOverrides {
  /**
   * Enable attributify support.
   * @default true
   */
  attributify?: boolean
  /**
   * Enable strict mode by throwing errors about blocklisted classes.
   * @default false
   */
  strict?: boolean
}

export interface OptionsFSDPublicApi extends OptionsOverrides {
  /**
   * Without SegmentsAPI / InnerAPI restrictions.
   * @default true
   */
  lite?: boolean
}

export interface OptionsFSD {
  /**
   * FSD Public API rules.
   * @see https://github.com/feature-sliced/eslint-config/tree/master/rules/public-api
   * @default true
   */
  publicApi?: boolean | OptionsFSDPublicApi
  /**
   * FSD Layers slices rules.
   * @see https://github.com/feature-sliced/eslint-config/tree/master/rules/layers-slices
   * @default true
   */
  layersSlices?: boolean | OptionsOverrides
}

export interface OptionsConfig
  extends OptionsComponentExts,
  OptionsProjectType {
  /**
   * Enable gitignore support.
   *
   * Passing an object to configure the options.
   *
   * @see https://github.com/antfu/eslint-config-flat-gitignore
   * @default true
   */
  gitignore?: boolean | FlatGitignoreOptions

  /**
   * Core rules. Can't be disabled.
   */
  javascript?: OptionsOverrides

  /**
   * Enable TypeScript support.
   *
   * Passing an object to enable TypeScript Language Server support.
   *
   * @default auto-detect based on the dependencies
   */
  typescript?: boolean | OptionsTypescript

  /**
   * Enable JSX related rules.
   *
   * Currently only stylistic rules are included.
   *
   * @default true
   */
  jsx?: boolean

  /**
   * Options for eslint-plugin-unicorn.
   *
   * @default true
   */
  unicorn?: boolean | OptionsUnicorn

  /**
   * Enable JSONC support.
   *
   * @default true
   */
  jsonc?: boolean | OptionsOverrides

  /**
   * Enable YAML support.
   *
   * @default true
   */
  yaml?: boolean | OptionsOverrides

  /**
   * Enable TOML support.
   *
   * @default true
   */
  toml?: boolean | OptionsOverrides

  /**
   * Enable linting for **code snippets** in Markdown.
   *
   * For formatting Markdown content, enable also `formatters.markdown`.
   *
   * @default true
   */
  markdown?: boolean | OptionsOverrides

  /**
   * Enable stylistic rules.
   *
   * @see https://eslint.style/
   * @default true
   */
  stylistic?: boolean | (StylisticConfig & OptionsOverrides)

  /**
   * Enable regexp rules.
   *
   * @see https://ota-meshi.github.io/eslint-plugin-regexp/
   * @default true
   */
  regexp?: boolean | (OptionsRegExp & OptionsOverrides)

  /**
   * Enable react rules.
   *
   * @default auto-detect based on the dependencies
   */
  react?: boolean | OptionsOverrides

  /**
   * Enable jsxA11y rules.
   *
   * @default auto-detect based on the react dependencies
   */
  jsxA11y?: boolean | OptionsOverrides

  /**
   * Enable next rules.
   *
   * @default auto-detect based on the dependencies
   */
  next?: boolean | OptionsOverrides

  /**
   * Enable effector rules.
   *
   * Requires installing:
   * - `eslint-plugin-effector`
   *
   * @default auto-detect based on the dependencies
   */
  effector?: boolean | OptionsEffector

  /**
   * Enable unocss rules.
   *
   * Requires installing:
   * - `@unocss/eslint-plugin`
   *
   * @default false
   */
  unocss?: boolean | OptionsUnoCSS

  /**
   * Enable pnpm (workspace/catalogs) support.
   *
   * Currently it's disabled by default, as it's still experimental.
   * In the future it will be smartly enabled based on the project usage.
   *
   * @see https://github.com/antfu/pnpm-workspace-utils
   * @experimental
   * @default false
   */
  pnpm?: boolean

  /**
   * Enable FSD rules.
   *
   * @see https://feature-sliced.github.io/
   * @default false
   */
  fsd?: boolean | OptionsFSD

  /**
   * Use external formatters to format files.
   *
   * Requires installing:
   * - `eslint-plugin-format`
   *
   * When set to `true`, it will enable all formatters.
   *
   * @default false
   */
  formatters?: boolean | OptionsFormatters

  /**
   * Control to disable some rules in editors.
   * @default auto-detect based on the process.env
   */
  isInEditor?: boolean

  /**
   * Automatically rename plugins in the config.
   *
   * @default true
   */
  autoRenamePlugins?: boolean

  /**
   * Provide overrides for rules for each integration.
   *
   * @deprecated use `overrides` option in each integration key instead
   */
  overrides?: {
    stylistic?: TypedFlatConfigItem['rules']
    javascript?: TypedFlatConfigItem['rules']
    typescript?: TypedFlatConfigItem['rules']
    jsonc?: TypedFlatConfigItem['rules']
    markdown?: TypedFlatConfigItem['rules']
    yaml?: TypedFlatConfigItem['rules']
    toml?: TypedFlatConfigItem['rules']
    react?: TypedFlatConfigItem['rules']
  }
}
