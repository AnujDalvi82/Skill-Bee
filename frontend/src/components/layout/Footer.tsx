'use client';

import React from 'react';
import { Sparkles, Shield, Cpu, ExternalLink, ArrowUp, GraduationCap, School, Heart, CheckCircle2 } from 'lucide-react';
import { DemoView } from './PitchNavigatorBar';

interface FooterProps {
  onNavigate?: (view: DemoView) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full bg-[#111210] text-[#f4f3ef] border-t border-[#262725] mt-24 relative overflow-hidden">
      {/* Subtle background ambient glows */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[300px] bg-[#ffe24c]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[300px] bg-[#0f62fe]/5 rounded-full blur-3xl pointer-events-none" />

      {/* Top Bar / Hackathon Banner */}
      <div className="border-b border-[#262725] bg-[#161715]/60 backdrop-blur-sm">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-mono text-gray-300">
              IBM BOB National Hackathon 2026 • Problem Statement #4 (Adaptive Cognitive Learning)
            </span>
          </div>

          <div className="flex items-center gap-4 text-gray-400 font-mono text-[11px]">
            <span className="flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-[#ffe24c]" />
              FERPA & GDPR Zero-Knowledge Compliant
            </span>
            <span className="hidden md:inline text-gray-600">•</span>
            <span className="hidden md:flex items-center gap-1.5 text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5" />
              16/16 Security Vulnerabilities Remediated
            </span>
          </div>
        </div>
      </div>

      {/* Main Multi-Column Content */}
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
          
          {/* Column 1: Brand & Core Mission (4 Cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#ffe24c] flex items-center justify-center text-black font-bold text-xl shadow-md">
                🐝
              </div>
              <div>
                <span className="font-display font-bold text-xl tracking-tight text-white">Skill-Bee</span>
                <span className="ml-2 px-2 py-0.5 rounded-full bg-[#ffe24c]/20 text-[#ffe24c] font-mono text-[10px] font-bold">
                  v2.4 LTS
                </span>
              </div>
            </div>

            <p className="text-xs text-gray-400 leading-relaxed max-w-sm">
              Closed-Loop Adaptive Learning Intelligence Platform bridging college engineering mathematics to industry AI competencies. Powered by 2PL Item Response Theory, LinUCB contextual multi-armed bandits, and real-time clinical faculty intervention.
            </p>

            <div className="pt-2 flex flex-wrap gap-2">
              <span className="px-3 py-1 rounded-full bg-[#1c1d1a] border border-[#2e302b] text-[11px] text-gray-300 font-mono">
                Python FastAPI
              </span>
              <span className="px-3 py-1 rounded-full bg-[#1c1d1a] border border-[#2e302b] text-[11px] text-gray-300 font-mono">
                Next.js 15
              </span>
              <span className="px-3 py-1 rounded-full bg-[#1c1d1a] border border-[#2e302b] text-[11px] text-gray-300 font-mono">
                KaTeX Math
              </span>
              <span className="px-3 py-1 rounded-full bg-[#1c1d1a] border border-[#2e302b] text-[11px] text-gray-300 font-mono">
                Fast-Whisper
              </span>
            </div>

            <div className="pt-2">
              <p className="text-[11px] text-gray-500 font-semibold">Institutional Partners & Benchmarks:</p>
              <p className="text-xs text-gray-400 mt-1 font-medium">
                MathE EU (N=162) • UCI Performance (N=649) • EdNet Benchmark (N=100K+)
              </p>
            </div>
          </div>

          {/* Column 2: Core Cognitive Subsystems (3 Cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-display font-bold text-xs uppercase tracking-wider text-[#ffe24c]">
              Cognitive Engine
            </h4>
            <ul className="space-y-2 text-xs text-gray-400">
              <li>
                <button
                  onClick={() => onNavigate?.('onboarding')}
                  className="hover:text-white transition-colors text-left flex items-center gap-1.5"
                >
                  <span>2PL-IRT Adaptive CAT Cold Start</span>
                  <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-white/10 text-gray-300">MathE</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate?.('roadmap')}
                  className="hover:text-white transition-colors text-left flex items-center gap-1.5"
                >
                  <span>Dual-Horizon Knowledge DAG</span>
                  <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-white/10 text-gray-300">Prereqs</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate?.('roadmap')}
                  className="hover:text-white transition-colors text-left flex items-center gap-1.5"
                >
                  <span>LinUCB Multi-Modal Content Swapper</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate?.('lecture')}
                  className="hover:text-white transition-colors text-left flex items-center gap-1.5"
                >
                  <span>Fast-Whisper Video Studio & Timeline</span>
                  <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-white/10 text-[#ffe24c]">3B1B</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate?.('lecture')}
                  className="hover:text-white transition-colors text-left flex items-center gap-1.5"
                >
                  <span>BeeBook Real-Time KaTeX Synthesizer</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Faculty & Institutional Tools (2 Cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="font-display font-bold text-xs uppercase tracking-wider text-[#ffe24c]">
              Faculty Radar
            </h4>
            <ul className="space-y-2 text-xs text-gray-400">
              <li>
                <button
                  onClick={() => onNavigate?.('faculty')}
                  className="hover:text-white transition-colors text-left"
                >
                  Cognitive ICU Triage
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate?.('faculty')}
                  className="hover:text-white transition-colors text-left"
                >
                  1-Click Micro-Bridge
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate?.('faculty')}
                  className="hover:text-white transition-colors text-left"
                >
                  Peer-to-Peer Matchmaker
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate?.('faculty')}
                  className="hover:text-white transition-colors text-left"
                >
                  1-Page Clinical Dossier
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate?.('proof')}
                  className="hover:text-white transition-colors text-left"
                >
                  UCI Model Diagnostics
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: IBM Integration & Standards (3 Cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-display font-bold text-xs uppercase tracking-wider text-[#ffe24c]">
              IBM Ecosystem
            </h4>
            <div className="p-4 rounded-2xl bg-[#181917] border border-[#2a2c28] space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#0f62fe]"></span>
                <span className="text-xs font-bold text-white">IBM SkillsBuild Ready</span>
              </div>
              <p className="text-[11px] text-gray-400 leading-normal">
                Seamless LTI 1.3 / OneRoster grade sync directly exporting verified mastery credentials into student SkillsBuild transcripts.
              </p>
              <div className="pt-2 border-t border-[#2a2c28] flex items-center justify-between text-[10px] text-gray-400 font-mono">
                <span>watsonx.ai Orchestrate</span>
                <span className="text-emerald-400">Connected</span>
              </div>
            </div>

            <div className="pt-1 flex items-center gap-2">
              <button
                onClick={() => onNavigate?.('auth')}
                className="w-full py-2.5 px-3 rounded-xl bg-[#262725] hover:bg-[#333530] text-white text-xs font-bold transition-all text-center flex items-center justify-center gap-1.5"
              >
                <GraduationCap className="w-3.5 h-3.5 text-[#ffe24c]" />
                <span>Switch Portal / Re-Authenticate</span>
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Sub-Footer / Copyright & Quick Jump */}
      <div className="border-t border-[#222320] bg-[#0c0d0c] py-6">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <div className="flex flex-wrap items-center gap-3">
            <span>© 2026 Skill-Bee Learning Intelligence. All rights reserved.</span>
            <span className="text-gray-700">•</span>
            <span>Created for IBM BOB National Hackathon 2026</span>
            <span className="text-gray-700">•</span>
            <span className="text-gray-400">Problem Statement #4</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => onNavigate?.('proof')}
              className="text-gray-400 hover:text-white transition-colors text-xs flex items-center gap-1"
            >
              <span>Scientific Whitepaper & Datasets</span>
              <ExternalLink className="w-3 h-3" />
            </button>

            <button
              onClick={scrollToTop}
              className="p-2 rounded-xl bg-[#1c1d1b] hover:bg-[#282a26] text-gray-300 hover:text-white transition-all flex items-center gap-1 text-xs border border-[#333]"
              title="Return to top"
            >
              <ArrowUp className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Top</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
