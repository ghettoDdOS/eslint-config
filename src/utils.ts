import type { Linter } from 'eslint'

import type { RuleOptions } from './typegen'
import type { Awaitable, TypedFlatConfigItem } from './types'

import process from 'node:process'
import { fileURLToPath } from 'node:url'

import { isPackageExists } from 'local-pkg'

const scopeUrl = fileURLToPath(new URL('.', import.meta.url))
const isCwdInScope = isPackageExists('@ghettoddos/eslint-config')

export const parserPlain = {
  meta: {
    name: 'parser-plain',
  },
  parseForESLint: (code: string) => ({
    ast: {
      body: [],
      comments: [],
      loc: { end: code.length, start: 0 },
      range: [0, code.length],
      tokens: [],
      type: 'Program',
    },
    scopeManager: null,
    services: { isPlain: true },
    visitorKeys: {
      Program: [],
    },
  }),
}

/**
 * Combine array and non-array configs into a single array.
 */
export async function combine(
  ...configs: Awaitable<TypedFlatConfigItem | TypedFlatConfigItem[]>[]
): Promise<TypedFlatConfigItem[]> {
  const resolved = await Promise.all(configs)
  return resolved.flat()
}

/**
 * Rename plugin prefixes in a rule object.
 * Accepts a map of prefixes to rename.
 *
 * @example
 * ```ts
 * import { renameRules } from '@ghettoddos/eslint-config'
 *
 * export default [{
 *   rules: renameRules(
 *     {
 *       '@typescript-eslint/indent': 'error'
 *     },
 *     { '@typescript-eslint': 'ts' }
 *   )
 * }]
 * ```
 */
export function renameRules(
  rules: Record<string, any>,
  map: Record<string, string>,
): Record<string, any> {
  return Object.fromEntries(
    Object.entries(rules).map(([key, value]) => {
      for (const [from, to] of Object.entries(map)) {
        if (key.startsWith(`${from}/`)) {
          return [to + key.slice(from.length), value]
        }
      }
      return [key, value]
    }),
  )
}

export async function interopDefault<T>(
  m: Awaitable<T>,
): Promise<T extends { default: infer U } ? U : T> {
  const resolved = await m
  return (resolved as any).default || resolved
}

export function isPackageInScope(name: string): boolean {
  return isPackageExists(name, { paths: [scopeUrl] })
}

export async function ensurePackages(
  packages: (string | undefined)[],
): Promise<void> {
  if (
    process.env.CI
    || process.stdout.isTTY === false
    || isCwdInScope === false
  ) {
    return
  }

  const nonExistingPackages = packages.filter(
    i => i && !isPackageInScope(i),
  ) as string[]
  if (nonExistingPackages.length === 0) {
    return
  }

  const p = await import('@clack/prompts')
  const result = await p.confirm({
    message: `${
      nonExistingPackages.length === 1 ? 'Package is' : 'Packages are'
    } required for this config: ${nonExistingPackages.join(
      ', ',
    )}. Do you want to install them?`,
  })
  if (result) {
    await import('@antfu/install-pkg').then(i =>
      i.installPackage(nonExistingPackages, { dev: true }),
    )
  }
}

export function isInEditorEnv(): boolean {
  if (process.env.CI) {
    return false
  }
  if (isInGitHooksOrLintStaged()) {
    return false
  }
  return !!(
    false
    || process.env.VSCODE_PID
    || process.env.VSCODE_CWD
    || process.env.JETBRAINS_IDE
    || process.env.VIM
    || process.env.NVIM
  )
}

export function isInGitHooksOrLintStaged(): boolean {
  return !!(
    false
    || process.env.GIT_PARAMS
    || process.env.VSCODE_GIT_COMMAND
    || process.env.npm_lifecycle_script?.startsWith('lint-staged')
  )
}

export type ResolvedOptions<T> = T extends boolean ? never : NonNullable<T>

export function resolveSubOptions<
  C extends Record<string, any>,
  K extends keyof C,
>(
  options: C,
  key: K,
): ResolvedOptions<C[K]> {
  return typeof options[key] === 'boolean'
    ? ({} as any)
    : options[key] || ({} as any)
}

export function getOverrides<
  C extends Record<string, any>,
  K extends keyof C,
>(
  options: C,
  key: K,
): Partial<Linter.RulesRecord & RuleOptions> {
  const sub = resolveSubOptions(options, key)
  return {
    ...(options.overrides as any)?.[key],
    ...('overrides' in sub ? sub.overrides : {}),
  }
}
