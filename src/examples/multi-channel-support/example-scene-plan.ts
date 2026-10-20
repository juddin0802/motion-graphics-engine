/**
 * plan.ts (উদাহরণ): "Multi-channel Support Automation" ভিডিওর সিন তালিকা।
 *
 * ⚠️ এটা শুধু রেফারেন্স। এই সিনগুলো এই ফোল্ডারের voiceover.srt-এর জন্য লেখা।
 * নতুন SRT-এর সাথে চালালে at()/cueStart() এরর দেবে, কারণ cue নম্বর ও শব্দ মিলবে না।
 *
 * আবার চালিয়ে দেখতে চাইলে:
 * 1. এই ফোল্ডারের voiceover.srt → input/voiceover.srt এ কপি করুন
 * 2. src/video/plan.ts এর শেষ লাইন বদলে লিখুন:
 *    export { SCENES } from "../examples/multi-channel-support/plan";
 * 3. npm run studio
 */
import { buildVideoScenes } from "../../lib/video-scene-builder";
import { at, cueStart } from "../../srt-timing";
import { Hook, Problem1, Problem2, Title, Hub, FeatIntro } from "./scenes/HookAndProblemScenes";
import { F1, F2, F3, F4 } from "./scenes/AutomationFeaturesPart1Scenes";
import { F5, F6, F7, F8 } from "./scenes/AutomationFeaturesPart2Scenes";
import { Who, Why, Outro } from "./scenes/AudienceAndCallToActionScenes";

export const SCENES = buildVideoScenes([
  { id: "hook", start: 0, component: Hook },
  { id: "problem1", start: cueStart(4), component: Problem1 },
  { id: "problem2", start: cueStart(6), component: Problem2 },
  { id: "title", start: cueStart(8), component: Title },
  { id: "hub", start: cueStart(9), component: Hub },
  { id: "featIntro", start: cueStart(11), component: FeatIntro },
  { id: "f1", start: cueStart(12), component: F1 },
  { id: "f2", start: cueStart(14), component: F2 },
  // কথার সঙ্গে সঙ্গে শেষ হওয়া সিনে এক্সিট ছোট রাখা হয় (নিরবচ্ছিন্ন বাক্য)
  { id: "f3", start: cueStart(17), component: F3, exit: 6 },
  { id: "f4", start: at(19, "Multi-language support"), component: F4 },
  { id: "f5", start: cueStart(21), component: F5 },
  { id: "f6", start: cueStart(23), component: F6 },
  { id: "f7", start: cueStart(25), component: F7 },
  { id: "f8", start: cueStart(28), component: F8 },
  { id: "who", start: cueStart(32), component: Who },
  { id: "why", start: cueStart(37), component: Why },
  { id: "outro", start: cueStart(43), component: Outro },
]);
