#!/usr/bin/env bash
# Runs ON the VPS, fed to `bash -s` over SSH by .github/workflows/deploy.yml.
#
# Scoped strictly to the app directory passed as $1 — nothing outside it is
# read or written. Refuses to act unless that directory really is the boxit
# checkout, so a mistyped path cannot npm-ci over an unrelated folder.
#
#   $1  app directory   (e.g. /var/www/boxit.pk)
#   $2  restart command (e.g. "pm2 restart boxit --update-env")
#   $3  health URL      (optional, e.g. http://127.0.0.1:3000/)
set -euo pipefail

APP_DIR=${1:?app directory not given}
RESTART_CMD=${2:?restart command not given}
HEALTH_URL=${3:-}

cd "$APP_DIR"

# --- guard rails ------------------------------------------------------------
git rev-parse --is-inside-work-tree >/dev/null
test -f package.json
grep -q '"name": *"boxit-app"' package.json

echo "==> deploying in $(pwd)"
echo "==> current commit: $(git rev-parse --short HEAD)"

# --- fetch ------------------------------------------------------------------
git fetch --prune origin

# --ff-only, deliberately not `reset --hard`: if the server's checkout has
# drifted, the deploy stops and says so instead of destroying whatever is there.
if ! git merge --ff-only origin/main; then
  echo "!! cannot fast-forward to origin/main — the server checkout has local" >&2
  echo "!! commits or uncommitted changes. Resolve on the box, then re-run." >&2
  exit 1
fi

echo "==> new commit: $(git rev-parse --short HEAD)"

# --- build ------------------------------------------------------------------
# npm ci installs exactly what package-lock.json pins, and is the reproducible
# counterpart to the committed lockfile.
npm ci --no-audit --no-fund
npm run build

# --- restart ----------------------------------------------------------------
echo "==> restarting: $RESTART_CMD"
eval "$RESTART_CMD"

# --- verify -----------------------------------------------------------------
if [ -n "$HEALTH_URL" ]; then
  echo "==> health check: $HEALTH_URL"
  for i in $(seq 1 45); do
    if curl -fsS -o /dev/null --max-time 5 "$HEALTH_URL"; then
      echo "==> healthy after ${i}s"
      exit 0
    fi
    sleep 1
  done
  echo "!! health check never passed — the app may be down, check the process" >&2
  exit 1
fi

echo "==> done"
