import { test, expect } from "@playwright/test";
import "dotenv/config";

const BASE_URL = "https://eventhub.rahulshettyacademy.com";

// Credentials
const USER_EMAIL = process.env.USER_EMAIL;
const USER_PASSWORD = process.env.USER_PASSWORD;

//  Helpers

/**
 * Reusable login helper — navigates to /login, fills credentials, clicks login,
 * and asserts that "Browse Events →" link is visible (confirms login success).
 */
async function login(page) {
  await page.goto(`${BASE_URL}/login`);
  await page.getByPlaceholder("you@email.com").fill(USER_EMAIL);
  await page.getByLabel("Password").fill(USER_PASSWORD);
  await page.locator("#login-btn").click();
  await expect(page.getByRole("link", { name: "Browse Events →" })).toBeVisible();
}

/**
 * Returns a future date string in the format expected by the "Event Date & Time"
 * input (datetime-local → "YYYY-MM-DDThh:mm").
 * The date is set to 30 days from now at 18:00.
 */
function futureDateValue() {
  const future = new Date();
  future.setDate(future.getDate() + 30);
  const yyyy = future.getFullYear();
  const mm = String(future.getMonth() + 1).padStart(2, "0");
  const dd = String(future.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}T18:00`;
}

// Test
test("EventHub — create event, book ticket, verify seat count drops by 1", async ({ page }) => {

  //  Step 1: Login
  await login(page);

  //  Step 2: Create a new event
  await page.goto(`${BASE_URL}/admin/events`);

  const eventTitle = `Test Event ${Date.now()}`;

  await page.locator("#event-title-input").fill(eventTitle);
  await page.locator("#admin-event-form textarea").fill("Automated test event created by Playwright");
  await page.getByLabel("City").fill("Mumbai");
  await page.getByLabel("Venue").fill("Convention Center");
  await page.getByLabel("Event Date & Time").fill(futureDateValue());
  await page.getByLabel("Price ($)").fill("100");
  await page.getByLabel("Total Seats").fill("50");
  await page.locator("#add-event-btn").click();

  // Assert toast confirmation
  await expect(page.getByText("Event created!")).toBeVisible();

  //  Step 3: Find the event card & capture seats
  await page.goto(`${BASE_URL}/events`);

  const allCards = page.locator("[data-testid='event-card']");
  await expect(allCards.first()).toBeVisible();

  const matchedCard = allCards.filter({ hasText: eventTitle });
  await expect(matchedCard).toBeVisible({ timeout: 5000 });

  // Read the seat count — find element that contains the word "seat", parse the integer
  const seatText = await matchedCard.locator("text=seat").innerText();
  const seatsBeforeBooking = parseInt(seatText.match(/\d+/)[0], 10);
  console.log(`Seats before booking: ${seatsBeforeBooking}`);

  //  Step 4: Start booking
  await matchedCard.locator("[data-testid='book-now-btn']").click();

  //  Step 5: Fill booking form
  await expect(page.locator("#ticket-count")).toHaveText("1");
  await page.getByLabel("Full Name").fill("Test User");
  await page.locator("#customer-email").fill(USER_EMAIL);
  await page.getByPlaceholder("+91 98765 43210").fill("9876543210");
  await page.locator(".confirm-booking-btn").click();

  //  Step 6: Verify booking confirmation
  const bookingRefElement = page.locator(".booking-ref").first();
  await expect(bookingRefElement).toBeVisible();
  const bookingRef = (await bookingRefElement.innerText()).trim();
  console.log(`Booking reference: ${bookingRef}`);

  //  Step 7: Verify in My Bookings
  await page.getByRole("link", { name: "View My Bookings" }).click();
  await expect(page).toHaveURL(`${BASE_URL}/bookings`);

  const bookingCards = page.locator("#booking-card");
  await expect(bookingCards.first()).toBeVisible();

  const matchedBooking = bookingCards.filter({
    has: page.locator(".booking-ref", { hasText: bookingRef }),
  });
  await expect(matchedBooking).toBeVisible();
  await expect(matchedBooking).toContainText(eventTitle);

  //  Step 8: Verify seat reduction
  await page.goto(`${BASE_URL}/events`);
  await expect(allCards.first()).toBeVisible();

  const cardAfter = allCards.filter({ hasText: eventTitle });
  await expect(cardAfter).toBeVisible();

  const seatTextAfter = await cardAfter.locator("text=seat").innerText();
  const seatsAfterBooking = parseInt(seatTextAfter.match(/\d+/)[0], 10);
  console.log(`Seats after booking: ${seatsAfterBooking}`);

  expect(seatsAfterBooking).toBe(seatsBeforeBooking - 1);
});
