'use client';

import React, { useState, useEffect } from 'react';
import {
  Users,
  Calendar,
  AlertTriangle,
  TrendingUp,
  ShieldAlert,
  Zap,
  CheckCircle2,
  ArrowRight,
  Search,
  Filter,
  FileText,
  Clock,
  School,
  Sparkles,
  BarChart3,
  UserCheck
} from 'lucide-react';
import { COHORT_MOCK_DATA } from '@/data/uciCohortData';
import { ApiClient } from '@/services/api';
import { DemoView } from '@/components/layout/PitchNavigatorBar';

interface TeacherDashboardViewProps {
  onNavigate: (view: DemoView) => void;
}

export const TeacherDashboardView: React.FC<TeacherDashboardViewProps> = ({ onNavigate }) => {
  const [selectedTier, setSelectedTier] = useState<'ALL' | 'GREEN' | 'AMBER' | 'RED'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [studentsList, setStudentsList] = useState<any[]>(COHORT_MOCK_DATA);
  const [selectedStudent, setSelectedStudent] = useState<any>(COHORT_MOCK_DATA[0]);

  // Modals
  const [showDossierModal, setShowDossierModal] = useState(false);
  const [showMicroQuizModal, setShowMicroQuizModal] = useState(false);
  const [showPeerMatchModal, setShowPeerMatchModal] = useState(false);
  const [quizDispatched, setQuizDispatched] = useState(false);
  const [dispatchStatusMsg, setDispatchStatusMsg] = useState<string | null>(null);

  useEffect(() => {
    // Try to load cohort data from FastAPI
    ApiClient.getFacultyCohort()
      .then((data) => {
        if (data && data.students && data.students.length > 0) {
          setStudentsList(data.students);
          setSelectedStudent(data.students[0]);
        }
      })
      .catch(() => {
        // Local fallback in state
      });
  }, []);

  const handleDispatchIntervention = async (type: 'MICRO_BRIDGE' | 'AI_TA_OFFICE_HOUR' | 'PARENT_STUDENT_NUDGE') => {
    try {
      const redStudentIds = studentsList.filter((s) => s.tier === 'RED').map((s) => s.id);
      const res = await ApiClient.executeIntervention({
        intervention_type: type,
        student_ids: redStudentIds.length > 0 ? redStudentIds : ['stud-001', 'stud-002'],
        concept_key: 'Matrix Inversion & Determinants',
      });
      setDispatchStatusMsg(res.message);
      setQuizDispatched(true);
    } catch {
      setDispatchStatusMsg('Dispatched 1-Click Micro-Bridge to 11 At-Risk students via SkillsBuild Classroom!');
      setQuizDispatched(true);
    }
  };

  // Filter students based on tier and search
  const filteredStudents = studentsList.filter((s) => {
    const matchesTier = selectedTier === 'ALL' || s.tier === selectedTier;
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.rollNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.primaryBlockerConcept.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTier && matchesSearch;
  });

  // Monthly Attendance Data
  const monthlyAttendanceData = [
    { month: 'August', rate: 92.4, status: 'Normal', activeLectures: 8 },
    { month: 'September (Current)', rate: 88.6, status: 'Active', activeLectures: 12 },
    { month: 'October (Projected)', rate: 87.1, status: 'Forecast', activeLectures: 10 },
  ];

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* 1. Teacher Flight Command Header */}
      <div className="bg-[#0f1712] text-white rounded-[36px] p-6 md:p-8 shadow-xl border border-[#203326] flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#24a148]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex items-start gap-4">
          <div className="w-16 h-16 rounded-2xl bg-[#24a148] text-white flex items-center justify-center font-bold text-2xl shadow-md shrink-0">
            SS
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full bg-[#24a148]/20 text-[#6fdc8c] text-[11px] font-bold uppercase border border-[#24a148]/30">
                Faculty Instructor Dashboard
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-gray-300 text-[11px] font-mono font-bold">
                Code: CS302-SHARMA-2026
              </span>
            </div>
            <h1 className="font-display text-2xl md:text-3xl font-bold text-white">
              Dr. Sunita Sharma &bull; CS302 Command Center
            </h1>
            <p className="text-xs text-gray-400 mt-1 flex flex-wrap items-center gap-x-2">
              <span className="text-white font-bold">CS302: Engineering Math & Computing</span>
              <span>&bull;</span>
              <span>Section B (74 Enrolled Students)</span>
              <span>&bull;</span>
              <span className="text-emerald-400">Indian Institute of Technology</span>
            </p>
          </div>
        </div>

        <div className="relative z-10 flex flex-wrap items-center gap-3">
          <button
            onClick={() => setShowMicroQuizModal(true)}
            className="px-5 py-2.5 rounded-full bg-[#ffe24c] text-black text-xs font-bold hover:scale-105 transition-all flex items-center gap-2 shadow-sm"
          >
            <Zap className="w-4 h-4 fill-black" />
            <span>1-Click Micro-Bridge Quiz</span>
          </button>
          <button
            onClick={() => setShowPeerMatchModal(true)}
            className="px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all flex items-center gap-2 border border-white/10"
          >
            <Users className="w-4 h-4 text-[#ffe24c]" />
            <span>Peer Matchmaker</span>
          </button>
          <button
            onClick={() => onNavigate('faculty')}
            className="px-5 py-2.5 rounded-full bg-[#24a148] text-white text-xs font-bold hover:scale-105 transition-all flex items-center gap-2 shadow-sm"
          >
            <ShieldAlert className="w-4 h-4" />
            <span>Open ICU Radar</span>
          </button>
        </div>
      </div>

      {/* 2. Four Key Teacher Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Card 1: Enrolled Students */}
        <div className="bg-white p-6 rounded-[32px] shadow-sm border border-gray-200/80 flex flex-col justify-between hover:shadow-md transition-shadow">
          <div>
            <div className="flex items-center justify-between text-xs font-bold text-gray-500 uppercase">
              <span>Enrolled Students</span>
              <Users className="w-4 h-4 text-[#0f62fe]" />
            </div>
            <div className="font-display text-3xl font-bold text-black mt-2">
              74 <span className="text-sm font-normal text-gray-500">Students</span>
            </div>
            <p className="text-xs text-emerald-600 font-medium mt-1">
              100% Onboarded via Classroom Code
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-gray-100 text-[11px] text-gray-500 flex items-center justify-between">
            <span>Classroom Code:</span>
            <span className="font-mono font-bold text-black">CS302-SHARMA-2026</span>
          </div>
        </div>

        {/* Card 2: Monthly Attendance Rate */}
        <div className="bg-white p-6 rounded-[32px] shadow-sm border border-gray-200/80 flex flex-col justify-between hover:shadow-md transition-shadow">
          <div>
            <div className="flex items-center justify-between text-xs font-bold text-gray-500 uppercase">
              <span>Monthly Attendance</span>
              <Calendar className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="font-display text-3xl font-bold text-emerald-600 mt-2">
              88.6%
            </div>
            <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-bold mt-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>↑ 2.4% vs. August Average</span>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-gray-100 text-[11px] text-gray-500 flex items-center justify-between">
            <span>Average per lecture:</span>
            <span className="font-bold text-black">65.5 / 74 Present</span>
          </div>
        </div>

        {/* Card 3: Class Average Latent Ability θ */}
        <div className="bg-white p-6 rounded-[32px] shadow-sm border border-gray-200/80 flex flex-col justify-between hover:shadow-md transition-shadow">
          <div>
            <div className="flex items-center justify-between text-xs font-bold text-gray-500 uppercase">
              <span>Class Latent Ability (θ)</span>
              <Sparkles className="w-4 h-4 text-[#0f62fe]" />
            </div>
            <div className="font-display text-3xl font-bold text-[#0f62fe] mt-2">
              +0.42
            </div>
            <p className="text-xs text-gray-600 mt-1">
              Scale: -3.0 (low) to +3.0 (high)
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-gray-100 text-[11px] text-gray-500 flex items-center justify-between">
            <span>Benchmarked on:</span>
            <span className="font-bold text-purple-700">MathE 9.5K Items</span>
          </div>
        </div>

        {/* Card 4: Critical At-Risk (Red Tier) */}
        <div className="bg-white p-6 rounded-[32px] shadow-sm border border-gray-200/80 flex flex-col justify-between hover:shadow-md transition-shadow">
          <div>
            <div className="flex items-center justify-between text-xs font-bold text-gray-500 uppercase">
              <span>Critical At-Risk</span>
              <AlertTriangle className="w-4 h-4 text-rose-600" />
            </div>
            <div className="font-display text-3xl font-bold text-rose-600 mt-2 flex items-center gap-2">
              <span>11 Students</span>
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
            </div>
            <p className="text-xs text-rose-700 font-bold mt-1">
              Prerequisite Decay &gt; 65% Failure Risk
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-gray-100 text-[11px] text-gray-500 flex items-center justify-between">
            <span>Primary Bottleneck:</span>
            <span className="font-bold text-black">Matrix Inversion</span>
          </div>
        </div>

      </div>

      {/* 3. Monthly Attendance Trend & Cohort Distribution Pictorials */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left 6 Cols: Monthly Attendance Trend Chart */}
        <div className="lg:col-span-6 bg-white rounded-[36px] p-6 md:p-8 shadow-sm border border-gray-200/80 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-6">
              <div>
                <h3 className="font-display text-lg font-bold text-black">Monthly Attendance & Lecture Trends</h3>
                <p className="text-xs text-gray-500">CS302 Section B Semester Progression</p>
              </div>
              <span className="text-xs font-mono font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                Target: &gt;80% Class Rate
              </span>
            </div>

            {/* Visual Monthly Attendance Bars */}
            <div className="space-y-5">
              {monthlyAttendanceData.map((m, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-gray-900">{m.month}</span>
                    <span className="font-mono text-emerald-700">{m.rate}%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden p-0.5 border border-gray-200/60">
                    <div
                      className="bg-emerald-500 h-full rounded-full transition-all"
                      style={{ width: `${m.rate}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[11px] text-gray-400">
                    <span>{m.activeLectures} Scheduled Lectures</span>
                    <span>Status: {m.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 p-4 rounded-2xl bg-[#fbf9f6] border border-gray-200 text-xs text-gray-600">
            <span className="font-bold text-black block mb-0.5">💡 Attendance Insight:</span>
            <span>
              Attendance dips on Wednesdays (Lab 4 Matrix Inversion, 78% attendance). Recommend dispatching the 5-minute pre-quiz to re-engage absent students before next lab.
            </span>
          </div>
        </div>

        {/* Right 6 Cols: Cohort Triage Distribution & Bottleneck Heatmap */}
        <div className="lg:col-span-6 bg-white rounded-[36px] p-6 md:p-8 shadow-sm border border-gray-200/80 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-6">
              <div>
                <h3 className="font-display text-lg font-bold text-black">Cognitive ICU Triage Distribution</h3>
                <p className="text-xs text-gray-500">Predicted Mid-term Risk Stratification</p>
              </div>
              <span className="text-xs text-gray-400 font-mono">UCI Student Dataset</span>
            </div>

            {/* Pictorial 3-Tier Distribution */}
            <div className="grid grid-cols-3 gap-3 mb-6 text-center">
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
                <div className="font-display text-2xl font-bold text-emerald-800">44</div>
                <p className="text-xs font-bold text-emerald-900 mt-1">🟢 Green Tier</p>
                <span className="text-[10px] text-emerald-700 font-medium">59% Safe (&lt;25% Risk)</span>
              </div>
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200">
                <div className="font-display text-2xl font-bold text-amber-800">19</div>
                <p className="text-xs font-bold text-amber-900 mt-1">🟡 Amber Tier</p>
                <span className="text-[10px] text-amber-700 font-medium">26% At-Risk (25-65%)</span>
              </div>
              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200">
                <div className="font-display text-2xl font-bold text-rose-800">11</div>
                <p className="text-xs font-bold text-rose-900 mt-1">🔴 Red Tier</p>
                <span className="text-[10px] text-rose-700 font-medium">15% Critical (&gt;65%)</span>
              </div>
            </div>

            {/* Class Concept Bottleneck Bars */}
            <div className="space-y-3">
              <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">
                Top Class Concept Blockers:
              </span>
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-bold text-black">1. Matrix Inversion & Area Collapse</span>
                  <span className="font-bold text-rose-600">62.1% Friction</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                  <div className="bg-rose-500 h-full rounded-full" style={{ width: '62.1%' }} />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-bold text-black">2. Multivariable Chain Rule</span>
                  <span className="font-bold text-amber-600">44.2% Friction</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                  <div className="bg-amber-500 h-full rounded-full" style={{ width: '44.2%' }} />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
            <span className="text-xs text-gray-500">Need to inspect knowledge dependencies?</span>
            <button
              onClick={() => onNavigate('roadmap')}
              className="text-xs font-bold text-black hover:underline flex items-center gap-1"
            >
              <span>Explore Curriculum DAG</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>

      {/* 4. STUDENT RECORD SECTION (Interactive Table with Search & Tiers) */}
      <div className="bg-white rounded-[36px] p-6 md:p-8 shadow-sm border border-gray-200/80">
        
        {/* Table Header & Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-gray-100">
          <div>
            <h2 className="font-display text-xl font-bold text-black">
              Student Records & Clinical ICU Triage
            </h2>
            <p className="text-xs text-gray-500">
              Complete class roster for CS302 Section B &bull; Showing {filteredStudents.length} of {studentsList.length} students
            </p>
          </div>

          {/* Search Input & Tier Filters */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search student or roll no..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2 rounded-full border border-gray-200 text-xs focus:outline-none focus:border-black transition-colors w-60"
              />
            </div>

            <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-full border border-gray-200">
              {(['ALL', 'RED', 'AMBER', 'GREEN'] as const).map((tier) => (
                <button
                  key={tier}
                  onClick={() => setSelectedTier(tier)}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                    selectedTier === tier
                      ? tier === 'RED'
                        ? 'bg-rose-600 text-white'
                        : tier === 'AMBER'
                        ? 'bg-amber-400 text-black'
                        : tier === 'GREEN'
                        ? 'bg-emerald-600 text-white'
                        : 'bg-black text-white'
                      : 'text-gray-600 hover:text-black'
                  }`}
                >
                  {tier}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Student Records Table */}
        <div className="overflow-x-auto mt-4">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-gray-200 text-gray-400 font-bold uppercase text-[10px]">
                <th className="py-3 px-4">Student Name</th>
                <th className="py-3 px-4">Triage Tier</th>
                <th className="py-3 px-4">Attendance Rate</th>
                <th className="py-3 px-4">Midterm Risk (P_fail)</th>
                <th className="py-3 px-4">Weekly Study</th>
                <th className="py-3 px-4">Primary Blocker Concept</th>
                <th className="py-3 px-4 text-right">Clinical Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-medium">
              {filteredStudents.map((s) => (
                <tr key={s.id} className="hover:bg-gray-50/80 transition-colors">
                  
                  {/* Name & Avatar */}
                  <td className="py-3.5 px-4 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-100 text-black font-bold flex items-center justify-center text-xs">
                      {s.avatar}
                    </div>
                    <div>
                      <p className="font-bold text-black">{s.name}</p>
                      <p className="text-[10px] text-gray-400 font-mono">{s.rollNo}</p>
                    </div>
                  </td>

                  {/* Tier Badge */}
                  <td className="py-3.5 px-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      s.tier === 'RED'
                        ? 'bg-rose-100 text-rose-800'
                        : s.tier === 'AMBER'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {s.tier} TIER
                    </span>
                  </td>

                  {/* Attendance */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <span className={`font-bold ${s.attendanceRate < 0.75 ? 'text-rose-600' : 'text-gray-800'}`}>
                        {(s.attendanceRate * 100).toFixed(0)}%
                      </span>
                      <span className="text-[10px] text-gray-400">
                        ({Math.round((1 - s.attendanceRate) * 28)} absents)
                      </span>
                    </div>
                  </td>

                  {/* Midterm Failure Risk */}
                  <td className="py-3.5 px-4">
                    <span className={`font-bold font-mono ${s.pFailMidterm > 0.65 ? 'text-rose-600' : s.pFailMidterm > 0.35 ? 'text-amber-600' : 'text-emerald-600'}`}>
                      {(s.pFailMidterm * 100).toFixed(0)}%
                    </span>
                  </td>

                  {/* Weekly Study Hours */}
                  <td className="py-3.5 px-4 text-gray-600">
                    {s.hoursSpentWeekly} hrs/wk
                  </td>

                  {/* Primary Blocker */}
                  <td className="py-3.5 px-4 text-gray-800 font-medium">
                    {s.primaryBlockerConcept}
                  </td>

                  {/* 1-Click Action Button */}
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => {
                        setSelectedStudent(s);
                        setShowDossierModal(true);
                      }}
                      className="px-3 py-1.5 rounded-full bg-black text-white text-[11px] font-bold hover:scale-105 transition-all shadow-sm"
                    >
                      View Dossier
                    </button>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>

      {/* MODAL 1: 1-Page Student Clinical Dossier */}
      {showDossierModal && selectedStudent && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[40px] p-8 max-w-lg w-full shadow-2xl border border-gray-200 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-6">
              <div className="flex items-center gap-2.5">
                <span className="text-2xl">📋</span>
                <div>
                  <h3 className="font-display text-lg font-bold text-black">1-Page Clinical Student Dossier</h3>
                  <p className="text-xs text-gray-500">{selectedStudent.name} ({selectedStudent.rollNo})</p>
                </div>
              </div>
              <button
                onClick={() => setShowDossierModal(false)}
                className="text-gray-400 hover:text-black font-bold text-lg p-1"
              >
                ✕
              </button>
            </div>

            <div className="bg-[#fbf9f6] p-4 rounded-2xl border border-gray-200 mb-6 flex flex-col gap-2.5 text-xs">
              <div className="flex justify-between font-bold">
                <span>Predicted Mid-Term Failure Risk:</span>
                <span className="text-rose-600 font-mono text-sm">{(selectedStudent.pFailMidterm * 100).toFixed(0)}%</span>
              </div>
              <div className="flex justify-between">
                <span>Attendance Rate:</span>
                <span className="font-bold">{(selectedStudent.attendanceRate * 100).toFixed(0)}% (Classes Missed: {Math.round((1 - selectedStudent.attendanceRate) * 28)})</span>
              </div>
              <div className="flex justify-between">
                <span>Weekly Study Hours:</span>
                <span>{selectedStudent.hoursSpentWeekly} hrs (Class Average: 8.5 hrs)</span>
              </div>
              <div className="mt-2 pt-2 border-t border-gray-200">
                <p className="font-bold text-black">Diagnostic Root-Cause Prerequisite Decay:</p>
                <p className="text-gray-600 mt-1 leading-relaxed">
                  Struggling with <strong>{selectedStudent.primaryBlockerConcept}</strong>. Semester 1 foundational math gaps are causing cognitive overload during application tasks.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowDossierModal(false)}
                className="flex-1 py-3 rounded-full bg-gray-100 text-xs font-bold hover:bg-gray-200"
              >
                Close
              </button>
              <button
                onClick={() => alert(`Printing clinical dossier for ${selectedStudent.name}...`)}
                className="flex-1 py-3 rounded-full bg-black text-white text-xs font-bold hover:scale-105 transition-all"
              >
                Print Dossier 🖨️
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: 1-Click Pre-Lecture Micro-Quiz */}
      {showMicroQuizModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[40px] p-8 max-w-lg w-full shadow-2xl border border-gray-200 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-6">
              <div className="flex items-center gap-2">
                <span className="text-2xl">⚡</span>
                <div>
                  <h3 className="font-display text-lg font-bold text-black">1-Click Pre-Lecture Micro-Bridge</h3>
                  <p className="text-xs text-gray-500">Auto-Targeted at Class Bottleneck: Matrix Inversion</p>
                </div>
              </div>
              <button onClick={() => setShowMicroQuizModal(false)} className="text-gray-400 hover:text-black font-bold text-lg">✕</button>
            </div>

            <p className="text-xs text-gray-600 mb-4">
              Skill-Bee has extracted 3 calibrated diagnostic items from the MathE dataset to address the misconception before your 9 AM lecture:
            </p>

            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200 text-xs font-mono text-gray-800 mb-6 flex flex-col gap-2">
              <p className="font-bold text-black">Q1: Singular Matrix & det(A) Area Scaling (b = -0.4)</p>
              <p className="font-bold text-black">Q2: Triangular Matrix Eigenvalues (b = +0.2)</p>
              <p className="font-bold text-black">Q3: SVD Decomposition Basis Vectors (b = +1.4)</p>
            </div>

            {quizDispatched ? (
              <div className="p-4 rounded-2xl bg-emerald-50 text-emerald-800 text-xs font-bold text-center mb-4">
                ✓ {dispatchStatusMsg || 'Successfully dispatched 12-Min Micro-Bridge interactive module to all student devices via SkillsBuild Classroom!'}
              </div>
            ) : (
              <button
                onClick={() => handleDispatchIntervention('MICRO_BRIDGE')}
                className="w-full py-3.5 rounded-full bg-black text-white text-xs font-bold hover:scale-105 transition-all flex items-center justify-center gap-2"
              >
                <span>Dispatch 5-Minute Micro-Bridge to Class</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* MODAL 3: Smart Peer Matchmaker */}
      {showPeerMatchModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[40px] p-8 max-w-lg w-full shadow-2xl border border-gray-200 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-6">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🤝</span>
                <div>
                  <h3 className="font-display text-lg font-bold text-black">Automated Peer-to-Peer Matchmaker</h3>
                  <p className="text-xs text-gray-500">Pairing Red-Tier Students with Green-Tier Lab Mentors</p>
                </div>
              </div>
              <button onClick={() => setShowPeerMatchModal(false)} className="text-gray-400 hover:text-black font-bold text-lg">✕</button>
            </div>

            <div className="flex flex-col gap-3 mb-6">
              <div className="p-4 rounded-2xl bg-[#fbf9f6] border border-gray-200 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-rose-700">Rohan Verma [Red Tier]</p>
                  <p className="text-[10px] text-gray-500">Struggling: Matrix Inversion</p>
                </div>
                <span className="text-lg font-bold text-gray-400">⇄</span>
                <div className="text-right">
                  <p className="text-xs font-bold text-emerald-700">Ananya Sen [Green Tier]</p>
                  <p className="text-[10px] text-gray-500">Mastery: 96% Linear Algebra</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#fbf9f6] border border-gray-200 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-rose-700">Priya Nair [Red Tier]</p>
                  <p className="text-[10px] text-gray-500">Struggling: Multivariable Chain Rule</p>
                </div>
                <span className="text-lg font-bold text-gray-400">⇄</span>
                <div className="text-right">
                  <p className="text-xs font-bold text-emerald-700">Devansh Roy [Green Tier]</p>
                  <p className="text-[10px] text-gray-500">Mastery: 92% Calculus II</p>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                alert('Lab 4 peer pairings confirmed and notification dispatched to students!');
                setShowPeerMatchModal(false);
              }}
              className="w-full py-3.5 rounded-full bg-black text-white text-xs font-bold hover:scale-105 transition-all"
            >
              Confirm Lab 4 Peer Pairings →
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
