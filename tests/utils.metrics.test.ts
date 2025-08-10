import { recordCall, getCallCount } from '../utils/metrics'

test('tracks agent call count', () => {
  recordCall('test-agent')
  recordCall('test-agent')
  expect(getCallCount('test-agent')).toBe(2)
})
