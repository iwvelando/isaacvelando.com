# Launch checklist

## Complete for the initial review

- Public repo bootstrapped with MIT license and reference editor/Git conventions.
- Squash-only merging, automatic branch cleanup, required `verify`, secret scanning,
  push protection, and main-only `production` environment configured via gh.
- TypeScript/Vite static draft, local previews, agent docs, tests, share assets and CI.
- cloud-accounts inventory correction prepared separately: Tom’s Crossing is live,
  obsolete POC removed, this portfolio is the only planned site.

## After the owner accepts the design

1. Decide whether `www.isaacvelando.com` should redirect to the apex. The canonical
   portfolio URL is the requested `https://isaacvelando.com/`.
2. In cloud-accounts, add `sites/isaacvelando.com` using the existing hub hosted zone;
   do not create a second zone or change subdomain roots. Follow that repo’s tests-first
   process and use `household3d-ro` for plans. Match the CSP in this repo.
3. Read this repo’s current OIDC subject prefix with
   `gh api repos/iwvelando/isaacvelando.com/actions/oidc/customization/sub --jq .sub_claim_prefix`.
   Trust `environment:production`. IAM trust changes require the human’s action under
   cloud-accounts rules; prepare the reviewed plan and PR first.
4. Review all infrastructure plans, obtain the required human action, and wait for apply.
5. Add a deploy job after `verify` in ci.yml using actual Terraform outputs. Deploy
   only the tested build artifact from main through `production`, upload fingerprinted
   assets first, invalidate CloudFront, verify headers, then run `@smoke` browser tests.
   Add the reference’s failure alert at that point. No placeholder AWS IDs belong in CI.
6. Merge only after CI passes and design approval is recorded. Verify the live site via
   cloud-accounts/scripts/verify-site.sh with `--no-pages --no-feed`; move the inventory
   row to Live with its distribution ID and verification date.

Until then, ci.yml verifies only and merging this draft does not publish a website.
