/**
 * src/lib/scene-context.tsx
 * -------------------------------------------------------------
 * সিনের নিজস্ব ফ্রেম হিসাব করার কনটেক্সট (Context) ও হুক।
 *
 * প্রতিটি সিন যখন একটি Sequence-এর ভেতরে চলে, তখন পুরো ভিডিওর বৈশ্বিক সময়কে
 * সিনের স্থানীয় ফ্রেমে রূপান্তর করতে `useAbsoluteSecondsToSceneFrames()` (অথবা সংক্ষেপে `useAbs()`)
 * ব্যবহার করা হয়।
 */
import React, { createContext, useContext } from "react";
import { FRAME_RATE, SPEECH_LEAD_FRAMES } from "../srt-timing";

export const SceneContext = createContext<{ startFrame: number }>({ startFrame: 0 });
export const SceneCtx = SceneContext;

/**
 * SRT-এর বৈশ্বিক সেকেন্ডকে বর্তমান সিনের স্থানীয় ফ্রেম নম্বরে রূপান্তর করার হুক।
 *
 * @example
 * const getSceneFrame = useAbsoluteSecondsToSceneFrames();
 * const entranceFrame = getSceneFrame(getCueStartTime(4));
 */
export const useAbsoluteSecondsToSceneFrames = () => {
  const { startFrame } = useContext(SceneContext);
  return (seconds: number, leadFrames: number = SPEECH_LEAD_FRAMES): number =>
    Math.round(seconds * FRAME_RATE) - startFrame - leadFrames;
};

/** ব্যাকওয়ার্ড কম্প্যাটিবিলিটি সংক্ষেপ */
export const useAbs = useAbsoluteSecondsToSceneFrames;
