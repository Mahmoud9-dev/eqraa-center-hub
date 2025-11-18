import { chromium, FullConfig } from "@playwright/test";

async function globalSetup(config: FullConfig) {
  console.log("🚀 Setting up E2E test environment...");

  // Set up test database or other global resources
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    // Navigate to the app and wait for it to be ready
    await page.goto(config.webServer?.url || "http://localhost:8080");
    await page.waitForLoadState("networkidle");

    // Set up any test data or authentication
    console.log("✅ E2E test environment ready");
  } catch (error) {
    console.error("❌ Failed to set up E2E test environment:", error);
    throw error;
  } finally {
    await context.close();
    await browser.close();
  }
}

export default globalSetup;
