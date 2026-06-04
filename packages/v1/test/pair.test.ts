import {
  ChainId,
  Token,
  TokenAmount,
  WAVAX,
  Price
} from '@sectorone/sdk-core'
import { Pair } from '../src'
import { describe, it, expect } from 'vitest'

describe('Pair', () => {
  const USDT = new Token(
    ChainId.BASE,
    '0x3763fB99d772D1D96571F39508e34489F400750c',
    6,
    'USDT',
    'USDT Token'
  )
  const JOE = new Token(
    ChainId.BASE,
    '0x477Fd10Db0D80eAFb773cF623B258313C3739413',
    18,
    'JOE',
    'JOE Token'
  )

  const gUSDT = new Token(
    ChainId.BASE,
    '0xf450749aeA1c5feF27Ae0237C56FecC43f6bE244',
    6,
    'USDT',
    'Tether Token'
  )
  const gUSDC = new Token(
    ChainId.BASE,
    '0xb3482A25a12e5261b02E0acc5b96c656358a4086',
    6,
    'USDC',
    'USD Coin'
  )

  describe('constructor', () => {
    it('cannot be used for tokens on different chains', () => {
      const otherChainToken = new Token(
        999 as ChainId,
        USDT.address,
        6,
        'USDT',
        'USDT Token'
      )
      expect(
        () =>
          new Pair(
            new TokenAmount(USDT, '100'),
            new TokenAmount(otherChainToken, '100'),
            ChainId.BASE
          )
      ).toThrow('CHAIN_IDS')
    })
  })

  describe('#getAddress', () => {
    it('returns the correct CREATE2 pair address', () => {
      expect(Pair.getAddress(USDT, JOE, ChainId.BASE)).toEqual(
        '0xA62203bd74c54eb40B8dAFC9E9dfDA237a54D19c'
      )
    })
    it('returns the correct CREATE2 pair address (second token pair)', () => {
      expect(Pair.getAddress(gUSDT, gUSDC, ChainId.BASE)).toEqual(
        '0x8a28e7685D22804a612AB05625Ef5e34CD4649e2'
      )
    })
  })

  describe('#token0', () => {
    it('always is the token that sorts before', () => {
      expect(
        new Pair(
          new TokenAmount(JOE, '100'),
          new TokenAmount(USDT, '100'),
          ChainId.BASE
        ).token0
      ).toEqual(USDT)
      expect(
        new Pair(
          new TokenAmount(USDT, '100'),
          new TokenAmount(JOE, '100'),
          ChainId.BASE
        ).token0
      ).toEqual(USDT)
    })
  })
  describe('#token1', () => {
    it('always is the token that sorts after', () => {
      expect(
        new Pair(
          new TokenAmount(JOE, '100'),
          new TokenAmount(USDT, '100'),
          ChainId.BASE
        ).token1
      ).toEqual(JOE)
      expect(
        new Pair(
          new TokenAmount(USDT, '100'),
          new TokenAmount(JOE, '100'),
          ChainId.BASE
        ).token1
      ).toEqual(JOE)
    })
  })
  describe('#reserve0', () => {
    it('always comes from the token that sorts before', () => {
      expect(
        new Pair(
          new TokenAmount(JOE, '100'),
          new TokenAmount(USDT, '101'),
          ChainId.BASE
        ).reserve0
      ).toEqual(new TokenAmount(USDT, '101'))
      expect(
        new Pair(
          new TokenAmount(USDT, '101'),
          new TokenAmount(JOE, '100'),
          ChainId.BASE
        ).reserve0
      ).toEqual(new TokenAmount(USDT, '101'))
    })
  })
  describe('#reserve1', () => {
    it('always comes from the token that sorts after', () => {
      expect(
        new Pair(
          new TokenAmount(JOE, '100'),
          new TokenAmount(USDT, '101'),
          ChainId.BASE
        ).reserve1
      ).toEqual(new TokenAmount(JOE, '100'))
      expect(
        new Pair(
          new TokenAmount(USDT, '101'),
          new TokenAmount(JOE, '100'),
          ChainId.BASE
        ).reserve1
      ).toEqual(new TokenAmount(JOE, '100'))
    })
  })

  describe('#token0Price', () => {
    it('returns price of token0 in terms of token1', () => {
      expect(
        new Pair(
          new TokenAmount(JOE, '101'),
          new TokenAmount(USDT, '100'),
          ChainId.BASE
        ).token0Price
      ).toEqual(new Price(USDT, JOE, '100', '101'))
      expect(
        new Pair(
          new TokenAmount(USDT, '100'),
          new TokenAmount(JOE, '101'),
          ChainId.BASE
        ).token0Price
      ).toEqual(new Price(USDT, JOE, '100', '101'))
    })
  })

  describe('#token1Price', () => {
    it('returns price of token1 in terms of token0', () => {
      expect(
        new Pair(
          new TokenAmount(JOE, '101'),
          new TokenAmount(USDT, '100'),
          ChainId.BASE
        ).token1Price
      ).toEqual(new Price(JOE, USDT, '101', '100'))
      expect(
        new Pair(
          new TokenAmount(USDT, '100'),
          new TokenAmount(JOE, '101'),
          ChainId.BASE
        ).token1Price
      ).toEqual(new Price(JOE, USDT, '101', '100'))
    })
  })

  describe('#priceOf', () => {
    const pair = new Pair(
      new TokenAmount(JOE, '101'),
      new TokenAmount(USDT, '100'),
      ChainId.BASE
    )
    it('returns price of token in terms of other token', () => {
      expect(pair.priceOf(USDT)).toEqual(pair.token0Price)
      expect(pair.priceOf(JOE)).toEqual(pair.token1Price)
    })

    it('throws if invalid token', () => {
      expect(() => pair.priceOf(WAVAX[ChainId.BASE])).toThrow('TOKEN')
    })
  })

  describe('#reserveOf', () => {
    it('returns reserves of the given token', () => {
      expect(
        new Pair(
          new TokenAmount(JOE, '100'),
          new TokenAmount(USDT, '101'),
          ChainId.BASE
        ).reserveOf(JOE)
      ).toEqual(new TokenAmount(JOE, '100'))
      expect(
        new Pair(
          new TokenAmount(USDT, '101'),
          new TokenAmount(JOE, '100'),
          ChainId.BASE
        ).reserveOf(JOE)
      ).toEqual(new TokenAmount(JOE, '100'))
    })

    it('throws if not in the pair', () => {
      expect(() =>
        new Pair(
          new TokenAmount(USDT, '101'),
          new TokenAmount(JOE, '100'),
          ChainId.BASE
        ).reserveOf(WAVAX[ChainId.BASE])
      ).toThrow('TOKEN')
    })
  })

  describe('#chainId', () => {
    it('returns the token0 chainId', () => {
      expect(
        new Pair(
          new TokenAmount(JOE, '100'),
          new TokenAmount(USDT, '100'),
          ChainId.BASE
        ).chainId
      ).toEqual(ChainId.BASE)
      expect(
        new Pair(
          new TokenAmount(USDT, '100'),
          new TokenAmount(JOE, '100'),
          ChainId.BASE
        ).chainId
      ).toEqual(ChainId.BASE)
    })
  })
  describe('#involvesToken', () => {
    it('works', () => {
      expect(
        new Pair(
          new TokenAmount(JOE, '100'),
          new TokenAmount(USDT, '100'),
          ChainId.BASE
        ).involvesToken(JOE)
      ).toEqual(true)
      expect(
        new Pair(
          new TokenAmount(JOE, '100'),
          new TokenAmount(USDT, '100'),
          ChainId.BASE
        ).involvesToken(USDT)
      ).toEqual(true)
      expect(
        new Pair(
          new TokenAmount(JOE, '100'),
          new TokenAmount(USDT, '100'),
          ChainId.BASE
        ).involvesToken(WAVAX[ChainId.BASE])
      ).toEqual(false)
    })
  })
})
