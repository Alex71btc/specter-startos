import { compat, types as T, matches } from "../deps.ts";

const { shape, string } = matches

export const migration: T.ExpectedExports.migration = compat.migrations
  .fromMapping(
    {
    "2.1.5.5": {
      up: compat.migrations.updateConfig((config) => {
        if (Object.keys(config).length === 0) {
          // service was never configured
          return config
        }
        const matchConfig = shape({
        bitcoind: shape({
          type: string
        })
      })
      if (!matchConfig.test(config)) {
        throw `Incorrect shape for config: ${matchConfig.errorMessage(config)}`
      }
        if (config.bitcoind.type === 'internal-proxy') {
          config.bitcoind.type = 'internal'
        }
        return config
      }, true, { version: "2.1.5.5", type: "up" }),
      down: compat.migrations.updateConfig(_ => { throw new Error("Downgrade unavailable") }, true, { version: "2.0.2.2", type: "down" })
    }
  }
  , "2.1.5.5" );
