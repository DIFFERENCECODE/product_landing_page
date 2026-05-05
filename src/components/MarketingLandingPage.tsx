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
  Menu,
  X,
} from 'lucide-react';
import {
  KIT_PRODUCT,
  KIT_ADDONS,
  KIT_LITE,
  THERAPY_ADDON,
  BIOMARKERS,
  FAQ_ITEMS,
  formatGBP,
} from '@/lib/kitProducts';
import { BioAgeDial, KraftCurve, EbookCover, LipidDroplet } from './Visuals';
import { C } from '@/lib/design-tokens';

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
  href = '/checkout',
}: {
  children?: React.ReactNode;
  variant?: 'primary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  href?: string;
}) {
  const paddings = size === 'sm' ? 'px-5 py-2.5 text-sm' : size === 'lg' ? 'px-10 py-4 text-base' : 'px-8 py-3.5 text-base';
  const styleMap: Record<string, React.CSSProperties> = {
    primary: { background: C.primary, color: C.primaryFg },
    ghost: { background: 'transparent', color: C.fg, border: `1px solid ${C.border}` },
  };
  return (
    <Link
      href={href}
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
        style={{
          color: C.fg,
          fontFamily: 'var(--font-serif), "Cabinet Grotesk", -apple-system, BlinkMacSystemFont, sans-serif',
          fontSize: 'clamp(28px, 4vw, 40px)',
          textWrap: 'balance',
        }}
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
export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > window.innerHeight * 0.8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Lock body scroll while the mobile drawer is open.
  useEffect(() => {
    if (menuOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = prev; };
    }
  }, [menuOpen]);

  // Real routes. Anchor links (#tiers, #faq) only work when the user
  // is on /, so the global nav now points at full pages — every link
  // resolves the same way from anywhere on the site.
  const links = [
    { label: 'About', href: '/about' },
    { label: 'How it works', href: '/how-it-works' },
    { label: 'Services', href: '/services' },
    { label: 'Partners', href: '/partners' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'Chat', href: '/chat' },
  ];

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 transition-all duration-300"
        style={{
          background: scrolled ? 'rgba(28,74,64,0.72)' : 'transparent',
          backdropFilter: scrolled ? 'blur(12px)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(12px)' : 'none',
          borderBottom: scrolled ? `1px solid ${C.border}` : '1px solid transparent',
        }}
      >
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
        </Link>

        <div className="hidden lg:flex items-center gap-6">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm hover:opacity-80 transition-opacity"
              style={{ color: C.fg }}
            >
              {l.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/checkout"
            className="flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm transition-opacity hover:opacity-90"
            style={{ background: C.primary, color: C.primaryFg }}
          >
            <ShoppingCart className="h-4 w-4" />
            <span className="hidden sm:inline">Get Meo</span>
          </Link>
          <button
            onClick={() => setMenuOpen(true)}
            className="lg:hidden flex items-center justify-center w-10 h-10 rounded-lg"
            style={{ color: C.fg, border: `1px solid ${C.border}` }}
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden fixed inset-0 z-[60] flex flex-col"
            style={{ background: 'rgba(10,31,26,0.96)', backdropFilter: 'blur(16px)' }}
          >
            <div className="flex items-center justify-between px-6 py-4">
              <span className="text-xl font-bold" style={{ color: C.fg }}>Meo</span>
              <button
                onClick={() => setMenuOpen(false)}
                className="flex items-center justify-center w-10 h-10 rounded-lg"
                style={{ color: C.fg, border: `1px solid ${C.border}` }}
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex flex-col px-6 pt-8 gap-6">
              {links.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setMenuOpen(false)}
                  className="text-2xl font-semibold"
                  style={{ color: C.fg }}
                >
                  {l.label}
                </a>
              ))}
              <Link
                href="/checkout"
                onClick={() => setMenuOpen(false)}
                className="mt-6 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-semibold text-base"
                style={{ background: C.primary, color: C.primaryFg }}
              >
                Get Meo · {formatGBP(KIT_PRODUCT.price)} <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
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
function Hero() {
  const [stockAvailable, setStockAvailable] = useState<boolean | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    fetch('/api/stock')
      .then((r) => r.json())
      .then((d) => setStockAvailable(d.available))
      .catch(() => setStockAvailable(true));
  }, []);

  // Pause the hero video when it scrolls out of view (perf on long
  // scrolls; also respects user attention).
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) v.play().catch(() => {});
        else v.pause();
      },
      { threshold: 0.05 },
    );
    io.observe(v);
    return () => io.disconnect();
  }, []);

  return (
    <section
      id="top"
      className="relative min-h-screen flex flex-col justify-center pt-24 pb-12 sm:pb-16 px-5 sm:px-6 overflow-hidden"
      style={{ background: C.bg }}
    >
      {/* Background video — fills the hero, sits behind everything.
          A dark overlay on top keeps headline/CTA legible. */}
      <video
        ref={videoRef}
        aria-hidden
        autoPlay
        loop
        muted
        playsInline
        className="pointer-events-none absolute inset-0 w-full h-full object-cover"
        src="/liquid-metal.mp4"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ background: 'rgba(0,0,0,0.55)' }}
      />

      <div className="relative max-w-5xl mx-auto w-full text-center">
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
          See what your cholesterol
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

        {/* CTAs — primary button takes prominence; the secondary
            text-link sits beneath as a subordinate option (not a
            co-equal CTA). On mobile the primary is full-width. */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="flex flex-col items-center gap-2.5"
        >
          {stockAvailable === false ? (
            <button
              onClick={() => document.getElementById('newsletter')?.scrollIntoView({ behavior: 'smooth' })}
              className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl font-semibold transition-opacity hover:opacity-90 px-10 py-4 text-base"
              style={{ background: C.primary, color: C.primaryFg }}
            >
              Join the Waitlist <ArrowRight className="h-4 w-4" />
            </button>
          ) : (
            <Link
              href="/checkout"
              className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl font-semibold transition-opacity hover:opacity-90 px-10 py-4 text-base"
              style={{ background: C.primary, color: C.primaryFg }}
            >
              Get Meo · {formatGBP(KIT_PRODUCT.price)} <ArrowRight className="h-4 w-4" />
            </Link>
          )}
          <a
            href="#tiers"
            className="hover:underline"
            style={{ color: C.muted, fontSize: 13 }}
          >
            or compare all plans from {formatGBP(KIT_LITE.price)} →
          </a>
        </motion.div>

        {/* Wellness disclaimer relocated to footer + FAQ #5; the
            detailed TrustPanel directly below this hero now carries
            every regulatory and risk-reversal claim. The compact
            trust bar that briefly lived here was redundant with that
            panel — removed in this pass. */}
        <p className="text-xs mt-5" style={{ color: C.muted }}>
          Lipid meter included free · Ships in 72 hours
        </p>
        <UrgencyBadge />
      </div>
    </section>
  );
}

