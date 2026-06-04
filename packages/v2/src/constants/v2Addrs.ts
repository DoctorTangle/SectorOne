import { Hex } from 'viem'
import { ChainId } from '@sectorone/sdk-core'

const Z = '0x0000000000000000000000000000000000000000' as Hex

/**
 * SectorOne deployed contracts on Base mainnet (chainId 8453).
 * @see https://docs.sectorone.xyz/
 */
export const MULTICALL_ADDRESS: { [chainId in ChainId]: Hex } = {
  [ChainId.BASE]: '0xcA11bde05977b3631167028862bE2a173976CA11'
}

/** LB v2.0 */
export const LB_FACTORY_ADDRESS: { [chainId in ChainId]: Hex } = {
  [ChainId.BASE]: '0x217da3e53F221D1f36e8b09bc7d55d4012C0aa70'
}

export const LB_ROUTER_ADDRESS: { [chainId in ChainId]: Hex } = {
  [ChainId.BASE]: '0xd4f937581650A2d6e416Dd9EF5372C1672422843'
}

/** LB v2.2 */
export const LB_FACTORY_V21_ADDRESS: { [chainId in ChainId]: Hex } = {
  [ChainId.BASE]: Z
}

export const LB_FACTORY_V22_ADDRESS: { [chainId in ChainId]: Hex } = {
  [ChainId.BASE]: '0x3357f02fB3aA78fc86D3Bccdc5Edf039D4b952B5'
}

export const LB_ROUTER_V21_ADDRESS: { [chainId in ChainId]: Hex } = {
  [ChainId.BASE]: Z
}

export const LB_ROUTER_V22_ADDRESS: { [chainId in ChainId]: Hex } = {
  [ChainId.BASE]: '0x87aC1EB5596D47f6fd7d0D17bEE233783dB5CfEC'
}

export const LB_QUOTER_ADDRESS: { [chainId in ChainId]: Hex } = {
  [ChainId.BASE]: Z
}

export const LB_QUOTER_V21_ADDRESS: { [chainId in ChainId]: Hex } = {
  [ChainId.BASE]: Z
}

export const LB_QUOTER_V22_ADDRESS: { [chainId in ChainId]: Hex } = {
  [ChainId.BASE]: '0x15c7EFc1837E3867d10ddA89b32CD05a46ef4B14'
}

export const DEXLENS_ADDRESS: { [chainId in ChainId]: Hex } = {
  [ChainId.BASE]: '0x0Ff91bA6928F5Bb700662D72B8290FEa7A5a96D1'
}

export const VAULT_FACTORY_ADDRESS: { [chainId in ChainId]: Hex } = {
  [ChainId.BASE]: '0x8f04FF2198550DFdF5169892D1D47573b4F71BA6'
}

export const LIQUIDITY_HELPER_V2_ADDRESS: { [chainId in ChainId]: Hex } = {
  [ChainId.BASE]: '0x17E6Bfd8b8F8AC6981c9c786137d2D592c6773a8'
}

export const LIQUIDITY_AMOUNTS_HELPER_ADDRESS: {
  [chainId in ChainId]: Hex
} = {
  [ChainId.BASE]: '0x3CF9c2eEdF007cF428B67219DcFb2FD700b1a2C0'
}

/** Not deployed on SectorOne Base — zeroed. */
export const LB_REWARDER_ADDRESS: { [chainId in ChainId]: Hex } = {
  [ChainId.BASE]: Z
}

export const LIMIT_ORDER_MANAGER_ADDRESS: { [chainId in ChainId]: Hex } = {
  [ChainId.BASE]: Z
}

export const APT_FARM_LENS: { [chainId in ChainId]: Hex } = {
  [ChainId.BASE]: Z
}

export const LB_HOOKS_LENS_ADDRESS: { [chainId in ChainId]: Hex } = {
  [ChainId.BASE]: Z
}

/** LBPair implementation contracts (reference / tooling). */
export const LB_PAIR_IMPLEMENTATION_V20: Hex =
  '0x37d11FFC23F4b87aE65a7ffd4951B331bdEd1dd9'
export const LB_PAIR_IMPLEMENTATION_V22: Hex =
  '0xF879E534A9c7a099DcB532FD931eb93E653649dB'
