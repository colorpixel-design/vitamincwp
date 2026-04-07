import Link from "next/link";
import { ArrowLeft, Search, Sparkles } from "lucide-react";

export default function NotFound() {
  return (
    <div className="pt-24 min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-lg mx-auto">
        {/* Error code */}
        <div className="relative mb-8">
          <p className="text-[120px] font-black text-white/5 leading-none select-none">404</p>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-400 flex items-center justify-center shadow-2xl shadow-orange-500/40">
              <Search className="w-9 h-9 text-white" />
            </div>
          </div>
        </div>

        <h1 className="text-3xl font-black text-white mb-4">Page Not Found</h1>
        <p className="text-gray-400 mb-8 leading-relaxed">
          Looks like this serum evaporated — or the page you&apos;re looking for doesn&apos;t exist.
          Try searching our database or start from the homepage.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold hover:opacity-90 transition-opacity shadow-lg shadow-orange-500/25 text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Homepage
          </Link>
          <Link
            href="/quiz"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl glass text-white font-semibold hover:bg-white/10 transition-colors text-sm"
          >
            <Sparkles className="w-4 h-4" />
            Find My Serum
          </Link>
        </div>

        <Link
          href="/serums"
          className="mt-6 inline-block text-sm text-gray-500 hover:text-orange-400 transition-colors"
        >
          Browse all 100+ serums →
        </Link>
      </div>
    </div>
  );
}
