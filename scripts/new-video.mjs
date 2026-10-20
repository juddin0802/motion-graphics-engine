// scripts/new-video.mjs
// Prepares project for a new video and safely archives previous video into archived-videos/
// Usage: npm run new-video [optional-video-name]

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

// 1. Check if previous work exists (any .srt or custom scenes)
const hasPreviousSrt = fs.existsSync(inputDir) && fs.readdirSync(inputDir).some((f) => f.toLowerCase().endsWith(".srt"));
const hasCustomScenes = fs.existsSync(path.join(videoDir, "scenes")) && fs.readdirSync(path.join(videoDir, "scenes")).length > 0;

if (hasPreviousSrt || hasCustomScenes) {
  if (!fs.existsSync(archiveDir)) fs.mkdirSync(archiveDir, { recursive: true });

  if (fs.existsSync(inputDir)) {
    fs.cpSync(inputDir, path.join(archiveDir, "input-content"), { recursive: true });
  }
  if (fs.existsSync(videoDir)) {
    fs.cpSync(videoDir, path.join(archiveDir, "video"), { recursive: true });
  }

  console.log(`📦 Previous video files successfully archived:`);
  console.log(`   Location: archived-videos/${path.basename(archiveDir)}/\n`);
}

// 2. Fresh input-content folder
if (fs.existsSync(inputDir)) {
  fs.rmSync(inputDir, { recursive: true, force: true });
}
const freshInputDir = path.join(projectRoot, "input-content");
fs.mkdirSync(path.join(freshInputDir, "assets"), { recursive: true });

const briefTemplate = `# Video Brief & Instructions

## 1. Topic & Client
- Topic:
- Preferred Color Scheme:
- Video Aspect Ratio (landscape / reel / square): landscape

## 2. Asset Checklist
- [ ] Subtitle file (.srt) added to input-content/
- [ ] Voiceover audio file (.mp3 / .wav) added to input-content/
- [ ] Logos or images placed in input-content/assets/

## 3. Special Notes
- 
`;

fs.writeFileSync(path.join(freshInputDir, "brief.md"), briefTemplate, "utf8");

// 3. Reset src/video folder
if (fs.existsSync(videoDir)) {
  fs.rmSync(videoDir, { recursive: true, force: true });
}
fs.mkdirSync(path.join(videoDir, "scenes"), { recursive: true });

const planCode = `/**
 * src/video/scene-plan.ts
 * -------------------------------------------------------------
 * ⭐ Active video scene registration.
 *
 * Runs auto-draft scenes by default once .srt is prepared.
 * AI agents will replace this with custom crafted scenes.
 */
import { generateAutoDraftScenes } from "../lib/auto-draft-scenes";

export const SCENES = generateAutoDraftScenes();
`;

fs.writeFileSync(path.join(videoDir, "scene-plan.ts"), planCode, "utf8");

// 4. Clean previous voiceover audio & assets from public
const publicAssetsDir = path.join(publicDir, "assets");
if (fs.existsSync(publicAssetsDir)) {
  fs.rmSync(publicAssetsDir, { recursive: true, force: true });
  fs.mkdirSync(publicAssetsDir, { recursive: true });
}
for (const ext of [".mp3", ".wav", ".m4a", ".aac", ".ogg", ".flac"]) {
  const oldAudio = path.join(publicDir, `voiceover${ext}`);
  if (fs.existsSync(oldAudio)) fs.rmSync(oldAudio, { force: true });
}

// 5. Initialize clean cues and assets
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

console.log("✅ Project is fresh and ready for your new video!");
console.log("\n👉 Next steps:");
console.log("1. Drop your subtitle file (.srt) and voiceover audio into 'input-content/'.");
console.log("2. (Optional) Place logos/images in 'input-content/assets/'.");
console.log("3. Run: npm run prepare-video");
console.log("4. Run: npm run studio");
console.log("==================================================");
