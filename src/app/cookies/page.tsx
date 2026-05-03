import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Cookies Policy — Meo by Meterbolic",
  description: "How Meterbolic Ltd uses cookies on shop.meterbolic.com.",
  robots: { index: true, follow: true },
};

export default function CookiesPage() {
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

        <h1 className="font-bold mb-2">Cookies Policy</h1>
        <p className="text-sm mb-10" style={{ color: "rgba(255,255,255,0.62)" }}>
          Last updated: 14 November 2025
        </p>

        <div className="space-y-8 leading-relaxed">
          <section>
            <h2 className="font-semibold mb-3">1. What are cookies</h2>
            <p>
              Cookies are small text files stored on your device when you visit
              websites. They help websites remember information about your visit,
              making your next visit easier and the site more useful to you.
            </p>
          </section>

          <section>
            <h2 className="font-semibold mb-3">2. How we use cookies</h2>
            <p className="mb-3">We use cookies for the following purposes:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Essential cookies</strong> — necessary for the website
                to function correctly (e.g. maintaining your checkout session
                via Stripe).
              </li>
              <li>
                <strong>Performance cookies</strong> — help us understand how
                visitors use our site so we can improve it (aggregate,
                anonymised counts only).
              </li>
              <li>
                <strong>Functional cookies</strong> — remember your preferences
                to give you a better experience on return visits.
              </li>
              <li>
                <strong>Marketing cookies</strong> — used to measure the
                effectiveness of our marketing campaigns where applicable.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-semibold mb-3">3. Types of cookies we use</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Session cookies</strong> — expire when you close your
                browser. Used during the Stripe checkout flow.
              </li>
              <li>
                <strong>Persistent cookies</strong> — remain on your device
                until deleted or they expire. Used for de-duplicated visit
                counting by our analytics provider.
              </li>
              <li>
                <strong>First-party cookies</strong> — set directly by
                shop.meterbolic.com.
              </li>
              <li>
                <strong>Third-party cookies</strong> — set by our service
                providers (see below).
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-semibold mb-3">4. Third-party services</h2>
            <p className="mb-3">
              The following third-party services may set cookies when you use
              our site:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Stripe</strong> — payment processing. See{" "}
                <a
                  href="https://stripe.com/privacy"
                  className="underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  stripe.com/privacy
                </a>
                .
              </li>
              <li>
                <strong>Analytics provider</strong> — privacy-respecting
                aggregate page-view counting. No cross-site tracking, no
                personal profiles built.
              </li>
            </ul>
            <p className="mt-3">
              We do <strong>not</strong> use Google Analytics, Facebook Pixel,
              or any other advertising-network tracking cookies on this site.
            </p>
          </section>

          <section>
            <h2 className="font-semibold mb-3">5. Managing cookies</h2>
            <p className="mb-3">
              You can control and delete cookies through your browser settings.
              Most browsers allow you to:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>View and delete existing cookies</li>
              <li>Block cookies from specific sites</li>
              <li>Block all third-party cookies</li>
              <li>Set notifications when a cookie is set</li>
            </ul>
            <p className="mt-3">
              Please note that disabling essential cookies will affect the
              checkout functionality of this site.
            </p>
          </section>

          <section>
            <h2 className="font-semibold mb-3">6. Changes to this policy</h2>
            <p>
              We may update this policy as our use of cookies changes. We will
              notify you of significant changes by posting the new policy here
              with a revised date.
            </p>
          </section>

          <section>
            <h2 className="font-semibold mb-3">7. Contact us</h2>
            <p>
              For questions about our use of cookies, contact us at{" "}
              <a href="mailto:privacy@meterbolic.com" className="underline">
                privacy@meterbolic.com
              </a>
              .
            </p>
          </section>
        </div>

        <div className="mt-10 flex gap-6 text-sm" style={{ color: "rgba(255,255,255,0.62)" }}>
          <Link href="/privacy" className="hover:underline">Privacy Policy</Link>
          <Link href="/terms" className="hover:underline">Terms of Service</Link>
        </div>

        <p className="mt-6 text-xs" style={{ color: "rgba(255,255,255,0.45)" }}>
          © 2026 Meterbolic Ltd. All rights reserved.
        </p>
      </div>
    </main>
  );
}
