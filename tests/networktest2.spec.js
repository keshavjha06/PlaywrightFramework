const { test, expect, request } = require("@playwright/test");
const { ApiUtils } = require("../utils/apiutils");
const loginPayload = {
  userEmail: "rahulshetty@gmail.com",
  userPassword: "Iamking@00",
};
const orderPayload = {
  orders: [{ country: "Cuba", productOrderedId: "6262e95ae26b7e1a10e89bf0" }],
};
const fakePayLoadOrders = { data: [], message: "No Orders" };
let response;
test.beforeAll(async () => {
  const apiContext = await request.newContext();
  const apiUtils = new ApiUtils(apiContext, loginPayload);
  response = await apiUtils.createOrder(orderPayload);
});
//create order is success
test("place the order", async ({ page }) => {
  page.addInitScript((value) => {
    window.localStorage.setItem("token", value);
  }, response.token);
  await page.goto("https://rahulshettyacademy.com/client");
  await page.locator("button[routerlink*='myorders']").click();
  await page.route(
    "https://www.rahulshettyacademy.com/api/ecom/order/get-orders-details?id=638cc34e03841e9c9a4a0644",
    (route) =>
      route.continue({
        url: "https://rahulshettyacademy.com/api/ecom/order/get-orders-details?id=638e23ea03841e9c9a4ad11e",
      })
  );
  await page.locator("button:has-text('View')").first().click();
  //await page.pause();
});
