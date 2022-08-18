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
    // I'm not sure if I understood this one properly. If not than I probably overcomplicated it.
    // What I understood is that sometimes there could be 3 or 6 or 9 unique top deals,
    // and 3 of them have to be visible. Maybe I did not had luck but I always got only 3 unique top deals.
    // So it was quite hard for me to determine how the app will behave with more than 3.
    const topDeals = await mainPage.topDealContainer.count();
    const topDealsDuplicates = await mainPage.topDealDuplicate.count();
    const notDuplicatedTopDeals = topDeals - topDealsDuplicates;
    if (
      notDuplicatedTopDeals !== 3 &&
      notDuplicatedTopDeals !== 6 &&
      notDuplicatedTopDeals !== 9
    ) {
      // "custom" expect to check if the amount of unique topDeals is different than 3 or 6 or 9
      await expect(
        false,
        `expected to have 3 or 6 or 9 top deals but got ${topDeals}`
      ).toBe(true);
    }
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
      // I was not able to trigger that behavior of changing the topDeal after 5 seconds
      // maybe cause I was always getting only 3 unique topDeals
      // and I guess that it is only triggered when there are 6 or 9 unique topDeals.
      // If not than there is a bug cause even on mobile view it is not changing after 5sec.
      // If I would see how it works than I would try to approach it with waitForEvent.
      // Without seeing it in action I implemented it in a way that
      // it is checking if the center top deal store name does not changed until 5 seconds passed.
      // I'm not proud of it cause I do not like explicit waits in the tests code.
      const activeTopDealName = await mainPage.topDealActiveName.textContent();
      wait(4000);
      const activeTopDealNameAfterFourSec =
        await mainPage.topDealActiveName.textContent();
      expect(activeTopDealName).toEqual(activeTopDealNameAfterFourSec);
      wait(1000);
      const activeTopDealNameAfterFiveSec =
        await mainPage.topDealActiveName.textContent();
      // after five seconds the active top deal store name should be different than previously
      expect(activeTopDealName).not.toEqual(activeTopDealNameAfterFiveSec);
    }
  });
});
