import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from './data/db';
import syllabusData from './data/syllabus.json';
import learningContent from './data/learningContent';
import PastPaperDeck from './components/PastPaperDeck';

// Native Mobile Shell Bridge (Capacitor)
import { App as CapApp } from '@capacitor/app';

// Authentication & Version Control
import { useAuth } from './context/AuthContext';
import AuthModal from './components/AuthModal';
import UpdateModal from './components/UpdateModal';

// Loading Screen
import AppLoader from './components/AppLoader';

// Sub-components
import SyllabusTracker from './components/SyllabusTracker';
import ClassicSheet from './components/ClassicSheet';
import ReelMode from './components/ReelMode';
import PracticeQuizEngine from './components/PracticeQuizEngine';
import SettingsDesk from './components/SettingsDesk';
import DashboardHub from './components/DashboardHub';
import MainsHub from './components/MainsHub';

export default function App() {
  const { user, isGuest, loading: authLoading } = useAuth();

  // ⏳ App Hydration & Initial Loading State
  const [isAppReady, setIsAppReady] = useState(false);
  const [initProgress, setInitProgress] = useState(15);
  const [initStatusText, setInitStatusText] = useState('Checking credentials...');

  useEffect(() => {
    let intervalId;

    // Smoothly simulate progressive hydration while IndexedDB & Auth load
    intervalId = setInterval(() => {
      setInitProgress((prev) => {
        if (prev < 40) {
          setInitStatusText('Verifying user credentials...');
          return prev + 12;
        } else if (prev < 80) {
          setInitStatusText('Syncing syllabus & question vault...');
          return prev + 8;
        } else if (prev < 95) {
          setInitStatusText('Finalizing workspace...');
          return prev + 3;
        }
        return prev;
      });
    }, 180);

    return () => clearInterval(intervalId);
  }, []);

  // When auth finishes loading and Dexie is hydrated, transition to 100% and show app
  useEffect(() => {
    if (!authLoading) {
      setInitProgress(100);
      setInitStatusText('Ready!');
      const timer = setTimeout(() => {
        setIsAppReady(true);
      }, 350); // brief pause so user sees 100% completion

      return () => clearTimeout(timer);
    }
  }, [authLoading]);

  // 🎯 THEME HYDRATION & TOGGLE
  const [themeMode, setThemeMode] = useState(() => localStorage.getItem('pocketUPSC_themeMode') || 'light');
  useEffect(() => {
    const savedTheme = localStorage.getItem('pocketUPSC_themeMode') || 'light';
    setThemeMode(savedTheme);
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    const next = themeMode === 'dark' ? 'light' : 'dark';
    setThemeMode(next);
    localStorage.setItem('pocketUPSC_themeMode', next);
    if (next === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // 🧭 Navigation & View States
  const [activeTab, setActiveTab] = useState('dashboard');
  const [expandedSubject, setExpandedSubject] = useState(null);
  const [selectedTopicId, setSelectedTopicId] = useState(null);
  const [readingMode, setReadingMode] = useState('sheet');
  const [quizTopicId, setQuizTopicId] = useState(null);
  const [selectedPastPaperMeta, setSelectedPastPaperMeta] = useState(null);
  const [learnActiveSubject, setLearnActiveSubject] = useState(null);

  // 📱 Mobile Double-Tap Back State
  const [showExitToast, setShowExitToast] = useState(false);
  const lastBackPressTime = useRef(0);
  const toastTimerRef = useRef(null);

  // Keep a mutable ref of current view states so the popstate handler always reads current values
  const navStateRef = useRef({
    activeTab,
    selectedTopicId,
    quizTopicId,
    selectedPastPaperMeta
  });

  useEffect(() => {
    navStateRef.current = {
      activeTab,
      selectedTopicId,
      quizTopicId,
      selectedPastPaperMeta
    };
  }, [activeTab, selectedTopicId, quizTopicId, selectedPastPaperMeta]);

  // ---------------------------------------------------------------------------
  // 📱 HARDWARE / GESTURE BACK BUTTON INTERCEPTOR (Web + Native Capacitor)
  // ---------------------------------------------------------------------------
  useEffect(() => {
    // Prime the history stack with an initial dummy state so popstate triggers
    window.history.replaceState({ appStage: 'root' }, '');
    window.history.pushState({ appStage: 'active' }, '');

    const handlePopState = (event) => {
      const { 
        activeTab: currentTab, 
        selectedTopicId: currentTopic, 
        quizTopicId: currentQuiz, 
        selectedPastPaperMeta: currentPaper 
      } = navStateRef.current;

      // 1. Deep Sub-view Check: If reading a topic, step back to subject list
      if (currentTopic) {
        window.history.pushState({ appStage: 'active' }, '');
        setSelectedTopicId(null);
        setReadingMode('sheet');
        return;
      }

      // 2. Sub-view Check: If inside past paper exam/quiz, step back to deck
      if (currentPaper || currentQuiz) {
        window.history.pushState({ appStage: 'active' }, '');
        setSelectedPastPaperMeta(null);
        setQuizTopicId(null);
        return;
      }

      // 3. Tab Check: If in another tab (Tracker, Mains, Quiz, Learn, Settings), go to Dashboard
      if (currentTab !== 'dashboard') {
        window.history.pushState({ appStage: 'active' }, '');
        setActiveTab('dashboard');
        return;
      }

      // 4. Root View (Dashboard): Double-back press handler
      const now = Date.now();
      if (now - lastBackPressTime.current < 2000) {
        // Double-click verified: Exit Native App or close session
        try {
          CapApp.exitApp();
        } catch {
          window.history.back();
        }
      } else {
        // First click: Prevent exit and alert user
        window.history.pushState({ appStage: 'active' }, '');
        lastBackPressTime.current = now;

        setShowExitToast(true);
        if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
        toastTimerRef.current = setTimeout(() => {
          setShowExitToast(false);
        }, 2000);
      }
    };

    // Standard Browser / Web View History Listener
    window.addEventListener('popstate', handlePopState);

    // Capacitor Native Android Hardware Back Button Listener
    let capListenerHandle = null;
    try {
      CapApp.addListener('backButton', () => {
        window.dispatchEvent(new PopStateEvent('popstate'));
      }).then((handle) => {
        capListenerHandle = handle;
      });
    } catch {
      // Safely ignore when running in a standard web browser during development
    }

    return () => {
      window.removeEventListener('popstate', handlePopState);
      if (capListenerHandle) {
        capListenerHandle.remove();
      }
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    };
  }, []);

  // 📝 User Notes State Machine
  const [newNoteText, setNewNoteText] = useState('');
  const [activeNoteInputId, setActiveNoteInputId] = useState(null);
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [editingNoteText, setEditingNoteText] = useState('');

  // 🔄 Dexie Live Synchronizers
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

  // 🌟 Render AppLoader during initial boot / auth resolution
  if (!isAppReady) {
    return <AppLoader progress={initProgress} statusText={initStatusText} />;
  }

  const tabMetadata = {
    dashboard: { title: 'Central Secretariat Hub', subtitle: 'Civil Services Performance & Command Matrix', icon: '🏛️' },
    tracker: { title: 'Syllabus Tracker', subtitle: 'UPSC General Studies Benchmark & Progress Matrix', icon: '📋' },
    learn: { title: 'Learning Repository', subtitle: 'High-Yield Micro-Study Modules, Snippets & Custom Notes', icon: '📖' },
    mains: { title: 'Mains GS Answer Desk', subtitle: 'Descriptive Examination Questions & Structured Model Answers', icon: '✍️' },
    quiz: { title: 'Practice Quiz Vault', subtitle: 'Timed MCQ Test Engine & Prelims Simulator', icon: '⚡' },
    past_papers: { title: 'Official UPSC Archives', subtitle: 'Previous Year Question Papers Registry', icon: '📜' },
    settings: { title: 'Control & Configuration', subtitle: 'Officer Profile, Timers & Database Diagnostic Desk', icon: '⚙️' }
  };

  const navItems = [
    { id: 'dashboard', label: 'Hub', fullLabel: 'Secretariat Hub', icon: '🏛️' },
    { id: 'tracker', label: 'Tracker', fullLabel: 'Syllabus Tracker', icon: '📋', badge: `${progressMetrics.globalPercentage}%` },
    { id: 'learn', label: 'Learn', fullLabel: 'Learn Repository', icon: '📖' },
    { id: 'mains', label: 'Mains', fullLabel: 'Mains GS Desk', icon: '✍️' },
    { id: 'quiz', label: 'Quiz', fullLabel: 'Practice Vault', icon: '⚡' },
    { id: 'past_papers', label: 'PYQs', fullLabel: 'Prelims PYQs', icon: '📜' },
    { id: 'settings', label: 'Settings', fullLabel: 'Settings & Data', icon: '⚙️' }
  ];

  return (
    <div className="flex h-screen w-screen bg-slate-50 text-slate-800 dark:bg-slate-950 dark:text-slate-100 font-sans antialiased overflow-hidden select-none transition-colors duration-200 relative">
      
      {/* 🚀 Daily Version Checker */}
      <UpdateModal />

      {/* 🛡️ Optional Auth Modal */}
      {!user && !isGuest && <AuthModal />}

      {/* 📱 Mobile Double-Tap Back Confirmation Toast */}
      {showExitToast && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 bg-slate-950/90 text-amber-200 border border-amber-500/40 px-4 py-2 rounded-full shadow-2xl backdrop-blur-md text-xs font-semibold flex items-center gap-2 animate-bounce">
          <span>⚠️</span>
          <span>Press back again to exit</span>
        </div>
      )}

      {/* 🖥️ DESKTOP / TABLET SIDEBAR NAVIGATION (md:flex) */}
      <aside className="hidden md:flex flex-col w-64 lg:w-72 shrink-0 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 z-30 transition-colors duration-200 shadow-sm">
        
        {/* Brand Header */}
        <div className="p-4 lg:p-5 border-b border-slate-100 dark:border-slate-800/80">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <img src="/icon-only.png" alt="Pocket UPSC" className="w-9 h-9 rounded-xl shadow-sm shrink-0" />
              <div>
                <h1 className="text-base font-black text-slate-900 dark:text-white tracking-tight leading-none flex items-center">
                  pocket<span className="text-indigo-600 dark:text-indigo-400">UPSC</span>
                </h1>
                <span className="text-[8.5px] uppercase font-mono font-bold text-amber-600 dark:text-amber-400 tracking-wider block mt-1">
                  CIVIL SERVICES ACCELERATOR
                </span>
              </div>
            </div>
            <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/40">
              v1.2
            </span>
          </div>

          {/* Officer Status Chip */}
          <div className="mt-4 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60 flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              {user?.photoURL ? (
                <img src={user.photoURL} alt="Profile" className="w-8 h-8 rounded-full border border-amber-400/60 shrink-0" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-700 text-white flex items-center justify-center text-xs font-bold shrink-0 shadow-xs">
                  🏛️
                </div>
              )}
              <div className="min-w-0">
                <p className="text-xs font-black text-slate-800 dark:text-slate-100 truncate">
                  {user?.displayName ? user.displayName.split(' ')[0] : 'Cadet Officer'}
                </p>
                <span className="text-[9.5px] text-slate-400 dark:text-slate-400 font-medium block">
                  {user ? 'Verified Officer' : 'Trainee Guest'}
                </span>
              </div>
            </div>
            <button
              onClick={() => setActiveTab('settings')}
              className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold hover:underline shrink-0"
            >
              Desk ➔
            </button>
          </div>
        </div>

        {/* Navigation List */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          <p className="text-[10px] uppercase font-black tracking-wider text-slate-400 dark:text-slate-500 px-3 py-1.5">
            Core Workstation
          </p>

          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  if (item.id !== 'learn') setSelectedTopicId(null);
                  if (item.id !== 'quiz') setQuizTopicId(null);
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all duration-150 cursor-pointer ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/25'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`text-base ${isActive ? 'scale-110' : ''} transition-transform`}>
                    {item.icon}
                  </span>
                  <span>{item.fullLabel}</span>
                </div>

                {item.badge && (
                  <span
                    className={`text-[9.5px] font-black px-2 py-0.5 rounded-full ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border border-indigo-100/60 dark:border-indigo-900/40'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer Controls */}
        <div className="p-3 border-t border-slate-100 dark:border-slate-800/80 space-y-2">
          {/* Theme Quick Switcher */}
          <button
            onClick={toggleTheme}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/40 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <span>{themeMode === 'dark' ? '🌙' : '☀️'}</span>
              <span>{themeMode === 'dark' ? 'Dark Mode' : 'Light Mode'}</span>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">Toggle</span>
          </button>

          {/* Offline Database Status Indicator */}
          <div className="px-3 py-1.5 flex items-center justify-between text-[10px] text-slate-400 dark:text-slate-500 font-mono">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              IndexedDB Local
            </span>
            <span>Offline Ready</span>
          </div>
        </div>

      </aside>

      {/* 📱💻 MAIN CONTENT VIEWPORT */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        
        {/* GLOBAL RESPONSIVE HEADER */}
        <header className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 lg:px-8 py-3 shrink-0 shadow-xs z-20 transition-colors duration-200">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            
            {/* Left: Mobile Brand / Desktop Breadcrumb */}
            <div className="min-w-0">
              <div className="md:hidden flex items-center gap-2">
                <img src="/icon-only.png" alt="Pocket UPSC" className="w-7 h-7 rounded-lg shrink-0" />
                <div>
                  <h1 className="text-sm font-black text-slate-900 dark:text-white tracking-tight flex items-center leading-none">
                    pocket<span className="text-indigo-600 dark:text-indigo-400">UPSC</span>
                  </h1>
                  <span className="text-[8px] uppercase tracking-wider text-slate-400 font-semibold">
                    {tabMetadata[activeTab]?.title || 'Civil Services Engine'}
                  </span>
                </div>
              </div>

              {/* Desktop Breadcrumb Heading */}
              <div className="hidden md:block">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 dark:text-slate-500">
                  <span>🏛️ UPSC Station</span>
                  <span>/</span>
                  <span className="text-indigo-600 dark:text-indigo-400 font-bold">{tabMetadata[activeTab]?.title}</span>
                </div>
                <h2 className="text-sm lg:text-base font-black text-slate-900 dark:text-white tracking-tight mt-0.5 truncate">
                  {tabMetadata[activeTab]?.subtitle}
                </h2>
              </div>
            </div>

            {/* Right: Global Mastery Meter & Controls */}
            <div className="flex items-center gap-3 shrink-0">
              {/* Desktop Global Progress Bar */}
              <div className="hidden sm:flex items-center gap-3 px-3.5 py-1.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/80 dark:border-slate-700/60">
                <div className="text-right">
                  <span className="text-[9.5px] uppercase font-black text-slate-400 dark:text-slate-500 block leading-tight">
                    Syllabus Mastery
                  </span>
                  <span className="text-xs font-black text-indigo-600 dark:text-indigo-400">
                    {progressMetrics.completedTopics} / {progressMetrics.totalTopics} Topics
                  </span>
                </div>
                <div className="w-24 lg:w-32 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${progressMetrics.globalPercentage}%` }}
                    className="h-full bg-gradient-to-r from-amber-400 via-indigo-500 to-emerald-400 rounded-full transition-all duration-500"
                  />
                </div>
                <span className="text-xs font-black px-2 py-0.5 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 rounded-full border border-indigo-200/50 dark:border-indigo-800/40">
                  {progressMetrics.globalPercentage}%
                </span>
              </div>

              {/* Mobile Global Percentage Pill */}
              <span className="sm:hidden text-xs font-black px-2.5 py-1 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 rounded-full border border-indigo-100/60 dark:border-indigo-900/40">
                {progressMetrics.globalPercentage}%
              </span>

              {/* Mobile Quick Theme Switcher */}
              <button
                onClick={toggleTheme}
                className="md:hidden h-8 w-8 flex items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-sm"
                aria-label="Toggle theme"
              >
                {themeMode === 'dark' ? '🌙' : '☀️'}
              </button>
            </div>

          </div>
        </header>

        {/* RESPONSIVE VIEWPORT STAGE */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full flex flex-col pb-24 md:pb-8">
          
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

          {activeTab === 'past_papers' && (
            <PastPaperDeck 
              onBack={() => setActiveTab('dashboard')} 
              onLaunchExam={(year, paper) => {
                setSelectedPastPaperMeta({ year, paper });
                setQuizTopicId(`archive_${year}_${paper.toLowerCase()}`);
                setActiveTab('quiz');
              }}
            />
          )}

          {activeTab === 'mains' && (
            <MainsHub onBack={() => setActiveTab('dashboard')} />
          )}

          {activeTab === 'learn' && (
            <div className="flex flex-col flex-1 min-h-0">
              
              {/* DESKTOP SPLIT VIEW (md:flex) */}
              <div className="hidden md:grid md:grid-cols-12 md:gap-6 flex-1 min-h-0">
                
                {/* Left Drawer: Subject & Topic Navigator */}
                <div className="md:col-span-5 lg:col-span-4 h-full overflow-y-auto space-y-3 pr-2">
                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-3xs">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">📖</span>
                      <div>
                        <h3 className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-wider">
                          Syllabus Modules
                        </h3>
                        <p className="text-[10px] text-slate-400 dark:text-slate-500">
                          Click any topic to read in the study desk.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {syllabusData.map((subject) => {
                      const isSubjectExpanded = learnActiveSubject === subject.id;
                      const subjectTopicsList = subject.topics || subject.chapters || [];
                      const displaySubjectName = subject.name || subject.subject || subject.title || "Core Module";
                      const activeSubjectIcon = getSubjectIcon(subject.id);

                      return (
                        <div key={subject.id} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-3xs overflow-hidden transition-all duration-200">
                          <div 
                            onClick={() => setLearnActiveSubject(isSubjectExpanded ? null : subject.id)}
                            className="flex items-center justify-between p-3 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors select-none group"
                          >
                            <div className="flex items-center gap-2.5">
                              <span className="text-sm bg-slate-50 dark:bg-slate-800 p-1.5 rounded-md border border-slate-100 dark:border-slate-700/60 shadow-4xs select-none">
                                {activeSubjectIcon}
                              </span>
                              <span className="text-xs font-black text-slate-800 dark:text-slate-200">{displaySubjectName}</span>
                            </div>
                            <span className={`text-[10px] text-slate-400 transition-transform duration-200 ${isSubjectExpanded ? 'rotate-180 text-indigo-600 dark:text-indigo-400' : ''}`}>
                              ▼
                            </span>
                          </div>

                          {isSubjectExpanded && (
                            <div className="bg-slate-50/50 dark:bg-slate-950/40 border-t border-slate-100 dark:border-slate-800 p-2 space-y-1 animate-slideDown">
                              {subjectTopicsList.map((topic) => {
                                const displayTopicName = topic.name || topic.title || "Untitled Module";
                                const isSelected = selectedTopicId === topic.id;
                                return (
                                  <div 
                                    key={topic.id}
                                    onClick={() => setSelectedTopicId(topic.id)}
                                    className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-all ${
                                      isSelected
                                        ? 'bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-300 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 font-bold'
                                        : 'bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 text-slate-700 dark:text-slate-300 hover:border-indigo-200 dark:hover:border-indigo-900'
                                    }`}
                                  >
                                    <span className="text-xs truncate">{displayTopicName}</span>
                                    <span className="text-[9px] font-black uppercase text-indigo-600 dark:text-indigo-400">
                                      {isSelected ? 'Reading' : 'Read ➔'}
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

                  {savedSnippetsList.length > 0 && (
                    <div className="space-y-2 pt-2">
                      <h4 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider pl-1">
                        📌 Revision Desk ({savedSnippetsList.length})
                      </h4>
                      {savedSnippetsList.map(s => (
                        <div key={s.id} className="bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 p-3 relative text-xs rounded-xl dark:text-amber-200 leading-relaxed font-medium">
                          <button onClick={() => db.savedSnippets.delete(s.id)} className="absolute top-2.5 right-2.5 text-amber-500 hover:text-amber-700 dark:text-amber-400 font-black cursor-pointer">✕</button>
                          <span dangerouslySetInnerHTML={{ __html: s.text }} className="pr-5 block" />
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Right Workspace: Active Reader */}
                <div className="md:col-span-7 lg:col-span-8 h-full overflow-y-auto pl-1">
                  {selectedTopicId ? (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3 rounded-2xl shrink-0 shadow-2xs gap-2 transition-colors">
                        <button onClick={() => { setSelectedTopicId(null); setReadingMode('sheet'); }} className="text-xs font-bold text-slate-500 dark:text-slate-400 hover:underline">
                          ✕ Close Reader
                        </button>
                        <button 
                          onClick={() => launchTopicQuizAction(selectedTopicId)}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs px-3.5 py-1.5 rounded-xl shadow-xs transition-all active:scale-95 cursor-pointer flex items-center gap-1.5"
                        >
                          <span>⚡</span> Practice Questions ➔
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
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl text-center space-y-4 shadow-3xs">
                      <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800/60 flex items-center justify-center text-3xl">
                        📖
                      </div>
                      <div className="max-w-md space-y-1.5">
                        <h3 className="text-base font-black text-slate-800 dark:text-white">
                          Select a Topic to Open the Study Desk
                        </h3>
                        <p className="text-xs text-slate-400 dark:text-slate-500 leading-relaxed">
                          Pick any topic from the syllabus tree on the left to review key concepts, timeline phases, highlights, and custom personal notes.
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2 justify-center pt-2">
                        <button
                          onClick={() => { setLearnActiveSubject('polity'); setSelectedTopicId('pol_preamble'); }}
                          className="px-3 py-1.5 text-xs font-bold rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 hover:text-indigo-600 transition-colors cursor-pointer"
                        >
                          🏛️ Polity: Preamble
                        </button>
                        <button
                          onClick={() => { setLearnActiveSubject('history'); setSelectedTopicId('his_modern'); }}
                          className="px-3 py-1.5 text-xs font-bold rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 hover:text-indigo-600 transition-colors cursor-pointer"
                        >
                          📜 Modern History
                        </button>
                        <button
                          onClick={() => { setLearnActiveSubject('economy'); setSelectedTopicId('eco_macro'); }}
                          className="px-3 py-1.5 text-xs font-bold rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 hover:text-indigo-600 transition-colors cursor-pointer"
                        >
                          📈 Macroeconomics
                        </button>
                      </div>
                    </div>
                  )}
                </div>

              </div>

              {/* MOBILE SINGLE VIEW (md:hidden) */}
              <div className="md:hidden flex flex-col flex-1 min-h-0">
                {!selectedTopicId ? (
                  <div className="space-y-4 overflow-y-auto flex-1 pb-12 animate-fadeIn">
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 text-center space-y-1 shadow-3xs transition-colors">
                      <span className="text-3xl block">📖</span>
                      <h3 className="text-sm font-black text-slate-800 dark:text-white">Learning Repository</h3>
                      <p className="text-[11px] text-slate-400 dark:text-slate-500 max-w-xs mx-auto leading-normal">
                        Select a core course subject branch to open its micro-reading syllabus notes cards.
                      </p>
                    </div>

                    <div className="space-y-2">
                      {syllabusData.map((subject) => {
                        const isSubjectExpanded = learnActiveSubject === subject.id;
                        const subjectTopicsList = subject.topics || subject.chapters || [];
                        const displaySubjectName = subject.name || subject.subject || subject.title || "Core Pillar Module";
                        const activeSubjectIcon = getSubjectIcon(subject.id);

                        return (
                          <div key={subject.id} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-3xs overflow-hidden transition-all duration-200">
                            <div 
                              onClick={() => setLearnActiveSubject(isSubjectExpanded ? null : subject.id)}
                              className="flex items-center justify-between p-3.5 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors select-none group"
                            >
                              <div className="flex items-center gap-2.5">
                                <span className="text-base bg-slate-50 dark:bg-slate-800 p-1.5 rounded-md border border-slate-100 dark:border-slate-700/60 shadow-4xs select-none">
                                  {activeSubjectIcon}
                                </span>
                                <span className="text-xs font-black text-slate-800 dark:text-slate-200">{displaySubjectName}</span>
                              </div>

                              <button 
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setLearnActiveSubject(isSubjectExpanded ? null : subject.id);
                                }}
                                className="p-1.5 text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                                aria-label="Toggle section"
                              >
                                <span className={`inline-block text-[10px] transition-transform duration-200 ${isSubjectExpanded ? 'rotate-180 text-indigo-600 dark:text-indigo-400 font-bold' : ''}`}>
                                  ▼
                                </span>
                              </button>
                            </div>

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

      </div>

      {/* 📱 MOBILE BOTTOM NAVIGATION BAR (md:hidden) */}
      <footer className="md:hidden bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800 p-2 shrink-0 fixed bottom-0 left-0 right-0 z-50 shadow-xl transition-colors duration-200">
        <nav className="max-w-md mx-auto grid grid-cols-6 gap-1">
          <button 
            onClick={() => setActiveTab('dashboard')} 
            className={`flex flex-col items-center justify-center py-1.5 rounded-xl transition-all cursor-pointer ${
              activeTab === 'dashboard' ? 'text-indigo-600 dark:text-indigo-400 font-extrabold bg-indigo-50/80 dark:bg-indigo-950/40' : 'text-slate-400 dark:text-slate-500'
            }`}
          >
            <span className="text-lg">🏛️</span>
            <span className="text-[9px] mt-0.5 capitalize">Hub</span>
          </button>

          <button 
            onClick={() => setActiveTab('tracker')} 
            className={`flex flex-col items-center justify-center py-1.5 rounded-xl transition-all cursor-pointer ${
              activeTab === 'tracker' ? 'text-indigo-600 dark:text-indigo-400 font-extrabold bg-indigo-50/80 dark:bg-indigo-950/40' : 'text-slate-400 dark:text-slate-500'
            }`}
          >
            <span className="text-lg">📋</span>
            <span className="text-[9px] mt-0.5 capitalize">Tracker</span>
          </button>

          <button 
            onClick={() => setActiveTab('learn')} 
            className={`flex flex-col items-center justify-center py-1.5 rounded-xl transition-all cursor-pointer ${
              activeTab === 'learn' ? 'text-indigo-600 dark:text-indigo-400 font-extrabold bg-indigo-50/80 dark:bg-indigo-950/40' : 'text-slate-400 dark:text-slate-500'
            }`}
          >
            <span className="text-lg">📖</span>
            <span className="text-[9px] mt-0.5 capitalize">Learn</span>
          </button>

          <button 
            onClick={() => setActiveTab('mains')} 
            className={`flex flex-col items-center justify-center py-1.5 rounded-xl transition-all cursor-pointer ${
              activeTab === 'mains' ? 'text-indigo-600 dark:text-indigo-400 font-extrabold bg-indigo-50/80 dark:bg-indigo-950/40' : 'text-slate-400 dark:text-slate-500'
            }`}
          >
            <span className="text-lg">✍️</span>
            <span className="text-[9px] mt-0.5 capitalize">Mains</span>
          </button>

          <button 
            onClick={() => setActiveTab('quiz')} 
            className={`flex flex-col items-center justify-center py-1.5 rounded-xl transition-all cursor-pointer ${
              activeTab === 'quiz' ? 'text-indigo-600 dark:text-indigo-400 font-extrabold bg-indigo-50/80 dark:bg-indigo-950/40' : 'text-slate-400 dark:text-slate-500'
            }`}
          >
            <span className="text-lg">⚡</span>
            <span className="text-[9px] mt-0.5 capitalize">Quiz</span>
          </button>

          <button 
            onClick={() => setActiveTab('settings')} 
            className={`flex flex-col items-center justify-center py-1.5 rounded-xl transition-all cursor-pointer ${
              activeTab === 'settings' ? 'text-indigo-600 dark:text-indigo-400 font-extrabold bg-indigo-50/80 dark:bg-indigo-950/40' : 'text-slate-400 dark:text-slate-500'
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