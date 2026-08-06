// ═══════════════════════════════════════════════════════════════════
// affiliates.ts — affiliate + vertical registries, tier sets, and the
// UTM mint/validate routine.
//
// Single source of truth in code; mirrors docs/utm.md §3 (affiliate
// registry), §4 (verticals), §6 (path→UTM mapping) and §8 (validation
// regex). Keep this file in lock-step with docs/utm.md — if you add an
// affiliate or vertical here, add the row there in the same commit.
// ═══════════════════════════════════════════════════════════════════

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
  EoS: {
    slug: 'EoS',
    name: 'Earth on Stage',
    logo: '/eos-logo.svg',
    practitioner: {
      name: 'Dr Arup Sen',
      role: 'Founder, EoS Longevity · MRCP · Consultant Physician',
      bio: 'A leading voice in metabolic health and longevity medicine, partnering with Meterbolic to bring personalised metabolic intelligence to the EoS community.',
      quote:
        'Longevity is not simply about living longer — it is about preserving vitality, independence, and quality of life for as long as possible.',
      photo: '/team-arup-sen.jpg',
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
// Tier sets. Each affiliate sales page renders four tiers. Prices and
// copy are PLACEHOLDERS pending sign-off from MB Commercial (SCRUM-8) —
// the structure (BASIC / MOST POPULAR / CONCIERGE / CORPORATE) is fixed;
// the content is not.
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

export const AFFILIATE_TIERS: readonly Tier[] = [
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
      const known = ['meter-pro', 'meter-free', 'ai-coach', 'ai-coach-plus', 'therapist-1on1', 'kraft-test'];
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
