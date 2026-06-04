import { ChainId } from '@sectorone/sdk-core'

const empty = (): { [chainId in ChainId]: string } => ({
  [ChainId.BASE]: ''
})

export const EXCHANGE_SUBGRAPH = empty()
export const MASTERCHEF_SUBGRAPH = empty()
export const DEXCANDLES_SUBGRAPH = empty()
export const BAR_SUBGRAPH = empty()
export const LENDING_SUBGRAPH = empty()
export const ROCKET_SUBGRAPH = empty()
export const SJOE_SUBGRAPH = empty()
export const MONEY_MAKER_SUBGRAPH = empty()
export const VEJOE_SUBGRAPH = empty()
export const BOOSTED_MASTERCHEF_SUBGRAPH = empty()
export const NFT_CONTRACTS_SUBGRAPH = empty()
export const JOEPEG_MARKPLACE_SUBGRAPH = empty()
export const FEE_COLLECTOR_SUBGRAPH = empty()