// ─── Trust panel — surfaces regulatory + accuracy + risk-reversal
// facts immediately under the hero. Replaces the buried "Trusted by
// global leaders" claim with concrete, falsifiable signals.
function TrustPanel() {
  const items = [
    {
      icon: <Shield className="h-5 w-5" />,
      label: 'UK & EU IVDR Registered',
      sub: '1 of only 3 lipid meters cleared for home use',
    },
    {
      icon: <Activity className="h-5 w-5" />,
      label: '±10% of reference-lab',
      sub: 'CE-marked BF-102 across TC, HDL, LDL, triglycerides',
    },
    {
      icon: <Heart className="h-5 w-5" />,
      label: '30-day money-back',
      sub: 'Full refund on the device, no questions asked',
    },
    {
      icon: <Clock className="h-5 w-5" />,
      label: 'Ships in 72 hours',
      sub: 'UK · EU · US · Canada · Australia · Ireland',
    },
  ];
  return (
    <section className="py-10 px-5 sm:px-6" style={{ background: C.bgDeep, borderBottom: `1px solid ${C.border}` }}>
      {/* CSS Grid stretches every card in the row to the height of the
          tallest card (default `align-items: stretch`). Each card is
          itself a flex row that vertically centres its icon + text
          group, and the text group is a flex column that centres the
          heading + subtext as a unit — so cards with 1 line of subtext
          and cards with 2 lines both centre cleanly inside the shared
          row height. */}
      <div className="max-w-6xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-4">
        {items.map((it, i) => (
          <div
            key={i}
            className="flex flex-row items-center justify-start gap-3 h-full rounded-xl px-4 py-3"
            style={{ background: C.bgCard, border: `1px solid ${C.border}` }}
          >
            <div
              className="flex h-9 w-9 items-center justify-center rounded-lg shrink-0"
              style={{ background: 'rgba(164,214,94,0.12)', color: C.primary }}
            >
              {it.icon}
            </div>
            <div className="min-w-0 leading-tight flex flex-col justify-center">
              <div className="text-sm font-semibold" style={{ color: C.fg }}>{it.label}</div>
              <div className="text-xs mt-0.5" style={{ color: C.muted }}>{it.sub}</div>
            </div>
          </div>
        ))}
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
          subtitle="One reading a year. A 90-second conversation. By the time a number 'trends up', the process behind it has been quietly accelerating for half a decade. Meo brings the lab-grade Kraft-style insulin pattern (a 5-stage pattern of insulin response that flags metabolic dysfunction years before standard blood sugar tests) home so you don't have to wait for the next annual blood draw to see what your metabolism is doing."
        />

        {/* Same pattern as the trust bar: grid stretches all cards to
            the row's tallest content; each card is a flex row with
            vertically-centred icon + text so 1-line items and 2-line
            items both sit in the middle of the shared row height. */}
        <div className="mt-10 grid sm:grid-cols-2 gap-4 items-stretch">
          {items.map((it, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.07 }}
              className="flex flex-row items-center justify-start gap-3 h-full rounded-2xl p-5"
              style={{ background: C.bgCard, border: `1px solid ${C.border}` }}
            >
              <AlertCircle className="h-5 w-5 shrink-0" style={{ color: C.danger }} />
              <div className="min-w-0 flex flex-col justify-center">
                <p className="text-sm" style={{ color: C.fg }}>{it}</p>
              </div>
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
      'An AI built specifically for metabolic health — explains every reading in plain English, in the context of your own baseline',
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
        {/* Desktop: 3-column table. Mobile: each row becomes a stacked
            card with the greyed problem on top and the accented Meo
            solution on the bottom. */}
        <div
          role="table"
          aria-label="Standard blood test versus Meo"
          className="hidden sm:block mt-10 rounded-2xl overflow-hidden"
          style={{ background: C.bgCard, border: `1px solid ${C.border}` }}
        >
          {/* Single grid system used by both header and body rows so
              columns line up to the same gutter. The header inherits
              identical px / grid-cols / gap values as the body rows. */}
          <div
            role="row"
            className="grid grid-cols-3 gap-6 text-xs font-semibold tracking-wide uppercase px-6 py-4"
            style={{ background: 'rgba(255,255,255,0.04)', color: C.muted }}
          >
            <div role="columnheader">Standard blood test</div>
            <div role="columnheader">What&apos;s missing</div>
            <div role="columnheader" style={{ color: C.primary }}>What Meo does</div>
          </div>
          {rows.map(([l, m, r], i) => (
            <div
              key={i}
              role="row"
              className="grid grid-cols-3 gap-6 px-6 py-5 text-sm leading-relaxed"
              style={{ borderTop: `1px solid ${C.border}` }}
            >
              <div role="cell" style={{ color: C.muted }}>{l}</div>
              <div role="cell" style={{ color: C.fg }}>{m}</div>
              <div role="cell" style={{ color: C.fg }}>{r}</div>
            </div>
          ))}
        </div>

        {/* Mobile: per-row cards. Problem (greyed) on top; the
            "what's missing" middle column is folded into the Meo
            solution card on the bottom — fewer column shifts, less
            cognitive load on a phone screen. */}
        <div className="sm:hidden mt-10 space-y-4">
          {rows.map(([l, m, r], i) => (
            <div
              key={i}
              className="rounded-2xl overflow-hidden"
              style={{ border: `1px solid ${C.border}` }}
            >
              <div className="p-5" style={{ background: 'rgba(255,255,255,0.03)' }}>
                <p className="text-[10px] font-semibold tracking-wide mb-1" style={{ color: C.muted }}>
                  Standard test
                </p>
                <p className="text-sm" style={{ color: C.muted }}>{l}</p>
              </div>
              <div
                className="p-5"
                style={{
                  background: 'rgba(164,214,94,0.08)',
                  borderTop: `1px solid ${C.primary}40`,
                }}
              >
                <p className="text-[10px] font-semibold tracking-wide mb-1" style={{ color: C.primary }}>
                  What Meo does
                </p>
                <p className="text-sm mb-3" style={{ color: C.fg }}>{r}</p>
                <p className="text-xs leading-relaxed" style={{ color: C.muted }}>
                  <span style={{ color: C.primary, fontWeight: 600 }}>Why it matters: </span>{m}
                </p>
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
function OfferGraphCarousel() {
  const [slide, setSlide] = useState(0);
  const slides = [
    {
      label: 'Your Scores',
      content: (
        <div className="flex gap-3 justify-center">
          <img src="/bas-gauge.svg"   alt="Biological Age Score gauge"  className="w-[48%] rounded-xl" />
          <img src="/kraft-gauge.svg" alt="KRAFT Deep Fat Score gauge"   className="w-[48%] rounded-xl" />
        </div>
      ),
    },
    {
      label: 'Your Progress',
      content: (
        <img src="/bas-progress-chart.svg" alt="YOU vs OUR TARGET progress chart" className="w-full rounded-xl" />
      ),
    },
  ];

  useEffect(() => {
    const id = setInterval(() => setSlide((p) => (p + 1) % slides.length), 4000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="mb-10">
      <div className="rounded-2xl overflow-hidden p-4" style={{ background: C.bgCard, border: `1px solid ${C.border}` }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={slide}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35 }}
          >
            {slides[slide].content}
          </motion.div>
        </AnimatePresence>
      </div>
      {/* 2-dot nav */}
      <div className="flex items-center justify-center gap-3 mt-4">
        {slides.map((s, i) => (
          <button
            key={i}
            onClick={() => setSlide(i)}
            className="flex flex-col items-center gap-1.5"
            aria-label={s.label}
          >
            <span
              className="block rounded-full transition-all duration-300"
              style={{
                width: slide === i ? 28 : 8,
                height: 8,
                background: slide === i ? C.primary : 'rgba(255,255,255,0.22)',
              }}
            />
            <span className="text-[10px]" style={{ color: slide === i ? C.primary : 'rgba(255,255,255,0.3)' }}>
              {s.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

function OfferStackSection() {
  const items = [
    { label: '6 months of Meo AI access',          value: 17400, note: '£29/month at the standard rate' },
    { label: 'State of Art Lipid Meter',           value: 15000,  note: 'UK & EU Registered' },
    { label: 'Metabolic Health Dashboard',         value: 7500,  note: 'developed over many years with unique features' },
    { label: 'Meterbolic Digital Pack',            value: 4000,  note: 'years of experience and expert resources to direct your lifelong health journey' },
    { label: 'Your Metabolic Health Report',       value: 3500,  note: 'in Meo or as separate PDF' },
    { label: 'Metabolic Health Book and Q&A with the Author',  value: 5500,  note: 'ask the author directly and give feedback on the book' },
    { label: 'Referral if desired to the country\'s finest therapists and coaches',  value: 25000,  note: 'a curated list of the best available to you for as a subscriber' },
    { label: 'Biological Age Score + Your Target Scores',      value: 5000,  note: 'baseline + ongoing goal' },
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

        <div className="mt-10">
          <OfferGraphCarousel />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="rounded-2xl overflow-hidden"
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
          title={<>Six markers · Life-changing visualisations · One drop of blood</>}
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
              <p className="font-bold text-center leading-tight" style={{ color: bm.abbr === 'BAS' ? C.primary : C.fg, fontSize: 'clamp(13px, 1.5vw, 17px)' }}>
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
        <div className="flex justify-center mb-4">
          <img src="/bas-logo.svg" alt="Biological Age Score" className="w-20 h-20 opacity-90" />
        </div>
        <SectionHeader
          eyebrow="Biological Age Score"
          title={<>Your metabolism, expressed in <span style={{ color: C.primary }}>years</span>.</>}
          subtitle="A single number calculated from your fasting lipid readings plus five body measurements — tested to match the amount of fat around your internal organs."
        />
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex justify-center"
          >
            <BioAgeDial score={53} delta={-2.7} size={300} />
          </motion.div>
          <div className="space-y-4">
            {[
              { icon: <TrendingUp className="h-5 w-5" style={{ color: C.primary }} />, label: 'Track change over time — not a one-off snapshot' },
              { icon: <Activity className="h-5 w-5" style={{ color: C.primary }} />, label: 'Also shown as a visceral fat score in kg' },
              { icon: <Sparkles className="h-5 w-5" style={{ color: C.primary }} />, label: 'Your score + your personal target, side by side' },
              { icon: <DropletIcon size={20} />, label: 'Requires lipid panel + glucose + age, sex, weight, height, waist' },
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
                  style={{ background: C.pill, color: C.primary }}
                >
                  {x.icon}
                </div>
                <p className="text-sm" style={{ color: C.fg }}>{x.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
        <p className="mt-10 max-w-2xl mx-auto italic text-base text-center" style={{ color: C.muted }}>
          Don&apos;t fixate on the number itself. Watch it move. That&apos;s the whole point.
        </p>
      </div>
    </section>
  );
}

// ─── Scores preview — product image mockup ───────────────────────────
function ScoresSection() {
  return (
    <section className="py-16 sm:py-24 px-5 sm:px-6" style={{ background: C.bgDeep }}>
      <div className="max-w-5xl mx-auto">
        <SectionHeader
          eyebrow="Your Meo Dashboard"
          title={<>See your metabolic health <span style={{ color: C.primary }}>at a glance.</span></>}
          subtitle="Every reading generates a Biological Age Score and a KRAFT Deep Fat Score. Track both against your personal target — updated the moment you test."
        />

        {/* Product mockup frame — capped at 900px wide so the gauge
            numbers (53.3, 1.00) and chart axis labels render at a
            legible size on large monitors. Below that, fills 100% of
            its container. */}
        <motion.div
          role="img"
          aria-label="Meo dashboard showing Biological Age Score of 53.3 and metabolic trend chart"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-10 rounded-2xl overflow-hidden mx-auto w-full"
          style={{
            border: `1px solid ${C.border}`,
            boxShadow: '0 32px 80px rgba(0,0,0,0.45)',
            maxWidth: 900,
          }}
        >
          {/* Browser chrome bar */}
          <div
            className="flex items-center gap-2 px-4 py-3"
            style={{ background: '#143730', borderBottom: `1px solid ${C.border}` }}
          >
            <span className="w-3 h-3 rounded-full" style={{ background: '#f87171' }} />
            <span className="w-3 h-3 rounded-full" style={{ background: '#fbbf24' }} />
            <span className="w-3 h-3 rounded-full" style={{ background: '#4ade80' }} />
            <div
              className="ml-4 flex-1 max-w-xs rounded-md px-3 py-1 text-xs"
              style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.4)' }}
            >
              app.meterbolic.com/dashboard
            </div>
          </div>

          {/* Dashboard content */}
          <div className="p-4 sm:p-6" style={{ background: '#1c4a40' }}>
            {/* Top label */}
            <p className="text-xs font-semibold mb-4" style={{ color: C.muted }}>
              Your scores · Latest reading
            </p>

            {/* Two gauges */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div className="rounded-xl overflow-hidden" style={{ border: `1px solid ${C.border}` }}>
                <img src="/bas-gauge.svg" alt="" className="w-full" />
              </div>
              <div className="rounded-xl overflow-hidden" style={{ border: `1px solid ${C.border}` }}>
                <img src="/kraft-gauge.svg" alt="" className="w-full" />
              </div>
            </div>

            {/* Progress chart */}
            <div className="rounded-xl overflow-hidden" style={{ border: `1px solid ${C.border}` }}>
              <img src="/bas-progress-chart.svg" alt="" className="w-full" />
            </div>
          </div>
        </motion.div>

        <p className="mt-6 text-center text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>
          Illustrative data — your scores update with every reading you take.
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
            This is what you&apos;re actually buying. The meter collects. Your Biological Age Score tracks.
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
          <p className="text-[11px] uppercase tracking-wider mb-4 text-center" style={{ color: C.muted }}>
            The kind of insight Meo gives you — based on real patterns in real data.
          </p>
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
          <CTAButton size="lg" href="#tiers">See plans <ArrowRight className="h-4 w-4" /></CTAButton>
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

// ─── SVG Gauge component ─────────────────────────────────────────────

interface GaugeZone { to: number; color: string }
interface GaugeConfig {
  label: string; value: number; min: number; max: number; unit: string;
  zones: GaugeZone[];
}

const GAUGE_CONFIGS: GaugeConfig[] = [
  { label: 'BMI',               value: 31.2, min: 0,   max: 50,  unit: 'kg/m²',
    zones: [{to:18.5,color:'#60a5fa'},{to:25,color:'#4ade80'},{to:30,color:'#fbbf24'},{to:50,color:'#f87171'}] },
  { label: 'Glucose',           value: 4.6,  min: 2,   max: 12,  unit: 'mmol/L',
    zones: [{to:3.9,color:'#60a5fa'},{to:5.6,color:'#4ade80'},{to:7,color:'#fbbf24'},{to:12,color:'#f87171'}] },
  { label: 'HDL',               value: 1.2,  min: 0,   max: 3,   unit: 'mmol/L',
    zones: [{to:1,color:'#f87171'},{to:1.3,color:'#fbbf24'},{to:3,color:'#4ade80'}] },
  { label: 'HOMA-IR',           value: 0.3,  min: 0,   max: 8,   unit: '',
    zones: [{to:1,color:'#4ade80'},{to:2,color:'#fbbf24'},{to:4,color:'#fb923c'},{to:8,color:'#f87171'}] },
  { label: 'LAP',               value: 78.5, min: 0,   max: 200, unit: '',
    zones: [{to:25,color:'#4ade80'},{to:50,color:'#fbbf24'},{to:200,color:'#f87171'}] },
  { label: 'LDL',               value: 5.1,  min: 0,   max: 8,   unit: 'mmol/L',
    zones: [{to:2.6,color:'#4ade80'},{to:3.3,color:'#a3e635'},{to:4.1,color:'#fbbf24'},{to:8,color:'#f87171'}] },
  { label: 'TG/HDL',            value: 2.0,  min: 0,   max: 6,   unit: '',
    zones: [{to:1,color:'#4ade80'},{to:2,color:'#a3e635'},{to:3,color:'#fbbf24'},{to:6,color:'#f87171'}] },
  { label: 'Total Cholesterol', value: 7.3,  min: 2,   max: 12,  unit: 'mmol/L',
    zones: [{to:5,color:'#4ade80'},{to:6.2,color:'#fbbf24'},{to:12,color:'#f87171'}] },
  { label: 'Triglycerides',     value: 2.3,  min: 0,   max: 10,  unit: 'mmol/L',
    zones: [{to:1.7,color:'#4ade80'},{to:5.6,color:'#fbbf24'},{to:10,color:'#f87171'}] },
  { label: 'TyG',               value: 9.0,  min: 7,   max: 12,  unit: '',
    zones: [{to:8.5,color:'#4ade80'},{to:9.5,color:'#fbbf24'},{to:12,color:'#f87171'}] },
  { label: 'WWI',               value: 7.4,  min: 4,   max: 14,  unit: '',
    zones: [{to:9,color:'#4ade80'},{to:10.5,color:'#fbbf24'},{to:14,color:'#f87171'}] },
  { label: 'Waist/Height',      value: 0.6,  min: 0,   max: 1,   unit: '',
    zones: [{to:0.5,color:'#4ade80'},{to:0.6,color:'#fbbf24'},{to:1,color:'#f87171'}] },
];

// Arc: 240° sweep, start at 8-o'clock (210° standard math), end at 4-o'clock (330°/-30°).
// Fraction 0→1 maps angle 210° → -30° going CW on screen (decreasing standard math degrees).
const G_CX = 80, G_CY = 70, G_R = 58, G_SW = 11;

function gPt(angleDeg: number): [number, number] {
  const r = (angleDeg * Math.PI) / 180;
  return [G_CX + G_R * Math.cos(r), G_CY - G_R * Math.sin(r)];
}

function gArc(f0: number, f1: number): string {
  const clamped0 = Math.max(0, Math.min(0.9999, f0));
  const clamped1 = Math.max(0, Math.min(0.9999, f1));
  if (clamped1 - clamped0 < 0.001) return '';
  const a0 = 210 - clamped0 * 240;
  const a1 = 210 - clamped1 * 240;
  const [x0, y0] = gPt(a0);
  const [x1, y1] = gPt(a1);
  const large = (clamped1 - clamped0) * 240 > 180 ? 1 : 0;
  return `M${x0.toFixed(1)} ${y0.toFixed(1)}A${G_R} ${G_R} 0 ${large} 1 ${x1.toFixed(1)} ${y1.toFixed(1)}`;
}

function SvgGauge({ cfg, delay = 0 }: { cfg: GaugeConfig; delay?: number }) {
  const { value, min, max, label, unit, zones } = cfg;
  const frac = Math.max(0.005, Math.min(0.995, (value - min) / (max - min)));
  const activeColor = (zones.find(z => value <= z.to) ?? zones[zones.length - 1]).color;
  const [tipX, tipY] = gPt(210 - frac * 240);
  const display = value >= 100 ? Math.round(value).toString() : String(value);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, delay }}
      className="rounded-2xl p-3 sm:p-4 flex flex-col items-center"
      style={{
        background: 'rgba(20,55,46,0.7)',
        border: '1px solid rgba(164,214,94,0.15)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
      }}
    >
      <svg viewBox="0 0 160 126" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
        {/* background track */}
        <path d={gArc(0, 1)} stroke="rgba(255,255,255,0.07)" strokeWidth={G_SW} strokeLinecap="round" />

        {/* zone bands (thin, outer) */}
        {zones.map((z, i) => {
          const f0 = i === 0 ? 0 : (zones[i - 1].to - min) / (max - min);
          const f1 = (z.to - min) / (max - min);
          const path = gArc(Math.max(0, f0), Math.min(1, f1));
          return path ? <path key={i} d={path} stroke={z.color} strokeWidth={3} strokeLinecap="butt" opacity={0.28} /> : null;
        })}

        {/* value fill */}
        <path d={gArc(0, frac)} stroke={activeColor} strokeWidth={G_SW} strokeLinecap="round" />

        {/* tip dot */}
        <circle cx={tipX.toFixed(1)} cy={tipY.toFixed(1)} r={G_SW / 2 + 2.5} fill={activeColor} />
        <circle cx={tipX.toFixed(1)} cy={tipY.toFixed(1)} r={G_SW / 2 - 1} fill="rgba(0,0,0,0.55)" />

        {/* value */}
        <text x={G_CX} y={G_CY + 3} textAnchor="middle" dominantBaseline="middle"
          fill={activeColor} fontSize={23} fontWeight="700" fontFamily="system-ui,-apple-system,sans-serif">
          {display}
        </text>

        {/* unit */}
        {unit && (
          <text x={G_CX} y={G_CY + 20} textAnchor="middle"
            fill="rgba(255,255,255,0.40)" fontSize={7.5} fontFamily="system-ui,sans-serif">
            {unit}
          </text>
        )}

        {/* label */}
        <text x={G_CX} y={115} textAnchor="middle"
          fill="rgba(255,255,255,0.72)" fontSize={9.5} fontFamily="system-ui,sans-serif">
          {label}
        </text>
      </svg>
    </motion.div>
  );
}

function GaugesPreviewSection() {
  return (
    <section className="py-16 sm:py-24 px-5 sm:px-6" style={{ background: C.bg }}>
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-xs font-semibold tracking-wide mb-3" style={{ color: C.pillFg }}>
            Your dashboard
          </p>
          <h2
            className="font-extrabold mb-4"
            style={{ color: C.fg, fontFamily: 'var(--font-serif), "Cabinet Grotesk", -apple-system, BlinkMacSystemFont, sans-serif', fontSize: 'clamp(26px, 4vw, 38px)' }}
          >
            Every marker. All at once.<br className="hidden sm:block" />
            <span style={{ color: C.primary }}>Colour-coded to your range.</span>
          </h2>
          <p className="max-w-xl mx-auto text-base" style={{ color: C.muted }}>
            {GAUGE_CONFIGS.length} metabolic markers tracked simultaneously — each gauge calibrated to your personal baseline, not a population average.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
          {GAUGE_CONFIGS.map((g, i) => (
            <SvgGauge key={g.label} cfg={g} delay={i * 0.05} />
          ))}
        </div>
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
// ─── Pricing tiers ─────────────────────────────────────────────────
// Three-tier structure so £149 reads as a deliberate choice — not a
// gamble. Lite is the low-friction entry; Coached is the premium
// anchor that makes Starter (the recommended option) feel like the
// obvious middle pick. Prices are pulled from kitProducts.ts so the
// numbers can't drift from checkout.
function TiersSection() {
  const tiers = [
    {
      name: 'Meo Lite',
      tagline: 'Start with the book.',
      price: KIT_LITE.price,
      blurb: 'eBook + 7-day Meo AI trial. No device.',
      valueNote: 'Credit £29 toward Starter within 30 days.',
      badge: 'Credit toward Starter',
      features: [
        'The Thin Book of Fat (digital)',
        '7-day Meo AI trial',
        'Manual entry of past blood results',
      ],
      cta: 'Start with the book',
      href: '/checkout?plan=lite',
      featured: false,
    },
    {
      name: 'Meo Starter',
      tagline: 'The full system. Most people pick this.',
      price: KIT_PRODUCT.price,
      blurb: 'Lipid meter + 6 months of Meo AI + everything you need to read your own metabolism.',
      valueNote: '30-day money-back guarantee on the device.',
      features: [
        'Lab-grade lipid meter (UK & EU registered)',
        '6 months of Meo AI included',
        '20 test strips + lancets + carry case',
        'Biological Age Score + Target Score',
      ],
      // Monthly £29 sourced from OfferStackSection's "£29/month at
      // the standard rate" line. Annual rate isn't published yet, so
      // the post-bundle line stays monthly-only until the merchant
      // confirms a yearly figure.
      postBundle: 'After 6 months: continue with Meo AI from £29/month. Cancel any time.',
      cta: `Get Meo · ${formatGBP(KIT_PRODUCT.price)}`,
      href: '/checkout',
      featured: true,
    },
    {
      name: 'Meo Coached',
      tagline: 'Add a human in the loop.',
      price: KIT_PRODUCT.price + THERAPY_ADDON.price,
      blurb: 'Everything in Starter + 3 months of 1:1 metabolic coaching with Spencer Martin, our Metabolic Health Coach with 25+ years of experience.',
      valueNote: `Coaching alone is ${formatGBP(THERAPY_ADDON.price)} — same price here, paired with the full system.`,
      features: [
        'Everything in Meo Starter',
        '40-min onboarding consultation',
        'Two 30-min follow-ups',
        'Direct messaging with your coach',
      ],
      cta: 'Get Meo + Coach',
      href: '/checkout?addon=therapy-spencer',
      featured: false,
    },
  ] as const;

  return (
    <section id="tiers" className="py-16 sm:py-24 px-5 sm:px-6" style={{ background: C.bgDeep }}>
      <div className="max-w-6xl mx-auto">
        <SectionHeader
          eyebrow="Pick your starting point"
          title={<>Three ways in. <span style={{ color: C.primary }}>Same destination.</span></>}
          subtitle="Lite to test the water. Starter is the full system. Coached adds 1:1 support if you want a human alongside the AI."
        />

        <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
          {tiers.map((t) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45 }}
              className="relative rounded-2xl p-7 flex flex-col"
              style={{
                background: t.featured ? 'rgba(255,255,255,0.08)' : 'transparent',
                border: t.featured ? `2px solid ${C.primary}` : `1px solid rgba(255,255,255,0.08)`,
                boxShadow: t.featured
                  ? '0 30px 80px rgba(164,214,94,0.18), 0 0 0 4px rgba(164,214,94,0.06)'
                  : 'none',
                transform: t.featured ? 'scale(1.04)' : 'none',
                zIndex: t.featured ? 1 : 0,
              }}
            >
              {t.featured && (
                <span
                  className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-[10px] font-bold tracking-wide"
                  style={{ background: C.primary, color: C.primaryFg }}
                >
                  Most popular
                </span>
              )}
              {!t.featured && 'badge' in t && t.badge && (
                <span
                  className="absolute -top-3 left-1/2 -translate-x-1/2 inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold tracking-wide"
                  style={{
                    background: 'rgba(164,214,94,0.18)',
                    color: C.primary,
                    border: `1px solid ${C.primary}40`,
                  }}
                >
                  <ArrowRight className="h-3 w-3" />
                  {t.badge}
                </span>
              )}
              <div className="text-sm font-semibold mb-1" style={{ color: C.pillFg }}>{t.name}</div>
              <div className="text-base mb-5" style={{ color: C.muted }}>{t.tagline}</div>
              <div className="flex items-baseline gap-1 mb-4">
                <span
                  className="font-extrabold tabular-nums"
                  style={{
                    color: C.fg,
                    fontSize: t.featured ? 'clamp(40px, 5.5vw, 56px)' : 'clamp(28px, 3.5vw, 38px)',
                  }}
                >
                  {formatGBP(t.price)}
                </span>
                <span className="text-xs" style={{ color: C.muted }}>one-time</span>
              </div>
              <p className="text-sm mb-3" style={{ color: C.muted }}>{t.blurb}</p>
              <p className="text-xs mb-5" style={{ color: C.primary }}>{t.valueNote}</p>
              <ul className="space-y-2.5 mb-4 flex-1">
                {t.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm" style={{ color: C.fg }}>
                    <Check className="h-4 w-4 mt-0.5 shrink-0" style={{ color: C.primary }} />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              {'postBundle' in t && t.postBundle && (
                <p className="text-xs mb-7 leading-relaxed" style={{ color: C.muted }}>
                  {t.postBundle}
                </p>
              )}
              <Link
                href={t.href}
                className="inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition-opacity hover:opacity-90"
                style={{
                  background: t.featured ? C.primary : 'transparent',
                  color: t.featured ? C.primaryFg : C.fg,
                  border: t.featured ? 'none' : `1px solid ${C.border}`,
                }}
              >
                {t.cta} <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function BenefitsSection() {
  const items = [
    'Understand your cholesterol without a medical degree',
    'Measure at home in under 3 minutes, as often as you want',
    'See how food, sleep, and stress actually move your numbers',
    'Get plain-English insight from Meo AI on every reading',
    'Track a Biological Age Score that updates as you progress',
    'Catch the drift — not the diagnosis — years earlier',
    'Own your data. No monthly lab fees, no appointment waits',
    'Test as often as you want — no clinic, no fasting morning',
  ];
  return (
    <section className="py-16 sm:py-24 px-5 sm:px-6" style={{ background: C.bg }}>
      <div className="max-w-5xl mx-auto">
        <SectionHeader eyebrow="What you walk away with" title={<>What you actually walk away with.</>} />
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
        {/* Two distinct framed cards instead of a unified table:
            left = "meter alone" (muted, recedes), right = "Meo system"
            (brand-bordered, foregrounds). Visually performs the
            "before/after" comparison the headline argues for. */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-5">
          <div
            className="rounded-2xl overflow-hidden"
            style={{
              background: 'rgba(20, 55, 48, 0.55)',
              border: `1px solid ${C.border}`,
              opacity: 0.92,
            }}
          >
            <div className="px-6 py-4 text-xs font-semibold tracking-wide" style={{ background: 'rgba(255,255,255,0.04)', color: C.muted }}>
              What a meter alone gives you
            </div>
            {rows.map(([l], i) => (
              <div key={i} className="px-6 py-5" style={{ borderTop: `1px solid ${C.border}` }}>
                <code className="text-sm" style={{ color: C.muted }}>{l}</code>
              </div>
            ))}
          </div>

          <div
            className="rounded-2xl overflow-hidden"
            style={{
              background: C.bgCard,
              border: `2px solid ${C.primary}`,
              boxShadow: '0 20px 60px rgba(164,214,94,0.10)',
            }}
          >
            <div className="px-6 py-4 text-xs font-semibold tracking-wide" style={{ background: 'rgba(164,214,94,0.10)', color: C.primary }}>
              What the Meo system gives you
            </div>
            {rows.map(([, r], i) => (
              <div key={i} className="px-6 py-5" style={{ borderTop: `1px solid ${C.border}` }}>
                <div className="text-sm italic" style={{ color: C.fg }}>{r}</div>
              </div>
            ))}
          </div>
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
  // Beta tester quotes. Names abbreviated for privacy at the testers'
  // request — labelled honestly so visitors know the testimonials are
  // real but anonymised, not fabricated.
  const ts = [
    { quote: "I've had my cholesterol measured for 20 years. Meo is the first time I've actually looked at what it means. I feel like I got my 30s back.", who: 'James R., Cambridge' },
    { quote: 'My dad had a heart attack at 52. Meo AI is the first time I’ve felt ahead of the curve instead of waiting for bad news.', who: 'Priya K., London' },
    { quote: 'My ratios have improved for 11 weeks straight. It’s not the device — it’s finally seeing what I’m doing.', who: 'Marcus T., Manchester' },
    { quote: 'I asked Meo AI why my LDL went up. It pulled in two weeks of travel and said the pattern usually stabilises within 10 days. It did. Exactly that.', who: 'Clara V., Amsterdam' },
  ];
  return (
    <section className="py-16 sm:py-24 px-5 sm:px-6" style={{ background: C.bg }}>
      <div className="max-w-5xl mx-auto">
        <SectionHeader
          eyebrow="Beta tester feedback"
          title={<>The first people using Meo.</>}
          subtitle="Quotes from the closed beta. Surnames abbreviated for privacy at the testers’ request — full reviews land with the public launch."
        />
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
    photo: '/team-eric-smith.jpg',
    name: 'Dr. Eric Smith',
    title: 'Founder',
    bio: 'Innovative engineer and medical doctor who founded Meterbolic to revolutionize metabolic health diagnostics.',
  },
  {
    photo: '/team-spencer.png',
    name: 'Spencer Martin',
    title: 'Metabolic Health Coach',
    bio: '25+ years in metabolic health and diabetes coaching. Leads the 1:1 coaching programme for Meo Coached members.',
  },
  {
    photo: '/team-andy.png',
    name: 'Andy Taylor',
    title: 'Clinic Lead',
    bio: 'Former professional footballer turned metabolic health expert and UKSCA-accredited coach.',
  },
  {
    photo: '/team-saad.jpg',
    name: 'Saad Naeem',
    title: 'AI Specialist · CTO',
    bio: 'Building the intelligence layer behind Meo — architecture, backend systems, and the data that turns a finger-prick into a metabolic picture.',
  },
  {
    photo: '/team-leonard.png',
    name: 'Leonard Lin',
    title: 'Product Supervisor',
    bio: 'Overseeing product direction and ensuring every feature of Meo delivers real metabolic insight — from hardware integration to the AI conversation layer.',
  },
  {
    photo: '/team-erik.jpg',
    name: 'Erik Kettschick',
    title: 'UX/UI Designer',
    bio: 'Designing how Meo looks and feels — calm, clear, and built around the moment you read your number. Two years shaping health and product interfaces, including meterbolic.com.',
  },
];

function PartnerCard({ partner }: { partner: typeof PARTNERS[number] }) {
  // Outer card no longer carries `overflow: hidden` — that was the
  // suspect for clipping Andy's bio inside narrow carousel card widths.
  // Rounded corners are preserved by rounding the photo wrapper itself
  // (only its top corners need clipping), and the body has its own
  // border-radius via the card's outer rounding inheriting through.
  return (
    <div
      className="rounded-2xl flex flex-col h-full"
      style={{ background: C.bgCard, border: `1px solid ${C.border}` }}
    >
      <div
        className="relative w-full shrink-0 rounded-t-2xl"
        style={{ aspectRatio: '1/1', overflow: 'hidden' }}
      >
        <Image
          src={partner.photo}
          alt={partner.name}
          fill
          className="object-cover object-top"
          sizes="(min-width: 640px) 25vw, 384px"
        />
      </div>
      <div className="p-6 flex flex-col flex-1" style={{ minHeight: 180 }}>
        <p className="font-bold text-lg" style={{ color: C.fg }}>{partner.name}</p>
        <p className="text-xs font-semibold tracking-wide mt-1 mb-3" style={{ color: C.primary }}>{partner.title}</p>
        <p className="text-sm leading-relaxed break-words" style={{ color: C.muted }}>{partner.bio}</p>
      </div>
    </div>
  );
}

function PartnersSection() {
  // Every member rendered in static DOM — no conditional slicing — so
  // search engines, screen readers, and JS-disabled visitors see all
  // five. The horizontal track uses CSS scroll-snap; arrow buttons
  // scroll programmatically. No state-driven render swap, so Spencer
  // can't accidentally appear in two simultaneously-rendered viewports
  // again.
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [activeIdx, setActiveIdx] = useState(0);

  const scrollByCards = (dir: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelector('[data-partner-card]') as HTMLElement | null;
    if (!card) return;
    const cardW = card.getBoundingClientRect().width;
    const gap = parseFloat(getComputedStyle(track).columnGap || '24');
    track.scrollBy({ left: dir * (cardW + gap), behavior: 'smooth' });
  };

  // Track which card is most-visible to drive the dot indicators.
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const cards = Array.from(track.querySelectorAll('[data-partner-card]'));
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting && e.intersectionRatio > 0.6) {
            const i = cards.indexOf(e.target);
            if (i >= 0) setActiveIdx(i);
          }
        });
      },
      { root: track, threshold: [0.6, 0.9] },
    );
    cards.forEach((c) => io.observe(c));
    return () => io.disconnect();
  }, []);

  const goTo = (i: number) => {
    const track = trackRef.current;
    if (!track) return;
    const cards = track.querySelectorAll('[data-partner-card]');
    (cards[i] as HTMLElement | undefined)?.scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
  };

  return (
    <section className="py-16 sm:py-24 px-5 sm:px-6" style={{ background: C.bgDeep }}>
      <div className="max-w-6xl mx-auto">
        <SectionHeader
          eyebrow="The team behind Meo"
          title={<>Built by people who <span style={{ color: C.primary }}>live</span> this.</>}
          subtitle="Clinical, commercial, AI, and design expertise — all pointed at one goal: making your cholesterol data actually useful."
        />

        <div className="relative mt-12">
          <div
            ref={trackRef}
            className="flex gap-6 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-2 -mx-5 sm:-mx-6 px-5 sm:px-6"
            style={{ scrollSnapType: 'x mandatory' }}
          >
            {PARTNERS.map((p) => (
              <div
                key={p.name}
                data-partner-card
                className="snap-start shrink-0 w-[85%] sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]"
              >
                <PartnerCard partner={p} />
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-center gap-4 mt-8">
          <button
            onClick={() => scrollByCards(-1)}
            className="w-10 h-10 rounded-full flex items-center justify-center transition-opacity hover:opacity-80"
            style={{ background: C.bgCard, border: `1px solid ${C.border}`, color: C.fg }}
            aria-label="Previous team members"
          >
            <ChevronDown className="h-5 w-5 rotate-90" />
          </button>
          <div className="flex gap-2">
            {PARTNERS.map((p, i) => (
              <button
                key={p.name}
                onClick={() => goTo(i)}
                className="rounded-full transition-all duration-300"
                style={{
                  width: i === activeIdx ? 20 : 8,
                  height: 8,
                  background: i === activeIdx ? C.primary : C.border,
                }}
                aria-label={`Show ${p.name}`}
              />
            ))}
          </div>
          <button
            onClick={() => scrollByCards(1)}
            className="w-10 h-10 rounded-full flex items-center justify-center transition-opacity hover:opacity-80"
            style={{ background: C.bgCard, border: `1px solid ${C.border}`, color: C.fg }}
            aria-label="Next team members"
          >
            <ChevronDown className="h-5 w-5 -rotate-90" />
          </button>
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
      a: 'The BF-102 is CE-marked and reads within ±10% of reference-lab panels for TC, HDL, LDL and triglycerides. But the real value of Meo is in the trend across hundreds of your own readings — small per-reading variance washes out in the pattern.',
    },
    {
      q: 'Is it hard to use?',
      a: 'A finger-prick and a strip — the same motion a diabetic runs three times a day. If you can tap your phone, you can run a Meo reading in under 3 minutes.',
    },
    {
      q: 'Can I trust the AI?',
      a: 'Meo AI does not diagnose, prescribe, or replace your doctor. It reads your history, identifies your biological patterns, and tells you clearly what it sees. When something is unusual, it recommends you see a healthcare professional. You are always in charge.',
    },
    {
      q: '£149 — what does that actually get me?',
      a: 'MeO is here to be your companion lifelong, to help you to achieve optimal vitality and healthy ageing. As your first step in this journey, you enjoy 6 months of Meo AI (the world\'s first AI specialising in Metabolic Health), with the lipid meter, 10 lipid test strips (lancets & carry case), Dashboard, PDF Report and Biological Age Score calculations and your personal targets all bundled in. One private-clinic panel costs £80–£150, runs once, gives you just the raw numbers on paper. Meo costs £149, runs multiple times to track your progress as you make the MeO proposed changes, and pairs each reading with AI interpretation you can actually act on to improve yourself. Start the journey with our science at your beck and call',
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
          Use Meo for 30 days. Take your readings. Watch your Biological Age Score update. If you don&apos;t feel clearer, in control, and like you finally understand what your body&apos;s been trying to tell you — return the device. Full refund on the device. No questions asked.
        </p>
        <CTAButton size="lg">Claim your risk-free 30 days <ArrowRight className="h-4 w-4" /></CTAButton>
        <p className="text-xs mt-5" style={{ color: C.muted }}>
          <Link href="#faq" className="underline">
            See the refund FAQ
          </Link>
          {' · '}
          <Link href="/terms#refund" className="underline">
            Read full refund terms
          </Link>
        </p>
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
  // All FAQ items collapsed on load. Answers still render to the DOM
  // (visually clamped via the max-height transition) so crawlers and
  // screen readers see the full content; only their visibility is
  // toggled by user interaction.
  const [openSet, setOpenSet] = useState<Set<number>>(new Set());
  const toggle = (i: number) => {
    setOpenSet((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i); else next.add(i);
      return next;
    });
  };
  return (
    <section id="faq" className="py-16 sm:py-24 px-5 sm:px-6" style={{ background: C.bg }}>
      <div className="max-w-3xl mx-auto">
        <SectionHeader eyebrow="FAQ" title={<>Common questions.</>} />
        <div className="mt-10 space-y-3">
          {FAQ_ITEMS.map((item, i) => {
            const open = openSet.has(i);
            const panelId = `faq-panel-${i}`;
            return (
              <div
                key={i}
                className="rounded-2xl overflow-hidden"
                style={{ background: C.bgCard, border: `1px solid ${C.border}` }}
              >
                <button
                  className="w-full flex items-center justify-between px-6 py-5 text-left"
                  aria-expanded={open}
                  aria-controls={panelId}
                  onClick={() => toggle(i)}
                >
                  <span className="font-medium" style={{ color: C.fg }}>{item.question}</span>
                  <ChevronDown
                    className="h-5 w-5 shrink-0 ml-4 transition-transform duration-200"
                    style={{ color: C.muted, transform: open ? 'rotate(180deg)' : 'none' }}
                  />
                </button>
                <div
                  id={panelId}
                  className="transition-[max-height] duration-300 ease-out overflow-hidden"
                  style={{ maxHeight: open ? 1000 : 0 }}
                  aria-hidden={!open}
                >
                  <p className="px-6 pb-5 text-sm" style={{ color: C.muted }}>{item.answer}</p>
                </div>
              </div>
            );
          })}
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
    <section id="newsletter" className="py-14 sm:py-20 px-5 sm:px-6" style={{ background: C.bgDeep }}>
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
        {state !== 'done' && (
          <p className="mt-4 text-xs" style={{ color: C.muted }}>
            By subscribing you agree to our{' '}
            <Link href="/privacy" className="underline" style={{ color: C.muted }}>Privacy Policy</Link>.
            Unsubscribe any time.
          </p>
        )}
        {state === 'error' && (
          <p className="mt-3 text-sm" style={{ color: '#f87171' }}>Something went wrong — please try again.</p>
        )}
      </motion.div>
    </section>
  );
}

// ─── Final CTA closer — last hard ask before the soft newsletter
// downsell. Without this, the page ends on "you don't have to buy",
// which weakens the final action prompt.
function CloserSection() {
  return (
    <section className="py-20 px-5 sm:px-6 text-center" style={{ background: C.bg }}>
      <div className="max-w-2xl mx-auto">
        <p className="text-xs font-semibold tracking-wide mb-4" style={{ color: C.pillFg }}>
          Still here?
        </p>
        <h2
          className="font-extrabold mb-5"
          style={{
            color: C.fg,
            fontFamily: 'var(--font-serif), "Cabinet Grotesk", -apple-system, BlinkMacSystemFont, sans-serif',
            fontSize: 'clamp(28px, 4vw, 40px)',
          }}
        >
          The next reading you take could be your <span style={{ color: C.primary }}>baseline</span>.
        </h2>
        <p className="text-base mb-8" style={{ color: C.muted }}>
          Or your tenth annual blood draw could be. Your choice.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <CTAButton size="lg" href="/checkout">
            Get Meo · {formatGBP(KIT_PRODUCT.price)} <ArrowRight className="h-4 w-4" />
          </CTAButton>
          <a href="#tiers" className="text-sm hover:underline" style={{ color: C.muted }}>
            Compare plans
          </a>
        </div>
        <p className="text-xs mt-4" style={{ color: C.muted }}>
          30-day money-back guarantee · UK & EU IVDR Registered
        </p>
      </div>
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
          <Link href="/cookies" className="hover:underline" style={{ color: C.muted }}>Cookies</Link>
          <a href="mailto:hello@meterbolic.com" className="hover:underline" style={{ color: C.muted }}>Contact</a>
        </nav>
      </div>
      <p className="text-xs leading-relaxed mb-3 max-w-3xl" style={{ color: C.muted }}>
        Meo is a wellness and monitoring tool. It is not intended to diagnose, treat, cure, or prevent any disease.
        Always consult your GP or a qualified healthcare professional for medical advice. Readings are informational
        and are not a substitute for professional testing. Meo AI provides pattern-based insights, not medical advice;
        if something concerns you, speak to a healthcare professional.
      </p>
      <p className="text-xs" style={{ color: C.muted }}>© 2026 Metabolic Health Ltd. All rights reserved.</p>
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
function UrgencyBadge() {
  // Only displays scarcity when the stock API actually says low.
  // The random "people viewing now" counter has been removed —
  // unsourced urgency erodes trust on a medical-adjacent page.
  const [stock, setStock] = useState<{ count: number; available: boolean; low: boolean } | null>(null);

  useEffect(() => {
    fetch('/api/stock')
      .then((r) => r.json())
      .then(setStock)
      .catch(() => null);
  }, []);

  if (!stock) return null;

  if (!stock.available) {
    return (
      <p className="text-xs font-medium text-center mt-2" style={{ color: '#f87171' }}>
        ⚠️ Currently out of stock —{' '}
        <button
          onClick={() => document.getElementById('newsletter')?.scrollIntoView({ behavior: 'smooth' })}
          className="underline cursor-pointer bg-transparent border-0 p-0 font-medium"
          style={{ color: '#f87171' }}
        >
          join the waiting list
        </button>
      </p>
    );
  }

  if (!stock.low) return null;

  return (
    <div className="flex justify-center mt-2">
      <span className="text-xs font-medium" style={{ color: C.danger }}>
        ⚡ Only {stock.count} kits left in this batch
      </span>
    </div>
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
              <p className="text-xs" style={{ color: C.muted }}>Ships in 72 hours</p>
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
              className="font-extrabold mt-4 mb-3 leading-tight"
              style={{ color: C.fg, fontSize: 'clamp(22px, 4vw, 28px)', fontFamily: 'var(--font-serif), "Cabinet Grotesk", -apple-system, BlinkMacSystemFont, sans-serif' }}
            >
              Your metabolism <span style={{ color: C.primary }}>doesn&apos;t take a break.</span>
            </h2>
            <p className="text-sm mb-4" style={{ color: C.muted }}>
              364 days of drift invisible between one annual blood draw and the next.
              Meo runs weekly for 6 months on a single {formatGBP(KIT_PRODUCT.price)} — so the trend becomes visible.
            </p>
            <blockquote
              className="text-sm mb-6 pl-3 border-l-2"
              style={{ color: C.fg, borderColor: C.primary, fontStyle: 'italic' }}
            >
              &ldquo;My ratios have improved for 11 weeks straight.&rdquo;
              <footer className="text-xs not-italic mt-1" style={{ color: C.muted }}>
                — Marcus T., Manchester (beta tester)
              </footer>
            </blockquote>
            <Link
              href="/checkout"
              onClick={dismiss}
              className="inline-flex items-center justify-center gap-2 w-full px-6 py-3.5 rounded-xl font-semibold text-base transition-opacity hover:opacity-90"
              style={{ background: C.primary, color: C.primaryFg }}
            >
              Start 30 days risk-free <ArrowRight className="h-4 w-4" />
            </Link>
            <p className="text-xs mt-3" style={{ color: C.muted }}>
              Full refund within 30 days, no questions asked.
            </p>
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
      <TrustPanel />
      <ProblemSection />
      <WhyTestsFailSection />
      <MeetMeoSection />
      {/* Chat demo lifted to the top half — it's the most differentiated
          and emotionally compelling moment on the page. Followed
          immediately by tiered pricing so the £149 reads as a deliberate
          middle choice, not a gamble. */}
      <MeoAISection />
      <TiersSection />

      <BiomarkersSection />
      <EbookSection />
      <ScoresSection />
      <AppPreviewSection />
      <BenefitsSection />
      <NumbersVsInsightsSection />
      <TestimonialsSection />
      <PartnersSection />
      <GuaranteeSection />
      <FAQSection />
      <CloserSection />
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
