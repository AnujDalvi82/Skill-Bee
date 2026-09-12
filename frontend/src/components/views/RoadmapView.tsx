'use client';

import React, { useState } from 'react';
import {
  Network,
  ArrowRight,
  CheckCircle2,
  Lock,
  AlertTriangle,
  Code2,
  Sliders,
  FileText,
  Video,
  Sparkles,
  Play,
  PlayCircle,
  ExternalLink,
  ChevronRight,
  GitBranch,
  Layers,
  BookOpen,
  HelpCircle,
  Zap
} from 'lucide-react';
import { Latex } from '@/components/common/Latex';
import { DemoView } from '@/components/layout/PitchNavigatorBar';

interface RoadmapDAGViewProps {
  onNavigate?: (view: DemoView) => void;
}

// Tree node definition for Machine Learning topics
interface MLTreeNode {
  id: string;
  stage: number;
  stageName: string;
  label: string;
  category: 'Foundation Math' | 'Classical ML' | 'Deep Learning' | 'Capstone';
  status: 'MASTERED' | 'IN_PROGRESS' | 'BOTTLENECK' | 'BLOCKED' | 'LOCKED';
  mastery: number;
  prereqName?: string;
  prereqMastery?: number;
  videoBridge: {
    title: string;
    channel: string;
    timestamp: string;
    timestampSec: number;
    recommendedReason: string;
    actionLabel: string;
  };
}

