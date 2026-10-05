# Portfolio launch

The owner approved the design on 2026-10-05 with the appearance selector moved into
the header. The portfolio is served at `https://isaacvelando.com/`; www redirects to
that canonical URL. Existing subdomain sites keep their independent roots.

## Deployment contract

- Infrastructure: `iwvelando/cloud-accounts`, root `sites/isaacvelando.com`.
- Bucket: `isaacvelando-com-site-634753796535`.
- Role: `arn:aws:iam::634753796535:role/isaacvelando-com-deploy`.
- OIDC subject: `repo:iwvelando@4652021/isaacvelando.com@1405080971:environment:production`.
- Repository variable `DISTRIBUTION_ID`: use the new root's actual output after apply.
- `deploy/content-security-policy.txt` must match Terraform exactly.

## First launch order

1. Pass the infrastructure PR's checks and review every root's plan. Follow
   cloud-accounts' human-action rule for IAM trust changes; the new deployment role
   establishes trust in this repo's production environment. The root reuses the hub
   zone and must not change existing infrastructure.
2. Merge the infrastructure PR through the required human action and watch main apply.
3. Read the new root's outputs using the named read-only profile. Set DISTRIBUTION_ID
   with `gh variable set DISTRIBUTION_ID --repo iwvelando/isaacvelando.com --body <actual-id>`.
4. Once the site PR's required checks pass, merge it. CI verifies, deploys its exact
   artifact, checks the live CSP, and runs live browser smoke tests.
5. Run cloud-accounts/scripts/verify-site.sh for the apex and www redirect with
   `--no-pages --no-feed`; confirm unknown paths return 404 and S3 stays private.
6. Move the inventory row to Live with its distribution ID and verification date.

## Subsequent changes

A merge to main publishes only after check, browser, webkit, and verify succeed.
PRs skip deploy/smoke/alert by design. Fingerprinted assets upload first and old assets
remain for already-open pages; the remaining files use a short cache TTL. Deployment
runs serialize and main runs are not canceled during an upload. Dependabot patch and
minor updates follow the same checks and dispatch a main verification/deployment.
