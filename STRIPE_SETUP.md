# Stripe — Meo Setup

Creates all Products + Prices in Stripe for the Meo Starter System and
its upsells, then prints the env var block you paste into `.env.local`
(or your AWS Parameter Store / Vercel env).

> **Safety note:** this is a one-shot script. Run it **once** per Stripe
> account/mode. If you run it twice, you'll get duplicate products. If
> that happens, archive the duplicates in the Stripe Dashboard.

---

## 1. Prerequisites

- Your Stripe **secret key**:
  - Test mode → starts with `sk_test_…` (recommended for a first run)
  - Live mode → starts with `sk_live_…`
- `curl` + `jq` installed locally (macOS: pre-installed; Linux: `apt install jq`; WSL/Git-Bash: `choco install jq`)

---

## 2. Run the script

```bash
cd product_landing_page
export STRIPE_SK="sk_live_...your_key..."      # OR sk_test_... for test mode
bash scripts/setup-stripe-meo.sh
```

The script will:
1. Create 6 Products (Starter System, Test Strip subscription, Meo AI 3mo, Meo AI 12mo, Meo Premium, Meo Lite downsell)
2. Create 1 Price for each Product
3. Print the `.env.local` block — **copy it**

Typical output:

```
# ─── Meo Stripe products · created 2026-04-24 17:45:00 UTC ───
NEXT_PUBLIC_KIT_PRICE_ID=price_1ABC...
NEXT_PUBLIC_ADDON_STRIP_SUB_PRICE_ID=price_1DEF...
NEXT_PUBLIC_ADDON_AI_3MO_PRICE_ID=price_1GHI...
NEXT_PUBLIC_ADDON_AI_12MO_PRICE_ID=price_1JKL...
NEXT_PUBLIC_ADDON_PREMIUM_PRICE_ID=price_1MNO...
NEXT_PUBLIC_DOWNSELL_LITE_PRICE_ID=price_1PQR...
```

---

## 3. Paste into `.env.local` (or AWS Parameter Store)

```bash
# In addition to the block above, also set:
STRIPE_SECRET_KEY=sk_live_...                       # Server-side
STRIPE_WEBHOOK_SECRET=whsec_...                     # See section 4
NEXT_PUBLIC_BASE_URL=https://meo.meterbolic.com     # Your domain
WAITLIST_WEBHOOK_URL=https://api.meterbolic.org/v2/waitlist    # Optional
```

Restart the server: `npm run dev` (or `pm2 restart meo-landing` on the host).

---

## 4. Set up the webhook

```bash
# In Stripe Dashboard → Developers → Webhooks → Add endpoint
#   URL:    https://meo.meterbolic.com/api/webhooks/stripe
#   Events: checkout.session.completed
# Copy the signing secret (whsec_...) and set it as STRIPE_WEBHOOK_SECRET.
```

For local testing:
```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
# copy the whsec_ it prints into .env.local
```

---

## 5. Test card numbers (test mode only)

| Scenario | Card |
|---|---|
| Success | `4242 4242 4242 4242` |
| Declined | `4000 0000 0000 0002` |
| 3DS | `4000 0027 6000 3184` |

Any future expiry, any CVC, any postcode.

---

## 6. If you need to re-run (caution)

Archive the existing Products in Stripe Dashboard first (Products → select → "Archive"), then re-run. The script is **not** idempotent — it always creates new products.
