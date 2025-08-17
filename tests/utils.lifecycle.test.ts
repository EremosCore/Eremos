import { initAgent, shutdownAgent, heartbeat } from "../utils/lifecycle";

describe("Lifecycle Utility", () => {
  describe("initAgent", () => {
    it("should log agent initialization", () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      
      initAgent("TestAgent");
      
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringMatching(/\[init\] Agent TestAgent activated at .*/)
      );
      consoleSpy.mockRestore();
    });

    it("should include timestamp in initialization message", () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      
      initAgent("TestAgent");
      
      const call = consoleSpy.mock.calls[0][0];
      expect(call).toMatch(/\[init\] Agent TestAgent activated at \d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z/);
      consoleSpy.mockRestore();
    });

    it("should handle different agent names", () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      
      initAgent("Agent1");
      initAgent("Agent2");
      
      expect(consoleSpy).toHaveBeenCalledTimes(2);
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining("Agent1")
      );
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining("Agent2")
      );
      consoleSpy.mockRestore();
    });
  });

  describe("shutdownAgent", () => {
    it("should log agent shutdown", () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      
      shutdownAgent("TestAgent");
      
      expect(consoleSpy).toHaveBeenCalledWith("[shutdown] Agent TestAgent deactivated.");
      consoleSpy.mockRestore();
    });

    it("should handle different agent names", () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      
      shutdownAgent("Agent1");
      shutdownAgent("Agent2");
      
      expect(consoleSpy).toHaveBeenCalledTimes(2);
      expect(consoleSpy).toHaveBeenCalledWith("[shutdown] Agent Agent1 deactivated.");
      expect(consoleSpy).toHaveBeenCalledWith("[shutdown] Agent Agent2 deactivated.");
      consoleSpy.mockRestore();
    });
  });

  describe("heartbeat", () => {
    it("should log agent heartbeat", () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      
      heartbeat("TestAgent");
      
      expect(consoleSpy).toHaveBeenCalledWith("[heartbeat] Agent TestAgent is alive.");
      consoleSpy.mockRestore();
    });

    it("should handle different agent names", () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      
      heartbeat("Agent1");
      heartbeat("Agent2");
      
      expect(consoleSpy).toHaveBeenCalledTimes(2);
      expect(consoleSpy).toHaveBeenCalledWith("[heartbeat] Agent Agent1 is alive.");
      expect(consoleSpy).toHaveBeenCalledWith("[heartbeat] Agent Agent2 is alive.");
      consoleSpy.mockRestore();
    });
  });
});
