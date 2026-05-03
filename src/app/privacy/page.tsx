import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Metabolic Health Ltd collects, uses, and protects your personal information.",
  robots: { index: true, follow: true },
};

// ─────────────────────────────────────────────────────────────────────
// PLACEHOLDER LEGAL TEXT — written for UK GDPR-aligned data handling.
// Have a UK-qualified solicitor review before treating as final. The
// substance is honest about what the site actually does (Stripe
// payments, waitlist email, no third-party tracking unless analytics
// env var is set, etc.) so it's a defensible starting point.
// ─────────────────────────────────────────────────────────────────────

export default function PrivacyPage() {
  return (
    <main
      className="min-h-screen px-5 sm:px-6 py-16 sm:py-24"
      style={{ background: "#1c4a40", color: "#fff" }}
    >
      <div className="max-w-3xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm hover:underline mb-8"
          style={{ color: "rgba(255,255,255,0.62)" }}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Meo
        </Link>

        <h1 className="font-bold mb-2">Privacy Policy</h1>
        <p className="text-sm mb-10" style={{ color: "rgba(255,255,255,0.62)" }}>
          Last updated: 28 April 2026
        </p>

        <div className="space-y-8 leading-relaxed">
          <section>
            <h2 className="font-semibold mb-3">1. Who we are</h2>
            <p>
              Metabolic Health Ltd (&ldquo;we&rdquo;, &ldquo;us&rdquo;) operates shop.meterbolic.com, the
              Meo Metabolic Health Cholesterol Tracker shop. We are the data
              controller for personal information collected through this site.
              Contact: <a href="mailto:hello@meterbolic.com" className="underline">hello@meterbolic.com</a>.
            </p>
          </section>

          <section>
            <h2 className="font-semibold mb-3">2. What we collect</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Order data</strong> — name, billing/shipping address, email,
                phone (collected by Stripe Checkout when you buy). We receive this
                back from Stripe to fulfil your order.
              </li>
              <li>
                <strong>Health &amp; metabolic data</strong> — lipid readings, metabolic
                test results, and health history you choose to log into the Meo AI
                service. This data is used solely to provide your personalised
                Meo AI experience and generate your reports. It is never sold or
                shared with third parties for marketing.
              </li>
              <li>
                <strong>Waitlist / newsletter data</strong> — email address (you submit
                it on the checkout success page or the subscribe form) so we can email
                you when your Meo AI account is ready and send product updates you
                have opted in to receive.
              </li>
              <li>
                <strong>Operational logs</strong> — IP address, user agent, timestamp
                of requests, retained for at most 90 days for security and
                troubleshooting.
              </li>
              <li>
                <strong>Analytics</strong> — aggregate page-view counts via a
                privacy-respecting analytics provider. No cross-site tracking, no
                personal profiles.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-semibold mb-3">3. Why we collect it</h2>
            <p>
              To process and ship your order; to provide your Meo AI subscription;
              to email you order confirmations and product updates; to comply with
              tax and consumer-protection law (e.g. retaining invoice records).
              We do <strong>not</strong> sell your data, and we do not share it
              with marketing partners.
            </p>
          </section>

          <section>
            <h2 className="font-semibold mb-3">4. Who we share it with</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Stripe</strong> (payments) — see{" "}
                <a href="https://stripe.com/privacy" className="underline">
                  stripe.com/privacy
                </a>
                .
              </li>
              <li>
                <strong>AWS</strong> (cloud hosting in the EU/UK).
              </li>
              <li>
                <strong>Shipping carriers</strong> — only the address fields needed
                to deliver your order.
              </li>
              <li>
                <strong>Tax / accounting</strong> — invoice records as required by
                HMRC and equivalent authorities.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-semibold mb-3">5. Your rights (UK GDPR)</h2>
            <p>You can ask us to:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>show you the personal data we hold about you;</li>
              <li>correct anything inaccurate;</li>
              <li>delete it (subject to tax-record retention obligations);</li>
              <li>stop further processing for marketing.</li>
            </ul>
            <p className="mt-3">
              Email{" "}
              <a href="mailto:hello@meterbolic.com" className="underline">
                hello@meterbolic.com
              </a>{" "}
              with your request. We respond within 30 days. If you&rsquo;re unhappy
              with our response you can complain to the UK Information
              Commissioner&apos;s Office at{" "}
              <a href="https://ico.org.uk/concerns/" className="underline">
                ico.org.uk/concerns
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="font-semibold mb-3">6. Cookies</h2>
            <p>
              The shop sets a session cookie during Stripe Checkout (handled by
              Stripe&rsquo;s own scripts) and a small first-party cookie used by
              our analytics provider for de-duplicated visit counting. There are
              no advertising or cross-site tracking cookies.
            </p>
          </section>

          <section>
            <h2 className="font-semibold mb-3">7. Changes to this policy</h2>
            <p>
              We&rsquo;ll post any material updates here with a revised &ldquo;Last
              updated&rdquo; date. Your continued use of the site after changes
              constitutes acceptance.
            </p>
          </section>
        </div>

        <div className="mt-10 flex gap-6 text-sm" style={{ color: "rgba(255,255,255,0.62)" }}>
          <Link href="/terms" className="hover:underline">Terms of Service</Link>
          <Link href="/cookies" className="hover:underline">Cookies Policy</Link>
        </div>

        <p className="mt-6 text-xs" style={{ color: "rgba(255,255,255,0.45)" }}>
          This page is a working policy provided in good faith. For binding
          legal guidance specific to your jurisdiction, consult a qualified
          solicitor.
        </p>
      </div>
    </main>
  );
}
