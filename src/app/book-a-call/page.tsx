import Script from "next/script";
import Link from "next/link";

export const metadata = {
  title: "Book a Call",
  description: "Book a consultation with the Meterbolic team.",
};

const CAL_ID = "MMGWabmpinUNSyrmrCQz";

export default function BookACallPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-16">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
          Book a Call
        </h1>
        <p className="mt-2 text-neutral-500">
          Pick a time that works for you and our team will be in touch.
        </p>
      </div>

      <iframe
        src={`https://api.leadconnectorhq.com/widget/booking/${CAL_ID}`}
        id={`${CAL_ID}_booking`}
        title="Book a consultation with Meterbolic"
        scrolling="no"
        className="w-full rounded-2xl"
        style={{ border: "none", overflow: "hidden", minHeight: 700 }}
      />
      <Script
        src="https://link.msgsndr.com/js/form_embed.js"
        strategy="afterInteractive"
      />

      <div className="mt-10 text-center">
        <Link href="/" className="text-sm text-neutral-500 underline hover:text-neutral-800">
          ← Back to home
        </Link>
      </div>
    </main>
  );
}
