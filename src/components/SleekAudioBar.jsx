import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  nativeTts, 
  getStoredSpeechSpeed, 
  setStoredSpeechSpeed, 
  getStoredVoice, 
  setStoredVoice 
} from '../utils/nativeTts';

export default function SleekAudioBar({
  playlist = [],
  currentTrackIndex = 0,
  isPlaying = false,
  onTrackChange,
  onPlayPause,
  onClose,
  playbackSpeed = 1,
  setPlaybackSpeed
}) {
  const [availableVoices, setAvailableVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [showVoicePicker, setShowVoicePicker] = useState(false);

  const currentTrack = playlist[currentTrackIndex];
  const isPlayingRef = useRef(isPlaying);
  const currentTrackIndexRef = useRef(currentTrackIndex);
  const playbackSpeedRef = useRef(playbackSpeed);
  const selectedVoiceRef = useRef(selectedVoice);

  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  useEffect(() => {
    currentTrackIndexRef.current = currentTrackIndex;
  }, [currentTrackIndex]);

  useEffect(() => {
    playbackSpeedRef.current = playbackSpeed;
  }, [playbackSpeed]);

  useEffect(() => {
    selectedVoiceRef.current = selectedVoice;
  }, [selectedVoice]);

  // Load voices from native TTS or Web Speech API
  useEffect(() => {
    const loadVoices = async () => {
      const vList = await nativeTts.getVoices();
      if (!vList || vList.length === 0) return;
      setAvailableVoices(vList);

      // Check if user previously saved a preferred voice
      const savedVoicePref = getStoredVoice();
      let matchedSavedVoice = null;
      if (savedVoicePref?.name) {
        matchedSavedVoice = vList.find((v) => v.name === savedVoicePref.name);
      }

      if (matchedSavedVoice) {
        setSelectedVoice(matchedSavedVoice);
      } else {
        // Fallback: Default to best Indian voice
        const indianVoice = vList.find((v) => {
          const lang = (v.lang || '').toLowerCase();
          const name = (v.name || '').toLowerCase();
          return lang.includes('en-in') || lang.includes('en_in') || name.includes('india') || lang.includes('hi');
        });

        if (indianVoice && !selectedVoiceRef.current) {
          setSelectedVoice(indianVoice);
        } else if (!selectedVoiceRef.current) {
          const englishVoice = vList.find((v) => (v.lang || '').toLowerCase().startsWith('en'));
          if (englishVoice) setSelectedVoice(englishVoice);
        }
      }
    };

    loadVoices();

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }

    const timer = setTimeout(loadVoices, 350);

    return () => {
      clearTimeout(timer);
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.onvoiceschanged = null;
      }
    };
  }, []);

  // Filter and sort voices to place Indian & English voices first
  const sortedVoices = useMemo(() => {
    if (!availableVoices || availableVoices.length === 0) return [];
    return [...availableVoices].sort((a, b) => {
      const aLang = (a.lang || '').toLowerCase();
      const bLang = (b.lang || '').toLowerCase();
      const aIsIndian = aLang.includes('en-in') || aLang.includes('hi');
      const bIsIndian = bLang.includes('en-in') || bLang.includes('hi');
      if (aIsIndian && !bIsIndian) return -1;
      if (!aIsIndian && bIsIndian) return 1;
      const aIsEn = aLang.startsWith('en');
      const bIsEn = bLang.startsWith('en');
      if (aIsEn && !bIsEn) return -1;
      if (!aIsEn && bIsEn) return 1;
      return 0;
    });
  }, [availableVoices]);

  const segmentIndexRef = useRef(0);

  // Extract sentence/bullet segments for seamless pause & resume support
  const segments = useMemo(() => {
    if (!currentTrack) return [];
    if (currentTrack.speechSegments && currentTrack.speechSegments.length > 0) {
      return currentTrack.speechSegments.map((s) => s.text).filter(Boolean);
    }
    const cleanBullet = (currentTrack.rawBullet || '').replace(/<[^>]*>/g, '').trim();
    const fullText = `Topic ${currentTrack.title}. ${cleanBullet}`;
    const sentences = fullText.match(/[^.!?]+[.!?]+(\s|$)|[^.!?]+$/g) || [fullText];
    return sentences.map((s) => s.trim()).filter(Boolean);
  }, [currentTrack]);

  // Reset segment index when switching to a different track
  useEffect(() => {
    segmentIndexRef.current = 0;
  }, [currentTrackIndex]);

  // Handle media playback: speak sentence-by-sentence so pause/play resumes seamlessly
  useEffect(() => {
    if (!currentTrack || !isPlaying) {
      nativeTts.stop();
      return;
    }

    const playSegment = (idx) => {
      if (!isPlayingRef.current) return;

      if (idx >= segments.length) {
        // Track finished! Reset and advance to next track
        segmentIndexRef.current = 0;
        if (currentTrackIndexRef.current < playlist.length - 1) {
          setTimeout(() => {
            if (isPlayingRef.current) {
              onTrackChange(currentTrackIndexRef.current + 1);
            }
          }, 350);
        } else {
          onPlayPause(false);
        }
        return;
      }

      segmentIndexRef.current = idx;
      const textToSpeak = segments[idx];

      nativeTts.speakText(textToSpeak, {
        rate: playbackSpeedRef.current,
        pitch: 1.1,
        selectedVoice: selectedVoiceRef.current,
        lang: selectedVoiceRef.current?.lang || 'en-IN',
        onEnd: () => {
          if (!isPlayingRef.current) return;
          playSegment(idx + 1);
        },
        onError: () => {
          if (!isPlayingRef.current) return;
          // Advance to next segment on error instead of restarting from the beginning
          playSegment(idx + 1);
        }
      });
    };

    playSegment(segmentIndexRef.current);

    return () => {
      nativeTts.stop();
    };
  }, [currentTrackIndex, isPlaying, segments, selectedVoice]);

  // Lock-screen media session integration
  useEffect(() => {
    if (typeof navigator === 'undefined' || !('mediaSession' in navigator) || !currentTrack) return;

    navigator.mediaSession.metadata = new MediaMetadata({
      title: currentTrack.title,
      artist: `${currentTrack.displayTag} • ${currentTrack.subtopicName}`,
      album: 'Pocket UPSC Audio Companion'
    });

    navigator.mediaSession.playbackState = isPlaying ? 'playing' : 'paused';

    navigator.mediaSession.setActionHandler('play', () => onPlayPause(true));
    navigator.mediaSession.setActionHandler('pause', () => {
      isPlayingRef.current = false;
      nativeTts.stop();
      onPlayPause(false);
    });
    navigator.mediaSession.setActionHandler('nexttrack', () => {
      segmentIndexRef.current = 0;
      if (currentTrackIndex < playlist.length - 1) onTrackChange(currentTrackIndex + 1);
    });
    navigator.mediaSession.setActionHandler('previoustrack', () => {
      segmentIndexRef.current = 0;
      if (currentTrackIndex > 0) onTrackChange(currentTrackIndex - 1);
    });
  }, [currentTrack, isPlaying, currentTrackIndex, playlist]);

  if (!currentTrack) return null;

  const handlePrev = (e) => {
    e.stopPropagation();
    segmentIndexRef.current = 0;
    if (currentTrackIndex > 0) onTrackChange(currentTrackIndex - 1);
  };

  const handleNext = (e) => {
    e.stopPropagation();
    segmentIndexRef.current = 0;
    if (currentTrackIndex < playlist.length - 1) onTrackChange(currentTrackIndex + 1);
  };

  const handlePlayPause = (e) => {
    e.stopPropagation();
    const nextState = !isPlaying;
    isPlayingRef.current = nextState;
    if (!nextState) {
      nativeTts.stop();
    }
    onPlayPause(nextState);
  };

  const toggleSpeed = (e) => {
    e.stopPropagation();
    const speeds = [1, 1.25, 1.5, 1.75, 2];
    const nextSpeed = speeds[(speeds.indexOf(playbackSpeed) + 1) % speeds.length];
    setPlaybackSpeed(nextSpeed);
    setStoredSpeechSpeed(nextSpeed);
  };

  const handleSelectVoice = (v) => {
    setSelectedVoice(v);
    setStoredVoice(v);
    setShowVoicePicker(false);
  };

  const cleanVoiceLabel = selectedVoice
    ? (selectedVoice.name || '').replace(/(Microsoft|Google)\s*/gi, '').substring(0, 11)
    : 'Indian Voice';

  return (
    <>
      {/* Semi-transparent backdrop when voice picker is open */}
      {showVoicePicker && (
        <div 
          className="fixed inset-0 z-[85] bg-black/60 backdrop-blur-[2px] animate-fadeIn" 
          onClick={() => setShowVoicePicker(false)} 
        />
      )}

      {/* Perfectly Centered Voice Selector Popup (Pinned with inset-x-3 so it NEVER clips left/right) */}
      {showVoicePicker && (
        <div 
          role="dialog"
          aria-label="Choose Reading Voice"
          className="fixed bottom-[130px] md:bottom-20 inset-x-3 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 sm:w-[400px] max-w-md mx-auto z-[90] max-h-72 flex flex-col bg-slate-900/98 dark:bg-slate-950/98 border border-indigo-500/50 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-xl animate-fadeIn"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-3.5 py-2.5 border-b border-slate-800 bg-slate-800/50">
            <span className="text-xs font-black text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
              <span>🎙️</span> Choose Speech Voice ({sortedVoices.length})
            </span>
            <button 
              onClick={() => setShowVoicePicker(false)}
              className="w-7 h-7 flex items-center justify-center text-sm text-slate-400 hover:text-white hover:bg-slate-700/60 rounded-lg transition-colors cursor-pointer"
              aria-label="Close Voice Selector"
            >
              ✕
            </button>
          </div>

          {/* Voice list items */}
          <div className="flex-1 overflow-y-auto p-2 space-y-1.5 overscroll-contain">
            {sortedVoices.map((v, idx) => {
              const isSelected = selectedVoice?.name === v.name;
              const isIndian = v.lang.includes('IN') || (v.name && v.name.toLowerCase().includes('india'));

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectVoice(v)}
                  className={`w-full text-left px-3 py-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-between gap-2 ${
                    isSelected
                      ? 'bg-indigo-600 text-white font-bold shadow-md shadow-indigo-600/30'
                      : 'text-slate-200 hover:bg-slate-800/90 active:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <span className="text-base shrink-0">{isIndian ? '🇮🇳' : '🎙️'}</span>
                    <span className="truncate font-semibold text-xs leading-snug">
                      {v.name.replace(/(Microsoft|Google|Desktop|Network)\s*/gi, '').trim() || v.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    {isIndian && (
                      <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${
                        isSelected 
                          ? 'bg-white/20 text-white' 
                          : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      }`}>
                        Indian
                      </span>
                    )}
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                      isSelected 
                        ? 'bg-indigo-700 text-indigo-100' 
                        : 'bg-slate-800 text-slate-400 border border-slate-700'
                    }`}>
                      {v.lang}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      <aside
        aria-label="Audio Companion Mini-Bar"
        className="fixed bottom-[68px] md:bottom-5 left-1/2 -translate-x-1/2 z-[70] w-[95vw] max-w-xl animate-fadeIn select-none"
      >

        <div className="bg-slate-900/95 dark:bg-slate-950/95 text-white backdrop-blur-xl border border-indigo-500/40 rounded-2xl shadow-2xl px-3.5 py-2.5 flex items-center justify-between gap-2.5 relative">
          
          {/* Track Info (Left) */}
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <span className="bg-indigo-600 text-white text-[10px] font-black px-1.5 py-0.5 rounded font-mono shrink-0 shadow-xs">
              {currentTrack.displayTag}
            </span>
            <div className="min-w-0 flex-1">
              <h4 className="text-xs font-bold text-white truncate leading-tight">
                {currentTrack.title}
              </h4>
              <span className="text-[9px] text-slate-400 truncate block mt-0.5">
                {currentTrack.subtopicName} • ({currentTrackIndex + 1}/{playlist.length})
              </span>
            </div>
          </div>

          {/* Transport Controls & Voice Selector (Right) */}
          <div className="flex items-center gap-1.5 shrink-0">
            
            {/* 🎙️ Voice Selector Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowVoicePicker(!showVoicePicker);
              }}
              className="flex items-center gap-1 text-[9.5px] font-bold text-slate-300 hover:text-white bg-slate-800/90 hover:bg-slate-700 px-2 py-1 rounded-lg border border-slate-700/80 transition-colors cursor-pointer"
              title="Change Speech Voice"
            >
              <span>🇮🇳</span>
              <span className="truncate max-w-[65px] sm:max-w-[95px]">{cleanVoiceLabel}</span>
              <span className="text-[7px] text-slate-400">▼</span>
            </button>

          {/* Previous Track */}
          <button
            onClick={handlePrev}
            disabled={currentTrackIndex === 0}
            className={`p-1.5 rounded-lg text-xs transition-colors ${
              currentTrackIndex === 0 ? 'text-slate-600 cursor-not-allowed' : 'text-slate-300 hover:text-white cursor-pointer active:scale-95'
            }`}
            title="Previous Topic"
          >
            ⏮️
          </button>

          {/* Primary Play / Pause */}
          <button
            onClick={handlePlayPause}
            className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white flex items-center justify-center text-xs shadow-md shadow-indigo-600/30 transition-all active:scale-90 cursor-pointer"
            title={isPlaying ? 'Pause Narration' : 'Play Narration'}
          >
            {isPlaying ? '⏸️' : '▶️'}
          </button>

          {/* Next Track */}
          <button
            onClick={handleNext}
            disabled={currentTrackIndex === playlist.length - 1}
            className={`p-1.5 rounded-lg text-xs transition-colors ${
              currentTrackIndex === playlist.length - 1 ? 'text-slate-600 cursor-not-allowed' : 'text-slate-300 hover:text-white cursor-pointer active:scale-95'
            }`}
            title="Next Topic"
          >
            ⏭️
          </button>

          {/* Speed Toggle */}
          <button
            onClick={toggleSpeed}
            className="text-[10px] font-black text-indigo-400 bg-indigo-950/70 hover:bg-indigo-900 border border-indigo-800/50 px-2 py-1 rounded-lg transition-colors cursor-pointer"
            title="Toggle playback speed"
          >
            {playbackSpeed}x
          </button>

          {/* Close Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="p-1.5 text-slate-400 hover:text-rose-400 text-xs transition-colors cursor-pointer rounded-lg"
            title="Close Audio Bar"
          >
            ✕
          </button>
        </div>

      </div>
    </aside>
  </>
  );
}
