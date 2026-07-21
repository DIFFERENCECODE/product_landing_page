'use client';

/**
 * /checkout — Meo order page (single-step).
 *
 * Glucose selection and add-ons live on the same page.
 * Glucose is required before the Pay button activates.
 */

import Image from 'next/image';
import Link from 'next/link';
import { useMemo, useState, useTransition, useEffect } from 'react';
import {
  ArrowLeft,
  Minus,
  Plus,
  Shield,
  Clock,
  Lock,
  Check,
  ArrowRight,
  Activity,
  BarChart2,
  Brain,
  Droplets,
  FileText,
  Zap,
  Wifi,
} from 'lucide-react';
import {
  KIT_PRODUCTS,
  KIT_LITE,
  THERAPY_ADDON,
  type AddonProduct,
} from '@/lib/kitProducts';
import { Navbar, Footer } from '@/components/MarketingLandingPage';

const THERAPY_PRICE = THERAPY_ADDON.price / 100; // £295
const THERAPY_AVAILABLE = !THERAPY_ADDON.priceId.includes('placeholder');
const LITE_PRICE = KIT_LITE.price / 100; // £29

type Plan = 'lite' | 'starter' | 'coached';

// ─── Brand colour tokens ──────────────────────────────────────────────
const C = {
  bg: '#1c4a40',
  bgDeep: '#143730',
  bgCard: 'rgba(30, 70, 60, 0.85)',
  border: 'rgba(255,255,255,0.10)',
  primary: '#a4d65e',
  primaryFg: '#1a3a2a',
  fg: '#ffffff',
  muted: 'rgba(255,255,255,0.62)',
  pill: 'rgba(164,214,94,0.18)',
  pillFg: '#a4d65e',
};

function DropletIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={C.primary}>
      <path d="M12 2C12 2 5 10 5 15C5 19.4183 8.13401 23 12 23C15.866 23 19 19.4183 19 15C19 10 12 2 12 2Z" />
    </svg>
  );
}

// ─── Glucose options (no standalone Glucose Meter) ────────────────────
const GLUCOSE_OPTIONS = [
  {
    id: 'own',
    addonId: null,
    icon: <Check className="h-6 w-6" />,
    label: 'I have my own glucose reading',
    sub: 'Already testing — I can enter my readings manually into Meo',
    price: null,
    badge: null,
  },
  {
    id: 'multimeter',
    addonId: 'multimeter',
    icon: <Zap className="h-6 w-6" />,
    label: 'Glucose + MultiMeter',
    sub: 'Measures glucose, ketones, cholesterol & uric acid — free strips bundled',
    price: '£60',
    badge: 'Recommended',
  },
  {
    id: 'syai-cgm',
    addonId: 'syai-cgm',
    icon: <Wifi className="h-6 w-6" />,
    label: 'SyAI Continuous Glucose Monitor',
    sub: '14-day continuous monitoring — streams into Meo AI automatically',
    price: '£70',
    badge: null,
  },
] as const;

// ─── Trust strip ──────────────────────────────────────────────────────
function TrustStrip() {
  const items = [
    { icon: <Clock className="h-4 w-4" />, label: 'Ships in 72 hours' },
    { icon: <Shield className="h-4 w-4" />, label: '30-day money-back' },
    { icon: <Lock className="h-4 w-4" />, label: 'Secure Stripe checkout' },
    { icon: <Check className="h-4 w-4" />, label: '£9.99 UK shipping' },
  ];
  return (
    <div
      className="rounded-2xl px-4 sm:px-6 py-4 grid grid-cols-2 md:grid-cols-4 gap-3 text-sm"
      style={{ background: C.bgCard, border: `1px solid ${C.border}` }}
    >
      {items.map((it, i) => (
        <div key={i} className="flex items-center gap-2.5" style={{ color: C.fg }}>
          <span style={{ color: C.primary }}>{it.icon}</span>
          <span>{it.label}</span>
        </div>
      ))}
    </div>
  );
}

// ─── Hero image slider ────────────────────────────────────────────────
const HERO_SLIDES = [
  {
    src: '/lipid-meter.png',
    alt: 'Meo Digital Lipid Meter',
    width: 400,
    height: 655,
    className: 'h-[200px] w-auto object-contain',
    label: 'Digital Lipid Meter',
  },
  {
    src: '/ebook-cover.jpg',
    alt: 'The Thin Book of Fat — Marina Young',
    width: 200,
    height: 280,
    className: 'h-[200px] w-auto object-cover rounded-xl shadow-2xl',
    label: 'The Thin Book of Fat',
  },
];

