/**
 * audioUnlocker.js
 * Reliable Android & iOS user-gesture audio / TTS primer.
 * Synchronously claims browser playback permissions on mobile devices.
 */

export function unlockAndroidAudio() {
  try {
    if (typeof window === 'undefined') return;

    // 1. Synchronously un-pause & prime Web Speech API
    if ('speechSynthesis' in window) {
      window.speechSynthesis.resume();
      // Speak a zero-volume silent utterance to capture the direct touch event
      try {
        const prime = new SpeechSynthesisUtterance(' ');
        prime.volume = 0.001;
        window.speechSynthesis.speak(prime);
      } catch (e) {}
    }

    // 2. Synchronously resume Web Audio Context
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (AudioCtx) {
      if (!window.__appAudioCtx) {
        window.__appAudioCtx = new AudioCtx();
      }
      if (window.__appAudioCtx.state === 'suspended') {
        window.__appAudioCtx.resume().catch(() => {});
      }
    }

    // 3. Prime silent background audio element for lock-screen / screen-off playback
    if (!window.__silentAudioBg && typeof Audio !== 'undefined') {
      const a = new Audio('data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA');
      a.loop = true;
      a.volume = 0.01;
      window.__silentAudioBg = a;
    }
    if (window.__silentAudioBg) {
      window.__silentAudioBg.play().catch(() => {});
    }
  } catch (e) {
    // Ignore unsupported environments
  }
}

export default unlockAndroidAudio;
