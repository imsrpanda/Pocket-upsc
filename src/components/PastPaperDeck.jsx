import React, { useState, useEffect } from 'react';
import { db } from '../data/db';

export default function PastPaperDeck({ onLaunchExam, onBack }) {
  const [papersAvailable, setPapersAvailable] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPaperMeta() {
      try {
        // Fetch unique combinations of Year and Paper types from IndexedDB
        const allRecords = await db.pastPapers.toArray();
        const uniques = {};
        
        allRecords.forEach(r => {
          const key = `${r.year}_${r.paper}`;
          if (!uniques[key]) {
            uniques[key] = { year: r.year, paper: r.paper, count: 0 };
          }
          uniques[key].count++;
        });
        
        setPapersAvailable(Object.values(uniques).sort((a, b) => b.year - a.year));
      } catch (err) {
        console.error("Failed loading paper index:", err);
      } finally {
        setLoading(false);
      }
    }
    loadPaperMeta();
  }, []);

  return (
    <div className="space-y-5 overflow-y-auto pb-12 pr-0.5 flex-1 animate-fadeIn select-none">
      
      {/* Navigation Header */}
      <div className="flex items-center gap-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3.5 rounded-2xl shadow-3xs transition-colors">
        <button 
          onClick={onBack}
          className="text-xs font-bold text-slate-500 dark:text-slate-400 hover:underline shrink-0"
        >
          ⬅ Back to Hub
        </button>
        <div className="h-4 w-px bg-slate-200 dark:bg-slate-700 shrink-0" />
        <h3 className="text-xs font-black text-slate-800 dark:text-slate-200 uppercase tracking-tight">
          Official UPSC Archives
        </h3>
      </div>

      {/* Main Container */}
      <div className="space-y-3">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-1 shadow-3xs transition-colors">
          <span className="text-3xl block">📜</span>
          <h3 className="text-sm font-black text-slate-800 dark:text-white">Civil Services Prelims Registry</h3>
          <p className="text-[11px] text-slate-400 dark:text-slate-500 max-w-xs leading-normal">
            Select an official CSE Civil Services examination bundle below to run an unedited, timed exam session matching real Commission parameters.
          </p>
        </div>

        {loading ? (
          <div className="p-6 text-center text-xs font-bold text-slate-400 animate-pulse">
            ⏳ Extracting archival matrix sets...
          </div>
        ) : papersAvailable.length === 0 ? (
          <div className="text-center p-8 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-400">
            📭 No archival files detected. Make sure your data table is seeded.
          </div>
        ) : (
          <div className="space-y-2">
            {papersAvailable.map((item) => (
              <div 
                key={`${item.year}_${item.paper}`}
                onClick={() => onLaunchExam(item.year, item.paper)}
                className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl cursor-pointer hover:border-indigo-400 dark:hover:border-indigo-900 shadow-3xs transition-all active:scale-[0.99] group"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <span className="text-base bg-indigo-50 dark:bg-indigo-950/40 p-2 rounded-lg border border-indigo-100/30 dark:border-indigo-900/30 font-black text-indigo-600 dark:text-indigo-400 tracking-tighter">
                    {item.year}
                  </span>
                  <div>
                    <h4 className="text-xs font-black text-slate-800 dark:text-slate-200">
                      UPSC Prelims {item.paper}
                    </h4>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium mt-0.5">
                      📊 Verification count: {item.count} questions compiled
                    </p>
                  </div>
                </div>
                <span className="text-[9px] uppercase font-black px-2 py-1 bg-slate-50 dark:bg-slate-800 group-hover:bg-indigo-600 group-hover:text-white text-slate-600 dark:text-slate-300 rounded-md tracking-wide border border-slate-100 dark:border-slate-700/60 transition-all shadow-4xs">
                  Simulate ➔
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}