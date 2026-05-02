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
        'The world\'s only metabolic-health conversational AI. Plain-English interpretation of every reading, trend tracking, Kraft-style insulin pattern insight, and a Biological Age Score that updates as you go. This is the core of the system.',
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
        'One number for where your metabolism is now, one for where it can be. Observational, not predictive. Built on ten years of industrialising the gold-standard Kraft Test.',
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
      'The lipid meter is a CE-marked clinical-grade instrument and one of only three lipid meters registered for Home Use in the UK & EU. Meo as a whole is a wellness and monitoring system — it is not intended to diagnose, treat, cure, or prevent any disease. Always consult a qualified healthcare professional for medical advice.',
  },
  {
    question: 'How accurate is the meter?',
    answer:
      'The meter reads within ±10% of reference-lab panels for Total Cholesterol, HDL, LDL and Triglycerides. More importantly, the real value of Meo is in the trend across many readings — small per-reading variance washes out in the pattern.',
  },
  {
    question: 'What can Meo AI actually do?',
    answer:
      'Meo AI is the world\'s only conversational AI dedicated to metabolic health. It interprets each reading in plain English against your own baseline, connects lipid trends with anything else you share (sleep, steps, diet, stress, travel), and surfaces patterns before they become trends. Built on ten years of industrialising the gold-standard Kraft Test. It does not diagnose, prescribe, or replace your doctor — when a reading is outside expected bounds, it will recommend you see a healthcare professional.',
  },
  {
    question: 'What happens after my 6 months of Meo AI ends?',
    answer:
      'You\'ll be reminded ahead of the renewal — and given the option to extend, downgrade, or cancel. Subscription auto-renews unless you cancel (per consumer-protection regulation we\'ll remind you in writing before billing). Your readings stay in your account either way.',
  },
  {
    question: 'What if it doesn\'t work for me?',
    answer:
      '30-day money-back guarantee on the device. Send it back for a full refund — no questions, no upsell calls. Shipped discreetly in secure packaging.',
  },
  {
    question: 'Why does the bundle include a 6-month retest?',
    answer:
      'Single readings are noisy — six months gives your metabolism time to actually move. The retest is a fasting reading at month six so we can compare against your baseline and tell you whether you reached your Target Biological Age Score. A personalised report is included with findings and lifestyle recommendations.',
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
