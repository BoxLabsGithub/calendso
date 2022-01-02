import { expect, test } from "@playwright/test";

import { hasIntegrationInstalled } from "../../../lib/integrations/getIntegrations";

test.describe.serial("Apple Calendar integration", () => {
  test.skip(!hasIntegrationInstalled("apple_calendar"), "It should only run if Apple Calendar is installed");

  test.describe.serial("Apple Calendar integration dashboard", () => {
    test.use({ storageState: "playwright/artifacts/proStorageState.json" });

    test("Can add Apple Calendar integration", async ({ browser }) => {
      const context = await browser.newContext({ locale: "en-US" });

      const page = await context.newPage();

      await page.goto("/integrations");

      /** We should see the "Connect" button for Apple Calendar */
      expect(page.locator(`li:has-text("Apple Calendar") >> [data-testid="integration-connection-button"]`))
        .toContainText("Connect")
        .catch(() => {
          console.error(
            `Make sure Apple Calendar it's properly installed and that an integration hasn't been already added.`
          );
        });

      await page.click('li:has-text("Apple Calendar") >> [data-testid="integration-connection-button"]');

      await page.waitForTimeout(100);

      page.fill('[name="username"]', "edanfesi@gmail.com");

      await page.waitForTimeout(100);

      page.fill('[type="password"]', "pymd-yhve-tsox-iqlm");

      await page.click('[type="submit"]');

      await page.waitForTimeout(10000);

      const locator = await page.$("text=Disconnect");

      expect(locator).not.toBe(null);
    });
  });
});
