'use client';

import React, { useState } from 'react';
import { MATHE_QUESTION_BANK } from '@/data/matheQuestions';
import { COHORT_MOCK_DATA, COHORT_OVERVIEW_STATS } from '@/data/uciCohortData';
import { MOCK_BEEBOOK_NOTES, MOCK_IN_VIDEO_QUIZ, MOCK_PRE_LECTURE_FLASHCARDS } from '@/data/beebookData';
import { updateThetaBayesian } from '@/engine/irtEngine';
import {
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  RotateCcw,
  Sparkles,
  BookOpen,
  Send,
  Zap,
  Flame,
  Users,
  Award,
  Video,
  Play,
  Pause,
  HelpCircle,
  Clock,
  Layers,
  FileText,
  UserCheck
} from 'lucide-react';

// =========================================================================
// 1. HERO SHOWCASE VIEW (Exact code.html Recreation)
// =========================================================================
export const HeroShowcaseView: React.FC<{ onNavigate: (view: any) => void }> = ({ onNavigate }) => {
  const [speech, setSpeech] = useState("Hi, I'm Skillbee! Let's craft your learning path ?");
  const [searchInput, setSearchInput] = useState('');
  const [activeCourseCategory, setActiveCourseCategory] = useState('all');

  const courseList = [
    { id: 1, title: 'Generative AI & watsonx', cat: 'ai', weeks: '6 Weeks', badge: 'IBM SkillsBuild', rating: '4.9', desc: 'Master prompt engineering, LLM fine-tuning, and enterprise AI governance.', bg: 'bg-[#ffe24c] text-black' },
    { id: 2, title: 'Data Analysis with Python', cat: 'data', weeks: '8 Weeks', badge: 'Data Science', rating: '4.8', desc: 'Clean telemetry datasets and construct executive predictive dashboards.', bg: 'bg-white text-black border border-gray-200' },
    { id: 3, title: 'Cybersecurity Defense Ops', cat: 'ai', weeks: '10 Weeks', badge: 'IBM Security', rating: '4.9', desc: 'Hands-on SOC simulation labs and zero-trust perimeter enforcement.', bg: 'bg-[#e5deff] text-[#1b1735]' },
    { id: 4, title: 'Cloud Architecture & OpenShift', cat: 'cloud', weeks: '5 Weeks', badge: 'Cloud Ops', rating: '4.7', desc: 'Deploy fault-tolerant container clusters and service meshes.', bg: 'bg-white text-black border border-gray-200' },
    { id: 5, title: 'Product Design Systems', cat: 'design', weeks: '7 Weeks', badge: 'IBM Carbon', rating: '4.9', desc: 'Craft responsive design tokens and design-to-code pipelines.', bg: 'bg-[#ffdad6] text-[#93000a]' },
    { id: 6, title: 'Machine Learning & Neural Nets', cat: 'ai', weeks: '8 Weeks', badge: 'Fast Track', rating: 'Career Ready', desc: 'Linear algebra to backpropagation in PyTorch and real-time model serving.', bg: 'bg-black text-white' }
  ];

  const filteredCourses = activeCourseCategory === 'all' 
    ? courseList 
    : courseList.filter(c => c.cat === activeCourseCategory);

  return (
    <div className="w-full">
      {/* 1. HERO SECTION */}
      <section className="max-w-[1440px] mx-auto px-6 md:px-12 pt-8 pb-16 relative overflow-hidden">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-center">
          {/* Left Column */}
          <div className="xl:col-span-7 flex flex-col items-start">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#eae8e5] text-gray-700 text-xs font-bold tracking-wider mb-6">
              <span className="w-2 h-2 rounded-full bg-[#ffe24c] animate-pulse"></span>
              LEARN ? BUILD ? GROW ? POWERED BY IBM SKILLSBUILD & AI
            </div>

            <h1 className="font-display text-5xl md:text-7xl font-bold tracking-tight leading-[1.08] text-black mb-6">
              Build{' '}
              <span className="inline-flex items-center px-3.5 py-1 bg-[#e5deff] text-[#1b1735] rounded-2xl mx-1 shadow-sm transform -rotate-2">
                your
              </span>
              <br />
              skills{' '}
              <span className="inline-flex items-center justify-center w-14 h-14 bg-[#fcdf46] text-black rounded-2xl mx-1.5 shadow-sm transform rotate-3 align-middle">
                <Sparkles className="w-8 h-8" />
              </span>{' '}
              online.
            </h1>

            <p className="text-lg text-gray-600 max-w-xl mb-8">
              Personalized learning roadmaps, empathetic AI mentorship, and verified IBM credentials ? structured to eliminate prerequisite collapse in engineering colleges.
            </p>

            {/* Search Pill */}
            <div className="w-full max-w-2xl bg-white rounded-full p-2 shadow-md flex items-center gap-3 mb-4 border border-gray-200">
              <span className="material-symbols-outlined text-gray-400 pl-3">search</span>
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onFocus={() => setSpeech("Tell me your dream role! ??")}
                onBlur={() => setSpeech("Hi, I'm Skillbee! Let's craft your learning path ?")}
                placeholder="What do you want to learn? (e.g. AI Engineer, Linear Algebra, PyTorch...)"
                className="w-full bg-transparent text-black placeholder:text-gray-400 focus:outline-none text-sm px-1"
              />
              <button
                onClick={() => onNavigate('onboarding')}
                className="h-11 px-6 rounded-full bg-black text-white text-xs font-bold flex items-center gap-2 hover:scale-105 transition-all shrink-0"
              >
                <span>Explore</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Trending Chips */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-gray-500 uppercase mr-1">Trending:</span>
              <button onClick={() => setSearchInput('AI & watsonx')} className="px-3.5 py-1.5 rounded-full bg-[#e5deff] text-[#1b1735] text-xs font-semibold hover:-translate-y-0.5 transition-transform">
                AI & watsonx
              </button>
              <button onClick={() => setSearchInput('Linear Algebra')} className="px-3.5 py-1.5 rounded-full bg-[#ffe24c] text-black text-xs font-semibold hover:-translate-y-0.5 transition-transform">
                Linear Algebra
              </button>
              <button onClick={() => setSearchInput('Data Science')} className="px-3.5 py-1.5 rounded-full bg-[#ffdad6] text-[#93000a] text-xs font-semibold hover:-translate-y-0.5 transition-transform">
                Data Science
              </button>
              <button onClick={() => setSearchInput('Cloud Kubernetes')} className="px-3.5 py-1.5 rounded-full bg-[#eae8e5] text-black text-xs font-semibold hover:-translate-y-0.5 transition-transform">
                Cloud Kubernetes
              </button>
            </div>
          </div>

          {/* Right Column / Mascot Interactive Stage */}
          <div className="xl:col-span-5 relative flex items-center justify-center">
            <div className="w-full max-w-xl min-h-[560px] rounded-[48px] bg-gradient-to-br from-[#e5deff]/60 via-[#f5f3f0] to-[#fcdf46]/40 p-8 flex flex-col justify-between relative shadow-xl border border-white/60">
              
              {/* Speech Bubble */}
              <div className="absolute -top-6 -left-4 z-30 max-w-[320px] bg-white/95 backdrop-blur-md px-4 py-3 rounded-2xl border border-gray-200 shadow-xl flex flex-col gap-1">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#ffe24c] animate-ping"></span>
                  <span className="text-[11px] text-black uppercase tracking-wider font-bold">IBM SkillsBuild AI</span>
                </div>
                <p className="text-xs text-black font-semibold">{speech}</p>
              </div>

              {/* Verified Badge pill */}
              <div className="absolute -top-6 -right-4 z-30 hidden sm:flex items-center gap-2 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-gray-200 shadow-lg">
                <span className="material-symbols-outlined text-[#6d5e00] text-[20px]">verified</span>
                <div>
                  <p className="text-[12px] text-black font-bold leading-tight">Credly Verified</p>
                  <p className="text-[10px] text-gray-500">Official IBM Badges</p>
                </div>
              </div>

              {/* Animated Bee Stage with Trail & Final Holding Sprite */}
              <div className="relative my-auto flex items-center justify-center py-6 w-full min-h-[360px]">
                {/* SVG Golden Flight Trail */}
                <svg className="absolute pointer-events-none -inset-x-16 -inset-y-10 w-[calc(100%+128px)] h-[calc(100%+80px)] z-10 overflow-visible" fill="none" viewBox="0 0 540 380">
                  <defs>
                    <linearGradient id="beeTrailGrad" x1="0%" x2="100%" y1="0%">
                      <stop offset="0%" stopColor="#e2c62d" stopOpacity="0.25" />
                      <stop offset="35%" stopColor="#ffe24c" stopOpacity="0.95" />
                      <stop offset="100%" stopColor="#fcdf46" stopOpacity="0.95" />
                    </linearGradient>
                  </defs>
                  <path
                    className="flight-trail-line"
                    d="M 20 60 C 80 15, 110 170, 190 120 C 260 80, 275 230, 340 180 C 375 150, 400 130, 435 150 C 470 170, 460 215, 410 215"
                    stroke="url(#beeTrailGrad)"
                    strokeWidth="3.5"
                    strokeDasharray="4 8"
                    strokeLinecap="round"
                  />
                </svg>

                {/* Final Mascot Image with Idle Float */}
                <div className="final-bee-wrap relative z-20 flex items-center justify-center">
                  <div className="final-bee-float w-72 h-72 md:w-80 md:h-80 relative flex items-center justify-center">
                    <img
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuCmpcMT19qAK6nzGxFGfavHez0hEVLg8b3hvN5S5nw_h7exMKSr9YZcvPJNMhhE70KFWFpCBEBjXhW7T2bA0uB0HnRE6SEXlzCcFhmrpZnYDPkfZ8yGY4RLqYUb1bPjTl4OBFLWByXNYPBAa8f1ej4JlN0q9pK8DtC7XDiyh05o-RKQZ4d-l1TLuT_-scFvUdvMOnxFMSwU3W7bNRJSNp4SBk3pNsGSTessFLScnRwPcbuMbSSgNrpOgiLy5a7VozFD"
                      alt="Skillbee AI Mascot with Laptop"
                      className="w-full h-full object-contain drop-shadow-2xl select-none"
                    />
                    <div className="ground-shadow-enter ground-shadow-pulse absolute bottom-2 w-48 h-6 rounded-full bg-black/25 blur-md pointer-events-none -z-10"></div>
                  </div>
                </div>
              </div>

              {/* Bottom Learners Stat Card */}
              <div className="z-20 bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-md border border-gray-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#ffe24c] flex items-center justify-center text-black shadow-sm font-bold">
                    ??
                  </div>
                  <div>
                    <div className="font-display text-lg font-bold leading-none text-black">500K+</div>
                    <div className="text-xs text-gray-500 mt-0.5">Learners on IBM SkillsBuild</div>
                  </div>
                </div>
                <button
                  onClick={() => onNavigate('onboarding')}
                  className="px-4 py-2 rounded-full bg-black text-white text-xs font-bold hover:scale-105 transition-all flex items-center gap-1.5"
                >
                  Start Diagnostic
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* 2. POPULAR COURSES BENTO GRID */}
      <section className="w-full bg-[#f5f3f0] py-16">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                Curated Knowledge Engine
              </div>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-black tracking-tight">
                Explore industry-vetted courses
              </h2>
            </div>
            <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
              {['all', 'ai', 'data', 'cloud', 'design'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCourseCategory(cat)}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                    activeCourseCategory === cat
                      ? 'bg-black text-white shadow-sm'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {cat === 'all' ? 'All Modules' : cat.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((c) => (
              <div
                key={c.id}
                className={`${c.bg} rounded-[32px] p-6 flex flex-col justify-between h-[340px] shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-3 py-1 rounded-full bg-black/10 text-xs font-bold uppercase">
                      {c.badge}
                    </span>
                    <div className="flex items-center gap-1 text-xs font-bold">
                      ? {c.rating}
                    </div>
                  </div>
                  <h3 className="font-display text-2xl font-bold leading-snug">
                    {c.title}
                  </h3>
                  <p className="text-xs opacity-80 mt-2 leading-relaxed">
                    {c.desc}
                  </p>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-black/10">
                  <span className="text-xs font-semibold">{c.weeks}</span>
                  <button
                    onClick={() => onNavigate('roadmap')}
                    className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center hover:scale-110 transition-transform"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

// =========================================================================
// 2. COLD-START CAT ASSESSMENT VIEW (Screen 2)
// =========================================================================
export const ColdStartCATView: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [theta, setTheta] = useState(0.0);
  const [deltaHistory, setDeltaHistory] = useState<number[]>([]);
  const [isDone, setIsDone] = useState(false);

  const question = MATHE_QUESTION_BANK[currentIdx];

  const handleSelectOption = (idx: number) => {
    setSelectedOpt(idx);
    const isCorrect = idx === question.correctIndex;
    const { newTheta, delta } = updateThetaBayesian(theta, isCorrect, question.discrimination_a, question.difficulty_b);
    setTheta(newTheta);
    setDeltaHistory([...deltaHistory, delta]);
  };

  const handleNext = () => {
    if (currentIdx < MATHE_QUESTION_BANK.length - 1) {
      setCurrentIdx(currentIdx + 1);
      setSelectedOpt(null);
    } else {
      setIsDone(true);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="bg-white rounded-[40px] p-8 md:p-12 shadow-xl border border-gray-200">
        <div className="flex items-center justify-between pb-6 border-b border-gray-100 mb-8">
          <div>
            <span className="px-3 py-1 rounded-full bg-[#ffe24c] text-black text-xs font-bold uppercase">
              MathE Calibrated Diagnostic
            </span>
            <h2 className="font-display text-2xl md:text-3xl font-bold text-black mt-2">
              Cold-Start Computerized Adaptive Test (CAT)
            </h2>
            <p className="text-xs text-gray-500 mt-1">Item {currentIdx + 1} of {MATHE_QUESTION_BANK.length} ? Testing Latent Ability ?</p>
          </div>

          {/* Theta Ability Gauge */}
          <div className="bg-[#fbf9f6] p-4 rounded-2xl border border-gray-200 text-center min-w-[140px]">
            <p className="text-[10px] uppercase font-bold text-gray-500">Latent Ability (?)</p>
            <div className="font-display text-2xl font-bold text-[#0f62fe]">
              {theta > 0 ? `+${theta.toFixed(2)}` : theta.toFixed(2)}
            </div>
            <p className="text-[9px] text-emerald-600 font-bold mt-0.5">2PL-IRT Bayesian</p>
          </div>
        </div>

        {!isDone ? (
          <div>
            <div className="mb-6">
              <span className="text-xs font-bold text-purple-700 bg-purple-100 px-2.5 py-1 rounded-full">
                {question.conceptLabel}
              </span>
              <h3 className="font-display text-lg md:text-xl font-bold text-black mt-3">
                {question.question}
              </h3>
              {question.latexEquation && (
                <div className="bg-gray-50 font-mono text-xs p-3 rounded-xl border border-gray-200 my-3 text-gray-800">
                  {question.latexEquation}
                </div>
              )}
            </div>

            {/* Options */}
            <div className="flex flex-col gap-3 mb-8">
              {question.options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleSelectOption(i)}
                  className={`p-4 rounded-2xl text-left text-sm font-medium border transition-all ${
                    selectedOpt === i
                      ? i === question.correctIndex
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-900 font-bold'
                        : 'bg-rose-50 border-rose-500 text-rose-900'
                      : 'bg-white border-gray-200 hover:border-gray-400 text-black'
                  }`}
                >
                  <span className="font-bold mr-2">{String.fromCharCode(65 + i)}.</span> {opt}
                </button>
              ))}
            </div>

            {selectedOpt !== null && (
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 mb-6">
                <strong>Pedagogical Explanation:</strong> {question.explanation}
              </div>
            )}

            <div className="flex justify-end">
              <button
                disabled={selectedOpt === null}
                onClick={handleNext}
                className="px-8 py-3 rounded-full bg-black text-white text-xs font-bold disabled:opacity-40 hover:scale-105 transition-all flex items-center gap-2"
              >
                <span>{currentIdx === MATHE_QUESTION_BANK.length - 1 ? 'Finish Calibration' : 'Next Adaptive Item'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="font-display text-2xl font-bold text-black">Cognitive Calibration Complete!</h3>
            <p className="text-sm text-gray-600 max-w-md mx-auto mt-2">
              Your baseline latent ability has been calibrated to <strong>? = {theta > 0 ? `+${theta.toFixed(2)}` : theta.toFixed(2)}</strong>. Prerequisite bridges have unlocked your personalized AI Engineer Roadmap.
            </p>
            <button
              onClick={onComplete}
              className="mt-6 px-8 py-3.5 rounded-full bg-black text-white text-xs font-bold hover:scale-105 transition-all"
            >
              Open Dual-Horizon Dashboard ??
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
