<p align="center">
  <img src="icon.png" alt="Specter Logo" width="21%">
</p>

# Specter on StartOS

> Everything not listed in this document should behave the same as upstream
> Specter Desktop. If a feature, setting, or behavior is not mentioned here, the
> upstream documentation is accurate and fully applicable — see the
> Documentation section of `instructions.md` for links.

[Specter Desktop](https://github.com/cryptoadvance/specter-desktop) is a wallet interface for Bitcoin multisig and hardware wallets, run against your own node. This package wires it to whichever backend you pick — Bitcoin Core over RPC, or an Electrum indexer — and writes that backend's address into Specter's own node files at every start.

- **Upstream repo:** <https://github.com/cryptoadvance/specter-desktop>
- **Wrapper repo:** <https://github.com/Start9-Community/specter-startos>

---

## Table of Contents

- [Image and Container Runtime](#image-and-container-runtime)
- [Volume and Data Layout](#volume-and-data-layout)
- [File Models](#file-models)
- [Dependencies](#dependencies)
- [Network Access and Interfaces](#network-access-and-interfaces)
- [Installation and First-Run Flow](#installation-and-first-run-flow)
- [Actions](#actions)
- [Tasks](#tasks)
- [Health Checks](#health-checks)
- [Backups and Restore](#backups-and-restore)
- [Limitations and Differences](#limitations-and-differences)
- [Quick Reference for AI Consumers](#quick-reference-for-ai-consumers)

---

## Image and Container Runtime

One upstream image. The root `Dockerfile` upgrades its CA store and certifi, a temporary layer that comes out once upstream ships an image built on fixed stores.

| Property      | Value                                                       |
| ------------- | ----------------------------------------------------------- |
| Image         | `ghcr.io/cryptoadvance/specter-desktop` + root `Dockerfile` |
| Architectures | x86_64, aarch64                                             |
| Command       | Specter's server, against the data folder                   |

| Subcontainer  | Purpose                                  |
| ------------- | ---------------------------------------- |
| `specter-sub` | The only daemon — the one to `attach` to |

One oneshot runs first, giving the data folder to the unprivileged user Specter runs as.

## Volume and Data Layout

One volume.

| Volume | Mount Point | Purpose               |
| ------ | ----------- | --------------------- |
| `main` | `/data`     | Specter's data folder |

| Path                                | Written by | Holds                             |
| ----------------------------------- | ---------- | --------------------------------- |
| `.specter/config.json`              | The action | Which backend is selected         |
| `.specter/nodes/bitcoin_core.json`  | Both       | The Bitcoin Core node definition  |
| `.specter/nodes/spectrum_node.json` | Both       | The Electrum node definition      |
| `.specter/migration_data.json`      | Init       | Which of Specter's migrations ran |
| `.specter/` (the rest)              | Specter    | Wallets, devices, and settings    |

**This volume holds your wallet definitions** — the descriptors and device records that make your funds spendable. Specter is watch-only, so there are no private keys here, but a lost descriptor is a lost wallet even when the seed survives.

## File Models

Four models, and two of them exist to fight upstream behavior rather than to configure anything.

| File                  | Format | Modelled                | Written by         |
| --------------------- | ------ | ----------------------- | ------------------ |
| `config.json`         | JSON   | Yes — `FileHelper.json` | The action         |
| `bitcoin_core.json`   | JSON   | Yes — `FileHelper.json` | The action, `main` |
| `spectrum_node.json`  | JSON   | Yes — `FileHelper.json` | The action, `main` |
| `migration_data.json` | JSON   | Yes — `FileHelper.json` | Init               |

The first records which backend is active. The two node files are Specter's own node definitions, with their class, path, name and alias **pinned as literals** — they identify the node to Specter, and a changed value is repaired on read.

**The backend's address is resolved at start, not stored.** `main` looks up the selected dependency's binding over the internal bridge and writes the host and port into the matching node file before the daemon reads it. The read is reactive, so a dependency being installed, removed, or moved to a different port updates the file and restarts Specter — but a dependency _update_ does not.

**While the dependency is absent the host is left unset** rather than written as a placeholder, so Specter simply fails to connect until the address resolves.

**The migration file is pre-seeded, and that is a workaround.** Specter runs two migrations unconditionally on its first daemon start, and the second rewrites every node file into one of two classes it knows about — neither of which is the Electrum node type this package uses, so it clobbers that file every time. The package marks both migrations as already executed so the migrator skips them. Both are no-ops on a fresh volume anyway: the first only acts on a legacy data directory that cannot exist here, and the second only does the damage described. It is written **only when no migration file exists**, so real migration history on an update or restore is preserved.

## Dependencies

Three declared, **exactly one active** — whichever backend is selected.

| Dependency | Required         | Health checks required      | Why                  |
| ---------- | ---------------- | --------------------------- | -------------------- |
| Bitcoin    | Only if selected | `bitcoind`, `sync-progress` | The node, over RPC   |
| electrs    | Only if selected | `electrs`, `sync`           | The Electrum backend |
| Fulcrum    | Only if selected | `primary`, `sync-progress`  | The Electrum backend |

**Every one of them is gated on being synced, not just running.** A backend that answers but has not caught up reports wrong balances, which for a wallet interface is worse than not connecting at all.

**Nothing is depended on until a backend is chosen.** The dependency set is derived from the selection, so an unconfigured install has no dependencies and asks for none.

Choosing Bitcoin Core takes RPC credentials; choosing an Electrum backend does not, because Specter's Electrum client needs none.

## Network Access and Interfaces

One interface.

| Interface | Id   | Type | Port  | Description               |
| --------- | ---- | ---- | ----- | ------------------------- |
| Web UI    | `ui` | ui   | 25441 | The Specter web interface |

Bound on the `main` MultiHost over HTTP and not masked.

**Specter's own authentication gates it**, and it is configured inside the application — Specter can run with no authentication at all, which is its default until you set it. **Set it before exposing this address anywhere**, because the interface shows every wallet's balances and can construct transactions for signing.

## Installation and First-Run Flow

Install seeds the migration file and raises a `critical` task: choose a backend.

**The service cannot start until one is chosen**, which is right — Specter with no node has nothing to show, and the choice is what determines which dependency is required.

Choosing Bitcoin Core **generates dedicated RPC credentials and asks Bitcoin for them on your behalf**: it raises a critical task on the Bitcoin package pre-filled with a generated username and password, so the credential is scoped to Specter rather than shared. If credentials already exist in the node file they are reused instead.

Choosing an Electrum backend writes the node definition and needs no credential.

Once the backend is running and synced, Specter starts, and the rest — wallets, devices, authentication — is set up inside the application.

## Actions

One action.

### Select Node

Chooses the backend: Bitcoin Core, or Spectrum with electrs or Fulcrum behind it.

- **What it changes:** the active selection, the matching node definition, and through them the dependency set.
- **Cost:** the service restarts, and will not start again until the newly selected dependency is running and synced.
- **Repeat safety:** idempotent, pre-filled with the current selection.
- **Switching to Bitcoin Core reuses existing RPC credentials** when the node file already has them, and otherwise generates a new pair and raises the task on Bitcoin.
- **Runnable at any status**, including before the first start — which is how the install-time task is completed.

## Tasks

One, and it is reactive.

| Task        | Severity   | Raised when                        | Cleared when    |
| ----------- | ---------- | ---------------------------------- | --------------- |
| Select Node | `critical` | Any init that finds no backend set | The action runs |

`critical` blocks the service from starting and suspends the ordinary controls, so a fresh install shows the task and nothing else.

Selecting Bitcoin Core may raise a second `critical` task — **on the Bitcoin package, not this one** — asking it to create the RPC user Specter generated.

## Health Checks

One check, on the only daemon.

| Check     | Displayed as    | Method                  |
| --------- | --------------- | ----------------------- |
| `primary` | "Web Interface" | Port 25441 is listening |

It reports that the interface is serving. **It says nothing about the backend**: a node that is unreachable, a wrong RPC credential, or an indexer that fell behind all show a green check and an error inside Specter.

## Backups and Restore

The `main` volume is copied wholesale — `sdk.Backups.ofVolumes('main')`. That is the wallet definitions, the device records, the node configuration, and Specter's own settings.

**Watch-only, but not worthless.** There are no private keys here, so the backup cannot spend — but it holds the descriptors and multisig configurations without which a set of seeds is very hard to reconstruct into the same wallet. It also holds the Bitcoin RPC credential.

A restored instance comes back with the same wallets and the same backend selection, and re-resolves the backend's address on the new server.

## Limitations and Differences

1. **A backend must be selected before the service will start.**
2. **Only one backend at a time**, and switching restarts and re-depends.
3. **Specter's own authentication is off until you configure it** inside the application.
4. **The backend must be synced**, not merely running, before Specter starts.
5. **Two of Specter's own migrations are suppressed** by a pre-seeded migration file; without that, the Electrum node definition is destroyed on first start.
6. **The node files are partly pinned** — class, path, name and alias are repaired on read, so they cannot be repurposed by hand.
7. **Watch-only.** Signing happens on a hardware device or another wallet; Specter constructs and coordinates.

---

## Quick Reference for AI Consumers

```yaml
package_id: specter
image: ghcr.io/cryptoadvance/specter-desktop + root Dockerfile
architectures:
  - x86_64
  - aarch64
subcontainers:
  - specter-sub
volumes:
  main: /data # Specter's data folder is /data/.specter
file_models:
  - .specter/config.json # active_node_alias, spectrum_backend
  - .specter/nodes/bitcoin_core.json # host/port written at start; class/alias pinned
  - .specter/nodes/spectrum_node.json # same, for the Electrum backend
  - .specter/migration_data.json # pre-seeded to suppress Specter's migrations 1 and 2
startos_managed_env_vars: [] # the backend address is written into the node files
dependencies:
  - bitcoind # only when selected; healthChecks: [bitcoind, sync-progress]
  - electrs # only when selected; healthChecks: [electrs, sync]
  - fulcrum # only when selected; healthChecks: [primary, sync-progress]
interfaces:
  ui: { type: ui, port: 25441 } # Specter's own auth, off by default until configured
actions:
  - select-node
tasks:
  - { action: select-node, severity: critical } # reactive
  # selecting Bitcoin Core also raises a critical task on the bitcoind package
health_checks:
  - primary # displayed "Web Interface"; says nothing about the backend
```
