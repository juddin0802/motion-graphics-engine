/**
 * src/lib/scene-shell-wrapper.tsx
 * -------------------------------------------------------------
 * প্রতিটি সিনকে ঘিরে রাখার মোশন শেল ও ট্রানজিশন র‍্যাপার।
 *
 * সিনের শেষ অংশে এটি স্বয়ংক্রিয়ভাবে একটি মসৃণ এক্সিট অ্যানিমেশন (Exit Fade, Upward Drift, Blur)
 * এবং হালকা লাইট সুইপ ট্রানজিশন যোগ করে, সাথে একটি প্রফেশনাল সুইপ সাউন্ড ইফেক্ট বাজায়।
 */
import React from "react";
import { Sequence, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { createColorWithAlpha, theme } from "../video-theme";
import { SceneContext } from "./scene-context";
import { SfxSound } from "./motion-ui-components";

const DEFAULT_EXIT_DURATION_FRAMES = 8;
const CLAMP_SETTINGS = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/**
 * সিনের ভেতরের কন্টেন্টের এক্সিট ট্রানজিশন
 */
const SceneExitTransition: React.FC<{
  exitFrames: number;
  isLastScene: boolean;
  children: React.ReactNode;
}> = ({ exitFrames, isLastScene, children }) => {
  const currentFrame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const exitProgress = isLastScene
    ? 0
    : interpolate(
        currentFrame,
        [durationInFrames - exitFrames, durationInFrames - 1],
        [0, 1],
        { ...CLAMP_SETTINGS, easing: theme.ease.in },
      );

  const lightSweepProgress = isLastScene
    ? -1
    : interpolate(
        currentFrame,
        [durationInFrames - exitFrames - 3, durationInFrames - 1],
        [0, 1],
        { ...CLAMP_SETTINGS, easing: theme.ease.inOut },
      );

  return (
    <div style={{ position: "absolute", inset: 0 }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 1 - exitProgress,
          transform: `translateY(${-exitProgress * 26}px) scale(${1 - exitProgress * 0.015})`,
          filter: `blur(${exitProgress * 6}px)`,
        }}
      >
        {children}
      </div>

      {lightSweepProgress > 0 && lightSweepProgress < 1 ? (
        <div
          style={{
            position: "absolute",
            top: -200,
            bottom: -200,
            width: 420,
            left: -600 + lightSweepProgress * 3000,
            transform: "skewX(-18deg)",
            background: `linear-gradient(90deg, transparent, ${createColorWithAlpha(
              theme.colors.primary,
              0.28,
            )}, ${createColorWithAlpha(theme.colors.accent, 0.2)}, transparent)`,
          }}
        />
      ) : null}
    </div>
  );
};

/**
 * প্রতিটি সিনের জন্য স্ট্যান্ডার্ড মোশন শেল র‍্যাপার
 */
export const SceneShellWrapper: React.FC<{
  from: number;
  duration: number;
  last?: boolean;
  exit?: number;
  children: React.ReactNode;
}> = ({ from, duration, last = false, exit = DEFAULT_EXIT_DURATION_FRAMES, children }) => (
  <Sequence from={from} durationInFrames={duration}>
    <SceneContext.Provider value={{ startFrame: from }}>
      <SceneExitTransition exitFrames={exit} isLastScene={last}>
        {children}
      </SceneExitTransition>
      {last ? null : <SfxSound name="swipe" frame={duration - exit - 4} rate={1} />}
    </SceneContext.Provider>
  </Sequence>
);

/** ব্যাকওয়ার্ড কম্প্যাটিবিলিটি রি-এক্সপোর্ট */
export const SceneShell = SceneShellWrapper;
