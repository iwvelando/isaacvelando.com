import { test, expect } from "@playwright/test";

const destinations = [
  ["Tangent Garden", "https://tangent-garden.isaacvelando.com/"],
  ["Shelf Life", "https://shelf-life.isaacvelando.com/"],
  ["moneypath", "https://moneypath.isaacvelando.com/"],
  ["Tom’s Crossing Map", "https://toms-crossing-map.isaacvelando.com/"],
  ["Household 3D", "https://www.household3d.com/"],
  ["grepLinux", "https://greplinux.com/"],
];

test("@smoke every project and profile has a direct working link", async ({
  page,
}) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: "Isaac Velando", exact: true }),
  ).toBeVisible();
  await expect(page.locator("article")).toHaveCount(6);
  for (const [name, url] of destinations) {
    await expect(page.getByRole("link", { name, exact: true })).toHaveAttribute(
      "href",
      url,
    );
  }
  await expect(
    page.getByRole("link", { name: "LinkedIn", exact: true }),
  ).toHaveAttribute("href", "https://www.linkedin.com/in/iwvelando/");
  await expect(
    page.getByRole("link", { name: "GitHub", exact: true }),
  ).toHaveAttribute("href", "https://github.com/iwvelando/");
  await expect(
    page
      .locator("article")
      .filter({ has: page.getByRole("heading", { name: "grepLinux" }) }),
  ).toContainText("Archived blog");
});

test("the complete portfolio works with JavaScript disabled", async ({
  browser,
  baseURL,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto(baseURL!);
  await expect(page.locator("article")).toHaveCount(6);
  await expect(
    page.getByRole("link", { name: "Tangent Garden", exact: true }),
  ).toBeVisible();
  await context.close();
});

test("themes persist, follow the system, and tolerate blocked storage", async ({
  page,
}) => {
  await page.emulateMedia({ colorScheme: "light" });
  await page.goto("/");
  const theme = page.getByLabel("Color theme");
  await theme.selectOption("dark");
  await page.reload();
  await expect(theme).toHaveValue("dark");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await theme.selectOption("system");
  await page.emulateMedia({ colorScheme: "dark" });
  await expect
    .poll(() =>
      page
        .locator("body")
        .evaluate((el) => getComputedStyle(el).backgroundColor),
    )
    .toBe("rgb(19, 28, 44)");
  await page.addInitScript(() =>
    Object.defineProperty(window, "localStorage", {
      get() {
        throw new Error("denied");
      },
    }),
  );
  await page.reload();
  await theme.selectOption("light");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
});

test("layout stays legible in both themes with no sideways scroll", async ({
  page,
}, testInfo) => {
  await page.goto("/");
  for (const theme of ["light", "dark"]) {
    await page.getByLabel("Color theme").selectOption(theme);
    await expect
      .poll(() =>
        page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
      )
      .toBe(true);
    for (const card of await page.locator("article").all()) {
      await card.scrollIntoViewIfNeeded();
      const box = await card.boundingBox();
      expect(box!.width).toBeGreaterThan(280);
      await expect(card.getByRole("heading")).toBeVisible();
    }
    await page.screenshot({
      path: testInfo.outputPath(`${theme}.png`),
      fullPage: true,
    });
  }
});

test("keyboard skip link reaches the projects; CSP has no violations", async ({
  page,
  browserName,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.addInitScript(() =>
    document.addEventListener("securitypolicyviolation", (e) => {
      throw new Error(e.violatedDirective);
    }),
  );
  await page.goto("/");
  // WebKit on macOS uses Option-Tab to include links in keyboard navigation.
  await page.keyboard.press(browserName === "webkit" ? "Alt+Tab" : "Tab");
  await expect(
    page.getByRole("link", { name: "Skip to projects" }),
  ).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator("#projects")).toBeFocused();
  expect(errors).toEqual([]);
});
