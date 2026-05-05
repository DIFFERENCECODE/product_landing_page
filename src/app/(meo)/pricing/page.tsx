'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTheme } from '@/theme/ThemeProvider';
import { AppShell } from '@/components/meo/layout/AppShell';
import { getIdToken } from '@/lib/meo-app/auth';
import { Check } from 'lucide-react';

interface Plan {
  id: string;
  name: string;
  price: number;
  features: string[];
  cta: string;
  popular?: boolean;
}

// Plans mirror the master product page's TiersSection so /pricing
// inside the chatbot shell shows the same Meo Lite / Starter / Coached
// bundles the marketing site sells. One-time purchases, not
// subscriptions — the legacy meo-frontend Free/Pro/Clinic SaaS plans
// have been retired in favour of the unified product offering.
const PLANS: Plan[] = [
  {
    id: 'lite',
    name: 'Meo Lite',
    price: 29,
    features: [
      'The Thin Book of Fat (digital)',
      '7-day Meo AI trial',
      'Manual entry of past blood results',
      'Credit £29 toward Starter within 30 days',
    ],
    cta: 'Start with the book',
  },
  {
    id: 'starter',
    name: 'Meo Starter',
    price: 149,
    features: [
      'Lab-grade lipid meter (UK & EU registered)',
      '6 months of Meo AI included',
      '20 test strips + lancets + carry case',
      'Biological Age Score + Target Score',
      '30-day money-back guarantee on the device',
    ],
    cta: 'Get Meo · £149',
    popular: true,
  },
  {
    id: 'coached',
    name: 'Meo Coached',
    price: 444,
    features: [
      'Everything in Meo Starter',
      '3 months of 1:1 metabolic coaching with Spencer Martin',
      '40-min onboarding consultation',
      'Two 30-min follow-ups',
      'Direct messaging between sessions',
    ],
    cta: 'Get Meo + Coach',
  },
];

export default function PricingPage() {
  const { colors } = useTheme();
  const [currentPlan, setCurrentPlan] = useState<string>('free');
  const [loading, setLoading] = useState<string | null>(null);

  useEffect(() => {
    const token = getIdToken();
    if (!token) return;

    fetch('/api/stripe/status', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.ok ? r.json() : null)
      .then((data) => {
        if (data?.plan && data.status === 'active') {
          setCurrentPlan(data.plan);
        }
      })
      .catch(() => {});
  }, []);

  const handleSubscribe = async (planId: string) => {
    const token = getIdToken();
    if (!token) {
      window.location.href = '/';
      return;
    }

    setLoading(planId);
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ planId }),
      });

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || 'Failed to create checkout session');
      }
    } catch {
      alert('Failed to connect to payment service');
    } finally {
      setLoading(null);
    }
  };

  const handleManage = async () => {
    const token = getIdToken();
    if (!token) return;

    setLoading('manage');
    try {
      const res = await fetch('/api/stripe/portal', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      alert('Failed to open billing portal');
    } finally {
      setLoading(null);
    }
  };

  return (
    <AppShell>
      <div className="flex-1 p-6 overflow-auto" style={{ background: colors.background }}>
        <div className="max-w-5xl mx-auto">
          <Link href="/" className="inline-block mb-6 text-sm underline" style={{ color: colors.primary }}>
            &larr; Back to MeO
          </Link>

          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold mb-3" style={{ color: colors.foreground }}>
              Pick your starting point
            </h1>
            <p className="text-base" style={{ color: colors.muted }}>
              Three ways in. Same destination.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PLANS.map((plan) => {
              // One-time purchase model: every plan links straight to
              // the master /checkout with the appropriate plan param.
              // Legacy subscription "current plan" + manage flows are
              // retired (currentPlan state still listens to Stripe
              // status for users who upgraded under the old SaaS
              // model, but no longer drives button rendering).
              const checkoutHref =
                plan.id === 'lite'
                  ? '/checkout?plan=lite'
                  : plan.id === 'coached'
                  ? '/checkout?addon=therapy-spencer'
                  : '/checkout';

              return (
                <div
                  key={plan.id}
                  className="relative rounded-2xl p-8 border flex flex-col"
                  style={{
                    background: colors.card,
                    borderColor: plan.popular ? colors.primary : colors.cardBorder,
                    borderWidth: plan.popular ? 2 : 1,
                  }}
                >
                  {plan.popular && (
                    <div
                      className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold"
                      style={{ background: colors.primary, color: colors.primaryForeground }}
                    >
                      Most Popular
                    </div>
                  )}

                  <h2 className="text-xl font-bold mb-2" style={{ color: colors.foreground }}>
                    {plan.name}
                  </h2>

                  <div className="mb-6">
                    <span className="text-4xl font-bold" style={{ color: colors.foreground }}>
                      £{plan.price}
                    </span>
                    <span className="text-sm" style={{ color: colors.muted }}>
                      {' '}one-time
                    </span>
                  </div>

                  <ul className="space-y-3 mb-8 flex-1">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Check
                          className="h-4 w-4 mt-0.5 shrink-0"
                          style={{ color: colors.primary }}
                        />
                        <span className="text-sm" style={{ color: colors.foreground }}>
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <Link
                    href={checkoutHref}
                    className="w-full rounded-lg py-3 text-sm font-semibold transition-colors text-center inline-flex items-center justify-center"
                    style={{
                      background: plan.popular ? colors.primary : 'transparent',
                      color: plan.popular ? colors.primaryForeground : colors.primary,
                      border: plan.popular ? 'none' : `1px solid ${colors.primary}`,
                    }}
                  >
                    {plan.cta}
                  </Link>
                </div>
              );
            })}
          </div>

          <p className="text-center text-xs mt-8" style={{ color: colors.muted }}>
            All plans include a 14-day free trial. Cancel anytime. Prices in USD.
          </p>
        </div>
      </div>
    </AppShell>
  );
}
