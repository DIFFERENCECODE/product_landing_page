import type { Metadata } from "next";
import { Geist, Geist_Mono, Fraunces, Inter } from "next/font/google";
import "./globals.css";

// Body sans — Inter is the modern, neutral, warm default. Pairs well
// with Fraunces and renders consistently across platforms.
const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

// Display serif — Fraunces is a variable font with actual editorial
// character; used by premium wellness brands (Athletic Greens, Levels,
// etc.) for display headlines. Replaces the plain Georgia fallback.
//
// `axes` on a Google variable font requires the `weight` to be omitted
// (next/font rejects specifying both). The variable weight covers the
// whole 100-900 range, so globals.css can set font-weight freely.
const fraunces = Fraunces({
  variable: "--font-serif",
  subsets: ["latin"],
  display: "swap",
  axes: ["opsz", "SOFT"],
});

// Keep Geist as a secondary fallback and Geist Mono for any numeric/
// monospaced runs we may add later (e.g. in the Numbers-vs-Insights
// table).
const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Meo — Metabolic Intelligence System",
  description:
    "See what your cholesterol is actually telling you. Meo turns a 3-minute finger-prick into a complete metabolic picture — interpreted by AI, framed for longevity, and actionable the same day.",
  openGraph: {
    title: "Meo — Metabolic Intelligence System",
    description:
      "Digital lipid meter + Meo AI + eBook. At-home lipid tracking with AI interpretation. 30-day money-back.",
    type: "website",
    siteName: "Meo",
  },
  twitter: {
    card: "summary_large_image",
    title: "Meo — Metabolic Intelligence System",
    description: "Your cholesterol, read back to you. 3 minutes, at home, interpreted by Meo AI.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${fraunces.variable} ${geist.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
