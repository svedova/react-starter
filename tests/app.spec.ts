import { chromium } from "playwright-core";

const test = async () => {
  // Connect to the remote browser via Browserless
  const browser = await chromium.connect(
    process.env.PLAYWRIGHT_WS_ENDPOINT ||
      "ws://localhost:3000/chromium/playwright"
  );

  const context = await browser.newContext();
  const page = await context.newPage();
  const host = process.env.SK_DEPLOYMENT_URL || "http://localhost:5173";
  const url = `${host}/ssr`;

  try {
    // Navigate to your application
    const response = await page.goto(url);

    // Test your application
    await page.waitForSelector(".list");
    const title = await page.textContent("h1");
    console.log("Page title:", title);

    if (!response) {
      throw new Error("Failed to fetch API health endpoint");
    }

    console.log("API health status:", response.status());
    console.log("✅ All tests passed!");
  } catch (error) {
    console.error("❌ Test failed:", error.message);
    throw error;
  } finally {
    await context.close();
    await browser.close();
  }
};

// Run the test
(async () => {
  try {
    await test();
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
})();
