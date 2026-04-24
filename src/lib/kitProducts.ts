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

// ─── Main bundle: Meo Starter System ────────────────────────────────
//
// The hero SKU. Device + 1 month Meo AI + eBook. Framed as a
// "Metabolic Intelligence Starter System" everywhere in copy — never
// as a device sale.

export const KIT_PRODUCT: KitProduct = {
  name: 'Meo Starter System',
  description:
    'Digital lipid meter + 1 month of Meo AI + eBook. The full metabolic intelligence loop — measure, understand, act.',
  price: 14900, // £149 (launch price; RRP £197 — see FUNNEL.md offer stack)
  priceId: process.env.NEXT_PUBLIC_KIT_PRICE_ID || 'price_meo_starter_placeholder',
  features: [
    {
      icon: 'activity',
      title: 'Digital Lipid Meter',
      description:
        'Measures Total Cholesterol, HDL, LDL, Triglycerides and TC/HDL ratio from a single finger-prick in under 3 minutes. Includes 10 test strips, lancets, and carrying case.',
    },
    {
      icon: 'message',
      title: 'Meo AI — 1 month access',
      description:
        'Plain-English interpretation of every reading, trend tracking, Kraft-style insulin pattern insight, and a Biological Age Score that updates as you go. This is the core of the system.',
    },
    {
      icon: 'book',
      title: 'eBook: How to Improve Your Cholesterol & Lower Your Biological Age Naturally',
      description:
        'A 120-page action manual with a 6-week protocol. Referenced by Meo AI every time it talks to you, so insight and action stay in one loop.',
    },
    {
      icon: 'bar-chart',
      title: 'Biological Age Score',
      description:
        'One number. Observational, not predictive. Updates with every reading. Your baseline, not a population benchmark.',
    },
    {
      icon: 'refresh',
      title: 'Trend tracking, not snapshots',
      description:
        'Run a reading whenever you want. Meo stitches each one into a trend so you see the drift — not just the number.',
    },
    {
      icon: 'heart',
      title: '30-day money-back guarantee',
      description:
        'Use Meo for 30 days. If you don\'t feel clearer and in control, send the device back for a full refund. Keep the eBook either way.',
    },
  ],
};

// ─── Upsells shown on the order-review screen ───────────────────────
//
// These appear as optional add-ons at checkout. The first is
// recurring (subscription), the other two are one-time renewals of
// Meo AI access. Order matters — first item gets top billing.

export const KIT_ADDONS: KitAddon[] = [
  {
    id: 'test-strip-sub',
    name: 'Meo Test Strip Subscription',
    description:
      '10 fresh strips delivered every month. Most customers run 2–4 readings a week in the first 60 days — the 10 strips in your starter kit run out fast. Cancel any time from your account.',
    price: 1500, // £15/month
    priceId:
      process.env.NEXT_PUBLIC_ADDON_STRIP_SUB_PRICE_ID ||
      'price_meo_strips_sub_placeholder',
    recurring: 'month',
    recommended: true,
    highlight: 'Cancel any time · Never run out mid-reading',
  },
  {
    id: 'meo-ai-3mo',
    name: 'Extend Meo AI — 3 months',
    description:
      'Continue with full Meo AI access for 3 months beyond the 1 month included in your Starter System. Most customers renew inside the first 2 weeks.',
    price: 4900, // £49 (vs. 3 × £29 = £87)
    priceId:
      process.env.NEXT_PUBLIC_ADDON_AI_3MO_PRICE_ID ||
      'price_meo_ai_3mo_placeholder',
    highlight: 'Save £38 vs. monthly',
  },
  {
    id: 'meo-ai-12mo',
    name: 'Extend Meo AI — 12 months',
    description:
      'Annual access to Meo AI — interpretation, trends, Biological Age Score, and unlimited Q&A. Locks in the launch price.',
    price: 14900, // £149 (vs. 12 × £29 = £348)
    priceId:
      process.env.NEXT_PUBLIC_ADDON_AI_12MO_PRICE_ID ||
      'price_meo_ai_12mo_placeholder',
    highlight: 'Save £199 vs. monthly',
  },
  {
    id: 'meo-premium',
    name: 'Meo Premium Insights — monthly',
    description:
      'Deeper pattern analysis across your lipids plus any connected device (Oura, Whoop, Apple Health, Garmin). Monthly 1:1 async coaching check-in with a Meo specialist, priority Q&A, quarterly Biological Age Score deep-dive.',
    price: 2900, // £29/month
    priceId:
      process.env.NEXT_PUBLIC_ADDON_PREMIUM_PRICE_ID ||
      'price_meo_premium_placeholder',
    recurring: 'month',
    highlight: 'Specialist coaching · Priority AI · Device integrations',
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

// ─── Biomarkers surfaced on the landing page ────────────────────────

export const BIOMARKERS = [
  { abbr: 'TC', label: 'Total cholesterol' },
  { abbr: 'HDL', label: 'Protective cholesterol' },
  { abbr: 'LDL', label: 'Atherogenic cholesterol' },
  { abbr: 'TG', label: 'Triglycerides' },
  { abbr: 'TC/HDL', label: 'Cholesterol ratio' },
  { abbr: 'Bio Age', label: 'Biological Age Score' },
] as const;

// ─── FAQ ─────────────────────────────────────────────────────────────

export const FAQ_ITEMS = [
  {
    question: 'Is this a medical device?',
    answer:
      'The lipid meter is a CE-marked clinical-grade instrument for at-home lipid measurement. Meo as a whole is a wellness and monitoring system — it is not intended to diagnose, treat, cure, or prevent any disease. Always consult a qualified healthcare professional for medical advice.',
  },
  {
    question: 'How accurate is the meter?',
    answer:
      'The Sejoy BF-101b meter we ship reads within ±10% of reference-lab panels for Total Cholesterol, HDL, LDL and Triglycerides. More importantly, the real value of Meo is in the trend across many readings — small per-reading variance washes out in the pattern.',
  },
  {
    question: 'What can Meo AI actually do?',
    answer:
      'Meo AI interprets each reading in plain English, compares it against your own baseline, connects lipid trends with anything else you share (sleep, steps, diet, stress, travel), and surfaces patterns before they become trends. It does not diagnose, prescribe, or replace your doctor — when a reading is outside expected bounds, it will recommend you see a healthcare professional.',
  },
  {
    question: 'What happens after my 1 month of Meo AI ends?',
    answer:
      'You can continue on a monthly plan or pick up one of the extension options at checkout (3 months or 12 months — both with meaningful savings vs. monthly). Your readings stay in your account either way.',
  },
  {
    question: 'What if it doesn\'t work for me?',
    answer:
      '30-day money-back guarantee on the device. Send it back for a full refund — no questions, no upsell calls. You keep the eBook either way.',
  },
  {
    question: 'How long does shipping take?',
    answer:
      'Orders ship within 48 hours to the UK, EU, US, Canada, Australia, and Ireland. Typical delivery is 2–5 business days depending on destination.',
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
