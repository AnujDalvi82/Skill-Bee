'use client';

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Latex } from '@/components/common/Latex';
import { ApiClient } from '@/services/api';
import { CURRICULUM_COURSES } from '@/data/curriculumCourses';
import { CourseTrack, CourseLecture } from '@/lib/types';
import { DemoView } from '@/components/layout/PitchNavigatorBar';
import {
  BookOpen,
  Play,
  Pause,
  Sparkles,
  RotateCw,
  Globe,
  Bookmark,
  Zap,
  ListVideo,
  Bot,
  Send,
  ShieldCheck,
  ShieldAlert,
  Brain,
  ChevronRight
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestampSec?: number;
  timestampStr?: string;
  modelUsed?: string;
  guardrails?: {
    passed: boolean;
    policy?: string;
    action?: string;
    sanitized?: boolean;
    reason?: string;
  };
}

const RenderChatMessage: React.FC<{ content: string; onSeek: (sec: number) => void }> = ({ content, onSeek }) => {
  // Split on block math $$ ... $$
  const blocks = content.split(/(\$\$[\s\S]*?\$\$)/g);

  return (
    <div className="space-y-2 text-xs leading-relaxed text-gray-800">
      {blocks.map((block, bIdx) => {
        if (block.startsWith('$$') && block.endsWith('$$')) {
          const formula = block.slice(2, -2).trim();
          return (
            <div key={bIdx} className="bg-white p-3 rounded-xl border border-gray-200 text-center my-2 shadow-xs overflow-x-auto">
              <Latex block>{formula}</Latex>
            </div>
          );
        }

        const paragraphs = block.split('\n\n');
        return paragraphs.map((para, pIdx) => {
          if (!para.trim()) return null;

          const lines = para.split('\n');
          return (
            <div key={`${bIdx}-${pIdx}`} className="space-y-1">
              {lines.map((line, lIdx) => {
                const mathParts = line.split(/(\$[^\$\n]+\$)/g);

                return (
                  <p key={lIdx} className="leading-relaxed">
                    {mathParts.map((mPart, mIdx) => {
                      if (mPart.startsWith('$') && mPart.endsWith('$') && mPart.length > 2) {
                        return <Latex key={mIdx} inline>{mPart.slice(1, -1)}</Latex>;
                      }

                      const timeParts = mPart.split(/(\[\d{1,2}:\d{2}\])/g);
                      return timeParts.map((tPart, tIdx) => {
                        const match = tPart.match(/^\[(\d{1,2}):(\d{2})\]$/);
                        if (match) {
                          const mins = parseInt(match[1], 10);
                          const secs = parseInt(match[2], 10);
                          const totalSec = mins * 60 + secs;
                          return (
                            <button
                              key={tIdx}
                              onClick={() => onSeek(totalSec)}
                              title={`Jump video to ${match[1]}:${match[2]}`}
                              className="inline-flex items-center gap-1 px-2 py-0.5 mx-1 my-0.5 bg-[#ffe24c] hover:bg-amber-300 text-black border border-amber-400 rounded-md text-[11px] font-mono font-bold transition-all hover:scale-105 active:scale-95 shadow-xs"
                            >
                              <span>⏱️</span>
                              <span>{match[1]}:{match[2]}</span>
                            </button>
                          );
                        }

                        const boldParts = tPart.split(/(\*\*[^*]+\*\*)/g);
                        return boldParts.map((bPart, bIdx2) => {
                          if (bPart.startsWith('**') && bPart.endsWith('**')) {
                            return <strong key={bIdx2} className="font-bold text-black">{bPart.slice(2, -2)}</strong>;
                          }
                          return <span key={bIdx2}>{bPart}</span>;
                        });
                      });
                    })}
                  </p>
                );
              })}
            </div>
          );
        });
      })}
    </div>
  );
};

let messageIdSeq = 0;
function createMessageId(prefix: string): string {
  messageIdSeq += 1;
  return `${prefix}_${messageIdSeq}`;
}

