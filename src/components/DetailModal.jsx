import React, { useEffect } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../data/db';

export default function DetailModal({ subtopicKey, onClose }) {
  // If no learn more key is clicked, keep the modal unrendered
  if (!subtopicKey) return null;

  // Handle keyboard Escape key to close modal seamlessly
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Fetches detail record straight out of IndexedDB
  const activeDetailRecord = useLiveQuery(
    async () => {
      const record = await db.detailedContent.get(subtopicKey);
      return record || null;
    },
    [subtopicKey]
  );

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-3 sm:p-6 select-none">
      
      {/* Smooth Fade-in Backdrop with Deep Glassmorphic Blur */}
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/75 dark:bg-slate-950/85 backdrop-blur-md transition-opacity duration-300 animate-fadeIn"
      />

      {/* Main Responsive Modal Box */}
      <div className="relative bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 w-full max-w-4xl h-full sm:h-auto sm:max-h-[88vh] rounded-2xl sm:rounded-3xl shadow-2xl z-10 overflow-hidden flex flex-col transition-all duration-300 transform animate-dashboardCardPop">
        
        {/* Modal Window Header Nav Bar */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 px-5 sm:px-6 py-4 shrink-0 bg-slate-50/80 dark:bg-slate-900/80 backdrop-blur-md">
          <div>
            <span className="text-[9.5px] uppercase font-black text-indigo-600 dark:text-indigo-400 tracking-wider bg-indigo-50 dark:bg-indigo-950/50 px-2.5 py-0.5 rounded border border-indigo-100/40 dark:border-indigo-900/30 font-mono">
              UPSC High-Yield Deep Dive
            </span>
            <p className="text-xs text-slate-400 dark:text-slate-500 font-bold uppercase tracking-tight mt-1 font-mono">
              Module Ref: {subtopicKey.toUpperCase()}
            </p>
          </div>
          <button 
            onClick={onClose}
            className="h-8 w-8 flex items-center justify-center rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-black text-slate-500 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 active:scale-95 transition-all cursor-pointer shadow-2xs"
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        {/* Dynamic Context Core Scrolling Block */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-8 space-y-4">
          <div className="max-w-3xl mx-auto w-full">
            {activeDetailRecord ? (
              /* Renders the full details HTML payload safely from JSON databases */
              <div 
                dangerouslySetInnerHTML={{ __html: activeDetailRecord.paragraphs }}
                className="text-xs sm:text-sm font-medium leading-relaxed text-slate-700 dark:text-slate-200 detail-html-renderer space-y-4"
              />
            ) : activeDetailRecord === null ? (
              /* Fallback Alert UI Canvas State */
              <div className="text-center py-16 px-4 space-y-3 animate-fadeIn">
                <span className="text-4xl block">📂</span>
                <h4 className="text-sm font-black text-slate-800 dark:text-white">Explainer Note Not Available</h4>
                <p className="text-xs text-slate-400 dark:text-slate-500 max-w-xs mx-auto leading-normal">
                  The database couldn't locate a verified study row for this structural key. Try resetting or reloading databases in Settings.
                </p>
              </div>
            ) : (
              /* Loading Spinner Block State */
              <div className="text-center py-16 text-xs font-bold text-slate-400 dark:text-slate-500 space-y-3 animate-pulse">
                <span className="inline-block animate-spin text-xl text-indigo-500">⏳</span>
                <p>Querying offline IndexedDB records...</p>
              </div>
            )}
          </div>
        </div>

        {/* Smooth Footer Bar for Quick Dismissal */}
        <div className="px-5 sm:px-6 py-3.5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 shrink-0 flex items-center justify-between">
          <span className="text-xs text-slate-400 font-mono">Press Esc or click backdrop to close</span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all active:scale-95 cursor-pointer"
          >
            Done Reading
          </button>
        </div>

      </div>
    </div>
  );
}