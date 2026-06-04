import { ChainId, WAVAX, Token } from '@sectorone/sdk-core'
import { PairV2 } from './pair'
import { createPublicClient, http } from 'viem'
import { base } from 'viem/chains'
import { describe, it, expect } from 'vitest'
import { baseRpcUrl, integrationTestsEnabled } from '../test/helpers'

describe('PairV2 entity', () => {
  const CLIENT = createPublicClient({
    chain: base,
    transport: http(baseRpcUrl())
  })
  const CHAIN_ID = ChainId.BASE

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
  const WETH = WAVAX[ChainId.BASE]

  const pair1 = new PairV2(USDC, WETH)
  const pair2 = new PairV2(WETH, USDC)
  const pair3 = new PairV2(USDC, USDT)

  it('can be initialized in any order of tokens', () => {
    expect(pair1.equals(pair2)).toEqual(true)
  })

  describe.skipIf(!integrationTestsEnabled)('Base RPC integration', () => {
    it('can fetch all available v2 LBPairs', async () => {
      const LBPairs = await pair1.fetchAvailableLBPairs('v2', CLIENT, CHAIN_ID)
      expect(LBPairs.length).toBeGreaterThan(0)
    })

    it('can fetch single v2 LBPair given the bin step', async () => {
      const binStep = 25
      const LBPair = await pair1.fetchLBPair(binStep, 'v2', CLIENT, CHAIN_ID)
      expect(LBPair.binStep).toEqual(binStep)
      expect(LBPair.LBPair).not.toBeUndefined()
    })

    it.skip('v2.1 not deployed on SectorOne Base', async () => {
      const LBPairs = await pair1.fetchAvailableLBPairs('v21', CLIENT, CHAIN_ID)
      expect(LBPairs.length).toBe(0)
    })

    describe('PairV2.getLBPairReservesAndId()', () => {
      it('can fetch LBPair v2 reserves and activeId', async () => {
        const binStep = 25
        const LBPair = await pair1.fetchLBPair(binStep, 'v2', CLIENT, CHAIN_ID)

        const lbPairData = await PairV2.getLBPairReservesAndId(
          LBPair.LBPair,
          'v2',
          CLIENT
        )

        expect(lbPairData.activeId).not.toBeUndefined()
        expect(lbPairData.reserveX).not.toBeUndefined()
        expect(lbPairData.reserveY).not.toBeUndefined()
      })
    })

    describe('PairV2.getFeeParameters()', () => {
      it('can fetch LBPair fee parameters', async () => {
        const binStep = 25
        const LBPair = await pair1.fetchLBPair(binStep, 'v2', CLIENT, CHAIN_ID)

        const lbPairFeeParams = await PairV2.getFeeParameters(
          LBPair.LBPair,
          CLIENT
        )

        expect(lbPairFeeParams.baseFactor).not.toBeUndefined()
        expect(lbPairFeeParams.maxVolatilityAccumulated).not.toBeUndefined()
      })
    })
  })

  describe('PairV2.equals()', () => {
    it('returns true for equal pairs', () => {
      expect(pair1.equals(pair2)).toEqual(true)
    })
    it('returns false for different pairs', () => {
      expect(pair3.equals(pair2)).toEqual(false)
    })
  })

  describe('PairV2.createAllTokenPairs() / PairV2.initPairs()', () => {
    it('creates all possible combination of token pairs', () => {
      const TOKEN1 = new Token(
        ChainId.BASE,
        '0x0000000000000000000000000000000000000001',
        6,
        'TOKEN1',
        'TOKEN1'
      )
      const TOKEN2 = new Token(
        ChainId.BASE,
        '0x0000000000000000000000000000000000000002',
        6,
        'TOKEN2',
        'TOKEN2'
      )
      const BASES = [TOKEN1, TOKEN2]

      const allTokenPairs = PairV2.createAllTokenPairs(USDC, WETH, BASES)
      expect(allTokenPairs.length).toEqual(7)

      const allUniquePairs = PairV2.initPairs(allTokenPairs)
      expect(allUniquePairs.length).toEqual(6)
    })
  })

  describe('PairV2.calculateAmounts()', () => {
    it('can accurately amounts when activeBin is included', () => {
      const liquidity = ['13333333', '13600300', '13903508']
      const binIds = [8376297, 8376298, 8376299]
      const activeBin = 8376298
      const binsReserves = [
        { reserveX: '0', reserveY: '420588469' },
        { reserveX: '16644559640250455745', reserveY: '75236144' },
        { reserveX: '20272546666666666600', reserveY: '0' }
      ].map((el) => ({
        reserveX: BigInt(el.reserveX),
        reserveY: BigInt(el.reserveY)
      }))
      const totalSupplies = ['420588467', '421669945', '422789291'].map((el) =>
        BigInt(el)
      )

      const { amountX, amountY } = PairV2.calculateAmounts(
        binIds,
        activeBin,
        binsReserves,
        totalSupplies,
        liquidity
      )

      expect(amountX.toString()).toBe('1203510695082363975')
      expect(amountY.toString()).toBe('15759956')
    })

    it('can accurately calculate amounts when bin < activeBin', () => {
      const liquidity = ['13333333']
      const binIds = [8376297]
      const activeBin = 8376298
      const binsReserves = [{ reserveX: '0', reserveY: '420588469' }].map(
        (el) => ({
          reserveX: BigInt(el.reserveX),
          reserveY: BigInt(el.reserveY)
        })
      )
      const totalSupplies = ['420588467'].map((el) => BigInt(el))

      const { amountX, amountY } = PairV2.calculateAmounts(
        binIds,
        activeBin,
        binsReserves,
        totalSupplies,
        liquidity
      )

      expect(amountX.toString()).toBe('0')
      expect(amountY.toString()).toBe('13333333')
    })

    it('can accurately calculate amounts when bin > activeBin', () => {
      const liquidity = ['13903508']
      const binIds = [8376299]
      const activeBin = 8376298
      const binsReserves = [
        { reserveX: '20272546666666666600', reserveY: '0' }
      ].map((el) => ({
        reserveX: BigInt(el.reserveX),
        reserveY: BigInt(el.reserveY)
      }))
      const totalSupplies = ['422789291'].map((el) => BigInt(el))

      const { amountX, amountY } = PairV2.calculateAmounts(
        binIds,
        activeBin,
        binsReserves,
        totalSupplies,
        liquidity
      )

      expect(amountX.toString()).toBe('666666636928543519')
      expect(amountY.toString()).toBe('0')
    })
  })
})
