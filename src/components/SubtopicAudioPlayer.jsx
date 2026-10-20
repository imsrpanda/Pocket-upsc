import React, { useState, useEffect, useRef } from 'react';
import { unlockAndroidAudio } from '../utils/audioUnlocker';

/**
 * Web Audio API Soft Attentive Chime (80ms soft harmonic crystalline bell)
 * Gives an instant psychological attention cue when a bold keyword is spoken,
 * WITHOUT causing any pause or hesitation in the TTS audio stream!
 */
const playSoftAttentiveChime = () => {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    if (!window.__appAudioCtx) {
      window.__appAudioCtx = new AudioContext();
    }
    const ctx = window.__appAudioCtx;
    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    // Gentle harmonic chime (1046.5 Hz - High C6)
    osc.frequency.setValueAtTime(1046.5, ctx.currentTime);

    // Very gentle background gain (0.03) so it highlights without competing with speech
    gain.gain.setValueAtTime(0.03, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.1);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.1);
  } catch (e) {
    // AudioContext fallback
  }
};

/**
 * Voice detection favoring sweet Indian female voices
 */
const findBestSweetIndianFemaleVoice = (voicesList) => {
  if (!voicesList || voicesList.length === 0) return null;

  // 1. Indian English / Hindi Female Voice
  const indianFemale = voicesList.find((v) => {
    const name = (v.name || '').toLowerCase();
    const lang = (v.lang || '').toLowerCase();
    const isIndianLang = lang.includes('en-in') || lang.includes('en_in') || lang.includes('hi');
    const hasFemaleIndicator =
      name.includes('heera') ||
      name.includes('neerja') ||
      name.includes('kalpana') ||
      name.includes('swara') ||
      name.includes('priya') ||
      name.includes('veena') ||
      name.includes('female');
    return isIndianLang && hasFemaleIndicator;
  });
  if (indianFemale) return indianFemale;

  // 2. Any Indian Voice
  const anyIndian = voicesList.find((v) => {
    const lang = (v.lang || '').toLowerCase();
    const name = (v.name || '').toLowerCase();
    return lang.includes('en-in') || lang.includes('en_in') || name.includes('india');
  });
  if (anyIndian) return anyIndian;

  // 3. Any Natural Female Voice
  const anyNaturalFemale = voicesList.find((v) => {
    const name = (v.name || '').toLowerCase();
    return (
      name.includes('zira') ||
      name.includes('aria') ||
      name.includes('jenny') ||
      name.includes('samantha') ||
      name.includes('female')
    );
  });
  if (anyNaturalFemale) return anyNaturalFemale;

  // 4. Default English fallback
  return voicesList.find((v) => v.lang.startsWith('en')) || voicesList[0];
};

