# Meterbolic UTM & Affiliate URL Ontology

Operating manual for any Meterbolic process (humans, Claude Code orchestrators,
campaign tooling, email templates, ad managers) that **mints, ingests, or
analyses URLs pointing at meterbolic.com**.

The purpose of this document is to make UTM tagging **deterministic**: given a
campaign brief, two different operators (or two different agents) must arrive
at the same `utm_*` values and the same affiliate path. Drift breaks analytics
rollups silently.

Last updated: 2026-05-20.

---

## 1. The two URL surfaces

Meterbolic has **two** URL conventions that carry attribution. They are
complementary, not alternatives — most live URLs will use both.

### 1.1 Affiliate path (server-side identity)

```
https://meterbolic.com/a/<Affiliate>/<Vertical>[/<sub>]
```

- `/a/` — fixed namespace, reserved for affiliate landings. Never used for
  editorial content.
- `<Affiliate>` — PascalCase short brand handle (see §3). The **stable identity**.
- `<Vertical>` — lowercase single-token vertical slug (see §4). The **variable**.
- `<sub>` — optional further sub-route (e.g. `/launch`, `/event`). Use sparingly.

Examples:

```
https://meterbolic.com/a/EoS/longevity
https://meterbolic.com/a/Arup/diabetes
https://meterbolic.com/a/Fiori/weightloss
https://meterbolic.com/a/Arup/diabetes/launch
```

The path is what the affiliate sees, prints on a card, or speaks aloud. It
must remain short, brand-respectful, and unambiguous. The route renders a
landing page personalised to that affiliate × vertical.

### 1.2 UTM query string (client-side analytics)

```
?utm_source=<src>&utm_medium=<med>&utm_campaign=<camp>&utm_content=<cnt>[&utm_term=<term>][&utm_intent=<intent>][&utm_hint=<hint>]
```

Required: `utm_source`, `utm_medium`, `utm_campaign`.
Optional: `utm_content`, `utm_term`, `utm_intent`, `utm_hint`.

`utm_source`/`utm_medium` capture **where the link sits** (FB ad, Instagram
post, email, QR on a slide). `utm_intent` captures **what category the
visitor wants when they land** — a Meter, the AI service, a therapist.
`utm_hint` carries a **finer-grained recommendation to the receiving system**
— a specific product, or a product paired with the affiliate's branded
service — so the landing page can surface the most relevant single offer
instead of the category default. The three axes are orthogonal: the same
Instagram ad creative can run with `utm_intent=meter` & `utm_hint=meter-pro`
for one audience and `utm_intent=therapist` & `utm_hint=therapist-arup` for
another, all without changing the path.

The UTM values must be **derivable from the path** wherever a path exists, so
that the URL and the analytics tag cannot drift. See §6 for the mapping rule.

---

## 2. Hard rules (read before minting any URL)

1. **Lowercase all UTM values.** Google Analytics, Plausible, and most ad
   platforms treat `EoS` and `eos` as distinct dimensions. Path segments stay
   in canonical case (§3); UTMs are always lowercased.
2. **Hyphens, not underscores or spaces.** `q3-launch`, not `q3_launch`,
   `Q3 Launch`, or `q3launch`.
3. **No PII, no emails, no free-form copy** in any UTM. Trackers are public.
4. **Reuse over invention.** Before minting a new affiliate, vertical, or
   campaign slug, check the registries in §3, §4, §5. If a near-fit exists,
   reuse it.
5. **One URL per (affiliate, vertical, campaign, placement).** Don't generate
   multiple URLs for the same placement just because the copy differs — use
   `utm_content` to disambiguate within the same campaign.
6. **The path is canonical; the query is descriptive.** If they disagree
   (e.g. `/a/EoS/longevity` with `utm_source=fiori`) the path wins for routing
   and the URL is malformed for analytics — reject it.

---

## 3. Affiliate slug registry

Affiliate slug = PascalCase short brand handle. Maintained centrally; do not
mint without recording here.

| Slug      | Affiliate / Counterparty       | Notes                              |
| --------- | ------------------------------ | ---------------------------------- |
| `EoS`     | Earth on Stage                 | Capitalisation matches their brand |
| `Arup`    | Arup                           | Engineering / longevity launch     |
| `Fiori`   | Fiori                          | Existing FB campaign already named |

