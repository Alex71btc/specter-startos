import { VersionGraph } from '@start9labs/start-sdk'
import { current } from './current'
import { v2_1_11_3 } from './v2.1.11_3'

export const versionGraph = VersionGraph.of({
  current,
  other: [v2_1_11_3],
})
