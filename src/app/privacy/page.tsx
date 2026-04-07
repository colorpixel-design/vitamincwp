import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — VitaminC India",
  description:
    "VitaminC India privacy policy — what data we collect, how we use it, and how to contact us.",
};

const sections = [
  {
    heading: "Information We Collect",
    content: [
      "**Email addresses** — only if you subscribe to our newsletter. We do not share your email with any third parties.",
      "**Usage data** — anonymized analytics (pages visited, time on page) via privacy-first tools. No personally identifiable information is stored.",
      "**Cookies** — we use minimal functional cookies for site performance. No advertising or tracking cookies.",
    ],
  },
  {
    heading: "How We Use Your Information",
    content: [
      "Newsletter emails are used exclusively to send our science digest and product updates. You may unsubscribe at any time.",
      "Aggregated, anonymized analytics help us understand which content is useful so we can improve it.",
      "We never sell, share, or monetize your personal data.",
    ],
  },
  {
    heading: "Affiliate Links",
    content: [
      "Some product links on this site are affiliate links. If you click through and make a purchase, we may earn a small commission at no extra cost to you.",
      "Affiliate relationships never influence our editorial scores, rankings, or recommendations. Our impartiality is non-negotiable.",
      "Affiliate partners are not informed of affiliate-link click data in individually identifiable form.",
    ],
  },
  {
    heading: "Third-Party Services",
    content: [
      "We use Google Fonts (loaded from Google's CDN) for typography. Google's privacy policy applies to these requests.",
      "Our hosting provider may collect server logs (IP addresses, request timestamps) for security and performance monitoring.",
      "We do not use Facebook Pixel, Google Ads tracking, or any other advertising SDKs.",
    ],
  },
  {
    heading: "Your Rights",
    content: [
      "You have the right to request deletion of any personal data we hold about you.",
      "You may unsubscribe from our newsletter at any time via the unsubscribe link in every email.",
      "For any data-related requests, email us at privacy@vitamincIndia.com.",
    ],
  },
  {
    heading: "Changes to This Policy",
    content: [
      "We may update this policy as our practices evolve. Material changes will be announced via our newsletter.",
      "Continued use of the site after changes constitutes acceptance of the updated policy.",
      "This policy was last updated: April 2026.",
    ],
  },
];

function parseMarkdown(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i} className="text-white font-semibold">{part.slice(2, -2)}</strong>;
    }
    return <span key={i}>{part}</span>;
  });
}

export default function PrivacyPage() {
  return (
    <div className="pt-24 pb-20 min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-12">
          <p className="text-orange-400 text-sm font-semibold uppercase tracking-wider mb-2">Legal</p>
          <h1 className="text-4xl font-black text-white mb-4">Privacy Policy</h1>
          <p className="text-gray-400 text-sm">
            We believe in radical transparency. This policy is written in plain English — not legalese.
          </p>
        </div>

        {/* Summary box */}
        <div className="glass rounded-2xl p-6 mb-10 border border-green-500/20">
          <p className="text-sm font-semibold text-green-400 mb-2">TL;DR Summary</p>
          <ul className="space-y-1.5 text-sm text-gray-300">
            <li>✅ We only collect your email (if you sub to our newsletter).</li>
            <li>✅ We never sell your data.</li>
            <li>✅ No advertising trackers or Facebook Pixel.</li>
            <li>✅ Affiliate links exist but never affect our rankings.</li>
            <li>✅ You can unsubscribe or delete your data anytime.</li>
          </ul>
        </div>

        {/* Sections */}
        <div className="space-y-10">
          {sections.map((section, i) => (
            <div key={i}>
              <h2 className="text-lg font-black text-white mb-4">{section.heading}</h2>
              <ul className="space-y-3">
                {section.content.map((item, j) => (
                  <li key={j} className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-orange-400 flex-shrink-0 mt-2" />
                    <p className="text-sm text-gray-400 leading-relaxed">
                      {parseMarkdown(item)}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 pt-8 border-t border-white/8 text-xs text-gray-600">
          VitaminC India · privacy@vitamincindia.com · Last updated April 2026
        </div>

      </div>
    </div>
  );
}
