import { Theron } from '../agents/theron'

test('Theron returns memory snapshot', () => {
  const memory = Theron.getMemory()
  expect(Array.isArray(memory)).toBe(true)
  expect(memory.length).toBeGreaterThan(0)
})
