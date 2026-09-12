'use client';

import React, { useEffect, useState, useRef } from 'react';
import {
  Menu,
  X,
  User,
  Sparkles,
  Compass,
  Network,
  Video,
  ShieldAlert,
  Cpu,
  KeyRound,
  LogOut,
  ChevronDown,
  GraduationCap,
  School,
  CheckCircle2,
  ExternalLink,
  Flame,
  Zap,
  Users,
  AlertTriangle,
  BookOpen,
  Award,
  Layers,
  BarChart3,
  LayoutDashboard
} from 'lucide-react';
import { ApiClient, AuthResponse } from '@/services/api';

export type DemoView = 'dashboard' | 'auth' | 'hero' | 'onboarding' | 'roadmap' | 'lecture' | 'faculty' | 'proof';

interface PitchNavigatorBarProps {
  activeView: DemoView;
  setActiveView: (view: DemoView) => void;
  activeRole: 'STUDENT' | 'FACULTY';
  setActiveRole: (role: 'STUDENT' | 'FACULTY') => void;
  authenticatedUser?: AuthResponse['user'] | null;
  onLogout?: () => void;
}

export const PitchNavigatorBar: React.FC<PitchNavigatorBarProps> = ({
  activeView,
  setActiveView,
  activeRole,
  setActiveRole,
  authenticatedUser,
  onLogout,
}) => {
  const [backendOnline, setBackendOnline] = useState<boolean | null>(null);
  const [currentUser, setCurrentUser] = useState<AuthResponse['user'] | null>(authenticatedUser || null);
  const [jwtTokenPreview, setJwtTokenPreview] = useState<string | null>(null);

  // Dropdown & Hamburger states
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCurrentUser(authenticatedUser || null);
  }, [authenticatedUser]);

  const handlePerformLogout = () => {
    ApiClient.clearSession();
    setCurrentUser(null);
    setIsProfileOpen(false);
    setIsMobileMenuOpen(false);
    if (onLogout) {
      onLogout();
    } else {
      setActiveView('hero');
    }
  };

  useEffect(() => {
    // Check backend health
    ApiClient.checkBackendHealth().then((isOnline) => {
      setBackendOnline(isOnline);
    });

    // Close profile dropdown when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isLanding = activeView === 'hero';
  const isUserLoggedIn = !!currentUser;

  // 0. Landing Page Navigation Items
  const landingNavItems: { id: DemoView; label: string; icon: any }[] = [
    { id: 'hero', label: 'Platform Overview', icon: Sparkles },
    { id: 'lecture', label: 'Learning Studio', icon: Video },
    { id: 'roadmap', label: 'Knowledge DAG', icon: Network },
    { id: 'onboarding', label: 'Skill Diagnostics', icon: Compass },
    { id: 'proof', label: 'Mastery & Proof', icon: Award },
  ];

  // 1. Student-specific Desktop Nav Items
  const studentNavItems: { id: DemoView; label: string; icon: any }[] = [
    { id: 'dashboard', label: 'My Dashboard', icon: LayoutDashboard },
    { id: 'lecture', label: 'Learning Studio', icon: Video },
    { id: 'roadmap', label: 'Knowledge DAG', icon: Network },
    { id: 'onboarding', label: 'Skill Diagnostics', icon: Compass },
    { id: 'proof', label: 'Mastery & Proof', icon: Award },
  ];

  // 2. Teacher/Faculty-specific Desktop Nav Items
  const facultyNavItems: { id: DemoView; label: string; icon: any; alertBadge?: string }[] = [
    { id: 'dashboard', label: 'Class Dashboard', icon: LayoutDashboard },
    { id: 'faculty', label: 'Cohort ICU Radar', icon: ShieldAlert, alertBadge: '11 Red' },
    { id: 'roadmap', label: 'Curriculum DAG', icon: Network },
    { id: 'proof', label: 'UCI Failure Models', icon: BarChart3 },
  ];

  // 3. Student-specific Hamburger Menu Items
  const studentDrawerItems: { id: DemoView; label: string; description: string; icon: any; tag?: string }[] = [
    { id: 'dashboard', label: 'Student Dashboard', description: 'Attendance, absents, scores & recent video card', icon: LayoutDashboard, tag: 'Personal' },
    { id: 'lecture', label: '3B1B Interactive Studio', description: 'Video player, timeline scrub & whisper notes', icon: Video, tag: 'Active' },
    { id: 'roadmap', label: 'Dual-Horizon Knowledge DAG', description: 'Prerequisite map from college math to AI', icon: Network, tag: 'LinUCB' },
    { id: 'onboarding', label: '2PL-IRT Cold-Start CAT', description: 'Calibrated adaptive diagnostic assessment', icon: Compass, tag: 'MathE' },
    { id: 'proof', label: 'My Credentials & Datasets', description: 'EdNet accuracy, MathE mastery & IBM certs', icon: Award, tag: 'SkillsBuild' },
    { id: 'auth', label: 'Auth & Enrollment Portal', description: 'Switch student account or re-authenticate', icon: KeyRound, tag: 'FERPA' },
  ];

  // 4. Faculty-specific Hamburger Menu Items
  const facultyDrawerItems: { id: DemoView; label: string; description: string; icon: any; tag?: string }[] = [
    { id: 'dashboard', label: 'Teacher Command Dashboard', description: '74 enrolled, monthly attendance trends & student records', icon: LayoutDashboard, tag: 'Roster' },
    { id: 'faculty', label: 'Cognitive ICU Radar', description: 'Real-time triage of 74 enrolled students', icon: ShieldAlert, tag: 'Live Radar' },
    { id: 'roadmap', label: 'Section Syllabus DAG', description: 'Class prerequisite bottleneck analytics', icon: Network, tag: 'MathE' },
    { id: 'proof', label: 'UCI Predictive Failure Engine', description: 'Machine learning mid-term risk modeling', icon: BarChart3, tag: 'UCI Model' },
    { id: 'lecture', label: 'Curriculum Video Review', description: '3Blue1Brown Neural Networks lecture review', icon: Video, tag: '3B1B' },
    { id: 'auth', label: 'Faculty Auth Gateway', description: 'Manage institutional credentials & sections', icon: KeyRound, tag: 'FERPA' },
  ];

  // 5. Landing Page Drawer Items
  const landingDrawerItems: { id: DemoView; label: string; description: string; icon: any; tag?: string }[] = [
    { id: 'hero', label: 'Platform Overview', description: 'Skill-Bee cognitive platform overview', icon: Sparkles, tag: 'Showcase' },
    { id: 'lecture', label: '3B1B Interactive Studio', description: 'Video player, timeline scrub & BeeBot tutor', icon: Video, tag: 'RAG Tutor' },
    { id: 'roadmap', label: 'Knowledge DAG', description: 'Linear prerequisite tree from math to AI', icon: Network, tag: 'LinUCB' },
    { id: 'onboarding', label: 'Skill Diagnostics', description: '2PL-IRT adaptive cognitive assessment', icon: Compass, tag: 'MathE' },
    { id: 'proof', label: 'Mastery & Proof', description: 'EdNet accuracy, MathE mastery & IBM certs', icon: Award, tag: 'SkillsBuild' },
    { id: 'auth', label: 'Login & Registration', description: 'Sign in with demo Student or Teacher credentials', icon: KeyRound, tag: 'Demo Access' },
  ];

  return (
    <>
      {/* Sleek, Production Header with Clear Glass Landing Style */}
      <header className={`sticky top-0 z-50 backdrop-blur-xl border-b text-white transition-all ${
        isLanding || !isUserLoggedIn
          ? 'bg-[#111210]/80 border-white/10 shadow-sm'
          : activeRole === 'STUDENT'
          ? 'bg-[#111210]/94 border-[#262725]'
          : 'bg-[#0f1412]/95 border-[#1e2922]'
      }`}>
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          
          {/* Left: Brand Identity */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setActiveView(isUserLoggedIn ? 'dashboard' : 'hero')}
              className="flex items-center gap-2.5 group focus:outline-none"
            >
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-lg shadow-sm group-hover:scale-105 transition-transform ${
                !isUserLoggedIn
                  ? 'bg-[#ffe24c] text-black'
                  : activeRole === 'STUDENT' ? 'bg-[#ffe24c] text-black' : 'bg-[#24a148] text-white'
              }`}>
                {!isUserLoggedIn ? '🐝' : (activeRole === 'STUDENT' ? '🐝' : '👩‍🏫')}
              </div>
              <div className="text-left">
                <div className="flex items-center gap-2">
                  <span className="font-display font-bold text-base tracking-tight text-white group-hover:text-[#ffe24c] transition-colors">
                    Skill-Bee
                  </span>
                  {isUserLoggedIn ? (
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider ${
                      activeRole === 'STUDENT'
                        ? 'bg-[#0f62fe]/20 text-[#78a9ff] border border-[#0f62fe]/30'
                        : 'bg-[#24a148]/20 text-[#6fdc8c] border border-[#24a148]/30'
                    }`}>
                      {activeRole === 'STUDENT' ? 'Student Hub' : 'Faculty ICU'}
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-[#ffe24c]/15 text-[#ffe24c] border border-[#ffe24c]/30">
                      Cognitive AI
                    </span>
                  )}
                </div>
                <p className="text-[10px] text-gray-400 -mt-0.5 hidden sm:block">
                  {isUserLoggedIn
                    ? (activeRole === 'STUDENT' ? 'CS302 • AI Engineering Track' : 'CS302 • Dr. Sharma Cockpit')
                    : 'IBM watsonx & SkillsBuild Adaptive Platform'}
                </p>
              </div>
            </button>
          </div>

          {/* Center: Clear Navigation Links */}
          <nav className={`hidden md:flex items-center gap-1 px-2 py-1.5 rounded-full border ${
            isLanding || !isUserLoggedIn
              ? 'bg-[#181917]/80 border-white/10'
              : activeRole === 'STUDENT'
              ? 'bg-[#1a1b18] border-[#2d2f2b]'
              : 'bg-[#141d17] border-[#223328]'
          }`}>
            {(isLanding || !isUserLoggedIn ? landingNavItems : (activeRole === 'STUDENT' ? studentNavItems : facultyNavItems)).map((item) => {
              const Icon = item.icon;
              const isActive = activeView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveView(item.id)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 ${
                    isActive
                      ? isLanding || activeRole === 'STUDENT'
                        ? 'bg-[#ffe24c] text-black font-bold shadow-sm'
                        : 'bg-[#24a148] text-white font-bold shadow-sm'
                      : 'text-gray-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? (activeRole === 'FACULTY' && !isLanding && isUserLoggedIn ? 'text-white' : 'text-black') : 'text-gray-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right: Stats, Live Status, Profile Button & Hamburger */}
          <div className="flex items-center gap-2.5">

            {/* Quick Context Stats (Only when logged in) */}
            {isUserLoggedIn && (
              activeRole === 'STUDENT' ? (
                // Student Stats Pill
                <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-full bg-[#1c1d1a] border border-[#2d2f2b] text-xs">
                  <div className="flex items-center gap-1 text-amber-400 font-bold" title="Daily Learning Streak">
                    <Flame className="w-3.5 h-3.5 fill-amber-400" />
                    <span>12d</span>
                  </div>
                  <span className="text-gray-600">•</span>
                  <div className="flex items-center gap-1 text-[#ffe24c] font-bold font-mono" title="Honey XP Points">
                    <span>🐝 4,820 XP</span>
                  </div>
                </div>
              ) : (
                // Faculty Stats Pill
                <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-full bg-[#131f18] border border-[#223528] text-xs">
                  <div className="flex items-center gap-1 text-emerald-400 font-bold">
                    <Users className="w-3.5 h-3.5" />
                    <span>74 Enrolled</span>
                  </div>
                  <span className="text-gray-600">•</span>
                  <div
                    onClick={() => setActiveView('faculty')}
                    className="flex items-center gap-1 text-rose-400 font-bold cursor-pointer hover:underline"
                    title="11 Students in Red Critical Tier"
                  >
                    <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                    <span>11 At-Risk</span>
                  </div>
                </div>
              )
            )}
            
            {/* Live Backend Connection Indicator */}
            <div
              onClick={() => setShowAuthModal(true)}
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5 border border-white/10 cursor-pointer hover:border-white/30 transition-colors"
              title="Click to view API & JWT status"
            >
              <span className={`w-2 h-2 rounded-full ${backendOnline ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
              <span className="text-[11px] font-mono text-gray-300">
                {backendOnline ? 'FastAPI' : 'Local'}
              </span>
            </div>

            {/* If NOT logged in: SHOW PROFILE ICON TO LOGIN OR SIGN UP */}
            {!isUserLoggedIn ? (
              <button
                onClick={() => setActiveView('auth')}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#ffe24c] hover:bg-amber-300 text-black text-xs font-bold transition-all hover:scale-105 shadow-sm active:scale-95 group"
                title="Login or Sign Up with Demo Credentials"
              >
                <div className="w-5 h-5 rounded-full bg-black/10 flex items-center justify-center">
                  <User className="w-3.5 h-3.5 text-black" />
                </div>
                <span>Login / Sign Up</span>
                <span className="hidden sm:inline-block px-1.5 py-0.2 rounded-full bg-black text-[#ffe24c] text-[9px] font-mono font-bold">
                  Demo
                </span>
              </button>
            ) : (
              /* If logged in: Profile Icon with Dropdown */
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className={`flex items-center gap-2 p-1.5 pr-2.5 rounded-full border transition-all focus:outline-none shadow-sm ${
                    activeRole === 'STUDENT'
                      ? 'bg-[#1c1d1a] border-[#2d2f2b] hover:border-gray-500'
                      : 'bg-[#152219] border-[#24382a] hover:border-emerald-500'
                  }`}
                  aria-label="User Profile Menu"
                >
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-inner ${
                    activeRole === 'STUDENT' ? 'bg-[#0f62fe]' : 'bg-[#24a148]'
                  }`}>
                    {currentUser?.avatar || (activeRole === 'STUDENT' ? 'RV' : 'SS')}
                  </div>
                  <div className="text-left hidden lg:block">
                    <div className="text-xs font-bold leading-tight text-white flex items-center gap-1">
                      <span>{currentUser?.name?.split(' ')[0] || 'User'}</span>
                      <ChevronDown className={`w-3 h-3 text-gray-400 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
                    </div>
                    <div className="text-[10px] text-gray-400 leading-none capitalize">
                      {activeRole === 'STUDENT' ? 'Student' : 'Faculty Lead'}
                    </div>
                  </div>
                  <ChevronDown className="w-3 h-3 text-gray-400 lg:hidden" />
                </button>

                {/* Profile Dropdown Card */}
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-72 bg-[#181917] border border-[#2d2f2b] rounded-2xl shadow-2xl p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150 text-xs">
                    {/* User Info Header */}
                    <div className={`p-3 rounded-xl border mb-2.5 ${
                      activeRole === 'STUDENT'
                        ? 'bg-[#1f211c] border-[#31332c]'
                        : 'bg-[#132018] border-[#223528]'
                    }`}>
                      <div className="flex items-center gap-2.5">
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-white text-xs shadow-md ${
                          activeRole === 'STUDENT' ? 'bg-[#0f62fe]' : 'bg-[#24a148]'
                        }`}>
                          {currentUser?.avatar || (activeRole === 'STUDENT' ? 'RV' : 'SS')}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-bold text-white truncate text-xs">{currentUser?.name}</p>
                          <p className="text-[10px] text-gray-400 truncate">{currentUser?.email}</p>
                          <span className={`inline-block mt-1 px-2 py-0.2 rounded-full font-mono text-[9px] font-bold uppercase ${
                            activeRole === 'STUDENT'
                              ? 'bg-[#0f62fe]/20 text-[#78a9ff]'
                              : 'bg-[#24a148]/20 text-[#6fdc8c]'
                          }`}>
                            {activeRole === 'STUDENT' ? '🎓 CS302 Enrolled Student' : '👩‍🏫 Section Lead Professor'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Dropdown Options (NO STUDENT/TEACHER SWITCHING BUTTON!) */}
                    <div className="space-y-1">
                      <button
                        onClick={() => {
                          setActiveView('dashboard');
                          setIsProfileOpen(false);
                        }}
                        className="w-full text-left px-2.5 py-2 rounded-xl text-gray-200 hover:text-white hover:bg-white/10 transition-colors flex items-center gap-2 font-bold"
                      >
                        <LayoutDashboard className="w-3.5 h-3.5 text-[#ffe24c]" />
                        <span>Go to {activeRole === 'STUDENT' ? 'Student' : 'Teacher'} Dashboard</span>
                      </button>

                      <button
                        onClick={() => {
                          setShowAuthModal(true);
                          setIsProfileOpen(false);
                        }}
                        className="w-full text-left px-2.5 py-2 rounded-xl text-gray-300 hover:text-white hover:bg-[#262824] transition-colors flex items-center justify-between"
                      >
                        <span className="flex items-center gap-2">
                          <KeyRound className="w-3.5 h-3.5 text-[#ffe24c]" />
                          <span>Active Bearer Token</span>
                        </span>
                        <span className="text-[10px] font-mono text-emerald-400">HS256 Live</span>
                      </button>

                      <button
                        onClick={() => {
                          setActiveView('auth');
                          setIsProfileOpen(false);
                        }}
                        className="w-full text-left px-2.5 py-2 rounded-xl text-gray-300 hover:text-white hover:bg-[#262824] transition-colors flex items-center gap-2"
                      >
                        <User className="w-3.5 h-3.5 text-gray-400" />
                        <span>Switch Account / Sign In</span>
                      </button>

                      <button
                        onClick={handlePerformLogout}
                        className="w-full text-left px-2.5 py-2 rounded-xl text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors flex items-center gap-2 font-bold"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Log Out Session</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Hamburger Menu in the Right Corner */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-xl border border-white/10 bg-white/5 text-gray-300 hover:text-white hover:border-white/30 transition-all focus:outline-none"
              aria-label="Open Navigation Menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5 text-[#ffe24c]" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Slide-out Hamburger Drawer Tailored to Active Role */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Right Drawer Panel */}
          <div className={`relative w-full max-w-sm border-l h-full overflow-y-auto p-6 text-white shadow-2xl flex flex-col justify-between z-10 animate-in slide-in-from-right duration-200 ${
            activeRole === 'STUDENT'
              ? 'bg-[#151614] border-[#2d2f2b]'
              : 'bg-[#0f1712] border-[#203326]'
          }`}>
            <div>
              {/* Drawer Header */}
              <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
                <div className="flex items-center gap-2.5">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-base shadow-sm ${
                    activeRole === 'STUDENT' ? 'bg-[#ffe24c] text-black' : 'bg-[#24a148] text-white'
                  }`}>
                    {activeRole === 'STUDENT' ? '🐝' : '👩‍🏫'}
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-sm text-white">
                      {activeRole === 'STUDENT' ? 'Student Workspace' : 'Faculty Command'}
                    </h3>
                    <p className="text-[10px] text-gray-400 font-mono">
                      {activeRole === 'STUDENT' ? 'Rohan Verma • CS302' : 'Dr. Sharma • Section B'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1.5 rounded-lg bg-white/10 text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Account Status / Demo Credentials Card in Drawer */}
              {!isUserLoggedIn ? (
                <div className="mb-6 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-300 mb-1.5">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>Demo Portal Access</span>
                  </div>
                  <p className="text-[11px] text-gray-300 mb-3 leading-relaxed">
                    Sign in with pre-calibrated student or teacher credentials to access the full personalized platform.
                  </p>
                  <button
                    onClick={() => {
                      setActiveView('auth');
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full py-2.5 rounded-xl bg-[#ffe24c] hover:bg-amber-300 text-black font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-sm"
                  >
                    <User className="w-4 h-4 text-black" />
                    <span>Sign In / Demo Login</span>
                  </button>
                </div>
              ) : (
                <div className="mb-6 p-3.5 rounded-2xl bg-white/5 border border-white/10">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-white text-xs ${
                      activeRole === 'STUDENT' ? 'bg-[#0f62fe]' : 'bg-[#24a148]'
                    }`}>
                      {currentUser?.avatar || (activeRole === 'STUDENT' ? 'RV' : 'SS')}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-white text-xs truncate">{currentUser?.name}</p>
                      <p className="text-[10px] text-gray-400 font-mono truncate">{currentUser?.email}</p>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center gap-2">
                    <button
                      onClick={() => {
                        setActiveView('dashboard');
                        setIsMobileMenuOpen(false);
                      }}
                      className="flex-1 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-[11px] font-bold transition-colors text-center"
                    >
                      My Dashboard
                    </button>
                    <button
                      onClick={handlePerformLogout}
                      className="py-1.5 px-3 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 text-[11px] font-bold transition-colors text-center"
                    >
                      Log Out
                    </button>
                  </div>
                </div>
              )}

              {/* Navigation Links in Drawer */}
              <div className="space-y-1 mb-6">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-2 px-1">
                  {isLanding || !isUserLoggedIn
                    ? 'Explore Platform'
                    : activeRole === 'STUDENT'
                    ? 'My Student Workflows'
                    : 'Faculty Flight Controls'}
                </span>
                {(isLanding || !isUserLoggedIn
                  ? landingDrawerItems
                  : activeRole === 'STUDENT'
                  ? studentDrawerItems
                  : facultyDrawerItems
                ).map((item) => {
                  const Icon = item.icon;
                  const isActive = activeView === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveView(item.id);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`w-full text-left p-3 rounded-2xl transition-all flex items-start gap-3 ${
                        isActive
                          ? activeRole === 'STUDENT' || isLanding || !isUserLoggedIn
                            ? 'bg-[#ffe24c] text-black shadow-md'
                            : 'bg-[#24a148] text-white shadow-md'
                          : 'bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white'
                      }`}
                    >
                      <div className={`p-2 rounded-xl mt-0.5 ${
                        isActive
                          ? 'bg-black/15 text-black'
                          : activeRole === 'STUDENT' || isLanding || !isUserLoggedIn ? 'bg-[#ffe24c]/10 text-[#ffe24c]' : 'bg-[#24a148]/15 text-[#6fdc8c]'
                      }`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className={`text-xs font-bold ${isActive ? (activeRole === 'STUDENT' || isLanding || !isUserLoggedIn ? 'text-black' : 'text-white') : 'text-white'}`}>
                            {item.label}
                          </span>
                          {item.tag && (
                            <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded-full ${
                              isActive
                                ? 'bg-black/20 text-black'
                                : 'bg-black/40 text-gray-300 border border-white/10'
                            }`}>
                              {item.tag}
                            </span>
                          )}
                        </div>
                        <p className={`text-[10px] mt-0.5 truncate ${
                          isActive ? (activeRole === 'STUDENT' || isLanding || !isUserLoggedIn ? 'text-black/80' : 'text-white/80') : 'text-gray-400'
                        }`}>
                          {item.description}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Drawer Footer & Actions */}
            <div className="pt-4 border-t border-white/10 space-y-2">
              <button
                onClick={() => {
                  setShowAuthModal(true);
                  setIsMobileMenuOpen(false);
                }}
                className="w-full py-2.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white text-xs font-medium flex items-center justify-between transition-colors"
              >
                <span className="flex items-center gap-2">
                  <KeyRound className="w-3.5 h-3.5 text-[#ffe24c]" />
                  <span>Inspect JWT & API</span>
                </span>
                <span className="text-[10px] font-mono text-emerald-400">
                  {backendOnline ? '🟢 Live' : '🟡 Demo'}
                </span>
              </button>

              {!isUserLoggedIn ? (
                <button
                  onClick={() => {
                    setActiveView('auth');
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full py-2.5 px-3 rounded-xl bg-[#ffe24c] text-black text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-amber-300 transition-colors shadow-sm"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Sign In with Demo Credentials</span>
                </button>
              ) : (
                <button
                  onClick={() => {
                    setActiveView('auth');
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full py-2.5 px-3 rounded-xl bg-black text-white text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-[#ffe24c] hover:text-black transition-colors border border-white/10"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Switch Account / Sign In</span>
                </button>
              )}

              <p className="text-[10px] text-gray-500 text-center font-mono pt-1">
                Skill-Bee v2.4 • IBM National Hackathon
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Auth & API Status Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1f1f1f] border border-[#393939] rounded-[28px] max-w-lg w-full p-6 text-white shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-[#333]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#ffe24c] text-black font-bold flex items-center justify-center text-sm shadow-sm">
                  🔑
                </div>
                <div>
                  <h3 className="font-bold text-sm text-white">Skill-Bee Auth & API Gateway</h3>
                  <p className="text-xs text-gray-400">FastAPI JWT Token & Database Session</p>
                </div>
              </div>
              <button
                onClick={() => setShowAuthModal(false)}
                className="text-gray-400 hover:text-white text-xs px-2.5 py-1 rounded-lg bg-[#2a2a2a] transition-colors"
              >
                ✕ Close
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-[#262626] border border-[#333] space-y-1.5">
                <div className="flex justify-between text-gray-400">
                  <span>Active Session:</span>
                  <span className="font-mono text-white font-bold">{currentUser?.name} ({currentUser?.role})</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Institutional Email:</span>
                  <span className="font-mono text-gray-300">{currentUser?.email}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Classroom Code:</span>
                  <span className="font-mono text-[#ffe24c]">{currentUser?.classroom_code || 'CS302-SHARMA-2026'}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Backend Status:</span>
                  <span className={backendOnline ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'}>
                    {backendOnline ? '🟢 Connected (http://127.0.0.1:8000)' : '🟡 Local Fallback Mode'}
                  </span>
                </div>
              </div>

              <div>
                <label className="text-[11px] text-gray-400 block mb-1">Active JWT Bearer Token (HS256):</label>
                <div className="p-3 rounded-2xl bg-[#141414] font-mono text-[10px] text-emerald-300 break-all border border-[#2a2a2a] max-h-24 overflow-y-auto">
                  {jwtTokenPreview || 'Generating token...'}
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => {
                    setShowAuthModal(false);
                    setActiveView('auth');
                  }}
                  className="w-full py-2.5 rounded-xl bg-[#ffe24c] text-black font-bold hover:bg-amber-300 transition-colors flex items-center justify-center gap-2"
                >
                  <User className="w-4 h-4 text-black" />
                  <span>Open Demo Credentials / Sign In Portal</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
