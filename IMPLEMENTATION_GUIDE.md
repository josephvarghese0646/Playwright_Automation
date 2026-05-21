# Framework Implementation Guide

## ✅ Framework Setup Complete!

This document provides a summary of the implemented Playwright BDD framework structure and setup instructions.

---

## 📁 Project Structure

```
Playwright_Automation/
│
├── pages/                          # Page Object Models
│   ├── BasePage.ts                # Base class with common methods
│   └── LoginPage.ts               # Example Page Object (customize for your app)
│
├── step_definitions/              # Cucumber step definitions
│   └── loginSteps.ts              # Example step definitions
│
├── hooks/                         # Cucumber hooks
│   └── hooks.ts                   # Before/After hooks, browser setup
│
├── utils/                         # Utility helpers
│   ├── logger.ts                  # Structured logging
│   ├── testDataHelper.ts          # Test data loading utilities
│   └── waitHelper.ts              # Common wait operations
│
├── test-data/                     # Test data files
│   └── users.json                 # Sample test data
│
├── e2e/
│   └── features/
│       └── login.feature          # Example Gherkin feature file
│
├── tests/                         # Playwright native tests
│   └── example.spec.ts            # Example Playwright test
│
├── reports/                       # Generated reports (gitignored)
│   └── failures/                  # Screenshots of failed tests
│
├── playwright.config.ts           # Playwright configuration
├── cucumber.js                    # Cucumber configuration
├── tsconfig.json                  # TypeScript configuration
├── package.json                   # Project dependencies and scripts
└── README.md                      # Original framework documentation
```

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Update Selectors and URLs
- Edit `pages/LoginPage.ts` to match your application's selectors
- Update the base URL in the feature files or step definitions
- Modify `e2e/features/login.feature` to match your login flow

### 3. Add Test Data
- Update `test-data/users.json` with your actual test credentials
- Add more JSON files as needed for different test scenarios

### 4. Run Tests

**Using Playwright:**
```bash
npm run test              # Run Playwright tests
npm run test:headed      # Run in headed mode (visible browser)
npm run test:ui          # Open Playwright UI
npm run test:debug       # Run in debug mode
```

**Using Cucumber/BDD:**
```bash
npm run test:bdd         # Run Cucumber scenarios
```

**View Reports:**
```bash
npm run report           # Open HTML report
```

**Clean Reports:**
```bash
npm run clean            # Remove all generated reports
```

---

## 📝 Creating New Tests (BDD Approach)

### Step 1: Write Feature File
Create `e2e/features/my-feature.feature`:
```gherkin
Feature: My Feature
  Scenario: My Scenario
    Given I am on the login page
    When I perform an action
    Then I should see the result
```

### Step 2: Create Page Object
Create `pages/MyPage.ts`:
```typescript
import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class MyPage extends BasePage {
  // Selectors
  readonly MY_ELEMENT = '#my-selector';

  constructor(page: Page) {
    super(page);
  }

  async clickElement(): Promise<void> {
    await this.click(this.MY_ELEMENT);
  }
}
```

### Step 3: Write Step Definitions
Create `step_definitions/mySteps.ts`:
```typescript
import { Given, When, Then } from '@cucumber/cucumber';
import { MyPage } from '../pages/MyPage';

let myPage: MyPage;

Given('I navigate to my page', async function () {
  myPage = new MyPage(global.page);
  await myPage.goto('https://example.com/my-page');
});

When('I click the element', async function () {
  await myPage.clickElement();
});

Then('I should see something', async function () {
  // Add assertions
});
```

---

## 🛠 Available BasePage Methods

The `BasePage` class provides these utility methods:

### Navigation
- `goto(url)` - Navigate to URL
- `waitForPageLoad()` - Wait for page to load
- `getCurrentUrl()` - Get current URL
- `reloadPage()` - Reload page
- `goBack()` - Go back in history
- `goForward()` - Go forward in history

### Interaction
- `click(selector)` - Click element
- `clickWithRetry(selector, maxRetries)` - Click with retry logic
- `fillText(selector, text)` - Fill text input
- `hover(selector)` - Hover over element
- `selectByValue(selector, value)` - Select dropdown by value
- `selectByLabel(selector, label)` - Select dropdown by label
- `pressKey(key)` - Press keyboard key

