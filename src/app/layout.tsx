import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
