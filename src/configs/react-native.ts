import type {
  OptionsFiles,
  OptionsReactNative,
  TypedFlatConfigItem,
} from '../types'

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
          '__DEV__': 'readonly',
          '__fbBatchedBridgeConfig': false,
          'Blob': true,
          'clearImmediate': true,
          'document': false,
          'ErrorUtils': false,
          'exports': false,
          'File': true,
          'Map': true,
          'navigator': false,
          'Promise': true,
          'queueMicrotask': true,
          'requestAnimationFrame': true,
          'requestIdleCallback': true,
          'Set': true,
          'setImmediate': true,
          'shared-node-browser': true,
          'WebSocket': true,
          'window': false,
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
        'ts/no-require-imports': 'off',

        ...expo
          ? {
              'expo/no-dynamic-env-var': 'error',
              'expo/no-env-var-destructuring': 'error',
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
