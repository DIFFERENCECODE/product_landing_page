// ═══════════════════════════════════════════════════════════════════
// affiliates.ts — affiliate + vertical registries and UTM helpers.
// Source of truth mirrors docs/utm.md §3, §4, §6.
// ═══════════════════════════════════════════════════════════════════

export interface AffiliateEntry {
  slug: string;
  name: string;
  practitioner?: {
    name: string;
    role: string;
    bio: string;
    photo: string;
  };
  defaultVertical: string;
}

export const AFFILIATES: Record<string, AffiliateEntry> = {
  EoS: {
    slug: 'EoS',
    name: 'Earth on Stage',
    practitioner: {
      name: 'Dr. Arup Sen',
      role: 'Featured Practitioner',
      bio: 'A leading practitioner in metabolic health and longevity medicine, partnering with Meterbolic to bring personalised metabolic intelligence to the EoS community.',
      photo: '/team-arup-sen.jpg',
    },
    defaultVertical: 'metabolic',
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

export function getAffiliate(slug: string): AffiliateEntry | undefined {
  return AFFILIATES[slug];
}

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

export interface UTMParams {
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  utm_content?: string;
  utm_term?: string;
  utm_intent?: string;
  utm_hint?: string;
}

const VALID_MEDIUMS = [
  'affiliate', 'email', 'social-paid', 'social-organic',
  'search-paid', 'display', 'event', 'referral', 'direct',
] as const;

const VALID_INTENTS = ['meter', 'ai', 'therapist'] as const;

export function parseUTMFromSearch(params: URLSearchParams): Partial<UTMParams> {
  const raw: Partial<UTMParams> = {};
  const src = params.get('utm_source');
  if (src) raw.utm_source = src.toLowerCase();
  const med = params.get('utm_medium');
  if (med && (VALID_MEDIUMS as readonly string[]).includes(med)) raw.utm_medium = med;
  const camp = params.get('utm_campaign');
  if (camp) raw.utm_campaign = camp.toLowerCase();
  const cnt = params.get('utm_content');
  if (cnt) raw.utm_content = cnt.toLowerCase();
  const term = params.get('utm_term');
  if (term) raw.utm_term = term.toLowerCase();
  const intent = params.get('utm_intent');
  if (intent && (VALID_INTENTS as readonly string[]).includes(intent as typeof VALID_INTENTS[number])) {
    raw.utm_intent = intent;
  }
  const hint = params.get('utm_hint');
  if (hint && /^[a-z][a-z0-9]*(-[a-z0-9]+)*$/.test(hint) && hint.length <= 40) {
    raw.utm_hint = hint;
  }
  return raw;
}

export function mintAffiliateURL(opts: {
  affiliate: string;
  vertical: string;
  medium: string;
  theme: string;
  quarter: string;
  placement?: string;
  intent?: string;
  hint?: string;
}): string {
  const base = `https://meterbolic.com/a/${opts.affiliate}/${opts.vertical}`;
  const params = new URLSearchParams();
  params.set('utm_source', opts.affiliate.toLowerCase());
  params.set('utm_medium', opts.medium);
  params.set('utm_campaign', `${opts.vertical}-${opts.quarter}-${opts.theme}`);
  if (opts.placement) params.set('utm_content', opts.placement);
  if (opts.intent) params.set('utm_intent', opts.intent);
  if (opts.hint) params.set('utm_hint', opts.hint);
  return `${base}?${params.toString()}`;
}
