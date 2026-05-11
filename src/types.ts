import type { StylisticCustomizeOptions } from '@stylistic/eslint-plugin'
import type { ParserOptions } from '@typescript-eslint/parser'
import type { Linter } from 'eslint'
import type { FlatGitignoreOptions } from 'eslint-config-flat-gitignore'
import type { ConfigWithExtends } from 'eslint-flat-config-utils'
import type { Selector } from 'eslint-plugin-better-tailwindcss/types'
import type { Options as VueBlocksOptions } from 'eslint-processor-vue-blocks'
import type { ConfigNames, RuleOptions } from './typegen'
import type { VendoredPrettierOptions } from './vendor/prettier-types'

export type Awaitable<T> = T | Promise<T>

export type Rules = Record<string, Linter.RuleEntry<any> | undefined> & RuleOptions

export type { ConfigNames, RuleOptions }

/**
 * An updated version of ESLint's `Linter.Config`, which provides autocompletion
 * for `rules` and relaxes type limitations for `plugins` and `rules`, because
 * many plugins still lack proper type definitions.
 */
export type TypedFlatConfigItem = Omit<ConfigWithExtends, 'plugins' | 'rules'> & {
  /**
   * An object containing a name-value mapping of plugin names to plugin objects.
   * When `files` is specified, these plugins are only available to the matching files.
   *
   * @see [Using plugins in your configuration](https://eslint.org/docs/latest/user-guide/configuring/configuration-files-new#using-plugins-in-your-configuration)
   */
  plugins?: Record<string, any>

  /**
   * An object containing the configured rules. When `files` or `ignores` are
   * specified, these rule configurations are only available to the matching files.
   */
  rules?: Rules
}

export interface OptionsFiles {
  /**
   * Override the `files` option to provide custom globs.
   */
  files?: string[]
}

export interface OptionsVue extends OptionsOverrides {
  /**
   * Create virtual files for Vue SFC blocks to enable linting.
   *
   * @see https://github.com/antfu/eslint-processor-vue-blocks
   * @default true
   */
  sfcBlocks?: boolean | VueBlocksOptions

  /**
   * Vue version. Apply different rules set from `eslint-plugin-vue`.
   *
   * @default 3
   */
  vueVersion?: 2 | 3

  /**
   * Vue accessibility plugin. Help check a11y issue in `.vue` files upon enabled
   *
   * @see https://vue-a11y.github.io/eslint-plugin-vuejs-accessibility/
   * @default false
   */
  a11y?: boolean
}

export interface OptionsJSXA11y extends OptionsOverrides {
  // Add future a11y-specific options here
}

export interface OptionsJSX {
  /**
   * Enable JSX accessibility rules.
   *
   * Requires installing:
   * - `eslint-plugin-jsx-a11y`
   *
   * Can be a boolean or an object for custom options and overrides.
   * @default false
   */
  a11y?: boolean | OptionsJSXA11y
}

export type OptionsTypescript
  = (OptionsTypeScriptWithTypes & OptionsOverrides & OptionsTypeScriptErasableOnly)
    | (OptionsTypeScriptParserOptions & OptionsOverrides & OptionsTypeScriptErasableOnly)

export interface OptionsFormatters {
  /**
   * Enable formatting support for CSS, Less, Sass, and SCSS.
   */
  css?: boolean

  /**
   * Enable formatting support for HTML.
   */
  html?: boolean

  /**
   * Enable formatting support for XML.
   */
  xml?: boolean

  /**
   * Enable formatting support for SVG.
   */
  svg?: boolean

  /**
   * Enable formatting support for Markdown.
   */
  markdown?: boolean

  /**
   * Enable formatting support for GraphQL.
   */
  graphql?: boolean

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

export interface OptionsBaseline extends OptionsOverrides {
  baseline?: 'widely' | 'newly' | number
  available?: 'widely' | 'newly' | number
  ignoreFeatures?: string[]
}

export interface OptionsE18e extends OptionsOverrides {
  /**
   * Include modernization rules
   *
   * @see https://github.com/e18e/eslint-plugin#modernization
   * @default true
   */
  modernization?: boolean
  /**
   * Include module replacements rules
   *
   * @see https://github.com/e18e/eslint-plugin#module-replacements
   * @default type === 'lib' && isInEditor
   */
  moduleReplacements?: boolean
  /**
   * Include performance improvements rules
   *
   * @see https://github.com/e18e/eslint-plugin#performance-improvements
   * @default true
   */
  performanceImprovements?: boolean
}

export interface OptionsUnicorn extends OptionsOverrides {
  /**
   * Include all rules recommended by `eslint-plugin-unicorn`, instead of only ones picked by Anthony.
   *
   * @default false
   */
  allRecommended?: boolean
}

export interface OptionsMarkdown extends OptionsOverrides {
  /**
   * Enable GFM (GitHub Flavored Markdown) support.
   *
   * @default true
   */
  gfm?: boolean

