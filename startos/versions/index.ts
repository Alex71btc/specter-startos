import { VersionGraph } from '@start9labs/start-sdk'
import { v_2_1_10_0 } from './v2.1.10.0'
import { v_2_1_9_0 } from './v2.1.9.0'

export const versionGraph = VersionGraph.of({
  current: v_2_1_10_0,
  other: [v_2_1_9_0],
})
