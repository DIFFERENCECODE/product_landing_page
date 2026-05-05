// ─────────────────────────────────────────────────────────────────────
// /quiz — Migrated from legacy diff/site/public_html/quiz.html. The
// original was a vanilla-JS multi-step form; this rebuild uses React
// state. All 7 steps, every question, every option value, and every
// label preserved verbatim. Conditional hormone follow-up (shown when
// sex === 'female') and the "1-2 symptoms" hint preserved. Submit
// destination is product_landing_page's /checkout (legacy quiz pointed
// at the now-out-of-scope checkout.html); the brief excludes the
// legacy checkout from migration so this is the unified destination.
// ─────────────────────────────────────────────────────────────────────
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { C, FONT_SERIF } from '@/lib/design-tokens';

const TOTAL_STEPS = 7;

const SEX_OPTS = [
  { value: 'female', label: 'Female' },
  { value: 'male', label: 'Male' },
  { value: 'prefer_not', label: 'Prefer not to say' },
] as const;

const HORMONE_OPTS = [
  { value: 'regular', label: 'Regular cycles' },
  { value: 'irregular', label: 'Irregular cycles' },
  { value: 'perimenopause', label: 'Perimenopause' },
  { value: 'postmenopause', label: 'Post-menopause' },
  { value: 'pcos', label: 'PCOS' },
  { value: 'prefer_not', label: 'Prefer not to say' },
] as const;

const GOAL_OPTS = [
  { value: 'weight', label: 'Weight' },
  { value: 'energy', label: 'Energy' },
  { value: 'hormones', label: 'Hormones' },
  { value: 'gut', label: 'Gut health' },
  { value: 'stress_sleep', label: 'Stress / sleep' },
  { value: 'clarity', label: "Clarity — I'm not sure" },
] as const;

const SYMPTOM_OPTS = [
  { value: 'cravings', label: 'Cravings' },
  { value: 'crashes', label: 'Afternoon crashes' },
  { value: 'bloating', label: 'Bloating' },
  { value: 'low_mood', label: 'Low mood or anxiety' },
  { value: 'irregular_cycles', label: 'Irregular cycles' },
  { value: 'fatigue', label: 'Fatigue' },
] as const;

const EATING_OPTS = [
  { value: 'structured', label: 'Structured meals' },
  { value: 'grazing', label: 'Grazing through the day' },
  { value: 'stress_eating', label: 'Stress/emotional eating' },
  { value: 'evening_snacking', label: 'Evening snacking' },
  { value: 'low_appetite', label: 'Low appetite' },
  { value: 'not_sure', label: 'Not sure' },
] as const;

const EMOTIONAL_OPTS = [
  { value: 'stuck', label: 'I feel stuck and need direction.' },
  { value: 'something_off', label: 'I know something is off.' },
  { value: 'feel_myself', label: 'I want to feel like myself again.' },
  { value: 'avoid_future', label: 'I want to avoid future problems.' },
  { value: 'look_feel_better', label: 'I want to look and feel better.' },
] as const;

const COLLECTION_OPTS = [
  { value: 'finger-prick', label: 'Finger prick — small sample from your fingertip' },
] as const;

type FormData = {
  email: string;
  first_name: string;
  sex: string;
  hormone_stage: string;
  primary_goal: string;
  symptoms: string[];
  eating_pattern: string;
  emotional_context: string;
  collection_preference: string;
};

const INITIAL: FormData = {
  email: '',
  first_name: '',
  sex: '',
  hormone_stage: '',
  primary_goal: '',
  symptoms: [],
  eating_pattern: '',
  emotional_context: '',
  // Pre-selected: only one collection method is currently offered
  // (Tasso has been retired). Step 7 still shows the choice so the
  // user can see it, but the Next button is enabled immediately.
  collection_preference: 'finger-prick',
};

