'use client';

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
} from 'lucide-react';
import {
  KIT_PRODUCT,
  KIT_ADDONS,
  BIOMARKERS,
  FAQ_ITEMS,
  formatGBP,
} from '@/lib/kitProducts';

// ─── Brand colours (hardcoded to avoid ThemeProvider dependency on a
//     purely public page that renders before any user session exists) ───
const C = {
  bg: '#1c4a40',
  bgCard: 'rgba(30, 70, 60, 0.85)',
  bgCardHover: 'rgba(38, 80, 68, 0.95)',
  border: 'rgba(255,255,255,0.10)',
  primary: '#a4d65e',
  primaryFg: '#1a3a2a',
  fg: '#ffffff',
  muted: 'rgba(255,255,255,0.62)',
  pill: 'rgba(164,214,94,0.18)',
  pillFg: '#a4d65e',
};

// ─── Blood-droplet logo mark ─────────────────────────────────────────
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

// ─── Feature icon map ─────────────────────────────────────────────────
const FEATURE_ICONS: Record<string, React.ReactNode> = {
  heart: <Heart className="h-5 w-5" style={{ color: C.primary }} />,
  'bar-chart': <BarChart2 className="h-5 w-5" style={{ color: C.primary }} />,
  activity: <Activity className="h-5 w-5" style={{ color: C.primary }} />,
  refresh: <RefreshCw className="h-5 w-5" style={{ color: C.primary }} />,
  book: <BookOpen className="h-5 w-5" style={{ color: C.primary }} />,
  message: <MessageCircle className="h-5 w-5" style={{ color: C.primary }} />,
};

