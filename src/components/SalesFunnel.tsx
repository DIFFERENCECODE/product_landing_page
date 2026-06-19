// ─────────────────────────────────────────────────────────────────────
// SalesFunnel — the canonical meterbolic.com sales page.
//
// This is the ONE funnel implementation. The homepage (/), every
// affiliate path (/a/<affiliate>[/<vertical>]) and any UTM-parameterised
// entry into / all render this same component, so an affiliate landing
// is a *native* part of the funnel, not a standalone destination
// (SCRUM-8 AC 4.3).
//
// Variation points, all server-side:
//   • affiliate  — when present, a partnership band (affiliate logo +
//     featured practitioner) is shown and the four-tier affiliate
//     pricing ladder is used.
//   • tiers      — overrides the default consumer tiers.
//   • utm        — utm_intent / utm_hint re-rank which tier is featured
//     and tune the hero sub-headline (SCRUM-8 AC 4.2). Fail-soft: an
//     unknown/absent value renders the default (docs/utm.md §6.4/§6.5).
// ─────────────────────────────────────────────────────────────────────
import { Fragment } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowRight,
  Activity,
  Brain,
  BarChart2,
  Shield,
  Clock,
  Lock,
  Check,
  Quote,
  RefreshCw,
  Stethoscope,
  Users,
  ClipboardList,
  Mail,
  Briefcase,
} from 'lucide-react';
import { C, FONT_SERIF } from '@/lib/design-tokens';
import { Navbar, Footer } from '@/components/MarketingLandingPage';
import { NewsletterSection } from '@/components/NewsletterForm';
import type { AffiliateEntry, Tier } from '@/lib/affiliates';

export interface FunnelUTM {
  source?: string;
  intent?: string;
  hint?: string;
}

interface SalesFunnelProps {
  affiliate?: AffiliateEntry;
  /** Vertical slug (affiliate pages only) — tunes one hero line. */
  vertical?: string;
  /** Pricing ladder. Defaults to the consumer three-tier set. */
  tiers?: readonly Tier[];
  utm?: FunnelUTM;
}

const TRUST_CHIPS = [
  { icon: Shield, label: 'UK & EU IVDR registered' },
  { icon: Activity, label: '±10% of reference-lab' },
  { icon: Check, label: '30-day money-back' },
  { icon: Clock, label: 'Ships in 72 hours' },
  { icon: Briefcase, label: 'Trusted by the underwriting industry' },
];

type Stat = { readonly value: string; readonly label: string; readonly sourceLabel?: string; readonly href?: string };
const STATS: readonly Stat[] = [
  {
    value: '1 in 3',
    label: 'UK adults with raised cholesterol',
    sourceLabel: 'BHF UK Factsheet, 2023',
    href: 'https://www.bhf.org.uk/what-we-do/our-research/heart-statistics',
  },
  {
    value: '88%',
    label: 'are metabolically unhealthy without knowing',
    sourceLabel: 'Araújo, Cai & Stevens, 2019',
    href: 'https://pubmed.ncbi.nlm.nih.gov/30484738/',
  },
  {
    value: '364',
    label: 'days of metabolic drift between annual blood draws',
  },
];

const LOOP = [
  {
    icon: Activity,
    title: 'Test',
    body:
      'A finger-prick at home reads six markers in three minutes — Total Cholesterol, HDL, LDL, Triglycerides, the TC/HDL ratio, and a Kraft-style insulin response.',
  },
  {
    icon: Brain,
    title: 'Interpret',
    body:
      'Meo AI translates each reading into plain English against your own baseline — no population averages, no clinical jargon.',
  },
  {
    icon: BarChart2,
    title: 'Track',
    body:
      'A Biological Age Score updates with every reading. The trend is visible early, not after a diagnosis.',
  },
];

const MARKERS = [
  { abbr: 'TC', label: 'Total Cholesterol — overall lipid load' },
  { abbr: 'HDL', label: 'Protective cholesterol' },
  { abbr: 'LDL', label: 'Atherogenic cholesterol' },
  { abbr: 'TG', label: 'Triglycerides — blood fat from diet & liver' },
  { abbr: 'TG:HDL', label: 'Insulin-resistance marker' },
  { abbr: 'BAS', label: 'Biological Age Score — composite metric' },
];

const IN_THE_BOX = [
  {
    src: '/lipid-meter.png',
    alt: 'Digital Lipid Meter (BF-102, CE-marked)',
    title: 'Digital Lipid Meter',
    sub: 'Lab-grade BF-102 · 20 strips · lancets · carry case',
  },
  {
    src: '/ebook-cover.jpg',
    alt: 'The Thin Book of Fat by Marina Young',
    title: 'The Thin Book of Fat',
    sub: 'Marina Young’s action manual — yours to keep',
  },
];

