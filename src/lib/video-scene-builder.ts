/**
 * src/lib/video-scene-builder.ts
 * -------------------------------------------------------------
 * সিনের তালিকা থেকে প্রতিটি সিনের শুরু-ফ্রেম ও স্থায়িত্বকাল (Duration) হিসাব করে।
 *
 * 💡 এটি ইঞ্জিন ফাইল। ইউজার বা এজেন্টের প্রতিটি সিন শুধু বলে দেয় সে কত সেকেন্ডে শুরু হবে।
 * এই বিল্ডার নিজে থেকেই প্রতিটি সিনের ফ্রেম ও ট্রানজিশন ক্যালকুলেট করে নেয়।
 */
import React from "react";
import { convertSecondsToFrames, SPEECH_LEAD_FRAMES, TOTAL_VIDEO_FRAMES } from "../srt-timing";

/** একটি সিনের কনফিগারেশন সংজ্ঞা */
export type VideoSceneDefinition = {
  /** সিনের অনন্য আইডি বা নাম (যেমন: "hook", "features-overview", "call-to-action") */
  id: string;
  /**
   * সিনটি কখন শুরু হবে (সেকেন্ডে)।
   * ⚠️ সবসময় getCueStartTime() অথবা getWordTimeInCue() দিয়ে SRT থেকে নেবেন। প্রথম সিন ০।
   */
  start: number;
  /** সিনের মূল React ভিজ্যুয়াল কম্পোনেন্ট */
  component: React.FC;
  /**
   * সিনের এক্সিট অ্যানিমেশনের ফ্রেম সংখ্যা (ঐচ্ছিক, ডিফল্ট ৮ ফ্রেম)।
   * এক কথার রেশ কাটতে না কাটতে পরের সিন শুরু হলে এক্সিট কম (যেমন ৬) রাখতে পারেন।
   */
  exit?: number;
};

/** ব্যাকওয়ার্ড কম্প্যাটিবিলিটি টাইপ */
export type SceneDef = VideoSceneDefinition;

/** চূড়ান্ত হিসাবের পর Main কম্পোজিশন যা পায় */
export type CalculatedVideoScene = VideoSceneDefinition & {
  from: number;
  duration: number;
  last: boolean;
};
export type Scene = CalculatedVideoScene;

/**
 * সিনের সংজ্ঞার তালিকা থেকে প্রতিটি সিনের ফ্রেম রেঞ্জ হিসাব করে।
 *
 * @param sceneDefinitions - সময়ের ক্রমানুসারে সাজানো সিনের তালিকা
 * @returns মূল রেন্ডারারের জন্য প্রস্তুত সিনের অ্যারে
 * @throws দুটি সিনের একই নাম থাকলে বা সময় উল্টো হলে বাংলায় পরিষ্কার সতর্কবার্তা দেয়।
 *
 * @example
 * export const SCENES = buildVideoScenes([
 *   { id: "intro-hook", start: 0, component: IntroHookScene },
 *   { id: "core-problem", start: getCueStartTime(4), component: ProblemScene },
 * ]);
 */
export const buildVideoScenes = (sceneDefinitions: VideoSceneDefinition[]): CalculatedVideoScene[] => {
  const registeredIds = new Set<string>();
  const startingFrames = sceneDefinitions.map((def, index) =>
    index === 0 ? 0 : Math.max(0, convertSecondsToFrames(def.start) - SPEECH_LEAD_FRAMES),
  );

  return sceneDefinitions.map((def, index) => {
    if (registeredIds.has(def.id)) {
      throw new Error(`[Scene Error] "${def.id}" নামে একাধিক সিন আছে। প্রতিটি সিনের id আলাদা হতে হবে।`);
    }
    registeredIds.add(def.id);

    const from = startingFrames[index];
    const nextStartFrame = index + 1 < sceneDefinitions.length ? startingFrames[index + 1] : TOTAL_VIDEO_FRAMES;

    if (nextStartFrame <= from) {
      throw new Error(
        `[Scene Error] "${def.id}" সিনের দৈর্ঘ্য শূন্য বা নেগেটিভ! সিনগুলো কি সময়ের ক্রমানুসারে সাজানো আছে?`,
      );
    }

    return {
      ...def,
      from,
      duration: nextStartFrame - from,
      last: index === sceneDefinitions.length - 1,
    };
  });
};

/** ব্যাকওয়ার্ড কম্প্যাটিবিলিটি এক্সপোর্ট */
export const buildScenes = buildVideoScenes;
