import { CNATIVE, ChainId } from '../src'
import { describe, it, expect } from 'vitest'

describe('NativeCurrency', () => {
  describe('CNATIVE', () => {
    it('returns ETH for Base (8453)', () => {
      expect(CNATIVE.onChain(ChainId.BASE).symbol).toBe('ETH')
    })
  })
})
