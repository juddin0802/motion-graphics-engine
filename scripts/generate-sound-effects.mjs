// scripts/generate-sound-effects.mjs
// ভিডিওর জন্য আধুনিক UI ও মোশন সাউন্ড ইফেক্ট (Sound Effects) তৈরি করার স্ক্রিপ্ট।
// তৈরি করা ফাইলগুলো 'public/sound-effects/' ফোল্ডারে সংরক্ষিত হয়।
// রান করার নিয়ম: npm run generate-sound-effects

import fs from "node:fs";

const SAMPLE_RATE = 44100;
let randomSeed = 12345;
const getRandomNumber = () => {
  randomSeed = (randomSeed * 1664525 + 1013904223) >>> 0;
  return (randomSeed / 4294967296) * 2 - 1;
};
const createAudioBuffer = (durationSec) => new Float32Array(Math.floor(durationSec * SAMPLE_RATE));

// বাইকুয়াড ফিল্টার (RBJ Audio Filter)
function createBiquadFilter(type, frequency, q = 0.707) {
  const w0 = (2 * Math.PI * frequency) / SAMPLE_RATE;
  const alpha = Math.sin(w0) / (2 * q);
  const cosW0 = Math.cos(w0);

  let b0, b1, b2, a0 = 1 + alpha, a1 = -2 * cosW0, a2 = 1 - alpha;
  if (type === "lp") {
    b0 = (1 - cosW0) / 2;
    b1 = 1 - cosW0;
    b2 = (1 - cosW0) / 2;
  } else if (type === "hp") {
    b0 = (1 + cosW0) / 2;
    b1 = -(1 + cosW0);
    b2 = (1 + cosW0) / 2;
  } else {
    b0 = alpha;
    b1 = 0;
    b2 = -alpha;
  }

  return {
    b0: b0 / a0,
    b1: b1 / a0,
    b2: b2 / a0,
    a1: a1 / a0,
    a2: a2 / a0,
    x1: 0,
    x2: 0,
    y1: 0,
    y2: 0,
  };
}

const applyFilterSample = (filter, x) => {
  const y = filter.b0 * x + filter.b1 * filter.x1 + filter.b2 * filter.x2 - filter.a1 * filter.y1 - filter.a2 * filter.y2;
  filter.x2 = filter.x1;
  filter.x1 = x;
  filter.y2 = filter.y1;
  filter.y1 = y;
  return y;
};

const updateFilterParams = (filter, type, freq, q) => {
  const updated = createBiquadFilter(type, freq, q);
  Object.assign(filter, {
    b0: updated.b0,
    b1: updated.b1,
    b2: updated.b2,
    a1: updated.a1,
    a2: updated.a2,
  });
};

// রিভার্ব ও লো-পাস পোস্ট প্রসেসিং
function finalizeAudio(audioData, { reverb = 0.12, lowPass = 7500 } = {}) {
  const output = new Float32Array(audioData.length);
  const delayTaps = [
    [0.023, 0.28],
    [0.037, 0.22],
    [0.053, 0.18],
  ].map(([delaySec, gain]) => ({
    delaySamples: Math.floor(delaySec * SAMPLE_RATE),
    gain,
    buffer: new Float32Array(Math.floor(delaySec * SAMPLE_RATE)),
    index: 0,
  }));

  const lpf = createBiquadFilter("lp", lowPass);

  for (let n = 0; n < audioData.length; n++) {
    let wetMix = 0;
    for (const tap of delayTaps) {
      const delayedSample = tap.buffer[tap.index];
      wetMix += delayedSample;
      tap.buffer[tap.index] = audioData[n] + delayedSample * tap.gain;
      tap.index = (tap.index + 1) % tap.delaySamples;
    }
    output[n] = applyFilterSample(lpf, audioData[n] + wetMix * reverb);
  }

  const fadeSamples = Math.floor(0.012 * SAMPLE_RATE);
  for (let i = 0; i < fadeSamples; i++) {
    output[output.length - 1 - i] *= i / fadeSamples;
  }
  return output;
}

/* ---------- সাউন্ড সিন্থেসিস ফাংশনসমূহ ---------- */

// ১. নরম পপ সাউন্ড (কার্ড বা টেক্সট এন্ট্রি)
const synthesizePop = () => {
  const buffer = createAudioBuffer(0.22);
  let phase = 0;
  for (let n = 0; n < buffer.length; n++) {
    const t = n / SAMPLE_RATE;
    const frequency = 190 + 380 * Math.exp(-t / 0.028);
    phase += (2 * Math.PI * frequency) / SAMPLE_RATE;
    const envelope = Math.min(1, t / 0.004) * Math.exp(-t / 0.05);
    buffer[n] = Math.sin(phase) * envelope;
  }
  return finalizeAudio(buffer, { lowPass: 5000 });
};

// ২. ক্রিস্প ক্লিক সাউন্ড (বাটন, চেকমার্ক, সুইচ)
const synthesizeClick = () => {
  const buffer = createAudioBuffer(0.12);
  const hpf = createBiquadFilter("hp", 2600, 0.8);
  let phase = 0;
  for (let n = 0; n < buffer.length; n++) {
    const t = n / SAMPLE_RATE;
    const noiseBurst = applyFilterSample(hpf, getRandomNumber()) * Math.exp(-t / 0.006);
    phase += (2 * Math.PI * 1900) / SAMPLE_RATE;
    buffer[n] = noiseBurst * 0.9 + Math.sin(phase) * Math.exp(-t / 0.012) * 0.45;
  }
  return finalizeAudio(buffer, { reverb: 0.08, lowPass: 9000 });
};

