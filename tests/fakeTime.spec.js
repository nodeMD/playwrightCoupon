import { test, expect } from "@playwright/test";
import path from "path";

test.beforeEach(async ({ context }) => {
    await context.addInitScript({
        path: path.join(__dirname, "..", "./node_modules/sinon/pkg/sinon.js"),
    });
    await context.addInitScript(() => {
        window.__clock = sinon.useFakeTimers();
    });
});

test("fake time test", async ({ page }) => {
    await page.setContent(`
    <div id="box" style="height: 150px; width: 150px; background-color: salmon">
      Box
    </div>
    <script>
    setTimeout(() => {
        const box = document.getElementById('box');
        box.style.display = 'none';
      }, 4000); 
      
    </script>
  `);

    await expect(page.locator("#box")).toBeVisible();
    await page.evaluate(() => window.__clock.tick(4000));
    await expect(page.locator("#box")).not.toBeVisible();
});
