import React, { useState, useEffect } from 'react';

export default function SettingsDesk() {
  // 🧭 Local preference states initialized directly from persistent storage frames
  const [quizTimerEnabled, setQuizTimerEnabled] = useState(() => {
    return localStorage.getItem('pocketUPSC_timerEnabled') === 'true';
  });
  
  const [quizDurationMinutes, setQuizDurationMinutes] = useState(() => {
    return parseInt(localStorage.getItem('pocketUPSC_timerDuration') || '20', 10);
  });

  const [themeMode, setThemeMode] = useState(() => {
    return localStorage.getItem('pocketUPSC_themeMode') || 'light';
  });

  // 🔄 Synchronization triggers to auto-update localStorage keys instantly on change
  useEffect(() => {
    localStorage.setItem('pocketUPSC_timerEnabled', quizTimerEnabled);
  }, [quizTimerEnabled]);

  useEffect(() => {
    localStorage.setItem('pocketUPSC_timerDuration', quizDurationMinutes);
  }, [quizDurationMinutes]);

  useEffect(() => {
    localStorage.setItem('pocketUPSC_themeMode', themeMode);
    
    // Dynamic theme injector hook supporting the class-based strategy
    if (themeMode === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [themeMode]);

  return (
    <div className="space-y-4 animate-fadeIn flex-1 overflow-y-auto pb-12 select-none">
      
      {/* Settings Banner Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 shadow-3xs text-center space-y-1 rounded-2xl transition-colors duration-200">
        <span className="text-3xl block">⚙️</span>
        <h3 className="text-sm font-black text-slate-800 dark:text-white">Control & Configuration</h3>
        <p className="text-[11px] text-slate-400 dark:text-slate-500 max-w-xs mx-auto leading-normal">
          Customize your UPSC test parameters and system core environment presets.
        </p>
      </div>

      {/* SECTION 1: QUIZ TIMER ENGINE CONTROLS */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-3xs space-y-4 transition-colors duration-200">
        <div className="flex items-center justify-between border-b border-slate-50 dark:border-slate-800/60 pb-2.5">
          <div className="min-w-0 pr-2">
            <h4 className="text-xs font-black text-slate-800 dark:text-white flex items-center gap-1.5">
              <span>⏱️</span> Examination Countdown Timer
            </h4>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 leading-tight mt-0.5">
              Enforce a strict runtime countdown window during active practice sets.
            </p>
          </div>
          
          {/* iOS Style Custom Toggle Switch Wrapper */}
          <label className="relative inline-flex items-center cursor-pointer shrink-0 select-none">
            <input 
              type="checkbox" 
              checked={quizTimerEnabled}
              onChange={(e) => setQuizTimerEnabled(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-slate-200 dark:bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 dark:after:border-slate-600 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
          </label>
        </div>

        {/* Dynamic Parameter Adjustment Drawer: Appears instantly if Timer is YES */}
        {quizTimerEnabled && (
          <div className="bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-900/40 p-3 rounded-lg space-y-2.5 animate-slideDown transition-colors duration-200">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400">Allocated Time (Minutes)</span>
              <span className="text-xs font-black text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/30 px-2.5 py-0.5 rounded border border-indigo-100 dark:border-indigo-900/30">
                {quizDurationMinutes} Min
              </span>
            </div>
            <input 
              type="range" 
              min="5" 
              max="120" 
              step="5"
              value={quizDurationMinutes}
              onChange={(e) => setQuizDurationMinutes(parseInt(e.target.value, 10))}
              className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-600 dark:accent-indigo-500"
            />
            <div className="flex justify-between text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wide">
              <span>5m (Sprint)</span>
              <span>60m (Standard)</span>
              <span>120m (Mocks)</span>
            </div>
          </div>
        )}
      </div>

      {/* SECTION 2: GRAPHICAL THEME PARAMETERS */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-3xs space-y-3 transition-colors duration-200">
        <div>
          <h4 className="text-xs font-black text-slate-800 dark:text-white flex items-center gap-1.5">
            <span>🎨</span> Interface Visual Theme
          </h4>
          <p className="text-[10px] text-slate-400 dark:text-slate-500 leading-tight mt-0.5">
            Toggle color palettes to comfort your reading visibility during extended study intervals.
          </p>
        </div>

        {/* Customized Segmented Button Toggle Group */}
        <div className="grid grid-cols-2 gap-2 p-1 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-900 rounded-xl transition-colors duration-200">
          <button
            onClick={() => setThemeMode('light')}
            className={`py-2 text-xs font-black rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              themeMode === 'light' 
                ? 'bg-white text-indigo-600 shadow-3xs border border-slate-200/60' 
                : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
            }`}
          >
            <span>☀️</span> Bright / Light
          </button>
          <button
            onClick={() => setThemeMode('dark')}
            className={`py-2 text-xs font-black rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              themeMode === 'dark' 
                ? 'bg-slate-900 dark:bg-slate-800 text-indigo-400 shadow-3xs border border-slate-800/80 text-white' 
                : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
            }`}
          >
            <span>🌙</span> Midnight / Dark
          </button>
        </div>
      </div>

      {/* SYSTEM META OVERVIEW INFO */}
      <div className="text-center text-[10px] font-bold text-slate-400/80 dark:text-slate-600 pt-4 space-y-0.5 select-none">
        <p>Database Framework: Offline IndexedDB (Dexie)</p>
        <p>Device Target Platform: iOS / Android Hybrid Container</p>
      </div>
    </div>
  );
}