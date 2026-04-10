import { FileHelper, z } from '@start9labs/start-sdk'
import { sdk } from '../sdk'

const shape = z.object({
  python_class: z.literal('cryptoadvance.specterext.spectrum.spectrum_node.SpectrumNode'),
  fullpath: z.literal('/root/.specter/nodes/spectrum_node.json'),
  name: z.literal('Spectrum Node'),
  alias: z.literal('spectrum_node'),
  host: z.string().catch('electrs.startos'),
  port: z.number().catch(50001),
  ssl: z.boolean().catch(false),
})

export const spectrumNodeJson = FileHelper.json(
  { base: sdk.volumes.main, subpath: '.specter/nodes/spectrum_node.json' },
  shape,
)
