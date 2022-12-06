const { test, expect } = require("@playwright/test");
class CartPage {
  constructor(page) {
    this.page = page;
    this.cartProducts = page.locator("div li").first();
    this.productsText = page.locator(".card-body b");
    this.cart = page.locator("[routerlink*='cart']");
    this.orders = page.locator("button[routerlink*='myorders']");
    this.checkout = page.locator("text=Checkout");
  }

  async VerifyProductIsDisplayed(productName) {
    await this.cartProducts.waitFor();
    const bool = await this.getProductLocator(productName).isVisible();
    expect(bool).toBeTruthy();
  }

  async Checkout() {
    await this.checkout.click();
  }

  getProductLocator(productName) {
    return this.page.locator("h3:has-text('" + productName + "')");
  }
}
module.exports = { CartPage };
