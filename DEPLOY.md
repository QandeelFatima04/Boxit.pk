# Deploying boxit.pk

Every merge to `main` builds and restarts the site on the VPS, via
[.github/workflows/deploy.yml](.github/workflows/deploy.yml). You can also run
it by hand from the repo's **Actions** tab (*Deploy boxit.pk* → *Run workflow*).

The remote half is [scripts/deploy-remote.sh](scripts/deploy-remote.sh), fed to
`bash -s` over SSH. It touches **only** the app directory, and refuses to run
unless that directory really is this checkout.

## One-time setup

### 1. Make a deploy key (on your PC)

This is a new keypair used only by GitHub Actions — keep it separate from your
personal key.

```bash
ssh-keygen -t ed25519 -C "github-actions-deploy" -f ~/.ssh/boxit_deploy -N ""
```

### 2. Authorise it on the VPS

Append the **public** half to the deploy user's `authorized_keys`:

```bash
ssh-copy-id -i ~/.ssh/boxit_deploy.pub <user>@<vps-host>
```

### 3. Capture the host fingerprint (on your PC)

Pins the server so the key can never be handed to a spoofed host:

```bash
ssh-keyscan -H <vps-host>
```

### 4. Add the secrets

Repo → **Settings → Secrets and variables → Actions → Secrets**:

| Secret | What goes in it | Example |
| --- | --- | --- |
| `VPS_SSH_KEY` | Whole **private** key from step 1 (`cat ~/.ssh/boxit_deploy`), `BEGIN`/`END` lines included | |
| `VPS_KNOWN_HOSTS` | Full output of step 3 | |
| `VPS_HOST` | Server IP or hostname | `203.0.113.10` |
| `VPS_USER` | SSH user | `root` |
| `VPS_APP_DIR` | Absolute path of the checkout on the server | `/var/www/boxit.pk` |
| `VPS_RESTART_CMD` | Command that restarts the site | `pm2 restart boxit --update-env` |

Under the **Variables** tab (optional):

| Variable | Purpose | Default |
| --- | --- | --- |
| `VPS_PORT` | SSH port | `22` |
| `VPS_HEALTH_URL` | Polled for up to 45s after restart; deploy fails if it never answers | unset (skipped) |

Pick `VPS_RESTART_CMD` to match how the app runs:

- pm2 → `pm2 restart boxit --update-env`
- systemd → `systemctl restart boxit`
- Docker Compose → `cd /path/to/compose && docker compose up -d --build`

### 5. Let the server pull from GitHub

The script runs `git fetch origin` **on the VPS**, so the server needs its own
read access — the Actions key is not forwarded. Check what it uses:

```bash
git -C <app-dir> remote -v
```

If that is an `https://` URL and the repo is public, nothing more is needed. If
it is `git@github.com:...`, the server needs a key of its own: generate one
there and add the public half under repo → Settings → **Deploy keys** (read-only
is enough).

## What a deploy does

1. `git fetch --prune origin`
2. `git merge --ff-only origin/main` — **fast-forward only**. If the server's
   checkout has drifted (local commits or uncommitted edits) the deploy stops
   and tells you, rather than destroying that work with a `reset --hard`.
3. `npm ci` — installs exactly what `package-lock.json` pins
4. `npm run build`
5. Your restart command
6. Optional health check

Concurrency is capped at one deploy at a time, and a running deploy is never
cancelled mid-build.

## Notes

- **The first load after a deploy is slow.** `minimumCacheTTL` is a year, so
  every AVIF derivative re-encodes once on a cold cache. It settles afterwards —
  this is not a regression.
- **Rollback:** on the server, `git -C <app-dir> reset --hard <good-sha>` then
  `npm ci && npm run build` and restart. Or revert the merge on `main` and let
  the workflow redeploy.
- **The build runs on the VPS**, so it needs Node (this repo is built with
  Node 24) and roughly 1–2 GB of free RAM. If `next build` gets OOM-killed, add
  swap or move the build into CI and rsync `.next` across.
