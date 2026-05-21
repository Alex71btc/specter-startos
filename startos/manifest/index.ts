import { setupManifest } from '@start9labs/start-sdk'
import {
  bitcoindDescription,
  electrsDescription,
  fulcrumDescription,
  long,
  short,
} from './i18n'

export const manifest = setupManifest({
  id: 'specter',
  title: 'Specter',
  license: 'mit',
  packageRepo: 'https://github.com/Start9-Community/specter-startos',
  upstreamRepo: 'https://github.com/cryptoadvance/specter-desktop',
  marketingUrl: 'https://specter.solutions',
  donationUrl: null,
  icon: 'icon.png',
  description: { short, long },
  volumes: ['main'],
  images: {
    specter: {
      source: {
        dockerTag: 'ghcr.io/cryptoadvance/specter-desktop:v2.1.9',
      },
      arch: ['x86_64', 'aarch64'],
    },
  },
  dependencies: {
    bitcoind: {
      description: bitcoindDescription,
      optional: true,
      metadata: {
        title: 'Bitcoin Core',
        icon: 'https://raw.githubusercontent.com/Start9Labs/bitcoin-core-startos/master/icon.svg',
      },
    },
    electrs: {
      description: electrsDescription,
      optional: true,
      metadata: {
        title: 'electrs',
        icon: 'https://raw.githubusercontent.com/Start9-Community/electrs-startos/master/icon.svg',
      },
    },
    fulcrum: {
      description: fulcrumDescription,
      optional: true,
      metadata: {
        title: 'Fulcrum',
        icon: 'https://raw.githubusercontent.com/Start9Labs/fulcrum-startos/master/icon.png',
      },
    },
  },
})
