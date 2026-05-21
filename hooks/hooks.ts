import { Before, After, BeforeAll, AfterAll, setDefaultTimeout } from '@cucumber/cucumber';
import { chromium, Browser, BrowserContext, Page } from '@playwright/test';
import { Logger } from '../utils/logger';

// Set default timeout for Cucumber steps (30 seconds)
setDefaultTimeout(30000);

const logger = new Logger('Hooks');

// Global variables to track browser context
let browser: Browser;
let context: BrowserContext;
let page: Page;

// Make page and browser available globally for step definitions
declare global {
  var page: Page;
  var browser: Browser;
  var context: BrowserContext;
}

/**
 * BeforeAll Hook - Runs once before all scenarios
 */
BeforeAll(async function () {
  logger.info('Starting test suite - Launching browser');
  browser = await chromium.launch({
    headless: process.env.HEADLESS !== 'false',
  });
  global.browser = browser;
});

/**
 * Before Hook - Runs before each scenario
 */
Before(async function () {
  logger.info('Setting up new browser context and page');
  context = await browser.newContext({
    // Optional: Set viewport size
    viewport: { width: 1280, height: 720 },
  });
  page = await context.newPage();

  // Make page available globally
  global.page = page;
  global.context = context;

  // Add listener for console messages
  page.on('console', (msg) => {
    logger.debug(`Browser console [${msg.type()}]: ${msg.text()}`);
  });

  // Add listener for page errors
  page.on('pageerror', (error) => {
    logger.error(`Page error: ${error.message}`);
  });

  logger.info('Browser context and page setup complete');
});

/**
 * After Hook - Runs after each scenario
 */
After(async function (scenario: any) {
  const status = scenario.result?.status;
  const scenarioName = scenario.pickle?.name;

  logger.info(`Scenario "${scenarioName}" finished with status: ${status}`);

  // Take screenshot on failure
  if (status === 'FAILED') {
    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const screenshotPath = `./reports/failures/${scenarioName}-${timestamp}.png`;
      await page.screenshot({ path: screenshotPath });
      logger.info(`Screenshot saved: ${screenshotPath}`);
    } catch (error) {
      logger.warn(`Failed to take screenshot: ${error}`);
    }
  }

  // Close page and context
  if (page) {
    await page.close();
  }
  if (context) {
    await context.close();
  }

  logger.info('Browser context and page closed');
});

/**
 * AfterAll Hook - Runs once after all scenarios
 */
AfterAll(async function () {
  logger.info('Closing browser');
  if (browser) {
    await browser.close();
  }
  logger.info('Test suite completed');
});
