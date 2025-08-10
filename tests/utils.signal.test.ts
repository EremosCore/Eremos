import { generateSignalHash } from '../utils/signal'

test('Signal hash returns string', () => {
  const event = { type: 'wallet_activity' }
  const hash = generateSignalHash(event)
  expect(typeof hash).toBe('string')
  expect(hash.startsWith('sig_')).toBe(true)
})
