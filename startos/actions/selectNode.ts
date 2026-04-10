import { utils } from '@start9labs/start-sdk'
import { sdk } from '../sdk'
import { bitcoindGenerateRpcUserDependent } from './bitcoindGenerateRpcUserDependent'
import { configJson } from '../fileModels/config.json'
import { bitcoinCoreJson } from '../fileModels/bitcoin_core.json'
import { spectrumNodeJson } from '../fileModels/spectrum_node.json'

const { InputSpec, Value } = sdk

type ActiveNodeAlias = 'bitcoin_core' | 'spectrum_node'
type SpectrumBackend = 'electrs' | 'fulcrum'

const DEFAULT_BITCOIN_NODE = {
  python_class: 'cryptoadvance.specter.node.Node' as const,
  fullpath: '/root/.specter/nodes/bitcoin_core.json' as const,
  name: 'Bitcoin Core' as const,
  alias: 'bitcoin_core' as const,
  autodetect: false as const,
  datadir: '' as const,
  port: '8332' as const,
  host: 'bitcoind.startos' as const,
  protocol: 'http' as const,
  node_type: 'BTC' as const,
}

function getSpectrumDefaults(backend: SpectrumBackend) {
  return {
    python_class:
      'cryptoadvance.specterext.spectrum.spectrum_node.SpectrumNode' as const,
    fullpath: '/root/.specter/nodes/spectrum_node.json' as const,
    name: 'Spectrum Node' as const,
    alias: 'spectrum_node' as const,
    host: backend === 'fulcrum' ? 'fulcrum.startos' : 'electrs.startos',
    port: 50001,
    ssl: false,
  }
}

export const inputSpec = InputSpec.of({
  active_node_alias: Value.select({
    name: 'Node',
    default: 'bitcoin_core',
    values: {
      bitcoin_core: 'Bitcoin Core / Knots',
      spectrum_node: 'Spectrum Node',
    },
  }),
  spectrum_backend: Value.select({
    name: 'Spectrum backend',
    default: 'electrs',
    values: {
      electrs: 'electrs',
      fulcrum: 'fulcrum',
    },
  }),
})

async function safeReadConfig(effects: any) {
  try {
    return await configJson.read((v) => v).const(effects)
  } catch {
    return null
  }
}

async function safeReadBitcoinNode(effects: any) {
  try {
    return await bitcoinCoreJson.read((v) => v).const(effects)
  } catch {
    return null
  }
}

async function safeReadSpectrumNode(effects: any) {
  try {
    return await spectrumNodeJson.read((v) => v).const(effects)
  } catch {
    return null
  }
}

function hasUsableBitcoinCredentials(
  node: Awaited<ReturnType<typeof safeReadBitcoinNode>>,
): node is NonNullable<Awaited<ReturnType<typeof safeReadBitcoinNode>>> {
  return !!node?.user && !!node?.password
}

async function ensureConfig(
  effects: any,
  active_node_alias: ActiveNodeAlias,
  spectrum_backend: SpectrumBackend | null,
) {
  const existing = await safeReadConfig(effects)

  const payload = {
    active_node_alias,
    spectrum_backend:
      active_node_alias === 'spectrum_node' ? spectrum_backend : null,
    bitcoind: active_node_alias === 'bitcoin_core',
  }

  if (!existing) {
    await configJson.write(effects, payload)
    return
  }

  await configJson.merge(effects, payload)
}

async function ensureBitcoinNodeFile(
  effects: any,
  username: string,
  password: string,
) {
  const existing = await safeReadBitcoinNode(effects)

  if (!existing) {
    await bitcoinCoreJson.write(effects, {
      ...DEFAULT_BITCOIN_NODE,
      user: username,
      password,
    })
    return
  }

  await bitcoinCoreJson.merge(effects, {
    python_class: DEFAULT_BITCOIN_NODE.python_class,
    fullpath: DEFAULT_BITCOIN_NODE.fullpath,
    name: DEFAULT_BITCOIN_NODE.name,
    alias: DEFAULT_BITCOIN_NODE.alias,
    autodetect: DEFAULT_BITCOIN_NODE.autodetect,
    datadir: DEFAULT_BITCOIN_NODE.datadir,
    port: DEFAULT_BITCOIN_NODE.port,
    host: DEFAULT_BITCOIN_NODE.host,
    protocol: DEFAULT_BITCOIN_NODE.protocol,
    node_type: DEFAULT_BITCOIN_NODE.node_type,
    user: existing.user || username,
    password: existing.password || password,
  })
}

async function ensureSpectrumNodeFile(
  effects: any,
  backend: SpectrumBackend,
) {
  const existing = await safeReadSpectrumNode(effects)
  const defaults = getSpectrumDefaults(backend)

  if (!existing) {
    await spectrumNodeJson.write(effects, defaults)
    return
  }

  await spectrumNodeJson.merge(effects, defaults)
}

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
  async ({ effects }) => {
    const existing = await safeReadConfig(effects)
    return {
      active_node_alias:
        (existing?.active_node_alias as ActiveNodeAlias | null) ?? 'bitcoin_core',
      spectrum_backend:
        (existing?.spectrum_backend as SpectrumBackend | null) ?? 'electrs',
    }
  },
  async ({ effects, input }) => {
    const activeNode = input.active_node_alias as ActiveNodeAlias
    const spectrumBackend = (input.spectrum_backend ||
      'electrs') as SpectrumBackend

    await ensureConfig(
      effects,
      activeNode,
      activeNode === 'spectrum_node' ? spectrumBackend : null,
    )

    if (activeNode === 'spectrum_node') {
      await ensureSpectrumNodeFile(effects, spectrumBackend)
      return {
        version: '1',
        title: 'Success',
        message: `Spectrum Node selected and configured with ${spectrumBackend}.`,
        result: null,
      }
    }

    const existingNode = await safeReadBitcoinNode(effects)

    if (hasUsableBitcoinCredentials(existingNode)) {
      await ensureBitcoinNodeFile(
        effects,
        existingNode.user,
        existingNode.password,
      )
      return {
        version: '1',
        title: 'Success',
        message:
          'Bitcoin Core / Knots is already configured. Existing RPC credentials were reused.',
        result: null,
      }
    }

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

    await ensureBitcoinNodeFile(effects, btcUsername, btcPassword)

    return {
      version: '1',
      title: 'Success',
      message:
        'Bitcoin Core / Knots selected and new RPC credentials were generated for Specter.',
      result: null,
    }
  },
)
