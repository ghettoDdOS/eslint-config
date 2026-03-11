import type {
  OptionsFiles,
  OptionsReactNative,
  TypedFlatConfigItem,
} from '../types'

import globals from 'globals'
import { isPackageExists } from 'local-pkg'

import { GLOB_SRC } from '../globs'
import { ensurePackages, interopDefault } from '../utils'

export async function reactNative(
  options: OptionsReactNative & OptionsFiles
    = {},
): Promise<TypedFlatConfigItem[]> {
  const {
    expo = isPackageExists('expo'),
    files = [GLOB_SRC],
    overrides = {},
  } = options

  await ensurePackages([
    '@react-native/eslint-plugin',
    'eslint-plugin-react-native',
    ...expo ? ['eslint-plugin-expo'] : [],
  ])

  const [
    pluginReactNative,
    pluginReactNativeCommunity,
    pluginExpo,
  ] = await Promise.all([
    interopDefault(import('@react-native/eslint-plugin')),
    interopDefault(import('eslint-plugin-react-native')),
    ...expo ? [interopDefault(import('eslint-plugin-expo'))] : [],
  ] as const)

  return [
    {
      name: 'react-native/setup',
      plugins: {
        'react-native': pluginReactNative,
        'react-native-community': pluginReactNativeCommunity,
        ...expo ? { expo: pluginExpo } : {},
      },
    },
    {
      files,
      languageOptions: {
        globals: {
          ...globals.browser,
          '__DEV__': 'readonly',
          'alert': false,
          'cancelAnimationFrame': false,
          'cancelIdleCallback': false,
          'clearImmediate': false,
          'ErrorUtils': false,
          'fetch': false,
          'FormData': false,
          'navigator': false,
          'process': false,
          'requestAnimationFrame': false,
          'requestIdleCallback': false,
          'setImmediate': false,
          'shared-node-browser': true,
          'window': false,
          'XMLHttpRequest': false,
        },
        parserOptions: {
          ecmaFeatures: {
            jsx: true,
          },
        },
        sourceType: 'module',
      },
      name: 'react-native/rules',
      rules: {
        'node/prefer-global/process': 'off',

        'react-native-community/no-inline-styles': 'warn',
        'react-native-community/no-raw-text': 'warn',
        'react-native-community/no-single-element-style-arrays': 'warn',
        'react-native-community/no-unused-styles': 'warn',

        'react-native/no-deep-imports': 'error',

        'ts/no-require-imports': [
          'warn',
          {
          // Allow supported asset extensions:
          // https://github.com/facebook/metro/blob/9e1a6da5a7cd71bb9243f45644efe655870e5fff/packages/metro-config/src/defaults/defaults.js#L18-L53
          // https://github.com/expo/expo/blob/c774cfaa7898098411fc7e09dcb409b7cb5064f9/packages/%40expo/metro-config/src/ExpoMetroConfig.ts#L247-L254
          // Includes json which can be imported both as source and asset.
            allow: [
              '\\.(aac|aiff|avif|bmp|caf|db|gif|heic|html|jpeg|jpg|json|m4a|m4v|mov|mp3|mp4|mpeg|mpg|otf|pdf|png|psd|svg|ttf|wav|webm|webp|xml|yaml|yml|zip)$',
            ],
          },
        ],

        ...expo
          ? {
              'expo/no-dynamic-env-var': 'error',
              'expo/no-env-var-destructuring': 'error',
              'expo/use-dom-exports': 'error',
            }
          : {},

        ...overrides,
      },
      settings: {
        react: {
          version: 'detect',
        },
      },
    },
  ]
}
