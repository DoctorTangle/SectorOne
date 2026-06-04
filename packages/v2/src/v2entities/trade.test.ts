import {
  ChainId,
  WNATIVE as _WNATIVE,
  Token,
  TokenAmount,
  Percent
} from '@sectorone/sdk-core'
import { PairV2 } from './pair'
import { RouteV2 } from './route'
import { TradeV2 } from './trade'
import { LBPairABI } from '../abis/ts'
import { createPublicClient, http, parseUnits } from 'viem'
import { base } from 'viem/chains'
import { describe, it, expect } from 'vitest'
import JSBI from 'jsbi'
import { baseRpcUrl, integrationTestsEnabled } from '../test/helpers'

describe('TradeV2 entity', () => {
  const CLIENT = createPublicClient({
    chain: base,
    transport: http(baseRpcUrl())
  })
  const CHAIN_ID = ChainId.BASE

  // init tokens and route bases
  const lbPairAddress = '0x51C496B41F7731E98c132621D5120CA60e7A5fD2'
  const USDC = new Token(
    ChainId.BASE,
    '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
    6,
    'USDC',
    'USD Coin'
  )
  const USDT = new Token(
    ChainId.BASE,
    '0xfde4C96c8593536E31F229EA991fFB150061ceb1',
    6,
    'USDbC',
    'USD Base Coin'
  )
  const WNATIVE = _WNATIVE[ChainId.BASE]
  const BASES = [WNATIVE, USDC, USDT]

  // init input / output
  const inputToken = USDC
  const outputToken = WNATIVE

  // token pairs
  const allTokenPairs = PairV2.createAllTokenPairs(
    inputToken,
    outputToken,
    BASES
  )
  const allPairs = PairV2.initPairs(allTokenPairs) // console.log('allPairs', allPairs)

  // all routes
  const allRoutes = RouteV2.createAllRoutes(
    allPairs,
    inputToken,
    outputToken,
    2
  )

  // user input for exactIn trade
  const typedValueIn = '4'
  const typedValueInParsed = parseUnits(
    typedValueIn,
    inputToken.decimals
  ).toString()

  const amountIn = new TokenAmount(inputToken, JSBI.BigInt(typedValueInParsed))

  // user input for exactOut trade
  const typedValueOut = '0.2'
  const typedValueOutParsed = parseUnits(
    typedValueOut,
    outputToken.decimals
  ).toString()
  const amountOut = new TokenAmount(
    outputToken,
    JSBI.BigInt(typedValueOutParsed)
  )

  describe.skipIf(!integrationTestsEnabled)('Base RPC integration', () => {
  describe('TradeV2.getTradesExactIn()', () => {
    it('generates at least one trade', async () => {
      const trades = await TradeV2.getTradesExactIn(
        allRoutes,
        amountIn,
        outputToken,
        false,
        false,
        CLIENT,
        CHAIN_ID
      )
      expect(trades.length).toBeGreaterThan(0)
    })
  })
  describe('TradeV2.getTradesExactOut()', () => {
    it('generates at least one exact out trade', async () => {
      const trades = await TradeV2.getTradesExactOut(
        allRoutes,
        amountOut,
        inputToken,
        false,
        false,
        CLIENT,
        CHAIN_ID
      )

      expect(trades.length).toBeGreaterThan(0)
    })

    it('calculates price impact correctly', async () => {
      const [reserveX] = await CLIENT.readContract({
        abi: LBPairABI,
        address: lbPairAddress,
        functionName: 'getReservesAndId'
      })
      const largeOut = reserveX / 20n
      const amountOut = new TokenAmount(outputToken, largeOut)

      const trades = await TradeV2.getTradesExactOut(
        allRoutes,
        amountOut,
        inputToken,
        false,
        false,
        CLIENT,
        CHAIN_ID
      )

      expect(trades.length).toBeGreaterThan(0)
      expect(Number(trades[0]!.priceImpact.toFixed(2))).toBeGreaterThan(0)
    })
  })
  describe('TradeV2.chooseBestTrade()', () => {
    it('chooses the best trade among exactIn trades', async () => {
      const trades = await TradeV2.getTradesExactIn(
        allRoutes,
        amountIn,
        outputToken,
        false,
        false,
        CLIENT,
        CHAIN_ID
      )

      const isExactIn = true

      let maxOutputAmount = (trades[0] as TradeV2).outputAmount.raw

      trades.forEach((trade) => {
        if (trade) {
          if (JSBI.greaterThan(trade.outputAmount.raw, maxOutputAmount)) {
            maxOutputAmount = trade.outputAmount.raw
          }
        }
      })

      const bestTrade = TradeV2.chooseBestTrade(trades as TradeV2[], isExactIn)

      expect(
        JSBI.equal(maxOutputAmount, (bestTrade as TradeV2).outputAmount.raw)
      ).toBe(true)
    })
    it('chooses the best trade among exactOut trades', async () => {
      const trades = await TradeV2.getTradesExactOut(
        allRoutes,
        amountOut,
        inputToken,
        false,
        false,
        CLIENT,
        CHAIN_ID
      )

      expect(trades.length).toBeGreaterThan(0)

      const isExactIn = false

      let minInputAmount = (trades[0] as TradeV2).inputAmount.raw

      trades.forEach((trade) => {
        if (trade) {
          if (JSBI.lessThan(trade.inputAmount.raw, minInputAmount)) {
            minInputAmount = trade.inputAmount.raw
          }
        }
      })

      const bestTrade = TradeV2.chooseBestTrade(trades as TradeV2[], isExactIn)

      expect(
        JSBI.equal(minInputAmount, (bestTrade as TradeV2).inputAmount.raw)
      ).toBe(true)
    })
  })
  describe('TradeV2.getTradesExactIn() and TradeV2.getTradesExactIn()', () => {
    it('generates the same route for the same inputToken / outputToken', async () => {
      const tradesExactIn = await TradeV2.getTradesExactIn(
        allRoutes,
        amountIn,
        outputToken,
        false,
        false,
        CLIENT,
        CHAIN_ID
      )

      const tradesExactOut = await TradeV2.getTradesExactOut(
        allRoutes,
        amountOut,
        inputToken,
        false,
        false,
        CLIENT,
        CHAIN_ID
      )

      const isExactIn = true
      const bestTradeExactIn = TradeV2.chooseBestTrade(
        tradesExactIn as TradeV2[],
        isExactIn
      )
      const bestTradeExactOut = TradeV2.chooseBestTrade(
        tradesExactOut as TradeV2[],
        !isExactIn
      )

      expect((bestTradeExactIn as TradeV2).route.path.length).toBe(
        (bestTradeExactOut as TradeV2).route.path.length
      )

      if (bestTradeExactIn && bestTradeExactOut) {
        bestTradeExactIn.route.path.forEach((token, i) => {
          const otherRouteToken = bestTradeExactOut.route.path[i]
          expect(token.address).toBe(otherRouteToken.address)
        })
      }
    })
  })
  describe('TradeV2.swapCallParameters()', () => {
    it('generates swapExactTokensForNATIVE method', async () => {
      const isNativeOut = true

      const trades = await TradeV2.getTradesExactIn(
        allRoutes,
        amountIn,
        outputToken,
        false,
        isNativeOut,
        CLIENT,
        CHAIN_ID
      )

      const bestTrade = TradeV2.chooseBestTrade(trades as TradeV2[], true)

      const options = {
        allowedSlippage: new Percent(JSBI.BigInt(50), JSBI.BigInt(10000)),
        ttl: 1000,
        recipient: '0x0000000000000000000000000000000000000000'
      }
      expect(bestTrade?.swapCallParameters(options)?.methodName).toBe(
        'swapExactTokensForNATIVE'
      )
    })
    it('generates swapExactTokensForTokens method', async () => {
      const isNativeOut = false

      const trades = await TradeV2.getTradesExactIn(
        allRoutes,
        amountIn,
        outputToken,
        false,
        isNativeOut,
        CLIENT,
        CHAIN_ID
      )

      const bestTrade = TradeV2.chooseBestTrade(trades as TradeV2[], true)

      const options = {
        allowedSlippage: new Percent(JSBI.BigInt(50), JSBI.BigInt(10000)),
        ttl: 1000,
        recipient: '0x0000000000000000000000000000000000000000'
      }
      expect(bestTrade?.swapCallParameters(options)?.methodName).toBe(
        'swapExactTokensForTokens'
      )
    })
  })
  })
})
