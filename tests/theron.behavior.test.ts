import { Theron } from '../agents/theron';

describe('Theron Behavior', () => {
  test('Theron processes anomaly events', () => {
    const event = { 
      type: "anomaly", 
      pattern: "suspicious",
      confidence: 0.8,
      timestamp: new Date().toISOString(),
      source: "test"
    };
    
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    
    Theron.observe(event);
    
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining("Theron")
    );
    consoleSpy.mockRestore();
  });

  test('Theron should not process non-anomaly events', () => {
    const event = { 
      type: "wallet_activity", 
      address: "0x123",
      amount: 100
    };
    
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    
    Theron.observe(event);
    
    expect(consoleSpy).not.toHaveBeenCalledWith(
      expect.stringContaining("Theron")
    );
    consoleSpy.mockRestore();
  });

  test('Theron should handle null/undefined events gracefully', () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    
    Theron.observe(null);
    Theron.observe(undefined);
    
    expect(consoleSpy).not.toHaveBeenCalledWith(
      expect.stringContaining("Theron")
    );
    consoleSpy.mockRestore();
  });

  test('Theron should have correct agent properties', () => {
    expect(Theron.id).toBe("agent-000");
    expect(Theron.name).toBe("Theron");
    expect(Theron.role).toBe("memory_vault");
    expect(Theron.watchType).toBe("anomaly_detection");
    expect(Theron.glyph).toBe("Ϸ");
    expect(Theron.triggerThreshold).toBe(Infinity);
    expect(Theron.lastSignal).toBe("ancient");
    expect(Theron.originTimestamp).toBe("2023-01-01T00:00:00.000Z");
    expect(Theron.description).toContain("The first observer");
  });

  test('Theron should process anomaly events with different patterns', () => {
    const events = [
      { type: "anomaly", pattern: "suspicious", confidence: 0.8 },
      { type: "anomaly", pattern: "unusual", confidence: 0.9 },
      { type: "anomaly", pattern: "anomalous", confidence: 0.7 }
    ];
    
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    
    events.forEach(event => {
      Theron.observe(event);
    });
    
    expect(consoleSpy).toHaveBeenCalledTimes(3);
    consoleSpy.mockRestore();
  });
});