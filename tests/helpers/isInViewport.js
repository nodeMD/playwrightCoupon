/**
 * Checks if element on given page and given selector is in user viewport.
 * Added custom method as playwright isVisible() returns true even for elements that are not in the viewport.
 * @param {Page} page - playwright page object.
 * @param {string} selector - css selector of the element (not a playwright locator).
 * @returns {boolean} - true if even part of the element is in the viewport, false if the element is not in the viewport.
 */
export const isInViewport = (page, selector) => {
  return page.$eval(selector, async (element) => {
    const visibleRatio = await new Promise((resolve) => {
      const observer = new IntersectionObserver((entries) => {
        resolve(entries[0].intersectionRatio);
        observer.disconnect();
      });
      observer.observe(element);
      // Firefox doesn't call IntersectionObserver callback unless there are rafs.
      requestAnimationFrame(() => {});
    });
    return visibleRatio > 0;
  });
};
