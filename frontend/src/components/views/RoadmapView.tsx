'use client';

import React, { useState } from 'react';
import { Network, ArrowRight, CheckCircle2, Lock, AlertTriangle, Code2, Sliders, FileText, Video, Sparkles } from 'lucide-react';

export const RoadmapDAGView: React.FC = () => {
  const [selectedNode, setSelectedNode] = useState<any | null>(null);
  const [activeModality, setActiveModality] = useState<'code' | 'sim' | 'proof' | 'video'>('sim');
  const [dwellTimeSec, setDwellTimeSec] = useState(45);
  const [retryCount, setRetryCount] = useState(1);
  const [socraticStep, setSocraticStep] = useState(1);

  const academicNodes = [
    { id: 'math-01', label: 'Matrix Basics', category: 'Academic Math', status: 'MASTERED', mastery: 95 },
    { id: 'math-02', label: 'Determinants', category: 'Academic Math', status: 'MASTERED', mastery: 88 },
    { id: 'math-03', label: 'Matrix Inversion', category: 'Academic Math', status: 'IN_PROGRESS', mastery: 42, bottleneck: true },
    { id: 'math-04', label: 'Eigenvalues', category: 'Academic Math', status: 'LOCKED', mastery: 0 },
    { id: 'math-05', label: 'Multivariable Chain Rule', category: 'Calculus II', status: 'IN_PROGRESS', mastery: 28, bottleneck: true },
  ];

  const careerNodes = [
    { id: 'ai-01', label: 'Data Preprocessing', category: 'AI Engineer Track', status: 'MASTERED', mastery: 92 },
    { id: 'ai-02', label: 'Gradient Descent Optimization', category: 'AI Engineer Track', status: 'IN_PROGRESS', mastery: 55 },
    { id: 'ai-03', label: 'PCA & SVD Dimensionality', category: 'AI Engineer Track', status: 'BLOCKED', blockedBy: 'Matrix Inversion (42%)' },
    { id: 'ai-04', label: 'Neural Net Backpropagation', category: 'AI Engineer Track', status: 'BLOCKED', blockedBy: 'Multivariable Chain Rule (28%)' },
    { id: 'ai-05', label: 'Full Capstone Deployment', category: 'IBM Credential', status: 'LOCKED' },
  ];

  // Auto-switch modality when dwell time indicates friction
  const isFrictionDetected = dwellTimeSec > 120 || retryCount >= 3;

  return (
    <div className="max-w-[1440px] mx-auto px-6 md:px-12 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-gray-200 mb-8">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-[#ffe24c] text-black text-[11px] font-bold uppercase">
              Dual-Horizon Knowledge DAG
            </span>
            <span className="text-xs text-gray-500 font-semibold">Bridging College Math ? AI Engineer Competencies</span>
          </div>
          <h2 className="font-display text-2xl md:text-3xl font-bold text-black mt-1">
            Dynamic Curriculum & Prerequisite Graph
          </h2>
        </div>

        {/* LinUCB Friction Indicator Pill */}
        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-gray-200 shadow-sm">
          <span className={`w-2.5 h-2.5 rounded-full ${isFrictionDetected ? 'bg-amber-500 animate-ping' : 'bg-emerald-500'}`}></span>
          <span className="text-xs font-bold text-black">
            {isFrictionDetected ? 'LinUCB: Friction Detected (Adapting Modality)' : 'LinUCB: Optimal Pacing'}
          </span>
        </div>
      </div>

      {/* Main Split Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left 7 Cols: The Dual-Horizon Connected Graph */}
        <div className="lg:col-span-7 bg-white rounded-[32px] p-6 md:p-8 shadow-xl border border-gray-200 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-base font-bold text-black flex items-center gap-2">
                <Network className="w-4 h-4 text-[#0f62fe]" />
                Prerequisite Knowledge Directed Acyclic Graph (DAG)
              </h3>
              <span className="text-[11px] text-gray-400">Click any node to inspect</span>
            </div>

            {/* Top Horizon: AI Engineer Career Track */}
            <div className="mb-6">
              <p className="text-[11px] font-bold text-purple-700 uppercase tracking-wider mb-2">
                Top Horizon: Industry Career Track (AI Engineer)
              </p>
              <div className="grid grid-cols-5 gap-2">
                {careerNodes.map((node) => (
                  <div
                    key={node.id}
                    onClick={() => setSelectedNode(node)}
                    className={`p-3 rounded-2xl border text-center cursor-pointer transition-all hover:scale-105 ${
                      node.status === 'MASTERED'
                        ? 'bg-emerald-50 border-emerald-400 text-emerald-900'
                        : node.status === 'BLOCKED'
                        ? 'bg-rose-50 border-rose-300 text-rose-900 shadow-sm'
                        : node.status === 'IN_PROGRESS'
                        ? 'bg-amber-50 border-amber-400 text-amber-900'
                        : 'bg-gray-50 border-gray-200 text-gray-400'
                    }`}
                  >
                    <div className="text-[10px] font-bold uppercase mb-1">
                      {node.status === 'MASTERED' ? '? Done' : node.status === 'BLOCKED' ? '?? Blocked' : 'Active'}
                    </div>
                    <p className="text-xs font-bold leading-tight line-clamp-2">{node.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Connecting Bridge Arrow indicator */}
            <div className="flex items-center justify-center py-2 text-xs font-bold text-gray-400 uppercase tracking-widest gap-2">
              <span>? Prerequisite Dependency Bridge (MathE Data) ?</span>
            </div>

            {/* Bottom Horizon: Academic College Curriculum */}
            <div>
              <p className="text-[11px] font-bold text-[#6d5e00] uppercase tracking-wider mb-2">
                Bottom Horizon: College Classroom Syllabus (Dr. Sharma CS302)
              </p>
              <div className="grid grid-cols-5 gap-2">
                {academicNodes.map((node) => (
                  <div
                    key={node.id}
                    onClick={() => setSelectedNode(node)}
                    className={`p-3 rounded-2xl border text-center cursor-pointer transition-all hover:scale-105 ${
                      node.status === 'MASTERED'
                        ? 'bg-emerald-50 border-emerald-400 text-emerald-900'
                        : node.bottleneck
                        ? 'bg-amber-50 border-amber-400 text-amber-900'
                        : 'bg-gray-50 border-gray-200 text-gray-400'
                    }`}
                  >
                    <div className="text-[10px] font-bold uppercase mb-1">
                      {node.mastery > 0 ? `${node.mastery}%` : 'Locked'}
                    </div>
                    <p className="text-xs font-bold leading-tight line-clamp-2">{node.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Root-Cause Inspection Alert Banner */}
          <div className="mt-6 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-black">Root-Cause Prerequisite Diagnostic Detected:</p>
              <p className="mt-0.5">
                Rohan is struggling with <strong>Neural Network Backpropagation</strong> because 1st-year <strong>Multivariable Chain Rule</strong> is at 28% mastery. The system has automatically queued a 5-minute refresher bridge!
              </p>
            </div>
          </div>
        </div>

        {/* Right 5 Cols: Adaptive Multi-Modal Content Player (LinUCB) */}
        <div className="lg:col-span-5 bg-white rounded-[32px] p-6 shadow-xl border border-gray-200 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
              <div>
                <span className="text-[10px] font-bold text-purple-700 uppercase">Active LinUCB Modality</span>
                <h4 className="font-display text-sm font-bold text-black">Matrix Space Transformation</h4>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-[#ffe24c] text-black text-[10px] font-mono font-bold">
                Adaptive
              </span>
            </div>

            {/* Modality Selector Tabs */}
            <div className="grid grid-cols-4 gap-1 bg-[#f5f3f0] p-1 rounded-2xl mb-4 text-xs font-bold">
              <button
                onClick={() => setActiveModality('sim')}
                className={`py-1.5 rounded-xl transition-all ${activeModality === 'sim' ? 'bg-black text-white shadow-sm' : 'text-gray-600'}`}
              >
                Visual Sim
              </button>
              <button
                onClick={() => setActiveModality('code')}
                className={`py-1.5 rounded-xl transition-all ${activeModality === 'code' ? 'bg-black text-white shadow-sm' : 'text-gray-600'}`}
              >
                Python Lab
              </button>
              <button
                onClick={() => setActiveModality('proof')}
                className={`py-1.5 rounded-xl transition-all ${activeModality === 'proof' ? 'bg-black text-white shadow-sm' : 'text-gray-600'}`}
              >
                Math Proof
              </button>
              <button
                onClick={() => setActiveModality('video')}
                className={`py-1.5 rounded-xl transition-all ${activeModality === 'video' ? 'bg-black text-white shadow-sm' : 'text-gray-600'}`}
              >
                Micro Video
              </button>
            </div>

            {/* Dynamic Content Window */}
            {activeModality === 'sim' && (
              <div className="bg-[#fbf9f6] p-4 rounded-2xl border border-gray-200 flex flex-col items-center justify-center min-h-[220px] text-center">
                <div className="w-28 h-28 border-2 border-dashed border-amber-400 rounded-xl relative flex items-center justify-center mb-3 bg-white shadow-sm">
                  <div className="w-16 h-16 bg-[#ffe24c]/40 rounded-lg transform rotate-12 flex items-center justify-center text-xs font-bold">
                    Area = 0
                  </div>
                </div>
                <p className="text-xs font-bold text-black">Interactive 2D Space Stretcher</p>
                <p className="text-[11px] text-gray-500">Notice how basis vector i-hat (3, 6) and j-hat (2, 4) land on the exact same linear line!</p>
              </div>
            )}

            {activeModality === 'code' && (
              <div className="bg-black text-white font-mono text-[11px] p-4 rounded-2xl overflow-x-auto min-h-[220px]">
                <p className="text-gray-400"># Verifying determinant in NumPy</p>
                <p className="text-purple-300">import numpy as np</p>
                <p className="mt-1">A = np.array([[3, 2], [6, 4]])</p>
                <p className="text-emerald-400">det_A = np.linalg.det(A)</p>
                <p className="mt-2 text-[#ffe24c]">print("det(A) =", round(det_A)) # Output: 0.0</p>
              </div>
            )}

            {activeModality === 'proof' && (
              <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200 text-xs min-h-[220px]">
                <p className="font-bold text-black mb-2">Formal Invertibility Theorem:</p>
                <p className="text-gray-700">A square matrix A is invertible if and only if det(A) != 0.</p>
                <div className="font-mono text-[11px] bg-white p-2 rounded-xl border border-gray-200 my-2 text-purple-900">
                  A^(-1) = (1 / det(A)) * adj(A)
                </div>
                <p className="text-gray-500 text-[10px]">Since division by 0 is undefined, inverse cannot exist.</p>
              </div>
            )}

            {activeModality === 'video' && (
              <div className="bg-slate-900 text-white p-6 rounded-2xl flex flex-col items-center justify-center min-h-[220px] text-center">
                <Video className="w-8 h-8 text-[#ffe24c] mb-2" />
                <p className="text-xs font-bold">3-Minute Socratic Micro-Video</p>
                <p className="text-[11px] text-gray-400 mt-1">Explaining Matrix Collapse with 3Blue1Brown visual style</p>
              </div>
            )}

            {/* Socratic Scaffolding Prompt Box (IBM Granite) */}
            <div className="mt-4 p-3.5 rounded-2xl bg-[#e5deff]/40 border border-[#e5deff] text-xs">
              <div className="flex items-center gap-1.5 font-bold text-[#1b1735] mb-1">
                <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                <span>Skillbee Socratic Hint (Step {socraticStep} of 3)</span>
              </div>
              <p className="text-[11px] text-gray-700">
                {socraticStep === 1 && "Think of det(A) like a scale on a rubber sheet. What happens to a square when scale factor is 0?"}
                {socraticStep === 2 && "The entire 2D area squashes into a zero-area flat line. Can you reconstruct a 2D square from a line?"}
                {socraticStep === 3 && "No, information is permanently destroyed. Hence, no inverse exists!"}
              </p>
              <button
                onClick={() => setSocraticStep((socraticStep % 3) + 1)}
                className="mt-2 text-[10px] font-bold text-purple-800 underline"
              >
                Next Progressive Hint ?
              </button>
            </div>
          </div>

          {/* Interactive Dwell-Time Friction Simulator */}
          <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-600">
            <span>Simulate Dwell Friction:</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setDwellTimeSec(dwellTimeSec === 45 ? 180 : 45)}
                className={`px-3 py-1 rounded-full text-[10px] font-bold border transition-all ${
                  dwellTimeSec > 100
                    ? 'bg-amber-100 text-amber-800 border-amber-300'
                    : 'bg-gray-100 text-gray-700 border-gray-200'
                }`}
              >
                {dwellTimeSec > 100 ? 'High Dwell (180s Friction)' : 'Normal Dwell (45s)'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
