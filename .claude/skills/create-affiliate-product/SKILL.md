---
name: create-affiliate-product
description: Produce a new Meterbolic Affiliate Product — a partner-branded tiered offering that wraps the standard Meterbolic measurement device + MeO subscription with a therapeutic, coaching, or practitioner-led layer supplied by the affiliate (Arup, EoS, Fiori, …). Use when the user asks to "launch an affiliate", "create a partner product", "spin up a new affiliate page", "package the Meter + MeO with [partner]", "add a coached/therapy SKU for [partner]", or otherwise needs the full bundle (registries, Stripe price IDs, page tiers, checkout wiring, canonical URLs) to ship a partner offer. Coordinates with the UTM ontology (skills/utm) and the website pipeline (root SKILLS.md).
---

# create-affiliate-product

## Quick start

A Meterbolic Affiliate Product is **always** the standard bundle plus a partner-supplied layer:

- Standard core: Lab-grade Meter device + 6mo MeO AI subscription + Biological Age Score
- Partner layer: therapeutic service, coaching, clinical practitioner access, content, or community
- Shape: 3 tiers mirroring the canonical `Lite / Starter / Coached` shape in `src/app/page.tsx::TIERS` — partner overrides per-tier copy, features, and price, never removes the Meter+MeO core.

Working tree lives **on engine** (`ssh engine`, `~/apps/product-landing-page`) — never edit on the laptop. Follow root `SKILLS.md` for the standard change loop.

## Workflows

### 1. Specify the affiliate product (interview first, write nothing)

Pin down with the user:

- **Affiliate slug** (PascalCase, ≤12 chars) — must match or extend §3 of `docs/utm.md`.
- **Vertical** — one of `longevity | diabetes | weightloss | metabolic | cognition | performance | women` (UTM §4).
- **Partner layer kind** — `therapy | coaching | practitioner | content | community` (drives which Stripe addon price IDs apply; the existing `NEXT_PUBLIC_ADDON_THERAPY_PRICE_ID` is the precedent).
- **Per-tier deltas vs canonical TIERS** — what does Lite/Starter/Coached *gain* from the partner? Are tier names rebranded? Are prices uplifted?
- **Launch quarter** + theme (`<vertical>-<YYYYqQ>-<theme>` per UTM §5).

### 2. Update the registries (UTM is canonical source)

In the same PR/commit that ships the page:

1. `docs/utm.md` §3 — add the affiliate slug row if new.
2. `docs/utm.md` §6.5 — add product slug(s) for the new SKUs, format `<partner-layer>-<affiliate-lower>` (e.g. `therapy-arup`, `coach-eos`). Mark active vs reserved.
3. `docs/utm.md` §8 — extend the regex if a new `utm_intent` value is required.

### 3. Wire Stripe (price IDs first, never inline pence)

1. For each new tier, an existing Stripe price ID is reused or a new one is minted in the Stripe dashboard by ops.
2. Add the env keys to `.env.local` on engine — naming pattern: `NEXT_PUBLIC_AFFILIATE_<AFF>_<TIER>_PRICE_ID`. Never commit `.env.local`.
3. The new env keys must also be added to the deploy pipeline's allowed-vars list if one exists; check Actions secrets.

### 4. Build the page surface

Two viable surface shapes — pick once, document the choice:

- **A. Reuse `/` with a query param** (`?affiliate=arup`) — modifies `TIERS` per affiliate at render time. Lowest blast radius, no new route.
- **B. New route `src/app/a/[affiliate]/[vertical]/page.tsx`** — bespoke landing per affiliate × vertical. Required eventually (see UTM §10.1 open item); currently the route does **not** exist and `/a/...` URLs 404.

For Affiliate Products, prefer **B** when the partner brand requires distinct copy/imagery; **A** when the partner is happy with a query-string overlay.

Implementation notes specific to this codebase:

- Tier shape: keep `Tier = { id; name; price; blurb; features; cta; href; popular? }` from `page.tsx:130`. Do not change the type — TS narrowing on `as const` arrays has bitten the deploy before (root SKILLS.md §5.1).
- Checkout `href` points at `/checkout?plan=<tier-id>&affiliate=<slug>` — `/api/kit-checkout` and `/api/meo-stripe/checkout` read these params and resolve to the right Stripe price IDs.
- The MeO subscription is **mandatory** in every tier — never produce a tier that includes the Meter without MeO, or MeO without the Meter, except for the canonical `lite` ebook-only entry tier.

### 5. Mint the canonical marketing URLs

Use the UTM ontology — do **not** restate it. For each placement the partner needs (email, paid social, event QR, etc.), produce one URL per `(affiliate, vertical, campaign, placement, intent, hint)` tuple. Validate against the regex in `docs/utm.md` §8 before delivery. Hand the URL set to the partner with a one-line README mapping placement → URL.

### 6. Ship & verify

Follow root `SKILLS.md` §3 to the letter — build on engine, `pm2 reload meo-landing --update-env`, smoke-test, then commit and push. Verify:

- Affiliate page returns 200 at both the legacy `/?affiliate=<slug>` and the `/a/<Affiliate>/<vertical>` route (if (B) was chosen).
- Stripe Checkout opens with the correct price + price ID.
- A test `utm_*` URL resolves to the intended tier and CTA per `utm_intent` / `utm_hint`.

## Failure modes

- **Skipping the Meter+MeO core** in any tier — breaks the brand promise. Tiers without the standard core are *not* Affiliate Products; route them through a different SKU class.
- **Hard-coding the affiliate slug** anywhere except `docs/utm.md` §3 — fragments the registry and silently breaks analytics rollups.
- **Inlining Stripe pence values** instead of price IDs — pricing changes will require code edits, not dashboard edits. Always use env-resolved price IDs.
- **Adding to `TIERS` without the readonly type** — fails TS build silently in Actions (root SKILLS.md §5.1).
- **Minting URLs without consulting `docs/utm.md`** — produces inconsistent UTM tags. The UTM skill is the source of truth; this skill defers to it.

## References

- `docs/utm.md` — canonical UTM ontology, affiliate slug registry, product slug registry.
- Root `SKILLS.md` — engine SSH workflow, build/reload commands, deploy pipeline gotchas, secrets policy.
- `src/app/page.tsx::TIERS` (engine) — canonical tier shape and pricing precedent.
- `src/app/api/kit-checkout/route.ts` and `src/app/api/meo-stripe/checkout/` — checkout wiring patterns to extend, not replace.
- UTM §10 open follow-ups — `/a/[affiliate]/[vertical]` route and URL-minting helper are still unbuilt at time of writing.