**To add a new affiliate:**
1. Confirm the affiliate's preferred branded capitalisation.
2. Choose a slug ≤ 12 chars, alphanumeric only, recognisable to the partner.
3. Append a row to this table in the same PR/commit that introduces the URL.

The lowercased slug becomes `utm_source`. Example: `EoS` → `utm_source=eos`.

---

## 4. Vertical slug registry

Fixed vocabulary. Do **not** invent ad-hoc verticals; pick from this list or
escalate to extend it.

| Slug          | Meaning                                          |
| ------------- | ------------------------------------------------ |
| `longevity`   | Longevity / healthspan positioning               |
| `diabetes`    | Diabetes / Kraft-test / glycaemic positioning    |
| `weightloss`  | Weight loss / body recomposition                 |
| `metabolic`   | General metabolic health (default if undecided)  |
| `cognition`   | Cognitive performance / brain-health angle       |
| `performance` | Athletic / executive performance angle           |
| `women`       | Women-specific physiology (PCOS, peri/menopause) |

Rationale for the fixed list: campaign analytics are only useful if rollups
across affiliates are possible. Free-form verticals (`weight-loss`,
`weightLoss`, `wt-loss`, `slim`) silently fragment the data.

The same string becomes `utm_term` when the vertical needs to be queryable
independently of campaign (§6.2).

---

## 5. Campaign slug convention

`utm_campaign` carries the **what and when** of the activation. Format:

```
<vertical>-<YYYYqQ>-<theme>
```

- `<vertical>` — from §4. Required.
- `<YYYYqQ>` — calendar quarter, e.g. `2026q3`. Required.
- `<theme>` — 1–3 hyphenated tokens describing the activation
  (`launch`, `webinar`, `event-arup`, `bant-followup`). Required.

Examples:

```
longevity-2026q3-launch
diabetes-2026q3-event-arup
weightloss-2026q4-webinar
metabolic-2026q3-bant-followup
```

Rules:

- The campaign slug is **fixed for the life of the campaign**. Do not edit it
  mid-flight even if the theme evolves — start a new campaign.
- One campaign may span many affiliates and placements; that's why the
  affiliate is in `utm_source`, not `utm_campaign`.
- Quarter is the **start** quarter. A campaign that crosses Q3→Q4 keeps the
  `2026q3` token.

---

## 6. The canonical mapping (path → UTM)

Given an affiliate path
`https://meterbolic.com/a/<Affiliate>/<Vertical>[/<sub>]`
and a campaign theme `<theme>`, the UTM values are:

| Parameter      | Value                                                           |
| -------------- | --------------------------------------------------------------- |
| `utm_source`   | `<Affiliate>` lowercased (e.g. `eos`, `arup`, `fiori`)          |
| `utm_medium`   | The channel category (§6.1). Default `affiliate` for `/a/` URLs.|
| `utm_campaign` | `<Vertical>-<YYYYqQ>-<theme>` per §5                            |
| `utm_content`  | The placement/creative slug (§6.3). Required if known.          |
| `utm_term`     | `<Vertical>` (§4) — optional, useful when source/medium aggregate across verticals |
| `utm_intent`   | The visitor's desired outcome category (§6.4) — optional, drives landing-page CTA selection |
| `utm_hint`     | Specific product or product+affiliate recommendation (§6.5) — optional, finer-grained than `utm_intent` |

### 6.1 `utm_medium` registry

| Value          | When to use                                                |
| -------------- | ---------------------------------------------------------- |
| `affiliate`    | Default for `/a/<Affiliate>/...` URLs                      |
| `email`        | Newsletter / mailing-list / Beehiiv / direct outbound mail |
| `social-paid`  | Paid social (Meta, LinkedIn, X)                            |
| `social-organic` | Organic social (founder posts, brand handle)             |
| `search-paid`  | Google / Bing paid search                                  |
| `display`      | Banner / programmatic display                              |
| `event`        | QR codes, on-stage URLs, live-event handouts               |
| `referral`     | Press, partner blog, podcast show-notes                    |
| `direct`       | Avoid — only when no other category fits                   |

### 6.2 `utm_term` use

Use sparingly. The two legitimate uses:

- **Vertical disambiguation** when `utm_source` aggregates across verticals
  (e.g. an email blast linking to multiple `/a/<Aff>/<Vertical>` pages — each
  link sets `utm_term=<vertical>`).
