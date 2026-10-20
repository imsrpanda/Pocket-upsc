import React, { useState } from 'react';
import { formatContentHtml } from '../utils/formatContent';

export default function QuizReviewDesk({
  shuffledQuestions,
  sessionProgress,
  userSelections,
  activeSubjectId,
  cleanContextLabel,
  isArchiveSimulation,
  totalCount,
  correctCount,
  wrongCount,
  skippedCount,
  netMarks,
  maxMarks,
  onCloseReview,
  onRetakeMistakes,
  onRestartSession
}) {
  const [reviewFilter, setReviewFilter] = useState('all'); // 'all', 'wrong', 'correct', 'skipped'

  const filteredReviewQuestions = shuffledQuestions.map((q, idx) => ({
    question: q,
    originalIndex: idx,
    status: sessionProgress[idx] || 'unattempted',
    userSelection: userSelections[idx]
  })).filter(item => {
    if (reviewFilter === 'wrong') return item.status === 'wrong';
    if (reviewFilter === 'correct') return item.status === 'correct';
    if (reviewFilter === 'skipped') return item.status === 'skipped' || item.status === 'unattempted';
    return true;
  });

  return (
    <div className="space-y-4 animate-fadeIn max-w-4xl mx-auto w-full flex flex-col pb-16 select-none">
      {/* Top Sticky Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-2xs flex flex-wrap items-center justify-between gap-3 shrink-0 transition-colors">
        <div className="flex items-center gap-2.5">
          <button
            onClick={onCloseReview}
            className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <span>⬅</span> Back to Scorecard
          </button>
          <div className="h-4 w-px bg-slate-200 dark:bg-slate-700" />
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-400 block font-mono">
              {isArchiveSimulation ? "UPSC OFFICIAL ARCHIVE" : activeSubjectId?.toUpperCase()} • {cleanContextLabel}
            </span>
            <h3 className="text-xs sm:text-sm font-black text-slate-800 dark:text-slate-100">
              Detailed Solutions & Explanations
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-black text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-lg border border-emerald-200/50 dark:border-emerald-800/40">
            Net: {netMarks}/{maxMarks} M
          </span>
        </div>
      </div>

      {/* Filter Pills Toolbar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 select-none">
        <button
          onClick={() => setReviewFilter('all')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap border ${
            reviewFilter === 'all'
              ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-slate-300'
          }`}
        >
          All Questions ({totalCount})
        </button>
        <button
          onClick={() => setReviewFilter('wrong')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap border ${
            reviewFilter === 'wrong'
              ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
              : 'bg-white dark:bg-slate-900 text-rose-600 dark:text-rose-400 border-slate-200 dark:border-slate-800 hover:border-rose-300'
          }`}
        >
          ❌ Mistakes ({wrongCount})
        </button>
        <button
          onClick={() => setReviewFilter('correct')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap border ${
            reviewFilter === 'correct'
              ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
              : 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 border-slate-200 dark:border-slate-800 hover:border-emerald-300'
          }`}
        >
          ✅ Correct ({correctCount})
        </button>
        <button
          onClick={() => setReviewFilter('skipped')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap border ${
            reviewFilter === 'skipped'
              ? 'bg-slate-700 text-white border-slate-700 shadow-xs'
              : 'bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:border-slate-300'
          }`}
        >
          ⚪ Skipped ({skippedCount})
        </button>
      </div>

      {/* Quick Jump Navigator Bubble Strip */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-3.5 shadow-3xs space-y-2">
        <span className="text-[9.5px] uppercase font-black text-slate-400 dark:text-slate-500 tracking-wider block">
          Quick Jump Matrix ({filteredReviewQuestions.length} shown)
        </span>
        <div className="flex flex-wrap gap-1.5 max-h-[85px] overflow-y-auto pt-0.5">
          {filteredReviewQuestions.map(({ originalIndex, status }) => {
            let colorClass = 'bg-slate-100 dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700';
            if (status === 'correct') colorClass = 'bg-emerald-500 text-white border-emerald-500';
            if (status === 'wrong') colorClass = 'bg-rose-500 text-white border-rose-500';
            if (status === 'skipped') colorClass = 'bg-slate-400 text-white border-slate-400';

            return (
              <button
                key={originalIndex}
                onClick={() => {
                  const el = document.getElementById(`review-card-${originalIndex}`);
                  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }}
                className={`h-6 w-6 rounded-md border text-[10px] font-black flex items-center justify-center transition-all cursor-pointer hover:scale-110 active:scale-95 shadow-3xs ${colorClass}`}
                title={`Question ${originalIndex + 1} (${status})`}
              >
                {isArchiveSimulation ? (shuffledQuestions[originalIndex]?.question || originalIndex + 1) : originalIndex + 1}
              </button>
            );
          })}
        </div>
      </div>

      {/* Filtered Question Cards */}
      {filteredReviewQuestions.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-10 text-center space-y-2 shadow-sm">
          <span className="text-3xl block">🎉</span>
          <h4 className="text-sm font-black text-slate-800 dark:text-white">No questions in this filter</h4>
          <p className="text-xs text-slate-400 dark:text-slate-500">
            Select another filter from the toolbar above to inspect your questions.
          </p>
        </div>
      ) : (
        filteredReviewQuestions.map(({ question: item, originalIndex, status, userSelection }) => {
          const displayQNum = isArchiveSimulation ? (item.question || originalIndex + 1) : originalIndex + 1;
          const isCorrect = status === 'correct';
          const isWrong = status === 'wrong';
          const isSkipped = status === 'skipped' || status === 'unattempted';

          let cleanHtml = '';
          if (typeof item.ex === 'string') {
            cleanHtml = item.ex.trim();
            if (cleanHtml.startsWith('{{') && cleanHtml.endsWith('}}')) {
              cleanHtml = cleanHtml.replace(/^\{\{\s*|\s*\}\}$/g, '');
            }
          }

          return (
            <div
              key={originalIndex}
              id={`review-card-${originalIndex}`}
              className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-5 sm:p-7 shadow-xs space-y-4 transition-colors"
            >
              {/* Question Card Header */}
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <span className="text-xs font-black uppercase text-indigo-600 dark:text-indigo-400 font-mono tracking-wider">
                  Question #{displayQNum}
                </span>

                {/* Status Pill with marks indicator */}
                {isCorrect && (
                  <span className="text-[10.5px] font-black uppercase px-2.5 py-0.5 rounded-full border border-emerald-500/40 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <span>✅ Correct</span>
                    <span className="font-mono">(+2.00)</span>
                  </span>
                )}
                {isWrong && (
                  <span className="text-[10.5px] font-black uppercase px-2.5 py-0.5 rounded-full border border-rose-500/40 bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 flex items-center gap-1">
                    <span>❌ Incorrect</span>
                    <span className="font-mono">(-0.66)</span>
                  </span>
                )}
                {isSkipped && (
                  <span className="text-[10.5px] font-black uppercase px-2.5 py-0.5 rounded-full border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 flex items-center gap-1">
                    <span>⚪ Skipped</span>
                    <span className="font-mono">(0.00)</span>
                  </span>
                )}
              </div>

              {/* Question Prompt */}
              <p className="text-xs sm:text-sm md:text-base font-extrabold text-slate-800 dark:text-slate-100 leading-relaxed whitespace-pre-line">
                {item.q}
              </p>

              {/* Options List */}
              <div className="space-y-2.5 pt-1">
                {item.options.map((opt, optIdx) => {
                  const isOptionCorrect = optIdx === item.correct;
                  const isOptionUserSelected = userSelection === optIdx;

                  let optClass = 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/60 text-slate-700 dark:text-slate-300';
                  let badge = null;

                  if (isOptionCorrect) {
                    optClass = 'border-emerald-500 bg-emerald-50/90 dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-200 font-bold ring-1 ring-emerald-500/50';
                    badge = (
                      <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500 text-white shrink-0 ml-auto">
                        ✓ Correct UPSC Answer
                      </span>
                    );
                  } else if (isOptionUserSelected) {
                    optClass = 'border-rose-500 bg-rose-50/90 dark:bg-rose-950/40 text-rose-950 dark:text-rose-200 font-bold ring-1 ring-rose-500/50';
                    badge = (
                      <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-rose-500 text-white shrink-0 ml-auto">
                        ✗ Your Selection
                      </span>
                    );
                  }

                  return (
                    <div
                      key={optIdx}
                      className={`w-full text-left p-3 sm:p-3.5 border rounded-xl text-xs sm:text-sm flex items-start gap-3 transition-colors ${optClass}`}
                    >
                      <span className={`h-5 w-5 rounded-full border text-[10px] font-black flex items-center justify-center shrink-0 mt-0.5 ${
                        isOptionCorrect
                          ? 'bg-emerald-500 border-emerald-500 text-white'
                          : isOptionUserSelected
                          ? 'bg-rose-500 border-rose-500 text-white'
                          : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                      }`}>
                        {String.fromCharCode(65 + optIdx)}
                      </span>
                      <span className="flex-1 leading-normal">{opt}</span>
                      {badge}
                    </div>
                  );
                })}
              </div>

              {/* Detailed Explanation Drawer */}
              <div className="bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100/70 dark:border-indigo-900/40 p-4 rounded-2xl space-y-1.5 mt-2 transition-colors">
                <h5 className="text-[10px] uppercase font-black tracking-widest text-indigo-700 dark:text-indigo-400 flex items-center gap-1.5">
                  <span>📖</span> Official UPSC Concept & Explanation:
                </h5>
                {cleanHtml ? (
                  <div
                    className="text-[11.5px] text-slate-700 dark:text-slate-300 leading-relaxed font-medium space-y-1.5"
                    dangerouslySetInnerHTML={{ __html: formatContentHtml(cleanHtml) }}
                  />
                ) : (
                  <p 
                    className="text-[11.5px] text-slate-700 dark:text-slate-300 leading-relaxed font-medium"
                    dangerouslySetInnerHTML={{ __html: formatContentHtml(item.ex) }}
                  />
                )}
              </div>
            </div>
          );
        })
      )}

      {/* Sticky Bottom Actions */}
      <div className="sticky bottom-4 z-20 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200 dark:border-slate-800 p-3 sm:p-4 rounded-2xl shadow-xl flex flex-col sm:flex-row gap-2.5 items-center justify-between">
        <button
          onClick={onCloseReview}
          className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 cursor-pointer transition-colors"
        >
          ⬅ Return to Scorecard
        </button>

        <div className="flex gap-2 w-full sm:w-auto">
          {wrongCount > 0 && (
            <button
              onClick={onRetakeMistakes}
              className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs cursor-pointer shadow-xs active:scale-95 transition-all flex items-center justify-center gap-1.5"
            >
              <span>🎯</span> Re-test Mistakes ({wrongCount})
            </button>
          )}
          <button
            onClick={onRestartSession}
            className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs cursor-pointer shadow-xs active:scale-95 transition-all"
          >
            🔄 Re-take Full Set
          </button>
        </div>
      </div>
    </div>
  );
}
