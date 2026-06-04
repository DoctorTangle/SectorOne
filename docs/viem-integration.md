# Viem integration

The SectorOne SDK is designed to work with [viem](https://viem.sh/) `PublicClient` and `WalletClient`. It does not ship its own RPC layer.

## Clients

```typescript
import { createPublicClient, createWalletClient, http } from 'viem'
import { base } from 'viem/chains'
import { privateKeyToAccount } from 'viem/accounts'

const transport = http(process.env.BASE_RPC_URL)

export const publicClient = createPublicClient({ chain: base, transport })

const account = privateKeyToAccount(process.env.PRIVATE_KEY as `0x${string}`)
export const walletClient = createWalletClient({
  chain: base,
  transport,
  account
})
```

## Read contract (direct)

Use exported ABIs and addresses:

```typescript
import { LBPairABI } from '@sectorone/sdk-v2'

const [reserveX, reserveY, activeId] = await publicClient.readContract({
  address: '0x51C496B41F7731E98c132621D5120CA60e7A5fD2',
  abi: LBPairABI,
  functionName: 'getReservesAndId'
})
```

Prefer SDK helpers when available (`PairV2.getLBPairReservesAndId`) — they handle version differences.

## SDK + multicall (quotes)

`TradeV2.getTradesExactIn` / `getTradesExactOut` internally use `publicClient.multicall` against the LB Quoter. Ensure your RPC supports multicall.

## Write contract (swap)

```typescript
import {
  TradeV2,
  LBRouterV22ABI,
  LB_ROUTER_V22_ADDRESS
} from '@sectorone/sdk-v2'
import { ChainId } from '@sectorone/sdk-core'
import { maxUint256 } from 'viem'

const router = LB_ROUTER_V22_ADDRESS[ChainId.BASE]
const { methodName, args, value } = trade.swapCallParameters({
  allowedSlippage,
  ttl: 1200,
  recipient: account.address
})

// Approve input token (skip for native ETH in)
await walletClient.writeContract({
  address: tokenIn.address,
  abi: erc20Abi,
  functionName: 'approve',
  args: [router, maxUint256]
})

const hash = await walletClient.writeContract({
  address: router,
  abi: LBRouterV22ABI,
  functionName: methodName,
  args: args as never,
  value: BigInt(value)
})
```

**Router selection:** If the trade route uses only v2.0 pairs, you may need `LBRouterABI` + `LB_ROUTER_ADDRESS`. Most new integrations use v2.2 router + quoter. Inspect `trade.quote.versions` if you support mixed routes.

## wagmi

Use wagmi v2 with `base` chain config. Pass wagmi's public client to SDK methods:

```typescript
import { usePublicClient, useWalletClient } from 'wagmi'

const publicClient = usePublicClient({ chainId: 8453 })
const trades = await TradeV2.getTradesExactIn(/* ..., */ publicClient!, ChainId.BASE)
```

## Error handling

| Error | Likely cause |
|-------|----------------|
| HTTP 429 | Public RPC rate limit — use `BASE_RPC_URL` |
| `No route` / empty trades | No liquidity path; expand `bases` or `maxHops` |
| `CHAIN_IDS` | Tokens on different chains (only Base supported) |
| Multicall failure | RPC doesn't support multicall3 |

See [troubleshooting.md](./troubleshooting.md).

## Environment variables

| Variable | Purpose |
|----------|---------|
| `BASE_RPC_URL` | Base mainnet JSON-RPC endpoint |
| `SECTORONE_INTEGRATION_TESTS` | Set to `1` to run live RPC tests in this repo |
