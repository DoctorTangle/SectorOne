/** Set SECTORONE_INTEGRATION_TESTS=1 (and optionally BASE_RPC_URL) to run live Base RPC tests. */
export const integrationTestsEnabled =
  process.env.SECTORONE_INTEGRATION_TESTS === '1' ||
  process.env.SECTORONE_INTEGRATION_TESTS === 'true'

export function baseRpcUrl(): string | undefined {
  return process.env.BASE_RPC_URL
}
