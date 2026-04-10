<p align="center">
  <img src="icon.svg" alt="Jam Logo" width="21%">
</p>

# Jam on StartOS

> **Upstream docs:** <https://jamdocs.org/>
>
> Everything not listed in this document should behave the same as upstream
> Jam. If a feature, setting, or behavior is not mentioned here, the upstream
> documentation is accurate and fully applicable.

[Jam](https://github.com/joinmarket-webui/jam) is a web interface for JoinMarket, a privacy-focused Bitcoin software that enables collaborative transactions (CoinJoins). JoinMarket is completely peer-to-peer with no central coordinator.

**Note:** Jam is considered beta software. While JoinMarket is tried and tested, Jam is newer and may have issues.

---

## Table of Contents

- [Image and Container Runtime](#image-and-container-runtime)
- [Volume and Data Layout](#volume-and-data-layout)
- [Installation and First-Run Flow](#installation-and-first-run-flow)
- [Configuration Management](#configuration-management)
- [Network Access and Interfaces](#network-access-and-interfaces)
- [Actions (StartOS UI)](#actions-startos-ui)
- [Dependencies](#dependencies)
- [Backups and Restore](#backups-and-restore)
- [Health Checks](#health-checks)
- [Limitations and Differences](#limitations-and-differences)
- [What Is Unchanged from Upstream](#what-is-unchanged-from-upstream)
- [Contributing](#contributing)
- [Quick Reference for AI Consumers](#quick-reference-for-ai-consumers)

---

## Image and Container Runtime

| Property | Value |
|----------|-------|
| Image | `ghcr.io/joinmarket-webui/jam-standalone` (upstream unmodified) |
| Architectures | x86_64, aarch64 |

This is the upstream standalone image containing both Jam UI and JoinMarket backend.

---

## Volume and Data Layout

| Volume | Mount Point | Purpose |
|--------|-------------|---------|
| `main` | — | StartOS state (`store.json`) |
| `jam` | `/root/.joinmarket` | JoinMarket data (wallets, config, logs) |

**StartOS-specific files:**

- `store.json` — App password, RPC password, instance ID

---

## Installation and First-Run Flow

| Step | Upstream | StartOS |
|------|----------|---------|
| Installation | Docker setup with env vars | Install from marketplace |
| Bitcoin Core | Manual configuration | Auto-configured via dependency |
| Credentials | Set via environment | Run "Create Password" action |
| Wallet | Create in UI | Same as upstream |

**First-run steps:**

1. Ensure Bitcoin Core is installed and synced
2. Install Jam from StartOS marketplace
3. Run "Create Password" action to generate login credentials
4. Access the web UI and create your JoinMarket wallet

---

## Configuration Management

### Auto-Configured by StartOS

| Setting | Value | Purpose |
|---------|-------|---------|
| `JM_RPC_HOST` | `bitcoind.startos` | Bitcoin Core connection |
| `JM_RPC_PORT` | `8332` | Bitcoin RPC port |
| `JM_RPC_USER` | Instance ID | RPC authentication |
| `JM_RPC_PASSWORD` | Auto-generated | RPC authentication |
| `JM_RPC_WALLET_FILE` | Instance ID | Dedicated wallet file |
| `ENSURE_WALLET` | `true` | Auto-create wallet in Bitcoin Core |
| `REMOVE_LOCK_FILES` | `true` | Clean startup |

### Settings Managed via Jam UI

All JoinMarket settings are configured through the Jam web interface:

- Wallet management
- CoinJoin parameters
- Fee settings
- Maker/Taker configuration

---

## Network Access and Interfaces

| Interface | Port | Protocol | Purpose |
|-----------|------|----------|---------|
| Web UI | 80 | HTTP | Jam web interface |

**Access methods (StartOS 0.4.0):**

- LAN IP with unique port
- `<hostname>.local` with unique port
- Tor `.onion` address
- Custom domains (if configured)

---

## Actions (StartOS UI)

### Create Password / Reset Password

| Property | Value |
|----------|-------|
| ID | `reset-password` |
| Name | Create Password / Reset Password |
| Visibility | Enabled |
| Availability | Any status |
| Purpose | Generate web UI login credentials |

**Output:** Displays username (`jam`) and a randomly generated 32-character password.

**Use this action:**

- After first installation to get initial credentials
- If you forget your password
- To rotate credentials for security

---

## Dependencies

### Bitcoin Core

| Property | Value |
|----------|-------|
| Required | Yes |
| Version constraint | `>= 28.3, < 30.0` |
| Health checks | `bitcoind`, `sync-progress` |
| Mounted volumes | None (accessed via RPC) |
| Purpose | Blockchain data and wallet operations via RPC |

Jam requires a compatible version of Bitcoin Core with BDB wallet support. RPC credentials and a dedicated wallet are configured automatically.

---

## Backups and Restore

**Included in backup:**

- `main` volume — StartOS configuration
- `jam` volume — JoinMarket wallets, settings, transaction history

**Restore behavior:**

- All wallets and funds restored
- Transaction history preserved
- Credentials preserved

**Warning:** JoinMarket wallets contain your Bitcoin. Ensure backups are working properly.

---

## Health Checks

| Check | Display Name | Method |
|-------|--------------|--------|
| Web Interface | Web Interface | Port 80 listening |

**Messages:**

- Success: "The web interface is ready"
- Error: "The web interface is not ready"

---

## Limitations and Differences

1. **Bitcoin Core version restricted** — Requires a version with BDB wallet support; incompatible with newer versions that removed it
2. **Username fixed** — Always `jam`; only password can be changed
3. **Auto-configured RPC** — Cannot manually configure Bitcoin Core connection

---

## What Is Unchanged from Upstream

- Full JoinMarket functionality
- CoinJoin operations (taker and maker)
- Wallet management
- Earning as a market maker
- Fidelity bonds
- Sweep functionality
- Transaction history
- All Jam UI features
- JoinMarket peer-to-peer network participation

---

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for build instructions and development workflow.

---

## Quick Reference for AI Consumers

```yaml
package_id: jam
image: ghcr.io/joinmarket-webui/jam-standalone
architectures: [x86_64, aarch64]
volumes:
  main: (StartOS state)
  jam: /root/.joinmarket
ports:
  ui: 80
dependencies:
  bitcoind:
    required: true
    version: ">=28.3 <30.0"
    health_check: [bitcoind, sync-progress]
startos_managed_env_vars:
  - APP_USER
  - APP_PASSWORD
  - JM_RPC_HOST
  - JM_RPC_PORT
  - JM_RPC_USER
  - JM_RPC_PASSWORD
  - JM_RPC_WALLET_FILE
  - ENSURE_WALLET
  - REMOVE_LOCK_FILES
auto_config:
  JM_RPC_HOST: bitcoind.startos
  JM_RPC_PORT: "8332"
  JM_RPC_USER: (instance ID)
  JM_RPC_PASSWORD: (auto-generated)
  JM_RPC_WALLET_FILE: (instance ID)
  ENSURE_WALLET: "true"
  REMOVE_LOCK_FILES: "true"
actions:
  - reset-password (enabled, any)
health_checks:
  - port_listening: 80
backup_volumes:
  - main
  - jam
fixed_settings:
  username: jam
```
