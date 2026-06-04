import { Fetcher } from '../src'
import { describe, it, expect } from 'vitest'
import { ChainId, WAVAX, Token } from '@sectorone/sdk-core'

// Integration tests require a Base RPC; skipped until a stable test provider is configured.
describe.skip('data', () => {
  it('Token', async () => {
    const token = await Fetcher.fetchTokenData(
      ChainId.BASE,
      '0x6B175474E89094C44Da98b954EedeAC495271d0F'
    ) // DAI
    expect(token.decimals).toEqual(18)
  })

  it('Token:CACHE', async () => {
    const token = await Fetcher.fetchTokenData(
      ChainId.BASE,
      '0xE0B7927c4aF23765Cb51314A0E0521A9645F0E2A'
    ) // DGD
    expect(token.decimals).toEqual(9)
  })

  it('Pair', async () => {
    const token = new Token(
      ChainId.BASE,
      '0xc7AD46e0b8a400Bb3C915120d284AafbA8fc4735',
      18
    ) // DAI
    const pair = await Fetcher.fetchPairData(WAVAX[ChainId.BASE], token)
    expect(pair.liquidityToken.address).toEqual(
      '0x8B22F85d0c844Cf793690F6D9DFE9F11Ddb35449'
    )
  })
})
