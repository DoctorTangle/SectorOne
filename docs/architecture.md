# Architecture

## Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     Your app / agent                        │
│              (viem PublicClient / WalletClient)             │
└───────────────────────────┬─────────────────────────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        ▼                   ▼                   ▼
 @sectorone/sdk-v2   @sectorone/sdk    @sectorone/sdk-core
   (DLMM / LB)      (V2 AMM router)     (Token, amounts)
        │                   │                   │
        └───────────────────┴───────────────────┘
                            │
                            ▼
              SectorOne contracts on Base (8453)
```

## Packages

### `@sectorone/sdk-core`

Foundation types shared by all packages:

| Export | Role |
|--------|------|
| `ChainId` | `BASE = 8453` only |
| `Token`, `TokenAmount`, `CurrencyAmount` | ERC-20 + amounts |
| `WNATIVE` | WETH on Base (`0x4200…0006`) |
| `CNATIVE` / `NativeCurrency` | Native ETH representation |
| `Percent`, `Fraction`, `Price` | Math for slippage and prices |
| `TradeType` | `EXACT_INPUT` / `EXACT_OUTPUT` |

### `@sectorone/sdk-v2` (primary)

Joe Liquidity Book (DLMM) integration.

| Class / module | Role |
|----------------|------|
| `PairV2` | Token pair; fetch LB pairs, reserves, fee params, LP args |
| `RouteV2` | Multi-hop paths through `PairV2` instances |
| `TradeV2` | Quotes via LB Quoter; builds router calldata |
| `Bin` | Bin id ↔ price math |
| `constants/v2Addrs` | All SectorOne contract addresses |
| `abis/ts/*` | Typed viem ABIs (LBRouter, LBPair, LBFactory, DexLens, …) |
| `utils/liquidityDistribution` | Uniform / curve / bid-ask LP shapes |

**Typical swap pipeline:**

1. Define `Token` instances for input/output
2. `PairV2.createAllTokenPairs` + `PairV2.initPairs` — candidate pairs
3. `RouteV2.createAllRoutes(pairs, tokenIn, tokenOut, maxHops)`
4. `TradeV2.getTradesExactIn` or `getTradesExactOut` — multicall quoter
5. `TradeV2.chooseBestTrade` — pick best output (exact in) or input (exact out)
6. `trade.swapCallParameters({ allowedSlippage, ttl, recipient })` — router call
7. `walletClient.writeContract` on `LB_ROUTER_V22_ADDRESS` (or v2.0 router for legacy pairs)

### `@sectorone/sdk`

Classic Uniswap V2-style AMM (constant product):

| Class | Role |
|-------|------|
| `Pair` | CREATE2 pair address, reserves |
| `Route` | V2 multi-hop routes |
| `Trade` | V2 swap math |
| `Router` | V2 router calldata |

Use when interacting with `FACTORY_ADDRESS` / `ROUTER_ADDRESS` constant-product pools. Most SectorOne volume is on DLMM (`sdk-v2`).

## Protocol versions

SectorOne runs **two LB factory generations** on Base:

- **v2.0** — older pairs (`LB_FACTORY_ADDRESS`, `LB_ROUTER_ADDRESS`)
- **v2.2** — current (`LB_FACTORY_V22_ADDRESS`, `LB_ROUTER_V22_ADDRESS`, `LB_QUOTER_V22_ADDRESS`)

v2.1 is **not deployed** (SDK addresses are zero).

When quoting, `TradeV2` prefers the v2.2 quoter if deployed.

## Subgraphs

Subgraph URLs in the SDK are **empty strings** — indexing is not wired in this SDK. Use on-chain reads via viem + SDK helpers, or your own indexer.

## What we intentionally do not wrap

- Wallet connection (use wagmi, viem accounts, etc.)
- Token approval UI (call ERC-20 `approve` yourself)
- PnL / portfolio APIs (separate Metropolis/SectorOne backend)
- Limit orders, farms, vault strategies (not deployed or out of scope)
