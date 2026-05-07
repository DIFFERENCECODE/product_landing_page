import type { MetadataRoute } from 'next';

const BASE = process.env.NEXT_PUBLIC_BASE_URL || 'https://shop.meterbolic.com';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/checkout/success', // session_id query param, no SEO value
          '/admin',            // admin shell — gated client-side, never indexable
          '/admin/',
          '/auth-callback',    // post-auth landing, no SEO value
          '/chat',              // chatbot UI — needs sign-in, not crawl-friendly
          '/profile',
          '/personalize',
          '/activity',
        ],
      },
    ],
    sitemap: `${BASE}/sitemap.xml`,
    host: BASE,
  };
}
