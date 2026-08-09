// ─── Coaching · Your coach ────────────────────────────────────────────
//
// Photo + credential panel introducing the coach, placed just below the
// Hero. Uses the /checkout coach-card idiom — portrait, name, a
// credential pill and a short bullet list of what the sessions are —
// rather than a bare portrait, so the reader meets the person who
// delivers the programme before they reach the prices.
//
// Portrait is a head-and-shoulders crop of the supplied full-length
// photo (/coach-arup-sen.jpg, 400x400), shown as a circle. Plain <img>
// to match the site's photo treatment. Every line here restates a fact
// already on this page (Hero, HowItWorks, Pricing, Faq).
// ──────────────────────────────────────────────────────────────────────
import type { ReactNode } from 'react';
import { Check } from 'lucide-react';
import { C, FONT_SERIF } from '@/lib/design-tokens';

// ReactNode rather than string: the clinical-affiliation line carries an
// outbound link, and the list renderer below is shared by every point.
const POINTS: readonly { key: string; body: ReactNode }[] = [
  {
    key: 'clinics',
    body: (
      <>
        Triple-certified physician, with clinics at the NHS and Cleveland Clinic
        London{' '}
        <a
          href="https://clevelandcliniclondon.uk/"
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-2 transition-opacity hover:opacity-80"
          style={{ color: C.primary }}
        >
          clevelandcliniclondon.uk
        </a>
      </>
    ),
  },
  {
    key: 'founder',
    body: 'Founder of EoS Longevity, with a background in longevity medicine',
  },
  { key: 'personally', body: 'Delivers every coaching session personally, 1:1' },
  {
    key: 'scope',
    body: 'Works with you on nutrition, movement, sleep and stress',
  },
];

export default function Coach() {
  return (
    <section className="px-5 sm:px-6 py-16 sm:py-20" style={{ background: C.bg }}>
      <div
        className="max-w-3xl mx-auto rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-8"
        style={{ background: C.bgCard, border: `1px solid ${C.border}` }}
      >
        <img
          src="/coach-arup-sen.jpg"
          alt="Dr Arup Sen, Specialist in Longevity Medicine"
          width={168}
          height={168}
          className="rounded-full object-cover shrink-0"
          style={{ width: 168, height: 168, border: `2px solid rgba(164,214,94,0.55)` }}
        />

        <div className="flex-1 min-w-0 text-center sm:text-left">
          <p
            className="text-xs font-semibold tracking-wide mb-2"
            style={{ color: C.pillFg }}
          >
            Your coach
          </p>
          <p
            className="font-bold text-xl"
            style={{ color: C.fg, fontFamily: FONT_SERIF }}
          >
            Dr Arup Sen
          </p>
          <span
            className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold mt-2.5"
            style={{ background: C.pill, color: C.pillFg }}
          >
            Specialist in Longevity Medicine
          </span>

          <ul className="mt-5 space-y-2 inline-block text-left">
            {POINTS.map((p) => (
              <li key={p.key} className="flex items-start gap-2.5">
                <Check className="h-4 w-4 mt-0.5 shrink-0" style={{ color: C.primary }} aria-hidden />
                <span className="text-sm sm:text-base leading-relaxed" style={{ color: C.fg }}>
                  {p.body}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
