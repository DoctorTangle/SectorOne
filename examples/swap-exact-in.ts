/**
 * Quote an exact-input swap on SectorOne DLMM (Base).
 *
 * Requires: @sectorone/sdk-core @sectorone/sdk-v2 viem jsbi
 * Env: BASE_RPC_URL
 */
import { ChainId, Token, TokenAmount, Percent, WNATIVE } from '@sectorone/sdk-core'
import {
  PairV2,
  RouteV2,
  TradeV2,
  LBRouterV22ABI,
  LB_ROUTER_V22_ADDRESS
} from '@sectorone/sdk-v2'
import { createPublicClient, http, parseUnits } from 'viem'
import { base } from 'viem/chains'
import JSBI from 'jsbi'

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
  const WETH = WNATIVE[CHAIN]
  const bases = [WETH, USDC]

  const pairs = PairV2.initPairs(
    PairV2.createAllTokenPairs(USDC, WETH, bases)
  )
  const routes = RouteV2.createAllRoutes(pairs, USDC, WETH, 2)

  const amountIn = new TokenAmount(
    USDC,
    JSBI.BigInt(parseUnits('10', 6).toString())
  )

  const trades = await TradeV2.getTradesExactIn(
    routes,
    amountIn,
    WETH,
    false,
    false,
    client,
    CHAIN
  )

  const trade = TradeV2.chooseBestTrade(trades, true)
  if (!trade) {
    throw new Error('No route — check liquidity and token pair')
  }

  console.log('Output:', trade.outputAmount.toSignificant(6), 'WETH')
  console.log('Impact:', trade.priceImpact.toSignificant(2), '%')

  const params = trade.swapCallParameters({
    allowedSlippage: new Percent(JSBI.BigInt(50), JSBI.BigInt(10_000)),
    ttl: 1200,
    recipient: '0x0000000000000000000000000000000000000001'
  })

  console.log('Router:', LB_ROUTER_V22_ADDRESS[CHAIN])
  console.log('Method:', params.methodName)
  console.log('Args:', params.args)
  console.log('Value:', params.value)

  // Next: approve USDC → router, then walletClient.writeContract({
  //   address: LB_ROUTER_V22_ADDRESS[CHAIN],
  //   abi: LBRouterV22ABI,
  //   functionName: params.methodName,
  //   args: params.args,
  //   value: BigInt(params.value),
  // })
}

main().catch(console.error)
