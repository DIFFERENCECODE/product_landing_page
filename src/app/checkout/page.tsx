"use client";

// ═══════════════════════════════════════════════════════════════
//  /checkout/page.tsx
//  ─────────────────────────────────────────────────────────────
//  PASTE YOUR EXISTING CODE HERE.
//
//  Requirements to verify after pasting:
//  ✓  Page title / H1: "Complete your order" (60px via h1 class)
//  ✓  Subtitle: "Pay with card. We'll automatically add you to
//     the MeO AI waitlist — you'll be first to know when your
//     account is ready."  (NOT "create your MeO account")
//  ✓  Section 3 copy: "Your email and shipping address will be
//     collected securely on the next step (Stripe Checkout).
//     We'll send your receipt there and add you to the waitlist."
//     (NOT "create your MeO account")
//  ✓  Base kit always included at £197, cannot be removed.
//  ✓  Add-ons with quantity controls (0–9), prices from kitProducts.ts.
//  ✓  Order summary sidebar updates live as quantities change.
//  ✓  "Pay £xxx →" button calls POST /api/kit-checkout and
//     redirects to the returned checkout URL.
//  ✓  Nav: cart icon only at top, no sign-in.
//  ✓  No redirect to /sign-in anywhere in this file.
// ═══════════════════════════════════════════════════════════════

import Link from "next/link";
import { ShoppingCart, ArrowLeft, Minus, Plus } from "lucide-react";
import { useState, useTransition } from "react";
import { KIT_PRODUCTS, type AddonProduct } from "@/lib/kitProducts";

// ─── Shared brand droplet (matches MarketingLandingPage exactly) ─────
function DropletIcon({ size = 20 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="#a4d65e"
      style={{ display: "inline-block" }}
    >
      <path d="M12 2C12 2 5 10 5 15C5 19.4183 8.13401 23 12 23C15.866 23 19 19.4183 19 15C19 10 12 2 12 2Z" />
    </svg>
  );
}

