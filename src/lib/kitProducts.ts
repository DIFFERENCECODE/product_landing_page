// Physical product definitions for the Meterbolic kit.
// Swap placeholder price IDs for real Stripe Price IDs before go-live.

export interface KitAddon {
  id: string;
  name: string;
  description: string;
  price: number; // GBP pence -> display as £price/100
  priceId: string; // Stripe Price ID
  recommended?: boolean;
  highlight?: string; // e.g. "Free glucose + ketone strips included."
}

export interface KitProduct {
  name: string;
  description: string;
  price: number; // GBP pence
  priceId: string; // Stripe Price ID
  features: { icon: string; title: string; description: string }[];
}

export const KIT_PRODUCT: KitProduct = {
  name: 'Metabolic Health Kit',
  description: 'Lipid meter + personalised report + 6-month retest + eBook + 3 months of MeO AI.',
  price: 19700, // £197
  priceId: process.env.NEXT_PUBLIC_KIT_PRICE_ID || 'price_kit_placeholder',
  features: [
    {
      icon: 'heart',
      title: 'At-home lipid meter',
      description: 'Measures TC, HDL, Triglycerides, LDL and TC/HDL ratio from a single finger-prick.',
    },
    {
      icon: 'bar-chart',
      title: 'Personalised report',
      description: 'Clear findings and lifestyle recommendations based on your biomarkers.',
    },
    {
      icon: 'activity',
      title: 'Biological Age Score',
      description: 'Your metabolic age today, plus a target score for your 6-month retest.',
    },
    {
      icon: 'refresh',
      title: '6-month retest included',
      description: 'Fasting measurement at 6 months to track progress against your target score.',
    },
    {
      icon: 'book',
      title: 'eBook: The Thin Book in Fat',
      description: 'Digital edition by Marina Young, plus Q&A sessions with the author via MeO.',
    },
    {
      icon: 'message',
      title: '3 months of MeO AI',
      description: 'Unlimited access to your MeO AI coach and personal dashboard.',
    },
  ],
};

export const KIT_ADDONS: KitAddon[] = [
  {
    id: 'glucose-multimeter',
    name: 'Glucose & MultiMeter',
    description: 'Measures glucose, ketones, cholesterol and uric acid. Free glucose + ketone strips included.',
    price: 6000, // £60
    priceId: process.env.NEXT_PUBLIC_ADDON_GLUCOSE_MULTI_PRICE_ID || 'price_addon_glucose_multi_placeholder',
    recommended: true,
    highlight: 'Free glucose + ketone strips included.',
  },
  {
    id: 'glucose-meter',
    name: 'Glucose Meter',
    description: 'Standalone glucose monitoring device.',
    price: 3000, // £30
    priceId: process.env.NEXT_PUBLIC_ADDON_GLUCOSE_METER_PRICE_ID || 'price_addon_glucose_meter_placeholder',
  },
  {
    id: 'syai-cgm',
    name: 'SyAI CGM',
    description: 'Continuous glucose monitor for real-time insights.',
    price: 7000, // £70
    priceId: process.env.NEXT_PUBLIC_ADDON_CGM_PRICE_ID || 'price_addon_cgm_placeholder',
  },
  {
    id: 'glucose-strips',
    name: 'Extra Glucose Strips',
    description: 'Additional test strips for your glucose meter.',
    price: 1500, // £15
    priceId: process.env.NEXT_PUBLIC_ADDON_GLUCOSE_STRIPS_PRICE_ID || 'price_addon_glucose_strips_placeholder',
  },
  {
    id: 'ketone-strips',
    name: 'Extra Ketone Strips',
    description: 'Additional test strips for ketone measurement.',
    price: 2500, // £25
    priceId: process.env.NEXT_PUBLIC_ADDON_KETONE_STRIPS_PRICE_ID || 'price_addon_ketone_strips_placeholder',
  },
];

// ─── Biomarkers ──────────────────────────────────────────────────────
export const BIOMARKERS = [
  { abbr: 'TC', label: 'Total cholesterol' },
  { abbr: 'HDL', label: 'Good cholesterol' },
  { abbr: 'TG', label: 'Triglycerides' },
  { abbr: 'LDL', label: 'Bad cholesterol' },
  { abbr: 'Bio Age', label: 'Biological Age Score' },
] as const;

// ─── FAQ items ───────────────────────────────────────────────────────
export const FAQ_ITEMS = [
  {
    question: 'What does the lipid meter measure?',
    answer:
      'Total Cholesterol (TC), HDL, Triglycerides (TG), LDL and the TC/HDL ratio — all from a single finger-prick, in minutes at home.',
  },
  {
    question: 'Do I need anything else to use it?',
    answer:
      'No. The Metabolic Health Kit comes with everything you need: the Sejoy BF-101b device, lancets, test strips, and a quick-start guide.',
  },
  {
    question: 'When do I get my results?',
    answer:
      'Results appear on the device within 3 minutes of the finger-prick. Your personalised report and Biological Age Score are delivered digitally shortly after.',
  },
  {
    question: 'What happens after 3 months of MeO access?',
    answer:
      'Your 3-month complimentary MeO AI subscription ends. You can continue on a paid plan — pricing will be announced before launch.',
  },
] as const;

// ─── Formatting helpers ──────────────────────────────────────────────
/** Convert pence to GBP display string. e.g. formatGBP(19700) → "£197" */
export function formatGBP(pence: number): string {
  const pounds = pence / 100;
  return `£${Number.isInteger(pounds) ? pounds : pounds.toFixed(2)}`;
}

// ─── Checkout-page convenience object (prices in whole GBP) ─────────
// The checkout UI displays raw £ values rather than pence,
// so we divide here. Stripe still receives priceIds, not amounts.
export const KIT_PRODUCTS = {
  baseKit: {
    id: 'base-kit',
    name: KIT_PRODUCT.name,
    description: KIT_PRODUCT.description,
    price: KIT_PRODUCT.price / 100, // £197
    priceId: KIT_PRODUCT.priceId,
  },
  addons: KIT_ADDONS.map((a) => ({
    ...a,
    price: a.price / 100, // whole GBP
  })),
};

/** Addon type as consumed by the checkout UI */
export type AddonProduct = (typeof KIT_PRODUCTS.addons)[number];
