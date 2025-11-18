import { FullConfig } from "@playwright/test";

async function globalTeardown(config: FullConfig) {
  console.log("🧹 Cleaning up E2E test environment...");

  try {
    // Clean up any test data or resources
    // Close database connections, clear test data, etc.

    console.log("✅ E2E test environment cleaned up");
  } catch (error) {
    console.error("❌ Failed to clean up E2E test environment:", error);
  }
}

export default globalTeardown;
