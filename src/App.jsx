import React, { useState, useMemo, useEffect } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from './data/db';
import syllabusData from './data/syllabus.json';
import learningContent from './data/learningContent';

// Import segregated layout sub-components
import SyllabusTracker from './components/SyllabusTracker';
import ClassicSheet from './components/ClassicSheet';
import ReelMode from './components/ReelMode';
import PracticeQuizEngine from './components/PracticeQuizEngine';
import SettingsDesk from './components/SettingsDesk';
import DashboardHub from './components/DashboardHub';

export default function App() {
  // 🎯 CORE THEME HYDRATION HOOK: Syncs the class state inline on initial boot pass
  useEffect(() => {
    const savedTheme = localStorage.getItem('pocketUPSC_themeMode') || 'light';
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  // 🧭 Core Routing State — 🎯 MODIFIED: Default changed to 'dashboard' on launch
  const [activeTab, setActiveTab] = useState('dashboard');
  const [expandedSubject, setExpandedSubject] = useState(null);
  const [selectedTopicId, setSelectedTopicId] = useState(null);
  const [readingMode, setReadingMode] = useState('sheet');
  const [quizTopicId, setQuizTopicId] = useState(null);

  // Tracks expanded subjects inside the Learn Desk overview panel
  const [learnActiveSubject, setLearnActiveSubject] = useState(null);

  // 📝 User Notes State Machine
  const [newNoteText, setNewNoteText] = useState('');
  const [activeNoteInputId, setActiveNoteInputId] = useState(null);
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [editingNoteText, setEditingNoteText] = useState('');

  // 🔄 Dexie Live Core Synchronizers
  const progressList = useLiveQuery(() => db.syllabusProgress.toArray()) || [];
  const savedSnippetsList = useLiveQuery(() => db.savedSnippets.toArray()) || [];
  const userNotesList = useLiveQuery(() => db.userNotes.toArray()) || [];

  const progressMap = useMemo(() => new Map(progressList.map(i => [i.id, i.completed])), [progressList]);
  const highlightedSnippetsSet = useMemo(() => new Set(savedSnippetsList.map(i => i.id)), [savedSnippetsList]);
  const userNotesGrouped = useMemo(() => {
    const m = new Map();
    userNotesList.forEach(n => {
      const k = `${n.topicId}_${n.subtopicName}`;
      if (!m.has(k)) m.set(k, []);
      m.get(k).push(n);
    });
    return m;
  }, [userNotesList]);

  // 🎯 STATIC ICON MAP DICTIONARY: Synchronized perfectly across all workspace dashboards
  const getSubjectIcon = (subjectId) => {
    const id = (subjectId || '').toLowerCase().trim();
    if (id.includes('polity')) return '🏛️';
    if (id.includes('economy') || id.includes('economic')) return '📈';
    if (id.includes('geography')) return '🌍';
    if (id.includes('history')) return '📜';
    if (id.includes('environment') || id.includes('env')) return '🌱';
    if (id.includes('science') || id.includes('sci')) return '🔬';
    return '📚';
  };

  // 📈 Calculation Layer
  const progressMetrics = useMemo(() => {
    let totalTopics = 0, completedTopics = 0;
    const breakdown = {};
    syllabusData.forEach(sub => {
      let subCount = 0, subDone = 0;
      const arr = sub.topics || sub.chapters || [];
      arr.forEach(t => {
        totalTopics++; subCount++;
        if (progressMap.get(t.id) === 1) { completedTopics++; subDone++; }
      });
      breakdown[sub.id] = { total: subCount, completed: subDone, percentage: subCount > 0 ? Math.round((subDone / subCount) * 100) : 0 };
    });
    return { totalTopics, completedTopics, globalPercentage: totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0, subjectBreakdown: breakdown };
  }, [progressMap]);

  // ⚡ CRUD Operations & Actions Handlers
  const toggleTopicProgress = async (id) => {
    await db.syllabusProgress.update(id, { completed: progressMap.get(id) === 1 ? 0 : 1 });
  };

  const toggleSnippetHighlight = async (txt, tId) => {
    const sId = `${tId}_${txt.replace(/<[^>]*>/g, '').substring(0, 24).replace(/\s+/g, '_')}`;
    if (highlightedSnippetsSet.has(sId)) await db.savedSnippets.delete(sId);
    else await db.savedSnippets.put({ id: sId, topicId: tId, text: txt, savedAt: Date.now() });
  };

  const handleAddUserNote = async (tId, subName) => {
    if (!newNoteText.trim()) return;
    await db.userNotes.add({ topicId: tId, subtopicName: subName, text: newNoteText.trim(), savedAt: Date.now() });
    setNewNoteText(''); setActiveNoteInputId(null);
  };

  const handleSaveEditNote = async (nId) => {
    if (!editingNoteText.trim()) return;
    await db.userNotes.update(nId, { text: editingNoteText.trim() });
    setEditingNoteId(null); setEditingNoteText('');
  };

  const launchTopicQuizAction = (topicId) => {
    setQuizTopicId(topicId);
    setActiveTab('quiz');
  };

  return (
    <div className="flex flex-col h-screen bg-slate-50 text-slate-800 dark:bg-slate-950 dark:text-slate-100 font-sans antialiased overflow-hidden select-none transition-colors duration-200">
      
      {/* GLOBAL SYSTEM APPLICATION HEADER */}
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 py-3 shrink-0 shadow-xs transition-colors duration-200">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-sm font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-1.5">
              <span>🇮🇳</span> pocket<span className="text-indigo-600 dark:text-indigo-400">UPSC</span>
            </h1>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">Syllabus Sync Engine v1.2</p>
          </div>
          <span className="text-xs font-black px-2.5 py-1 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 rounded-full border border-indigo-100/60 dark:border-indigo-900/40 transition-colors">
            {progressMetrics.globalPercentage}% Mastered
          </span>
        </div>
      </header>

      {/* CORE FRAME LAYOUT VIEWPORT STAGE */}
      <main className="flex-1 overflow-y-auto p-4 max-w-md mx-auto w-full flex flex-col pb-24">
        {activeTab === 'dashboard' && (
          <DashboardHub progressMetrics={progressMetrics} setActiveTab={setActiveTab} />
        )}
        {activeTab === 'tracker' && (
          <SyllabusTracker 
            syllabusData={syllabusData} 
            progressMetrics={progressMetrics} 
            expandedSubject={expandedSubject}
            setExpandedSubject={setExpandedSubject} 
            progressMap={progressMap} 
            toggleTopicProgress={toggleTopicProgress}
            handleStudyNavigation={(id) => { setSelectedTopicId(id); setActiveTab('learn'); }}
          />
        )}

        {activeTab === 'learn' && (
          <div className="flex flex-col flex-1 min-h-0">
            {!selectedTopicId ? (
              <div className="space-y-4 overflow-y-auto flex-1 pb-12 animate-fadeIn">
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 text-center space-y-1 shadow-3xs transition-colors">
                  <span className="text-3xl block">📖</span>
                  <h3 className="text-sm font-black text-slate-800 dark:text-white">Learning Repository</h3>
                  <p className="text-[11px] text-slate-400 dark:text-slate-500 max-w-xs mx-auto leading-normal">
                    Select a core course subject branch to open its micro-reading syllabus notes cards.
                  </p>
                </div>

                {/* Subject Rollout List Container inside Learn desk */}
                <div className="space-y-2">
                  {syllabusData.map((subject) => {
                    const isSubjectExpanded = learnActiveSubject === subject.id;
                    const subjectTopicsList = subject.topics || subject.chapters || [];
                    
                    const displaySubjectName = subject.name || subject.subject || subject.title || "Core Pillar Module";
                    const activeSubjectIcon = getSubjectIcon(subject.id);

                    return (
                      <div key={subject.id} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-3xs overflow-hidden transition-all duration-200">
                        {/* Clickable Header Bar */}
                        <div 
                          onClick={() => learnActiveSubject === subject.id ? setLearnActiveSubject(null) : setLearnActiveSubject(subject.id)}
                          className="flex items-center justify-between p-3.5 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors select-none"
                        >
                          <div className="flex items-center gap-2.5">
                            <span className="text-base bg-slate-50 dark:bg-slate-800 p-1.5 rounded-md border border-slate-100 dark:border-slate-700/60 shadow-4xs select-none">
                              {activeSubjectIcon}
                            </span>
                            <span className="text-xs font-black text-slate-800 dark:text-slate-200">{displaySubjectName}</span>
                          </div>
                          <span className={`text-[10px] text-slate-400 dark:text-slate-500 transition-transform ${isSubjectExpanded ? 'rotate-180 text-indigo-600 dark:text-indigo-400 font-bold' : ''}`}>▼</span>
                        </div>

                        {/* Collapsible Nested Sub-topics Block */}
                        {isSubjectExpanded && (
                          <div className="bg-slate-50/50 dark:bg-slate-950/40 border-t border-slate-100 dark:border-slate-800 p-2 space-y-1.5 animate-slideDown">
                            {subjectTopicsList.map((topic) => {
                              const displayTopicName = topic.name || topic.title || "Untitled Module";
                              
                              return (
                                <div 
                                  key={topic.id}
                                  onClick={() => setSelectedTopicId(topic.id)}
                                  className="flex items-center justify-between p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-lg cursor-pointer hover:border-indigo-300 dark:hover:border-indigo-900 shadow-3xs transition-all active:scale-[0.99]"
                                >
                                  <div className="flex items-center gap-2 min-w-0 flex-1 pr-2">
                                    <span className="text-xs shrink-0 select-none bg-slate-50 dark:bg-slate-800 h-6 w-6 rounded flex items-center justify-center border border-slate-100 dark:border-slate-800 shadow-5xs">
                                      {activeSubjectIcon}
                                    </span>
                                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300 truncate">{displayTopicName}</span>
                                  </div>
                                  <span className="text-[9px] uppercase font-black px-1.5 py-0.5 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 rounded shrink-0 tracking-wide border border-indigo-100/30 dark:border-indigo-900/30">
                                    Read ➔
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Revision Desk Layout Snippets Container */}
                {savedSnippetsList.length > 0 && (
                  <div className="space-y-2 pt-2">
                    <h4 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase pl-1">📌 Revision Desk ({savedSnippetsList.length})</h4>
                    {savedSnippetsList.map(s => (
                      <div key={s.id} className="bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 p-3.5 relative text-xs rounded-xl dark:text-amber-200 leading-relaxed font-medium">
                        <button onClick={() => db.savedSnippets.delete(s.id)} className="absolute top-3 right-3 text-amber-400 dark:text-amber-600 font-black">✕</button>
                        <span dangerouslySetInnerHTML={{ __html: s.text }} className="pr-5 block" />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col flex-1 min-h-0 space-y-3">
                <div className="flex items-center justify-between bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3 rounded-2xl shrink-0 shadow-2xs gap-2 transition-colors">
                  <button onClick={() => { setSelectedTopicId(null); setReadingMode('sheet'); }} className="text-xs font-bold text-slate-500 dark:text-slate-400 hover:underline shrink-0">⬅ Exit Deck</button>
                  
                  <button 
                    onClick={() => launchTopicQuizAction(selectedTopicId)}
                    className="bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-900/40 font-black text-[10px] px-3 py-1.5 rounded-xl animate-pulse shrink-0"
                  >
                    Practice Module ➔
                  </button>
                </div>

                <ClassicSheet 
                  selectedTopicId={selectedTopicId} learningContent={learningContent} userNotesGrouped={userNotesGrouped}
                  activeNoteInputId={activeNoteInputId} setActiveNoteInputId={setActiveNoteInputId} setEditingNoteId={setEditingNoteId}
                  newNoteText={newNoteText} setNewNoteText={setNewNoteText} handleAddUserNote={handleAddUserNote}
                  toggleSnippetHighlight={toggleSnippetHighlight} highlightedSnippetsSet={highlightedSnippetsSet}
                  editingNoteId={editingNoteId} editingNoteText={editingNoteText} setEditingNoteText={setEditingNoteText}
                  handleSaveEditNote={handleSaveEditNote} handleStartEditNote={(n) => { setEditingNoteId(n.id); setEditingNoteText(n.text); }}
                  handleDeleteUserNote={(id) => db.userNotes.delete(id)}
                />
              </div>
            )}
          </div>
        )}

        {activeTab === 'quiz' && (
          <PracticeQuizEngine 
            quizTopicId={quizTopicId} 
            clearQuizFocus={() => setQuizTopicId(null)} 
            syllabusData={syllabusData}
          />
        )}

        {activeTab === 'settings' && (
          <SettingsDesk />
        )}
      </main>

      {/* FIXED GLOBAL NAV RECTANGLE TRAY HEADER BUTTON FOOTER BLOCK */}
      {/* 🎯 MODIFIED: Expanded layout tree grid structure over to grid-cols-5 for the main Hub inclusion */}
      <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 p-2 shrink-0 fixed bottom-0 left-0 right-0 z-50 shadow-lg transition-colors duration-200">
        <nav className="max-w-md mx-auto grid grid-cols-5 gap-1">
          
          {/* 🏛️ 1. CENTRAL HUB TARGET BUTTON */}
          <button 
            onClick={() => setActiveTab('dashboard')} 
            className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all ${
              activeTab === 'dashboard' 
                ? 'text-indigo-600 dark:text-indigo-400 font-extrabold bg-indigo-50/50 dark:bg-indigo-950/30' 
                : 'text-slate-400 dark:text-slate-500'
            }`}
          >
            <span className="text-lg">🏛️</span>
            <span className="text-[9px] mt-0.5 capitalize">Hub</span>
          </button>

          {/* 📋 2. TRACKER TARGET BUTTON */}
          <button 
            onClick={() => setActiveTab('tracker')} 
            className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all ${
              activeTab === 'tracker' 
                ? 'text-indigo-600 dark:text-indigo-400 font-extrabold bg-indigo-50/50 dark:bg-indigo-950/30' 
                : 'text-slate-400 dark:text-slate-500'
            }`}
          >
            <span className="text-lg">📋</span>
            <span className="text-[9px] mt-0.5 capitalize">Tracker</span>
          </button>

          {/* 📖 3. LEARN DESK TARGET BUTTON */}
          <button 
            onClick={() => setActiveTab('learn')} 
            className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all ${
              activeTab === 'learn' 
                ? 'text-indigo-600 dark:text-indigo-400 font-extrabold bg-indigo-50/50 dark:bg-indigo-950/30' 
                : 'text-slate-400 dark:text-slate-500'
            }`}
          >
            <span className="text-lg">📖</span>
            <span className="text-[9px] mt-0.5 capitalize">Learn Desk</span>
          </button>

          {/* ⚡ 4. QUIZ TARGET BUTTON */}
          <button 
            onClick={() => setActiveTab('quiz')} 
            className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all ${
              activeTab === 'quiz' 
                ? 'text-indigo-600 dark:text-indigo-400 font-extrabold bg-indigo-50/50 dark:bg-indigo-950/30' 
                : 'text-slate-400 dark:text-slate-500'
            }`}
          >
            <span className="text-lg">⚡</span>
            <span className="text-[9px] mt-0.5 capitalize">Quiz</span>
          </button>

          {/* ⚙️ 5. SETTINGS TARGET BUTTON */}
          <button 
            onClick={() => setActiveTab('settings')} 
            className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all ${
              activeTab === 'settings' 
                ? 'text-indigo-600 dark:text-indigo-400 font-extrabold bg-indigo-50/50 dark:bg-indigo-950/30' 
                : 'text-slate-400 dark:text-slate-500'
            }`}
          >
            <span className="text-lg">⚙️</span>
            <span className="text-[9px] mt-0.5 capitalize">Settings</span>
          </button>

        </nav>
      </footer>

    </div>
  );
}