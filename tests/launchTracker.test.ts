/// <reference types="jest" />
import { LaunchTracker } from "../agents/launchtracker";
import * as logger from "../utils/logger";
import * as signalUtil from "../utils/signal";

describe("LaunchTracker.observe", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  test("calls logSignal when event matches launch criteria", () => {
    // spy on logSignal and generateSignalHash
    const logSpy = jest.spyOn(logger, "logSignal").mockImplementation(() => {});
    const hashSpy = jest.spyOn(signalUtil, "generateSignalHash").mockReturnValue("mock-hash-123");

    const mockEvent = {
      type: "wallet_activity",
      source: "kraken",
      fundingDetected: true,
      deployDetected: true,
      bundleCount: 3,
     
    };

    // Call the agent observe function
    LaunchTracker.observe(mockEvent);

    // Expect signature: one call to generateSignalHash and one call to logSignal
    expect(hashSpy).toHaveBeenCalledWith(mockEvent);
    expect(logSpy).toHaveBeenCalledTimes(1);

    // Check logSignal was called with an object that contains key properties
    expect(logSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        agent: "LaunchTracker",
        type: "launch_detected",
        glyph: "Σ",
        hash: expect.any(String),
        timestamp: expect.any(String),
        details: expect.objectContaining({
          confidence: 0.78,
        }),
      })
    );
  });

  test("does not call logSignal when criteria are not met", () => {
    const logSpy = jest.spyOn(logger, "logSignal").mockImplementation(() => {});
    const hashSpy = jest.spyOn(signalUtil, "generateSignalHash").mockImplementation(() => "should-not-be-called");

    const badEvent = {
      type: "wallet_activity",
      source: "kraken",
      fundingDetected: true,
      deployDetected: true,
      bundleCount: 2, // below threshold
    };

    LaunchTracker.observe(badEvent);

    expect(hashSpy).not.toHaveBeenCalled();
    expect(logSpy).not.toHaveBeenCalled();
  });
});
