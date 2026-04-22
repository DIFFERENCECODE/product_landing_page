# Meterbolic — Runbook

## 1. Local Setup

### Prerequisites
- Node.js ≥ 18.17 (`node -v`)
- npm ≥ 9 (`npm -v`)
- [Stripe CLI](https://stripe.com/docs/stripe-cli) for webhook testing

### Steps

```bash
# 1. Clone and install
git clone git@github.com:Lech-iyoko/product_landing_page.git
cd product_landing_page
npm install

# 2. Set up environment
cp .env.local.example .env.local
# → Fill in STRIPE_SECRET_KEY, NEXT_PUBLIC_KIT_PRICE_ID, and
#   the other NEXT_PUBLIC_ADDON_* price IDs (see section 2 below)

# 3. Place the Sejoy product image
cp /path/to/sejoy_1.png public/sejoy_1.png

# 4. Start the dev server
npm run dev
# App runs at http://localhost:3000
```

---

## 2. Stripe Test Mode Setup

### Create products & prices in Stripe Dashboard

1. Go to **Dashboard → Products → Add product**
2. Create the following (all one-time, GBP):

| Product | Price | Env var |
|---|---|---|
| Metabolic Health Kit | £197 | `NEXT_PUBLIC_KIT_PRICE_ID` |
| Glucose & MultiMeter | £60 | `NEXT_PUBLIC_ADDON_GLUCOSE_MULTI_PRICE_ID` |
| Glucose Meter | £30 | `NEXT_PUBLIC_ADDON_GLUCOSE_METER_PRICE_ID` |
| SyAI CGM | £70 | `NEXT_PUBLIC_ADDON_CGM_PRICE_ID` |
| Extra Glucose Strips | £15 | `NEXT_PUBLIC_ADDON_GLUCOSE_STRIPS_PRICE_ID` |
| Extra Ketone Strips | £25 | `NEXT_PUBLIC_ADDON_KETONE_STRIPS_PRICE_ID` |

3. Copy each `price_xxx` ID into `.env.local`

### Test card numbers

| Scenario | Card |
|---|---|
| Successful payment | `4242 4242 4242 4242` |
| Card declined | `4000 0000 0000 0002` |
| 3D Secure | `4000 0027 6000 3184` |

Use any future expiry date, any 3-digit CVC, any postcode.

---

## 3. Webhook Test Command (local)

```bash
# Terminal 1 — run the app
npm run dev

# Terminal 2 — forward Stripe events to local server
stripe listen --forward-to localhost:3000/api/webhooks/stripe

# Stripe CLI will print a webhook signing secret:
#   > Ready! Your webhook signing secret is whsec_xxx
# Copy that value into .env.local as STRIPE_WEBHOOK_SECRET
# then restart the dev server.

# Terminal 2 — trigger a test checkout.session.completed event
stripe trigger checkout.session.completed
```

Expected log output in Terminal 1:
```
[stripe-webhook] checkout.session.completed — id=cs_test_xxx email=...
[waitlist] New signup (stub — wire WAITLIST_WEBHOOK_URL): { email: '...', source: 'stripe-webhook', joinedAt: '...' }
```

---

## 4. Wiring the Waitlist to Your Backend

The `POST /api/waitlist` route is stubbed to log locally. To connect it to  
your MeO RDS database or AWS SES pipeline:

```bash
# .env.local
WAITLIST_WEBHOOK_URL=https://your-backend.com/internal/waitlist
```

The route will `POST { email, source, joinedAt }` to that URL.  
Your backend endpoint should return a 2xx status on success.

---

## 5. Deploy to Vercel

```bash
# Install Vercel CLI (if needed)
npm i -g vercel

# Deploy
vercel

# Set production environment variables
vercel env add STRIPE_SECRET_KEY
vercel env add STRIPE_WEBHOOK_SECRET
vercel env add NEXT_PUBLIC_KIT_PRICE_ID
vercel env add NEXT_PUBLIC_ADDON_GLUCOSE_MULTI_PRICE_ID
vercel env add NEXT_PUBLIC_ADDON_GLUCOSE_METER_PRICE_ID
vercel env add NEXT_PUBLIC_ADDON_CGM_PRICE_ID
vercel env add NEXT_PUBLIC_ADDON_GLUCOSE_STRIPS_PRICE_ID
vercel env add NEXT_PUBLIC_ADDON_KETONE_STRIPS_PRICE_ID
vercel env add NEXT_PUBLIC_BASE_URL          # e.g. https://meterbolic.com
# Optional:
vercel env add WAITLIST_WEBHOOK_URL
```

### Register the production webhook in Stripe

1. **Dashboard → Developers → Webhooks → Add endpoint**
2. URL: `https://meterbolic.com/api/webhooks/stripe`
3. Events: `checkout.session.completed`
4. Copy the signing secret → update `STRIPE_WEBHOOK_SECRET` in Vercel env vars
5. `vercel --prod` to redeploy with the new secret

---

## 6. End-to-End Happy Path (Stripe Test Mode)

1. Open `http://localhost:3000`
2. Click **Get your kit →** — lands on `/checkout`
3. Add optional add-ons if desired; observe live order summary update
4. Click **Pay £xxx →** — redirected to Stripe Checkout
5. Enter card `4242 4242 4242 4242`, any future date, any CVC
6. Complete payment — redirected to `/checkout/success?session_id=cs_test_xxx`
7. Success page shows **Order confirmed!** with receipt details
8. Waitlist auto-enrolment fires and shows "✓ You're on the MeO AI waitlist"
9. Check Terminal 1 logs for `[waitlist]` entry (or your backend)
10. Check Terminal 2 (`stripe listen`) for `checkout.session.completed` event
