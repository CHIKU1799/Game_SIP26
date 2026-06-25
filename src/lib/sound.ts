"use client";

// ── Self-contained Web Audio sound engine ───────────────────────────
// No binary assets are shipped. Background "music" is a gentle, looping
// ambient pad + arpeggio synthesised with oscillators; UI sound effects
// are short synthesised blips. This keeps the bundle tiny and works on
// Vercel with zero hosting of audio files.
//
// Browser autoplay policy: an AudioContext can only start after a user
// gesture, so call `sound.unlock()` from a click handler (e.g. the
// "Begin Experiment" button) before expecting audio.

type Sfx = "select" | "submit" | "levelup" | "hint" | "ai" | "complete" | "click";

class SoundEngine {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private musicGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private musicTimer: ReturnType<typeof setInterval> | null = null;
  private started = false;
  muted = false;
  private step = 0;

  // gentle, pleasant pentatonic-ish progression (Hz)
  private readonly bass = [110, 110, 146.83, 130.81]; // A2 A2 D3 C3
  private readonly arp = [
    [220, 277.18, 329.63, 440], // A major-ish
    [220, 277.18, 329.63, 440],
    [293.66, 369.99, 440, 587.33], // D
    [261.63, 329.63, 392, 523.25], // C
  ];

  private ensure() {
    if (this.ctx) return;
    const AC =
      (window.AudioContext ||
        (window as any).webkitAudioContext) as typeof AudioContext;
    if (!AC) return;
    this.ctx = new AC();
    this.master = this.ctx.createGain();
    this.master.gain.value = this.muted ? 0 : 0.9;
    this.master.connect(this.ctx.destination);

    this.musicGain = this.ctx.createGain();
    this.musicGain.gain.value = 0.18; // background sits low
    this.musicGain.connect(this.master);

    this.sfxGain = this.ctx.createGain();
    this.sfxGain.gain.value = 0.5;
    this.sfxGain.connect(this.master);
  }

  // Call from a user gesture.
  unlock() {
    this.ensure();
    if (this.ctx?.state === "suspended") this.ctx.resume();
    if (!this.started) {
      this.started = true;
      this.startMusic();
    }
  }

  setMuted(m: boolean) {
    this.muted = m;
    if (!this.ctx || !this.master) return;
    const now = this.ctx.currentTime;
    this.master.gain.cancelScheduledValues(now);
    this.master.gain.linearRampToValueAtTime(m ? 0 : 0.9, now + 0.25);
  }

  toggleMute(): boolean {
    this.setMuted(!this.muted);
    return this.muted;
  }

  private startMusic() {
    if (!this.ctx) return;
    // schedule one bar every 1.9s
    const bar = () => {
      if (!this.ctx || !this.musicGain) return;
      const t = this.ctx.currentTime;
      const chordIdx = this.step % this.bass.length;

      // soft bass pad
      this.tone({
        freq: this.bass[chordIdx],
        type: "sine",
        start: t,
        dur: 1.9,
        peak: 0.5,
        gainNode: this.musicGain,
        attack: 0.4,
        release: 0.8,
      });
      // pad fifth
      this.tone({
        freq: this.bass[chordIdx] * 1.5,
        type: "triangle",
        start: t,
        dur: 1.9,
        peak: 0.18,
        gainNode: this.musicGain,
        attack: 0.5,
        release: 0.8,
      });

      // sparkly arpeggio across the bar
      const notes = this.arp[chordIdx];
      notes.forEach((f, i) => {
        this.tone({
          freq: f * 2,
          type: "sine",
          start: t + i * 0.45,
          dur: 0.4,
          peak: 0.12,
          gainNode: this.musicGain!,
          attack: 0.02,
          release: 0.3,
        });
      });

      this.step++;
    };
    bar();
    this.musicTimer = setInterval(bar, 1900);
  }

  private tone(o: {
    freq: number;
    type: OscillatorType;
    start: number;
    dur: number;
    peak: number;
    gainNode: GainNode;
    attack?: number;
    release?: number;
    glideTo?: number;
  }) {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    osc.type = o.type;
    osc.frequency.setValueAtTime(o.freq, o.start);
    if (o.glideTo) osc.frequency.exponentialRampToValueAtTime(o.glideTo, o.start + o.dur);
    const attack = o.attack ?? 0.01;
    const release = o.release ?? 0.1;
    g.gain.setValueAtTime(0.0001, o.start);
    g.gain.exponentialRampToValueAtTime(o.peak, o.start + attack);
    g.gain.exponentialRampToValueAtTime(0.0001, o.start + o.dur + release);
    osc.connect(g);
    g.connect(o.gainNode);
    osc.start(o.start);
    osc.stop(o.start + o.dur + release + 0.05);
  }

  play(sfx: Sfx) {
    if (!this.ctx || !this.sfxGain) return;
    if (this.ctx.state === "suspended") this.ctx.resume();
    const t = this.ctx.currentTime;
    const g = this.sfxGain;
    switch (sfx) {
      case "select":
        this.tone({ freq: 523.25, type: "sine", start: t, dur: 0.08, peak: 0.25, gainNode: g });
        break;
      case "click":
        this.tone({ freq: 440, type: "triangle", start: t, dur: 0.06, peak: 0.2, gainNode: g });
        break;
      case "hint":
        this.tone({ freq: 660, type: "sine", start: t, dur: 0.12, peak: 0.22, gainNode: g, glideTo: 880 });
        break;
      case "ai":
        this.tone({ freq: 392, type: "sawtooth", start: t, dur: 0.14, peak: 0.14, gainNode: g, glideTo: 587 });
        break;
      case "submit":
        this.tone({ freq: 523.25, type: "sine", start: t, dur: 0.1, peak: 0.25, gainNode: g });
        this.tone({ freq: 783.99, type: "sine", start: t + 0.09, dur: 0.14, peak: 0.22, gainNode: g });
        break;
      case "levelup":
        [523.25, 659.25, 783.99, 1046.5].forEach((f, i) =>
          this.tone({ freq: f, type: "sine", start: t + i * 0.1, dur: 0.16, peak: 0.24, gainNode: g })
        );
        break;
      case "complete":
        [523.25, 659.25, 783.99, 1046.5, 1318.51].forEach((f, i) =>
          this.tone({ freq: f, type: "triangle", start: t + i * 0.12, dur: 0.3, peak: 0.26, gainNode: g })
        );
        break;
    }
  }
}

// Singleton (client-only).
let _engine: SoundEngine | null = null;
export function getSound(): SoundEngine {
  if (typeof window === "undefined") {
    // SSR no-op shim
    return {
      muted: false,
      unlock() {},
      setMuted() {},
      toggleMute() {
        return false;
      },
      play() {},
    } as unknown as SoundEngine;
  }
  if (!_engine) _engine = new SoundEngine();
  return _engine;
}
