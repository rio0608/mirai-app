/**
 * Procedural Synthesizer Audio Engine using Web Audio API
 */
class AudioEngine {
  private ctx: AudioContext | null = null;
  private bgmIntervalId: any = null;
  private currentBeat = 0;
  private isPlayingBgm = false;
  private bpm = 120;
  private onBeatCallback: ((beat: number) => void) | null = null;
  private mainVolume: GainNode | null = null;

  init() {
    if (this.ctx) return;
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    
    this.ctx = new AudioContextClass();
    this.mainVolume = this.ctx.createGain();
    this.mainVolume.gain.setValueAtTime(0.5, this.ctx.currentTime);
    this.mainVolume.connect(this.ctx.destination);
  }

  setVolume(vol: number) {
    this.init();
    if (this.mainVolume && this.ctx) {
      this.mainVolume.gain.linearRampToValueAtTime(vol, this.ctx.currentTime + 0.1);
    }
  }

  private resume() {
    this.init();
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playTick(pitch = 800, duration = 0.05) {
    this.resume();
    if (!this.ctx || !this.mainVolume) return;
    
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(pitch, this.ctx.currentTime);
    
    gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);
    
    osc.connect(gain);
    gain.connect(this.mainVolume);
    
    osc.start();
    osc.stop(this.ctx.currentTime + duration);
  }