  /**
   * Override rules for markdown itself.
   */
  overridesMarkdown?: TypedFlatConfigItem['rules']
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
'indent' | 'quotes' | 'jsx' | 'semi' | 'braceStyle' | 'experimental'
  > {
  /**
   * Specify the maximum line length.
   * @default 100
   */
  printWidth?: number
  /**
   * Specify the character width for tab characters.
   * @default 4
   */
  tabWidth?: number
}

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

export interface OptionsTypeScriptErasableOnly {
  /**
   * Enable erasable syntax only rules.
   *
   * @see https://github.com/JoshuaKGoldberg/eslint-plugin-erasable-syntax-only
   * @default false
   */
  erasableOnly?: boolean
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

export interface OptionsPnpm extends OptionsIsInEditor {
  /**
   * Requires catalogs usage
   *
   * Detects automatically based if `catalogs` is used in the pnpm-workspace.yaml file
   */
  catalogs?: boolean

  /**
   * Enable linting for package.json, will install the jsonc parser
   *
   * @default true
   */
  json?: boolean

  /**
   * Enable linting for pnpm-workspace.yaml, will install the yaml parser
   *
   * @default true
   */
  yaml?: boolean

  /**
   * Sort entries in pnpm-workspace.yaml
   *
   * @default false
   */
  sort?: boolean
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

export interface OptionsTailwindCSS extends OptionsOverrides {
  /**
   * The path to the entry file of the css based tailwind config
   *
   * @see https://github.com/schoero/eslint-plugin-better-tailwindcss/blob/main/docs/settings/settings.md#entrypoint
   * @example `src/global.css`
   */
  entryPoint: string
  /**
   * Tailwind CSS v4 allows you to define custom component classes like card, btn, badge etc.
   *
   * @see https://github.com/schoero/eslint-plugin-better-tailwindcss/blob/main/docs/settings/settings.md#detectcomponentclasses
   * @default false
   */
  detectComponentClasses?: boolean
  /**
   * The font size of the <html> element in pixels.
   *
   * @see https://github.com/schoero/eslint-plugin-better-tailwindcss/blob/main/docs/settings/settings.md#rootfontsize
   * @default 16
   */
  rootFontSize?: number
  /**
   * Flat list of selectors that determines where Tailwind class strings are linted.
   *
   * @see https://github.com/schoero/eslint-plugin-better-tailwindcss/blob/main/docs/settings/settings.md#selectors
   */
  selectors?: Selector[]
}

export interface OptionsReact extends OptionsOverrides {
}

export interface OptionsConfig extends OptionsComponentExts, OptionsProjectType {
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
   * Extend the global ignores.
   *
   * Passing an array to extends the ignores.
   * Passing a function to modify the default ignores.
   *
   * @default []
   */
  ignores?: string[] | ((originals: string[]) => string[])

  /**
   * Disable some opinionated rules to Anthony's preference.
   *
   * Including:
   * - `antfu/top-level-function`
   * - `antfu/if-newline`
   *
   * @default false
   */
  lessOpinionated?: boolean

  /**
   * Core rules. Can't be disabled.
   */
  javascript?: OptionsOverrides

  /**
   * Enable Node.js rules
   *
   * @default true
   */
  node?: boolean

  /**
   * Enable JSDoc rules
   *
   * @default true
   */
  jsdoc?: boolean

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
   * Passing an object to enable JSX accessibility rules.
   *
   * @default true
   */
  jsx?: boolean | OptionsJSX

  /**
   * Options for [eslint-plugin-baseline-js](https://github.com/3ru/eslint-plugin-baseline-js)
   *
   * @default false
   */
  baseline?: boolean | OptionsBaseline

  /**
   * Options for [eslint-plugin-sonarjs](https://npmx.dev/package/eslint-plugin-sonarjs)
   *
   * @default false
   */
  sonarjs?: boolean | OptionsOverrides

  /**
   * Options for [@e18e/eslint-plugin](https://github.com/e18e/eslint-plugin)
   *
   * @default true
   */
  e18e?: boolean | OptionsE18e

  /**
   * Options for eslint-plugin-unicorn.
   *
   * @default true
   */
  unicorn?: boolean | OptionsUnicorn

  /**
   * Options for eslint-plugin-perfectionist.
   *
   * @default true
   */
  perfectionist?: boolean | OptionsOverrides

  /**
   * Options for eslint-plugin-import-lite.
   *
   * @default true
   */
  imports?: boolean | OptionsOverrides

  /**
   * Enable test support.
   *
   * @default true
   */
  test?: boolean | OptionsOverrides

  /**
   * Enable Vue support.
   *
   * Requires installing:
   * - `eslint-plugin-vue`
   * - `eslint-processor-vue-blocks`
   * - `vue-eslint-parser`
   *
   * @default auto-detect based on the dependencies
   */
  vue?: boolean | OptionsVue

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
   * Enable linting for **code snippets** in Markdown and the markdown content itself.
   *
   * For formatting Markdown content, enable also `formatters.markdown`.
   *
   * @default true
   */
  markdown?: boolean | OptionsMarkdown

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
   * Requires installing:
   * - `@eslint-react/eslint-plugin`
   * - `eslint-plugin-react-refresh`
   *
   * @default auto-detect based on the dependencies
   */
  react?: boolean | OptionsReact

  /**
   * Enable nextjs rules.
   *
   * Requires installing:
   * - `@next/eslint-plugin-next`
   *
   * @default auto-detect based on the dependencies
   */
  nextjs?: boolean | OptionsOverrides

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
   * Enable tailwindcss rules.
   *
   * Requires installing:
   * - `eslint-plugin-better-tailwindcss`
   *
   * @default false
   */
  tailwindcss?: false | OptionsTailwindCSS

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
  pnpm?: boolean | OptionsPnpm

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
}
