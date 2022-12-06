const { test, expect } = require("@playwright/test");

//test.describe.configure({ mode: "parallel" });
//test.describe.configure({ mode: "serial" });
test("@web popup validations", async ({ page }) => {
  await page.goto("https://rahulshettyacademy.com/AutomationPractice/");
  //await page.goto("http://google.com");
  //await page.goBack();
  //await page.goForward();
  await expect(page.locator("#displayed-text")).toBeVisible();
  await page.locator("#hide-textbox").click();
  await expect(page.locator("#displayed-text")).toBeHidden();
  page.on("dialog", (dialog) => dialog.accept());
  await page.locator("#confirmbtn").click();
  page.locator("#mousehover").hover();
  const framesPage = page.frameLocator("#courses-iframe");
  await framesPage.locator("li a[href*='lifetime-access']:visible").click();
  const textCheck = await framesPage.locator(".text h2").textContent();
  console.log(textCheck.split(" ")[1]);
});

test("Screenshot & Visual comparision", async ({ page }) => {
  await page.goto("https://rahulshettyacademy.com/AutomationPractice/");
  await expect(page.locator("#displayed-text")).toBeVisible();
  await page
    .locator("#displayed-text")
    .screenshot({ path: "partialScreenshot.png" });
  await page.locator("#hide-textbox").click();
  await page.screenshot({ path: "screenshot.png" });
  await expect(page.locator("#displayed-text")).toBeHidden();
});
//screenshot -store -> screenshot ->
test("visual", async ({ page }) => {
  //make payment -when you 0 balance
  await page.goto("https://rahulshettyacademy.com/loginpagePractise/");
  expect(await page.screenshot()).toMatchSnapshot("landing.png");
});
