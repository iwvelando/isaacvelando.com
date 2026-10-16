import { readFileSync } from "node:fs";
import { defineConfig } from "vite";
import { renderPage, renderSitemap } from "./web/render.ts";

const csp = readFileSync("deploy/content-security-policy.txt", "utf8").trim();
export default defineConfig({
  plugins: [
    {
      name: "portfolio-html",
      transformIndexHtml: { order: "pre", handler: renderPage },
      generateBundle() {
        this.emitFile({
          type: "asset",
          fileName: "sitemap.xml",
          source: renderSitemap(),
        });
      },
    },
  ],
  base: "./",
  build: { modulePreload: false },
  preview: { headers: { "Content-Security-Policy": csp } },
});
