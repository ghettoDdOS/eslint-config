# @ghettoddos/eslint-config

[![npm](https://img.shields.io/npm/v/@ghettoddos/eslint-config?color=444&label=)](https://npmjs.com/package/@ghettoddos/eslint-config)

- Auto fix for formatting (aimed to be used standalone **without** Prettier)
- Reasonable defaults, best practices, only one line of config
- Designed to work with TypeScript, JSX, React, JSON, YAML, Toml, Markdown, etc. Out-of-box.
- Opinionated, but [very customizable](#customization)
- [ESLint Flat config](https://eslint.org/docs/latest/use/configure/configuration-files-new), compose easily!
- Optional [UnoCSS](#unocss) support
- Optional [formatters](#formatters) support for formatting CSS, HTML, XML, etc.
- **Style principle**: Minimal for reading, stable for diff, consistent
  - Sorted imports, dangling commas
  - Single quotes, no semi
  - Using [ESLint Stylistic](https://github.com/eslint-stylistic/eslint-stylistic)
- Respects `.gitignore` by default
- Requires ESLint v9.5.0+

> Thanks to [antfu/eslint-config](https://github.com/antfu/eslint-config) for the inspiration and reference.

## Usage

### Manual Install

If you prefer to set up manually:

```bash
pnpm i -D eslint @ghettoddos/eslint-config
```

And create `eslint.config.mjs` in your project root:

```js
// eslint.config.mjs
import config from '@ghettoddos/eslint-config'

export default config()
```

### Add script for package.json

For example:

```json
{
  "scripts": {
    "lint": "eslint",
    "lint:fix": "eslint --fix"
  }
}
```

## IDE Support (auto fix on save)

<details>
<summary>🟦 VS Code support</summary>

<br>

Install [VS Code ESLint extension](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)

Add the following settings to your `.vscode/settings.json`:

```jsonc
{
  // Disable the default formatter, use eslint instead
  "prettier.enable": false,
  "editor.formatOnSave": false,

  // Auto fix
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit",
    "source.organizeImports": "never"
  },

  // Silent the stylistic rules in you IDE, but still auto fix them
  "eslint.rules.customizations": [
    { "rule": "style/*", "severity": "off", "fixable": true },
    { "rule": "format/*", "severity": "off", "fixable": true },
    { "rule": "*-indent", "severity": "off", "fixable": true },
    { "rule": "*-spacing", "severity": "off", "fixable": true },
    { "rule": "*-spaces", "severity": "off", "fixable": true },
    { "rule": "*-order", "severity": "off", "fixable": true },
    { "rule": "*-dangle", "severity": "off", "fixable": true },
    { "rule": "*-newline", "severity": "off", "fixable": true },
    { "rule": "*quotes", "severity": "off", "fixable": true },
    { "rule": "*semi", "severity": "off", "fixable": true }
  ],

  // Enable eslint for all supported languages
  "eslint.validate": [
    "javascript",
    "javascriptreact",
    "typescript",
    "typescriptreact",
    "html",
    "markdown",
    "json",
    "jsonc",
    "yaml",
    "toml",
    "xml",
    "css",
    "less",
    "scss",
    "pcss",
    "postcss"
  ]
}
```

</details>

<details>
<summary>🟦 Zed support</summary>

<br>

Add the following settings to your `.zed/settings.json`:

```jsonc
{
  // Disable the default formatter, use eslint instead
  "format_on_save": "on",

  // Auto fix
  "formatter": {
    "code_actions": {
      "source.fixAll.eslint": true,
      "source.organizeImports": false
    }
  },

  // Silent the stylistic rules in you IDE, but still auto fix them
  "lsp": {
    "eslint": {
      "settings": {
        "rulesCustomizations": [
          { "rule": "style/*", "severity": "off", "fixable": true },
          { "rule": "format/*", "severity": "off", "fixable": true },
          { "rule": "*-indent", "severity": "off", "fixable": true },
          { "rule": "*-spacing", "severity": "off", "fixable": true },
          { "rule": "*-spaces", "severity": "off", "fixable": true },
          { "rule": "*-order", "severity": "off", "fixable": true },
          { "rule": "*-dangle", "severity": "off", "fixable": true },
          { "rule": "*-newline", "severity": "off", "fixable": true },
          { "rule": "*quotes", "severity": "off", "fixable": true },
          { "rule": "*semi", "severity": "off", "fixable": true }
        ]
      }
    }
  },

  // Enable eslint for all supported languages
  "languages": {
    "JavaScript": { "language_servers": ["...", "eslint"] },
    "TypeScript": { "language_servers": ["...", "eslint"] },
    "TSX": { "language_servers": ["...", "eslint"] },
    "Vue.js": { "language_servers": ["...", "eslint"] },
    "HTML": { "language_servers": ["...", "eslint"] },
    "Markdown": { "language_servers": ["...", "eslint"] },
    "JSON": { "language_servers": ["...", "eslint"] },
    "JSONC": { "language_servers": ["...", "eslint"] },
    "YAML": { "language_servers": ["...", "eslint"] },
    "TOML": { "language_servers": ["...", "eslint"] },
    "XML": { "language_servers": ["...", "eslint"] },
    "CSS": { "language_servers": ["...", "eslint"] },
    "SCSS": { "language_servers": ["...", "eslint"] }
  }
}
```

</details>

## Customization

Normally you only need to import the `config` preset:

```js
// eslint.config.js
import config from '@ghettoddos/eslint-config'

export default config()
```

And that's it! Or you can configure each integration individually, for example:

```js
// eslint.config.js
import config from '@ghettoddos/eslint-config'

export default config({
  // Type of the project. 'lib' for libraries, the default is 'app'
  type: 'lib',

  // Enable stylistic formatting rules
  // stylistic: true,

  // Or customize the stylistic rules
  stylistic: {
    indent: 2, // 4, or 'tab'
    quotes: 'single', // or 'double'
  },

  // TypeScript are autodetected, you can also explicitly enable them:
  typescript: true,

  // Disable jsonc and yaml support
  jsonc: false,
  yaml: false,

  // `.eslintignore` is no longer supported in Flat config, use `ignores` instead
  ignores: [
    '**/fixtures',
    // ...globs
  ],
})
```

The `config` factory function also accepts any number of arbitrary custom config overrides:

```js
// eslint.config.js
import config from '@ghettoddos/eslint-config'

export default config(
  {
    // Configures for config
  },

  // From the second arguments they are ESLint Flat Configs
  // you can have multiple configs
  {
    files: ['**/*.ts'],
    rules: {},
  },
  {
    rules: {},
  },
)
```

Going more advanced, you can also import fine-grained configs and compose them as you wish:

<details>
<summary>Advanced Example</summary>

We wouldn't recommend using this style in general unless you know exactly what they are doing, as there are shared options between configs and might need extra care to make them consistent.

```js
// eslint.config.js
import {
  combine,
  comments,
  ignores,
  imports,
  javascript,
  jsonc,
  markdown,
  node,
  sortPackageJson,
  sortTsconfig,
  stylistic,
  toml,
  typescript,
  unicorn,
  yaml,
} from '@ghettoddo/eslint-config'

export default combine(
  ignores(),
  javascript(/* Options */),
  comments(),
  node(),
  imports(),
  unicorn(),
  typescript(/* Options */),
  stylistic(),
  jsonc(),
  yaml(),
  toml(),
  markdown(),
)
```

</details>

Check out the [configs](https://github.com/ghettoDdOS/eslint-config/blob/master/src/configs) and [factory](https://github.com/ghettoDdOS/eslint-config/blob/master/src/factory.ts) for more details.

> Thanks to [sxzz/eslint-config](https://github.com/sxzz/eslint-config) for the inspiration and reference.

### Plugins Renaming

Since flat config requires us to explicitly provide the plugin names (instead of the mandatory convention from npm package name), we renamed some plugins to make the overall scope more consistent and easier to write.

| New Prefix | Original Prefix        | Source Plugin                                                                              |
| ---------- | ---------------------- | ------------------------------------------------------------------------------------------ |
| `import/*` | `import-lite/*`        | [eslint-plugin-import-lite](https://github.com/9romise/eslint-plugin-import-lite)          |
| `node/*`   | `n/*`                  | [eslint-plugin-n](https://github.com/eslint-community/eslint-plugin-n)                     |
| `yaml/*`   | `yml/*`                | [eslint-plugin-yml](https://github.com/ota-meshi/eslint-plugin-yml)                        |
| `ts/*`     | `@typescript-eslint/*` | [@typescript-eslint/eslint-plugin](https://github.com/typescript-eslint/typescript-eslint) |
| `style/*`  | `@stylistic/*`         | [@stylistic/eslint-plugin](https://github.com/eslint-stylistic/eslint-stylistic)           |

When you want to override rules, or disable them inline, you need to update to the new prefix:

```diff
-// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
+// eslint-disable-next-line ts/consistent-type-definitions
type foo = { bar: 2 }
```

> [!NOTE]
> About plugin renaming - it is actually rather a dangrous move that might leading to potential naming collisions, pointed out [here](https://github.com/eslint/eslint/discussions/17766) and [here](https://github.com/prettier/eslint-config-prettier#eslintconfigjs-flat-config-plugin-caveat). As this config also very **personal** and **opinionated**, I ambitiously position this config as the only **"top-level"** config per project, that might pivots the taste of how rules are named.
>
> This config cares more about the user-facings DX, and try to ease out the implementation details. For example, users could keep using the semantic `import/order` without ever knowing the underlying plugin has migrated twice to `eslint-plugin-i` and then to `eslint-plugin-import-x`. User are also not forced to migrate to the implicit `i/order` halfway only because we swapped the implementation to a fork.
>
> That said, it's probably still not a good idea. You might not want to doing this if you are maintaining your own eslint config.
>
> Feel free to open issues if you want to combine this config with some other config presets but faced naming collisions. I am happy to figure out a way to make them work. But at this moment I have no plan to revert the renaming.

This preset will automatically rename the plugins also for your custom configs. You can use the original prefix to override the rules directly.

<details>
<summary>Change back to original prefix</summary>

If you really want to use the original prefix, you can revert the plugin renaming by:

```ts
import config from '@ghettoddos/eslint-config'

export default config().renamePlugins({
  ts: '@typescript-eslint',
  yaml: 'yml',
  node: 'n',
  // ...
})
```

</details>

### Rules Overrides

Certain rules would only be enabled in specific files, for example, `ts/*` rules would only be enabled in `.ts` files. If you want to override the rules, you need to specify the file extension:

```js
// eslint.config.js
import config from '@ghettoddos/eslint-config'

export default config(
  {
    typescript: true,
  },
  {
    // Without `files`, they are general rules for all files
    rules: {
      'style/semi': ['error', 'never'],
    },
  },
)
```

We also provided the `overrides` options in each integration to make it easier:

```js
// eslint.config.js
import config from '@ghettoddos/eslint-config'

export default config({
  typescript: {
    overrides: {
      'ts/consistent-type-definitions': ['error', 'interface'],
    },
  },
  yaml: {
    overrides: {
      // ...
    },
  },
})
```

### Config Composer

The factory function `config()` returns a [`FlatConfigComposer` object from `eslint-flat-config-utils`](https://github.com/antfu/eslint-flat-config-utils#composer) where you can chain the methods to compose the config even more flexibly.

```js
// eslint.config.js
import config from '@ghettoddos/eslint-config'

export default config()
  .prepend
  // some configs before the main config
  ()
  // overrides any named configs
  .override('stylistic/rules', {
    rules: {
      'style/generator-star-spacing': ['error', { after: true, before: false }],
    },
  })
  // rename plugin prefixes
  .renamePlugins({
    'old-prefix': 'new-prefix',
    // ...
  })
// ...
```

#### React

React support is detected automatically by checking if `react` is installed in your project. You can also explicitly enable/disable it:

```js
// eslint.config.js
import config from '@ghettoddos/eslint-config'

export default config({
  react: true,
})
```

### Optional Configs

We provide some optional configs for specific use cases, that we don't include their dependencies by default.

#### Formatters

Use external formatters to format files that ESLint cannot handle yet (`.css`, `.html`, etc). Powered by [`eslint-plugin-format`](https://github.com/antfu/eslint-plugin-format).

```js
// eslint.config.js
import config from '@ghettoddos/eslint-config'

export default config({
  formatters: {
    /**
     * Format CSS, LESS, SCSS files, also the `<style>` blocks in Vue
     * By default uses Prettier
     */
    css: true,
    /**
     * Format HTML files
     * By default uses Prettier
     */
    html: true,
    /**
     * Format Markdown files
     * By default uses Prettier
     */
    markdown: 'prettier',
  },
})
```

Running `npx eslint` should prompt you to install the required dependencies, otherwise, you can install them manually:

```bash
npm i -D eslint-plugin-format
```

#### UnoCSS

To enable UnoCSS support, you need to explicitly turn it on:

```js
// eslint.config.js
import config from '@ghettoddos/eslint-config'

export default config({
  unocss: true,
})
```

Running `npx eslint` should prompt you to install the required dependencies, otherwise, you can install them manually:

```bash
npm i -D @unocss/eslint-plugin
```

### Type Aware Rules

You can optionally enable the [type aware rules](https://typescript-eslint.io/linting/typed-linting/) by passing the options object to the `typescript` config:

```js
// eslint.config.js
import config from '@ghettoddos/eslint-config'

export default config({
  typescript: {
    tsconfigPath: 'tsconfig.json',
  },
})
```

### Editor Specific Disables

Auto-fixing for the following rules are disabled when ESLint is running in a code editor:

- [`prefer-const`](https://eslint.org/docs/rules/prefer-const)
- [`unused-imports/no-unused-imports`](https://www.npmjs.com/package/eslint-plugin-unused-imports)

They are no disabled, but made non-fixable using [this helper](https://github.com/antfu/eslint-flat-config-utils#composerdisablerulesfix).

This is to prevent unused imports from getting removed by the editor during refactoring to get a better developer experience. Those rules will be applied when you run ESLint in the terminal or [Lint Staged](#lint-staged). If you don't want this behavior, you can disable them:

```js
// eslint.config.js
import config from '@ghettoddos/eslint-config'

export default config({
  isInEditor: false,
})
```

### Lint Staged

If you want to apply lint and auto-fix before every commit, you can add the following to your `package.json`:

```json
{
  "simple-git-hooks": {
    "pre-commit": "pnpm lint-staged"
  },
  "lint-staged": {
    "*": "eslint --fix"
  }
}
```

and then

```bash
npm i -D lint-staged simple-git-hooks

// to active the hooks
npx simple-git-hooks
```

## View what rules are enabled

I built a visual tool to help you view what rules are enabled in your project and apply them to what files, [@eslint/config-inspector](https://github.com/eslint/config-inspector)

Go to your project root that contains `eslint.config.js` and run:

```bash
npx @eslint/config-inspector
```

## Versioning Policy

This project follows [Semantic Versioning](https://semver.org/) for releases. However, since this is just a config and involves opinions and many moving parts, we don't treat rules changes as breaking changes.

### Changes Considered as Breaking Changes

- Node.js version requirement changes
- Huge refactors that might break the config
- Plugins made major changes that might break the config
- Changes that might affect most of the codebases

### Changes Considered as Non-breaking Changes

- Enable/disable rules and plugins (that might become stricter)
- Rules options changes
- Version bumps of dependencies

## FAQ

### Prettier?

[Why I don't use Prettier](https://antfu.me/posts/why-not-prettier)

Well, you can still use Prettier to format files that are not supported well by ESLint yet, such as `.css`, `.html`, etc. See [formatters](#formatters) for more details.

### How to format CSS?

You can opt-in to the [`formatters`](#formatters) feature to format your CSS. Note that it's only doing formatting, but not linting. If you want proper linting support, give [`stylelint`](https://stylelint.io/) a try.

### I prefer XXX...

Sure, you can configure and override rules locally in your project to fit your needs. If that still does not work for you, you can always fork this repo and maintain your own.

## Check Also

- [antfu/eslint-config](https://github.com/antfu/eslint-config) - Original repo

## License

[MIT](./LICENSE) License &copy; 2025-PRESENT [ghettoDdOS](https://github.com/ghettoDdOS)
