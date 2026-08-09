// ═══════════════════════════════════════════════════════════════════
// affiliates.ts — affiliate + vertical registries, tier sets, and the
// UTM mint/validate routine.
//
// Single source of truth in code; mirrors docs/utm.md §3 (affiliate
// registry), §4 (verticals), §6 (path→UTM mapping) and §8 (validation
// regex). Keep this file in lock-step with docs/utm.md — if you add an
// affiliate or vertical here, add the row there in the same commit.
// ═══════════════════════════════════════════════════════════════════

import {
  EOS_ENTRY_PROGRAMME,
  EOS_PROGRAMMES,
  EOS_PROGRAMME_URL,
  formatProgrammePrice,
  programmeEnquiryMailto,
  type Programme,
} from '@/lib/programmes';

export interface Practitioner {
  name: string;
  role: string;
  bio: string;
  quote?: string;
  photo: string;
}

export interface AffiliateEntry {
  /** Canonical PascalCase slug as it appears in the path (docs/utm.md §3). */
  slug: string;
  /** Full counterparty name. */
  name: string;
  /** Optional brand logo served from /public. */
  logo?: string;
  practitioner?: Practitioner;
  /** Vertical used when the URL carries no explicit vertical segment. */
  defaultVertical: string;
}

// docs/utm.md §3 — affiliate slug registry. Keys are the canonical
// PascalCase slugs; lookup is case-insensitive (see getAffiliate).
export const AFFILIATES: Record<string, AffiliateEntry> = {
  // Naming rule (standing): the company is written exactly "EoS". The
  // expanded form "Earth on Stage" is RETIRED and must not reappear in
  // copy, metadata, alt text, page titles or assets.
  EoS: {
    slug: 'EoS',
    // Written exactly "EoS". The expanded form "Earth on Stage" is
    // RETIRED and must not appear in user-facing copy, metadata, alt
    // text or page titles — this field renders directly into the /a/EoS
    // hero, page title and the "IN PARTNERSHIP WITH" band.
    name: 'EoS',
    logo: '/eos-logo.svg',
    practitioner: {
      name: 'Dr Arup Sen',
      role: 'Founder, EoS Longevity · MRCP · Consultant Physician',
      bio: 'A leading voice in metabolic health and longevity medicine, partnering with Meterbolic to bring personalised metabolic intelligence to the EoS community.',
      quote:
        'Longevity is not simply about living longer — it is about preserving vitality, independence, and quality of life for as long as possible.',
      photo: '/coach-arup-sen.jpg',
    },
    defaultVertical: 'longevity',
  },
  Arup: {
    slug: 'Arup',
    name: 'Arup',
    defaultVertical: 'longevity',
  },
  Fiori: {
    slug: 'Fiori',
    name: 'Fiori',
    defaultVertical: 'weightloss',
  },
};

// Case-insensitive lookup so /a/eos, /a/EoS and ?utm_source=eos all
// resolve to the same registry entry.
export function getAffiliate(slug: string | undefined | null): AffiliateEntry | undefined {
  if (!slug) return undefined;
  const want = slug.toLowerCase();
  return Object.values(AFFILIATES).find((a) => a.slug.toLowerCase() === want);
}

// docs/utm.md §4 — fixed vertical vocabulary.
export const VERTICALS: Record<string, string> = {
  longevity: 'Longevity / healthspan',
  diabetes: 'Diabetes / glycaemic',
  weightloss: 'Weight loss / body recomposition',
  metabolic: 'General metabolic health',
  cognition: 'Cognitive performance',
  performance: 'Athletic / executive performance',
  women: 'Women-specific physiology',
};

export function isValidVertical(v: string): boolean {
  return v in VERTICALS;
}

