/**
 * List Liquidity Book pairs for WETH/USDC on SectorOne Base.
 */
import { ChainId, Token, WNATIVE } from '@sectorone/sdk-core'
import { PairV2 } from '@sectorone/sdk-v2'
import { createPublicClient, http } from 'viem'
import { base } from 'viem/chains'

const CHAIN = ChainId.BASE

async function main() {
  const client = createPublicClient({
    chain: base,
    transport: http(process.env.BASE_RPC_URL)
  })

  const USDC = new Token(
    CHAIN,
    '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
    6,
    'USDC',
    'USD Coin'
  )

  const pair = new PairV2(USDC, WNATIVE[CHAIN])

  for (const version of ['v2', 'v22'] as const) {
    const lbPairs = await pair.fetchAvailableLBPairs(version, client, CHAIN)
    console.log(`\nLB ${version} pairs (${lbPairs.length}):`)
    for (const p of lbPairs) {
      console.log(`  binStep=${p.binStep}  pair=${p.LBPair}`)
    }
  }
}

main().catch(console.error)
