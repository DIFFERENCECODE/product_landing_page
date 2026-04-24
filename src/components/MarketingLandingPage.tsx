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

import React, { useState } from 'react';
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
  children = <>Get your Meo Starter System <ArrowRight className="h-4 w-4" /></>,
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
        <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: C.pillFg }}>
          {eyebrow}
        </p>
      )}
      <h2
        className="font-extrabold mb-4 leading-tight"
        style={{ color: C.fg, fontFamily: 'var(--font-serif), Georgia, serif', fontSize: 'clamp(28px, 4vw, 40px)' }}
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
      <Link href="/" className="flex items-center gap-1.5">
        <span className="text-xl font-bold" style={{ color: C.fg }}>Me</span>
        <DropletIcon size={20} />
        <span className="hidden sm:inline text-xs ml-2 uppercase tracking-widest" style={{ color: C.muted }}>
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
function Hero() {
  return (
    <section className="relative min-h-screen flex items-center pt-24 pb-12 sm:pb-16 px-5 sm:px-6" style={{ background: C.bg }}>
      <div className="max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium mb-6"
            style={{ background: C.pill, color: C.pillFg }}
          >
            <Sparkles className="h-3.5 w-3.5" />
            Metabolic Intelligence System
          </div>

          <h1
            className="font-extrabold leading-[1.05] mb-6"
            style={{ color: C.fg, fontFamily: 'var(--font-serif), Georgia, serif', fontSize: 'clamp(40px, 6vw, 68px)' }}
          >
            See what your<br />
            cholesterol is<br />
            <span style={{ color: C.primary }}>actually</span> telling you.
          </h1>

          <p className="text-base sm:text-lg mb-8 max-w-lg" style={{ color: C.muted }}>
            Meo turns a 3-minute finger-prick into a complete metabolic picture — interpreted by AI,
            framed for longevity, and actionable the same day.
          </p>

          <div className="flex flex-wrap items-center gap-2 text-xs mb-8" style={{ color: C.muted }}>
            <span className="inline-flex items-center gap-1.5"><Shield className="h-3.5 w-3.5" style={{ color: C.primary }} /> 30-day money-back</span>
            <span style={{ color: C.border }}>·</span>
            <span className="inline-flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" style={{ color: C.primary }} /> Ships in 48h</span>
            <span style={{ color: C.border }}>·</span>
            <span className="inline-flex items-center gap-1.5"><TrendingUp className="h-3.5 w-3.5" style={{ color: C.primary }} /> Used in 14 countries</span>
          </div>

          <div
            className="block sm:inline-block w-full sm:w-auto rounded-2xl p-5 sm:p-6"
            style={{ background: C.bgCard, border: `1px solid ${C.border}` }}
          >
            <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: C.muted }}>
              Launch price
            </p>
            <p
              className="font-bold mb-1 flex items-baseline flex-wrap gap-x-3 gap-y-1"
              style={{ color: C.fg, fontSize: 'clamp(28px, 5vw, 34px)' }}
            >
              {formatGBP(KIT_PRODUCT.price)}
              <span className="text-base font-normal line-through" style={{ color: C.muted }}>£197</span>
              <span className="text-xs font-medium px-2 py-0.5 rounded" style={{ background: C.pill, color: C.pillFg }}>
                Save £48
              </span>
            </p>
            <p className="text-sm mb-4" style={{ color: C.muted }}>
              One-time. Includes 1 month of Meo AI.
            </p>
            <CTAButton>Get your Meo Starter System <ArrowRight className="h-4 w-4" /></CTAButton>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="relative flex items-center justify-center"
        >
          <div
            className="w-full max-w-lg rounded-3xl overflow-hidden"
            style={{ background: 'rgba(255,255,255,0.06)', border: `1px solid ${C.border}` }}
          >
            <Image
              src="/sejoy_1.png"
              alt="Meo lipid meter — Total Cholesterol, HDL, LDL, Triglycerides and TC/HDL readings"
              width={600}
              height={520}
              className="w-full h-auto object-contain"
              priority
            />
          </div>
          <div
            className="absolute -bottom-3 -right-3 px-4 py-2 rounded-xl text-xs font-semibold"
            style={{ background: C.primary, color: C.primaryFg, boxShadow: '0 10px 30px rgba(0,0,0,0.25)' }}
          >
            Meo AI included · 1 month free
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ─── Problem / Agitation ─────────────────────────────────────────────
function ProblemSection() {
  const items = [
    "You don't know if yesterday's meal moved your lipids.",
    "You don't know if last week's sleep collapse nudged your ratios.",
    "You don't know whether the supplement you've taken for six months is helping.",
    "And nobody tells you whether a 42-year-old's TC/HDL ratio should really be where yours is.",
  ];
  return (
    <section className="py-16 sm:py-24 px-5 sm:px-6" style={{ background: C.bgDeep }}>
      <div className="max-w-4xl mx-auto">
        <SectionHeader
          eyebrow="The visibility problem"
          title={<>You&apos;re not lazy. Your data is just too sparse to act on.</>}
          subtitle="Most people over 35 get one cholesterol reading per year — a single snapshot, a set of numbers, a 90-second conversation. By the time a number 'trends up', the process behind it has been quietly accelerating for years."
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

        <p className="mt-10 text-center text-lg font-medium" style={{ color: C.primary, fontFamily: 'var(--font-serif), Georgia, serif' }}>
          That isn&apos;t a willpower problem. That&apos;s a visibility problem.
        </p>
      </div>
    </section>
  );
}

