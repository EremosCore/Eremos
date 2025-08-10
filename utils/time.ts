export function now(): number {
  return Date.now()
}

export function secondsAgo(seconds: number): number {
  return Date.now() - seconds * 1000
}

export function isOlderThan(timestamp: number, seconds: number): boolean {
  return now() - timestamp > seconds * 1000
}
