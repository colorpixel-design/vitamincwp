"use client";

import { useState } from "react";
import { Mail, MessageSquare, FlaskConical, Send, Check } from "lucide-react";

const topics = [
  { label: "Serum recommendation", value: "recommendation" },
  { label: "Incorrect/outdated information", value: "correction" },
  { label: "Brand / PR enquiry", value: "brand" },
  { label: "General feedback", value: "feedback" },
  { label: "Other", value: "other" },
];

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", topic: "recommendation", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you'd send this to an API
    setSubmitted(true);
  };

  return (
    <div className="pt-24 pb-20 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14">

          {/* Left: Info */}
          <div>
            <p className="text-orange-400 text-sm font-semibold uppercase tracking-wider mb-2">
              Get In Touch
            </p>
            <h1 className="text-4xl font-black text-white mb-5 leading-tight">
              We&apos;d love to hear from you
            </h1>
            <p className="text-gray-400 leading-relaxed mb-10">
              Whether you&apos;ve spotted an error in our reviews, want to share your serum experience,
              or have a question our database can&apos;t answer — reach out. We read every message.
            </p>

            <div className="space-y-5">
              {[
                {
                  icon: FlaskConical,
                  title: "Serum Suggestions",
                  desc: "Think we missed a serum worth reviewing? Tell us the brand and product name.",
                },
                {
                  icon: MessageSquare,
                  title: "Content Corrections",
                  desc: "If you spot outdated information, incorrect scores, or a broken link — we take this very seriously.",
                },
                {
                  icon: Mail,
                  title: "Press & Brand Enquiries",
                  desc: "Brands may not pay to influence our scores — but we're happy to discuss editorial collaborations.",
                },
              ].map((item) => (
                <div key={item.title} className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-5 h-5 text-orange-400" />
                  </div>
                  <div>
                    <p className="font-semibold text-white text-sm mb-0.5">{item.title}</p>
                    <p className="text-xs text-gray-400 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10 glass rounded-2xl p-4">
              <p className="text-xs text-gray-500 mb-1">Direct email</p>
              <p className="text-sm font-semibold text-white">hello@vitamincindia.com</p>
              <p className="text-xs text-gray-500 mt-1">We usually respond within 48 hours.</p>
            </div>
          </div>

          {/* Right: Form */}
          <div>
            {submitted ? (
              <div className="glass rounded-3xl p-10 flex flex-col items-center justify-center text-center min-h-80">
                <div className="w-16 h-16 rounded-full bg-green-500/15 flex items-center justify-center mb-5">
                  <Check className="w-8 h-8 text-green-400" />
                </div>
                <h2 className="text-xl font-black text-white mb-2">Message Sent!</h2>
                <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
                  Thanks for reaching out. We&apos;ll get back to you within 48 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="glass rounded-3xl p-6 md:p-8 space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-400 font-semibold mb-1.5">
                      Your Name
                    </label>
                    <input
                      required
                      type="text"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="Priya Sharma"
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-orange-500/50"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 font-semibold mb-1.5">
                      Email Address
                    </label>
                    <input
                      required
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="you@email.com"
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-orange-500/50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-gray-400 font-semibold mb-1.5">
                    What&apos;s this about?
                  </label>
                  <select
                    value={form.topic}
                    onChange={(e) => setForm({ ...form, topic: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-orange-500/50 cursor-pointer"
                  >
                    {topics.map((t) => (
                      <option key={t.value} value={t.value} className="bg-gray-900">
                        {t.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-gray-400 font-semibold mb-1.5">
                    Message
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Tell us what's on your mind..."
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-orange-500/50 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold hover:opacity-90 transition-opacity shadow-lg shadow-orange-500/25 text-sm"
                >
                  <Send className="w-4 h-4" />
                  Send Message
                </button>

                <p className="text-xs text-gray-600 text-center">
                  By submitting, you agree to our Privacy Policy. We never share your data.
                </p>
              </form>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
