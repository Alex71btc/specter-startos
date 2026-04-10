import { utils } from '@start9labs/start-sdk'
import { sdk } from '../sdk'
import { bitcoindGenerateRpcUserDependent } from './bitcoindGenerateRpcUserDependent'
import { configJson } from '../fileModels/config.json'
import { bitcoinCoreJson } from '../fileModels/bitcoin_core.json'

const { InputSpec, Value } = sdk

export const inputSpec = InputSpec.of({
  active_node_alias: Value.select({
    name: 'Node',
    default: 'bitcoin_core',
    values: {
      bitcoin_core: 'Bitcoin Core / Knots',
    },
  }),
})

export const selectNode = sdk.Action.withInput(
  'select-node',
  async () => ({
    name: 'Select Node',
    description: 'Choose the Bitcoin backend for Specter',
    warning: null,
    allowedStatuses: 'any',
    group: null,
    visibility: 'enabled',
  }),
  inputSpec,
  async () => ({ active_node_alias: 'bitcoin_core' as const }),
  async ({ effects }) => {
    const btcUsername = `specter_${utils.getDefaultString({
      charset: 'a-z,A-Z',
      len: 8,
    })}`
    const btcPassword = utils.getDefaultString({
      charset: 'a-z,A-Z,1-9,_,-',
      len: 22,
    })

    await sdk.action.createTask(
      effects,
      'bitcoind',
      bitcoindGenerateRpcUserDependent,
      'critical',
      {
        input: {
          kind: 'partial',
          value: {
            username: btcUsername,
            password: btcPassword,
          },
        },
        reason: 'Specter needs dependency-scoped Bitcoin RPC credentials.',
      },
    )

    await configJson.merge(effects, {
      active_node_alias: 'bitcoin_core',
      bitcoind: true,
    })

    await bitcoinCoreJson.write(effects, {
      python_class: 'cryptoadvance.specter.node.Node',
      fullpath: '/root/.specter/nodes/bitcoin_core.json',
      name: 'Bitcoin Core',
      alias: 'bitcoin_core',
      autodetect: false,
      datadir: '',
      user: btcUsername,
      password: btcPassword,
      port: '8332',
      host: 'bitcoind.startos',
      protocol: 'http',
      node_type: 'BTC',
    })
  },
)
