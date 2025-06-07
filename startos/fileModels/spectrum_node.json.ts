import { matches, FileHelper } from '@start9labs/start-sdk'

const { object, literal } = matches

export const spectrumNodeDefaultConfig = {
  python_class: 'cryptoadvance.specterext.spectrum.spectrum_node.SpectrumNode',
  fullpath: '/root/.specter/nodes/spectrum_node.json',
  name: 'Spectrum Node',
  alias: 'spectrum_node',
  host: 'electrs.startos',
  port: 50001,
  ssl: false,
} as const

const { python_class, fullpath, name, alias, port, host, ssl } =
  spectrumNodeDefaultConfig

const shape = object({
  python_class: literal(python_class),
  fullpath: literal(fullpath),
  name: literal(name),
  alias: literal(alias),
  host: literal(host),
  port: literal(port),
  ssl: literal(ssl),
}).onMismatch(spectrumNodeDefaultConfig)

export const spectrumNodeJson = FileHelper.json(
  {
    volumeId: 'main',
    subpath: '/.specter/nodes/spectrum_config.json',
  },
  shape,
)
