"use client";

// ═══════════════════════════════════════════════════════════════
//  /checkout/success/page.tsx
//  ─────────────────────────────────────────────────────────────
//  PASTE YOUR EXISTING CODE HERE.
//
//  Requirements to verify after pasting:
//  ✓  Reads ?session_id= from URL query string (useSearchParams).
//  ✓  Calls GET /api/kit-checkout?session_id=xxx to fetch receipt.
//  ✓  On load, auto-submits customer email to POST /api/waitlist
//     with { email, source: "kit-purchase" }.
//  ✓  Shows success state once waitlist call resolves.
//  ✓  Shows manual fallback form (just email field → /api/waitlist)
//     if session email is missing OR the auto-call fails.
//  ✓  Displays: payment status, customer name, amount, currency.
//  ✓  No sign-in links. No "create account" language.
// ═══════════════════════════════════════════════════════════════

import { Suspense, useEffect, useState, type FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle, Loader2 } from "lucide-react";

// ── Types ────────────────────────────────────────────────────────

type SessionData = {
  paymentStatus: string;
  customerEmail: string | null;
  customerName: string | null;
  amountTotal: number;
  currency: string;
};

type WaitlistState = "idle" | "submitting" | "success" | "error";

// ── Page wrapper (Suspense required for useSearchParams) ─────────

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <SuccessContent />
    </Suspense>
  );
}

// ── Main content ────────────────────────────────────────────────

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  const [session, setSession] = useState<SessionData | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [waitlistState, setWaitlistState] = useState<WaitlistState>("idle");
  const [fallbackEmail, setFallbackEmail] = useState("");
  const [fallbackError, setFallbackError] = useState<string | null>(null);

  // 1. Fetch session data
  useEffect(() => {
    if (!sessionId) {
      setLoadError("No session ID found. Please contact support.");
      return;
    }

    fetch(`/api/kit-checkout?session_id=${encodeURIComponent(sessionId)}`)
      .then((r) => r.json())
      .then((data: SessionData & { error?: string }) => {
        if (data.error) throw new Error(data.error);
        setSession(data);
      })
      .catch((err: unknown) => {
        setLoadError(
          err instanceof Error ? err.message : "Could not load order details."
        );
      });
  }, [sessionId]);

  // 2. Auto-submit waitlist once email is known
  useEffect(() => {
    if (!session?.customerEmail) return;
    setWaitlistState("submitting");

    fetch("/api/waitlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: session.customerEmail,
        source: "kit-purchase",
      }),
    })
      .then((r) => r.json())
      .then((data: { success?: boolean }) => {
        if (data.success) {
          setWaitlistState("success");
        } else {
          setWaitlistState("error");
        }
      })
      .catch(() => setWaitlistState("error"));
  }, [session?.customerEmail]);

  // ── Render: loading ──
  if (!session && !loadError) return <LoadingScreen />;

  // ── Render: error ──
  if (loadError) {
    return (
      <PageShell>
        <div className="card max-w-md mx-auto text-center">
          <p className="text-red-400 mb-4">{loadError}</p>
          <Link href="/checkout" className="btn-primary">
            Return to checkout
          </Link>
        </div>
      </PageShell>
    );
  }

  const amountFormatted = session
    ? new Intl.NumberFormat("en-GB", {
        style: "currency",
        currency: session.currency.toUpperCase(),
      }).format(session.amountTotal / 100)
    : "";

  return (
    <PageShell>
      <div className="max-w-2xl mx-auto space-y-6">
        {/* ── Receipt card ── */}
        <div className="card text-center">
          <CheckCircle
            size={48}
            className="mx-auto mb-4 text-[var(--accent)]"
          />
          <h1 className="text-3xl mb-2">Order confirmed!</h1>
          <p className="text-[var(--muted)] mb-6">
            Thank you{session?.customerName ? `, ${session.customerName}` : ""}
            . Your Metabolic Health Kit is on its way.
          </p>

          <div className="rounded-xl bg-[var(--bg)] border border-[var(--border)] p-4 text-left space-y-2 mb-6">
            <Row label="Status" value={session?.paymentStatus === "paid" ? "✓ Paid" : session?.paymentStatus ?? "—"} />
            {session?.customerEmail && (
              <Row label="Email" value={session.customerEmail} />
            )}
            <Row label="Total" value={amountFormatted} />
          </div>

          {/* Waitlist auto-enrol status */}
          {waitlistState === "submitting" && (
            <p className="text-[var(--muted)] text-sm flex items-center justify-center gap-2">
              <Loader2 size={14} className="animate-spin" />
              Adding you to the MeO AI waitlist…
            </p>
          )}
          {waitlistState === "success" && (
            <p className="text-[var(--accent)] text-sm">
              ✓ You&apos;re on the MeO AI waitlist — we&apos;ll be in touch when
              your account is ready.
            </p>
          )}
          {(waitlistState === "error" || !session?.customerEmail) && (
            <WaitlistFallback
              fallbackEmail={fallbackEmail}
              setFallbackEmail={setFallbackEmail}
              fallbackError={fallbackError}
              setFallbackError={setFallbackError}
              setWaitlistState={setWaitlistState}
              waitlistState={waitlistState}
            />
          )}
        </div>

        <p className="text-center text-[var(--muted)] text-sm">
          Questions? Email{" "}
          <a
            href="mailto:hello@meterbolic.com"
            className="underline hover:text-white transition-colors"
          >
            hello@meterbolic.com
          </a>
        </p>
      </div>
    </PageShell>
  );
}

