#!/usr/bin/env bash
# Runs ON the VPS, fed to `bash -s` over SSH by .github/workflows/deploy.yml.
#
# Mirrors the release layout already in use at /var/www/boxit:
#
#   /var/www/boxit/current                -> symlink to the live release
#   /var/www/boxit/releases/<timestamp>/   each deploy is a fresh directory
#   /var/www/boxit/shared/.env.production  secrets, symlinked into each release
#
# A deploy builds a NEW release beside the live one and only flips the symlink
# once the build succeeds, so a failed build leaves the running site untouched.
# If the health check fails after the flip, it rolls straight back.
#
# Scoped to $APP_ROOT alone. This box also runs pack4u, careerbridgeai and
# Mailcow; nothing here reads or writes outside $APP_ROOT.
#
#   $1  app root        (/var/www/boxit)
#   $2  restart command (pm2 restart boxit --update-env)
#   $3  repo URL        (https://github.com/QandeelFatima04/Boxit.pk.git)
#   $4  branch          (main)
#   $5  health URL      (optional, http://127.0.0.1:3002/)
set -euo pipefail

APP_ROOT=${1:?app root not given}
RESTART_CMD=${2:?restart command not given}
REPO_URL=${3:?repo url not given}
BRANCH=${4:-main}
HEALTH_URL=${5:-}

KEEP_RELEASES=5
CURRENT="$APP_ROOT/current"
SHARED_ENV="$APP_ROOT/shared/.env.production"

# --- guard rails ------------------------------------------------------------
test -d "$APP_ROOT/releases" || { echo "!! $APP_ROOT/releases missing — wrong path?" >&2; exit 1; }
test -L "$CURRENT"           || { echo "!! $CURRENT is not a symlink — wrong path?" >&2; exit 1; }
test -f "$SHARED_ENV"        || { echo "!! $SHARED_ENV missing — refusing to deploy without prod env" >&2; exit 1; }

PREVIOUS=$(readlink -f "$CURRENT")
RELEASE="$APP_ROOT/releases/$(date +%Y%m%d%H%M%S)"
echo "==> live now:  $PREVIOUS"
echo "==> building:  $RELEASE"

# Any failure before the flip: bin the half-built release, leave the site alone.
cleanup_failed() {
  echo "!! deploy failed — removing $RELEASE, site still on $PREVIOUS" >&2
  rm -rf "$RELEASE"
}
trap cleanup_failed ERR

# --- fetch the code ---------------------------------------------------------
git clone --depth 1 --branch "$BRANCH" "$REPO_URL" "$RELEASE"
echo "==> deploying commit $(git -C "$RELEASE" rev-parse --short HEAD)"
# Releases are plain directories here, not checkouts — match that convention.
rm -rf "$RELEASE/.git"

# Secrets live in shared/ and are symlinked in, exactly as the current release
# does it. They are never copied into the release directory.
ln -sfn "$SHARED_ENV" "$RELEASE/.env.production"

# --- build ------------------------------------------------------------------
cd "$RELEASE"
npm ci --no-audit --no-fund
npm run build

# --- go live (atomic) -------------------------------------------------------
trap - ERR
# -T so the symlink is replaced rather than created inside the old target.
ln -sfnT "$RELEASE" "$CURRENT"
echo "==> flipped current -> $RELEASE"

echo "==> restarting: $RESTART_CMD"
eval "$RESTART_CMD"

# --- verify, roll back if the new release will not serve --------------------
if [ -n "$HEALTH_URL" ]; then
  echo "==> health check: $HEALTH_URL"
  healthy=0
  for i in $(seq 1 45); do
    if curl -fsS -o /dev/null --max-time 5 "$HEALTH_URL"; then
      echo "==> healthy after ${i}s"; healthy=1; break
    fi
    sleep 1
  done
  if [ "$healthy" -ne 1 ]; then
    echo "!! health check failed — rolling back to $PREVIOUS" >&2
    ln -sfnT "$PREVIOUS" "$CURRENT"
    eval "$RESTART_CMD"
    rm -rf "$RELEASE"
    exit 1
  fi
fi

# --- prune ------------------------------------------------------------------
# Keep the newest $KEEP_RELEASES, never the live one.
cd "$APP_ROOT/releases"
ls -1d */ 2>/dev/null | sed 's#/$##' | sort -r | tail -n +$((KEEP_RELEASES + 1)) | while read -r old; do
  [ "$APP_ROOT/releases/$old" = "$(readlink -f "$CURRENT")" ] && continue
  echo "==> pruning old release $old"
  rm -rf "$APP_ROOT/releases/${old:?}"
done

echo "==> done"
