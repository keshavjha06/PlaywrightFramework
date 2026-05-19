# PlaywrightFramework

## Overview

This repository is a Playwright-based automation framework implemented using JavaScript and TypeScript with the Page Object Model (POM) design pattern. It contains both Playwright test suites and Cucumber feature-based tests.

The framework is designed for web UI automation and supports cross-browser execution using Playwright.

## Key features

- Playwright test automation with `@playwright/test`
- Page Object Model implemented in `pageobjects/` and `pageobjects_ts/`
- Cucumber feature execution via `@cucumber/cucumber`
- HTML reporting via Playwright's built-in reporter
- Screenshots and trace capture configured for debugging failures
- Support for browser-specific projects in `playwright.config1.js`

## Repository structure

- `tests/` - Playwright test files (`*.spec.js`, plus some `*.ts` test files)
- `pageobjects/` - JavaScript Page Object Model classes
- `pageobjects_ts/` - TypeScript Page Object Model classes
- `features/` - Cucumber feature files and step definitions
- `playwright-report/` - generated Playwright HTML reports and artifacts
- `test-results/` - saved test result directories
- `cucumber.js` - Cucumber CLI configuration
- `playwright.config.js` - default Playwright configuration
- `playwright.config1.js` - alternate Playwright configuration with Safari/WebKit and Chrome projects

## Installation

```bash
git clone https://github.com/keshavjha06/PlaywrightFramework.git
cd PlaywrightFramework
npm install
npx playwright install
```

> If you only need the browser binaries for your default config, run `npx playwright install chromium firefox webkit`.

## Available commands

### Run Playwright tests

- `npm run Regression` - execute all Playwright tests
- `npm run WebTests` - execute Playwright tests tagged with `@web`
- `npm run APITests` - execute Playwright tests tagged with `@API`
- `npm run SafariNewConfig` - execute tests using `playwright.config1.js` on the Safari/WebKit project

### Run Cucumber tests

- `npm run CucumberRegression` - execute Cucumber scenarios tagged `@Regression` and generate `cucumber-report.html`

### Example direct commands

```bash
npx playwright test
npx playwright test tests/example.spec.js
npx cucumber-js --tags '@Regression' --retry 1 --exit --format html:cucumber-report.html
```

## Reporting and debug artifacts

- Playwright HTML report is generated in `playwright-report/`
- Screenshots are captured on failures
- Trace collection is enabled for deeper debugging
- Cucumber generates `cucumber-report.html`

## Notes

- Page object classes are available both in JavaScript and TypeScript.
- The current default Playwright test pattern is `**/*.spec.js`, so TypeScript specs may require additional configuration to execute.
- Use Cucumber feature files in `features/` for BDD-style scenarios.

## Useful links

- Playwright docs: https://playwright.dev
- Cucumber docs: https://cucumber.io
- Allure Playwright: https://github.com/playwright-community/allure-playwright
