import { ExampleAgent } from '../agents/example'
describe('ExampleAgent', () => {
  it('should return memory snapshot', () => {
    if (!ExampleAgent.getMemory) {
      throw new Error('getMemory is not implemented')
    }
    const mem = ExampleAgent.getMemory();
    expect(mem.length).toBeGreaterThan(0);
  });
});
