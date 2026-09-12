'use client';

import React, { useState, useEffect } from 'react';
import { PitchNavigatorBar, DemoView } from '@/components/layout/PitchNavigatorBar';
import { HeroShowcaseView, ColdStartCATView } from '@/components/views/CoreViews';
import { VideoLectureStudioView } from '@/components/views/StudioView';
import { FacultyCockpitView } from '@/components/views/FacultyView';
import { RoadmapDAGView } from '@/components/views/RoadmapView';
import { DatasetsProofView } from '@/components/views/ProofView';
import { AuthGatewayView } from '@/components/views/AuthGatewayView';
import { StudentDashboardView } from '@/components/views/StudentDashboardView';
import { TeacherDashboardView } from '@/components/views/TeacherDashboardView';
import { Footer } from '@/components/layout/Footer';
import { ApiClient } from '@/services/api';

export default function Home() {
  const [activeView, setActiveView] = useState<DemoView>('hero');
  const [activeRole, setActiveRole] = useState<'STUDENT' | 'FACULTY'>('STUDENT');
  const [authenticatedUser, setAuthenticatedUser] = useState<any | null>(null);
  const [isClientReady, setIsClientReady] = useState(false);

  // Initialize and synchronize session from local storage on mount
  useEffect(() => {
    const saved = ApiClient.getSavedUser();
    if (saved) {
      setAuthenticatedUser(saved);
      const role = (saved.role === 'FACULTY' ? 'FACULTY' : 'STUDENT') as 'STUDENT' | 'FACULTY';
      setActiveRole(role);
      // Landing page will ONLY show when user is NOT logged in.
      // If user is already logged in, navigate straight to their dashboard.
      setActiveView('dashboard');
    } else {
      setAuthenticatedUser(null);
      setActiveView('hero');
    }
    setIsClientReady(true);
  }, []);

  // Enforce rule: Landing page only shows when user is NOT logged in.
  useEffect(() => {
    if (isClientReady) {
      if (authenticatedUser && activeView === 'hero') {
        setActiveView('dashboard');
      } else if (!authenticatedUser && activeView === 'dashboard') {
        setActiveView('hero');
      }
    }
  }, [isClientReady, authenticatedUser, activeView]);

  const handleAuthSuccess = (user: any, role: 'STUDENT' | 'FACULTY') => {
    setAuthenticatedUser(user);
    setActiveRole(role);
    // Direct redirect to personalized dashboard
    setActiveView('dashboard');
  };

  const handleLogout = () => {
    // 1. Completely clear saved JWT and user profile from storage
    ApiClient.clearSession();
    // 2. Clear state
    setAuthenticatedUser(null);
    setActiveRole('STUDENT');
    // 3. Immediately redirect to public Landing Page
    setActiveView('hero');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fbf9f6] text-[#1b1c1a]">
      {/* Production Top Bar */}
      <PitchNavigatorBar
        activeView={activeView}
        setActiveView={setActiveView}
        activeRole={activeRole}
        setActiveRole={setActiveRole}
        authenticatedUser={authenticatedUser}
        onLogout={handleLogout}
      />

      {/* Main View Router */}
      <main className="flex-1 w-full">
        {activeView === 'auth' && (
          <AuthGatewayView
            onSuccess={handleAuthSuccess}
            onCancel={() => setActiveView(authenticatedUser ? 'dashboard' : 'hero')}
          />
        )}

        {/* Personalized Dashboards (Only for Logged-In Users) */}
        {activeView === 'dashboard' && (
          authenticatedUser ? (
            activeRole === 'STUDENT' ? (
              <StudentDashboardView onNavigate={(view) => setActiveView(view)} />
            ) : (
              <TeacherDashboardView onNavigate={(view) => setActiveView(view)} />
            )
          ) : (
            <HeroShowcaseView onNavigate={(view) => setActiveView(view)} />
          )
        )}

        {/* Landing Page (ONLY when user is NOT logged in) */}
        {activeView === 'hero' && (
          !authenticatedUser ? (
            <HeroShowcaseView onNavigate={(view) => setActiveView(view)} />
          ) : (
            activeRole === 'STUDENT' ? (
              <StudentDashboardView onNavigate={(view) => setActiveView(view)} />
            ) : (
              <TeacherDashboardView onNavigate={(view) => setActiveView(view)} />
            )
          )
        )}

        {activeView === 'onboarding' && (
          <ColdStartCATView onComplete={() => setActiveView('dashboard')} />
        )}

        {activeView === 'roadmap' && (
          <RoadmapDAGView onNavigate={(view) => setActiveView(view)} />
        )}

        {activeView === 'lecture' && (
          <VideoLectureStudioView onNavigate={(view) => setActiveView(view)} />
        )}

        {activeView === 'faculty' && (
          <FacultyCockpitView />
        )}

        {activeView === 'proof' && (
          <DatasetsProofView />
        )}
      </main>

      {/* Aesthetic Elongated Multi-Column Footer */}
      <Footer onNavigate={(view) => {
        // If logged in and clicks 'hero' in footer, redirect to dashboard
        if (authenticatedUser && view === 'hero') {
          setActiveView('dashboard');
        } else {
          setActiveView(view);
        }
      }} />
    </div>
  );
}
