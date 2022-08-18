export class MainPage {
  constructor(page, isMobile) {
    this.page = page;
    this.isMobile = isMobile;
    this.topDealContainer = page.locator(".top-deal.swiper-slide");
    this.topDealDuplicate = page.locator(".swiper-slide-duplicate");
    this.topDealActiveName = page.locator(".swiper-slide-active span.merchant");
    this.topDealName = page.locator("div.top-deal span.merchant");
    this.staffPickContainer = page.locator("div.staff-pick");
    this.staffPickStoreName = page.locator("div.staff-pick span");
    this.staffPickDiscountText = page.locator("div.staff-pick p.title");
    if (isMobile) {
      this.trendingCouponContainer = page.locator("article.trending-mobile");
    } else {
      this.trendingCouponContainer = page.locator("article.trending-offer");
    }
  }
}
