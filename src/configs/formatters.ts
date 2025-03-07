import type {
  OptionsFormatters,
  StylisticConfig,
  TypedFlatConfigItem,
} from '../types'
import type {
  VendoredPrettierOptions,
  VendoredPrettierRuleOptions,
} from '../vendor/prettier-types'

import {
  GLOB_CSS,
  GLOB_HTML,
  GLOB_MARKDOWN,
  GLOB_POSTCSS,
  GLOB_SCSS,
  GLOB_SVG,
  GLOB_XML,
} from '../globs'
import {
  ensurePackages,
  interopDefault,
  isPackageInScope,
  parserPlain,
} from '../utils'
import { StylisticConfigDefaults } from './stylistic'

function mergePrettierOptions(
  options: VendoredPrettierOptions,
  overrides: VendoredPrettierRuleOptions = {},
): VendoredPrettierRuleOptions {
  return {
    ...options,
    ...overrides,
    plugins: [...(overrides.plugins || []), ...(options.plugins || [])],
  }
}

export async function formatters(
  options: OptionsFormatters | true = {},
  stylistic: StylisticConfig = {},
): Promise<TypedFlatConfigItem[]> {
  if (options === true) {
    const isPrettierPluginXmlInScope = isPackageInScope('@prettier/plugin-xml')
    options = {
      css: true,
      html: true,
      markdown: true,
      svg: isPrettierPluginXmlInScope,
      xml: isPrettierPluginXmlInScope,
    }
  }

  await ensurePackages([
    'eslint-plugin-format',
    options.xml || options.svg ? '@prettier/plugin-xml' : undefined,
  ])

  const { indent, quotes, semi } = {
    ...StylisticConfigDefaults,
    ...stylistic,
  }

  const prettierOptions: VendoredPrettierOptions = Object.assign(
    {
      endOfLine: 'auto',
      printWidth: 120,
      semi,
      singleQuote: quotes === 'single',
      tabWidth: typeof indent === 'number' ? indent : 2,
      trailingComma: 'all',
      useTabs: indent === 'tab',
    } satisfies VendoredPrettierOptions,
    options.prettierOptions || {},
  )

  const prettierXmlOptions: VendoredPrettierOptions = {
    xmlQuoteAttributes: 'double',
    xmlSelfClosingSpace: true,
    xmlSortAttributesByKey: false,
    xmlWhitespaceSensitivity: 'ignore',
  }

  const pluginFormat = await interopDefault(import('eslint-plugin-format'))

  const configs: TypedFlatConfigItem[] = [
    {
      name: 'formatter/setup',
      plugins: {
        format: pluginFormat,
      },
    },
  ]

  if (options.css) {
    configs.push(
      {
        files: [GLOB_CSS, GLOB_POSTCSS],
        languageOptions: {
          parser: parserPlain,
        },
        name: 'formatter/css',
        rules: {
          'format/prettier': [
            'error',
            mergePrettierOptions(prettierOptions, {
              parser: 'css',
            }),
          ],
        },
      },
      {
        files: [GLOB_SCSS],
        languageOptions: {
          parser: parserPlain,
        },
        name: 'formatter/scss',
        rules: {
          'format/prettier': [
            'error',
            mergePrettierOptions(prettierOptions, {
              parser: 'scss',
            }),
          ],
        },
      },
    )
  }

  if (options.html) {
    configs.push({
      files: [GLOB_HTML],
      languageOptions: {
        parser: parserPlain,
      },
      name: 'formatter/html',
      rules: {
        'format/prettier': [
          'error',
          mergePrettierOptions(prettierOptions, {
            parser: 'html',
          }),
        ],
      },
    })
  }

  if (options.xml) {
    configs.push({
      files: [GLOB_XML],
      languageOptions: {
        parser: parserPlain,
      },
      name: 'formatter/xml',
      rules: {
        'format/prettier': [
          'error',
          mergePrettierOptions(
            { ...prettierXmlOptions, ...prettierOptions },
            {
              parser: 'xml',
              plugins: ['@prettier/plugin-xml'],
            },
          ),
        ],
      },
    })
  }
  if (options.svg) {
    configs.push({
      files: [GLOB_SVG],
      languageOptions: {
        parser: parserPlain,
      },
      name: 'formatter/svg',
      rules: {
        'format/prettier': [
          'error',
          mergePrettierOptions(
            { ...prettierXmlOptions, ...prettierOptions },
            {
              parser: 'xml',
              plugins: ['@prettier/plugin-xml'],
            },
          ),
        ],
      },
    })
  }

  if (options.markdown) {
    configs.push({
      files: [GLOB_MARKDOWN],
      languageOptions: {
        parser: parserPlain,
      },
      name: 'formatter/markdown',
      rules: {
        'format/prettier': [
          'error',
          mergePrettierOptions(prettierOptions, {
            embeddedLanguageFormatting: 'off',
            parser: 'markdown',
          }),
        ],
      },
    })
  }

  return configs
}
