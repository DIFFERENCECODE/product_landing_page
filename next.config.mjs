/** @type {import("next").NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [],
  },

  // No auth redirects — this is a public storefront only.
  //
  // Cache headers: Next.js prerendered pages default to
  // `Cache-Control: s-maxage=31536000` (1 year on shared caches),
  // which causes stale HTML in browsers after a deploy. Force the
  // HTML routes to revalidate on every request and let Next.js's
  // ISR/SSG keep the response time fast — but the *browser* always
  // checks for the latest etag.
  async headers() {
    return [
      {
        source: '/:path((?!_next|api).*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, must-revalidate',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
