import React, { useState, useEffect } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../data/db';
import InteractiveCityLayoutDiagram from './InteractiveCityLayoutDiagram';
import NativeMotionShort from './NativeMotionShort';
import { HISTORY_REELS_DATA, getHistoryReel } from '../data/historyReelsData';
import { isInteractiveEnabled, isVideoEnabled } from '../config/multimediaConfig';
import { formatContentHtml } from '../utils/formatContent';

export default function DetailModal({ subtopicKey, onClose }) {
  // If no learn more key is clicked, keep the modal unrendered
  if (!subtopicKey) return null;

  const [activeTab, setActiveTab] = useState('notes'); // 'notes', 'diagram', 'video'

  // Reset tab to notes whenever subtopicKey changes
  useEffect(() => {
    setActiveTab('notes');
  }, [subtopicKey]);

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

  // Detect multimedia capabilities via central feature flag configuration or direct record flags
  const hasInteractiveDiagram = Boolean(activeDetailRecord?.hasInteractiveDiagram) || isInteractiveEnabled(subtopicKey);
  const hasVideo = Boolean(activeDetailRecord?.hasVideo) || isVideoEnabled(subtopicKey);
  const videoUrl = hasVideo ? (activeDetailRecord?.videoUrl || 'short://history') : null;
  const videoTitle = videoUrl ? (activeDetailRecord?.videoTitle || 'UPSC Ancient History Visual Reel') : null;

  const hasMultimedia = hasInteractiveDiagram || Boolean(videoUrl);

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-3 sm:p-6 select-none">
      
      {/* Smooth Fade-in Backdrop with Deep Glassmorphic Blur */}
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/75 dark:bg-slate-950/85 backdrop-blur-md transition-opacity duration-300 animate-fadeIn"
      />

      {/* Main Responsive Modal Box */}
      <div className="relative bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 w-full max-w-4xl h-full sm:h-auto sm:max-h-[90vh] rounded-2xl sm:rounded-3xl shadow-2xl z-10 overflow-hidden flex flex-col transition-all duration-300 transform animate-dashboardCardPop">
        
        {/* Modal Window Header Nav Bar */}
        <div className="border-b border-slate-100 dark:border-slate-800 px-5 sm:px-6 py-3.5 shrink-0 bg-slate-50/90 dark:bg-slate-900/90 backdrop-blur-md">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[9.5px] uppercase font-black text-indigo-600 dark:text-indigo-400 tracking-wider bg-indigo-50 dark:bg-indigo-950/50 px-2.5 py-0.5 rounded border border-indigo-100/40 dark:border-indigo-900/30 font-mono">
                  UPSC High-Yield Deep Dive
                </span>
                {hasMultimedia && (
                  <span className="text-[9.5px] uppercase font-black text-emerald-600 dark:text-emerald-400 tracking-wider bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded border border-emerald-200/40 dark:border-emerald-900/30 font-mono flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                    Multimedia Active
                  </span>
                )}
              </div>
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

          {/* Segmented Multimedia Navigation Bar */}
          {hasMultimedia && (
            <div className="mt-3 flex items-center gap-1.5 p-1 bg-slate-200/60 dark:bg-slate-800/80 rounded-xl max-w-md">
              <button
                onClick={() => setActiveTab('notes')}
                className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  activeTab === 'notes'
                    ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <span>📖</span>
                <span>Study Notes</span>
              </button>

              {hasInteractiveDiagram && (
                <button
                  onClick={() => setActiveTab('diagram')}
                  className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    activeTab === 'diagram'
                      ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <span>🗺️</span>
                  <span>Interactive Flow</span>
                  <span className="text-[9px] font-black uppercase tracking-tight bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 px-1 py-0.2 rounded">
                    Visual
                  </span>
                </button>
              )}

              {videoUrl && (
                <button
                  onClick={() => setActiveTab('video')}
                  className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    activeTab === 'video'
                      ? 'bg-white dark:bg-slate-900 text-rose-600 dark:text-rose-400 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <span>🎬</span>
                  <span>Shorts Reel</span>
                  <span className="text-[9px] font-black uppercase tracking-tight bg-rose-500 text-white px-1.5 py-0.2 rounded-full">
                    9:16
                  </span>
                </button>
              )}
            </div>
          )}
        </div>

        {/* Dynamic Context Core Scrolling Block */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-7 space-y-4">
          <div className="max-w-3xl mx-auto w-full">

            {/* TAB 1: TRADITIONAL STUDY NOTES */}
            {activeTab === 'notes' && (
              <div className="space-y-4 animate-fadeIn">
                {/* Visual Jump Callout if interactive items exist */}
                {hasMultimedia && (
                  <div className="p-3.5 rounded-2xl bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-950/40 dark:to-blue-950/40 border border-indigo-200/60 dark:border-indigo-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
                    <div className="space-y-0.5">
                      <span className="text-xs font-bold text-indigo-900 dark:text-indigo-200 flex items-center gap-1.5">
                        <span>✨</span>
                        <span>Interactive Visual Learning Available</span>
                      </span>
                      <p className="text-[11px] text-indigo-700/80 dark:text-indigo-300/80">
                        Explore the live Harappan City schematic, hydraulic drainage simulator, and in-app animated video short.
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {hasInteractiveDiagram && (
                        <button
                          onClick={() => setActiveTab('diagram')}
                          className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1 whitespace-nowrap active:scale-95"
                        >
                          <span>🗺️ Open Diagram</span>
                        </button>
                      )}
                      {videoUrl && (
                        <button
                          onClick={() => setActiveTab('video')}
                          className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1 whitespace-nowrap active:scale-95"
                        >
                          <span>🎬 Watch Short</span>
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {activeDetailRecord ? (
                  /* Renders the full details HTML payload safely from JSON databases */
                  <div 
                    dangerouslySetInnerHTML={{ __html: formatContentHtml(activeDetailRecord.paragraphs) }}
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
            )}

            {/* TAB 2: INTERACTIVE FLOW DIAGRAM */}
            {activeTab === 'diagram' && (
              <div className="space-y-4 animate-fadeIn">
                {isHisTopic ? (
                  <InteractiveCityLayoutDiagram subtopicKey={subtopicKey} />
                ) : (
                  <div className="text-center py-12 px-4 space-y-2 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
                    <span className="text-3xl block">📊</span>
                    <h4 className="text-sm font-bold text-slate-800 dark:text-white">Interactive Diagram Coming Soon</h4>
                    <p className="text-xs text-slate-400 max-w-sm mx-auto">
                      Our content team is authoring vector flowcharts and hydraulic simulators for this module.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: NATIVE IN-APP MOTION SHORT */}
            {activeTab === 'video' && (
              <div className="space-y-4 animate-fadeIn">
                <NativeMotionShort subtopicKey={subtopicKey} />

                {/* Examination Key Takeaways Card */}
                <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-900/40 space-y-2">
                  <div className="flex items-center gap-1.5 text-amber-800 dark:text-amber-300 font-black text-xs">
                    <span>💡</span>
                    <span>UPSC Visual Retention Points</span>
                  </div>
                  <ul className="text-xs text-amber-900/90 dark:text-amber-200/90 space-y-1.5 list-disc list-inside">
                    {((getHistoryReel(subtopicKey)?.examTakeaways) || [
                      "Observe key structural patterns and archaeological hallmarks for UPSC Prelims & Mains.",
                      "Pay close attention to unique site exceptions and regional variances.",
                      "Connect material culture with underlying socio-economic transitions."
                    ]).map((point, pIdx) => (
                      <li key={pIdx}>{point}</li>
                    ))}
                  </ul>
                </div>
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