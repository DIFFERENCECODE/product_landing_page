// ─────────────────────────────────────────────────────────────────────
// /about — Migrated from legacy diff/site/public_html/about.html.
// Original copy preserved verbatim across all 13 sections: hero,
// mission, statistics, timeline, scientific advisors, core team,
// investors, science, CTA, contact. Legacy CSS, FontAwesome, Meta
// Pixel scripts dropped. Image references not wired in this pass —
// images would need to be copied from diff/site/public_html/assets/
// to product_landing_page/public/ separately.
// ─────────────────────────────────────────────────────────────────────
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Mail, Twitter, Linkedin, Instagram } from 'lucide-react';
import { C, FONT_SERIF } from '@/lib/design-tokens';

export const metadata: Metadata = {
  title: 'About — Meterbolic',
  description:
    "Learn about Meterbolic's mission to prevent chronic disease through metabolic health optimization.",
};

const STATS = [
  { value: '85M+', label: 'Americans with prediabetes' },
  { value: '88%', label: "Don't know they're metabolically unhealthy" },
  { value: '5–10×', label: 'Higher risk of chronic disease' },
] as const;

const TIMELINE = [
  {
    year: '2018',
    title: 'Company Founded',
    body: 'Meterbolic is established with a mission to bring preventative metabolic health into the mainstream.',
  },
  {
    year: '2019',
    title: 'First Kraft Clinics',
    body: "Launched in-person Kraft tests inspired by Dr Joseph Kraft's research, paired with personalised coaching.",
  },
  {
    year: '2020',
    title: 'Prototype Development',
    body: 'Refined testing protocols and coaching frameworks, shaping the foundation for scalable at-home diagnostics.',
  },
  {
    year: '2021',
    title: 'Pilot Trials',
    body: 'Delivered pilot programmes with patients to validate testing methods and generate early outcome data.',
  },
  {
    year: '2022–2023',
    title: 'Clinical Growth',
    body: 'Expanded in-person Kraft testing and coaching, building real-world insights into insulin resistance and metabolic health.',
  },
  {
    year: '2026',
    title: 'Home Testing and AI Coach',
    body:
      'Launch of at-home Kraft testing kits and Meo, our AI-powered health coach, scaling years of clinical expertise into accessible, personalised guidance.',
  },
  {
    year: 'Next',
    title: 'The Digital Double',
    body:
      "We are now developing the Meterbolic Digital Double, integrating biomarker data, lifestyle patterns, and Meo's intelligence into a precision health twin that predicts risks, optimises decisions, and delivers truly proactive care.",
  },
] as const;

const ADVISORS = [
  {
    name: 'Prof. Tim Noakes',
    role: 'Scientific Advisor',
    bio: "Emeritus Professor at UCT's Division of Exercise Science and Sports Medicine. Renowned for pioneering research in exercise physiology, nutrition, and low-carbohydrate science. Author and endurance athlete with 70+ marathons and ultramarathons.",
  },
  {
    name: 'Dr. Robbert Slingerland',
    role: 'Scientific Advisor',
    bio: 'Chair of Clinical Chemistry Laboratories at Isala Klinieken, Zwolle (Netherlands) and Chair of the European Reference Laboratory. Specialist in clinical chemistry and biostatistics with extensive research into metabolic biomarkers.',
  },
  {
    name: 'David Jehring',
    role: 'Technology Advisor',
    bio: 'CEO and Founder of Black Pear Software. Healthcare technology leader with a background as CTO at Apollo Medical Systems Ltd, specialising in digital health integration.',
  },
  {
    name: 'Dr. Isabella Cooper',
    role: 'Research Advisor',
    bio: 'PhD in Biochemistry, Physiology and Pathophysiology. Researcher in hyperinsulinemia and ketogenic science, advising on metabolic disease mechanisms and nutritional interventions.',
  },
] as const;

