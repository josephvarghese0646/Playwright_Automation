import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { BasePage } from '../pages/BasePage';
import { LoginPage } from '../pages/LoginPage';
import { TestDataHelper } from '../utils/testDataHelper';

interface UserCredentials {
  username: string;
  password: string;
}

let basePage: BasePage;
let loginPage: LoginPage;

Given('I am on the login page', async function () {
  basePage = new BasePage(global.page);
  loginPage = new LoginPage(global.page);

  // Navigate to login page - adjust URL as needed
  await basePage.goto('https://example.com/login');
  await loginPage.waitForPageLoad();
});

When('I enter valid credentials', async function () {
  const testUser = TestDataHelper.getTestData<UserCredentials>('users.json', 'validUser');
  await loginPage.enterUsername(testUser.username);
  await loginPage.enterPassword(testUser.password);
});

When('I enter invalid credentials', async function () {
  const invalidUser = TestDataHelper.getTestData<UserCredentials>('users.json', 'invalidUser');
  await loginPage.enterUsername(invalidUser.username);
  await loginPage.enterPassword(invalidUser.password);
});

When('I click the login button', async function () {
  await loginPage.clickLoginButton();
});

Then('I should be redirected to the dashboard', async function () {
  await loginPage.waitForPageLoad();
  const currentUrl = await basePage.getCurrentUrl();
  expect(currentUrl).toContain('dashboard');
});

Then('I should see an error message', async function () {
  const errorVisible = await loginPage.isErrorMessageVisible();
  expect(errorVisible).toBe(true);
});

Then('I should see the login form', async function () {
  const formVisible = await loginPage.isLoginFormVisible();
  expect(formVisible).toBe(true);
});

Then('I should see the username field', async function () {
  const fieldVisible = await loginPage.isUsernameFieldVisible();
  expect(fieldVisible).toBe(true);
});

Then('I should see the password field', async function () {
  const fieldVisible = await loginPage.isPasswordFieldVisible();
  expect(fieldVisible).toBe(true);
});

Then('I should see the login button', async function () {
  const buttonVisible = await loginPage.isLoginButtonVisible();
  expect(buttonVisible).toBe(true);
});
