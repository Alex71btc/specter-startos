import { sdk } from '../sdk'
import { resetPassword } from './resetPassword'
import { selectNode } from './selectNode'

export const actions = sdk.Actions.of()
  .addAction(selectNode)
  .addAction(resetPassword)
