import { matches, FileHelper } from '@start9labs/start-sdk'

const { object, literal, string } = matches

export const bitcoinCoreDefaultConfig = {
  python_class: 'cryptoadvance.specter.node.Node',
  fullpath: '/root/.specter/nodes/bitcoin_core.json',
  name: 'Bitcoin Core',
  alias: 'bitcoin_core',
  autodetect: false,
  datadir: '',
  user: '',
  password: '',
  port: '8332',
  host: 'bitcoind.startos',
  protocol: 'http',
  node_type: 'BTC',
} as const

const {
  python_class,
  fullpath,
  name,
  alias,
  autodetect,
  datadir,
  port,
  host,
  protocol,
  node_type,
} = bitcoinCoreDefaultConfig

const shape = object({
  python_class: literal(python_class),
  fullpath: literal(fullpath),
  name: literal(name),
  alias: literal(alias),
  autodetect: literal(autodetect),
  datadir: literal(datadir),
  user: string,
  password: string,
  port: literal(port),
  host: literal(host),
  protocol: literal(protocol),
  node_type: literal(node_type),
}).onMismatch(bitcoinCoreDefaultConfig)

export const bitcoinCoreJson = FileHelper.json(
  {
    volumeId: 'main',
    subpath: '/.specter/nodes/bitcoin_core.json',
  },
  shape,
)
