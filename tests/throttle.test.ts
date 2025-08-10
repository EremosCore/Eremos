import { shouldEmit } from '../utils/throttle'

test('throttles repeated signal emission', () => {
  const id = 'test-agent'
  expect(shouldEmit(id, 1000)).toBe(true)
  expect(shouldEmit(id, 1000)).toBe(false)
})
