import { Page, Browser, BrowserContext, expect } from '@playwright/test';
import { Logger } from '../utils/logger';

/**
 * BasePage class - Foundation for all Page Object Models
 * Provides common Playwright utilities and methods for all pages
 */
export class BasePage {
  protected page: Page;
  protected logger: Logger;

  // Default wait times
  readonly SHORT_TIMEOUT = 5000;
  readonly MEDIUM_TIMEOUT = 10000;
  readonly LONG_TIMEOUT = 30000;

  constructor(page: Page) {
    this.page = page;
    this.logger = new Logger(this.constructor.name);
  }

  /**
   * Navigate to a specific URL
   */
  async goto(url: string): Promise<void> {
    this.logger.info(`Navigating to: ${url}`);
    await this.page.goto(url);
  }

  /**
   * Wait for page to load and be ready
   */
  async waitForPageLoad(): Promise<void> {
    this.logger.info('Waiting for page to load...');
    await this.page.waitForLoadState('networkidle', {
      timeout: this.MEDIUM_TIMEOUT,
    });
  }

  /**
   * Get page title
   */
  async getPageTitle(): Promise<string> {
    return this.page.title();
  }

  /**
   * Get page URL
   */
  async getCurrentUrl(): Promise<string> {
    return this.page.url();
  }

  /**
   * Fill text input field
   */
  async fillText(selector: string, text: string): Promise<void> {
    this.logger.info(`Filling text "${text}" in selector: ${selector}`);
    await this.page.fill(selector, text);
  }

  /**
   * Click on element
   */
  async click(selector: string): Promise<void> {
    this.logger.info(`Clicking element: ${selector}`);
    await this.page.click(selector);
  }

  /**
   * Click with retry logic
   */
  async clickWithRetry(
    selector: string,
    maxRetries: number = 3
  ): Promise<void> {
    let lastError: Error | null = null;
    for (let i = 0; i < maxRetries; i++) {
      try {
        this.logger.info(
          `Clicking element with retry (${i + 1}/${maxRetries}): ${selector}`
        );
        await this.click(selector);
        return;
      } catch (error) {
        lastError = error as Error;
        this.logger.warn(`Click attempt ${i + 1} failed, retrying...`);
        await this.page.waitForTimeout(500);
      }
    }
    throw lastError;
  }

  /**
   * Hover over element
   */
  async hover(selector: string): Promise<void> {
    this.logger.info(`Hovering over element: ${selector}`);
    await this.page.hover(selector);
  }

  /**
   * Check if element is visible
   */
  async isElementVisible(selector: string): Promise<boolean> {
    this.logger.info(`Checking visibility of: ${selector}`);
    try {
      await this.page.waitForSelector(selector, {
        timeout: this.SHORT_TIMEOUT,
      });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Wait for element to be visible
   */
  async waitForElement(selector: string): Promise<void> {
    this.logger.info(`Waiting for element: ${selector}`);
    await this.page.waitForSelector(selector, {
      timeout: this.MEDIUM_TIMEOUT,
    });
  }

  /**
   * Get text from element
   */
  async getText(selector: string): Promise<string> {
    this.logger.info(`Getting text from: ${selector}`);
    await this.waitForElement(selector);
    const content = await this.page.textContent(selector);
    return content || '';
  }

  /**
   * Get value from input field
   */
  async getInputValue(selector: string): Promise<string> {
    this.logger.info(`Getting input value from: ${selector}`);
    await this.waitForElement(selector);
    return (await this.page.inputValue(selector)) || '';
  }

  /**
   * Select option by value
   */
  async selectByValue(selector: string, value: string): Promise<void> {
    this.logger.info(`Selecting value "${value}" from dropdown: ${selector}`);
    await this.page.selectOption(selector, value);
  }

  /**
   * Select option by label
   */
  async selectByLabel(selector: string, label: string): Promise<void> {
    this.logger.info(`Selecting label "${label}" from dropdown: ${selector}`);
    await this.page.selectOption(selector, { label });
  }

  /**
   * Press keyboard key
   */
  async pressKey(key: string): Promise<void> {
    this.logger.info(`Pressing key: ${key}`);
    await this.page.keyboard.press(key);
  }

  /**
   * Take screenshot
   */
  async takeScreenshot(filename: string): Promise<void> {
    this.logger.info(`Taking screenshot: ${filename}`);
    await this.page.screenshot({ path: `./reports/${filename}` });
  }

  /**
   * Accept alert/dialog
   */
  async acceptAlert(): Promise<void> {
    this.logger.info('Accepting alert dialog');
    this.page.once('dialog', (dialog) => {
      dialog.accept();
    });
  }

  /**
   * Dismiss alert/dialog
   */
  async dismissAlert(): Promise<void> {
    this.logger.info('Dismissing alert dialog');
    this.page.once('dialog', (dialog) => {
      dialog.dismiss();
    });
  }

  /**
   * Get alert message
   */
  async getAlertText(): Promise<string> {
    let alertText = '';
    this.page.once('dialog', (dialog) => {
      alertText = dialog.message();
      dialog.accept();
    });
    return alertText;
  }

  /**
   * Wait for navigation
   */
  async waitForNavigation(): Promise<void> {
    this.logger.info('Waiting for page navigation');
    await this.page.waitForNavigation({ timeout: this.MEDIUM_TIMEOUT });
  }

  /**
   * Reload page
   */
  async reloadPage(): Promise<void> {
    this.logger.info('Reloading page');
    await this.page.reload();
  }

  /**
   * Go back in browser history
   */
  async goBack(): Promise<void> {
    this.logger.info('Going back in browser history');
    await this.page.goBack();
  }

  /**
   * Go forward in browser history
   */
  async goForward(): Promise<void> {
    this.logger.info('Going forward in browser history');
    await this.page.goForward();
  }

  /**
   * Get page content
   */
  async getPageContent(): Promise<string> {
    this.logger.info('Getting page content');
    return this.page.content();
  }

  /**
   * Execute JavaScript on page
   */
  async executeScript(script: string, args?: any[]): Promise<any> {
    this.logger.info('Executing JavaScript on page');
    return this.page.evaluate(script, args);
  }

  /**
   * Verify element has expected text
   */
  async verifyElementText(selector: string, expectedText: string): Promise<void> {
    this.logger.info(`Verifying element "${selector}" has text: "${expectedText}"`);
    const element = this.page.locator(selector);
    await expect(element).toContainText(expectedText);
  }

  /**
   * Verify element is enabled
   */
  async verifyElementEnabled(selector: string): Promise<void> {
    this.logger.info(`Verifying element "${selector}" is enabled`);
    const element = this.page.locator(selector);
    await expect(element).toBeEnabled();
  }

  /**
   * Verify element is disabled
   */
  async verifyElementDisabled(selector: string): Promise<void> {
    this.logger.info(`Verifying element "${selector}" is disabled`);
    const element = this.page.locator(selector);
    await expect(element).toBeDisabled();
  }

  /**
   * Wait and perform action
   */
  async waitAndDo(
    selector: string,
    action: (element: any) => Promise<void>
  ): Promise<void> {
    this.logger.info(`Waiting for element and performing action: ${selector}`);
    const element = this.page.locator(selector);
    await element.waitFor({ state: 'visible', timeout: this.MEDIUM_TIMEOUT });
    await action(element);
  }
}
