// ─── Coaching · FAQ ───────────────────────────────────────────────────
//
// Section 5 of the /coaching page. Five questions as expandable
// accordions, matching the site's established FAQ treatment
// (<details>/<summary> with a rotating "+", from SalesFunnel.tsx).
//
// Copy is fixed marketing/compliance-reviewed text — do not paraphrase.
// ──────────────────────────────────────────────────────────────────────
import { C, FONT_SERIF } from '@/lib/design-tokens';

const FAQ = [
  {
    q: 'Is this a medical programme?',
    a: 'No. This is a wellness coaching programme delivered by Dr Arup Sen of Eos Longevity in partnership with Meterbolic. It does not diagnose or treat any condition.',
  },
  {
    q: 'What if my readings show something concerning?',
    a: 'Your coach will flag it and explain your options, including seeing your GP or booking a separate medical consultation with Dr Sen at LIPS Healthcare (Battersea Power Station) or Queen Square private consulting rooms.',
  },
  {
    q: 'Who delivers the coaching?',
    a: 'Dr Arup Sen, founder of Eos Longevity, delivers every session personally.',
  },
  {
    q: 'What happens after my programme ends?',
    a: "You can continue monitoring with Meo independently, or speak to us about Eos Longevity's full longevity assessment services.",
  },
  {
    q: 'Is the Meo device accurate?',
    a: 'The Meo lipid meter is CE-marked and specified to read within approximately ±10% of a reference laboratory for total cholesterol, HDL, LDL and triglycerides.',
  },
] as const;

export default function Faq() {
  return (
    <section className="py-16 sm:py-24 px-5 sm:px-6" style={{ background: C.bg }}>
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <h2
            className="font-bold leading-tight"
            style={{ color: C.fg, fontFamily: FONT_SERIF, fontSize: 'clamp(28px, 4vw, 38px)' }}
          >
            Frequently asked questions
          </h2>
        </div>
        <div className="space-y-3">
          {FAQ.map((item) => (
            <details
              key={item.q}
              className="group rounded-2xl px-5 py-4 transition-colors"
              style={{ background: 'rgba(30,70,60,0.85)', border: `1px solid ${C.border}` }}
            >
              <summary className="cursor-pointer list-none flex items-center justify-between gap-4">
                <span className="font-semibold text-base" style={{ color: C.fg }}>
                  {item.q}
                </span>
                <span
                  className="shrink-0 transition-transform group-open:rotate-45 text-xl leading-none"
                  style={{ color: C.primary }}
                  aria-hidden
                >
                  +
                </span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed" style={{ color: C.muted }}>
                {item.a}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
