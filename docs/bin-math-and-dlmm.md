# Bin math & DLMM concepts

SectorOne DLMM (Liquidity Book) concentrates liquidity in **discrete price bins**.

## Core constants

| Name | Value | Meaning |
|------|-------|---------|
| `NEUTRAL_BIN_ID` | **8388608** | Price ratio 1:1 between token X and Y |
| `binStep` | e.g. 25 | Basis-point step between bins (25 = 0.25% per bin) |

SDK: `Bin` class in `@sectorone/sdk-v2`.

## Price from bin id

```
price = (1 + binStep / 10_000) ** (binId - 8388608)
```

```typescript
import { Bin } from '@sectorone/sdk-v2'

Bin.getPriceFromId(8388608, 25) // 1.0
Bin.getPriceFromId(8388609, 25) // ~1.0025
```

## Bin id from price

```typescript
Bin.getIdFromPrice(1.05, 25) // integer bin id
```

## Slippage in bin ids

```typescript
Bin.getIdSlippageFromPriceSlippage(0.01, 25) // ~4 bins for 1% price slippage
```

Used internally by `PairV2.addLiquidityParameters`.

## Token X / Y ordering

LB pairs order tokens by address (lower address = token X). The SDK's `PairV2` constructor sorts `token0` / `token1` the same way as Uniswap.

When adding liquidity, `addLiquidityParameters` maps your amounts to tokenX/tokenY automatically.

## binStep

Each token pair can have **multiple LB pairs** with different `binStep` values (different granularity):

```typescript
const pairs = await pair.fetchAvailableLBPairs('v2', client, ChainId.BASE)
// [{ LBPair: '0x...', binStep: 25 }, { binStep: 100 }, ...]
```

Lower binStep → finer price grid, more bins for same range.

## Liquidity shapes

When adding liquidity, choose a distribution:

| `LiquidityDistribution` | Shape |
|-------------------------|-------|
| `SPOT` | Uniform around active bin |
| `CURVE` | Concentrated (bell curve) |
| `BID_ASK` | Split bid/ask sides |

Helpers: `getUniformDistributionFromBinRange`, `getCurveDistributionFromBinRange`, `getBidAskDistributionFromBinRange`.

## Active bin

The **active bin** is where the current spot price sits. Swaps move the active bin along the id axis.

Read it on-chain:

```typescript
const { activeId } = await PairV2.getLBPairReservesAndId(lbPairAddress, 'v2', client)
```

## Further reading

- [SectorOne docs](https://docs.sectorone.xyz/)
- Joe LB whitepaper (linked from package README)
- [Cookbook — add liquidity](./cookbook.md#8-build-add-liquidity-calldata)