// ৩. নয়েজ সুইপ হেল্পার (Whoosh এবং Swipe-এর জন্য)
const synthesizeNoiseSweep = (duration, startFreq, endFreq, q, fadeInSec, lowPass) => {
  const buffer = createAudioBuffer(duration);
  const bpf = createBiquadFilter("bp", startFreq, q);
  for (let n = 0; n < buffer.length; n++) {
    const t = n / SAMPLE_RATE;
    const normalizedTime = t / duration;
    updateFilterParams(
      bpf,
      "bp",
      startFreq * Math.pow(endFreq / startFreq, normalizedTime * normalizedTime * (3 - 2 * normalizedTime)),
      q,
    );
    const attack = Math.min(1, t / fadeInSec);
    const decay = Math.min(1, (duration - t) / (duration * 0.5));
    const envelope = Math.sin((attack * Math.PI) / 2) * Math.sin(Math.max(0, decay) * Math.PI / 2);
    buffer[n] = applyFilterSample(bpf, getRandomNumber()) * envelope;
  }
  return finalizeAudio(buffer, { reverb: 0.1, lowPass });
};

// ৪. সিনেমাটিক হুশ সাউন্ড (সিনের শুরু বা বড় ট্রানজিশন)
const synthesizeWhoosh = () => synthesizeNoiseSweep(0.7, 350, 2400, 1.1, 0.26, 6000);

// ৫. ছোট ও দ্রুত সুইপ সাউন্ড (সিনের এক্সিট)
const synthesizeSwipe = () => synthesizeNoiseSweep(0.34, 900, 3400, 1.3, 0.1, 7000);

// ৬. মিউজিক্যাল চাইম সাউন্ড (সাফল্য, CTA বা লোগো রিভিল)
const synthesizeChime = () => {
  const buffer = createAudioBuffer(0.5);
  const harmonics = [
    [880, 1, 0.14],
    [1318.5, 0.5, 0.11],
    [1760, 0.22, 0.08],
    [2637, 0.1, 0.05],
  ];
  for (let n = 0; n < buffer.length; n++) {
    const t = n / SAMPLE_RATE;
    let sample = 0;
    for (const [freq, amp, tau] of harmonics) {
      sample += Math.sin(2 * Math.PI * freq * t) * amp * Math.exp(-t / tau);
    }
    buffer[n] = sample * Math.min(1, t / 0.005);
  }
  return finalizeAudio(buffer, { reverb: 0.14, lowPass: 5500 });
};

// ৭. গম্ভীর থাড সাউন্ড (ভিডিওর শুরু বা শক্তিশালী হুক)
const synthesizeThud = () => {
  const buffer = createAudioBuffer(0.36);
  let phase = 0;
  for (let n = 0; n < buffer.length; n++) {
    const t = n / SAMPLE_RATE;
    phase += (2 * Math.PI * (52 + 60 * Math.exp(-t / 0.04))) / SAMPLE_RATE;
    buffer[n] = Math.sin(phase) * Math.min(1, t / 0.007) * Math.exp(-t / 0.085);
  }
  return finalizeAudio(buffer, { reverb: 0.05, lowPass: 1400 });
};

// WAV ফাইল রাইটার
function saveWavFile(soundName, audioSamples, peakVolume = 0.89) {
  let maxAbs = 0;
  for (const sample of audioSamples) maxAbs = Math.max(maxAbs, Math.abs(sample));
  const gain = peakVolume / maxAbs;

  const pcmBuffer = Buffer.alloc(44 + audioSamples.length * 2);
  pcmBuffer.write("RIFF", 0);
  pcmBuffer.writeUInt32LE(36 + audioSamples.length * 2, 4);
  pcmBuffer.write("WAVE", 8);
  pcmBuffer.write("fmt ", 12);
  pcmBuffer.writeUInt32LE(16, 16);
  pcmBuffer.writeUInt16LE(1, 20);
  pcmBuffer.writeUInt16LE(1, 22);
  pcmBuffer.writeUInt32LE(SAMPLE_RATE, 24);
  pcmBuffer.writeUInt32LE(SAMPLE_RATE * 2, 28);
  pcmBuffer.writeUInt16LE(2, 32);
  pcmBuffer.writeUInt16LE(16, 34);
  pcmBuffer.write("data", 36);
  pcmBuffer.writeUInt32LE(audioSamples.length * 2, 40);

  for (let i = 0; i < audioSamples.length; i++) {
    pcmBuffer.writeInt16LE(
      Math.max(-32767, Math.min(32767, Math.round(audioSamples[i] * gain * 32767))),
      44 + i * 2,
    );
  }

  const outputDirectory = new URL("../public/sound-effects/", import.meta.url);
  fs.mkdirSync(outputDirectory, { recursive: true });
  fs.writeFileSync(new URL(`../public/sound-effects/${soundName}.wav`, import.meta.url), pcmBuffer);
}

const SOUND_EFFECTS_KIT = {
  pop: synthesizePop,
  click: synthesizeClick,
  whoosh: synthesizeWhoosh,
  swipe: synthesizeSwipe,
  chime: synthesizeChime,
  thud: synthesizeThud,
};

console.log("🔊 Generating clean motion sound effects into public/sound-effects/...");

for (const [name, generatorFn] of Object.entries(SOUND_EFFECTS_KIT)) {
  randomSeed = 12345;
  saveWavFile(name, generatorFn());
}

console.log("✅ All sound effects generated successfully!");