export default function SubtopicAudioPlayer({
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
  const [activeSegmentIndex, setActiveSegmentIndex] = useState(0);
  const [activeBoldHighlight, setActiveBoldHighlight] = useState(null);
  const [enableChime, setEnableChime] = useState(true);
  const [isMinimized, setIsMinimized] = useState(false); // Mobile toggle for slim floating pill

  const utteranceRef = useRef(null);
  const isPlayingRef = useRef(isPlaying);
  const currentTrackIndexRef = useRef(currentTrackIndex);
  const activeSegmentIndexRef = useRef(activeSegmentIndex);
  const playbackSpeedRef = useRef(playbackSpeed);
  const selectedVoiceRef = useRef(selectedVoice);
  const enableChimeRef = useRef(enableChime);
  const nextSegmentTimeoutRef = useRef(null);
  const speakTimeoutRef = useRef(null);

  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  useEffect(() => {
    enableChimeRef.current = enableChime;
  }, [enableChime]);

  useEffect(() => {
    currentTrackIndexRef.current = currentTrackIndex;
    activeSegmentIndexRef.current = 0;
    setActiveSegmentIndex(0);
    setActiveBoldHighlight(null);
  }, [currentTrackIndex]);

  useEffect(() => {
    activeSegmentIndexRef.current = activeSegmentIndex;
  }, [activeSegmentIndex]);

  useEffect(() => {
    playbackSpeedRef.current = playbackSpeed;
    if (isPlayingRef.current) {
      speakCurrentSegment(activeSegmentIndexRef.current);
    }
  }, [playbackSpeed]);

  useEffect(() => {
    selectedVoiceRef.current = selectedVoice;
  }, [selectedVoice]);

  // Voice detection favoring sweet Indian female voices with Android lazy-load support
  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      if (!voices || voices.length === 0) return;
      setAvailableVoices(voices);

      const best = findBestSweetIndianFemaleVoice(voices);
      if (best && !selectedVoiceRef.current) {
        selectedVoiceRef.current = best;
        setSelectedVoice(best);
      }
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    // Android Chrome delayed check
    const delayedTimer = setTimeout(loadVoices, 300);

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
      clearTimeout(delayedTimer);
    };
  }, []);

  // Cleanup speech on unmount
  useEffect(() => {
    return () => {
      if (nextSegmentTimeoutRef.current) clearTimeout(nextSegmentTimeoutRef.current);
      if (speakTimeoutRef.current) clearTimeout(speakTimeoutRef.current);
      window.__activeSpeechUtterance = null;
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const silentAudioRef = useRef(null);
  const wakeLockRef = useRef(null);

  // Background Audio Anchor & Screen WakeLock (Enables continuous playback even when screen turns off)
  useEffect(() => {
    if (!silentAudioRef.current && typeof Audio !== 'undefined') {
      const silentAudio = window.__silentAudioBg || new Audio('data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA');
      silentAudio.loop = true;
      silentAudioRef.current = silentAudio;
      window.__silentAudioBg = silentAudio;
    }

    if (isPlaying) {
      if (silentAudioRef.current) {
        silentAudioRef.current.play().catch(() => {});
      }
      if ('wakeLock' in navigator && !wakeLockRef.current) {
        navigator.wakeLock.request('screen').then((wl) => {
          wakeLockRef.current = wl;
        }).catch(() => {});
      }
    } else {
      if (silentAudioRef.current) {
        silentAudioRef.current.pause();
      }
      if (wakeLockRef.current) {
        wakeLockRef.current.release().catch(() => {});
        wakeLockRef.current = null;
      }
    }

    return () => {
      if (wakeLockRef.current) {
        wakeLockRef.current.release().catch(() => {});
        wakeLockRef.current = null;
      }
    };
  }, [isPlaying]);

  // Lock Screen & Notification Shade Media Controls (MediaSession API)
  useEffect(() => {
    if (typeof navigator === 'undefined' || !('mediaSession' in navigator)) return;

    const track = playlist[currentTrackIndex];
    if (track) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: track.title,
        artist: `${track.displayTag} • ${track.subtopicName}`,
        album: 'Pocket UPSC Micro-Reading'
      });

      navigator.mediaSession.playbackState = isPlaying ? 'playing' : 'paused';

      navigator.mediaSession.setActionHandler('play', () => {
        unlockAndroidAudio();
        onPlayPause(true);
      });
      navigator.mediaSession.setActionHandler('pause', () => onPlayPause(false));
      navigator.mediaSession.setActionHandler('nexttrack', () => {
        if (currentTrackIndex < playlist.length - 1) onTrackChange(currentTrackIndex + 1);
      });
      navigator.mediaSession.setActionHandler('previoustrack', () => {
        if (currentTrackIndex > 0) onTrackChange(currentTrackIndex - 1);
      });
    }
  }, [currentTrackIndex, isPlaying, playlist, onPlayPause, onTrackChange]);

  // Chrome speech keep-alive: Chromium speech synthesis pauses if longer than 10 seconds
  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    const keepAlive = setInterval(() => {
      if (isPlayingRef.current && window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
        window.speechSynthesis.pause();
        window.speechSynthesis.resume();
      }
    }, 9000);

    return () => clearInterval(keepAlive);
  }, []);

  // Speak the specific continuous segment at segIndex with Android safety buffers
  const speakCurrentSegment = (segIndex) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    if (nextSegmentTimeoutRef.current) clearTimeout(nextSegmentTimeoutRef.current);
    if (speakTimeoutRef.current) clearTimeout(speakTimeoutRef.current);

    window.speechSynthesis.cancel();
    setActiveBoldHighlight(null);

    const track = playlist[currentTrackIndexRef.current];
    if (!track) return;

    const segments = track.speechSegments || [];
    if (segments.length === 0) return;

    const validIndex = Math.min(Math.max(0, segIndex), segments.length - 1);
    const seg = segments[validIndex];
    if (!seg || !seg.text) return;

    // Small 45ms staging buffer: Android Chrome TextToSpeech drops utterances if cancel() is followed synchronously by speak()
    speakTimeoutRef.current = setTimeout(() => {
      if (!isPlayingRef.current) return;

      const utterance = new SpeechSynthesisUtterance(seg.text);
      utteranceRef.current = utterance;
      // V8 garbage collection pin for Android Chrome & Capacitor WebView
      window.__activeSpeechUtterance = utterance;

      // Android WebView lazy voice detection safeguard
      if (!selectedVoiceRef.current && window.speechSynthesis.getVoices) {
        const vList = window.speechSynthesis.getVoices();
        if (vList && vList.length > 0) {
          const best = findBestSweetIndianFemaleVoice(vList);
          if (best) {
            selectedVoiceRef.current = best;
            setSelectedVoice(best);
          }
        }
      }

      if (selectedVoiceRef.current) {
        utterance.voice = selectedVoiceRef.current;
        utterance.lang = selectedVoiceRef.current.lang || 'en-IN';
      } else {
        // Safe Android fallback to device language or English
        utterance.lang = (typeof navigator !== 'undefined' && navigator.language) || 'en-US';
      }

      utterance.pitch = seg.pitch || 1.16;
      utterance.rate = (seg.rate || 0.94) * playbackSpeedRef.current;

      // Innovative onboundary word tracker: highlights bold keywords in real time
      // and plays a soft micro-chime without pausing the sentence
      utterance.onboundary = (e) => {
        if (e.name === 'word' && seg.boldWords && seg.boldWords.length > 0) {
          const textFromIndex = seg.text.substring(e.charIndex);
          const spokenWord = textFromIndex.split(/\s+/)[0].replace(/[^a-zA-Z0-9]/g, '').toLowerCase();

          if (spokenWord) {
            const matchedBold = seg.boldWords.find((bw) =>
              bw.toLowerCase().split(/\s+/).some((w) => w.replace(/[^a-zA-Z0-9]/g, '') === spokenWord)
            );

            if (matchedBold) {
              setActiveBoldHighlight(matchedBold);
              if (enableChimeRef.current) {
                playSoftAttentiveChime();
              }
            }
          }
        }
      };

      utterance.onend = () => {
        window.__activeSpeechUtterance = null;
        setActiveBoldHighlight(null);
        if (!isPlayingRef.current) return;

        // If more segments remain in the current topic
        if (validIndex < segments.length - 1) {
          const pauseMs = seg.pauseAfterMs || 150;
          nextSegmentTimeoutRef.current = setTimeout(() => {
            if (isPlayingRef.current) {
              setActiveSegmentIndex(validIndex + 1);
            }
          }, pauseMs);
        } else {
          // Current topic completed! Advance to next topic (P0_B0 -> P0_B1 -> ...)
          if (currentTrackIndexRef.current < playlist.length - 1) {
            nextSegmentTimeoutRef.current = setTimeout(() => {
              if (isPlayingRef.current) {
                onTrackChange(currentTrackIndexRef.current + 1);
              }
            }, 550); // Natural breath pause between topic cards
          } else {
            // Reached end of entire subtopic playlist!
            onPlayPause(false);
          }
        }
      };

      utterance.onerror = (e) => {
        window.__activeSpeechUtterance = null;
        if (e.error !== 'canceled' && e.error !== 'interrupted') {
          console.warn('Speech synthesis error on Android:', e);
          // Auto-recovery fallback for Android phones missing specific language pack
          if (e.error === 'language-unavailable' || e.error === 'voice-unavailable' || e.error === 'synthesis-failed') {
            try {
              const fallbackUtterance = new SpeechSynthesisUtterance(seg.text);
              fallbackUtterance.lang = 'en-US';
              fallbackUtterance.pitch = 1.0;
              fallbackUtterance.rate = playbackSpeedRef.current;
              fallbackUtterance.onend = utterance.onend;
              window.__activeSpeechUtterance = fallbackUtterance;
              window.speechSynthesis.speak(fallbackUtterance);
              return;
            } catch (err) {}
          }
        }
      };

      // Un-pause and trigger speech output
      window.speechSynthesis.resume();
      window.speechSynthesis.speak(utterance);
    }, 45);
  };

  // Re-trigger speech whenever isPlaying or activeSegmentIndex changes
  useEffect(() => {
    if (isPlaying) {
      speakCurrentSegment(activeSegmentIndex);
    } else {
      if (nextSegmentTimeoutRef.current) clearTimeout(nextSegmentTimeoutRef.current);
      if (speakTimeoutRef.current) clearTimeout(speakTimeoutRef.current);
      window.__activeSpeechUtterance = null;
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    }
  }, [isPlaying, activeSegmentIndex]);

  if (!playlist || playlist.length === 0) return null;

  const currentTrack = playlist[currentTrackIndex] || playlist[0];
  const segments = currentTrack.speechSegments || [];
  const currentSeg = segments[activeSegmentIndex] || segments[0];

  const handlePrev = () => {
    unlockAndroidAudio();
    if (currentTrackIndex > 0) {
      onTrackChange(currentTrackIndex - 1);
    }
  };

  const handleNext = () => {
    unlockAndroidAudio();
    if (currentTrackIndex < playlist.length - 1) {
      onTrackChange(currentTrackIndex + 1);
    }
  };

  const toggleSpeed = () => {
    const speeds = [1, 1.25, 1.5, 1.75, 2];
    const nextSpeed = speeds[(speeds.indexOf(playbackSpeed) + 1) % speeds.length];
    setPlaybackSpeed(nextSpeed);
  };

  const cleanVoiceLabel = selectedVoice
    ? selectedVoice.name.replace(/(Microsoft|Google)\s*/g, '').substring(0, 15)
    : 'Indian Voice';

  return (
    /* Positioned ABOVE the Android mobile navigation bar (bottom-[74px] on mobile, bottom-6 on desktop) with z-[70] */
    <aside 
      aria-label="Audio Study Companion"
      className="fixed bottom-[74px] md:bottom-6 left-1/2 -translate-x-1/2 z-[70] w-[95vw] max-w-xl animate-dashboard-card select-none pb-[env(safe-area-inset-bottom)]"
    >
      <div className="bg-slate-900/95 dark:bg-slate-950/95 text-white backdrop-blur-xl border border-indigo-500/30 rounded-2xl shadow-2xl p-3 sm:p-3.5 space-y-2.5 transition-all">
        
        {/* COMPACT MINI-MODE FOR MOBILE READING */}
        {isMinimized ? (
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <span className="bg-indigo-600 text-white text-[9.5px] font-black px-1.5 py-0.5 rounded font-mono shrink-0 shadow-xs">
                {currentTrack.displayTag}
              </span>
              <div className="min-w-0">
                <span className="text-[11px] font-bold text-white truncate block">
                  {currentTrack.title}
                </span>
                <span className="text-[9px] text-slate-400 truncate block">
                  {currentTrack.subtopicName}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={handlePrev}
                disabled={currentTrackIndex === 0}
                className="p-1.5 text-xs text-slate-400 hover:text-white disabled:opacity-30 cursor-pointer"
                title="Previous Topic"
              >
                ⏮️
              </button>
              <button
                onClick={() => {
                  unlockAndroidAudio();
                  onPlayPause(!isPlaying);
                }}
                className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-600 to-indigo-500 text-white flex items-center justify-center text-xs shadow-md shadow-indigo-600/30 cursor-pointer active:scale-95"
                title={isPlaying ? 'Pause' : 'Resume'}
              >
                {isPlaying ? '⏸️' : '▶️'}
              </button>
              <button
                onClick={handleNext}
                disabled={currentTrackIndex === playlist.length - 1}
                className="p-1.5 text-xs text-slate-400 hover:text-white disabled:opacity-30 cursor-pointer"
                title="Next Topic"
              >
                ⏭️
              </button>
              <button
                onClick={() => setIsMinimized(false)}
                className="p-1.5 text-xs text-indigo-400 hover:text-indigo-200 cursor-pointer"
                title="Expand Full Controls"
                aria-label="Expand Full Controls"
              >
                🔼
              </button>
              <button
                onClick={onClose}
                className="p-1.5 text-xs text-slate-400 hover:text-rose-400 cursor-pointer"
                title="Close"
                aria-label="Close"
              >
                ✕
              </button>
            </div>
          </div>
        ) : (
          /* FULL CONTROLS & HUD MODE */
          <>
            {/* Top Info Bar: Topic Tag, Progress, Minimize, Close */}
            <div className="flex items-center justify-between gap-2 border-b border-slate-800/80 pb-2">
              <div className="flex items-center gap-2 min-w-0">
                <span className="bg-indigo-600 text-white text-[10px] font-black px-2 py-0.5 rounded-md font-mono shrink-0 shadow-xs">
                  {currentTrack.displayTag}
                </span>
                <span className="text-[10px] font-bold text-slate-300 truncate">
                  {currentTrack.subtopicName}
                </span>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <span className="text-[10px] font-black text-indigo-400 bg-indigo-950/70 border border-indigo-800/40 px-2 py-0.5 rounded-full">
                  Topic {currentTrackIndex + 1} of {playlist.length}
                </span>
                {/* Minimize Button */}
                <button
                  onClick={() => setIsMinimized(true)}
                  className="p-1 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-indigo-300 transition-colors cursor-pointer text-xs"
                  title="Minimize Player"
                  aria-label="Minimize Player"
                >
                  🔽
                </button>
                {/* Close Button */}
                <button
                  onClick={onClose}
                  className="p-1 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer text-xs"
                  title="Close audio player"
                  aria-label="Close audio player"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Title and Sound Wave Visualizer */}
            <div className="flex items-center justify-between gap-3">
              <div className="flex-1 min-w-0">
                <h4 className="text-xs sm:text-sm font-black text-white truncate tracking-tight">
                  {currentTrack.title}
                </h4>
                <p className="text-[10px] text-slate-400 truncate mt-0.5">
                  Continuous Audio Companion • Indian Voice • Real-Time Focus
                </p>
              </div>

              {/* Soundwave Equalizer */}
              <div className="flex items-end gap-1 h-4 px-2 py-0.5 bg-slate-800/60 rounded-lg shrink-0">
                <span className={`w-1 bg-indigo-400 rounded-full ${isPlaying ? 'animate-soundwave-1' : 'h-1'}`} />
                <span className={`w-1 bg-indigo-400 rounded-full ${isPlaying ? 'animate-soundwave-2' : 'h-2'}`} />
                <span className={`w-1 bg-indigo-400 rounded-full ${isPlaying ? 'animate-soundwave-3' : 'h-1'}`} />
                <span className={`w-1 bg-indigo-400 rounded-full ${isPlaying ? 'animate-soundwave-1' : 'h-2'}`} />
              </div>
            </div>

            {/* Intelligent Spoken Segment HUD Display */}
            <div className="bg-slate-800/70 rounded-xl p-2.5 border border-slate-700/60 transition-all flex flex-col gap-1.5 min-h-[58px]">
              <div className="flex items-center justify-between text-[9px] font-black uppercase tracking-wider">
                {currentSeg?.isHeader && (
                  <span className="text-cyan-300 bg-cyan-950/80 px-2 py-0.5 rounded-md border border-cyan-800/50 flex items-center gap-1 animate-fadeIn">
                    <span>🎙️</span> Topic Intro
                  </span>
                )}
                {currentSeg?.isImportant && (
                  <span className="text-amber-300 bg-amber-950/80 px-2 py-0.5 rounded-md border border-amber-800/50 flex items-center gap-1 animate-fadeIn">
                    <span>⭐</span> Key Concept to Remember
                  </span>
                )}
                {currentSeg?.isTableIntro && (
                  <span className="text-emerald-300 bg-emerald-950/80 px-2 py-0.5 rounded-md border border-emerald-800/50 flex items-center gap-1 animate-fadeIn">
                    <span>📊</span> Table Summary
                  </span>
                )}
                {currentSeg?.isTableRow && (
                  <span className="text-emerald-300 bg-emerald-950/80 px-2 py-0.5 rounded-md border border-emerald-800/50 flex items-center gap-1 animate-fadeIn">
                    <span>📌</span> Table Row Point
                  </span>
                )}
                {currentSeg?.isExamTrap && (
                  <span className="text-rose-300 bg-rose-950/80 px-2 py-0.5 rounded-md border border-rose-800/50 flex items-center gap-1 animate-fadeIn">
                    <span>⚠️</span> Common Exam Trap
                  </span>
                )}
                {!currentSeg?.isHeader && !currentSeg?.isImportant && !currentSeg?.isTableIntro && !currentSeg?.isTableRow && !currentSeg?.isExamTrap && (
                  <span className="text-slate-400">
                    Core Explanation
                  </span>
                )}

                {/* Active Real-time Bold Keyword Glow Badge */}
                {activeBoldHighlight && (
                  <span className="text-amber-300 bg-amber-950/90 border border-amber-500/50 px-2 py-0.5 rounded-md flex items-center gap-1 animate-pulse">
                    <span>✨</span> Focus: {activeBoldHighlight}
                  </span>
                )}

                <span className="text-slate-500 font-mono text-[9px]">
                  {segments.length > 0 ? `${activeSegmentIndex + 1} / ${segments.length}` : ''}
                </span>
              </div>

              {/* Complete unbroken sentence text */}
              <p className="text-[11px] sm:text-xs font-medium text-slate-100 leading-snug line-clamp-2">
                {currentSeg?.text}
              </p>
            </div>

            {/* Progress Bar of Segments */}
            <div className="w-full bg-slate-800 rounded-full h-1 overflow-hidden">
              <div
                className="bg-gradient-to-r from-indigo-500 via-cyan-400 to-emerald-400 h-full transition-all duration-300"
                style={{
                  width: segments.length > 0 ? `${Math.round(((activeSegmentIndex + 1) / segments.length) * 100)}%` : '0%'
                }}
              />
            </div>

            {/* Bottom Controls Row */}
            <div className="flex items-center justify-between gap-2 pt-0.5">
              {/* Voice Indicator / Selector Toggle */}
              <div className="relative">
                <button
                  onClick={() => setShowVoicePicker(!showVoicePicker)}
                  className="flex items-center gap-1.5 text-[10px] font-bold text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-800 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                  title="Change speech voice"
                >
                  <span>🇮🇳</span>
                  <span className="truncate max-w-[80px] sm:max-w-[110px]">{cleanVoiceLabel}</span>
                  <span className="text-[8px] text-slate-500">▼</span>
                </button>

                {/* Voice Dropdown */}
                {showVoicePicker && (
                  <div className="absolute bottom-full left-0 mb-2 w-56 max-h-48 overflow-y-auto bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-1.5 space-y-1 z-50">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider px-2 py-1 block">
                      Select Speech Voice
                    </span>
                    {availableVoices.slice(0, 12).map((v, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setSelectedVoice(v);
                          setShowVoicePicker(false);
                          if (isPlaying) speakCurrentSegment(activeSegmentIndex);
                        }}
                        className={`w-full text-left text-[10px] px-2 py-1.5 rounded-lg truncate transition-colors cursor-pointer flex items-center justify-between ${
                          selectedVoice?.name === v.name
                            ? 'bg-indigo-600 text-white font-bold'
                            : 'text-slate-300 hover:bg-slate-800'
                        }`}
                      >
                        <span className="truncate">{v.name.replace(/(Microsoft|Google)\s*/g, '')}</span>
                        <span className="text-[8px] opacity-70 shrink-0 ml-1">{v.lang}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Primary Media Transport Controls */}
              <div className="flex items-center gap-2">
                {/* Prev Track */}
                <button
                  onClick={handlePrev}
                  disabled={currentTrackIndex === 0}
                  className={`p-1.5 rounded-lg transition-colors text-xs ${
                    currentTrackIndex === 0
                      ? 'text-slate-600 cursor-not-allowed'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800 active:scale-95 cursor-pointer'
                  }`}
                  title="Previous Topic (P0_B...)"
                  aria-label="Previous Topic"
                >
                  ⏮️
                </button>

                {/* Play / Pause Primary Button */}
                <button
                  onClick={() => {
                    unlockAndroidAudio();
                    onPlayPause(!isPlaying);
                  }}
                  className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white flex items-center justify-center text-sm shadow-md shadow-indigo-600/30 transition-all active:scale-90 cursor-pointer"
                  title={isPlaying ? 'Pause Narration' : 'Resume Narration'}
                  aria-label={isPlaying ? 'Pause Narration' : 'Resume Narration'}
                >
                  {isPlaying ? '⏸️' : '▶️'}
                </button>

                {/* Next Track */}
                <button
                  onClick={handleNext}
                  disabled={currentTrackIndex === playlist.length - 1}
                  className={`p-1.5 rounded-lg transition-colors text-xs ${
                    currentTrackIndex === playlist.length - 1
                      ? 'text-slate-600 cursor-not-allowed'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800 active:scale-95 cursor-pointer'
                  }`}
                  title="Next Topic (P0_B...)"
                  aria-label="Next Topic"
                >
                  ⏭️
                </button>
              </div>

              {/* Right Tools: Chime Toggle & Speed Toggle */}
              <div className="flex items-center gap-1.5">
                {/* Attentive Chime Toggle */}
                <button
                  onClick={() => setEnableChime(!enableChime)}
                  className={`text-[9.5px] font-bold px-2 py-1 rounded-lg border transition-colors cursor-pointer flex items-center gap-1 ${
                    enableChime
                      ? 'bg-amber-950/50 text-amber-300 border-amber-600/40 hover:bg-amber-900/50'
                      : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700'
                  }`}
                  title={enableChime ? 'Keyword Focus Chime: ON (click to mute)' : 'Keyword Focus Chime: OFF (click to enable)'}
                >
                  <span>{enableChime ? '🔔' : '🔕'}</span>
                </button>

                {/* Speed Toggle */}
                <button
                  onClick={toggleSpeed}
                  className="text-[10px] font-black text-indigo-400 bg-indigo-950/70 hover:bg-indigo-900 border border-indigo-800/40 px-2 py-1 rounded-lg transition-colors cursor-pointer"
                  title="Toggle playback speed"
                >
                  {playbackSpeed}x
                </button>
              </div>
            </div>
          </>
        )}

      </div>
    </aside>
  );
}
