import { chromium } from "@playwright/test";
import { preview } from "vite";
const server = await preview({
  preview: { host: "127.0.0.1", port: 4188, strictPort: true },
});
let browser;
try {
  browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: { width: 1200, height: 630 },
    reducedMotion: "reduce",
  });
  await page.goto("http://127.0.0.1:4188/");
  await page.evaluate(() => {
    const art = document.querySelector(".intro-art svg").cloneNode(true);
    const title = document.createElement("h1");
    title.textContent = "Isaac Velando";
    title.style.cssText = "font-size:72px;margin:0;color:#e5ebf5";
    const caption = document.createElement("p");
    caption.textContent = "Projects & experiments";
    caption.style.cssText = "font-size:22px;margin:14px 0 0;color:#b1bfd2";
    art.style.cssText = "height:340px;width:378px;color:#99b2ff;display:block";
    const card = document.createElement("main");
    card.style.cssText =
      "width:1200px;height:630px;background:#131c2c;display:flex;align-items:center;justify-content:center;flex-direction:column;padding-bottom:28px";
    card.append(art, title, caption);
    document.body.replaceChildren(card);
  });
  await page.screenshot({ path: "public/og-image.png" });
  await page.setViewportSize({ width: 180, height: 180 });
  await page.evaluate(() => {
    const icon = document.createElement("div");
    icon.textContent = "iv.";
    icon.style.cssText =
      "width:180px;height:180px;display:grid;place-items:center;background:#254edb;color:white;font:bold 125px Georgia,serif;letter-spacing:-14px;padding-right:12px";
    document.body.replaceChildren(icon);
  });
  await page.screenshot({ path: "public/apple-touch-icon.png" });
} finally {
  await browser?.close();
  await new Promise((resolve, reject) =>
    server.httpServer.close((error) => (error ? reject(error) : resolve())),
  );
}
