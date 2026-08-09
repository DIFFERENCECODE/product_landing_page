// ─────────────────────────────────────────────────────────────────────
// /trust — Trust & Data Protection.
//
// The positive, human-readable counterpart to /privacy. /privacy is the
// binding notice and lives in LegalPageShell (dense 14px legal type);
// this page is a full-design-system destination like /partners, because
// it has a persuasive job to do for two audiences at once:
//
//   (a) people about to hand over blood biomarkers, food photos and
//       chat with an AI coach;
//   (b) affiliates and clinicians putting their own reputation and
//       client list behind Meterbolic.
//
// ─── RULES FOR EDITING THIS PAGE ─────────────────────────────────────
//
// Every factual claim here was grounded in the codebase or in the ICO
// certificate before it was written. If you add a claim, ground it
// first. Specifically, the following were checked and are TRUE:
//
//   · RDS PostgreSQL in eu-west-2 (London) is the primary datastore —
//     the DSN in every backend .env points there.
//   · Identity is AWS Cognito; tokens are verified by RS256 signature
//     against the pool JWKS (chatbot-rag app/core/cognito.py).
//   · Database connections use TLS (sslmode on every DSN).
//   · Records are scoped to the caller's Cognito subject, and a request
//     for another user's row returns "not found", not "forbidden"
//     (bang-api api/health/food.py).
//   · Food photos live in a private S3 bucket and are only ever reached
//     through single-object presigned URLs that expire in minutes
//     (bang-api api/health/food_storage.py).
//   · The coach runs on AWS Bedrock (Anthropic Claude). There is no
//     OpenAI or Google model on any production path.
//   · A self-service account-deletion endpoint exists and hard-deletes
//     across ~16 tables in one transaction (chatbot-rag db_utils.py).
//
// And the following are NOT claimed anywhere on this page, deliberately.
// Do not "improve" the copy by adding them:
//
//   · UK/EU-only data residency. Food-photo S3 is signed for us-west-2,
//     the clinical Bedrock model resolves to us-east-1, and the
//     response cache is Redis Cloud in us-east-1. §"Where your data
//     lives" says London for the main record and is explicit that some
//     processing happens outside the UK.
//   · Encryption at rest. Asserted only in an internal markdown doc;
//     there is no IaC in any repo to evidence it. Verify in the AWS
//     console before adding.
//   · ISO 27001 / SOC 2 / HIPAA. We hold none of these. §"What we don't
//     claim" says so out loud.
//   · HSTS, CSP or other security headers — not currently set.
//   · Technical isolation between co-branded partner funnels. /checkout
//     carries no affiliate attribution today, so this is a product
//     intention, not an enforced guarantee. The partner section is
//     written around what is actually true.
//   · A fixed retention period in days/months. None is established
//     anywhere. §"How long we keep it" is honest about the gap.
// ─────────────────────────────────────────────────────────────────────
import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  FileText,
  ExternalLink,
  Database,
  KeyRound,
  Sparkles,
  UserCheck,
  Handshake,
  Ban,
  Scale,
  Mail,
  Eye,
} from 'lucide-react';
import { C, FONT_SERIF } from '@/lib/design-tokens';
import { Navbar, Footer } from '@/components/MarketingLandingPage';
import { ICO, PRIVACY_EMAIL, PARTNER_EMAIL } from '@/lib/trust';

export const metadata: Metadata = {
  title: 'Trust & Data Protection — Meterbolic',
  description:
    'How Meterbolic handles the most personal data you have. ICO-registered data controller (ZC039400) — certificate viewable in full. What we collect, where it lives, what our AI does and does not do with it, your rights under UK GDPR, and what we will never do.',
  alternates: { canonical: '/trust' },
  robots: { index: true, follow: true },
};

// ─── Small presentational helpers, local to this page ────────────────

