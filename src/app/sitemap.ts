import type { MetadataRoute } from 'next';

const BASE = process.env.NEXT_PUBLIC_BASE_URL || 'https://shop.meterbolic.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  // Public, indexable routes only. /admin, /chat, /auth-callback,
  // /profile, /personalize, /activity, /checkout/success are
  // disallowed in robots.ts and intentionally absent here.
  const routes: Array<{ path: string; freq: MetadataRoute.Sitemap[number]['changeFrequency']; priority: number }> = [
    { path: '/',                freq: 'weekly',  priority: 1.0 },
    { path: '/about',           freq: 'monthly', priority: 0.7 },
    { path: '/how-it-works',    freq: 'monthly', priority: 0.7 },
    { path: '/services',        freq: 'monthly', priority: 0.6 },
    { path: '/partners',        freq: 'monthly', priority: 0.6 },
    { path: '/quiz',            freq: 'monthly', priority: 0.6 },
    { path: '/pricing',         freq: 'monthly', priority: 0.7 },
    { path: '/checkout',        freq: 'monthly', priority: 0.7 },
    { path: '/privacy',         freq: 'yearly',  priority: 0.3 },
    { path: '/terms',           freq: 'yearly',  priority: 0.3 },
    { path: '/cookies',         freq: 'yearly',  priority: 0.3 },
  ];
  return routes.map((r) => ({
    url: `${BASE}${r.path}`,
    lastModified: now,
    changeFrequency: r.freq,
    priority: r.priority,
  }));
}
