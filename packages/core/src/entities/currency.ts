import JSBI from 'jsbi'
import { ChainId } from '../constants'
import { Token } from './token'
import { SolidityType } from '../constants'
import { validateSolidityTypeInstance } from '../utils'

/**
 * Represents the native currency of the chain on which it resides (ETH on Base).
 */
export class NativeCurrency {
  public readonly decimals: number
  public readonly symbol?: string
  public readonly name?: string
  public readonly isNative: true = true as const
  public readonly isToken: false = false as const
  public readonly chainId: number

  constructor(
    chainId: number,
    decimals: number,
    symbol?: string,
    name?: string
  ) {
    validateSolidityTypeInstance(JSBI.BigInt(decimals), SolidityType.uint8)
    this.chainId = chainId
    this.decimals = decimals
    this.symbol = symbol
    this.name = name
  }

  public equals(other: NativeCurrency): boolean {
    return other.isNative && other.chainId === this.chainId
  }
}

export class CNATIVE extends NativeCurrency {
  constructor(chainId: number) {
    if (chainId !== ChainId.BASE) {
      throw new Error(`Unsupported chainId ${chainId}: SectorOne SDK is Base-only`)
    }
    super(chainId, 18, 'ETH', 'Ethereum')
  }

  public equals(other: NativeCurrency): boolean {
    return other.isNative && other.chainId === this.chainId
  }

  private static _etherCache: { [chainId: number]: CNATIVE } = {}

  public static onChain(chainId: number): CNATIVE {
    return (
      this._etherCache[chainId] ??
      (this._etherCache[chainId] = new CNATIVE(chainId))
    )
  }
}

export type Currency = NativeCurrency | Token
