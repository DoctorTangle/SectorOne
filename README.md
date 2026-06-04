# SectorOne SDK

TypeScript SDK for building on [SectorOne](https://sectorone.xyz) — a DLMM DEX on **Base** (chainId `8453`).

Use this SDK from **apps, bots, and AI agents** to quote swaps, read pools, add liquidity, and interact with SectorOne contracts via [viem](https://viem.sh/).

## Install

```bash
npm install @sectorone/sdk-core @sectorone/sdk-v2 viem
# optional: classic V2 AMM
npm install @sectorone/sdk
```

Peer dependency: `viem >= 2.5.0`

## Quick start

```typescript
import { ChainId, Token, WNATIVE } from '@sectorone/sdk-core'
import { PairV2 } from '@sectorone/sdk-v2'
import { createPublicClient, http } from 'viem'
import { base } from 'viem/chains'

const client = createPublicClient({
  chain: base,
  transport: http(process.env.BASE_RPC_URL)
})

const USDC = new Token(
  ChainId.BASE,
  '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
  6,
  'USDC',
  'USD Coin'
)

const pair = new PairV2(USDC, WNATIVE[ChainId.BASE])
const lbPairs = await pair.fetchAvailableLBPairs('v2', client, ChainId.BASE)
```

## Documentation

| Resource | Audience |
|----------|----------|
| **[AGENTS.md](./AGENTS.md)** | AI coding agents — start here |
| **[docs/](./docs/)** | Full developer documentation |
| **[examples/](./examples/)** | Copy-paste integration snippets |
| [Cookbook](./docs/cookbook.md) | Swaps, LP, reads, quotes |
| [Architecture](./docs/architecture.md) | Packages & class overview |
| [Contracts](./docs/contracts.md) | All Base addresses |

## Packages

| npm package | Purpose |
|-------------|---------|
| `@sectorone/sdk-core` | `ChainId`, `Token`, amounts, WETH |
| `@sectorone/sdk-v2` | **DLMM** — `PairV2`, `TradeV2`, `RouteV2`, `Bin`, ABIs |
| `@sectorone/sdk` | Uniswap V2-style factory/router |

## Which package do I need?

- **Swapping / LP on DLMM** → `@sectorone/sdk-v2` (most projects)
- **Token types & WETH** → `@sectorone/sdk-core`
- **Legacy constant-product AMM** → `@sectorone/sdk`

See [docs/architecture.md](./docs/architecture.md).

## Base contracts (summary)

| Role | Address |
|------|---------|
| LB Factory v2.0 | `0x217da3e53F221D1f36e8b09bc7d55d4012C0aa70` |
| LB Router v2.0 | `0xd4f937581650A2d6e416Dd9EF5372C1672422843` |
| LB Factory v2.2 | `0x3357f02fB3aA78fc86D3Bccdc5Edf039D4b952B5` |
| LB Router v2.2 | `0x87aC1EB5596D47f6fd7d0D17bEE233783dB5CfEC` |
| LB Quoter v2.2 | `0x15c7EFc1837E3867d10ddA89b32CD05a46ef4B14` |
| DexLens | `0x0Ff91bA6928F5Bb700662D72B8290FEa7A5a96D1` |
| V2 Factory | `0xcF0685f37A139DE56AFC4A89aa343849358c05Cb` |
| V2 Router | `0xddF9025cf1fc3A7945ea54A53d856C81b9284C38` |

Full list: [docs/contracts.md](./docs/contracts.md)

## Develop (this repo)

```bash
pnpm install
pnpm build
pnpm test
```

Integration tests (live Base RPC, optional):

```bash
SECTORONE_INTEGRATION_TESTS=1 BASE_RPC_URL=https://your-rpc pnpm test --filter @sectorone/sdk-v2
```

## Attribution

Forked from [lfj-gg/joe-sdks](https://github.com/lfj-gg/joe-sdks) (Trader Joe Liquidity Book SDK), adapted for SectorOne on Base.

MIT — see [LICENSE](./LICENSE) and [NOTICE](./NOTICE).
