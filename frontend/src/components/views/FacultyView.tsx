'use client';

import React, { useState } from 'react';
import { COHORT_MOCK_DATA, COHORT_OVERVIEW_STATS } from '@/data/uciCohortData';
import { MATHE_QUESTION_BANK } from '@/data/matheQuestions';
import { ShieldAlert, Users, Zap, FileText, UserCheck, AlertTriangle, CheckCircle2, ArrowRight } from 'lucide-react';

export const FacultyCockpitView: React.FC = () => {
  const [selectedTier, setSelectedTier] = useState<'ALL' | 'GREEN' | 'AMBER' | 'RED'>('ALL');
  const [showMicroQuizModal, setShowMicroQuizModal] = useState(false);
  const [showPeerMatchModal, setShowPeerMatchModal] = useState(false);
  const [showDossierModal, setShowDossierModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(COHORT_MOCK_DATA[0]);
  const [quizDispatched, setQuizDispatched] = useState(false);

  const filteredStudents = selectedTier === 'ALL'
    ? COHORT_MOCK_DATA
    : COHORT_MOCK_DATA.filter(s => s.tier === selectedTier);

  return (
    <div className="max-w-[1440px] mx-auto px-6 md:px-12 py-8">
      {/* Faculty Flight Control Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-gray-200 mb-8">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold uppercase">
              Section B ? 74 Enrolled
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
          <span className="text-xs font-bold text-gray-500 uppercase">Class Average ?</span>
          <div className="font-display text-3xl font-bold text-[#0f62fe] mt-2">+0.42</div>
          <span className="text-[11px] text-emerald-600 font-bold mt-1">? 14% vs. Last Semester</span>
        </div>

        <div className="bg-white p-6 rounded-[28px] shadow-sm border border-gray-200 flex flex-col justify-between">
          <span className="text-xs font-bold text-gray-500 uppercase">Predicted Mid-Term Pass Rate</span>
          <div className="font-display text-3xl font-bold text-emerald-600 mt-2">88.4%</div>
          <span className="text-[11px] text-gray-500 mt-1">Based on UCI Performance Model</span>
        </div>

        <div className="bg-white p-6 rounded-[28px] shadow-sm border border-gray-200 flex flex-col justify-between">
          <span className="text-xs font-bold text-gray-500 uppercase">Critical Intervention Needed</span>
          <div className="font-display text-3xl font-bold text-rose-600 mt-2">11 Students</div>
          <span className="text-[11px] text-rose-700 font-bold mt-1">Red Tier (Prerequisite Decay)</span>
        </div>

        <div className="bg-white p-6 rounded-[28px] shadow-sm border border-gray-200 flex flex-col justify-between">
          <span className="text-xs font-bold text-gray-500 uppercase">Class Bottleneck</span>
          <div className="font-display text-lg font-bold text-black mt-2 leading-tight">Matrix Inversion</div>
          <span className="text-[11px] text-amber-700 font-bold mt-1">62.1% of class experiencing friction</span>
        </div>
      </div>

      {/* Triage Table */}
      <div className="bg-white rounded-[32px] p-6 shadow-xl border border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100 mb-4">
          <div className="flex items-center gap-2">
            <h3 className="font-display text-lg font-bold text-black">Cognitive ICU Triage Radar</h3>
            <span className="text-xs text-gray-400">({COHORT_MOCK_DATA.length} Sampled Students)</span>
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
                <span className="text-2xl">?</span>
                <div>
                  <h3 className="font-display text-lg font-bold text-black">1-Click Pre-Lecture Micro-Quiz</h3>
                  <p className="text-xs text-gray-500">Auto-Targeted at Class Bottleneck: Matrix Inversion</p>
                </div>
              </div>
              <button onClick={() => setShowMicroQuizModal(false)} className="text-gray-400 hover:text-black font-bold">?</button>
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
                ? Successfully dispatched to all 74 student devices via SkillsBuild Classroom!
              </div>
            ) : (
              <button
                onClick={() => setQuizDispatched(true)}
                className="w-full py-3.5 rounded-full bg-black text-white text-xs font-bold hover:scale-105 transition-all flex items-center justify-center gap-2"
              >
                <span>Dispatch 5-Minute Quiz to Class</span>
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
                <span className="text-2xl">??</span>
                <div>
                  <h3 className="font-display text-lg font-bold text-black">Automated Peer-to-Peer Matchmaker</h3>
                  <p className="text-xs text-gray-500">Pairing Red-Tier Students with Green-Tier Lab Mentors</p>
                </div>
              </div>
              <button onClick={() => setShowPeerMatchModal(false)} className="text-gray-400 hover:text-black font-bold">?</button>
            </div>

            <div className="flex flex-col gap-3 mb-6">
              <div className="p-4 rounded-2xl bg-[#fbf9f6] border border-gray-200 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-rose-700">Rohan Verma [Red Tier]</p>
                  <p className="text-[10px] text-gray-500">Struggling: Matrix Inversion</p>
                </div>
                <span className="text-lg">? ?? ?</span>
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
                <span className="text-lg">? ?? ?</span>
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
              Confirm Lab 4 Peer Pairings ?
            </button>
          </div>
        </div>
      )}

      {/* 1-Page Student Diagnostic Dossier Modal */}
      {showDossierModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-white rounded-[40px] p-8 max-w-lg w-full shadow-2xl border border-gray-200">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-6">
              <div className="flex items-center gap-2">
                <span className="text-2xl">??</span>
                <div>
                  <h3 className="font-display text-lg font-bold text-black">1-Page Clinical Dossier</h3>
                  <p className="text-xs text-gray-500">{selectedStudent.name} ({selectedStudent.rollNo})</p>
                </div>
              </div>
              <button onClick={() => setShowDossierModal(false)} className="text-gray-400 hover:text-black font-bold">?</button>
            </div>

            <div className="bg-[#fbf9f6] p-4 rounded-2xl border border-gray-200 mb-6 flex flex-col gap-2 text-xs">
              <div className="flex justify-between font-bold">
                <span>Predicted Mid-Term Failure Risk:</span>
                <span className="text-rose-600">{(selectedStudent.pFailMidterm * 100).toFixed(0)}%</span>
              </div>
              <div className="flex justify-between">
                <span>Attendance Rate:</span>
                <span>{(selectedStudent.attendanceRate * 100).toFixed(0)}%</span>
              </div>
              <div className="flex justify-between">
                <span>Weekly Study Hours:</span>
                <span>{selectedStudent.hoursSpentWeekly} hrs (Class Avg: 8.5 hrs)</span>
              </div>
              <div className="mt-2 pt-2 border-t border-gray-200">
                <p className="font-bold text-black">Root-Cause Prerequisite Decay:</p>
                <p className="text-gray-600 mt-1">
                  Struggling with Neural Network weights because Semester 1 Matrix Inversion mastery is at 28%. Recommend 10-minute visual transformation bridge.
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
                onClick={() => alert("Printing 1-page clinical dossier for office hours...")}
                className="flex-1 py-3 rounded-full bg-black text-white text-xs font-bold hover:scale-105 transition-all"
              >
                Print Dossier ???
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
