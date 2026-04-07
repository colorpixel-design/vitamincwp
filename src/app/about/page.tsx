import Link from "next/link";
import { Microscope, ShieldCheck, Users, Zap, ArrowRight, FlaskConical } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us — VitaminC India",
  description:
    "Learn about VitaminC India — the team, our mission, and why we built India's most trusted science-backed Vitamin C serum platform.",
};

const values = [
  {
    icon: Microscope,
    title: "Science, Not Marketing",
    desc: "Every product ranking is rooted in peer-reviewed dermatological research, ingredient chemistry, and clinical efficacy data — not ad spend.",
  },
  {
    icon: ShieldCheck,
    title: "Zero Paid Reviews",
    desc: "We have never accepted money for a positive review and never will. Our scores reflect real formulation quality.",
  },
  {
    icon: Users,
    title: "Built for Indian Skin",
    desc: "India's skin diversity, climate conditions, and budget realities are central to everything we do — not an afterthought.",
  },
  {
    icon: Zap,
    title: "Always Evolving",
    desc: "We re-score serums quarterly as new research, formulation changes, and user data emerge. We are never 'done'.",
  },
];

const team = [
  {
    name: "Dr. Priya Sharma",
    role: "Chief Dermatologist Advisor",
    desc: "MD Dermatology, AIIMS. 14 years clinical experience, specializing in Indian photo-skin types and cosmeceuticals.",
    emoji: "👩‍⚕️",
  },
  {
    name: "Arjun Mehta",
    role: "Founder & Lead Researcher",
    desc: "Former pharmaceutical formulation chemist. Built this platform after struggling to find unbiased Vitamin C guidance for Indian skin.",
    emoji: "🧑‍🔬",
  },
  {
    name: "Ritusha Kapoor",
    role: "Ingredient Science Writer",
    desc: "MSc Biochemistry. Translates complex ingredient chemistry into plain-language guides real people can actually use.",
    emoji: "👩‍💻",
  },
];

export default function AboutPage() {
  return (
    <div className="pt-24 pb-20 min-h-screen" style={{ background: "var(--bg)" }}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Hero */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass mb-6"
            style={{ border: "1px solid var(--border)" }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse" />
            <span className="text-xs font-medium tracking-wide text-orange-500">Our Story</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black leading-tight mb-6" style={{ color: "var(--text-primary)" }}>
            We built the platform{" "}
            <span className="gradient-text">we wished existed</span>
          </h1>
          <p className="text-lg leading-relaxed" style={{ color: "var(--text-muted)" }}>
            After spending months confused by influencer hype, contradictory Reddit advice, and
            marketing copy masquerading as science, we decided to build something better.
            VitaminC India is the result of that frustration — turned into a mission.
          </p>
        </div>

        {/* Mission statement */}
        <div className="glass rounded-3xl p-8 md:p-12 mb-16 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 via-transparent to-blue-600/5 pointer-events-none" />
          <div className="relative z-10">
            <FlaskConical className="w-8 h-8 text-orange-500 mb-4" />
            <h2 className="text-2xl font-black mb-4" style={{ color: "var(--text-primary)" }}>Our Mission</h2>
            <p className="text-lg leading-relaxed max-w-2xl" style={{ color: "var(--text-secondary)" }}>
              To be India&apos;s most rigorous, transparent, and India-specific guide to Vitamin C serums.
              We believe every person deserves access to real science without needing a chemistry degree
              — or a dermatologist consultation — to decode what&apos;s actually in their skincare.
            </p>
          </div>
        </div>

        {/* Values */}
        <div className="mb-20">
          <h2 className="text-2xl font-black mb-8 text-center" style={{ color: "var(--text-primary)" }}>What We Stand For</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {values.map((v) => (
              <div key={v.title} className="glass rounded-2xl p-6">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: "var(--bg-subtle)" }}
                >
                  <v.icon className="w-5 h-5 text-orange-500" />
                </div>
                <h3 className="font-bold mb-2" style={{ color: "var(--text-primary)" }}>{v.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Team */}
        <div className="mb-20">
          <h2 className="text-2xl font-black mb-2 text-center" style={{ color: "var(--text-primary)" }}>The Team</h2>
          <p className="text-sm text-center mb-8" style={{ color: "var(--text-muted)" }}>
            A small but obsessive group of scientists, writers, and skeptics.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {team.map((member) => (
              <div key={member.name} className="glass rounded-2xl p-6 text-center">
                <div className="text-5xl mb-4">{member.emoji}</div>
                <h3 className="font-bold mb-1" style={{ color: "var(--text-primary)" }}>{member.name}</h3>
                <p className="text-orange-500 text-xs font-semibold mb-3">{member.role}</p>
                <p className="text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>{member.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* How we score */}
        <div className="glass rounded-3xl p-8 mb-16">
          <h2 className="text-xl font-black mb-4" style={{ color: "var(--text-primary)" }}>How We Rank Serums</h2>
          <p className="text-sm leading-relaxed mb-6" style={{ color: "var(--text-secondary)" }}>
            Every serum in our database is scored across 5 categories by our team:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { label: "Ingredient Quality", points: "25 pts", desc: "Form of Vitamin C, supporting actives, and formulation synergy" },
              { label: "Stability", points: "30 pts", desc: "Packaging, pH suitability, oxidation resistance in Indian climate" },
              { label: "Packaging", points: "15 pts", desc: "UV protection, airtight enclosure, material compatibility" },
              { label: "User Experience", points: "20 pts", desc: "Texture, absorption, finish, fragrance, and usability" },
              { label: "Value for Money", points: "10 pts", desc: "Price per ml vs. formulation quality benchmark" },
            ].map((item) => (
              <div key={item.label} className="rounded-xl p-4" style={{ background: "var(--bg-subtle)", border: "1px solid var(--border)" }}>
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{item.label}</p>
                  <span className="text-orange-500 text-xs font-bold">{item.points}</span>
                </div>
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>{item.desc}</p>
              </div>
            ))}
          </div>
          <Link
            href="/methodology"
            className="mt-6 inline-flex items-center gap-2 text-sm text-orange-500 hover:gap-3 transition-all font-semibold"
          >
            Read full methodology <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* CTAs */}
        <div className="text-center">
          <Link
            href="/serums"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold hover:opacity-90 transition-opacity shadow-xl shadow-orange-500/30"
          >
            Explore the Database
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </div>
  );
}
