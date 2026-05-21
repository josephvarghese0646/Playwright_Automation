import { Page } from '@playwright/test';
import { Logger } from './logger';

/**
 * Wait Utilities - Common wait operations and retry logic
 */
export class WaitHelper {
  private static logger = new Logger('WaitHelper');

  /**
   * Wait for element to appear with retry
   */
  static async waitForElementWithRetry(
    page: Page,
    selector: string,
    maxRetries: number = 3,
    timeout: number = 5000
  ): Promise<boolean> {
    for (let i = 0; i < maxRetries; i++) {
      try {
        this.logger.debug(
          `Waiting for element (attempt ${i + 1}/${maxRetries}): ${selector}`
        );
        await page.waitForSelector(selector, { timeout });
        return true;
      } catch (error) {
        this.logger.warn(
          `Element not found (attempt ${i + 1}/${maxRetries}): ${selector}`
        );
        if (i < maxRetries - 1) {
          await page.waitForTimeout(1000);
        }
      }
    }
    return false;
  }

  /**
   * Wait for function condition with retry
   */
  static async waitForCondition(
    condition: () => Promise<boolean>,
    maxRetries: number = 5,
    delay: number = 1000
  ): Promise<boolean> {
    for (let i = 0; i < maxRetries; i++) {
      try {
        if (await condition()) {
          return true;
        }
      } catch (error) {
        this.logger.debug(`Condition check failed on attempt ${i + 1}`);
      }
      if (i < maxRetries - 1) {
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
    return false;
  }

  /**
   * Wait for network idle
   */
  static async waitForNetworkIdle(
    page: Page,
    timeout: number = 10000
  ): Promise<void> {
    this.logger.debug('Waiting for network to be idle');
    await page.waitForLoadState('networkidle', { timeout });
  }

  /**
   * Wait for DOM content loaded
   */
  static async waitForDOMContentLoaded(
    page: Page,
    timeout: number = 10000
  ): Promise<void> {
    this.logger.debug('Waiting for DOM content to load');
    await page.waitForLoadState('domcontentloaded', { timeout });
  }

  /**
   * Sleep for specified milliseconds
   */
  static async sleep(ms: number): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, ms));
  }
}
