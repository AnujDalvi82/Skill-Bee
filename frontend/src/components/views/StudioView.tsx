'use client';

import React, { useState } from 'react';
import { MOCK_BEEBOOK_NOTES, MOCK_IN_VIDEO_QUIZ, MOCK_PRE_LECTURE_FLASHCARDS } from '@/data/beebookData';
import { BookOpen, Video, Play, Pause, Sparkles, CheckCircle2, RotateCw, Globe, ChevronRight, Bookmark } from 'lucide-react';

export const VideoLectureStudioView: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSec, setCurrentSec] = useState(180);
  const [activeTab, setActiveTab] = useState<'beebook' | 'transcript'>('beebook');
  const [activeLang, setActiveLang] = useState<'EN' | 'HI' | 'TA' | 'HINGLISH'>('EN');
  const [showWarmupModal, setShowWarmupModal] = useState(false);
  const [showInVideoQuiz, setShowInVideoQuiz] = useState(false);
  const [quizAnswered, setQuizAnswered] = useState<number | null>(null);
  const [flashcardIdx, setFlashcardIdx] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const transcripts = {
    EN: [
      { sec: 45, text: "Welcome back! Today we analyze linear transformations geometrically using basis vectors i-hat and j-hat." },
      { sec: 180, text: "Notice what happens when the determinant is zero. The entire 2D area collapses onto a single 1D line!" },
      { sec: 360, text: "This brings us to Eigenvectors: special vectors that remain on their original span during matrix multiplication." }
    ],
    HI: [
      { sec: 45, text: "???? ?????? ??! ?? ?? ????? ???????? ?? ????? ???? ?????? ?????????????? ?? ????????" },
      { sec: 180, text: "????? ??? ?? ?????????? ????? ???? ??, ?? ???? 2D ??????? ?? 1D ???? ??? ???? ???? ??!" },
      { sec: 360, text: "?? ???? ??????????? ?? ?? ?? ???? ??: ????? ?????? ?? ?????????????? ?? ????? ???? ???? ???? ??????" }
    ],
    TA: [
      { sec: 45, text: "???????? ????! ????? ???? ??????? ????????????? ???????? ????????? ??????????????????." },
      { sec: 180, text: "?????????????? ?????????? ????????????? ???? ????????? ???????? ???????????. ???????? ?????????????!" },
      { sec: 360, text: "??? ????? ??????????????????? ????????? ?????????." }
    ],
    HINGLISH: [
      { sec: 45, text: "Welcome back! Aaj hum basis vectors use karke linear transformations ko visually samjhenge." },
      { sec: 180, text: "Dekho jab determinant zero hota hai, toh pura 2D space ek 1D line pe collapse ho jata hai!" },
      { sec: 360, text: "Yahan se aate hain Eigenvectors: jo transform hone ke baad bhi apni original line pe rehte hain." }
    ]
  };

  return (
    <div className="max-w-[1440px] mx-auto px-6 md:px-12 py-8">
      {/* Top Header & Warm-Up Trigger */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-gray-200 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-[#ffe24c] text-black text-[11px] font-bold uppercase">
              Lecture 03
            </span>
            <span className="text-xs text-gray-500 font-semibold">CS302 ? Dr. Sunita Sharma</span>
          </div>
          <h2 className="font-display text-2xl md:text-3xl font-bold text-black mt-1">
            Matrix Transformations & Determinant Geometry
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowWarmupModal(true)}
            className="px-4 py-2 rounded-full bg-[#e5deff] text-[#1b1735] text-xs font-bold hover:scale-105 transition-all flex items-center gap-1.5 shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Honey Recall Flashcards (3)</span>
          </button>
          <button
            onClick={() => setShowInVideoQuiz(true)}
            className="px-4 py-2 rounded-full bg-black text-white text-xs font-bold hover:scale-105 transition-all flex items-center gap-1.5 shadow-sm"
          >
            <span>Simulate Active Recall Quiz</span>
          </button>
        </div>
      </div>

      {/* Main 12-Col Studio Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left 8 Cols: Video Canvas & Controls */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          <div className="relative w-full aspect-video rounded-[32px] bg-black overflow-hidden shadow-2xl flex items-center justify-center border-4 border-white">
            
            {/* Simulated Lecture Screen Visual */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 p-8 flex flex-col justify-between text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></div>
                  <span className="font-mono text-xs text-gray-300">Fast-Whisper Live Stream</span>
                </div>
                <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-[11px] font-mono">
                  IBM watsonx Engine
                </span>
              </div>

              {/* Lecture Blackboard Diagram */}
              <div className="my-auto text-center">
                <p className="font-mono text-xs text-[#ffe24c] uppercase tracking-wider mb-2">Linear Transformation in R^2</p>
                <div className="font-display text-3xl md:text-4xl font-bold">
                  det(A) = ad - bc = 0
                </div>
                <p className="text-xs text-gray-400 mt-2">Space collapses onto 1D line &rarr; Matrix is Singular</p>
              </div>

              {/* Multilingual Subtitle Display */}
              <div className="bg-black/80 backdrop-blur-md px-6 py-3 rounded-2xl text-center border border-white/10 mx-auto max-w-xl">
                <p className="text-xs text-gray-400 font-mono text-[10px] uppercase mb-0.5">Subtitles [{activeLang}]:</p>
                <p className="text-sm font-medium text-white">
                  {transcripts[activeLang][1].text}
                </p>
              </div>
            </div>

            {/* In-Video Pop-up Checkpoint Overlay */}
            {showInVideoQuiz && (
              <div className="absolute inset-0 bg-black/80 backdrop-blur-md z-30 flex items-center justify-center p-6 animate-fadeIn">
                <div className="bg-white rounded-[32px] p-6 max-w-md w-full shadow-2xl border border-gray-200">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xl">??</span>
                    <div>
                      <h4 className="font-display text-sm font-bold text-black">In-Video Active Recall Checkpoint</h4>
                      <p className="text-[10px] text-gray-500">Testing Effect ? Earn +25 Honey XP</p>
                    </div>
                  </div>

                  <p className="text-xs font-semibold text-black mb-4">
                    {MOCK_IN_VIDEO_QUIZ.question}
                  </p>

                  <div className="flex flex-col gap-2 mb-4">
                    {MOCK_IN_VIDEO_QUIZ.options.map((opt, i) => (
                      <button
                        key={i}
                        onClick={() => setQuizAnswered(i)}
                        className={`p-3 rounded-xl text-left text-xs font-medium border transition-all ${
                          quizAnswered === i
                            ? i === MOCK_IN_VIDEO_QUIZ.correctIndex
                              ? 'bg-emerald-50 border-emerald-500 text-emerald-900 font-bold'
                              : 'bg-rose-50 border-rose-500 text-rose-900'
                            : 'bg-gray-50 border-gray-200 hover:border-gray-400 text-black'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>

                  {quizAnswered !== null && (
                    <p className="text-[11px] text-emerald-700 font-medium mb-3">
                      ? Correct! det(A)=0 permanent spatial collapse. +25 XP earned!
                    </p>
                  )}

                  <button
                    onClick={() => {
                      setShowInVideoQuiz(false);
                      setQuizAnswered(null);
                    }}
                    className="w-full py-2.5 rounded-full bg-black text-white text-xs font-bold hover:scale-105 transition-all"
                  >
                    Resume Lecture Playback ?
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Player Toolbar & Multilingual Switcher */}
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-200 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center hover:scale-105 transition-all"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
              </button>
              <div className="text-xs font-mono font-bold text-gray-700">
                03:00 / 10:00
              </div>
            </div>

            {/* Fast-Whisper Language Pills */}
            <div className="flex items-center gap-1 bg-[#f5f3f0] p-1 rounded-full border border-gray-200">
              {(['EN', 'HI', 'TA', 'HINGLISH'] as const).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setActiveLang(lang)}
                  className={`px-3 py-1 rounded-full text-[11px] font-bold transition-all ${
                    activeLang === lang
                      ? 'bg-black text-white shadow-sm'
                      : 'text-gray-600 hover:text-black'
                  }`}
                >
                  {lang === 'HI' ? '??????' : lang === 'TA' ? '?????' : lang}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right 4 Cols: BeeBook Live Notes Side Panel */}
        <div className="lg:col-span-4 bg-white rounded-[32px] p-6 shadow-xl border border-gray-200 flex flex-col h-[580px] justify-between">
          <div>
            {/* Panel Tabs */}
            <div className="flex items-center gap-2 pb-4 border-b border-gray-100 mb-4">
              <button
                onClick={() => setActiveTab('beebook')}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  activeTab === 'beebook'
                    ? 'bg-[#ffe24c] text-black shadow-sm'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>BeeBook Notes</span>
              </button>
              <button
                onClick={() => setActiveTab('transcript')}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  activeTab === 'transcript'
                    ? 'bg-black text-white shadow-sm'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Globe className="w-3.5 h-3.5" />
                <span>Transcript</span>
              </button>
            </div>

            {/* Content List */}
            <div className="overflow-y-auto max-h-[420px] flex flex-col gap-3 pr-1 no-scrollbar">
              {activeTab === 'beebook' ? (
                MOCK_BEEBOOK_NOTES.map((note) => (
                  <div
                    key={note.id}
                    className="p-3.5 rounded-2xl bg-[#fbf9f6] border border-gray-200 hover:border-black transition-all flex flex-col gap-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded-md bg-black text-white font-mono text-[10px] font-bold">
                        {note.timestampLabel}
                      </span>
                      {note.isBookmarked && <Bookmark className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />}
                    </div>
                    <h4 className="font-display text-xs font-bold text-black">{note.conceptTitle}</h4>
                    <p className="text-[11px] text-gray-600 leading-relaxed">{note.keyTakeaway}</p>
                    {note.latexFormula && (
                      <div className="font-mono text-[10px] bg-white p-2 rounded-lg border border-gray-200 text-purple-900">
                        {note.latexFormula}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                transcripts[activeLang].map((t, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-gray-50 border border-gray-200 hover:bg-amber-50 hover:border-amber-300 transition-all cursor-pointer flex items-start gap-2"
                  >
                    <span className="text-[10px] font-mono text-gray-400 mt-0.5">{`00:${t.sec}`}</span>
                    <p className="text-xs text-gray-800 leading-relaxed">{t.text}</p>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
            <span>Powered by IBM Granite 3.0</span>
            <span className="text-emerald-600 font-bold">Synced Live ?</span>
          </div>
        </div>
      </div>

      {/* Pre-Lecture Warmup Modal */}
      {showWarmupModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-white rounded-[40px] p-8 max-w-lg w-full shadow-2xl border border-gray-200">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-6">
              <div className="flex items-center gap-2">
                <span className="text-2xl">??</span>
                <div>
                  <h3 className="font-display text-lg font-bold text-black">Honey Memory Warm-Up</h3>
                  <p className="text-xs text-gray-500">Flashcard {flashcardIdx + 1} of 3 ? 45-Sec Prior Recall</p>
                </div>
              </div>
              <button onClick={() => setShowWarmupModal(false)} className="text-gray-400 hover:text-black font-bold">?</button>
            </div>

            {/* 3D Flip Card */}
            <div
              onClick={() => setIsFlipped(!isFlipped)}
              className="w-full h-48 bg-[#fbf9f6] rounded-3xl p-6 border-2 border-dashed border-amber-300 flex flex-col justify-between cursor-pointer hover:shadow-md transition-all text-center mb-6"
            >
              <span className="text-[10px] font-bold text-amber-600 uppercase">
                {isFlipped ? 'Back (Answer)' : 'Front (Click to Reveal)'}
              </span>
              <p className="font-display text-base font-bold text-black">
                {isFlipped
                  ? MOCK_PRE_LECTURE_FLASHCARDS[flashcardIdx].backAnswer
                  : MOCK_PRE_LECTURE_FLASHCARDS[flashcardIdx].frontQuestion}
              </p>
              <span className="text-[11px] text-gray-400">Flip card to test memory ?</span>
            </div>

            <div className="flex justify-between items-center">
              <button
                onClick={() => {
                  setFlashcardIdx((flashcardIdx + 1) % 3);
                  setIsFlipped(false);
                }}
                className="px-4 py-2 rounded-full bg-gray-100 text-xs font-bold hover:bg-gray-200"
              >
                Next Card
              </button>
              <button
                onClick={() => setShowWarmupModal(false)}
                className="px-6 py-2.5 rounded-full bg-black text-white text-xs font-bold hover:scale-105 transition-all"
              >
                Ready to Learn! ??
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
