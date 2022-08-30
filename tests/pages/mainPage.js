import { expect } from "@playwright/test";
import { isInViewport } from "../helpers/isInViewport";

/**
 * Represents a CouponFollow home page.
 * @constructor
 * @param {Page} page - playwright page object.
 * @param {boolean} isMobile - true if the browser is opened in mobile view.
 */
export class MainPage {
  constructor(page, isMobile) {
    this.page = page;
    this.isMobile = isMobile;
    this.topDealContainer = page.locator(".top-deal.swiper-slide");
    this.topDealDuplicate = page.locator(".swiper-slide-duplicate");
    this.staffPickContainer = page.locator("div.staff-pick");
    this.staffPickStoreName = page.locator("div.staff-pick span");
    this.staffPickDiscountText = page.locator("div.staff-pick p.title");
    if (isMobile) {
      this.topDealName = page.locator(".swiper-slide-active span.merchant");
      this.trendingCouponContainer = page.locator("article.trending-mobile");
    } else {
      this.topDealName = page.locator(
        "div.top-deal:nth-child(2) span.merchant"
      );
      this.trendingCouponContainer = page.locator("article.trending-offer");
    }
  }

  /**
   * Checks how many topDeals are visible in the browser viewport.
   * @param {number} expectedNumberOfVisibleTopDeals - number of expected visible top deals on the page.
   */
  async checkVisibleTopDeals(expectedNumberOfVisibleTopDeals) {
    // count all topDeals
    const topDeals = await this.topDealContainer.count();
    let displayedDeals = 0;
    // iterate through all topDeals
    for (let index = 1; index <= topDeals; index++) {
      const isVisible = await isInViewport(
        this.page,
        `div.swiper-slide:nth-child(${index})`
      );
      if (isVisible) {
        // count only this topDeals which are visible for the user
        displayedDeals++;
      }
    }
    // check if exactly 3 top deals are visible for the user (that only 3 are in the viewport)
    await expect(displayedDeals).toEqual(expectedNumberOfVisibleTopDeals);
  }
}
