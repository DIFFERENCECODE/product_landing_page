// Meo — Metabolic Intelligence System · Product catalog.
//
// This file is the single source of truth for what we sell, how it's
// priced, and how it maps to Stripe Price IDs. The landing page copy
// and the checkout page both import from here — change pricing or
// copy here and the whole funnel updates.
//
// IMPORTANT: the priceId values below read from env vars. See
// STRIPE_SETUP.md for how to create the products in Stripe and
// populate the env vars. Placeholder values ship so the UI doesn't
// break during development.

// ─── Types ───────────────────────────────────────────────────────────

export interface KitAddon {
  id: string;
  name: string;
  description: string;
  /** Price in GBP pence. Display as £(price / 100). */
  price: number;
  /** Stripe Price ID — one-time unless `recurring` is set. */
  priceId: string;
  /** Set when this is a subscription rather than a one-time charge. */
  recurring?: 'month' | 'year';
  recommended?: boolean;
  highlight?: string;
}

export interface KitProduct {
  name: string;
  description: string;
  price: number;
  priceId: string;
  features: { icon: string; title: string; description: string }[];
}

// ─── Main bundle: Metabolic Health Cholesterol Tracker ─────────────
//
// The hero SKU. Six months MeO AI is positioned as the headline
// value (worth £174 at the £29/mo street rate); the lipid meter is
// bundled in free as part of the subscription. The eBook + Q&A with
// the author + 6-month retest + Biological Age Score complete the
// package. Framed as a "Metabolic Health Cholesterol Tracker"
// everywhere in copy — never as a device sale.
//
// Score brand: Biological Age Score (BAS) — same name used in the
// MeO mobile app and admin dashboard. Score logo TBD (per the
// April 2026 campaign brief).

export const KIT_PRODUCT: KitProduct = {
  name: 'Metabolic Health Cholesterol Tracker',
  description:
    '6 months of Meo AI + Digital Lipid Meter (bundled free) + The Thin Book of Fat. Measure, understand, act — backed by a Biological Age Score that updates with every reading.',
  price: 14900, // £149
  priceId: process.env.NEXT_PUBLIC_KIT_PRICE_ID || 'price_meo_starter_placeholder',
  features: [
    {
      icon: 'message',
      title: 'Meo AI — 6 months full access',
      description:
        'An AI built specifically for metabolic health. Plain-English interpretation of every reading, trend tracking, Kraft-style insulin pattern insight, and a Biological Age Score that updates as you go. This is the core of the system.',
    },
    {
      icon: 'activity',
      title: 'Digital Lipid Meter — Bundled',
      description:
        'One of only three lipid meters registered for Home Use in the UK & EU. Measures Total Cholesterol, HDL, LDL, Triglycerides and TC/HDL ratio from a single finger-prick in under 3 minutes. Includes 10 test strips, lancets, and carry case.',
    },
    {
      icon: 'book',
      title: 'eBook: The Thin Book of Fat — Marina Young',
      description:
        'The action manual that pairs with Meo AI. Ask the author your questions directly through Meo — answers are returned in chat so insight and follow-up stay in one loop.',
    },
    {
      icon: 'bar-chart',
      title: 'Biological Age Score (BAS) + Target Score',
      description:
        'Calculated from your fasting lipid panel plus your age, sex, weight, height and waist — tested to match visceral fat. Also shown as a Kraft Deep Fat Score in kg. Track both over time; your target is set alongside your score so you always know the direction of travel.',
    },
    {
      icon: 'refresh',
      title: 'Free retest at 6 months',
      description:
        'A second fasting reading at month six to see whether you reached your Target Score. Personalised report sent with findings and lifestyle recommendations.',
    },
    {
      icon: 'heart',
      title: '30-day money-back guarantee',
      description:
        'Use Meo for 30 days. If you don\'t feel clearer and in control, send the device back for a full refund. No questions asked. Shipped discreetly in secure packaging.',
    },
  ],
};

// ─── Optional measurement add-ons shown at checkout ─────────────────
//
// Per the April 2026 campaign brief: five optional measurement
// devices and refills, ordered by what marketing wants pushed
// hardest. Option 1 (the multimeter) is the recommended pick — it
// measures ketones, which set the customer up for the next product
// in the Metabolic Health series (the Insulin Tracker). The first
// reading is "what is your cholesterol?", the second is "are you in
// metabolic ketosis?" — same device.
//
// Customers can buy any quantity from 0 to 9 of each (cart-side
// behaviour, not modelled here — checkout UI handles the qty step).

