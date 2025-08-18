import { logSignal } from "../utils/logger";

describe("Logger Utility", () => {
  it("should log signal without details", () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    
    const signal = {
      agent: "TestAgent",
      type: "test_signal",
      glyph: "T",
      hash: "test_hash_123",
      timestamp: "2025-01-01T00:00:00.000Z"
    };
    
    logSignal(signal);
    
    expect(consoleSpy).toHaveBeenCalledWith(
      "[TestAgent] stored signal test_hash_123 (test_signal) at 2025-01-01T00:00:00.000Z"
    );
    consoleSpy.mockRestore();
  });

  it("should log signal with details", () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    
    const signal = {
      agent: "TestAgent",
      type: "test_signal",
      glyph: "T",
      hash: "test_hash_123",
      timestamp: "2025-01-01T00:00:00.000Z",
      details: {
        address: "0x123",
        amount: 100,
        metadata: { source: "test" }
      }
    };
    
    logSignal(signal);
    
    expect(consoleSpy).toHaveBeenCalledWith(
      "[TestAgent] stored signal test_hash_123 (test_signal) at 2025-01-01T00:00:00.000Z"
    );
    expect(consoleSpy).toHaveBeenCalledWith(
      "├─ context:",
      JSON.stringify(signal.details, null, 2)
    );
    consoleSpy.mockRestore();
  });

  it("should handle different agent names", () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    
    const signal1 = {
      agent: "Agent1",
      type: "signal1",
      glyph: "A",
      hash: "hash1",
      timestamp: "2025-01-01T00:00:00.000Z"
    };
    
    const signal2 = {
      agent: "Agent2",
      type: "signal2",
      glyph: "B",
      hash: "hash2",
      timestamp: "2025-01-01T00:00:00.000Z"
    };
    
    logSignal(signal1);
    logSignal(signal2);
    
    expect(consoleSpy).toHaveBeenCalledWith(
      "[Agent1] stored signal hash1 (signal1) at 2025-01-01T00:00:00.000Z"
    );
    expect(consoleSpy).toHaveBeenCalledWith(
      "[Agent2] stored signal hash2 (signal2) at 2025-01-01T00:00:00.000Z"
    );
    consoleSpy.mockRestore();
  });

  it("should handle different signal types", () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    
    const signals = [
      { agent: "TestAgent", type: "anomaly", glyph: "A", hash: "hash1", timestamp: "2025-01-01T00:00:00.000Z" },
      { agent: "TestAgent", type: "wallet_activity", glyph: "W", hash: "hash2", timestamp: "2025-01-01T00:00:00.000Z" },
      { agent: "TestAgent", type: "mint_activity", glyph: "M", hash: "hash3", timestamp: "2025-01-01T00:00:00.000Z" }
    ];
    
    signals.forEach(signal => {
      logSignal(signal);
    });
    
    expect(consoleSpy).toHaveBeenCalledTimes(3);
    expect(consoleSpy).toHaveBeenCalledWith(
      "[TestAgent] stored signal hash1 (anomaly) at 2025-01-01T00:00:00.000Z"
    );
    expect(consoleSpy).toHaveBeenCalledWith(
      "[TestAgent] stored signal hash2 (wallet_activity) at 2025-01-01T00:00:00.000Z"
    );
    expect(consoleSpy).toHaveBeenCalledWith(
      "[TestAgent] stored signal hash3 (mint_activity) at 2025-01-01T00:00:00.000Z"
    );
    consoleSpy.mockRestore();
  });

  it("should handle empty details object", () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    
    const signal = {
      agent: "TestAgent",
      type: "test_signal",
      glyph: "T",
      hash: "test_hash_123",
      timestamp: "2025-01-01T00:00:00.000Z",
      details: {}
    };
    
    logSignal(signal);
    
    expect(consoleSpy).toHaveBeenCalledWith(
      "[TestAgent] stored signal test_hash_123 (test_signal) at 2025-01-01T00:00:00.000Z"
    );
    expect(consoleSpy).toHaveBeenCalledWith(
      "├─ context:",
      "{}"
    );
    consoleSpy.mockRestore();
  });
});
