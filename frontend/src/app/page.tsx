'use client';

import React, { useState } from 'react';
import { PitchNavigatorBar, DemoView } from '@/components/layout/PitchNavigatorBar';
import { HeroShowcaseView, ColdStartCATView } from '@/components/views/CoreViews';
import { VideoLectureStudioView } from '@/components/views/StudioView';
import { FacultyCockpitView } from '@/components/views/FacultyView';
import { RoadmapDAGView } from '@/components/views/RoadmapView';
import { DatasetsProofView } from '@/components/views/ProofView';

export default function Home() {
  const [activeView, setActiveView] = useState<DemoView>('hero');
  const [activeRole, setActiveRole] = useState<'STUDENT' | 'FACULTY'>('STUDENT');

  return (
    <div className="min-h-screen flex flex-col bg-[#fbf9f6] text-[#1b1c1a]">
      {/* Persistent Presenter Top Bar for Live Judging */}
      <PitchNavigatorBar
        activeView={activeView}
        setActiveView={setActiveView}
        activeRole={activeRole}
        setActiveRole={setActiveRole}
      />

      {/* Main View Router */}
      <main className="flex-1 w-full">
        {activeView === 'hero' && (
          <HeroShowcaseView onNavigate={(view) => setActiveView(view)} />
        )}

        {activeView === 'onboarding' && (
          <ColdStartCATView onComplete={() => setActiveView('roadmap')} />
        )}

        {activeView === 'roadmap' && (
          <RoadmapDAGView />
        )}

        {activeView === 'lecture' && (
          <VideoLectureStudioView />
        )}

        {activeView === 'faculty' && (
          <FacultyCockpitView />
        )}

        {activeView === 'proof' && (
          <DatasetsProofView />
        )}
      </main>

      {/* Branded Footer */}
      <footer className="w-full bg-[#f5f3f0] border-t border-gray-200 py-10 mt-16">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <div className="flex items-center gap-2">
            <span className="font-display font-bold text-sm text-black">Skill-Bee</span>
            <span>? Closed-Loop Learning Intelligence Platform</span>
            <span className="px-2 py-0.5 rounded-full bg-black/5 text-gray-600 font-mono text-[10px]">
              IBM BOB National Hackathon
            </span>
          </div>
          <div className="flex items-center gap-6">
            <span>Powered by IBM watsonx & SkillsBuild</span>
            <span>MathE ? EdNet ? UCI Benchmarked</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
