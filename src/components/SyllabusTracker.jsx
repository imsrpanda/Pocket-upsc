import React, { useState, useMemo } from 'react';

export default function SyllabusTracker({ 
  syllabusData, 
  progressMetrics, 
  expandedSubject, 
  setExpandedSubject, 
  progressMap, 
  toggleTopicProgress, 
  handleStudyNavigation 
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMode, setFilterMode] = useState('all'); // 'all', 'pending', 'completed'

  const completedCount = progressMetrics.completedTopics || 0;
  const totalCount = progressMetrics.totalTopics || 0;
  const pendingCount = totalCount - completedCount;
  const globalPct = progressMetrics.globalPercentage || 0;

  // Filtered syllabus tree based on search query and filterMode
  const filteredSyllabus = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();

    return syllabusData.map(subject => {
      const innerTopics = subject.topics || subject.chapters || [];
      const filteredTopics = innerTopics.filter(topic => {
        const isDone = progressMap.get(topic.id) === 1;
        if (filterMode === 'completed' && !isDone) return false;
        if (filterMode === 'pending' && isDone) return false;

        if (!q) return true;
        const topicName = (topic.name || topic.title || '').toLowerCase();
        const topicId = (topic.id || '').toLowerCase();
        const subjectName = (subject.name || subject.subject || subject.title || '').toLowerCase();
        return topicName.includes(q) || topicId.includes(q) || subjectName.includes(q);
      });

      return {
        ...subject,
        matchingTopics: filteredTopics,
        hasMatches: filteredTopics.length > 0
      };
    }).filter(subject => !searchQuery && filterMode === 'all' ? true : subject.hasMatches);
  }, [syllabusData, searchQuery, filterMode, progressMap]);

  return (
    <section className="space-y-5 animate-fadeIn select-none">
      
      {/* Macro Statistics Card - Responsive Executive Dashboard Grid */}
      <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-900 rounded-3xl p-5 sm:p-7 text-white shadow-xl relative overflow-hidden border border-indigo-800/40">
        <div className="absolute top-0 right-0 transform translate-x-6 -translate-y-4 opacity-5 text-9xl font-black pointer-events-none">📈</div>
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-indigo-800/50">
          <div>
            <span className="text-[9.5px] uppercase tracking-wider font-extrabold text-indigo-300 block">
              Civil Services General Studies Matrix
            </span>
            <h2 className="text-xl sm:text-2xl font-black mt-0.5 tracking-tight">
              Curriculum Core Benchmarks
            </h2>
          </div>
          <span className="text-xs font-bold px-3 py-1 bg-indigo-500/20 text-indigo-200 border border-indigo-500/30 rounded-full w-fit">
            GS Preliminary & Mains Syllabus
          </span>
        </div>
        
        {/* Metric Counters Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-3.5 backdrop-blur-xs">
            <span className="text-[10px] text-indigo-300 font-semibold uppercase block">Total Modules</span>
            <span className="text-2xl sm:text-3xl font-black mt-0.5 block">{totalCount}</span>
            <span className="text-[10px] text-slate-400">All 6 Core Pillars</span>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-3.5 backdrop-blur-xs">
            <span className="text-[10px] text-emerald-300 font-semibold uppercase block">Completed</span>
            <span className="text-2xl sm:text-3xl font-black text-emerald-400 mt-0.5 block">{completedCount}</span>
            <span className="text-[10px] text-slate-400">Verified Mastered</span>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-3.5 backdrop-blur-xs">
            <span className="text-[10px] text-amber-300 font-semibold uppercase block">Remaining</span>
            <span className="text-2xl sm:text-3xl font-black text-amber-400 mt-0.5 block">{pendingCount}</span>
            <span className="text-[10px] text-slate-400">Modules in Pipeline</span>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-3.5 backdrop-blur-xs">
            <span className="text-[10px] text-indigo-300 font-semibold uppercase block">Global Rate</span>
            <span className="text-2xl sm:text-3xl font-black text-indigo-300 mt-0.5 block">{globalPct}%</span>
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mt-1.5">
              <div 
                style={{ width: `${globalPct}%` }}
                className="h-full bg-gradient-to-r from-amber-400 to-emerald-400 rounded-full"
              />
            </div>
          </div>
        </div>
      </div>

      {/* SEARCH & FILTER CONTROLS TOOLBAR */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-3 sm:p-4 rounded-2xl shadow-3xs space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          
          {/* Live Search Input */}
          <div className="relative flex-1">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm">🔍</span>
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search topic name or syllabus code (e.g. Parliament, Inflation, Climate)..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-xl text-xs font-semibold text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-black text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                ✕
              </button>
            )}
          </div>

          {/* Filter Mode Pills */}
          <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
            <button
              onClick={() => setFilterMode('all')}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                filterMode === 'all'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              All Topics
            </button>
            <button
              onClick={() => setFilterMode('pending')}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                filterMode === 'pending'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              Pending
            </button>
            <button
              onClick={() => setFilterMode('completed')}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                filterMode === 'completed'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              Mastered
            </button>
          </div>

        </div>

        {searchQuery && (
          <p className="text-[11px] text-slate-400 font-medium pl-1">
            Showing results matching "<span className="text-indigo-600 dark:text-indigo-400 font-bold">{searchQuery}</span>" across modules.
          </p>
        )}
      </div>

      {/* Main Syllabus Core Tree - Responsive 1 Column on Mobile, 2 Columns on Desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredSyllabus.map((subject) => {
          const isExpanded = expandedSubject === subject.id || !!searchQuery;
          const metric = progressMetrics.subjectBreakdown[subject.id] || { total: 0, completed: 0, percentage: 0 };
          const innerTopicsList = subject.matchingTopics || subject.topics || subject.chapters || [];

          const displaySubjectName = subject.name || subject.subject || subject.title || "Core Pillar Module";

          // CIRCULAR PROGRESS CONTROLS
          const radius = 15;
          const circumference = 2 * Math.PI * radius;
          const strokeDashoffset = circumference - (metric.percentage / 100) * circumference;

          return (
            <div 
              key={subject.id} 
              className={`rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-3xs overflow-hidden transition-all duration-300 bg-white dark:bg-slate-900 flex flex-col justify-between ${
                isExpanded ? 'ring-1 ring-indigo-500/30' : 'hover:border-indigo-300 dark:hover:border-indigo-800'
              }`}
            >
              
              {/* COMPONENT HEADER TRIGGER BAR */}
              <div 
                onClick={() => setExpandedSubject(isExpanded && !searchQuery ? null : subject.id)}
                className="flex items-center justify-between p-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors select-none"
              >
                <div className="flex items-center gap-3.5 min-w-0 flex-1 pr-2">
                  
                  {/* SVG CIRCULAR BAR INDICATOR */}
                  <div className="relative h-10 w-10 shrink-0 flex items-center justify-center bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 rounded-xl shadow-4xs">
                    <svg className="w-9 h-9 transform -rotate-90">
                      <circle
                        cx="18"
                        cy="18"
                        r={radius}
                        className="stroke-slate-200 dark:stroke-slate-700/60 fill-none"
                        strokeWidth="3.5"
                      />
                      <circle
                        cx="18"
                        cy="18"
                        r={radius}
                        className="stroke-indigo-600 dark:stroke-indigo-400 fill-none transition-all duration-500 ease-out"
                        strokeWidth="3.5"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                      />
                    </svg>
                    <span className="absolute text-xs font-black text-indigo-950 dark:text-indigo-200 select-none">
                      {subject.icon || "📜"}
                    </span>
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="text-xs sm:text-sm font-black text-slate-800 dark:text-slate-100 leading-tight truncate">
                      {displaySubjectName}
                    </h3>
                    <p className="text-[10.5px] text-slate-400 dark:text-slate-500 font-medium mt-0.5">
                      {metric.completed} of {metric.total} modules done • <span className="text-indigo-600 dark:text-indigo-400 font-bold">{metric.percentage}%</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[9.5px] font-black uppercase px-2 py-0.5 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-md border border-indigo-100 dark:border-indigo-900/40">
                    {innerTopicsList.length} Topics
                  </span>
                  <span className={`text-[10px] font-bold text-slate-400 transition-transform duration-200 ${isExpanded ? 'rotate-180 text-indigo-600 dark:text-indigo-400' : 'rotate-0'}`}>
                    ▼
                  </span>
                </div>
              </div>

              {/* NESTED TOPIC CHECKLIST EXPANSION */}
              {isExpanded && (
                <div className="bg-slate-50/60 dark:bg-slate-950/40 border-t border-slate-100 dark:border-slate-800 p-3 space-y-2 animate-slideDown max-h-96 overflow-y-auto">
                  {innerTopicsList.map((topic) => {
                    const isDone = progressMap.get(topic.id) === 1;
                    
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
                            ? 'bg-slate-100/60 dark:bg-slate-900/40 border-slate-200/50 dark:border-slate-800/40' 
                            : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 shadow-3xs hover:border-slate-300 dark:hover:border-slate-700'
                        }`}
                      >
                        <div 
                          className="flex items-center gap-3 min-w-0 flex-1 pr-3 cursor-pointer" 
                          onClick={() => toggleTopicProgress(topic.id)}
                        >
                          <input 
                            type="checkbox" 
                            checked={isDone}
                            onChange={() => toggleTopicProgress(topic.id)}
                            className="h-4 w-4 text-indigo-600 dark:text-indigo-400 rounded border-slate-300 dark:border-slate-700 focus:ring-indigo-500 cursor-pointer shrink-0"
                          />
                          <div className="min-w-0">
                            <p className={`text-xs font-bold leading-tight truncate ${isDone ? 'text-slate-400 dark:text-slate-600 line-through' : 'text-slate-800 dark:text-slate-200'}`}>
                              {displayTopicName}
                            </p>
                            <span className="text-[9px] uppercase font-extrabold tracking-wider text-slate-400 dark:text-slate-500 block mt-0.5 font-mono">
                              {topic.id.toUpperCase()}
                            </span>
                          </div>
                        </div>

                        {isLoadable && (
                          <button 
                            onClick={() => handleStudyNavigation(topic.id)}
                            className="shrink-0 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-700 text-indigo-600 dark:text-indigo-400 font-black text-[10px] px-3 py-1.5 rounded-lg shadow-2xs hover:bg-indigo-50 dark:hover:bg-indigo-950/40 transition-all flex items-center gap-1 cursor-pointer"
                          >
                            <span>Study</span>
                            <span>➔</span>
                          </button>
                        )}
                      </div>
                    );
                  })}

                  {innerTopicsList.length === 0 && (
                    <div className="text-center py-6 text-xs text-slate-400 font-medium">
                      No topics match the current filter.
                    </div>
                  )}
                </div>
              )}

            </div>
          );
        })}
      </div>

      {filteredSyllabus.length === 0 && (
        <div className="p-12 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-2">
          <span className="text-3xl block">🔍</span>
          <h4 className="text-sm font-black text-slate-800 dark:text-white">No Matching Modules</h4>
          <p className="text-xs text-slate-400">Try adjusting your search query or switching filters.</p>
          <button 
            onClick={() => { setSearchQuery(''); setFilterMode('all'); }}
            className="mt-2 text-xs font-bold text-indigo-600 dark:text-indigo-400 underline cursor-pointer"
          >
            Clear Filters
          </button>
        </div>
      )}

    </section>
  );
}