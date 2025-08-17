import { now, secondsAgo, isOlderThan } from "../utils/time";

describe("Time Utility", () => {
  describe("now", () => {
    it("should return current timestamp", () => {
      const before = Date.now();
      const result = now();
      const after = Date.now();
      
      expect(result).toBeGreaterThanOrEqual(before);
      expect(result).toBeLessThanOrEqual(after);
    });

    it("should return a number", () => {
      const result = now();
      expect(typeof result).toBe("number");
    });
  });

  describe("secondsAgo", () => {
    it("should return timestamp from specified seconds ago", () => {
      const seconds = 10;
      const result = secondsAgo(seconds);
      const expected = Date.now() - seconds * 1000;
      
      // Allow for small timing differences
      expect(Math.abs(result - expected)).toBeLessThan(100);
    });

    it("should handle zero seconds", () => {
      const result = secondsAgo(0);
      const expected = Date.now();
      
      expect(Math.abs(result - expected)).toBeLessThan(100);
    });

    it("should handle negative seconds", () => {
      const result = secondsAgo(-5);
      const expected = Date.now() + 5 * 1000;
      
      expect(Math.abs(result - expected)).toBeLessThan(100);
    });

    it("should handle large numbers", () => {
      const result = secondsAgo(3600); // 1 hour
      const expected = Date.now() - 3600 * 1000;
      
      expect(Math.abs(result - expected)).toBeLessThan(100);
    });
  });

  describe("isOlderThan", () => {
    it("should return true for timestamps older than specified seconds", () => {
      const oldTimestamp = Date.now() - 60000; // 1 minute ago
      const result = isOlderThan(oldTimestamp, 30); // 30 seconds
      
      expect(result).toBe(true);
    });

    it("should return false for timestamps newer than specified seconds", () => {
      const recentTimestamp = Date.now() - 10000; // 10 seconds ago
      const result = isOlderThan(recentTimestamp, 30); // 30 seconds
      
      expect(result).toBe(false);
    });

    it("should return false for timestamps exactly at the threshold", () => {
      const timestamp = Date.now() - 30000; // 30 seconds ago
      const result = isOlderThan(timestamp, 30); // 30 seconds
      
      expect(result).toBe(false);
    });

    it("should handle zero seconds threshold", () => {
      const oldTimestamp = Date.now() - 1000; // 1 second ago
      const result = isOlderThan(oldTimestamp, 0);
      
      expect(result).toBe(true);
    });

    it("should handle negative seconds threshold", () => {
      const timestamp = Date.now();
      const result = isOlderThan(timestamp, -10);
      
      expect(result).toBe(true);
    });

    it("should handle future timestamps", () => {
      const futureTimestamp = Date.now() + 60000; // 1 minute in future
      const result = isOlderThan(futureTimestamp, 30);
      
      expect(result).toBe(false);
    });
  });
});
