export function generateSignalHash(event: any): string {
  const base = JSON.stringify(event) + Date.now()
  const hash = Buffer.from(base).toString('base64').slice(0, 10)
  return 'sig_' + hash
}
