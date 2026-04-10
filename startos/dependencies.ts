import { sdk } from './sdk'
import { configJson } from './fileModels/config.json'

export const setDependencies = sdk.setupDependencies(async ({ effects }) => {
  const config = await configJson.read((v) => v).const(effects).catch(() => null)

  if (!config?.active_node_alias) {
    return {}
  }

  if (config.active_node_alias === 'spectrum_node') {
    if (config.spectrum_backend === 'fulcrum') {
      return {
        fulcrum: {
          kind: 'running',
          versionRange: '>=1.0.0',
          healthChecks: [],
        },
      }
    }

    return {
      electrs: {
        kind: 'running',
        versionRange: '>=0.10.0',
        healthChecks: [],
      },
    }
  }

  return {
    bitcoind: {
      kind: 'running',
      versionRange: '>=29.0',
      healthChecks: [],
    },
  }
})
