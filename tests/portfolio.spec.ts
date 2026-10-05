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
  await expect(page.locator(".theme-control")).toBeHidden();
  await context.close();
});

test("themes persist, follow the system, and tolerate blocked storage", async ({
  page,
}) => {
  await page.emulateMedia({ colorScheme: "light" });
  await page.goto("/");
  const theme = page.getByRole("radiogroup", { name: "Appearance" });
  await expect(
    theme.getByRole("radio", { name: "System", exact: true }),
  ).toBeChecked();
  await theme.getByRole("radio", { name: "Dark", exact: true }).check();
  await page.reload();
  await expect(
    theme.getByRole("radio", { name: "Dark", exact: true }),
  ).toBeChecked();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await theme.getByRole("radio", { name: "System", exact: true }).check();
  await expect
    .poll(() => page.evaluate(() => localStorage.getItem("portfolio-theme")))
    .toBeNull();
  await page.reload();
  await expect(
    theme.getByRole("radio", { name: "System", exact: true }),
  ).toBeChecked();
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
  await theme.getByRole("radio", { name: "Light", exact: true }).check();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
});

test("layout stays legible in both themes with no sideways scroll", async ({
  page,
}, testInfo) => {
  await page.goto("/");
  for (const theme of ["Light", "Dark"]) {
    await page.getByRole("radio", { name: theme, exact: true }).check();
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

// Theme choice must be available immediately, before scrolling through projects.
test("appearance control is in the header and inside the first viewport", async ({
  page,
}) => {
  await page.goto("/");
  const theme = page
    .getByRole("banner")
    .getByRole("radiogroup", { name: "Appearance" });
  await expect(theme).toBeVisible();
  await expect(theme).toBeInViewport();
  const profiles = await page
    .getByRole("navigation", { name: "Profiles" })
    .boundingBox();
  const control = await theme.boundingBox();
  expect(control!.y).toBeGreaterThanOrEqual(profiles!.y + profiles!.height);
});

test("appearance options support arrow keys and comfortable touch targets", async ({
  page,
}) => {
  await page.goto("/");
  const group = page.getByRole("radiogroup", { name: "Appearance" });
  const system = group.getByRole("radio", { name: "System", exact: true });
  await system.focus();
  await page.keyboard.press("ArrowRight");
  await expect(
    group.getByRole("radio", { name: "Light", exact: true }),
  ).toBeChecked();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await page.keyboard.press("ArrowRight");
  await expect(
    group.getByRole("radio", { name: "Dark", exact: true }),
  ).toBeChecked();
  await page.keyboard.press("ArrowRight");
  await expect(system).toBeChecked();
  await expect(system).toBeFocused();
  await page.keyboard.press("ArrowLeft");
  await expect(
    group.getByRole("radio", { name: "Dark", exact: true }),
  ).toBeChecked();
  for (const radio of await group.getByRole("radio").all()) {
    const box = await radio.boundingBox();
    expect(box!.width).toBeGreaterThanOrEqual(44);
    expect(box!.height).toBeGreaterThanOrEqual(44);
  }
});
