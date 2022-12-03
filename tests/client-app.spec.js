const { test, expect } = require("@playwright/test");

test("Browser context validating error login", async ({ page }) => {
  const email = "anshika@gmail.com";
  const productName = "zara coat 3";
  const products = page.locator(".card-body");
  await page.goto("https://rahulshettyacademy.com/client");
  await page.locator("#userEmail").fill("anshika@gmail.com");
  await page.locator("#userPassword").fill("Iamking@000");
  await page.locator("[value='Login']").click();
  //below line wait until all the service calls are successfully made and network become idle
  await page.waitForLoadState("networkidle");
  const titles = await page.locator(".card-body b").allTextContents();
  console.log("titles::" + titles);
  //zara coat 3
  const count = await products.count();
  console.log("count: " + count);
  for (let i = 0; i < count; i++) {
    if ((await products.nth(i).locator("b").textContent()) === productName) {
      //add to cart
      await products.nth(i).locator("text= Add To Cart").click();
      break;
    }
  }
  await page.locator("[routerlink*='cart']").click();
  await page.locator("div li").first().waitFor(); //waitFor() method is used to wait until items are loaded
  const bool = await page.locator("h3:has-text('zara coat 3')").isVisible();
  expect(bool).toBeTruthy();
  await page.locator("text=Checkout").click();
  await page.locator("[placeholder*='Country']").type("ind", { delay: 100 }); //will add delay while typing
  const dropdown = page.locator(".ta-results");
  await dropdown.waitFor();
  let optionsCount = await dropdown.locator("button").count();
  for (let index = 0; index < optionsCount; index++) {
    let text = await dropdown.locator("button").nth(index).textContent();
    if (text === " India") {
      await dropdown.locator("button").nth(index).click();
      break;
    }
  }
  await expect(page.locator(".user__name [type='text']").first()).toHaveText(
    email
  );
  await page.locator(".action__submit").click();
  await expect(page.locator(".hero-primary")).toHaveText(
    " Thankyou for the order. "
  );
  const orderId = await page
    .locator(".em-spacer-1 .ng-star-inserted")
    .textContent();
  console.log(orderId);

  await page.locator("button[routerlink*='myorders']").click();
  await page.locator("tbody").waitFor();
  const rows = await page.locator("tbody tr");
  for (let i = 0; i < (await rows.count()); ++i) {
    const rowOrderId = await rows.nth(i).locator("th").textContent();
    if (orderId.includes(rowOrderId)) {
      await rows.nth(i).locator("button").first().click();
      break;
    }
  }
  const orderIdDetails = await page.locator(".col-text").textContent();
  expect(orderId.includes(orderIdDetails)).toBeTruthy();
});
