'use client';

import React, { useState } from 'react';
import { ApiClient, AuthResponse } from '@/services/api';
import { Sparkles, Shield, User, Lock, Mail, ArrowRight, CheckCircle2, AlertCircle, School } from 'lucide-react';

interface AuthGatewayViewProps {
  onSuccess: (user: AuthResponse['user'], role: 'STUDENT' | 'FACULTY') => void;
  onCancel?: () => void;
}

export const AuthGatewayView: React.FC<AuthGatewayViewProps> = ({ onSuccess, onCancel }) => {
  const [mode, setMode] = useState<'LOGIN' | 'REGISTER'>('LOGIN');
  const [role, setRole] = useState<'STUDENT' | 'FACULTY'>('STUDENT');
  
  // Form fields
  const [email, setEmail] = useState('rohan.verma@college.edu');
  const [password, setPassword] = useState('DemoSecret2026!');
  const [name, setName] = useState('Rohan Verma');
  const [classroomCode, setClassroomCode] = useState('CS302-SHARMA-2026');
  
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleRoleSelect = (newRole: 'STUDENT' | 'FACULTY') => {
    setRole(newRole);
    if (newRole === 'FACULTY') {
      setEmail('dr.sharma@college.edu');
      setName('Dr. Sunita Sharma');
    } else {
      setEmail('rohan.verma@college.edu');
      setName('Rohan Verma');
    }
  };

  const handle1ClickDemo = async (targetRole: 'STUDENT' | 'FACULTY') => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await ApiClient.demoLogin(targetRole);
      onSuccess(res.user, targetRole);
    } catch (err: any) {
      console.warn('Demo login network fallback:', err);
      // Fallback local session
      const fallbackUser: AuthResponse['user'] = {
        id: targetRole === 'FACULTY' ? 'fac_sharma' : 'std_rohan',
        email: targetRole === 'FACULTY' ? 'dr.sharma@college.edu' : 'rohan.verma@college.edu',
        name: targetRole === 'FACULTY' ? 'Dr. Sunita Sharma' : 'Rohan Verma',
        role: targetRole,
        avatar: targetRole === 'FACULTY' ? 'SS' : 'RV',
        college: 'Indian Institute of Technology',
        classroom_code: 'CS302-SHARMA-2026',
        career_track: 'ai-engineer'
      };
      ApiClient.setSession({
        access_token: 'demo-local-jwt-' + targetRole.toLowerCase(),
        token_type: 'bearer',
        user: fallbackUser
      });
      onSuccess(fallbackUser, targetRole);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      if (mode === 'LOGIN') {
        const res = await ApiClient.login(email, password);
        onSuccess(res.user, (res.user.role || role) as 'STUDENT' | 'FACULTY');
      } else {
        const res = await ApiClient.register({
          email,
          password,
          name,
          role,
          college: 'Indian Institute of Technology',
          classroom_code: classroomCode,
          career_track: 'ai-engineer'
        });
        onSuccess(res.user, role);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Authentication failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fbf9f6] flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
      {/* Decorative ambient background glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#ffe24c]/15 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-[#0f62fe]/10 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Top back navigation button */}
      {onCancel && (
        <div className="w-full max-w-lg mb-4 flex items-center justify-between">
          <button
            onClick={onCancel}
            className="flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-black transition-colors px-3 py-1.5 rounded-full bg-white border border-gray-200 shadow-xs"
          >
            <span>←</span>
            <span>Back to Landing Page</span>
          </button>
          <span className="text-[11px] font-mono text-gray-400">Skill-Bee Auth Portal</span>
        </div>
      )}

      {/* Main Auth Card */}
      <div className="max-w-lg w-full bg-white rounded-[36px] p-8 md:p-10 shadow-2xl border border-gray-200/80 relative">
        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-[#ffe24c] flex items-center justify-center text-black font-bold text-2xl mx-auto shadow-md mb-3 hover:scale-105 transition-transform">
            🐝
          </div>
          <h1 className="font-display text-2xl md:text-3xl font-bold tracking-tight text-black">
            Sign In to Skill-Bee
          </h1>
          <p className="text-xs text-gray-500 mt-1 font-medium">
            Cognitive Mastery Engine extending IBM SkillsBuild
          </p>
        </div>

        {/* Prominent Demo User Credentials Section */}
        <div className="mb-6 p-4 rounded-2xl bg-amber-50/90 border border-amber-200/80">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>Official Demo Credentials</span>
            </div>
            <span className="text-[10px] bg-amber-200 text-amber-900 px-2 py-0.5 rounded-full font-bold">
              1-Click Fast Sign-In
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {/* Student Credential Card */}
            <div
              onClick={() => handle1ClickDemo('STUDENT')}
              className="p-3 rounded-xl bg-white border border-amber-300 hover:border-black cursor-pointer transition-all hover:scale-[1.02] shadow-xs group"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-black flex items-center gap-1">
                  🎓 Student Account
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-black group-hover:translate-x-0.5 transition-all" />
              </div>
              <div className="text-[11px] font-mono text-gray-700 font-semibold truncate">rohan.verma@college.edu</div>
              <div className="text-[10px] font-mono text-gray-400 mt-0.5">Password: DemoSecret2026!</div>
              <div className="mt-2 text-[10px] font-bold text-[#0f62fe] bg-blue-50 px-2 py-0.5 rounded inline-block">
                → Open Student Dashboard
              </div>
            </div>

            {/* Teacher Credential Card */}
            <div
              onClick={() => handle1ClickDemo('FACULTY')}
              className="p-3 rounded-xl bg-white border border-amber-300 hover:border-black cursor-pointer transition-all hover:scale-[1.02] shadow-xs group"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-black flex items-center gap-1">
                  👩‍🏫 Teacher Account
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-black group-hover:translate-x-0.5 transition-all" />
              </div>
              <div className="text-[11px] font-mono text-gray-700 font-semibold truncate">dr.sharma@college.edu</div>
              <div className="text-[10px] font-mono text-gray-400 mt-0.5">Password: DemoSecret2026!</div>
              <div className="mt-2 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded inline-block">
                → Open Teacher Dashboard
              </div>
            </div>
          </div>
        </div>

        {/* Role Selector Pill */}
        <div className="bg-[#f2efe9] p-1 rounded-full flex mb-6 border border-gray-200">
          <button
            type="button"
            onClick={() => handleRoleSelect('STUDENT')}
            className={`flex-1 py-2 rounded-full text-xs font-bold transition-all ${
              role === 'STUDENT'
                ? 'bg-black text-white shadow-sm'
                : 'text-gray-600 hover:text-black'
            }`}
          >
            🎓 Student Portal
          </button>
          <button
            type="button"
            onClick={() => handleRoleSelect('FACULTY')}
            className={`flex-1 py-2 rounded-full text-xs font-bold transition-all ${
              role === 'FACULTY'
                ? 'bg-[#0f62fe] text-white shadow-sm'
                : 'text-gray-600 hover:text-black'
            }`}
          >
            👩‍🏫 Teacher (Faculty)
          </button>
        </div>

        {/* Mode Toggle (Sign In vs Register) */}
        <div className="flex justify-between items-center pb-4 mb-4 border-b border-gray-100">
          <span className="font-display text-sm font-bold text-black">
            {mode === 'LOGIN' ? `Sign In as ${role === 'STUDENT' ? 'Student' : 'Faculty'}` : `Create ${role === 'STUDENT' ? 'Student' : 'Faculty'} Account`}
          </span>
          <button
            type="button"
            onClick={() => {
              setMode(mode === 'LOGIN' ? 'REGISTER' : 'LOGIN');
              setErrorMsg(null);
            }}
            className="text-xs text-[#0f62fe] font-bold hover:underline"
          >
            {mode === 'LOGIN' ? 'Need an account? Sign Up' : 'Already have an account? Sign In'}
          </button>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center gap-2 mb-4 font-medium">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Main Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {mode === 'REGISTER' && (
            <div>
              <label className="block font-bold text-gray-700 mb-1">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Rohan Verma"
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-gray-200 focus:outline-none focus:border-black transition-colors"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block font-bold text-gray-700 mb-1">Institutional Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@college.edu"
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-gray-200 focus:outline-none focus:border-black transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-gray-700 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-gray-200 focus:outline-none focus:border-black transition-colors"
              />
            </div>
            {mode === 'REGISTER' && (
              <span className="text-[10px] text-gray-400 mt-1 block">Minimum 8 characters</span>
            )}
          </div>

          {mode === 'REGISTER' && role === 'STUDENT' && (
            <div>
              <label className="block font-bold text-gray-700 mb-1">Teacher's Classroom Code</label>
              <div className="relative">
                <School className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={classroomCode}
                  onChange={(e) => setClassroomCode(e.target.value.toUpperCase())}
                  placeholder="CS302-SHARMA-2026"
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-gray-200 font-mono focus:outline-none focus:border-black transition-colors"
                />
              </div>
              <span className="text-[10px] text-emerald-600 font-medium mt-1 block">
                ✓ Enrolls directly into Dr. Sharma's CS302 Math & Computing
              </span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-full bg-black text-white text-xs font-bold hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 mt-2"
          >
            <span>{loading ? 'Authenticating...' : mode === 'LOGIN' ? 'Sign In to Skill-Bee' : 'Complete Registration'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <p className="text-[11px] text-center text-gray-400 mt-6">
          IBM National Hackathon 2026 • FERPA & GDPR Compliant Education Architecture
        </p>
      </div>
    </div>
  );
};
