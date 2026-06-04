import { createPublicClient, http, PublicClient } from 'viem'
import { base } from 'viem/chains'
import { ChainId } from '@sectorone/sdk-core'

export const getDefaultPublicClient = (chainId: ChainId): PublicClient => {
  if (chainId !== ChainId.BASE) {
    throw new Error(`Unsupported chainId ${chainId}: SectorOne SDK is Base-only`)
  }
  return createPublicClient({
    chain: base,
    transport: http()
  })
}

export const getChain = (chainId: ChainId) => {
  if (chainId !== ChainId.BASE) {
    throw new Error(`Unsupported chainId ${chainId}: SectorOne SDK is Base-only`)
  }
  return base
}
