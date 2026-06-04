# Tokens on Base

Common tokens for SectorOne integrations. Always verify decimals on-chain for unknown tokens.

## Native & wrapped

| Symbol | SDK access | Address | Decimals |
|--------|------------|---------|----------|
| ETH | `CNATIVE.onChain(ChainId.BASE)` | native | 18 |
| WETH | `WNATIVE[ChainId.BASE]` | `0x4200000000000000000000000000000000000006` | 18 |

## Stablecoins

| Symbol | Address | Decimals |
|--------|---------|----------|
| USDC | `0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913` | 6 |
| USDbC | `0xfde4C96c8593536E31F229EA991fFB150061ceb1` | 6 |

## Example LB pairs (WETH / USDC)

| binStep | Version | Pair address |
|---------|---------|--------------|
| 25 | v2.0 | `0x51C496B41F7731E98c132621D5120CA60e7A5fD2` |

Discover all pairs dynamically:

```typescript
const pair = new PairV2(USDC, WNATIVE[ChainId.BASE])
await pair.fetchAvailableLBPairs('v2', client, ChainId.BASE)
await pair.fetchAvailableLBPairs('v22', client, ChainId.BASE)
```

## Creating Token instances

```typescript
import { ChainId, Token } from '@sectorone/sdk-core'

const USDC = new Token(
  ChainId.BASE,
  '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
  6,
  'USDC',
  'USD Coin'
)
```

For unknown tokens, fetch decimals via ERC-20 `decimals()` or `@sectorone/sdk` `Fetcher.fetchTokenData` (requires RPC).

## Token logos (UI)

SectorOne / Metropolis frontends often use:

`https://tokenlogos.magicsea.finance/{symbol}.svg`

Not part of this SDK — documented for app developers.
