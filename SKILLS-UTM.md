# SKILLS-UTM.md — Meterbolic UTM & Affiliate URL Ontology

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
?utm_source=<src>&utm_medium=<med>&utm_campaign=<camp>&utm_content=<cnt>[&utm_term=<term>]
```

Required: `utm_source`, `utm_medium`, `utm_campaign`.
Optional: `utm_content`, `utm_term`.

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

### 7.4 Non-affiliate URL (organic founder LinkedIn post)

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
8. No spaces, no uppercase, no `_`, no PII.

Regex for a fully-formed `/a/` URL:

```
^https://(www\.)?meterbolic\.com/a/[A-Za-z][A-Za-z0-9]{1,11}/(longevity|diabetes|weightloss|metabolic|cognition|performance|women)(/[a-z0-9-]+)?\?utm_source=[a-z0-9]+&utm_medium=(affiliate|email|social-paid|social-organic|search-paid|display|event|referral|direct)&utm_campaign=[a-z]+-\d{4}q[1-4]-[a-z0-9-]+(&utm_content=[a-z0-9-]+)?(&utm_term=[a-z]+)?$
```

---

## 9. Governance

- This file is the **source of truth**. Tooling that mints URLs (email
  templates, ad-manager scripts, the future URL-minting agent) must read this
  registry, not duplicate it.
- Changes to §3, §4, §5, §6.1, §6.3 require a commit that updates this file
  alongside whatever introduced the new term. Reviewers should reject PRs that
  add an unregistered slug.
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
