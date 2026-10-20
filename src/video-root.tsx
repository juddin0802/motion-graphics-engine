/**
 * src/video-root.tsx
 * -------------------------------------------------------------
 * Remotion ফ্রেমওয়ার্কের মূল এন্ট্রি পয়েন্ট এবং কম্পোজিশন রেজিস্ট্রি।
 *
 * এখানে "Main" আইডি দিয়ে মূল কম্পোজিশন রেজিস্টার করা থাকে।
 * ফলে `remotion studio` এবং `remotion render src/index.ts Main generated-videos/video.mp4` কমান্ড দুটি
 * সরাসরি কাজ করে।
 */
import React from "react";
import { Composition } from "remotion";
import { VideoMainComposition } from "./video-main-composition";
import { theme } from "./video-theme";
import { TOTAL_VIDEO_FRAMES } from "./srt-timing";

export const RemotionVideoRoot: React.FC = () => (
  <Composition
    id="Main"
    component={VideoMainComposition}
    durationInFrames={TOTAL_VIDEO_FRAMES}
    fps={theme.video.fps}
    width={theme.video.width}
    height={theme.video.height}
  />
);

/** ব্যাকওয়ার্ড কম্প্যাটিবিলিটি রি-এক্সপোর্ট */
export const Root = RemotionVideoRoot;
