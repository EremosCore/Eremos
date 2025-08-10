describe('ExampleAgent', () => {
  it('should return memory snapshot', () => {
    const mem = ExampleAgent.getMemory()
    expect(mem.length).toBeGreaterThan(0)
  })
})