// ─────────────────────────────────────────────────────────────────────
// Tier sets — AFFILIATE-SCOPED. Read this before changing anything here.
//
// These used to be one global `AFFILIATE_TIERS` array rendered for every
// affiliate. That is safe only while every affiliate sells exactly the
// same thing, and it stopped being true the moment EoS got its own
// programmes: a global array would have put Dr Arup Sen's £850/£1,450
// coaching on Fiori's page — a different company, a different principal.
// That breaks funnel isolation, so the tier set is now resolved PER
// AFFILIATE via getAffiliateOffer():
//
//   • EoS   → BASIC £49 · MOST POPULAR £149 · Metabolic Optimisation
//             £850 · Metabolic Continuum £1,450. The two programmes are
//             read from lib/programmes.ts — the same file /eos renders
//             from, so the two pages can never quote different prices.
//             CONCIERGE (£299, an unattributed generic coach) and
//             CORPORATE are deliberately ABSENT: inside an affiliate
//             funnel they compete with the affiliate's own offer.
//   • every other affiliate → GENERIC_AFFILIATE_TIERS, the Meterbolic-
//             only ladder. Adding an affiliate does NOT give it someone
//             else's products; it has to opt in by registering its own
//             set below.
// ─────────────────────────────────────────────────────────────────────
export interface Tier {
  id: string;
  name: string;
  badge?: string;
  price: string;
  priceNote?: string;
  blurb: string;
  features: readonly string[];
  cta: string;
  href: string;
  popular?: boolean;
}

// The two Meterbolic-own tiers. Every affiliate ladder starts with
// these — they are Meterbolic product, so they carry no attribution
// problem — and then appends whatever that affiliate itself supplies.
const METERBOLIC_CORE_TIERS: readonly Tier[] = [
  {
    id: 'basic',
    name: 'BASIC',
    price: '£49',
    blurb: 'Essential at-home metabolic monitoring to get started.',
    features: [
      'Digital Lipid Meter + 10 strips',
      '1 month of Meo AI access',
      'Biological Age Score',
      'PDF reading report',
    ],
    cta: 'Get started',
    href: '/checkout?plan=basic',
  },
  {
    id: 'popular',
    name: 'MOST POPULAR',
    badge: 'Most popular',
    price: '£149',
    blurb: 'The complete metabolic intelligence system, for six months.',
    features: [
      'Everything in Basic',
      '6 months of Meo AI access',
      'The Thin Book of Fat (eBook)',
      'Free retest at six months',
      'Target Score + trend tracking',
      '30-day money-back guarantee',
    ],
    cta: 'Choose plan',
    href: '/checkout',
    popular: true,
  },
];

// Unattributed / generic-affiliate ladder. CONCIERGE is a generic,
// unattributed "human coaching" tier — it must NOT appear inside an
// affiliate funnel that has its own named practitioner.
const GENERIC_ONLY_TIERS: readonly Tier[] = [
  {
    id: 'concierge',
    name: 'CONCIERGE',
    price: '£299',
    blurb: 'AI intelligence paired with human coaching.',
    features: [
      'Everything in Most Popular',
      '3× practitioner consultations',
      'Personalised nutrition plan',
      'Priority AI support',
      'Quarterly progress review',
    ],
    cta: 'Choose plan',
    href: '/checkout?plan=concierge',
  },
  {
    id: 'corporate',
    name: 'CORPORATE',
    price: 'Custom',
    blurb: 'Team metabolic-health programmes for organisations.',
    features: [
      'Everything in Concierge',
      'Bulk device pricing',
      'Admin dashboard',
      'Anonymised team analytics',
      'Dedicated account manager',
      'Custom onboarding',
    ],
    cta: 'Contact us',
    href: '/partners',
  },
];

/**
 * The generic Meterbolic ladder — BASIC / MOST POPULAR / CONCIERGE /
 * CORPORATE. Used for unattributed traffic and for any affiliate that
 * has not registered a bespoke offer.
 */
export const GENERIC_AFFILIATE_TIERS: readonly Tier[] = [
  ...METERBOLIC_CORE_TIERS,
  ...GENERIC_ONLY_TIERS,
];

/**
 * Render an EoS programme (lib/programmes.ts — the price SSOT) as a
 * tier card in the affiliate ladder. The £850/£1,450 figures are read,
 * never retyped, so /eos and /a/EoS cannot drift apart.
 *
 * The CTA points at /coaching#pricing rather than /checkout: the
 * programmes are sold by enquiry to eos@meterbolic.com, and /coaching
 * is the canonical page for them. It also keeps the visitor inside the
 * EoS funnel.
 */
