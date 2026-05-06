import type { Metadata } from 'next';
import { LegalPageShell, LegalH2, LegalH3 } from '@/components/LegalPageShell';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Terms of sale and use for Meo by Metabolic Health Ltd.',
  robots: { index: true, follow: true },
};

// ─────────────────────────────────────────────────────────────────────
// PLACEHOLDER LEGAL TEXT — written for England & Wales consumer goods
// + digital services (Consumer Rights Act 2015, Consumer Contracts
// Regulations 2013). Substantively reflects how the site operates:
//   - 30-day money-back on the device
//   - Subscription auto-renewal with prior reminder
//   - Wellness, not medical advice
//   - Stripe Checkout for payment
//   - Liability cap at order value
// Have a UK-qualified solicitor review before treating as final.
// ─────────────────────────────────────────────────────────────────────

export default function TermsPage() {
  return (
    <LegalPageShell
      eyebrow="Legal"
      title="Terms of Service"
      lastUpdated="28 April 2026"
    >
      <section>
        <LegalH2>1. About these terms</LegalH2>
        <p>
          These terms govern your purchase and use of the Meo Metabolic Health
          Cholesterol Tracker (&ldquo;Meo&rdquo;), sold by Meterbolic Ltd,
          England &amp; Wales. By placing an order you agree to be bound by
          these terms. They are governed by the laws of England &amp; Wales.
        </p>
      </section>

      <section>
        <LegalH2>2. What you&apos;re buying</LegalH2>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            One Digital Lipid Meter device, lancets, test strips and carry case
            (the &ldquo;Hardware&rdquo;).
          </li>
          <li>
            Six (6) months of access to the Meo AI software service (the
            &ldquo;Subscription&rdquo;).
          </li>
          <li>
            One (1) digital copy of <em>The Thin Book of Fat</em> by Marina
            Young (the &ldquo;eBook&rdquo;).
          </li>
          <li>
            One (1) free retest reading at month 6 with a personalised report.
          </li>
        </ul>
      </section>

      <section>
        <LegalH2>3. Wellness, not medical advice</LegalH2>
        <p>
          The Meter is a CE-marked at-home lipid meter cleared for Home Use in
          the UK &amp; EU. The Meo AI service interprets your readings in plain
          language and surfaces patterns. Neither the Hardware nor the AI
          service is a medical device for the purpose of diagnosis, treatment,
          cure, or prevention of disease. You should always consult a qualified
          healthcare professional for medical advice.
        </p>
      </section>

      <section>
        <LegalH2>4. Payment + delivery</LegalH2>
        <p>
          Payment is taken at checkout via Stripe. Orders ship within 72 hours
          within the UK and EU; 2&ndash;5 business days delivery typical.
          Shipping is £9.99.
        </p>
      </section>

      <section id="refund">
        <LegalH2 id="refund-heading">5. Refunds &amp; statutory rights</LegalH2>
        <p>
          Two refund regimes apply, depending on when you decide to return.
          Both are available to every UK customer; nothing on the marketing
          site overrides them.
        </p>
        <LegalH3>Days 1–14 — your statutory right</LegalH3>
        <p>
          Under the Consumer Contracts (Information, Cancellation and
          Additional Charges) Regulations 2013, you may cancel your order for
          any reason within 14 days of receiving the Hardware and receive a{' '}
          <strong>
            full refund of every amount you paid us, including the standard
            outbound delivery charge
          </strong>
          . You bear the cost of returning the Hardware to us unless the
          product is faulty or not as described, in which case we cover the
          return.
        </p>
        <LegalH3>Days 15–30 — our voluntary guarantee</LegalH3>
        <p>
          Beyond the 14-day statutory window and within 30 days of receipt, we
          offer a voluntary refund <strong>on the device only</strong> — the
          price you paid for the Hardware, refunded in full, no questions
          asked. Outbound and return delivery are not refunded under this
          voluntary guarantee unless the product is faulty.
        </p>
        <LegalH3>How to start a return</LegalH3>
        <p>
          Email{' '}
          <a href="mailto:hello@meterbolic.com" className="underline">
            hello@meterbolic.com
          </a>{' '}
          with your order number. We acknowledge within one working day and
          issue the refund within 14 days of receiving the returned Hardware.
          The eBook is yours to keep in either case. The Subscription is
          refunded pro-rata if cancelled within 14 days and not refunded
          thereafter (cancel any time to stop future renewals — see section 6).
        </p>
      </section>

      <section>
        <LegalH2>6. Subscription auto-renewal</LegalH2>
        <p>
          Your 6-month Meo AI subscription auto-renews at the then-current
          monthly rate unless you cancel before renewal. We will email you at
          least 7 days before each renewal. You can cancel any time from your
          account settings or by emailing us, with effect from the end of your
          then-current billing period.
        </p>
      </section>

      <section>
        <LegalH2>7. Acceptable use of Meo AI</LegalH2>
        <p>
          You agree not to: try to extract or reverse-engineer the underlying
          model; share your Meo account credentials; use the service to harm
          yourself or others; or use it for clinical decisions on third
          parties.
        </p>
      </section>

      <section>
        <LegalH2>8. Liability</LegalH2>
        <p>
          We do not exclude liability for death or personal injury caused by
          our negligence, fraud, or anything else that cannot be excluded under
          English law. Otherwise, our liability arising from or related to the
          products and services is capped at the total amount you paid in the
          12 months preceding the event giving rise to the claim. We are not
          liable for indirect or consequential losses.
        </p>
      </section>

      <section>
        <LegalH2>9. Changes</LegalH2>
        <p>
          We may update these terms from time to time. The current version
          applies to your most recent order; older orders remain governed by
          the version in force at the time of purchase.
        </p>
      </section>

      <section>
        <LegalH2>10. Contact</LegalH2>
        <p>
          Metabolic Health Ltd ·{' '}
          <a href="mailto:hello@meterbolic.com" className="underline">
            hello@meterbolic.com
          </a>
        </p>
      </section>
    </LegalPageShell>
  );
}
