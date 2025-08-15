import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: ["tests/**/*.test.ts"],
    exclude: ["node_modules/**", "dist/**"],
    reporters: ["default"],
    coverage: {
      reporter: ["text", "lcov", "html"],
      exclude: [
        "node_modules/**",
        "tests/**",
        "scripts/**",
        "docs/**",
        "*.config.*"
      ],
      thresholds: {
        global: {
          branches: 70,
          functions: 70,
          lines: 70,
          statements: 70
        }
      }
    },
    globals: true,
  },
});
