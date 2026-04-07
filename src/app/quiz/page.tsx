"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, ArrowLeft, Check, Sparkles } from "lucide-react";
import serums from "@/data/serums.json";
import SerumCard from "@/components/SerumCard";
import { cn } from "@/lib/utils";

type Step = {
  id: string;
  question: string;
  subtitle: string;
  options: { label: string; value: string; emoji: string; desc?: string }[];
};

const steps: Step[] = [
  {
    id: "skin_type",
    question: "What's your skin type?",
    subtitle: "Be honest — this affects which Vitamin C derivative is best for you.",
    options: [
      { label: "Oily", value: "oily", emoji: "💧", desc: "Shiny by afternoon, large pores" },
      { label: "Dry", value: "dry", emoji: "🌵", desc: "Tight, flaky, feels parched" },
      { label: "Combination", value: "combination", emoji: "🌗", desc: "Oily T-zone, dry cheeks" },
      { label: "Sensitive", value: "sensitive", emoji: "🌸", desc: "Easily irritated, reactive" },
      { label: "Normal", value: "normal", emoji: "✅", desc: "Balanced, few issues" },
    ],
  },
  {
    id: "concern",
    question: "What's your #1 skin concern?",
    subtitle: "Pick the one that bothers you the most.",
    options: [
      { label: "Brightening / Dullness", value: "brightening", emoji: "✨", desc: "Want that natural glow" },
      { label: "Dark Spots / Pigmentation", value: "hyperpigmentation", emoji: "🔆", desc: "Sun damage, dark patches" },
      { label: "Anti-Aging / Fine Lines", value: "anti-aging", emoji: "⏳", desc: "Wrinkles, loss of firmness" },
      { label: "Acne & Breakouts", value: "acne", emoji: "🧫", desc: "Active pimples, post-acne marks" },
      { label: "Hydration / Dryness", value: "hydration", emoji: "💦", desc: "Skin feels dehydrated" },
    ],
  },
  {
    id: "experience",
    question: "Your Vitamin C experience level?",
    subtitle: "This determines how strong a formula you can tolerate.",
    options: [
      { label: "Complete Beginner", value: "beginner", emoji: "🌱", desc: "Never used Vitamin C before" },
      { label: "Some Experience", value: "intermediate", emoji: "🌿", desc: "Used it a few times" },
      { label: "Regular User", value: "advanced", emoji: "🌳", desc: "Use it daily, want something stronger" },
    ],
  },
  {
    id: "budget",
    question: "What's your monthly serum budget?",
    subtitle: "We'll find the best value for your price point.",
    options: [
      { label: "Under ₹500", value: "budget", emoji: "💸", desc: "Best bang for buck" },
      { label: "₹500 – ₹1,000", value: "mid", emoji: "💰", desc: "Mid-range, quality focus" },
      { label: "₹1,000 – ₹3,000", value: "premium", emoji: "💎", desc: "Premium formulations" },
      { label: "₹3,000+", value: "luxury", emoji: "👑", desc: "Money is no object" },
    ],
  },
  {
    id: "climate",
    question: "Where in India do you live?",
    subtitle: "Humidity and temperature affect which Vitamin C form stays stable on your shelf.",
    options: [
      { label: "Humid / Coastal", value: "humid", emoji: "🏖️", desc: "Mumbai, Chennai, Kolkata" },
      { label: "Hot & Dry", value: "dry_hot", emoji: "☀️", desc: "Delhi, Rajasthan, Gujarat" },
      { label: "Moderate / Hill Station", value: "moderate", emoji: "⛰️", desc: "Bangalore, Pune, Shimla" },
      { label: "Any / Don't Know", value: "any", emoji: "🗺️", desc: "I'll store it carefully" },
    ],
  },
];

type Answers = Record<string, string>;

function getRecommendations(answers: Answers) {
  let pool = [...serums];
  const skinType = answers.skin_type;
  const concern = answers.concern;
  const experience = answers.experience;
  const budget = answers.budget;

  const scored = pool.map((serum) => {
    let score = 0;
    if (serum.skin_types.includes(skinType) || serum.skin_types.includes("all")) score += 25;
    if (serum.concerns.includes(concern)) score += 20;
    if (experience === "beginner" && serum.vitamin_c_type !== "LAA") score += 20;
    if (experience === "advanced" && serum.vitamin_c_type === "LAA") score += 15;
    if (budget === "budget" && serum.price < 500)     score += 20;
    if (budget === "mid"    && serum.price < 1000)    score += 15;
    if (budget === "premium"&& serum.price < 3000)    score += 10;
    if (skinType === "sensitive" && serum.vitamin_c_type !== "LAA") score += 15;
    if (concern === "acne" && serum.vitamin_c_type === "SAP") score += 15;
    score += serum.scores.total * 0.3;
    return { serum, score };
  });

  return scored.sort((a, b) => b.score - a.score).slice(0, 3).map((x) => x.serum);
}

function OptionButton({
  option, selected, onClick,
}: {
  option: Step["options"][0]; selected: boolean; onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full text-left p-4 rounded-xl border-2 transition-all flex items-center gap-4",
        selected
          ? "bg-[#EFF5FF] border-[#1E5FA3] shadow-sm"
          : "bg-white border-[#D6E0ED] hover:border-[#1E5FA3]/40 hover:bg-[#F7F9FC]"
      )}
    >
      <span className="text-3xl flex-shrink-0">{option.emoji}</span>
      <div className="flex-1">
        <p className={cn("font-semibold text-sm", selected ? "text-[#1E5FA3]" : "text-[#0C1E30]")}>
          {option.label}
        </p>
        {option.desc && (
          <p className="text-xs text-[#7A93AD] mt-0.5">{option.desc}</p>
        )}
      </div>
      {selected && (
        <div className="w-5 h-5 rounded-full bg-[#1E5FA3] flex items-center justify-center flex-shrink-0">
          <Check className="w-3 h-3 text-white" />
        </div>
      )}
    </button>
  );
}

