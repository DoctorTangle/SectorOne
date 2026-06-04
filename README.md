# SectorOne SDK

TypeScript SDK for [SectorOne](https://sectorone.xyz) on **Base** (chainId `8453`). Forked from [lfj-gg/joe-sdks](https://github.com/lfj-gg/joe-sdks) (Trader Joe Liquidity Book SDK), adapted with SectorOne contract addresses.

## Packages

```bash
npm install @sectorone/sdk-core
npm install @sectorone/sdk      # Uniswap V2-style router/factory
npm install @sectorone/sdk-v2   # Liquidity Book (DLMM)
```

Peer dependency: `viem >= 2.5.0`

## Develop

```bash
pnpm install
pnpm build
pnpm test
```

### Integration tests (v2)

Live Base RPC tests are **skipped by default** (public RPC rate limits). To run them:

```bash
SECTORONE_INTEGRATION_TESTS=1 BASE_RPC_URL=https://your-base-rpc pnpm test --filter @sectorone/sdk-v2
```

## Base contracts

| Role | Address |
|------|---------|
| V2 Factory | `0xcF0685f37A139DE56AFC4A89aa343849358c05Cb` |
| V2 Router | `0xddF9025cf1fc3A7945ea54A53d856C81b9284C38` |
| LB Factory v2.0 | `0x217da3e53F221D1f36e8b09bc7d55d4012C0aa70` |
| LB Router v2.0 | `0xd4f937581650A2d6e416Dd9EF5372C1672422843` |
| LB Factory v2.2 | `0x3357f02fB3aA78fc86D3Bccdc5Edf039D4b952B5` |
| LB Router v2.2 | `0x87aC1EB5596D47f6fd7d0D17bEE233783dB5CfEC` |
| LB Quoter v2.2 | `0x15c7EFc1837E3867d10ddA89b32CD05a46ef4B14` |
| LiquidityHelper | `0x17E6Bfd8b8F8AC6981c9c786137d2D592c6773a8` |
| LiquidityAmounts | `0x3CF9c2eEdF007cF428B67219DcFb2FD700b1a2C0` |
| DexLens | `0x0Ff91bA6928F5Bb700662D72B8290FEa7A5a96D1` |
| VaultFactory | `0x8f04FF2198550DFdF5169892D1D47573b4F71BA6` |

## Example (LB v2.0)

```typescript
import { ChainId, Token, WNATIVE } from '@sectorone/sdk-core'
import { PairV2 } from '@sectorone/sdk-v2'
import { createPublicClient, http } from 'viem'
import { base } from 'viem/chains'

const client = createPublicClient({ chain: base, transport: http() })
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

## License

MIT — see [NOTICE](./NOTICE) for upstream attribution (Trader Joe / LFJ).
