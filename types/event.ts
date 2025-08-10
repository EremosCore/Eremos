export type WalletActivityEvent = {
  type: 'wallet_activity'
  address: string
  timestamp: number
  cluster?: string[]
}

export type Signal = {
  type: string
  payload: any
  timestamp: number
  source: string
}