export default function CheckoutPage() {
  const [quantities, setQuantities] = useState<Record<string, number>>(
    Object.fromEntries(KIT_PRODUCTS.addons.map((a) => [a.id, 0]))
  );
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const addonsTotal = KIT_PRODUCTS.addons.reduce(
    (sum, addon) => sum + addon.price * (quantities[addon.id] ?? 0),
    0
  );
  const total = KIT_PRODUCTS.baseKit.price + addonsTotal;

  function setQty(id: string, delta: number) {
    setQuantities((prev) => ({
      ...prev,
      [id]: Math.max(0, Math.min(9, (prev[id] ?? 0) + delta)),
    }));
  }

  function handleCheckout() {
    startTransition(async () => {
      setError(null);
      try {
        const addons = KIT_PRODUCTS.addons
          .filter((a) => (quantities[a.id] ?? 0) > 0)
          .map((a) => ({ priceId: a.priceId, quantity: quantities[a.id] }));

        const res = await fetch("/api/kit-checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ addons }),
        });

        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error((data as { error?: string }).error ?? "Checkout failed. Please try again.");
        }

        const { url } = (await res.json()) as { url: string };
        window.location.href = url;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Checkout failed.");
      }
    });
  }

  return (
    <div className="min-h-screen bg-[var(--bg)] text-white">
      {/* Nav — identical to landing page */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4"
        style={{
          background: "rgba(28,74,64,0.92)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid rgba(255,255,255,0.10)",
        }}
      >
        <Link href="/" className="flex items-center gap-1.5">
          <span className="text-xl font-bold text-white">Me</span>
          <DropletIcon size={20} />
        </Link>
        <Link
          href="/checkout"
          aria-label="Go to checkout"
          className="flex items-center justify-center p-2.5 rounded-xl transition-opacity hover:opacity-90"
          style={{ background: "#a4d65e", color: "#1a3a2a" }}
        >
          <ShoppingCart className="h-5 w-5" />
        </Link>
      </nav>

      <div className="max-w-6xl mx-auto px-5 sm:px-6 pt-20 sm:pt-24 pb-10">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-[var(--muted)] text-sm mb-6 sm:mb-8 hover:text-white transition-colors"
        >
          <ArrowLeft size={14} /> Back
        </Link>

        <h1 className="mb-3">Complete your order</h1>
        <p className="text-[var(--muted)] mb-8 sm:mb-10 max-w-2xl">
          Pay with card. We&apos;ll automatically add you to the MeO AI waitlist
          — you&apos;ll be first to know when your account is ready.
        </p>

        <div className="grid lg:grid-cols-[1fr_minmax(280px,340px)] gap-6 sm:gap-8 items-start">
          {/* ── Left column ── */}
          <div className="space-y-6">
            {/* Section 1 — Your kit */}
            <div className="card">
              <div className="flex justify-between items-center mb-4">
                <h3>1. Your kit</h3>
                <span className="text-xs font-semibold border border-[var(--accent)] text-[var(--accent)] rounded px-2 py-0.5">
                  Included
                </span>
              </div>
              <div className="rounded-xl bg-[var(--bg)] border border-[var(--border)] p-4 flex justify-between items-start">
                <div>
                  <h4>{KIT_PRODUCTS.baseKit.name}</h4>
                  <p className="text-[var(--muted)] text-sm mt-1">
                    {KIT_PRODUCTS.baseKit.description}
                  </p>
                </div>
                <span className="font-bold ml-4">
                  £{KIT_PRODUCTS.baseKit.price}
                </span>
              </div>
            </div>

            {/* Section 2 — Add-ons */}
            <div className="card">
              <div className="flex justify-between items-center mb-4">
                <h3>2. Optional add-ons</h3>
                <span className="text-[var(--muted)] text-sm">Up to 9 each</span>
              </div>
              <div className="space-y-4">
                {KIT_PRODUCTS.addons.map((addon: AddonProduct) => (
                  <AddonRow
                    key={addon.id}
                    addon={addon}
                    qty={quantities[addon.id] ?? 0}
                    onDecrement={() => setQty(addon.id, -1)}
                    onIncrement={() => setQty(addon.id, +1)}
                  />
                ))}
              </div>
            </div>

            {/* Section 3 — Contact & shipping */}
            <div className="card">
              <h3 className="mb-2">3. Contact &amp; shipping</h3>
              <p className="text-[var(--muted)] text-sm">
                Your email and shipping address will be collected securely on
                the next step (Stripe Checkout). We&apos;ll send your receipt
                there and automatically add you to the MeO AI waitlist.
              </p>
            </div>

            {/* Section 4 — Payment */}
            <div className="card">
              <h3 className="mb-2">4. Payment</h3>
              <p className="text-[var(--muted)] text-sm mb-4">
                You&apos;ll be taken to a secure Stripe Checkout page to
                complete payment.
              </p>
              {error && (
                <p className="text-red-400 text-sm mb-4">{error}</p>
              )}
              <button
                onClick={handleCheckout}
                disabled={isPending}
                className="btn-primary w-full text-lg py-4 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isPending ? "Redirecting…" : `Pay £${total} →`}
              </button>
            </div>
          </div>

          {/* ── Right column — Order summary ──
              All flex rows below use `min-w-0` on the left child + `shrink-0`
              on the right child so long item names ("Meo Test Strip
              Subscription") wrap inside the 280-340px column instead of
              overflowing and clipping the price. */}
          <aside className="card lg:sticky lg:top-6 w-full overflow-hidden">
            <h3 className="mb-4">Order summary</h3>
            <div className="flex justify-between gap-3 mb-2">
              <div className="min-w-0">
                <p className="font-semibold text-sm break-words">{KIT_PRODUCTS.baseKit.name}</p>
                <p className="text-[var(--muted)] text-xs">Complete bundle</p>
              </div>
              <span className="font-semibold shrink-0">£{KIT_PRODUCTS.baseKit.price}</span>
            </div>
            {KIT_PRODUCTS.addons
              .filter((a: AddonProduct) => (quantities[a.id] ?? 0) > 0)
              .map((a: AddonProduct) => (
                <div key={a.id} className="flex justify-between gap-3 mt-1 text-sm">
                  <span className="text-[var(--muted)] min-w-0 break-words">
                    {a.name} × {quantities[a.id]}
                  </span>
                  <span className="shrink-0">£{a.price * (quantities[a.id] ?? 0)}</span>
                </div>
              ))}
            <div className="border-t border-[var(--border)] mt-4 pt-4 space-y-1 text-sm">
              <div className="flex justify-between gap-3 text-[var(--muted)]">
                <span>Subtotal</span>
                <span className="shrink-0">£{total}</span>
              </div>
              <div className="flex justify-between gap-3 text-[var(--muted)]">
                <span>Shipping</span>
                <span className="text-[var(--accent)] shrink-0">Free</span>
              </div>
            </div>
            <div className="flex justify-between gap-3 mt-4 font-bold text-lg">
              <span>Total</span>
              <span className="shrink-0">£{total}</span>
            </div>
            <p className="text-[var(--muted)] text-xs mt-4 text-center">
              ✓ Free UK shipping · Secured by Stripe
            </p>
          </aside>
        </div>
      </div>
    </div>
  );
}

function AddonRow({
  addon,
  qty,
  onDecrement,
  onIncrement,
}: {
  addon: AddonProduct;
  qty: number;
  onDecrement: () => void;
  onIncrement: () => void;
}) {
  // On mobile the name + description + qty controls would collide
  // horizontally, so stack: name+description full width, then a row
  // below with price and the qty stepper. Desktop keeps the inline layout.
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 py-3 sm:py-2 border-b border-[var(--border)] last:border-0">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <h4 className="font-semibold">{addon.name}</h4>
          {addon.recommended && (
            <span className="text-xs font-semibold border border-[var(--accent)] text-[var(--accent)] rounded px-1.5 py-0.5">
              Recommended
            </span>
          )}
        </div>
        <p className="text-[var(--muted)] text-xs mt-0.5 line-clamp-2 sm:truncate">
          {addon.description}
        </p>
      </div>
      <div className="flex items-center justify-between sm:justify-end gap-3 flex-shrink-0">
        <span className="font-semibold text-sm">£{addon.price}</span>
        <div className="flex items-center gap-3">
          <button
            onClick={onDecrement}
            disabled={qty === 0}
            aria-label={`Decrease ${addon.name} quantity`}
            className="w-9 h-9 sm:w-7 sm:h-7 rounded-full bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center disabled:opacity-30 hover:border-white/50 active:scale-95 transition-all"
          >
            <Minus size={14} />
          </button>
          <span className="w-5 text-center text-sm font-semibold">{qty}</span>
          <button
            onClick={onIncrement}
            disabled={qty === 9}
            aria-label={`Increase ${addon.name} quantity`}
            className="w-9 h-9 sm:w-7 sm:h-7 rounded-full bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center disabled:opacity-30 hover:border-white/50 active:scale-95 transition-all"
          >
            <Plus size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