// ─── Navbar ──────────────────────────────────────────────────────────
function Navbar() {
  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4"
      style={{ background: 'rgba(28,74,64,0.92)', backdropFilter: 'blur(12px)', borderBottom: `1px solid ${C.border}` }}
    >
      <Link href="/" className="flex items-center gap-1.5">
        <span className="text-xl font-bold" style={{ color: C.fg }}>
          Me
        </span>
        <DropletIcon size={20} />
      </Link>

      <Link
        href="/checkout"
        className="flex items-center justify-center p-2.5 rounded-xl transition-opacity hover:opacity-90"
        style={{ background: C.primary, color: C.primaryFg }}
        aria-label="Checkout — get your kit"
      >
        <ShoppingCart className="h-5 w-5" />
      </Link>
    </nav>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────
function Hero() {
  return (
    <section
      className="min-h-screen flex items-center pt-20 pb-16 px-6"
      style={{ background: C.bg }}
    >
      <div className="max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left: copy + CTA */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Category pill */}
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium mb-6"
            style={{ background: C.pill, color: C.pillFg }}
          >
            <DropletIcon size={14} />
            Metabolic Health Cholesterol Tracker
          </div>

          <h1
            className="font-extrabold leading-tight mb-6"
            style={{ color: C.fg, fontFamily: 'Georgia, serif', fontSize: '60px' }}
          >
            Know your<br />
            Metabolic<br />
            health in<br />
            minutes.
          </h1>

          <p className="text-base mb-10 max-w-md" style={{ color: C.muted }}>
            One finger-prick. Five biomarkers. Your complete lipid picture at
            home — plus a personalised plan, the eBook, and 3 months of your
            MeO AI coach.
          </p>

          {/* Price + CTA */}
          <div
            className="inline-block rounded-2xl p-6"
            style={{ background: C.bgCard, border: `1px solid ${C.border}` }}
          >
            <p
              className="text-xs font-semibold uppercase tracking-widest mb-1"
              style={{ color: C.muted }}
            >
              COMPLETE KIT
            </p>
            <p className="font-bold mb-1" style={{ color: C.fg, fontSize: '30px' }}>
              {formatGBP(KIT_PRODUCT.price)}{' '}
              <span className="text-base font-normal" style={{ color: C.muted }}>
                one-time
              </span>
            </p>
            <Link
              href="/checkout"
              className="mt-4 flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-semibold text-base transition-opacity hover:opacity-90"
              style={{ background: C.primary, color: C.primaryFg }}
            >
              Get your kit <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </motion.div>

        {/* Right: product image */}
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
              alt="Sejoy BF-101b lipid meter showing TC, HDL, TG, LDL and TC/HDL readings"
              width={600}
              height={520}
              className="w-full h-auto object-contain"
              priority
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ─── What You Measure ─────────────────────────────────────────────────
function BiomarkersSection() {
  return (
    <section className="py-24 px-6" style={{ background: 'rgba(20,55,48,0.95)' }}>
      <div className="max-w-5xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
        >
          <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: C.pillFg }}>
            WHAT YOU MEASURE
          </p>
          <h2 className="font-extrabold mb-4" style={{ color: C.fg, fontFamily: 'Georgia, serif', fontSize: '30px' }}>
            Five markers. One drop of blood.
          </h2>
          <p className="text-base mb-14" style={{ color: C.muted }}>
            A lab-grade cholesterol panel — right on your kitchen table.
          </p>
        </motion.div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {BIOMARKERS.map((bm, i) => (
            <motion.div
              key={bm.abbr}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.07 }}
              className="rounded-2xl p-6 flex flex-col items-center gap-2"
              style={{ background: C.bgCard, border: `1px solid ${C.border}` }}
            >
              <p className="font-bold" style={{ color: bm.abbr === 'Bio Age' ? C.primary : C.fg, fontSize: '20px' }}>
                {bm.abbr}
              </p>
              <p className="text-sm" style={{ color: C.muted }}>{bm.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── What's In The Kit ────────────────────────────────────────────────
function KitContentsSection() {
  return (
    <section className="py-24 px-6" style={{ background: C.bg }}>
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Left: product image */}
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
            alt="Sejoy BF-101b lipid meter showing TC, HDL, TG, LDL and TC/HDL readings"
            width={600}
            height={520}
            className="w-full h-auto object-contain"
          />
        </motion.div>

        {/* Right: feature list */}
        <motion.div
          initial={{ opacity: 0, x: 24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <p
            className="text-xs font-semibold uppercase tracking-widest mb-3"
            style={{ color: C.pillFg }}
          >
            WHAT'S IN THE KIT
          </p>
          <h2
            className="font-extrabold mb-3"
            style={{ color: C.fg, fontFamily: 'Georgia, serif', fontSize: '30px' }}
          >
            Everything you need to start.
          </h2>
          <p className="text-base mb-8" style={{ color: C.muted }}>
            A complete bundle — the device, your 6-month retest, the book, and your AI coach. One
            price. No surprises.
          </p>

          <div className="space-y-5 mb-10">
            {KIT_PRODUCT.features.map((f) => (
              <div key={f.title} className="flex items-start gap-4">
                <div
                  className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: C.pill }}
                >
                  {FEATURE_ICONS[f.icon]}
                </div>
                <div>
                  <p className="font-semibold text-sm" style={{ color: C.fg }}>
                    {f.title}
                  </p>
                  <p className="text-sm" style={{ color: C.muted }}>
                    {f.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Sticky CTA card */}
          <div
            className="rounded-2xl p-5 flex items-center justify-between"
            style={{ background: C.bgCard, border: `1px solid ${C.border}` }}
          >
            <div>
              <p className="text-xs mb-0.5" style={{ color: C.muted }}>
                Complete kit
              </p>
              <p className="font-bold" style={{ color: C.fg, fontSize: '20px' }}>
                {formatGBP(KIT_PRODUCT.price)}
              </p>
            </div>
            <Link
              href="/checkout"
              className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-opacity hover:opacity-90"
              style={{ background: C.primary, color: C.primaryFg }}
            >
              Get your kit <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ─── Add-ons ──────────────────────────────────────────────────────────
function AddonsSection() {
  return (
    <section className="py-24 px-6" style={{ background: 'rgba(20,55,48,0.95)' }}>
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <p
            className="text-xs font-semibold uppercase tracking-widest mb-3"
            style={{ color: C.pillFg }}
          >
            ADD ANYTHING YOU LIKE
          </p>
          <h2
            className="font-extrabold mb-3"
            style={{ color: C.fg, fontFamily: 'Georgia, serif', fontSize: '30px' }}
          >
            Optional add-ons
          </h2>
          <p className="text-base" style={{ color: C.muted }}>
            Customise your kit at checkout. Buy any quantity from 0 to 9.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {KIT_ADDONS.map((addon, i) => (
            <motion.div
              key={addon.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="rounded-2xl p-6 flex flex-col gap-3"
              style={{ background: C.bgCard, border: `1px solid ${C.border}` }}
            >
              <div className="flex items-start justify-between gap-2">
                <p className="font-semibold" style={{ color: C.fg }}>
                  {addon.name}
                </p>
                <p className="font-bold shrink-0" style={{ color: C.fg }}>
                  {formatGBP(addon.price)}
                </p>
              </div>
              {addon.recommended && (
                <span
                  className="self-start px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider"
                  style={{ background: C.pill, color: C.pillFg }}
                >
                  RECOMMENDED
                </span>
              )}
              <p className="text-sm" style={{ color: C.muted }}>
                {addon.description}
              </p>
              {addon.highlight && (
                <p className="text-sm font-medium" style={{ color: C.primary }}>
                  {addon.highlight}
                </p>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── FAQ ──────────────────────────────────────────────────────────────
function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-24 px-6" style={{ background: C.bg }}>
      <div className="max-w-3xl mx-auto">
        <h2
          className="font-extrabold text-center mb-14"
          style={{ color: C.fg, fontFamily: 'Georgia, serif', fontSize: '30px' }}
        >
          Common questions
        </h2>

        <div className="space-y-3">
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
                <span className="font-medium" style={{ color: C.fg }}>
                  {item.question}
                </span>
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
                    <p className="px-6 pb-5 text-sm" style={{ color: C.muted }}>
                      {item.answer}
                    </p>
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

// ─── Newsletter ──────────────────────────────────────────────────────
function NewsletterSection() {
  const [email, setEmail] = React.useState('');
  const [state, setState] = React.useState<'idle' | 'submitting' | 'done' | 'error'>('idle');

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
    <section className="py-20 px-6" style={{ background: 'rgba(14,44,38,1)' }}>
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
          Newsletter · MeO AI Waitlist
        </div>

        <h2
          className="font-extrabold mb-3"
          style={{ color: C.fg, fontFamily: 'Georgia, serif', fontSize: '30px' }}
        >
          Stay ahead of your health.
        </h2>
        <p className="text-base mb-8" style={{ color: C.muted }}>
          Get the free <strong style={{ color: C.fg }}>Metabolic Health Starter Guide</strong> and
          be first in line when MeO AI launches. No spam — ever.
        </p>

        {state === 'done' ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl font-semibold"
            style={{ background: C.pill, color: C.pillFg }}
          >
            <DropletIcon size={16} /> You&#39;re on the list — watch your inbox!
          </motion.div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-3 max-w-sm mx-auto"
          >
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

// ─── Footer ───────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer
      className="py-8 px-6 flex items-center justify-between"
      style={{
        background: C.bg,
        borderTop: `1px solid ${C.border}`,
      }}
    >
      <Link href="/" className="flex items-center gap-1.5">
        <span className="font-bold" style={{ color: C.fg }}>
          Me
        </span>
        <DropletIcon size={16} />
        <span className="text-sm ml-1" style={{ color: C.muted }}>
          by Meterbolic
        </span>
      </Link>
      <p className="text-sm" style={{ color: C.muted }}>
        © 2026 Meterbolic. All rights reserved.
      </p>
    </footer>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────
export default function MarketingLandingPage() {
  return (
    <div style={{ background: C.bg }}>
      <Navbar />
      <Hero />
      <BiomarkersSection />
      <KitContentsSection />
      <AddonsSection />
      <FAQSection />
      <NewsletterSection />
      <Footer />
    </div>
  );
}