function Section({
  id,
  eyebrow,
  title,
  children,
  deep = false,
}: {
  id: string;
  eyebrow?: string;
  title: string;
  children: React.ReactNode;
  deep?: boolean;
}) {
  return (
    <section
      id={id}
      className="px-5 sm:px-6 py-14 sm:py-20"
      style={deep ? { background: C.bgDeep } : undefined}
    >
      <div className="max-w-3xl mx-auto">
        {eyebrow && (
          <p className="text-xs font-semibold tracking-wide mb-3" style={{ color: C.pillFg }}>
            {eyebrow}
          </p>
        )}
        <h2
          className="font-extrabold mb-6 leading-tight"
          style={{
            color: C.fg,
            fontFamily: FONT_SERIF,
            fontSize: 'clamp(26px, 3.6vw, 36px)',
            textWrap: 'balance',
          }}
        >
          {title}
        </h2>
        <div className="space-y-5 text-base leading-relaxed" style={{ color: C.muted }}>
          {children}
        </div>
      </div>
    </section>
  );
}

function Card({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl p-6" style={{ background: C.bgCard, border: `1px solid ${C.border}` }}>
      <div
        className="w-10 h-10 rounded-xl mb-4 flex items-center justify-center"
        style={{ background: 'rgba(164,214,94,0.12)' }}
        aria-hidden
      >
        <Icon className="h-5 w-5" style={{ color: C.primary }} />
      </div>
      <h3 className="font-bold text-base mb-2" style={{ color: C.fg }}>
        {title}
      </h3>
      <p className="text-sm leading-relaxed" style={{ color: C.muted }}>
        {children}
      </p>
    </div>
  );
}

