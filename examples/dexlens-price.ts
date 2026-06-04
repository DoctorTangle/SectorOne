/**
 * Read USD price from SectorOne DexLens on Base.
 */
import { ChainId, Token } from '@sectorone/sdk-core'
import { DexLensABI, DEXLENS_ADDRESS } from '@sectorone/sdk-v2'
import { createPublicClient, formatUnits, http } from 'viem'
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

  const price = await client.readContract({
    address: DEXLENS_ADDRESS[CHAIN],
    abi: DexLensABI,
    functionName: 'getTokenPriceUSD',
    args: [USDC.address as `0x${string}`]
  })

  console.log('USDC USD (18 decimals):', formatUnits(price, 18))
}

main().catch(console.error)
