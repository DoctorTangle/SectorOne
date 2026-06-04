# Cookbook

Copy-paste recipes for common SectorOne integrations on Base.

All snippets assume:

```typescript
import { ChainId, Token, TokenAmount, Percent, WNATIVE } from '@sectorone/sdk-core'
import { createPublicClient, http, parseUnits } from 'viem'
import { base } from 'viem/chains'
import JSBI from 'jsbi'

const CHAIN = ChainId.BASE
const client = createPublicClient({
  chain: base,
  transport: http(process.env.BASE_RPC_URL)
})
```

---

## 1. List all LB pairs for a token pair

```typescript
import { PairV2 } from '@sectorone/sdk-v2'

const tokenA = new Token(CHAIN, '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913', 6, 'USDC', 'USD Coin')
const tokenB = WNATIVE[CHAIN]

const pair = new PairV2(tokenA, tokenB)

// v2.0 pairs
const pairsV2 = await pair.fetchAvailableLBPairs('v2', client, CHAIN)

// v2.2 pairs
const pairsV22 = await pair.fetchAvailableLBPairs('v22', client, CHAIN)

for (const { LBPair, binStep } of [...pairsV2, ...pairsV22]) {
  console.log({ pair: LBPair, binStep })
}
```

---

## 2. Read active bin and reserves

```typescript
import { PairV2 } from '@sectorone/sdk-v2'

const pair = new PairV2(USDC, WNATIVE[CHAIN])
const { LBPair } = await pair.fetchLBPair(25, 'v2', client, CHAIN) // binStep 25

const { activeId, reserveX, reserveY } = await PairV2.getLBPairReservesAndId(
  LBPair,
  'v2',
  client
)

console.log({ activeId: Number(activeId), reserveX, reserveY })
```

---

## 3. Quote and swap (exact input)

Full example: [examples/swap-exact-in.ts](../examples/swap-exact-in.ts)

```typescript
import { PairV2, RouteV2, TradeV2 } from '@sectorone/sdk-v2'

const USDC = new Token(CHAIN, '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913', 6, 'USDC', 'USD Coin')
const WETH = WNATIVE[CHAIN]
const bases = [WETH, USDC]

const pairs = PairV2.initPairs(PairV2.createAllTokenPairs(USDC, WETH, bases))
const routes = RouteV2.createAllRoutes(pairs, USDC, WETH, 2)

const amountIn = new TokenAmount(
  USDC,
  JSBI.BigInt(parseUnits('100', 6).toString())
)

const trades = await TradeV2.getTradesExactIn(
  routes,
  amountIn,
  WETH,
  false, // isNativeIn — true for ETH → token
  false, // isNativeOut — true for token → ETH
  client,
  CHAIN
)

const trade = TradeV2.chooseBestTrade(trades, true)
if (!trade) throw new Error('No route found')

console.log('Expected out:', trade.outputAmount.toSignificant(6))
console.log('Price impact %:', trade.priceImpact.toSignificant(2))

const swapParams = trade.swapCallParameters({
  allowedSlippage: new Percent(JSBI.BigInt(50), JSBI.BigInt(10_000)), // 0.5%
  ttl: 1200,
  recipient: '0xYourAddress'
})
// → { methodName, args, value } for LBRouter
```

**Flags for native ETH:**

| Direction | `isNativeIn` | `isNativeOut` | Router method (examples) |
|-----------|--------------|---------------|--------------------------|
| USDC → WETH | `false` | `false` | `swapExactTokensForTokens` |
| USDC → ETH | `false` | `true` | `swapExactTokensForNATIVE` |
| ETH → USDC | `true` | `false` | `swapExactNATIVEForTokens` |

---

## 4. Execute swap with viem

```typescript
import { LBRouterV22ABI, LB_ROUTER_V22_ADDRESS } from '@sectorone/sdk-v2'

// 1. ERC-20 approve tokenIn → LB_ROUTER_V22_ADDRESS[CHAIN]
// 2. Execute:
await walletClient.writeContract({
  address: LB_ROUTER_V22_ADDRESS[CHAIN],
  abi: LBRouterV22ABI,
  functionName: swapParams.methodName,
  args: swapParams.args,
  value: BigInt(swapParams.value),
  account
})
```

See [viem-integration.md](./viem-integration.md) for wallet setup.

---

## 5. Quote exact output

```typescript
const amountOut = new TokenAmount(
  WETH,
  JSBI.BigInt(parseUnits('0.1', 18).toString())
)

const trades = await TradeV2.getTradesExactOut(
  routes,
  amountOut,
  USDC,
  false,
  false,
  client,
  CHAIN
)

const trade = TradeV2.chooseBestTrade(trades, false)
```

---

## 6. USD price via DexLens

```typescript
import { DexLensABI, DEXLENS_ADDRESS } from '@sectorone/sdk-v2'

const price = await client.readContract({
  address: DEXLENS_ADDRESS[CHAIN],
  abi: DexLensABI,
  functionName: 'getTokenPriceUSD',
  args: [USDC.address]
})
// price is 18-decimal USD
```

---

## 7. User LP in bins (LiquidityHelper)

```typescript
import { LiquidityHelperV2ABI, LIQUIDITY_HELPER_V2_ADDRESS } from '@sectorone/sdk-v2'

const binIds = [8376297n, 8376298n, 8376299n]

const amounts = await client.readContract({
  address: LIQUIDITY_HELPER_V2_ADDRESS[CHAIN],
  abi: LiquidityHelperV2ABI,
  functionName: 'getAmountsOf',
  args: [lbPairAddress, userAddress, binIds]
})
```

---

## 8. Build add-liquidity calldata

```typescript
import { LiquidityDistribution } from '@sectorone/sdk-v2'

const pair = new PairV2(USDC, WNATIVE[CHAIN])
const amount0 = new TokenAmount(USDC, JSBI.BigInt(parseUnits('100', 6).toString()))
const amount1 = new TokenAmount(WNATIVE[CHAIN], JSBI.BigInt(parseUnits('0.05', 18).toString()))

const lpParams = pair.addLiquidityParameters(
  25, // binStep — must match existing LBPair
  amount0,
  amount1,
  new Percent(JSBI.BigInt(50), JSBI.BigInt(10_000)), // amount slippage
  new Percent(JSBI.BigInt(50), JSBI.BigInt(10_000)), // price slippage
  LiquidityDistribution.SPOT // uniform around active bin
)

// Use lpParams with LBRouter.addLiquidity or addLiquidityNATIVE
```

For custom bin ranges use helpers in `utils/liquidityDistribution.ts`:

- `getUniformDistributionFromBinRange`
- `getCurveDistributionFromBinRange`
- `getBidAskDistributionFromBinRange`

---

## 9. V2-style pair address (constant product)

```typescript
import { Pair, FACTORY_ADDRESS } from '@sectorone/sdk'

const pairAddress = Pair.getAddress(tokenA, tokenB, CHAIN)
// Uses FACTORY_ADDRESS + INIT_CODE_HASH for CREATE2
```

---

## 10. Bin price helpers

```typescript
import { Bin } from '@sectorone/sdk-v2'

const binStep = 25
const activeId = 8388608
const price = Bin.getPriceFromId(activeId, binStep) // 1.0 at neutral bin
const id = Bin.getIdFromPrice(1.05, binStep)
```

See [bin-math-and-dlmm.md](./bin-math-and-dlmm.md).
