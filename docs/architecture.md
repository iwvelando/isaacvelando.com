# Architecture

A static document with progressive enhancement. TypeScript and Vite keep the reference
projects’ toolchain without sending React, WASM, or a router to the visitor.

1. `web/projects.ts` is the typed content catalog and page metadata.
2. `web/art.ts` produces deterministic, decorative SVG. It runs only at build/dev time.
3. `web/render.ts` escapes catalog text and inserts content into the HTML template.
4. Vite fingerprints CSS and the tiny theme script, copying `public/` into `dist/`.
5. `scripts/check-dist.mjs` rejects missing assets, unresolved tokens, an incomplete
   catalog, or browser JS above 5 KB. License notices are generated before building.

The theme is the only client state. CSS follows the system; `web/main.ts` restores
explicit light/dark preferences and exposes the icon selector. Native radios provide
one-click selection and arrow-key navigation, with System selected by default. Each
44-pixel target has an accessible name and a hover/focus label. Storage denial is tolerated.
All links are ordinary same-tab anchors; users can choose a new tab normally. One
accessible project title link covers each illustration and description.

## Design

Light: paper #f6f8fb, ink #17263d, muted #546175, cobalt #254edb, rule #d8dfe9.
Dark: paper #131c2c, ink #e5ebf5, muted #b1bfd2, cobalt #99b2ff.
Iowan/Palatino/Georgia provide display type; Avenir/Segoe UI provide body text.

The desktop layout pairs a personal introduction with a geometric rosette, then two
columns of project illustrations and descriptions. On phones it becomes one column;
the hero rosette gives way to the text. No automatic animation or externally loaded
assets. Drawings are thematic illustrations, not numerical claims or screenshots.

## Verification boundaries

Browser tests cover the six destination links, profiles, archive status, no-JS content,
theme persistence/system changes/storage denial, keyboard skip navigation, CSP errors,
responsive layout, and social-image dimensions. Desktop Chromium, narrow-phone Chromium,
and iPhone WebKit use the production build under its CSP. Tests verify configured URLs;
they do not crawl external destinations on every CI run. Live sites were inspected for
the initial descriptions; see content.md.

CI runs formatting/build checks, Chromium and WebKit, then the required `verify` gate.
Verified main runs deploy the same build artifact to S3 through OIDC, invalidate
CloudFront, compare the live CSP, and run read-only smoke tests. PRs never deploy.
The first launch depends on the corresponding cloud-accounts root being applied.

The CSP uses same-origin resources only. HTTPS redirects and HSTS belong to
CloudFront; `upgrade-insecure-requests` is unnecessary here and breaks WebKit’s
HTTP loopback preview by rewriting its asset requests to HTTPS.