// ─── RETIRED: the standalone 3-month coaching add-on ─────────────────
//
// There WAS a £295 "Metabolic Coach" add-on here (40-minute onboarding
// + two 30-minute follow-ups) which made Meo Coached £149 + £295 =
// £444. It was built around a previous coach and, when the offer moved
// to EoS, kept its old price and session structure under a new name.
//
// It is gone, and it is not coming back as a second coaching SKU. The
// site sells ONE coaching offer: the EoS programme ladder in
// lib/programmes.ts, whose entry tier (Metabolic Optimisation, £850,
// 6 sessions over 12 weeks) IS "Meo Coached". Two coaching products at
// two prices with two session structures, both attributed to Dr Arup
// Sen, is precisely the internal contradiction this file must prevent.
//
// Resolved by Eric, 2026-08-09: the /coaching programme prices are
// authoritative and /checkout follows them.
//
// Kept: the legacy `?addon=` values, so coaching links minted before
// the change still land on the Coached programme rather than silently
// dropping the visitor on plain Starter.

/** Legacy `?addon=` values that must still resolve to the Coached plan. */
export const LEGACY_THERAPY_ADDON_IDS = [
  'therapy-spencer',
  'therapy',
  'coaching-eos',
] as const;

export const KIT_ADDONS: KitAddon[] = [
  {
    id: 'multimeter',
    name: 'Glucose + MultiMeter — measures glucose, ketones, cholesterol & uric acid',
    description:
      'Four metabolic markers in a single device. Comes with 50 free glucose strips + 25 free ketone strips — the same drop of blood gives you two readings. Ketones unlock the picture of your metabolic flexibility, which is the basis of the next tracker in the series.',
    price: 6000, // £60
    priceId:
      process.env.NEXT_PUBLIC_ADDON_MULTIMETER_PRICE_ID ||
      'price_meo_multimeter_placeholder',
    recommended: true,
    highlight: 'Recommended · 50 glucose + 25 ketone strips free',
  },
  {
    id: 'syai-cgm',
    name: 'SyAI Continuous Glucose Monitor',
    description:
      'Continuous glucose monitoring across 14 days. Streams readings into Meo so the AI can correlate spikes with your meals, sleep and stress. For users who want a full week-by-week picture, not just spot readings.',
    price: 7000, // £70
    priceId:
      process.env.NEXT_PUBLIC_ADDON_SYAI_CGM_PRICE_ID ||
      'price_meo_syai_cgm_placeholder',
  },
];

// ─── Downsell: Meo Lite ─────────────────────────────────────────────
//
// Shown on exit-intent / at the end of the email nurture when the
// full system hasn't converted. Ebook + 7-day Meo AI trial; credits
// toward the Starter System if they upgrade.

export const KIT_LITE: KitAddon = {
  id: 'meo-lite',
  name: 'Meo Lite — eBook + 7-day AI trial',
  description:
    'Start with the book and a week of Meo AI (no device — manual entry of past blood results). If you upgrade to the full Starter System within 30 days, we credit the £29 against it.',
  price: 2900, // £29
  priceId: process.env.NEXT_PUBLIC_DOWNSELL_LITE_PRICE_ID || 'price_meo_lite_placeholder',
};

// ─── Legacy product: the KRAFT Test (SCRUM-18) ──────────────────────
//
// Meterbolic's original diagnostic — Dr Joseph Kraft's insulin-survey
// method run out-of-lab: an oral glucose challenge with serial insulin
// readings from a single drop of blood, on a proprietary lateral-flow
// analyser (CE-IVD, FDA-approved manufacturing facility).
//
// PRODUCT HIERARCHY (confirmed by Eric, 2026-06-14): the Lipid Meter
// (Meo Starter) is the LEADING product; the KRAFT Test is LEGACY but
// still on offer. Copy must position it that way — it is the deeper,
// clinical-grade companion test, never the lead CTA. Do not let it
// compete with the £149 bundle on the homepage.
//
// PRICED, BUT NOT PURCHASABLE ONLINE — by appointment (Eric, 2026-08-06).
// Prices are published on the site (£397 / £897) but there is no cart
// and no Stripe button: the test needs an appointment, so every CTA is
// a `mailto:` to info@meterbolic.com, exactly like the /coaching
// programme cards (components/coaching/Pricing.tsx, CtaClosing.tsx).
//
// Both tiers carry the complimentary 3-month Meo Enterprise
// subscription — rendered by components/MeoEnterpriseBonus.tsx, which
// the EoS coaching programmes share so the offer looks identical
// wherever it appears.
export const KRAFT_ENQUIRY_EMAIL = 'info@meterbolic.com';

