#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────
# setup-github-deploy.sh — one-time setup for .github/workflows/deploy.yml
#
# Generates a dedicated SSH deploy key, copies its public half to the
# server, and prints the private half ready for you to paste into
# GitHub Secrets.
#
# Run this ONCE on your local machine. It does NOT need to run again
# unless you rotate the deploy key.
#
# What you'll need:
#   - SSH access to ubuntu@domus.meterbolic.com from your machine
#     (your normal personal key — this script uses it to copy the new
#     dedicated deploy key onto the server)
#   - A GitHub account with admin access to DIFFERENCECODE/product_landing_page
# ─────────────────────────────────────────────────────────────────────
set -euo pipefail

KEY_PATH="${KEY_PATH:-$HOME/.ssh/meo-deploy}"
REMOTE_HOST="${REMOTE_HOST:-ubuntu@domus.meterbolic.com}"
REPO="${REPO:-DIFFERENCECODE/product_landing_page}"

echo "─── 1. Generate dedicated deploy key (if not present) ───────"
if [ -f "$KEY_PATH" ]; then
  echo "Found existing key at $KEY_PATH — reusing."
else
  ssh-keygen -t ed25519 -C "github-actions-deploy@meo" -f "$KEY_PATH" -N ""
  echo "Generated new key at $KEY_PATH"
fi

echo
echo "─── 2. Copy public key to ${REMOTE_HOST} ────────────────────"
echo "(uses your existing SSH access — you may be prompted)"
ssh-copy-id -i "${KEY_PATH}.pub" "$REMOTE_HOST"

echo
echo "─── 3. Verify deploy key works ──────────────────────────────"
if ssh -i "$KEY_PATH" -o IdentitiesOnly=yes -o BatchMode=yes "$REMOTE_HOST" 'echo ✅ deploy key works'; then
  :
else
  echo "❌ deploy key did not authenticate. Check ~/.ssh/authorized_keys on $REMOTE_HOST."
  exit 1
fi

echo
echo "─── 4. Paste the private key into GitHub Secrets ────────────"
echo
echo "Open: https://github.com/${REPO}/settings/secrets/actions/new"
echo
echo "Set:"
echo "  Name:  DEPLOY_SSH_KEY"
echo "  Value: (the entire block below, including BEGIN/END lines)"
echo
echo "─────────────── COPY FROM HERE ───────────────"
cat "$KEY_PATH"
echo "──────────────── COPY UNTIL HERE ──────────────"
echo
echo "After saving the secret, push any commit to main (or run the"
echo "workflow manually from the Actions tab) — the deploy will run"
echo "automatically and you'll see logs at:"
echo
echo "  https://github.com/${REPO}/actions"
echo
echo "Done."
