import { test, expect } from "@playwright/test";
import { site } from "../web/projects.ts";

test("@smoke sitemap lists the canonical page and robots.txt points to it", async ({
  request,
}) => {
  const sitemap = await request.get("/sitemap.xml");
  expect(sitemap.ok()).toBe(true);
  expect(sitemap.headers()["content-type"]).toMatch(/xml/);
  const xml = await sitemap.text();
  expect(xml).toContain('xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"');
  expect([...xml.matchAll(/<loc>([^<]*)<\/loc>/g)].map((m) => m[1])).toEqual([
    site.url,
  ]);

  const robots = await (await request.get("/robots.txt")).text();
  expect(robots).toMatch(
    new RegExp(`^Sitemap: ${site.url}sitemap\\.xml$`, "m"),
  );
});
