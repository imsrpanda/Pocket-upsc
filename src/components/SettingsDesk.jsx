import React, { useState, useEffect } from 'react';
import { db, seedDatabaseIfEmpty } from '../data/db'; // Imported core database instances safely
import { useAuth } from '../context/AuthContext'; // 🔐 AuthContext Hook

export default function SettingsDesk() {
  // 🔐 Authentication Layer States & Handlers
  const { user, loginWithGoogle, logout } = useAuth();
  const [authLoading, setAuthLoading] = useState(false);

  const handleConnectGoogle = async () => {
    try {
      setAuthLoading(true);
      await loginWithGoogle();
    } catch {
      alert("Sign-in was cancelled or failed. Please check your connection and try again.");
    } finally {
      setAuthLoading(false);
    }
  };

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

  // Administrative local loader trigger state tracking execution workflows
  const [isResetting, setIsResetting] = useState(false);

  // 🎯 THE SYSTEM HARD RESET ACTION ROUTINE
  const handleSystemHardReset = async () => {
    const userConfirmed = window.confirm(
      "⚠️ WARNING: This will completely wipe out your local Pocket UPSC database!\n\n" +
      "This deletes all your checked syllabus topics, saved snippets, custom user notes, and in-progress quiz sessions.\n\n" +
      "Are you absolutely sure you want to proceed?"
    );

    if (!userConfirmed) return;

    try {
      setIsResetting(true);
      console.warn("💥 Initializing full system database nuke operations...");

      // 1. Clear out every single localized Dexie IndexedDB table asynchronously in parallel
      await Promise.all([
        db.syllabusProgress.clear(),
        db.questions.clear(),
        db.pastPapers.clear(),
        db.savedSnippets.clear(),
        db.userNotes.clear(),
        db.detailedContent.clear(),
        db.quizSessions.clear()
      ]);

      console.log("🧼 Database wiped completely. Executing pristine file ingestion seeding sequence...");
      
      // 2. Re-trigger database seeding setup to re-read pristine bundle files instantly
      await seedDatabaseIfEmpty();

      alert("✅ System data architecture reset successfully! The application will now reload to finalize states.");
      
      // 3. Force page reload to clear internal component memories completely
      window.location.reload();

    } catch (err) {
      console.error("❌ Critical execution breakdown during admin hard reset cycle:", err);
      alert("Something went wrong while resetting. Try clearing your browser site storage manually.");
    } finally {
      setIsResetting(false);
    }
  };

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
    <div className="space-y-6 animate-fadeIn flex-1 overflow-y-auto pb-12 select-none">
      
      {/* Settings Banner Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-7 shadow-3xs text-center space-y-1.5 rounded-3xl transition-colors duration-200">
        <span className="text-4xl block">⚙️</span>
        <h3 className="text-base sm:text-lg font-black text-slate-800 dark:text-white">Control & Configuration Desk</h3>
        <p className="text-xs text-slate-400 dark:text-slate-500 max-w-md mx-auto leading-relaxed">
          Customize your UPSC mock test parameters, interface appearance, officer identity, and offline database health.
        </p>
      </div>

      {/* Responsive 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        
        {/* COLUMN 1: IDENTITY & APPEARANCE */}
        <div className="space-y-5">
          
          {/* SECTION 0: 🏛️ OFFICER IDENTITY & ACCOUNT PROFILE */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-3xs space-y-4 transition-colors duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-3">
              <div>
                <h4 className="text-xs sm:text-sm font-black text-slate-800 dark:text-white flex items-center gap-2">
                  <span>🏛️</span> Secretariat Officer Profile
                </h4>
                <p className="text-[10.5px] text-slate-400 dark:text-slate-500 leading-tight mt-0.5">
                  Cloud account linkage & identity verification status.
                </p>
              </div>
              <span className={`text-[9px] uppercase font-black px-2.5 py-0.5 rounded-full border ${
                user 
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500/30 text-emerald-600 dark:text-emerald-400' 
                  : 'bg-amber-50 dark:bg-amber-950/40 border-amber-500/30 text-amber-600 dark:text-amber-400'
              }`}>
                {user ? 'Verified Officer' : 'Trainee Guest'}
              </span>
            </div>

            {user ? (
              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-3.5 min-w-0 pr-3">
                  {user.photoURL ? (
                    <img 
                      src={user.photoURL} 
                      alt="Profile" 
                      className="w-12 h-12 rounded-full border-2 border-amber-400/60 shadow-xs shrink-0" 
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-xl shrink-0">
                      👤
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="text-sm font-black text-slate-900 dark:text-white truncate">
                      {user.displayName || "Officer Cadet"}
                    </p>
                    <p className="text-xs text-slate-400 dark:text-slate-500 truncate font-mono">
                      {user.email}
                    </p>
                  </div>
                </div>

                <button
                  onClick={logout}
                  className="shrink-0 px-3.5 py-2 text-xs font-black text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/30 hover:bg-rose-100 dark:hover:bg-rose-900/40 border border-rose-200 dark:border-rose-900/50 rounded-xl transition-colors cursor-pointer active:scale-95"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="space-y-3.5 pt-1">
                <div className="bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/30 rounded-xl p-3 flex items-start gap-3">
                  <span className="text-base shrink-0">ℹ️</span>
                  <p className="text-xs text-amber-800 dark:text-amber-300 font-medium leading-relaxed">
                    You are exploring as an <b>Officer Trainee (Guest Mode)</b>. Link your Google account to synchronize your workstation status.
                  </p>
                </div>

                <button
                  onClick={handleConnectGoogle}
                  disabled={authLoading}
                  className="w-full flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl border border-indigo-200 dark:border-indigo-900/60 bg-indigo-50/60 dark:bg-indigo-950/30 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 font-black text-xs tracking-wide transition-all shadow-3xs active:scale-98 cursor-pointer"
                >
                  <span>📧</span>
                  <span>{authLoading ? "Authenticating Desk..." : "Connect with Google"}</span>
                </button>
              </div>
            )}
          </div>

          {/* SECTION 2: GRAPHICAL THEME PARAMETERS */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-3xs space-y-4 transition-colors duration-200">
            <div>
              <h4 className="text-xs sm:text-sm font-black text-slate-800 dark:text-white flex items-center gap-2">
                <span>🎨</span> Interface Visual Theme
              </h4>
              <p className="text-[10.5px] text-slate-400 dark:text-slate-500 leading-tight mt-0.5">
                Toggle color palettes to comfort your reading visibility during extended study intervals.
              </p>
            </div>

            {/* Customized Segmented Button Toggle Group */}
            <div className="grid grid-cols-2 gap-2 p-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800/80 rounded-2xl transition-colors duration-200">
              <button
                onClick={() => setThemeMode('light')}
                className={`py-2.5 text-xs font-black rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  themeMode === 'light' 
                    ? 'bg-white text-indigo-600 shadow-3xs border border-slate-200/60' 
                    : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
                }`}
              >
                <span>☀️</span> Bright Light
              </button>
              <button
                onClick={() => setThemeMode('dark')}
                className={`py-2.5 text-xs font-black rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  themeMode === 'dark' 
                    ? 'bg-slate-900 dark:bg-slate-800 text-indigo-400 shadow-3xs border border-slate-800/80 text-white' 
                    : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
                }`}
              >
                <span>🌙</span> Midnight Dark
              </button>
            </div>
          </div>

        </div>

        {/* COLUMN 2: EXAM TIMERS & SYSTEM DIAGNOSTICS */}
        <div className="space-y-5">
          
          {/* SECTION 1: QUIZ TIMER ENGINE CONTROLS */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-3xs space-y-4 transition-colors duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-3">
              <div className="min-w-0 pr-3">
                <h4 className="text-xs sm:text-sm font-black text-slate-800 dark:text-white flex items-center gap-2">
                  <span>⏱️</span> Examination Countdown Timer
                </h4>
                <p className="text-[10.5px] text-slate-400 dark:text-slate-500 leading-tight mt-0.5">
                  Enforce a strict runtime countdown window during active mock test practice.
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
                <div className="w-10 h-6 bg-slate-200 dark:bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 dark:after:border-slate-600 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
              </label>
            </div>

            {/* Dynamic Parameter Adjustment Drawer */}
            {quizTimerEnabled && (
              <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800/80 p-4 rounded-xl space-y-3 animate-slideDown transition-colors duration-200">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-600 dark:text-slate-400">Allocated Time Limit</span>
                  <span className="text-xs font-black text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 px-3 py-1 rounded-md border border-indigo-100 dark:border-indigo-900/40 font-mono">
                    {quizDurationMinutes} Minutes
                  </span>
                </div>
                <input 
                  type="range" 
                  min="5" 
                  max="120" 
                  step="5" 
                  value={quizDurationMinutes}
                  onChange={(e) => setQuizDurationMinutes(parseInt(e.target.value, 10))}
                  className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-600 dark:accent-indigo-500"
                />
                <div className="flex justify-between text-[9.5px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wide">
                  <span>5m (Rapid Sprint)</span>
                  <span>20m (Default)</span>
                  <span>60m (Paper 1)</span>
                  <span>120m (Prelims Full)</span>
                </div>
              </div>
            )}
          </div>

          {/* SECTION 3: 🛑 SYSTEM MAINTENANCE & HARD RESET */}
          <div className="bg-white dark:bg-slate-900 border border-rose-200/80 dark:border-rose-950/50 rounded-2xl p-5 shadow-3xs space-y-3.5 transition-colors duration-200">
            <div>
              <h4 className="text-xs sm:text-sm font-black text-rose-700 dark:text-rose-400 uppercase tracking-wider flex items-center gap-2">
                <span>⚠️</span> System Core Maintenance
              </h4>
              <p className="text-[10.5px] text-slate-400 dark:text-slate-500 leading-relaxed mt-0.5">
                Re-seeds the pristine offline question banks and resets progress state. Use if syllabus data requires a fresh re-index.
              </p>
            </div>

            <button
              onClick={handleSystemHardReset}
              disabled={isResetting}
              className={`w-full py-3 px-4 rounded-xl border font-black text-xs tracking-wide transition-all duration-150 flex items-center justify-center gap-2 outline-none ${
                isResetting
                  ? 'bg-rose-50 border-rose-200 text-rose-400 dark:bg-rose-950/20 dark:border-rose-900 cursor-not-allowed animate-pulse'
                  : 'bg-rose-50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/60 text-rose-600 dark:text-rose-400 hover:bg-rose-600 hover:text-white dark:hover:bg-rose-700 active:scale-98 cursor-pointer shadow-3xs'
              }`}
            >
              <span>{isResetting ? '🧼 Wiping & Re-seeding Database...' : '🚨 Perform Full System Database Reset'}</span>
            </button>
          </div>

        </div>

      </div>

      {/* SYSTEM META OVERVIEW INFO */}
      <div className="text-center text-xs font-bold text-slate-400/80 dark:text-slate-600 pt-6 space-y-1 select-none">
        <p>Database Framework: Offline IndexedDB (Dexie.js v4.4)</p>
        <p>Responsive Layout: Desktop Widescreen • Tablet Slate • Mobile Handheld</p>
      </div>
    </div>
  );
}