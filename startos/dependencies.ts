import { T } from '@start9labs/start-sdk'
import { configJson } from './fileModels/config.json'
import { sdk } from './sdk'
import { manifest } from './manifest'
import { config } from 'bitcoind-startos/startos/actions/config/config'
import { rpcConfig } from 'bitcoind-startos/startos/actions/config/rpc'

export const setDependencies = sdk.setupDependencies(async ({ effects }) => {
  const active_node_alias = await configJson
    .read((c) => c.active_node_alias)
    .const(effects)

  if (!active_node_alias)
    return {} as T.CurrentDependenciesResult<typeof manifest>

  if (active_node_alias === 'bitcoin_core') {
    await sdk.action.createTask(effects, 'bitcoind', config, 'critical', {
      input: {
        kind: 'partial',
        value: {
          prune: 0,
          wallet: { enable: true },
          blockfilters: { blockfilterindex: true },
        },
      },
      when: { condition: 'input-not-matches', once: false },
      reason: 'Pruning must be disabled. Wallet must be enabled.',
    })

    await sdk.action.createTask(effects, 'bitcoind', rpcConfig, 'critical', {
      input: { kind: 'partial', value: { threads: 4 } },
      when: { condition: 'input-not-matches', once: false },
      reason: 'Bitcoin RPC must use 4 or more threads',
    })

    return {
      bitcoind: {
        kind: 'running',
        versionRange: '>=29.0',
        healthChecks: ['synced'],
      },
    }
  } else {
    return {
      electrs: {
        kind: 'running',
        versionRange: '>=0.10.8:1',
        healthChecks: ['synced'],
      },
    }
  }
})
