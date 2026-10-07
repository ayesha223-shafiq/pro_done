// Cinematic Web Audio & Speech Synthesis Engine for AgriHawk Pro Documentary

class CinematicAudioEngine {
  private audioCtx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private musicGain: GainNode | null = null;
  private synthNodes: OscillatorNode[] = [];
  private noiseNode: AudioBufferSourceNode | null = null;
  private isMusicPlaying = false;
  private isMuted = false;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private onVoiceEndCallback: (() => void) | null = null;
  private onWordCallback: ((word: string, charIndex: number) => void) | null = null;

  private initAudioContext() {
    if (!this.audioCtx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
        this.masterGain = this.audioCtx.createGain();
        this.masterGain.gain.setValueAtTime(0.7, this.audioCtx.currentTime);
        this.masterGain.connect(this.audioCtx.destination);

        this.musicGain = this.audioCtx.createGain();
        this.musicGain.gain.setValueAtTime(0.22, this.audioCtx.currentTime);
        this.musicGain.connect(this.masterGain);
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  // Generates warm cinematic ambient documentary synth score using harmonic oscillators
  public startCinematicScore() {
    this.initAudioContext();
    if (!this.audioCtx || !this.musicGain || this.isMusicPlaying) return;

    try {
      this.stopCinematicScore();

      // D Minor cinematic chords (D2, A2, D3, F3, A3)
      const frequencies = [73.42, 110.00, 146.83, 174.61, 220.00];

      this.synthNodes = frequencies.map((freq, i) => {
        const osc = this.audioCtx!.createOscillator();
        const filter = this.audioCtx!.createBiquadFilter();
        const oscGain = this.audioCtx!.createGain();

        osc.type = i % 2 === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, this.audioCtx!.currentTime);

        // Warm lowpass filter to create cinematic drone ambience
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(450 + i * 80, this.audioCtx!.currentTime);

        // Gentle volume level per voice
        oscGain.gain.setValueAtTime(0.04, this.audioCtx!.currentTime);

        osc.connect(filter);
        filter.connect(oscGain);
        oscGain.connect(this.musicGain!);

        osc.start();
        return osc;
      });

      // Subtle atmospheric wind / field texture
      const bufferSize = this.audioCtx.sampleRate * 2;
      const noiseBuffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      const whiteNoise = this.audioCtx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      const noiseFilter = this.audioCtx.createBiquadFilter();
      noiseFilter.type = 'bandpass';
      noiseFilter.frequency.setValueAtTime(320, this.audioCtx.currentTime);
      noiseFilter.Q.setValueAtTime(1.5, this.audioCtx.currentTime);

      const noiseGain = this.audioCtx.createGain();
      noiseGain.gain.setValueAtTime(0.015, this.audioCtx.currentTime);

      whiteNoise.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(this.musicGain);
      whiteNoise.start();

      this.noiseNode = whiteNoise;
      this.isMusicPlaying = true;
    } catch (e) {
      console.warn('Cinematic score audio error:', e);
    }
  }

  public stopCinematicScore() {
    this.synthNodes.forEach((osc) => {
      try {
        osc.stop();
        osc.disconnect();
      } catch {
        // ignored
      }
    });
    this.synthNodes = [];

    if (this.noiseNode) {
      try {
        this.noiseNode.stop();
        this.noiseNode.disconnect();
      } catch {
        // ignored
      }
      this.noiseNode = null;
    }
    this.isMusicPlaying = false;
  }

  // Audio ducking when voiceover is speaking
  public duckMusic(duck: boolean) {
    if (!this.audioCtx || !this.musicGain) return;
    const targetGain = duck ? 0.08 : 0.22;
    this.musicGain.gain.setTargetAtTime(targetGain, this.audioCtx.currentTime, 0.4);
  }

  // Text-To-Speech with AI Voiceover
  public speakText(
    text: string,
    options: {
      voiceType?: 'narrator' | 'malik' | 'dispatch';
      lang?: 'en' | 'ur';
      rate?: number;
      pitch?: number;
      onEnd?: () => void;
      onBoundary?: (charIndex: number) => void;
    } = {}
  ) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      if (options.onEnd) setTimeout(options.onEnd, 3000);
      return;
    }

    // Cancel current speech if running
    this.stopSpeech();