  playFlickSFX(success: 'PERFECT' | 'GOOD' | 'MISS') {
    this.resume();
    if (!this.ctx || !this.mainVolume) return;

    if (success === 'MISS') {
      // Dull low block sound
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(120, this.ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(50, this.ctx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.15);
      osc.connect(gain);
      gain.connect(this.mainVolume);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.15);
    } else if (success === 'GOOD') {
      // Clean upbeat coin splash
      const osc1 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(600, this.ctx.currentTime);
      osc1.frequency.setValueAtTime(900, this.ctx.currentTime + 0.05);
      gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.15);
      osc1.connect(gain);
      gain.connect(this.mainVolume);
      osc1.start();
      osc1.stop(this.ctx.currentTime + 0.15);
    } else {
      // PERFECT: High pitch chime and sparkly scale
      const now = this.ctx.currentTime;
      const notes = [800, 1000, 1200, 1500];
      notes.forEach((freq, i) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + i * 0.03);
        gain.gain.setValueAtTime(0.15, now + i * 0.03);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.03 + 0.12);
        osc.connect(gain);
        gain.connect(this.mainVolume!);
        osc.start(now + i * 0.03);
        osc.stop(now + i * 0.03 + 0.12);
      });
    }
  }

  playCapsuleRoll() {
    this.resume();
    if (!this.ctx || !this.mainVolume) return;

    // A series of rapid physical clicky sounds
    const now = this.ctx.currentTime;
    for (let i = 0; i < 8; i++) {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(150 + Math.random() * 80, now + i * 0.12);
      gain.gain.setValueAtTime(0.12, now + i * 0.12);
      gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.12 + 0.05);
      osc.connect(gain);
      gain.connect(this.mainVolume);
      osc.start(now + i * 0.12);
      osc.stop(now + i * 0.12 + 0.06);
    }
  }

  playPullFanfare(rarity: string) {
    this.resume();
    if (!this.ctx || !this.mainVolume) return;

    const now = this.ctx.currentTime;
    if (rarity === 'Secret' || rarity === 'UltraRare') {
      // Arpeggiated synthesizer scale
      const freqs = [523.25, 659.25, 783.99, 1046.50, 1318.51, 1567.98, 2093.00]; // C Major
      freqs.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);
        gain.gain.setValueAtTime(0.1, now + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.4);
        osc.connect(gain);
        gain.connect(this.mainVolume!);
        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.42);
      });
      // Harmony chord
      [261.63, 329.63, 392.00, 523.25].forEach((freq) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + 0.5);
        gain.gain.setValueAtTime(0.15, now + 0.5);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 2.0);
        osc.connect(gain);
        gain.connect(this.mainVolume!);
        osc.start(now + 0.5);
        osc.stop(now + 2.0);
      });
    } else if (rarity === 'SuperRare' || rarity === 'Rare') {
      const freqs = [392.00, 523.25, 659.25, 783.99]; // G C E G
      freqs.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.1);
        gain.gain.setValueAtTime(0.12, now + idx * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.01, now + idx * 0.1 + 0.3);
        osc.connect(gain);
        gain.connect(this.mainVolume!);
        osc.start(now + idx * 0.1);
        osc.stop(now + idx * 0.1 + 0.3);
      });
    } else {
      // Normal fanfare
      const freqs = [261.63, 329.63, 392.00];
      freqs.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);
        gain.gain.setValueAtTime(0.1, now + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.01, now + idx * 0.08 + 0.15);
        osc.connect(gain);
        gain.connect(this.mainVolume!);
        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.18);
      });
    }
  }

  playCheer() {
    this.resume();
    if (!this.ctx || !this.mainVolume) return;

    // Simulate epic crowd noise using synthesized white noise filtered through sweeping bandpasses
    const bufferSize = this.ctx.sampleRate * 2.5; // 2.5 seconds cheer
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    
    // Fill buffer with noise
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noiseSource = this.ctx.createBufferSource();
    noiseSource.buffer = buffer;

    // Filter to sweep to mimic vocal frequencies of stadium crowd
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.Q.setValueAtTime(2.0, this.ctx.currentTime);
    filter.frequency.setValueAtTime(250, this.ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(900, this.ctx.currentTime + 0.8);
    filter.frequency.exponentialRampToValueAtTime(300, this.ctx.currentTime + 2.5);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.001, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.3, this.ctx.currentTime + 0.3);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 2.5);

    noiseSource.connect(filter);
    filter.connect(gain);
    gain.connect(this.mainVolume);

    noiseSource.start();
    noiseSource.stop(this.ctx.currentTime + 2.5);

    // Additionally play an elegant high sweep synthesizer arpeggio
    const now = this.ctx.currentTime;
    const notes = [523.25, 587.33, 659.25, 698.46, 783.99, 880.00, 987.77, 1046.50];
    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gNode = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.15);
      gNode.gain.setValueAtTime(0.08, now + idx * 0.15);
      gNode.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.15 + 0.5);
      osc.connect(gNode);
      gNode.connect(this.mainVolume!);
      osc.start(now + idx * 0.15);
      osc.stop(now + idx * 0.15 + 0.5);
    });
  }

  playBGM(onBeat: (beatIndex: number) => void) {
    this.resume();
    if (this.isPlayingBgm) {
      this.stopBGM();
    }
    
    this.onBeatCallback = onBeat;
    this.isPlayingBgm = true;
    this.currentBeat = 0;
    
    const intervalSec = 60 / this.bpm; // Time per beat in seconds
    const intervalMs = intervalSec * 1000;
    
    // Play immediately and schedule subsequent ticks
    this.triggerBgmSeqBeat();
    this.bgmIntervalId = setInterval(() => {
      this.currentBeat++;
      this.triggerBgmSeqBeat();
    }, intervalMs);
  }

  private triggerBgmSeqBeat() {
    if (!this.ctx || !this.isPlayingBgm || !this.mainVolume) return;
    const now = this.ctx.currentTime;
    
    // Call user-defined callback for viewport graphics synchronization
    if (this.onBeatCallback) {
      this.onBeatCallback(this.currentBeat);
    }
    
    // Procedural drum kick every beat (0, 1, 2, 3...)
    const kickOsc = this.ctx.createOscillator();
    const kickGain = this.ctx.createGain();
    kickOsc.frequency.setValueAtTime(150, now);
    kickOsc.frequency.exponentialRampToValueAtTime(0.01, now + 0.15);
    kickGain.gain.setValueAtTime(0.25, now);
    kickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
    kickOsc.connect(kickGain);
    kickGain.connect(this.mainVolume);
    kickOsc.start(now);
    kickOsc.stop(now + 0.16);
    
    // Hi-hat sound on off-beats (0.5, 1.5, 2.5...)
    const hatOsc = this.ctx.createOscillator();
    const hatGain = this.ctx.createGain();
    hatOsc.type = 'triangle';
    hatOsc.frequency.setValueAtTime(10000, now + (60 / this.bpm) * 0.5);
    hatGain.gain.setValueAtTime(0.03, now + (60 / this.bpm) * 0.5);
    hatGain.gain.exponentialRampToValueAtTime(0.001, now + (60 / this.bpm) * 0.5 + 0.05);
    hatOsc.connect(hatGain);
    hatGain.connect(this.mainVolume);
    hatOsc.start(now + (60 / this.bpm) * 0.5);
    hatOsc.stop(now + (60 / this.bpm) * 0.5 + 0.05);

    // Chiptune synthesizer arpeggio/melody based on beat index
    const beatPattern = this.currentBeat % 16;
    
    // Cute melody line notes (Miku Vocal Synth style frequencies)
    // 0: A3(220), 1: C4(261.63), 2: E4(329.63), 3: G4(392) etc.
    const melody = [
      329.63, 392.00, 440.00, 523.25, // E4, G4, A4, C5
      440.00, 392.00, 329.63, 293.66, // A4, G4, E4, D4
      329.63, 329.63, 392.00, 440.00, // E4, E4, G4, A4
      523.25, 587.33, 659.25, 783.99  // C5, D5, E5, G5
    ];
    
    const targetMelodyPitch = melody[beatPattern];
    
    // Trigger Synth lead
    const leadOsc = this.ctx.createOscillator();
    const leadGain = this.ctx.createGain();
    
    // Make lead sound cute like classical 8-bit square wave with vibro
    leadOsc.type = 'square';
    leadOsc.frequency.setValueAtTime(targetMelodyPitch, now);
    
    // Sub-bass underlay
    const subOsc = this.ctx.createOscillator();
    const subGain = this.ctx.createGain();
    subOsc.type = 'sine';
    // 2 octaves below target melody
    subOsc.frequency.setValueAtTime(targetMelodyPitch / 4, now);
    subGain.gain.setValueAtTime(0.12, now);
    subGain.gain.exponentialRampToValueAtTime(0.001, now + (60 / this.bpm) * 0.9);
    subOsc.connect(subGain);
    subGain.connect(this.mainVolume);
    subOsc.start(now);
    subOsc.stop(now + (60 / this.bpm) * 0.9);
    
    // Add slide vibration
    leadOsc.frequency.linearRampToValueAtTime(targetMelodyPitch * 1.01, now + 0.1);
    
    leadGain.gain.setValueAtTime(0.06, now);
    leadGain.gain.exponentialRampToValueAtTime(0.001, now + (60 / this.bpm) * 0.7);
    
    leadOsc.connect(leadGain);
    leadGain.connect(this.mainVolume);
    
    leadOsc.start(now);
    leadOsc.stop(now + (60 / this.bpm) * 0.75);
  }

  stopBGM() {
    if (this.bgmIntervalId) {
      clearInterval(this.bgmIntervalId);
      this.bgmIntervalId = null;
    }
    this.isPlayingBgm = false;
    this.onBeatCallback = null;
  }
}

export const audioEngine = new AudioEngine();
