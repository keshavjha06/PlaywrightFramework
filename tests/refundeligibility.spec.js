import { test, expect } from '@playwright/test';
import "dotenv/config";

const BASE_URL = 'https://eventhub.rahulshettyacademy.com';

//  Credentials
const USER_EMAIL = process.env.USER_EMAIL;
const USER_PASSWORD = process.env.USER_PASSWORD;

async function loginAndGoToBooking(page) {
    await page.goto(`${BASE_URL}/login`);
    await page.getByPlaceholder("you@email.com").fill(USER_EMAIL);
    await page.getByLabel("Password").fill(USER_PASSWORD);
    await page.locator("#login-btn").click();
    await expect(page.getByRole("link", { name: "Browse Events →" })).toBeVisible();
}

// Test 1: 1 ticket → eligible
test('refund eligible for single ticket booking', async ({ page }) => {
    await loginAndGoToBooking(page);

    // Book event with 1 ticket via UI
    await page.goto(`${BASE_URL}/events`);
    await page.getByTestId('event-card').first().getByTestId('book-now-btn').click();


    await page.getByLabel('Full Name').fill('Test User');
    await page.locator('#customer-email').fill(USER_EMAIL);
    await page.getByPlaceholder('+91 98765 43210').fill('9999999999');
    await page.locator('.confirm-booking-btn').click();

    // Navigate to booking detail
    await page.getByRole('link', { name: 'View My Bookings' }).click();
    await expect(page).toHaveURL(`${BASE_URL}/bookings`);
    await page.getByRole('link', { name: 'View Details' }).first().click();
    await expect(page.getByText('Booking Information')).toBeVisible();

    // Validate booking ref first letter matches event name first letter
    const bookingRef = await page.locator('span.font-mono.font-bold').innerText();
    const eventTitle = await page.locator('h1').innerText();
    expect(bookingRef.charAt(0)).toBe(eventTitle.charAt(0));

    await page.locator('#check-refund-btn').click();

    // Spinner must appear immediately
    await expect(page.locator('#refund-spinner')).toBeVisible();

    // Wait for spinner to disappear after 4s
    await expect(page.locator('#refund-spinner')).not.toBeVisible({ timeout: 6000 });

    // Validate eligible message
    const result = page.locator('#refund-result');
    await expect(result).toBeVisible();
    await expect(result).toContainText('Eligible for refund');
    await expect(result).toContainText('Single-ticket bookings qualify for a full refund');
});

// Test 2: 3 tickets → not eligible
test('refund not eligible for group ticket booking', async ({ page }) => {
    await loginAndGoToBooking(page);

    // Book event with 3 tickets via UI
    await page.goto(`${BASE_URL}/events`);
    await page.getByTestId('event-card').first().getByTestId('book-now-btn').click();


    // Increase quantity to 3
    await page.locator('button:has-text("+")').click();
    await page.locator('button:has-text("+")').click();

    await page.getByLabel('Full Name').fill('Test User');
    await page.locator('#customer-email').fill(USER_EMAIL);
    await page.getByPlaceholder('+91 98765 43210').fill('9999999999');
    await page.locator('.confirm-booking-btn').click();

    // Navigate to booking detail
    await page.getByRole('link', { name: 'View My Bookings' }).click();
    await expect(page).toHaveURL(`${BASE_URL}/bookings`);
    await page.getByRole('link', { name: 'View Details' }).first().click();
    await expect(page.getByText('Booking Information')).toBeVisible();

    // Validate booking ref first letter matches event name first letter
    const bookingRef = await page.locator('span.font-mono.font-bold').innerText();
    const eventTitle = await page.locator('h1').innerText();
    expect(bookingRef.charAt(0)).toBe(eventTitle.charAt(0));

    await page.locator('#check-refund-btn').click();

    // Spinner must appear immediately
    await expect(page.locator('#refund-spinner')).toBeVisible();

    // Wait for spinner to disappear after 4s
    await expect(page.locator('#refund-spinner')).not.toBeVisible({ timeout: 6000 });

    // Validate ineligible message
    const result = page.locator('#refund-result');
    await expect(result).toBeVisible();
    await expect(result).toContainText('Not eligible for refund');
    await expect(result).toContainText('Group bookings (3 tickets) are non-refundable');
});
