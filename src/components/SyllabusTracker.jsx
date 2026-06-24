import React from 'react';

export default function SyllabusTracker({ 
  syllabusData, 
  progressMetrics, 
  expandedSubject, 
  setExpandedSubject, 
  progressMap, 
  toggleTopicProgress, 
  handleStudyNavigation 
}) {
  return (
    <section className="space-y-5 animate-fadeIn select-none">
      
      {/* Macro Statistics Card */}
      <div className="bg-gradient-to-br from-indigo-900 to-slate-900 rounded-2xl p-5 text-white shadow-md relative overflow-hidden">
        <div className="absolute top-0 right-0 transform translate-x-4 -translate-y-2 opacity-10 text-9xl font-black">📈</div>
        <p className="text-[10px] uppercase tracking-wider font-extrabold text-indigo-200">Civil Services General Studies</p>
        <h2 className="text-xl font-black mt-0.5">Core Benchmark Metrics</h2>
        
        <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-indigo-800/50">
          <div>
            <span className="text-2xl font-black">{progressMetrics.completedTopics}</span>
            <span className="text-indigo-200 text-xs font-semibold"> / {progressMetrics.totalTopics} Topics Done</span>
          </div>
          <div className="text-right">
            <span className="text-2xl font-black text-emerald-400">{progressMetrics.globalPercentage}%</span>
            <p className="text-[10px] text-indigo-200 font-medium mt-0.5">Global Mastery Rate</p>
          </div>
        </div>
      </div>

      {/* Main Syllabus Core Tree List Wrapper */}
      <div className="space-y-2.5">
        {syllabusData.map((subject) => {
          const isExpanded = expandedSubject === subject.id;
          const metric = progressMetrics.subjectBreakdown[subject.id] || { total: 0, completed: 0, percentage: 0 };
          const innerTopicsList = subject.topics || subject.chapters || [];

          const displaySubjectName = subject.name || subject.subject || subject.title || "Core Pillar Module";

          // CIRCULAR PROGRESS CONTROLS: Radius & Circumference configurations
          const radius = 14;
          const circumference = 2 * Math.PI * radius;
          const strokeDashoffset = circumference - (metric.percentage / 100) * circumference;

          // Background tint block mapping layer (Swaps cleanly based on dark mode context)
          const isDarkSystemState = document.documentElement.classList.contains('dark');
          
          const progressCardBackgroundStyle = {
            background: isExpanded 
              ? '' // Defers completely to utility color classes when expanded
              : isDarkSystemState
                ? `linear-gradient(to right, #1e1b4b 0%, #312e81 ${metric.percentage}%, #0f172a ${metric.percentage}%, #0f172a 100%)` // Rich Indigo-to-Slate depth variant for dark mode
                : `linear-gradient(to right, #f0f3ff 0%, #e0e7ff ${metric.percentage}%, #ffffff ${metric.percentage}%, #ffffff 100%)`
          };

          return (
            <div 
              key={subject.id} 
              style={progressCardBackgroundStyle} 
              className={`rounded-xl border border-slate-200 dark:border-slate-800/80 shadow-3xs overflow-hidden transition-all duration-300 ${
                isExpanded ? 'bg-white dark:bg-slate-900' : ''
              }`}
            >
              
              {/* INTERACTIVE COMPONENT HEADER TRIGGER BAR */}
              <div 
                onClick={() => setExpandedSubject(isExpanded ? null : subject.id)}
                className="flex items-center justify-between p-4 cursor-pointer hover:bg-indigo-50/20 dark:hover:bg-slate-800/30 transition-colors select-none"
              >
                <div className="flex items-center gap-3.5 min-w-0 flex-1 pr-2">
                  
                  {/* DYNAMIC VECTOR MATH INSIDE SVG CIRCULAR BAR INDICATOR */}
                  <div className="relative h-9 w-9 shrink-0 flex items-center justify-center bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl shadow-4xs">
                    <svg className="w-8 h-8 transform -rotate-90">
                      <circle
                        cx="16"
                        cy="16"
                        r={radius}
                        className="stroke-slate-100 dark:stroke-slate-700/60 fill-none"
                        strokeWidth="3"
                      />
                      <circle
                        cx="16"
                        cy="16"
                        r={radius}
                        className="stroke-indigo-600 dark:stroke-indigo-400 fill-none transition-all duration-500 ease-out"
                        strokeWidth="3"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                      />
                    </svg>
                    <span className="absolute text-[11px] font-black text-indigo-950 dark:text-indigo-200 select-none">
                      {subject.icon || "📜"}
                    </span>
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="text-xs font-black text-slate-800 dark:text-slate-200 leading-tight truncate">
                      {displaySubjectName}
                    </h3>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium mt-0.5">
                      {metric.completed} of {metric.total} modules finalized • <span className="text-indigo-600 dark:text-indigo-400 font-bold">{metric.percentage}%</span>
                    </p>
                  </div>
                </div>

                <span className={`text-[10px] font-bold text-slate-400 dark:text-slate-500 transition-transform duration-200 shrink-0 ${isExpanded ? 'rotate-180 text-indigo-600 dark:text-indigo-400' : 'rotate-0'}`}>
                  ▼
                </span>
              </div>

              {/* NESTED EXPANSION ELEMENT CARDS WRAPPER GRID */}
              {isExpanded && (
                <div className="bg-slate-50/40 dark:bg-slate-950/20 border-t border-slate-100 dark:border-slate-800/80 p-3 space-y-2 animate-slideDown">
                  {innerTopicsList.map((topic) => {
                    const isDone = progressMap.get(topic.id) === 1;
                    
                    // 🎯 THE FIX: Evaluates prefix rules universally to allow eco, geo, env, and sci routes to resolve instantly!
                    const isLoadable = topic.id && (
                      topic.id.startsWith('pol') || 
                      topic.id.startsWith('his') || 
                      topic.id.startsWith('eco') || 
                      topic.id.startsWith('geo') || 
                      topic.id.startsWith('env') || 
                      topic.id.startsWith('sci')
                    );
                    
                    const displayTopicName = topic.name || topic.title || "Untitled Topic";

                    return (
                      <div 
                        key={topic.id} 
                        className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                          isDone 
                            ? 'bg-slate-50/80 dark:bg-slate-900/40 border-slate-200/60 dark:border-slate-800/40 shadow-3xs' 
                            : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-3xs hover:border-slate-300 dark:hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0 flex-1 pr-3">
                          <input 
                            type="checkbox" 
                            checked={isDone}
                            onChange={() => toggleTopicProgress(topic.id)}
                            className="mt-0.5 h-4 w-4 text-indigo-600 dark:text-indigo-400 rounded-sm border-slate-300 dark:border-slate-700 focus:ring-indigo-500 cursor-pointer shrink-0"
                          />
                          <div className="min-w-0">
                            <p className={`text-xs font-bold leading-tight truncate ${isDone ? 'text-slate-400 dark:text-slate-600 line-through' : 'text-slate-700 dark:text-slate-200'}`}>
                              {displayTopicName}
                            </p>
                            <span className="text-[9px] uppercase font-extrabold tracking-wider text-slate-400 dark:text-slate-500 block mt-0.5">
                              Reference Code: {topic.id.toUpperCase()}
                            </span>
                          </div>
                        </div>
                        {isLoadable && (
                          <button 
                            onClick={() => handleStudyNavigation(topic.id)}
                            className="shrink-0 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-indigo-200 dark:hover:border-indigo-900 text-indigo-600 dark:text-indigo-400 font-black text-[10px] px-2.5 py-1.5 rounded-lg shadow-2xs active:bg-indigo-50/50 transition-all flex items-center gap-0.5 cursor-pointer animate-fadeIn"
                          >
                            Study ➔
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

            </div>
          );
        })}
      </div>
    </section>
  );
}