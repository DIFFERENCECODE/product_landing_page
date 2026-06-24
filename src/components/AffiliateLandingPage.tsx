'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  Check,
  Shield,
  Activity,
  Brain,
  Users,
  Mail,
} from 'lucide-react';
import { C, FONT_SERIF } from '@/lib/design-tokens';
import type { AffiliateEntry } from '@/lib/affiliates';

interface Props {
  affiliate: AffiliateEntry;
  vertical: string;
  utmSource: string;
  utmIntent?: string;
}

const TIERS = [
  {
    id: 'basic',
    name: 'BASIC',
    badge: null as string | null,
    price: '£49',
    description: 'Essential metabolic health monitoring to get started.',
    features: [
      'Digital Lipid Meter + 10 strips',
      '1 month Meo AI access',
      'Biological Age Score',
      'PDF Report',
    ],
    cta: 'Get Started',
    highlight: false,
  },
  {
    id: 'popular',
    name: 'MOST POPULAR',
    badge: 'Most Popular',
    price: '£149',
    description: 'The complete metabolic intelligence system for 6 months.',
    features: [
      'Everything in Basic',
      '6 months Meo AI access',
      'The Thin Book of Fat (eBook)',
      'Free retest at 6 months',
      'Target Score + trend tracking',
      '30-day money-back guarantee',
    ],
    cta: 'Choose Plan',
    highlight: true,
  },
  {
    id: 'concierge',
    name: 'CONCIERGE',
    badge: null as string | null,
    price: '£299',
    description: 'AI intelligence paired with human coaching.',
    features: [
      'Everything in Most Popular',
      '3x practitioner consultations',
      'Personalised nutrition plan',
      'Priority AI support',
      'Quarterly progress review',
    ],
    cta: 'Choose Plan',
    highlight: false,
  },
  {
    id: 'corporate',
    name: 'CORPORATE',
    badge: null as string | null,
    price: 'Custom',
    description: 'Team metabolic health programmes for organisations.',
    features: [
      'Everything in Concierge',
      'Bulk device pricing',
      'Admin dashboard',
      'Anonymised team analytics',
      'Dedicated account manager',
      'Custom onboarding',
    ],
    cta: 'Contact Us',
    highlight: false,
  },
];

function InlineSignup({ source }: { source: string }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [hp, setHp] = useState('');
  const [state, setState] = useState<'idle' | 'submitting' | 'done' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setState('submitting');
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, first_name: firstName, last_name: lastName, _hp: hp }),
      });
      if (!res.ok) throw new Error('Failed');
      setState('done');
    } catch {
      setState('error');
    }
  };

  if (state === 'done') {
    return (
      <div
        className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl font-semibold"
        style={{ background: C.pill, color: C.pillFg }}
      >
        <Check className="h-4 w-4" /> Check your inbox — your free access is on its way.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 max-w-md mx-auto">
      <input type="text" name="_hp" value={hp} onChange={(e) => setHp(e.target.value)} style={{ display: 'none' }} tabIndex={-1} autoComplete="off" aria-hidden="true" />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <input type="text" placeholder="First name" value={firstName} onChange={(e) => setFirstName(e.target.value)} autoComplete="given-name" className="rounded-xl px-4 py-3 text-sm focus:outline-none" style={{ background: 'rgba(255,255,255,0.08)', border: `1px solid ${C.border}`, color: C.fg }} />
        <input type="text" placeholder="Last name" value={lastName} onChange={(e) => setLastName(e.target.value)} autoComplete="family-name" className="rounded-xl px-4 py-3 text-sm focus:outline-none" style={{ background: 'rgba(255,255,255,0.08)', border: `1px solid ${C.border}`, color: C.fg }} />
      </div>
      <input type="email" required placeholder="your@email.com" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" className="rounded-xl px-4 py-3 text-sm focus:outline-none" style={{ background: 'rgba(255,255,255,0.08)', border: `1px solid ${C.border}`, color: C.fg }} />
      <button type="submit" disabled={state === 'submitting'} className="flex items-center justify-center gap-2 w-full px-6 py-3 rounded-xl font-semibold text-sm transition-opacity hover:opacity-90 disabled:opacity-60" style={{ background: C.primary, color: C.primaryFg }}>
        {state === 'submitting' ? 'Sending...' : (<>Get free access <ArrowRight className="h-4 w-4" /></>)}
      </button>
      {state === 'error' && <p className="text-sm text-center" style={{ color: '#f87171' }}>Something went wrong — please try again.</p>}
    </form>
  );
}

