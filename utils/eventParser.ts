export function parseWalletEvent(event: any) {
  return {
    wallet: event.wallet || 'unknown',
    txCount: event.txCount || 0,
    timestamp: event.timestamp || new Date().toISOString(),
  }
}
