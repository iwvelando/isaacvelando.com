# isaacvelando.com

A home for Isaac Velando’s projects, experiments, and writing. Six project links,
a little context for each, and links to LinkedIn and GitHub.

**Live at [isaacvelando.com](https://isaacvelando.com/).** Hosting is managed by
[iwvelando/cloud-accounts](https://github.com/iwvelando/cloud-accounts). See [the launch checklist](docs/launch.md).

## Run locally

Requires **Node 22.18+**, npm, and Make (CI uses Node 22).

```sh
make setup
make dev
```

Open the URL Vite prints. Changes reload automatically. `make dev-lan` exposes the
development server on your local network. `make preview` builds first and serves
production files with the intended Content Security Policy. Both local defaults bind
to 127.0.0.1; stop them with Ctrl-C. Choose a port with
`make preview ARGS="--port 4186 --strictPort"`.

```sh
make check          # formatting, TypeScript, build, asset and size checks
make browsers       # first-time Chromium and WebKit installation
make test-browser   # desktop + 360 px phone, under production CSP
make test-webkit    # Safari engine on an iPhone profile
make share-card     # regenerate committed social card and home-screen icon
```

## Editing

- **Projects and metadata:** `web/projects.ts`. Each project has a name, category,
  description, URL, and illustration key. Keep [content sources](docs/content.md) current.
- **Page structure and introduction:** `index.html`. Vite expands its explicit tokens
  using `web/render.ts` in development and at build time.
- **Illustrations:** `web/art.ts`. These decorative vector studies suggest each subject.
- **Design tokens and layout:** `web/style.css`. System fonts, pale blue paper, dark ink,
  cobalt accents, and muted subject colors. Dark mode follows the visitor’s system;
  an explicit choice in the header persists locally when storage is available.
- **Browser enhancement:** `web/main.ts`, only the theme selector. There is no UI framework
  or computation engine because this page needs neither. All content works without JS.

The reference is [Tangent Garden](https://github.com/iwvelando/tangent-garden): TypeScript,
Vite, Make, Playwright, CSP-aware previews, locked dependencies, pinned Actions, and
agent docs. Its computational Go/WASM layer is unnecessary for a static portfolio.
The [architecture notes](docs/architecture.md) describe the boundaries and tests.

## Hosting and previews

`make build` produces a self-contained `dist/` directory. Ship its contents only,
including the license files and committed PNGs. No SPA fallback is needed: unknown
paths should serve `404.html` with HTTP 404. S3, CloudFront, ACM, Route53, the OIDC role,
and response headers belong to cloud-accounts. The required `verify` job gates checks on every PR. A verified push to main
deploys the exact tested artifact through GitHub OIDC and the main-only production
environment, then invalidates CloudFront and runs live smoke checks. Failed main runs
open or update an issue. `DISTRIBUTION_ID` is configured from the Terraform output; the workflow rejects a missing value before requesting AWS credentials.

The canonical URL and social metadata point to `https://isaacvelando.com/`. Shared
links use `public/og-image.png`; iOS uses `public/apple-touch-icon.png`. Generate them
with `make share-card`, inspect both, and commit them when the design changes. The card
is composed from the site’s own rosette on a dark background. Metadata uses exactly
the page’s title and description. Images are rendered using the fonts on the machine
running the script; the initial assets were rendered on macOS.

## Repository settings

Public repository, squash-only merges, PR title/body commit messages, automatic
branch deletion, required `verify`, and a main-only `production` environment match
tangent-garden. Secret scanning and push protection are enabled. The homepage is this
portfolio’s domain; Dependabot supplies dependency labels when it first runs.

MIT licensed. Reference workflow notices are in [docs/reference-license.txt](docs/reference-license.txt).
