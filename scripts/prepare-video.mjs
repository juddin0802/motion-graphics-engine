// scripts/prepare-video.mjs
// input-content/ ফোল্ডারের SRT, অডিও ও অ্যাসেট প্রসেস করে src/generated/ এবং public/ এ প্রস্তুত করে।
// রান করার নিয়ম: npm run prepare-video

import fs from "node:fs";
import path from "node:path";

const projectRoot = process.cwd();
const inputDir = fs.existsSync(path.join(projectRoot, "input-content"))
  ? path.join(projectRoot, "input-content")
  : path.join(projectRoot, "input");
const publicDir = path.join(projectRoot, "public");
const generatedDir = path.join(projectRoot, "src", "generated");

// ফোল্ডার তৈরি নিশ্চিত করা
if (!fs.existsSync(generatedDir)) fs.mkdirSync(generatedDir, { recursive: true });
if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });
const publicAssetsDir = path.join(publicDir, "assets");
if (!fs.existsSync(publicAssetsDir)) fs.mkdirSync(publicAssetsDir, { recursive: true });

console.log("==================================================");
console.log("🎬 Remotion Motion Graphics - Video Asset Preparation");
console.log("==================================================\n");

// ১. SRT ফাইল পার্সিং
const srtPath = path.join(inputDir, "voiceover.srt");
let cues = [];

if (fs.existsSync(srtPath)) {
  const rawSrt = fs.readFileSync(srtPath, "utf8").replace(/\r/g, "");
  const blocks = rawSrt.trim().split(/\n\s*\n/);

  const timeStringToSeconds = (t) => {
    const [h, m, rest] = t.split(":");
    const [s, ms] = rest.split(",");
    return Number(h) * 3600 + Number(m) * 60 + Number(s) + Number(ms) / 1000;
  };

  for (const block of blocks) {
    const lines = block.split("\n");
    if (lines.length >= 2) {
      const cueNumber = parseInt(lines[0].trim(), 10);
      const timeParts = lines[1].split(" --> ");
      if (timeParts.length === 2) {
        const start = timeStringToSeconds(timeParts[0].trim());
        const end = timeStringToSeconds(timeParts[1].trim());
        const text = lines.slice(2).join(" ").trim();
        cues.push({ n: cueNumber, start, end, text });
      }
    }
  }
  console.log(`✅ [SRT] সফলভাবে পার্স করা হয়েছে: ${cues.length} টি cue লাইন পাওয়া গেছে।`);
  if (cues.length > 0) {
    console.log(`   ভিডিওর মোট কথ্য সময়: ${cues[cues.length - 1].end.toFixed(2)} সেকেন্ড।`);
  }
} else {
  console.warn("⚠️ [SRT] input-content/voiceover.srt ফাইল পাওয়া যায়নি!");
  console.warn("   ডিফল্ট ডামি কিউ দিয়ে ফাইল তৈরি করা হচ্ছে।");
}

const cuesCode = `// এই ফাইলটি scripts/prepare-video.mjs দিয়ে স্বয়ংক্রিয়ভাবে তৈরি হয়েছে।
// সরাসরি এডিট করবেন না। input-content/voiceover.srt আপডেট করে 'npm run prepare-video' চালান।

export type Cue = {
  /** সাবটাইটেল লাইনের ক্রমিক নম্বর (১ থেকে শুরু) */
  n: number;
  /** লাইন শুরুর সময় (সেকেন্ডে) */
  start: number;
  /** লাইন শেষের সময় (সেকেন্ডে) */
  end: number;
  /** লাইনে উচ্চারিত পাঠ্য/টেক্সট */
  text: string;
};

export const CUES: Cue[] = ${JSON.stringify(cues, null, 2)};
`;

fs.writeFileSync(path.join(generatedDir, "cues.ts"), cuesCode, "utf8");

// ২. অডিও ফাইল স্ক্যান ও কপি
const supportedAudioExts = [".mp3", ".wav", ".m4a", ".aac", ".ogg"];
let foundAudioName = null;

if (fs.existsSync(inputDir)) {
  const inputFiles = fs.readdirSync(inputDir);
  const audioFile = inputFiles.find((f) => {
    const ext = path.extname(f).toLowerCase();
    return supportedAudioExts.includes(ext) && f.toLowerCase().startsWith("voiceover");
  }) || inputFiles.find((f) => supportedAudioExts.includes(path.extname(f).toLowerCase()));

  if (audioFile) {
    const ext = path.extname(audioFile).toLowerCase();
    const targetAudioName = `voiceover${ext}`;
    fs.copyFileSync(path.join(inputDir, audioFile), path.join(publicDir, targetAudioName));
    foundAudioName = targetAudioName;
    console.log(`✅ [Audio] ভয়েসওভার অডিও পাওয়া গেছে: '${audioFile}' -> public/${targetAudioName}`);
  }
}

if (!foundAudioName) {
  console.log("ℹ️ [Audio] কোনো ভয়েস অডিও পাওয়া যায়নি (ভিডিও নিঃশব্দে বা শুধু SFX দিয়ে চলবে)।");
}

// ৩. input/assets স্ক্যান ও কপি
const inputAssetsDir = path.join(inputDir, "assets");
const discoveredAssets = [];

function copyRecursive(src, dest, relPrefix = "") {
  if (!fs.existsSync(src)) return;
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    const relPath = relPrefix ? `${relPrefix}/${entry.name}` : entry.name;
    if (entry.isDirectory()) {
      if (!fs.existsSync(destPath)) fs.mkdirSync(destPath, { recursive: true });
      copyRecursive(srcPath, destPath, relPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
      discoveredAssets.push(relPath.replace(/\\/g, "/"));
    }
  }
}

copyRecursive(inputAssetsDir, publicAssetsDir);
console.log(`✅ [Assets] অতিরিক্ত অ্যাসেট/লোগো পাওয়া গেছে: ${discoveredAssets.length} টি।`);

const assetsCode = `// এই ফাইলটি scripts/prepare-video.mjs দিয়ে স্বয়ংক্রিয়ভাবে তৈরি হয়েছে।
// সরাসরি এডিট করবেন না।

/** প্রস্তুতকৃত ভয়েসওভার ফাইলের নাম (public ফোল্ডারে)। না থাকলে null */
export const VOICEOVER_FILE: string | null = ${foundAudioName ? JSON.stringify(foundAudioName) : "null"};

/** input/assets/ ফোল্ডার থেকে পাওয়া সব ফাইল নেম */
export const ASSETS = ${JSON.stringify(discoveredAssets, null, 2)} as const;
`;

fs.writeFileSync(path.join(generatedDir, "assets.ts"), assetsCode, "utf8");

console.log("\n🚀 প্রস্তুতি সম্পন্ন! এখন প্রিভিউ দেখতে চালান: npm run studio");
console.log("==================================================");
