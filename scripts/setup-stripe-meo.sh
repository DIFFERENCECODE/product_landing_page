#!/usr/bin/env bash
# setup-stripe-meo.sh — create Meo Products + Prices in Stripe.
#
# Aligned with the April 2026 campaign brief (£197 main +
# Multimeter / Glucose / CGM / strip refills) and the data shape
# in src/lib/kitProducts.ts. Old £149 / 3-month-AI / strip-sub
# SKUs are NOT recreated by this script — archive them in the
# Stripe Dashboard once the new ones are confirmed working.
#
# Usage:
#   export STRIPE_SK="sk_live_..."   # or sk_test_...
#   bash scripts/setup-stripe-meo.sh
#
# Hits api.stripe.com directly — no Stripe CLI required.
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
fail() { printf '\033[1;31m[setup]\033[0m %s\n' "$*" >&2; exit 1; }

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
    --data-urlencode "name=$name" \
    --data-urlencode "description=$desc")
  local id
  id=$(echo "$resp" | jq -r '.id // empty')
  if [ -z "$id" ]; then
    fail "create_product failed for '$name': $resp"
  fi
  log "product  $id  $name" >&2
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
  log "price    $id  one-time  £$(echo "scale=2; $pence/100" | bc)" >&2
  echo "$id"
}

# ============================================================================
# Create Products + Prices — April 2026 catalog
# ============================================================================

# 1. Main bundle — £197 one-time
P_KIT=$(create_product \
  "Metabolic Health Cholesterol Tracker" \
  "6 months of Meo AI + Digital Lipid Meter (bundled free) + The Thin Book in Fat by Marina Young + Q&A with author + Biological Age Score + free retest at 6 months. 30-day money-back guarantee.")
PR_KIT=$(create_price_once "$P_KIT" 19700)

# 2. Multimeter — £60 one-time (RECOMMENDED add-on)
P_MULTI=$(create_product \
  "Glucose + MultiMeter" \
  "Measures glucose, ketones, cholesterol and uric acid. Free strips for glucose AND ketones bundled.")
PR_MULTI=$(create_price_once "$P_MULTI" 6000)

# 3. Glucose meter only — £30 one-time
P_GLU=$(create_product \
  "Glucose Meter" \
  "Standalone glucose meter for spot readings. No ketone or uric acid measurement.")
PR_GLU=$(create_price_once "$P_GLU" 3000)

# 4. SyAI CGM — £70 one-time
P_CGM=$(create_product \
  "SyAI Continuous Glucose Monitor" \
  "Continuous glucose monitoring across 14 days. Streams readings into Meo for spike-correlation with meals, sleep, stress.")
PR_CGM=$(create_price_once "$P_CGM" 7000)

# 5. Glucose strip refill — £15 one-time
P_GS=$(create_product \
  "Additional glucose strips" \
  "Top-up pack of glucose strips.")
PR_GS=$(create_price_once "$P_GS" 1500)

# 6. Ketone strip refill — £25 one-time
P_KS=$(create_product \
  "Additional ketone strips" \
  "Top-up pack of ketone strips for the MultiMeter.")
PR_KS=$(create_price_once "$P_KS" 2500)

# 7. Meo Lite downsell — £29 one-time (kept from previous catalog)
P_LITE=$(create_product \
  "Meo Lite" \
  "eBook + 7-day Meo AI trial. Credits toward a Cholesterol Tracker upgrade within 30 days.")
PR_LITE=$(create_price_once "$P_LITE" 2900)

# ============================================================================
# Print env block
# ============================================================================
NOW=$(date -u +"%Y-%m-%d %H:%M:%S UTC")

cat <<EOF

# ─── Meo Stripe products · created ${NOW} · ${MODE} mode ────────
NEXT_PUBLIC_KIT_PRICE_ID=${PR_KIT}
NEXT_PUBLIC_ADDON_MULTIMETER_PRICE_ID=${PR_MULTI}
NEXT_PUBLIC_ADDON_GLUCOSE_METER_PRICE_ID=${PR_GLU}
NEXT_PUBLIC_ADDON_SYAI_CGM_PRICE_ID=${PR_CGM}
NEXT_PUBLIC_ADDON_GLUCOSE_STRIPS_PRICE_ID=${PR_GS}
NEXT_PUBLIC_ADDON_KETONE_STRIPS_PRICE_ID=${PR_KS}
NEXT_PUBLIC_DOWNSELL_LITE_PRICE_ID=${PR_LITE}

# Paste the above into /home/ubuntu/apps/product-landing-page/.env.local
# (or via gh secret set if you'd rather store them as GitHub Actions
# secrets). Then \`pm2 reload meo-landing\` to pick up the new IDs.
#
# Also required in .env.local:
#   STRIPE_SECRET_KEY=${STRIPE_SK:0:12}...    # the same key you ran this script with
#   STRIPE_WEBHOOK_SECRET=whsec_...           # from Stripe Dashboard → Webhooks
#   NEXT_PUBLIC_BASE_URL=https://shop.meterbolic.com

EOF

log "Done. ${MODE} mode."
