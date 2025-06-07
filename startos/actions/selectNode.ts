import { utils } from '@start9labs/start-sdk'
import { configJson } from '../fileModels/config.json'
import { sdk } from '../sdk'
import { generateRpcUserDependent } from 'bitcoind-startos/startos/actions/generateRpcUserDependent'
import { bitcoinCoreJson } from '../fileModels/bitcoin_core.json'

const { InputSpec, Value } = sdk

export const inputSpec = InputSpec.of({
  active_node_alias: Value.select({
    name: 'Node',
    default: 'bitcoin_core',
    values: {
      bitcoin_core: 'Bitcoin',
      spectrum_node: 'electrs',
    },
  }),
})

export const selectNode = sdk.Action.withInput(
  // id
  'select-node',

  // metadata
  async ({ effects }) => ({
    name: 'Select Node',
    description: 'Choose whether Specter connects to Bitcoin or electrs',
    warning: null,
    allowedStatuses: 'any',
    group: null,
    visibility: 'enabled',
  }),

  // form input specification
  inputSpec,

  // optionally pre-fill the input form
  async ({ effects }) => configJson.read().const(effects),

  // the execution function
  async ({ effects, input }) => {
    await configJson.merge(effects, {
      active_node_alias: input.active_node_alias,
    })

    if (
      input.active_node_alias === 'bitcoin_core' &&
      !(await bitcoinCoreJson.read((b) => b.user).const(effects))
    ) {
      const btcUsername = `specter_${utils.getDefaultString({ charset: 'a-z,A-Z', len: 8 })}`
      const btcPassword = utils.getDefaultString({
        charset: 'a-z,A-Z,1-9',
        len: 22,
      })

      await sdk.action.createTask(
        effects,
        'bitcoind',
        generateRpcUserDependent,
        'critical',
        {
          input: {
            kind: 'partial',
            value: {
              username: btcUsername,
              password: btcPassword,
            },
          },
          reason: 'BTC Shell needs an RPC user in Bitcoin',
        },
      )

      await bitcoinCoreJson.merge(effects, {
        user: btcUsername,
        password: btcPassword,
      })
    }
  },
)
