import { test, expect } from "@playwright/test";

test("@smoke shared links reuse page copy and serve correctly sized PNGs", async ({
  page,
  request,
}) => {
  await page.goto("/");
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    "https://isaacvelando.com/",
  );
  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute(
    "content",
    await page.title(),
  );
  const description = await page
    .locator('meta[name="description"]')
    .getAttribute("content");
  expect(description).toBeTruthy();
  await expect(page.locator('meta[property="og:description"]')).toHaveAttribute(
    "content",
    description!,
  );
  await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute(
    "content",
    "summary_large_image",
  );
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
    "content",
    "https://isaacvelando.com/og-image.png",
  );
  for (const [path, width, height] of [
    ["/og-image.png", 1200, 630],
    ["/apple-touch-icon.png", 180, 180],
  ] as const) {
    const response = await request.get(path);
    expect(response.ok()).toBe(true);
    expect(response.headers()["content-type"]).toContain("image/png");
    const bytes = await response.body();
    expect(bytes.subarray(0, 8).toString("hex")).toBe("89504e470d0a1a0a");
    expect(bytes.readUInt32BE(16)).toBe(width);
    expect(bytes.readUInt32BE(20)).toBe(height);
  }
});