- **Keyword** for paid search only. Never put copy variants here.

### 6.3 `utm_content` registry

Placement / creative slug. Required for any URL that appears in more than one
location within the same campaign. Use kebab-case tokens drawn from:

| Token           | Meaning                                       |
| --------------- | --------------------------------------------- |
| `hero`          | Above-the-fold CTA                            |
| `footer-cta`    | Footer call-to-action                         |
| `email-1`, `email-2`, … | Position in an email sequence         |
| `nav`           | Top-nav link                                  |
| `card-<n>`      | Card position on a multi-card layout          |
| `qr-print`      | QR code on printed collateral                 |
| `qr-stage`      | QR code shown on stage / slides               |
| `signature`     | Email signature link                          |
| `bio-link`      | Linktree-style bio                            |
| `dm`            | Direct message                                |

Compose tokens with `-` when needed: `email-2-hero`, `card-3-mobile`.

### 6.4 `utm_intent` registry

Optional. Declares **what the visitor wants when they land**, independent of
where the link was placed. The landing page handler reads this to select the
hero CTA and section ordering without changing the path. Fixed vocabulary —
do not invent values ad-hoc.

| Value       | Meaning                                                              |
| ----------- | -------------------------------------------------------------------- |
| `meter`     | Visitor wants the Biological Age Score Meter (device / dashboard)    |
| `ai`        | Visitor wants the AI coach / agentic service                         |
| `therapist` | Visitor wants a human practitioner (coach, therapist, consultation)  |

Reserved for future use (do not mint URLs with these until the corresponding
landing-page behaviour exists):

| Value       | Meaning                                                              |
| ----------- | -------------------------------------------------------------------- |
| `course`    | Educational content / programme                                      |
| `community` | Membership / community / mailing list                                |
| `book`      | Book an appointment / consultation slot                              |
| `pricing`   | Pricing / plans page                                                 |

Rules:

- `utm_intent` is **never** required. Omit it when the link is generic.
- The same `(affiliate, vertical, campaign, placement)` MAY appear with
  different `utm_intent` values — that's the productive case (one ad
  creative, three intent variants pointing at the same landing page).
- The landing page handler must fail soft: an unknown or missing
  `utm_intent` renders the default CTA, never an error.
- To extend the registry, add a row in the same PR/commit that ships the
  landing-page behaviour for the new value. The keyword in `value` must
  remain short, lowercase, and a single token where possible.

### 6.5 `utm_hint` — specific recommendation to the receiver

Optional. Where `utm_intent` is the **category** the visitor wants
(meter / ai / therapist), `utm_hint` is the **specific recommendation** the
landing page should surface — a particular product, or a product paired with
the affiliate's branded service. The receiver treats this as a *hint*, not a
directive: it should prefer the hinted offer when valid, fall back to the
`utm_intent` default when the hint is unknown or inapplicable, and never
error on it.

**Format:** lowercase, kebab-case, matches `^[a-z][a-z0-9]*(-[a-z0-9]+)*$`,
max 40 chars.

**Grammar (recommended, not enforced by regex):**

```
utm_hint = <product-slug>[ - <affiliate-slug-lower> ]
```

- `<product-slug>` — a product or service identifier from the product
  registry below. Use the most specific applicable slug.
- `<affiliate-slug-lower>` — optional, lowercased affiliate slug from §3,
  appended when the hint refers to a product *paired* with the affiliate's
  branded service. Distinguishes "the Meter Pro device" from "the Meter Pro
  packaged with the Arup engineering longevity programme".

**Product slug registry (seed — extend in the same PR as new product copy):**

| Slug              | Refers to                                                       |
| ----------------- | --------------------------------------------------------------- |
| `meter-pro`       | Biological Age Score Meter (paid tier)                          |
| `meter-free`      | Biological Age Score Meter (free tier / lead-magnet)            |
| `ai-coach`        | AI agentic coach service                                        |
| `ai-coach-plus`   | AI coach paired with human-in-the-loop review                   |
| `therapist-1on1` | Booked human practitioner session                                |
| `kraft-test`      | Kraft insulin assay product                                     |

Composed examples:

```
utm_hint=meter-pro
utm_hint=meter-pro-arup            # Meter Pro within Arup programme
utm_hint=ai-coach-eos              # AI coach within EoS partnership
utm_hint=therapist-1on1-fiori      # 1:1 therapist via Fiori channel
```

