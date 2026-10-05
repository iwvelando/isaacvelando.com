import { readFile, stat, readdir } from "node:fs/promises";
import assert from "node:assert/strict";
for (const file of [
  "index.html",
  "404.html",
  "favicon.svg",
  "og-image.png",
  "apple-touch-icon.png",
  "LICENSE.txt",
  "THIRD-PARTY-NOTICES.txt",
]) {
  assert((await stat(`dist/${file}`)).size > 0, `Missing or empty ${file}`);
}
const html = await readFile("dist/index.html", "utf8");
assert(!html.includes("%%"), "Unresolved template token");
assert.equal(
  (html.match(/<article /g) ?? []).length,
  6,
  "Incomplete portfolio",
);
assert(html.includes("https://isaacvelando.com/"), "Missing canonical domain");
for (const match of html.matchAll(/(?:src|href)="(\.\/[^"#]+)"/g)) {
  await stat(`dist/${match[1].slice(2)}`);
}
const assets = await readdir("dist/assets");
const js = assets.filter((name) => name.endsWith(".js"));
assert(js.length > 0, "Missing theme script");
const bytes = (
  await Promise.all(js.map((name) => stat(`dist/assets/${name}`)))
).reduce((sum, file) => sum + file.size, 0);
assert(bytes < 5000, "Browser JavaScript exceeded the 5 KB budget");
console.log(`Distribution complete; ${bytes} bytes of browser JavaScript.`);
