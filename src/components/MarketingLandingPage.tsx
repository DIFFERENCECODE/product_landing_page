'use client';

/**
 * Meo — Metabolic Intelligence System · funnel landing page.
 *
 * The copy in each section is the source of truth implementation of
 * FUNNEL.md. When iterating on wording, update FUNNEL.md first, then
 * mirror here so the marketing team and the site stay in sync.
 *
 * Structure (top to bottom):
 *   1. Navbar            — sticky, brand + single CTA
 *   2. Hero              — headline, subhead, price, primary CTA
 *   3. ProblemSection    — agitation, data-sparse life
 *   4. WhyTestsFail      — standard vs. Meo comparison table
 *   5. MeetMeoSection    — "it's a system, not a device"
 *   6. BiomarkersSection — 5 markers, 1 drop of blood
 *   7. LipidTracking     — deep-dive on the meter's value
 *   8. InsulinPattern    — Kraft-style pattern insight (simplified,
 *                          compliance-safe)
 *   9. BioAgeSection     — the single-number compass
 *  10. MeoAISection      — CORE differentiator (heavy emphasis)
 *  11. EbookSection      — action manual
 *  12. BenefitsSection   — outcome bullets
 *  13. NumbersVsInsights — "what a meter gives you vs what Meo gives you"
 *  14. TestimonialsSection
 *  15. ObjectionsSection — accuracy, ease, trust, price
 *  16. GuaranteeSection  — 30-day "see it move or send it back"
 *  17. AddonsSection     — upsells at the order-review moment
 *  18. FAQSection
 *  19. NewsletterSection — waitlist capture
 *  20. Footer            — compliance footer + copyright
 *  + StickyMobileCTA     — always-visible buy button on mobile
 */

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowRight,
  Heart,
  BarChart2,
  Activity,
  RefreshCw,
  BookOpen,
  MessageCircle,
  ChevronDown,
  ShoppingCart,
  Mail,
  Brain,
  Clock,
  Shield,
  Sparkles,
  Check,
  Quote,
  TrendingUp,
  AlertCircle,
} from 'lucide-react';
import {
  KIT_PRODUCT,
  KIT_ADDONS,
  BIOMARKERS,
  FAQ_ITEMS,
  formatGBP,
} from '@/lib/kitProducts';
import { BioAgeDial, KraftCurve, EbookCover, LipidDroplet } from './Visuals';

// ─── Brand colours ───────────────────────────────────────────────────
const C = {
  bg: '#1c4a40',
  bgDeep: '#143730',
  bgCard: 'rgba(30, 70, 60, 0.85)',
  bgCardHover: 'rgba(38, 80, 68, 0.95)',
  border: 'rgba(255,255,255,0.10)',
  primary: '#a4d65e',
  primaryFg: '#1a3a2a',
  fg: '#ffffff',
  muted: 'rgba(255,255,255,0.62)',
  pill: 'rgba(164,214,94,0.18)',
  pillFg: '#a4d65e',
  danger: '#f59e0b',
};

// ─── Logo mark ───────────────────────────────────────────────────────
function DropletIcon({ size = 20 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={C.primary}
      style={{ display: 'inline-block' }}
    >
      <path d="M12 2C12 2 5 10 5 15C5 19.4183 8.13401 23 12 23C15.866 23 19 19.4183 19 15C19 10 12 2 12 2Z" />
    </svg>
  );
}

// ─── Feature icon map ────────────────────────────────────────────────
const FEATURE_ICONS: Record<string, React.ReactNode> = {
  heart: <Heart className="h-5 w-5" style={{ color: C.primary }} />,
  'bar-chart': <BarChart2 className="h-5 w-5" style={{ color: C.primary }} />,
  activity: <Activity className="h-5 w-5" style={{ color: C.primary }} />,
  refresh: <RefreshCw className="h-5 w-5" style={{ color: C.primary }} />,
  book: <BookOpen className="h-5 w-5" style={{ color: C.primary }} />,
  message: <MessageCircle className="h-5 w-5" style={{ color: C.primary }} />,
};

// ─── Shared CTA button ───────────────────────────────────────────────
function CTAButton({
  children = <>Get your Metabolic Health Tracker <ArrowRight className="h-4 w-4" /></>,
  variant = 'primary',
  size = 'md',
}: {
  children?: React.ReactNode;
  variant?: 'primary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}) {
  const paddings = size === 'sm' ? 'px-5 py-2.5 text-sm' : size === 'lg' ? 'px-10 py-4 text-base' : 'px-8 py-3.5 text-base';
  const styleMap: Record<string, React.CSSProperties> = {
    primary: { background: C.primary, color: C.primaryFg },
    ghost: { background: 'transparent', color: C.fg, border: `1px solid ${C.border}` },
  };
  return (
    <Link
      href="/checkout"
      className={`inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-opacity hover:opacity-90 ${paddings}`}
      style={styleMap[variant]}
    >
      {children}
    </Link>
  );
}

// ─── Section header ─────────────────────────────────────────────────
function SectionHeader({
  eyebrow,
  title,
  subtitle,
  align = 'center',
}: {
  eyebrow?: string;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  align?: 'center' | 'left';
}) {
  return (
    <div className={align === 'center' ? 'text-center' : 'text-left'}>
      {eyebrow && (
        <p className="text-xs font-semibold tracking-wide mb-3" style={{ color: C.pillFg }}>
          {eyebrow}
        </p>
      )}
      <h2
        className="font-extrabold mb-4 leading-tight"
        style={{ color: C.fg, fontFamily: 'var(--font-serif), "Cabinet Grotesk", -apple-system, BlinkMacSystemFont, sans-serif', fontSize: 'clamp(28px, 4vw, 40px)' }}
      >
        {title}
      </h2>
      {subtitle && (
        <p className={`text-base ${align === 'center' ? 'max-w-2xl mx-auto' : 'max-w-xl'}`} style={{ color: C.muted }}>
          {subtitle}
        </p>
      )}
    </div>
  );
}

// ─── Navbar ──────────────────────────────────────────────────────────
function Navbar() {
  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4"
      style={{ background: 'rgba(28,74,64,0.92)', backdropFilter: 'blur(12px)', borderBottom: `1px solid ${C.border}` }}
    >
      <Link href="/" className="flex items-center gap-1.5" aria-label="Meo home">
        {/* Wordmark: literal "Meo" letters + droplet icon. The droplet
            sits inline at slightly larger size so it visually anchors
            the brand glyph alongside the wordmark. */}
        <span
          className="text-xl font-bold tracking-tight"
          style={{
            color: C.fg,
            fontFamily: 'var(--font-serif), "Cabinet Grotesk", -apple-system, BlinkMacSystemFont, sans-serif',
          }}
        >
          Meo
        </span>
        <DropletIcon size={22} />
        <span className="hidden sm:inline text-xs ml-2 tracking-wide" style={{ color: C.muted }}>
          Metabolic Intelligence
        </span>
      </Link>

      <div className="flex items-center gap-3">
        <span className="hidden sm:inline text-xs" style={{ color: C.muted }}>
          30-day guarantee
        </span>
        <Link
          href="/checkout"
          className="flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm transition-opacity hover:opacity-90"
          style={{ background: C.primary, color: C.primaryFg }}
        >
          <ShoppingCart className="h-4 w-4" />
          <span className="hidden sm:inline">Get Meo</span>
        </Link>
      </div>
    </nav>
  );
}

// ─── Hero ────────────────────────────────────────────────────────────
//
// Centered hero based on the user-provided reference (SpineEdge-style):
//   - eyebrow chip
//   - giant headline with an inline pill-shaped product image
//     embedded between two words
//   - tightly-scoped subhead
//   - single primary CTA + secondary text-link CTA
//   - horizontally-scrolling feature strip with checkmarks at the
//     bottom (radial fade on edges, drag-to-scroll on touch, hidden
//     native scrollbar)
// Hero pill — a random gradient picked on each pageload. Brand
// palette only (greens, teals, the warm accent oranges) so it
// always feels on-brand regardless of which one comes up.
const PILL_GRADIENTS = [
  'linear-gradient(135deg, #a4d65e 0%, #2d6a4f 100%)',
  'linear-gradient(135deg, #cdf08a 0%, #1c4a40 100%)',
  'linear-gradient(135deg, #2d6a4f 0%, #0a1f1a 100%)',
  'linear-gradient(45deg, #a4d65e 0%, #f59e0b 100%)',
  'linear-gradient(135deg, #f59e0b 0%, #1c4a40 100%)',
  'linear-gradient(135deg, #1c4a40 0%, #5a8a4d 50%, #a4d65e 100%)',
  'radial-gradient(circle at 30% 30%, #a4d65e 0%, #1c4a40 70%)',
  'conic-gradient(from 200deg at 50% 50%, #a4d65e, #2d6a4f, #143730, #a4d65e)',
];

