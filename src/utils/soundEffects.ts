// Web Audio API Synthesizer & Sound FX engine for romantic ambient atmosphere

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private volume: number = 0.5;
  private ambientMusicInterval: number | null = null;
  private isAmbientPlaying: boolean = false;

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (muted && this.isAmbientPlaying) {
      this.stopAmbientSynthesizer();
    }
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
  }

  public getVolume(): number {
    return this.volume;
  }

  // Play a soft romantic chime on button click or interaction
  public playChime(freq = 523.25) { // C5
    if (this.isMuted) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.5, ctx.currentTime + 0.15);

      gain.gain.setValueAtTime(0.01, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.15 * this.volume, ctx.currentTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.6);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.6);
    } catch {
      // Audio context might be restricted before gesture
    }
  }

  // Envelope opening gentle swoosh & harp arpeggio
  public playEnvelopeOpen() {
    if (this.isMuted) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;

      const notes = [392.00, 523.25, 659.25, 783.99, 1046.50]; // G4, C5, E5, G5, C6 (warm romantic major chord)
      notes.forEach((freq, idx) => {
        const time = ctx.currentTime + idx * 0.07;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, time);

        gain.gain.setValueAtTime(0.001, time);
        gain.gain.linearRampToValueAtTime(0.12 * this.volume, time + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.7);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(time);
        osc.stop(time + 0.75);
      });
    } catch {
      // Silent fail
    }
  }

  // Rose bloom sparkle harp
  public playBloomSound() {
    if (this.isMuted) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;

      const notes = [440, 554.37, 659.25, 880, 1108.73]; // A major romantic sparkle
      notes.forEach((freq, idx) => {
        const time = ctx.currentTime + idx * 0.09;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, time);

        gain.gain.setValueAtTime(0.001, time);
        gain.gain.linearRampToValueAtTime(0.15 * this.volume, time + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.9);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(time);
        osc.stop(time + 0.95);
      });
    } catch {
      // Silent fail
    }
  }

  // Heart burst celebration chime
  public playHeartBurst() {
    if (this.isMuted) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;

      const chords = [523.25, 659.25, 783.99, 987.77, 1046.5];
      chords.forEach((f, i) => {
        const t = ctx.currentTime + i * 0.05;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, t);
        gain.gain.setValueAtTime(0.001, t);
        gain.gain.linearRampToValueAtTime(0.14 * this.volume, t + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.8);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t);
        osc.stop(t + 0.85);
      });
    } catch {
      // Silent fail
    }
  }

  // Romantic ambient melodic synthesizer loop (plays gentle calm arpeggio as romantic background melody)
  public startAmbientSynthesizer() {
    if (this.isMuted || this.isAmbientPlaying) return;
    const ctx = this.getContext();
    if (!ctx) return;

    this.isAmbientPlaying = true;
    // Sweet pentatonic lofi melody frequencies
    const melody = [
      261.63, 329.63, 392.00, 523.25, 392.00, 329.63,
      293.66, 369.99, 440.00, 587.33, 440.00, 369.99,
      329.63, 392.00, 493.88, 659.25, 493.88, 392.00,
      349.23, 440.00, 523.25, 698.46, 523.25, 440.00
    ];
    let noteIndex = 0;

    const playNext = () => {
      if (!this.isAmbientPlaying || this.isMuted) return;
      try {
        const f = melody[noteIndex % melody.length];
        noteIndex++;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, ctx.currentTime);

        gain.gain.setValueAtTime(0.001, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.04 * this.volume, ctx.currentTime + 0.15);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.2);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        osc.stop(ctx.currentTime + 1.25);
      } catch {
        // silent
      }
    };

    // Play every 750ms
    playNext();
    this.ambientMusicInterval = window.setInterval(playNext, 750);
  }

  public stopAmbientSynthesizer() {
    this.isAmbientPlaying = false;
    if (this.ambientMusicInterval !== null) {
      clearInterval(this.ambientMusicInterval);
      this.ambientMusicInterval = null;
    }
  }

  public isSynthPlaying(): boolean {
    return this.isAmbientPlaying;
  }
}

export const soundEngine = new SoundEngine();
