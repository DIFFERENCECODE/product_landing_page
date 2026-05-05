/** @type {import("next").NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // No auth redirects — this is a public storefront only.
  //
  // Cache headers: temporarily set HTML to `no-store` to force-bust
  // every browser that has an old `s-maxage=31536000` HTML cached
  // (Next.js's pre-fix default). Once a few days have passed and
  // every visitor has seen at least one no-store response, switch
  // back to `must-revalidate` for performance.
  //
  // Static assets (/_next/...) and API responses keep their default
  // cache directives — only HTML routes are affected here.
  async headers() {
    return [
      {
        source: '/:path((?!_next|api).*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, must-revalidate',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
