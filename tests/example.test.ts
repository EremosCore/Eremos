import { ExampleAgent } from '../agents/example';

describe('ExampleAgent', () => {
  it('should return memory snapshot', () => {
    const mem = ExampleAgent.getMemory?.();
    expect(Array.isArray(mem)).toBe(true);
  });
});