Rules:

- `utm_hint` is **never** required.
- `utm_hint` SHOULD be consistent with `utm_intent` when both are present:
  a `utm_intent=therapist` URL should not carry `utm_hint=meter-pro`. The
  validator (§8) warns on disagreement but does not reject — the receiver
  has final say.
- Unregistered product slugs MAY appear during product launches; the
  registry must be updated in the same PR as the launch copy. URLs minted
  with un-launched product slugs will not break, but analytics rollups will
  show them as fragments until the registry catches up.
- Do NOT put SKU numbers, pricing tiers, A/B variant labels, or affiliate-IDs
  here. Product slug only, plus optional affiliate slug suffix.

---

## 7. Worked examples

### 7.1 Arup launch event landing page (printed QR on slides)

- Affiliate: Arup
- Vertical: longevity
- Channel: live event, QR shown on stage
- Theme: `event-arup` (Q3 2026)

**URL the QR encodes:**

```
https://meterbolic.com/a/Arup/longevity?utm_source=arup&utm_medium=event&utm_campaign=longevity-2026q3-event-arup&utm_content=qr-stage
```

### 7.2 EoS newsletter, second email in a 3-part sequence, hero CTA

- Affiliate: EoS
- Vertical: weightloss
- Channel: email
- Theme: `bant-followup` (Q3 2026)

```
https://meterbolic.com/a/EoS/weightloss?utm_source=eos&utm_medium=email&utm_campaign=weightloss-2026q3-bant-followup&utm_content=email-2-hero
```

### 7.3 Fiori paid Facebook ad, longevity angle, card-3 creative

- Affiliate: Fiori
- Vertical: longevity
- Channel: paid social
- Theme: `launch` (Q3 2026)

```
https://meterbolic.com/a/Fiori/longevity?utm_source=fiori&utm_medium=social-paid&utm_campaign=longevity-2026q3-launch&utm_content=card-3
```

### 7.4 Same Instagram ad, three intent variants (one creative, three CTAs)

- Affiliate: Arup
- Vertical: longevity
- Channel: paid social (Instagram)
- Theme: `launch` (Q3 2026)
- Placement: hero card

The same ad creative is dropped into three targeting buckets; each gets a
different `utm_intent` so the landing page surfaces the right CTA:

```
https://meterbolic.com/a/Arup/longevity?utm_source=arup&utm_medium=social-paid&utm_campaign=longevity-2026q3-launch&utm_content=ig-hero&utm_intent=meter
https://meterbolic.com/a/Arup/longevity?utm_source=arup&utm_medium=social-paid&utm_campaign=longevity-2026q3-launch&utm_content=ig-hero&utm_intent=ai
https://meterbolic.com/a/Arup/longevity?utm_source=arup&utm_medium=social-paid&utm_campaign=longevity-2026q3-launch&utm_content=ig-hero&utm_intent=therapist
```

Rule of thumb: when `utm_intent` is the only varying axis, keep the rest of
the URL identical so analytics can attribute intent variance cleanly.

### 7.5 Layered intent + hint — recommend a specific Arup-branded product

Same Arup longevity placement, `utm_intent=meter` (category), `utm_hint`
narrows to a specific Arup-paired product:

```
https://meterbolic.com/a/Arup/longevity?utm_source=arup&utm_medium=social-paid&utm_campaign=longevity-2026q3-launch&utm_content=ig-hero&utm_intent=meter&utm_hint=meter-pro-arup
```

The landing page reads `utm_intent` for the section layout and `utm_hint`
for which specific product card to feature above the fold. If a future
campaign decides to push the AI coach paired with Arup, only the last two
params change:

```
…&utm_intent=ai&utm_hint=ai-coach-arup
```

### 7.5 Non-affiliate URL (organic founder LinkedIn post)

No `/a/` path → no affiliate.

```
https://meterbolic.com/?utm_source=linkedin&utm_medium=social-organic&utm_campaign=metabolic-2026q3-founder-post&utm_content=signature
```

`utm_source` here is the **platform** (`linkedin`), because there is no
affiliate. This is the only context in which `utm_source` is a platform name.

---

## 8. Validation checklist (use before publishing any URL)

A minted URL is valid iff:

1. The host is `meterbolic.com` (or `www.meterbolic.com`) — never staging,
   never an IP.