// ─── Why Standard Tests Fail ─────────────────────────────────────────
function WhyTestsFailSection() {
  const rows = [
    ['Only measures fasting values', 'Your body is metabolic 23 hours a day, not just in the morning'],
    ['Gives you one snapshot', 'You need the trend to see anything real'],
    ['Reports Total Cholesterol', 'The ratios and patterns are what predict outcomes'],
    ['Treats you like the median 50-year-old', 'You are not the median 50-year-old'],
    ['Arrives as raw numbers', 'You need to know: is this getting better, worse, or staying put?'],
  ];
  return (
    <section className="py-16 sm:py-24 px-5 sm:px-6" style={{ background: C.bg }}>
      <div className="max-w-4xl mx-auto">
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
            className="hidden sm:grid grid-cols-2 text-xs font-semibold uppercase tracking-widest px-6 py-4"
            style={{ background: 'rgba(255,255,255,0.04)', color: C.muted }}
          >
            <div>Standard blood test</div>
            <div>What&apos;s missing</div>
          </div>
          {rows.map(([l, r], i) => (
            <div
              key={i}
              className="px-5 sm:px-6 py-5 text-sm grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6"
              style={{ borderTop: `1px solid ${C.border}` }}
            >
              <div style={{ color: C.muted }}>
                <span
                  className="sm:hidden block text-[10px] font-semibold uppercase tracking-widest mb-1"
                  style={{ color: C.pillFg }}
                >
                  Standard test
                </span>
                {l}
              </div>
              <div style={{ color: C.fg }}>
                <span
                  className="sm:hidden block text-[10px] font-semibold uppercase tracking-widest mb-1"
                  style={{ color: C.pillFg }}
                >
                  What&apos;s missing
                </span>
                {r}
              </div>
            </div>
          ))}
        </div>
        <p className="mt-10 text-center font-medium text-lg max-w-2xl mx-auto" style={{ color: C.fg }}>
          The core problem isn&apos;t the test. It&apos;s the gap between <span style={{ color: C.primary }}>data</span> and <span style={{ color: C.primary }}>decision</span>.
        </p>
      </div>
    </section>
  );
}

