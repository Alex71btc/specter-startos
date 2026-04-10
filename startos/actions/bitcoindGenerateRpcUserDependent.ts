import { sdk } from '../sdk'

const { InputSpec, Value } = sdk

export const bitcoindGenerateRpcUserDependent = sdk.Action.withInput(
  'generate-rpc-dependent',
  async () => ({
    name: 'Generate RPC Credentials',
    description: 'Create dependency-scoped Bitcoin RPC credentials.',
    warning: null,
    allowedStatuses: 'any',
    group: null,
    visibility: 'hidden',
  }),
  InputSpec.of({
    username: Value.text({
      name: 'Username',
      required: true,
      default: null,
    }),
    password: Value.text({
      name: 'Password',
      required: true,
      default: null,
      masked: true,
    }),
  }),
  async () => {},
  async () => {
    return {
      version: '1',
      title: 'Stub',
      message: 'This action is only used as a remote task reference.',
      result: null,
    }
  },
)
