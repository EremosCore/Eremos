import { Maelstrom } from "../agents/maelstrom";
import { generateSignalHash } from "../utils/signal";
import { logSignal } from "../utils/logger";

jest.mock("../utils/logger", () => ({
  logSignal: jest.fn(),
}));

jest.mock("../utils/signal", () => ({
  generateSignalHash: jest.fn(() => "fake-hash-123"),
}));

describe("Maelstrom Agent", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return a non-empty memory snapshot", () => {
    const mem = Maelstrom.getMemory!();
    expect(mem.length).toBeGreaterThan(0);
    expect(Array.isArray(mem)).toBe(true);
  });

  it("should log a signal when liquidity drains more than 30%", () => {
  const bigDropEvent = {
    type: "liquidity_event",
    pool: "SOL/USDC",
    percentOutflow: 42,
    whaleExit: true,
  };

  Maelstrom.observe(bigDropEvent);

  expect(generateSignalHash).toHaveBeenCalledWith(bigDropEvent);
  expect(logSignal).toHaveBeenCalledWith(
    expect.objectContaining({
      agent: "Maelstrom",
      type: "liquidity_drain",
      glyph: "⟲",
      hash: "fake-hash-123",
    })
  );
});

  it("should ignore small liquidity changes", () => {
    const smallDropEvent = {
      type: "liquidity_activity",
      pool: "SOL/USDC",
      dropPercent: 5,
      whaleExit: false,
    };

    Maelstrom.observe(smallDropEvent);

    expect(logSignal).not.toHaveBeenCalled();
  });
});