export const RoadmapDAGView: React.FC<RoadmapDAGViewProps> = ({ onNavigate }) => {
  // Machine Learning Linear Tree Hierarchy
  const mlTreeStages: { stage: number; stageName: string; description: string; nodes: MLTreeNode[] }[] = [
    {
      stage: 1,
      stageName: 'Stage 1: Linear Algebra & Calculus Foundations',
      description: 'The prerequisite mathematical bedrock for deep learning & optimization',
      nodes: [
        {
          id: 'node-1-1',
          stage: 1,
          stageName: 'Stage 1',
          label: 'Vectors, Basis & Dot Products',
          category: 'Foundation Math',
          status: 'MASTERED',
          mastery: 95,
          videoBridge: {
            title: '3Blue1Brown: Vectors, what even are they? (Linear Algebra Chapter 1)',
            channel: '3Blue1Brown',
            timestamp: '00:00',
            timestampSec: 0,
            recommendedReason: 'Mastered! You have a solid grasp of vector spaces and dot product projections.',
            actionLabel: 'Review Vectors Video'
          }
        },
        {
          id: 'node-1-2',
          stage: 1,
          stageName: 'Stage 1',
          label: 'Linear Transformations & Determinants',
          category: 'Foundation Math',
          status: 'MASTERED',
          mastery: 88,
          videoBridge: {
            title: '3Blue1Brown: Linear transformations and matrices (Linear Algebra Chapter 3)',
            channel: '3Blue1Brown',
            timestamp: '02:15',
            timestampSec: 135,
            recommendedReason: 'Mastered! You understand area scaling factors and determinants det(A).',
            actionLabel: 'Review Transformations'
          }
        },
        {
          id: 'node-1-3',
          stage: 1,
          stageName: 'Stage 1',
          label: 'Matrix Inversion & Area Collapse',
          category: 'Foundation Math',
          status: 'BOTTLENECK',
          mastery: 42,
          prereqName: 'Determinants (det(A) != 0)',
          prereqMastery: 88,
          videoBridge: {
            title: '3Blue1Brown: Inverse matrices, column space and null space (Chapter 7)',
            channel: '3Blue1Brown',
            timestamp: '04:30',
            timestampSec: 270,
            recommendedReason: '⚠️ Active Bottleneck! When det(A) = 0, 2D space collapses into a 1D line, causing information loss. Watch the visual transformation bridge to master matrix inversion.',
            actionLabel: 'Watch Matrix Inversion Video (04:30)'
          }
        },
        {
          id: 'node-1-4',
          stage: 1,
          stageName: 'Stage 1',
          label: 'Multivariable Calculus & Chain Rule',
          category: 'Foundation Math',
          status: 'BOTTLENECK',
          mastery: 28,
          prereqName: 'Single Variable Derivatives',
          prereqMastery: 75,
          videoBridge: {
            title: '3Blue1Brown: Multivariable chain rule & partial derivatives explained visually',
            channel: '3Blue1Brown',
            timestamp: '06:10',
            timestampSec: 370,
            recommendedReason: '⚠️ Critical Prerequisite Decay! Neural network backpropagation relies completely on the multivariable chain rule. Master this 5-minute bridge to unblock Deep Learning.',
            actionLabel: 'Watch Chain Rule Visual Video (06:10)'
          }
        }
      ]
    },
    {
      stage: 2,
      stageName: 'Stage 2: Classical Machine Learning & Optimization',
      description: 'Statistical estimation, cost functions, and dimensionality reduction',
      nodes: [
        {
          id: 'node-2-1',
          stage: 2,
          stageName: 'Stage 2',
          label: 'Linear & Logistic Regression',
          category: 'Classical ML',
          status: 'MASTERED',
          mastery: 92,
          prereqName: 'Vectors & Dot Products',
          prereqMastery: 95,
          videoBridge: {
            title: 'StatQuest: Logistic Regression and Sigmoid Function Intuition',
            channel: 'StatQuest',
            timestamp: '01:30',
            timestampSec: 90,
            recommendedReason: 'Mastered! You understand separating hyperplanes and probability squashing.',
            actionLabel: 'Review Regression Video'
          }
        },
        {
          id: 'node-2-2',
          stage: 2,
          stageName: 'Stage 2',
          label: 'Gradient Descent & Cost Optimization',
          category: 'Classical ML',
          status: 'IN_PROGRESS',
          mastery: 55,
          prereqName: 'Partial Derivatives',
          prereqMastery: 65,
          videoBridge: {
            title: '3Blue1Brown: Gradient descent, how neural networks learn (Chapter 2)',
            channel: '3Blue1Brown',
            timestamp: '03:15',
            timestampSec: 195,
            recommendedReason: '⚡ In Progress! Gradient descent calculates the negative gradient vector to find minimum cost. Watch how the ball rolls downhill in 3D space.',
            actionLabel: 'Watch Gradient Descent Video'
          }
        },
        {
          id: 'node-2-3',
          stage: 2,
          stageName: 'Stage 2',
          label: 'Dimensionality Reduction (PCA & SVD)',
          category: 'Classical ML',
          status: 'BLOCKED',
          mastery: 0,
          prereqName: 'Matrix Inversion & Area (42%)',
          prereqMastery: 42,
          videoBridge: {
            title: '3Blue1Brown: Eigenvectors and eigenvalues (Linear Algebra Chapter 14)',
            channel: '3Blue1Brown',
            timestamp: '05:00',
            timestampSec: 300,
            recommendedReason: '🔒 Blocked Prerequisite! PCA requires rotating space along principal eigenvectors. Unblock Matrix Inversion first to unlock this topic.',
            actionLabel: 'Watch Matrix & Eigenvalue Video'
          }
        }
      ]
    },
    {
      stage: 3,
      stageName: 'Stage 3: Deep Learning & Neural Computation (Current Focus)',
      description: 'Multilayer perceptrons, weight matrices, and backpropagation',
      nodes: [
        {
          id: 'node-3-1',
          stage: 3,
          stageName: 'Stage 3',
          label: 'Multilayer Perceptrons & Sigmoid Activations',
          category: 'Deep Learning',
          status: 'IN_PROGRESS',
          mastery: 60,
          prereqName: 'Linear Transformations',
          prereqMastery: 88,
          videoBridge: {
            title: '3Blue1Brown: But what is a neural network? (Deep Learning Chapter 1)',
            channel: '3Blue1Brown',
            timestamp: '04:30',
            timestampSec: 270,
            recommendedReason: '⚡ Active Studio Lecture! Watch Grant Sanderson explain how 784 pixels map through weight matrices and sigmoid squashing.',
            actionLabel: 'Resume 3B1B Chapter 1 (04:30)'
          }
        },
        {
          id: 'node-3-2',
          stage: 3,
          stageName: 'Stage 3',
          label: 'Backpropagation & Chain Rule Gradients',
          category: 'Deep Learning',
          status: 'BLOCKED',
          mastery: 15,
          prereqName: 'Multivariable Chain Rule (28%)',
          prereqMastery: 28,
          videoBridge: {
            title: '3Blue1Brown: What is backpropagation really doing? (Chapter 3)',
            channel: '3Blue1Brown',
            timestamp: '04:30',
            timestampSec: 270,
            recommendedReason: '🔒 Blocked by Calculus! Backpropagation calculates dC/dw by cascading partial derivatives backward. We recommend watching the 3B1B prerequisite video below to unblock this concept.',
            actionLabel: 'Watch Prerequisite Video in Studio'
          }
        },
        {
          id: 'node-3-3',
          stage: 3,
          stageName: 'Stage 3',
          label: 'Stochastic Gradient Descent & Adam Optimizer',
          category: 'Deep Learning',
          status: 'LOCKED',
          mastery: 0,
          prereqName: 'Backpropagation',
          prereqMastery: 15,
          videoBridge: {
            title: '3Blue1Brown: Backpropagation calculus (Deep Learning Chapter 4)',
            channel: '3Blue1Brown',
            timestamp: '02:00',
            timestampSec: 120,
            recommendedReason: '🔒 Locked! Complete Backpropagation to unlock adaptive momentum optimizers.',
            actionLabel: 'Preview Chapter 4 Video'
          }
        }
      ]
    },
    {
      stage: 4,
      stageName: 'Stage 4: Industry Capstone & Production Deployment',
      description: 'End-to-end model evaluation, benchmarking, and deployment',
      nodes: [
        {
          id: 'node-4-1',
          stage: 4,
          stageName: 'Stage 4',
          label: 'Full Capstone: MNIST Handwritten Digit Classifier',
          category: 'Capstone',
          status: 'LOCKED',
          mastery: 0,
          prereqName: 'Deep Learning Core',
          prereqMastery: 35,
          videoBridge: {
            title: 'IBM SkillsBuild: Deploying PyTorch Classifiers to Production Cloud',
            channel: 'IBM SkillsBuild',
            timestamp: '00:00',
            timestampSec: 0,
            recommendedReason: '🔒 Capstone Locked! Master the mathematical DAG to unlock your verified IBM SkillsBuild credential.',
            actionLabel: 'View Capstone Specs'
          }
        }
      ]
    }
  ];

  // Default selected node: The active blocked prerequisite node
  const [selectedNode, setSelectedNode] = useState<MLTreeNode>(
    mlTreeStages[2].nodes[1] // Node 3-2: Backpropagation
  );

  // LinUCB Modality states
  const [activeModality, setActiveModality] = useState<'video' | 'sim' | 'code' | 'proof'>('video');
  const [socraticStep, setSocraticStep] = useState(1);
  const [dwellTimeSec, setDwellTimeSec] = useState(45);

  const isFrictionDetected = dwellTimeSec > 100;

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-gray-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-[#ffe24c] text-black text-[11px] font-bold uppercase">
              Sequential Topic Tree
            </span>
            <span className="text-xs text-gray-500 font-semibold">
              Linear Machine Learning Curriculum & Prerequisite Graph
            </span>
          </div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-black mt-1">
            Machine Learning Knowledge Tree & DAG
          </h1>
          <p className="text-xs text-gray-600 mt-1">
            Click any concept in the linear tree to inspect prerequisites and open the recommended foundational video bridge.
          </p>
        </div>

        {/* LinUCB Friction Indicator Pill */}
        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-gray-200 shadow-sm">
          <span className={`w-2.5 h-2.5 rounded-full ${isFrictionDetected ? 'bg-amber-500 animate-ping' : 'bg-emerald-500'}`} />
          <span className="text-xs font-bold text-black">
            {isFrictionDetected ? 'LinUCB: Friction Detected on Prerequisite' : 'LinUCB: Optimal Pacing'}
          </span>
        </div>
      </div>

      {/* Main Split Layout: Linear Tree Flowchart (Left 7 Cols) + Prerequisite Video Side Box (Right 5 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left 7 Cols: Linear Topic Tree */}
        <div className="lg:col-span-7 bg-white rounded-[36px] p-6 md:p-8 shadow-sm border border-gray-200/80 space-y-8">
          
          <div className="flex items-center justify-between pb-4 border-b border-gray-100">
            <div className="flex items-center gap-2.5">
              <GitBranch className="w-5 h-5 text-[#0f62fe]" />
              <h2 className="font-display text-base font-bold text-black">
                Linear Learning Tree: Math Foundations &rarr; Deep Learning
              </h2>
            </div>
            <span className="text-[11px] text-gray-400 font-mono">11 Connected Nodes</span>
          </div>

          {/* Sequential Stages Flow */}
          <div className="space-y-8 relative">
            {/* Background vertical tree connector line */}
            <div className="absolute left-6 top-8 bottom-8 w-0.5 bg-gradient-to-b from-emerald-400 via-amber-400 to-gray-300 -z-0" />

            {mlTreeStages.map((stageItem) => (
              <div key={stageItem.stage} className="relative z-10 space-y-3">
                
                {/* Stage Header Badge */}
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-black text-[#ffe24c] font-bold text-sm flex items-center justify-center shadow-md shrink-0">
                    0{stageItem.stage}
                  </div>
                  <div>
                    <h3 className="font-display text-sm font-bold text-black">
                      {stageItem.stageName}
                    </h3>
                    <p className="text-[11px] text-gray-500 leading-tight">
                      {stageItem.description}
                    </p>
                  </div>
                </div>

                {/* Nodes under this stage (Linear Branch) */}
                <div className="ml-6 pl-6 border-l-2 border-dashed border-gray-200 space-y-2.5">
                  {stageItem.nodes.map((node) => {
                    const isSelected = selectedNode.id === node.id;
                    return (
                      <div
                        key={node.id}
                        onClick={() => setSelectedNode(node)}
                        className={`p-4 rounded-2xl border transition-all cursor-pointer relative ${
                          isSelected
                            ? 'bg-[#181917] text-white border-black shadow-lg scale-[1.01]'
                            : node.status === 'MASTERED'
                            ? 'bg-emerald-50/60 border-emerald-200 hover:border-emerald-400 text-black'
                            : node.status === 'BOTTLENECK'
                            ? 'bg-amber-50/70 border-amber-300 hover:border-amber-500 text-black shadow-sm'
                            : node.status === 'BLOCKED'
                            ? 'bg-rose-50/60 border-rose-200 hover:border-rose-400 text-black'
                            : node.status === 'IN_PROGRESS'
                            ? 'bg-blue-50/60 border-blue-200 hover:border-blue-400 text-black'
                            : 'bg-gray-50 border-gray-200 text-gray-400'
                        }`}
                      >
                        {/* Node Card Header */}
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className={`w-2.5 h-2.5 rounded-full ${
                              node.status === 'MASTERED'
                                ? 'bg-emerald-500'
                                : node.status === 'BOTTLENECK'
                                ? 'bg-amber-500 animate-pulse'
                                : node.status === 'BLOCKED'
                                ? 'bg-rose-500'
                                : node.status === 'IN_PROGRESS'
                                ? 'bg-[#0f62fe]'
                                : 'bg-gray-300'
                            }`} />
                            <span className={`text-xs font-bold ${isSelected ? 'text-white' : 'text-black'}`}>
                              {node.label}
                            </span>
                          </div>

                          {/* Status Tag */}
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold font-mono uppercase ${
                            isSelected
                              ? 'bg-[#ffe24c] text-black'
                              : node.status === 'MASTERED'
                              ? 'bg-emerald-100 text-emerald-800'
                              : node.status === 'BOTTLENECK'
                              ? 'bg-amber-100 text-amber-900'
                              : node.status === 'BLOCKED'
                              ? 'bg-rose-100 text-rose-800'
                              : node.status === 'IN_PROGRESS'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-gray-200 text-gray-600'
                          }`}>
                            {node.status === 'MASTERED' ? '✓ Mastered' : node.status === 'BOTTLENECK' ? '⚠️ Bottleneck' : node.status === 'BLOCKED' ? '🔒 Blocked' : node.status === 'IN_PROGRESS' ? '⚡ Active' : 'Locked'}
                          </span>
                        </div>

                        {/* Mastery Progress Bar */}
                        <div className="mt-2.5 flex items-center gap-3">
                          <div className={`flex-1 rounded-full h-1.5 overflow-hidden ${isSelected ? 'bg-white/20' : 'bg-gray-200'}`}>
                            <div
                              className={`h-full rounded-full transition-all ${
                                isSelected
                                  ? 'bg-[#ffe24c]'
                                  : node.status === 'MASTERED'
                                  ? 'bg-emerald-500'
                                  : node.status === 'BOTTLENECK'
                                  ? 'bg-amber-500'
                                  : node.status === 'BLOCKED'
                                  ? 'bg-rose-500'
                                  : 'bg-[#0f62fe]'
                              }`}
                              style={{ width: `${node.mastery}%` }}
                            />
                          </div>
                          <span className={`text-[11px] font-mono font-bold ${isSelected ? 'text-[#ffe24c]' : 'text-gray-600'}`}>
                            {node.mastery}%
                          </span>
                        </div>

                        {/* Prerequisite Note if blocked */}
                        {node.prereqName && (
                          <div className={`mt-2 text-[10px] flex items-center justify-between ${
                            isSelected ? 'text-gray-300' : 'text-gray-500'
                          }`}>
                            <span>Requires: <strong>{node.prereqName}</strong></span>
                            {node.prereqMastery !== undefined && (
                              <span className={node.prereqMastery >= 70 ? 'text-emerald-500 font-bold' : 'text-amber-500 font-bold'}>
                                Current: {node.prereqMastery}%
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

              </div>
            ))}
          </div>

        </div>

        {/* Right 5 Cols: Side Comment Box for Redirection to Basic Video */}
        <div className="lg:col-span-5 space-y-6 sticky top-24">
          
          {/* Main Prerequisite Video Comment Box */}
          <div className="bg-gradient-to-br from-[#181917] to-[#252623] text-white rounded-[36px] p-6 md:p-7 shadow-xl border border-[#333530] relative overflow-hidden">
            {/* Glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#ffe24c]/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 space-y-4">
              
              {/* Box Header */}
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-[#ffe24c] flex items-center justify-center text-black font-bold text-xs">
                    💬
                  </div>
                  <div>
                    <span className="text-[10px] font-mono font-bold text-[#ffe24c] uppercase block">
                      Prerequisite Video Bridge
                    </span>
                    <h3 className="font-display text-sm font-bold text-white">
                      Foundational Recommendation
                    </h3>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-white/10 text-gray-300 text-[10px] font-mono">
                  {selectedNode.label}
                </span>
              </div>

              {/* Side Comment Box Speech Bubble */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-xs space-y-2 relative">
                <p className="text-gray-300 leading-relaxed">
                  {selectedNode.videoBridge.recommendedReason}
                </p>
                <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-gray-400">
                  <span>Selected Node:</span>
                  <strong className="text-white">{selectedNode.label} ({selectedNode.mastery}%)</strong>
                </div>
              </div>

              {/* Basic Prerequisite Video Card */}
              <div className="p-4 rounded-2xl bg-[#111210] border border-[#2d2f2b] space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-xl bg-slate-900 border border-white/10 flex items-center justify-center text-[#ffe24c] shrink-0 relative group cursor-pointer"
                    onClick={() => onNavigate?.('lecture')}
                  >
                    <Play className="w-5 h-5 fill-[#ffe24c]" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider block">
                      Recommended Basic Video
                    </span>
                    <h4 className="text-xs font-bold text-white truncate mt-0.5">
                      {selectedNode.videoBridge.title}
                    </h4>
                    <p className="text-[10px] text-gray-400 mt-0.5">
                      Curated by <strong>{selectedNode.videoBridge.channel}</strong> &bull; Recommended from <strong>{selectedNode.videoBridge.timestamp}</strong>
                    </p>
                  </div>
                </div>

                {/* Direct Redirection Button */}
                <button
                  onClick={() => onNavigate?.('lecture')}
                  className="w-full py-3 rounded-xl bg-[#ffe24c] hover:bg-amber-400 text-black text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-md"
                >
                  <Play className="w-3.5 h-3.5 fill-black" />
                  <span>{selectedNode.videoBridge.actionLabel}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Socratic Scaffolding Hint (IBM Granite) */}
              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 text-xs">
                <div className="flex items-center gap-1.5 font-bold text-white mb-1">
                  <Sparkles className="w-3.5 h-3.5 text-[#ffe24c]" />
                  <span>Socratic Cognitive Hint (Step {socraticStep} of 3)</span>
                </div>
                <p className="text-[11px] text-gray-300 leading-relaxed">
                  {socraticStep === 1 && "Notice how backpropagation calculates gradients by tracing paths in reverse. What mathematical rule allows decomposing df/dx into (df/du) * (du/dx)?"}
                  {socraticStep === 2 && "It is the Multivariable Chain Rule! Without this, you cannot determine how each weight affects the final output error."}
                  {socraticStep === 3 && "By watching the visual bridge from 04:30, you see weights as scale knobs, making the calculus immediately intuitive!"}
                </p>
                <button
                  onClick={() => setSocraticStep((socraticStep % 3) + 1)}
                  className="mt-2 text-[10px] font-bold text-[#ffe24c] hover:underline flex items-center gap-1"
                >
                  <span>Next Progressive Hint</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>

            </div>
          </div>

          {/* Adaptive Multi-Modal Content Player (LinUCB) */}
          <div className="bg-white rounded-[36px] p-6 shadow-sm border border-gray-200/80 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div>
                <span className="text-[10px] font-bold text-purple-700 uppercase">Adaptive LinUCB Engine</span>
                <h4 className="font-display text-sm font-bold text-black">Alternative Learning Modalities</h4>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-[#ffe24c] text-black text-[10px] font-mono font-bold">
                LinUCB Bandit
              </span>
            </div>

            {/* Modality Selector Tabs */}
            <div className="grid grid-cols-4 gap-1 bg-gray-100 p-1 rounded-2xl text-xs font-bold">
              <button
                onClick={() => setActiveModality('video')}
                className={`py-1.5 rounded-xl transition-all ${activeModality === 'video' ? 'bg-black text-white shadow-sm' : 'text-gray-600'}`}
              >
                Video
              </button>
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
            </div>

            {/* Dynamic Modality Display */}
            {activeModality === 'video' && (
              <div className="bg-slate-900 text-white p-5 rounded-2xl flex flex-col items-center justify-center text-center space-y-2">
                <Video className="w-8 h-8 text-[#ffe24c]" />
                <p className="text-xs font-bold">Foundational Video Available</p>
                <p className="text-[11px] text-gray-400">
                  {selectedNode.videoBridge.title}
                </p>
                <button
                  onClick={() => onNavigate?.('lecture')}
                  className="px-4 py-1.5 rounded-full bg-[#ffe24c] text-black text-xs font-bold hover:scale-105 transition-all mt-1"
                >
                  Open Studio Player
                </button>
              </div>
            )}

            {activeModality === 'sim' && (
              <div className="bg-[#fbf9f6] p-4 rounded-2xl border border-gray-200 flex flex-col items-center justify-center text-center">
                <div className="w-24 h-24 border-2 border-dashed border-amber-400 rounded-xl flex items-center justify-center mb-2 bg-white">
                  <div className="w-14 h-14 bg-[#ffe24c]/40 rounded-lg transform rotate-12 flex items-center justify-center text-[10px] font-bold">
                    Area = 0
                  </div>
                </div>
                <p className="text-xs font-bold text-black">Interactive 2D Transformation</p>
                <p className="text-[11px] text-gray-500 mt-0.5">Basis vectors i-hat and j-hat land on the exact same linear line when det(A) = 0.</p>
              </div>
            )}

            {activeModality === 'code' && (
              <div className="bg-black text-white font-mono text-[11px] p-4 rounded-2xl overflow-x-auto space-y-1">
                <p className="text-gray-400"># Verifying determinant in NumPy</p>
                <p className="text-purple-300">import numpy as np</p>
                <p>A = np.array([[3, 2], [6, 4]])</p>
                <p className="text-emerald-400">det_A = np.linalg.det(A)</p>
                <p className="text-[#ffe24c]">print(&quot;det(A) =&quot;, round(det_A)) # Output: 0.0</p>
              </div>
            )}

            {activeModality === 'proof' && (
              <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200 text-xs space-y-2">
                <p className="font-bold text-black">Formal Invertibility Theorem:</p>
                <p className="text-gray-700">A square matrix A is invertible if and only if <Latex math="\det(A) \neq 0" inline />.</p>
                <div className="bg-white p-2.5 rounded-xl border border-gray-200 text-center text-purple-900 shadow-inner">
                  <Latex math="A^{-1} = \frac{1}{\det(A)} \cdot \text{adj}(A)" />
                </div>
                <p className="text-gray-500 text-[10px]">Since division by 0 is undefined, inverse cannot exist when determinant vanishes.</p>
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
};
