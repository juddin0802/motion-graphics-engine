// scripts/prepare-video.mjs
// Auto-discovers any .srt, audio (.mp3/.wav/etc.), and visual assets by FORMAT/EXTENSION from input-content/
// Usage: npm run prepare-video

import fs from "node:fs";
import path from "node:path";

const projectRoot = process.cwd();
const inputDir = fs.existsSync(path.join(projectRoot, "input-content"))
  ? path.join(projectRoot, "input-content")
  : path.join(projectRoot, "input");
const publicDir = path.join(projectRoot, "public");
const generatedDir = path.join(projectRoot, "src", "generated");

// Ensure essential folders exist
if (!fs.existsSync(generatedDir)) fs.mkdirSync(generatedDir, { recursive: true });
if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });
const publicAssetsDir = path.join(publicDir, "assets");
if (!fs.existsSync(publicAssetsDir)) fs.mkdirSync(publicAssetsDir, { recursive: true });

console.log("==================================================");
console.log("🎬 Remotion Motion Graphics - Video Asset Preparation");
console.log("==================================================\n");

// 1. SRT FILE AUTO-DISCOVERY BY FORMAT/EXTENSION (.srt)
let foundSrtFilename = null;
let cues = [];

if (fs.existsSync(inputDir)) {
  const inputFiles = fs.readdirSync(inputDir);
  
  // Prioritize files named voiceover.srt, then starting with voiceover, then ANY .srt file
  foundSrtFilename =
    inputFiles.find((f) => f.toLowerCase() === "voiceover.srt") ||
    inputFiles.find((f) => f.toLowerCase().startsWith("voiceover") && f.toLowerCase().endsWith(".srt")) ||
    inputFiles.find((f) => f.toLowerCase().endsWith(".srt"));
}

if (foundSrtFilename) {
  const srtPath = path.join(inputDir, foundSrtFilename);
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

  // Also sync a standard voiceover.srt copy in public for reference
  try {
    fs.copyFileSync(srtPath, path.join(publicDir, "voiceover.srt"));
  } catch (e) {}

  console.log(`✅ [SRT] Found and parsed: '${foundSrtFilename}' (${cues.length} cues).`);
  if (cues.length > 0) {
    console.log(`   Total spoken duration: ${cues[cues.length - 1].end.toFixed(2)} seconds.`);
  }
} else {
  console.warn("⚠️ [SRT] No .srt file found in input-content/ folder!");
  console.warn("   Generating fallback dummy cues.");
}

const cuesCode = `// Generated automatically by scripts/prepare-video.mjs
// Do not edit directly. Update your .srt file in input-content/ and run 'npm run prepare-video'.

export type Cue = {
  /** Subtitle cue line number (1-based) */
  n: number;
  /** Start time in seconds */
  start: number;
  /** End time in seconds */
  end: number;
  /** Spoken text */
  text: string;
};

export const CUES: Cue[] = ${JSON.stringify(cues, null, 2)};
`;

fs.writeFileSync(path.join(generatedDir, "cues.ts"), cuesCode, "utf8");

// 2. AUDIO FILE AUTO-DISCOVERY BY FORMAT/EXTENSION (.mp3, .wav, .m4a, .aac, .ogg, .flac)
const supportedAudioExts = [".mp3", ".wav", ".m4a", ".aac", ".ogg", ".flac"];
let foundAudioName = null;

if (fs.existsSync(inputDir)) {
  const inputFiles = fs.readdirSync(inputDir);

  // Find any supported audio file regardless of name
  const audioFile =
    inputFiles.find((f) => {
      const ext = path.extname(f).toLowerCase();
      return supportedAudioExts.includes(ext) && f.toLowerCase().startsWith("voiceover");
    }) ||
    inputFiles.find((f) => supportedAudioExts.includes(path.extname(f).toLowerCase()));

  if (audioFile) {
    const ext = path.extname(audioFile).toLowerCase();
    const targetAudioName = `voiceover${ext}`;
    fs.copyFileSync(path.join(inputDir, audioFile), path.join(publicDir, targetAudioName));
    foundAudioName = targetAudioName;
    console.log(`✅ [Audio] Voiceover audio detected: '${audioFile}' -> public/${targetAudioName}`);
  }
}

if (!foundAudioName) {
  console.log("ℹ️ [Audio] No audio file detected (video will play silently or with sound effects only).");
}

// 3. ASSETS AUTO-DISCOVERY (input-content/assets/ + any images in input-content/)
const supportedImageExts = [".png", ".jpg", ".jpeg", ".svg", ".webp", ".gif"];
const discoveredAssets = [];

// A. Check input-content/assets/
const inputAssetsDir = path.join(inputDir, "assets");
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

// B. Also auto-discover any image files placed directly in input-content/
if (fs.existsSync(inputDir)) {
  const rootFiles = fs.readdirSync(inputDir, { withFileTypes: true });
  for (const file of rootFiles) {
    if (file.isFile()) {
      const ext = path.extname(file.name).toLowerCase();
      if (supportedImageExts.includes(ext)) {
        const destPath = path.join(publicAssetsDir, file.name);
        fs.copyFileSync(path.join(inputDir, file.name), destPath);
        if (!discoveredAssets.includes(file.name)) {
          discoveredAssets.push(file.name);
        }
      }
    }
  }
}

console.log(`✅ [Assets] Visual assets detected: ${discoveredAssets.length} file(s).`);

const assetsCode = `// Generated automatically by scripts/prepare-video.mjs
// Do not edit directly.

/** Target voiceover filename in public/ (or null if silent) */
export const VOICEOVER_FILE: string | null = ${foundAudioName ? JSON.stringify(foundAudioName) : "null"};

/** Discovered asset filenames from input-content/ */
export const ASSETS = ${JSON.stringify(discoveredAssets, null, 2)} as const;
`;

fs.writeFileSync(path.join(generatedDir, "assets.ts"), assetsCode, "utf8");

console.log("\n🚀 Preparation complete! Run 'npm run studio' to preview live.");
console.log("==================================================");
