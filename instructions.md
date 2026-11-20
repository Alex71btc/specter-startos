# Specter

## Documentation

- [Start9 Bitcoin Guides](https://docs.start9.com/bitcoin-guides/) — connecting a wallet to your own Bitcoin node or Electrum server, and which wallets work on which platforms.
- [Specter Desktop documentation](https://docs.specter.solutions/) — the upstream user guide for wallets, multisig, devices, and the Specter API.

## Signing In

Specter asks for a password before it shows anything. Run the **Create Admin Password** action to get it — it is shown once, so save it to a password manager — then enter it on Specter's login page. If Specter is set to ask for a username too, use the one the action shows.

Forgot it? Run **Reset Admin Password** for a new one. It restarts Specter, and erases any Swan connection you set up in Specter, which you then reconnect; wallets and devices are kept.

You can change how Specter signs you in under **Settings → Authentication** in Specter.

## Choosing a Backend

Specter on StartOS supports two backends. Pick one with the **Select Node** action; you can re-run the action any time to switch.

Both options ultimately need a Bitcoin node running on your server — the difference is whether Specter talks to it directly or through an Electrum indexer that sits in front of it.

### Bitcoin RPC (recommended)

Direct RPC against your Bitcoin node. No extra indexer in the picture — Specter talks straight to your Bitcoin node over the local service network. This is the reliable, default path and the one we recommend for almost everyone.

Trade-off: a Bitcoin node has no per-address index, so wallet imports and rescans walk the full block range. That's slow on full nodes and unworkable past the prune horizon. For day-to-day use of an already-imported wallet, this is a non-issue.

### Spectrum Node (experimental)

Specter talks the Electrum protocol via its built-in Spectrum Node, backed by either Fulcrum or electrs.

Why pick this? An Electrum indexer lets Specter import an existing or multisig wallet without a full chain walk. The catch: the Spectrum Node backend in Specter is still experimental and currently less reliable than the direct Bitcoin RPC path — expect rough edges. Choose it if fast wallet imports matter more to you than maximum stability.

The first time the chosen indexer installs, it will sync against your Bitcoin node before Specter can use it.

## Hardware Wallets

Specter runs on your server, so a hardware wallet plugged into the machine you are browsing from is not visible to it over USB. Two ways round that:

- **Air-gapped signing** works with no extra setup — QR codes with SeedSigner, Specter DIY or Keystone, or an SD card with a Coldcard. Nothing needs to reach the device over USB.
- **HWIBridge** relays USB to your server. Run Specter locally with `--hwibridge`, open `http://127.0.0.1:25441/hwi/settings` — recent versions ask you to log in as an admin first — and whitelist your server's domain. Then in Specter on StartOS go to **Settings → USB Devices**, choose **Remote Specter USB connection**, save, and use **Test connection**. Ad blockers and Brave's shields can silently block the relay. See [Specter HWIBridge](https://docs.specter.solutions/desktop/hwibridge/).

## Mempool as Block Explorer

If you run the Mempool service, you can point Specter at it for transaction lookups: in Specter, go to **Settings → Block Explorer URL** and paste your Mempool service's `.local` or `.onion` address.
