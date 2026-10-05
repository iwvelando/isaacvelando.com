# Instructions for contributors and coding agents

## Intent

This is Isaac Velando’s personal portfolio: a small, welcoming directory of his
projects and public profiles. The portfolio must remain usable without JavaScript.
Read README.md and docs/architecture.md before changing its build or delivery.

## Discovery and boundaries

Use the installed codebase-memory skill for structural code discovery when available;
use direct reads for configuration and prose. Local agent tools are optional, and
project commands must work without them or machine-specific paths.

- TypeScript owns the content catalog and build-time rendering. Keep project copy,
  destinations, and artwork keys together in web/projects.ts.
- All six current sites must be linked, with grepLinux explicitly called an archived
  blog. Preserve Tom’s Crossing’s unofficial status and do not put story spoilers here.
- Do not invent biographical details, employment claims, testimonials, or statistics.
- No application server, analytics, remote fonts, embedded external sites, or runtime
  content fetching. All links and descriptions ship in HTML.
- Browser JavaScript is progressive enhancement only. The theme follows the system
  unless explicitly overridden; denied storage must leave the site usable.
- Illustrations are original decorative SVGs, not promises of the tools’ outputs.
- Respect reduced motion, visible keyboard focus, readable phone layouts, and both
  color schemes. Do not hide real failures by weakening a test or a size budget.

## Verification

Use test-first development for behavior changes: observe the relevant assertion fail
before implementing a fix. Run make check, make test-browser, and make test-webkit.
Inspect desktop light/dark and a narrow phone after visual changes. Share tags reuse
page title/description. Regenerate and inspect make share-card output after design
changes, and commit both PNGs. Keep dependency locks and license notices current.

## Git and hosting

Work on a branch and open a PR. Never push directly to main or force-push. All required
checks must pass before merging. The owner approved the initial design on 2026-10-05,
including moving the appearance control to the header.

Infrastructure belongs in iwvelando/cloud-accounts, never here. Merging to main verifies and deploys the tested artifact through the main-only
production environment, then runs live smoke checks. The first launch requires the
cloud-accounts root to be applied and DISTRIBUTION_ID set first; see docs/launch.md.
Never deploy locally. Keep deploy/content-security-policy.txt and the Terraform root in
sync; preview and browser tests send that policy. Leave no credentials or local paths
in committed files. MIT license; retain the reference workflow license in docs/.
