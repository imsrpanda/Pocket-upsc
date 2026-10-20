import { TextToSpeech } from '@capacitor-community/text-to-speech';
import { Capacitor } from '@capacitor/core';

/**
 * Universal Native + Web Text-To-Speech Controller
 * Powered by @capacitor-community/text-to-speech for Android native Java SDK,
 * with graceful fallback to Web Speech API for desktop browser preview.
 */

class TtsController {
  constructor() {
    this.isNative = Capacitor.isNativePlatform();
    this.isPlaying = false;
    this.stoppedByUser = false;
    this.onEndCallback = null;
    this.onErrorCallback = null;
    this.currentSpeakId = 0;
  }

  async getVoices() {
    try {
      if (this.isNative) {
        const res = await TextToSpeech.getSupportedVoices();
        const rawVoices = res?.voices || [];
        return rawVoices.map((v, idx) => ({
          ...v,
          index: idx,
          name: v.name || v.voiceURI || `Voice ${idx + 1}`,
          lang: v.lang || 'en-US'
        }));
      } else if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        const raw = window.speechSynthesis.getVoices() || [];
        return raw.map((v, idx) => ({
          ...v,
          index: idx,
          name: v.name,
          lang: v.lang,
          _raw: v
        }));
      }
    } catch (e) {
      console.warn('Failed to load TTS voices:', e);
    }
    return [];
  }

  async speakText(text, options = {}) {
    const {
      rate = 1.0,
      pitch = 1.1,
      selectedVoice = null,
      lang = 'en-IN',
      onEnd = null,
      onError = null
    } = options;

    if (!text || !text.trim()) return;

    this.isPlaying = true;
    this.stoppedByUser = false;
    this.onEndCallback = onEnd;
    this.onErrorCallback = onError;
    const speakId = ++this.currentSpeakId;

    const targetLang = selectedVoice?.lang || lang || 'en-IN';
    const targetVoiceIndex = selectedVoice?.index !== undefined ? selectedVoice.index : undefined;

    try {
      if (this.isNative) {
        // Native Android execution via android.speech.tts.TextToSpeech
        await TextToSpeech.stop().catch(() => {});
        
        // If user stopped during the await, exit immediately
        if (this.stoppedByUser || speakId !== this.currentSpeakId) return;

        const speakPayload = {
          text,
          lang: targetLang,
          rate,
          pitch,
          volume: 1.0,
          category: 'playback'
        };

        if (targetVoiceIndex !== undefined) {
          speakPayload.voice = targetVoiceIndex;
        }

        await TextToSpeech.speak(speakPayload);

        // If stopped or superseded during speech, do NOT trigger callbacks
        if (this.stoppedByUser || speakId !== this.currentSpeakId) {
          return;
        }

        this.isPlaying = false;
        if (this.onEndCallback) {
          this.onEndCallback();
        }
      } else if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        // Desktop Browser fallback
        window.speechSynthesis.cancel();
        
        if (this.stoppedByUser || speakId !== this.currentSpeakId) return;

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = rate;
        utterance.pitch = pitch;
        utterance.lang = targetLang;

        if (selectedVoice?._raw) {
          utterance.voice = selectedVoice._raw;
        } else {
          const voices = window.speechSynthesis.getVoices();
          const indianVoice = voices.find(v => v.lang.includes('en-IN') || v.lang.includes('hi') || v.name.toLowerCase().includes('india'));
          if (indianVoice) utterance.voice = indianVoice;
        }

        utterance.onend = () => {
          if (this.stoppedByUser || speakId !== this.currentSpeakId) return;
          this.isPlaying = false;
          if (this.onEndCallback) this.onEndCallback();
        };

        utterance.onerror = (e) => {
          if (this.stoppedByUser || speakId !== this.currentSpeakId || e.error === 'canceled' || e.error === 'interrupted') {
            return;
          }
          this.isPlaying = false;
          if (this.onErrorCallback) this.onErrorCallback(e);
        };

        window.speechSynthesis.speak(utterance);
      }
    } catch (err) {
      // Do not treat intentional user stop as an error
      if (this.stoppedByUser || speakId !== this.currentSpeakId) {
        return;
      }
      console.warn('TTS speak error:', err);
      this.isPlaying = false;
      if (this.onErrorCallback) this.onErrorCallback(err);
    }
  }

  async stop() {
    this.isPlaying = false;
    this.stoppedByUser = true;
    this.onEndCallback = null;
    this.onErrorCallback = null;
    this.currentSpeakId++;

    try {
      if (this.isNative) {
        await TextToSpeech.stop().catch(() => {});
      } else if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    } catch (e) {}
  }
}

export const getStoredSpeechSpeed = () => {
  try {
    const val = parseFloat(localStorage.getItem('pocketUPSC_speechSpeed') || '1');
    return !isNaN(val) && val > 0 ? val : 1;
  } catch (e) {
    return 1;
  }
};

export const setStoredSpeechSpeed = (speed) => {
  try {
    localStorage.setItem('pocketUPSC_speechSpeed', speed.toString());
  } catch (e) {}
};

export const getStoredVoice = () => {
  try {
    const raw = localStorage.getItem('pocketUPSC_speechVoice');
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
};

export const setStoredVoice = (voice) => {
  try {
    if (voice) {
      localStorage.setItem('pocketUPSC_speechVoice', JSON.stringify({
        name: voice.name,
        lang: voice.lang
      }));
    }
  } catch (e) {}
};

export const nativeTts = new TtsController();
export default nativeTts;
