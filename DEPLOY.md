# Deploying boxit.pk

Merging to `main` builds and restarts the site on the VPS, via
[.github/workflows/deploy.yml](.github/workflows/deploy.yml). It can also be run
by hand from the repo's **Actions** tab (*Deploy boxit.pk* → *Run workflow*).

## How the server is laid out

The VPS (`91.230.110.175`, hostname `mail`) uses a release-based layout:

```
/var/www/boxit/current                -> symlink to the live release
/var/www/boxit/releases/<timestamp>/   one directory per deploy
/var/www/boxit/shared/.env.production  production secrets (mode 600)
```

The app runs under **pm2** as `boxit`, serving `127.0.0.1:3002`, proxied by the
nginx vhost `/etc/nginx/sites-available/boxit.pk`. Release directories are plain
folders, not git checkouts — `.env.production` is symlinked in from `shared/`.

> **This box also hosts pack4u, careerbridgeai and Mailcow.**
> [scripts/deploy-remote.sh](scripts/deploy-remote.sh) touches `/var/www/boxit`
> and nothing else, and aborts if that path isn't the expected structure.

## What a deploy does

1. Clones `main` into a **new** `releases/<timestamp>` directory
2. Symlinks `shared/.env.production` into it
3. `npm ci && npm run build` — **in the new release**, so a failed build leaves
   the running site completely untouched and the half-built directory is removed
4. Flips `current` to the new release (atomic `ln -sfnT`)
5. Restarts pm2
6. Health-checks `http://127.0.0.1:3002/` for up to 45s — **and rolls the
   symlink back automatically** if the new release won't serve
7. Prunes all but the 5 newest releases, never the live one

## One-time setup

### 1. Make a deploy key (on your PC)

Separate from your personal key, used only by GitHub Actions:

```bash
ssh-keygen -t ed25519 -C "github-actions-deploy" -f ~/.ssh/boxit_deploy -N ""
```

### 2. Authorise it on the VPS

```bash
ssh-copy-id -i ~/.ssh/boxit_deploy.pub root@91.230.110.175
```

### 3. Capture the host fingerprint

```bash
ssh-keyscan -H 91.230.110.175
```

### 4. Add four secrets

Repo → **Settings → Secrets and variables → Actions → Secrets**:

| Secret | Value |
| --- | --- |
| `VPS_SSH_KEY` | The **private** key from step 1 — `cat ~/.ssh/boxit_deploy`, `BEGIN`/`END` lines included |
| `VPS_KNOWN_HOSTS` | Full output of step 3 |
| `VPS_HOST` | `91.230.110.175` |
| `VPS_USER` | `root` |

Everything else already defaults correctly for this server. Override under the
**Variables** tab only if the setup changes:

| Variable | Default |
| --- | --- |
| `VPS_APP_ROOT` | `/var/www/boxit` |
| `VPS_RESTART_CMD` | `pm2 restart boxit --update-env` |
| `VPS_HEALTH_URL` | `http://127.0.0.1:3002/` |
| `VPS_REPO_URL` | this repo's HTTPS URL |
| `VPS_PORT` | `22` |

The repo is public, so the server clones over HTTPS with no credentials — the
Actions key is only used to reach the VPS, never forwarded to GitHub.

## Rollback

Releases are kept, so rollback is a symlink flip:

```bash
ln -sfnT /var/www/boxit/releases/<previous-timestamp> /var/www/boxit/current && pm2 restart boxit --update-env
```

## Notes

- **The server runs Node 20.20.2**; Next 16 needs ≥20.9, so it is fine. The
  build needs ~1–2 GB RAM — there was 4.3 GB free and 86 GB disk at last check.
- **The first page load after a deploy is slow.** `minimumCacheTTL` is a year,
  so every AVIF derivative re-encodes once on a cold cache. It settles after
  that; this is not a regression.
- A deploy takes a few minutes, almost all of it `npm ci` and `next build`. The
  live site keeps serving the old release throughout.
