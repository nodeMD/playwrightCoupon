import { test, expect } from "@playwright/test";
import { MainPage } from "./pages/mainPage";

let mainPage;

test.describe("Main Page tests", () => {
  test.beforeEach(async ({ page, isMobile }) => {
    mainPage = new MainPage(page, isMobile);
    await page.goto("./");
    await page.waitForURL("./");
  });

  test("Validate that at least 30 Today’s Trending Coupons are displayed on the main page", async () => {
    await expect(
      await mainPage.trendingCouponContainer.count()
    ).toBeGreaterThanOrEqual(30);
  });
});