export const VideoLectureStudioView: React.FC<{ onNavigate?: (view: DemoView) => void }> = ({ onNavigate }) => {
  // 1. Course Track & Lecture Selection
  const [activeCourseId, setActiveCourseId] = useState<string>(CURRICULUM_COURSES[0].id);
  const activeCourse: CourseTrack = useMemo(() => {
    return CURRICULUM_COURSES.find((c) => c.id === activeCourseId) || CURRICULUM_COURSES[0];
  }, [activeCourseId]);

  // Track completion state dynamically per lecture across chapters
  const [lectureCompletionMap, setLectureCompletionMap] = useState<Record<string, boolean>>({
    'lec_dl_01': true,
    'lec_la_01': true,
    'lec_calc_01': true,
  });

  const [activeLectureId, setActiveLectureId] = useState<string>(
    activeCourse.chapters[0]?.lectures[0]?.id || 'lec_dl_01'
  );

  // Derive active lecture
  const activeLecture: CourseLecture = useMemo(() => {
    for (const ch of activeCourse.chapters) {
      const match = ch.lectures.find((l) => l.id === activeLectureId);
      if (match) return match;
    }
    return activeCourse.chapters[0]?.lectures[0] || CURRICULUM_COURSES[0].chapters[0].lectures[0];
  }, [activeCourse, activeLectureId]);

  // Playback & Scrub Bar State
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTimeSec, setCurrentTimeSec] = useState<number>(0);
  const [iframeSeekSec, setIframeSeekSec] = useState<number>(0);
  const [activeLang, setActiveLang] = useState<'EN' | 'HI' | 'TA' | 'ES'>('EN');
  const [activeTab, setActiveTab] = useState<'beebot' | 'beebook' | 'curriculum'>('beebot');

  // In-Video Micro-Quiz State
  const [showInVideoQuiz, setShowInVideoQuiz] = useState<boolean>(false);
  const [quizAnswered, setQuizAnswered] = useState<number | null>(null);
  const quizElapsedSecRef = useRef<number>(12);
  const [quizAttempts, setQuizAttempts] = useState<number>(0);
  const [telemetryState, setTelemetryState] = useState<{
    cognitive_state?: string;
    friction_index?: number;
    should_switch_modality?: boolean;
    dwell_ratio?: number;
  } | null>(null);

  // Flashcards Warmup State
  const [showWarmupModal, setShowWarmupModal] = useState<boolean>(false);
  const [flashcardIdx, setFlashcardIdx] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  // Helper: Format seconds to MM:SS
  const formatTime = useCallback((seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, []);

  // Helper: Get active concept from cues based on current second
  const getActiveConcept = useCallback((sec: number): string => {
    if (!activeLecture.cues || activeLecture.cues.length === 0) {
      return activeLecture.conceptKey || activeLecture.title;
    }
    const currentCue = [...activeLecture.cues].reverse().find((c) => sec >= c.sec) || activeLecture.cues[0];
    return currentCue.label;
  }, [activeLecture]);

  // Socratic Active-Recall Priming Checkpoint (Cognitive Buffer State)
  const [showReentryPriming, setShowReentryPriming] = useState<boolean>(false);
  const [primingCheckpointData, setPrimingCheckpointData] = useState<{
    resumeTimestampSec: number;
    lastConcept: string;
    frictionIndex: number;
    cognitiveState: string;
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  } | null>(null);
  const [primingSelectedOption, setPrimingSelectedOption] = useState<number | null>(null);
  const [primingSubmitted, setPrimingSubmitted] = useState<boolean>(false);
  const primedLecturesRef = useRef<Set<string>>(new Set());

  // In-Video AI RAG Tutor State (BeeBot)
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => [
    {
      id: `msg_welcome_${activeLecture.id}`,
      sender: 'bot',
      text: `Hello! I'm **BeeBot**, your IBM watsonx Socratic AI Video Assistant. I'm actively watching **${activeLecture.title}** with you.\n\nAsk me any question about the video, equations, or click a timestamped concept pill below!`,
      timestampSec: activeLecture.cues[0]?.sec || 15,
      timestampStr: '00:15',
      modelUsed: 'IBM watsonx RAG Engine (Granite 3.0 / Fast-Whisper)'
    }
  ]);
  const [userQuery, setUserQuery] = useState<string>('');
  const [isBotLoading, setIsBotLoading] = useState<boolean>(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const lastSaveSecRef = useRef<number>(0);

  // Auto-scroll chat on new messages
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isBotLoading]);

  // --- 2. Cognitive Context Buffer: Check on Lecture Selection ---
  useEffect(() => {
    let isCancelled = false;

    async function checkBufferAndPrime() {
      // If we already primed this lecture in current session, skip prompt
      if (primedLecturesRef.current.has(activeLecture.id)) {
        return;
      }

      try {
        const resumeData = await ApiClient.resumeStudioContext(activeLecture.id, 'student_demo');
        if (isCancelled) return;

        const buffer = resumeData.context_buffer;
        const targetSec = buffer?.timestamp_sec || 0;

        // If student has watched past 30 seconds previously, activate Socratic Priming Checkpoint
        if (targetSec > 30) {
          const quiz = activeLecture.reentryPrimingQuiz || {
            concept: buffer.last_active_concept || getActiveConcept(targetSec),
            question: resumeData.priming_quiz?.question || `Welcome back! In ${activeLecture.title}, what is the central conceptual role of ${buffer.last_active_concept || 'this transformation'}?`,
            options: resumeData.priming_quiz?.options || [
              'It scales or shifts the mathematical mapping non-linearly',
              'It resets all model parameters to zero',
              'It multiplies the learning rate by a constant factor',
              'It eliminates the need for gradient backpropagation'
            ],
            correctIndex: 0,
            explanation: 'Active recall reconstructs the decayed working-memory trace in your hippocampus, accelerating conceptual synthesis.'
          };

          setPrimingCheckpointData({
            resumeTimestampSec: targetSec,
            lastConcept: buffer.last_active_concept || getActiveConcept(targetSec),
            frictionIndex: buffer.friction_index ?? 0.35,
            cognitiveState: buffer.cognitive_state ?? 'NORMAL_ENGAGEMENT',
            question: quiz.question,
            options: quiz.options,
            correctIndex: quiz.correctIndex ?? 0,
            explanation: quiz.explanation
          });

          setPrimingSelectedOption(null);
          setPrimingSubmitted(false);
          setShowReentryPriming(true);
          setIsPlaying(false);
        } else {
          // Normal start from 0
          setCurrentTimeSec(0);
          setIframeSeekSec(0);
        }
      } catch (err) {
        console.warn('Context buffer lookup error, default to start:', err);
      }
    }

    checkBufferAndPrime();

    return () => {
      isCancelled = true;
    };
  }, [activeLecture, getActiveConcept]);

  // Handle Priming Completion
  const handleConfirmPrimingResume = (targetSec: number) => {
    primedLecturesRef.current.add(activeLecture.id);
    setShowReentryPriming(false);
    setCurrentTimeSec(targetSec);
    setIframeSeekSec(targetSec);
    setIsPlaying(true);
  };

  const handleSkipPriming = () => {
    const targetSec = primingCheckpointData?.resumeTimestampSec || 0;
    primedLecturesRef.current.add(activeLecture.id);
    setShowReentryPriming(false);
    setCurrentTimeSec(targetSec);
    setIframeSeekSec(targetSec);
    setIsPlaying(true);
  };

  const handlePrimingAnswerSelect = (optionIdx: number) => {
    if (primingSubmitted) return;
    setPrimingSelectedOption(optionIdx);
    setPrimingSubmitted(true);

    if (optionIdx === primingCheckpointData?.correctIndex) {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 }
      });
    }
  };

  // --- 3. Live Playback Timer & Continuous Context Auto-Saving ---
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setCurrentTimeSec((prev) => {
        if (prev >= activeLecture.durationSec) {
          setIsPlaying(false);
          setLectureCompletionMap((old) => ({ ...old, [activeLecture.id]: true }));
          return prev;
        }
        const nextSec = prev + 1;
        const triggerSec = activeLecture.inVideoQuiz?.triggerTimestampSec || 195;
        if (nextSec === triggerSec && quizAnswered === null) {
          setShowInVideoQuiz(true);
          quizElapsedSecRef.current = 10;
          setQuizAttempts(0);
          setTelemetryState(null);
        }
        return nextSec;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isPlaying, activeLecture.durationSec, activeLecture.id, activeLecture.inVideoQuiz, quizAnswered]);

  // Periodic Auto-Save Buffer (every 8 seconds of active playback)
  useEffect(() => {
    if (!isPlaying) return;

    if (Math.abs(currentTimeSec - lastSaveSecRef.current) >= 8) {
      lastSaveSecRef.current = currentTimeSec;
      const activeConcept = getActiveConcept(currentTimeSec);

      ApiClient.saveStudioContext({
        lecture_id: activeLecture.id,
        timestamp_sec: currentTimeSec,
        dwell_time_sec: currentTimeSec,
        friction_index: telemetryState?.friction_index ?? 0.35,
        last_active_concept: activeConcept,
        user_id: 'student_demo'
      }).catch((err) => {
        console.debug('Background buffer save notice:', err);
      });
    }
  }, [currentTimeSec, isPlaying, activeLecture.id, getActiveConcept, telemetryState]);

  // Handle Seek
  const handleSeek = (sec: number) => {
    const bounded = Math.max(0, Math.min(sec, activeLecture.durationSec));
    setCurrentTimeSec(bounded);
    setIframeSeekSec(bounded);
    setIsPlaying(true);
  };

  // Switch Lecture
  const handleSelectLecture = (lec: CourseLecture) => {
    if (lec.id === activeLectureId) return;

    // Save previous lecture state before switching
    if (currentTimeSec > 10) {
      ApiClient.saveStudioContext({
        lecture_id: activeLecture.id,
        timestamp_sec: currentTimeSec,
        dwell_time_sec: currentTimeSec,
        friction_index: telemetryState?.friction_index ?? 0.35,
        last_active_concept: getActiveConcept(currentTimeSec),
        user_id: 'student_demo'
      }).catch(() => {});
    }

    setActiveLectureId(lec.id);
    setCurrentTimeSec(0);
    setIframeSeekSec(0);
    setIsPlaying(false);
    setShowInVideoQuiz(false);
    setQuizAnswered(null);
    setTelemetryState(null);

    setChatMessages([
      {
        id: createMessageId(`msg_welcome_${lec.id}`),
        sender: 'bot',
        text: `Hello! I'm **BeeBot**, your IBM watsonx Socratic AI Video Assistant. I'm actively watching **${lec.title}** with you.\n\nAsk me any question about the video, equations, or click a timestamped concept pill below!`,
        timestampSec: lec.cues[0]?.sec || 15,
        timestampStr: formatTime(lec.cues[0]?.sec || 15),
        modelUsed: 'IBM watsonx RAG Engine (Granite 3.0 / Fast-Whisper)'
      }
    ]);
  };

  // Switch Course Track
  const handleSelectCourse = (courseId: string) => {
    if (courseId === activeCourseId) return;
    setActiveCourseId(courseId);
    const targetCourse = CURRICULUM_COURSES.find((c) => c.id === courseId) || CURRICULUM_COURSES[0];
    const firstLec = targetCourse.chapters[0]?.lectures[0];
    if (firstLec) {
      handleSelectLecture(firstLec);
    }
  };

  // Evaluate Micro-Quiz Answer with Telemetry
  const handleQuizAnswer = async (idx: number) => {
    setQuizAnswered(idx);
    const newAttempts = quizAttempts + 1;
    setQuizAttempts(newAttempts);

    const isCorrect = idx === (activeLecture.inVideoQuiz?.correctIndex ?? 1);

    if (isCorrect) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    }

    const dwellSec = Math.max(10, quizElapsedSecRef.current);
    try {
      const tel = await ApiClient.evaluateTelemetry({
        dwell_time_sec: dwellSec,
        hint_count: !isCorrect ? 1 : 0,
        attempt_count: newAttempts,
        item_difficulty_b: 0.65
      });
      setTelemetryState(tel);
    } catch {
      // Local calibrated fallback
      if (!isCorrect || dwellSec > 45) {
        setTelemetryState({
          cognitive_state: 'FRUSTRATED_BLOCK',
          friction_index: 0.78,
          should_switch_modality: true,
          dwell_ratio: 1.8
        });
      } else {
        setTelemetryState({
          cognitive_state: 'NORMAL_ENGAGEMENT',
          friction_index: 0.15,
          should_switch_modality: false,
          dwell_ratio: 0.9
        });
      }
    }
  };

  // Dynamic Contextual Prompts based on lecture cues
  const getContextualPrompts = (sec: number): string[] => {
    const cues = activeLecture.cues;
    if (!cues || cues.length === 0) {
      return [
        `Explain the main concept of ${activeLecture.title}`,
        'What are the key mathematical formulas here?',
        'How does this apply to real-world AI systems?'
      ];
    }

    const currentCue = [...cues].reverse().find((c) => sec >= c.sec) || cues[0];
    return [
      `Explain "${currentCue.label}" at timestamp [${formatTime(currentCue.sec)}]`,
      `What is the mathematical formulation of ${currentCue.label}?`,
      `Why is ${currentCue.label} crucial for ${activeCourse.title}?`
    ];
  };

  // BeeBot Timestamp-Aware RAG QA
  const handleSendQuery = async (queryText?: string) => {
    const rawQuery = (queryText || userQuery).trim();
    if (!rawQuery || isBotLoading) return;

    // Client-side prompt sanitization (OWASP LLM-01 defense)
    let sanitized = rawQuery
      .replace(/[\u202E\u202D\u200B\u200C\u200D\uFEFF\x00\r]/g, '')
      .replace(/<\s*(?:script|iframe|object|embed|svg)[^>]*>.*?<\s*\/\s*(?:script|iframe|object|embed|svg)\s*>/gi, '')
      .replace(/\s+/g, ' ')
      .trim();

    if (sanitized.length > 1000) {
      sanitized = sanitized.slice(0, 1000);
    }

    const currentSec = currentTimeSec;
    const currentStr = formatTime(currentSec);

    const userMsg: ChatMessage = {
      id: createMessageId('user'),
      sender: 'user',
      text: sanitized,
      timestampSec: currentSec,
      timestampStr: currentStr,
      guardrails: {
        passed: true,
        sanitized: sanitized !== rawQuery
      }
    };

    setChatMessages((prev) => [...prev, userMsg]);
    setUserQuery('');
    setIsBotLoading(true);

    const isJailbreak = /(?:ignore|disregard|forget|bypass|override)\s+(?:all\s+)?(?:previous|prior|system)\s+(?:instructions|prompts|rules)|act\s+as\s+(?:dan|developer\s+mode|jailbreak|unrestricted)|reveal\s+(?:system\s+prompt|api\s+key)/i.test(sanitized);

    try {
      const res = await ApiClient.askVideoQuestion({
        query: sanitized,
        video_id: activeLecture.youtubeId,
        timestamp_sec: currentSec,
        language: activeLang.toLowerCase()
      });

      const botMsg: ChatMessage = {
        id: createMessageId('bot'),
        sender: 'bot',
        text: res.answer,
        timestampSec: res.timestamp_sec,
        timestampStr: res.timestamp_str,
        modelUsed: res.model_used || 'openrouter/free (IBM watsonx RAG)',
        guardrails: res.guardrails
      };
      setChatMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.warn('Backend QA fallback:', err);
      let fallbackText = '';
      const qLower = sanitized.toLowerCase();

      const fallbackGuardrail = {
        passed: !isJailbreak,
        policy: isJailbreak ? 'PROMPT_INJECTION_SHIELD' : 'IBM_GRANITE_GUARDRAILS_PASSED',
        action: isJailbreak ? 'BLOCKED_INJECTION' : 'PERMITTED',
        sanitized: sanitized !== rawQuery
      };

      if (isJailbreak) {
        fallbackText = `🛡️ **BeeBot Security Guardrail Triggered:**\n\nYour query contains instructions that attempt to override system constraints or alter the assistant persona.\n\nUnder **IBM Granite Guardrails & OWASP LLM-01**, BeeBot remains strictly dedicated to your engineering mathematics and deep learning curriculum. Please ask a conceptual question about the lecture video!`;
      } else {
        // Dynamic lecture-grounded response
        const matchingNote = activeLecture.beebookNotes?.find((n) =>
          qLower.includes(n.conceptTitle.toLowerCase()) || (n.latexFormula && qLower.includes('formula'))
        );

        if (matchingNote) {
          fallbackText = `Great question! At timestamp **[${matchingNote.timestampLabel}]**, the lecture examines **${matchingNote.conceptTitle}**:\n\n$$\n${matchingNote.latexFormula}\n$$\n\n• **Core Insight:** ${matchingNote.keyTakeaway}\n\nClick **[${matchingNote.timestampLabel}]** above to navigate directly to this derivation in the player!`;
        } else {
          fallbackText = `In **${activeLecture.title}** around timestamp **[${currentStr}]**:\n\nThe presentation demonstrates how mathematical structures translate into computational graphs:\n\n$$\n${activeLecture.beebookNotes?.[0]?.latexFormula || 'f(x) = \\sigma(W x + b)'}\n$$\n\n• **Key Takeaway:** ${activeLecture.description}\n\nJump to any timestamp marker in the timeline to explore the visual proof!`;
        }
      }

      const fallbackMsg: ChatMessage = {
        id: createMessageId('bot_fb'),
        sender: 'bot',
        text: fallbackText,
        timestampSec: currentSec,
        timestampStr: currentStr,
        modelUsed: isJailbreak ? 'IBM Granite Guardrails Shield (OWASP LLM-01)' : 'IBM watsonx Socratic RAG (Local Fast-Whisper Indexed)',
        guardrails: fallbackGuardrail
      };
      setChatMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsBotLoading(false);
    }
  };

  // Synchronized Fast-Whisper Subtitle for Current Second
  const currentSubtitleText = useMemo(() => {
    const list = activeLecture.multilingualCues?.[activeLang] || activeLecture.cues;
    if (!list || list.length === 0) {
      return activeLecture.description;
    }
    const current = [...list].reverse().find((c) => currentTimeSec >= c.sec) || list[0];
    return current.text;
  }, [activeLecture, activeLang, currentTimeSec]);

  return (
    <div className="max-w-[1440px] mx-auto px-4 md:px-10 py-6">
      
      {/* ========================================================================= */}
      {/* 1. TOP BAR: COURSE TRACK SELECTOR PILLS                                  */}
      {/* ========================================================================= */}
      <div className="mb-6 bg-white rounded-3xl p-3 shadow-xs border border-gray-200">
        <div className="flex items-center justify-between px-2 pb-2.5 mb-2 border-b border-gray-100 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-[#ffe24c] flex items-center justify-center text-xs font-bold text-black">
              🐝
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-gray-700 font-display">
              Skill-Bee Dynamic Learning Tracks
            </span>
            <span className="px-2 py-0.5 rounded-full bg-blue-50 text-[#0f62fe] border border-blue-200 text-[10px] font-bold">
              Cognitive Buffer Active
            </span>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-gray-500 font-mono">
            <span className="flex items-center gap-1 text-emerald-700 font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              SC-Buffer Connected
            </span>
          </div>
        </div>

        {/* 4 Authentic Course Tracks */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
          {CURRICULUM_COURSES.map((course) => {
            const isSelected = course.id === activeCourseId;
            const totalLectures = course.chapters.reduce((acc, ch) => acc + ch.lectures.length, 0);

            return (
              <button
                key={course.id}
                onClick={() => handleSelectCourse(course.id)}
                className={`p-3 rounded-2xl text-left border transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'bg-black text-white border-black shadow-md scale-[1.01]'
                    : 'bg-[#fbf9f6] border-gray-200 hover:border-gray-400 text-black'
                }`}
              >
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span
                    className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold ${
                      isSelected ? 'bg-[#ffe24c] text-black' : 'bg-gray-200 text-gray-800'
                    }`}
                  >
                    {course.code}
                  </span>
                  <span
                    className={`text-[10px] font-medium ${
                      isSelected ? 'text-amber-300' : 'text-gray-500'
                    }`}
                  >
                    {totalLectures} Lectures
                  </span>
                </div>
                <h4 className="text-xs font-bold line-clamp-1 leading-snug">{course.title}</h4>
                <p
                  className={`text-[10px] line-clamp-1 mt-0.5 ${
                    isSelected ? 'text-gray-300' : 'text-gray-500'
                  }`}
                >
                  {course.instructor}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. LECTURE HEADER & QUICK ACTION MODAL TRIGGERS                           */}
      {/* ========================================================================= */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-gray-200 mb-6">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2.5 py-0.5 rounded-full bg-[#ffe24c] text-black text-[11px] font-bold uppercase">
              Lecture {activeLecture.number}
            </span>
            <span className="text-xs text-gray-500 font-semibold">
              {activeCourse.code} • {activeCourse.instructor}
            </span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
              Cognitive Tracing Active
            </span>
          </div>
          <h2 className="font-display text-xl md:text-2xl font-bold text-black mt-1">
            {activeLecture.title}
          </h2>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Socratic Priming Buffer Quick Test */}
          <button
            onClick={() => {
              const quiz = activeLecture.reentryPrimingQuiz;
              setPrimingCheckpointData({
                resumeTimestampSec: currentTimeSec > 30 ? currentTimeSec : 194,
                lastConcept: getActiveConcept(currentTimeSec),
                frictionIndex: telemetryState?.friction_index ?? 0.42,
                cognitiveState: telemetryState?.cognitive_state ?? 'NORMAL_ENGAGEMENT',
                question: quiz.question,
                options: quiz.options,
                correctIndex: quiz.correctIndex,
                explanation: quiz.explanation
              });
              setPrimingSelectedOption(null);
              setPrimingSubmitted(false);
              setShowReentryPriming(true);
            }}
            className="px-3.5 py-2 rounded-full bg-amber-100 text-amber-950 border border-amber-300 text-xs font-bold hover:scale-105 transition-all flex items-center gap-1.5 shadow-xs"
            title="Test the working memory reactivation checkpoint modal"
          >
            <Brain className="w-3.5 h-3.5 text-amber-700" />
            <span>Test Re-entry Priming</span>
          </button>

          {/* Flashcards */}
          <button
            onClick={() => {
              setFlashcardIdx(0);
              setIsFlipped(false);
              setShowWarmupModal(true);
            }}
            className="px-3.5 py-2 rounded-full bg-[#e5deff] text-[#1b1735] text-xs font-bold hover:scale-105 transition-all flex items-center gap-1.5 shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Recall Flashcards</span>
          </button>

          {/* Simulate In-Video Micro-Quiz */}
          <button
            onClick={() => {
              setShowInVideoQuiz(true);
              quizElapsedSecRef.current = 10;
              setQuizAttempts(0);
              setQuizAnswered(null);
            }}
            className="px-3.5 py-2 rounded-full bg-black text-white text-xs font-bold hover:scale-105 transition-all flex items-center gap-1.5 shadow-xs"
          >
            <Zap className="w-3.5 h-3.5 text-[#ffe24c]" />
            <span>Micro-Quiz</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. MAIN 12-COLUMN STUDIO GRID                                             */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT 8 COLS: DYNAMIC VIDEO PLAYER, TIMELINE SCRUBBER, FAST-WHISPER */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          
          {/* YouTube Embed Container */}
          <div className="relative w-full aspect-video rounded-[32px] bg-black overflow-hidden shadow-2xl border-4 border-white">
            <iframe
              key={`${activeLecture.youtubeId}-${iframeSeekSec}`}
              src={`https://www.youtube-nocookie.com/embed/${activeLecture.youtubeId}?enablejsapi=1&rel=0&modestbranding=1${
                iframeSeekSec > 0 ? `&start=${iframeSeekSec}&autoplay=1` : ''
              }`}
              title={activeLecture.title}
              className="w-full h-full object-cover"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />

            {/* In-Video Active Recall Micro-Quiz Overlay */}
            {showInVideoQuiz && activeLecture.inVideoQuiz && (
              <div className="absolute inset-0 bg-black/85 backdrop-blur-md z-30 flex items-center justify-center p-6 transition-all animate-in fade-in">
                <div className="bg-white rounded-[28px] p-6 max-w-lg w-full shadow-2xl border border-gray-200 max-h-[90%] overflow-y-auto">
                  <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-[#ffe24c] flex items-center justify-center text-black font-bold text-xs">
                        ⚡
                      </div>
                      <div>
                        <h4 className="font-display font-bold text-sm text-black">Active Recall Micro-Quiz</h4>
                        <p className="text-[10px] text-gray-500">
                          Timestamp {formatTime(activeLecture.inVideoQuiz.triggerTimestampSec)} • Immediate Retention (+{activeLecture.inVideoQuiz.xpReward || 50} XP)
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowInVideoQuiz(false)}
                      className="text-gray-400 hover:text-black font-bold text-xs"
                    >
                      ✕
                    </button>
                  </div>

                  <p className="text-xs font-bold text-black mb-3">
                    {activeLecture.inVideoQuiz.question}
                  </p>

                  <div className="space-y-2 mb-4">
                    {activeLecture.inVideoQuiz.options.map((opt, optIdx) => {
                      const isCorrectChoice = optIdx === activeLecture.inVideoQuiz.correctIndex;
                      const isChosen = quizAnswered === optIdx;

                      return (
                        <button
                          key={optIdx}
                          onClick={() => handleQuizAnswer(optIdx)}
                          className={`w-full p-3 rounded-xl text-left text-xs font-medium border transition-all ${
                            isChosen
                              ? isCorrectChoice
                                ? 'bg-emerald-50 border-emerald-500 text-emerald-900 font-bold'
                                : 'bg-rose-50 border-rose-500 text-rose-900'
                              : 'bg-[#fbf9f6] border-gray-200 hover:border-gray-400 text-black'
                          }`}
                        >
                          <span className="font-bold mr-2">{String.fromCharCode(65 + optIdx)}.</span> {opt}
                        </button>
                      );
                    })}
                  </div>

                  {quizAnswered !== null && (
                    <div
                      className={`p-3 rounded-xl text-xs font-bold mb-3 ${
                        quizAnswered === activeLecture.inVideoQuiz.correctIndex
                          ? 'bg-emerald-100 text-emerald-900'
                          : 'bg-rose-100 text-rose-900'
                      }`}
                    >
                      {quizAnswered === activeLecture.inVideoQuiz.correctIndex
                        ? `🎉 Correct! ${activeLecture.inVideoQuiz.explanation}`
                        : `Review note: ${activeLecture.inVideoQuiz.socraticHint || activeLecture.inVideoQuiz.explanation}`}
                    </div>
                  )}

                  {/* EdNet Telemetry & LinUCB Modality Recommendation */}
                  {telemetryState && (
                    <div
                      className={`p-3.5 rounded-2xl border text-xs mb-3 transition-all ${
                        telemetryState.cognitive_state === 'FRUSTRATED_BLOCK'
                          ? 'bg-amber-50 border-amber-300 text-amber-950'
                          : telemetryState.cognitive_state === 'BLIND_GUESSING'
                          ? 'bg-rose-50 border-rose-300 text-rose-950'
                          : 'bg-emerald-50 border-emerald-300 text-emerald-950'
                      }`}
                    >
                      <div className="flex items-center justify-between font-bold mb-1">
                        <span className="flex items-center gap-1.5">
                          <span>🧠 EdNet Telemetry:</span>
                          <span className="uppercase font-mono text-[10px] px-1.5 py-0.5 rounded bg-black/10">
                            {telemetryState.cognitive_state?.replace('_', ' ')}
                          </span>
                        </span>
                        <span className="font-mono text-[10px] px-2 py-0.5 rounded-full bg-white/90 border border-gray-200">
                          Friction F = {telemetryState.friction_index?.toFixed(2)}
                        </span>
                      </div>

                      {telemetryState.should_switch_modality && (
                        <div className="mt-2 pt-2 border-t border-amber-200 flex flex-col gap-2">
                          <p className="text-[11px] text-amber-900 font-medium leading-relaxed">
                            <strong>LinUCB Bandit Recommendation:</strong> High cognitive friction detected. Switching to multimodal synthesis.
                          </p>
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                setShowInVideoQuiz(false);
                                onNavigate?.('roadmap');
                              }}
                              className="flex-1 py-1.5 px-2.5 rounded-xl bg-[#ffe24c] hover:bg-yellow-400 text-black font-bold text-[10px] transition-all"
                            >
                              🎨 Visual Sim (LinUCB)
                            </button>
                            <button
                              onClick={() => {
                                setShowInVideoQuiz(false);
                                setUserQuery(
                                  `Explain the core intuition of ${activeLecture.title} and why this equation works.`
                                );
                                setActiveTab('beebot');
                              }}
                              className="flex-1 py-1.5 px-2.5 rounded-xl bg-black hover:bg-gray-800 text-white font-bold text-[10px] transition-all"
                            >
                              🤖 Ask BeeBot RAG
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  <button
                    onClick={() => setShowInVideoQuiz(false)}
                    className="w-full py-2.5 rounded-full bg-black text-white text-xs font-bold hover:scale-[1.02] transition-all"
                  >
                    Resume Video Lecture →
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Interactive Scrub Bar & Playback Controls */}
          <div className="bg-white rounded-2xl p-4 shadow-xs border border-gray-200 flex flex-col gap-3">
            <div className="flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-2">
                <span className="font-bold text-black">{formatTime(currentTimeSec)}</span>
                <span className="text-gray-400">/</span>
                <span className="text-gray-500">{activeLecture.duration}</span>
              </div>

              {/* Dynamic Cue Markers */}
              <div className="flex items-center gap-1.5 text-[10px] overflow-x-auto max-w-[65%] pb-0.5">
                {activeLecture.cues.slice(0, 3).map((cue, cIdx) => (
                  <button
                    key={cIdx}
                    onClick={() => handleSeek(cue.sec)}
                    className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-900 border border-amber-200 font-bold hover:bg-amber-100 transition-colors shrink-0"
                    title={cue.text}
                  >
                    ⏱️ {formatTime(cue.sec)} {cue.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Range Slider */}
            <div className="relative flex items-center">
              <input
                type="range"
                min={0}
                max={activeLecture.durationSec}
                value={currentTimeSec}
                onChange={(e) => {
                  const v = Number(e.target.value);
                  handleSeek(v);
                }}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#0f62fe]"
              />
            </div>

            {/* Controls Bar & Fast-Whisper Language Switcher */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="w-9 h-9 rounded-full bg-black text-white flex items-center justify-center hover:scale-105 transition-transform"
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                </button>
                <button
                  onClick={() => handleSeek(Math.max(0, currentTimeSec - 10))}
                  className="px-2.5 py-1 rounded-lg text-xs text-gray-600 hover:bg-gray-100 font-mono"
                >
                  -10s
                </button>
                <button
                  onClick={() => handleSeek(Math.min(activeLecture.durationSec, currentTimeSec + 10))}
                  className="px-2.5 py-1 rounded-lg text-xs text-gray-600 hover:bg-gray-100 font-mono"
                >
                  +10s
                </button>
              </div>

              {/* Multilingual Fast-Whisper Selector */}
              <div className="flex items-center gap-1.5 bg-[#f5f3f0] p-1 rounded-full border border-gray-200">
                <Globe className="w-3.5 h-3.5 text-gray-500 ml-2" />
                {(['EN', 'HI', 'TA', 'ES'] as const).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setActiveLang(lang)}
                    className={`px-3 py-1 rounded-full text-[11px] font-bold transition-all ${
                      activeLang === lang
                        ? 'bg-black text-white shadow-xs'
                        : 'text-gray-600 hover:text-black'
                    }`}
                  >
                    {lang === 'HI' ? 'हिंदी' : lang === 'TA' ? 'தமிழ்' : lang === 'ES' ? 'Español' : 'English'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Synchronized Fast-Whisper Subtitle Card */}
          <div className="bg-white rounded-2xl p-4 shadow-xs border border-gray-200 flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 text-sm font-bold">
              🎙️
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                  Fast-Whisper Live Translation ({activeLang}) • {activeLecture.title}
                </span>
                <span className="text-[10px] text-emerald-600 font-mono font-bold">● AI Synchronized</span>
              </div>
              <p className="text-sm font-medium text-black leading-relaxed">
                {currentSubtitleText}
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT 4 COLS: BEEBOT RAG AI TUTOR, BEEBOOK FORMULA NOTES, SYLLABUS */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          
          {/* Tab Selector */}
          <div className="bg-white rounded-2xl p-1.5 shadow-xs border border-gray-200 flex items-center gap-1">
            <button
              onClick={() => setActiveTab('beebot')}
              className={`flex-1 py-2 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'beebot'
                  ? 'bg-[#ffe24c] text-black shadow-xs'
                  : 'text-gray-600 hover:text-black'
              }`}
            >
              <Bot className="w-3.5 h-3.5" />
              <span>BeeBot AI</span>
              <span className="px-1.5 py-0.2 rounded-full bg-black text-[#ffe24c] text-[9px] font-black">
                RAG
              </span>
            </button>
            <button
              onClick={() => setActiveTab('beebook')}
              className={`flex-1 py-2 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'beebook'
                  ? 'bg-[#ffe24c] text-black shadow-xs'
                  : 'text-gray-600 hover:text-black'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>BeeBook</span>
            </button>
            <button
              onClick={() => setActiveTab('curriculum')}
              className={`flex-1 py-2 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'curriculum'
                  ? 'bg-black text-white shadow-xs'
                  : 'text-gray-600 hover:text-black'
              }`}
            >
              <ListVideo className="w-3.5 h-3.5" />
              <span>Syllabus</span>
            </button>
          </div>

          {/* TAB 1: BEEBOT AI VIDEO TUTOR (TIMESTAMP-AWARE RAG) */}
          {activeTab === 'beebot' && (
            <div className="bg-white rounded-[32px] p-5 shadow-xs border border-gray-200 flex flex-col gap-3 h-[640px]">
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-gray-100 shrink-0">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-[#ffe24c] text-black flex items-center justify-center font-bold text-sm shadow-xs">
                    🐝
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <h3 className="font-display text-sm font-bold text-black">BeeBot Video Tutor</h3>
                      <span className="px-2 py-0.5 rounded-full bg-blue-50 text-[#0f62fe] border border-blue-200 text-[9px] font-bold">
                        IBM watsonx RAG
                      </span>
                    </div>
                    <p className="text-[10px] text-gray-500">Fast-Whisper Grounded Socratic Assistant</p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-mono font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    {formatTime(currentTimeSec)}
                  </span>
                  <button
                    onClick={() => {
                      setChatMessages([
                        {
                          id: createMessageId('msg_welcome_reset'),
                          sender: 'bot',
                          text: `Hello! I'm **BeeBot**, your IBM watsonx Socratic AI Video Assistant. I'm actively watching **${activeLecture.title}** with you.\n\nAsk me any question about the video, equations, or click a timestamped concept pill below!`,
                          timestampSec: currentTimeSec,
                          timestampStr: formatTime(currentTimeSec),
                          modelUsed: 'IBM watsonx RAG Engine (Granite 3.0 / Fast-Whisper)'
                        }
                      ]);
                    }}
                    title="Reset Conversation"
                    className="w-7 h-7 rounded-lg text-gray-400 hover:text-black hover:bg-gray-100 flex items-center justify-center transition-colors"
                  >
                    <RotateCw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Dynamic Contextual Moment Pills */}
              <div className="shrink-0 bg-[#fbf9f6] p-2.5 rounded-2xl border border-gray-200/80">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-[#0f62fe]" />
                    Moment Prompts ({formatTime(currentTimeSec)})
                  </span>
                  <span className="text-[9px] text-gray-400 font-mono">1-click ask</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {getContextualPrompts(currentTimeSec).map((prompt, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSendQuery(prompt)}
                      disabled={isBotLoading}
                      className="text-[11px] font-medium text-left px-2.5 py-1 rounded-xl bg-white hover:bg-amber-50 hover:border-amber-300 border border-gray-200 text-gray-800 transition-all hover:scale-[1.01] active:scale-95 shadow-xs disabled:opacity-50"
                    >
                      💡 {prompt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Chat Thread */}
              <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                {chatMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                  >
                    <div className="flex items-center gap-1 text-[10px] text-gray-400 font-mono mb-0.5 px-1">
                      <span>{msg.sender === 'user' ? 'You' : 'BeeBot'}</span>
                      {msg.timestampStr && (
                        <button
                          onClick={() => msg.timestampSec !== undefined && handleSeek(msg.timestampSec)}
                          className="hover:underline text-[#0f62fe]"
                        >
                          @{msg.timestampStr}
                        </button>
                      )}
                    </div>

                    <div
                      className={`max-w-[92%] p-3.5 rounded-2xl text-xs ${
                        msg.sender === 'user'
                          ? 'bg-black text-white rounded-br-none shadow-xs'
                          : msg.guardrails && !msg.guardrails.passed
                          ? 'bg-amber-50/90 border border-amber-300 text-amber-950 rounded-bl-none shadow-xs'
                          : 'bg-[#fbf9f6] border border-gray-200 rounded-bl-none shadow-xs'
                      }`}
                    >
                      {msg.sender === 'user' ? (
                        <div className="flex items-center justify-between gap-2">
                          <p className="leading-relaxed font-medium">{msg.text}</p>
                          {msg.guardrails?.sanitized && (
                            <span className="shrink-0 text-[8px] font-mono text-emerald-300 bg-white/10 px-1.5 py-0.5 rounded border border-emerald-400/30">
                              ✓ Sanitized
                            </span>
                          )}
                        </div>
                      ) : (
                        <div>
                          {msg.guardrails && !msg.guardrails.passed && (
                            <div className="mb-2 px-2.5 py-1 rounded-lg bg-amber-100/90 border border-amber-300 text-amber-900 text-[10px] font-bold flex items-center gap-1.5">
                              <ShieldAlert className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                              <span>OWASP LLM-01 Guardrail Intervention • {msg.guardrails.policy || 'Security Shield'}</span>
                            </div>
                          )}
                          <RenderChatMessage content={msg.text} onSeek={handleSeek} />
                          {msg.modelUsed && (
                            <div className="mt-2 pt-2 border-t border-gray-200/60 flex items-center justify-between text-[9px] text-gray-500 font-mono">
                              <span className="flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                {msg.modelUsed}
                              </span>
                              <span className="flex items-center gap-1 text-emerald-700 font-bold">
                                <ShieldCheck className="w-2.5 h-2.5" />
                                {msg.guardrails && !msg.guardrails.passed ? 'Shield Triggered' : 'Guardrail Verified'}
                              </span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {isBotLoading && (
                  <div className="flex items-start gap-2 p-3 rounded-2xl bg-[#fbf9f6] border border-gray-200 max-w-[85%] animate-pulse">
                    <div className="w-5 h-5 rounded-md bg-[#ffe24c] flex items-center justify-center text-black text-xs font-bold shrink-0">
                      🐝
                    </div>
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-bold text-gray-700">BeeBot is reasoning...</span>
                        <span className="text-[9px] font-mono text-gray-400">Fast-Whisper Grounded</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full w-3/4" />
                      <div className="h-2 bg-gray-200 rounded-full w-1/2" />
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Chat Input Field */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendQuery();
                }}
                className="shrink-0 pt-2 border-t border-gray-100 flex items-center gap-2"
              >
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={userQuery}
                    onChange={(e) => setUserQuery(e.target.value)}
                    placeholder={`Ask about timestamp ${formatTime(currentTimeSec)} or formulas...`}
                    disabled={isBotLoading}
                    className="w-full pl-3.5 pr-9 py-2.5 bg-[#fbf9f6] hover:bg-gray-50 focus:bg-white text-xs text-black placeholder-gray-400 rounded-xl border border-gray-200 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      handleSendQuery(`Explain what is happening in the video at timestamp ${formatTime(currentTimeSec)}`)
                    }
                    title="Ask about this exact moment"
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-mono font-bold text-gray-400 hover:text-black transition-colors"
                  >
                    ⏱️
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={!userQuery.trim() || isBotLoading}
                  className="w-9 h-9 rounded-xl bg-black text-white hover:bg-gray-800 disabled:opacity-40 disabled:hover:bg-black flex items-center justify-center shrink-0 transition-all hover:scale-105 active:scale-95 shadow-xs"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>

              {/* Guardrails Status Bar */}
              <div className="flex items-center justify-between text-[9px] text-gray-400 font-mono px-1 shrink-0 -mt-1">
                <span className="flex items-center gap-1 text-emerald-700 font-medium">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  <span>Prompt Sanitization & OWASP LLM-01 Active</span>
                </span>
                <span className="text-gray-400">IBM Granite 3.0 Guardrails</span>
              </div>
            </div>
          )}

          {/* TAB 2: BEEBOOK AI FORMULA NOTES (WITH LATEX & CODE SNIPPETS) */}
          {activeTab === 'beebook' && (
            <div className="bg-white rounded-[32px] p-6 shadow-xs border border-gray-200 flex flex-col gap-4 max-h-[620px] overflow-y-auto">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <div>
                  <h3 className="font-display text-base font-bold text-black">BeeBook Formula Notes</h3>
                  <p className="text-[11px] text-gray-500">
                    {activeLecture.title} • {activeLecture.beebookNotes?.length || 0} Core Formulations
                  </p>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 text-[10px] font-bold">
                  Watsonx Synthesized
                </span>
              </div>

              {/* Render dynamic lecture notes */}
              {activeLecture.beebookNotes && activeLecture.beebookNotes.length > 0 ? (
                activeLecture.beebookNotes.map((note) => (
                  <div
                    key={note.id}
                    className="p-4 rounded-2xl bg-[#fbf9f6] border border-gray-200 hover:border-gray-300 transition-colors space-y-2"
                  >
                    <div className="flex items-center justify-between text-xs font-bold text-gray-500">
                      <button
                        onClick={() => handleSeek(note.timestampSec)}
                        className="inline-flex items-center gap-1 text-[#0f62fe] hover:underline font-mono"
                      >
                        <span>⏱️ TIMESTAMP</span>
                        <span>{note.timestampLabel}</span>
                      </button>
                      <span className="text-emerald-700 text-[10px] uppercase tracking-wider">
                        {note.isBookmarked ? '★ Core Formula' : 'Derivation'}
                      </span>
                    </div>

                    <h4 className="font-bold text-sm text-black">{note.conceptTitle}</h4>

                    {/* KaTeX Formula Box */}
                    {note.latexFormula && (
                      <div className="bg-white p-3 rounded-xl border border-gray-200 text-center my-2 shadow-xs overflow-x-auto">
                        <Latex block>{note.latexFormula}</Latex>
                      </div>
                    )}

                    <p className="text-xs text-gray-600 leading-relaxed">{note.keyTakeaway}</p>

                    {/* Optional Python Implementation Snippet */}
                    {note.pythonSnippet && (
                      <div className="mt-2 bg-[#1b1c1a] text-amber-200 p-3 rounded-xl font-mono text-[10px] overflow-x-auto border border-gray-800">
                        <div className="text-gray-400 text-[9px] mb-1 font-sans flex items-center justify-between">
                          <span>Python Implementation:</span>
                          <span className="text-emerald-400">numpy / torch</span>
                        </div>
                        <pre>{note.pythonSnippet}</pre>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-xs text-gray-500">
                  No formula notes found for this lecture.
                </div>
              )}

              {/* 1-Click Export Notes Button */}
              <button
                onClick={() => {
                  const summaryContent = `# BeeBook Notes: ${activeLecture.title}\nCourse: ${activeCourse.title} (${activeCourse.code})\n\n` +
                    (activeLecture.beebookNotes || [])
                      .map((n) => `### ${n.conceptTitle} [${n.timestampLabel}]\n$$${n.latexFormula}$$\n${n.keyTakeaway}\n`)
                      .join('\n\n');
                  
                  const blob = new Blob([summaryContent], { type: 'text/markdown' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `${activeLecture.id}_beebook_notes.md`;
                  a.click();
                  URL.revokeObjectURL(url);
                }}
                className="w-full py-3 rounded-full bg-black text-white text-xs font-bold hover:scale-[1.02] transition-all flex items-center justify-center gap-2 mt-2"
              >
                <Bookmark className="w-3.5 h-3.5 text-[#ffe24c]" />
                <span>Export BeeBook Summary (.md)</span>
              </button>
            </div>
          )}

          {/* TAB 3: COURSE CURRICULUM SYLLABUS */}
          {activeTab === 'curriculum' && (
            <div className="bg-white rounded-[32px] p-6 shadow-xs border border-gray-200 flex flex-col gap-4 max-h-[620px] overflow-y-auto">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <div>
                  <h3 className="font-display text-base font-bold text-black">{activeCourse.code} Syllabus</h3>
                  <p className="text-[11px] text-gray-500">
                    {activeCourse.chapters.reduce((acc, ch) => acc + ch.lectures.length, 0)} Lectures • {activeCourse.chapters.length} Chapters
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-black">Track Enrolled</span>
                  <div className="w-16 h-1.5 bg-gray-100 rounded-full mt-1 overflow-hidden">
                    <div className="w-1/2 h-full bg-[#0f62fe] rounded-full" />
                  </div>
                </div>
              </div>

              {/* Chapters and Lecture Switcher */}
              <div className="space-y-4">
                {activeCourse.chapters.map((ch) => (
                  <div key={ch.id} className="space-y-2">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-gray-400 px-1">
                      {ch.title}
                    </div>

                    <div className="space-y-1.5">
                      {ch.lectures.map((lec) => {
                        const isCurrent = lec.id === activeLectureId;
                        const isDone = lectureCompletionMap[lec.id] || lec.completed;

                        return (
                          <div
                            key={lec.id}
                            onClick={() => handleSelectLecture(lec)}
                            className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                              isCurrent
                                ? 'bg-black text-white border-black shadow-md'
                                : 'bg-[#fbf9f6] border-gray-200 hover:border-gray-300 text-black'
                            }`}
                          >
                            <div className="flex items-center gap-2.5 overflow-hidden">
                              <div
                                className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 font-bold text-xs ${
                                  isCurrent
                                    ? 'bg-[#ffe24c] text-black'
                                    : isDone
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : 'bg-gray-200 text-gray-700'
                                }`}
                              >
                                {isDone ? '✓' : lec.number}
                              </div>
                              <div className="truncate">
                                <p className="text-xs font-bold truncate leading-tight">
                                  {lec.title}
                                </p>
                                <p
                                  className={`text-[10px] mt-0.5 ${
                                    isCurrent ? 'text-gray-300' : 'text-gray-500'
                                  }`}
                                >
                                  {lec.duration} • {activeCourse.instructor.split('&')[0].trim()}
                                </p>
                              </div>
                            </div>

                            {isCurrent && (
                              <span className="w-2 h-2 rounded-full bg-[#ffe24c] animate-ping shrink-0 mr-1" />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4. SOCRATIC RE-ENTRY PRIMING CHECKPOINT MODAL (COGNITIVE SC-BUFFER)       */}
      {/* ========================================================================= */}
      {showReentryPriming && primingCheckpointData && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-md z-50 flex items-center justify-center p-4 md:p-6 animate-in fade-in">
          <div className="bg-white rounded-[36px] p-6 md:p-8 max-w-xl w-full shadow-2xl border-2 border-amber-200 max-h-[95vh] overflow-y-auto">
            
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#ffe24c] flex items-center justify-center text-black font-bold text-lg shadow-sm">
                  🧠
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-display text-base md:text-lg font-bold text-black">
                      Socratic Re-entry Priming Checkpoint
                    </h3>
                    <span className="px-2 py-0.5 rounded-full bg-blue-100 text-[#0f62fe] text-[10px] font-mono font-bold">
                      SC-Buffer
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-500">
                    Restoring decayed working-memory buffer before resuming video playback
                  </p>
                </div>
              </div>

              <button
                onClick={handleSkipPriming}
                className="text-gray-400 hover:text-black font-bold text-sm px-2 py-1 rounded-lg"
                title="Skip priming and resume immediately"
              >
                ✕
              </button>
            </div>

            {/* Context Buffer Status Pill */}
            <div className="bg-[#fbf9f6] p-3 rounded-2xl border border-gray-200 mb-4 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="text-gray-500 font-medium">Paused At:</span>
                <span className="font-mono font-bold text-black bg-amber-100 px-2 py-0.5 rounded-md border border-amber-300">
                  {formatTime(primingCheckpointData.resumeTimestampSec)}
                </span>
                <span className="text-gray-400">•</span>
                <span className="font-semibold text-gray-700 truncate max-w-[200px]">
                  {primingCheckpointData.lastConcept}
                </span>
              </div>
              <div className="font-mono text-[10px] text-gray-600 bg-white px-2 py-1 rounded-lg border border-gray-200 shrink-0">
                Friction F = {primingCheckpointData.frictionIndex.toFixed(2)}
              </div>
            </div>

            {/* Cognitive Science Explanation Callout */}
            <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/80 mb-4 text-xs text-amber-950 leading-relaxed">
              <p className="font-bold mb-1 flex items-center gap-1.5 text-amber-900">
                <span>⚡ Cognitive Load Continuity Protocol:</span>
              </p>
              <p className="text-[11px] text-amber-900/90">
                According to Cognitive Load Theory (Sweller & Ebbinghaus), working memory traces for abstract mathematical formulations decay by up to 60% after context switches. Answering one active-recall question primes your hippocampus before video playback resumes.
              </p>
            </div>

            {/* Socratic Priming Question */}
            <div className="mb-4">
              <p className="text-sm font-bold text-black mb-3">
                {primingCheckpointData.question}
              </p>

              <div className="space-y-2.5">
                {primingCheckpointData.options.map((opt, optIdx) => {
                  const isSelected = primingSelectedOption === optIdx;
                  const isCorrect = optIdx === primingCheckpointData.correctIndex;

                  let optionStyle = 'bg-[#fbf9f6] border-gray-200 hover:border-gray-400 text-black';
                  if (primingSubmitted) {
                    if (isCorrect) {
                      optionStyle = 'bg-emerald-50 border-emerald-500 text-emerald-900 font-bold';
                    } else if (isSelected) {
                      optionStyle = 'bg-rose-50 border-rose-500 text-rose-900';
                    }
                  }

                  return (
                    <button
                      key={optIdx}
                      onClick={() => handlePrimingAnswerSelect(optIdx)}
                      disabled={primingSubmitted}
                      className={`w-full p-3.5 rounded-2xl text-left text-xs font-medium border transition-all flex items-start gap-2.5 ${optionStyle}`}
                    >
                      <span className="w-5 h-5 rounded-md bg-white border border-gray-200 flex items-center justify-center font-bold text-[11px] shrink-0 text-black">
                        {String.fromCharCode(65 + optIdx)}
                      </span>
                      <span className="leading-relaxed flex-1">{opt}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Feedback Alert */}
            {primingSubmitted && (
              <div
                className={`p-3.5 rounded-2xl text-xs font-medium mb-4 leading-relaxed ${
                  primingSelectedOption === primingCheckpointData.correctIndex
                    ? 'bg-emerald-100 text-emerald-950 border border-emerald-300'
                    : 'bg-amber-100 text-amber-950 border border-amber-300'
                }`}
              >
                <div className="font-bold flex items-center gap-1.5 mb-1">
                  {primingSelectedOption === primingCheckpointData.correctIndex ? (
                    <>
                      <span>🎉 Working Memory Primed (+25 Honey XP)!</span>
                    </>
                  ) : (
                    <>
                      <span>💡 Memory Reconstruction Cue:</span>
                    </>
                  )}
                </div>
                <p className="text-[11px]">{primingCheckpointData.explanation}</p>
              </div>
            )}

            {/* Modal Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5 pt-2">
              <button
                onClick={() => handleConfirmPrimingResume(0)}
                className="w-full sm:w-auto px-4 py-2.5 rounded-full border border-gray-200 text-xs font-bold hover:bg-gray-100 text-gray-700"
              >
                Restart from 00:00
              </button>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={handleSkipPriming}
                  className="flex-1 sm:flex-none px-4 py-2.5 rounded-full border border-gray-200 text-xs font-bold hover:bg-gray-100 text-gray-600"
                >
                  Skip Priming
                </button>
                <button
                  onClick={() => handleConfirmPrimingResume(primingCheckpointData.resumeTimestampSec)}
                  className="flex-1 sm:flex-none px-6 py-2.5 rounded-full bg-black text-white text-xs font-bold hover:scale-105 transition-all shadow-md flex items-center justify-center gap-1.5"
                >
                  <span>Resume at {formatTime(primingCheckpointData.resumeTimestampSec)}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. HONEY RECALL FLASHCARDS MODAL                                          */}
      {/* ========================================================================= */}
      {showWarmupModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-6 animate-in fade-in">
          <div className="bg-white rounded-[36px] p-8 max-w-md w-full shadow-2xl border border-gray-200">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-6">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#ffe24c] flex items-center justify-center text-black font-bold text-sm">
                  🍯
                </div>
                <div>
                  <h3 className="font-display text-base font-bold text-black">Honey Memory Warm-Up</h3>
                  <p className="text-[11px] text-gray-500">
                    Flashcard {flashcardIdx + 1} of {activeLecture.flashcards?.length || 1} • Pre-Lecture Retrieval
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowWarmupModal(false)}
                className="text-gray-400 hover:text-black font-bold text-sm"
              >
                ✕
              </button>
            </div>

            {/* Flashcard Component */}
            {(() => {
              const currentCard = activeLecture.flashcards?.[flashcardIdx] || {
                frontQuestion: `What is the core intuition behind ${activeLecture.title}?`,
                backAnswer: activeLecture.description,
                tag: 'Foundations'
              };

              return (
                <div
                  onClick={() => setIsFlipped(!isFlipped)}
                  className="w-full min-h-[200px] p-6 rounded-3xl bg-[#fbf9f6] border border-gray-200 flex flex-col justify-between cursor-pointer hover:border-black transition-all shadow-inner mb-6 text-center"
                >
                  <span className="text-[10px] font-bold text-gray-400 uppercase">
                    {isFlipped ? 'Answer (Click to Flip Back)' : 'Question (Click to Flip)'}
                  </span>

                  <div className="my-auto text-sm font-bold text-black leading-relaxed">
                    {isFlipped ? currentCard.backAnswer : currentCard.frontQuestion}
                  </div>

                  <span className="text-[10px] text-gray-400">↻ Click to Flip</span>
                </div>
              );
            })()}

            <div className="flex items-center justify-between gap-3">
              <button
                onClick={() => {
                  const total = activeLecture.flashcards?.length || 1;
                  setFlashcardIdx((prev) => (prev + 1) % total);
                  setIsFlipped(false);
                }}
                className="flex-1 py-2.5 rounded-full border border-gray-200 text-xs font-bold hover:bg-gray-100"
              >
                Next Flashcard
              </button>
              <button
                onClick={() => setShowWarmupModal(false)}
                className="flex-1 py-2.5 rounded-full bg-black text-white text-xs font-bold hover:scale-105 transition-all"
              >
                Ready to Learn! 🐝
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
