import React, { useState, useEffect } from 'react';
import { db } from '../data/db';

export default function PastPaperDeck({ onLaunchExam, onBack }) {
  const [papersAvailable, setPapersAvailable] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPaperMeta() {
      try {
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
    <div className="space-y-6 overflow-y-auto pb-12 pr-0.5 flex-1 animate-fadeIn select-none">
      
      {/* Navigation Header */}
      <div className="flex items-center gap-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-3xs transition-colors">
        <button 
          onClick={onBack}
          className="text-xs font-bold text-slate-500 dark:text-slate-400 hover:underline shrink-0 cursor-pointer flex items-center gap-1.5"
        >
          <span>⬅</span> Back to Hub
        </button>
        <div className="h-4 w-px bg-slate-200 dark:bg-slate-700 shrink-0" />
        <h3 className="text-xs sm:text-sm font-black text-slate-800 dark:text-slate-200 uppercase tracking-tight">
          Official Civil Services Prelims Archives
        </h3>
      </div>

      {/* Main Container */}
      <div className="space-y-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-7 space-y-1.5 shadow-3xs transition-colors">
          <span className="text-4xl block">📜</span>
          <h3 className="text-base sm:text-lg font-black text-slate-800 dark:text-white">Civil Services Prelims Registry</h3>
          <p className="text-xs text-slate-400 dark:text-slate-500 max-w-xl leading-relaxed">
            Select an official CSE examination bundle below to run an unedited, timed exam session matching real Union Public Service Commission test parameters.
          </p>
        </div>

        {loading ? (
          <div className="p-12 text-center text-xs font-bold text-slate-400 animate-pulse bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
            ⏳ Extracting archival matrix sets from local vault...
          </div>
        ) : papersAvailable.length === 0 ? (
          <div className="text-center p-12 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl text-xs font-bold text-slate-400 bg-white dark:bg-slate-900">
            📭 No archival files detected. Make sure your local database is seeded in Settings.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {papersAvailable.map((item) => (
              <div 
                key={`${item.year}_${item.paper}`}
                onClick={() => onLaunchExam(item.year, item.paper)}
                className="flex flex-col justify-between p-5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl cursor-pointer hover:border-indigo-400 dark:hover:border-indigo-700 shadow-3xs transition-all active:scale-[0.99] group hover:shadow-md"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-lg bg-indigo-50 dark:bg-indigo-950/50 px-3 py-1 rounded-xl border border-indigo-200/50 dark:border-indigo-900/40 font-black text-indigo-600 dark:text-indigo-400 font-mono tracking-tight shadow-xs">
                      {item.year}
                    </span>
                    <span className="text-[10px] font-black uppercase text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2.5 py-0.5 rounded-full border border-amber-200/40 dark:border-amber-800/30">
                      UPSC Official
                    </span>
                  </div>

                  <div>
                    <h4 className="text-sm font-black text-slate-800 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      Prelims General Studies {item.paper}
                    </h4>
                    <p className="text-xs text-slate-400 dark:text-slate-500 font-medium mt-1">
                      Verification count: <strong>{item.count} questions</strong> compiled
                    </p>
                  </div>
                </div>

                <div className="pt-4 mt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 group-hover:underline">
                    Launch Full Simulation
                  </span>
                  <span className="text-[10px] uppercase font-black px-2.5 py-1 bg-slate-50 dark:bg-slate-800 group-hover:bg-indigo-600 group-hover:text-white text-slate-600 dark:text-slate-300 rounded-lg tracking-wide border border-slate-200 dark:border-slate-700 transition-all shadow-4xs group-hover:translate-x-1">
                    Simulate ➔
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}