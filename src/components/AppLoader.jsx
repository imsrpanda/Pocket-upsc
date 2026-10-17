import React, { useState, useEffect } from 'react';

const UPSC_TIPS = [
  "Consolidating syllabus & pyqs...",
  "Calibrating preliminary modules...",
  "Organizing GS papers & revision notes...",
  "Setting up offline study vault...",
  "Almost ready for today's session..."
];

export default function AppLoader({ progress = 0, statusText = "Initializing workspace..." }) {
  const [tipIndex, setTipIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTipIndex((prev) => (prev + 1) % UPSC_TIPS.length);
    }, 1200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-900 text-white px-6">
      {/* Brand Icon with Pulsing Halo */}
      <div className="relative mb-6 flex items-center justify-center">
        <div className="absolute w-20 h-20 bg-indigo-500/20 rounded-full animate-ping pointer-events-none" />
        <div className="w-16 h-16 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
          {/* Zero-dependency inline Book SVG */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-8 h-8 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
            />
          </svg>
        </div>
      </div>

      {/* Title */}
      <h1 className="text-2xl font-bold tracking-tight mb-1">Pocket UPSC</h1>
      <p className="text-xs font-medium text-slate-400 mb-8 tracking-wider uppercase">
        Preparing Your Workspace
      </p>

      {/* Progress Bar Container */}
      <div className="w-full max-w-xs space-y-2">
        <div className="flex justify-between items-center text-xs text-slate-300 font-mono">
          <span className="truncate max-w-[200px]">{statusText}</span>
          <span>{Math.round(progress)}%</span>
        </div>

        <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700/50">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${Math.min(Math.max(progress, 5), 100)}%` }}
          />
        </div>
      </div>

      {/* Cycling UPSC Quotes / Tips */}
      <div className="mt-10 h-6 flex items-center justify-center">
        <p className="text-xs text-slate-400 italic animate-pulse text-center">
          "{UPSC_TIPS[tipIndex]}"
        </p>
      </div>
    </div>
  );
}