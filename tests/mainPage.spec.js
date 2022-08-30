import { test, expect } from "@playwright/test";
import path from "path";
import { MainPage } from "./pages/mainPage";

let mainPage;

test.describe("Main Page tests", () => {
  test.beforeEach(async ({ context, isMobile }) => {
    // add sinon
    await context.addInitScript({
      path: path.join(__dirname, "..", "./node_modules/sinon/pkg/sinon.js"),
    });
    // enable sinon
    await context.addInitScript(() => {
      window.__clock = sinon.useFakeTimers();
    });
    const page = await context.newPage();
    mainPage = new MainPage(page, isMobile);
    await page.goto("./");
    await page.waitForURL("./");
  });

  test("Validate that 3 out of 3 or 6 or 9 total Top Deal coupons are displayed", async () => {
    // I'm not sure if I understood this one properly. If not than I probably overcomplicated it.
    // What I understood is that sometimes there could be 3 or 6 or 9 unique top deals,
    // and 3 of them have to be visible. Maybe I did not had luck but I always got only 3 unique top deals.
    // So it was quite hard for me to determine how the app will behave with more than 3.
    const topDeals = await mainPage.topDealContainer.count();
    const topDealsDuplicates = await mainPage.topDealDuplicate.count();
    const notDuplicatedTopDeals = topDeals - topDealsDuplicates;
    await expect(
      notDuplicatedTopDeals % 3 == 0 && topDeals <= 9,
      `expected to have 3 or 6 or 9 top deals but got ${topDeals}`
    ).toBeTruthy();
    // we are expecting to have only 3 top deals visible
    const expectedNumberOfVisibleTopDeals = 3;
    // check if only three top deals are visible (implementation in ./pages/mainPage)
    await mainPage.checkVisibleTopDeals(expectedNumberOfVisibleTopDeals);
  });

  test("Validate that at least 30 Today’s Trending Coupons are displayed on the main page", async () => {
    // straightforward just get the elements and count them
    await expect(
      await mainPage.trendingCouponContainer.count()
    ).toBeGreaterThanOrEqual(30);
  });

  test("Validate that Staff Picks contains unique stores with proper discounts for monetary, percentage or text values", async () => {
    // array for storing staff pick stores names
    let storesNames = [];
    // count the staff picks
    const staffPicksCount = await mainPage.staffPickContainer.count();
    expect(staffPicksCount).toBeGreaterThan(0);

    for (let index = 0; index < staffPicksCount; index++) {
      // gather store name for every staff pick
      let storeName = await mainPage.staffPickStoreName
        .nth(index)
        .textContent();

      storesNames.push(storeName);
      // gather discounts texts for every staff pick
      let discountText = await await mainPage.staffPickDiscountText
        .nth(index)
        .textContent();

      if (discountText.includes("%")) {
        // for text with % check if the number is a valid % so between 1 and 100
        let percentageNumber = parseFloat(discountText.match(/\d/g).join(""));
        await expect(percentageNumber).toBeGreaterThanOrEqual(1);
        await expect(percentageNumber).toBeLessThanOrEqual(100);
      } else if (discountText.includes("$")) {
        // for text with $ check if the discount value is a number with a value greater than 1
        let cashValue = parseFloat(discountText.match(/\d/g).join(""));
        await expect(cashValue).toBeGreaterThan(1);
      } else {
        // for other discounts texts check if the text contain at least few chars
        // I would talk with Product Owner to gather more conditions that the text has to fulfill
        // and than I would add next validations to cover them
        await expect(discountText.length).toBeGreaterThan(3);
      }
    }
    // check that we gathered as many storesNames as we have staffPicks on the page
    await expect(storesNames.length).toEqual(staffPicksCount);
    // check if the staff pick array contains only unique entries
    await expect(storesNames.length).toEqual(new Set(storesNames).size);
  });

  test("If applicable (there are more than 3 Top Deal coupons) - Validate that the Top Deal swiper is automatically changed every 5 seconds", async () => {
    const topDeals = await mainPage.topDealContainer.count();
    const topDealsDuplicates = await mainPage.topDealDuplicate.count();
    // count unique deals and check if there are more than 3
    if (topDeals - topDealsDuplicates > 3) {
      const activeTopDealName = await mainPage.topDealActiveName.textContent();
      await page.evaluate(() => window.__clock.tick(4000));
      const activeTopDealNameAfterFourSec =
        await mainPage.topDealActiveName.textContent();
      expect(activeTopDealName).toEqual(activeTopDealNameAfterFourSec);
      await page.evaluate(() => window.__clock.tick(1000));
      const activeTopDealNameAfterFiveSec =
        await mainPage.topDealActiveName.textContent();
      // after five seconds the active top deal store name should be different than previously
      expect(activeTopDealName).not.toEqual(activeTopDealNameAfterFiveSec);
    }
  });
});
