import { parseWalletEvent } from '../utils/eventParser'

test('parses wallet event fallback', () => {
  const parsed = parseWalletEvent({})
  expect(parsed.wallet).toBe('unknown')
})
