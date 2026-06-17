import React from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../data/db';

export default function DetailModal({ subtopicKey, onClose }) {
  // If no learn more key is clicked, keep the modal unrendered
  if (!subtopicKey) return null;

  // 🎯 THE FIXED QUERY LAYER: Instantly fetches ANY key variant (pol, eco, geo, etc.) straight out of IndexedDB
  const activeDetailRecord = useLiveQuery(
    async () => {
      const record = await db.detailedContent.get(subtopicKey);
      return record || null;
    },
    [subtopicKey]
  );

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 select-none animate-fadeIn">
      {/* Darkened Backdrop Overlay Blur */}
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-xs"
      />

      {/* Main Modal Display Container Box */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-md rounded-2xl shadow-xl z-10 overflow-hidden flex flex-col max-h-[80vh] transition-colors duration-200">
        
        {/* Modal Window Sticky Header Nav Bar */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 px-4 py-3 shrink-0 bg-slate-50 dark:bg-slate-900/50">
          <div>
            <span className="text-[9px] uppercase font-black text-indigo-600 dark:text-indigo-400 tracking-wider">
              UPSC High-Yield Deep Dive
            </span>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-tight mt-0.5">
              Ref ID: {subtopicKey.toUpperCase()}
            </p>
          </div>
          <button 
            onClick={onClose}
            className="h-7 w-7 flex items-center justify-center rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-black text-slate-400 dark:text-slate-300 active:scale-95 transition-all cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Dynamic Context Core Scrolling Block */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {activeDetailRecord ? (
            /* Renders the full details HTML payload safely from JSON databases */
            <div 
              dangerouslySetInnerHTML={{ __html: activeDetailRecord.paragraphs }}
              className="text-xs font-medium leading-relaxed text-slate-700 dark:text-slate-200 detail-html-renderer"
            />
          ) : activeDetailRecord === null ? (
            /* Fallback Alert UI Canvas State */
            <div className="text-center py-12 px-4 space-y-2 animate-fadeIn">
              <span className="text-3xl block">📂</span>
              <h4 className="text-xs font-black text-slate-800 dark:text-white">Explainer Note Not Available</h4>
              <p className="text-[11px] text-slate-400 dark:text-slate-500 max-w-xs mx-auto leading-normal">
                The database couldn't locate a verified study row for this structural key. Try wiping database storage arrays to refresh content pointers.
              </p>
            </div>
          ) : (
            /* Loading Spinner Block State */
            <div className="text-center py-12 text-xs font-bold text-slate-400 dark:text-slate-500 space-y-2 animate-pulse">
              <span className="animate-spin block text-lg text-indigo-500">⏳</span>
              <p>Querying offline IndexedDB records...</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}