2. If the path begins with `/a/`, the affiliate slug is in §3 **and** the
   vertical slug is in §4.
3. `utm_source`, `utm_medium`, `utm_campaign` are all present and lowercase.
4. `utm_source` equals the lowercased affiliate slug **iff** the path is `/a/…`.
   Otherwise `utm_source` is a platform name from §6.1's medium choice
   (`linkedin`, `twitter`, `meta`, `google`, etc.).
5. `utm_medium` is in the registry in §6.1.
6. `utm_campaign` matches `^[a-z]+-\d{4}q[1-4]-[a-z0-9-]+$`.
7. `utm_content` (if present) uses only tokens from §6.3.
8. `utm_intent` (if present) is a value listed in §6.4 (active rows only —
   reserved values are not yet valid).
9. `utm_hint` (if present) matches `^[a-z][a-z0-9]*(-[a-z0-9]+)*$`, is at
   most 40 chars, and SHOULD start with a slug from the §6.5 product
   registry. The validator emits a **warning** (not an error) when the slug
   is unrecognised or when `utm_hint` and `utm_intent` disagree (e.g.
   `intent=therapist` & `hint=meter-pro`).
10. No spaces, no uppercase, no `_`, no PII.

Regex for a fully-formed `/a/` URL:

```
^https://(www\.)?meterbolic\.com/a/[A-Za-z][A-Za-z0-9]{1,11}/(longevity|diabetes|weightloss|metabolic|cognition|performance|women)(/[a-z0-9-]+)?\?utm_source=[a-z0-9]+&utm_medium=(affiliate|email|social-paid|social-organic|search-paid|display|event|referral|direct)&utm_campaign=[a-z]+-\d{4}q[1-4]-[a-z0-9-]+(&utm_content=[a-z0-9-]+)?(&utm_term=[a-z]+)?(&utm_intent=(meter|ai|therapist))?(&utm_hint=[a-z][a-z0-9]*(-[a-z0-9]+){0,7})?$
```

Parameter order in the regex is canonical: `source`, `medium`, `campaign`,
`content`, `term`, `intent`, `hint`. Generators should emit in this order
to keep URLs string-comparable across runs.

---

## 9. Governance

- This file is the **source of truth**. Tooling that mints URLs (email
  templates, ad-manager scripts, the future URL-minting agent) must read this
  registry, not duplicate it.
- Changes to §3, §4, §5, §6.1, §6.3, §6.4, §6.5 require a commit that updates
  this file alongside whatever introduced the new term. Reviewers should
  reject PRs that add an unregistered slug.
- New `utm_intent` values must ship in the same PR as the landing-page
  behaviour they unlock; otherwise the value reaches analytics but the user
  experience does not change, which silently breaks the contract that
  `utm_intent` *means* something at the destination.
- New `utm_hint` product slugs MAY land slightly ahead of the landing-page
  behaviour (because `hint` is by definition advisory and the receiver falls
  back to the `utm_intent` default), but the registry must catch up within
  the same calendar week — otherwise analytics rollups carry untyped slugs
  that no one can interpret three months later.
- Audit cadence: at every quarter boundary, run a report listing distinct
  `utm_*` values seen in the analytics pipeline against this file. Anything in
  the analytics that isn't here is drift — fix the source, then backfill the
  registry only if the value is legitimate.

---

## 10. Open follow-ups (not in scope of this document)

1. **Route handler** `src/app/a/[affiliate]/[vertical]/page.tsx` on the
   product-landing-page repo — currently no such route exists; affiliate URLs
   404. Adding this is a separate engineering task.
2. **URL-minting helper** — a small CLI / library function that takes
   `(affiliate, vertical, channel, theme, placement)` and returns a validated
   URL per this spec. Lives alongside the website repo; not yet written.
3. **Analytics dashboards** — once URLs are flowing, build rollups by
   `utm_source` (affiliate performance), by `utm_campaign` (activation
   performance), and by `utm_term` (vertical performance across affiliates).

---

## 11. Related documents

- `SKILLS.md` (this directory) — operational manual for shipping changes to
  meterbolic.com.
- Google Doc: *Fiori Meterbolic Facebook Campaign* — early campaign precedent
  whose slug `fiori` was the first affiliate entry in §3.
- Google Doc: *Launch Event BANT Arup* — source of the `event-arup` campaign
  theme and the Arup affiliate slug.