const TEAM = [
  {
    name: 'Dr. Eric Smith',
    role: 'Founder',
    bio: 'Innovative engineer and medical doctor who founded Meterbolic to revolutionize metabolic health diagnostics.',
  },
  {
    name: 'Andy Taylor',
    role: 'Clinic Lead',
    bio: 'Former professional footballer turned metabolic health expert and UKSCA-accredited coach.',
  },
  {
    name: 'Spencer Martin',
    role: 'Sales Manager',
    bio: "Over 25 years in pharmaceutical sales, specialising in diabetes therapies and coaching. Driving Meterbolic's commercial outreach and partner growth.",
  },
  {
    name: 'Prof. Gabor Erdosi',
    role: 'Chief Metabolic Scientist',
    bio: 'Molecular biologist focused on metabolic dysfunction and sweetener science, advancing evidence-based innovation in diagnostics.',
  },
  {
    name: 'Georgina Bostock',
    role: 'Product Lead',
    bio: "Leading product strategy, marketing, and partnerships to deliver growth and expand Meterbolic's impact in preventative health.",
  },
  {
    name: 'Prof Justin Tondt',
    role: 'Chief Medical Officer',
    bio: "Medical professional guiding Meterbolic's clinical protocols and ensuring scientific rigour in metabolic health interventions.",
  },
  {
    name: 'Erik Kettschick',
    role: 'UX/UI and Product Designer',
    bio: 'Specialises in visual identity and product design, creating user-friendly digital experiences and graphics that bring the Meterbolic brand to life.',
  },
  {
    name: 'Luigi Maretto',
    role: 'Web UI/UX Developer',
    bio: 'Specialist in designing and developing intuitive user interfaces and digital experiences, building seamless web platforms for health and wellness applications.',
  },
  {
    name: 'Lechenu Iyoko',
    role: 'AI Engineer',
    bio: 'Expert in machine learning algorithms and IT infrastructure, developing scalable AI solutions for personalised metabolic health.',
  },
  {
    name: 'Bhanu Rangavazzala',
    role: 'DevSecOps',
    bio: "Improving data infrastructure, rebuilding dashboards and developing AI training pipelines to support the company's analytics and product innovation.",
  },
  {
    name: 'Helen MacGregor',
    role: 'Finance',
    bio: 'Trusted advisor who provides strategic insights, financial analysis, and risk management solutions to help organisations optimise performance and ensure compliance.',
  },
] as const;

function PersonCard({ name, role, bio }: { name: string; role: string; bio: string }) {
  return (
    <div
      className="rounded-2xl p-6 flex flex-col"
      style={{ background: C.bgCard, border: `1px solid ${C.border}` }}
    >
      <h3 className="font-bold text-lg mb-1" style={{ color: C.fg, fontFamily: FONT_SERIF }}>{name}</h3>
      <p className="text-xs font-semibold tracking-wide mb-3" style={{ color: C.primary }}>{role}</p>
      <p className="text-sm leading-relaxed" style={{ color: C.muted }}>{bio}</p>
    </div>
  );
}