export default function AffiliateLandingPage({ affiliate, vertical, utmSource, utmIntent }: Props) {
  const practitioner = affiliate.practitioner;

  return (
    <div style={{ background: C.bg, color: C.fg, minHeight: '100vh' }}>
      {/* Navbar */}
      <nav
        className="sticky top-0 z-50 flex items-center justify-between px-5 sm:px-8 py-4"
        style={{ background: 'rgba(28,74,64,0.95)', backdropFilter: 'blur(12px)', borderBottom: `1px solid ${C.border}` }}
      >
        <Link href="/" className="flex items-center gap-2">
          <span className="font-extrabold text-xl tracking-tight" style={{ color: C.fg, fontFamily: FONT_SERIF }}>
            Meterbolic
          </span>
          <span className="inline-block w-2 h-2 rounded-full" style={{ background: C.primary }} />
        </Link>
        <div className="flex items-center gap-3">
          <span className="text-xs font-medium px-3 py-1 rounded-full" style={{ background: C.pill, color: C.pillFg }}>
            {affiliate.name} Partner
          </span>
          <Link
            href="/checkout"
            className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-opacity hover:opacity-90"
            style={{ background: C.primary, color: C.primaryFg }}
          >
            Get Meo <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="px-5 sm:px-8 py-16 sm:py-24 text-center">
        <div className="max-w-3xl mx-auto">
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium mb-6"
            style={{ background: C.pill, color: C.pillFg }}
          >
            <Activity className="h-3.5 w-3.5" />
            Exclusive {affiliate.name} Partnership
          </div>
          <h1
            className="font-extrabold mb-5 leading-tight"
            style={{ fontFamily: FONT_SERIF, fontSize: 'clamp(32px, 5vw, 52px)', color: C.fg }}
          >
            Your metabolic health,{' '}
            <span style={{ color: C.primary }}>decoded.</span>
          </h1>
          <p className="text-lg mb-8 max-w-2xl mx-auto" style={{ color: C.muted }}>
            Meo turns a 3-minute finger-prick into a complete metabolic picture — interpreted by AI, framed
            for your {vertical === 'metabolic' ? 'health' : vertical}, actionable the same day.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/checkout"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-base font-bold transition-opacity hover:opacity-90"
              style={{ background: C.primary, color: C.primaryFg }}
            >
              Start your metabolic journey <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              href="#tiers"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-base font-semibold transition-opacity hover:opacity-80"
              style={{ border: `1.5px solid ${C.borderInteractive}`, color: C.fg }}
            >
              See all plans
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Practitioner */}
      {practitioner && (
        <section className="px-5 sm:px-8 py-16 sm:py-20" style={{ background: C.bgDeep }}>
          <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-10">
            <div className="relative w-48 h-48 md:w-56 md:h-56 rounded-2xl overflow-hidden flex-shrink-0" style={{ border: `2px solid ${C.primary}33` }}>
              <Image
                src={practitioner.photo}
                alt={practitioner.name}
                fill
                className="object-cover"
                sizes="224px"
                style={{ display: 'none' }}
              />
            </div>
            <div>
              <p className="text-xs font-semibold tracking-wide mb-2" style={{ color: C.pillFg }}>
                {affiliate.name} x Meterbolic
              </p>
              <h2
                className="font-extrabold mb-2"
                style={{ fontFamily: FONT_SERIF, fontSize: 'clamp(24px, 3.5vw, 34px)', color: C.fg }}
              >
                Meet {practitioner.name}
              </h2>
              <p className="text-xs font-semibold tracking-wide mb-4" style={{ color: C.primary }}>
                {practitioner.role}
              </p>
              <p className="text-base leading-relaxed" style={{ color: C.muted }}>
                {practitioner.bio}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Trust chips */}
      <section className="px-5 sm:px-8 py-12">
        <div className="max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { icon: <Shield className="h-5 w-5" />, label: 'CE-Marked Device' },
            { icon: <Activity className="h-5 w-5" />, label: '5 Biomarkers' },
            { icon: <Brain className="h-5 w-5" />, label: 'AI Interpretation' },
            { icon: <Users className="h-5 w-5" />, label: '30-Day Guarantee' },
          ].map((chip) => (
            <div
              key={chip.label}
              className="flex items-center gap-3 px-4 py-3 rounded-xl"
              style={{ background: C.bgCard, border: `1px solid ${C.border}` }}
            >
              <span style={{ color: C.primary }}>{chip.icon}</span>
              <span className="text-sm font-medium" style={{ color: C.fg }}>{chip.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing Tiers */}
      <section id="tiers" className="px-5 sm:px-8 py-16 sm:py-24" style={{ background: C.bgDeep }}>
        <div className="max-w-6xl mx-auto">
          <p className="text-xs font-semibold tracking-wide mb-3 text-center" style={{ color: C.pillFg }}>
            Choose your plan
          </p>
          <h2
            className="font-extrabold mb-4 text-center"
            style={{ fontFamily: FONT_SERIF, fontSize: 'clamp(28px, 4vw, 40px)', color: C.fg }}
          >
            Four tiers. <span style={{ color: C.primary }}>One goal.</span>
          </h2>
          <p className="text-center text-base mb-12 max-w-2xl mx-auto" style={{ color: C.muted }}>
            Every plan includes the core Meo metabolic intelligence system. Choose the level of support that fits your journey.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {TIERS.map((tier) => (
              <div
                key={tier.id}
                className="rounded-2xl p-6 flex flex-col relative"
                style={{
                  background: tier.highlight ? 'rgba(164,214,94,0.08)' : C.bgCard,
                  border: tier.highlight ? `2px solid ${C.primary}` : `1px solid ${C.border}`,
                }}
              >
                {tier.badge && (
                  <span
                    className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs font-bold px-4 py-1 rounded-full"
                    style={{ background: C.primary, color: C.primaryFg }}
                  >
                    {tier.badge}
                  </span>
                )}
                <h3 className="text-xs font-bold tracking-widest mb-3 mt-1" style={{ color: C.muted }}>
                  {tier.name}
                </h3>
                <p className="font-extrabold text-3xl mb-2" style={{ color: C.fg, fontFamily: FONT_SERIF }}>
                  {tier.price}
                </p>
                <p className="text-sm mb-6 leading-relaxed" style={{ color: C.muted }}>
                  {tier.description}
                </p>
                <ul className="flex-1 space-y-2.5 mb-6">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm" style={{ color: C.fg }}>
                      <Check className="h-4 w-4 mt-0.5 flex-shrink-0" style={{ color: C.primary }} />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href={tier.id === 'corporate' ? '/partners' : '/checkout'}
                  className="flex items-center justify-center gap-2 w-full px-5 py-3 rounded-xl text-sm font-semibold transition-opacity hover:opacity-90"
                  style={{
                    background: tier.highlight ? C.primary : 'transparent',
                    color: tier.highlight ? C.primaryFg : C.fg,
                    border: tier.highlight ? 'none' : `1.5px solid ${C.borderInteractive}`,
                  }}
                >
                  {tier.cta} <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter signup */}
      <section className="px-5 sm:px-8 py-16 sm:py-20" style={{ borderTop: `1px solid ${C.border}` }}>
        <div className="max-w-3xl mx-auto text-center">
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium mb-5"
            style={{ background: C.pill, color: C.pillFg }}
          >
            <Mail className="h-3.5 w-3.5" />
            Free for subscribers
          </div>
          <h2
            className="font-extrabold mb-3"
            style={{ color: C.fg, fontFamily: FONT_SERIF, fontSize: 'clamp(24px, 3.5vw, 34px)' }}
          >
            Not ready yet? Get a free book extract.
          </h2>
          <p className="text-base mb-8 max-w-xl mx-auto" style={{ color: C.muted }}>
            Join the Meo newsletter — instant access to a free extract of The Thin Book of Fat
            and the world&apos;s only Metabolic Conversational AI. No spam, ever.
          </p>
          <InlineSignup source={utmSource} />
        </div>
      </section>

      {/* Footer */}
      <footer
        className="px-5 sm:px-8 py-8 text-center"
        style={{ background: C.bgDeep, borderTop: `1px solid ${C.border}` }}
      >
        <p className="text-xs" style={{ color: C.muted }}>
          &copy; {new Date().getFullYear()} Meterbolic Ltd. Metabolic Intelligence System.
          Wellness monitoring, not a medical device for diagnosis.
          {' '}<Link href="/terms" className="underline hover:opacity-80" style={{ color: C.muted }}>Terms</Link>
          {' · '}<Link href="/privacy" className="underline hover:opacity-80" style={{ color: C.muted }}>Privacy</Link>
        </p>
      </footer>
    </div>
  );
}
