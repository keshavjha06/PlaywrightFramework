const { test, expect } = require("@playwright/test");

test("@web browser context playwright test", async ({ browser }) => {
  const context = await browser.newContext();
  const page = await context.newPage();
  page.route("**/*.css", (route) => route.abort());
  page.route("**/*.{jpg,png,jpeg}", (route) => route.abort());
  const userName = page.locator("#username");
  const signIn = page.locator("#signInBtn");
  const cardTitles = page.locator(".card-body a");
  page.on("request", (request) => console.log(request.url()));
  page.on("response", (response) =>
    console.log(response.url(), response.status())
  );
  await page.goto("https://rahulshettyacademy.com/loginpagePractise/");
  console.log(await page.title());
  //css
  await userName.type("rahulshetty");
  await page.locator("[type='password']").type("learning");
  await signIn.click();
  console.log(await page.locator("[style*='block']").textContent());
  await expect(page.locator("[style*='block']")).toContainText("Incorrect");
  //type & fill to enter text in input fields
  await userName.fill("");
  await userName.fill("rahulshettyacademy");
  //race condition
  await Promise.all([page.waitForNavigation(), signIn.click()]);

  //console.log(await cardTitles.first().textContent());
  // console.log(await cardTitles.nth(1).textContent());
  const allTitles = await cardTitles.allTextContents();
  console.log(allTitles);
});

test("page context playwright test", async ({ page }) => {
  await page.goto("https://google.com/");
  //get title - assertion
  console.log(await page.title());
  await expect(page).toHaveTitle("Google");
});

test("@web UI controls", async ({ page }) => {
  await page.goto("https://rahulshettyacademy.com/loginpagePractise/");
  const userName = page.locator("#username");
  const signIn = page.locator("#signInBtn");
  const documentLink = page.locator("[href*='documents-request']");
  const dropdown = page.locator("select.form-control");
  await dropdown.selectOption("consult");
  await page.locator(".radiotextsty").last().click();
  await page.locator("#okayBtn").click();
  //assertion
  console.log(await page.locator(".radiotextsty").last().isChecked());
  await expect(page.locator(".radiotextsty").last()).toBeChecked();
  await page.locator("#terms").click();
  await expect(page.locator("#terms").last()).toBeChecked();
  await page.locator("#terms").uncheck();
  expect(await page.locator("#terms").isChecked()).toBeFalsy();
  await expect(documentLink).toHaveAttribute("class", "blinkingText");
  //await page.pause();
});

test("child windows handling", async ({ browser }) => {
  const context = await browser.newContext();
  const page = await context.newPage();
  const userName = page.locator("#username");
  await page.goto("https://rahulshettyacademy.com/loginpagePractise/");
  const documentLink = page.locator("[href*='documents-request']");
  const [newPage] = await Promise.all([
    context.waitForEvent("page"),
    documentLink.click(),
  ]);
  const text = await newPage.locator(".red").textContent();
  const arrayText = text.split("@");
  const domain = arrayText[1].split(" ")[0];
  console.log(domain);
  await page.locator("#username").type(domain);
  //await page.pause();
  console.log(await page.locator("#username").textContent());
});