// Default consumer pricing ladder (homepage). Affiliate pages pass their
// own four-tier set (BASIC / MOST POPULAR / CONCIERGE / CORPORATE).
const DEFAULT_TIERS: readonly Tier[] = [
  {
    id: 'lite',
    name: 'Meo Lite',
    price: '£29',
    priceNote: 'one-time, inc. VAT',
    blurb: 'eBook + 7-day Meo AI trial. No device.',
    features: [
      'The Thin Book of Fat (digital)',
      '7-day Meo AI trial',
      'Manual entry of past blood results',
      'Credit £29 toward Starter within 30 days',
    ],
    cta: 'Start with the book',
    href: '/checkout?plan=lite',
  },
  {
    id: 'starter',
    name: 'Meo Starter',
    price: '£149',
    priceNote: 'one-time, inc. VAT',
    blurb: 'The full bundle — meter, AI, score, six months.',
    features: [
      'Lab-grade Digital Lipid Meter',
      '6 months of Meo AI included',
      '20 test strips + lancets + carry case',
      'Biological Age Score + Target Score',
      'Free retest at month six',
    ],
    cta: 'Get Meo Starter',
    href: '/checkout',
    popular: true,
  },
  {
    id: 'coached',
    name: 'Meo Coached',
    price: '£444',
    priceNote: 'one-time, inc. VAT',
    blurb: 'Everything in Starter, plus 1:1 coaching.',
    features: [
      'Everything in Meo Starter',
      '3 months of coaching with Spencer Martin',
      '40-min onboarding consultation',
      'Two 30-min follow-ups',
      'Direct messaging between sessions',
    ],
    cta: 'Get Meo + Coach',
    href: '/checkout?plan=coached',
  },
];

type CompareCell = string | true | false;
const TIER_COMPARE_ROWS: Array<{ label: string; retail: string; lite: CompareCell; starter: CompareCell; coached: CompareCell }> = [
  { label: 'The Thin Book of Fat (digital)',           retail: '£19',  lite: true,           starter: true, coached: true },
  { label: 'Meo AI access',                             retail: '£174', lite: '7-day trial', starter: '6 months', coached: '6 months' },
  { label: 'Manual entry of past blood results',        retail: 'included', lite: true,       starter: true, coached: true },
  { label: 'Lab-grade Digital Lipid Meter',             retail: '£119', lite: false,          starter: true, coached: true },
  { label: '20 test strips + lancets + carry case',     retail: '£49',  lite: false,          starter: true, coached: true },
  { label: 'Biological Age Score + Target Score',       retail: '£29',  lite: false,          starter: true, coached: true },
  { label: 'Free retest at month six',                  retail: '£25',  lite: false,          starter: true, coached: true },
  { label: '3 months 1:1 coaching (Spencer Martin)',    retail: '£297', lite: false,          starter: false, coached: true },
  { label: '40-min onboarding + two 30-min follow-ups', retail: 'included', lite: false,      starter: false, coached: true },
  { label: 'Direct messaging with coach',               retail: 'included', lite: false,      starter: false, coached: true },
];

const FAQ = [
  {
    q: 'How accurate is the meter?',
    a: 'CE-marked BF-102, registered for Home Use in the UK & EU. Reads within ±10% of reference-lab panels for TC, HDL, LDL and triglycerides. The real value compounds across readings — small per-reading variance washes out in the trend.',
  },
  {
    q: 'Is this a medical device?',
    a: 'The lipid meter is a CE-marked clinical-grade instrument. Meo as a whole is a wellness and monitoring system — it does not diagnose, treat, cure, or prevent any disease. Always consult a qualified healthcare professional for medical advice.',
  },
  {
    q: 'What if it doesn’t work for me?',
    a: '30-day money-back guarantee on the device — full refund, no questions asked. Your statutory right to a 14-day refund under UK Consumer Contracts Regulations 2013 is unaffected by this voluntary guarantee.',
  },
] as const;

// docs/utm.md §6.4/§6.5 — map an intent/hint onto the tier it should
// feature. Fail-soft: anything unrecognised returns undefined and the
// tier set's own `popular` flag stands.
function featuredTierId(utm: FunnelUTM | undefined, tiers: readonly Tier[]): string | undefined {
  if (!utm) return undefined;
  const has = (id: string) => tiers.some((t) => t.id === id);
  const hint = utm.hint ?? '';
  if (hint.startsWith('therapist') && has('concierge')) return 'concierge';
  if (hint.startsWith('ai-coach-plus') && has('concierge')) return 'concierge';
  if (hint.startsWith('ai-coach') && has('popular')) return 'popular';
  if (hint.startsWith('meter') && has('basic')) return 'basic';
  switch (utm.intent) {
    case 'therapist': return has('concierge') ? 'concierge' : undefined;
    case 'ai':        return has('popular') ? 'popular' : undefined;
    case 'meter':     return has('basic') ? 'basic' : undefined;
    default:          return undefined;
  }
}

function heroSubline(utm: FunnelUTM | undefined): string | undefined {
  switch (utm?.intent) {
    case 'meter':     return 'Start with the device — lab-grade readings at home in three minutes.';
    case 'ai':        return 'Meo AI reads every result in plain English, against your own baseline.';
    case 'therapist': return 'Pair your readings with human coaching for a guided metabolic plan.';
    default:          return undefined;
  }
}

