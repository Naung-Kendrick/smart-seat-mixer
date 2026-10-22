// ── Audio Engine for Smart Seat Mixer ──────────────────────
// Uses Web Audio API for 100% offline, zero-asset fanfare & shuffle audio,
// with optional support for custom audio files / user MP3s.

let audioCtx = null;
let customAudio = null;

function getAudioContext() {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

// ── Synthesized Fanfare Melody & Chords ─────────────────────
// Upbeat celebratory tune played on seat generation
export function playGenerateSong() {
  // If custom audio element has a valid source, play that
  if (customAudio && customAudio.src) {
    try {
      customAudio.currentTime = 0;
      customAudio.play().catch(() => {});
      return;
    } catch (e) {
      // Fallback to synth
    }
  }

  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;

  // Master gain
  const masterGain = ctx.createGain();
  masterGain.gain.setValueAtTime(0.25, now);
  masterGain.connect(ctx.destination);

  // 1. Quick shuffle tick roll (0s to 0.45s)
  for (let i = 0; i < 7; i++) {
    const tickOsc = ctx.createOscillator();
    const tickGain = ctx.createGain();
    const t = now + i * 0.06;

    tickOsc.type = 'triangle';
    tickOsc.frequency.setValueAtTime(280 + i * 40, t);

    tickGain.gain.setValueAtTime(0.15, t);
    tickGain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);

    tickOsc.connect(tickGain);
    tickGain.connect(masterGain);

    tickOsc.start(t);
    tickOsc.stop(t + 0.05);
  }

  // 2. Celebratory Fanfare Melody (C major triad + upbeat resolution)
  // Notes in Hz:
  // G4=392, C5=523.25, E5=659.25, G5=783.99, C6=1046.50
  const melodyNotes = [
    { freq: 392.00, time: 0.45, dur: 0.12 }, // G4
    { freq: 523.25, time: 0.58, dur: 0.12 }, // C5
    { freq: 659.25, time: 0.70, dur: 0.14 }, // E5
    { freq: 783.99, time: 0.84, dur: 0.22 }, // G5
    { freq: 659.25, time: 1.08, dur: 0.12 }, // E5
    { freq: 783.99, time: 1.20, dur: 0.14 }, // G5
    { freq: 1046.50, time: 1.35, dur: 0.65 }, // C6 (long triumphant finish)
  ];

  melodyNotes.forEach(({ freq, time, dur }) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const startTime = now + time;

    // Rich dual-harmonic sound
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, startTime);

    gain.gain.setValueAtTime(0.001, startTime);
    gain.gain.linearRampToValueAtTime(0.35, startTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + dur);

    osc.connect(gain);
    gain.connect(masterGain);

    osc.start(startTime);
    osc.stop(startTime + dur);
  });

  // 3. Harmonizing Chords on the triumphant resolution (1.35s to 2.0s)
  const harmonyNotes = [
    { freq: 523.25, time: 1.35, dur: 0.65 }, // C5
    { freq: 659.25, time: 1.35, dur: 0.65 }, // E5
    { freq: 261.63, time: 1.35, dur: 0.70 }, // C4 (bass root)
  ];

  harmonyNotes.forEach(({ freq, time, dur }) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const startTime = now + time;

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, startTime);

    gain.gain.setValueAtTime(0.001, startTime);
    gain.gain.linearRampToValueAtTime(0.2, startTime + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + dur);

    osc.connect(gain);
    gain.connect(masterGain);

    osc.start(startTime);
    osc.stop(startTime + dur);
  });
}

// ── Custom Audio File Upload Support ───────────────────────
export function setCustomAudioSource(url) {
  if (!customAudio) {
    customAudio = new Audio();
  }
  customAudio.src = url;
}
