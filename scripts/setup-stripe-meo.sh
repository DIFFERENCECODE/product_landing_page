#!/usr/bin/env bash
# setup-stripe-meo.sh — create Meo Products + Prices in Stripe.
#
# Usage:
#   export STRIPE_SK="sk_live_..."   # or sk_test_...
#   bash scripts/setup-stripe-meo.sh
#
# Runs against api.stripe.com directly — no Stripe CLI required.
# Requires curl + jq.

set -euo pipefail

if [ -z "${STRIPE_SK:-}" ]; then
  echo "ERROR: STRIPE_SK env var not set"
  echo "  export STRIPE_SK=\"sk_live_...\""
  exit 1
fi

if ! command -v jq >/dev/null 2>&1; then
  echo "ERROR: jq not installed. Install with 'apt install jq' or 'brew install jq'."
  exit 1
fi

API="https://api.stripe.com/v1"
AUTH="Authorization: Bearer ${STRIPE_SK}"

log() { printf '\033[1;32m[setup]\033[0m %s\n' "$*"; }
fail() { printf '\033[1;31m[setup]\033[0m %s\n' "$*"; exit 1; }

# --- mode detection (test vs live) ------------------------------------------
if [[ "$STRIPE_SK" == sk_live_* ]]; then
  MODE="LIVE"
elif [[ "$STRIPE_SK" == sk_test_* ]]; then
  MODE="TEST"
else
  fail "STRIPE_SK does not look like a Stripe secret key (expected sk_live_... or sk_test_...)"
fi
log "Running in $MODE mode."

# --- helper: create Product, return its id ----------------------------------
create_product() {
  local name="$1" desc="$2"
  local resp
  resp=$(curl -s -X POST "$API/products" \
    -H "$AUTH" \
    -d "name=$name" \
    --data-urlencode "description=$desc")
  local id
  id=$(echo "$resp" | jq -r '.id // empty')
  if [ -z "$id" ]; then
    fail "create_product failed for '$name': $resp"
  fi
  log "product  $id  $name"
  echo "$id"
}

# --- helper: create one-time GBP Price under a product ----------------------
create_price_once() {
  local product="$1" pence="$2"
  local resp
  resp=$(curl -s -X POST "$API/prices" \
    -H "$AUTH" \
    -d "product=$product" \
    -d "currency=gbp" \
    -d "unit_amount=$pence")
  local id
  id=$(echo "$resp" | jq -r '.id // empty')
  [ -z "$id" ] && fail "create_price_once failed: $resp"
  log "price    $id  one-time  £$(echo "scale=2; $pence/100" | bc)"
  echo "$id"
}

# --- helper: create recurring GBP Price under a product ---------------------
create_price_sub() {
  local product="$1" pence="$2" interval="$3"
  local resp
  resp=$(curl -s -X POST "$API/prices" \
    -H "$AUTH" \
    -d "product=$product" \
    -d "currency=gbp" \
    -d "unit_amount=$pence" \
    -d "recurring[interval]=$interval")
  local id
  id=$(echo "$resp" | jq -r '.id // empty')
  [ -z "$id" ] && fail "create_price_sub failed: $resp"
  log "price    $id  recurring/$interval  £$(echo "scale=2; $pence/100" | bc)"
  echo "$id"
}

# ============================================================================
# Create Products + Prices
# ============================================================================

# 1. Starter System — £149 one-time
P1=$(create_product "Meo Starter System" "Digital lipid meter + 1 month of Meo AI + eBook.")
PR1=$(create_price_once "$P1" 14900)

# 2. Test Strip subscription — £15/month
P2=$(create_product "Meo Test Strip Subscription" "10 fresh test strips delivered every month. Cancel any time.")
PR2=$(create_price_sub "$P2" 1500 "month")

# 3. Meo AI — 3 months one-time — £49
P3=$(create_product "Meo AI — 3 months" "Extend Meo AI access for 3 months.")
PR3=$(create_price_once "$P3" 4900)

# 4. Meo AI — 12 months one-time — £149
P4=$(create_product "Meo AI — 12 months" "Extend Meo AI access for 12 months.")
PR4=$(create_price_once "$P4" 14900)

# 5. Meo Premium Insights — £29/month
P5=$(create_product "Meo Premium Insights" "Deeper pattern analysis, connected device integrations, monthly 1:1 async coaching.")
PR5=$(create_price_sub "$P5" 2900 "month")

# 6. Meo Lite downsell — £29 one-time
P6=$(create_product "Meo Lite" "eBook + 7-day Meo AI trial. Credits toward a Starter System upgrade.")
PR6=$(create_price_once "$P6" 2900)

# ============================================================================
# Print env block
# ============================================================================
NOW=$(date -u +"%Y-%m-%d %H:%M:%S UTC")

cat <<EOF

# ─── Meo Stripe products · created ${NOW} · ${MODE} mode ────────
NEXT_PUBLIC_KIT_PRICE_ID=$PR1
NEXT_PUBLIC_ADDON_STRIP_SUB_PRICE_ID=$PR2
NEXT_PUBLIC_ADDON_AI_3MO_PRICE_ID=$PR3
NEXT_PUBLIC_ADDON_AI_12MO_PRICE_ID=$PR4
NEXT_PUBLIC_ADDON_PREMIUM_PRICE_ID=$PR5
NEXT_PUBLIC_DOWNSELL_LITE_PRICE_ID=$PR6

# Paste the above into .env.local (or AWS Parameter Store / Vercel env).
# Also required:
#   STRIPE_SECRET_KEY=${STRIPE_SK:0:12}...    # the same key you ran this script with
#   STRIPE_WEBHOOK_SECRET=whsec_...           # from Stripe Dashboard → Webhooks
#   NEXT_PUBLIC_BASE_URL=https://your-domain.com

log "Done. ${MODE} mode."
EOF
