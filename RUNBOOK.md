# Meo — Runbook

The Meo Metabolic Intelligence System landing page / checkout.

See also:
- `FUNNEL.md` — marketing copy (hooks, ads, emails, VSL, creative, compliance)
- `STRIPE_SETUP.md` — one-shot product creation in Stripe
- `scripts/setup-stripe-meo.sh` — the actual script

---

## 1. Local setup

```bash
git clone https://github.com/DIFFERENCECODE/product_landing_page.git
cd product_landing_page
npm install

# env setup
cp .env.local.example .env.local
# then edit .env.local — see section 2.

# run
npm run dev
# → http://localhost:3000
```

---

## 2. Populate env (Stripe)

One-shot: create all Meo products + prices in your Stripe account and
get the env block printed out ready to paste.

```bash
export STRIPE_SK="sk_test_..."    # or sk_live_...
bash scripts/setup-stripe-meo.sh
```

The script prints 6 `NEXT_PUBLIC_*_PRICE_ID` lines — paste them into
`.env.local`. Also set:

```
STRIPE_SECRET_KEY=sk_..._same_as_STRIPE_SK_above
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

For local webhook testing:
```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
# copy the whsec_ it prints into STRIPE_WEBHOOK_SECRET.
```

Test cards: `4242 4242 4242 4242` success · `4000 0000 0000 0002` decline.

---

## 3. End-to-end happy path

1. `http://localhost:3000` — Meo landing
2. "Get your Meo Starter System →" — navigates to `/checkout`
3. Review order, add upsells if desired, click "Pay £xxx →"
4. Redirected to Stripe Checkout → enter test card → complete
5. Redirected to `/checkout/success?session_id=cs_test_...`
6. Success page shows "Order confirmed!" + receipt
7. Webhook fires → server-side log `[stripe-webhook] ... completed`
8. Waitlist auto-enrol runs (stub logs locally, or forwards to `WAITLIST_WEBHOOK_URL`)

---

## 4. Deploying to AWS (EC2 + Caddy)

Target host: `api.meterbolic.org` (or any EC2 with an nginx/Caddy front)

### 4.1. Build + package locally

```bash
npm run build         # produces .next/
tar -czf /tmp/meo-landing.tgz \
  --exclude=node_modules \
  --exclude=.git \
  --exclude=.env.local \
  .
```

### 4.2. Upload + extract on server

```bash
scp /tmp/meo-landing.tgz ubuntu@api.meterbolic.org:/tmp/
ssh ubuntu@api.meterbolic.org "
  sudo mkdir -p /srv/meo-landing
  sudo tar -xzf /tmp/meo-landing.tgz -C /srv/meo-landing
  cd /srv/meo-landing && sudo npm ci --omit=dev
"
```

### 4.3. Set production env

```bash
ssh ubuntu@api.meterbolic.org
sudo nano /srv/meo-landing/.env.local
# paste all env vars (STRIPE_SECRET_KEY, price IDs, NEXT_PUBLIC_BASE_URL, ...)
```

### 4.4. systemd unit

`/etc/systemd/system/meo-landing.service`:
```ini
[Unit]
Description=Meo landing page (Next.js)
After=network.target

[Service]
Type=simple
User=ubuntu
WorkingDirectory=/srv/meo-landing
EnvironmentFile=/srv/meo-landing/.env.local
ExecStart=/usr/bin/node /srv/meo-landing/node_modules/next/dist/bin/next start -p 3100
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now meo-landing
sudo systemctl status meo-landing
```

### 4.5. Caddy reverse proxy

Add to `/etc/caddy/Caddyfile`:
```
meo.meterbolic.com {
  reverse_proxy localhost:3100
}
```

```bash
sudo systemctl reload caddy
```

### 4.6. Webhook in Stripe Dashboard

Stripe Dashboard → Developers → Webhooks → Add endpoint
- URL: `https://meo.meterbolic.com/api/webhooks/stripe`
- Events: `checkout.session.completed`
- Copy the signing secret → update `STRIPE_WEBHOOK_SECRET` on the server → restart:
  ```bash
  sudo systemctl restart meo-landing
  ```

---

## 5. Deploying to AWS Amplify (alternative)

Amplify hosts Next.js natively with zero ops. More expensive at scale.

```bash
# Install Amplify CLI if you don't have it
npm i -g @aws-amplify/cli

# In the repo:
amplify init
amplify add hosting      # choose "Amplify Hosting"
amplify publish

# Then add env vars via the Amplify console:
#   Amplify Console → App → Environment variables
#   (add STRIPE_SECRET_KEY, all NEXT_PUBLIC_*_PRICE_ID, etc.)
```

---

## 6. Rollback

If a deploy breaks production, the fastest rollback:

```bash
# On server:
cd /srv/meo-landing
sudo tar -xzf /tmp/meo-landing-previous.tgz .    # keep previous tarballs
sudo systemctl restart meo-landing
```

In Stripe: a bad checkout flow doesn't charge cards until payment is submitted, so the only live risk is the webhook failing to fire. Re-queue via Stripe Dashboard → Webhooks → Recent deliveries → Retry.
