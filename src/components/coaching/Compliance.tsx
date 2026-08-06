// ─── Coaching · What this programme is — and isn't ───────────────────
//
// Section 4 of the /coaching page. A plain, readable content block that
// sets expectations about the coaching programme. Deliberately NOT
// styled as grey small print, a tooltip, an accordion, or a legal
// disclaimer box — it renders as normal body copy in the primary text
// colour, same as any other prose section on the site.
//
// The medical-signposting paragraph is ELEVATED (a warm, supportive
// card with a helping-hand icon) so it reads as reassurance — "here's
// how we look after you" — never as a subordinated legal caveat.
//
// Copy is fixed marketing/compliance-reviewed text — do not paraphrase.
// ──────────────────────────────────────────────────────────────────────
import { HeartHandshake } from 'lucide-react';
import { C, FONT_SERIF } from '@/lib/design-tokens';

export default function Compliance() {
  return (
    <section className="px-5 sm:px-6 py-16 sm:py-24" style={{ background: C.bgDeep }}>
      <div className="max-w-3xl mx-auto">
        <details className="group">
          <summary className="cursor-pointer list-none flex items-center justify-center gap-3 text-center">
            <h2
              className="font-extrabold leading-tight"
              style={{
                color: C.fg,
                fontFamily: FONT_SERIF,
                fontSize: 'clamp(28px, 4vw, 38px)',
                textWrap: 'balance',
              }}
            >
              What this programme is — and isn&rsquo;t
            </h2>
            <span
              className="shrink-0 transition-transform group-open:rotate-45 text-3xl leading-none"
              style={{ color: C.primary }}
              aria-hidden
            >
              +
            </span>
          </summary>

          <div className="space-y-6 mt-10">
          <p className="text-base sm:text-lg leading-relaxed" style={{ color: C.fg }}>
            This programme, delivered by Dr Arup Sen of Eos Longevity in partnership with
            Meterbolic, is a wellness and lifestyle coaching service. It supports healthy
            habits and helps you engage with your own metabolic trends.
          </p>

          <p className="text-base sm:text-lg leading-relaxed" style={{ color: C.fg }}>
            It is not a medical service. It does not diagnose, treat or prevent any
            condition, and does not provide clinical interpretation of your results. It
            does not replace your GP or other medical care.
          </p>

          {/* Elevated reassurance — supportive framing, not a caveat. Same
              body-copy sizing/colour as the surrounding text; the soft
              surface and icon lift it rather than push it down. */}
          <div
            className="rounded-2xl p-6 sm:p-7 flex items-start gap-4"
            style={{ background: C.bgCard, border: `1px solid rgba(164,214,94,0.45)` }}
          >
            <HeartHandshake className="h-6 w-6 mt-0.5 shrink-0" style={{ color: C.primary }} aria-hidden />
            <div className="space-y-4">
              <p className="text-base sm:text-lg leading-relaxed" style={{ color: C.fg }}>
                If any of your readings suggest something that warrants medical attention,
                we&rsquo;ll let you know — and you&rsquo;ll have the option to book a separate
                medical consultation with Dr Arup Sen at one of his existing private practice
                locations (LIPS Healthcare, Battersea Power Station, or Queen Square private
                consulting rooms). Virtual video medical consultations are also an option.
              </p>
              <p className="text-base sm:text-lg leading-relaxed" style={{ color: C.fg }}>
                This is a distinct medical service, separate from this coaching programme,
                provided at those locations under their own clinical governance.
              </p>
            </div>
          </div>

            <p className="text-base sm:text-lg leading-relaxed" style={{ color: C.fg }}>
              Meo is a CE-marked wellness and monitoring tool. It is not a diagnostic device.
            </p>
          </div>
        </details>
      </div>
    </section>
  );
}