function Radio({
  name,
  value,
  checked,
  onChange,
  label,
}: {
  name: string;
  value: string;
  checked: boolean;
  onChange: (v: string) => void;
  label: string;
}) {
  return (
    <label
      className="flex items-center gap-3 rounded-xl px-4 py-3 cursor-pointer transition-colors"
      style={{
        background: checked ? 'rgba(164,214,94,0.10)' : C.bgCard,
        border: `1px solid ${checked ? C.primary : C.border}`,
      }}
    >
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={() => onChange(value)}
        className="sr-only"
      />
      <span
        className="w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0"
        style={{
          borderColor: checked ? C.primary : C.border,
          background: checked ? C.primary : 'transparent',
        }}
        aria-hidden
      >
        {checked && <span className="w-1.5 h-1.5 rounded-full" style={{ background: C.primaryFg }} />}
      </span>
      <span className="text-sm" style={{ color: C.fg }}>{label}</span>
    </label>
  );
}

function Checkbox({
  name,
  value,
  checked,
  onChange,
  label,
  disabled,
}: {
  name: string;
  value: string;
  checked: boolean;
  onChange: (v: string) => void;
  label: string;
  disabled?: boolean;
}) {
  return (
    <label
      className="flex items-center gap-3 rounded-xl px-4 py-3 transition-colors"
      style={{
        background: checked ? 'rgba(164,214,94,0.10)' : C.bgCard,
        border: `1px solid ${checked ? C.primary : C.border}`,
        cursor: disabled && !checked ? 'not-allowed' : 'pointer',
        opacity: disabled && !checked ? 0.5 : 1,
      }}
    >
      <input
        type="checkbox"
        name={name}
        value={value}
        checked={checked}
        onChange={() => onChange(value)}
        disabled={disabled && !checked}
        className="sr-only"
      />
      <span
        className="w-4 h-4 rounded border-2 flex items-center justify-center shrink-0"
        style={{
          borderColor: checked ? C.primary : C.border,
          background: checked ? C.primary : 'transparent',
        }}
        aria-hidden
      >
        {checked && <Check className="h-3 w-3" style={{ color: C.primaryFg }} />}
      </span>
      <span className="text-sm" style={{ color: C.fg }}>{label}</span>
    </label>
  );
}

