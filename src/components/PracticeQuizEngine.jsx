import React, { useState, useEffect, useRef } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../data/db';

export default function PracticeQuizEngine({ quizTopicId, clearQuizFocus, syllabusData }) {
  // 🧭 Level 0: Main Dashboard Selector States
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [activeSetChunk, setActiveSetChunk] = useState(null);

  // 🧭 Level 1: Core Running Testing States
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [scoreCount, setScoreCount] = useState(0);

  // Core Session Memory States
  const [shuffledQuestions, setShuffledQuestions] = useState([]);
  const [sessionProgress, setSessionProgress] = useState([]);
  const [userSelections, setUserSelections] = useState([]);

  // Synchronization Lock Keys
  const [sessionLockKey, setSessionLockKey] = useState(null);
  const [promptResume, setPromptResume] = useState(false);
  const [cachedSessionData, setCachedSessionData] = useState(null);

  // ⏱️ TIMER SPECIFIC STATE ARRAYS
  const [timeLeft, setTimeLeft] = useState(null);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const timerIntervalRef = useRef(null);

  // Read current system preference configuration flags out of storage rows
  const isTimerConfigEnabled = localStorage.getItem('pocketUPSC_timerEnabled') === 'true';
  const configuredDurationMinutes = parseInt(localStorage.getItem('pocketUPSC_timerDuration') || '20', 10);

  // Detect if the request context is an archive exam simulation
  const isArchiveSimulation = quizTopicId && quizTopicId.startsWith('archive_');

  // STATIC ICON MAP DICTIONARY: Synchronized perfectly with App.jsx mapping rules
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

  // DYNAMIC SUBJECT NORMALIZATION: Safely converts granular prefixes into parent subject labels
  const activeSubjectId = React.useMemo(() => {
    if (quizTopicId) {
      if (isArchiveSimulation) return quizTopicId; 
      const prefix = quizTopicId.toLowerCase();
      if (prefix.startsWith('pol')) return 'polity';
      if (prefix.startsWith('hist') || prefix.startsWith('his')) return 'history';
      if (prefix.startsWith('eco')) return 'economy';
      if (prefix.startsWith('geo')) return 'geography';
      if (prefix.startsWith('env')) return 'environment';
      if (prefix.startsWith('sci')) return 'science';
    }
    return selectedSubject ? selectedSubject.id : null;
  }, [quizTopicId, selectedSubject, isArchiveSimulation]);

  // Dexie Live Query: Streams custom practice pool or targeted exam paper layout dynamically
  const rawSubjectQuestionsPool = useLiveQuery(
    async () => {
      if (!activeSubjectId) return [];
      
      // Fetch from pastPapers table if it's an archive request
      if (isArchiveSimulation) {
        const [_, yearStr, paperStr] = activeSubjectId.split('_');
        return db.pastPapers
          .where({ year: parseInt(yearStr, 10), paper: paperStr.toUpperCase() })
          .toArray();
      }

      // Standard custom quiz bank lookup fallback
      return db.questions.where('subjectId').equals(activeSubjectId).toArray();
    },
    [activeSubjectId, isArchiveSimulation]
  ) || [];

  // Dexie Live Query: Streams global database size to extract exact metrics for selector blocks
  const globalQuestionStats = useLiveQuery(() => db.questions.toArray()) || [];

  // Count available database question profiles ensuring keys match exactly
  const statisticsMap = React.useMemo(() => {
    const stats = {};
    globalQuestionStats.forEach(q => {
      if (q.subjectId) {
        const normalizedKey = q.subjectId.toLowerCase().trim();
        stats[normalizedKey] = (stats[normalizedKey] || 0) + 1;
      }
    });
    return stats;
  }, [globalQuestionStats]);

  // SEQUENTIAL CHUNKER ENGINE: Divides datasets strictly into sequential chunks or displays papers whole
  const computedPracticeSets = React.useMemo(() => {
    if (rawSubjectQuestionsPool.length === 0) return [];
    
    if (isArchiveSimulation) {
      return [rawSubjectQuestionsPool];
    }

    const chunks = [];
    const chunkSize = 100;
    for (let i = 0; i < rawSubjectQuestionsPool.length; i += chunkSize) {
      chunks.push(rawSubjectQuestionsPool.slice(i, i + chunkSize));
    }
    return chunks;
  }, [rawSubjectQuestionsPool, isArchiveSimulation]);

  // Automatically deploy the single session block if it is an archive paper layout request
  useEffect(() => {
    if (isArchiveSimulation && computedPracticeSets.length > 0 && activeSetChunk === null) {
      setActiveSetChunk(0);
    }
  }, [isArchiveSimulation, computedPracticeSets]);

  // Pointer variable locations
  const currentCard = shuffledQuestions[currentIndex] || null;
  const shuffledQuestionsLengthCheck = shuffledQuestions.length > 0;
  const isSessionEnded = currentIndex >= shuffledQuestions.length && shuffledQuestionsLengthCheck;

  // TIMER CLOCK INTERFACES EFFECT LOOP
  useEffect(() => {
    if (isTimerRunning && timeLeft !== null && timeLeft > 0 && !isSessionEnded) {
      timerIntervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timerIntervalRef.current);
            setIsTimerRunning(false);
            setCurrentIndex(shuffledQuestions.length);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [isTimerRunning, timeLeft, isSessionEnded, shuffledQuestions.length]);

  // Inspect saved sessions inside IndexedDB on set click entry
  useEffect(() => {
    async function checkExistingSession() {
      if (!activeSubjectId || activeSetChunk === null || computedPracticeSets.length === 0) return;

      const compositeSessionKey = `${activeSubjectId}_set_${activeSetChunk}`;
      if (compositeSessionKey === sessionLockKey) return; 

      const savedSession = await db.quizSessions.get(compositeSessionKey);

      if (savedSession && savedSession.currentIndex < savedSession.shuffledQuestions.length) {
        setCachedSessionData(savedSession);
        setPromptResume(true);
      } else {
        executeFreshShuffle();
      }
    }
    checkExistingSession();
  }, [activeSetChunk, activeSubjectId, computedPracticeSets]);

  // Exam Initialization Routine
  const executeFreshShuffle = () => {
    if (computedPracticeSets.length === 0 || activeSetChunk === null) return;
    
    const targetSequentialPool = computedPracticeSets[activeSetChunk];
    if (!targetSequentialPool || targetSequentialPool.length === 0) return;

    let localPoolCopy = [...targetSequentialPool];
    
    if (isArchiveSimulation) {
      localPoolCopy.sort((a, b) => {
        const numA = parseInt(a.question, 10) || 0;
        const numB = parseInt(b.question, 10) || 0;
        return numA - numB;
      });
    } else {
      for (let i = localPoolCopy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [localPoolCopy[i], localPoolCopy[j]] = [localPoolCopy[j], localPoolCopy[i]];
      }
    }

    const compositeSessionKey = `${activeSubjectId}_set_${activeSetChunk}`;

    setShuffledQuestions(localPoolCopy);
    setSessionProgress(new Array(localPoolCopy.length).fill('unattempted'));
    setUserSelections(new Array(localPoolCopy.length).fill(null));
    setSessionLockKey(compositeSessionKey);
    
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScoreCount(0);

    if (isArchiveSimulation) {
      setTimeLeft(120 * 60);
      setIsTimerRunning(true);
    } else if (isTimerConfigEnabled) {
      setTimeLeft(configuredDurationMinutes * 60);
      setIsTimerRunning(true);
    } else {
      setTimeLeft(null);
      setIsTimerRunning(false);
    }

    saveSessionProgressToDb(compositeSessionKey, 0, 0, localPoolCopy, new Array(localPoolCopy.length).fill('unattempted'), new Array(localPoolCopy.length).fill(null));
  };

  const saveSessionProgressToDb = async (sessionKey, index, score, questions, progress, selections) => {
    await db.quizSessions.put({
      topicId: sessionKey,
      currentIndex: index,
      scoreCount: score,
      shuffledQuestions: questions,
      sessionProgress: progress,
      userSelections: selections,
      updatedAt: Date.now()
    });
  };

  const handleConfirmResume = () => {
    if (!cachedSessionData) return;
    setShuffledQuestions(cachedSessionData.shuffledQuestions);
    setSessionProgress(cachedSessionData.sessionProgress);
    setUserSelections(cachedSessionData.userSelections);
    setCurrentIndex(cachedSessionData.currentIndex);
    setScoreCount(cachedSessionData.scoreCount);
    setSessionLockKey(`${activeSubjectId}_set_${activeSetChunk}`);
    setPromptResume(false);

    const baseDuration = isArchiveSimulation ? 120 : configuredDurationMinutes;
    const cardsRemainingRatio = (cachedSessionData.shuffledQuestions.length - cachedSessionData.currentIndex) / cachedSessionData.shuffledQuestions.length;
    setTimeLeft(Math.round(baseDuration * 60 * cardsRemainingRatio));
    setIsTimerRunning(true);
  };

  const handleConfirmRestart = async () => {
    const compositeSessionKey = `${activeSubjectId}_set_${activeSetChunk}`;
    await db.quizSessions.delete(compositeSessionKey);
    setPromptResume(false);
    executeFreshShuffle();
  };

  // Restore active options selections when traversing grid bubbles backwards
  useEffect(() => {
    if (sessionProgress.length > 0 && currentIndex < shuffledQuestions.length) {
      const savedStatus = sessionProgress[currentIndex];
      if (savedStatus === 'correct' || savedStatus === 'wrong') {
        setSelectedOption(userSelections[currentIndex]);
        setIsAnswered(true);
      } else {
        setSelectedOption(null);
        setIsAnswered(false);
      }
    }
  }, [currentIndex, sessionProgress, shuffledQuestions.length, userSelections]);

  const handleOptionSelection = (optionIdx) => {
    if (isAnswered || !currentCard) return;
    
    setSelectedOption(optionIdx);
    setIsAnswered(true);
    const isCorrect = optionIdx === currentCard.correct;
    
    const nextSelections = [...userSelections];
    nextSelections[currentIndex] = optionIdx;
    setUserSelections(nextSelections);

    const nextProgress = [...sessionProgress];
    nextProgress[currentIndex] = isCorrect ? 'correct' : 'wrong';
    setSessionProgress(nextProgress);

    const nextScore = isCorrect ? scoreCount + 1 : scoreCount;
    if (isCorrect) setScoreCount(nextScore);

    const compositeSessionKey = `${activeSubjectId}_set_${activeSetChunk}`;
    saveSessionProgressToDb(compositeSessionKey, currentIndex, nextScore, shuffledQuestions, nextProgress, nextSelections);
  };

  const handleSkipQuestion = () => {
    if (isAnswered) return;

    const nextProgress = [...sessionProgress];
    nextProgress[currentIndex] = 'skipped';
    setSessionProgress(nextProgress);

    const compositeSessionKey = `${activeSubjectId}_set_${activeSetChunk}`;
    saveSessionProgressToDb(compositeSessionKey, currentIndex + 1, scoreCount, shuffledQuestions, nextProgress, userSelections);
    setCurrentIndex(prev => prev + 1);
  };

  const handleMatrixNavigation = (targetIndex) => {
    const targetStatus = sessionProgress[targetIndex];
    if (targetIndex === currentIndex || targetStatus === 'unattempted' || targetStatus === 'skipped') {
      const compositeSessionKey = `${activeSubjectId}_set_${activeSetChunk}`;
      saveSessionProgressToDb(compositeSessionKey, targetIndex, scoreCount, shuffledQuestions, sessionProgress, userSelections);
      setCurrentIndex(targetIndex);
    }
  };

  const advanceNextCard = () => {
    setSelectedOption(null);
    setIsAnswered(false);
    const nextIndex = currentIndex + 1;
    
    const compositeSessionKey = `${activeSubjectId}_set_${activeSetChunk}`;
    saveSessionProgressToDb(compositeSessionKey, nextIndex, scoreCount, shuffledQuestions, sessionProgress, userSelections);
    setCurrentIndex(nextIndex);
  };

  const restartQuizSession = async () => {
    const compositeSessionKey = `${activeSubjectId}_set_${activeSetChunk}`;
    await db.quizSessions.delete(compositeSessionKey);
    executeFreshShuffle();
  };

  const handleResetEngineDashboard = () => {
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    setIsTimerRunning(false);
    setShuffledQuestions([]);
    setSessionProgress([]);
    setUserSelections([]);
    setActiveSetChunk(null);
    setSessionLockKey(null);
    setPromptResume(false);
    setCachedSessionData(null);
    setSelectedSubject(null);
    if (quizTopicId) {
      clearQuizFocus();
    }
  };

  const renderTimerString = () => {
    if (timeLeft === null) return "";
    const mins = Math.floor(timeLeft / 60);
    const secs = timeLeft % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // ==========================================
  // 🎯 PRIORITY RENDERING NODE 1: EVALUATION SCOREBOARD
  // Moving this to the top prevents the loading safety check from intercepting end-of-quiz status.
  // ==========================================
  if (isSessionEnded) {
    const isTimerEnded = timeLeft === 0 && (isTimerConfigEnabled || isArchiveSimulation);
    const cleanContextLabel = isArchiveSimulation ? "Exam Summary" : `Set ${activeSetChunk + 1}`;
    
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 text-center space-y-4 shadow-md my-auto max-w-md mx-auto w-full rounded-2xl transition-colors">
        <span className="text-4xl block">{isTimerEnded ? '⏰' : '🏆'}</span>
        <div>
          <h3 className="text-base font-black text-slate-800 dark:text-white">
            {isTimerEnded ? 'Time Limit Expired' : isArchiveSimulation ? 'Official Paper Completed' : 'Practice Set Complete'}
          </h3>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 uppercase tracking-wider font-bold">
            {isArchiveSimulation ? "UPSC ARCHIVE" : activeSubjectId.toUpperCase()} • {cleanContextLabel}
          </p>
        </div>
        
        <div className="bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-900 rounded-xl p-4 max-w-xs mx-auto transition-colors">
          <span className="text-3xl font-black text-indigo-600 dark:text-indigo-400">{scoreCount}</span>
          <span className="text-slate-400 dark:text-slate-500 text-xs font-bold"> / {shuffledQuestions.length} Correct</span>
          <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium mt-1">Accuracy Ratio: {Math.round((scoreCount / shuffledQuestions.length) * 100)}%</p>
        </div>

        <div className="flex gap-2 justify-center pt-2">
          <button onClick={restartQuizSession} className="bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-900/40 font-bold text-xs px-4 py-2 rounded-xl transition-all">Re-take Exam</button>
          <button onClick={handleResetEngineDashboard} className="bg-indigo-600 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all shadow-xs hover:bg-indigo-700 dark:hover:bg-indigo-500">Change Topic</button>
        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW LAYER 1: CHOOSE CORE MAIN SUBJECT DASHBOARD CARD
  // ==========================================
  if (!quizTopicId && !selectedSubject && activeSetChunk === null) {
    return (
      <div className="space-y-3 animate-fadeIn flex-1 overflow-y-auto pb-12">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 shadow-3xs text-center space-y-1 rounded-2xl transition-colors">
          <span className="text-3xl block">⚡</span>
          <h3 className="text-sm font-black text-slate-800 dark:text-white">UPSC Practice Vault</h3>
          <p className="text-[11px] text-slate-400 dark:text-slate-500 max-w-xs mx-auto">
            Select an explicit syllabus department to access sequential practice set batches.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-2">
          {syllabusData.map((subject) => {
            const lookupKey = (subject.id || '').toLowerCase().trim();
            const subjectQuestionsTotal = statisticsMap[lookupKey] || 0;
            const subjectVaultIcon = getSubjectIcon(subject.id);

            return (
              <div 
                key={subject.id} 
                onClick={() => setSelectedSubject(subject)}
                className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-all shadow-3xs active:scale-[0.99]"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl bg-slate-50 dark:bg-slate-800 p-2 rounded-lg border border-slate-100 dark:border-slate-700 shadow-5xs select-none">
                    {subjectVaultIcon}
                  </span>
                  <div>
                    <span className="text-xs font-black text-slate-800 dark:text-slate-200 block">
                      {subject.name || "Subject Module"}
                    </span>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-wider">
                      {(subject.id || 'GS').toUpperCase()} QUIZ BANK
                    </span>
                  </div>
                </div>
                <span className="text-[9px] uppercase font-black px-2.5 py-1 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 rounded-md border border-indigo-100/50 dark:border-indigo-900/40 transition-colors">
                  {subjectQuestionsTotal} Qs Loaded
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW LAYER 2: CHOOSE PRACTICE SET CHUNK (100 Q Max slices)
  // ==========================================
  if (activeSubjectId && activeSetChunk === null) {
    const displaySubjectLabel = quizTopicId
      ? (quizTopicId.startsWith('pol') ? 'Indian Polity' : quizTopicId.startsWith('hist') || quizTopicId.startsWith('his') ? 'Indian History' : 'General Practice')
      : (selectedSubject ? selectedSubject.name : activeSubjectId.toUpperCase());

    return (
      <div className="space-y-3 animate-fadeIn flex-1 overflow-y-auto pb-12">
        <div className="flex items-center justify-between bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3 rounded-2xl shrink-0 shadow-3xs transition-colors">
          <button onClick={handleResetEngineDashboard} className="text-xs font-bold text-slate-500 dark:text-slate-400 hover:underline">⬅ Back to Subjects</button>
          <span className="text-[10px] uppercase font-black text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/30 px-2.5 py-0.5 rounded">
            {displaySubjectLabel}
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 text-center space-y-1 rounded-2xl shadow-3xs transition-colors">
          <h4 className="text-xs font-black text-slate-800 dark:text-white">Select Practice Set Batch</h4>
          <p className="text-[10px] text-slate-400 dark:text-slate-500 leading-normal">
            This module contains <strong>{rawSubjectQuestionsPool.length}</strong> loaded entries, dynamically sliced sequentially into sets of 100 max.
          </p>
        </div>

        {rawSubjectQuestionsPool.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-xl border p-6 text-center text-xs font-bold text-slate-400 animate-pulse">
            ⏳ Querying local IndexedDB tables for active code: {activeSubjectId.toUpperCase()}...
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-2.5">
            {computedPracticeSets.map((setArray, setIdx) => (
              <div
                key={setIdx}
                onClick={() => setActiveSetChunk(setIdx)}
                className="bg-gradient-to-r from-white to-slate-50 dark:from-slate-900 dark:to-slate-900/60 border border-slate-200 dark:border-slate-800 p-4 rounded-xl cursor-pointer hover:from-indigo-50/20 hover:border-indigo-200 shadow-3xs flex items-center justify-between active:scale-[0.99] transition-all duration-150"
              >
                <div>
                  <h4 className="text-xs font-black text-slate-800 dark:text-slate-200">Practice Set {setIdx + 1}</h4>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium mt-0.5">
                    Covers question rows: {setIdx * 100 + 1} to {setIdx * 100 + setArray.length}
                  </p>
                </div>
                <span className="text-xs font-black text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 h-7 w-12 rounded-lg flex items-center justify-center border border-indigo-100 dark:border-indigo-900/40">
                  {setArray.length} Q
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // ==========================================
  // INTERCEPTOR DRAWER LAYER: RESUME PROMPT SCREEN
  // ==========================================
  if (promptResume && cachedSessionData) {
    const attemptedCount = cachedSessionData.sessionProgress.filter(p => p !== 'unattempted').length;
    const cleanContextLabel = isArchiveSimulation ? "Official Exam Sheet" : `Practice Set ${activeSetChunk + 1}`;
    
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 text-center space-y-4 shadow-md my-auto animate-fadeIn max-w-xs mx-auto rounded-2xl transition-colors">
        <span className="text-4xl block">⏳</span>
        <div>
          <h3 className="text-sm font-black text-slate-800 dark:text-white">Unfinished Session Found</h3>
          <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1 uppercase tracking-wider font-bold">
            {isArchiveSimulation ? "UPSC ARCHIVE" : activeSubjectId.toUpperCase()} • {cleanContextLabel}
          </p>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
          You have an incomplete attempt saved for this dataset. You previously answered <strong>{attemptedCount} of {cachedSessionData.shuffledQuestions.length}</strong> questions.
        </p>
        <div className="flex flex-col gap-2 pt-2">
          <button onClick={handleConfirmResume} className="w-full bg-indigo-600 text-white font-black text-xs py-2.5 rounded-xl shadow-xs active:scale-98 transition-all">▶ Resume Previous Test</button>
          <button onClick={handleConfirmRestart} className="w-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 font-bold text-xs py-2.5 rounded-xl active:scale-98 transition-all">🔄 Restart Fresh Deck</button>
        </div>
      </div>
    );
  }

  // ==========================================
  // LOADING SAFETY RECOVERY BLOCK
  // Checked after end state verification to avoid freezing on arrays end boundaries.
  // ==========================================
  if (shuffledQuestions.length === 0 || !currentCard) {
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 text-center text-xs font-semibold text-slate-400 dark:text-slate-500 space-y-3 shadow-xs my-auto rounded-2xl">
        <span className="animate-spin block text-lg text-indigo-500">⏳</span>
        <p>Extracting practice blocks and deploying layout vectors...</p>
      </div>
    );
  }

  // ==========================================
  // RENDERING CANVAS: ACTIVE TIMED EXAM CARD VIEW
  // ==========================================
  return (
    <div className="space-y-3 animate-fadeIn w-full flex flex-col pb-12">
      
      {/* Session Progress Header Tracker */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3.5 rounded-2xl shadow-2xs flex items-center justify-between shrink-0 transition-colors">
        <div className="min-w-0 flex-1 pr-2">
          <span className="text-[9px] uppercase font-black text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/30 px-2 py-0.5 rounded-sm">
            {isArchiveSimulation ? "UPSC CSE PRELIMS SIMULATOR" : `Set ${activeSetChunk + 1} • ${activeSubjectId.toUpperCase()}`}
          </span>
          <h4 className="text-xs font-black text-slate-400 dark:text-slate-500 mt-0.5 truncate">
            {isArchiveSimulation ? `Question ${currentCard.question || currentIndex + 1}` : `Progress: ${currentIndex + 1} of ${shuffledQuestions.length}`}
          </h4>
        </div>

        {/* LIVE TIMER CLOCK INJECTOR NODES */}
        <div className="flex items-center gap-1.5 shrink-0">
          {(isTimerConfigEnabled || isArchiveSimulation) && timeLeft !== null && (
            <span className={`text-xs font-black px-2.5 py-1 rounded-lg border flex items-center gap-1 transition-colors duration-300 ${
              timeLeft < 300 
                ? 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/30 dark:text-rose-400 dark:border-rose-900 animate-pulse' 
                : 'bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-900'
            }`}>
              ⏱️ {renderTimerString()}
            </span>
          )}
          <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors" onClick={handleResetEngineDashboard}>✕ Quit</span>
          <span className="text-xs font-black px-2.5 py-1 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400 rounded-lg transition-colors">Score: {scoreCount}</span>
        </div>
      </div>

      {/* Main Question Card Body Viewport */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-5 overflow-y-auto transition-colors">
        <p className="text-xs font-extrabold text-slate-800 dark:text-slate-100 leading-relaxed tracking-wide whitespace-pre-line">
          {currentCard.q}
        </p>

        {/* Option Multiple Choice Buttons List */}
        <div className="space-y-2.5">
          {currentCard.options.map((option, idx) => {
            let borderStyle = 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/40';
            
            if (isAnswered) {
              if (idx === currentCard.correct) {
                borderStyle = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-950 dark:text-emerald-300 font-semibold';
              } else if (selectedOption === idx) {
                borderStyle = 'border-rose-500 bg-rose-50 dark:bg-rose-950/30 text-rose-950 dark:text-rose-300';
              } else {
                borderStyle = 'border-slate-100 dark:border-slate-900 opacity-40 bg-white dark:bg-slate-900 text-slate-400 dark:text-slate-600';
              }
            }

            return (
              <button
                key={idx}
                disabled={isAnswered}
                onClick={() => handleOptionSelection(idx)}
                className={`w-full text-left p-3 border rounded-xl text-xs transition-all flex items-start gap-3 outline-none cursor-pointer ${borderStyle}`}
              >
                <span className={`h-5 w-5 rounded-full border flex items-center justify-center shrink-0 font-bold text-[10px] ${
                  isAnswered && idx === currentCard.correct 
                    ? 'bg-emerald-500 border-emerald-500 text-white' 
                    : 'border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}>
                  {String.fromCharCode(65 + idx)}
                </span>
                <span className="flex-1 pt-0.5 leading-normal">{option}</span>
              </button>
            );
          })}
        </div>

        {/* High-Yield Explanation Alert Block Panel */}
        {isAnswered && (
          <div className="bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100/60 dark:border-indigo-900/40 p-4 rounded-xl space-y-1.5 animate-slideDown transition-colors">
            <h5 className="text-[10px] uppercase font-black tracking-widest text-indigo-700 dark:text-indigo-400 flex items-center gap-1">
              <span>📖</span> Concept Correct Explanation
            </h5>
            
            {/* THE DYNAMIC HTML PARSER INTEGRATION */}
            {typeof currentCard.ex === 'string' ? (
              (() => {
                let cleanHtml = currentCard.ex.trim();
                if (cleanHtml.startsWith('{{') && cleanHtml.endsWith('}}')) {
                  cleanHtml = cleanHtml.replace(/^\{\{\s*|\s*\}\}$/g, '');
                }
                
                return (
                  <div 
                    className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed font-medium"
                    dangerouslySetInnerHTML={{ __html: cleanHtml }}
                  />
                );
              })()
            ) : (
              <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                {currentCard.ex}
              </p>
            )}
          </div>
        )}
      </div>

      {/* PROGRESS MATRIX DOT TRACKER PANEL */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-3xs space-y-2 shrink-0 transition-colors">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-1.5 mb-1">
          <span className="text-[9px] uppercase font-black text-slate-400 dark:text-slate-500 tracking-wider">
            Quiz Tracker Grid
          </span>
          <div className="flex items-center gap-2 text-[8px] font-bold text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-0.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500 block"></span> Correct
            </span>
            <span className="flex items-center gap-0.5">
              <span className="h-2 w-2 rounded-full bg-rose-500 block"></span> Wrong
            </span>
            <span className="flex items-center gap-0.5">
              <span className="h-2 w-2 rounded-full bg-slate-400 block"></span> Skipped
            </span>
          </div>
        </div>

        {/* Dynamic Bubble Row Matrix */}
        <div className="flex flex-wrap gap-1.5 max-h-[100px] overflow-y-auto pt-0.5">
          {sessionProgress.map((status, index) => {
            let colorClass = 'bg-white dark:bg-slate-900 text-slate-400 border-slate-200 dark:border-slate-800 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800';
            
            if (status === 'correct') colorClass = 'bg-emerald-500 text-white border-emerald-500 cursor-not-allowed opacity-80';
            if (status === 'wrong') colorClass = 'bg-rose-500 text-white border-rose-500 cursor-not-allowed opacity-80';
            if (status === 'skipped') colorClass = 'bg-slate-400 text-white border-slate-400 cursor-pointer hover:bg-slate-500';
            
            const isCurrent = index === currentIndex;

            return (
              <div
                key={index}
                onClick={() => handleMatrixNavigation(index)}
                className={`h-5 w-5 rounded-md border text-[9px] font-black flex items-center justify-center transition-all duration-150 transform ${colorClass} ${
                  isCurrent ? 'ring-2 ring-indigo-600 dark:ring-indigo-400 ring-offset-1 dark:ring-offset-slate-900 scale-105 shadow-2xs font-black z-10' : ''
                }`}
              >
                {isArchiveSimulation ? (shuffledQuestions[index]?.question || index + 1) : index + 1}
              </div>
            );
          })}
        </div>
      </div>

      {/* Action Control Button Footer Panel */}
      <div className="shrink-0 mt-1">
        {!isAnswered ? (
          <button
            onClick={handleSkipQuestion}
            className="w-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold text-xs py-3 rounded-xl border border-slate-200 dark:border-slate-700 active:scale-98 tracking-wide transition-all cursor-pointer"
          >
            Skip Question ➔
          </button>
        ) : (
          <button
            onClick={advanceNextCard}
            className="w-full bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-black text-xs py-3 rounded-xl shadow-md transition-all active:scale-98 tracking-wide cursor-pointer"
          >
            {currentIndex === shuffledQuestions.length - 1 ? 'Finalize Practice Block ➔' : 'Next Question ➔'}
          </button>
        )}
      </div>

    </div>
  );
}