// ── Waitlist fallback form ───────────────────────────────────────

function WaitlistFallback({
  fallbackEmail,
  setFallbackEmail,
  fallbackError,
  setFallbackError,
  setWaitlistState,
  waitlistState,
}: {
  fallbackEmail: string;
  setFallbackEmail: (v: string) => void;
  fallbackError: string | null;
  setFallbackError: (v: string | null) => void;
  setWaitlistState: (s: WaitlistState) => void;
  waitlistState: WaitlistState;
}) {
  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setFallbackError(null);
    setWaitlistState("submitting");

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: fallbackEmail, source: "kit-purchase-fallback" }),
      });
      const data = (await res.json()) as { success?: boolean; error?: string };
      if (data.success) {
        setWaitlistState("success");
      } else {
        setFallbackError(data.error ?? "Something went wrong, please try again.");
        setWaitlistState("error");
      }
    } catch {
      setFallbackError("Network error. Please try again.");
      setWaitlistState("error");
    }
  }

  if (waitlistState === "success") return null;

  return (
    <form onSubmit={handleSubmit} className="mt-4 text-left space-y-3">
      <p className="text-[var(--muted)] text-sm">
        Enter your email to join the MeO AI waitlist:
      </p>
      <div className="flex gap-2">
        <input
          type="email"
          required
          placeholder="you@example.com"
          value={fallbackEmail}
          onChange={(e) => setFallbackEmail(e.target.value)}
          className="flex-1 rounded-xl bg-[var(--bg)] border border-[var(--border)] px-4 py-2 text-sm text-white placeholder:text-[var(--muted)] focus:outline-none focus:border-[var(--accent)]"
        />
        <button
          type="submit"
          disabled={waitlistState === "submitting"}
          className="btn-primary text-sm px-4 py-2 disabled:opacity-60"
        >
          {waitlistState === "submitting" ? "…" : "Join"}
        </button>
      </div>
      {fallbackError && (
        <p className="text-red-400 text-xs">{fallbackError}</p>
      )}
    </form>
  );
}

// ── Shared layout helpers ────────────────────────────────────────

function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[var(--bg)] text-white">
      <nav className="flex items-center px-6 py-4 border-b border-[var(--border)]">
        <Link href="/" className="flex items-center gap-1 text-lg font-semibold">
          Me{" "}
          <span role="img" aria-label="droplet">
            💧
          </span>
        </Link>
      </nav>
      <div className="max-w-4xl mx-auto px-6 py-16">{children}</div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-[var(--muted)]">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}

function LoadingScreen() {
  return (
    <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center">
      <Loader2 size={32} className="animate-spin text-[var(--accent)]" />
    </div>
  );
}