/** Build a `mailto:` href with a routable subject line. */
export function enquiryMailto(subject: string): string {
  return `mailto:${KRAFT_ENQUIRY_EMAIL}?subject=${encodeURIComponent(subject)}`;
}

export interface EnquiryProduct {
  id: string;
  name: string;
  tagline: string;
  /** Display string, not pence — these prices are never sent to Stripe. */
  price: string;
  duration: string;
  includes: readonly string[];
  enquirySubject: string;
  /**
   * Which card is lit on first paint. Selection is mutually exclusive —
   * choosing the other card moves the highlight rather than adding a
   * second one. See components/KraftPricingCards.tsx.
   */
  defaultSelected: boolean;
}

export const KRAFT_TEST: EnquiryProduct = {
  id: 'kraft-test',
  name: 'The KRAFT Test',
  tagline:
    'The insulin-response test itself, run through a certified clinic or as a home kit, with your results read against Dr Kraft’s response patterns.',
  price: '£397',
  duration: 'One-off test · by appointment',
  includes: [
    'The full KRAFT insulin-response assessment — glucose challenge with serial insulin readings',
    'Analysis on Meterbolic’s CE-IVD lateral-flow analyser',
    'Your curve read against Dr Kraft’s response patterns',
    'A written report in plain English, reviewed before it reaches you',
    'A follow-up conversation to walk through what it means',
  ],
  enquirySubject: 'KRAFT Test enquiry',
  defaultSelected: false,
};

export const KRAFT_TEST_COACHED: EnquiryProduct = {
  id: 'kraft-test-coached',
  name: 'KRAFT Test + Coaching',
  tagline:
    'The same test, plus 1:1 coaching to act on what it finds — for people who want the result turned into a plan rather than a PDF.',
  price: '£897',
  duration: 'Test + coaching programme · by appointment',
  includes: [
    'Everything in The KRAFT Test',
    '1:1 metabolic coaching built around your insulin curve',
    'A personalised plan covering nutrition, movement, sleep and stress',
    'Messaging support between sessions',
    'A progress review to see how the plan is landing',
  ],
  enquirySubject: 'KRAFT Test + Coaching enquiry',
  defaultSelected: true,
};

export const KRAFT_TIERS: readonly EnquiryProduct[] = [KRAFT_TEST, KRAFT_TEST_COACHED];

/**
 * `mailto:` for a general KRAFT enquiry — the hero, the closing block
 * and the cross-page CTAs, where the visitor has not picked a tier.
 *
 * Deliberately its OWN subject rather than reusing the £397 tier's:
 * info@ triages on the subject alone, and the closing block offers to
 * help you choose between the two, so "undecided" must not arrive
 * looking like "I want the test-only option".
 */
export const KRAFT_TEST_MAILTO = enquiryMailto('KRAFT Test enquiry — option not yet chosen');

/** Lowest KRAFT price, for "from £397" teasers on other pages. */
export const KRAFT_FROM_PRICE = KRAFT_TEST.price;

/**
 * One sentence, rendered on every surface that shows a KRAFT price, so
 * the availability terms cannot drift between the homepage, /pricing
 * and /kraft-test.
 */
export const KRAFT_AVAILABILITY_NOTE =
  'Not sold online — booked by appointment with our team.';

// ─── Biomarkers surfaced on the landing page ────────────────────────

export const BIOMARKERS = [
  { abbr: 'Total Cholesterol', label: 'Overall lipid load' },
  { abbr: 'LDL', label: 'Atherogenic cholesterol' },
  { abbr: 'HDL', label: 'Protective cholesterol' },
  { abbr: 'Triglycerides', label: 'Blood fat from diet & liver' },
  { abbr: 'TG:HDL', label: 'Insulin resistance marker' },
  { abbr: 'BAS', label: 'Biological Age Score' },
] as const;

// ─── FAQ ─────────────────────────────────────────────────────────────

