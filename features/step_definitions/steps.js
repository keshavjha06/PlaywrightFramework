
import { When, Given, Then } from "@cucumber/cucumber";
import { expect } from '@playwright/test';
import { POManager } from '../../pageobjects/po-manager.js';
let poManager

Given('a login to Ecommerce application with {string} and {string}', { timeout: 100 * 1000 }, async function (username, password) {

    poManager = new POManager(this.page);
    const products = this.page.locator(".card-body");
    const loginPage = poManager.getLoginPage();
    await loginPage.goTo();
    await loginPage.validLogin(username, password);

});

When('Add {string} to Cart', async function (productName) {
    this.dashboardPage = poManager.getDashboardPage();
    await this.dashboardPage.searchProductAddCart(productName);
    await this.dashboardPage.navigateToCart();
});

Then('Verify {string} is displayed in the Cart', async function (productName) {
    this.cartPage = poManager.getCartPage();
    await this.cartPage.VerifyProductIsDisplayed(productName);
});

When('Enter valid details and Place the Order', async function () {
    // Write code here that turns the phrase above into concrete actions
    await this.cartPage.Checkout();

    const ordersReviewPage = poManager.getOrdersReviewPage();
    await ordersReviewPage.searchCountryAndSelect("ind", "India");
    this.orderId = await ordersReviewPage.SubmitAndGetOrderId();
    console.log(this.orderId);
});

Then('Verify order is present in the OrderHistory', async function () {
    // Write code here that turns the phrase above into concrete actions
    await this.dashboardPage.navigateToOrders();
    const ordersHistoryPage = poManager.getOrdersHistoryPage();
    await ordersHistoryPage.searchOrderAndSelect(this.orderId);
    expect(this.orderId.includes(await ordersHistoryPage.getOrderId())).toBeTruthy();
});


Given('a login to Ecommerce2 application with {string} and {string}', { timeout: 100 * 1000 }, async function (username, password) {

    const userName = this.page.locator('#username');
    const signIn = this.page.locator("#signInBtn");
    await this.page.goto("https://rahulshettyacademy.com/loginpagePractise/");
    console.log(await this.page.title());
    //css 
    await userName.fill("rahulshetty");
    await this.page.locator("[type='password']").fill("learning");
    await signIn.click();
});


Then('Verify Error message is displayed', async function () {
    await expect(this.page.locator("[style*='block']")).toContainText('Incorrect');

})
