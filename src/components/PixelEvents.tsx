'use client';

import { useEffect } from 'react';

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

/**
 * Document-level click delegation that fires Meta Pixel's
 * InitiateCheckout whenever a user clicks any anchor whose href
 * starts with /checkout. One mount in the root layout covers every
 * "Get Meo" / "Buy" / sticky-CTA / nav link on the site without
 * needing per-button wiring.
 */
export function PixelEvents() {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const anchor = target.closest('a') as HTMLAnchorElement | null;
      if (!anchor) return;
      const href = anchor.getAttribute('href') ?? '';
      if (!href.startsWith('/checkout')) return;
      try {
        window.fbq?.('track', 'InitiateCheckout', {
          content_name: 'Get Meo',
          value: 149,
          currency: 'GBP',
        });
      } catch {
        /* never block navigation */
      }
    };
    document.addEventListener('click', handler, { capture: true });
    return () => document.removeEventListener('click', handler, { capture: true });
  }, []);
  return null;
}
