// agents/sampleAgent.ts
import { logger, logSignal } from "../utils/logger";

export async function runSampleAgent() {
  try {
    logger.info("Sample agent started.");

    // Simulate getting a signal from somewhere
    const sampleSignal = {
      agent: "SampleAgent",
      type: "INFO",
      glyph: "🔍",
      hash: "abc123",
      timestamp: new Date().toISOString(),
      details: {
        message: "Test signal details here.",
        environment: "development"
      }
    };

    // Log the signal
    logSignal(sampleSignal);

    // Simulate work
    logger.debug("Processing the signal...");
    await new Promise((resolve) => setTimeout(resolve, 500));

    logger.info("Sample agent finished successfully.");
  } catch (error: any) {
    logger.error(`Sample agent failed: ${error.message || error}`);
  }
}

// Run the agent only if this file is executed directly
if (require.main === module) {
  runSampleAgent();
}