export default function TrustPage() {
  return (
    <main className="min-h-screen" style={{ background: C.bg, color: C.fg }}>
      <Navbar />

      {/* Back to home — same treatment as /partners */}
      <div className="px-5 sm:px-6 pt-20">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm hover:underline"
          style={{ color: C.muted }}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to home
        </Link>
      </div>

      {/* ── Hero ────────────────────────────────────────────────── */}
      <section className="px-5 sm:px-6 pt-4 sm:pt-6 pb-10 text-center">
        <p className="text-xs font-semibold tracking-wide mb-4" style={{ color: C.pillFg }}>
          Trust &amp; Data Protection
        </p>
        <h1
          className="font-extrabold mb-5 leading-tight max-w-3xl mx-auto"
          style={{
            color: C.fg,
            fontFamily: FONT_SERIF,
            fontSize: 'clamp(34px, 5.5vw, 56px)',
            textWrap: 'balance',
          }}
        >
          You are handing us the most personal data{' '}
          <span style={{ color: C.primary }}>you have.</span>
        </h1>
        <p className="text-base sm:text-lg max-w-2xl mx-auto" style={{ color: C.muted }}>
          Blood biomarkers. Insulin and glucose values. Photographs of your food.
          Conversations with an AI coach about your body. This page explains what
          happens to all of it — in plain English, with the paperwork attached.
        </p>
      </section>

      {/* ── The certificate. Highest thing on the page after the hero,
             because it is the one claim a reader can independently
             verify in ten seconds. ─────────────────────────────────── */}
      <section className="px-5 sm:px-6 pb-14 sm:pb-20">
        <div
          className="max-w-3xl mx-auto rounded-2xl p-6 sm:p-8"
          style={{
            background: `linear-gradient(140deg, ${C.bgCard}, rgba(164,214,94,0.10))`,
            border: `1px solid ${C.primary}`,
          }}
        >
          <div className="flex items-start gap-4 mb-6">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: C.pill }}
              aria-hidden
            >
              <ShieldCheck className="h-6 w-6" style={{ color: C.primary }} />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold tracking-wide mb-1.5" style={{ color: C.pillFg }}>
                Registered with the UK Information Commissioner&rsquo;s Office
              </p>
              <h2
                className="font-extrabold leading-tight"
                style={{ color: C.fg, fontFamily: FONT_SERIF, fontSize: 'clamp(22px, 3vw, 30px)' }}
              >
                {ICO.controller} — {ICO.reference}
              </h2>
            </div>
          </div>

          <dl className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            {[
              { k: 'Registration reference', v: ICO.reference },
              { k: 'Date registered', v: ICO.registered },
              { k: 'Registration expires', v: ICO.expires },
            ].map((row) => (
              <div
                key={row.k}
                className="rounded-xl px-4 py-3"
                style={{ background: 'rgba(255,255,255,0.05)', border: `1px solid ${C.border}` }}
              >
                <dt className="text-xs mb-1" style={{ color: C.muted }}>
                  {row.k}
                </dt>
                <dd className="text-sm font-semibold" style={{ color: C.fg }}>
                  {row.v}
                </dd>
              </div>
            ))}
          </dl>

          <p className="text-sm leading-relaxed mb-6" style={{ color: C.muted }}>
            Registered address: {ICO.address}. We are the data controller for
            everything collected through meterbolic.com and the Meo app — which
            means we are the ones legally accountable for it, and the ones you
            hold responsible.
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href={ICO.certificatePath}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-xl font-semibold px-6 py-3.5 text-sm transition-opacity hover:opacity-90"
              style={{ background: C.primary, color: C.primaryFg }}
            >
              <FileText className="h-4 w-4" aria-hidden />
              View certificate (PDF)
            </a>
            <a
              href={ICO.registerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-xl font-semibold px-6 py-3.5 text-sm transition-opacity hover:opacity-80"
              style={{ border: `1.5px solid ${C.borderInteractive}`, color: C.fg }}
            >
              Look us up on the ICO register
              <ExternalLink className="h-4 w-4" aria-hidden />
            </a>
          </div>
          <p className="text-xs mt-4" style={{ color: C.muted }}>
            The second link goes to the ICO&rsquo;s own website, not ours. A trust
            claim you can only check with us is not worth much.
          </p>
        </div>
      </section>

      {/* ── Lawful basis ────────────────────────────────────────── */}
      <Section
        id="basis"
        deep
        eyebrow="The legal footing"
        title="Health data is special-category data. We treat it as such."
      >
        <p>
          Under UK GDPR, data about your physical health sits in a protected
          category of its own (Article 9). It cannot be processed on the ordinary
          grounds that cover a name and address. It needs your{' '}
          <strong style={{ color: C.fg }}>explicit consent</strong> — freely
          given, specific, and separately asked for.
        </p>
        <p>
          That is why the Meo app asks you to consent to health-data processing as
          its own deliberate step, rather than folding it into a tick-box next to
          the terms of service. Consent is the basis we rely on for your
          metabolic data, and consent you have given you can take back. Withdraw
          it and we stop processing on that basis.
        </p>
        <p>
          Two narrower grounds sit alongside it: we process your order and
          account details because we need them to{' '}
          <strong style={{ color: C.fg }}>perform our contract</strong> with you —
          we cannot ship a device without an address — and we keep invoice records
          because{' '}
          <strong style={{ color: C.fg }}>the law requires us to</strong>. Those
          are not health data and are not covered by your health consent.
        </p>
        <p>
          The full notice, with the formal detail, is the{' '}
          <Link href="/privacy" className="underline" style={{ color: C.fg }}>
            Privacy Policy
          </Link>
          . This page is the version written to be read.
        </p>
      </Section>

      {/* ── What we collect ─────────────────────────────────────── */}
      <Section
        id="collect"
        eyebrow="What we collect"
        title="So the coach can be about you, not about averages."
      >
        <p>
          Population averages are why metabolic advice usually fails. &ldquo;Eat
          less fat&rdquo; is a statement about a cohort; it is not a statement
          about your Triglycerides on a Tuesday. Everything Meo collects exists to
          replace an average with a measurement of you.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <Card icon={Database} title="Your readings">
            Lipid panel results from the Digital Lipid Meter, and insulin and
            glucose values where you record them. This is the trend line — the
            reason the product exists. Without your own history, Meo has nothing
            to compare today against.
          </Card>
          <Card icon={Eye} title="Food photographs">
            Optional. A photo is read to identify what you ate, so a meal becomes
            a data point instead of a memory. It is held privately and is never
            attached to your name in anything we publish or analyse in aggregate.
          </Card>
          <Card icon={Sparkles} title="Your conversations with Meo">
            What you ask, and what Meo answered. Kept so the coach has continuity
            — so you are not re-explaining your history every session, and so you
            can go back and read what you were told.
          </Card>
          <Card icon={UserCheck} title="Account and order details">
            Name, email, delivery address, and what you bought. Payment card
            details we never see or store — those go directly to Stripe.
          </Card>
        </div>
        <p className="pt-2">
          We do not buy data about you from anyone else, and we do not enrich your
          profile from third-party sources. What we hold is what you gave us or
          measured yourself.
        </p>
      </Section>

      {/* ── Where it lives ─────────────────────────────────────── */}
      <Section
        id="where"
        deep
        eyebrow="Where your data lives"
        title="Specifics, not adjectives."
      >
        <p>
          &ldquo;Bank-grade security&rdquo; means nothing. Here is what is
          actually true, and we have tried to be equally clear about where it
          stops.
        </p>
        <ul className="space-y-4 pl-0 list-none">
          {[
            {
              icon: Database,
              t: 'Your record lives in London.',
              b: 'The primary database holding your readings, profile and conversation history is a managed PostgreSQL instance in Amazon Web Services’ London region (eu-west-2).',
            },
            {
              icon: KeyRound,
              t: 'Encrypted in transit, everywhere.',
              b: 'Traffic to the site and app is served over HTTPS, and our own services talk to the database over TLS. Nothing about your health moves across a network in the clear.',
            },
            {
              icon: UserCheck,
              t: 'Logging in is handled by AWS Cognito.',
              b: 'We do not store your password. Every request carries a signed token that our services verify cryptographically against Cognito before returning a single row.',
            },
            {
              icon: ShieldCheck,
              t: 'Your records are scoped to you.',
              b: 'Requests are answered against the identity in your token, never an account number supplied in the request. Ask our API for a record that is not yours and it reports that no such record exists — it will not even confirm the row is there.',
            },
            {
              icon: Eye,
              t: 'Food photos are not on a public URL.',
              b: 'They sit in a private store. When one needs to be displayed, we mint a link to that single image which expires within minutes. There is no permanent address for your photograph.',
            },
          ].map((r) => {
            const Icon = r.icon;
            return (
              <li key={r.t} className="flex items-start gap-4">
                <Icon className="h-5 w-5 mt-0.5 shrink-0" style={{ color: C.primary }} aria-hidden />
                <span>
                  <strong style={{ color: C.fg }}>{r.t}</strong> {r.b}
                </span>
              </li>
            );
          })}
        </ul>
        <p className="pt-2">
          Being straight about the edges: the master record is in London, but not
          every piece of processing happens inside the UK. Some of the services we
          rely on — parts of the AI processing, and image storage — run in other
          regions operated by the same providers. If you want the specifics for
          your own assessment, ask us and we will tell you exactly which service
          runs where.
        </p>
        <p>
          Our main processors are Amazon Web Services (hosting, database,
          identity, and the AI models), and Stripe (payments). We maintain a full
          list of sub-processors and will send it on request.
        </p>
      </Section>

      {/* ── AI ─────────────────────────────────────────────────── */}
      <Section
        id="ai"
        eyebrow="The AI questions"
        title="What Meo does with your data — and what it doesn't."
      >
        <p>
          These are the questions people actually want answered about an AI health
          coach, and they are usually the ones left out.
        </p>

        <div className="space-y-4 pt-2">
          {[
            {
              q: 'Does my data train somebody else’s AI model?',
              a: 'No. We do not use your health data to train publicly available AI models, and we do not hand it over for anyone else to train on. Meo runs on Anthropic’s Claude models through Amazon Bedrock, inside our own cloud account — not by pasting your results into a consumer chatbot.',
            },
            {
              q: 'Is the coach making things up about me?',
              a: 'Meo answers from your own records — your readings, your history, what you have told it. That is the entire point: it is grounded in your data rather than in a general impression of what a person like you probably looks like. It is still a language model, so it can be wrong, and it is not a clinician. Where a reading warrants medical attention, the right answer is a doctor, and Meo will say so.',
            },
            {
              q: 'Can a human read my conversations?',
              a: 'A human clinician is involved only when you choose to engage one — by booking a programme or a consultation through the marketplace. It does not happen silently in the background. Separately, a small number of our own engineers can reach production data when they are fixing something that is broken; that access is limited to the people who need it to do the job.',
            },
            {
              q: 'Do you use my health data to advertise to me?',
              a: 'No. Nothing about your biomarkers, your weight, your food or your conversations is used for ad targeting, and none of it is shared with advertising networks. There is no version of this business where we sell your bloods.',
            },
          ].map((item) => (
            <details
              key={item.q}
              className="group rounded-2xl px-5 py-4"
              style={{ background: C.bgCard, border: `1px solid ${C.border}` }}
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
      </Section>

      {/* ── Retention ──────────────────────────────────────────── */}
      <Section
        id="retention"
        deep
        eyebrow="How long we keep it"
        title="For as long as the trend is useful to you."
      >
        <p>
          A single cholesterol reading is close to meaningless. Fourteen readings
          over eleven weeks is a trend you can act on. So we keep your metabolic
          history for as long as you have an account — deleting last year&rsquo;s
          readings would quietly destroy the thing you bought.
        </p>
        <p>
          When you close your account, we delete your record: your readings,
          profile, food log, conversations and session history all go. Invoice and
          tax records we are legally obliged to keep for a fixed period, so those
          survive — that is a legal requirement, not a preference.
        </p>
        <p>
          What we are not going to do is invent a number. We have not yet
          published a fixed retention period for every individual category of
          data. When those periods are set, they will appear here and in the
          Privacy Policy. In the meantime, if you want your data gone, you do not
          have to wait for a policy — ask us, or delete your account, and it goes.
        </p>
      </Section>

      {/* ── Rights ─────────────────────────────────────────────── */}
      <Section
        id="rights"
        eyebrow="Your rights"
        title="Six things you can make us do."
      >
        <p>
          These are rights under UK GDPR, not concessions we are granting. One
          email starts any of them.
        </p>
        <ul className="space-y-3 pl-0 list-none pt-1">
          {[
            ['Access', 'Get a copy of everything we hold about you.'],
            ['Rectification', 'Make us correct anything that is wrong.'],
            ['Erasure', 'Have it deleted, except where the law makes us keep it.'],
            ['Portability', 'Receive your data in a machine-readable form and take it elsewhere.'],
            ['Objection', 'Object to how we are processing it, or withdraw a consent you gave.'],
            ['Complaint', 'Escalate past us entirely and go to the regulator.'],
          ].map(([t, b]) => (
            <li key={t} className="flex items-start gap-3">
              <Scale className="h-4 w-4 mt-1 shrink-0" style={{ color: C.primary }} aria-hidden />
              <span>
                <strong style={{ color: C.fg }}>{t}.</strong> {b}
              </span>
            </li>
          ))}
        </ul>

        <div
          className="rounded-2xl p-6 mt-6"
          style={{ background: C.bgCard, border: `1px solid ${C.primary}` }}
        >
          <p className="font-semibold mb-2" style={{ color: C.fg }}>
            How to actually exercise them
          </p>
          <p className="text-sm leading-relaxed mb-4" style={{ color: C.muted }}>
            Email us and say what you want. You do not need to cite an article
            number or use a particular form of words — &ldquo;send me my
            data&rdquo; or &ldquo;delete my account&rdquo; is enough. We will
            respond within one month, which is the statutory deadline.
          </p>
          <a
            href={`mailto:${PRIVACY_EMAIL}?subject=Data%20protection%20request`}
            className="inline-flex items-center gap-2 rounded-xl font-semibold px-5 py-3 text-sm transition-opacity hover:opacity-90"
            style={{ background: C.primary, color: C.primaryFg }}
          >
            <Mail className="h-4 w-4" aria-hidden />
            {PRIVACY_EMAIL}
            <ArrowRight className="h-4 w-4" aria-hidden />
          </a>
          <p className="text-sm leading-relaxed mt-5" style={{ color: C.muted }}>
            If we get it wrong, or you are unhappy with how we handled your
            request, you can complain to the Information Commissioner&rsquo;s
            Office directly at{' '}
            <a
              href={ICO.complaintsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
              style={{ color: C.fg }}
            >
              ico.org.uk/concerns
            </a>
            . You do not need our permission, and you do not have to come to us
            first.
          </p>
        </div>
      </Section>

      {/* ── Partners ───────────────────────────────────────────── */}
      <Section
        id="partners"
        deep
        eyebrow="For affiliates, partners and clinicians"
        title="You are putting your name to this. Here is what that commits you to."
      >
        <p>
          Meterbolic is sold co-branded. A partner supplies the human layer —
          coaching, clinical or therapeutic — wrapped around the device and the
          Meo subscription, and their clients arrive on a page carrying their
          logo. That makes data protection a shared reputational question, not
          just ours.
        </p>

        <div className="space-y-4 pt-1">
          {[
            {
              t: 'We are the controller for platform data.',
              b: 'Readings, app accounts, Meo conversations — Meterbolic Health Ltd is the data controller and carries the accountability, including with the ICO. You are not inheriting our compliance obligations for the platform by co-branding with us.',
            },
            {
              t: 'You remain the controller for your own clients.',
              b: 'Your client list, your notes, your correspondence and your own clinical records are yours. We do not acquire rights over them by supplying the device and the AI layer, and we do not ingest your CRM.',
            },
            {
              t: 'Co-branding does not hand you a data feed.',
              b: 'Sending traffic to a co-branded page does not give you access to those visitors’ health records. A partner sees a client’s metabolic data when that client has engaged them for a programme and the data is shared as part of delivering it — not as a by-product of the referral.',
            },
            {
              t: 'A client of one partner is not a lead for another.',
              b: 'We do not resell or cross-sell one partner’s clients into another partner’s offer, and we do not hand your client list to a competing practitioner. Each co-branded offer is presented as that partnership — both brands, one relationship.',
            },
          ].map((r) => (
            <div
              key={r.t}
              className="rounded-2xl p-6 flex items-start gap-4"
              style={{ background: C.bgCard, border: `1px solid ${C.border}` }}
            >
              <Handshake className="h-5 w-5 mt-0.5 shrink-0" style={{ color: C.primary }} aria-hidden />
              <p className="text-sm leading-relaxed" style={{ color: C.muted }}>
                <strong style={{ color: C.fg }}>{r.t}</strong> {r.b}
              </p>
            </div>
          ))}
        </div>

        <p className="pt-2">
          If you are conducting due diligence before you put your name to us:
          start with the ICO certificate above, then email{' '}
          <a href={`mailto:${PARTNER_EMAIL}`} className="underline" style={{ color: C.fg }}>
            {PARTNER_EMAIL}
          </a>{' '}
          and ask for the data-protection pack. We would rather answer a hard
          question at the diligence stage than have it surface in front of your
          client.
        </p>
      </Section>

      {/* ── Never ──────────────────────────────────────────────── */}
      <Section id="never" eyebrow="Commitments" title="What we will never do.">
        <p>
          Short list, because a long one is a sign nobody intends to keep it.
          These are commitments about our own conduct, and we can keep every one.
        </p>
        <ul className="space-y-3 pl-0 list-none pt-1">
          {[
            'Sell your health data. Not to insurers, not to employers, not to data brokers, not to anyone, at any price.',
            'Use your health data to target advertising at you, or share it with an advertising network.',
            'Hand your data to a third party to train their AI models on.',
            'Disclose your results to your employer, your insurer or your GP without you asking us to.',
            'Make a diagnosis. Meo is a wellness and monitoring tool; where something needs a doctor, we will tell you to see one.',
            'Quietly widen what we do with your data. If the purpose changes materially, we will ask you again rather than update a policy page and hope you miss it.',
          ].map((t) => (
            <li key={t} className="flex items-start gap-3">
              <Ban className="h-4 w-4 mt-1 shrink-0" style={{ color: C.primary }} aria-hidden />
              <span>{t}</span>
            </li>
          ))}
        </ul>
      </Section>

      {/* ── What we don't claim. The section that makes the rest of
             the page believable. ───────────────────────────────────── */}
      <Section
        id="not-claimed"
        deep
        eyebrow="Honesty section"
        title="What we don't claim."
      >
        <p>
          Trust pages tend to imply more than they say. Here is what we are not
          telling you, stated plainly, so you can price it into your decision.
        </p>
        <ul className="space-y-4 pl-0 list-none pt-1">
          {[
            [
              'We are not ISO 27001 or SOC 2 certified.',
              'We hold neither certification. Anyone implying otherwise — including us, in some future draft of this page — would be wrong. What we do instead is described above, in specifics.',
            ],
            [
              'HIPAA does not apply to us.',
              'HIPAA is US legislation covering US healthcare providers and their business associates. We are a UK company regulated under UK GDPR and the Data Protection Act 2018. A HIPAA badge on a UK consumer wellness product is decoration.',
            ],
            [
              'Meo is not a diagnostic device.',
              'The Digital Lipid Meter is CE-marked for wellness monitoring. It does not diagnose, treat, cure or prevent disease, and neither does the AI coach.',
            ],
            [
              'We are a young company, not a fortress.',
              'We are building a metabolic health platform, and our security programme is growing alongside it. We would rather tell you what is true today than describe the company we intend to be.',
            ],
          ].map(([t, b]) => (
            <li key={t} className="flex items-start gap-3">
              <Scale className="h-4 w-4 mt-1 shrink-0" style={{ color: C.primary }} aria-hidden />
              <span>
                <strong style={{ color: C.fg }}>{t}</strong> {b}
              </span>
            </li>
          ))}
        </ul>
      </Section>

      {/* ── Closing / cross-links ──────────────────────────────── */}
      <section className="px-5 sm:px-6 py-16 sm:py-20">
        <div className="max-w-3xl mx-auto text-center">
          <h2
            className="font-extrabold mb-4 leading-tight"
            style={{
              color: C.fg,
              fontFamily: FONT_SERIF,
              fontSize: 'clamp(24px, 3.4vw, 34px)',
              textWrap: 'balance',
            }}
          >
            Still have a question?
          </h2>
          <p className="text-base mb-8 max-w-xl mx-auto" style={{ color: C.muted }}>
            Ask it. If the answer belongs on this page, we will put it here.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-10">
            <a
              href={`mailto:${PRIVACY_EMAIL}?subject=Question%20about%20data%20protection`}
              className="inline-flex items-center gap-2 rounded-xl font-semibold px-6 py-3.5 text-sm transition-opacity hover:opacity-90"
              style={{ background: C.primary, color: C.primaryFg }}
            >
              <Mail className="h-4 w-4" aria-hidden />
              {PRIVACY_EMAIL}
            </a>
            <Link
              href="/privacy"
              className="inline-flex items-center gap-2 rounded-xl font-semibold px-6 py-3.5 text-sm transition-opacity hover:opacity-80"
              style={{ border: `1.5px solid ${C.borderInteractive}`, color: C.fg }}
            >
              Read the full Privacy Policy
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
          <p className="text-sm" style={{ color: C.muted }}>
            Also worth reading:{' '}
            <Link href="/terms" className="underline" style={{ color: C.muted }}>
              Terms of Service
            </Link>{' '}
            ·{' '}
            <Link href="/cookies" className="underline" style={{ color: C.muted }}>
              Cookies Policy
            </Link>{' '}
            ·{' '}
            <Link href="/how-it-works" className="underline" style={{ color: C.muted }}>
              How Meo works
            </Link>
          </p>
        </div>
      </section>

      <Footer />
    </main>
  );
}