export const FAQ_ITEMS = [
  {
    question: 'How accurate is the meter?',
    answer:
      'The BF-102 is CE-marked and reads within ±10% of reference-lab panels for TC, HDL, LDL and Triglycerides. But the real value of Meo is in the trend across hundreds of your own readings — small per-reading variance washes out in the pattern.',
  },
  {
    question: 'Is it hard to use?',
    answer:
      'A finger-prick and a strip — the same motion a diabetic runs three times a day. If you can tap your phone, you can run a Meo reading in under 3 minutes.',
  },
  {
    question: 'Can I trust the AI?',
    answer:
      'Meo AI does not diagnose, prescribe, or replace your doctor. It reads your history, identifies your biological patterns, and tells you clearly what it sees. When something is unusual, it recommends you see a healthcare professional. You are always in charge.',
  },
  {
    question: '£149 — what does that actually get me?',
    answer:
      'MeO is here to be your companion lifelong, to help you to achieve optimal vitality and healthy ageing. As your first step in this journey, you enjoy 6 months of Meo AI (the world\'s first AI specialising in Metabolic Health), with the lipid meter, 10 lipid test strips (lancets & carry case), Dashboard, PDF Report and Biological Age Score calculations and your personal targets all bundled in. One private-clinic panel costs £80–£150, runs once, gives you just the raw numbers on paper. Meo costs £149, runs multiple times to track your progress as you make the MeO proposed changes, and pairs each reading with AI interpretation you can actually act on to improve yourself. Start the journey with our science at your beck and call.',
  },
  {
    question: 'Is this a medical device?',
    answer:
      'The lipid meter is a CE-marked clinical-grade instrument and one of only three lipid meters registered for Home Use in the UK & EU. Meo as a whole is a wellness and monitoring system — it is not intended to diagnose, treat, cure, or prevent any disease. Always consult a qualified healthcare professional for medical advice.',
  },
  {
    question: 'What can Meo AI actually do?',
    answer:
      'Meo AI is an AI built specifically for metabolic health. It interprets each reading in plain English against your own baseline, connects lipid trends with anything else you share (sleep, steps, diet, stress, travel), and surfaces patterns before they become trends. It does not diagnose, prescribe, or replace your doctor — when a reading is outside expected bounds, it will recommend you see a healthcare professional.',
  },
  {
    question: 'What happens after my 6 months of Meo AI ends?',
    answer:
      'You\'ll be reminded ahead of the renewal — and given the option to extend, downgrade, or cancel. Subscription auto-renews unless you cancel (per consumer-protection regulation we\'ll remind you in writing before billing). Your readings stay in your account either way.',
  },
  {
    question: 'What if it doesn\'t work for me?',
    answer:
      '30-day money-back guarantee on the device. Send it back for a full refund — no questions, no upsell calls. Shipped discreetly in secure packaging. Your statutory right to a full refund (including delivery) within 14 days under the UK Consumer Contracts Regulations 2013 is unaffected by this guarantee.',
  },
  {
    question: 'Why does the bundle include a 6-month retest?',
    answer:
      'Single readings are noisy — six months gives your metabolism time to actually move. The retest is a fasting reading at month six so we can compare against your baseline and tell you whether you reached your Target Biological Age Score. A personalised report is included with findings and lifestyle recommendations.',
  },
  {
    question: 'Can I add glucose monitoring to my Meo system?',
    answer:
      'Yes — at checkout you can extend your system with the Glucose + MultiMeter (measures glucose, ketones, cholesterol and uric acid in one device — bundled with 50 free glucose strips and 25 ketone strips) or the SyAI Continuous Glucose Monitor (14-day sensor, streams readings directly into Meo AI so it can correlate spikes with your meals, sleep and stress). Both are optional add-ons; the core Metabolic Health Tracker works standalone.',
  },
  {
    question: 'How long does shipping take?',
    answer:
      'Orders ship within 72 hours to the UK, EU, US, Canada, Australia, and Ireland. Quantities are limited — if stock is low you will be added to the waiting list and notified as soon as your order ships. Typical delivery is 2–5 business days depending on destination.',
  },
] as const;

// ─── Formatting helpers ──────────────────────────────────────────────

/** Convert pence to a GBP display string. e.g. formatGBP(14900) → "£149" */
export function formatGBP(pence: number): string {
  const pounds = pence / 100;
  return `£${Number.isInteger(pounds) ? pounds : pounds.toFixed(2)}`;
}

// ─── Checkout-page convenience object (prices in whole GBP) ─────────
//
// The checkout UI displays whole-pound values. Stripe still
// receives priceId — this object is purely for presentation.

export const KIT_PRODUCTS = {
  baseKit: {
    id: 'base-kit',
    name: KIT_PRODUCT.name,
    description: KIT_PRODUCT.description,
    price: KIT_PRODUCT.price / 100,
    priceId: KIT_PRODUCT.priceId,
  },
  addons: KIT_ADDONS.map((a) => ({
    ...a,
    price: a.price / 100,
  })),
};

/** Type used by the checkout UI. */
export type AddonProduct = (typeof KIT_PRODUCTS.addons)[number];