export default function QuizPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [results, setResults] = useState<typeof serums | null>(null);

  const step = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;
  const currentAnswer = answers[step?.id];

  const handleAnswer = (value: string) => setAnswers((prev) => ({ ...prev, [step.id]: value }));
  const handleNext = () => {
    if (isLastStep) setResults(getRecommendations(answers));
    else setCurrentStep((prev) => prev + 1);
  };
  const handleBack = () => { if (currentStep > 0) setCurrentStep((prev) => prev - 1); };
  const handleRestart = () => { setCurrentStep(0); setAnswers({}); setResults(null); };

  if (results) {
    return (
      <div className="pt-[69px] pb-20 min-h-screen bg-[#F7F9FC]">
        {/* Results header */}
        <div className="bg-white border-b border-[#D6E0ED]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-center">
            <div className="w-14 h-14 rounded-2xl bg-[#1E5FA3] flex items-center justify-center mx-auto mb-5 shadow-lg">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-[#0C1E30] mb-3">Your Perfect Match</h1>
            <p className="text-[#3A5068] text-base max-w-lg mx-auto">
              Based on your skin type, concerns, budget, and climate — here are your top 3 recommended serums.
            </p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {/* Profile summary */}
          <div className="bg-white rounded-2xl p-5 mb-8 border border-[#D6E0ED]">
            <p className="text-xs text-[#7A93AD] uppercase tracking-wider font-semibold mb-3">Your Profile</p>
            <div className="flex flex-wrap gap-2">
              {Object.entries(answers).map(([key, value]) => (
                <span
                  key={key}
                  className="px-3 py-1 rounded-full bg-[#EFF5FF] border border-[#BFDBFE] text-xs text-[#1E5FA3] font-medium capitalize"
                >
                  {key.replace("_", " ")}: {value.replace("_", " ")}
                </span>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
            {results.map((serum, i) => (
              <div key={serum.id} className="relative">
                {i === 0 && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10 px-3 py-0.5 rounded-full bg-[#1E5FA3] text-white text-[10px] font-bold whitespace-nowrap shadow-sm">
                    ⭐ Best Match
                  </div>
                )}
                <SerumCard serum={serum} variant={i === 0 ? "featured" : "default"} />
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/serums"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white text-[#0C1E30] font-semibold hover:border-[#1E5FA3] hover:text-[#1E5FA3] transition-colors text-sm border border-[#D6E0ED]"
            >
              Browse Full Database
              <ArrowRight className="w-4 h-4" />
            </Link>
            <button
              onClick={handleRestart}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#EFF5FF] text-[#1E5FA3] font-semibold hover:bg-[#DBEAFE] transition-colors text-sm border border-[#BFDBFE]"
            >
              Retake Quiz
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-[69px] pb-20 min-h-screen bg-[#F7F9FC] flex items-start justify-center">
      <div className="w-full max-w-xl mx-auto px-4 sm:px-6 py-10">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-[#1E5FA3] flex items-center justify-center mx-auto mb-4 shadow-md">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-2xl font-black text-[#0C1E30]">Find Your Perfect Serum</h1>
          <p className="text-[#7A93AD] text-sm mt-1">5 questions · 2 minutes · Free</p>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between text-xs text-[#7A93AD] mb-2">
            <span>Question {currentStep + 1} of {steps.length}</span>
            <span>{Math.round(((currentStep + 1) / steps.length) * 100)}% complete</span>
          </div>
          <div className="h-1.5 bg-[#E4EAF3] rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#1E5FA3] to-[#2B7FD4] transition-all duration-500"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Question card */}
        <div className="bg-white rounded-2xl p-6 border border-[#D6E0ED] shadow-sm mb-6">
          <h2 className="text-xl font-black text-[#0C1E30] mb-1">{step.question}</h2>
          <p className="text-sm text-[#3A5068] mb-5">{step.subtitle}</p>

          <div className="space-y-2.5">
            {step.options.map((opt) => (
              <OptionButton
                key={opt.value}
                option={opt}
                selected={currentAnswer === opt.value}
                onClick={() => handleAnswer(opt.value)}
              />
            ))}
          </div>
        </div>

        {/* Nav buttons */}
        <div className="flex gap-3">
          {currentStep > 0 && (
            <button
              onClick={handleBack}
              className="flex items-center gap-2 px-4 py-3 rounded-xl bg-white text-[#3A5068] hover:text-[#0C1E30] text-sm font-medium transition-colors border border-[#D6E0ED]"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
          )}
          <button
            onClick={handleNext}
            disabled={!currentAnswer}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all",
              currentAnswer
                ? "bg-[#1E5FA3] text-white hover:bg-[#164D8A] shadow-sm"
                : "bg-[#E4EAF3] text-[#7A93AD] cursor-not-allowed"
            )}
          >
            {isLastStep ? (
              <><Sparkles className="w-4 h-4" />Show My Results</>
            ) : (
              <>Next<ArrowRight className="w-4 h-4" /></>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
