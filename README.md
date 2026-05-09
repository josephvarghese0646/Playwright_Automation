# 🎭 Playwright BDD — UI Automation Framework

A robust, scalable UI test automation framework built with **Playwright** and **Cucumber (BDD)**, following Page Object Model (POM) design pattern. Write human-readable test scenarios in Gherkin and execute them with the power of Playwright.

---

## 📋 Table of Contents

- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Configuration](#-configuration)
- [Writing Tests](#-writing-tests)
- [Running Tests](#-running-tests)
- [Reports](#-reports)
- [CI/CD Integration](#-cicd-integration)
- [Best Practices](#-best-practices)
- [Troubleshooting](#-troubleshooting)

---

## 🛠 Tech Stack

| Tool | Version | Purpose |
|------|---------|---------|
| [Node.js](https://nodejs.org/) | >= 18.x | Runtime environment |
| [Playwright](https://playwright.dev/) | ^1.44.0 | Browser automation |
| [playwright-bdd](https://vitalets.github.io/playwright-bdd/) | ^7.x | BDD integration layer |
| [Cucumber](https://cucumber.io/) | ^10.x | Gherkin test runner |
| [@cucumber/html-formatter](https://github.com/cucumber/html-formatter) | ^21.x | HTML reporting |
| [Allure Playwright](https://allurereport.org/docs/playwright/) | ^2.x | Allure reporting (optional) |
| [TypeScript](https://www.typescriptlang.org/) | ^5.x | Type-safe test development |

---

## ✅ Prerequisites

Ensure the following are installed before setting up the project:

- **Node.js** `v18` or higher — [Download](https://nodejs.org/)
- **npm** `v9` or higher (bundled with Node.js)
- **Git** — [Download](https://git-scm.com/)

Verify your environment:

```bash
node --version    # v18.x.x or higher
npm --version     # 9.x.x or higher
git --version
```

---

## 📁 Project Structure

```
playwright-bdd-framework/
│
├── .github/
│   └── workflows/
│       └── playwright.yml          # GitHub Actions CI pipeline
│
├── features/                       # Gherkin feature files
│   ├── login/
│   │   └── login.feature
│   ├── dashboard/
│   │   └── dashboard.feature
│   └── checkout/
│       └── checkout.feature
│
├── src/
│   ├── pages/                      # Page Object Models
│   │   ├── BasePage.ts
│   │   ├── LoginPage.ts
│   │   ├── DashboardPage.ts
│   │   └── CheckoutPage.ts
│   │
│   ├── steps/                      # Step definitions
│   │   ├── loginSteps.ts
│   │   ├── dashboardSteps.ts
│   │   └── checkoutSteps.ts
│   │
│   ├── hooks/                      # Cucumber hooks
│   │   └── hooks.ts
│   │
│   ├── fixtures/                   # Playwright fixtures
│   │   └── fixtures.ts
│   │
│   └── utils/                      # Helpers & utilities
│       ├── testData.ts
│       ├── apiHelper.ts
│       └── logger.ts
│
├── test-data/                      # Static test data (JSON/CSV)
│   ├── users.json
│   └── products.json
│
├── reports/                        # Generated test reports (gitignored)
│   ├── html/
│   ├── allure-results/
│   └── screenshots/
│
├── playwright.config.ts            # Playwright configuration
├── cucumber.config.ts              # Cucumber / BDD configuration
├── tsconfig.json                   # TypeScript configuration
├── package.json
├── .env.example                    # Environment variable template
├── .gitignore
└── README.md
```

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/your-org/playwright-bdd-framework.git
cd playwright-bdd-framework
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Install Playwright Browsers

```bash
npx playwright install
# Install specific browsers only (optional)
npx playwright install chromium firefox
```

### 4. Set Up Environment Variables

```bash
cp .env.example .env
```

Edit `.env` with your environment-specific values:

```env
BASE_URL=https://your-app-url.com
TEST_USERNAME=your_test_user@example.com
TEST_PASSWORD=your_test_password
ENVIRONMENT=staging
HEADLESS=true
```

---

## ⚙️ Configuration

### `playwright.config.ts`

```typescript
import { defineConfig, devices } from '@playwright/test';
import { defineBddConfig } from 'playwright-bdd';

const testDir = defineBddConfig({
  features: 'features/**/*.feature',
  steps: 'src/steps/**/*.ts',
});

export default defineConfig({
  testDir,
  timeout: 30_000,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : 4,
  reporter: [
    ['html', { outputFolder: 'reports/html', open: 'never' }],
    ['allure-playwright', { outputFolder: 'reports/allure-results' }],
    ['list'],
  ],
  use: {
    baseURL: process.env.BASE_URL,
    headless: process.env.HEADLESS !== 'false',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 5'] },
    },
  ],
});
```

### `cucumber.config.ts`

```typescript
export default {
  paths: ['features/**/*.feature'],
  require: ['src/steps/**/*.ts', 'src/hooks/**/*.ts'],
  requireModule: ['ts-node/register'],
  format: [
    'progress-bar',
    'html:reports/cucumber-report.html',
    'json:reports/cucumber-report.json',
  ],
  formatOptions: { snippetInterface: 'async-await' },
  tags: process.env.TAGS || '',
};
```

---

## ✍️ Writing Tests

### Step 1 — Create a Feature File

```gherkin
# features/login/login.feature

@login @smoke
Feature: User Login
  As a registered user
  I want to log into the application
  So that I can access my account

  Background:
    Given I navigate to the login page

  @positive
  Scenario: Successful login with valid credentials
    When I enter username "testuser@example.com" and password "SecurePass123"
    And I click the login button
    Then I should be redirected to the dashboard
    And I should see the welcome message "Welcome, Test User"

  @negative
  Scenario Outline: Failed login with invalid credentials
    When I enter username "<username>" and password "<password>"
    And I click the login button
    Then I should see an error message "<error_message>"

    Examples:
      | username              | password     | error_message                  |
      | invalid@example.com   | WrongPass    | Invalid email or password      |
      | testuser@example.com  |              | Password is required           |
      |                       | SecurePass123| Email is required              |
```

### Step 2 — Create a Page Object

```typescript
// src/pages/LoginPage.ts

import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.usernameInput = page.getByTestId('email-input');
    this.passwordInput = page.getByTestId('password-input');
    this.loginButton   = page.getByRole('button', { name: 'Login' });
    this.errorMessage  = page.getByTestId('error-banner');
  }

  async navigateTo() {
    await this.page.goto('/login');
  }

  async login(username: string, password: string) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async getErrorMessage(): Promise<string> {
    return (await this.errorMessage.textContent()) ?? '';
  }
}
```

### Step 3 — Create Step Definitions

```typescript
// src/steps/loginSteps.ts

import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { getPage } from '../fixtures/fixtures';

let loginPage: LoginPage;

Given('I navigate to the login page', async function () {
  loginPage = new LoginPage(getPage());
  await loginPage.navigateTo();
});

When('I enter username {string} and password {string}', async function (
  username: string,
  password: string
) {
  await loginPage.login(username, password);
});

When('I click the login button', async function () {
  await loginPage.loginButton.click();
});

Then('I should be redirected to the dashboard', async function () {
  await expect(getPage()).toHaveURL(/.*dashboard/);
});

Then('I should see the welcome message {string}', async function (message: string) {
  await expect(getPage().getByText(message)).toBeVisible();
});

Then('I should see an error message {string}', async function (errorMsg: string) {
  const actual = await loginPage.getErrorMessage();
  expect(actual).toContain(errorMsg);
});
```

### Step 4 — Define Hooks

```typescript
// src/hooks/hooks.ts

import { Before, After, BeforeAll, AfterAll, Status } from '@cucumber/cucumber';
import { chromium, Browser, BrowserContext, Page } from '@playwright/test';

let browser: Browser;
let context: BrowserContext;
let page: Page;

BeforeAll(async function () {
  browser = await chromium.launch({ headless: process.env.HEADLESS !== 'false' });
});

Before(async function () {
  context = await browser.newContext();
  page    = await context.newPage();
  this.page = page;
});

After(async function (scenario) {
  if (scenario.result?.status === Status.FAILED) {
    const screenshot = await page.screenshot({ fullPage: true });
    await this.attach(screenshot, 'image/png');
  }
  await context.close();
});

AfterAll(async function () {
  await browser.close();
});
```

---

## ▶️ Running Tests

### Run All Tests

```bash
npm test
```

### Run a Specific Feature

```bash
npx bddgen && npx playwright test --grep "User Login"
```

### Run by Tags

```bash
# Run smoke tests
TAGS="@smoke" npm test

# Run specific feature tag
TAGS="@login and @positive" npm test

# Exclude a tag
TAGS="not @wip" npm test
```

### Run in Headed Mode (visible browser)

```bash
HEADLESS=false npm test
```

### Run on a Specific Browser

```bash
npx playwright test --project=firefox
npx playwright test --project=chromium
npx playwright test --project=webkit
```

### Run Tests in Debug Mode

```bash
npx playwright test --debug
```

### Run with Specific Number of Workers

```bash
npx playwright test --workers=4
```

---

## 📊 Reports

### Playwright HTML Report

Generated automatically after every run at `reports/html/index.html`.

```bash
# Open the HTML report
npx playwright show-report reports/html
```

### Cucumber HTML Report

Available at `reports/cucumber-report.html` after each run.

```bash
open reports/cucumber-report.html
```

### Allure Report

```bash
# Generate & open Allure report
npm run allure:generate
npm run allure:open
```

Add these scripts to `package.json`:

```json
"scripts": {
  "test": "bddgen && playwright test",
  "test:smoke": "TAGS=@smoke npm test",
  "test:regression": "TAGS=@regression npm test",
  "allure:generate": "allure generate reports/allure-results --clean -o reports/allure-report",
  "allure:open": "allure open reports/allure-report",
  "lint": "eslint src/**/*.ts",
  "clean": "rimraf reports/ .playwright/"
}
```

---

## 🔄 CI/CD Integration

### GitHub Actions

```yaml
# .github/workflows/playwright.yml

name: Playwright BDD Tests

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]
  schedule:
    - cron: '0 6 * * *'        # Nightly regression run at 6 AM UTC

jobs:
  test:
    runs-on: ubuntu-latest
    timeout-minutes: 60

    strategy:
      fail-fast: false
      matrix:
        browser: [chromium, firefox, webkit]

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Install Playwright browsers
        run: npx playwright install --with-deps ${{ matrix.browser }}

      - name: Run Playwright BDD Tests
        run: npx bddgen && npx playwright test --project=${{ matrix.browser }}
        env:
          BASE_URL: ${{ secrets.BASE_URL }}
          TEST_USERNAME: ${{ secrets.TEST_USERNAME }}
          TEST_PASSWORD: ${{ secrets.TEST_PASSWORD }}
          CI: true

      - name: Upload Playwright report
        uses: actions/upload-artifact@v4
        if: always()
        with:
          name: playwright-report-${{ matrix.browser }}
          path: reports/
          retention-days: 14
```

### GitLab CI

```yaml
# .gitlab-ci.yml

stages:
  - test
  - report

playwright-bdd:
  image: mcr.microsoft.com/playwright:v1.44.0-jammy
  stage: test
  script:
    - npm ci
    - npx bddgen && npx playwright test
  variables:
    BASE_URL: $BASE_URL
    CI: "true"
  artifacts:
    when: always
    paths:
      - reports/
    expire_in: 7 days
  only:
    - main
    - merge_requests
```

---

## 💡 Best Practices

### Page Objects

- Keep all selectors inside page object classes; never hardcode them in step definitions.
- Prefer `getByRole`, `getByTestId`, and `getByLabel` over CSS/XPath selectors for resilience.
- Extend a `BasePage` class to share common methods like `waitForLoad`, `scroll`, and `takeScreenshot`.

### Feature Files

- One feature file per application feature or user flow.
- Use `Background` to extract repeated `Given` steps.
- Keep scenarios independent — avoid dependencies between scenarios.
- Use `Scenario Outline` with `Examples` tables for data-driven tests.

### Step Definitions

- Keep steps atomic and reusable across feature files.
- Use Cucumber expression parameters (`{string}`, `{int}`) over regex where possible.
- Avoid logic inside step definitions — delegate to page objects.

### Tags

| Tag | Purpose |
|-----|---------|
| `@smoke` | Critical path, run on every deployment |
| `@regression` | Full regression suite |
| `@sanity` | Post-deployment quick sanity check |
| `@wip` | Work-in-progress, excluded from CI |
| `@flaky` | Known intermittent tests under investigation |

### General

- Store test credentials in environment variables — never commit secrets.
- Use `retries: 2` in CI to handle flakiness from transient network issues.
- Capture screenshots and videos on failure for faster debugging.
- Run tests in parallel using Playwright's worker configuration.

---

## 🔧 Troubleshooting

### Browser Not Found

```bash
# Reinstall all browsers
npx playwright install

# Install system dependencies (Linux only)
npx playwright install-deps
```

### Tests Timing Out

Increase timeout in `playwright.config.ts`:

```typescript
use: {
  actionTimeout: 15_000,   // action-level timeout
  navigationTimeout: 30_000,
},
timeout: 60_000,           // test-level timeout
```

### BDD Steps Not Matching

- Ensure `features` and `steps` globs in `playwright.config.ts` point to the correct paths.
- Run `npx bddgen` before `npx playwright test` to regenerate test files.
- Check that Cucumber expression parameter types match your step signatures.

### Environment Variables Not Loaded

Install and configure `dotenv`:

```bash
npm install dotenv
```

```typescript
// playwright.config.ts (top of file)
import 'dotenv/config';
```

### Flaky Tests

- Prefer `await expect(locator).toBeVisible()` over `page.waitForTimeout()`.
- Use `waitFor` options with meaningful conditions rather than fixed delays.
- Check for race conditions in `Before`/`After` hooks that share state.

---

## 📦 Dependencies Reference

```json
{
  "devDependencies": {
    "@playwright/test": "^1.44.0",
    "@cucumber/cucumber": "^10.3.1",
    "playwright-bdd": "^7.3.0",
    "typescript": "^5.4.5",
    "ts-node": "^10.9.2",
    "allure-playwright": "^2.13.0",
    "allure-commandline": "^2.29.0",
    "dotenv": "^16.4.5",
    "rimraf": "^5.0.7"
  }
}
```

---

## 🤝 Contributing

1. Fork the repository and create a feature branch: `git checkout -b feature/your-feature`
2. Follow the existing naming conventions for files and steps.
3. Add or update tests for any new feature or bug fix.
4. Ensure all existing tests pass: `npm test`
5. Submit a pull request with a clear description of your changes.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

> Built with ❤️ using [Playwright](https://playwright.dev/) + [Cucumber BDD](https://cucumber.io/)
