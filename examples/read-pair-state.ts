/**
 * Read active bin, reserves, and fee parameters for a known WETH/USDC LB pair.
 */
import { ChainId, Token, WNATIVE } from '@sectorone/sdk-core'
import { PairV2 } from '@sectorone/sdk-v2'
import { createPublicClient, http } from 'viem'
import { base } from 'viem/chains'

const CHAIN = ChainId.BASE
const BIN_STEP = 25
const KNOWN_PAIR = '0x51C496B41F7731E98c132621D5120CA60e7A5fD2'

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

  const reserves = await PairV2.getLBPairReservesAndId(
    KNOWN_PAIR,
    'v2',
    client
  )
  console.log('Reserves & active bin:', {
    activeId: Number(reserves.activeId),
    reserveX: reserves.reserveX.toString(),
    reserveY: reserves.reserveY.toString()
  })

  const fees = await PairV2.getFeeParameters(KNOWN_PAIR, client)
  console.log('Fee parameters:', fees)

  const lbPair = await pair.fetchLBPair(BIN_STEP, 'v2', client, CHAIN)
  console.log('Factory lookup:', lbPair)
}

main().catch(console.error)