// BAS gauge — visualises the actual product output.
function BasGauge({ value = 38 }: { value?: number }) {
  const radius = 90;
  const circumference = Math.PI * radius;
  const progress = Math.max(0, Math.min(60, value));
  const offset = circumference - (progress / 60) * circumference;
  return (
    <svg viewBox="0 0 220 130" className="w-full max-w-md" aria-label={`Biological Age Score: ${value}`}>
      <path d="M 20 110 A 90 90 0 0 1 200 110" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={14} strokeLinecap="round" />
      <path d="M 20 110 A 90 90 0 0 1 200 110" fill="none" stroke={C.primary} strokeWidth={14} strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={offset} />
      <text x="110" y="92" textAnchor="middle" fontSize="44" fontWeight={800} fill={C.fg} fontFamily={FONT_SERIF}>{value}</text>
      <text x="110" y="115" textAnchor="middle" fontSize="11" fill={C.muted} letterSpacing={1.5}>BIOLOGICAL AGE</text>
    </svg>
  );
}

function MeoAIConversation() {
  return (
    <div className="rounded-2xl p-6 sm:p-7 w-full max-w-lg mx-auto" style={{ background: 'rgba(30,70,60,0.85)', border: `1px solid ${C.border}` }}>
      <div className="flex items-center gap-2.5 mb-5">
        <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ background: C.primary }}>
          <Brain className="h-4 w-4" style={{ color: C.primaryFg }} />
        </div>
        <div>
          <p className="text-sm font-semibold leading-none" style={{ color: C.fg }}>Meo AI</p>
          <p className="text-[11px] mt-0.5" style={{ color: C.muted }}>plain-English interpretation</p>
        </div>
      </div>
      <div className="rounded-xl p-4 mb-3" style={{ background: 'rgba(255,255,255,0.04)' }}>
        <p className="text-[10px] uppercase tracking-wide mb-2 font-semibold" style={{ color: C.muted }}>Your reading · Tue 09:14</p>
        <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 text-sm tabular-nums">
          {[['TC', '5.2'], ['HDL', '1.8'], ['LDL', '2.9'], ['TG', '1.1']].map(([k, v]) => (
            <div key={k} className="flex items-center justify-between">
              <span style={{ color: C.muted }}>{k}</span>
              <span style={{ color: C.fg }}>{v} mmol/L</span>
            </div>
          ))}
        </div>
      </div>
      <div className="rounded-xl p-4 text-sm leading-relaxed space-y-2.5" style={{ background: 'rgba(164,214,94,0.10)', border: `1px solid rgba(164,214,94,0.30)`, color: C.fg }}>
        <p>Your <strong>TC/HDL ratio is 2.9</strong> — comfortably in the cardio-protective range. LDL sits inside optimal.</p>
        <p><strong>TG dropped from 1.4 to 1.1</strong> since your last reading two weeks ago. The lower-carb week you logged is the most likely driver.</p>
      </div>
    </div>
  );
}

function StickyMobileCTA({ tiers }: { tiers: readonly Tier[] }) {
  const from = tiers[0]?.price ?? '£29';
  const href = (tiers.find((t) => t.popular) ?? tiers[0])?.href ?? '/checkout';
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 px-4 py-3 flex items-center gap-3" style={{ background: 'rgba(20,55,48,0.96)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', borderTop: `1px solid ${C.border}` }}>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] uppercase tracking-wide leading-none mb-0.5" style={{ color: C.muted }}>From · inc. VAT</p>
        <p className="text-base font-bold leading-none tabular-nums" style={{ color: C.fg }}>{from}</p>
      </div>
      <Link href={href} className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl font-semibold py-3 text-sm" style={{ background: C.primary, color: C.primaryFg }}>
        See plans <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}

