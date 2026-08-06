// ─── Coaching · What arrives with your programme ──────────────────────
//
// Borrows the /checkout product-card treatment: product photography in
// a left rail, and on the right an icon-per-line list of what's in the
// box, closed with a value line instead of a price.
//
// The items are the Meo Starter kit + Meo AI contents that BOTH
// programmes already include (see Pricing.tsx bullets) — this section
// unpacks them visually, it does not add anything to the offer. Two
// deliberate omissions vs /checkout: no Biological Age Score (this page
// speaks about your *metabolic trend score*) and no shipping/refund/
// Stripe promises (no checkout is wired for the programmes).
// ──────────────────────────────────────────────────────────────────────
import Image from 'next/image';
import {
  Activity,
  BarChart2,
  Brain,
  Droplets,
  FileText,
  RefreshCw,
  TrendingUp,
  UserRound,
} from 'lucide-react';
import { C, FONT_SERIF } from '@/lib/design-tokens';

const ITEMS = [
  { icon: Activity, text: 'Meo Starter: CE-marked digital lipid meter' },
  { icon: Droplets, text: '10 test strips, lancets and a carry case' },
  { icon: Brain, text: '6 months of Meo AI plain-English interpretation' },
  { icon: TrendingUp, text: 'Your metabolic trend score, updated with every reading' },
  { icon: BarChart2, text: 'Metabolic data visualisation dashboard' },
  { icon: FileText, text: 'Reports and guidance you can act on' },
  { icon: RefreshCw, text: 'Free retest at month six' },
  { icon: UserRound, text: '1:1 coaching sessions with Dr Arup Sen' },
] as const;

export default function WhatsIncluded() {
  return (
    <section className="px-5 sm:px-6 py-16 sm:py-24" style={{ background: C.bg }}>
      <div className="max-w-5xl mx-auto">
        <div
          className="rounded-2xl overflow-hidden grid grid-cols-1 md:grid-cols-[280px_1fr]"
          style={{ background: C.bgCard, border: `1px solid ${C.border}` }}
        >
          {/* Left rail — the device you'll be testing with. */}
          <div
            className="flex items-center justify-center p-6 sm:p-8"
            style={{ background: 'rgba(255,255,255,0.04)' }}
          >
            <Image
              src="/lipid-meter.png"
              alt="Meo CE-marked digital lipid meter"
              width={400}
              height={655}
              className="h-[230px] w-auto object-contain"
            />
          </div>

          <div className="p-6 sm:p-8 flex flex-col justify-between gap-6">
            <div>
              <span
                className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold tracking-wide"
                style={{ background: C.pill, color: C.pillFg }}
              >
                Included in both programmes
              </span>
              <h2
                className="mt-4 mb-2 font-extrabold leading-tight"
                style={{ color: C.fg, fontFamily: FONT_SERIF, fontSize: 'clamp(24px, 3vw, 32px)' }}
              >
                What arrives with your programme
              </h2>
              <p className="text-sm sm:text-base leading-relaxed" style={{ color: C.muted }}>
                Your coaching is built on your own numbers, not a questionnaire. The Meo
                monitoring system comes with the programme, so from week one every session
                works from a reading you took at home that morning.
              </p>
            </div>

            <ul className="space-y-3">
              {ITEMS.map((item) => {
                const Icon = item.icon;
                return (
                  <li
                    key={item.text}
                    className="flex items-center gap-3 text-sm sm:text-base leading-snug"
                    style={{ color: C.fg }}
                  >
                    <span
                      className="flex h-6 w-6 shrink-0 items-center justify-center"
                      style={{ color: C.primary }}
                      aria-hidden
                    >
                      <Icon className="h-4 w-4" />
                    </span>
                    <span className="flex-1">{item.text}</span>
                  </li>
                );
              })}
            </ul>

            <div
              className="flex flex-wrap items-baseline justify-between gap-2 pt-4"
              style={{ borderTop: `1px solid ${C.border}` }}
            >
              <span className="text-sm" style={{ color: C.muted }}>
                Device, AI monitoring and coaching sessions
              </span>
              <span className="text-sm font-semibold" style={{ color: C.primary }}>
                Included in the programme price
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
