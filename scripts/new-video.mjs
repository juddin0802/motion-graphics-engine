// scripts/new-video.mjs
// নতুন ভিডিও তৈরির জন্য প্রজেক্ট প্রস্তুত করে এবং পুরনো ভিডিওকে archived-videos/ ফোল্ডারে নিরাপদে সংরক্ষণ করে।
// রান করার নিয়ম: npm run new-video [ঐচ্ছিক-ভিডিওর-নাম]

import fs from "node:fs";
import path from "node:path";

const projectRoot = process.cwd();
const inputDir = fs.existsSync(path.join(projectRoot, "input-content"))
  ? path.join(projectRoot, "input-content")
  : path.join(projectRoot, "input");
const videoDir = path.join(projectRoot, "src", "video");
const archiveRootDir = fs.existsSync(path.join(projectRoot, "archived-videos"))
  ? path.join(projectRoot, "archived-videos")
  : path.join(projectRoot, "archive");
const publicDir = path.join(projectRoot, "public");

const videoLabel = process.argv[2] ? process.argv[2].replace(/[^a-zA-Z0-9_-]/g, "_") : "project";
const timestamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
const archiveDir = path.join(archiveRootDir, `${timestamp}_${videoLabel}`);

console.log("==================================================");
console.log("✨ Remotion Motion Graphics - Start New Video");
console.log("==================================================\n");

// ১. আগের কাজ থাকলে তা আর্কাইভে ব্যাকআপ করা
const hasPreviousSrt = fs.existsSync(path.join(inputDir, "voiceover.srt"));
const hasCustomScenes = fs.existsSync(path.join(videoDir, "scenes")) && fs.readdirSync(path.join(videoDir, "scenes")).length > 0;

if (hasPreviousSrt || hasCustomScenes) {
  if (!fs.existsSync(archiveDir)) fs.mkdirSync(archiveDir, { recursive: true });

  if (fs.existsSync(inputDir)) {
    fs.cpSync(inputDir, path.join(archiveDir, "input-content"), { recursive: true });
  }
  if (fs.existsSync(videoDir)) {
    fs.cpSync(videoDir, path.join(archiveDir, "video"), { recursive: true });
  }

  console.log(`📦 আপনার আগের ভিডিওর ফাইলগুলো নিরাপদে সংরক্ষণ করা হয়েছে:`);
  console.log(`   ফোল্ডার: archived-videos/${path.basename(archiveDir)}/\n`);
}

// ২. input-content ফোল্ডার ফ্রেশ করা
if (fs.existsSync(inputDir)) {
  fs.rmSync(inputDir, { recursive: true, force: true });
}
const freshInputDir = path.join(projectRoot, "input-content");
fs.mkdirSync(path.join(freshInputDir, "assets"), { recursive: true });

const briefTemplate = `# নতুন ভিডিওর নির্দেশনা ও বিবরণী (Video Brief)

## ১. ক্লায়েন্ট বা ভিডিওর ধরন
- বিষয়বস্তু: 
- কালার স্কিম পছন্দ (যদি থাকে): 
- ভিডিওর সাইজ (landscape / reel / square): landscape

## ২. অ্যাসেট চেকলিস্ট
- [ ] voiceover.srt ফাইল input-content/ ফোল্ডারে যোগ করেছি
- [ ] voiceover.mp3 বা অডিও ফাইল input-content/ ফোল্ডারে যোগ করেছি
- [ ] লোগো বা ছবি থাকলে input-content/assets/ ফোল্ডারে রেখেছি

## ৩. অতিরিক্ত তথ্য বা টেক্সট (যদি থাকে)
- 
`;

fs.writeFileSync(path.join(freshInputDir, "brief.md"), briefTemplate, "utf8");

// ৩. src/video ফোল্ডার রিসেট করা
if (fs.existsSync(videoDir)) {
  fs.rmSync(videoDir, { recursive: true, force: true });
}
fs.mkdirSync(path.join(videoDir, "scenes"), { recursive: true });

const planCode = `/**
 * src/video/scene-plan.ts
 * -------------------------------------------------------------
 * ⭐ চলতি ভিডিওর সিন তালিকা।
 *
 * নতুন SRT যুক্ত করার পর 'npm run prepare-video' চালালে
 * স্বয়ংক্রিয়ভাবে অটো ড্রাফট সিন চালু হয়ে যায়।
 *
 * এজেন্ট বা আপনি কাস্টম সিন লিখতে চাইলে এই ফাইলটি আপডেট করবেন।
 */
import { generateAutoDraftScenes } from "../lib/auto-draft-scenes";

export const SCENES = generateAutoDraftScenes();
`;

fs.writeFileSync(path.join(videoDir, "scene-plan.ts"), planCode, "utf8");

// ৪. public ফোল্ডার থেকে পুরনো ভিডিওর অডিও ও অ্যাসেট পরিষ্কার করা
const publicAssetsDir = path.join(publicDir, "assets");
if (fs.existsSync(publicAssetsDir)) {
  fs.rmSync(publicAssetsDir, { recursive: true, force: true });
  fs.mkdirSync(publicAssetsDir, { recursive: true });
}
for (const ext of [".mp3", ".wav", ".m4a", ".aac"]) {
  const oldAudio = path.join(publicDir, `voiceover${ext}`);
  if (fs.existsSync(oldAudio)) fs.rmSync(oldAudio, { force: true });
}

// ৫. ডামি cues ও assets তৈরি
const generatedDir = path.join(projectRoot, "src", "generated");
if (!fs.existsSync(generatedDir)) fs.mkdirSync(generatedDir, { recursive: true });

fs.writeFileSync(
  path.join(generatedDir, "cues.ts"),
  `export type Cue = { n: number; start: number; end: number; text: string };\nexport const CUES: Cue[] = [];\n`,
  "utf8"
);

fs.writeFileSync(
  path.join(generatedDir, "assets.ts"),
  `export const VOICEOVER_FILE: string | null = null;\nexport const ASSETS = [] as const;\n`,
  "utf8"
);

console.log("✅ প্রজেক্টটি নতুন ভিডিও তৈরির জন্য পুরোপুরি প্রস্তুত!");
console.log("\n👉 পরবর্তী ধাপ:");
console.log("১. আপনার 'voiceover.srt' এবং 'voiceover.mp3' ফাইল দুটি 'input/' ফোল্ডারে রাখুন।");
console.log("২. কোনো লোগো বা ছবি থাকলে তা 'input/assets/' ফোল্ডারে রাখুন।");
console.log("৩. টার্মিনালে চালান: npm run prepare-video");
console.log("৪. প্রিভিউ দেখতে চালান: npm run studio");
console.log("==================================================");
