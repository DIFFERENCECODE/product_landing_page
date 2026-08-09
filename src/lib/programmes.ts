// ═══════════════════════════════════════════════════════════════════
// programmes.ts — the EoS coaching programmes, SINGLE SOURCE OF TRUTH.
//
// £850 (Metabolic Optimisation) and £1,450 (Metabolic Continuum) live
// HERE and nowhere else. Both surfaces that sell them render from this
// file:
//
//   • /eos          → components/coaching/Pricing.tsx  (the canonical
//                     programme page: full cards, chips, includes)
//   • /a/EoS[...]   → lib/affiliates.ts maps these into the affiliate
//                     tier ladder (see programmeToTier there)
//
// If you are about to type "850" or "1,450" into another file: don't.
// Import from here. Two copies of a price is not a risk, it is a
// certainty of divergence.
//
// The programmes are delivered by Dr Arup Sen, the principal of the
// EoS affiliate. They are EoS's offer — they must never be presented
// inside another affiliate's funnel (funnel isolation).
//
// Deliberately React-free so both server components and the registry
// can import it. `chip.kind` is a token the renderer maps to an icon.
// ═══════════════════════════════════════════════════════════════════

export type ProgrammeChipKind = 'sessions' | 'span' | 'kit' | 'messaging';

export interface ProgrammeChip {
  kind: ProgrammeChipKind;
  label: string;
}

export interface Programme {
  id: string;
  name: string;
  /** e.g. "3-month programme" — shown under the name. */
  duration: string;
  /** Display string, inc. VAT. Never sent to Stripe (no checkout yet). */
  price: string;
  /** One-line positioning, rendered in italics. */
  tagline: string;
  /** Short "at a glance" summary, DERIVED from `includes` below. */
  chips: readonly ProgrammeChip[];
  includes: readonly string[];
  /** Condensed feature list for the narrower affiliate tier cards. */
  highlights: readonly string[];
  /** Gives the fuller programme card its primary-tinted border. */
  accent: boolean;
}

export const EOS_PROGRAMMES: readonly Programme[] = [
  {
    id: 'optimisation',
    name: 'Metabolic Optimisation',
    duration: '3-month programme',
    price: '£850',
    tagline:
      'A focused 12-week programme to build sustainable metabolic habits, with regular 1:1 coaching from Dr Arup Sen.',
    chips: [
      { kind: 'sessions', label: '6 coaching sessions' },
      { kind: 'span', label: '12 weeks' },
      { kind: 'kit', label: 'Meo kit included' },
      { kind: 'messaging', label: 'Messaging support' },
    ],
    includes: [
      'Meo Starter: CE-marked digital lipid meter, 10 test strips + lancets + carry case',
      '6 months of Meo AI plain-English interpretation',
      'Your metabolic trend score, tracked from your lipids and body measurements',
      'Free retest at month six',
      '1 × 60-minute onboarding coaching session with Dr Arup Sen',
      '5 × 30-minute fortnightly 1:1 coaching sessions across the 12-week programme',
      'Messaging support between sessions',
    ],
    highlights: [
      'Meo Starter kit + 6 months of Meo AI',
      '6 × 1:1 coaching sessions with Dr Arup Sen',
      '12-week structured programme',
      'Messaging support between sessions',
      'Free retest at month six',
    ],
    accent: false,
  },
  {
    id: 'continuum',
    name: 'Metabolic Continuum',
    duration: '6-month programme',
    price: '£1,450',
    tagline:
      'Sustained 1:1 coaching across 6 months — frequent support while you build new habits, then ongoing maintenance to keep them.',
    chips: [
      { kind: 'sessions', label: '9 coaching sessions' },
      { kind: 'span', label: '6 months' },
      { kind: 'kit', label: 'Meo kit included' },
      { kind: 'messaging', label: 'Priority messaging' },
    ],
    includes: [
      'Everything in Metabolic Optimisation',
      '3 additional × 45-minute monthly maintenance coaching sessions (months 4–6)',
      'Continued Meo monitoring and trend tracking across the full 6 months',
      'Priority messaging support throughout',
      'A personalised, evolving lifestyle plan covering nutrition, movement, sleep and stress',
    ],
    highlights: [
      'Everything in Metabolic Optimisation',
      '9 × 1:1 coaching sessions with Dr Arup Sen',
      'Six months of monitoring and trend tracking',
      'Priority messaging support throughout',
      'A personalised, evolving lifestyle plan',
    ],
    accent: true,
  },
];

/** The programme most people start on — the entry-level EoS offer. */
export const EOS_ENTRY_PROGRAMME: Programme = EOS_PROGRAMMES[0];

/** Lowest EoS programme price, for "from £850" teasers. */
export const EOS_FROM_PRICE = EOS_PROGRAMMES[0].price;

/** The practitioner who delivers every EoS programme. */
export const EOS_PRINCIPAL = 'Dr Arup Sen';

/** Canonical, indexable page for the programmes. `/coaching` 308s here. */
export const EOS_PROGRAMME_URL = '/eos';

export function getProgramme(id: string): Programme | undefined {
  return EOS_PROGRAMMES.find((p) => p.id === id);
}

/** Routable enquiry subject — names the programme, span and price. */
export function programmeEnquirySubject(p: Programme): string {
  return `${p.name} enquiry — ${p.duration}, ${p.price}`;
}
