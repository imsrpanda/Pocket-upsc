import React, { useState } from 'react';
import DetailModal from './DetailModal';

export default function ClassicSheet({
  selectedTopicId,
  learningContent,
  userNotesGrouped,
  activeNoteInputId,
  setActiveNoteInputId,
  setEditingNoteId,
  newNoteText,
  setNewNoteText,
  handleAddUserNote,
  toggleSnippetHighlight,
  highlightedSnippetsSet,
  editingNoteId,
  editingNoteText,
  setEditingNoteText,
  handleSaveEditNote,
  handleStartEditNote,
  handleDeleteUserNote
}) {
  // State 1: Tracks full-screen "Learn More" detail modal targets
  const [activeDetailsKey, setActiveDetailsKey] = useState(null);

  // STATE 2: Tracks which subtopic card drawers are expanded (stores noteGroupKey strings)
  const [expandedCards, setExpandedCards] = useState(new Set());

  // Method to seamlessly toggle an individual accordion section card open/closed
  const toggleCardCollapse = (cardKey) => {
    setExpandedCards((prevSet) => {
      const nextSet = new Set(prevSet);
      if (nextSet.has(cardKey)) {
        nextSet.delete(cardKey);
      } else {
        nextSet.add(cardKey);
      }
      return nextSet;
    });
  };

  const currentTopicData = learningContent[selectedTopicId];
  if (!currentTopicData) {
    return (
      <div className="p-6 text-center text-xs font-bold text-slate-400 dark:text-slate-500 animate-pulse">
        ⏳ Loading localized reading framework assets...
      </div>
    );
  }

  // SAFETY FALLBACK: Extract topic name safely across all prospective naming configurations
  const displayTopicTitle = currentTopicData.title || currentTopicData.topicName || currentTopicData.name || "Syllabus Module";

  return (
    <div className="space-y-4 overflow-y-auto pb-12 pr-0.5 flex-1 select-none">
      
      {/* Subject Header Card Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-xs transition-colors duration-200">
        <span className="text-[9px] uppercase font-black text-indigo-600 dark:text-indigo-400 tracking-wider bg-indigo-50 dark:bg-indigo-950/30 px-2 py-0.5 rounded-sm border border-indigo-100/30 dark:border-indigo-900/30">
          Premium Study Block
        </span>
        <h2 className="text-base font-black text-slate-900 dark:text-white mt-1.5 leading-tight">
          {displayTopicTitle}
        </h2>
      </div>

      {/* Loop Phase 1: Historical Timeline Layers */}
      {currentTopicData.phases && currentTopicData.phases.map((phase, pIdx) => {
        const displayPhaseName = phase.phaseName || phase.title || phase.name || `Phase ${pIdx + 1}`;
        const subtopicsList = phase.subtopics || phase.chapters || [];

        return (
          <div key={pIdx} className="space-y-3 pt-1">
            <h3 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider pl-1">
              {displayPhaseName}
            </h3>
            
            {/* Loop Phase 2: Core Subtopic Accordion Cards */}
            {subtopicsList.map((sub, sIdx) => {
              const displaySubName = sub.name || sub.title || sub.subtopicName || sub.label || `Subtopic ${sIdx + 1}`;

              const noteGroupKey = `${selectedTopicId}_${displaySubName}`;
              const customNotes = userNotesGrouped.get(noteGroupKey) || [];
              const isInputOpen = activeNoteInputId === noteGroupKey;
              const isExpanded = expandedCards.has(noteGroupKey);
              const bulletPointsList = sub.bullets || sub.points || [];

              return (
                <div 
                  key={sIdx} 
                  className={`bg-white dark:bg-slate-900 rounded-xl border shadow-3xs transition-all duration-200 overflow-hidden transform-gpu animate-swing-card ${
                    isExpanded 
                      ? 'border-slate-300 dark:border-slate-700 ring-1 ring-slate-100/50 dark:ring-slate-800/50' 
                      : 'border-slate-200 dark:border-slate-800/80'
                  }`}
                >
                  
                  {/* CLICKABLE HEADER ACCORDION BAR */}
                  <div 
                    onClick={() => toggleCardCollapse(noteGroupKey)}
                    className="flex items-center justify-between p-4 cursor-pointer select-none gap-4 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-black text-slate-800 dark:text-slate-100 tracking-tight leading-tight">
                        {displaySubName}
                      </h4>
                      {!isExpanded && (
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium mt-0.5 block">
                          📚 {bulletPointsList.length} concepts inside • Tap to expand
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2.5 shrink-0" onClick={(e) => e.stopPropagation()}>
                      {isExpanded && (
                        <button
                          onClick={() => {
                            setActiveNoteInputId(isInputOpen ? null : noteGroupKey);
                            setEditingNoteId(null);
                          }}
                          className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100/30 dark:border-indigo-900/30 px-2 py-0.5 rounded-md hover:bg-indigo-100 dark:hover:bg-indigo-900/60 transition-colors cursor-pointer"
                        >
                          {isInputOpen ? 'Cancel' : '+ Note'}
                        </button>
                      )}
                      
                      <span 
                        className={`text-xs font-bold text-slate-400 dark:text-slate-400 transition-transform duration-200 ${
                          isExpanded ? 'rotate-180 text-indigo-600 dark:text-indigo-400' : 'rotate-0'
                        }`}
                      >
                        ▼
                      </span>
                    </div>
                  </div>

                  {/* COLLAPSIBLE CONTENT DRAWER BLOCK */}
                  {isExpanded && (
                    <div className="px-4 pb-4 border-t border-slate-100 dark:border-slate-800 pt-3 space-y-3.5 animate-fadeIn bg-slate-50/20 dark:bg-slate-950/10">
                      
                      {/* Micro User Note Input Textarea Drawer */}
                      {isInputOpen && (
                        <div className="bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
                          <textarea
                            value={newNoteText}
                            onChange={(e) => setNewNoteText(e.target.value)}
                            placeholder="Write your own custom summary point here..."
                            className="w-full text-xs p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-700 dark:text-slate-200 font-medium"
                            rows={2}
                          />
                          <div className="flex justify-end">
                            <button
                              onClick={() => handleAddUserNote(selectedTopicId, displaySubName)}
                              className="bg-indigo-600 text-white font-bold text-[10px] px-3 py-1.5 rounded-md shadow-xs hover:bg-indigo-700 dark:hover:bg-indigo-500 cursor-pointer"
                            >
                              Save Note
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Loop Phase 3: Granular Bullet Point Micro-Cards */}
                      <ul className="space-y-3.5">
                        {bulletPointsList.map((bullet, bIdx) => {
                          const structuralPathKey = `${selectedTopicId}_p${pIdx}_s${sIdx}_b${bIdx}`;
                          const currentSnippetId = `${selectedTopicId}_${bullet.replace(/<[^>]*>/g, '').substring(0, 24).replace(/\s+/g, '_')}`;
                          const isHighlighted = highlightedSnippetsSet.has(currentSnippetId);

                          return (
                            <li 
                              key={bIdx}
                              className={`text-xs leading-relaxed flex flex-col p-2.5 -mx-2 rounded-xl border transition-all duration-150 ${
                                isHighlighted 
                                  ? 'bg-amber-50/60 dark:bg-amber-950/20 text-amber-950 dark:text-amber-200 border-amber-200/40 dark:border-amber-900/30 shadow-3xs' 
                                  : 'text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-900 border-transparent hover:bg-slate-50/60 dark:hover:bg-slate-800/40'
                              }`}
                            >
                              <div 
                                onClick={() => toggleSnippetHighlight(bullet, selectedTopicId)}
                                className="flex items-start gap-3 cursor-pointer select-none"
                              >
                                <span className={`mt-0.5 text-sm shrink-0 ${isHighlighted ? 'text-amber-500' : 'text-slate-400 dark:text-slate-600'}`}>
                                  {isHighlighted ? '📌' : '▫️'}
                                </span>
                                <span dangerouslySetInnerHTML={{ __html: bullet }} className="flex-1 font-medium" />
                              </div>

                              <div className="flex items-center justify-end gap-2 mt-2 pt-1.5 border-t border-slate-100/70 dark:border-slate-800/60 select-none">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setActiveDetailsKey(structuralPathKey);
                                  }}
                                  className="text-[9px] font-black text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100/30 dark:border-indigo-900/30 px-2 py-0.5 rounded-md hover:bg-indigo-100/80 dark:hover:bg-indigo-900/60 transition-all flex items-center gap-0.5 active:scale-95 cursor-pointer"
                                >
                                  💡 Learn More
                                </button>
                              </div>
                            </li>
                          );
                        })}

                        {/* Render Custom User Notes */}
                        {customNotes.map((note) => {
                          const isEditing = editingNoteId === note.id;

                          return (
                            <li key={note.id} className="text-xs bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100/50 dark:border-indigo-900/30 p-2.5 rounded-xl flex items-start gap-3 relative animate-fadeIn text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                              <span className="mt-0.5 text-xs shrink-0 text-indigo-500 dark:text-indigo-400">📝</span>
                              {isEditing ? (
                                <div className="flex-1 space-y-2">
                                  <textarea
                                    value={editingNoteText}
                                    onChange={(e) => setEditingNoteText(e.target.value)}
                                    className="w-full text-xs p-1.5 bg-white dark:bg-slate-900 border border-indigo-200 dark:border-slate-800 rounded-md text-slate-700 dark:text-slate-200"
                                    rows={2}
                                  />
                                  <div className="flex gap-1.5 justify-end">
                                    <button onClick={() => handleSaveEditNote(note.id)} className="bg-indigo-600 text-white font-bold text-[9px] px-2 py-1 rounded cursor-pointer">Update</button>
                                    <button onClick={() => setEditingNoteId(null)} className="bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold text-[9px] px-2 py-1 rounded cursor-pointer">Cancel</button>
                                  </div>
                                </div>
                              ) : (
                                <div className="flex-1">
                                  <p className="break-words">{note.text}</p>
                                  <div className="flex gap-2.5 mt-1 text-[10px] font-bold text-slate-400 dark:text-slate-500">
                                    <button onClick={() => handleStartEditNote(note)} className="hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer">Edit</button>
                                    <button onClick={() => handleDeleteUserNote(note.id)} className="hover:text-rose-600 dark:hover:text-rose-400 cursor-pointer">Delete</button>
                                  </div>
                                </div>
                              )}
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        );
      })}

      <DetailModal 
        subtopicKey={activeDetailsKey} 
        onClose={() => setActiveDetailsKey(null)} 
      />
    </div>
  );
}