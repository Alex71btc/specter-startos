import { utils } from '@start9labs/start-sdk'
import { generateRpcUserDependent } from 'bitcoin-core-startos/startos/actions/generateRpcUserDependent'
import { bitcoinCoreJson } from '../fileModels/bitcoin_core.json'
import { configJson } from '../fileModels/config.json'
import { spectrumNodeJson } from '../fileModels/spectrum_node.json'
import { i18n } from '../i18n'
import { sdk } from '../sdk'

const { InputSpec, Value, Variants } = sdk

type SpectrumBackend = 'electrs' | 'fulcrum'

// host is left unset here so no fake dependency address is persisted: main.ts
// fills in the dependency's live LXC-bridge host before the daemon reads the
// file, and writes nothing while the dependency is absent — Specter then just
// fails to connect until the dependency installs and main heals the address.
const BITCOIN_NODE_DEFAULTS = {
  python_class: 'cryptoadvance.specter.node.Node',
  fullpath: '/data/.specter/nodes/bitcoin_core.json',
  name: 'Bitcoin Core',
  alias: 'bitcoin_core',
  autodetect: false,
  datadir: '',
  port: '8332',
  protocol: 'http',
  node_type: 'BTC',
} as const

const SPECTRUM_NODE_DEFAULTS = {
  python_class: 'cryptoadvance.specterext.spectrum.spectrum_node.SpectrumNode',
  fullpath: '/data/.specter/nodes/spectrum_node.json',
  name: 'Spectrum Node',
  alias: 'spectrum_node',
  port: 50001,
  ssl: false,
} as const

export const inputSpec = InputSpec.of({
  node: Value.union({
    name: i18n('Node'),
    description: i18n(
      '- Bitcoin RPC: Specter talks to your Bitcoin node directly, with no indexer. Importing or rescanning a wallet walks the block range.\n- Spectrum Node: Specter queries an Electrum server, Fulcrum or electrs, which indexes addresses, so wallet imports and rescans are faster. It is experimental and currently less reliable than Bitcoin RPC.',
    ),
    default: 'bitcoin_core',
    variants: Variants.of({
      bitcoin_core: {
        name: i18n('Bitcoin RPC (recommended)'),
        spec: InputSpec.of({}),
      },
      spectrum_node: {
        name: i18n('Spectrum Node (experimental)'),
        spec: InputSpec.of({
          backend: Value.select({
            name: i18n('Spectrum Backend'),
            description: i18n(
              'The chosen server must be installed and synced before Specter starts.\n- Fulcrum: Spectrum Node queries the Fulcrum service\n- electrs: Spectrum Node queries the electrs service',
            ),
            default: 'fulcrum',
            values: {
              fulcrum: i18n('Fulcrum'),
              electrs: i18n('electrs'),
            },
          }),
        }),
      },
    }),
  }),
})

export const selectNode = sdk.Action.withInput(
  'select-node',

  {
    name: i18n('Select Node'),
    description: i18n('Choose the Bitcoin backend for Specter'),
    warning: null,
    allowedStatuses: 'any',
    group: null,
    visibility: 'enabled',
  },

  inputSpec,

  async ({ effects }) => {
    const existing = await configJson
      .read((c) => c)
      .const(effects)
      .catch(() => null)

    if (existing?.active_node_alias === 'spectrum_node') {
      return {
        node: {
          selection: 'spectrum_node' as const,
          value: { backend: existing.spectrum_backend ?? 'fulcrum' },
        },
      }
    }

    return { node: { selection: 'bitcoin_core' as const, value: {} } }
  },

  async ({ effects, input }) => {
    if (input.node.selection === 'spectrum_node') {
      const backend = input.node.value.backend as SpectrumBackend

      // Merged, not written: config.json also holds auth and Specter's own settings.
      await configJson.merge(effects, {
        active_node_alias: 'spectrum_node',
        spectrum_backend: backend,
        bitcoind: false,
      })
      await spectrumNodeJson.write(effects, SPECTRUM_NODE_DEFAULTS)

      return {
        version: '1',
        title: i18n('Success'),
        message:
          backend === 'fulcrum'
            ? i18n('Spectrum Node selected and configured with Fulcrum.')
            : i18n('Spectrum Node selected and configured with electrs.'),
        result: null,
      }
    }

    await configJson.merge(effects, {
      active_node_alias: 'bitcoin_core',
      spectrum_backend: null,
      bitcoind: true,
    })

    const existingBitcoinNode = await bitcoinCoreJson
      .read((n) => n)
      .const(effects)
      .catch(() => null)

    if (existingBitcoinNode?.user && existingBitcoinNode?.password) {
      await bitcoinCoreJson.write(effects, {
        ...BITCOIN_NODE_DEFAULTS,
        user: existingBitcoinNode.user,
        password: existingBitcoinNode.password,
      })
      return {
        version: '1',
        title: i18n('Success'),
        message: i18n(
          'Bitcoin RPC is already configured. Existing RPC credentials were reused.',
        ),
        result: null,
      }
    }

    const username = `specter_${utils.getDefaultString({
      charset: 'a-z,A-Z',
      len: 8,
    })}`
    const password = utils.getDefaultString({
      charset: 'a-z,A-Z,1-9,_,-',
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
          accept: [{ username, password }],
          set: { username, password },
        },
        reason: i18n(
          'Specter needs dependency-scoped Bitcoin RPC credentials.',
        ),
      },
    )

    await bitcoinCoreJson.write(effects, {
      ...BITCOIN_NODE_DEFAULTS,
      user: username,
      password,
    })

    return {
      version: '1',
      title: i18n('Success'),
      message: i18n(
        'Bitcoin RPC selected and new RPC credentials were generated for Specter.',
      ),
      result: null,
    }
  },
)
