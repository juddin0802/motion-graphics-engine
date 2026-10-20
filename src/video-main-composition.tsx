/**
 * src/video-main-composition.tsx
 * -------------------------------------------------------------
 * পুরো ভিডিওর মূল লেয়ার বিন্যাস (ইঞ্জিন ফাইল, সাধারণত কোনো এডিট করার প্রয়োজন হয় না)।
 *
 * ভিডিওর ৫-লেয়ার স্ট্যাক (নিচ থেকে উপরে):
 * ১. ব্যাকগ্রাউন্ড মেশ (BackgroundMesh - কখনো ফ্ল্যাট সলিড ব্যাকগ্রাউন্ড নয়)
 * ২. ফন্ট ও ভয়েস অডিও প্লেয়ার (FontLoader, VoiceoverAudioPlayer)
 * ৩. পর্যায়ক্রমিক সিনসমূহ (src/video/scene-plan.ts থেকে SceneShellWrapper দিয়ে র‍্যাপ করা)
 * ৪. কালার গ্রেড ওভারলে (ColorGradeOverlay)
 * ৫. সিনেমাটিক ভিনিয়েট (VignetteOverlay)
 */
import React from "react";
import { AbsoluteFill } from "remotion";
import { SCENES } from "./video/scene-plan";
import { VoiceoverAudioPlayer } from "./voiceover-audio-player";
import { SceneShellWrapper } from "./lib/scene-shell-wrapper";
import {
  BackgroundMesh,
  ColorGradeOverlay,
  FontLoader,
  VignetteOverlay,
} from "./lib/motion-ui-components";
import { theme } from "./video-theme";

export const VideoMainComposition: React.FC = () => (
  <AbsoluteFill style={{ background: theme.colors.bg, fontFamily: theme.fonts.display }}>
    {/* ফন্ট লোডার (বাংলা যুক্তাক্ষর অফলাইনে রেন্ডার নিশ্চিত করে) */}
    <FontLoader />

    {/* ভয়েসওভার অডিও প্লেয়ার (input/ ফোল্ডারে অডিও থাকলে চলে) */}
    <VoiceoverAudioPlayer />

    {/* লেয়ার ১: ডাইনামিক ব্যাকগ্রাউন্ড মেশ */}
    <BackgroundMesh />

    {/* লেয়ার ২ ও ৩: সিন কন্টেন্ট ও ট্রানজিশন */}
    {SCENES.map((sceneItem) => {
      const SceneComponent = sceneItem.component;
      return (
        <SceneShellWrapper
          key={sceneItem.id}
          from={sceneItem.from}
          duration={sceneItem.duration}
          last={sceneItem.last}
          exit={sceneItem.exit}
        >
          <SceneComponent />
        </SceneShellWrapper>
      );
    })}

    {/* লেয়ার ৪: কালার গ্রেড ওভারলে */}
    <ColorGradeOverlay />

    {/* লেয়ার ৫: সিনেমাটিক ভিনিয়েট */}
    <VignetteOverlay />
  </AbsoluteFill>
);

/** ব্যাকওয়ার্ড কম্প্যাটিবিলিটি রি-এক্সপোর্ট */
export const Main = VideoMainComposition;
