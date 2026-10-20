/**
 * src/voiceover-audio-player.tsx
 * -------------------------------------------------------------
 * ভিডিওর ভয়েসওভার অডিও প্লেয়ার কম্পোনেন্ট।
 *
 * `npm run prepare-video` চালালে input/ ফোল্ডারের ভয়েস ফাইলটি
 * public ফোল্ডারে কপি হয় এবং এখানে স্বয়ংক্রিয়ভাবে লোড হয়।
 * ফাইল না থাকলে এটি কোনো এরর ছাড়াই নীরবে অডিও স্কিপ করে।
 */
import React from "react";
import { Audio, getRemotionEnvironment, staticFile } from "remotion";
import { VOICEOVER_ENABLED_IN_PREVIEW, VOICEOVER_ENABLED_IN_RENDER } from "./video-config";
import { VOICEOVER_FILE } from "./generated/assets";

export const VoiceoverAudioPlayer: React.FC = () => {
  const isCurrentlyRendering = getRemotionEnvironment().isRendering;
  const isAudioEnabled = isCurrentlyRendering
    ? VOICEOVER_ENABLED_IN_RENDER
    : VOICEOVER_ENABLED_IN_PREVIEW;

  if (!isAudioEnabled || !VOICEOVER_FILE) {
    return null;
  }

  return <Audio src={staticFile(VOICEOVER_FILE)} />;
};

/** ব্যাকওয়ার্ড কম্প্যাটিবিলিটি রি-এক্সপোর্ট */
export const PreviewAudio = VoiceoverAudioPlayer;
