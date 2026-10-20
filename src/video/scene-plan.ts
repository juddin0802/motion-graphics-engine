/**
 * src/video/scene-plan.ts
 * -------------------------------------------------------------
 * ⭐ চলতি ভিডিওর সিন পরিকল্পনা ও এক্সিকিউশন প্ল্যান।
 *
 * 💡 এটি কীভাবে কাজ করে:
 * - ডিফল্টভাবে এখানে `generateAutoDraftScenes()` চালু থাকে। ফলে নতুন কোনো SRT দিয়েই
 *   তাৎক্ষণিকভাবে একটি অ্যানিমেটেড প্রিভিউ দেখা যায়।
 * - যখন আপনি বা AI এজেন্ট নতুন স্ক্রিপ্টের জন্য বিশেষ কাস্টম সিন লিখবেন, তখন এই ফাইলে
 *   সিনগুলো এভাবে রেজিস্টার করবেন:
 *
 * @example
 * import { buildVideoScenes } from "../lib/video-scene-builder";
 * import { getCueStartTime, getWordTimeInCue } from "../srt-timing";
 * import { HookScene } from "./scenes/HookScene";
 * import { FeaturesScene } from "./scenes/FeaturesScene";
 * import { OutroScene } from "./scenes/OutroScene";
 *
 * export const SCENES = buildVideoScenes([
 *   { id: "hook", start: 0, component: HookScene },
 *   { id: "features", start: getCueStartTime(12), component: FeaturesScene },
 *   { id: "outro", start: getWordTimeInCue(43, "pricing"), component: OutroScene },
 * ]);
 */
import { generateAutoDraftScenes } from "../lib/auto-draft-scenes";

export const SCENES = generateAutoDraftScenes();
