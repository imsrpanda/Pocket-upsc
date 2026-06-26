import React from 'react';

export default function DashboardHub({ progressMetrics, setActiveTab }) {
  // Extract high-level curriculum tracking metrics safely
  const currentGlobalMastery = progressMetrics?.globalPercentage || 0;
  const completedCount = progressMetrics?.completedTopics || 0;
  const totalCount = progressMetrics?.totalTopics || 0;

  return (
    <div className="space-y-5 overflow-y-auto pb-12 pr-0.5 flex-1 animate-fadeIn select-none">
      
      {/* Welcome Banner & Global Progress Track */}
      <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-2xl p-5 shadow-md relative overflow-hidden">
        <div className="absolute -top-6 -right-6 text-9xl font-black opacity-5">🏛️</div>
        <span className="text-[9px] uppercase font-black text-indigo-300 tracking-widest bg-indigo-900/40 px-2 py-0.5 rounded-sm border border-indigo-800/30">
          Civil Services Accelerator
        </span>
        <h2 className="text-xl font-black mt-2 tracking-tight">Welcome Officer,</h2>
        <p className="text-xs text-slate-400 font-medium mt-0.5">Your cumulative curriculum overview tracker is running.</p>
        
        {/* Dynamic Micro Progress Indicator Line */}
        <div className="mt-5 space-y-2">
          <div className="flex justify-between items-end text-[11px] font-bold">
            <span className="text-indigo-200">Global Core Syllabus Mastery</span>
            <span className="text-emerald-400 text-sm font-black">{currentGlobalMastery}%</span>
          </div>
          <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden border border-slate-700/30">
            <div 
              style={{ width: `${currentGlobalMastery}%` }}
              className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 rounded-full transition-all duration-500"
            />
          </div>
          <p className="text-[10px] text-slate-400 font-medium">
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
          
          {/* Item A: Prelims PYQs - Routed seamlessly directly into your archive deck component */}
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
            onClick={() => alert("Loading official UPSC Mains GS Papers 1-4 and Essay prompt blueprint vault...")}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl shadow-3xs cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-all flex items-start gap-3.5 transform active:scale-98 group"
          >
            <div className="h-8 w-8 shrink-0 flex items-center justify-center bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100/30 dark:border-indigo-900/30 rounded-lg text-indigo-500 text-sm">
              ✒️
            </div>
            <div>
              <h4 className="text-xs font-black text-slate-800 dark:text-slate-100">Mains GS Papers</h4>
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