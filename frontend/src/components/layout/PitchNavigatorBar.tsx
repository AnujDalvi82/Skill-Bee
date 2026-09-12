'use client';

import React from 'react';
import { Sparkles, Compass, Network, Video, ShieldAlert, Cpu } from 'lucide-react';

export type DemoView = 'hero' | 'onboarding' | 'roadmap' | 'lecture' | 'faculty' | 'proof';

interface PitchNavigatorBarProps {
  activeView: DemoView;
  setActiveView: (view: DemoView) => void;
  activeRole: 'STUDENT' | 'FACULTY';
  setActiveRole: (role: 'STUDENT' | 'FACULTY') => void;
}

export const PitchNavigatorBar: React.FC<PitchNavigatorBarProps> = ({
  activeView,
  setActiveView,
  activeRole,
  setActiveRole,
}) => {
  const views: { id: DemoView; label: string; icon: any; badge?: string }[] = [
    { id: 'hero', label: '1. Skillbee Showcase', icon: Sparkles },
    { id: 'onboarding', label: '2. Cold-Start CAT', icon: Compass, badge: 'MathE' },
    { id: 'roadmap', label: '3. Dual-Horizon DAG', icon: Network, badge: 'Bandit' },
    { id: 'lecture', label: '4. Video Studio', icon: Video, badge: 'BeeBook' },
    { id: 'faculty', label: '5. Faculty ICU Radar', icon: ShieldAlert, badge: 'UCI Model' },
    { id: 'proof', label: '6. Datasets & Tech', icon: Cpu },
  ];

  return (
    <div className="sticky top-0 z-50 bg-[#161616]/95 backdrop-blur-md border-b border-[#333333] text-white px-4 py-2.5 shadow-xl">
      <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Left: Brand Tag */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="w-8 h-8 rounded-xl bg-[#ffe24c] flex items-center justify-center text-black font-bold shadow-sm">
            ??
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-display font-bold text-sm tracking-tight text-white">Skill-Bee</span>
              <span className="px-1.5 py-0.5 rounded-full bg-[#ffe24c]/20 text-[#ffe24c] text-[10px] font-mono font-bold">
                IBM HACKATHON
              </span>
            </div>
            <p className="text-[11px] text-gray-400">Problem Statement #4: Adaptive Cognitive Engine</p>
          </div>
        </div>

        {/* Center: 1-Click Pitch Navigator Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          {views.map((v) => {
            const Icon = v.icon;
            const isActive = activeView === v.id;
            return (
              <button
                key={v.id}
                onClick={() => setActiveView(v.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 transition-all shrink-0 ${
                  isActive
                    ? 'bg-[#ffe24c] text-black font-bold shadow-md scale-105'
                    : 'bg-[#262626] text-gray-300 hover:bg-[#333333] hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{v.label}</span>
                {v.badge && (
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[9px] font-mono uppercase ${
                      isActive ? 'bg-black/15 text-black' : 'bg-black text-[#ffe24c]'
                    }`}
                  >
                    {v.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Right: Persona Toggle (Student vs Professor) */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="bg-[#262626] p-0.5 rounded-full flex items-center border border-[#393939]">
            <button
              onClick={() => {
                setActiveRole('STUDENT');
                if (activeView === 'faculty') setActiveView('roadmap');
              }}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                activeRole === 'STUDENT'
                  ? 'bg-[#0f62fe] text-white font-bold shadow-sm'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              ?? Rohan (Student)
            </button>
            <button
              onClick={() => {
                setActiveRole('FACULTY');
                setActiveView('faculty');
              }}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                activeRole === 'FACULTY'
                  ? 'bg-[#24a148] text-white font-bold shadow-sm'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              ????? Dr. Sharma (Faculty)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