function programmeToTier(p: Programme): Tier {
  return {
    id: p.id,
    name: p.name,
    price: formatProgrammePrice(p),
    priceNote: 'introductory',
    blurb: p.tagline,
    features: p.highlights,
    cta: 'See the programme',
    href: `${EOS_PROGRAMME_URL}#pricing`,
  };
}

export interface AffiliateOffer {
  tiers: readonly Tier[];
  /** Small print under the tier heading. Omitted when prices are firm. */
  pricingNote?: string;
}

// Bespoke, affiliate-scoped offers. Keyed by LOWERCASED slug so lookup
// matches getAffiliate()'s case-insensitivity. An affiliate absent from
// this map gets the generic ladder — it does not inherit anyone else's
// products.
const AFFILIATE_OFFERS: Record<string, AffiliateOffer> = {
  eos: {
    tiers: [...METERBOLIC_CORE_TIERS, ...EOS_PROGRAMMES.map(programmeToTier)],
    // No "indicative pricing" caveat: the programme prices are live
    // introductory prices, and /eos states them as such.
  },
};

/**
 * Resolve the tier ladder for an affiliate slug. Falls back to the
 * generic Meterbolic set — this is the funnel-isolation guarantee:
 * an affiliate only ever sells Meterbolic product plus its OWN offer.
 */
export function getAffiliateOffer(slug: string | undefined | null): AffiliateOffer {
  const key = slug?.toLowerCase() ?? '';
  return (
    AFFILIATE_OFFERS[key] ?? {
      tiers: GENERIC_AFFILIATE_TIERS,
      pricingNote:
        'Indicative pricing — final tiers and prices to be confirmed by MB Commercial.',
    }
  );
}

// ─────────────────────────────────────────────────────────────────────
// Coach offers — AFFILIATE-SCOPED, same discipline as the tier ladder.
//
// "Meo Coached" IS an affiliate's entry coaching programme. WHO delivers
// it is not a global fact — it is supplied by an affiliate's principal.
// A single global coach constant is the same funnel-isolation bug
// getAffiliateOffer() fixed for tiers: it was selling EoS's Dr Arup Sen
// to Fiori-attributed visitors at the payment step.
//
//   • no affiliate (the unattributed consumer funnel: /, /pricing,
//     /checkout) → DEFAULT_COACH_OFFER, currently EoS. That is a
//     commercial fact, not a fallback: "Meo Coached" IS the EoS entry
//     programme.
//   • an affiliate that supplies a coach → that affiliate's principal.
//   • an affiliate that supplies none (Fiori, Arup) → undefined, and
//     every coaching surface must then render NOTHING. No substitute,
//     no generic coach.
//
// Identity is READ from AFFILIATES[…].practitioner — the name, the
// credential and the photo are never restated here. The offer itself is
// READ from lib/programmes.ts — the price, the sessions and the bullets
// are never restated here either. That is what keeps one price and one
// credential spelling across the whole site.
// ─────────────────────────────────────────────────────────────────────
export interface AffiliateCoachOffer {
  affiliateSlug: string;
  affiliateName: string;
  /** SSOT for name / credential (`role`) / photo. Never restate these. */
  practitioner: Practitioner;
  /**
   * The entry programme this coach delivers — the offer behind "Meo
   * Coached". SSOT for its price, duration, tagline and bullets.
   */
  programme: Programme;
  /** Order-summary label, e.g. "Metabolic Optimisation — Dr Arup Sen (EoS)". */
  label: string;
  /** Canonical page for this affiliate's full programme ladder. */
  programmesHref: string;
  /** `mailto:` that sells the entry programme, subject pre-filled. */
  enquiryHref: string;
}

function buildCoachOffer(
  slug: string,
  programme: Programme,
  programmesHref: string,
): AffiliateCoachOffer | undefined {
  const entry = AFFILIATES[slug];
  if (!entry?.practitioner) return undefined;
  return {
    affiliateSlug: entry.slug,
    affiliateName: entry.name,
    practitioner: entry.practitioner,
    programme,
    label: `${programme.name} — ${entry.practitioner.name} (${entry.name})`,
    programmesHref,
    enquiryHref: programmeEnquiryMailto(programme),
  };
}

