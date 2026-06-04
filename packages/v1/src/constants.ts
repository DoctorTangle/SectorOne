import { Hex } from 'viem'
import { ChainId } from '@sectorone/sdk-core'

const Z = '0x0000000000000000000000000000000000000000' as Hex

const base = (addr: Hex): { [chainId in ChainId]: Hex } => ({
  [ChainId.BASE]: addr
})

const baseZero = (): { [chainId in ChainId]: Hex } => ({
  [ChainId.BASE]: Z
})

/** SectorOne Uniswap V2-style factory on Base. */
export const FACTORY_ADDRESS = base('0xcF0685f37A139DE56AFC4A89aa343849358c05Cb')

/** SectorOne Uniswap V2-style router on Base. */
export const ROUTER_ADDRESS = base('0xddF9025cf1fc3A7945ea54A53d856C81b9284C38')

/** Pair init code hash from SectorOne V2 factory on Base (`INIT_CODE_PAIR_HASH`). */
export const INIT_CODE_HASH = base(
  '0x07dfaef371a973f003dc4c74454e25c843913358a827acc444fa92626e886a4a'
)

export const JOE_ADDRESS = baseZero()
export const MASTERCHEF_ADDRESS = baseZero()
export const MASTERCHEF_V3_ADDRESS = baseZero()
export const BAR_ADDRESS = baseZero()
export const ZAP_ADDRESS = baseZero()
export const MAKER_ADDRESS = baseZero()
export const ROLL_ADDRESS = baseZero()
export const BORINGHELPER_ADDRESS = baseZero()
export const BORINGHELPER_MCV3_ADDRESS = baseZero()
export const BORINGHELPER_BMCJ_ADDRESS = baseZero()
export const BORINGTOKENSCANNER_ADDRESS = baseZero()
export const BORINGDASHBOARD_ADDRESS = baseZero()
export const LOCKING_WRAPPER_ADDRESS = baseZero()
export const FARMLENS_ADDRESS = baseZero()
export const FARMLENSV2_ADDRESS = baseZero()
export const ROCKET_JOE_TOKEN_ADDRESS = baseZero()
export const LAUNCH_EVENT_LENS_ADDRESS = baseZero()
export const ROCKET_JOE_STAKING_ADDRESS = baseZero()
export const STABLE_JOE_STAKING_ADDRESS = baseZero()
export const MONEY_MAKER_ADDRESS = baseZero()
export const SJOE_REWARD_TOKEN = baseZero()
export const VEJOE_STAKING_ADDRESS = baseZero()
export const VEJOE_TOKEN_ADDRESS = baseZero()
export const BOOSTED_MASTERCHEF_ADDRESS = baseZero()
export const UNITROLLER_ADDRESS = baseZero()
export const JOELENS_ADDRESS = baseZero()
export const JAVAX_ADDRESS = baseZero()
export const MAXIMILLION_ADDRESS = baseZero()
