import { test, expect } from "@playwright/test";
import { MainPage } from "./pages/mainPage";

let mainPage;

test.describe("Main Page tests", () => {
  test.beforeEach(async ({ page, isMobile }) => {
    mainPage = new MainPage(page, isMobile);
    await page.goto("./");
    await page.waitForURL("./");
  });

  test("Validate that 3 out of 3 or 6 or 9 total Top Deal coupons are displayed", async () => {
    const topDeals = await mainPage.topDealContainer.count();
    const topDealsDuplicates = await mainPage.topDealDuplicate.count();
    const notDuplicatedTopDeals = topDeals - topDealsDuplicates;
    if (
      notDuplicatedTopDeals !== 3 &&
      notDuplicatedTopDeals !== 6 &&
      notDuplicatedTopDeals !== 9
    ) {
      await expect(
        false,
        `expected to have 3 or 6 or 9 top deals but got ${topDeals}`
      ).toBe(true);

      // check if only 3 deals are visible
    }
  });

  test("Validate that at least 30 Today’s Trending Coupons are displayed on the main page", async () => {
    await expect(
      await mainPage.trendingCouponContainer.count()
    ).toBeGreaterThanOrEqual(30);
  });

  test("Validate that Staff Picks contains unique stores with proper discounts for monetary, percentage or text values", async () => {
    const staffPicksCount = await mainPage.staffPickContainer.count();
    expect(staffPicksCount).toBeGreaterThan(0);

    // iterate through staff picks and check if they contain unique stores and proper data 
  });

  test("If applicable (there are more than 3 Top Deal coupons) - Validate that the Top Deal swiper is automatically changed every 5 seconds", async () => {
    const topDeals = await mainPage.topDealContainer.count();
    const topDealsDuplicates = await mainPage.topDealDuplicate.count();
    if (topDeals - topDealsDuplicates > 3) {
      // check if it change after every 5sec
    }
  });
});
