# Contracts on Base (8453)

All addresses are exported from SDK packages — **always import from the SDK** instead of hardcoding in your app.

## DLMM — Liquidity Book

| Constant | Address | Notes |
|----------|---------|-------|
| `LB_FACTORY_ADDRESS` | `0x217da3e53F221D1f36e8b09bc7d55d4012C0aa70` | LB v2.0 factory |
| `LB_ROUTER_ADDRESS` | `0xd4f937581650A2d6e416Dd9EF5372C1672422843` | LB v2.0 router |
| `LB_FACTORY_V22_ADDRESS` | `0x3357f02fB3aA78fc86D3Bccdc5Edf039D4b952B5` | LB v2.2 factory |
| `LB_ROUTER_V22_ADDRESS` | `0x87aC1EB5596D47f6fd7d0D17bEE233783dB5CfEC` | LB v2.2 router |
| `LB_QUOTER_V22_ADDRESS` | `0x15c7EFc1837E3867d10ddA89b32CD05a46ef4B14` | Quotes for routing |
| `LB_PAIR_IMPLEMENTATION_V20` | `0x37d11FFC23F4b87aE65a7ffd4951B331bdEd1dd9` | Implementation ref |
| `LB_PAIR_IMPLEMENTATION_V22` | `0xF879E534A9c7a099DcB532FD931eb93E653649dB` | Implementation ref |

### Not deployed (zero address in SDK)

| Constant | Value |
|----------|-------|
| `LB_FACTORY_V21_ADDRESS` | `0x000…000` |
| `LB_ROUTER_V21_ADDRESS` | `0x000…000` |
| `LB_QUOTER_ADDRESS` | `0x000…000` |
| `LB_QUOTER_V21_ADDRESS` | `0x000…000` |
| `LB_REWARDER_ADDRESS` | `0x000…000` |
| `LIMIT_ORDER_MANAGER_ADDRESS` | `0x000…000` |

Import: `@sectorone/sdk-v2`

## Helpers & oracles

| Constant | Address | ABI export |
|----------|---------|------------|
| `DEXLENS_ADDRESS` | `0x0Ff91bA6928F5Bb700662D72B8290FEa7A5a96D1` | `DexLensABI` |
| `LIQUIDITY_HELPER_V2_ADDRESS` | `0x17E6Bfd8b8F8AC6981c9c786137d2D592c6773a8` | `LiquidityHelperV2ABI` |
| `LIQUIDITY_AMOUNTS_HELPER_ADDRESS` | `0x3CF9c2eEdF007cF428B67219DcFb2FD700b1a2C0` | `LiquidityAmountsHelperABI` |
| `VAULT_FACTORY_ADDRESS` | `0x8f04FF2198550DFdF5169892D1D47573b4F71BA6` | `VaultFactoryABI` |
| `MULTICALL_ADDRESS` | `0xcA11bde05977b3631167028862bE2a173976CA11` | Standard Multicall3 |

## Uniswap V2-style AMM

| Constant | Address |
|----------|---------|
| `FACTORY_ADDRESS` | `0xcF0685f37A139DE56AFC4A89aa343849358c05Cb` |
| `ROUTER_ADDRESS` | `0xddF9025cf1fc3A7945ea54A53d856C81b9284C38` |
| `INIT_CODE_HASH` | `0x07dfaef371a973f003dc4c74454e25c843913358a827acc444fa92626e886a4a` |

Import: `@sectorone/sdk`

## ABIs

Typed ABIs are exported from `@sectorone/sdk-v2`:

```typescript
import {
  LBFactoryABI,
  LBFactoryV22ABI,
  LBPairABI,
  LBRouterABI,
  LBRouterV22ABI,
  LBQuoterV22ABI,
  DexLensABI,
  LiquidityHelperV2ABI
} from '@sectorone/sdk-v2'
```

JSON ABIs: `import { jsonAbis } from '@sectorone/sdk-v2'`

## Verification

Verify any address on [Basescan](https://basescan.org/) and cross-check with [SectorOne docs](https://docs.sectorone.xyz/).

Source of truth in code: `packages/v2/src/constants/v2Addrs.ts`, `packages/v1/src/constants.ts`.
