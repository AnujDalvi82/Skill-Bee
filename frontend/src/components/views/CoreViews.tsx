'use client';

import React, { useState } from 'react';
import { MATHE_QUESTION_BANK } from '@/data/matheQuestions';
import { COHORT_MOCK_DATA, COHORT_OVERVIEW_STATS } from '@/data/uciCohortData';
import { MOCK_BEEBOOK_NOTES, MOCK_IN_VIDEO_QUIZ, MOCK_PRE_LECTURE_FLASHCARDS } from '@/data/beebookData';
import { updateThetaBayesian } from '@/engine/irtEngine';
import { ApiClient } from '@/services/api';
import { Latex } from '@/components/common/Latex';
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
  UserCheck,
  School,
  Check,
  Calculator,
  Building2,
  GraduationCap,
  ShieldCheck,
  TrendingUp,
  Sliders,
  Mail,
  Phone,
  Download
} from 'lucide-react';

// =========================================================================
// 1. HERO SHOWCASE VIEW (Exact code.html Recreation)
// =========================================================================
export const HeroShowcaseView: React.FC<{ onNavigate: (view: any) => void }> = ({ onNavigate }) => {
  const [speech, setSpeech] = useState("Hi, I'm Skillbee! Let's craft your learning path 🐝");
  const [searchInput, setSearchInput] = useState('');
  const [activeCourseCategory, setActiveCourseCategory] = useState('all');

  // Pricing & Cost Estimator State
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');
  const [studentSeats, setStudentSeats] = useState(500);
  const [selectedPlanForEstimator, setSelectedPlanForEstimator] = useState<'campus' | 'enterprise' | 'pro'>('campus');
  const [durationSemesters, setDurationSemesters] = useState(1);

  // Institutional Registration Purchase Form State
  const [partnerForm, setPartnerForm] = useState({
    name: '',
    email: '',
    institution: '',
    role: 'Head of Department (HOD)',
    plan: 'Campus Department (Cohort Triage)',
    cohortSize: '500 – 2,000 Students',
    phone: '',
    notes: ''
  });
  const [isSubmittingPartner, setIsSubmittingPartner] = useState(false);
  const [partnerSubmittedData, setPartnerSubmittedData] = useState<{
    refId: string;
    timestamp: string;
    institution: string;
    plan: string;
    name: string;
  } | null>(null);

  const handleSelectPlanToRegister = (planName: string, estimatorKey?: 'campus' | 'enterprise' | 'pro') => {
    if (estimatorKey) {
      setSelectedPlanForEstimator(estimatorKey);
    }
    setPartnerForm(prev => ({ ...prev, plan: planName }));
    const el = document.getElementById('institutional-registration-form');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handlePartnerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!partnerForm.name.trim() || !partnerForm.email.trim() || !partnerForm.institution.trim()) {
      alert('Please fill out your Name, Official Email, and Institution Name.');
      return;
    }
    setIsSubmittingPartner(true);
    setTimeout(() => {
      const refCode = 'SB-TIEUP-' + Math.floor(100000 + Math.random() * 900000);
      setPartnerSubmittedData({
        refId: refCode,
        timestamp: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
        institution: partnerForm.institution,
        plan: partnerForm.plan,
        name: partnerForm.name
      });
      setIsSubmittingPartner(false);
    }, 850);
  };

  // Live calculations for Estimator
  const perStudentSemesterRate = selectedPlanForEstimator === 'campus'
    ? (billingCycle === 'annual' ? 399 : 499)
    : selectedPlanForEstimator === 'enterprise'
    ? (billingCycle === 'annual' ? 249 : 299)
    : (billingCycle === 'annual' ? 199 * 6 : 299 * 6);

  const totalEstimatedInvestment = studentSeats * perStudentSemesterRate * durationSemesters;
  const effectiveCostPerStudentMo = Math.round(totalEstimatedInvestment / (studentSeats * durationSemesters * 6));
  const estimatedFacultyHoursSaved = Math.round(studentSeats * 0.04 * (durationSemesters * 24));
  const finOpsInfrastructureMonthly = (studentSeats * 6.60).toLocaleString('en-IN', { maximumFractionDigits: 0 });

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
              LEARN • BUILD • GROW • POWERED BY IBM SKILLSBUILD & AI
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
              Personalized learning roadmaps, empathetic AI mentorship, and verified IBM credentials — structured to eliminate prerequisite collapse in engineering colleges.
            </p>

            {/* Search Pill */}
            <div className="w-full max-w-2xl bg-white rounded-full p-2 shadow-md flex items-center gap-3 mb-4 border border-gray-200">
              <span className="material-symbols-outlined text-gray-400 pl-3">search</span>
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onFocus={() => setSpeech("Tell me your dream role! 🚀")}
                onBlur={() => setSpeech("Hi, I'm Skillbee! Let's craft your learning path 🐝")}
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
                    <Award className="w-5 h-5 text-black" />
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
                      <span className="text-amber-500">★</span> {c.rating}
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

      {/* 3. TRANSPARENT PRICING CATALOG & INTERACTIVE ESTIMATOR */}
      <section className="w-full bg-[#fbf9f6] py-20 border-t border-black/5" id="pricing-catalog">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12">
          
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#ffe24c]/30 text-[#6d5e00] text-xs font-bold uppercase tracking-wider mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              Transparent Enterprise & Student Plans
            </div>
            <h2 className="font-display text-3xl md:text-5xl font-bold text-black tracking-tight mb-4">
              Predictable, outcome-driven pricing for every scale
            </h2>
            <p className="text-gray-600 text-sm md:text-base leading-relaxed">
              From ambitious individual engineering students to nationwide autonomous universities and AICTE consortia. Backed by 2PL-IRT FinOps at 94% lower operational cost.
            </p>

            {/* Billing Toggle */}
            <div className="mt-8 inline-flex items-center p-1.5 rounded-full bg-[#eae8e5] border border-gray-300">
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`px-5 py-2 rounded-full text-xs font-bold transition-all ${
                  billingCycle === 'monthly'
                    ? 'bg-white text-black shadow-sm'
                    : 'text-gray-600 hover:text-black'
                }`}
              >
                Monthly Billing
              </button>
              <button
                onClick={() => setBillingCycle('annual')}
                className={`px-5 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
                  billingCycle === 'annual'
                    ? 'bg-black text-white shadow-sm'
                    : 'text-gray-600 hover:text-black'
                }`}
              >
                <span>Annual Billing</span>
                <span className="px-2 py-0.5 rounded-full bg-[#ffe24c] text-black text-[10px] font-black">
                  SAVE 20%
                </span>
              </button>
            </div>
          </div>

          {/* Pricing Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
            
            {/* Card 1: Student Starter */}
            <div className="bg-white rounded-[32px] p-7 border border-gray-200 shadow-sm flex flex-col justify-between hover:shadow-lg transition-shadow">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-[11px] font-bold uppercase">
                    Free Forever
                  </span>
                  <GraduationCap className="w-5 h-5 text-gray-400" />
                </div>
                <h3 className="font-display text-2xl font-bold text-black mb-1">Student Starter</h3>
                <p className="text-xs text-gray-500 mb-6">For self-guided engineering students diagnosing prerequisite gaps.</p>
                
                <div className="mb-6">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-black text-black">₹0</span>
                    <span className="text-xs text-gray-500 font-semibold">/ forever</span>
                  </div>
                  <p className="text-[11px] text-gray-400 mt-1">Zero credit card required</p>
                </div>

                <div className="space-y-3 pt-6 border-t border-gray-100">
                  <div className="flex items-start gap-2.5 text-xs text-gray-700">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Cold-Start 2PL-IRT Adaptive Test</span>
                  </div>
                  <div className="flex items-start gap-2.5 text-xs text-gray-700">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Basic Prerequisite Knowledge DAG</span>
                  </div>
                  <div className="flex items-start gap-2.5 text-xs text-gray-700">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>5 Socratic AI Hints / Day</span>
                  </div>
                  <div className="flex items-start gap-2.5 text-xs text-gray-700">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>EdNet Cognitive Telemetry Logging</span>
                  </div>
                  <div className="flex items-start gap-2.5 text-xs text-gray-700">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Community Discord Access</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-100">
                <button
                  onClick={() => onNavigate('onboarding')}
                  className="w-full py-3 rounded-full bg-gray-100 text-black text-xs font-bold hover:bg-gray-200 transition-colors flex items-center justify-center gap-1.5"
                >
                  <span>Start Free Diagnostic</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Card 2: Pro Scholar */}
            <div className="bg-white rounded-[32px] p-7 border border-gray-200 shadow-sm flex flex-col justify-between hover:shadow-lg transition-shadow">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 rounded-full bg-[#e5deff] text-[#1b1735] text-[11px] font-bold uppercase">
                    Career Fast-Track
                  </span>
                  <Zap className="w-5 h-5 text-purple-600" />
                </div>
                <h3 className="font-display text-2xl font-bold text-black mb-1">Pro Scholar</h3>
                <p className="text-xs text-gray-500 mb-6">For engineers targeting tier-1 campus placements and IBM mastery.</p>
                
                <div className="mb-6">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-black text-black">
                      {billingCycle === 'annual' ? '₹199' : '₹299'}
                    </span>
                    <span className="text-xs text-gray-500 font-semibold">/ student / mo</span>
                  </div>
                  <p className="text-[11px] text-gray-500 mt-1">
                    {billingCycle === 'annual' ? 'Billed annually (₹2,388/yr)' : 'Billed monthly, cancel anytime'}
                  </p>
                </div>

                <div className="space-y-3 pt-6 border-t border-gray-100">
                  <div className="flex items-start gap-2.5 text-xs text-gray-700">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>Everything in Starter, plus:</strong></span>
                  </div>
                  <div className="flex items-start gap-2.5 text-xs text-gray-700">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Unlimited IBM Granite 3.0 Socratic Copilot</span>
                  </div>
                  <div className="flex items-start gap-2.5 text-xs text-gray-700">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>LinUCB Multi-Modal Adaptive Player</span>
                  </div>
                  <div className="flex items-start gap-2.5 text-xs text-gray-700">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Deep Reverse DAG Root-Cause Isolation</span>
                  </div>
                  <div className="flex items-start gap-2.5 text-xs text-gray-700">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Credly Verified IBM SkillsBuild Badges</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-100">
                <button
                  onClick={() => handleSelectPlanToRegister('Pro Scholar (Career Fast-Track)', 'pro')}
                  className="w-full py-3 rounded-full bg-black text-white text-xs font-bold hover:scale-[1.02] transition-all flex items-center justify-center gap-1.5"
                >
                  <span>Choose Pro Scholar</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Card 3: Campus Department (Highlighted / Most Popular) */}
            <div className="bg-[#111210] text-white rounded-[32px] p-7 border-2 border-[#ffe24c] shadow-xl flex flex-col justify-between relative hover:scale-[1.02] transition-transform duration-300">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-[#ffe24c] text-black text-[11px] font-black uppercase tracking-wider shadow-md">
                ⭐ Most Popular for Colleges
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-4 mt-1">
                  <span className="px-3 py-1 rounded-full bg-white/10 text-[#ffe24c] text-[11px] font-bold uppercase">
                    Cohort Triage
                  </span>
                  <Building2 className="w-5 h-5 text-[#ffe24c]" />
                </div>
                <h3 className="font-display text-2xl font-bold text-white mb-1">Campus Department</h3>
                <p className="text-xs text-gray-400 mb-6">For engineering HODs and faculty managing 60–500 students.</p>
                
                <div className="mb-6">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-black text-white">
                      {billingCycle === 'annual' ? '₹399' : '₹499'}
                    </span>
                    <span className="text-xs text-gray-400 font-semibold">/ student / sem</span>
                  </div>
                  <p className="text-[11px] text-[#ffe24c] font-semibold mt-1">
                    Includes Full Faculty ICU Cockpit
                  </p>
                </div>

                <div className="space-y-3 pt-6 border-t border-white/10">
                  <div className="flex items-start gap-2.5 text-xs text-gray-200">
                    <Check className="w-4 h-4 text-[#ffe24c] shrink-0 mt-0.5" />
                    <span><strong>Real-Time Faculty ICU Radar (G/A/R)</strong></span>
                  </div>
                  <div className="flex items-start gap-2.5 text-xs text-gray-200">
                    <Check className="w-4 h-4 text-[#ffe24c] shrink-0 mt-0.5" />
                    <span>Pre-Exam Failure Prediction (UCI Model)</span>
                  </div>
                  <div className="flex items-start gap-2.5 text-xs text-gray-200">
                    <Check className="w-4 h-4 text-[#ffe24c] shrink-0 mt-0.5" />
                    <span>1-Click Remedial Micro-Quiz Dispatcher</span>
                  </div>
                  <div className="flex items-start gap-2.5 text-xs text-gray-200">
                    <Check className="w-4 h-4 text-[#ffe24c] shrink-0 mt-0.5" />
                    <span>Automated Smart Peer Matchmaker</span>
                  </div>
                  <div className="flex items-start gap-2.5 text-xs text-gray-200">
                    <Check className="w-4 h-4 text-[#ffe24c] shrink-0 mt-0.5" />
                    <span>Moodle & Canvas LTI 1.3 Integration</span>
                  </div>
                  <div className="flex items-start gap-2.5 text-xs text-gray-200">
                    <Check className="w-4 h-4 text-[#ffe24c] shrink-0 mt-0.5" />
                    <span>NAAC Criterion 2.3 & NBA OBE Dossiers</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-white/10">
                <button
                  onClick={() => handleSelectPlanToRegister('Campus Department (Cohort Triage)', 'campus')}
                  className="w-full py-3.5 rounded-full bg-[#ffe24c] text-black text-xs font-extrabold hover:bg-[#fcd51a] transition-all shadow-lg flex items-center justify-center gap-1.5"
                >
                  <span>Select Campus Plan</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Card 4: University Enterprise */}
            <div className="bg-white rounded-[32px] p-7 border border-gray-200 shadow-sm flex flex-col justify-between hover:shadow-lg transition-shadow">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 rounded-full bg-[#e8f0fe] text-[#0f62fe] text-[11px] font-bold uppercase">
                    Sovereign Cloud
                  </span>
                  <ShieldCheck className="w-5 h-5 text-[#0f62fe]" />
                </div>
                <h3 className="font-display text-2xl font-bold text-black mb-1">University Enterprise</h3>
                <p className="text-xs text-gray-500 mb-6">For autonomous university systems and state AICTE networks (1,000+ seats).</p>
                
                <div className="mb-6">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-black text-black">
                      {billingCycle === 'annual' ? '₹249' : '₹299'}
                    </span>
                    <span className="text-xs text-gray-500 font-semibold">/ student / sem</span>
                  </div>
                  <p className="text-[11px] text-[#0f62fe] font-semibold mt-1">
                    Volume discounts below ₹99 for &gt;10K seats
                  </p>
                </div>

                <div className="space-y-3 pt-6 border-t border-gray-100">
                  <div className="flex items-start gap-2.5 text-xs text-gray-700">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>Dedicated IBM Cloud VPC / OpenShift</strong></span>
                  </div>
                  <div className="flex items-start gap-2.5 text-xs text-gray-700">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Custom Curriculum Knowledge DAG Ingestion</span>
                  </div>
                  <div className="flex items-start gap-2.5 text-xs text-gray-700">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Full Indian Data Sovereignty (NEP 2020)</span>
                  </div>
                  <div className="flex items-start gap-2.5 text-xs text-gray-700">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>99.95% Enterprise SLA + 24/7 Dedicated SRE</span>
                  </div>
                  <div className="flex items-start gap-2.5 text-xs text-gray-700">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Custom SAML SSO & Campus ERP Sync</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-100">
                <button
                  onClick={() => handleSelectPlanToRegister('University Enterprise (Sovereign Cloud)', 'enterprise')}
                  className="w-full py-3 rounded-full bg-black text-white text-xs font-bold hover:bg-gray-800 transition-colors flex items-center justify-center gap-1.5"
                >
                  <span>Request Enterprise RFP</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </div>

          {/* INTERACTIVE COST & COGNITIVE IMPACT ESTIMATOR */}
          <div className="bg-[#181a17] text-white rounded-[36px] p-8 md:p-12 border border-white/10 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#ffe24c]/5 rounded-full blur-3xl pointer-events-none"></div>
            
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-8 border-b border-white/10 mb-8">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ffe24c]/20 text-[#ffe24c] text-[11px] font-bold uppercase tracking-wider mb-2">
                  <Calculator className="w-3.5 h-3.5" />
                  Live Institutional Cost Estimator
                </div>
                <h3 className="font-display text-2xl md:text-3xl font-bold">
                  Calculate your institution's estimated investment & ROI
                </h3>
                <p className="text-gray-400 text-xs md:text-sm mt-1">
                  Simulate cohort sizing, semester duration, and projected faculty hours saved in real time.
                </p>
              </div>

              {/* Plan Switcher Pills */}
              <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-white/5 border border-white/10 shrink-0 overflow-x-auto">
                <button
                  onClick={() => setSelectedPlanForEstimator('campus')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    selectedPlanForEstimator === 'campus'
                      ? 'bg-[#ffe24c] text-black shadow-md'
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  Campus Department
                </button>
                <button
                  onClick={() => setSelectedPlanForEstimator('enterprise')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    selectedPlanForEstimator === 'enterprise'
                      ? 'bg-[#0f62fe] text-white shadow-md'
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  University Enterprise
                </button>
                <button
                  onClick={() => setSelectedPlanForEstimator('pro')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    selectedPlanForEstimator === 'pro'
                      ? 'bg-purple-600 text-white shadow-md'
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  Individual Pro Bulk
                </button>
              </div>
            </div>

            {/* Controls & Real-Time Output */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              
              {/* Sliders and Config (Col 7) */}
              <div className="lg:col-span-7 space-y-8">
                
                {/* Number of Students Slider */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-300 flex items-center gap-1.5">
                      <Users className="w-4 h-4 text-[#ffe24c]" />
                      Cohort Sizing (Active Engineering Students)
                    </label>
                    <span className="px-3.5 py-1 rounded-xl bg-white/10 font-mono text-sm font-bold text-[#ffe24c]">
                      {studentSeats.toLocaleString('en-IN')} Students
                    </span>
                  </div>
                  <input
                    type="range"
                    min={50}
                    max={5000}
                    step={50}
                    value={studentSeats}
                    onChange={(e) => setStudentSeats(Number(e.target.value))}
                    className="w-full h-2.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#ffe24c]"
                  />
                  <div className="flex justify-between text-[11px] text-gray-500 mt-2 font-mono">
                    <span>50 (Single Lab)</span>
                    <span>500 (Department)</span>
                    <span>2,000 (Entire College)</span>
                    <span>5,000+ (Autonomous Univ)</span>
                  </div>
                </div>

                {/* Duration Semesters */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-3 flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-[#ffe24c]" />
                    Program Duration
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { sems: 1, label: '1 Semester', sub: '6 Months Pilot' },
                      { sems: 2, label: '1 Academic Year', sub: '2 Semesters' },
                      { sems: 8, label: '4-Year Degree', sub: '8 Semesters (B.Tech)' }
                    ].map((item) => (
                      <button
                        key={item.sems}
                        type="button"
                        onClick={() => setDurationSemesters(item.sems)}
                        className={`p-3.5 rounded-2xl border text-left transition-all ${
                          durationSemesters === item.sems
                            ? 'border-[#ffe24c] bg-[#ffe24c]/10 text-white'
                            : 'border-white/10 bg-white/5 text-gray-400 hover:border-white/20'
                        }`}
                      >
                        <p className="text-xs font-bold">{item.label}</p>
                        <p className="text-[10px] text-gray-400 mt-0.5">{item.sub}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* FinOps Efficiency Banner */}
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#ffe24c]/20 text-[#ffe24c] flex items-center justify-center shrink-0">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">
                      FinOps Cloud Advantage: ₹6.60 ($0.08) / student / month
                    </p>
                    <p className="text-[11px] text-gray-400">
                      Our deterministic 2PL-IRT kernel runs on native Python/TS, saving 94% on cloud inference vs OpenAI-dependent wrappers.
                    </p>
                  </div>
                </div>

              </div>

              {/* Output Summary Card (Col 5) */}
              <div className="lg:col-span-5 bg-gradient-to-b from-white/10 to-white/5 rounded-3xl p-7 border border-white/15 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-5">
                    <span className="text-xs text-gray-400 uppercase font-semibold">Estimated Total</span>
                    <span className="px-2.5 py-1 rounded-full bg-[#ffe24c]/20 text-[#ffe24c] text-[10px] font-bold uppercase">
                      {durationSemesters === 1 ? '1 Semester' : `${durationSemesters} Semesters`}
                    </span>
                  </div>

                  <div className="mb-6">
                    <div className="flex items-baseline gap-2">
                      <span className="font-display text-4xl md:text-5xl font-extrabold text-white">
                        ₹{totalEstimatedInvestment.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1.5 flex items-center gap-2">
                      <span>Effective:</span>
                      <strong className="text-white font-mono">₹{effectiveCostPerStudentMo} / student / mo</strong>
                    </p>
                  </div>

                  {/* Impact Stats Grid */}
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    <div className="bg-black/30 rounded-2xl p-3 border border-white/5">
                      <p className="text-[10px] text-gray-400 uppercase font-bold">Faculty Hours Saved</p>
                      <p className="text-lg font-black text-[#ffe24c] mt-0.5">
                        ~{estimatedFacultyHoursSaved} hrs
                      </p>
                      <p className="text-[10px] text-gray-500">83% less grading overhead</p>
                    </div>
                    <div className="bg-black/30 rounded-2xl p-3 border border-white/5">
                      <p className="text-[10px] text-gray-400 uppercase font-bold">Retention Gain</p>
                      <p className="text-lg font-black text-emerald-400 mt-0.5">
                        +35.4%
                      </p>
                      <p className="text-[10px] text-gray-500">UCI predictive model</p>
                    </div>
                  </div>

                  {/* Operational cloud cost */}
                  <div className="text-[11px] text-gray-400 space-y-1.5 pb-4 border-b border-white/10">
                    <div className="flex justify-between">
                      <span>Cloud Infra Baseline:</span>
                      <span className="font-mono text-gray-300">~₹{finOpsInfrastructureMonthly} / mo</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Grading Hallucination:</span>
                      <span className="font-mono text-emerald-400 font-bold">0.00% Guaranteed</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <button
                    onClick={() => handleSelectPlanToRegister(
                      selectedPlanForEstimator === 'campus'
                        ? 'Campus Department (Cohort Triage)'
                        : selectedPlanForEstimator === 'enterprise'
                        ? 'University Enterprise (Sovereign Cloud)'
                        : 'Pro Scholar Student Bulk License',
                      selectedPlanForEstimator
                    )}
                    className="w-full py-3.5 rounded-full bg-[#ffe24c] text-black text-xs font-black hover:bg-[#fcd51a] transition-all flex items-center justify-center gap-2 shadow-lg"
                  >
                    <span>Apply to Registration Form</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* 4. INSTITUTIONAL TIE-UP & PURCHASE REGISTRATION FORM */}
      <section className="w-full bg-[#111210] text-white py-20 border-t border-white/10" id="institutional-registration-form">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12">
          
          {/* Form Header with Direct Call Option */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#ffe24c] text-black text-xs font-bold uppercase tracking-wider mb-4">
                <Building2 className="w-3.5 h-3.5" />
                Academic Partnership & Procurement Portal
              </div>
              <h2 className="font-display text-3xl md:text-5xl font-bold tracking-tight text-white mb-4">
                Ready to tie up with Skill-Bee & IBM SkillsBuild?
              </h2>
              <p className="text-gray-400 text-sm md:text-base leading-relaxed">
                Equip your engineering college with real-time adaptive cognitive intelligence. Submit the official partnership inquiry below or connect directly with our Institutional Partnerships Desk.
              </p>
            </div>

            {/* Direct Call Button Card */}
            <div className="shrink-0 flex flex-col sm:flex-row lg:flex-col items-start lg:items-end gap-3">
              <a
                href="tel:+918928116684"
                className="inline-flex items-center gap-3 px-6 py-3.5 rounded-full bg-[#ffe24c] text-black font-bold text-sm shadow-xl hover:bg-[#fcd51a] hover:scale-105 transition-all group"
              >
                <div className="w-8 h-8 rounded-full bg-black text-[#ffe24c] flex items-center justify-center shrink-0 group-hover:rotate-12 transition-transform">
                  <Phone className="w-4 h-4 fill-current" />
                </div>
                <div className="text-left">
                  <span className="block text-[10px] uppercase font-black tracking-wider text-black/70">
                    Direct Call / Partnerships Desk
                  </span>
                  <span className="text-sm font-black font-mono tracking-tight text-black">
                    +91 89281 16684
                  </span>
                </div>
              </a>
              <span className="text-[11px] text-gray-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                Instant Hotline: Mon–Sat 9:00 AM – 7:30 PM IST
              </span>
            </div>
          </div>

          {/* Conditional: Show Submitted Success Screen OR The Live Form */}
          {partnerSubmittedData ? (
            <div className="bg-[#181a17] rounded-[36px] p-8 md:p-14 border border-[#ffe24c]/40 shadow-2xl max-w-2xl mx-auto text-center">
              <div className="w-20 h-20 rounded-full bg-[#ffe24c]/20 text-[#ffe24c] flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <span className="px-3.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-mono font-bold tracking-wide">
                INQUIRY LOGGED SUCCESSFULLY
              </span>
              <h3 className="font-display text-3xl font-bold text-white mt-4 mb-2">
                Thank you, {partnerSubmittedData.name}!
              </h3>
              <p className="text-gray-300 text-sm max-w-md mx-auto mb-6">
                Your partnership proposal request for <strong className="text-white">{partnerSubmittedData.institution}</strong> has been logged under reference code:
              </p>
              
              <div className="p-4 rounded-2xl bg-black/50 border border-white/10 font-mono text-lg font-bold text-[#ffe24c] mb-6 inline-block px-8">
                {partnerSubmittedData.refId}
              </div>

              <p className="text-xs text-gray-400 mb-8 max-w-md mx-auto leading-relaxed">
                Selected Plan: <strong>{partnerSubmittedData.plan}</strong><br />
                Our AICTE Higher Education Partnership Lead will contact you via your institutional email within <strong>2 business hours</strong> with the customized pilot dossier.
              </p>

              <div className="p-3.5 rounded-2xl bg-[#ffe24c]/10 border border-[#ffe24c]/30 text-xs text-gray-300 mb-8 max-w-md mx-auto flex items-center justify-center gap-2">
                <Phone className="w-4 h-4 text-[#ffe24c] shrink-0 fill-current" />
                <span>Prefer an immediate call? <a href="tel:+918928116684" className="text-[#ffe24c] font-black font-mono underline hover:text-[#fcd51a]">+91 89281 16684</a></span>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <a
                  href="/pitch_deck.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 rounded-full bg-[#ffe24c] text-black text-xs font-bold hover:bg-[#fcd51a] transition-all flex items-center gap-2"
                >
                  <FileText className="w-4 h-4" />
                  <span>View Solution Pitch Deck (8 Slides)</span>
                </a>
                <button
                  onClick={() => setPartnerSubmittedData(null)}
                  className="px-6 py-3 rounded-full bg-white/10 text-white text-xs font-bold hover:bg-white/20 transition-all"
                >
                  Submit Another Inquiry
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
              
              {/* Left Column: Why Partner With Us / Trust Pillars */}
              <div className="lg:col-span-5 space-y-6">
                <div className="bg-[#181a17] rounded-[32px] p-8 border border-white/10 space-y-6">
                  <h4 className="font-display text-xl font-bold text-white flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-[#ffe24c]" />
                    The Institutional Partner Guarantee
                  </h4>

                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-white/10 text-[#ffe24c] flex items-center justify-center shrink-0 font-bold text-xs">
                        1
                      </div>
                      <div>
                        <h5 className="text-xs font-bold text-white">60-Day No-Obligation Campus Pilot</h5>
                        <p className="text-[11px] text-gray-400 mt-0.5">
                          Deploy Skill-Bee across up to 250 engineering students in one target course (e.g. 4th-Sem Math or CS) at zero cost.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-white/10 text-[#ffe24c] flex items-center justify-center shrink-0 font-bold text-xs">
                        2
                      </div>
                      <div>
                        <h5 className="text-xs font-bold text-white">NAAC & NBA Accreditation Alignment</h5>
                        <p className="text-[11px] text-gray-400 mt-0.5">
                          Automated Course Outcome (CO) and Program Outcome (PO) mapping fulfilling NAAC Criterion 2.3 for cognitive learning.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-white/10 text-[#ffe24c] flex items-center justify-center shrink-0 font-bold text-xs">
                        3
                      </div>
                      <div>
                        <h5 className="text-xs font-bold text-white">Zero Grading Hallucinations</h5>
                        <p className="text-[11px] text-gray-400 mt-0.5">
                          Unlike black-box LLM chatbots, our 2PL-IRT kernel ensures all diagnostic ability assessments are 100% mathematically reproducible.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Direct Call Highlight Box */}
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-[#ffe24c]/15 via-white/5 to-transparent border border-[#ffe24c]/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-[#ffe24c] text-black flex items-center justify-center shrink-0">
                        <Phone className="w-4 h-4 fill-current" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-white">Direct Partnerships Line</p>
                        <p className="text-[10px] text-gray-400">Speak with AICTE Solutions Director</p>
                      </div>
                    </div>
                    <a
                      href="tel:+918928116684"
                      className="px-4 py-2 rounded-full bg-[#ffe24c] text-black text-xs font-black font-mono hover:bg-[#fcd51a] hover:scale-105 transition-all shrink-0 flex items-center gap-1.5"
                    >
                      <span>+91 89281 16684</span>
                    </a>
                  </div>

                  <div className="p-4 rounded-2xl bg-black/40 border border-white/5 flex items-center gap-3">
                    <School className="w-8 h-8 text-[#ffe24c] shrink-0" />
                    <div className="text-[11px] text-gray-400">
                      <strong className="text-white">IBM SkillsBuild Ready:</strong> Integrated digital credentialing and curriculum bridge for autonomous universities.
                    </div>
                  </div>

                  <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-2 text-xs text-gray-400">
                    <span>Direct Inquiries:</span>
                    <div className="flex items-center gap-3 font-mono text-xs">
                      <a href="tel:+918928116684" className="text-[#ffe24c] hover:underline font-bold">
                        +91 89281 16684
                      </a>
                      <span className="text-gray-600">•</span>
                      <a href="mailto:partnerships@skillbee.ibm.edu" className="text-gray-300 hover:underline">
                        partnerships@skillbee.ibm.edu
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: The Registration Purchase Form */}
              <div className="lg:col-span-7 bg-[#181a17] rounded-[36px] p-8 md:p-10 border border-white/10 shadow-xl">
                <form onSubmit={handlePartnerSubmit} className="space-y-6">
                  
                  {/* Row 1: Name & Official Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2">
                        Your Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={partnerForm.name}
                        onChange={(e) => setPartnerForm({ ...partnerForm, name: e.target.value })}
                        placeholder="Dr. Anand Sharma"
                        className="w-full bg-black/40 border border-white/15 rounded-2xl px-4 py-3 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-[#ffe24c] transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2">
                        Institutional Email *
                      </label>
                      <input
                        type="email"
                        required
                        value={partnerForm.email}
                        onChange={(e) => setPartnerForm({ ...partnerForm, email: e.target.value })}
                        placeholder="hod.cse@rvce.edu.in"
                        className="w-full bg-black/40 border border-white/15 rounded-2xl px-4 py-3 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-[#ffe24c] transition-colors"
                      />
                    </div>
                  </div>

                  {/* Row 2: Institution & Role */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2">
                        University / Institution Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={partnerForm.institution}
                        onChange={(e) => setPartnerForm({ ...partnerForm, institution: e.target.value })}
                        placeholder="e.g. RV College of Engineering"
                        className="w-full bg-black/40 border border-white/15 rounded-2xl px-4 py-3 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-[#ffe24c] transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2">
                        Your Role / Designation
                      </label>
                      <select
                        value={partnerForm.role}
                        onChange={(e) => setPartnerForm({ ...partnerForm, role: e.target.value })}
                        className="w-full bg-black/40 border border-white/15 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#ffe24c] transition-colors"
                      >
                        <option value="Dean / Academic Director">Dean / Academic Director</option>
                        <option value="Head of Department (HOD)">Head of Department (HOD)</option>
                        <option value="Professor / Associate Faculty">Professor / Associate Faculty</option>
                        <option value="Training & Placement Officer (TPO)">Training & Placement Officer (TPO)</option>
                        <option value="Student Council Representative">Student Council Representative</option>
                        <option value="Corporate / EdTech Partner">Corporate / EdTech Partner</option>
                      </select>
                    </div>
                  </div>

                  {/* Row 3: Plan of Interest */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2">
                      Plan of Interest / Purchase Intent
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {[
                        'Campus Department (Cohort Triage)',
                        'University Enterprise (Sovereign Cloud)',
                        'Pro Scholar Student Bulk License',
                        'Free 60-Day Department Pilot'
                      ].map((planName) => (
                        <button
                          key={planName}
                          type="button"
                          onClick={() => setPartnerForm({ ...partnerForm, plan: planName })}
                          className={`p-3 rounded-2xl border text-left text-xs font-bold transition-all ${
                            partnerForm.plan === planName
                              ? 'border-[#ffe24c] bg-[#ffe24c]/15 text-[#ffe24c]'
                              : 'border-white/10 bg-black/30 text-gray-400 hover:border-white/20'
                          }`}
                        >
                          {planName}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Row 4: Estimated Cohort Size & Contact Number */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2">
                        Estimated Cohort Size
                      </label>
                      <select
                        value={partnerForm.cohortSize}
                        onChange={(e) => setPartnerForm({ ...partnerForm, cohortSize: e.target.value })}
                        className="w-full bg-black/40 border border-white/15 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#ffe24c] transition-colors"
                      >
                        <option value="100 – 500 Students">100 – 500 Students (Single Department)</option>
                        <option value="500 – 2,000 Students">500 – 2,000 Students (Full Engineering Wing)</option>
                        <option value="2,000 – 5,000 Students">2,000 – 5,000 Students (Autonomous Campus)</option>
                        <option value="5,000+ Students">5,000+ Students (Multi-Campus / State Network)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2">
                        Phone / WhatsApp (Optional)
                      </label>
                      <input
                        type="tel"
                        value={partnerForm.phone}
                        onChange={(e) => setPartnerForm({ ...partnerForm, phone: e.target.value })}
                        placeholder="+91 98765 43210"
                        className="w-full bg-black/40 border border-white/15 rounded-2xl px-4 py-3 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-[#ffe24c] transition-colors"
                      />
                    </div>
                  </div>

                  {/* Row 5: Notes & Specific Requirements */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2">
                      Specific Requirements / Syllabus Context
                    </label>
                    <textarea
                      rows={3}
                      value={partnerForm.notes}
                      onChange={(e) => setPartnerForm({ ...partnerForm, notes: e.target.value })}
                      placeholder="e.g. Seeking automated prerequisite detection for 4th-Sem Machine Learning & NAAC accreditation compliance."
                      className="w-full bg-black/40 border border-white/15 rounded-2xl px-4 py-3 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-[#ffe24c] transition-colors resize-none"
                    ></textarea>
                  </div>

                  {/* Submit Button */}
                  <div>
                    <button
                      type="submit"
                      disabled={isSubmittingPartner}
                      className="w-full py-4 rounded-full bg-[#ffe24c] text-black text-sm font-black hover:bg-[#fcd51a] transition-all shadow-xl flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
                    >
                      {isSubmittingPartner ? (
                        <>
                          <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                          <span>Generating Official Partnership Proposal...</span>
                        </>
                      ) : (
                        <>
                          <span>Submit Institutional Tie-Up & Purchase Request</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                    <p className="text-[11px] text-gray-500 text-center mt-3">
                      By submitting, you consent to receiving an academic proposal and pilot onboarding materials from the Skill-Bee team.
                    </p>
                  </div>

                </form>
              </div>

            </div>
          )}

        </div>
      </section>
    </div>
  );
};

// =========================================================================
// 2. COLD-START CAT ASSESSMENT VIEW (Screen 2)
// =========================================================================
export const ColdStartCATView: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  // Requirement 4: Student onboarding classroom joining step
  const [hasJoinedClassroom, setHasJoinedClassroom] = useState(false);
  const [classroomCode, setClassroomCode] = useState('CS302-SHARMA-2026');
  const [isClassroomValid, setIsClassroomValid] = useState(true);

  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [theta, setTheta] = useState(0.0);
  const [standardError, setStandardError] = useState(0.65);
  const [masteryLevel, setMasteryLevel] = useState<string>('CALIBRATING');
  const [accumulatedResponses, setAccumulatedResponses] = useState<{ question_id: string; is_correct: boolean; topic: string }[]>([]);
  const [deltaHistory, setDeltaHistory] = useState<number[]>([]);
  const [isDone, setIsDone] = useState(false);
  const [backendEvaluated, setBackendEvaluated] = useState(false);

  const question = MATHE_QUESTION_BANK[currentIdx];

  const handleSelectOption = async (idx: number) => {
    setSelectedOpt(idx);
    const isCorrect = idx === question.correctIndex;
    
    // Local calculation immediately for instant feedback
    const { newTheta, delta } = updateThetaBayesian(theta, isCorrect, question.discrimination_a, question.difficulty_b);
    setTheta(newTheta);
    setDeltaHistory((prev) => [...prev, delta]);

    const updatedResponses = [
      ...accumulatedResponses,
      { question_id: question.id, is_correct: isCorrect, topic: question.topic }
    ];
    setAccumulatedResponses(updatedResponses);

    // Call FastAPI backend CAT endpoint
    try {
      const res = await ApiClient.evaluateCAT(updatedResponses);
      setTheta(res.theta);
      setStandardError(res.standard_error);
      setMasteryLevel(res.mastery_level);
      setBackendEvaluated(true);
    } catch (e) {
      // Local graceful fallback already applied above
      setStandardError(Math.max(0.18, 0.65 / Math.sqrt(updatedResponses.length + 1)));
    }
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
        
        {/* STEP 1: CLASSROOM JOINING WITH UNIQUE CODE (Requirement 4) */}
        {!hasJoinedClassroom ? (
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-[#ffe24c] text-black text-xs font-bold uppercase">
                Student Onboarding • Step 1 of 2
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-800 text-[10px] font-bold">
                College Section Sync
              </span>
            </div>

            <div>
              <h2 className="font-display text-2xl md:text-3xl font-bold text-black tracking-tight">
                Join Your Teacher&apos;s Active Classroom
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                Enter the unique enrollment code provided by your course professor to synchronize your curriculum and ICU diagnostics.
              </p>
            </div>

            {/* Input card */}
            <div className="p-6 rounded-[28px] bg-[#fbf9f6] border border-gray-200 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-2">
                  Enter Unique Classroom Code
                </label>
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <div className="relative flex-1 w-full">
                    <School className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={classroomCode}
                      onChange={(e) => {
                        const val = e.target.value.toUpperCase();
                        setClassroomCode(val);
                        setIsClassroomValid(val.startsWith('CS302') || val.length >= 5);
                      }}
                      placeholder="e.g. CS302-SHARMA-2026"
                      className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white border border-gray-300 font-mono text-xs font-bold tracking-wider focus:outline-none focus:border-black uppercase"
                    />
                  </div>
                  <button
                    onClick={() => {
                      if (classroomCode.trim()) setHasJoinedClassroom(true);
                    }}
                    className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-black text-white text-xs font-bold hover:scale-105 transition-all flex items-center justify-center gap-2 shrink-0 shadow-sm"
                  >
                    <span>Verify Code & Join</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Verified Teacher Card Preview */}
              {isClassroomValid && (
                <div className="p-4 rounded-2xl bg-white border border-emerald-200 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm">
                      👩‍🏫
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-black">Dr. Sunita Sharma</span>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold">
                          ✓ Verified Faculty
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-500">
                        CS302: Applied Engineering Mathematics & Deep Learning • Section B
                      </p>
                    </div>
                  </div>
                  <div className="text-right hidden sm:block">
                    <span className="text-xs font-bold text-black">45 Enrolled</span>
                    <p className="text-[10px] text-gray-400">Classroom Active</p>
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 text-xs text-amber-900 flex items-center gap-3">
              <span className="text-base">💡</span>
              <p>
                <strong>Why link a classroom?</strong> Skillbee bridges Dr. Sharma&apos;s lecture topics directly with industry-standard IBM SkillsBuild modules, eliminating prerequisite hurdles before exams.
              </p>
            </div>
          </div>
        ) : (
          /* STEP 2: COGNITIVE 2PL-IRT CALIBRATION ASSESSMENT */
          <div>
            <div className="flex items-center justify-between pb-6 border-b border-gray-100 mb-8">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-[#ffe24c] text-black text-xs font-bold uppercase">
                    MathE Calibrated Diagnostic
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-mono font-bold">
                    Class: CS302 (Dr. Sharma)
                  </span>
                  {backendEvaluated && (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-mono font-bold">
                      FastAPI Synced
                    </span>
                  )}
                </div>
                <h2 className="font-display text-2xl md:text-3xl font-bold text-black mt-2">
                  Cold-Start Computerized Adaptive Test (CAT)
                </h2>
                <p className="text-xs text-gray-500 mt-1">Item {currentIdx + 1} of {MATHE_QUESTION_BANK.length} • Calibrating Latent Ability θ</p>
              </div>

              {/* Theta Ability Gauge with Plain English Meaning */}
              <div className="bg-[#fbf9f6] p-4 rounded-2xl border border-gray-200 text-center min-w-[170px]">
                <p className="text-[10px] uppercase font-bold text-gray-500">Latent Ability Score (θ)</p>
                <div className="font-display text-2xl font-bold text-[#0f62fe]">
                  {theta > 0 ? `+${theta.toFixed(2)}` : theta.toFixed(2)}
                </div>
                <p className="text-[9px] text-gray-500 font-mono mt-0.5">SE: ±{standardError.toFixed(2)}</p>
                <p className="text-[9px] text-emerald-600 font-bold">2PL-IRT Adaptive Score</p>
                <p className="text-[9px] text-gray-400 mt-1 border-t border-gray-200 pt-1 leading-tight">
                  📖 <strong>Plain English:</strong> Skill score from -3 (beginner) to +3 (expert).
                </p>
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

                  {/* Proper KaTeX Rendered Formula (Requirement 6) */}
                  {question.latexEquation && (
                    <div className="bg-[#fbf9f6] p-4 rounded-2xl border border-gray-200 my-4 text-center">
                      <Latex block>{question.latexEquation}</Latex>
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
                  Your baseline latent ability has been calibrated to <strong>θ = {theta > 0 ? `+${theta.toFixed(2)}` : theta.toFixed(2)}</strong> (SE ±{standardError.toFixed(2)}). Prerequisite bridges have unlocked your personalized AI Engineer Roadmap for Dr. Sharma&apos;s section.
                </p>
                <div className="mt-4 inline-block px-3 py-1 rounded-full bg-[#ffe24c]/30 text-amber-950 text-xs font-mono font-bold">
                  Cognitive Level: {masteryLevel}
                </div>
                <div className="mt-6">
                  <button
                    onClick={onComplete}
                    className="px-8 py-3.5 rounded-full bg-black text-white text-xs font-bold hover:scale-105 transition-all shadow-md"
                  >
                    Open Dual-Horizon Dashboard 🐝
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
