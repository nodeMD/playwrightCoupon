/**
 * Waits for given amount of time.
 * @param {number} ms - milliseconds.
 */
export const wait = (ms) => new Promise((res) => setTimeout(res, ms));