function HeroImageSlider() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setActive((p) => (p + 1) % HERO_SLIDES.length), 3000);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      className="flex flex-col items-center justify-center gap-4 p-5 sm:p-6"
      style={{ background: 'rgba(255,255,255,0.04)' }}
    >
      <div className="relative w-full flex items-center justify-center h-[210px] overflow-hidden">
        {HERO_SLIDES.map((slide, i) => (
          <div
            key={i}
            className="absolute inset-0 flex items-center justify-center transition-opacity duration-500"
            style={{ opacity: active === i ? 1 : 0 }}
          >
            <Image
              src={slide.src}
              alt={slide.alt}
              width={slide.width}
              height={slide.height}
              className={slide.className}
              priority={i === 0}
            />
          </div>
        ))}
      </div>
      {/* Dot navigation */}
      <div className="flex items-center gap-2">
        {HERO_SLIDES.map((slide, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className="flex flex-col items-center gap-1"
            aria-label={`Show ${slide.label}`}
          >
            <span
              className="block rounded-full transition-all duration-300"
              style={{
                width: active === i ? 20 : 6,
                height: 6,
                background: active === i ? C.primary : 'rgba(255,255,255,0.3)',
              }}
            />
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Hero product card ────────────────────────────────────────────────
function HeroProductCard() {
  const features = [
    { icon: <Brain className="h-4 w-4" />, text: '6 months of Meo AI' },
    { icon: <Activity className="h-4 w-4" />, text: 'Lipid meter — bundled' },
    { icon: <Droplets className="h-4 w-4" />, text: '10 lipid test strips + lancets + carry case' },
    {
      // BAS PNG rendered as a CSS mask so it picks up currentColor
      // from the wrapping span (C.primary). Sized h-5 w-5 so its
      // tall 1.6:1 aspect renders to a width close to the lucide
      // stroke icons next to it.
      icon: (
        <span
          aria-label="BAS"
          role="img"
          className="inline-block h-5 w-5"
          style={{
            backgroundColor: 'currentColor',
            WebkitMaskImage: 'url(/bas-icon.png)',
            maskImage: 'url(/bas-icon.png)',
            WebkitMaskSize: 'contain',
            maskSize: 'contain',
            WebkitMaskRepeat: 'no-repeat',
            maskRepeat: 'no-repeat',
            WebkitMaskPosition: 'center',
            maskPosition: 'center',
          }}
        />
      ),
      text: 'Biological Age Score included',
    },
    { icon: <BarChart2 className="h-4 w-4" />, text: 'Metabolic Data Visualisation Dashboard' },
    { icon: <FileText className="h-4 w-4" />, text: 'Reports & guidance to improve your vitality' },
  ];
  return (
    <div
      className="rounded-2xl overflow-hidden grid grid-cols-1 md:grid-cols-[260px_1fr]"
      style={{ background: C.bgCard, border: `1px solid ${C.border}` }}
    >
      <HeroImageSlider />
      <div className="p-5 sm:p-7 flex flex-col justify-between gap-5">
        <div>
          <span
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
            style={{ background: C.pill, color: C.pillFg }}
          >
            <DropletIcon size={12} /> What Meo is
          </span>
          <h2
            className="mt-3 mb-2"
            style={{ color: C.fg, fontFamily: 'var(--font-serif)', fontSize: 'clamp(24px, 3vw, 30px)' }}
          >
            A metabolic intelligence system.
          </h2>
          <p className="text-sm" style={{ color: C.muted }}>
            A finger-prick at home, AI that reads each result in plain English, and a Biological
            Age Score that updates with every reading — six months of metabolic visibility you can
            actually act on.
          </p>
          <p className="text-xs mt-3 font-semibold tracking-wide" style={{ color: C.pillFg }}>
            What&apos;s included
          </p>
        </div>
        <ul className="space-y-2.5">
          {features.map((f, i) => (
            // items-center keeps the icon on the visual midline of
            // single-line copy (the dominant case here). A 24×24 icon
            // column gives every glyph the same footprint, so the
            // lucide stroke icons and the taller BAS mask read with
            // matched optical weight even though their intrinsic
            // shapes differ. shrink-0 stops the column collapsing
            // when the text wraps on narrow widths.
            <li
              key={i}
              className="flex items-center gap-3 text-sm leading-snug"
              style={{ color: C.fg }}
            >
              <span
                className="flex h-6 w-6 shrink-0 items-center justify-center"
                style={{ color: C.primary }}
                aria-hidden
              >
                {f.icon}
              </span>
              <span className="flex-1">{f.text}</span>
            </li>
          ))}
        </ul>
        <div
          className="flex items-baseline justify-between pt-3"
          style={{ borderTop: `1px solid ${C.border}` }}
        >
          <span className="text-sm" style={{ color: C.muted }}>One-time</span>
          <span className="text-2xl font-bold" style={{ color: C.fg }}>
            £{KIT_PRODUCTS.baseKit.price}
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── Addon row ────────────────────────────────────────────────────────
function AddonRow({
  addon,
  qty,
  onDec,
  onInc,
}: {
  addon: AddonProduct;
  qty: number;
  onDec: () => void;
  onInc: () => void;
}) {
  const selected = qty > 0;
  return (
    <div
      className="rounded-xl p-4 sm:p-5 transition-colors"
      style={{
        background: selected ? 'rgba(164,214,94,0.06)' : C.bgCard,
        border: `1px solid ${selected ? C.primary : C.border}`,
      }}
    >
      <div className="flex items-start justify-between gap-3 mb-2 flex-wrap">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-semibold text-sm sm:text-base" style={{ color: C.fg }}>
            {addon.name}
          </span>
          {addon.recommended && (
            <span
              className="text-[10px] font-semibold px-2 py-0.5 rounded"
              style={{ background: C.pill, color: C.pillFg }}
            >
              Recommended
            </span>
          )}
          {addon.recurring && (
            <span
              className="text-[10px] font-semibold px-2 py-0.5 rounded"
              style={{ background: 'rgba(255,255,255,0.06)', color: C.muted }}
            >
              {addon.recurring === 'month' ? 'Monthly' : 'Annual'}
            </span>
          )}
        </div>
        <span className="font-semibold text-sm shrink-0" style={{ color: C.fg }}>
          £{addon.price}
          {addon.recurring && (
            <span className="text-xs font-normal" style={{ color: C.muted }}>
              /{addon.recurring}
            </span>
          )}
        </span>
      </div>
      <p className="text-xs sm:text-sm mb-4" style={{ color: C.muted }}>
        {addon.description}
      </p>
      <div className="flex items-center gap-3">
        <button
          onClick={onDec}
          disabled={qty === 0}
          aria-label={`Decrease ${addon.name}`}
          className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-150
                     disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer
                     hover:scale-110 hover:bg-white/15 hover:border-white/40
                     active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
          style={{
            border: `1px solid ${C.border}`,
            color: C.fg,
            background: qty === 0 ? 'transparent' : 'rgba(255,255,255,0.06)',
          }}
        >
          <Minus size={16} strokeWidth={2.5} />
        </button>
        <span className="w-8 text-center text-base font-bold tabular-nums" style={{ color: C.fg }}>
          {qty}
        </span>
        <button
          onClick={onInc}
          disabled={qty === 9}
          aria-label={`Increase ${addon.name}`}
          className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-150
                     disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer
                     hover:scale-110 hover:brightness-125
                     active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a4d65e]/60"
          style={{
            border: `1px solid ${qty === 9 ? C.border : 'rgba(164,214,94,0.55)'}`,
            color: qty === 9 ? C.fg : '#a4d65e',
            background: qty === 9 ? 'transparent' : 'rgba(164,214,94,0.12)',
          }}
        >
          <Plus size={16} strokeWidth={2.5} />
        </button>
        {selected && (
          <span className="ml-auto text-sm font-semibold" style={{ color: C.primary }}>
            +£{addon.price * qty}
          </span>
        )}
      </div>
    </div>
  );
}

// ─── Order summary ────────────────────────────────────────────────────
function OrderSummary({
  plan,
  selectedAddons,
  therapySelected,
  total,
  onPay,
  isPending,
  error,
  glucoseSelected,
}: {
  plan: Plan;
  selectedAddons: { addon: AddonProduct; qty: number }[];
  therapySelected: boolean;
  total: number;
  onPay: () => void;
  isPending: boolean;
  error: string | null;
  glucoseSelected: boolean;
}) {
  const isLite = plan === 'lite';
  const isCoached = plan === 'coached';
  // Coached presents as a single bundled line at £444 — the user sees
  // the plan price, not a Starter + Spencer breakdown. Optional addons
  // (e.g. CGM) still itemise below.
  const headlinePrice = isLite
    ? LITE_PRICE
    : isCoached
    ? KIT_PRODUCTS.baseKit.price + THERAPY_PRICE
    : KIT_PRODUCTS.baseKit.price;
  const headlineName = isLite
    ? 'Meo Lite'
    : isCoached
    ? 'Meo Coached'
    : KIT_PRODUCTS.baseKit.name;
  const headlineSub = isLite
    ? 'eBook + 7-day AI trial'
    : isCoached
    ? 'Complete bundle + 3-month coaching'
    : 'Complete bundle';
  return (
    <div
      className="rounded-2xl p-5 sm:p-6 w-full overflow-hidden"
      style={{ background: C.bgCard, border: `1px solid ${C.border}` }}
    >
      <h3 className="mb-4" style={{ color: C.fg }}>Order summary</h3>

      <div className="flex justify-between gap-3 mb-3 pb-3" style={{ borderBottom: `1px solid ${C.border}` }}>
        <div className="min-w-0">
          <p className="font-semibold text-sm" style={{ color: C.fg }}>{headlineName}</p>
          <p className="text-xs" style={{ color: C.muted }}>{headlineSub}</p>
        </div>
        <span className="font-semibold text-sm shrink-0" style={{ color: C.fg }}>
          £{headlinePrice}
        </span>
      </div>

      {!isLite && selectedAddons.length > 0 && (
        <div className="space-y-2 mb-3 pb-3" style={{ borderBottom: `1px solid ${C.border}` }}>
          {selectedAddons.map(({ addon, qty }) => (
            <div key={addon.id} className="flex justify-between gap-3 text-sm">
              <span className="min-w-0" style={{ color: C.muted }}>
                {addon.name} {qty > 1 && `× ${qty}`}
              </span>
              <span className="shrink-0" style={{ color: C.fg }}>£{addon.price * qty}</span>
            </div>
          ))}
          {!isCoached && therapySelected && (
            <div className="flex justify-between gap-3 text-sm">
              <span className="min-w-0" style={{ color: C.muted }}>Metabolic Coach — Spencer Martin</span>
              <span className="shrink-0" style={{ color: C.fg }}>£{THERAPY_PRICE}</span>
            </div>
          )}
        </div>
      )}
      {/* Edge case: no glucose addon, but Spencer toggled on Starter
          (without any other addon) — show Spencer on its own row. */}
      {!isLite && !isCoached && therapySelected && selectedAddons.length === 0 && (
        <div className="space-y-2 mb-3 pb-3" style={{ borderBottom: `1px solid ${C.border}` }}>
          <div className="flex justify-between gap-3 text-sm">
            <span className="min-w-0" style={{ color: C.muted }}>Metabolic Coach — Spencer Martin</span>
            <span className="shrink-0" style={{ color: C.fg }}>£{THERAPY_PRICE}</span>
          </div>
        </div>
      )}

      <div className="space-y-1.5 text-sm mb-4">
        <div className="flex justify-between" style={{ color: C.muted }}>
          <span>Subtotal</span>
          <span>£{total}</span>
        </div>
        <div className="flex justify-between text-xs" style={{ color: C.muted }}>
          <span>Shipping</span>
          <span>Calculated at checkout</span>
        </div>
      </div>

      <div className="flex items-baseline justify-between mb-5 pb-5" style={{ borderBottom: `1px solid ${C.border}` }}>
        <span className="font-semibold" style={{ color: C.fg }}>Total</span>
        <span className="text-2xl font-bold" style={{ color: C.fg }}>£{total}</span>
      </div>

      {!isLite && !glucoseSelected && (
        <p className="text-xs text-center mb-3" style={{ color: C.muted }}>
          Select a glucose option above to continue
        </p>
      )}

      <button
        onClick={onPay}
        disabled={isPending || (!isLite && !glucoseSelected)}
        className="w-full inline-flex items-center justify-center gap-2 rounded-xl font-semibold text-base py-3.5 transition-opacity hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
        style={{ background: C.primary, color: C.primaryFg }}
      >
        {isPending ? 'Redirecting…' : (
          <>Pay £{total} <ArrowRight className="h-4 w-4" /></>
        )}
      </button>

      {error && (
        <p className="mt-3 text-sm text-center" style={{ color: '#f87171' }}>{error}</p>
      )}

      <div className="mt-4 flex items-center justify-center gap-1.5 text-xs" style={{ color: C.muted }}>
        <Lock className="h-3 w-3" />
        Secured by Stripe · 30-day money-back
      </div>
    </div>
  );
}

// ─── Mobile Pay bar ───────────────────────────────────────────────────
function MobilePayBar({ plan, total, onPay, isPending, glucoseSelected }: { plan: Plan; total: number; onPay: () => void; isPending: boolean; glucoseSelected: boolean }) {
  const isLite = plan === 'lite';
  return (
    <div
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 p-3 flex items-center gap-3"
      style={{
        background: 'rgba(14,44,38,0.98)',
        backdropFilter: 'blur(12px)',
        borderTop: `1px solid ${C.border}`,
      }}
    >
      <div className="flex-1 min-w-0">
        <p className="text-[10px] uppercase tracking-wide" style={{ color: C.muted }}>Total</p>
        <p className="text-lg font-bold leading-none" style={{ color: C.fg }}>£{total}</p>
      </div>
      <button
        onClick={onPay}
        disabled={isPending || (!isLite && !glucoseSelected)}
        className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl font-semibold text-sm py-3 transition-opacity disabled:opacity-40"
        style={{ background: C.primary, color: C.primaryFg }}
      >
        {isPending ? 'Redirecting…' : <>Pay <ArrowRight className="h-4 w-4" /></>}
      </button>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────
export default function CheckoutPage() {
  // Default to "own" — the no-add-on path. Pay button is therefore
  // active on first paint. Choosing MultiMeter or CGM still works
  // (handleGlucoseSelect swaps the addon and re-flags selection).
  const [plan, setPlan] = useState<Plan>('starter');
  const [glucoseSelection, setGlucoseSelection] = useState<string | null>('own');
  const [quantities, setQuantities] = useState<Record<string, number>>(
    Object.fromEntries(KIT_PRODUCTS.addons.map((a) => [a.id, 0])),
  );
  const [therapySelected, setTherapySelected] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  // Read URL query params on mount: `?plan=lite` → Lite downsell;
  // `?plan=coached` (or legacy `?addon=therapy-spencer` from the
  // Coached tier card) → Coached preset (Starter + Spencer locked-on).
  // Reads window.location directly to avoid forcing a Suspense
  // boundary on the whole page.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const planParam = params.get('plan');
    if (planParam === 'lite') setPlan('lite');
    else if (planParam === 'coached' || params.get('addon') === 'therapy-spencer') {
      setPlan('coached');
      setTherapySelected(true);
    }
  }, []);

  const isLite = plan === 'lite';
  const isCoached = plan === 'coached';

  // Coached plan force-locks the Spencer addon on. If the user toggles
  // away from Coached we leave therapySelected as-is so they can keep
  // it manually if they like. Switching INTO Coached force-enables it.
  const handlePlanChange = (next: Plan) => {
    setPlan(next);
    if (next === 'coached') setTherapySelected(true);
  };

  const handleGlucoseSelect = (optionId: string, addonId: string | null) => {
    // Remove previous glucose addon if switching
    const prev = GLUCOSE_OPTIONS.find((o) => o.id === glucoseSelection);
    if (prev?.addonId) {
      setQuantities((q) => ({ ...q, [prev.addonId!]: 0 }));
    }
    setGlucoseSelection(optionId);
    if (addonId) {
      setQuantities((q) => ({ ...q, [addonId]: 1 }));
    }
  };

  const glucoseSelected = glucoseSelection !== null;

  // Addons not controlled by the glucose radio (i.e. not multimeter / syai-cgm when shown in glucose section)
  const glucoseAddonIds = GLUCOSE_OPTIONS.map((o) => o.addonId).filter(Boolean) as string[];
  const extraAddons = KIT_PRODUCTS.addons.filter((a) => !glucoseAddonIds.includes(a.id));

  const addonsTotal = useMemo(
    () =>
      KIT_PRODUCTS.addons.reduce(
        (sum, addon) => sum + addon.price * (quantities[addon.id] ?? 0),
        0,
      ),
    [quantities],
  );
  // Visible total reflects whatever the user has selected; the Stripe
  // line-items list is what's gated by THERAPY_AVAILABLE (handleCheckout
  // below). This avoids a "£0 surprise" where selecting the coach
  // showed no price change in dev environments using the placeholder ID.
  // Lite is a flat £29 downsell — no addons, no glucose, no coach.
  const total = isLite
    ? LITE_PRICE
    : KIT_PRODUCTS.baseKit.price + addonsTotal + (therapySelected ? THERAPY_PRICE : 0);

  const selectedAddons = useMemo(
    () =>
      KIT_PRODUCTS.addons
        .filter((a) => (quantities[a.id] ?? 0) > 0)
        .map((addon) => ({ addon, qty: quantities[addon.id] ?? 0 })),
    [quantities],
  );

  const setQty = (id: string, delta: number) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: Math.max(0, Math.min(9, (prev[id] ?? 0) + delta)),
    }));
  };

  const handleCheckout = () => {
    startTransition(async () => {
      setError(null);
      try {
        const body: { plan?: 'lite'; addons: { priceId: string; quantity: number }[] } = isLite
          ? { plan: 'lite', addons: [] }
          : {
              addons: KIT_PRODUCTS.addons
                .filter((a) => (quantities[a.id] ?? 0) > 0)
                .map((a) => ({ priceId: a.priceId, quantity: quantities[a.id] })),
            };
        if (!isLite && therapySelected && THERAPY_AVAILABLE) {
          body.addons.push({ priceId: THERAPY_ADDON.priceId, quantity: 1 });
        }
        const res = await fetch('/api/kit-checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });
        if (!res.ok) {
          const j = await res.json().catch(() => ({}));
          throw new Error(j.error || `Checkout failed (${res.status})`);
        }
        const { url } = await res.json();
        if (!url) throw new Error('No redirect URL returned');
        window.location.href = url;
      } catch (e: unknown) {
        const message = e instanceof Error ? e.message : 'Something went wrong';
        setError(message);
      }
    });
  };

  return (
    <div style={{ background: C.bg, minHeight: '100vh' }}>
      {/* Global navbar — same Home / About / How it works / Services /
          Partners / Pricing / Chat links the rest of the site uses,
          plus Sign in + Get Meo CTAs. Replaces the previous custom
          checkout-only nav. */}
      <Navbar />

      {/* Body */}
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-10 pt-20 sm:pt-24 pb-32 md:pb-16">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm mb-6 hover:text-white transition-colors"
          style={{ color: C.muted }}
        >
          <ArrowLeft size={14} /> Continue browsing
        </Link>

        <h1
          className="mb-2"
          style={{ color: C.fg, fontFamily: 'var(--font-serif)' }}
        >
          Complete your order
        </h1>
        <p className="text-base mb-6 max-w-2xl" style={{ color: C.muted }}>
          {isLite
            ? 'Start with the eBook and a 7-day Meo AI trial. Upgrade to the full system within 30 days and we credit the £29 toward it.'
            : 'Pay with card. Your Meo AI account is set up the moment your order ships, and your kit arrives within 72 hours.'}
        </p>

        {/* Tier toggle — three-pill switch matching /pricing tiers.
            Lite (£29) is the downsell, Starter (£149) is the default,
            Coached (£444) is Starter + Spencer's coaching locked on.
            Order is cheapest → most premium so the eye reads naturally. */}
        <div
          className="inline-flex flex-wrap items-center p-1 rounded-full mb-8 sm:mb-10"
          style={{ background: C.bgCard, border: `1px solid ${C.border}` }}
          role="tablist"
          aria-label="Choose your plan"
        >
          {([
            { id: 'lite' as const, label: 'Meo Lite', price: '£29' },
            { id: 'starter' as const, label: 'Meo Starter', price: '£149' },
            { id: 'coached' as const, label: 'Meo Coached', price: '£444' },
          ]).map((opt) => {
            const active = plan === opt.id;
            return (
              <button
                key={opt.id}
                role="tab"
                aria-selected={active}
                onClick={() => handlePlanChange(opt.id)}
                className="px-4 py-2 rounded-full text-sm font-semibold transition-colors"
                style={{
                  background: active ? C.primary : 'transparent',
                  color: active ? C.primaryFg : C.muted,
                }}
              >
                {opt.label} <span className="opacity-70">· {opt.price}</span>
              </button>
            );
          })}
        </div>

        {!isLite && (
          <div className="mb-6 sm:mb-8">
            <HeroProductCard />
          </div>
        )}

        {isLite && (
          <div
            className="mb-6 sm:mb-8 rounded-2xl overflow-hidden grid grid-cols-1 md:grid-cols-[260px_1fr]"
            style={{ background: C.bgCard, border: `1px solid ${C.border}` }}
          >
            <div
              className="flex items-center justify-center p-6"
              style={{ background: 'rgba(255,255,255,0.04)' }}
            >
              <Image
                src="/ebook-cover.jpg"
                alt="The Thin Book of Fat — Marina Young"
                width={200}
                height={280}
                className="h-[200px] w-auto object-cover rounded-xl shadow-2xl"
                priority
              />
            </div>
            <div className="p-5 sm:p-7 flex flex-col justify-between gap-5">
              <div>
                <span
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
                  style={{ background: C.pill, color: C.pillFg }}
                >
                  <DropletIcon size={12} /> Start with the book
                </span>
                <h2
                  className="mt-3 mb-2"
                  style={{ color: C.fg, fontFamily: 'var(--font-serif)', fontSize: 'clamp(24px, 3vw, 30px)' }}
                >
                  Meo Lite
                </h2>
                <p className="text-sm" style={{ color: C.muted }}>
                  eBook + 7-day Meo AI trial. No device — manual entry of past blood results.
                  Credit £29 toward Starter within 30 days.
                </p>
              </div>
              <ul className="space-y-2">
                {[
                  { icon: <FileText className="h-4 w-4" />, text: 'The Thin Book of Fat (digital)' },
                  { icon: <Brain className="h-4 w-4" />, text: '7-day Meo AI trial' },
                  { icon: <BarChart2 className="h-4 w-4" />, text: 'Manual entry of past blood results' },
                  { icon: <Check className="h-4 w-4" />, text: 'Credit £29 toward Starter within 30 days' },
                ].map((f, i) => (
                  <li key={i} className="flex items-center gap-2.5 text-sm" style={{ color: C.fg }}>
                    <span style={{ color: C.primary }}>{f.icon}</span>
                    {f.text}
                  </li>
                ))}
              </ul>
              <div
                className="flex items-baseline justify-between pt-3"
                style={{ borderTop: `1px solid ${C.border}` }}
              >
                <span className="text-sm" style={{ color: C.muted }}>One-time</span>
                <span className="text-2xl font-bold" style={{ color: C.fg }}>£{LITE_PRICE}</span>
              </div>
            </div>
          </div>
        )}

        <div className="mb-8 sm:mb-10">
          <TrustStrip />
        </div>

        <div className="grid md:grid-cols-[1fr_minmax(320px,380px)] gap-6 md:gap-10 items-start">
          <div className="space-y-8">

            {!isLite && (
            <>
            {/* ── Glucose selection (required) ── */}
            <section>
              <div className="flex items-baseline gap-3 mb-1">
                <h2
                  className="m-0"
                  style={{ color: C.fg, fontFamily: 'var(--font-serif)', fontSize: 'clamp(22px, 2.5vw, 26px)' }}
                >
                  How will you track your glucose?
                </h2>
                <span
                  className="text-xs font-semibold px-2 py-0.5 rounded-full shrink-0"
                  style={{ background: glucoseSelected ? C.pill : 'rgba(245,158,11,0.18)', color: glucoseSelected ? C.pillFg : '#f59e0b' }}
                >
                  {glucoseSelected ? '✓ Selected' : 'Required'}
                </span>
              </div>
              <p className="text-sm mb-5" style={{ color: C.muted }}>
                Your Biological Age Score requires a glucose reading alongside your lipid panel.
              </p>
              <div className="space-y-3">
                {GLUCOSE_OPTIONS.map((opt) => {
                  const isSelected = glucoseSelection === opt.id;
                  return (
                    <button
                      key={opt.id}
                      onClick={() => handleGlucoseSelect(opt.id, opt.addonId ?? null)}
                      className="w-full text-left rounded-2xl p-5 transition-all"
                      style={{
                        background: isSelected ? 'rgba(164,214,94,0.08)' : C.bgCard,
                        border: `1px solid ${isSelected ? C.primary : C.border}`,
                      }}
                    >
                      <div className="flex items-start gap-4">
                        <div
                          className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
                          style={{
                            background: isSelected ? C.pill : 'rgba(255,255,255,0.06)',
                            color: isSelected ? C.primary : C.muted,
                          }}
                        >
                          {opt.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <span className="font-semibold text-base" style={{ color: C.fg }}>
                              {opt.label}
                            </span>
                            {opt.badge && (
                              <span
                                className="text-[10px] font-semibold px-2 py-0.5 rounded"
                                style={{ background: C.pill, color: C.pillFg }}
                              >
                                {opt.badge}
                              </span>
                            )}
                            {opt.price ? (
                              <span className="font-semibold text-sm ml-auto shrink-0" style={{ color: C.fg }}>
                                +{opt.price}
                              </span>
                            ) : (
                              <span className="text-sm ml-auto shrink-0" style={{ color: C.primary }}>
                                No extra cost
                              </span>
                            )}
                          </div>
                          <p className="text-sm" style={{ color: C.muted }}>{opt.sub}</p>
                        </div>
                        <div
                          className="w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-1"
                          style={{
                            borderColor: isSelected ? C.primary : C.border,
                            background: isSelected ? C.primary : 'transparent',
                          }}
                        >
                          {isSelected && <Check className="h-3 w-3" style={{ color: C.primaryFg }} />}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>

            {/* ── Additional add-ons (non-glucose) ── */}
            {extraAddons.length > 0 && (
              <section>
                <div className="flex items-baseline justify-between mb-1">
                  <h2
                    className="m-0"
                    style={{ color: C.fg, fontFamily: 'var(--font-serif)', fontSize: 'clamp(22px, 2.5vw, 26px)' }}
                  >
                    Add to your kit
                  </h2>
                  <span className="text-xs" style={{ color: C.muted }}>Optional · up to 9 each</span>
                </div>
                <p className="text-sm mb-5" style={{ color: C.muted }}>
                  Most customers extend their Meo AI access within 2 weeks.
                </p>
                <div className="grid sm:grid-cols-2 gap-3">
                  {extraAddons.map((addon: AddonProduct) => (
                    <AddonRow
                      key={addon.id}
                      addon={addon}
                      qty={quantities[addon.id] ?? 0}
                      onDec={() => setQty(addon.id, -1)}
                      onInc={() => setQty(addon.id, +1)}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* ── Metabolic Coach (Spencer Martin) ──
                Optional add-on for the Starter plan; locked-on and
                presented as "Included" when Coached is active so the
                user has a single source of truth (the plan toggle). */}
            <section>
              <div className="flex items-baseline gap-3 mb-1">
                <h2
                  className="m-0"
                  style={{ color: C.fg, fontFamily: 'var(--font-serif)', fontSize: 'clamp(22px, 2.5vw, 26px)' }}
                >
                  {isCoached ? 'Your Metabolic Coach' : 'Add a Metabolic Coach'}
                </h2>
                <span
                  className="text-xs font-semibold px-2 py-0.5 rounded"
                  style={{
                    background: isCoached ? C.pill : 'transparent',
                    color: isCoached ? C.pillFg : C.muted,
                  }}
                >
                  {isCoached ? 'Included with Coached' : 'Optional'}
                </span>
              </div>
              <p className="text-sm mb-5" style={{ color: C.muted }}>
                {isCoached
                  ? "Spencer's 3-month coaching upgrade is bundled with the Coached plan — no extra step needed."
                  : 'Work 1-to-1 with a specialist to interpret your data and build an action plan.'}
              </p>
              {isCoached ? (
                // Coached: render as a static "included" panel — no
                // toggle, no extra price line (the £444 plan price
                // already covers it). Switching the plan toggle off
                // Coached is the way to remove it.
                <div
                  className="w-full text-left rounded-2xl p-5"
                  style={{
                    background: 'rgba(164,214,94,0.08)',
                    border: `1px solid ${C.primary}`,
                  }}
                >
                  <div className="flex items-start gap-4">
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0">
                      <Image
                        src="/spencer-martin.jpg"
                        alt="Spencer Martin"
                        fill
                        className="object-cover object-top"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="font-semibold text-base" style={{ color: C.fg }}>Spencer Martin</span>
                        <span
                          className="text-[10px] font-semibold px-2 py-0.5 rounded"
                          style={{ background: C.pill, color: C.pillFg }}
                        >
                          Metabolic Health Coach · 25+ years
                        </span>
                        <span className="text-xs ml-auto shrink-0 font-semibold" style={{ color: C.primary }}>
                          Included
                        </span>
                      </div>
                      <p className="text-sm mb-2" style={{ color: C.muted }}>
                        3-month coaching upgrade — direct access to a specialist who reads your data with you.
                      </p>
                      <ul className="space-y-0.5">
                        {['Initial 40-minute consultation', 'Two 30-minute follow-up consultations', 'Direct messaging between sessions'].map((item) => (
                          <li key={item} className="flex items-center gap-1.5 text-xs" style={{ color: C.muted }}>
                            <Check className="h-3 w-3 shrink-0" style={{ color: C.primary }} />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setTherapySelected((v) => !v)}
                  aria-pressed={therapySelected}
                  className="w-full text-left rounded-2xl p-5 transition-all"
                  style={{
                    background: therapySelected ? 'rgba(164,214,94,0.08)' : C.bgCard,
                    border: `1px solid ${therapySelected ? C.primary : C.border}`,
                  }}
                >
                  <div className="flex items-start gap-4">
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0">
                      <Image
                        src="/spencer-martin.jpg"
                        alt="Spencer Martin"
                        fill
                        className="object-cover object-top"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="font-semibold text-base" style={{ color: C.fg }}>Spencer Martin</span>
                        <span
                          className="text-[10px] font-semibold px-2 py-0.5 rounded"
                          style={{ background: C.pill, color: C.pillFg }}
                        >
                          Metabolic Health Coach · 25+ years
                        </span>
                        <span className="font-semibold text-sm ml-auto shrink-0" style={{ color: C.fg }}>+£{THERAPY_PRICE}</span>
                      </div>
                      <p className="text-sm mb-2" style={{ color: C.muted }}>
                        3-month coaching upgrade — direct access to a specialist who reads your data with you.
                      </p>
                      <ul className="space-y-0.5">
                        {['Initial 40-minute consultation', 'Two 30-minute follow-up consultations', 'Direct messaging between sessions'].map((item) => (
                          <li key={item} className="flex items-center gap-1.5 text-xs" style={{ color: C.muted }}>
                            <Check className="h-3 w-3 shrink-0" style={{ color: C.primary }} />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div
                      className="w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-1"
                      style={{
                        borderColor: therapySelected ? C.primary : C.border,
                        background: therapySelected ? C.primary : 'transparent',
                      }}
                    >
                      {therapySelected && <Check className="h-3 w-3" style={{ color: C.primaryFg }} />}
                    </div>
                  </div>
                </button>
              )}
            </section>

            </>
            )}

            {!isLite && (
            <section
              className="rounded-2xl p-5 sm:p-6"
              style={{ background: C.bgCard, border: `1px solid ${C.border}` }}
            >
              <h3 className="mb-1.5" style={{ color: C.fg }}>Shipping &amp; payment</h3>
              <p className="text-sm" style={{ color: C.muted }}>
                Your email and shipping address are collected on the next step (Stripe Checkout).
                We ship from London within 72 hours · £9.99 shipping · tracked delivery.
              </p>
            </section>
            )}

            {isLite && (
            <section
              className="rounded-2xl p-5 sm:p-6"
              style={{ background: C.bgCard, border: `1px solid ${C.border}` }}
            >
              <h3 className="mb-1.5" style={{ color: C.fg }}>What you get</h3>
              <p className="text-sm" style={{ color: C.muted }}>
                Instant download of the eBook + a 7-day trial of Meo AI activated on the email
                you provide at Stripe Checkout. No physical shipment.
              </p>
            </section>
            )}

            {!isLite && (
            <section
              className="rounded-2xl p-5 sm:p-6 flex items-start gap-4"
              style={{
                background: `linear-gradient(140deg, ${C.bgCard}, rgba(164,214,94,0.10))`,
                border: `1px solid ${C.primary}`,
              }}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: C.pill }}
              >
                <Shield className="h-6 w-6" style={{ color: C.primary }} />
              </div>
              <div>
                <p className="font-semibold mb-1" style={{ color: C.fg }}>
                  30-day &ldquo;start seeing, or send it back&rdquo; guarantee
                </p>
                <p className="text-sm" style={{ color: C.muted }}>
                  Use Meo for 30 days. If you don&apos;t feel clearer and in control, return the device.
                  Full refund on the device. No questions asked.
                </p>
              </div>
            </section>
            )}
          </div>

          {/* Right — sticky order summary */}
          <aside className="md:sticky md:top-24 md:max-h-[calc(100vh-7rem)] md:overflow-y-auto">
            <OrderSummary
              plan={plan}
              selectedAddons={selectedAddons}
              therapySelected={therapySelected}
              total={total}
              onPay={handleCheckout}
              isPending={isPending}
              error={error}
              glucoseSelected={glucoseSelected}
            />
          </aside>
        </div>
      </div>

      <MobilePayBar plan={plan} total={total} onPay={handleCheckout} isPending={isPending} glucoseSelected={glucoseSelected} />
      <Footer />
    </div>
  );
}
