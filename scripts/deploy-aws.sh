#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────
# deploy-aws.sh — push the current branch to domus EC2 (shop.meterbolic.com)
#
# What it does (mirrors RUNBOOK.md section 4 in one command):
#   1. Asserts the working tree is clean and we're on main
#   2. npm run build       → produces .next/
#   3. tar everything (excluding node_modules, .git, .env*)
#   4. scp to /tmp/ on the server
#   5. ssh in, extract to /srv/meo-landing/, npm ci --omit=dev
#   6. sudo systemctl restart meo-landing
#   7. Smoke-test the live URL
#
# Usage:
#   bash scripts/deploy-aws.sh
#
# Requirements on YOUR machine:
#   - Node 20+
#   - SSH access to ubuntu@domus.meterbolic.com (your normal key)
#   - A clean main with the changes you want to ship
#
# Requirements on the server (already set up per RUNBOOK section 4):
#   - /srv/meo-landing exists with .env.local in place
#   - meo-landing.service is the systemd unit
#   - sudo for the ubuntu user (passwordless or you'll be prompted)
#
# Notes:
#   - .env.local on the server is NOT touched. Update Stripe Price IDs
#     there directly if/when the SKUs change.
#   - The live site is served by Caddy proxying localhost:3100. Restart
#     of meo-landing.service is enough — no Caddy reload needed.
# ─────────────────────────────────────────────────────────────────────
set -euo pipefail

REMOTE_HOST="${REMOTE_HOST:-ubuntu@domus.meterbolic.com}"
REMOTE_DIR="${REMOTE_DIR:-/srv/meo-landing}"
SERVICE_NAME="${SERVICE_NAME:-meo-landing}"
LIVE_URL="${LIVE_URL:-https://shop.meterbolic.com}"
TARBALL="/tmp/meo-landing-$(date +%s).tgz"

cd "$(dirname "$0")/.."

echo "─── Pre-flight ───────────────────────────────────────────────"
BRANCH="$(git rev-parse --abbrev-ref HEAD)"
if [ "$BRANCH" != "main" ]; then
  echo "⚠️  You are on branch '$BRANCH', not main."
  read -rp "Deploy this branch anyway? [y/N] " ans
  [[ "$ans" =~ ^[Yy]$ ]] || { echo "Aborted."; exit 1; }
fi

if ! git diff-index --quiet HEAD --; then
  echo "⚠️  Working tree has uncommitted changes."
  read -rp "Deploy current files (uncommitted included)? [y/N] " ans
  [[ "$ans" =~ ^[Yy]$ ]] || { echo "Aborted."; exit 1; }
fi

HEAD_HASH="$(git rev-parse --short HEAD)"
echo "→ Branch: $BRANCH @ $HEAD_HASH"
echo "→ Target: $REMOTE_HOST:$REMOTE_DIR"
echo "→ Service: $SERVICE_NAME"
echo

echo "─── 1. Build (npm run build) ─────────────────────────────────"
npm run build

echo
echo "─── 2. Package (tar) ─────────────────────────────────────────"
tar -czf "$TARBALL" \
  --exclude=node_modules \
  --exclude=.git \
  --exclude=.env.local \
  --exclude=.env \
  --exclude=.next/cache \
  .
ls -lh "$TARBALL"

echo
echo "─── 3. Upload (scp) ──────────────────────────────────────────"
scp "$TARBALL" "$REMOTE_HOST:/tmp/meo-landing.tgz"

echo
echo "─── 4. Extract + install + restart on server (ssh) ───────────"
ssh "$REMOTE_HOST" bash <<EOF
  set -euo pipefail
  echo "  → backing up current build to ${REMOTE_DIR}.bak"
  sudo rsync -a --delete --exclude=.env.local --exclude=node_modules \
    "${REMOTE_DIR}/" "${REMOTE_DIR}.bak/" 2>/dev/null || true

  echo "  → extracting new build into ${REMOTE_DIR}"
  sudo mkdir -p "${REMOTE_DIR}"
  sudo tar -xzf /tmp/meo-landing.tgz -C "${REMOTE_DIR}" \
    --exclude='.env.local'
  sudo chown -R ubuntu:ubuntu "${REMOTE_DIR}"

  echo "  → npm ci --omit=dev"
  cd "${REMOTE_DIR}" && npm ci --omit=dev

  echo "  → restart ${SERVICE_NAME}"
  sudo systemctl restart "${SERVICE_NAME}"
  sudo systemctl status "${SERVICE_NAME}" --no-pager | head -15

  rm -f /tmp/meo-landing.tgz
EOF

rm -f "$TARBALL"

echo
echo "─── 5. Smoke test ────────────────────────────────────────────"
sleep 3
HTTP_CODE="$(curl -s -o /dev/null -w '%{http_code}' "$LIVE_URL/" || echo "000")"
if [ "$HTTP_CODE" = "200" ]; then
  echo "✅ $LIVE_URL → 200 OK"
else
  echo "⚠️  $LIVE_URL returned $HTTP_CODE — check 'sudo journalctl -u ${SERVICE_NAME} -n 50' on the server"
fi

echo
echo "Deployed $BRANCH @ $HEAD_HASH to $LIVE_URL"
