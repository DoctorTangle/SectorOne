# Getting started

## Requirements

- Node.js 18+
- TypeScript project (recommended)
- [viem](https://viem.sh/) `>= 2.5.0` as peer dependency
- A Base mainnet RPC URL (Alchemy, Infura, QuickNode, or your own node)

## Install

Pick the packages you need:

```bash
# Core types (always needed)
npm install @sectorone/sdk-core viem

# DLMM — swaps, liquidity, bins (most integrations)
npm install @sectorone/sdk-v2

# Optional: Uniswap V2-style AMM on SectorOne
npm install @sectorone/sdk
```

> Packages are published from this monorepo. Until published to npm, link locally with `pnpm build` and `file:` / workspace references.

## Create a viem client

```typescript
import { createPublicClient, http } from 'viem'
import { base } from 'viem/chains'

const client = createPublicClient({
  chain: base,
  transport: http(process.env.BASE_RPC_URL ?? 'https://mainnet.base.org')
})
```

Always prefer `BASE_RPC_URL` in production — the public Base endpoint rate-limits aggressively.

## Verify chain scope

```typescript
import { ChainId } from '@sectorone/sdk-core'

// Only valid chain:
ChainId.BASE // 8453
```

The SDK throws if you pass any other chain id to helpers like `getDefaultPublicClient`.

## First read: list LB pairs

```typescript
import { ChainId, Token, WNATIVE } from '@sectorone/sdk-core'
import { PairV2 } from '@sectorone/sdk-v2'

const USDC = new Token(
  ChainId.BASE,
  '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
  6,
  'USDC',
  'USD Coin'
)

const pair = new PairV2(USDC, WNATIVE[ChainId.BASE])
const lbPairs = await pair.fetchAvailableLBPairs('v2', client, ChainId.BASE)

console.log(lbPairs) // [{ LBPair, binStep }, ...]
```

## Development (this repo)

```bash
pnpm install
pnpm build
pnpm test
```

Integration tests against live Base RPC (optional):

```bash
SECTORONE_INTEGRATION_TESTS=1 BASE_RPC_URL=https://your-rpc pnpm test --filter @sectorone/sdk-v2
```

## Next steps

1. [Cookbook](./cookbook.md) — swap, add liquidity, read pool state
2. [Architecture](./architecture.md) — understand `PairV2`, `TradeV2`, `RouteV2`
3. [examples/](../examples/) — full snippets