function Hero() {
  // Pick a random pill gradient on mount. SSR renders a stable default
  // (first item) — useEffect rolls the dice on the client so each
  // pageload gets a different look without hydration mismatch.
  const [pillGradient, setPillGradient] = useState(PILL_GRADIENTS[0]);
  useEffect(() => {
    const next = PILL_GRADIENTS[Math.floor(Math.random() * PILL_GRADIENTS.length)];
    setPillGradient(next);
  }, []);

  // Same idea but for the soft background accent behind the section —
  // gives the whole hero a subtly different mood per visit.
  const sectionAccent = useMemo(() => {
    const angles = [120, 160, 220, 300];
    const ang = angles[Math.floor(Math.random() * angles.length)];
    return `radial-gradient(ellipse 60% 50% at ${ang === 120 ? '30% 10%' : ang === 160 ? '70% 15%' : ang === 220 ? '20% 80%' : '80% 60%'}, rgba(164,214,94,0.10) 0%, rgba(164,214,94,0) 60%)`;
  }, []);

  // Two distinct lists so the two rows show different content while
  // sliding in opposite directions — feels less repetitive than the
  // same row mirrored.
  const featuresRowA = [
    'Lab-grade lipid panel · 3 minutes',
    "World's first and only Metabolic Health AI!",
    '6 months of Meo AI included',
    '30-day money-back guarantee',
    '1 of only 3 lipid meters registered for home use in UK & EU',
    'Ships in 72 hours · limited quantities',
  ];
  const featuresRowB = [
    'Tracked delivery',
    '10 lipid test strips + lancets + carry case included',
    'Q&A with the book author, Marina Young via Meo',
    'Biological Age Score + your Target Score',
    '10 years of leadership industrialising the Kraft Test',
  ];

  return (
    <section
      className="relative min-h-screen flex flex-col justify-center pt-24 pb-12 sm:pb-16 px-5 sm:px-6 overflow-hidden"
      style={{ background: C.bg }}
    >
      {/* Soft radial accent — randomised per pageload so the hero
          has a different mood each visit (light source position
          shifts across upper-left / upper-right / lower-left). */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ background: sectionAccent }}
      />

      <div className="relative max-w-5xl mx-auto w-full text-center">
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium mb-6 sm:mb-8"
          style={{ background: C.pill, color: C.pillFg }}
        >
          <Sparkles className="h-3.5 w-3.5" />
          Metabolic Intelligence System
        </motion.div>

        {/* Headline with inline pill image */}
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.05 }}
          className="font-bold leading-[1.05] mb-6 sm:mb-8"
          style={{
            color: C.fg,
            fontSize: 'clamp(36px, 6.5vw, 76px)',
            letterSpacing: '-0.02em',
          }}
        >
          See what your{' '}
          <span
            className="inline-flex align-middle rounded-full overflow-hidden mx-1 sm:mx-2 items-center justify-center"
            style={{
              width: 'clamp(80px, 11vw, 140px)',
              height: 'clamp(50px, 7vw, 86px)',
              background: pillGradient,
              border: `1px solid ${C.border}`,
              verticalAlign: '-0.18em',
              boxShadow: '0 10px 30px rgba(0,0,0,0.25)',
            }}
            aria-hidden
          >
            <Image
              src="/lipid-meter.png"
              alt=""
              width={183}
              height={300}
              className="h-[88%] w-auto object-contain"
              priority
            />
          </span>{' '}
          cholesterol
          <br className="hidden sm:block" />
          <span> is </span>
          <span style={{ color: C.primary }}>actually</span> telling you.
        </motion.h1>

        {/* Subhead */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="text-base sm:text-lg mx-auto mb-8 sm:mb-10 max-w-xl"
          style={{ color: C.muted }}
        >
          Meo turns a 3-minute finger-prick into a complete metabolic picture —
          interpreted by AI, framed for your longevity, and actionable the same day.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4"
        >
          <CTAButton size="lg">
            Start with 6 months of Meo · {formatGBP(KIT_PRODUCT.price)} <ArrowRight className="h-4 w-4" />
          </CTAButton>
          <button
            onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
            className="text-sm hover:underline cursor-pointer bg-transparent border-0 p-0"
            style={{ color: C.muted }}
          >
            See how it works ↓
          </button>
        </motion.div>

        {/* Trust line under CTA — single-line summary kept short so it
            doesn't compete with the CTA visually. The richer trust
            grid lives below as separate cards. */}
        <p className="text-xs mt-3" style={{ color: C.muted }}>
          Lipid meter included free · 30-day money-back guarantee
        </p>
        <UrgencyBadge />

        {/* Credential pill — the campaign brief's strongest single
            differentiator, surfaced near the CTA so it's visible
            without scrolling on most screens. Targets the 40+
            audience signal-checking before they commit. */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="inline-flex items-center gap-2 mt-6 sm:mt-8 px-4 py-2 rounded-full text-xs font-medium"
          style={{
            background: 'rgba(164,214,94,0.08)',
            border: `1px solid ${C.primary}40`,
            color: C.fg,
          }}
        >
          <Sparkles className="h-3.5 w-3.5" style={{ color: C.primary }} />
          Built on ten years of industrialising the gold-standard Kraft Test
        </motion.div>

        {/* Trust badge grid — 4 visible signals tuned for the 40+
            scare-driven buyer. Each badge is a single icon + one
            short line; they're side-by-side on desktop, 2x2 on
            mobile. Order picked deliberately:
              1. Money-back  (risk reversal first — biggest objection killer)
              2. EU registered (clinical credibility)
              4. Free retest (concrete deliverable that's not just a refund)
            Position: outside the hero `text-center` block so it spans
            full width on mobile but still sits above the marquee. */}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.45 }}
        className="relative max-w-xl mx-auto w-full mt-8 sm:mt-10 grid grid-cols-1 sm:grid-cols-3 gap-3"
      >
        {[
          { icon: <Heart className="h-4 w-4" />, label: '30-day', sub: 'money-back guarantee' },
          { icon: <Activity className="h-4 w-4" />, label: 'UK & EU IVDR Registered', sub: '1 of only 3 lipid meters' },
          { icon: <Clock className="h-4 w-4" />, label: 'Ships in 72 hrs', sub: 'limited quantities' },
        ].map((b, i) => (
          <div
            key={i}
            className="flex items-center gap-2.5 rounded-xl px-3 py-2.5"
            style={{ background: C.bgCard, border: `1px solid ${C.border}` }}
          >
            <div
              className="flex h-8 w-8 items-center justify-center rounded-lg shrink-0"
              style={{ background: 'rgba(164,214,94,0.12)', color: C.primary }}
            >
              {b.icon}
            </div>
            <div className="min-w-0 leading-tight">
              <div className="text-xs font-semibold" style={{ color: C.fg }}>{b.label}</div>
              <div className="text-[11px]" style={{ color: C.muted }}>{b.sub}</div>
            </div>
          </div>
        ))}
      </motion.div>

      {/* Cross marquee — two rows, opposite directions.
          Top row slides left (default direction).
          Bottom row slides right via .marquee-track-reverse.
          Both pause when the user hovers the wrapper. Each track is
          duplicated so the loop is seamless. */}
      <div
        className="marquee relative mt-12 sm:mt-16 w-full overflow-hidden space-y-3 sm:space-y-4"
        style={{
          maskImage:
            'linear-gradient(90deg, transparent 0, black 8%, black 92%, transparent 100%)',
          WebkitMaskImage:
            'linear-gradient(90deg, transparent 0, black 8%, black 92%, transparent 100%)',
        }}
        aria-label="Key Meo features"
      >
        {/* Row A — slides left */}
        <div className="marquee-track">
          {[...featuresRowA, ...featuresRowA].map((label, i) => (
            <div
              key={`a-${i}`}
              className="shrink-0 inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-sm mr-3"
              style={{
                background: C.bgCard,
                border: `1px solid ${C.border}`,
                color: C.fg,
              }}
            >
              <Check className="h-4 w-4 shrink-0" style={{ color: C.primary }} />
              <span className="whitespace-nowrap">{label}</span>
            </div>
          ))}
        </div>

        {/* Row B — slides right (reversed) */}
        <div className="marquee-track marquee-track-reverse">
          {[...featuresRowB, ...featuresRowB].map((label, i) => (
            <div
              key={`b-${i}`}
              className="shrink-0 inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-sm mr-3"
              style={{
                background: C.bgCard,
                border: `1px solid ${C.border}`,
                color: C.fg,
              }}
            >
              <Check className="h-4 w-4 shrink-0" style={{ color: C.primary }} />
              <span className="whitespace-nowrap">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Problem / Agitation ─────────────────────────────────────────────
function ProblemSection() {
  const items = [
    "You don't know if yesterday's meal moved your lipids — until 12 months from now.",
    "You don't know if last week's sleep collapse nudged your insulin response.",
    "You don't know whether the supplement you've taken for six months is doing anything.",
    "And nobody tells you whether a 42-year-old's TC/HDL ratio should really be where yours is.",
  ];
  return (
    <section className="py-16 sm:py-24 px-5 sm:px-6" style={{ background: C.bgDeep }}>
      <div className="max-w-4xl mx-auto">
        <SectionHeader
          eyebrow="The visibility problem"
          title={<>Cholesterol changes daily. Most people check it once a year.</>}
          subtitle="One reading a year. A 90-second conversation. By the time a number 'trends up', the process behind it has been quietly accelerating for half a decade. We've spent ten years industrialising the gold-standard Kraft Test so you don't have to wait for the next annual blood draw to see what your metabolism is doing."
        />

        <div className="mt-10 grid sm:grid-cols-2 gap-4">
          {items.map((it, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.07 }}
              className="flex items-start gap-3 rounded-2xl p-5"
              style={{ background: C.bgCard, border: `1px solid ${C.border}` }}
            >
              <AlertCircle className="h-5 w-5 mt-0.5 shrink-0" style={{ color: C.danger }} />
              <p className="text-sm" style={{ color: C.fg }}>{it}</p>
            </motion.div>
          ))}
        </div>

        <p className="mt-10 text-center text-lg font-medium" style={{ color: C.primary, fontFamily: 'var(--font-serif), "Cabinet Grotesk", -apple-system, BlinkMacSystemFont, sans-serif' }}>
          That isn&apos;t a willpower problem. That&apos;s a visibility problem — and Meo fixes it.
        </p>
      </div>
    </section>
  );
}

// ─── Why Standard Tests Fail ─────────────────────────────────────────
function WhyTestsFailSection() {
  // Three columns: standard test → what's missing → what Meo does.
  // Closes the loop from problem statement to product positioning
  // without repeating the campaign-brief differentiators verbatim.
  const rows: [string, string, string][] = [
    [
      'Only measures fasting values',
      'Your body is metabolic 23 hours a day, not just first thing in the morning',
      'Tests whenever you want — at home, in 3 minutes, from one finger-prick',
    ],
    [
      'Gives you one snapshot',
      'You need the trend to see what is actually happening',
      'Stitches every reading into your personal trend so drift is visible early',
    ],
    [
      'Reports Total Cholesterol',
      'The ratios (TC/HDL, LDL/HDL) and the insulin pattern predict outcomes',
      'Reads HDL, LDL, TG, ratios + a Kraft-style insulin response on every test',
    ],
    [
      'Treats you like the median 50-year-old',
      'You are not the median 50-year-old',
      'Benchmarks you against your own readings — your baseline, not a population',
    ],
    [
      'Arrives as raw numbers',
      'You need to know: getting better, worse, or holding?',
      'The world’s only metabolic-health AI explains every reading in plain English',
    ],
    [
      'Sits in a clinic / a queue / a fasting morning',
      'Convenience determines whether you actually do it consistently',
      'One of only three lipid meters registered for Home Use in the UK & EU',
    ],
  ];
  return (
    <section className="py-16 sm:py-24 px-5 sm:px-6" style={{ background: C.bg }}>
      <div className="max-w-5xl mx-auto">
        <SectionHeader
          eyebrow="Why the standard blood test fails"
          title={<>One number. Once a year. In a language you weren&apos;t taught.</>}
        />
        <div
          className="mt-10 rounded-2xl overflow-hidden"
          style={{ background: C.bgCard, border: `1px solid ${C.border}` }}
        >
          {/* Header row — visible only on sm+ since the stacked mobile
              layout has inline labels on each cell. */}
          <div
            className="hidden sm:grid grid-cols-3 text-xs font-semibold tracking-wide px-6 py-4"
            style={{ background: 'rgba(255,255,255,0.04)', color: C.muted }}
          >
            <div>Standard blood test</div>
            <div>What&apos;s missing</div>
            <div style={{ color: C.primary }}>What Meo does</div>
          </div>
          {rows.map(([l, m, r], i) => (
            <div
              key={i}
              className="px-5 sm:px-6 py-5 text-sm grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-6"
              style={{ borderTop: `1px solid ${C.border}` }}
            >
              <div style={{ color: C.muted }}>
                <span
                  className="sm:hidden block text-[10px] font-semibold tracking-wide mb-1"
                  style={{ color: C.pillFg }}
                >
                  Standard test
                </span>
                {l}
              </div>
              <div style={{ color: C.fg }}>
                <span
                  className="sm:hidden block text-[10px] font-semibold tracking-wide mb-1"
                  style={{ color: C.pillFg }}
                >
                  What&apos;s missing
                </span>
                {m}
              </div>
              <div style={{ color: C.fg }}>
                <span
                  className="sm:hidden block text-[10px] font-semibold tracking-wide mb-1"
                  style={{ color: C.primary }}
                >
                  What Meo does
                </span>
                {r}
              </div>
            </div>
          ))}
        </div>
        <p className="mt-10 text-center font-medium text-lg max-w-2xl mx-auto" style={{ color: C.fg }}>
          The core problem isn&apos;t the test. It&apos;s the gap between <span style={{ color: C.primary }}>data</span> and <span style={{ color: C.primary }}>decision</span> — and that gap is what £149 of Meo closes.
        </p>
      </div>
    </section>
  );
}

// ─── Meet Meo (system intro) ─────────────────────────────────────────
function MeetMeoSection() {
  const pieces = [
    { icon: <Activity className="h-6 w-6" style={{ color: C.primary }} />, title: 'The Digital Lipid Meter', sub: 'draws the data' },
    { icon: <Brain className="h-6 w-6" style={{ color: C.primary }} />, title: 'The Meo AI App', sub: 'turns data into meaning' },
    { icon: <BarChart2 className="h-6 w-6" style={{ color: C.primary }} />, title: 'Your Biological Age Score', sub: 'tracks your progress over time' },
  ];
  return (
    <section id="how-it-works" className="py-16 sm:py-24 px-5 sm:px-6" style={{ background: C.bgDeep }}>
      <div className="max-w-5xl mx-auto">
        <SectionHeader
          eyebrow="Meet Meo"
          title={<>Meo is a <span style={{ color: C.primary }}>system</span>. Not a gadget.</>}
          subtitle="Three pieces that only work together. Sold separately, any one is a curiosity. Together, they are a closed loop you can run at home every week, for the rest of your life."
        />
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-5">
          {pieces.map((p, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="rounded-2xl p-6 text-center"
              style={{ background: C.bgCard, border: `1px solid ${C.border}` }}
            >
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
                style={{ background: C.pill }}
              >
                {p.icon}
              </div>
              <p className="font-semibold mb-1" style={{ color: C.fg, fontSize: '18px' }}>{p.title}</p>
              <p className="text-sm" style={{ color: C.muted }}>{p.sub}</p>
            </motion.div>
          ))}
        </div>
        <div className="text-center mt-12">
          <CTAButton>Explore how it works <ArrowRight className="h-4 w-4" /></CTAButton>
        </div>
      </div>
    </section>
  );
}

// ─── Offer Stack ─────────────────────────────────────────────────────
//
// High-leverage conversion section: itemises everything in the £149
// bundle with individual market values, sums to a much larger number,
// strikethroughs it, and lands on £149 as the "you actually pay".
// Why this format works for the 40+ scare-driven buyer:
//   - anchors them on £362 of perceived value before they see £149
//   - itemising forces them to mentally accept each component as
//     genuinely valuable, which makes the bundle feel undervalued
//   - the math is simple and explicit (no hand-wavy "best deal" claims)
//   - the strikethrough is a visual heuristic the brain processes
//     instantly without reading the line items
function OfferStackSection() {
  const items = [
    { label: '6 months of Meo AI access',          value: 17400, note: '£29/mo at the standard rate' },
    { label: 'Digital Lipid Meter',                value: 8000,  note: 'UK & EU Registered · Bundled' },
    { label: '10 Lipid Test Strips',               value: 2200,  note: 'enough for 10 readings included' },
    { label: 'Lancets',                            value: 800,   note: 'included in the kit' },
    { label: 'Carry Case',                         value: 1200,  note: 'included in the kit' },
    { label: 'Biological Age Score + Your Target',      value: 4000,  note: 'baseline + ongoing goal' },
  ] as const;
  const total = items.reduce((s, x) => s + x.value, 0);
  const price = KIT_PRODUCT.price;
  const savings = total - price;

  return (
    <section className="py-16 sm:py-24 px-5 sm:px-6" style={{ background: C.bg }}>
      <div className="max-w-3xl mx-auto">
        <SectionHeader
          eyebrow="What's actually in the £149"
          title={<>You&apos;re buying <span style={{ color: C.primary }}>{formatGBP(total)}</span> of value for {formatGBP(price)}.</>}
          subtitle="No promo, no countdown, no flash sale. Every item is listed so you can see exactly what you are getting — and what it costs outside the bundle."
        />

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-10 rounded-2xl overflow-hidden"
          style={{ background: C.bgCard, border: `1px solid ${C.border}` }}
        >
          {items.map((it, i) => (
            <div
              key={i}
              className="flex items-baseline justify-between gap-4 px-5 sm:px-6 py-4"
              style={{ borderBottom: i < items.length - 1 ? `1px solid ${C.border}` : 'none' }}
            >
              <div className="min-w-0 flex-1">
                <div className="text-sm font-medium" style={{ color: C.fg }}>{it.label}</div>
                <div className="text-xs mt-0.5" style={{ color: C.muted }}>{it.note}</div>
              </div>
              <div className="text-sm font-semibold tabular-nums" style={{ color: C.muted }}>
                {formatGBP(it.value)}
              </div>
            </div>
          ))}

          {/* Totals row */}
          <div
            className="px-5 sm:px-6 py-4 flex items-baseline justify-between gap-4"
            style={{ borderTop: `1px solid ${C.border}` }}
          >
            <div className="text-sm font-medium" style={{ color: C.muted }}>Total individual value</div>
            <div className="text-sm font-semibold line-through tabular-nums" style={{ color: C.muted }}>
              {formatGBP(total)}
            </div>
          </div>

          {/* You pay row */}
          <div
            className="px-5 sm:px-6 py-4 flex items-baseline justify-between gap-4"
            style={{ borderTop: `1px solid ${C.border}` }}
          >
            <div className="text-sm font-medium" style={{ color: C.fg }}>You pay</div>
            <div
              className="text-3xl font-extrabold tabular-nums"
              style={{ color: C.fg, fontFamily: 'var(--font-serif), "Cabinet Grotesk", -apple-system, BlinkMacSystemFont, sans-serif' }}
            >
              {formatGBP(price)}
            </div>
          </div>

          {/* You save row — most prominent */}
          <div
            className="px-5 sm:px-6 py-4 flex items-center justify-between gap-4"
            style={{ background: 'rgba(164,214,94,0.12)', borderTop: `1px solid rgba(164,214,94,0.4)` }}
          >
            <div className="text-sm font-bold" style={{ color: C.primary }}>You save</div>
            <div className="text-2xl font-extrabold tabular-nums" style={{ color: C.primary }}>
              {formatGBP(savings)}
            </div>
          </div>
        </motion.div>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
          <CTAButton size="lg">
            Start with 6 months of Meo · {formatGBP(price)} <ArrowRight className="h-4 w-4" />
          </CTAButton>
          <span className="text-xs" style={{ color: C.muted }}>
            30-day money-back guarantee  </span>
        </div>
      </div>
    </section>
  );
}

// ─── Biomarkers ──────────────────────────────────────────────────────
function BiomarkersSection() {
  return (
    <section className="py-16 sm:py-24 px-5 sm:px-6" style={{ background: C.bg }}>
      <div className="max-w-5xl mx-auto text-center">
        <SectionHeader
          eyebrow="What Meo measures"
          title={<>Six markers — Life Changing Visualisations — One drop of Blood</>}
          subtitle="A lab-grade cholesterol panel — right on your kitchen table."
        />
        <div className="mt-12 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {BIOMARKERS.map((bm, i) => (
            <motion.div
              key={bm.abbr}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="rounded-2xl p-5 flex flex-col items-center gap-2"
              style={{ background: C.bgCard, border: `1px solid ${C.border}` }}
            >
              <p className="font-bold" style={{ color: bm.abbr === 'Bio Age' ? C.primary : C.fg, fontSize: '20px' }}>
                {bm.abbr}
              </p>
              <p className="text-xs text-center" style={{ color: C.muted }}>{bm.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Lipid tracking deep-dive ────────────────────────────────────────
function LipidTrackingSection() {
  return (
    <section className="py-16 sm:py-24 px-5 sm:px-6" style={{ background: C.bgDeep }}>
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="rounded-3xl overflow-hidden flex items-center justify-center p-6"
          style={{ background: C.bgCard, border: `1px solid ${C.border}` }}
        >
          <Image
            src="/lipid-meter.png"
            alt="Meo Digital Lipid Meter — finger-prick, strip, 3 minutes"
            width={400}
            height={655}
            className="h-[300px] w-auto object-contain"
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <p className="text-xs font-semibold tracking-wide mb-3" style={{ color: C.pillFg }}>
            The device
          </p>
          <h2 className="font-extrabold mb-5" style={{ color: C.fg, fontFamily: 'var(--font-serif), "Cabinet Grotesk", -apple-system, BlinkMacSystemFont, sans-serif', fontSize: 'clamp(28px, 4vw, 36px)' }}>
            A lab&apos;s precision. Your kitchen table&apos;s convenience.
          </h2>
          <p className="text-base mb-8" style={{ color: C.muted }}>
            From a single finger-prick. In under 3 minutes. As often as you want.
          </p>
          <ul className="space-y-3 mb-8">
            {[
              'Total Cholesterol (TC)',
              'HDL — the protective fraction',
              'LDL — the fraction usually under the microscope',
              'Triglycerides (TG) — the metabolic-stress signal most physicals miss',
              'TC/HDL ratio — what most cardiologists now watch over any single number',
            ].map((m, i) => (
              <li key={i} className="flex items-start gap-3 text-sm" style={{ color: C.fg }}>
                <Check className="h-4 w-4 mt-0.5 shrink-0" style={{ color: C.primary }} />
                {m}
              </li>
            ))}
          </ul>
          <CTAButton>Start reading at home <ArrowRight className="h-4 w-4" /></CTAButton>
        </motion.div>
      </div>
    </section>
  );
}

// ─── Kraft-style insulin pattern (compliance-safe, simplified) ──────
function InsulinPatternSection() {
  return (
    <section className="py-16 sm:py-24 px-5 sm:px-6" style={{ background: C.bg }}>
      <div className="max-w-5xl mx-auto">
        <SectionHeader
          eyebrow="Pattern insight"
          title={<>The <span style={{ color: C.primary }}>pattern</span> behind the number.</>}
        />
        <div className="mt-10 grid grid-cols-1 md:grid-cols-[1fr_1.1fr] gap-10 items-center">
          <div className="space-y-5 text-base" style={{ color: C.muted }}>
            <p>
              Decades ago, cardiologist Dr. Joseph Kraft showed that much of what we now call &quot;pre-diabetes&quot; is visible in insulin response patterns years before a standard fasting glucose test picks anything up.
            </p>
            <p>
              Meo AI reads patterns inspired by that framework — analysed across your lipid readings over time — and surfaces a simplified <strong style={{ color: C.fg }}>insulin-pattern signal</strong>.
            </p>
            <p className="font-medium" style={{ color: C.fg }}>
              It is not a diagnosis. It&apos;s a pattern flag: a gentle nudge that says <em>&quot;something here is worth watching.&quot;</em>
            </p>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="rounded-2xl p-5 sm:p-6"
            style={{ background: C.bgCard, border: `1px solid ${C.border}` }}
          >
            <div className="flex items-baseline justify-between mb-3">
              <p className="text-xs tracking-wide" style={{ color: C.muted }}>
                Insulin response · 3 hours
              </p>
              <p className="text-xs" style={{ color: C.muted }}>
                Illustrative
              </p>
            </div>
            <KraftCurve width={520} height={220} />
          </motion.div>
        </div>
        <div
          className="mt-8 rounded-2xl p-5 flex items-start gap-4 max-w-3xl mx-auto"
          style={{ background: C.bgCard, border: `1px solid ${C.border}` }}
        >
          <Quote className="h-5 w-5 mt-1 shrink-0" style={{ color: C.primary }} />
          <p className="italic text-sm" style={{ color: C.fg }}>
            Think of it the way a financial advisor reads a trend line — not the way a doctor reads a lab result.
          </p>
        </div>
      </div>
    </section>
  );
}

// ─── Biological Age Score ────────────────────────────────────────────
function BioAgeSection() {
  return (
    <section className="py-16 sm:py-24 px-5 sm:px-6" style={{ background: C.bgDeep }}>
      <div className="max-w-5xl mx-auto">
        <SectionHeader
          eyebrow="Biological Age Score"
          title={<>Your number, read in <span style={{ color: C.primary }}>years</span>.</>}
          subtitle="Every reading feeds a single number we call your Biological Age Score. It's not a diagnosis. It's a compass."
        />
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex justify-center"
          >
            <BioAgeDial score={38} delta={-2.4} size={300} />
          </motion.div>
          <div className="space-y-4">
            {[
              { icon: <TrendingUp className="h-5 w-5" style={{ color: C.primary }} />, label: 'Drops when your ratios improve' },
              { icon: <Activity className="h-5 w-5" style={{ color: C.primary }} />, label: 'Rises when they drift' },
              { icon: <Sparkles className="h-5 w-5" style={{ color: C.primary }} />, label: 'One number, updated weekly' },
            ].map((x, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.07 }}
                className="rounded-2xl p-5 flex items-center gap-4"
                style={{ background: C.bgCard, border: `1px solid ${C.border}` }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: C.pill }}
                >
                  {x.icon}
                </div>
                <p className="text-sm" style={{ color: C.fg }}>{x.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
        <p className="mt-10 max-w-2xl mx-auto italic text-base text-center" style={{ color: C.muted }}>
          This is the metric you&apos;ll start watching every week. The one you&apos;ll text your partner about. The one your friends will ask you for.
        </p>
      </div>
    </section>
  );
}

// ─── Meo AI — CORE ───────────────────────────────────────────────────
function MeoAISection() {
  const pillars = [
    { title: 'Interpret', body: 'Every reading translated into plain English — what it means for you, not the textbook.' },
    { title: 'Compare', body: 'Today’s reading vs. your own baseline — not someone else’s.' },
    { title: 'Connect', body: 'Pairs your lipid trends with anything else you choose to share — sleep, steps, diet, stress, travel.' },
    { title: 'Surface', body: 'Flags the drift before it becomes a trend. You get notified when it’s a signal, not every reading.' },
  ];
  return (
    <section className="py-20 sm:py-28 px-5 sm:px-6 relative" style={{ background: C.bg }}>
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium mb-6"
            style={{ background: C.pill, color: C.pillFg }}
          >
            <Brain className="h-3.5 w-3.5" />
            The core of the system
          </div>
          <h2
            className="font-extrabold mb-4"
            style={{ color: C.fg, fontFamily: 'var(--font-serif), "Cabinet Grotesk", -apple-system, BlinkMacSystemFont, sans-serif', fontSize: 'clamp(32px, 5vw, 48px)' }}
          >
            An intelligence that speaks your<br />
            <span style={{ color: C.primary }}>biology</span> back to you.
          </h2>
          <p className="max-w-2xl mx-auto text-base sm:text-lg" style={{ color: C.muted }}>
            This is what you&apos;re actually buying. The meter collects. Your BAS tracks.
            <strong style={{ color: C.fg }}> Meo AI is where Meo becomes Meo.</strong>
          </p>
        </div>

        {/* Chat-style mockup */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="rounded-3xl p-6 sm:p-8 mx-auto max-w-2xl mt-8"
          style={{ background: C.bgCard, border: `1px solid ${C.border}`, boxShadow: '0 25px 60px rgba(0,0,0,0.25)' }}
        >
          <div className="space-y-4">
            <div className="flex justify-end">
              <div
                className="rounded-2xl rounded-br-sm px-4 py-2.5 text-sm max-w-[85%]"
                style={{ background: C.primary, color: C.primaryFg }}
              >
                Why did my LDL jump this week?
              </div>
            </div>
            <div className="flex gap-3">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                style={{ background: C.pill }}
              >
                <Brain className="h-4 w-4" style={{ color: C.primary }} />
              </div>
              <div
                className="rounded-2xl rounded-bl-sm px-4 py-3 text-sm max-w-[90%]"
                style={{ background: 'rgba(255,255,255,0.08)', color: C.fg }}
              >
                Your LDL is up 8% vs. your 30-day baseline. You travelled last week and your connected sleep data averaged 5.8h vs. your usual 7.3h. In your previous runs (January + March), this exact pattern corrected within 10–14 days of returning to your sleep window.
                <br /><br />
                <span style={{ color: C.muted }}>Worth watching if it stays elevated past 2 weeks — otherwise, normal recovery for you.</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Pillars */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {pillars.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="rounded-2xl p-5"
              style={{ background: C.bgCard, border: `1px solid ${C.border}` }}
            >
              <p className="text-xs font-bold tracking-wide mb-2" style={{ color: C.pillFg }}>
                {p.title}
              </p>
              <p className="text-sm" style={{ color: C.fg }}>{p.body}</p>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-14">
          <p className="text-lg font-medium mb-6" style={{ color: C.fg, fontFamily: 'var(--font-serif), "Cabinet Grotesk", -apple-system, BlinkMacSystemFont, sans-serif' }}>
            Your data, read aloud. Daily.
          </p>
          <CTAButton size="lg">Try Meo AI now <ArrowRight className="h-4 w-4" /></CTAButton>
        </div>
      </div>
    </section>
  );
}

// ─── App preview (laptop mockup with sliding screens) ────────────────
const APP_SCREENS = [
  { src: '/meo-app-screenshot.png',  alt: 'Meo AI — metabolic analysis dashboard', label: 'Analysis' },
  { src: '/meo-app-personalize.png', alt: 'Meo AI — personalise your data',         label: 'Personalise' },
  { src: '/meo-app-activity.png',    alt: 'Meo AI — recent activity & readings',    label: 'Activity' },
];

function AppPreviewSection() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setActive((p) => (p + 1) % APP_SCREENS.length), 3500);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="py-16 sm:py-24 px-5 sm:px-6 overflow-hidden" style={{ background: C.bgDeep }}>
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-xs font-semibold tracking-wide mb-3" style={{ color: C.pillFg }}>
            The Meo AI platform
          </p>
          <h2
            className="font-extrabold"
            style={{ color: C.fg, fontFamily: 'var(--font-serif), "Cabinet Grotesk", -apple-system, BlinkMacSystemFont, sans-serif', fontSize: 'clamp(26px, 4vw, 38px)' }}
          >
            Everything in one place — readings,<br className="hidden sm:block" />
            patterns, and your <span style={{ color: C.primary }}>AI coach</span>.
          </h2>
        </div>

        {/* Laptop mockup */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="flex flex-col items-center"
        >
          {/* Screen lid */}
          <div
            className="w-full max-w-3xl rounded-t-2xl rounded-b-sm overflow-hidden relative"
            style={{
              background: '#1a1a1f',
              boxShadow: '0 40px 80px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.07)',
            }}
          >
            {/* Thin top bezel — camera dot */}
            <div className="flex items-center justify-center h-[22px]" style={{ background: '#1a1a1f' }}>
              <div className="w-[6px] h-[6px] rounded-full" style={{ background: '#3a3a3f' }} />
            </div>
            {/* Sliding screen area */}
            <div className="relative overflow-hidden" style={{ background: '#0f1117' }}>
              {APP_SCREENS.map((screen, i) => (
                <div
                  key={i}
                  className="transition-opacity duration-700"
                  style={{
                    position: i === 0 ? 'relative' : 'absolute',
                    inset: 0,
                    opacity: active === i ? 1 : 0,
                    pointerEvents: active === i ? 'auto' : 'none',
                  }}
                >
                  <Image
                    src={screen.src}
                    alt={screen.alt}
                    width={1200}
                    height={750}
                    className="w-full h-auto block"
                    priority={i === 0}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Hinge strip */}
          <div
            className="w-full max-w-3xl h-[4px]"
            style={{ background: 'linear-gradient(to bottom, #2a2a2f, #1a1a1f)' }}
          />

          {/* Base / keyboard deck */}
          <div
            className="w-full max-w-[820px] h-[22px] rounded-b-xl"
            style={{
              background: 'linear-gradient(to bottom, #2c2c32, #222228)',
              boxShadow: '0 8px 24px rgba(0,0,0,0.45)',
            }}
          >
            <div className="flex justify-center pt-[6px]">
              <div className="w-[60px] h-[6px] rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }} />
            </div>
          </div>

          {/* Ground shadow */}
          <div
            className="w-full max-w-[820px] h-[2px] rounded-full mt-0.5"
            style={{ background: 'rgba(0,0,0,0.3)', filter: 'blur(4px)' }}
          />

          {/* Dot + label nav */}
          <div className="flex items-center gap-6 mt-8">
            {APP_SCREENS.map((screen, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className="flex flex-col items-center gap-2 group"
              >
                <span
                  className="block rounded-full transition-all duration-300"
                  style={{
                    width: active === i ? 24 : 8,
                    height: 8,
                    background: active === i ? C.primary : 'rgba(255,255,255,0.25)',
                  }}
                />
                <span
                  className="text-xs font-medium transition-colors duration-200"
                  style={{ color: active === i ? C.primary : 'rgba(255,255,255,0.35)' }}
                >
                  {screen.label}
                </span>
              </button>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ─── eBook ───────────────────────────────────────────────────────────
function EbookSection() {
  const chapters = [
    'The 7 lipid-moving habits the peer-reviewed research actually supports',
    'Meals, not "meal plans" — frameworks that survive real life',
    'The cortisol–LDL feedback loop almost no one talks about',
    'The sleep–triglycerides link the data is unambiguous about',
    'How to read your own trend chart without becoming obsessive',
    'A 6-week gentle-protocol you can stick to at weddings, on trips, on sick days',
  ];
  return (
    <section className="py-16 sm:py-24 px-5 sm:px-6" style={{ background: C.bgDeep }}>
      <div className="max-w-5xl mx-auto">
        {/* Book + copy row — text left, image right (mirrors device section) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center mb-14">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <p className="text-xs font-semibold tracking-wide mb-3" style={{ color: C.pillFg }}>
              The action manual
            </p>
            <h2 className="font-extrabold mb-5" style={{ color: C.fg, fontFamily: 'var(--font-serif), "Cabinet Grotesk", -apple-system, BlinkMacSystemFont, sans-serif', fontSize: 'clamp(28px, 4vw, 36px)' }}>
              Insight without action is just <span style={{ color: C.primary }}>anxiety</span>.
            </h2>
            <p className="text-base mb-3" style={{ color: C.muted }}>
              <em>The Thin Book of Fat</em> by <strong style={{ color: C.fg }}>Marina Young</strong> — the manual Meo AI references when it talks to you. Ask the author your questions directly through Meo; answers come back in chat.
            </p>
            <p className="text-sm mb-6" style={{ color: C.muted }}>
              Included digitally with every Metabolic Health Tracker.
            </p>
            <ul className="space-y-3">
              {chapters.map((c, i) => (
                <li key={i} className="flex items-start gap-3 text-sm" style={{ color: C.fg }}>
                  <BookOpen className="h-4 w-4 mt-0.5 shrink-0" style={{ color: C.primary }} />
                  {c}
                </li>
              ))}
            </ul>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="rounded-3xl overflow-hidden flex items-center justify-center p-8"
            style={{ background: C.bgCard, border: `1px solid ${C.border}`, minHeight: 320 }}
          >
            <Image
              src="/ebook-cover.jpg"
              alt="The Thin Book of Fat — Marina Young"
              width={200}
              height={267}
              className="h-[260px] w-auto object-cover rounded-xl shadow-2xl"
              style={{ transform: 'rotate(-6deg)', transformOrigin: 'center' }}
            />
          </motion.div>
        </div>

        {/* Author card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center sm:items-start gap-6"
          style={{ background: C.bgCard, border: `1px solid ${C.border}` }}
        >
          <div
            className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden shrink-0"
            style={{ border: `1px solid ${C.border}` }}
          >
            <Image
              src="/marina-young.jpg"
              alt="Marina Young — Author"
              width={112}
              height={112}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="text-center sm:text-left">
            <p className="text-xs font-semibold tracking-wide mb-1" style={{ color: C.pillFg }}>The Author</p>
            <p className="font-bold text-lg mb-2" style={{ color: C.fg }}>Marina Young</p>
            <p className="text-sm" style={{ color: C.muted }}>
              Marina Young has spent a decade translating the science of metabolic health into plain English.
              <em> The Thin Book of Fat</em> is the action manual Meo AI draws on — and through Meo you can
              ask Marina your questions directly. Answers come back in chat.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ─── Benefits ────────────────────────────────────────────────────────
function BenefitsSection() {
  const items = [
    'Understand your cholesterol without a medical degree',
    'Measure at home in under 3 minutes, as often as you want',
    'See how food, sleep, and stress actually move your numbers',
    'Get plain-English insight from Meo AI on every reading',
    'Track a Biological Age Score that updates as you progress',
    'Catch the drift — not the diagnosis — years earlier',
    'Own your data. No monthly lab fees, no appointment waits',
    '30-day money-back guarantee, no questions',
  ];
  return (
    <section className="py-16 sm:py-24 px-5 sm:px-6" style={{ background: C.bg }}>
      <div className="max-w-5xl mx-auto">
        <SectionHeader eyebrow="Outcomes" title={<>What you actually walk away with.</>} />
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {items.map((b, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: i * 0.04 }}
              className="flex items-start gap-3 rounded-2xl px-5 py-4"
              style={{ background: C.bgCard, border: `1px solid ${C.border}` }}
            >
              <Check className="h-5 w-5 mt-0.5 shrink-0" style={{ color: C.primary }} />
              <span className="text-sm" style={{ color: C.fg }}>{b}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Numbers vs Insights ─────────────────────────────────────────────
function NumbersVsInsightsSection() {
  const rows = [
    ['TC: 5.4 mmol/L', '"Your TC crept up 8% in 3 weeks. Your sleep score dropped 14% in the same window. These moved together last time, in January. Worth watching — not acting yet."'],
    ['LDL: 3.1 mmol/L', '"Your LDL is stable. Your TC/HDL ratio has improved for 4 straight weeks. Your Biological Age Score dropped by 1.2 years. Keep going."'],
    ['Triglycerides: 1.8 mmol/L', '"Your TG is trending in a direction we see most often after 2–3 weeks of restaurant-heavy eating. Easy recovery. Here’s the 1 change that historically moves it most."'],
  ];
  return (
    <section className="py-16 sm:py-24 px-5 sm:px-6" style={{ background: C.bgDeep }}>
      <div className="max-w-5xl mx-auto">
        <SectionHeader
          eyebrow="Numbers vs. Insights"
          title={<>Your meter gives you numbers. Meo gives you <span style={{ color: C.primary }}>understanding</span>.</>}
        />
        <div className="mt-10 rounded-2xl overflow-hidden" style={{ background: C.bgCard, border: `1px solid ${C.border}` }}>
          <div className="grid grid-cols-1 sm:grid-cols-[1fr_2fr] text-xs font-semibold tracking-wide px-6 py-4" style={{ background: 'rgba(255,255,255,0.04)', color: C.muted }}>
            <div>What a meter alone gives you</div>
            <div>What the Meo system gives you</div>
          </div>
          {rows.map(([l, r], i) => (
            <div
              key={i}
              className="grid grid-cols-1 sm:grid-cols-[1fr_2fr] gap-4 px-6 py-5"
              style={{ borderTop: `1px solid ${C.border}` }}
            >
              <code className="text-sm" style={{ color: C.muted }}>{l}</code>
              <div className="text-sm italic" style={{ color: C.fg }}>{r}</div>
            </div>
          ))}
        </div>
        <p className="text-center text-lg font-medium mt-10" style={{ color: C.fg, fontFamily: 'var(--font-serif), "Cabinet Grotesk", -apple-system, BlinkMacSystemFont, sans-serif' }}>
          Numbers change nothing. <span style={{ color: C.primary }}>Understanding</span> changes everything.
        </p>
        <div className="text-center mt-8">
          <CTAButton>This is the picture you&apos;ve been missing <ArrowRight className="h-4 w-4" /></CTAButton>
        </div>
      </div>
    </section>
  );
}

// ─── Testimonials ────────────────────────────────────────────────────
function TestimonialsSection() {
  const ts = [
    { quote: "I've had my cholesterol measured for 20 years. Meo is the first time I've actually looked at what it means. I feel like I got my 30s back.", who: 'James R., Cambridge' },
    { quote: 'My dad had a heart attack at 52. Meo AI is the first time I’ve felt ahead of the curve instead of waiting for bad news.', who: 'Priya K., London' },
    { quote: 'My ratios have improved for 11 weeks straight. It’s not the device — it’s finally seeing what I’m doing.', who: 'Marcus T., Manchester' },
    { quote: 'I asked Meo AI why my LDL went up. It pulled in two weeks of travel and said the pattern usually stabilises within 10 days. It did. Exactly that.', who: 'Clara V., Amsterdam' },
  ];
  return (
    <section className="py-16 sm:py-24 px-5 sm:px-6" style={{ background: C.bg }}>
      <div className="max-w-5xl mx-auto">
        <SectionHeader eyebrow="Real readings · real people" title={<>The first people using Meo.</>} />
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-5">
          {ts.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.08 }}
              className="rounded-2xl p-6"
              style={{ background: C.bgCard, border: `1px solid ${C.border}` }}
            >
              <Quote className="h-5 w-5 mb-3" style={{ color: C.primary }} />
              <p className="text-sm mb-4 italic" style={{ color: C.fg }}>&ldquo;{t.quote}&rdquo;</p>
              <p className="text-xs font-semibold" style={{ color: C.pillFg }}>{t.who}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Partners / Advisors carousel ────────────────────────────────────
const PARTNERS = [
  {
    photo: '/team-spencer.png',
    name: 'Spencer Martin',
    title: 'Sales Manager',
    bio: 'Over 25 years in pharmaceutical sales, specialising in diabetes therapies and coaching. Driving Meterbolic\'s commercial outreach and partner growth.',
  },
  {
    photo: '/team-andy.png',
    name: 'Andy Taylor',
    title: 'Clinic Lead',
    bio: 'Former professional footballer turned metabolic health expert and UKSCA-accredited coach.',
  },
  {
    photo: '/team-saad.jpg',
    name: 'Saad',
    title: 'AI Specialist · CTO',
    bio: 'Building the intelligence layer behind Meo — AI architecture, backend systems, and the data pipeline that turns a finger-prick into a metabolic picture.',
  },
  {
    photo: '/team-leonard.png',
    name: 'Leonard Lin',
    title: 'Product Supervisor',
    bio: 'Overseeing product direction and ensuring every feature of Meo delivers real metabolic insight — from hardware integration to the AI conversation layer.',
  },
  {
    photo: '/marina-young.jpg',
    name: 'Marina Young',
    title: 'Author · The Thin Book of Fat',
    bio: 'A decade translating the science of metabolic health into plain English. The Thin Book of Fat is the action manual Meo AI draws on — ask Marina your questions directly through Meo.',
  },
];

function PartnerCard({ partner }: { partner: typeof PARTNERS[number] }) {
  return (
    <div
      className="rounded-2xl overflow-hidden flex flex-col"
      style={{ background: C.bgCard, border: `1px solid ${C.border}` }}
    >
      <div className="relative w-full" style={{ aspectRatio: '1/1', overflow: 'hidden' }}>
        <Image
          src={partner.photo}
          alt={partner.name}
          fill
          className="object-cover object-top"
          sizes="(min-width: 640px) 25vw, 384px"
        />
      </div>
      <div className="p-6 flex flex-col gap-1">
        <p className="font-bold text-lg" style={{ color: C.fg }}>{partner.name}</p>
        <p className="text-xs font-semibold tracking-wide mb-3" style={{ color: C.primary }}>{partner.title}</p>
        <p className="text-sm leading-relaxed" style={{ color: C.muted }}>{partner.bio}</p>
      </div>
    </div>
  );
}

function PartnersSection() {
  const [idx, setIdx] = useState(0);
  const total = PARTNERS.length;
  const prev = () => setIdx((i) => (i - 1 + total) % total);
  const next = () => setIdx((i) => (i + 1) % total);

  return (
    <section className="py-16 sm:py-24 px-5 sm:px-6" style={{ background: C.bgDeep }}>
      <div className="max-w-6xl mx-auto">
        <SectionHeader
          eyebrow="The team behind Meo"
          title={<>Built by people who <span style={{ color: C.primary }}>live</span> this.</>}
          subtitle="Decades of clinical, commercial, and metabolic expertise — all pointed at one goal: making your cholesterol data actually useful."
        />

        {/* Desktop: up to 4 cards per row */}
        <div className="hidden sm:grid mt-12 gap-6"
          style={{ gridTemplateColumns: `repeat(${Math.min(PARTNERS.length, 5)}, minmax(0, 1fr))` }}
        >
          {PARTNERS.map((p) => (
            <PartnerCard key={p.name} partner={p} />
          ))}
        </div>

        {/* Mobile: carousel */}
        <div className="sm:hidden mt-12 flex flex-col items-center">
          <div className="w-full max-w-sm">
            <AnimatePresence mode="wait">
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.35 }}
              >
                <PartnerCard partner={PARTNERS[idx]} />
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex items-center gap-6 mt-8">
            <button
              onClick={prev}
              className="w-10 h-10 rounded-full flex items-center justify-center transition-opacity hover:opacity-80"
              style={{ background: C.bgCard, border: `1px solid ${C.border}`, color: C.fg }}
              aria-label="Previous"
            >
              <ChevronDown className="h-5 w-5 rotate-90" />
            </button>

            <div className="flex gap-2">
              {PARTNERS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setIdx(i)}
                  className="rounded-full transition-all"
                  style={{
                    width: i === idx ? 20 : 8,
                    height: 8,
                    background: i === idx ? C.primary : C.border,
                  }}
                  aria-label={`Go to ${PARTNERS[i].name}`}
                />
              ))}
            </div>

            <button
              onClick={next}
              className="w-10 h-10 rounded-full flex items-center justify-center transition-opacity hover:opacity-80"
              style={{ background: C.bgCard, border: `1px solid ${C.border}`, color: C.fg }}
              aria-label="Next"
            >
              <ChevronDown className="h-5 w-5 -rotate-90" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Objections ──────────────────────────────────────────────────────
function ObjectionsSection() {
  const items = [
    {
      q: 'How accurate is the meter?',
      a: 'The Sejoy BF-101b is CE-marked and reads within ±10% of reference-lab panels for TC, HDL, LDL and triglycerides. But the real value of Meo is in the trend across hundreds of your own readings — small per-reading variance washes out in the pattern.',
    },
    {
      q: 'Is it hard to use?',
      a: 'A finger-prick and a strip — the same motion a diabetic runs three times a day. If you can tap your phone, you can run a Meo reading in under 3 minutes.',
    },
    {
      q: 'Can I trust the AI?',
      a: 'Meo AI doesn’t diagnose, prescribe, or replace your doctor. It reads your history, spots patterns, and tells you clearly what it sees — with its sources. When something is unusual, it recommends you see a healthcare professional. You always own the decision.',
    },
    {
      q: '£149 — what does that actually get me?',
      a: 'Read it as 6 months of Meo AI with the lipid meter, 10 test strips, lancets, carry case, and a Biological Age Score all bundled in. One private-clinic panel costs £80–£150, runs once, gives you paper. Meo costs £149 once, runs unlimited times, and pairs each reading with AI interpretation you can actually act on.',
    },
  ];
  return (
    <section className="py-16 sm:py-24 px-5 sm:px-6" style={{ background: C.bgDeep }}>
      <div className="max-w-4xl mx-auto">
        <SectionHeader eyebrow="The honest answers" title={<>What you&apos;re probably wondering.</>} />
        <div className="mt-10 space-y-4">
          {items.map((it, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: i * 0.06 }}
              className="rounded-2xl p-6"
              style={{ background: C.bgCard, border: `1px solid ${C.border}` }}
            >
              <p className="font-semibold mb-2" style={{ color: C.fg }}>{it.q}</p>
              <p className="text-sm" style={{ color: C.muted }}>{it.a}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Guarantee ───────────────────────────────────────────────────────
function GuaranteeSection() {
  return (
    <section className="py-16 sm:py-24 px-5 sm:px-6" style={{ background: C.bg }}>
      <div
        className="max-w-3xl mx-auto rounded-3xl p-10 text-center"
        style={{
          background: `linear-gradient(140deg, ${C.bgCard}, rgba(164,214,94,0.12))`,
          border: `1px solid ${C.primary}`,
        }}
      >
        <div
          className="w-16 h-16 rounded-2xl mx-auto mb-6 flex items-center justify-center"
          style={{ background: C.pill }}
        >
          <Shield className="h-8 w-8" style={{ color: C.primary }} />
        </div>
        <p className="text-xs font-semibold tracking-wide mb-3" style={{ color: C.pillFg }}>
          30 days, risk-free
        </p>
        <h2
          className="font-extrabold mb-4"
          style={{ color: C.fg, fontFamily: 'var(--font-serif), "Cabinet Grotesk", -apple-system, BlinkMacSystemFont, sans-serif', fontSize: 'clamp(28px, 4vw, 36px)' }}
        >
          &ldquo;Start seeing, or send it back.&rdquo;
        </h2>
        <p className="text-base mb-8 max-w-xl mx-auto" style={{ color: C.muted }}>
          Use Meo for 30 days. Take your readings. Watch your Biological Age Score update. If you don&apos;t feel clearer, in control, and like you finally understand what your body&apos;s been trying to tell you — return the device. Full refund less post & packaging. No questions asked.
        </p>
        <CTAButton size="lg">Claim your risk-free 30 days <ArrowRight className="h-4 w-4" /></CTAButton>
      </div>
    </section>
  );
}

// ─── Add-ons ─────────────────────────────────────────────────────────
function AddonsSection() {
  const items = KIT_ADDONS.slice(0, 3); // headline 3 on the landing; full list at checkout
  return (
    <section className="py-16 sm:py-24 px-5 sm:px-6" style={{ background: C.bgDeep }}>
      <div className="max-w-5xl mx-auto">
        <SectionHeader
          eyebrow="Go deeper"
          title={<>Extend the system.</>}
          subtitle="Available at checkout. Most customers extend their Meo AI access within the first 2 weeks — the piece that makes the whole loop work."
        />
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((addon, i) => (
            <motion.div
              key={addon.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.07 }}
              className="rounded-2xl p-6 flex flex-col gap-3"
              style={{ background: C.bgCard, border: `1px solid ${C.border}` }}
            >
              <div className="flex items-start justify-between gap-2">
                <p className="font-semibold" style={{ color: C.fg }}>{addon.name}</p>
                <p className="font-bold shrink-0" style={{ color: C.fg }}>
                  {formatGBP(addon.price)}
                  {addon.recurring ? <span className="text-xs font-normal" style={{ color: C.muted }}>/{addon.recurring}</span> : null}
                </p>
              </div>
              {addon.recommended && (
                <span
                  className="self-start px-2 py-0.5 rounded text-xs font-bold tracking-wide"
                  style={{ background: C.pill, color: C.pillFg }}
                >
                  Recommended
                </span>
              )}
              <p className="text-sm" style={{ color: C.muted }}>{addon.description}</p>
              {addon.highlight && (
                <p className="text-sm font-medium" style={{ color: C.primary }}>{addon.highlight}</p>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── FAQ ─────────────────────────────────────────────────────────────
function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  return (
    <section className="py-16 sm:py-24 px-5 sm:px-6" style={{ background: C.bg }}>
      <div className="max-w-3xl mx-auto">
        <SectionHeader eyebrow="FAQ" title={<>Common questions.</>} />
        <div className="mt-10 space-y-3">
          {FAQ_ITEMS.map((item, i) => (
            <div
              key={i}
              className="rounded-2xl overflow-hidden"
              style={{ background: C.bgCard, border: `1px solid ${C.border}` }}
            >
              <button
                className="w-full flex items-center justify-between px-6 py-5 text-left"
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
              >
                <span className="font-medium" style={{ color: C.fg }}>{item.question}</span>
                <motion.div
                  animate={{ rotate: openIndex === i ? 180 : 0 }}
                  transition={{ duration: 0.22 }}
                  className="shrink-0 ml-4"
                >
                  <ChevronDown className="h-5 w-5" style={{ color: C.muted }} />
                </motion.div>
              </button>
              <AnimatePresence initial={false}>
                {openIndex === i && (
                  <motion.div
                    key="content"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.22 }}
                    className="overflow-hidden"
                  >
                    <p className="px-6 pb-5 text-sm" style={{ color: C.muted }}>{item.answer}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Newsletter / Waitlist ───────────────────────────────────────────
function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [state, setState] = useState<'idle' | 'submitting' | 'done' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setState('submitting');
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, _hp: honeypot }),
      });
      if (!res.ok) throw new Error('Failed');
      setState('done');
    } catch {
      setState('error');
    }
  };

  return (
    <section className="py-14 sm:py-20 px-5 sm:px-6" style={{ background: C.bgDeep }}>
      <motion.div
        className="max-w-2xl mx-auto text-center"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.55 }}
      >
        <div
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium mb-5"
          style={{ background: C.pill, color: C.pillFg }}
        >
          <Mail className="h-3.5 w-3.5" />
          Free extract — no purchase needed.
        </div>
        <h2
          className="font-extrabold mb-3"
          style={{ color: C.fg, fontFamily: 'var(--font-serif), "Cabinet Grotesk", -apple-system, BlinkMacSystemFont, sans-serif', fontSize: 'clamp(26px, 4vw, 34px)' }}
        >
          Not ready to buy? Get the first chapter free.
        </h2>
        <p className="text-base mb-8" style={{ color: C.muted }}>
          Subscribe and we&apos;ll send you a free extract from{' '}
          <strong style={{ color: C.fg }}>The Thin Book of Fat</strong> by Marina Young — plus early access to new products in the Metabolic Health Tracker Series. No spam, ever.
        </p>
        {state === 'done' ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl font-semibold"
            style={{ background: C.pill, color: C.pillFg }}
          >
            <DropletIcon size={16} /> Check your inbox — extract is on its way!
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-sm mx-auto">
            {/* Honeypot — hidden from humans, filled by bots */}
            <input
              type="text"
              name="_hp"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
              style={{ display: 'none' }}
              tabIndex={-1}
              autoComplete="off"
            />
            <input
              type="email"
              required
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 rounded-xl px-4 py-3 text-sm focus:outline-none"
              style={{
                background: 'rgba(255,255,255,0.08)',
                border: `1px solid ${C.border}`,
                color: C.fg,
              }}
            />
            <button
              type="submit"
              disabled={state === 'submitting'}
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-opacity hover:opacity-90 disabled:opacity-60 shrink-0"
              style={{ background: C.primary, color: C.primaryFg }}
            >
              {state === 'submitting' ? 'Sending…' : <>Get extract <ArrowRight className="h-4 w-4" /></>}
            </button>
          </form>
        )}
        {state === 'error' && (
          <p className="mt-3 text-sm" style={{ color: '#f87171' }}>Something went wrong — please try again.</p>
        )}
      </motion.div>
    </section>
  );
}

// ─── Footer (with compliance disclaimer) ────────────────────────────
function Footer() {
  return (
    <footer
      className="px-6 pt-8 pb-28 sm:pb-10"
      style={{ background: 'rgba(28,74,64,0.92)', backdropFilter: 'blur(12px)', borderTop: `1px solid ${C.border}` }}
    >
      {/* Top bar — mirrors navbar layout: logo left, nav links right */}
      <div className="flex items-center justify-between py-4 mb-6" style={{ borderBottom: `1px solid ${C.border}` }}>
        <Link href="/" className="flex items-center gap-1.5" aria-label="Meo home">
          <span
            className="text-xl font-bold tracking-tight"
            style={{
              color: C.fg,
              fontFamily: 'var(--font-serif), "Cabinet Grotesk", -apple-system, BlinkMacSystemFont, sans-serif',
            }}
          >
            Meo
          </span>
          <DropletIcon size={22} />
          <span className="hidden sm:inline text-xs ml-2 tracking-wide" style={{ color: C.muted }}>
            Metabolic Intelligence
          </span>
        </Link>
        {/* Legal + contact links */}
        <nav className="flex items-center gap-5 text-sm" aria-label="Footer navigation">
          <Link href="/privacy" className="hover:underline" style={{ color: C.muted }}>Privacy</Link>
          <Link href="/terms" className="hover:underline" style={{ color: C.muted }}>Terms</Link>
          <a href="mailto:hello@meterbolic.com" className="hover:underline" style={{ color: C.muted }}>Contact</a>
        </nav>
      </div>
      <p className="text-xs leading-relaxed mb-3 max-w-3xl" style={{ color: C.muted }}>
        Meo is a wellness and monitoring tool. It is not intended to diagnose, treat, cure, or prevent any disease.
        Always consult your GP or a qualified healthcare professional for medical advice. Readings are informational
        and are not a substitute for professional testing. Meo AI provides pattern-based insights, not medical advice;
        if something concerns you, speak to a healthcare professional.
      </p>
      <p className="text-xs" style={{ color: C.muted }}>© 2026 Meterbolic Ltd. All rights reserved.</p>
    </footer>
  );
}

// ─── Sticky mobile CTA ───────────────────────────────────────────────
function StickyMobileCTA() {
  return (
    <div
      className="sm:hidden fixed bottom-0 left-0 right-0 z-40 p-3"
      style={{
        background: 'rgba(14,44,38,0.96)',
        backdropFilter: 'blur(12px)',
        borderTop: `1px solid ${C.border}`,
      }}
    >
      <Link
        href="/checkout"
        className="flex items-center justify-center gap-2 w-full px-6 py-3 rounded-xl font-semibold text-sm"
        style={{ background: C.primary, color: C.primaryFg }}
      >
        Get Meo — {formatGBP(KIT_PRODUCT.price)} <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}

// ─── Urgency badge ───────────────────────────────────────────────────
// Shown near every primary CTA. Rotates through 3 messages to feel
// dynamic rather than a static label.
function UrgencyBadge() {
  const [stock, setStock] = useState<{ count: number; available: boolean; low: boolean } | null>(null);

  useEffect(() => {
    fetch('/api/stock')
      .then((r) => r.json())
      .then(setStock)
      .catch(() => null);
  }, []);

  if (!stock) return null;

  // Only show badge when stock is low (≤20) or unavailable
  if (!stock.available) {
    return (
      <p className="text-xs font-medium text-center mt-2" style={{ color: '#f87171' }}>
        ⚠️ Currently out of stock — join the waiting list below
      </p>
    );
  }

  if (stock.low) {
    return (
      <AnimatePresence mode="wait">
        <motion.p
          key="low"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.3 }}
          className="text-xs font-medium text-center mt-2"
          style={{ color: C.danger }}
        >
          ⚡ Only {stock.count} kits left at this price
        </motion.p>
      </AnimatePresence>
    );
  }

  return (
    <p className="text-xs font-medium text-center mt-2" style={{ color: C.muted }}>
      📦 Ships in 72 hrs · while stocks last
    </p>
  );
}

// ─── Sticky desktop CTA bar ───────────────────────────────────────────
// Hidden until user scrolls 600px past hero. Slides in from bottom on
// desktop; the existing StickyMobileCTA handles mobile.
function StickyDesktopCTA() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const handler = () => setVisible(window.scrollY > 600);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ duration: 0.35 }}
          className="hidden sm:flex fixed bottom-0 left-0 right-0 z-40 items-center justify-between px-8 py-3 gap-6"
          style={{
            background: 'rgba(14,44,38,0.97)',
            backdropFilter: 'blur(14px)',
            borderTop: `1px solid ${C.border}`,
          }}
        >
          <div className="flex items-center gap-3 min-w-0">
            <DropletIcon size={20} />
            <div className="min-w-0">
              <p className="text-sm font-semibold truncate" style={{ color: C.fg }}>Meo Metabolic Health Tracker</p>
              <p className="text-xs truncate" style={{ color: C.muted }}>6 months AI · Lipid Meter · BAS Score</p>
            </div>
          </div>
          <div className="flex items-center gap-4 shrink-0">
            <div className="text-right hidden md:block">
              <p className="text-xs" style={{ color: C.muted }}>30-day money-back guarantee</p>
              <p className="text-xs" style={{ color: C.danger }}>⚡ Limited stock</p>
            </div>
            <Link
              href="/checkout"
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-sm transition-opacity hover:opacity-90 shrink-0"
              style={{ background: C.primary, color: C.primaryFg }}
            >
              Get Meo — {formatGBP(KIT_PRODUCT.price)} <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── Exit-intent overlay ──────────────────────────────────────────────
// Fires once per session when mouse leaves through the top of viewport.
// Offers a strong reason to stay + a direct path to checkout.
function ExitIntentOverlay() {
  const [show, setShow] = useState(false);
  const fired = useRef(false);

  const dismiss = useCallback(() => setShow(false), []);

  useEffect(() => {
    const handleMouseLeave = (e: MouseEvent) => {
      if (fired.current) return;
      if (e.clientY <= 10) {
        fired.current = true;
        setShow(true);
        try { sessionStorage.setItem('meo_exit_shown', '1'); } catch {}
      }
    };
    try { if (sessionStorage.getItem('meo_exit_shown')) { fired.current = true; return; } } catch {}
    document.addEventListener('mouseleave', handleMouseLeave);
    return () => document.removeEventListener('mouseleave', handleMouseLeave);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-5"
          style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)' }}
          onClick={dismiss}
        >
          <motion.div
            initial={{ scale: 0.92, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.92, y: 20, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="relative max-w-md w-full rounded-3xl p-8 text-center"
            style={{ background: C.bgDeep, border: `1px solid ${C.primary}40` }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={dismiss}
              className="absolute top-4 right-4 text-xl leading-none hover:opacity-70"
              style={{ color: C.muted }}
              aria-label="Close"
            >
              ×
            </button>
            <DropletIcon size={36} />
            <h2
              className="font-extrabold mt-4 mb-2 leading-tight"
              style={{ color: C.fg, fontSize: 'clamp(22px, 4vw, 28px)', fontFamily: 'var(--font-serif), "Cabinet Grotesk", -apple-system, BlinkMacSystemFont, sans-serif' }}
            >
              Before you go — your metabolism<br />
              <span style={{ color: C.primary }}>doesn&apos;t take a break.</span>
            </h2>
            <p className="text-sm mb-6" style={{ color: C.muted }}>
              One blood test a year leaves 364 days of drift invisible.
              Meo costs {formatGBP(KIT_PRODUCT.price)} once and runs for 6 months — less than a single private-clinic panel.
            </p>
            <Link
              href="/checkout"
              onClick={dismiss}
              className="inline-flex items-center justify-center gap-2 w-full px-6 py-3.5 rounded-xl font-semibold text-base transition-opacity hover:opacity-90"
              style={{ background: C.primary, color: C.primaryFg }}
            >
              Get Meo — {formatGBP(KIT_PRODUCT.price)} <ArrowRight className="h-4 w-4" />
            </Link>
            <p className="text-xs mt-3" style={{ color: C.muted }}>30-day money-back guarantee · Limited stock</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────
export default function MarketingLandingPage() {
  return (
    <div style={{ background: C.bg }}>
      <Navbar />
      <Hero />
      <ProblemSection />
      <WhyTestsFailSection />
      <MeetMeoSection />
      {/* Conversion-priming: itemised value-stack right after they
          first understand what Meo IS, before they go deep into how
          each component works. Surfaces the £362-of-value-for-£149
          math early so deeper engagement happens with that anchor. */}

      <BiomarkersSection />
      <LipidTrackingSection />
      <EbookSection />
      <InsulinPatternSection />
      <BioAgeSection />
      <MeoAISection />
      <AppPreviewSection />
      <BenefitsSection />
      <NumbersVsInsightsSection />
      <TestimonialsSection />
      <PartnersSection />
      <GuaranteeSection />
      <FAQSection />
      <NewsletterSection />
      <Footer />
      <StickyMobileCTA />
      <StickyDesktopCTA />
      <ExitIntentOverlay />
    </div>
  );
}

// Keep FEATURE_ICONS exported for the checkout page's feature list.
export { FEATURE_ICONS };
