// ─── Coaching · Trust strip ───────────────────────────────────────────
//
// Four-up reassurance strip, same treatment as the /checkout trust
// strip (icon + one short label per cell, 2-up on mobile, 4-up on
// desktop, single card surface).
//
// Every claim here is already made further down this page — the strip
// only lifts them above the fold. Do NOT add a claim that isn't
// already stated in HowItWorks, Pricing, Compliance or Faq.
// ──────────────────────────────────────────────────────────────────────
import { Shield, Activity, Clock, UserRound } from 'lucide-react';
import { C } from '@/lib/design-tokens';

const ITEMS = [
  { icon: Shield, label: 'CE-marked wellness device' },
  { icon: Activity, label: 'Within ~±10% of a reference lab' },
  { icon: Clock, label: 'Lipid panel at home in ~3 minutes' },
  { icon: UserRound, label: 'Every session 1:1 with Dr Arup Sen' },
] as const;

export default function TrustStrip() {
  return (
    <section className="px-5 sm:px-6 pb-16 sm:pb-20" style={{ background: C.bg }}>
      <div
        className="max-w-4xl mx-auto rounded-2xl px-4 sm:px-6 py-4 grid grid-cols-2 md:grid-cols-4 gap-3 text-sm"
        style={{ background: C.bgCard, border: `1px solid ${C.border}` }}
      >
        {ITEMS.map((it) => {
          const Icon = it.icon;
          return (
            <div key={it.label} className="flex items-center gap-2.5" style={{ color: C.fg }}>
              <Icon className="h-4 w-4 shrink-0" style={{ color: C.primary }} aria-hidden />
              <span className="leading-snug">{it.label}</span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
