export const ReactRefreshAllowConstantExportPackages = ['vite']
export const RemixPackages = [
  '@remix-run/node',
  '@remix-run/react',
  '@remix-run/serve',
  '@remix-run/dev',
]
export const ReactRouterPackages = [
  '@react-router/node',
  '@react-router/react',
  '@react-router/serve',
  '@react-router/dev',
]
export const NextJsPackages = [
  'next',
]
export const ReactNativePackages = [
  'react-native',
  'expo',
]
export const ReactPackages = [
  ...RemixPackages,
  ...ReactRouterPackages,
  ...NextJsPackages,
  ...ReactNativePackages,
  'react',
]
export const ReactCompilerPackages = [
  'babel-plugin-react-compiler',
]
export const VuePackages = [
  'vue',
  'nuxt',
  'vitepress',
  '@slidev/cli',
]
