import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * LoginPage - Page Object for Login functionality
 * Extends BasePage and contains selectors and methods specific to the login page
 */
export class LoginPage extends BasePage {
  // Selectors - Update these based on your application's actual selectors
  readonly USERNAME_FIELD = 'input[name="username"]';
  readonly PASSWORD_FIELD = 'input[name="password"]';
  readonly LOGIN_BUTTON = 'button[type="submit"]';
  readonly ERROR_MESSAGE = '.error-message';
  readonly LOGIN_FORM = 'form[data-testid="login-form"]';

  constructor(page: Page) {
    super(page);
  }

  /**
   * Enter username
   */
  async enterUsername(username: string): Promise<void> {
    this.logger.info(`Entering username: ${username}`);
    await this.fillText(this.USERNAME_FIELD, username);
  }

  /**
   * Enter password
   */
  async enterPassword(password: string): Promise<void> {
    this.logger.info('Entering password');
    await this.fillText(this.PASSWORD_FIELD, password);
  }

  /**
   * Click login button
   */
  async clickLoginButton(): Promise<void> {
    this.logger.info('Clicking login button');
    await this.click(this.LOGIN_BUTTON);
  }

  /**
   * Check if error message is visible
   */
  async isErrorMessageVisible(): Promise<boolean> {
    this.logger.info('Checking if error message is visible');
    return this.isElementVisible(this.ERROR_MESSAGE);
  }

  /**
   * Get error message text
   */
  async getErrorMessage(): Promise<string> {
    this.logger.info('Getting error message text');
    return this.getText(this.ERROR_MESSAGE);
  }

  /**
   * Check if login form is visible
   */
  async isLoginFormVisible(): Promise<boolean> {
    this.logger.info('Checking if login form is visible');
    return this.isElementVisible(this.LOGIN_FORM);
  }

  /**
   * Check if username field is visible
   */
  async isUsernameFieldVisible(): Promise<boolean> {
    this.logger.info('Checking if username field is visible');
    return this.isElementVisible(this.USERNAME_FIELD);
  }

  /**
   * Check if password field is visible
   */
  async isPasswordFieldVisible(): Promise<boolean> {
    this.logger.info('Checking if password field is visible');
    return this.isElementVisible(this.PASSWORD_FIELD);
  }

  /**
   * Check if login button is visible
   */
  async isLoginButtonVisible(): Promise<boolean> {
    this.logger.info('Checking if login button is visible');
    return this.isElementVisible(this.LOGIN_BUTTON);
  }

  /**
   * Perform complete login flow
   */
  async login(username: string, password: string): Promise<void> {
    this.logger.info('Performing login flow');
    await this.enterUsername(username);
    await this.enterPassword(password);
    await this.clickLoginButton();
  }
}
