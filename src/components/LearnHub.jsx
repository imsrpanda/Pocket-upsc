import React from 'react';
import ClassicSheet from './ClassicSheet';
import { db } from '../data/db';
import { formatContentHtml } from '../utils/formatContent';

export default function LearnHub({
  syllabusData,
  learningContent,
  selectedTopicId,
  setSelectedTopicId,
  learnActiveSubject,
  setLearnActiveSubject,
  launchTopicQuizAction,
  getSubjectIcon,
  userNotesGrouped,
  savedSnippetsList,
  highlightedSnippetsSet,
  activeNoteInputId,
  setActiveNoteInputId,
  setEditingNoteId,
  newNoteText,
  setNewNoteText,
  handleAddUserNote,
  toggleSnippetHighlight,
  editingNoteId,
  editingNoteText,
  setEditingNoteText,
  handleSaveEditNote
}) {
  return (
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
                  <span dangerouslySetInnerHTML={{ __html: formatContentHtml(s.text) }} className="pr-5 block" />
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
                <button onClick={() => setSelectedTopicId(null)} className="text-xs font-bold text-slate-500 dark:text-slate-400 hover:underline">
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
                selectedTopicId={selectedTopicId} 
                learningContent={learningContent} 
                userNotesGrouped={userNotesGrouped}
                activeNoteInputId={activeNoteInputId} 
                setActiveNoteInputId={setActiveNoteInputId} 
                setEditingNoteId={setEditingNoteId}
                newNoteText={newNoteText} 
                setNewNoteText={setNewNoteText} 
                handleAddUserNote={handleAddUserNote}
                toggleSnippetHighlight={toggleSnippetHighlight} 
                highlightedSnippetsSet={highlightedSnippetsSet}
                editingNoteId={editingNoteId} 
                editingNoteText={editingNoteText} 
                setEditingNoteText={setEditingNoteText}
                handleSaveEditNote={handleSaveEditNote} 
                handleStartEditNote={(n) => { setEditingNoteId(n.id); setEditingNoteText(n.text); }}
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
                        className={`text-xs text-slate-400 p-1 transition-transform duration-200 ${isSubjectExpanded ? 'rotate-180 text-indigo-600 dark:text-indigo-400' : ''}`}
                      >
                        ▼
                      </button>
                    </div>

                    {isSubjectExpanded && (
                      <div className="bg-slate-50/70 dark:bg-slate-950/40 border-t border-slate-100 dark:border-slate-800 p-2 space-y-1.5 animate-slideDown">
                        {subjectTopicsList.map((topic) => {
                          const displayTopicName = topic.name || topic.title || "Untitled Topic";
                          return (
                            <div 
                              key={topic.id}
                              onClick={() => setSelectedTopicId(topic.id)}
                              className="flex items-center justify-between p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-200 active:scale-98 transition-all"
                            >
                              <span className="truncate pr-2">{displayTopicName}</span>
                              <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-black shrink-0">Read ➔</span>
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
                    <span dangerouslySetInnerHTML={{ __html: formatContentHtml(s.text) }} className="pr-5 block" />
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col flex-1 min-h-0 space-y-3">
            <div className="flex items-center justify-between bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3 rounded-2xl shrink-0 shadow-2xs gap-2 transition-colors">
              <button onClick={() => setSelectedTopicId(null)} className="text-xs font-bold text-slate-500 dark:text-slate-400 hover:underline shrink-0">⬅ Exit Deck</button>
              <button 
                onClick={() => launchTopicQuizAction(selectedTopicId)}
                className="bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-900/40 font-black text-[10px] px-3 py-1.5 rounded-xl animate-pulse shrink-0"
              >
                Practice Module ➔
              </button>
            </div>

            <ClassicSheet 
              selectedTopicId={selectedTopicId} 
              learningContent={learningContent} 
              userNotesGrouped={userNotesGrouped}
              activeNoteInputId={activeNoteInputId} 
              setActiveNoteInputId={setActiveNoteInputId} 
              setEditingNoteId={setEditingNoteId}
              newNoteText={newNoteText} 
              setNewNoteText={setNewNoteText} 
              handleAddUserNote={handleAddUserNote}
              toggleSnippetHighlight={toggleSnippetHighlight} 
              highlightedSnippetsSet={highlightedSnippetsSet}
              editingNoteId={editingNoteId} 
              editingNoteText={editingNoteText} 
              setEditingNoteText={setEditingNoteText}
              handleSaveEditNote={handleSaveEditNote} 
              handleStartEditNote={(n) => { setEditingNoteId(n.id); setEditingNoteText(n.text); }}
              handleDeleteUserNote={(id) => db.userNotes.delete(id)}
            />
          </div>
        )}
      </div>

    </div>
  );
}
