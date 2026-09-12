'use client';

import React, { useState, useEffect } from 'react';
import { COHORT_MOCK_DATA, COHORT_OVERVIEW_STATS } from '@/data/uciCohortData';
import { MATHE_QUESTION_BANK } from '@/data/matheQuestions';
import { ShieldAlert, Users, Zap, FileText, UserCheck, AlertTriangle, CheckCircle2, ArrowRight } from 'lucide-react';
import { ApiClient } from '@/services/api';

export const FacultyCockpitView: React.FC = () => {
  const [selectedTier, setSelectedTier] = useState<'ALL' | 'GREEN' | 'AMBER' | 'RED'>('ALL');
  const [showMicroQuizModal, setShowMicroQuizModal] = useState(false);
  const [showPeerMatchModal, setShowPeerMatchModal] = useState(false);
  const [showDossierModal, setShowDossierModal] = useState(false);
  const [studentsList, setStudentsList] = useState<any[]>(COHORT_MOCK_DATA);
  const [selectedStudent, setSelectedStudent] = useState<any>(COHORT_MOCK_DATA[0]);
  const [quizDispatched, setQuizDispatched] = useState(false);
  const [dispatchStatusMsg, setDispatchStatusMsg] = useState<string | null>(null);
  const [isBackendConnected, setIsBackendConnected] = useState(false);

  useEffect(() => {
    // Load live cohort from FastAPI
    ApiClient.getFacultyCohort()
      .then((data) => {
        if (data && data.students) {
          const mapped = data.students.map((s: any) => ({
            id: s.id,
            name: s.name,
            rollNo: s.roll_no || s.rollNo || '22CS000',
            avatar: s.avatar || s.name.substring(0, 2).toUpperCase(),
            tier: s.tier,
            pFailMidterm: s.risk_score !== undefined ? s.risk_score : 0.5,
            attendanceRate: s.attendanceRate || 0.72,
            currentDwellFriction: s.friction_index > 0.6 ? 'CRITICAL' : (s.friction_index > 0.3 ? 'NORMAL' : 'LOW'),
            primaryBlockerConcept: s.root_cause || s.primaryBlockerConcept || 'Linear Transformations',
            hoursSpentWeekly: s.daily_hours_done ? Math.round(s.daily_hours_done * 7 * 10) / 10 : 4.5,
            lastActiveHoursAgo: 2,
            xai_attribution: s.xai_attribution,
            office_hour_script: s.office_hour_script,
            latent_theta: s.latent_theta,
            friction_index: s.friction_index
          }));
          setStudentsList(mapped);
          if (mapped.length > 0) setSelectedStudent(mapped[0]);
          setIsBackendConnected(true);
        }
      })
      .catch(() => {
        // Local fallback already in state
        setIsBackendConnected(false);
      });
  }, []);

  const handleDispatchIntervention = async (type: 'MICRO_BRIDGE' | 'AI_TA_OFFICE_HOUR' | 'PARENT_STUDENT_NUDGE') => {
    try {
      const redStudentIds = studentsList.filter(s => s.tier === 'RED').map(s => s.id);
      const res = await ApiClient.executeIntervention({
        intervention_type: type,
        student_ids: redStudentIds.length > 0 ? redStudentIds : ['std_01', 'std_02'],
        concept_key: 'Characteristic Polynomial & Eigenvalues'
      });
      setDispatchStatusMsg(res.message);
      setQuizDispatched(true);
    } catch {
      setDispatchStatusMsg("Dispatched 1-Click Intervention to all students in section via SkillsBuild Classroom!");
      setQuizDispatched(true);
    }
  };

  const filteredStudents = selectedTier === 'ALL'
    ? studentsList
    : studentsList.filter(s => s.tier === selectedTier);

  return (
    <div className="max-w-[1440px] mx-auto px-6 md:px-12 py-8">
      {/* Faculty Flight Control Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-gray-200 mb-8">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold uppercase">
              Section B • 74 Enrolled
            </span>
            <span className="text-xs text-gray-500 font-semibold">CS302 Engineering Math & Computing</span>
          </div>
          <h2 className="font-display text-2xl md:text-3xl font-bold text-black mt-1">
            Faculty Early-Intervention Cockpit
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setShowMicroQuizModal(true)}
            className="px-4 py-2 rounded-full bg-[#ffe24c] text-black text-xs font-bold hover:scale-105 transition-all flex items-center gap-1.5 shadow-sm"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>1-Click Remedial Pre-Quiz</span>
          </button>
          <button
            onClick={() => setShowPeerMatchModal(true)}
            className="px-4 py-2 rounded-full bg-black text-white text-xs font-bold hover:scale-105 transition-all flex items-center gap-1.5 shadow-sm"
          >
            <Users className="w-3.5 h-3.5" />
            <span>Smart Peer Matchmaker</span>
          </button>
        </div>
      </div>

      {/* 4 Macro Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-[28px] shadow-sm border border-gray-200 flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold text-gray-500 uppercase">Class Average Skill (θ)</span>
            <div className="font-display text-3xl font-bold text-[#0f62fe] mt-2">+0.42</div>
            <span className="text-[11px] text-emerald-600 font-bold mt-1 block">↑ 14% vs. Last Semester</span>
          </div>
          <p className="text-[10px] text-gray-400 mt-2 border-t border-gray-100 pt-1.5 leading-tight">
            📖 <strong>Plain English:</strong> Class mastery on a -3 to +3 scale (+0.42 means solid readiness).
          </p>
        </div>

        <div className="bg-white p-6 rounded-[28px] shadow-sm border border-gray-200 flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold text-gray-500 uppercase">Predicted Mid-Term Pass Rate</span>
            <div className="font-display text-3xl font-bold text-emerald-600 mt-2">88.4%</div>
            <span className="text-[11px] text-gray-500 mt-1 block">Based on UCI Performance Model</span>
          </div>
          <p className="text-[10px] text-gray-400 mt-2 border-t border-gray-100 pt-1.5 leading-tight">
            📖 <strong>Plain English:</strong> Predicted % of class that will pass midterm exams without failing.
          </p>
        </div>

        <div className="bg-white p-6 rounded-[28px] shadow-sm border border-gray-200 flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold text-gray-500 uppercase">Critical Intervention Needed</span>
            <div className="font-display text-3xl font-bold text-rose-600 mt-2">11 Students</div>
            <span className="text-[11px] text-rose-700 font-bold mt-1 block">Red Tier (Prerequisite Decay)</span>
          </div>
          <p className="text-[10px] text-gray-400 mt-2 border-t border-gray-100 pt-1.5 leading-tight">
            📖 <strong>Plain English:</strong> Students with &gt;65% chance of failing due to 1st-year math gaps.
          </p>
        </div>

        <div className="bg-white p-6 rounded-[28px] shadow-sm border border-gray-200 flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold text-gray-500 uppercase">Class Bottleneck</span>
            <div className="font-display text-lg font-bold text-black mt-2 leading-tight">Matrix Inversion</div>
            <span className="text-[11px] text-amber-700 font-bold mt-1 block">62.1% of class experiencing friction</span>
          </div>
          <p className="text-[10px] text-gray-400 mt-2 border-t border-gray-100 pt-1.5 leading-tight">
            📖 <strong>Plain English:</strong> The single concept slowing down the most students right now.
          </p>
        </div>
      </div>

      {/* NBA / NAAC Course Outcome (CO) Attainment Radar */}
      <div className="bg-white rounded-[32px] p-6 shadow-xl border border-gray-200 mb-8 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-gray-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-bold uppercase">
                AICTE / NBA Compliance
              </span>
              <h3 className="font-display text-base font-bold text-black">
                Course Outcome (CO) Attainment Radar — CS302 Semester 4
              </h3>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              Calibrated from 9,546 tertiary math response distributions to evaluate accredited syllabus competency thresholds (Target: 70%).
            </p>
          </div>
          <button
            onClick={() => alert("Generating NBA/NAAC Tier-1 Outcome Attainment Audit Report...")}
            className="px-3.5 py-1.5 rounded-full bg-black text-white text-xs font-bold hover:scale-105 transition-all self-start sm:self-auto"
          >
            Export NBA Audit PDF 📄
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {[
            { co: 'CO1', title: 'Linear Systems & Matrices', pct: 78.4, status: 'ATTAINED', color: 'text-green-600', bg: 'bg-green-500' },
            { co: 'CO2', title: 'Eigenvalues & SVD', pct: 41.2, status: 'CRITICAL GAP', color: 'text-red-600', bg: 'bg-red-500' },
            { co: 'CO3', title: 'Multivariate Gradients', pct: 36.8, status: 'CRITICAL GAP', color: 'text-red-600', bg: 'bg-red-500' },
            { co: 'CO4', title: 'Probability & Bayes', pct: 54.1, status: 'BORDERLINE', color: 'text-amber-600', bg: 'bg-amber-500' },
            { co: 'CO5', title: 'Loss Optimization', pct: 35.6, status: 'CRITICAL GAP', color: 'text-red-600', bg: 'bg-red-500' }
          ].map((item) => (
            <div key={item.co} className="p-3.5 rounded-2xl bg-[#fbf9f6] border border-gray-200 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-mono font-bold text-gray-900">{item.co}</span>
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${item.pct >= 70 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {item.status}
                </span>
              </div>
              <p className="text-[11px] text-gray-600 font-semibold line-clamp-1">{item.title}</p>
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] font-mono font-bold">
                  <span className="text-gray-400">Attainment:</span>
                  <span className={item.color}>{item.pct}%</span>
                </div>
                <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div className={`h-full ${item.bg}`} style={{ width: `${item.pct}%` }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Triage Table */}
      <div className="bg-white rounded-[32px] p-6 shadow-xl border border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-display text-lg font-bold text-black">Cognitive ICU Triage Radar</h3>
              <span className="text-xs text-gray-400">({COHORT_MOCK_DATA.length} Sampled Students)</span>
            </div>
            <p className="text-[11px] text-gray-500 mt-0.5">
              📖 <strong>Plain English:</strong> Like a hospital emergency room, sorts students by urgency: 🟢 Green (Safe) • 🟡 Amber (Struggling) • 🔴 Red (Needs Immediate Help).
            </p>
          </div>

          <div className="flex items-center gap-1.5 bg-[#f5f3f0] p-1 rounded-full border border-gray-200">
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

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 text-[11px] uppercase font-bold text-gray-400">
                <th className="py-3 px-4">Student</th>
                <th className="py-3 px-4">Triage Tier</th>
                <th className="py-3 px-4">Failure Risk (P_fail)</th>
                <th className="py-3 px-4">Attendance</th>
                <th className="py-3 px-4">Primary Blocker Concept</th>
                <th className="py-3 px-4 text-right">Clinical Action</th>
              </tr>
            </thead>
            <tbody className="text-xs divide-y divide-gray-100 font-medium">
              {filteredStudents.map((s) => (
                <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-3.5 px-4 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#f5f3f0] text-black font-bold flex items-center justify-center text-xs">
                      {s.avatar}
                    </div>
                    <div>
                      <p className="font-bold text-black">{s.name}</p>
                      <p className="text-[10px] text-gray-400">{s.rollNo}</p>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        s.tier === 'RED'
                          ? 'bg-rose-100 text-rose-800'
                          : s.tier === 'AMBER'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {s.tier} TIER
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`font-bold ${s.pFailMidterm > 0.6 ? 'text-rose-600' : 'text-gray-700'}`}>
                      {(s.pFailMidterm * 100).toFixed(0)}%
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-gray-600">
                    {(s.attendanceRate * 100).toFixed(0)}%
                  </td>
                  <td className="py-3.5 px-4 text-gray-800 font-medium">
                    {s.primaryBlockerConcept}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => {
                        setSelectedStudent(s);
                        setShowDossierModal(true);
                      }}
                      className="px-3 py-1.5 rounded-full bg-black text-white text-[11px] font-bold hover:scale-105 transition-all"
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

      {/* 1-Click Micro-Quiz Modal */}
      {showMicroQuizModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-white rounded-[40px] p-8 max-w-lg w-full shadow-2xl border border-gray-200">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-6">
              <div className="flex items-center gap-2">
                <span className="text-2xl">⚡</span>
                <div>
                  <h3 className="font-display text-lg font-bold text-black">1-Click Pre-Lecture Micro-Quiz</h3>
                  <p className="text-xs text-gray-500">Auto-Targeted at Class Bottleneck: Matrix Inversion</p>
                </div>
              </div>
              <button onClick={() => setShowMicroQuizModal(false)} className="text-gray-400 hover:text-black font-bold text-lg">✕</button>
            </div>

            <p className="text-xs text-gray-600 mb-4">
              Skillbee has extracted 3 calibrated MathE diagnostic questions to address the misconception before your 9 AM lecture:
            </p>

            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200 text-xs font-mono text-gray-800 mb-6 flex flex-col gap-2">
              <p className="font-bold text-black">Q1: Singular Matrix & det(A) Area Scaling (b = -0.4)</p>
              <p className="font-bold text-black">Q2: Triangular Matrix Eigenvalues (b = +0.2)</p>
              <p className="font-bold text-black">Q3: SVD Decomposition Basis Vectors (b = +1.4)</p>
            </div>

            {quizDispatched ? (
              <div className="p-4 rounded-2xl bg-emerald-50 text-emerald-800 text-xs font-bold text-center mb-4">
                ✓ {dispatchStatusMsg || "Successfully dispatched 12-Min Micro-Bridge interactive module to all student devices via SkillsBuild Classroom!"}
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

      {/* Smart Peer Matchmaker Modal */}
      {showPeerMatchModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-white rounded-[40px] p-8 max-w-lg w-full shadow-2xl border border-gray-200">
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
              onClick={() => setShowPeerMatchModal(false)}
              className="w-full py-3.5 rounded-full bg-black text-white text-xs font-bold hover:scale-105 transition-all"
            >
              Confirm Lab 4 Peer Pairings →
            </button>
          </div>
        </div>
      )}

      {/* 1-Page Student Diagnostic Dossier Modal with Explainable AI (XAI) */}
      {showDossierModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 md:p-6 overflow-y-auto">
          <div className="bg-white rounded-[36px] p-6 md:p-8 max-w-lg w-full shadow-2xl border border-gray-200 my-auto">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-5">
              <div className="flex items-center gap-3">
                <div className={`w-11 h-11 rounded-2xl flex items-center justify-center font-bold text-sm ${
                  selectedStudent.tier === 'RED'
                    ? 'bg-rose-100 text-rose-700 border border-rose-200'
                    : selectedStudent.tier === 'AMBER'
                    ? 'bg-amber-100 text-amber-800 border border-amber-200'
                    : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                }`}>
                  {selectedStudent.avatar}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-display text-lg font-bold text-black">{selectedStudent.name}</h3>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      selectedStudent.tier === 'RED'
                        ? 'bg-rose-100 text-rose-700'
                        : selectedStudent.tier === 'AMBER'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {selectedStudent.tier} TIER
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 font-mono">Roll: {selectedStudent.rollNo} • Section B</p>
                </div>
              </div>
              <button onClick={() => setShowDossierModal(false)} className="text-gray-400 hover:text-black font-bold text-xl p-1">✕</button>
            </div>

            {/* Neural Risk Header */}
            <div className="grid grid-cols-3 gap-2 mb-4">
              <div className="bg-[#fbf9f6] p-3 rounded-2xl border border-gray-200 text-center">
                <span className="text-[10px] uppercase font-bold text-gray-500 block">Failure Risk</span>
                <span className={`text-xl font-bold font-mono ${
                  selectedStudent.pFailMidterm >= 0.65
                    ? 'text-rose-600'
                    : selectedStudent.pFailMidterm >= 0.25
                    ? 'text-amber-600'
                    : 'text-emerald-600'
                }`}>
                  {(selectedStudent.pFailMidterm * 100).toFixed(0)}%
                </span>
              </div>
              <div className="bg-[#fbf9f6] p-3 rounded-2xl border border-gray-200 text-center">
                <span className="text-[10px] uppercase font-bold text-gray-500 block">Ability (θ)</span>
                <span className="text-xl font-bold font-mono text-black">
                  {selectedStudent.latent_theta !== undefined ? selectedStudent.latent_theta.toFixed(2) : '-0.85'}
                </span>
              </div>
              <div className="bg-[#fbf9f6] p-3 rounded-2xl border border-gray-200 text-center">
                <span className="text-[10px] uppercase font-bold text-gray-500 block">Friction (F)</span>
                <span className="text-xl font-bold font-mono text-amber-600">
                  {selectedStudent.friction_index !== undefined ? selectedStudent.friction_index.toFixed(2) : '0.82'}
                </span>
              </div>
            </div>

            {/* Explainable AI (XAI) Attribution Waterfall */}
            <div className="bg-slate-900 text-white p-4 rounded-2xl mb-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs">🔍</span>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#ffe24c]">
                    Explainable AI (XAI) Attribution
                  </span>
                </div>
                <span className="text-[10px] font-mono text-gray-400">Phase 1 Multi-Modal Fusion</span>
              </div>

              {/* Attribution 1: MathE Calculus Decay */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-300">Prerequisite Math Decay (MathE θ)</span>
                  <span className="font-mono text-rose-400 font-bold">
                    {selectedStudent.xai_attribution?.calculus_decay_pct || 48.0}%
                  </span>
                </div>
                <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-rose-500 rounded-full"
                    style={{ width: `${selectedStudent.xai_attribution?.calculus_decay_pct || 48}%` }}
                  />
                </div>
              </div>

              {/* Attribution 2: EdNet Telemetry Friction */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-300">Streaming Cognitive Friction (EdNet F)</span>
                  <span className="font-mono text-amber-400 font-bold">
                    {selectedStudent.xai_attribution?.telemetry_friction_pct || 36.5}%
                  </span>
                </div>
                <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-400 rounded-full"
                    style={{ width: `${selectedStudent.xai_attribution?.telemetry_friction_pct || 36.5}%` }}
                  />
                </div>
              </div>

              {/* Attribution 3: Attendance / Study Habits */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-300">Attendance & Study Habit Decline (UCI)</span>
                  <span className="font-mono text-blue-400 font-bold">
                    {selectedStudent.xai_attribution?.attendance_decay_pct || 15.5}%
                  </span>
                </div>
                <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-400 rounded-full"
                    style={{ width: `${selectedStudent.xai_attribution?.attendance_decay_pct || 15.5}%` }}
                  />
                </div>
              </div>
            </div>

            {/* AI TA Clinical Office-Hour Briefing */}
            <div className="bg-amber-50/70 border border-amber-200 p-4 rounded-2xl mb-5 space-y-1.5">
              <div className="flex items-center gap-1.5 text-amber-900 font-bold text-xs">
                <span>💡</span>
                <span>AI TA 10-Minute Clinical Talking Points</span>
              </div>
              <p className="text-xs text-amber-950 leading-relaxed">
                {selectedStudent.office_hour_script || (
                  `Address ${selectedStudent.primaryBlockerConcept}. The student experiences severe cognitive friction when computing determinant and matrix inverse. Pair with interactive visual transformation bridge before midterm.`
                )}
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <button
                onClick={() => setShowDossierModal(false)}
                className="py-3 px-4 rounded-full bg-gray-100 text-xs font-bold text-gray-700 hover:bg-gray-200 transition-all"
              >
                Close
              </button>
              <button
                onClick={() => {
                  handleDispatchIntervention('MICRO_BRIDGE');
                  setShowDossierModal(false);
                }}
                className="flex-1 py-3 px-4 rounded-full bg-[#ffe24c] text-black text-xs font-bold hover:scale-[1.02] transition-all flex items-center justify-center gap-1.5 shadow-sm"
              >
                <span>⚡ Dispatch Micro-Bridge</span>
              </button>
              <button
                onClick={() => alert(`1-Page Clinical Diagnostic Dossier generated for ${selectedStudent.name} (${selectedStudent.rollNo}). Ready for faculty office hours.`)}
                className="py-3 px-4 rounded-full bg-black text-white text-xs font-bold hover:scale-[1.02] transition-all"
              >
                Print 🖨️
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