### Validation
- `isElementVisible(selector)` - Check if element is visible
- `waitForElement(selector)` - Wait for element to appear
- `getText(selector)` - Get element text
- `getInputValue(selector)` - Get input field value
- `verifyElementText(selector, text)` - Verify element has text
- `verifyElementEnabled(selector)` - Verify element is enabled
- `verifyElementDisabled(selector)` - Verify element is disabled

### Other
- `executeScript(script, args)` - Execute JavaScript
- `takeScreenshot(filename)` - Take screenshot
- `acceptAlert()` - Accept browser alert
- `dismissAlert()` - Dismiss browser alert
- `getPageContent()` - Get page HTML

---

## 🔧 Utility Classes

### Logger
```typescript
import { Logger } from './utils/logger';

const logger = new Logger('ClassName');
logger.info('Info message');
logger.warn('Warning message');
logger.error('Error message');
logger.debug('Debug message'); // Only if DEBUG env variable set
```

### TestDataHelper
```typescript
import { TestDataHelper } from './utils/testDataHelper';

// Load entire JSON file
const allData = TestDataHelper.loadJsonData('users.json');

// Get specific key
const user = TestDataHelper.getTestData('users.json', 'validUser');

// Load CSV file
const csvData = TestDataHelper.loadCsvData('test-data.csv');
```

### WaitHelper
```typescript
import { WaitHelper } from './utils/waitHelper';

// Wait for element with retry
await WaitHelper.waitForElementWithRetry(page, selector, 3, 5000);

// Wait for condition
await WaitHelper.waitForCondition(async () => {
  return await page.isVisible(selector);
});

// Wait for network idle
await WaitHelper.waitForNetworkIdle(page);

// Sleep
await WaitHelper.sleep(2000);
```

---

## 🎯 Best Practices

### 1. Page Object Model (POM)
- Keep selectors in Page Objects, not in step definitions
- Create a separate Page Object for each page/component
- Extend `BasePage` for common functionality

### 2. Test Data
- Use external files (JSON/CSV) for test data
- Never hardcode credentials
- Use `TestDataHelper` to load data

### 3. Logging
- Use the `Logger` class for structured logging
- Enable DEBUG logs with: `DEBUG=true npm run test:bdd`

### 4. Waits
- Use explicit waits (built into BasePage methods)
- Avoid hardcoded `sleep()` calls
- Use `WaitHelper` for complex wait scenarios

### 5. Assertions
- Use Playwright's `expect()` for assertions
- Keep assertions in step definitions or dedicated methods
- Provide meaningful error messages

### 6. Screenshots
- Take screenshots on test failure (automatic in hooks)
- Use `takeScreenshot()` for manual screenshots
- Store in `reports/` directory

### 7. Environment Configuration
- Use environment variables for URLs, credentials
- Create separate config files for different environments
- Use `.env` file (not tracked in git)

---

## 🐛 Troubleshooting

### "Cannot find module" errors
- Ensure all imports use correct paths
- Check that TypeScript is properly configured
- Verify that the file exists in the expected location

### "Selector not found" errors
- Update selectors in Page Object to match your application
- Use browser DevTools to inspect elements
- Try using `data-testid` attributes for more stable selectors

### Tests hang or timeout
- Check that the baseURL is correct and the application is running
- Verify network connectivity
- Increase timeout values if needed (in playwright.config.ts)

### Hooks not running
- Ensure hooks file is listed in cucumber.js `require` array
- Check file naming matches the pattern in cucumber.js
- Verify that `global.page` is accessible in step definitions

---

## 📚 Additional Resources

- [Playwright Documentation](https://playwright.dev)
- [Cucumber Documentation](https://cucumber.io/docs)
- [Page Object Model Best Practices](https://playwright.dev/docs/pom)
- [BDD Testing Guide](https://cucumber.io/docs/bdd/)

---

## ✨ Next Steps

1. **Customize Selectors** - Update `pages/LoginPage.ts` with your application's actual selectors
2. **Update URLs** - Set correct base URLs in feature files and step definitions
3. **Add More Features** - Create additional feature files for different user workflows
4. **Set Up CI/CD** - Configure GitHub Actions or other CI/CD pipeline
5. **Integrate Reporting** - Add Allure or other reporting tools
6. **Cross-browser Testing** - Enable mobile or additional browser configurations in `playwright.config.ts`

---

**Framework Status**: ✅ Ready for test implementation!
