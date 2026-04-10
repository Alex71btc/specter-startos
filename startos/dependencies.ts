import { sdk } from './sdk'
import { configJson } from './fileModels/config.json'

export const setDependencies = sdk.setupDependencies(async ({ effects }) => {
  const config = await configJson.read((v) => v).const(effects).catch(() => null)

  if (config?.active_node_alias === 'spectrum_node') {
    return {
      electrs: {
        kind: 'exists',
        versionRange: '>=0.10.0',
      },
    }
  }

  return {
    bitcoind: {
      kind: 'exists',
      versionRange: '>=29.0',
    },
  }
})
