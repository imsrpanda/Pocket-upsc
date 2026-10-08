import React, { useState, useEffect, useRef } from 'react';

const CADRE_BADGES = [
  { code: 'IAS', title: 'Admin', icon: '🏛️' },
  { code: 'IPS', title: 'Police', icon: '⭐' },
  { code: 'IFS', title: 'Foreign', icon: '🌐' },
  { code: 'IRS', title: 'Revenue', icon: '⚖️' },
];

export default function DashboardHub({ progressMetrics, setActiveTab }) {
  const currentGlobalMastery = progressMetrics?.globalPercentage || 0;
  const completedCount = progressMetrics?.completedTopics || 0;
  const totalCount = progressMetrics?.totalTopics || 0;

  const [isScrolled, setIsScrolled] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        // Triggers the compact pinned state once scrolled past the top salutation
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
      className="space-y-4 overflow-y-auto pb-12 pr-0.5 flex-1 animate-fadeIn select-none relative"
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

      {/* Secretariat Desk Officer Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white p-4 sm:p-5 border border-amber-500/30 shadow-xl">
        
        {/* Subtle Watermark Texture */}
        <div className="absolute inset-0 opacity-[0.035] pointer-events-none bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:14px_14px]" />
        <div className="absolute -top-8 -right-8 text-8xl font-black opacity-[0.025] pointer-events-none select-none">🏛️</div>

        {/* Top Header Bar */}
        <div className="relative z-10 flex items-center justify-between border-b border-amber-500/20 pb-2.5 mb-3.5">
          <div className="flex items-center gap-2">
            <span className="text-base filter drop-shadow-[0_2px_4px_rgba(245,158,11,0.5)]">🇮🇳</span>
            <div>
              <span className="text-[8.5px] uppercase font-black text-amber-300 tracking-[0.2em] block leading-tight">
                Central Secretariat
              </span>
              <span className="text-[7.5px] text-slate-400 font-mono tracking-wider">
                CIVIL SERVICES ACCELERATOR
              </span>
            </div>
          </div>
          <span className="text-[8px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Active
          </span>
        </div>

        {/* Welcome Salutation */}
        <div className="relative z-10 space-y-0.5">
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
            Welcome, <span className="bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-300 bg-clip-text text-transparent">Officer</span>
          </h2>
          <p className="text-[11px] text-slate-400 font-medium">
            National civil services dashboard & mastery dossier.
          </p>
        </div>

        {/* SINGLE SET OF BADGES: Sticky container that dynamically morphs on scroll */}
        <div 
          className={`sticky top-2 z-20 transition-all duration-300 ease-out mt-3.5 rounded-xl ${
            isScrolled 
              ? 'backdrop-blur-md bg-slate-950/80 p-1.5 border border-amber-500/30 shadow-lg' 
              : 'p-0 bg-transparent border-transparent'
          }`}
        >
          <div className="grid grid-cols-4 gap-1.5 sm:gap-2.5">
            {CADRE_BADGES.map((badge, idx) => (
              <div
                key={badge.code}
                className="relative rounded-xl overflow-hidden p-[1.5px] shadow-[0_2px_12px_rgba(217,119,6,0.22)] bg-slate-800 transition-all duration-300"
              >
                {/* Rotating Light Beam (Conic Gradient) */}
                <div 
                  className="absolute inset-[-150%] animate-border-beam pointer-events-none"
                  style={{
                    background: 'conic-gradient(from 0deg, transparent 0 300deg, #fef08a 335deg, #fbbf24 350deg, #d97706 360deg)',
                    animationDelay: `${idx * -1}s`
                  }}
                />

                {/* Inner Metallic Bezel Plate (Shrinks smoothly when scrolled) */}
                <div 
                  className={`w-full h-full rounded-[10px] bg-gradient-to-b from-slate-950/98 via-slate-900/95 to-slate-950/98 flex items-center justify-center text-center relative overflow-hidden z-10 transition-all duration-300 ${
                    isScrolled 
                      ? 'py-1 px-1 flex-row gap-1' 
                      : 'py-2 px-1 flex-col'
                  }`}
                >
                  {/* Diagonal Metallic Sheen Line */}
                  <div className="absolute -top-6 -left-6 w-14 h-14 bg-white/[0.08] rounded-full blur-md pointer-events-none" />

                  {/* Corner Rivet Screws (fades out in compact mode) */}
                  <div className={`transition-opacity duration-300 ${isScrolled ? 'opacity-0' : 'opacity-100'}`}>
                    <div className="absolute top-1 left-1 h-0.5 w-0.5 rounded-full bg-amber-400/60" />
                    <div className="absolute top-1 right-1 h-0.5 w-0.5 rounded-full bg-amber-400/60" />
                    <div className="absolute bottom-1 left-1 h-0.5 w-0.5 rounded-full bg-amber-400/60" />
                    <div className="absolute bottom-1 right-1 h-0.5 w-0.5 rounded-full bg-amber-400/60" />
                  </div>

                  {/* Crest Icon */}
                  <span 
                    className={`filter drop-shadow-[0_1px_4px_rgba(251,191,36,0.45)] transition-all duration-300 ${
                      isScrolled ? 'text-xs mb-0' : 'text-sm sm:text-base mb-0.5'
                    }`}
                  >
                    {badge.icon}
                  </span>

                  {/* Polished Gold Code */}
                  <span 
                    className={`font-black font-serif tracking-wider bg-gradient-to-r from-amber-100 via-yellow-300 to-amber-400 bg-clip-text text-transparent leading-tight transition-all duration-300 ${
                      isScrolled ? 'text-[10px]' : 'text-[11px] sm:text-xs'
                    }`}
                  >
                    {badge.code}
                  </span>

                  {/* Micro Subtitle (collapses completely when scrolled) */}
                  <span 
                    className={`uppercase tracking-tight font-extrabold text-amber-200/70 truncate w-full transition-all duration-300 ${
                      isScrolled 
                        ? 'max-h-0 opacity-0 overflow-hidden m-0 p-0 hidden' 
                        : 'text-[7px] max-h-4 opacity-100 mt-0.5 block'
                    }`}
                  >
                    {badge.title}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dynamic Global Syllabus Progress Track */}
        <div className="mt-4 space-y-1.5 border-t border-white/10 pt-3 relative z-10">
          <div className="flex justify-between items-end text-[10.5px] font-bold">
            <span className="text-slate-300 tracking-wide">Global Core Syllabus Mastery</span>
            <span className="text-emerald-400 text-xs sm:text-sm font-black">{currentGlobalMastery}%</span>
          </div>
          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden border border-slate-700/40">
            <div 
              style={{ width: `${currentGlobalMastery}%` }}
              className="h-full bg-gradient-to-r from-amber-400 via-emerald-400 to-teal-400 rounded-full transition-all duration-500 shadow-xs"
            />
          </div>
          <p className="text-[9.5px] text-slate-400 font-medium">
            Verified {completedCount} of {totalCount} subtopic syllabus modules fully audited.
          </p>
        </div>

      </div>

      {/* Core Workflow App Sections Grid */}
      <div className="space-y-2.5">
        <h3 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider pl-1">
          Active Workspace Core Engines
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          
          {/* Card 1: Syllabus Tracker */}
          <div 
            onClick={() => setActiveTab('tracker')}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl shadow-3xs cursor-pointer hover:border-indigo-400 dark:hover:border-indigo-900/60 transition-all transform active:scale-98"
          >
            <div className="text-xl">📈</div>
            <h4 className="text-xs font-black text-slate-800 dark:text-slate-100 mt-2">Syllabus Tracker</h4>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium mt-0.5 leading-normal">
              Monitor UPSC general studies benchmark targets and checklist progress matrix data inline.
            </p>
          </div>

          {/* Card 2: Learn Desk */}
          <div 
            onClick={() => setActiveTab('learn')}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl shadow-3xs cursor-pointer hover:border-indigo-400 dark:hover:border-indigo-900/60 transition-all transform active:scale-98"
          >
            <div className="text-xl">📖</div>
            <h4 className="text-xs font-black text-slate-800 dark:text-slate-100 mt-2">Learn Desk</h4>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium mt-0.5 leading-normal">
              Dive directly into interactive reading drawers, highlight frameworks, and view high-yield details.
            </p>
          </div>

          {/* Card 3: Practice Vault */}
          <div 
            onClick={() => setActiveTab('quiz')}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl shadow-3xs cursor-pointer hover:border-indigo-400 dark:hover:border-indigo-900/60 transition-all transform active:scale-98"
          >
            <div className="text-xl">⚡</div>
            <h4 className="text-xs font-black text-slate-800 dark:text-slate-100 mt-2">Practice Vault MCQs</h4>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium mt-0.5 leading-normal">
              Launch targeted mock test sessions with an integrated timed countdown engine.
            </p>
          </div>

        </div>
      </div>

      {/* UPSC Premium Archives & Reference Papers Block */}
      <div className="space-y-2.5 pt-1">
        <h3 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider pl-1">
          Official Civil Services Reference Archives
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          
          {/* Item A: Prelims PYQs */}
          <div 
            onClick={() => setActiveTab('past_papers')}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl shadow-3xs cursor-pointer hover:border-indigo-400 dark:hover:border-indigo-900/60 transition-all flex items-start gap-3.5 transform active:scale-98 group"
          >
            <div className="h-8 w-8 shrink-0 flex items-center justify-center bg-amber-50 dark:bg-amber-950/40 border border-amber-100/30 dark:border-amber-900/30 rounded-lg text-amber-500 text-sm transition-colors group-hover:bg-amber-100 dark:group-hover:bg-amber-900/60">
              📜
            </div>
            <div>
              <h4 className="text-xs font-black text-slate-800 dark:text-slate-100 transition-colors group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                Prelims PYQ Papers
              </h4>
              <p className="text-[9px] text-slate-400 dark:text-slate-500 font-medium mt-0.5 leading-normal">
                Previous year test keys arranged by chronological year thresholds.
              </p>
            </div>
          </div>

          {/* Item B: Mains Examination Matrix */}
          <div 
            onClick={() => setActiveTab('mains')}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl shadow-3xs cursor-pointer hover:border-indigo-400 dark:hover:border-indigo-900/60 transition-all flex items-start gap-3.5 transform active:scale-98 group"
          >
            <div className="h-8 w-8 shrink-0 flex items-center justify-center bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100/30 dark:border-indigo-900/30 rounded-lg text-indigo-500 text-sm transition-colors group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/60">
              ✒️
            </div>
            <div>
              <h4 className="text-xs font-black text-slate-800 dark:text-slate-100 transition-colors group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                Mains GS Papers
              </h4>
              <p className="text-[9px] text-slate-400 dark:text-slate-500 font-medium mt-0.5 leading-normal">
                Descriptive model structural questions spanning GS I through GS IV blocks.
              </p>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}