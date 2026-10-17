import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';

const CADRE_BADGES = [
  { code: 'IAS', title: 'Admin', icon: '🏛️', desc: 'Indian Administrative Service' },
  { code: 'IPS', title: 'Police', icon: '⭐', desc: 'Indian Police Service' },
  { code: 'IFS', title: 'Foreign', icon: '🌐', desc: 'Indian Foreign Service' },
  { code: 'IRS', title: 'Revenue', icon: '⚖️', desc: 'Indian Revenue Service' },
];

export default function DashboardHub({ progressMetrics, setActiveTab }) {
  const { user } = useAuth();
  
  // Extract user's first name if signed in via Google, otherwise fallback to "Officer"
  const displayName = user?.displayName ? user.displayName.split(' ')[0] : 'Officer';

  const currentGlobalMastery = progressMetrics?.globalPercentage || 0;
  const completedCount = progressMetrics?.completedTopics || 0;
  const totalCount = progressMetrics?.totalTopics || 0;

  const [isScrolled, setIsScrolled] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        setIsScrolled(containerRef.current.scrollTop > 60);
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll, { passive: true });
    }
    return () => {
      if (container) container.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className="space-y-6 overflow-y-auto pb-12 pr-0.5 flex-1 animate-fadeIn select-none relative"
    >
      {/* Keyframe Animation for Traveling Border Beam */}
      <style>{`
        @keyframes borderBeamRotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-border-beam {
          animation: borderBeamRotate 4s linear infinite;
        }
      `}</style>

      {/* Secretariat Desk Officer Banner - Responsive Command Center */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white p-5 sm:p-7 border border-amber-500/30 shadow-2xl">
        
        {/* Subtle Watermark Texture */}
        <div className="absolute inset-0 opacity-[0.035] pointer-events-none bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:16px_16px]" />
        <div className="absolute -top-10 -right-10 text-9xl font-black opacity-[0.03] pointer-events-none select-none">🏛️</div>

        {/* Top Header Bar */}
        <div className="relative z-10 flex items-center justify-between border-b border-amber-500/20 pb-3 mb-4">
          <div className="flex items-center gap-2.5">
            <span className="text-xl filter drop-shadow-[0_2px_6px_rgba(245,158,11,0.5)]">🇮🇳</span>
            <div>
              <span className="text-[9.5px] uppercase font-black text-amber-300 tracking-[0.2em] block leading-tight">
                Central Secretariat Desk
              </span>
              <span className="text-[8px] text-slate-400 font-mono tracking-wider">
                NATIONAL CIVIL SERVICES ACCELERATOR
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[9px] uppercase tracking-wider font-extrabold px-2.5 py-0.5 rounded-full border border-emerald-500/40 bg-emerald-500/10 text-emerald-400 flex items-center gap-1.5 shadow-xs">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Station Active
            </span>
          </div>
        </div>

        {/* Executive Hero Layout: Split into Salutation + Cadre Badges and Mastery Gauge on Desktop */}
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          
          {/* Left Column: Officer Dossier & Cadre Badges */}
          <div className="lg:col-span-7 space-y-4">
            <div className="space-y-1">
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                Welcome, <span className="bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-400 bg-clip-text text-transparent">{displayName}</span>
              </h2>
              <p className="text-xs text-slate-300 font-medium max-w-xl leading-relaxed">
                Integrated UPSC General Studies curriculum matrix, timed preliminary mock vault, and descriptive mains answer repository.
              </p>
            </div>

            {/* CADRE BADGES GRID */}
            <div className="pt-1">
              <span className="text-[9px] uppercase font-bold tracking-widest text-amber-200/80 mb-2 block">
                Civil Services Cadre Emblems
              </span>
              <div className="grid grid-cols-4 gap-2 sm:gap-3 max-w-lg">
                {CADRE_BADGES.map((badge, idx) => (
                  <div
                    key={badge.code}
                    className="relative rounded-xl overflow-hidden p-[1.5px] shadow-[0_3px_14px_rgba(217,119,6,0.25)] bg-slate-800 transition-all duration-300 hover:scale-105 cursor-pointer group"
                  >
                    {/* Rotating Light Beam (Conic Gradient) */}
                    <div 
                      className="absolute inset-[-150%] animate-border-beam pointer-events-none"
                      style={{
                        background: 'conic-gradient(from 0deg, transparent 0 300deg, #fef08a 335deg, #fbbf24 350deg, #d97706 360deg)',
                        animationDelay: `${idx * -1}s`
                      }}
                    />

                    {/* Inner Metallic Bezel Plate */}
                    <div className="w-full h-full rounded-[10px] bg-gradient-to-b from-slate-950/98 via-slate-900/95 to-slate-950/98 flex flex-col items-center justify-center text-center relative overflow-hidden z-10 py-2.5 px-1.5">
                      {/* Corner Rivet Screws */}
                      <div className="absolute top-1 left-1 h-0.5 w-0.5 rounded-full bg-amber-400/70" />
                      <div className="absolute top-1 right-1 h-0.5 w-0.5 rounded-full bg-amber-400/70" />
                      <div className="absolute bottom-1 left-1 h-0.5 w-0.5 rounded-full bg-amber-400/70" />
                      <div className="absolute bottom-1 right-1 h-0.5 w-0.5 rounded-full bg-amber-400/70" />

                      {/* Crest Icon */}
                      <span className="text-base sm:text-lg mb-0.5 filter drop-shadow-[0_1px_4px_rgba(251,191,36,0.5)] group-hover:scale-110 transition-transform">
                        {badge.icon}
                      </span>

                      {/* Polished Gold Code */}
                      <span className="font-black font-serif tracking-wider bg-gradient-to-r from-amber-100 via-yellow-300 to-amber-400 bg-clip-text text-transparent leading-tight text-xs sm:text-sm">
                        {badge.code}
                      </span>

                      {/* Micro Subtitle */}
                      <span className="uppercase tracking-tight font-extrabold text-amber-200/70 text-[8px] mt-0.5 block truncate max-w-full">
                        {badge.title}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Dynamic Global Syllabus Mastery Command Card */}
          <div className="lg:col-span-5 bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-5 backdrop-blur-md space-y-3.5">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[9.5px] uppercase font-black text-amber-300 tracking-wider block">
                  Curriculum Mastery
                </span>
                <span className="text-xs text-slate-300 font-semibold">Overall GS Status</span>
              </div>
              <span className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono">
                {currentGlobalMastery}%
              </span>
            </div>

            {/* Gradient Mastery Bar */}
            <div className="space-y-1.5">
              <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden border border-slate-700/60 p-0.5">
                <div 
                  style={{ width: `${currentGlobalMastery}%` }}
                  className="h-full bg-gradient-to-r from-amber-400 via-emerald-400 to-teal-400 rounded-full transition-all duration-700 shadow-sm"
                />
              </div>
              <div className="flex justify-between text-[10px] text-slate-300 font-medium">
                <span>{completedCount} Verified Complete</span>
                <span>{totalCount - completedCount} Modules Remaining</span>
              </div>
            </div>

            {/* Quick Action Trigger Buttons */}
            <div className="grid grid-cols-2 gap-2 pt-1 border-t border-white/10">
              <button
                onClick={() => setActiveTab('tracker')}
                className="w-full py-2 px-3 rounded-xl bg-indigo-600/70 hover:bg-indigo-600 text-white font-bold text-xs tracking-wide transition-all shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>📋</span>
                <span>Audit Matrix</span>
              </button>
              <button
                onClick={() => setActiveTab('quiz')}
                className="w-full py-2 px-3 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-200 font-bold text-xs tracking-wide transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>⚡</span>
                <span>Quick Mock</span>
              </button>
            </div>
          </div>

        </div>

      </div>

      {/* Core Workflow App Sections Grid - Fully Responsive 1, 2, or 3 Columns */}
      <div className="space-y-3">
        <div className="flex items-center justify-between pl-1">
          <h3 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <span>⚙️</span> Active Workspace Engines
          </h3>
          <span className="text-[10px] text-slate-400 font-medium">Click any module to launch</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          
          {/* Card 1: Syllabus Tracker */}
          <div 
            onClick={() => setActiveTab('tracker')}
            className="group bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 rounded-2xl shadow-3xs cursor-pointer hover:border-indigo-400 dark:hover:border-indigo-700 hover:shadow-md transition-all duration-200 transform hover:-translate-y-0.5 active:scale-98 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-2xl p-2.5 bg-indigo-50 dark:bg-indigo-950/50 rounded-xl border border-indigo-100 dark:border-indigo-900/40 shadow-xs">
                  📈
                </span>
                <span className="text-[9.5px] uppercase font-black px-2 py-0.5 bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 rounded-full border border-indigo-200/50 dark:border-indigo-800/40">
                  {currentGlobalMastery}% Done
                </span>
              </div>
              <h4 className="text-sm font-black text-slate-800 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                Syllabus Tracker
              </h4>
              <p className="text-xs text-slate-400 dark:text-slate-500 font-medium mt-1 leading-relaxed">
                Monitor UPSC General Studies benchmark targets and checklist progress matrix data inline.
              </p>
            </div>
            <div className="pt-4 mt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-indigo-600 dark:text-indigo-400">
              <span>View Checklist</span>
              <span className="group-hover:translate-x-1 transition-transform">➔</span>
            </div>
          </div>

          {/* Card 2: Learn Desk */}
          <div 
            onClick={() => setActiveTab('learn')}
            className="group bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 rounded-2xl shadow-3xs cursor-pointer hover:border-indigo-400 dark:hover:border-indigo-700 hover:shadow-md transition-all duration-200 transform hover:-translate-y-0.5 active:scale-98 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-2xl p-2.5 bg-emerald-50 dark:bg-emerald-950/50 rounded-xl border border-emerald-100 dark:border-emerald-900/40 shadow-xs">
                  📖
                </span>
                <span className="text-[9.5px] uppercase font-black px-2 py-0.5 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 rounded-full border border-emerald-200/50 dark:border-emerald-800/40">
                  6 Core Pillars
                </span>
              </div>
              <h4 className="text-sm font-black text-slate-800 dark:text-slate-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                Learn Repository Desk
              </h4>
              <p className="text-xs text-slate-400 dark:text-slate-500 font-medium mt-1 leading-relaxed">
                Interactive micro-reading drawers, highlight frameworks, personal notes, and high-yield details.
              </p>
            </div>
            <div className="pt-4 mt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-emerald-600 dark:text-emerald-400">
              <span>Enter Study Room</span>
              <span className="group-hover:translate-x-1 transition-transform">➔</span>
            </div>
          </div>

          {/* Card 3: Practice Vault */}
          <div 
            onClick={() => setActiveTab('quiz')}
            className="group bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 rounded-2xl shadow-3xs cursor-pointer hover:border-amber-400 dark:hover:border-amber-700 hover:shadow-md transition-all duration-200 transform hover:-translate-y-0.5 active:scale-98 flex flex-col justify-between sm:col-span-2 lg:col-span-1"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-2xl p-2.5 bg-amber-50 dark:bg-amber-950/50 rounded-xl border border-amber-100 dark:border-amber-900/40 shadow-xs">
                  ⚡
                </span>
                <span className="text-[9.5px] uppercase font-black px-2 py-0.5 bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 rounded-full border border-amber-200/50 dark:border-amber-800/40">
                  Timed Engine
                </span>
              </div>
              <h4 className="text-sm font-black text-slate-800 dark:text-slate-100 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                Practice Vault MCQs
              </h4>
              <p className="text-xs text-slate-400 dark:text-slate-500 font-medium mt-1 leading-relaxed">
                Launch targeted preliminary mock test sessions with an integrated timed countdown engine.
              </p>
            </div>
            <div className="pt-4 mt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-amber-600 dark:text-amber-400">
              <span>Launch Quiz Deck</span>
              <span className="group-hover:translate-x-1 transition-transform">➔</span>
            </div>
          </div>

        </div>
      </div>

      {/* Official UPSC Reference Archives Grid - 2 Column Responsive */}
      <div className="space-y-3 pt-1">
        <div className="flex items-center justify-between pl-1">
          <h3 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <span>📜</span> Official Civil Services Archives
          </h3>
          <span className="text-[10px] text-slate-400 font-medium">Exam Simulation Registers</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Item A: Prelims PYQs */}
          <div 
            onClick={() => setActiveTab('past_papers')}
            className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 rounded-2xl shadow-3xs cursor-pointer hover:border-amber-400 dark:hover:border-amber-800 transition-all flex items-start gap-4 transform active:scale-98 group hover:shadow-md"
          >
            <div className="h-12 w-12 shrink-0 flex items-center justify-center bg-amber-50 dark:bg-amber-950/40 border border-amber-200/40 dark:border-amber-800/40 rounded-xl text-amber-600 dark:text-amber-400 text-xl transition-colors group-hover:bg-amber-100 dark:group-hover:bg-amber-900/60 shadow-xs">
              📜
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-black text-slate-800 dark:text-slate-100 transition-colors group-hover:text-amber-600 dark:group-hover:text-amber-400">
                  Prelims PYQ Papers
                </h4>
                <span className="text-[9px] font-black uppercase text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-full border border-amber-200/40 dark:border-amber-800/30">
                  2015-2024
                </span>
              </div>
              <p className="text-xs text-slate-400 dark:text-slate-500 font-medium mt-1 leading-relaxed">
                Official Previous Year Question keys arranged by chronological year thresholds with authentic commission parameters.
              </p>
              <span className="text-xs font-bold text-amber-600 dark:text-amber-400 mt-2.5 inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                Simulate Previous Papers ➔
              </span>
            </div>
          </div>

          {/* Item B: Mains Examination Matrix */}
          <div 
            onClick={() => setActiveTab('mains')}
            className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 rounded-2xl shadow-3xs cursor-pointer hover:border-indigo-400 dark:hover:border-indigo-800 transition-all flex items-start gap-4 transform active:scale-98 group hover:shadow-md"
          >
            <div className="h-12 w-12 shrink-0 flex items-center justify-center bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200/40 dark:border-indigo-800/40 rounded-xl text-indigo-600 dark:text-indigo-400 text-xl transition-colors group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/60 shadow-xs">
              ✒️
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-black text-slate-800 dark:text-slate-100 transition-colors group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                  Mains GS Papers
                </h4>
                <span className="text-[9px] font-black uppercase text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 px-2 py-0.5 rounded-full border border-indigo-200/40 dark:border-indigo-800/30">
                  GS 1 — 4
                </span>
              </div>
              <p className="text-xs text-slate-400 dark:text-slate-500 font-medium mt-1 leading-relaxed">
                Descriptive model structural questions and administrative answers spanning General Studies I through GS IV blocks.
              </p>
              <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 mt-2.5 inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                Read Model Answers ➔
              </span>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}