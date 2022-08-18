import { test, expect } from "@playwright/test";
import wait from "./helpers/wait";
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
    }
    const expectedNumberOfVisibleTopDeals = 3;
    await mainPage.checkVisibleTopDeals(expectedNumberOfVisibleTopDeals);
  });

  test("Validate that at least 30 Today’s Trending Coupons are displayed on the main page", async () => {
    await expect(
      await mainPage.trendingCouponContainer.count()
    ).toBeGreaterThanOrEqual(30);
  });

  test("Validate that Staff Picks contains unique stores with proper discounts for monetary, percentage or text values", async () => {
    let storesNames = [];
    const staffPicksCount = await mainPage.staffPickContainer.count();
    expect(staffPicksCount).toBeGreaterThan(0);

    for (let index = 0; index < staffPicksCount; index++) {
      let storeName = await mainPage.staffPickStoreName
        .nth(index)
        .textContent();

      storesNames.push(storeName);

      let discountText = await await mainPage.staffPickDiscountText
        .nth(index)
        .textContent();

      if (discountText.includes("%")) {
        let percentageNumber = parseFloat(discountText.match(/\d/g).join(""));
        await expect(percentageNumber).toBeGreaterThanOrEqual(1);
        await expect(percentageNumber).toBeLessThanOrEqual(100);
      } else if (discountText.includes("$")) {
        let cashValue = parseFloat(discountText.match(/\d/g).join(""));
        await expect(cashValue).toBeGreaterThan(1);
      } else {
        await expect(discountText.length).toBeGreaterThan(3);
      }
    }
    await expect(storesNames.length).toEqual(staffPicksCount);
    await expect(storesNames.length).toEqual(new Set(storesNames).size);
  });

  test("If applicable (there are more than 3 Top Deal coupons) - Validate that the Top Deal swiper is automatically changed every 5 seconds", async () => {
    const topDeals = await mainPage.topDealContainer.count();
    const topDealsDuplicates = await mainPage.topDealDuplicate.count();
    if (topDeals - topDealsDuplicates > 3) {
      const activeTopDealName = await mainPage.topDealActiveName.textContent();
      wait(4000);
      const activeTopDealNameAfterFourSec =
        await mainPage.topDealActiveName.textContent();
      expect(activeTopDealName).toEqual(activeTopDealNameAfterFourSec);
      wait(1000);
      const activeTopDealNameAfterFiveSec =
        await mainPage.topDealActiveName.textContent();
      expect(activeTopDealName).not.toEqual(activeTopDealNameAfterFiveSec);
    }
  });
});