    if (this.isMuted) {
      if (options.onEnd) {
        setTimeout(options.onEnd, 3500);
      }
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    this.currentUtterance = utterance;
    const isUrdu = options.lang === 'ur';

    // Pick best voice available for requested language
    const voices = window.speechSynthesis.getVoices();
    let selectedVoice: SpeechSynthesisVoice | undefined;

    if (isUrdu) {
      // Look for Urdu specific voice first
      selectedVoice = voices.find(
        (v) => v.lang.toLowerCase().startsWith('ur') || v.name.toLowerCase().includes('urdu')
      );
      // Fallback to Hindi or Arabic voices which share phonetic roots if Urdu voice isn't installed
      if (!selectedVoice) {
        selectedVoice = voices.find(
          (v) =>
            v.lang.toLowerCase().startsWith('hi') ||
            v.lang.toLowerCase().startsWith('ar') ||
            v.name.toLowerCase().includes('hindi')
        );
      }
      utterance.lang = 'ur-PK';
    } else {
      selectedVoice = voices.find(
        (v) =>
          (v.name.includes('Natural') ||
            v.name.includes('Neural') ||
            v.name.includes('Google') ||
            v.name.includes('Daniel') ||
            v.name.includes('Arthur') ||
            v.name.includes('en-US') ||
            v.name.includes('en-GB')) &&
          v.lang.startsWith('en')
      );
      if (!selectedVoice && voices.length > 0) {
        selectedVoice = voices.find((v) => v.lang.startsWith('en')) || voices[0];
      }
      utterance.lang = 'en-US';
    }

    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }

    // Adjust timbre based on voice character and language
    if (isUrdu) {
      if (options.voiceType === 'malik') {
        utterance.rate = 0.88; // Deep, emotional, poetic Urdu elder cadence
        utterance.pitch = 0.85;
      } else if (options.voiceType === 'dispatch') {
        utterance.rate = 1.0;
        utterance.pitch = 1.05;
      } else {
        utterance.rate = 0.92; // Classic Radio Pakistan documentary cadence
        utterance.pitch = 0.95;
      }
    } else {
      if (options.voiceType === 'malik') {
        utterance.rate = 0.90; // Slower, weathered, reflective tone
        utterance.pitch = 0.85; // Deeper baritone
      } else if (options.voiceType === 'dispatch') {
        utterance.rate = 1.05; // Crisp, energetic, mission controller
        utterance.pitch = 1.05;
      } else {
        utterance.rate = options.rate || 0.95; // Authoritative cinematic documentary tone
        utterance.pitch = options.pitch || 0.95;
      }
    }

    utterance.volume = 1.0;

    // Duck music when voice starts
    this.duckMusic(true);

    utterance.onboundary = (event) => {
      if (options.onBoundary) {
        options.onBoundary(event.charIndex);
      }
    };

    utterance.onend = () => {
      this.duckMusic(false);
      this.currentUtterance = null;
      if (options.onEnd) {
        options.onEnd();
      }
    };

    utterance.onerror = (e) => {
      console.warn('Speech synthesis error:', e);
      this.duckMusic(false);
      this.currentUtterance = null;
      if (options.onEnd) {
        options.onEnd();
      }
    };

    // Ensure voices are loaded in Chromium
    if (window.speechSynthesis.getVoices().length === 0) {
      window.speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.speak(utterance);
      };
    } else {
      window.speechSynthesis.speak(utterance);
    }
  }

  public stopSpeech() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    this.currentUtterance = null;
    this.duckMusic(false);
  }

  public pause() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.pause();
    }
    this.duckMusic(true);
  }

  public resume() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.resume();
    }
    this.duckMusic(true);
  }

  public toggleMute(muted: boolean) {
    this.isMuted = muted;
    if (this.masterGain && this.audioCtx) {
      this.masterGain.gain.setValueAtTime(muted ? 0 : 0.7, this.audioCtx.currentTime);
    }
    if (muted) {
      this.stopSpeech();
    }
  }

  public cleanup() {
    this.stopSpeech();
    this.stopCinematicScore();
    if (this.audioCtx && this.audioCtx.state !== 'closed') {
      try {
        this.audioCtx.close();
      } catch {
        // ignored
      }
      this.audioCtx = null;
    }
  }
}

export const cinematicAudio = new CinematicAudioEngine();
