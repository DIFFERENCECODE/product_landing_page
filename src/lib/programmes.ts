// ═══════════════════════════════════════════════════════════════════
// programmes.ts — the EoS coaching programmes, SINGLE SOURCE OF TRUTH.
//
// £850 (Metabolic Optimisation) and £1,450 (Metabolic Continuum) live
// HERE and nowhere else, as NUMBERS. Every surface that shows a price
// renders `formatProgrammePrice()` over this file:
//
//   • /coaching     → components/coaching/Pricing.tsx — the canonical
//                     programme page: full cards, chips, includes.
//                     /eos serves the same page as a partner-brand
//                     alias (see app/eos/page.tsx).
//   • /checkout     → the "Meo Coached" plan IS the entry programme.
//                     Name, price, tagline and bullets are read from
//                     EOS_ENTRY_PROGRAMME, never retyped.
//   • /, /pricing   → the Coached tier card and the comparison table.
//   • /a/EoS[...]   → lib/affiliates.ts maps these into the affiliate
//                     tier ladder (see programmeToTier there).
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

import { KIT_PRODUCT } from '@/lib/kitProducts';

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
  /**
   * Whole GBP, inc. VAT. The ONE place this number exists. Render it
   * with formatProgrammePrice() — never hand-write "£850" in JSX.
   */
  priceGBP: number;
  /** One-line positioning, rendered in italics. */
  tagline: string;
  /** Short "at a glance" summary, DERIVED from `includes` below. */
  chips: readonly ProgrammeChip[];
  includes: readonly string[];
  /** Condensed feature list for the narrower affiliate/tier cards. */
  highlights: readonly string[];
  /** Gives the fuller programme card its primary-tinted border. */
  accent: boolean;
}

export const EOS_PROGRAMMES: readonly Programme[] = [
  {
    id: 'optimisation',
    name: 'Metabolic Optimisation',
    duration: '3-month programme',
    priceGBP: 850,
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
    priceGBP: 1450,
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

/**
 * The programme most people start on — the entry-level EoS offer, and
 * the definition of "Meo Coached" on the consumer funnel. /checkout,
 * the homepage tier card and /pricing all read their Coached price and
 * copy from here.
 */
export const EOS_ENTRY_PROGRAMME: Programme = EOS_PROGRAMMES[0];

/** "£850" / "£1,450" — the only way a programme price reaches the DOM. */
export function formatProgrammePrice(p: Programme): string {
  return `£${p.priceGBP.toLocaleString('en-GB')}`;
}

/** Lowest EoS programme price, for "from £850" teasers. */
export const EOS_FROM_PRICE = formatProgrammePrice(EOS_PROGRAMMES[0]);

/** The practitioner who delivers every EoS programme. */
export const EOS_PRINCIPAL = 'Dr Arup Sen';

/**
 * Canonical, indexable page for the programmes.
 *
 * This is `/coaching` — the durable, category-level URL. `/eos` serves
 * the SAME page as a partner-brand alias with a rel=canonical pointing
 * here; neither path redirects to the other. That is deliberate: a
 * permanent 308 `/coaching → /eos` shipped on 2026-08-06 and is cached
 * in browsers, so reversing it into `/eos → /coaching` would make those
 * clients bounce between the two for ever. Serving both, canonicalising
 * one, is the only loop-free way back.
 */
export const EOS_PROGRAMME_URL = '/coaching';

/** Partner-brand alias for EOS_PROGRAMME_URL. Same page, not a redirect. */
export const EOS_PROGRAMME_ALIAS_URL = '/eos';

/**
 * Where programme enquiries go. Deliberately NOT info@meterbolic.com:
 * the programmes are run with EoS Longevity and triaged by that inbox.
 * Every CTA that sells a programme — the /coaching cards, the closing
 * CTA, the Coached plan on /checkout — mails this one address.
 */
export const EOS_ENQUIRY_EMAIL = 'eos@meterbolic.com';

export function getProgramme(id: string): Programme | undefined {
  return EOS_PROGRAMMES.find((p) => p.id === id);
}

/** Routable enquiry subject — names the programme, span and price. */
export function programmeEnquirySubject(p: Programme): string {
  return `${p.name} enquiry — ${p.duration}, ${formatProgrammePrice(p)}`;
}

/** `mailto:` for a programme, with the subject and body pre-filled. */
export function programmeEnquiryMailto(p: Programme): string {
  const body = `Hi,\n\nI'd like to know more about the ${p.name} (${
    p.duration
  }, ${formatProgrammePrice(p)}).\n\nThank you,\n`;
  return `mailto:${EOS_ENQUIRY_EMAIL}?subject=${encodeURIComponent(
    programmeEnquirySubject(p),
  )}&body=${encodeURIComponent(body)}`;
}

// ─── Selling the entry programme at checkout ─────────────────────────
//
// The programmes are sold BY ENQUIRY, exactly like the KRAFT Test: they
// commit a clinician's diary, so a card payment cannot complete the
// sale on its own. /coaching, /pricing, the affiliate ladder and the
// Coached plan on /checkout therefore all end in the same `mailto:`.
//
// One env var flips the entry programme to a card sale when ops is
// ready. The Coached plan on /checkout is the Meo Starter kit plus the
// coaching layer, so the Stripe basket is:
//
//     KIT_PRODUCT (£149)  +  this delta price  =  £850
//
// so the price ops must mint is the DELTA below, not £850. Until the
// env var is set, `EOS_ENTRY_PURCHASABLE` is false and every coaching
// CTA is an enquiry — which is why no code path can ever charge a card
// an amount that disagrees with this file.
//
// Deliberately NOT reusing NEXT_PUBLIC_ADDON_THERAPY_PRICE_ID: that is
// the retired £295 3-month coach add-on. Pointing the £850 programme at
// a £295 price object would show £850 and charge £444.

/** Whole GBP the coaching layer must add to reach the programme price. */
export const EOS_ENTRY_DELTA_GBP =
  EOS_ENTRY_PROGRAMME.priceGBP - KIT_PRODUCT.price / 100;

/** Stripe price for EOS_ENTRY_DELTA_GBP. Unset ⇒ enquiry-only. */
export const EOS_ENTRY_DELTA_PRICE_ID =
  process.env.NEXT_PUBLIC_EOS_OPTIMISATION_DELTA_PRICE_ID || '';

/** True once ops has minted the delta price and set the env var. */
export const EOS_ENTRY_PURCHASABLE = EOS_ENTRY_DELTA_PRICE_ID.length > 0;