// Keyed by LOWERCASED slug. An affiliate absent from this map supplies
// no coaching layer — that is the default, and it is why there is no
// `slug === 'Fiori'` check anywhere.
const AFFILIATE_COACH_OFFERS: Record<string, AffiliateCoachOffer | undefined> = {
  eos: buildCoachOffer('EoS', EOS_ENTRY_PROGRAMME, EOS_PROGRAMME_URL),
};

/** The coach sold on the unattributed consumer funnel. */
export const DEFAULT_COACH_OFFER = AFFILIATE_COACH_OFFERS.eos;

/**
 * Resolve who — if anyone — delivers coaching for this visitor.
 * Returns undefined for an affiliate that supplies no coach, and every
 * caller MUST then render no coaching surface at all.
 */
export function getAffiliateCoachOffer(
  slug: string | undefined | null,
): AffiliateCoachOffer | undefined {
  if (!slug) return DEFAULT_COACH_OFFER;
  return AFFILIATE_COACH_OFFERS[slug.toLowerCase()];
}

// ═══════════════════════════════════════════════════════════════════
// UTM mint / parse / validate — docs/utm.md §6 and §8.
// ═══════════════════════════════════════════════════════════════════

export interface UTMParams {
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  utm_content?: string;
  utm_term?: string;
  utm_intent?: string;
  utm_hint?: string;
}

// docs/utm.md §6.1
export const VALID_MEDIUMS = [
  'affiliate', 'email', 'social-paid', 'social-organic',
  'search-paid', 'display', 'event', 'referral', 'direct',
] as const;

// docs/utm.md §6.4 — active intents only (reserved values not yet valid).
export const VALID_INTENTS = ['meter', 'ai', 'therapist'] as const;
export type UTMIntent = typeof VALID_INTENTS[number];

// docs/utm.md §8 — canonical regex for a fully-formed /a/ URL.
export const AFFILIATE_URL_REGEX =
  /^https:\/\/(www\.)?meterbolic\.com\/a\/[A-Za-z][A-Za-z0-9]{1,11}\/(longevity|diabetes|weightloss|metabolic|cognition|performance|women)(\/[a-z0-9-]+)?\?utm_source=[a-z0-9]+&utm_medium=(affiliate|email|social-paid|social-organic|search-paid|display|event|referral|direct)&utm_campaign=[a-z]+-\d{4}q[1-4]-[a-z0-9-]+(&utm_content=[a-z0-9-]+)?(&utm_term=[a-z]+)?(&utm_intent=(meter|ai|therapist))?(&utm_hint=[a-z][a-z0-9]*(-[a-z0-9]+){0,7})?$/;