// ─── Meet Meo (system intro) ─────────────────────────────────────────
function MeetMeoSection() {
  const pieces = [
    { icon: <Activity className="h-6 w-6" style={{ color: C.primary }} />, title: 'The Digital Lipid Meter', sub: 'draws data' },
    { icon: <Brain className="h-6 w-6" style={{ color: C.primary }} />, title: 'The Meo AI App', sub: 'turns data into meaning' },
    { icon: <BookOpen className="h-6 w-6" style={{ color: C.primary }} />, title: 'The eBook', sub: 'turns meaning into action' },
  ];
  return (
    <section className="py-16 sm:py-24 px-5 sm:px-6" style={{ background: C.bgDeep }}>
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

// ─── Biomarkers ──────────────────────────────────────────────────────
function BiomarkersSection() {
  return (
    <section className="py-16 sm:py-24 px-5 sm:px-6" style={{ background: C.bg }}>
      <div className="max-w-5xl mx-auto text-center">
        <SectionHeader
          eyebrow="What Meo measures"
          title={<>Six markers. One drop of blood.</>}
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
          className="rounded-3xl overflow-hidden"
          style={{ background: C.bgCard, border: `1px solid ${C.border}` }}
        >
          <Image
            src="/sejoy_1.png"
            alt="Meo Digital Lipid Meter — finger-prick, strip, 3 minutes"
            width={600}
            height={520}
            className="w-full h-auto object-contain"
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: C.pillFg }}>
            The device
          </p>
          <h2 className="font-extrabold mb-5" style={{ color: C.fg, fontFamily: 'var(--font-serif), Georgia, serif', fontSize: 'clamp(28px, 4vw, 36px)' }}>
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
      <div className="max-w-3xl mx-auto">
        <SectionHeader
          eyebrow="Pattern insight"
          title={<>The <span style={{ color: C.primary }}>pattern</span> behind the number.</>}
        />
        <div className="mt-10 space-y-5 text-base" style={{ color: C.muted }}>
          <p>
            Decades ago, cardiologist Dr. Joseph Kraft showed that much of what we now call &quot;pre-diabetes&quot; is visible in insulin response patterns years before a standard fasting glucose test picks anything up.
          </p>
          <p>
            Meo AI reads patterns inspired by that framework — analysed across your lipid readings over time — and surfaces a simplified <strong style={{ color: C.fg }}>insulin-pattern signal</strong>.
          </p>
          <p className="font-medium" style={{ color: C.fg }}>
            It is not a diagnosis. It&apos;s a pattern flag: a gentle nudge that says <em>&quot;something here is worth watching.&quot;</em>
          </p>
          <div
            className="rounded-2xl p-5 flex items-start gap-4 mt-8"
            style={{ background: C.bgCard, border: `1px solid ${C.border}` }}
          >
            <Quote className="h-5 w-5 mt-1 shrink-0" style={{ color: C.primary }} />
            <p className="italic text-sm" style={{ color: C.fg }}>
              Think of it the way a financial advisor reads a trend line — not the way a doctor reads a lab result.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Biological Age Score ────────────────────────────────────────────
function BioAgeSection() {
  return (
    <section className="py-16 sm:py-24 px-5 sm:px-6" style={{ background: C.bgDeep }}>
      <div className="max-w-4xl mx-auto text-center">
        <SectionHeader
          eyebrow="Biological Age Score"
          title={<>Your number, read in <span style={{ color: C.primary }}>years</span>.</>}
          subtitle="Every reading feeds a single number we call your Biological Age Score. It's not a diagnosis. It's a compass."
        />
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            { icon: <TrendingUp className="h-5 w-5" style={{ color: C.primary }} />, label: 'Drops when your ratios improve' },
            { icon: <Activity className="h-5 w-5" style={{ color: C.primary }} />, label: 'Rises when they drift' },
            { icon: <Sparkles className="h-5 w-5" style={{ color: C.primary }} />, label: 'One number, updated weekly' },
          ].map((x, i) => (
            <div
              key={i}
              className="rounded-2xl p-6 flex flex-col items-center gap-3"
              style={{ background: C.bgCard, border: `1px solid ${C.border}` }}
            >
              <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: C.pill }}>
                {x.icon}
              </div>
              <p className="text-sm" style={{ color: C.fg }}>{x.label}</p>
            </div>
          ))}
        </div>
        <p className="mt-10 max-w-2xl mx-auto italic text-base" style={{ color: C.muted }}>
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
            style={{ color: C.fg, fontFamily: 'var(--font-serif), Georgia, serif', fontSize: 'clamp(32px, 5vw, 48px)' }}
          >
            An intelligence that speaks your<br />
            <span style={{ color: C.primary }}>biology</span> back to you.
          </h2>
          <p className="max-w-2xl mx-auto text-base sm:text-lg" style={{ color: C.muted }}>
            This is what you&apos;re actually buying. The meter collects. The eBook teaches.
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
              <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: C.pillFg }}>
                {p.title}
              </p>
              <p className="text-sm" style={{ color: C.fg }}>{p.body}</p>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-14">
          <p className="text-lg font-medium mb-6" style={{ color: C.fg, fontFamily: 'var(--font-serif), Georgia, serif' }}>
            Your data, read aloud. Daily.
          </p>
          <CTAButton size="lg">Try Meo AI now <ArrowRight className="h-4 w-4" /></CTAButton>
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
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: C.pillFg }}>
            The action manual
          </p>
          <h2 className="font-extrabold mb-5" style={{ color: C.fg, fontFamily: 'var(--font-serif), Georgia, serif', fontSize: 'clamp(28px, 4vw, 36px)' }}>
            Insight without action is just <span style={{ color: C.primary }}>anxiety</span>.
          </h2>
          <p className="text-base mb-3" style={{ color: C.muted }}>
            <em>How to Improve Your Cholesterol &amp; Lower Your Biological Age Naturally</em> — the manual Meo AI references when it talks to you.
          </p>
          <p className="text-sm mb-6" style={{ color: C.muted }}>
            Included digitally with every Meo Starter System.
          </p>
        </div>
        <div
          className="rounded-2xl p-6"
          style={{ background: C.bgCard, border: `1px solid ${C.border}` }}
        >
          <ul className="space-y-3">
            {chapters.map((c, i) => (
              <li key={i} className="flex items-start gap-3 text-sm" style={{ color: C.fg }}>
                <BookOpen className="h-4 w-4 mt-0.5 shrink-0" style={{ color: C.primary }} />
                {c}
              </li>
            ))}
          </ul>
        </div>
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
          <div className="grid grid-cols-1 sm:grid-cols-[1fr_2fr] text-xs font-semibold uppercase tracking-widest px-6 py-4" style={{ background: 'rgba(255,255,255,0.04)', color: C.muted }}>
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
        <p className="text-center text-lg font-medium mt-10" style={{ color: C.fg, fontFamily: 'var(--font-serif), Georgia, serif' }}>
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
      q: '£149 feels like a lot.',
      a: 'One private-clinic panel costs £80–£150, runs once, gives you paper. Meo costs £149 once, runs unlimited times, and ships with its action manual and AI interpretation layer. Most customers break even on testing cost within 24 months.',
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
        <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: C.pillFg }}>
          30 days, risk-free
        </p>
        <h2
          className="font-extrabold mb-4"
          style={{ color: C.fg, fontFamily: 'var(--font-serif), Georgia, serif', fontSize: 'clamp(28px, 4vw, 36px)' }}
        >
          &ldquo;Start seeing, or send it back.&rdquo;
        </h2>
        <p className="text-base mb-8 max-w-xl mx-auto" style={{ color: C.muted }}>
          Use Meo for 30 days. Take your readings. Watch your Biological Age Score update. If you don&apos;t feel clearer, in control, and like you finally understand what your body&apos;s been trying to tell you — return the device. Full refund. Keep the eBook.
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
                  className="self-start px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider"
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
  const [state, setState] = useState<'idle' | 'submitting' | 'done' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setState('submitting');
    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: 'newsletter' }),
      });
      if (!res.ok && res.status !== 404) throw new Error('Failed');
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
          Not ready yet? Get the starter guide.
        </div>
        <h2
          className="font-extrabold mb-3"
          style={{ color: C.fg, fontFamily: 'var(--font-serif), Georgia, serif', fontSize: 'clamp(26px, 4vw, 34px)' }}
        >
          Stay ahead of your health.
        </h2>
        <p className="text-base mb-8" style={{ color: C.muted }}>
          Get the free <strong style={{ color: C.fg }}>Metabolic Health Starter Guide</strong> and updates on Meo. No spam — ever.
        </p>
        {state === 'done' ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl font-semibold"
            style={{ background: C.pill, color: C.pillFg }}
          >
            <DropletIcon size={16} /> You&apos;re on the list — watch your inbox!
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-sm mx-auto">
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
              {state === 'submitting' ? 'Joining…' : <>Join free <ArrowRight className="h-4 w-4" /></>}
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
    <footer className="pt-10 pb-28 sm:pb-10 px-6" style={{ background: C.bg, borderTop: `1px solid ${C.border}` }}>
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-8">
          <Link href="/" className="flex items-center gap-1.5">
            <span className="font-bold" style={{ color: C.fg }}>Me</span>
            <DropletIcon size={16} />
            <span className="text-sm ml-2" style={{ color: C.muted }}>Metabolic Intelligence · by Meterbolic</span>
          </Link>
          <p className="text-sm" style={{ color: C.muted }}>© 2026 Meterbolic. All rights reserved.</p>
        </div>
        <p className="text-xs leading-relaxed" style={{ color: C.muted }}>
          Meo is a wellness and monitoring tool. It is not intended to diagnose, treat, cure, or prevent any disease.
          Always consult your GP or a qualified healthcare professional for medical advice. Readings are informational
          and are not a substitute for professional testing. Meo AI provides pattern-based insights, not medical advice;
          if something concerns you, speak to a healthcare professional.
        </p>
      </div>
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

// ─── Page ─────────────────────────────────────────────────────────────
export default function MarketingLandingPage() {
  return (
    <div style={{ background: C.bg }}>
      <Navbar />
      <Hero />
      <ProblemSection />
      <WhyTestsFailSection />
      <MeetMeoSection />
      <BiomarkersSection />
      <LipidTrackingSection />
      <InsulinPatternSection />
      <BioAgeSection />
      <MeoAISection />
      <EbookSection />
      <BenefitsSection />
      <NumbersVsInsightsSection />
      <TestimonialsSection />
      <ObjectionsSection />
      <GuaranteeSection />
      <AddonsSection />
      <FAQSection />
      <NewsletterSection />
      <Footer />
      <StickyMobileCTA />
    </div>
  );
}

// Keep FEATURE_ICONS exported for the checkout page's feature list.
export { FEATURE_ICONS };