export default function QuizPage() {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<FormData>(INITIAL);
  const [done, setDone] = useState(false);

  const update = <K extends keyof FormData>(k: K, v: FormData[K]) =>
    setData((d) => ({ ...d, [k]: v }));

  const toggleSymptom = (v: string) => {
    setData((d) => {
      const has = d.symptoms.includes(v);
      if (has) return { ...d, symptoms: d.symptoms.filter((s) => s !== v) };
      if (d.symptoms.length >= 2) return d; // cap at 2
      return { ...d, symptoms: [...d.symptoms, v] };
    });
  };

  const stepValid = (() => {
    switch (step) {
      case 1: return data.email.trim() !== '' && data.first_name.trim() !== '';
      case 2: return data.sex !== '' && (data.sex !== 'female' || data.hormone_stage !== '');
      case 3: return data.primary_goal !== '';
      case 4: return data.symptoms.length >= 1;
      case 5: return data.eating_pattern !== '';
      case 6: return data.emotional_context !== '';
      case 7: return data.collection_preference !== '';
      default: return false;
    }
  })();

  const next = () => {
    if (!stepValid) return;
    if (step < TOTAL_STEPS) setStep((s) => s + 1);
    else setDone(true);
  };
  const back = () => setStep((s) => Math.max(1, s - 1));

  const progressPct = (step / TOTAL_STEPS) * 100;

  return (
    <main className="min-h-screen" style={{ background: C.bg, color: C.fg }}>
      <div className="px-5 sm:px-6 pt-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm hover:underline"
          style={{ color: C.muted }}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Meo
        </Link>
      </div>

      <section className="px-5 sm:px-6 py-12 sm:py-16">
        <div className="max-w-2xl mx-auto">
          <h1
            className="font-extrabold mb-3 leading-tight"
            style={{
              color: C.fg,
              fontFamily: FONT_SERIF,
              fontSize: 'clamp(28px, 4vw, 40px)',
              textWrap: 'balance',
            }}
          >
            Let&apos;s personalise your <span style={{ color: C.primary }}>test</span>.
          </h1>
          <p className="text-base mb-10" style={{ color: C.muted }}>
            Answer a few quick questions so we can recommend the right kit and collection method.
          </p>

          {!done ? (
            <div
              className="rounded-2xl p-6 sm:p-8"
              style={{ background: C.bgCard, border: `1px solid ${C.border}` }}
            >
              {/* Progress */}
              <div className="mb-6">
                <p className="text-xs font-semibold tracking-wide mb-2" style={{ color: C.pillFg }}>
                  Step {step} of {TOTAL_STEPS}
                </p>
                <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
                  <div
                    className="h-full transition-all duration-300"
                    style={{ width: `${progressPct}%`, background: C.primary }}
                    aria-hidden
                  />
                </div>
              </div>

              {/* Step 1 */}
              {step === 1 && (
                <div className="space-y-5">
                  <h2 className="font-bold text-xl" style={{ color: C.fg, fontFamily: FONT_SERIF }}>
                    Where should we send your personalised results?
                  </h2>
                  <p className="text-sm" style={{ color: C.muted }}>
                    You&apos;ll get a short summary and next steps based on your answers.
                  </p>
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: C.fg }}>Email</label>
                    <input
                      type="email"
                      value={data.email}
                      onChange={(e) => update('email', e.target.value)}
                      className="w-full rounded-xl px-4 py-3 text-sm focus:outline-none"
                      style={{ background: 'rgba(255,255,255,0.06)', border: `1px solid ${C.border}`, color: C.fg }}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: C.fg }}>First name</label>
                    <input
                      type="text"
                      value={data.first_name}
                      onChange={(e) => update('first_name', e.target.value)}
                      className="w-full rounded-xl px-4 py-3 text-sm focus:outline-none"
                      style={{ background: 'rgba(255,255,255,0.06)', border: `1px solid ${C.border}`, color: C.fg }}
                      required
                    />
                  </div>
                  <p className="text-xs" style={{ color: C.muted }}>We&apos;ll never share your details with third parties.</p>
                </div>
              )}

              {/* Step 2 */}
              {step === 2 && (
                <div className="space-y-5">
                  <h2 className="font-bold text-xl" style={{ color: C.fg, fontFamily: FONT_SERIF }}>
                    What is your biological sex?
                  </h2>
                  <div className="grid gap-2">
                    {SEX_OPTS.map((o) => (
                      <Radio
                        key={o.value}
                        name="sex"
                        value={o.value}
                        checked={data.sex === o.value}
                        onChange={(v) => {
                          update('sex', v);
                          if (v !== 'female') update('hormone_stage', '');
                        }}
                        label={o.label}
                      />
                    ))}
                  </div>
                  {data.sex === 'female' && (
                    <div>
                      <h2 className="font-bold text-xl mt-6 mb-3" style={{ color: C.fg, fontFamily: FONT_SERIF }}>
                        Which best describes your current cycle or hormonal pattern?
                      </h2>
                      <div className="grid gap-2">
                        {HORMONE_OPTS.map((o) => (
                          <Radio
                            key={o.value}
                            name="hormone_stage"
                            value={o.value}
                            checked={data.hormone_stage === o.value}
                            onChange={(v) => update('hormone_stage', v)}
                            label={o.label}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Step 3 */}
              {step === 3 && (
                <div className="space-y-5">
                  <h2 className="font-bold text-xl" style={{ color: C.fg, fontFamily: FONT_SERIF }}>
                    What would you most like to improve right now?
                  </h2>
                  <div className="grid gap-2">
                    {GOAL_OPTS.map((o) => (
                      <Radio
                        key={o.value}
                        name="primary_goal"
                        value={o.value}
                        checked={data.primary_goal === o.value}
                        onChange={(v) => update('primary_goal', v)}
                        label={o.label}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Step 4 */}
              {step === 4 && (
                <div className="space-y-5">
                  <h2 className="font-bold text-xl" style={{ color: C.fg, fontFamily: FONT_SERIF }}>
                    Which of these do you experience most often?
                  </h2>
                  <p className="text-sm" style={{ color: C.muted }}>You can choose one or two.</p>
                  <div className="grid gap-2">
                    {SYMPTOM_OPTS.map((o) => (
                      <Checkbox
                        key={o.value}
                        name="symptoms"
                        value={o.value}
                        checked={data.symptoms.includes(o.value)}
                        onChange={toggleSymptom}
                        label={o.label}
                        disabled={data.symptoms.length >= 2}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Step 5 */}
              {step === 5 && (
                <div className="space-y-5">
                  <h2 className="font-bold text-xl" style={{ color: C.fg, fontFamily: FONT_SERIF }}>
                    What best describes how you eat?
                  </h2>
                  <div className="grid gap-2">
                    {EATING_OPTS.map((o) => (
                      <Radio
                        key={o.value}
                        name="eating_pattern"
                        value={o.value}
                        checked={data.eating_pattern === o.value}
                        onChange={(v) => update('eating_pattern', v)}
                        label={o.label}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Step 6 */}
              {step === 6 && (
                <div className="space-y-5">
                  <h2 className="font-bold text-xl" style={{ color: C.fg, fontFamily: FONT_SERIF }}>
                    Which of these feels closest to your situation right now?
                  </h2>
                  <div className="grid gap-2">
                    {EMOTIONAL_OPTS.map((o) => (
                      <Radio
                        key={o.value}
                        name="emotional_context"
                        value={o.value}
                        checked={data.emotional_context === o.value}
                        onChange={(v) => update('emotional_context', v)}
                        label={o.label}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Step 7 */}
              {step === 7 && (
                <div className="space-y-5">
                  <h2 className="font-bold text-xl" style={{ color: C.fg, fontFamily: FONT_SERIF }}>
                    How would you prefer to give blood?
                  </h2>
                  <div className="grid gap-2">
                    {COLLECTION_OPTS.map((o) => (
                      <Radio
                        key={o.value}
                        name="collection_preference"
                        value={o.value}
                        checked={data.collection_preference === o.value}
                        onChange={(v) => update('collection_preference', v)}
                        label={o.label}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Buttons */}
              <div className="flex items-center justify-between mt-8 pt-6" style={{ borderTop: `1px solid ${C.border}` }}>
                <button
                  type="button"
                  onClick={back}
                  disabled={step === 1}
                  className="text-sm hover:underline disabled:opacity-40 disabled:no-underline disabled:cursor-not-allowed"
                  style={{ color: C.muted }}
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={next}
                  disabled={!stepValid}
                  className="inline-flex items-center justify-center gap-2 rounded-xl font-semibold px-6 py-3 text-sm transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ background: C.primary, color: C.primaryFg }}
                >
                  {step === TOTAL_STEPS ? 'Finish' : 'Next'} <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          ) : (
            <div
              className="rounded-2xl p-8 sm:p-10 text-center"
              style={{ background: C.bgCard, border: `1px solid ${C.primary}` }}
            >
              <div
                className="w-14 h-14 rounded-2xl mx-auto mb-5 flex items-center justify-center"
                style={{ background: C.pill }}
                aria-hidden
              >
                <Check className="h-7 w-7" style={{ color: C.primary }} />
              </div>
              <h2
                className="font-extrabold mb-3 leading-tight"
                style={{ color: C.fg, fontFamily: FONT_SERIF, fontSize: 'clamp(24px, 4vw, 32px)' }}
              >
                We&apos;re analysing your answers.
              </h2>
              <p className="text-base mb-3" style={{ color: C.muted }}>
                We&apos;ll send your personalised insights to your inbox shortly.
              </p>
              <p className="text-base mb-8" style={{ color: C.muted }}>
                On the next screen, we&apos;ll show you the best starting test and collection method based on your answers.
              </p>
              <Link
                href="/checkout"
                className="inline-flex items-center justify-center gap-2 rounded-xl font-semibold px-8 py-3.5 text-base transition-opacity hover:opacity-90"
                style={{ background: C.primary, color: C.primaryFg }}
              >
                Continue to checkout <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