// docs/utm.md §6 — compose a canonical affiliate URL from a campaign brief.
// Parameter order follows §8 (source, medium, campaign, content, term,
// intent, hint) so generated URLs are string-comparable across runs.
export function mintAffiliateURL(opts: {
  affiliate: string;
  vertical: string;
  medium?: string;
  theme: string;
  quarter: string;     // e.g. '2026q3'
  placement?: string;  // utm_content
  term?: string;
  intent?: UTMIntent;
  hint?: string;
}): string {
  const base = `https://meterbolic.com/a/${opts.affiliate}/${opts.vertical}`;
  const qs: string[] = [];
  qs.push(`utm_source=${opts.affiliate.toLowerCase()}`);
  qs.push(`utm_medium=${opts.medium ?? 'affiliate'}`);
  qs.push(`utm_campaign=${opts.vertical}-${opts.quarter}-${opts.theme}`);
  if (opts.placement) qs.push(`utm_content=${opts.placement}`);
  if (opts.term) qs.push(`utm_term=${opts.term}`);
  if (opts.intent) qs.push(`utm_intent=${opts.intent}`);
  if (opts.hint) qs.push(`utm_hint=${opts.hint}`);
  return `${base}?${qs.join('&')}`;
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

// docs/utm.md §8 — validation checklist. Returns structured errors
// (hard failures) and warnings (advisory, e.g. unknown utm_hint slug).
// Mirrors the "failure mode" in the ticket: an unregistered affiliate is
// an ERROR — the caller must stop and add it via the registry-PR process.
export function validateAffiliateURL(url: string): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  let u: URL;
  try {
    u = new URL(url);
  } catch {
    return { valid: false, errors: ['Not a parseable URL'], warnings };
  }

  // §8.1 host
  if (!/^(www\.)?meterbolic\.com$/.test(u.hostname)) {
    errors.push(`host must be meterbolic.com (got ${u.hostname})`);
  }

  const isAffiliatePath = u.pathname.startsWith('/a/');
  const p = u.searchParams;
  const source = p.get('utm_source');
  const medium = p.get('utm_medium');
  const campaign = p.get('utm_campaign');
  const intent = p.get('utm_intent');
  const hint = p.get('utm_hint');

  // §8.2 + failure mode — affiliate & vertical must be registered.
  if (isAffiliatePath) {
    const [, , affSeg, vertSeg] = u.pathname.split('/');
    if (!getAffiliate(affSeg)) {
      errors.push(`affiliate "${affSeg}" not in registry (docs/utm.md §3) — add it via registry-PR before minting`);
    }
    if (!vertSeg || !isValidVertical(vertSeg)) {
      errors.push(`vertical "${vertSeg ?? ''}" not in registry (docs/utm.md §4)`);
    }
    // §8.4 source must equal lowercased affiliate slug
    if (source && affSeg && source !== affSeg.toLowerCase()) {
      errors.push(`utm_source "${source}" must equal lowercased affiliate slug "${affSeg.toLowerCase()}"`);
    }
  }

  // §8.3 required params present + lowercase
  for (const [k, v] of [['utm_source', source], ['utm_medium', medium], ['utm_campaign', campaign]] as const) {
    if (!v) errors.push(`${k} is required`);
    else if (v !== v.toLowerCase()) errors.push(`${k} must be lowercase`);
  }

  // §8.5 medium registry
  if (medium && !(VALID_MEDIUMS as readonly string[]).includes(medium)) {
    errors.push(`utm_medium "${medium}" not in registry (docs/utm.md §6.1)`);
  }

  // §8.6 campaign format
  if (campaign && !/^[a-z]+-\d{4}q[1-4]-[a-z0-9-]+$/.test(campaign)) {
    errors.push(`utm_campaign "${campaign}" must match <vertical>-<YYYYqQ>-<theme>`);
  }

  // §8.8 intent (active values only)
  if (intent && !(VALID_INTENTS as readonly string[]).includes(intent)) {
    errors.push(`utm_intent "${intent}" not an active value (docs/utm.md §6.4)`);
  }

  // §8.9 hint format + advisory warnings
  if (hint) {
    if (!/^[a-z][a-z0-9]*(-[a-z0-9]+)*$/.test(hint) || hint.length > 40) {
      errors.push(`utm_hint "${hint}" malformed (docs/utm.md §6.5)`);
    } else {
      // Keep in lock-step with the product slug registry, docs/utm.md §6.5.
      const known = ['meter-pro', 'meter-free', 'ai-coach', 'ai-coach-plus', 'therapist-1on1', 'kraft-test', 'coach-eos'];
      if (!known.some((slug) => hint === slug || hint.startsWith(slug + '-'))) {
        warnings.push(`utm_hint "${hint}" not in seed product registry — analytics will show it as a fragment until the registry catches up`);
      }
      if (intent === 'therapist' && hint.startsWith('meter')) {
        warnings.push(`utm_hint "${hint}" disagrees with utm_intent=therapist (receiver has final say)`);
      }
    }
  }

  // §8 canonical regex (only meaningful for /a/ URLs)
  if (isAffiliatePath && errors.length === 0 && !AFFILIATE_URL_REGEX.test(url)) {
    warnings.push('URL does not match the canonical §8 regex exactly (check parameter order)');
  }

  return { valid: errors.length === 0, errors, warnings };
}
