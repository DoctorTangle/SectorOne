# Troubleshooting

## RPC rate limits (HTTP 429)

**Symptom:** `over rate limit` from `https://mainnet.base.org`

**Fix:** Set a dedicated RPC URL:

```bash
export BASE_RPC_URL=https://base-mainnet.g.alchemy.com/v2/YOUR_KEY
```

In apps, never rely on the public Base endpoint for production or test suites.

## Empty trades / "No route found"

**Causes:**

1. No LB pair exists for token pair + binStep
2. `bases` array too small — include WETH and major stables for routing
3. `maxHops` too low — try `2` or `3` in `RouteV2.createAllRoutes`
4. Amount too large for available liquidity

**Debug:**

```typescript
const pairs = await pair.fetchAvailableLBPairs('v22', client, ChainId.BASE)
console.log('Available pairs:', pairs)
```

## Wrong router / transaction reverts

- Swaps quoted via **LB Quoter v2.2** should execute on **`LB_ROUTER_V22_ADDRESS`**
- Legacy v2.0-only pairs may need **`LB_ROUTER_ADDRESS`**
- Check `trade.quote.versions` in the route

## Token approval

ERC-20 swaps require `approve(spender, amount)` on the **router** address before `swapExactTokensFor*`.

Native ETH swaps send `value` in the transaction — no approval needed.

## Chain id errors

SDK is **Base-only**. `ChainId` only contains `BASE = 8453`.

Do not pass Avalanche, Fuji, or other chain ids from upstream Joe SDK examples.

## WAVAX alias

`WAVAX` is a deprecated alias for `WNATIVE` (WETH on Base). Prefer `WNATIVE[ChainId.BASE]` in new code.

## Subgraphs return empty

Subgraph URL constants are intentionally empty — this SDK does not include a hosted subgraph. Use on-chain reads.

## Build OOM (TypeScript declarations)

If `tsup` runs out of memory generating `.d.ts` for `sdk-v2`:

```bash
NODE_OPTIONS=--max-old-space-size=8192 pnpm build
```

## Integration tests in this repo

Default `pnpm test` skips live Base RPC tests. To enable:

```bash
SECTORONE_INTEGRATION_TESTS=1 BASE_RPC_URL=https://your-rpc pnpm test --filter @sectorone/sdk-v2
```

## Getting help

- [SectorOne docs](https://docs.sectorone.xyz/)
- [GitHub issues](https://github.com/DoctorTangle/SectorOne/issues)
- Contract verification: [Basescan](https://basescan.org/)
