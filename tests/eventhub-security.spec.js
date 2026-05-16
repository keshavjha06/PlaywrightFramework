import { test, expect } from '@playwright/test';
import "dotenv/config";

const BASE_URL = 'https://eventhub.rahulshettyacademy.com';
const API_URL = 'https://api.eventhub.rahulshettyacademy.com/api';

const YAHOO_USER = {
  email: process.env.YAHOO_EMAIL,
  password: process.env.YAHOO_PASSWORD
};

const GMAIL_USER = {
  email: process.env.GMAIL_EMAIL,
  password: process.env.GMAIL_PASSWORD
};

// Step 4 — Helper that logs in via browser UI
async function loginAs(page, user) {
  await page.goto(`${BASE_URL}/login`);
  await page.getByPlaceholder("you@email.com").fill(user.email);
  await page.getByLabel("Password").fill(user.password);
  await page.locator("#login-btn").click();
  await page.waitForLoadState('networkidle');
}

test('Validate Access Denied for cross-user bookings', async ({ page, request }) => {
  // Step 1 — Login as Yahoo user via API
  const loginRes = await request.post(`${API_URL}/auth/login`, {
    data: {
      email: YAHOO_USER.email,
      password: YAHOO_USER.password
    }
  });

  // Assert the response is OK
  expect(loginRes.ok()).toBeTruthy();

  // Parse the JSON response and extract token
  const loginJson = await loginRes.json();
  const token = loginJson.token; // Or loginJson.data.token, based on actual API

  // Step 2 — Fetch events via API to get a valid event ID
  const eventsRes = await request.get(`${API_URL}/events`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  // Assert the response is OK
  expect(eventsRes.ok()).toBeTruthy();

  // Parse the JSON, read data[0].id — store this as eventId
  const eventsJson = await eventsRes.json();
  const eventId = eventsJson.data[0].id;

  // Step 3 — Create a booking via API as Yahoo user
  const bookingRes = await request.post(`${API_URL}/bookings`, {
    headers: {
      'Authorization': `Bearer ${token}`
    },
    data: {
      eventId: eventId,
      customerName: 'Yahoo User',
      customerEmail: YAHOO_USER.email,
      customerPhone: '1234567890',
      quantity: 1
    }
  });

  // Assert the response is OK
  expect(bookingRes.ok()).toBeTruthy();

  // Parse the JSON and extract data.id — store as yahooBookingId
  const bookingJson = await bookingRes.json();
  const yahooBookingId = bookingJson.data.id;

  // Step 4 — Login as Gmail user via browser UI
  await loginAs(page, GMAIL_USER);

  // Step 5 — Navigate to Yahoo's booking URL as Gmail user
  await page.goto(`${BASE_URL}/bookings/${yahooBookingId}`, {
    waitUntil: 'networkidle'
  });

  // Step 6 — Validate Access Denied
  await expect(page.getByText('Access Denied', { exact: false })).toBeVisible();
  await expect(page.getByText('You are not authorized to view this booking', { exact: false })).toBeVisible();
  await page.waitForTimeout(3000)
});
