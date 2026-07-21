// ─── Coaching · How it works ──────────────────────────────────────────
//
// Section 2 of the /coaching page (Dr Arup Sen · Eos Longevity). A
// 3-step horizontal sequence — Test → Coach → Track — using the shared
// numbered-card treatment from the main /how-it-works page (numbered
// badge + serif title + accent icon + muted body), laid out 3-up on
// desktop so the steps read as a left-to-right sequence.
//
// Copy is fixed marketing/compliance-reviewed text — do not paraphrase.
// ──────────────────────────────────────────────────────────────────────
import { Droplet, UserRound, LineChart } from 'lucide-react';
import { C, FONT_SERIF } from '@/lib/design-tokens';

const STEPS = [
  {
    n: 1,
    icon: Droplet,
    title: 'Test',
    body:
      'A finger-prick at home reads your key lipid markers — total cholesterol, HDL, LDL and triglycerides — in about three minutes, including your triglyceride-to-HDL ratio, a well-studied surrogate marker for insulin resistance.',
  },
  {
    n: 2,
    icon: UserRound,
    title: 'Coach',
    body:
      'Dr Arup Sen — founder of Eos Longevity, with a background in longevity medicine — works with you 1:1 to translate your trends into practical changes in nutrition, movement, sleep and stress.',
  },
  {
    n: 3,
    icon: LineChart,
    title: 'Track',
    body:
      'Your metabolic trend score updates with every reading, drawn from your lipids and body measurements. It reflects part of your metabolic picture and is used to spot trends early.',
  },
] as const;

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="px-5 sm:px-6 py-16 sm:py-24"
      style={{ background: C.bgDeep }}
    >
      <div className="max-w-5xl mx-auto">
        <p
          className="text-xs font-semibold tracking-wide mb-3 text-center"
          style={{ color: C.pillFg }}
        >
          Three steps
        </p>
        <h2
          className="font-extrabold mb-12 text-center leading-tight"
          style={{
            color: C.fg,
            fontFamily: FONT_SERIF,
            fontSize: 'clamp(28px, 4vw, 38px)',
            textWrap: 'balance',
          }}
        >
          How it works
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {STEPS.map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.n}
                className="rounded-2xl p-7 flex flex-col"
                style={{ background: C.bgCard, border: `1px solid ${C.border}` }}
              >
                <div className="flex items-center gap-4 mb-4">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-xl shrink-0"
                    style={{ background: C.primary, color: C.primaryFg }}
                    aria-hidden
                  >
                    {s.n}
                  </div>
                  <h3
                    className="font-bold text-xl"
                    style={{ color: C.fg, fontFamily: FONT_SERIF }}
                  >
                    {s.title}
                  </h3>
                  <Icon
                    className="h-5 w-5 ml-auto shrink-0"
                    style={{ color: C.primary }}
                    aria-hidden
                  />
                </div>
                <p
                  className="text-sm sm:text-base leading-relaxed"
                  style={{ color: C.muted }}
                >
                  {s.body}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
