import type { OptionsFSD, TypedFlatConfigItem } from '../types'

import { ensurePackages, getOverrides, interopDefault, resolveSubOptions } from '../utils'

const FS_LAYERS = [
  'app',
  'processes',
  'pages',
  'widgets',
  'features',
  'entities',
  'shared',
]

const FS_SEGMENTS = ['ui', 'model', 'lib', 'api', 'config', 'assets']

function getLowerLayers(layer: string): string[] {
  return FS_LAYERS.slice(FS_LAYERS.indexOf(layer) + 1)
}
function getUpperLayers(layer: string): string[] {
  return FS_LAYERS.slice(0, FS_LAYERS.indexOf(layer))
}

const FS_SLICED_LAYERS_REG = getUpperLayers('shared').join('|')
const FS_SEGMENTS_REG = [
  ...FS_SEGMENTS,
  ...FS_SEGMENTS.map(seg => `${seg}.*`),
].join('|')

function getNotSharedLayersRules(): any[] {
  return getUpperLayers('shared').map(layer => ({
    allow: getLowerLayers(layer),
    from: layer,
  }))
}

const slicelessLayerRules = [
  {
    allow: 'shared',
    from: 'shared',
  },
  {
    allow: 'app',
    from: 'app',
  },
]

function getLayersBoundariesElements(): any[] {
  return FS_LAYERS.map(layer => ({
    capture: ['slices'],
    mode: 'folder',
    pattern: `${layer}/!(_*){,/*}`,
    type: layer,
  }))
}

function getGodModeRules(): any[] {
  return FS_LAYERS.map(layer => ({
    allow: [layer, ...getLowerLayers(layer)],
    from: `gm_${layer}`,
  }))
}

function getGodModeElements(): any[] {
  return FS_LAYERS.map(layer => ({
    capture: ['slices'],
    mode: 'folder',
    pattern: `${layer}/_*`,
    type: `gm_${layer}`,
  }))
}

export async function fsd(
  options: OptionsFSD = {},
): Promise<TypedFlatConfigItem[]> {
  const {
    layersSlices: enableLayersSlices = true,
    publicApi: enablePublicApi = true,
  } = options

  const configs: TypedFlatConfigItem[] = []

  if (enablePublicApi) {
    const { lite = true } = resolveSubOptions(options, 'publicApi')
    configs.push({
      name: 'fsd/public-api',
      rules: {
        'import/no-internal-modules': [
          'error',
          {
            allow: [
              `**/*(${FS_SLICED_LAYERS_REG})/!(${FS_SEGMENTS_REG})`,
              `**/*(${FS_SLICED_LAYERS_REG})/!(${FS_SEGMENTS_REG})/!(${FS_SEGMENTS_REG})`,
              `**/*shared/*(${FS_SEGMENTS_REG})/!(${FS_SEGMENTS_REG})`,
              `**/*shared/*(${FS_SEGMENTS_REG})`,
              `**/node_modules/**`,
              `**/*shared/_*`,
              `**/*shared/_*/*`,
              ...(lite ? [`./**`] : []),
            ],
          },
        ],

        ...getOverrides(options, 'publicApi'),
      },
    })
  }

  if (enableLayersSlices) {
    await ensurePackages(['eslint-plugin-boundaries'])

    const [pluginBoundaries] = await Promise.all([
      interopDefault(import('eslint-plugin-boundaries')),
    ])

    configs.push({
      name: 'fsd/layers-slices',
      plugins: {
        boundaries: pluginBoundaries,
      },
      rules: {
        ...pluginBoundaries.configs.recommended.rules,
        'boundaries/element-types': [
          2,
          {
            default: 'disallow',
            // eslint-disable-next-line no-template-curly-in-string
            message: '"${file.type}" is not allowed to import "${dependency.type}" | See rules: https://feature-sliced.design/docs/reference/layers/overview ',
            rules: [
              ...getNotSharedLayersRules(),
              ...slicelessLayerRules,
              ...getGodModeRules(),
            ],
          },
        ],
        ...getOverrides(options, 'layersSlices'),
      },
      settings: {
        'boundaries/elements': [
          ...getLayersBoundariesElements(),
          ...getGodModeElements(),
        ],
      },
    })
  }

  return configs
}
