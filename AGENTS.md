# SectorOne SDK — Agent Guide

This file is for **AI coding agents** and automated tooling. Read this before integrating SectorOne on Base.

## What this repo is

TypeScript SDK for **SectorOne DEX on Base mainnet** (chainId `8453`). SectorOne uses **Joe Liquidity Book (DLMM)** plus a classic **Uniswap V2-style** AMM.

| npm package | Use when |
|-------------|----------|
| `@sectorone/sdk-core` | Tokens, amounts, `ChainId`, `WNATIVE` (WETH on Base) |
| `@sectorone/sdk-v2` | **Primary** — DLMM swaps, quotes, LP, bin math, LB ABIs |
| `@sectorone/sdk` | Legacy V2-style router/factory only (constant-product pairs) |

**Peer dependency:** `viem >= 2.5.0`

**Scope:** Base only. `ChainId` enum has a single value: `ChainId.BASE = 8453`.

## Decision tree

```
Need to swap / quote on SectorOne DLMM?
  → @sectorone/sdk-v2 (TradeV2, PairV2, RouteV2)

Need bin price / bin id from price?
  → @sectorone/sdk-v2 (Bin.getPriceFromId, Bin.getIdFromPrice)

Need to add concentrated liquidity (bins)?
  → @sectorone/sdk-v2 (PairV2.addLiquidityParameters + LBRouter)

Need Uniswap-V2-style pair address / constant-product swap?
  → @sectorone/sdk (Pair, Trade, Router) — less common on SectorOne

Need token types / WETH address?
  → @sectorone/sdk-core
```

## LB protocol versions on Base

| Version | Factory | Router | Quoter | Status |
|---------|---------|--------|--------|--------|
| **v2.0** | `LB_FACTORY_ADDRESS` | `LB_ROUTER_ADDRESS` | — (use v2.2 quoter for routing) | Deployed |
| **v2.1** | zero address | zero address | zero address | **Not deployed** |
| **v2.2** | `LB_FACTORY_V22_ADDRESS` | `LB_ROUTER_V22_ADDRESS` | `LB_QUOTER_V22_ADDRESS` | Deployed |

**Routing / quotes:** `TradeV2.getTradesExactIn` uses **LB Quoter v2.2** automatically when deployed.

**Listing pairs:** Pass `'v2'` or `'v22'` to `PairV2.fetchAvailableLBPairs(version, client, ChainId.BASE)`.

## Minimal swap flow (exact in)

```typescript
import { ChainId, Token, TokenAmount, Percent, WNATIVE } from '@sectorone/sdk-core'
import { PairV2, RouteV2, TradeV2, LBRouterV22ABI, LB_ROUTER_V22_ADDRESS } from '@sectorone/sdk-v2'
import { createPublicClient, createWalletClient, http, parseUnits } from 'viem'
import { base } from 'viem/chains'
import { privateKeyToAccount } from 'viem/accounts'
import JSBI from 'jsbi'

const CHAIN = ChainId.BASE
const client = createPublicClient({ chain: base, transport: http(process.env.BASE_RPC_URL) })

const USDC = new Token(CHAIN, '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913', 6, 'USDC', 'USD Coin')
const WETH = WNATIVE[CHAIN]
const bases = [WETH, USDC]

const pairs = PairV2.initPairs(PairV2.createAllTokenPairs(USDC, WETH, bases))
const routes = RouteV2.createAllRoutes(pairs, USDC, WETH, 2)

const amountIn = new TokenAmount(USDC, JSBI.BigInt(parseUnits('10', 6).toString()))
const trades = await TradeV2.getTradesExactIn(routes, amountIn, WETH, false, false, client, CHAIN)
const trade = TradeV2.chooseBestTrade(trades, true)
if (!trade) throw new Error('No route')

const { methodName, args, value } = trade.swapCallParameters({
  allowedSlippage: new Percent(JSBI.BigInt(50), JSBI.BigInt(10_000)), // 0.5%
  ttl: 1200,
  recipient: '0xYourWallet'
})

// Approve USDC to LB_ROUTER_V22_ADDRESS before swapExactTokensFor*
// Then writeContract with LBRouterV22ABI, methodName, args, value
```

## Key constants (import from `@sectorone/sdk-v2`)

- `LB_FACTORY_ADDRESS`, `LB_ROUTER_ADDRESS` — LB v2.0
- `LB_FACTORY_V22_ADDRESS`, `LB_ROUTER_V22_ADDRESS`, `LB_QUOTER_V22_ADDRESS` — LB v2.2
- `DEXLENS_ADDRESS` — USD prices (`getTokenPriceUSD`)
- `LIQUIDITY_HELPER_V2_ADDRESS` — user LP amounts per bin
- `LIQUIDITY_AMOUNTS_HELPER_ADDRESS` — deposit amount calculations

Full table: [docs/contracts.md](./docs/contracts.md)

## Bin math (DLMM)

- Neutral bin id: **8388608**
- Price from bin id: `Bin.getPriceFromId(id, binStep)` → `(1 + binStep/10000) ** (id - 8388608)`
- Always sort tokens: `tokenA.sortsBefore(tokenB)` before factory calls

Details: [docs/bin-math-and-dlmm.md](./docs/bin-math-and-dlmm.md)

## Common Base tokens

| Symbol | Address | Decimals |
|--------|---------|----------|
| WETH | `0x4200000000000000000000000000000000000006` | 18 |
| USDC | `0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913` | 6 |
| USDbC | `0xfde4C96c8593536E31F229EA991fFB150061ceb1` | 6 |

Reference pair (WETH/USDC LB v2.0, binStep 25): `0x51C496B41F7731E98c132621D5120CA60e7A5fD2`

## What is NOT supported on Base

Addresses are `0x000…000` — do not call:

- Farms / MasterChef / JOE token (`@sectorone/sdk` legacy constants)
- LB v2.1 factory/router/quoter
- Limit orders, rewarder, APT farms (zeroed in SDK)

## RPC requirements

- Use a dedicated Base RPC URL in production (`BASE_RPC_URL` env).
- Public `https://mainnet.base.org` rate-limits heavily.
- Integration tests: `SECTORONE_INTEGRATION_TESTS=1 BASE_RPC_URL=... pnpm test --filter @sectorone/sdk-v2`

## Documentation index

| Doc | Purpose |
|-----|---------|
| [docs/getting-started.md](./docs/getting-started.md) | Install, build, first script |
| [docs/architecture.md](./docs/architecture.md) | Packages, classes, data flow |
| [docs/cookbook.md](./docs/cookbook.md) | Copy-paste recipes |
| [docs/viem-integration.md](./docs/viem-integration.md) | readContract / writeContract patterns |
| [docs/contracts.md](./docs/contracts.md) | All deployed addresses |
| [examples/](./examples/) | Runnable reference snippets |

## Upstream

Fork of [lfj-gg/joe-sdks](https://github.com/lfj-gg/joe-sdks). ABIs and DLMM math match Joe Liquidity Book; **addresses are SectorOne-specific**.
