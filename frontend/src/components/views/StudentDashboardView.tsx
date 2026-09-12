'use client';

import React from 'react';
import {
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  ExternalLink,
  Flame,
  GraduationCap,
  Network,
  Play,
  PlayCircle,
  School,
  Sparkles,
  TrendingUp,
  User,
  Video,
  Zap,
  AlertTriangle,
  Award,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { DemoView } from '@/components/layout/PitchNavigatorBar';

interface StudentDashboardViewProps {
  onNavigate: (view: DemoView) => void;
}

export const StudentDashboardView: React.FC<StudentDashboardViewProps> = ({ onNavigate }) => {
  // Student Context & Analytics
  const student = {
    name: 'Rohan Verma',
    id: '22CS084',
    college: 'Indian Institute of Technology',
    courseName: 'CS302: Engineering Mathematics & Machine Learning',
    facultyName: 'Dr. Sunita Sharma',
    facultyEmail: 'dr.sharma@college.edu',
    classroomCode: 'CS302-SHARMA-2026',
    section: 'Section B',
    semester: 'Semester 4',
    careerTrack: 'AI & Machine Learning Engineer',
    streakDays: 12,
    xpPoints: 4820,
    latentAbilityTheta: 0.58,
    lecturesAttended: 24,
    totalLectures: 28,
    absentCount: 4,
    attendanceRate: 85.7,
    dailyHoursDone: 1.5,
    dailyHoursTarget: 2.0,
  };

  // Recent video lecture attachment data (3B1B Chapter 1)
  const recentVideo = {
    title: 'Chapter 1: But what is a neural network? | Deep Learning',
    channel: '3Blue1Brown',
    videoId: 'aircAruvnKk',
    totalDurationSec: 1153, // 19:13
    currentProgressSec: 270, // 04:30
    progressPercent: 23,
    lastWatchedTimestamp: '04:30',
    totalDurationFormatted: '19:13',
    transcriptSnippet:
      'A neuron is simply a thing that holds a number between 0 and 1. The network takes 784 inputs and recognizes the digit...',
    nextLecture: 'Chapter 2: Gradient descent, how neural networks learn (14m)',
  };

  // Weekly attendance records
  const weeklyAttendance = [
    { day: 'Mon', date: 'Sep 08', status: 'PRESENT', topic: 'Matrix Foundations' },
    { day: 'Tue', date: 'Sep 09', status: 'PRESENT', topic: 'Area Transformation' },
    { day: 'Wed', date: 'Sep 10', status: 'ABSENT', topic: 'Matrix Inversion Lab' },
    { day: 'Thu', date: 'Sep 11', status: 'PRESENT', topic: 'Determinants Concept' },
    { day: 'Fri', date: 'Sep 12', status: 'PRESENT', topic: 'Linear Transformations' },
  ];

  // Subject competency mastery
  const competencies = [
    { name: 'Linear Algebra & Vectors', score: 88, status: 'MASTERED', color: 'bg-emerald-500' },
    { name: 'Multivariable Calculus', score: 72, status: 'IN_PROGRESS', color: 'bg-blue-500' },
    { name: 'Matrix Inversion & Area', score: 42, status: 'BOTTLENECK', color: 'bg-amber-500' },
    { name: 'Neural Net Backpropagation', score: 28, status: 'BLOCKED', color: 'bg-rose-500' },
  ];

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* 1. Student Command Header */}
      <div className="bg-white rounded-[36px] p-6 md:p-8 shadow-sm border border-gray-200/80 flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#ffe24c]/10 rounded-full blur-3xl pointer-events-none -z-0" />

        <div className="relative z-10 flex items-start gap-4">
          <div className="w-16 h-16 rounded-2xl bg-[#0f62fe] text-white flex items-center justify-center font-bold text-2xl shadow-md shrink-0">
            RV
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full bg-[#0f62fe]/10 text-[#0f62fe] text-[11px] font-bold uppercase">
                Enrolled Student
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                {student.section} • Roll #{student.id}
              </span>
              <span className="text-xs text-gray-500 font-mono">Code: {student.classroomCode}</span>
            </div>
            <h1 className="font-display text-2xl md:text-3xl font-bold text-black">
              Welcome back, {student.name}
            </h1>
            <p className="text-xs text-gray-600 mt-1 flex flex-wrap items-center gap-x-2">
              <span className="font-bold text-gray-900">{student.courseName}</span>
              <span>•</span>
              <span>Instructor: <strong>{student.facultyName}</strong></span>
              <span>•</span>
              <span className="text-[#0f62fe] font-medium">{student.careerTrack}</span>
            </p>
          </div>
        </div>

        <div className="relative z-10 flex flex-wrap items-center gap-3">
          <button
            onClick={() => onNavigate('lecture')}
            className="px-5 py-2.5 rounded-full bg-[#ffe24c] text-black text-xs font-bold hover:scale-105 transition-all flex items-center gap-2 shadow-sm"
          >
            <Play className="w-4 h-4 fill-black" />
            <span>Resume Studio Lecture</span>
          </button>
          <button
            onClick={() => onNavigate('roadmap')}
            className="px-5 py-2.5 rounded-full bg-black text-white text-xs font-bold hover:scale-105 transition-all flex items-center gap-2 shadow-sm"
          >
            <Network className="w-4 h-4 text-[#ffe24c]" />
            <span>Open Knowledge DAG</span>
          </button>
        </div>
      </div>

      {/* 2. Four Key Student Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Card 1: Attendance Record */}
        <div className="bg-white p-6 rounded-[32px] shadow-sm border border-gray-200/80 flex flex-col justify-between hover:shadow-md transition-shadow">
          <div>
            <div className="flex items-center justify-between text-xs font-bold text-gray-500 uppercase">
              <span>Lectures Attended</span>
              <Calendar className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="font-display text-3xl font-bold text-black mt-2">
              {student.lecturesAttended} <span className="text-base font-normal text-gray-500">/ {student.totalLectures}</span>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-emerald-500 h-full rounded-full"
                  style={{ width: `${student.attendanceRate}%` }}
                />
              </div>
              <span className="text-xs font-bold text-emerald-600 font-mono">{student.attendanceRate}%</span>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-gray-100 text-[11px] text-emerald-700 font-medium flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Safe: Above 75% college minimum rule</span>
          </div>
        </div>

        {/* Card 2: Absents & Classes Missed */}
        <div className="bg-white p-6 rounded-[32px] shadow-sm border border-gray-200/80 flex flex-col justify-between hover:shadow-md transition-shadow">
          <div>
            <div className="flex items-center justify-between text-xs font-bold text-gray-500 uppercase">
              <span>Absents Recorded</span>
              <AlertTriangle className="w-4 h-4 text-amber-500" />
            </div>
            <div className="font-display text-3xl font-bold text-amber-700 mt-2">
              {student.absentCount} <span className="text-xs font-medium text-gray-500">Lectures</span>
            </div>
            <p className="text-xs text-gray-600 mt-1">
              Max permissible absents: 7 lectures per semester
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-gray-100 text-[11px] text-gray-500 flex items-center justify-between">
            <span>Next CS302 Lecture:</span>
            <span className="font-bold text-black">Tomorrow at 9:00 AM</span>
          </div>
        </div>

        {/* Card 3: Calibrated Cognitive Score */}
        <div className="bg-white p-6 rounded-[32px] shadow-sm border border-gray-200/80 flex flex-col justify-between hover:shadow-md transition-shadow">
          <div>
            <div className="flex items-center justify-between text-xs font-bold text-gray-500 uppercase">
              <span>Latent Ability (θ)</span>
              <Zap className="w-4 h-4 text-[#0f62fe]" />
            </div>
            <div className="font-display text-3xl font-bold text-[#0f62fe] mt-2">
              +{student.latentAbilityTheta}
            </div>
            <div className="text-[11px] text-gray-500 mt-1 font-medium">
              Top 12% of Section B • 2PL-IRT Calibrated
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-gray-100 text-[11px] text-gray-500 flex items-center justify-between">
            <span>Accuracy on MathE Items:</span>
            <span className="font-bold text-emerald-600">84.2%</span>
          </div>
        </div>

        {/* Card 4: Learning Streak & Honey XP */}
        <div className="bg-white p-6 rounded-[32px] shadow-sm border border-gray-200/80 flex flex-col justify-between hover:shadow-md transition-shadow">
          <div>
            <div className="flex items-center justify-between text-xs font-bold text-gray-500 uppercase">
              <span>Learning Streak</span>
              <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
            </div>
            <div className="font-display text-3xl font-bold text-black mt-2 flex items-center gap-2">
              <span>{student.streakDays} Days</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold">Active</span>
            </div>
            <p className="text-xs text-gray-600 mt-1 font-mono font-bold text-amber-900">
              🐝 {student.xpPoints.toLocaleString()} Honey XP Earned
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-gray-100 text-[11px] text-gray-500 flex items-center justify-between">
            <span>Today's Study Goal:</span>
            <span className="font-bold text-black">{student.dailyHoursDone} / {student.dailyHoursTarget} hrs</span>
          </div>
        </div>

      </div>

      {/* 3. RECENT VIDEO CARD ATTACHMENT ("Continue Learning") */}
      <div className="bg-gradient-to-r from-[#181917] to-[#252623] rounded-[36px] p-6 md:p-8 text-white shadow-xl border border-[#333530] relative overflow-hidden">
        {/* Glow */}
        <div className="absolute top-0 right-1/3 w-96 h-96 bg-[#ffe24c]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-6 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full bg-[#ffe24c] text-black text-[10px] font-mono font-bold uppercase">
                Recent Video Attachment
              </span>
              <span className="text-xs text-gray-400 font-mono">Last Watched at {recentVideo.lastWatchedTimestamp}</span>
            </div>
            <h2 className="font-display text-xl md:text-2xl font-bold text-white leading-snug">
              {recentVideo.title}
            </h2>
            <p className="text-xs text-gray-400 mt-1">
              Curated by <strong>{recentVideo.channel}</strong> for CS302 Chapter 1 • Includes Fast-Whisper Synchronized Captions
            </p>
          </div>

          <button
            onClick={() => onNavigate('lecture')}
            className="px-6 py-3 rounded-full bg-[#ffe24c] text-black text-xs font-bold hover:scale-105 transition-all flex items-center gap-2 shrink-0 shadow-lg"
          >
            <Play className="w-4 h-4 fill-black" />
            <span>Resume from {recentVideo.lastWatchedTimestamp}</span>
          </button>
        </div>

        {/* Video Attachment Details & Progress Bar */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-6 items-center">
          
          {/* Progress & Transcript Preview (8 cols) */}
          <div className="md:col-span-8 space-y-4">
            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-gray-300 font-medium">Lecture Playback Progress:</span>
                <span className="font-mono text-[#ffe24c] font-bold">
                  {recentVideo.lastWatchedTimestamp} / {recentVideo.totalDurationFormatted} ({recentVideo.progressPercent}%)
                </span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden p-0.5 border border-white/10">
                <div
                  className="bg-gradient-to-r from-[#ffe24c] to-amber-500 h-full rounded-full transition-all"
                  style={{ width: `${recentVideo.progressPercent}%` }}
                />
              </div>
            </div>

            {/* Fast Whisper Live Transcript Preview Box */}
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 text-xs">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                Synced Whisper Transcript Note:
              </span>
              <p className="text-gray-200 italic leading-relaxed">
                &ldquo;{recentVideo.transcriptSnippet}&rdquo;
              </p>
            </div>
          </div>

          {/* Queued Next Lecture (4 cols) */}
          <div className="md:col-span-4 p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
            <span className="text-[10px] font-bold text-[#ffe24c] uppercase tracking-wider block">
              Up Next in Syllabus:
            </span>
            <p className="text-xs font-bold text-white leading-tight">
              {recentVideo.nextLecture}
            </p>
            <button
              onClick={() => onNavigate('lecture')}
              className="text-xs text-gray-300 hover:text-white flex items-center gap-1 font-bold pt-1"
            >
              <span>Preview Chapter 2</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#ffe24c]" />
            </button>
          </div>

        </div>
      </div>

      {/* 4. Split Section: Attendance Calendar & Competency Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left 6 cols: Weekly Attendance Log & Visual Status */}
        <div className="lg:col-span-6 bg-white rounded-[36px] p-6 md:p-8 shadow-sm border border-gray-200/80 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-4">
              <div>
                <h3 className="font-display text-lg font-bold text-black">Weekly Class Attendance Log</h3>
                <p className="text-xs text-gray-500">CS302 Section B Lectures with Dr. Sharma</p>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                85.7% Overall
              </span>
            </div>

            <div className="space-y-3">
              {weeklyAttendance.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-2xl bg-[#fbf9f6] border border-gray-200/70 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs ${
                      item.status === 'PRESENT'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}>
                      {item.day}
                    </div>
                    <div>
                      <p className="font-bold text-black">{item.topic}</p>
                      <p className="text-[10px] text-gray-500">{item.date}</p>
                    </div>
                  </div>

                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                    item.status === 'PRESENT'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-rose-100 text-rose-800'
                  }`}>
                    {item.status === 'PRESENT' ? '✓ Attended' : '✗ Absent'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-black">Absence Note (Wed Sep 10):</p>
              <p className="text-[11px] mt-0.5">
                You missed the Matrix Inversion Lab. Skill-Bee detected a 42% bottleneck on this topic and queued a 10-minute visual refresher.
              </p>
            </div>
          </div>
        </div>

        {/* Right 6 cols: Topic Mastery & Roadmap Progress */}
        <div className="lg:col-span-6 bg-white rounded-[36px] p-6 md:p-8 shadow-sm border border-gray-200/80 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-4">
              <div>
                <h3 className="font-display text-lg font-bold text-black">Curriculum Competency Mastery</h3>
                <p className="text-xs text-gray-500">Bridging College Math to AI Engineering</p>
              </div>
              <button
                onClick={() => onNavigate('roadmap')}
                className="text-xs text-[#0f62fe] font-bold hover:underline flex items-center gap-1"
              >
                <span>View Full DAG</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-4">
              {competencies.map((comp, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-black">{comp.name}</span>
                    <span className="font-mono text-gray-600">{comp.score}%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                    <div
                      className={`${comp.color} h-full rounded-full transition-all`}
                      style={{ width: `${comp.score}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-gray-500">
                    <span>
                      {comp.status === 'MASTERED' ? '✓ Mastered' : comp.status === 'IN_PROGRESS' ? '⚡ In Progress' : comp.status === 'BOTTLENECK' ? '⚠️ Active Bottleneck' : '🔒 Prerequisite Blocked'}
                    </span>
                    <span>{comp.score >= 75 ? 'Exam Ready' : 'Needs Practice'}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Direct CTA to Diagnostic CAT */}
          <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-black">Want to re-calibrate your skill score?</p>
              <p className="text-[11px] text-gray-500">Take an adaptive 3-question diagnostic</p>
            </div>
            <button
              onClick={() => onNavigate('onboarding')}
              className="px-4 py-2 rounded-full bg-black text-white text-xs font-bold hover:scale-105 transition-all"
            >
              Start Diagnostic CAT
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
