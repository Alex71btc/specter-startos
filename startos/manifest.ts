import { setupManifest } from '@start9labs/start-sdk'

export const manifest = setupManifest({
  id: 'specter',
  title: 'Specter',
  license: 'mit',
  wrapperRepo: 'https://github.com/Alex71btc/specter-startos',
  upstreamRepo: 'https://github.com/cryptoadvance/specter-desktop',
  supportSite: 'https://github.com/cryptoadvance/specter-desktop/issues',
  marketingSite: 'https://specter.solutions',
  donationUrl: null,
  description: {
    short:
      'A user-friendly web interface for Bitcoin wallets, multisig, and hardware wallet workflows.',
    long:
      'Specter Desktop is a Bitcoin wallet interface focused on sovereignty, multisignature setups, and hardware wallet support. This package provides Specter as a StartOS service with a web UI and persistent data storage.',
  },
  volumes: ['main'],
  images: {
    specter: {
      source: {
        dockerTag: 'lncm/specter-desktop:v2.1.7',
      },
    },
  },
  hardwareRequirements: {},
  alerts: {
    install: null,
    update: null,
    uninstall: null,
    restore: null,
    start: null,
    stop: null,
  },
  dependencies: {},
})