export default function AboutPage() {
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

      {/* Hero */}
      <section className="px-5 sm:px-6 pt-16 sm:pt-24 pb-16 text-center">
        <p className="text-xs font-semibold tracking-wide mb-4" style={{ color: C.pillFg }}>
          About Meterbolic
        </p>
        <h1
          className="font-extrabold mb-5 leading-tight max-w-3xl mx-auto"
          style={{
            color: C.fg,
            fontFamily: FONT_SERIF,
            fontSize: 'clamp(36px, 6vw, 60px)',
            textWrap: 'balance',
          }}
        >
          Redefining <span style={{ color: C.primary }}>metabolic health</span>.
        </h1>
        <p className="text-base sm:text-lg max-w-2xl mx-auto" style={{ color: C.muted }}>
          Science-backed solutions for preventing chronic disease.
        </p>
      </section>

      {/* Mission */}
      <section className="px-5 sm:px-6 py-16 sm:py-24" style={{ background: C.bgDeep }}>
        <div className="max-w-4xl mx-auto">
          <p className="text-xs font-semibold tracking-wide mb-3" style={{ color: C.pillFg }}>
            Our mission
          </p>
          <h2
            className="font-extrabold mb-6 leading-tight"
            style={{ color: C.fg, fontFamily: FONT_SERIF, fontSize: 'clamp(28px, 4vw, 38px)', textWrap: 'balance' }}
          >
            Preventing disease <span style={{ color: C.primary }}>before it starts</span>.
          </h2>
          <div className="space-y-5 text-base sm:text-lg" style={{ color: C.muted }}>
            <p>
              Meterbolic was founded on the belief that metabolic dysfunction is at the root of most chronic diseases, and that by optimizing metabolism, we can prevent these conditions before they take hold.
            </p>
            <p>
              Our platform combines continuous glucose monitoring, advanced AI, and personalized coaching to help people understand and improve their metabolic health in real-time.
            </p>
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="px-5 sm:px-6 py-16 sm:py-24">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-5">
          {STATS.map((s) => (
            <div
              key={s.label}
              className="rounded-2xl p-7 text-center"
              style={{ background: C.bgCard, border: `1px solid ${C.border}` }}
            >
              <div
                className="font-extrabold mb-2 tabular-nums"
                style={{ color: C.primary, fontFamily: FONT_SERIF, fontSize: 'clamp(36px, 5vw, 56px)' }}
              >
                {s.value}
              </div>
              <p className="text-sm leading-relaxed" style={{ color: C.muted }}>{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Timeline */}
      <section className="px-5 sm:px-6 py-16 sm:py-24" style={{ background: C.bgDeep }}>
        <div className="max-w-4xl mx-auto">
          <p className="text-xs font-semibold tracking-wide mb-3 text-center" style={{ color: C.pillFg }}>
            Our journey
          </p>
          <h2
            className="font-extrabold mb-3 text-center leading-tight"
            style={{ color: C.fg, fontFamily: FONT_SERIF, fontSize: 'clamp(28px, 4vw, 38px)', textWrap: 'balance' }}
          >
            Meterbolic <span style={{ color: C.primary }}>timeline</span>.
          </h2>
          <p className="text-center text-base mb-12" style={{ color: C.muted }}>
            Key milestones in our mission to transform metabolic health.
          </p>
          <ol className="relative space-y-6" style={{ borderLeft: `2px solid ${C.border}`, paddingLeft: 24 }}>
            {TIMELINE.map((t) => (
              <li key={t.year} className="relative">
                <span
                  className="absolute -left-[31px] top-2 w-3 h-3 rounded-full"
                  style={{ background: C.primary }}
                  aria-hidden
                />
                <div
                  className="rounded-2xl p-6"
                  style={{ background: C.bgCard, border: `1px solid ${C.border}` }}
                >
                  <p className="text-xs font-semibold tracking-wide mb-2" style={{ color: C.primary }}>{t.year}</p>
                  <h3 className="font-bold text-lg mb-2" style={{ color: C.fg, fontFamily: FONT_SERIF }}>{t.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: C.muted }}>{t.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Scientific Advisors */}
      <section id="team" className="px-5 sm:px-6 py-16 sm:py-24">
        <div className="max-w-6xl mx-auto">
          <p className="text-xs font-semibold tracking-wide mb-3 text-center" style={{ color: C.pillFg }}>
            Meterbolic
          </p>
          <h2
            className="font-extrabold mb-12 text-center leading-tight"
            style={{ color: C.fg, fontFamily: FONT_SERIF, fontSize: 'clamp(28px, 4vw, 38px)', textWrap: 'balance' }}
          >
            Meet our <span style={{ color: C.primary }}>scientific advisors</span>.
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {ADVISORS.map((a) => (
              <PersonCard key={a.name} {...a} />
            ))}
          </div>
        </div>
      </section>

      {/* Core team */}
      <section className="px-5 sm:px-6 py-16 sm:py-24" style={{ background: C.bgDeep }}>
        <div className="max-w-6xl mx-auto">
          <p className="text-xs font-semibold tracking-wide mb-3 text-center" style={{ color: C.pillFg }}>
            Meterbolic team
          </p>
          <h2
            className="font-extrabold mb-12 text-center leading-tight"
            style={{ color: C.fg, fontFamily: FONT_SERIF, fontSize: 'clamp(28px, 4vw, 38px)', textWrap: 'balance' }}
          >
            The innovators and scientists <span style={{ color: C.primary }}>behind Meterbolic</span>.
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {TEAM.map((p) => (
              <PersonCard key={p.name} {...p} />
            ))}
          </div>
        </div>
      </section>

      {/* Investors */}
      <section className="px-5 sm:px-6 py-16 sm:py-24">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-xs font-semibold tracking-wide mb-3" style={{ color: C.pillFg }}>
            Backed by
          </p>
          <h2
            className="font-extrabold mb-3 leading-tight"
            style={{ color: C.fg, fontFamily: FONT_SERIF, fontSize: 'clamp(28px, 4vw, 38px)', textWrap: 'balance' }}
          >
            Leading <span style={{ color: C.primary }}>health innovators</span>.
          </h2>
          <p className="text-base" style={{ color: C.muted }}>
            We&apos;re proud to be supported by visionary investors who share our mission.
          </p>
        </div>
      </section>

      {/* Science */}
      <section className="px-5 sm:px-6 py-16 sm:py-24" style={{ background: C.bgDeep }}>
        <div className="max-w-4xl mx-auto">
          <p className="text-xs font-semibold tracking-wide mb-3" style={{ color: C.pillFg }}>
            The science
          </p>
          <h2
            className="font-extrabold mb-6 leading-tight"
            style={{ color: C.fg, fontFamily: FONT_SERIF, fontSize: 'clamp(28px, 4vw, 38px)', textWrap: 'balance' }}
          >
            Backed by <span style={{ color: C.primary }}>rigorous research</span>.
          </h2>
          <div className="space-y-5 text-base sm:text-lg" style={{ color: C.muted }}>
            <p>
              Our approach is grounded in the pioneering work of Dr. Joseph Kraft and decades of metabolic research. We&apos;ve developed proprietary algorithms that identify early markers of metabolic dysfunction often missed by conventional testing.
            </p>
            <p>
              By focusing on hyperinsulinemia — the earliest detectable abnormality in metabolic health — we can intervene years before traditional diabetes markers appear.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-5 sm:px-6 py-20 text-center">
        <div className="max-w-3xl mx-auto">
          <p className="text-xs font-semibold tracking-wide mb-3" style={{ color: C.pillFg }}>
            Ready to transform
          </p>
          <h2
            className="font-extrabold mb-4 leading-tight"
            style={{ color: C.fg, fontFamily: FONT_SERIF, fontSize: 'clamp(28px, 4vw, 40px)', textWrap: 'balance' }}
          >
            Join the metabolic health <span style={{ color: C.primary }}>revolution</span>.
          </h2>
          <p className="text-base mb-8" style={{ color: C.muted }}>
            Be part of the movement to prevent chronic disease through early detection and personalized optimization.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/quiz"
              className="inline-flex items-center justify-center gap-2 rounded-xl font-semibold px-10 py-4 text-base transition-opacity hover:opacity-90"
              style={{ background: C.primary, color: C.primaryFg }}
            >
              Get started today <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/partners"
              className="inline-flex items-center justify-center gap-2 rounded-xl font-semibold px-8 py-4 text-base transition-opacity hover:opacity-90"
              style={{ color: C.fg, border: `1px solid ${C.border}` }}
            >
              Learn more
            </Link>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="px-5 sm:px-6 py-16 sm:py-24" style={{ background: C.bgDeep }}>
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-xs font-semibold tracking-wide mb-3" style={{ color: C.pillFg }}>
            Contact
          </p>
          <h2
            className="font-extrabold mb-3 leading-tight"
            style={{ color: C.fg, fontFamily: FONT_SERIF, fontSize: 'clamp(28px, 4vw, 38px)', textWrap: 'balance' }}
          >
            Contact our <span style={{ color: C.primary }}>team</span>.
          </h2>
          <p className="text-base mb-10" style={{ color: C.muted }}>
            For support or assistance, connect with our team:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <a
              href="mailto:info@meterbolic.com"
              className="rounded-2xl p-6 flex flex-col items-center gap-3 transition-opacity hover:opacity-90"
              style={{ background: C.bgCard, border: `1px solid ${C.border}` }}
            >
              <Mail className="h-6 w-6" style={{ color: C.primary }} aria-hidden />
              <span className="text-sm font-semibold" style={{ color: C.fg }}>Email</span>
              <span className="text-sm" style={{ color: C.muted }}>info@meterbolic.com</span>
            </a>
            <div
              className="rounded-2xl p-6 flex flex-col items-center gap-3"
              style={{ background: C.bgCard, border: `1px solid ${C.border}` }}
            >
              <span className="text-sm font-semibold" style={{ color: C.fg }}>Social</span>
              <div className="flex gap-3">
                <a
                  href="https://x.com/meterbolic"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg hover:opacity-90"
                  style={{ background: 'rgba(164,214,94,0.12)', color: C.primary }}
                  aria-label="Twitter / X"
                >
                  <Twitter className="h-4 w-4" />
                </a>
                <a
                  href="https://www.linkedin.com/company/meterbolic-org/posts/?feedView=all"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg hover:opacity-90"
                  style={{ background: 'rgba(164,214,94,0.12)', color: C.primary }}
                  aria-label="LinkedIn"
                >
                  <Linkedin className="h-4 w-4" />
                </a>
                <a
                  href="https://www.instagram.com/meterbolic/?hl=en"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg hover:opacity-90"
                  style={{ background: 'rgba(164,214,94,0.12)', color: C.primary }}
                  aria-label="Instagram"
                >
                  <Instagram className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
