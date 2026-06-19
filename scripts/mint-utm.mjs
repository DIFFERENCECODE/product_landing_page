#!/usr/bin/env node
// ─────────────────────────────────────────────────────────────────────
// mint-utm.mjs — operator CLI to mint + validate a meterbolic.com
// affiliate URL per docs/utm.md (§3, §4, §6, §8).
//
// Canonical mint/validate logic lives in src/lib/affiliates.ts (used by
// the website at runtime). This standalone CLI mirrors it for humans and
// campaign tooling that can't import the Next bundle. Keep the registries
// below in lock-step with docs/utm.md §3/§4.
//
// Usage:
//   node scripts/mint-utm.mjs --affiliate EoS --vertical longevity \
//     --theme launch --quarter 2026q3 --content hero [--medium affiliate] \
//     [--intent meter] [--hint meter-pro-eos]
//
// Exits non-zero if the affiliate/vertical is unregistered or the minted
// URL fails §8 validation (the ticket's "stop and ask" failure mode).
// ─────────────────────────────────────────────────────────────────────

const AFFILIATES = { eos: 'EoS', arup: 'Arup', fiori: 'Fiori' }; // docs/utm.md §3 (lowercased key → canonical slug)
const VERTICALS = ['longevity', 'diabetes', 'weightloss', 'metabolic', 'cognition', 'performance', 'women']; // §4
const MEDIUMS = ['affiliate', 'email', 'social-paid', 'social-organic', 'search-paid', 'display', 'event', 'referral', 'direct']; // §6.1
const INTENTS = ['meter', 'ai', 'therapist']; // §6.4 active
const HINT_SEED = ['meter-pro', 'meter-free', 'ai-coach', 'ai-coach-plus', 'therapist-1on1', 'kraft-test']; // §6.5

const AFFILIATE_URL_REGEX =
  /^https:\/\/(www\.)?meterbolic\.com\/a\/[A-Za-z][A-Za-z0-9]{1,11}\/(longevity|diabetes|weightloss|metabolic|cognition|performance|women)(\/[a-z0-9-]+)?\?utm_source=[a-z0-9]+&utm_medium=(affiliate|email|social-paid|social-organic|search-paid|display|event|referral|direct)&utm_campaign=[a-z]+-\d{4}q[1-4]-[a-z0-9-]+(&utm_content=[a-z0-9-]+)?(&utm_term=[a-z]+)?(&utm_intent=(meter|ai|therapist))?(&utm_hint=[a-z][a-z0-9]*(-[a-z0-9]+){0,7})?$/;

function parseArgs(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i += 2) {
    const k = argv[i]?.replace(/^--/, '');
    if (k) out[k] = argv[i + 1];
  }
  return out;
}

function mint(o) {
  const slug = AFFILIATES[String(o.affiliate).toLowerCase()];
  if (!slug) {
    console.error(`ERROR: affiliate "${o.affiliate}" not in registry (docs/utm.md §3).`);
    console.error('Stop — add it via the registry-PR process before minting. Do NOT guess a slug.');
    process.exit(2);
  }
  if (!VERTICALS.includes(o.vertical)) {
    console.error(`ERROR: vertical "${o.vertical}" not in registry (docs/utm.md §4). Pick one of: ${VERTICALS.join(', ')}`);
    process.exit(2);
  }
  const medium = o.medium ?? 'affiliate';
  const qs = [
    `utm_source=${slug.toLowerCase()}`,
    `utm_medium=${medium}`,
    `utm_campaign=${o.vertical}-${o.quarter}-${o.theme}`,
  ];
  if (o.content) qs.push(`utm_content=${o.content}`);
  if (o.term) qs.push(`utm_term=${o.term}`);
  if (o.intent) qs.push(`utm_intent=${o.intent}`);
  if (o.hint) qs.push(`utm_hint=${o.hint}`);
  return { url: `https://meterbolic.com/a/${slug}/${o.vertical}?${qs.join('&')}`, medium };
}

function validate(url) {
  const errors = [], warnings = [];
  const u = new URL(url);
  if (!/^(www\.)?meterbolic\.com$/.test(u.hostname)) errors.push(`host must be meterbolic.com (got ${u.hostname})`);
  const p = u.searchParams;
  const medium = p.get('utm_medium'), campaign = p.get('utm_campaign'), intent = p.get('utm_intent'), hint = p.get('utm_hint');
  for (const k of ['utm_source', 'utm_medium', 'utm_campaign']) {
    const v = p.get(k);
    if (!v) errors.push(`${k} required`);
    else if (v !== v.toLowerCase()) errors.push(`${k} must be lowercase`);
  }
  if (medium && !MEDIUMS.includes(medium)) errors.push(`utm_medium "${medium}" not in registry (§6.1)`);
  if (campaign && !/^[a-z]+-\d{4}q[1-4]-[a-z0-9-]+$/.test(campaign)) errors.push(`utm_campaign "${campaign}" malformed (§5)`);
  if (intent && !INTENTS.includes(intent)) errors.push(`utm_intent "${intent}" not active (§6.4)`);
  if (hint) {
    if (!/^[a-z][a-z0-9]*(-[a-z0-9]+)*$/.test(hint) || hint.length > 40) errors.push(`utm_hint "${hint}" malformed (§6.5)`);
    else if (!HINT_SEED.some((s) => hint === s || hint.startsWith(s + '-'))) warnings.push(`utm_hint "${hint}" not in seed registry (advisory)`);
  }
  if (errors.length === 0 && !AFFILIATE_URL_REGEX.test(url)) warnings.push('URL does not match the §8 canonical regex (check param order)');
  return { valid: errors.length === 0, errors, warnings };
}

const args = parseArgs(process.argv.slice(2));
if (!args.affiliate || !args.vertical || !args.theme || !args.quarter) {
  console.error('Usage: node scripts/mint-utm.mjs --affiliate EoS --vertical longevity --theme launch --quarter 2026q3 --content hero [--medium affiliate] [--intent meter] [--hint meter-pro-eos]');
  process.exit(1);
}
const { url } = mint(args);
const res = validate(url);
console.log(url);
for (const w of res.warnings) console.warn(`WARN: ${w}`);
if (!res.valid) {
  for (const e of res.errors) console.error(`ERROR: ${e}`);
  process.exit(3);
}
console.error('OK: valid per docs/utm.md §8');
