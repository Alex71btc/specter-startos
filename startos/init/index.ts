import { sdk } from '../sdk'
import { setDependencies } from '../dependencies'
import { setInterfaces } from '../interfaces'
import { versionGraph } from '../versions'
import { actions } from '../actions'
import { restoreInit } from '../backups'
import { configJson } from '../fileModels/config.json'
import { selectNode } from '../actions/selectNode'

const baseInit = sdk.setupInit(
  restoreInit,
  versionGraph,
  setInterfaces,
  setDependencies,
  actions,
)

async function safeReadConfig(effects: any) {
  try {
    return await configJson.read((v) => v).const(effects)
  } catch {
    return null
  }
}

export const init = async (options: any) => {
  await baseInit(options)

  const config = await safeReadConfig(options.effects)

  if (!config?.active_node_alias) {
    await sdk.action.createOwnTask(
      options.effects,
      selectNode,
      'critical',
      {
        reason: 'Please choose which backend Specter should use.',
      },
    )
  }
}

export const uninit = sdk.setupUninit(versionGraph)
