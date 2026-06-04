import { ChainId, WNATIVE, Token } from '@sectorone/sdk-core'
import { PairV2 } from './pair'
import { RouteV2 } from './route'
import { describe, it, expect } from 'vitest'

describe('RouteV2.createAllRoute()', () => {
  // init tokens and route bases
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
  const WETH = WNATIVE[ChainId.BASE]
  const BASES = [WETH, USDC, USDT]

  // init input / output
  const inputToken = USDC
  const outputToken = WETH

  // token pairs
  const allTokenPairs = PairV2.createAllTokenPairs(
    inputToken,
    outputToken,
    BASES
  )
  const allPairs = PairV2.initPairs(allTokenPairs) // console.log('allPairs', allPairs)

  // generate routes
  const hops = 4
  const allRoutes = RouteV2.createAllRoutes(
    allPairs,
    inputToken,
    outputToken,
    hops
  )

  it('generates routes with <= hops', () => {
    allRoutes.forEach((route) => {
      expect(route.pairs.length).toBeLessThanOrEqual(hops)
    })
  })

  it('generates routes with the correct input token', () => {
    allRoutes.forEach((route) => {
      expect(route.input.address).toBe(inputToken.address)
    })
  })

  it('generates routes with the correct output token', () => {
    allRoutes.forEach((route) => {
      expect(route.output.address).toBe(outputToken.address)
    })
  })

  it('generates routes without any overlapping tokens', () => {
    allRoutes.forEach((route) => {
      const set = new Set()
      route.path.forEach((token) => {
        expect(set.has(token.address)).toBe(false)
        set.add(token.address)
      })
    })
  })
})
