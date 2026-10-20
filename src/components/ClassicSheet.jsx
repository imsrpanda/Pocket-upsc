import React, { useState, useEffect } from 'react';
import DetailModal from './DetailModal';
import SleekAudioBar from './SleekAudioBar';
import { db } from '../data/db';
import { parseIntelligentSpeechSegments } from '../utils/intelligentTtsParser';
import { formatContentHtml } from '../utils/formatContent';
import { getStoredSpeechSpeed, setStoredSpeechSpeed } from '../utils/nativeTts';

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

  // STATE 3: Tracks continuous native subtopic audio playlist
  const [audioPlayerState, setAudioPlayerState] = useState({
    active: false,
    pIdx: null,
    sIdx: null,
    subtopicName: '',
    noteGroupKey: null,
    playlist: [],
    currentTrackIndex: 0,
    isPlaying: false,
    playbackSpeed: getStoredSpeechSpeed()
  });

  // Prepare playlist items for a subtopic with high-yield UPSC notes
  const preparePlaylist = async (pIdx, sIdx, subtopicName, bulletsList) => {
    const items = await Promise.all(
      bulletsList.map(async (rawBullet, bIdx) => {
        const structuralPathKey = `${selectedTopicId}_p${pIdx}_s${sIdx}_b${bIdx}`;
        const displayTag = `P${pIdx}_B${bIdx}`;

        // Extract clean title from bullet
        let title = `Topic ${bIdx + 1}`;
        const boldMatch = rawBullet.match(/<b[^>]*>(.*?)<\/b>/i) || rawBullet.match(/\*\*(.*?)\*\*/);
        if (boldMatch && boldMatch[1]) {
          title = boldMatch[1].replace(/[:\-–—\s]+$/, '').trim();
        }

        // Fetch detailed HTML from IndexedDB
        let detailedHtml = '';
        let detailedTitle = '';
        try {
          const record = await db.detailedContent.get(structuralPathKey);
          if (record) {
            if (record.videoTitle) detailedTitle = record.videoTitle;
            if (record.paragraphs) detailedHtml = record.paragraphs;
          }
        } catch (e) {}

        const speechSegments = parseIntelligentSpeechSegments(
          detailedHtml,
          rawBullet,
          detailedTitle || title
        );

        return {
          bIdx,
          pIdx,
          sIdx,
          subtopicName,
          displayTag,
          title: detailedTitle || title,
          rawBullet,
          structuralPathKey,
          speechSegments
        };
      })
    );
    return items;
  };

  // Toggle "Play All" for a subtopic
  const handleTogglePlayAll = async (pIdx, sIdx, subtopicName, bulletsList, noteGroupKey, startIndex = 0) => {
    // If currently playing this exact subtopic
    if (
      audioPlayerState.active &&
      audioPlayerState.pIdx === pIdx &&
      audioPlayerState.sIdx === sIdx
    ) {
      if (startIndex !== undefined && startIndex !== audioPlayerState.currentTrackIndex) {
        setAudioPlayerState(prev => ({
          ...prev,
          currentTrackIndex: startIndex,
          isPlaying: true
        }));
      } else {
        setAudioPlayerState(prev => ({
          ...prev,
          isPlaying: !prev.isPlaying
        }));
      }
      return;
    }

    // Otherwise, build new playlist and start
    const playlist = await preparePlaylist(pIdx, sIdx, subtopicName, bulletsList);
    setAudioPlayerState({
      active: true,
      pIdx,
      sIdx,
      subtopicName,
      noteGroupKey,
      playlist,
      currentTrackIndex: startIndex,
      isPlaying: true,
      playbackSpeed: audioPlayerState.playbackSpeed || getStoredSpeechSpeed()
    });

    // Automatically expand the card so user sees the active highlighted bullets
    setExpandedCards(prev => new Set(prev).add(noteGroupKey));
  };

  const handlePlaySingleBullet = async (pIdx, sIdx, subtopicName, bulletsList, noteGroupKey, bIdx) => {
    handleTogglePlayAll(pIdx, sIdx, subtopicName, bulletsList, noteGroupKey, bIdx);
  };

  const handleCloseAudioPlayer = () => {
    setAudioPlayerState(prev => ({
      ...prev,
      active: false,
      isPlaying: false
    }));
  };

  // Auto-scroll active bullet into view when track changes
  useEffect(() => {
    if (audioPlayerState.active && audioPlayerState.isPlaying) {
      const el = document.getElementById(
        `bullet-${audioPlayerState.pIdx}-${audioPlayerState.sIdx}-${audioPlayerState.currentTrackIndex}`
      );
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  }, [audioPlayerState.currentTrackIndex, audioPlayerState.active, audioPlayerState.isPlaying, audioPlayerState.pIdx, audioPlayerState.sIdx]);

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

  // Safe topic lookup
  const currentTopicData = learningContent ? learningContent[selectedTopicId] : null;

  if (!currentTopicData) {
    return (
      <div className="text-center py-20 px-4 space-y-4 animate-fadeIn">
        <span className="text-5xl block animate-bounce">🏛️</span>
        <h3 className="text-base font-black text-slate-800 dark:text-slate-100">
          Curated Deck Not Available
        </h3>
        <p className="text-xs text-slate-400 dark:text-slate-500 max-w-sm mx-auto leading-relaxed font-medium">
          The structural micro-notes for topic key <code className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded text-indigo-500 font-bold">{selectedTopicId}</code> are being assembled for this module.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 pb-28 max-w-4xl mx-auto">
      
      {/* Loop Phase 1: High-Level Subtopic Phases */}
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

              const isThisSubtopicActive =
                audioPlayerState.active &&
                audioPlayerState.pIdx === pIdx &&
                audioPlayerState.sIdx === sIdx;

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

                    <div className="flex items-center gap-2 shrink-0">
                      {/* 🎧 Play All Button for this Subtopic */}
                      {isExpanded && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleTogglePlayAll(pIdx, sIdx, displaySubName, bulletPointsList, noteGroupKey);
                          }}
                          className={`text-[10px] font-bold px-2.5 py-1 rounded-md transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 shadow-3xs ${
                            isThisSubtopicActive && audioPlayerState.isPlaying
                              ? 'bg-indigo-600 text-white shadow-indigo-500/20'
                              : isThisSubtopicActive
                                ? 'bg-amber-600 text-white'
                                : 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200/60 dark:border-indigo-800/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60'
                          }`}
                          title="Play all bullet topics continuously"
                        >
                          <span>{isThisSubtopicActive && audioPlayerState.isPlaying ? '⏸️' : '🎧'}</span>
                          <span>{isThisSubtopicActive && audioPlayerState.isPlaying ? 'Playing' : 'Play All'}</span>
                        </button>
                      )}

                      {isExpanded && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation(); // Prevents collapsing the card when clicking "+ Note"
                            setActiveNoteInputId(isInputOpen ? null : noteGroupKey);
                            setEditingNoteId(null);
                          }}
                          className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100/30 dark:border-indigo-900/30 px-2.5 py-1 rounded-md hover:bg-indigo-100 dark:hover:bg-indigo-900/60 transition-colors cursor-pointer"
                        >
                          {isInputOpen ? 'Cancel' : '+ Note'}
                        </button>
                      )}
                      
                      {/* Fully Operational Arrow Button */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation(); // Prevents double toggling bubbling
                          toggleCardCollapse(noteGroupKey);
                        }}
                        className="p-1 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors rounded-lg"
                        aria-label="Toggle subtopic card"
                      >
                        <span 
                          className={`inline-block text-xs font-bold transition-transform duration-200 ${
                            isExpanded ? 'rotate-180 text-indigo-600 dark:text-indigo-400' : 'rotate-0'
                          }`}
                        >
                          ▼
                        </span>
                      </button>
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

                          const isCurrentlySpeaking =
                            isThisSubtopicActive &&
                            audioPlayerState.currentTrackIndex === bIdx;

                          const isThisBulletPlaying = isCurrentlySpeaking && audioPlayerState.isPlaying;

                          return (
                            <li 
                              key={bIdx}
                              id={`bullet-${pIdx}-${sIdx}-${bIdx}`}
                              className={`text-xs leading-relaxed flex flex-col p-2.5 -mx-2 rounded-xl border transition-all duration-200 ${
                                isCurrentlySpeaking
                                  ? 'bg-indigo-50/90 dark:bg-indigo-950/60 text-slate-800 dark:text-slate-100 border-indigo-300 dark:border-indigo-700/80 shadow-md ring-2 ring-indigo-500/30'
                                  : isHighlighted 
                                    ? 'bg-amber-50/60 dark:bg-amber-950/20 text-amber-950 dark:text-amber-200 border-amber-200/40 dark:border-amber-900/30 shadow-3xs' 
                                    : 'text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-900 border-transparent hover:bg-slate-50/60 dark:hover:bg-slate-800/40'
                              }`}
                            >
                              <div 
                                onClick={() => toggleSnippetHighlight(bullet, selectedTopicId)}
                                className="flex items-start gap-3 cursor-pointer select-none"
                              >
                                <span className={`mt-0.5 text-sm shrink-0 ${isCurrentlySpeaking ? 'text-indigo-600 dark:text-indigo-400' : isHighlighted ? 'text-amber-500' : 'text-slate-400 dark:text-slate-600'}`}>
                                  {isCurrentlySpeaking ? '🎧' : isHighlighted ? '📌' : '▫️'}
                                </span>
                                <span dangerouslySetInnerHTML={{ __html: formatContentHtml(bullet) }} className="flex-1 font-medium" />
                              </div>

                              <div className="flex items-center justify-between gap-2 mt-2 pt-1.5 border-t border-slate-100/70 dark:border-slate-800/60 select-none">
                                <span className="text-[9px] font-mono font-bold text-slate-400 dark:text-slate-500">
                                  P{pIdx}_B{bIdx}
                                </span>

                                <div className="flex items-center gap-1.5">
                                  {/* Individual Bullet Listen Button */}
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handlePlaySingleBullet(pIdx, sIdx, displaySubName, bulletPointsList, noteGroupKey, bIdx);
                                    }}
                                    className={`text-[9px] font-bold px-2 py-0.5 rounded-md transition-all flex items-center gap-1 cursor-pointer active:scale-95 ${
                                      isThisBulletPlaying
                                        ? 'bg-indigo-600 text-white shadow-xs'
                                        : 'text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 hover:text-indigo-600 dark:hover:text-indigo-400'
                                    }`}
                                    title="Listen to this bullet topic"
                                  >
                                    <span>{isThisBulletPlaying ? '⏸️' : '🎧'}</span>
                                    <span>{isThisBulletPlaying ? 'Playing' : 'Listen'}</span>
                                  </button>

                                  {/* 💡 Learn More Details Button */}
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setActiveDetailsKey(structuralPathKey);
                                    }}
                                    className="text-[9px] font-black text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100/30 dark:border-indigo-900/30 px-2 py-0.5 rounded-md hover:bg-indigo-100/80 dark:hover:bg-indigo-900/60 transition-all flex items-center gap-0.5 active:scale-95 cursor-pointer shadow-3xs"
                                  >
                                    💡 Learn More
                                  </button>
                                </div>
                              </div>
                            </li>
                          );
                        })}
                      </ul>

                      {/* Display Custom Saved Micro-Notes */}
                      {customNotes.length > 0 && (
                        <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                          <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider pl-1">
                            My Subtopic Notes ({customNotes.length})
                          </span>
                          {customNotes.map((note) => (
                            <div 
                              key={note.id} 
                              className="bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/50 dark:border-amber-900/40 p-2.5 rounded-xl space-y-1.5 text-xs text-amber-950 dark:text-amber-200"
                            >
                              {editingNoteId === note.id ? (
                                <div className="space-y-2">
                                  <textarea
                                    value={editingNoteText}
                                    onChange={(e) => setEditingNoteText(e.target.value)}
                                    className="w-full text-xs p-2 bg-white dark:bg-slate-900 border border-amber-300 dark:border-amber-700 rounded-lg text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                    rows={2}
                                  />
                                  <div className="flex justify-end gap-1.5">
                                    <button
                                      onClick={() => setEditingNoteId(null)}
                                      className="px-2 py-1 text-[10px] text-slate-500 hover:text-slate-700 dark:text-slate-400 font-bold"
                                    >
                                      Cancel
                                    </button>
                                    <button
                                      onClick={() => handleSaveEditNote(note.id)}
                                      className="px-2 py-1 text-[10px] bg-indigo-600 text-white rounded font-bold hover:bg-indigo-700"
                                    >
                                      Save Changes
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <div className="flex items-start justify-between gap-2">
                                  <span className="flex-1 font-medium leading-relaxed">{note.text}</span>
                                  <div className="flex items-center gap-1 shrink-0">
                                    <button
                                      onClick={() => handleStartEditNote(note)}
                                      className="p-1 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                                      title="Edit Note"
                                    >
                                      ✏️
                                    </button>
                                    <button
                                      onClick={() => handleDeleteUserNote(note.id)}
                                      className="p-1 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors"
                                      title="Delete Note"
                                    >
                                      🗑️
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}

                    </div>
                  )}

                </div>
              );
            })}
          </div>
        );
      })}

      {/* Slide-over Full-Screen Detailed Reading Panel Modal */}
      <DetailModal 
        subtopicKey={activeDetailsKey} 
        onClose={() => setActiveDetailsKey(null)} 
      />

      {/* Compact, mobile-friendly audio player mini-bar */}
      {audioPlayerState.active && (
        <SleekAudioBar
          playlist={audioPlayerState.playlist}
          currentTrackIndex={audioPlayerState.currentTrackIndex}
          isPlaying={audioPlayerState.isPlaying}
          onTrackChange={(newIndex) =>
            setAudioPlayerState(prev => ({ ...prev, currentTrackIndex: newIndex, isPlaying: true }))
          }
          onPlayPause={(newPlayState) =>
            setAudioPlayerState(prev => ({ ...prev, isPlaying: newPlayState }))
          }
          onClose={handleCloseAudioPlayer}
          playbackSpeed={audioPlayerState.playbackSpeed}
          setPlaybackSpeed={(speed) => {
            setAudioPlayerState(prev => ({ ...prev, playbackSpeed: speed }));
            setStoredSpeechSpeed(speed);
          }}
        />
      )}
    </div>
  );
}