// Affiliate partnership band — surfaces the affiliate logo and featured
// practitioner (SCRUM-8 AC 3: Arup Sen image + EoS logo). Only rendered
// for affiliate entries.
function AffiliateBand({ affiliate }: { affiliate: AffiliateEntry }) {
  const pr = affiliate.practitioner;
  return (
    <section className="px-5 sm:px-6 py-12 sm:py-16" style={{ background: C.bgDeep, borderBottom: `1px solid ${C.border}` }}>
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col items-center text-center mb-8">
          <p className="text-xs font-semibold tracking-wide mb-4" style={{ color: C.pillFg }}>
            IN PARTNERSHIP WITH
          </p>
          {affiliate.logo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={affiliate.logo} alt={affiliate.name} className="h-12 w-auto" style={{ display: 'block' }} />
          ) : (
            <span className="font-extrabold text-2xl" style={{ color: C.fg, fontFamily: FONT_SERIF }}>{affiliate.name}</span>
          )}
        </div>

        {pr && (
          <div className="rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center gap-8" style={{ background: 'rgba(30,70,60,0.85)', border: `1px solid ${C.primary}` }}>
            <div className="relative w-40 h-40 md:w-48 md:h-48 rounded-2xl overflow-hidden shrink-0" style={{ border: `2px solid rgba(164,214,94,0.4)` }}>
              <Image src={pr.photo} alt={pr.name} fill sizes="192px" className="object-cover" />
            </div>
            <div className="min-w-0 text-center md:text-left">
              <p className="text-xs font-semibold tracking-wide mb-2" style={{ color: C.pillFg }}>
                {affiliate.name} × Meo · Featured practitioner
              </p>
              <h2 className="font-extrabold mb-1" style={{ fontFamily: FONT_SERIF, fontSize: 'clamp(22px, 3vw, 30px)', color: C.fg }}>
                {pr.name}
              </h2>
              <p className="text-xs font-semibold mb-3" style={{ color: C.primary }}>{pr.role}</p>
              {pr.quote && (
                <p className="text-base sm:text-lg italic leading-snug mb-3" style={{ color: C.fg, fontFamily: FONT_SERIF }}>
                  <Quote className="h-4 w-4 inline-block mr-1 -mt-1" style={{ color: C.primary }} aria-hidden />
                  {pr.quote}
                </p>
              )}
              <p className="text-sm leading-relaxed" style={{ color: C.muted }}>{pr.bio}</p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default function SalesFunnel({ affiliate, vertical, tiers, utm }: SalesFunnelProps) {
  const tierSet = tiers ?? DEFAULT_TIERS;
  const isAffiliate = Boolean(affiliate);
  const gridCols = tierSet.length >= 4 ? 'sm:grid-cols-2 lg:grid-cols-4' : 'md:grid-cols-3';

  // Server-side UTM variation (AC 4.2): which tier is featured, and an
  // optional intent-tuned hero sub-headline. Fail-soft throughout.
  const featuredId = featuredTierId(utm, tierSet);
  const renderedTiers = featuredId
    ? tierSet.map((t) => ({ ...t, popular: t.id === featuredId }))
    : tierSet;
  const utmSubline = heroSubline(utm);

  const heroName = affiliate ? affiliate.name : 'Meo';
  const verticalLabel = vertical && vertical !== 'metabolic' ? vertical : 'health';

  return (
    <main className="min-h-screen flex flex-col" style={{ background: C.bg, color: C.fg }}>
      <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:px-4 focus:py-2 focus:rounded-lg focus:font-semibold focus:text-sm focus:outline-none focus:ring-2 focus:ring-offset-2" style={{ background: C.primary, color: C.primaryFg }}>
        Skip to main content
      </a>

      <Navbar />

      <div id="main-content" tabIndex={-1} className="outline-none">
        {/* HERO */}
        <section className="relative min-h-screen flex flex-col justify-center px-5 sm:px-6 py-24 overflow-hidden">
          <video aria-hidden autoPlay loop muted playsInline className="pointer-events-none absolute inset-0 w-full h-full object-cover" src="/liquid-metal.mp4" />
          <div aria-hidden className="pointer-events-none absolute inset-0" style={{ background: 'rgba(0,0,0,0.55)' }} />

          <div className="relative max-w-4xl mx-auto w-full text-center">
            {isAffiliate && (
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium mb-6" style={{ background: C.pill, color: C.pillFg }}>
                <Activity className="h-3.5 w-3.5" />
                Exclusive {heroName} partnership
              </div>
            )}
            <h1 className="font-bold leading-[1.05] mb-6 sm:mb-8" style={{ color: C.fg, fontSize: 'clamp(36px, 6.5vw, 76px)', letterSpacing: '-0.02em' }}>
              Metabolic intelligence,{' '}<span style={{ color: C.primary }}>at home</span>
            </h1>
            <p className="text-base sm:text-lg mx-auto mb-8 sm:mb-10 max-w-2xl" style={{ color: C.muted }}>
              {utmSubline ?? (isAffiliate
                ? `A finger-prick lipid panel, AI that reads each result in plain English, and a Biological Age Score — framed for your ${verticalLabel}.`
                : 'A finger-prick lipid panel. AI that reads each result in plain English. A score that updates with every reading.')}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-7">
              <Link href="#tiers" className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl font-semibold transition-opacity hover:opacity-90 px-10 py-4 text-base" style={{ background: C.primary, color: C.primaryFg }}>
                See the plans <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/how-it-works" className="hover:underline" style={{ color: C.muted, fontSize: 13 }}>
                or see how it works →
              </Link>
            </div>

            <div className="flex flex-wrap justify-center gap-x-5 gap-y-2 text-lg mb-3" style={{ color: C.muted }}>
              {TRUST_CHIPS.map((chip) => {
                const Icon = chip.icon;
                return (
                  <div key={chip.label} className="flex items-center gap-1.5">
                    <Icon className="h-3.5 w-3.5" style={{ color: C.primary }} aria-hidden />
                    <span>{chip.label}</span>
                  </div>
                );
              })}
            </div>

            <p className="text-lg" style={{ color: C.muted }}>
              In clinical alignment with{' '}
              <Link href="/partners" className="underline" style={{ color: C.pillFg }}>world leading scientists and physicians</Link>
            </p>
          </div>
        </section>

        {/* AFFILIATE BAND (affiliate pages only) */}
        {affiliate && <AffiliateBand affiliate={affiliate} />}

        {/* WHY — sourced stats */}
        <section className="py-16 sm:py-24 px-5 sm:px-6">
          <div className="max-w-5xl mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h2 className="font-bold mb-5 leading-tight" style={{ color: C.fg, fontFamily: FONT_SERIF, fontSize: 'clamp(28px, 4vw, 40px)', textWrap: 'balance' }}>
                Metabolic dysfunction is common — and quietly progressive.
              </h2>
              <p className="text-base sm:text-lg" style={{ color: C.muted }}>
                By the time most metabolic problems show up on a standard panel, they’ve been quietly drifting for years. We want to shorten that gap.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {STATS.map((s, i) => (
                <div key={i} className="rounded-2xl p-7 text-center" style={{ background: 'rgba(30,70,60,0.85)', border: `1px solid ${C.border}` }}>
                  <div className="font-extrabold mb-2 tabular-nums leading-none" style={{ color: C.primary, fontFamily: FONT_SERIF, fontSize: 'clamp(36px, 5vw, 56px)' }}>{s.value}</div>
                  <p className="text-sm leading-relaxed mb-2" style={{ color: C.fg }}>{s.label}</p>
                  {s.sourceLabel && (
                    <p className="text-xs" style={{ color: C.muted }}>
                      {s.href ? (
                        <a href={s.href} target="_blank" rel="noopener noreferrer" className="hover:underline" style={{ color: C.muted }}>{s.sourceLabel}</a>
                      ) : (s.sourceLabel)}{' '}
                      <Link href="#sources" className="underline" style={{ color: C.muted }}>[{i + 1}]</Link>
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* THE LOOP */}
        <section className="py-16 sm:py-24 px-5 sm:px-6" style={{ background: C.bgDeep }}>
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="font-bold leading-tight" style={{ color: C.fg, fontFamily: FONT_SERIF, fontSize: 'clamp(28px, 4vw, 38px)', textWrap: 'balance' }}>
                Test. Interpret. Track.
              </h2>
              <p className="mt-3 text-base sm:text-lg max-w-2xl mx-auto" style={{ color: C.muted }}>
                Three steps, run as often as you want. The picture of your metabolism is current, not annual.
              </p>
            </div>
            <div className="space-y-5">
              {LOOP.map((step, i) => {
                const Icon = step.icon;
                return (
                  <div key={step.title} className="rounded-2xl p-7" style={{ background: 'rgba(30,70,60,0.85)', border: `1px solid ${C.border}` }}>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-xl shrink-0" style={{ background: C.primary, color: C.primaryFg }}>{i + 1}</div>
                      <h3 className="font-bold text-xl" style={{ color: C.fg, fontFamily: FONT_SERIF }}>{step.title}</h3>
                      <Icon className="h-5 w-5 ml-auto shrink-0" style={{ color: C.primary }} aria-hidden />
                    </div>
                    <p className="text-sm sm:text-base leading-relaxed" style={{ color: C.muted }}>{step.body}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* BAS + SIX MARKERS */}
        <section className="py-16 sm:py-24 px-5 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-10 lg:gap-16 items-center mb-12">
              <div>
                <h2 className="font-bold mb-5 leading-tight" style={{ color: C.fg, fontFamily: FONT_SERIF, fontSize: 'clamp(28px, 4vw, 40px)', textWrap: 'balance' }}>
                  Six markers. One score. Updated with every reading.
                </h2>
                <p className="text-base sm:text-lg mb-4" style={{ color: C.muted }}>
                  Lab-grade accuracy from one finger-prick. The Biological Age Score is calculated from your fasting lipid panel plus five body measurements — tested to match the amount of fat around your internal organs.
                </p>
                <p className="text-sm" style={{ color: C.muted }}>A Target Score is set alongside, so the direction of travel is always visible.</p>
              </div>
              <div className="rounded-2xl p-7 sm:p-9 flex flex-col items-center justify-center" style={{ background: 'rgba(30,70,60,0.85)', border: `1px solid ${C.border}` }}>
                <BasGauge value={38} />
                <p className="text-xs mt-4" style={{ color: C.muted }}>Sample BAS · updates with every reading</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {MARKERS.map((m) => (
                <div key={m.abbr} className="rounded-xl p-4 flex items-start gap-3" style={{ background: 'rgba(30,70,60,0.85)', border: `1px solid ${C.border}` }}>
                  <div className="px-2.5 py-1 rounded-md text-xs font-bold tracking-wide shrink-0" style={{ background: 'rgba(164,214,94,0.18)', color: C.pillFg }}>{m.abbr}</div>
                  <p className="text-sm leading-relaxed" style={{ color: C.muted }}>{m.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* MEO AI CONVERSATION */}
        <section className="py-16 sm:py-24 px-5 sm:px-6" style={{ background: C.bgDeep }}>
          <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-10 lg:gap-14 items-center">
            <div>
              <h2 className="font-bold mb-5 leading-tight" style={{ color: C.fg, fontFamily: FONT_SERIF, fontSize: 'clamp(28px, 4vw, 40px)', textWrap: 'balance' }}>
                Plain English, not a printout.
              </h2>
              <p className="text-base sm:text-lg mb-4" style={{ color: C.muted }}>
                Meo AI doesn’t hand you a row of numbers. It tells you what changed since your last reading, what your own baseline looks like, and what in your logged context most likely drove the move.
              </p>
              <p className="text-sm" style={{ color: C.muted }}>It does not diagnose, prescribe, or replace your doctor. When something is unusual, it tells you to see one.</p>
            </div>
            <div><MeoAIConversation /></div>
          </div>
        </section>

        {/* WHAT'S IN THE BOX */}
        <section className="py-16 sm:py-24 px-5 sm:px-6">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="font-bold mb-3 leading-tight" style={{ color: C.fg, fontFamily: FONT_SERIF, fontSize: 'clamp(28px, 4vw, 38px)', textWrap: 'balance' }}>
                What ships in the box.
              </h2>
              <p className="text-base sm:text-lg max-w-2xl mx-auto" style={{ color: C.muted }}>The hardware and the action manual — yours from day one.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {IN_THE_BOX.map((item) => (
                <div key={item.title} className="rounded-2xl p-6 sm:p-8 flex flex-col items-center text-center" style={{ background: 'rgba(30,70,60,0.85)', border: `1px solid ${C.border}` }}>
                  <div className="relative w-full h-56 mb-5 flex items-center justify-center">
                    <Image src={item.src} alt={item.alt} width={400} height={400} className="max-h-56 w-auto object-contain" />
                  </div>
                  <h3 className="font-bold text-lg mb-1.5" style={{ color: C.fg, fontFamily: FONT_SERIF }}>{item.title}</h3>
                  <p className="text-sm" style={{ color: C.muted }}>{item.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* TIERS */}
        <section id="tiers" className="py-16 sm:py-24 px-5 sm:px-6" style={{ background: C.bgDeep }}>
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="font-bold mb-3 leading-tight" style={{ color: C.fg, fontFamily: FONT_SERIF, fontSize: 'clamp(28px, 4vw, 40px)', textWrap: 'balance' }}>
                {tierSet.length >= 4 ? <>Four tiers. <span style={{ color: C.primary }}>One goal.</span></> : 'Three ways in. Same destination.'}
              </h2>
              <p className="text-base sm:text-lg max-w-xl mx-auto" style={{ color: C.muted }}>
                {isAffiliate
                  ? 'Every plan includes the core Meo metabolic intelligence system. Choose the level of support that fits your journey.'
                  : 'Pick the version that fits how you want to start. Prices include VAT.'}
              </p>
              {isAffiliate && (
                <p className="text-xs mt-3 max-w-xl mx-auto" style={{ color: C.muted }}>
                  Indicative pricing — final tiers and prices to be confirmed by MB Commercial.
                </p>
              )}
            </div>
            <div className={`grid grid-cols-1 ${gridCols} gap-5`}>
              {renderedTiers.map((tier) => (
                <div key={tier.id} className="relative rounded-2xl p-7 flex flex-col" style={{ background: 'rgba(30,70,60,0.85)', border: `${tier.popular ? 2 : 1}px solid ${tier.popular ? C.primary : C.border}` }}>
                  {tier.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-semibold" style={{ background: C.primary, color: C.primaryFg }}>
                      {tier.badge ?? 'Recommended'}
                    </div>
                  )}
                  <h3 className="font-bold text-xl mb-1" style={{ color: C.fg, fontFamily: FONT_SERIF }}>{tier.name}</h3>
                  <p className="text-sm mb-5" style={{ color: C.muted }}>{tier.blurb}</p>
                  <div className="mb-6">
                    <span className="text-4xl font-extrabold tabular-nums" style={{ color: C.fg }}>{tier.price}</span>
                    {tier.priceNote && <span className="text-sm ml-2" style={{ color: C.muted }}>{tier.priceNote}</span>}
                  </div>
                  <ul className="space-y-2.5 mb-8 flex-1">
                    {tier.features.map((f) => (
                      <li key={f} className="flex items-start gap-2.5">
                        <Check className="h-4 w-4 mt-0.5 shrink-0" style={{ color: C.primary }} />
                        <span className="text-sm leading-snug" style={{ color: C.fg }}>{f}</span>
                      </li>
                    ))}
                  </ul>
                  <Link href={tier.href} className="w-full inline-flex items-center justify-center rounded-xl py-3 text-sm font-semibold transition-opacity hover:opacity-90" style={{ background: tier.popular ? C.primary : 'transparent', color: tier.popular ? C.primaryFg : C.primary, border: tier.popular ? 'none' : `1px solid ${C.primary}` }}>
                    {tier.cta}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* TIER COMPARISON — default consumer ladder only */}
        {!isAffiliate && (
          <section className="py-16 sm:py-24 px-5 sm:px-6" aria-label="Tier comparison">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-10">
                <h2 className="font-bold mb-3 leading-tight" style={{ color: C.fg, fontFamily: FONT_SERIF, fontSize: 'clamp(28px, 4vw, 40px)', textWrap: 'balance' }}>
                  What&apos;s included, at a glance.
                </h2>
                <p className="text-base sm:text-lg max-w-2xl mx-auto" style={{ color: C.muted }}>Every component of the delivered package, across the three tiers.</p>
              </div>
              <div className="rounded-2xl overflow-hidden" style={{ background: 'rgba(30,70,60,0.85)', border: `1px solid ${C.border}` }}>
                <div className="grid grid-cols-[1.6fr_auto_repeat(3,1fr)] sm:grid-cols-[2fr_auto_repeat(3,1fr)] text-sm" style={{ color: C.fg }}>
                  <div className="p-4 sm:p-5 text-xs uppercase tracking-wide font-semibold" style={{ color: C.muted, borderBottom: `1px solid ${C.border}` }}>Component</div>
                  <div className="p-4 sm:p-5 text-xs uppercase tracking-wide font-semibold text-right" style={{ color: C.muted, borderBottom: `1px solid ${C.border}`, borderLeft: `1px solid ${C.border}` }}>Typical retail</div>
                  {DEFAULT_TIERS.map((t) => (
                    <div key={t.id} className="p-4 sm:p-5 text-center" style={{ borderBottom: `1px solid ${C.border}`, borderLeft: `1px solid ${C.border}`, background: t.popular ? 'rgba(164,214,94,0.10)' : 'transparent' }}>
                      <div className="font-bold text-base" style={{ color: C.fg, fontFamily: FONT_SERIF }}>{t.name}</div>
                      <div className="text-xs mt-0.5 tabular-nums" style={{ color: C.primary }}>{t.price}</div>
                    </div>
                  ))}
                  {TIER_COMPARE_ROWS.map((row) => (
                    <Fragment key={row.label}>
                      <div className="p-4 sm:p-5 leading-snug" style={{ borderBottom: `1px solid ${C.border}`, color: C.fg }}>{row.label}</div>
                      <div className="p-4 sm:p-5 text-right tabular-nums" style={{ borderBottom: `1px solid ${C.border}`, borderLeft: `1px solid ${C.border}`, color: C.muted }}>{row.retail}</div>
                      {([row.lite, row.starter, row.coached] as CompareCell[]).map((v, ci) => (
                        <div key={ci} className="p-4 sm:p-5 text-center" style={{ borderBottom: `1px solid ${C.border}`, borderLeft: `1px solid ${C.border}`, background: ci === 1 ? 'rgba(164,214,94,0.06)' : 'transparent', color: v === true ? C.primary : C.muted }}>
                          {v === true ? <Check className="h-4 w-4 inline-block" /> : v === false ? <span className="text-sm">—</span> : <span className="text-sm tabular-nums">{v}</span>}
                        </div>
                      ))}
                    </Fragment>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* MEO CARE — B2B */}
        <section className="py-16 sm:py-24 px-5 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-10">
              <p className="text-xs font-semibold tracking-wide mb-3" style={{ color: C.pillFg }}>FOR CLINICS &amp; PRACTITIONERS</p>
              <h2 className="font-bold mb-3 leading-tight" style={{ color: C.fg, fontFamily: FONT_SERIF, fontSize: 'clamp(28px, 4vw, 40px)', textWrap: 'balance' }}>MeO Care.</h2>
              <p className="text-base sm:text-lg max-w-2xl mx-auto" style={{ color: C.muted }}>
                Run Meo inside your practice. Same lab-grade meter, same AI interpretation, same Biological Age Score — delivered to your patients with your branding, your clinical context, and your follow-up.
              </p>
            </div>
            <div className="rounded-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-[1.1fr_1fr]" style={{ background: 'rgba(30,70,60,0.85)', border: `1px solid ${C.primary}` }}>
              <div className="p-7 sm:p-9">
                <p className="text-xs font-semibold tracking-wide mb-3" style={{ color: C.pillFg }}>WHAT YOU GET</p>
                <ul className="space-y-3.5">
                  {[
                    { icon: Stethoscope, title: 'Clinic-grade procurement', body: 'Bulk Digital Lipid Meters, strips and consumables at clinic pricing. Full IVDR / CE-mark documentation pack on request.' },
                    { icon: Users, title: 'Patient onboarding flows', body: 'Branded sign-up and consent flows so your patients enter the Meo system from your practice, not ours.' },
                    { icon: BarChart2, title: 'Practitioner dashboard', body: 'See every patient’s readings, trend lines, BAS scores, and Meo AI interpretations in one cohort view.' },
                    { icon: ClipboardList, title: 'Branded reports', body: 'Six-month progress reports issued to patients under your clinic name, with your logo and clinical sign-off.' },
                  ].map((it) => {
                    const Icon = it.icon;
                    return (
                      <li key={it.title} className="flex items-start gap-3">
                        <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ background: 'rgba(164,214,94,0.12)', color: C.primary }} aria-hidden><Icon className="h-4 w-4" /></div>
                        <div className="min-w-0">
                          <p className="font-semibold text-sm sm:text-base mb-0.5" style={{ color: C.fg }}>{it.title}</p>
                          <p className="text-xs sm:text-sm leading-relaxed" style={{ color: C.muted }}>{it.body}</p>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
              <div className="p-7 sm:p-9 flex flex-col justify-between gap-6" style={{ background: `linear-gradient(140deg, rgba(20,55,48,0.6), rgba(164,214,94,0.10))` }}>
                <div>
                  <Quote className="h-5 w-5 mb-3" style={{ color: C.primary }} aria-hidden />
                  <p className="text-base sm:text-lg italic leading-snug mb-4" style={{ color: C.fg, fontFamily: FONT_SERIF }}>
                    &ldquo;Longevity is not simply about living longer — it is about preserving vitality, independence, and quality of life for as long as possible.&rdquo;
                  </p>
                  <p className="text-xs font-semibold" style={{ color: C.fg }}>Dr Arup Sen</p>
                  <p className="text-xs mt-0.5" style={{ color: C.muted }}>Founder, Eos Longevity · MRCP · Consultant Physician</p>
                </div>
                <div>
                  <p className="text-sm font-semibold mb-3" style={{ color: C.fg }}>Talk to partnerships.</p>
                  <a href="mailto:partner@meterbolic.com?subject=MeO%20Care%20enquiry" className="inline-flex items-center gap-2 rounded-xl font-semibold px-5 py-3 text-sm transition-opacity hover:opacity-90" style={{ background: C.primary, color: C.primaryFg }}>
                    <Mail className="h-4 w-4" />partner@meterbolic.com<ArrowRight className="h-4 w-4" />
                  </a>
                  <p className="text-xs mt-3" style={{ color: C.muted }}>
                    Or read the{' '}<Link href="/partners" className="underline" style={{ color: C.muted }}>partners page</Link>{' '}for the full offering.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* DATA CALLOUT */}
        <section className="py-16 sm:py-24 px-5 sm:px-6">
          <div className="max-w-3xl mx-auto text-center">
            <Quote className="h-6 w-6 mx-auto mb-5" style={{ color: C.primary }} aria-hidden />
            <p className="text-lg sm:text-2xl italic mb-4 leading-relaxed" style={{ color: C.fg, fontFamily: FONT_SERIF }}>
              &ldquo;TC/HDL ratio dropped from <span style={{ color: C.primary, fontStyle: 'normal' }}>4.8 to 3.2</span> across 14 fortnightly readings.&rdquo;
            </p>
            <p className="text-sm font-semibold mb-1" style={{ color: C.pillFg }}>From the beta — anonymised participant data</p>
            <p className="text-xs max-w-xl mx-auto" style={{ color: C.muted }}>One participant, 11 weeks of fasting tests with Meo. Individual results vary; this is not a clinical claim.</p>
          </div>
        </section>

        <NewsletterSection />

        {/* FAQ */}
        <section className="py-16 sm:py-24 px-5 sm:px-6" style={{ background: C.bgDeep }}>
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="font-bold leading-tight" style={{ color: C.fg, fontFamily: FONT_SERIF, fontSize: 'clamp(28px, 4vw, 38px)' }}>Three things people ask first.</h2>
            </div>
            <div className="space-y-3">
              {FAQ.map((item) => (
                <details key={item.q} className="group rounded-2xl px-5 py-4 transition-colors" style={{ background: 'rgba(30,70,60,0.85)', border: `1px solid ${C.border}` }}>
                  <summary className="cursor-pointer list-none flex items-center justify-between gap-4">
                    <span className="font-semibold text-base" style={{ color: C.fg }}>{item.q}</span>
                    <span className="shrink-0 transition-transform group-open:rotate-45 text-xl leading-none" style={{ color: C.primary }} aria-hidden>+</span>
                  </summary>
                  <p className="mt-3 text-sm leading-relaxed" style={{ color: C.muted }}>{item.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* CLOSING CTA */}
        <section className="py-20 px-5 sm:px-6 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="font-bold mb-4 leading-tight" style={{ color: C.fg, fontFamily: FONT_SERIF, fontSize: 'clamp(28px, 4vw, 44px)', textWrap: 'balance' }}>
              See the trend, <span style={{ color: C.primary }}>not just the number</span>.
            </h2>
            <p className="text-base mb-8" style={{ color: C.muted }}>Six months of metabolic visibility. One bundle.</p>
            <Link href="#tiers" className="inline-flex items-center justify-center gap-2 rounded-xl font-semibold px-10 py-4 text-base transition-opacity hover:opacity-90" style={{ background: C.primary, color: C.primaryFg }}>
              See the plans <ArrowRight className="h-4 w-4" />
            </Link>
            <div className="mt-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs" style={{ color: C.muted }}>
              <span className="flex items-center gap-1.5"><Lock className="h-3 w-3" /> Stripe checkout</span>
              <span className="flex items-center gap-1.5"><Shield className="h-3 w-3" /> 30-day money-back</span>
              <span className="flex items-center gap-1.5"><Clock className="h-3 w-3" /> Ships in 72h</span>
              <span className="flex items-center gap-1.5"><RefreshCw className="h-3 w-3" /> Free retest at 6 months</span>
            </div>
          </div>
        </section>

        {/* SOURCES */}
        <section id="sources" className="py-12 px-5 sm:px-6" style={{ background: C.bgDeep, borderTop: `1px solid ${C.border}` }}>
          <div className="max-w-3xl mx-auto text-xs" style={{ color: C.muted }}>
            <p className="font-semibold mb-3" style={{ color: C.fg }}>Sources</p>
            <ol className="space-y-2 list-decimal list-inside">
              <li>
                <a href="https://www.bhf.org.uk/what-we-do/our-research/heart-statistics" target="_blank" rel="noopener noreferrer" className="underline hover:text-white" style={{ color: C.muted }}>British Heart Foundation, UK Heart Statistics</a>{' '}— raised cholesterol prevalence in UK adults.
              </li>
              <li>
                <a href="https://pubmed.ncbi.nlm.nih.gov/30484738/" target="_blank" rel="noopener noreferrer" className="underline hover:text-white" style={{ color: C.muted }}>Araújo, Cai &amp; Stevens (2019), <em>Metabolic Syndrome and Related Disorders</em></a>{' '}— prevalence of optimal metabolic health in US adults (NHANES 2009-2016).
              </li>
              <li>BF-102 device specification — CE-marked clinical-grade lipid meter, accuracy within ±10% vs reference-lab panels for TC, HDL, LDL, triglycerides.</li>
            </ol>
          </div>
        </section>
      </div>

      <Footer />

      <StickyMobileCTA tiers={renderedTiers} />
    </main>
  );
}
