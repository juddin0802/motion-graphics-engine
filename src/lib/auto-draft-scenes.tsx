/**
 * src/lib/auto-draft-scenes.tsx
 * -------------------------------------------------------------
 * স্বয়ংক্রিয় ড্রাফট সিন জেনারেটর (Automatic Scene Draft Engine)।
 *
 * 💡 এটি কীভাবে কাজ করে:
 * ১. নতুন কোনো ভিডিওর জন্য যখনই input/voiceover.srt যুক্ত করে `npm run prepare-video` চালানো হয়,
 *    তখন কোনো কাস্টম কোড না লিখেই Remotion Studio-তে একটি সম্পূর্ণ অ্যানিমেটেড ড্রাফট ভিডিও চালু হয়ে যায়।
 * ২. প্রতিটি সিনে টেক্সট শব্দ ধরে আসে (Bangla-safe), থিমের রঙে মানানসই SVG আইকন থাকে,
 *    এবং সিনভেদে ৩ ধরনের ভিন্ন ভিন্ন লেআউট রোটেশন করে প্রদর্শিত হয় (যাতে একঘেয়ে না লাগে)।
 * ৩. এরপর AI এজেন্ট বা ইউজার `src/video/scenes/` ফোল্ডারে সুনির্দিষ্ট কাস্টম দৃশ্য তৈরি করতে পারেন।
 */
import React, { useContext } from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { CUES, type Cue } from "../generated/cues";
import { theme, createColorWithAlpha } from "../video-theme";
import { FRAME_RATE, HAS_SUBTITLE_CUES, TOTAL_VIDEO_FRAMES } from "../srt-timing";
import { SceneContext, useAbsoluteSecondsToSceneFrames } from "./scene-context";
import { VectorIcon, type IconName } from "./vector-icons";
import { buildVideoScenes, type CalculatedVideoScene } from "./video-scene-builder";
import { BadgeChip, PopEntrance, SfxSound, WordByWordText, useSpringProgress } from "./motion-ui-components";

const CLAMP_SETTINGS = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/* ---------- ১. SRT লাইন গ্রুপ করার নিয়ম ---------- */
const GROUPING_CRITERIA = {
  maxCuesPerScene: 3,
  maxSecondsPerScene: 8,
  breakSilenceSeconds: 0.6,
  tinyCueThresholdSeconds: 0.6,
};

export type SubtitleCueGroup = { index: number; cues: Cue[] };

/**
 * সাবটাইটেল লাইনগুলোকে অর্থপূর্ণ সিনে ভাগ করে
 */
export const groupSubtitleCues = (cuesList: Cue[] = CUES): SubtitleCueGroup[] => {
  const groups: Cue[][] = [];
  let currentGroup: Cue[] = [];

  for (const c of cuesList) {
    if (currentGroup.length === 0) {
      currentGroup.push(c);
      continue;
    }
    const firstCue = currentGroup[0];
    const previousCue = currentGroup[currentGroup.length - 1];
    const isTinyCue = c.end - c.start < GROUPING_CRITERIA.tinyCueThresholdSeconds;

    const shouldStartNewScene =
      !isTinyCue &&
      (c.start - previousCue.end >= GROUPING_CRITERIA.breakSilenceSeconds ||
        currentGroup.length >= GROUPING_CRITERIA.maxCuesPerScene ||
        c.end - firstCue.start > GROUPING_CRITERIA.maxSecondsPerScene);

    if (shouldStartNewScene) {
      groups.push(currentGroup);
      currentGroup = [c];
    } else {
      currentGroup.push(c);
    }
  }

  if (currentGroup.length > 0) groups.push(currentGroup);
  return groups.map((g, index) => ({ index, cues: g }));
};
export const groupCues = groupSubtitleCues;

/* ---------- ২. অ্যানিমেটেড অরবিট ভিজ্যুয়াল ---------- */
const DRAFT_ICONS: IconName[] = [
  "zap", "target", "chat", "globe", "bot", "check", "bell", "send", "link", "pulse", "db", "tag",
];

const OrbitMotionGraphic: React.FC<{
  cx: number;
  cy: number;
  size: number;
  icon: IconName;
  delay: number;
  pulseTriggerFrames: number[];
  faint?: boolean;
}> = ({ cx, cy, size, icon, delay, pulseTriggerFrames, faint = false }) => {
  const frame = useCurrentFrame();
  const progress = useSpringProgress(delay, "smooth");
  const strokeDraw = interpolate(frame, [delay, delay + 30], [0, 1], { ...CLAMP_SETTINGS, easing: theme.ease.out });
  const centerCoord = size / 2;
  const radiusOuter = size * 0.48;
  const radiusMid = size * 0.36;
  const radiusInner = size * 0.24;
  const spinDegree = frame * 0.4;

  const lastTrigger = pulseTriggerFrames.filter((t) => t <= frame).pop();
  const pulseAge = lastTrigger === undefined ? -1 : frame - lastTrigger;
  const rippleProgress = pulseAge >= 0 && pulseAge < 30 ? theme.ease.out(pulseAge / 30) : -1;

  const orbitingDots = [
    { r: radiusOuter, speed: 0.9, phase: 0, color: theme.colors.accent },
    { r: radiusMid, speed: -1.3, phase: 140, color: theme.colors.primary },
    { r: radiusOuter, speed: 0.9, phase: 200, color: theme.colors.primary },
  ];
  const centerTileSize = size * 0.3;
  const breathingScale = 1 + Math.sin(frame / 22) * 0.02;

  return (
    <div
      style={{
        position: "absolute",
        left: cx - centerCoord,
        top: cy - centerCoord,
        width: size,
        height: size,
        opacity: frame >= delay ? Math.min(1, progress * 1.4) * (faint ? 0.38 : 1) : 0,
        transform: `scale(${0.82 + 0.18 * progress}) rotate(${(1 - progress) * -25}deg)`,
      }}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
        <g transform={`rotate(${spinDegree} ${centerCoord} ${centerCoord})`}>
          <circle cx={centerCoord} cy={centerCoord} r={radiusOuter} fill="none" stroke={createColorWithAlpha(theme.colors.textDim, 0.35)} strokeWidth={2} strokeDasharray="4 16" />
        </g>
        <g transform={`rotate(${-90 + spinDegree * 0.6} ${centerCoord} ${centerCoord})`}>
          <circle
            cx={centerCoord}
            cy={centerCoord}
            r={radiusMid}
            fill="none"
            stroke={theme.colors.primary}
            strokeWidth={6}
            strokeLinecap="round"
            pathLength={1}
            strokeDasharray={`${0.68 * strokeDraw} 1`}
          />
        </g>
        <circle cx={centerCoord} cy={centerCoord} r={radiusInner} fill="none" stroke={theme.colors.border} strokeWidth={2} />
        {rippleProgress >= 0 ? (
          <circle
            cx={centerCoord}
            cy={centerCoord}
            r={radiusInner + (radiusOuter - radiusInner) * rippleProgress}
            fill="none"
            stroke={theme.colors.accent}
            strokeWidth={3}
            opacity={(1 - rippleProgress) * 0.8}
          />
        ) : null}
        {orbitingDots.map((dot, i) => {
          const angle = ((frame * dot.speed + dot.phase) * Math.PI) / 180;
          return (
            <circle
              key={i}
              cx={centerCoord + dot.r * Math.cos(angle)}
              cy={centerCoord + dot.r * Math.sin(angle)}
              r={size * 0.016}
              fill={dot.color}
              opacity={strokeDraw}
              style={{ filter: `drop-shadow(0 0 ${size * 0.02}px ${dot.color})` }}
            />
          );
        })}
      </svg>
      <div
        style={{
          position: "absolute",
          left: centerCoord - centerTileSize / 2,
          top: centerCoord - centerTileSize / 2,
          width: centerTileSize,
          height: centerTileSize,
          boxSizing: "border-box",
          borderRadius: theme.radius.node,
          transform: `scale(${breathingScale})`,
          background: `linear-gradient(160deg, ${theme.colors.bgAlt}, ${theme.colors.nodeFill})`,
          border: `3px solid ${createColorWithAlpha(theme.colors.primary, 0.6)}`,
          boxShadow: `0 0 ${size * 0.12}px ${theme.colors.glow}, 0 30px 60px -20px ${theme.colors.shadow}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <VectorIcon name={icon} size={centerTileSize * 0.5} color={theme.colors.text} stroke={1.7} />
      </div>
    </div>
  );
};

const calculateOptimalFontSize = (cuesList: Cue[], boxWidth: number, boxHeight: number, maxAllowedSize: number): number => {
  const totalCharacters = cuesList.reduce((sum, c) => sum + c.text.length, 0) + cuesList.length * 6;
  const estimatedSize = Math.sqrt((0.5 * boxWidth * boxHeight) / (totalCharacters * 0.6 * 1.45));
  return Math.round(Math.max(34, Math.min(maxAllowedSize, estimatedSize)));
};

const RenderCueTextLines: React.FC<{
  cues: Cue[];
  size: number;
  align: "left" | "center";
  maxWidth: number;
}> = ({ cues, size, align, maxWidth }) => {
  const getSceneFrame = useAbsoluteSecondsToSceneFrames();
  const currentFrame = useCurrentFrame();

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: Math.round(size * 0.3),
        alignItems: align === "center" ? "center" : "flex-start",
      }}
    >
      {cues.map((c, i) => {
        const cleanedText = c.text.replace(/\s+/g, " ").trim();
        const wordsArray = cleanedText.split(" ");
        const lineStartFrame = getSceneFrame(c.start);
        const nextStartFrame = i + 1 < cues.length ? getSceneFrame(cues[i + 1].start) : null;
        const dimOpacity =
          nextStartFrame === null
            ? 0
            : interpolate(currentFrame, [nextStartFrame, nextStartFrame + 10], [0, 1], {
                ...CLAMP_SETTINGS,
                easing: theme.ease.out,
              });

        const framesPerWord = Math.max(
          3,
          Math.min(8, Math.round(((c.end - c.start) * FRAME_RATE * 0.75) / wordsArray.length)),
        );
        const englishWordIndices = wordsArray
          .map((w, index) => (/[A-Za-z]/.test(w) ? index : -1))
          .filter((idx) => idx >= 0);

        return (
          <div
            key={c.n}
            style={{
              opacity: 1 - 0.55 * dimOpacity,
              transform: `scale(${1 - 0.04 * dimOpacity})`,
              transformOrigin: align === "center" ? "center" : "left center",
            }}
          >
            <WordByWordText
              text={cleanedText}
              delay={lineStartFrame}
              per={framesPerWord}
              size={size}
              align={align}
              hl={englishWordIndices}
              gap={Math.round(size * 0.26)}
              lineHeight={1.4}
              maxWidth={maxWidth}
            />
          </div>
        );
      })}
    </div>
  );
};

const VideoProgressBar: React.FC = () => {
  const frame = useCurrentFrame();
  const { width: W, height: H } = useVideoConfig();
  const { startFrame } = useContext(SceneContext);
  const overallProgress = Math.min(1, (frame + startFrame) / TOTAL_VIDEO_FRAMES);

  return (
    <div
      style={{
        position: "absolute",
        left: W * 0.07,
        right: W * 0.07,
        bottom: H * 0.05,
        height: 6,
        borderRadius: 6,
        background: createColorWithAlpha(theme.colors.textDim, 0.18),
        overflow: "hidden",
      }}
    >
      <div
        style={{
          width: `${overallProgress * 100}%`,
          height: "100%",
          borderRadius: 6,
          background: `linear-gradient(90deg, ${theme.colors.primary}, ${theme.colors.accent})`,
        }}
      />
    </div>
  );
};

/* ---------- ৩. সিন ভ্যারিয়েন্ট ও রেন্ডার ---------- */

type SceneLayoutVariant = "hook" | "split" | "card" | "center" | "outro";
const MIDDLE_VARIANTS: SceneLayoutVariant[] = ["split", "card", "center"];

const selectLayoutVariant = (sceneIndex: number, totalScenesCount: number): SceneLayoutVariant => {
  if (totalScenesCount > 1 && sceneIndex === 0) return "hook";
  if (totalScenesCount > 2 && sceneIndex === totalScenesCount - 1) return "outro";
  const chosen = MIDDLE_VARIANTS[(sceneIndex - 1 + MIDDLE_VARIANTS.length) % MIDDLE_VARIANTS.length];
  if (chosen === "center" && sceneIndex === totalScenesCount - 2) return "split";
  return chosen;
};

const AutoDraftScene: React.FC<{ group: SubtitleCueGroup; totalScenes: number }> = ({ group, totalScenes }) => {
  const { width: W, height: H } = useVideoConfig();
  const getSceneFrame = useAbsoluteSecondsToSceneFrames();
  const isPortraitMode = H > W;
  const layoutVariant = selectLayoutVariant(group.index, totalScenes);
  const sceneStartFrame = getSceneFrame(group.cues[0].start);
  const pulseTriggerFrames = group.cues.map((c) => getSceneFrame(c.start));
  const chosenIcon = DRAFT_ICONS[group.index % DRAFT_ICONS.length];
  const counterText = `${String(group.index + 1).padStart(2, "0")} / ${String(totalScenes).padStart(2, "0")}`;

  let visualContent: React.ReactNode;
  if (layoutVariant === "split") {
    const textBox = isPortraitMode
      ? { x: W * 0.07, y: H * 0.5, w: W * 0.86, h: H * 0.36 }
      : { x: W * 0.07, y: H * 0.2, w: W * 0.5, h: H * 0.64 };
    const orbitArea = isPortraitMode
      ? { cx: W / 2, cy: H * 0.3, size: W * 0.62 }
      : { cx: W * 0.78, cy: H * 0.53, size: H * 0.56 };
    const fontSize = calculateOptimalFontSize(group.cues, textBox.w, textBox.h, 96);

    visualContent = (
      <>
        <OrbitMotionGraphic {...orbitArea} icon={chosenIcon} delay={sceneStartFrame + 4} pulseTriggerFrames={pulseTriggerFrames} />
        <div style={{ position: "absolute", left: textBox.x, top: textBox.y, width: textBox.w, height: textBox.h, display: "flex", alignItems: "center" }}>
          <RenderCueTextLines cues={group.cues} size={fontSize} align="left" maxWidth={textBox.w} />
        </div>
      </>
    );
  } else if (layoutVariant === "card") {
    const cardBox = isPortraitMode
      ? { x: W * 0.07, y: H * 0.24, w: W * 0.86, h: H * 0.56 }
      : { x: W * 0.08, y: H * 0.2, w: W * 0.84, h: H * 0.64 };
    const cardPadding = Math.round(Math.min(W, H) * 0.06);
    const fontSize = calculateOptimalFontSize(group.cues, cardBox.w - cardPadding * 2 - 30, cardBox.h - cardPadding * 2, 90);
    const orbitGraphicSize = Math.min(W, H) * 0.26;

    visualContent = (
      <>
        <PopEntrance
          delay={sceneStartFrame}
          cfg="smooth"
          y={50}
          scale={0.95}
          style={{
            position: "absolute",
            left: cardBox.x,
            top: cardBox.y,
            width: cardBox.w,
            height: cardBox.h,
            boxSizing: "border-box",
            borderRadius: theme.radius.card * 1.4,
            padding: cardPadding,
            paddingLeft: cardPadding + 30,
            background: `linear-gradient(160deg, ${theme.colors.panelStrong}, ${theme.colors.panel})`,
            border: `2px solid ${theme.colors.border}`,
            boxShadow: `0 40px 80px -24px ${theme.colors.shadow}`,
            display: "flex",
            alignItems: "center",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              left: 0,
              top: "18%",
              bottom: "18%",
              width: 10,
              borderRadius: 10,
              background: `linear-gradient(180deg, ${theme.colors.primary}, ${theme.colors.accent})`,
            }}
          />
          <RenderCueTextLines cues={group.cues} size={fontSize} align="left" maxWidth={cardBox.w - cardPadding * 2 - 30} />
        </PopEntrance>
        <OrbitMotionGraphic
          cx={cardBox.x + cardBox.w - orbitGraphicSize * 0.25}
          cy={cardBox.y + orbitGraphicSize * 0.05}
          size={orbitGraphicSize}
          icon={chosenIcon}
          delay={sceneStartFrame + 8}
          pulseTriggerFrames={pulseTriggerFrames}
        />
      </>
    );
  } else {
    const centeredBox = { x: W * 0.1, y: H * 0.2, w: W * 0.8, h: H * 0.62 };
    const fontSize = calculateOptimalFontSize(group.cues, centeredBox.w, centeredBox.h, layoutVariant === "hook" ? 128 : 104);

    visualContent = (
      <>
        <OrbitMotionGraphic
          cx={W / 2}
          cy={H * 0.52}
          size={Math.min(W, H) * (layoutVariant === "hook" ? 0.95 : 0.85)}
          icon={chosenIcon}
          delay={sceneStartFrame}
          pulseTriggerFrames={pulseTriggerFrames}
          faint
        />
        <div style={{ position: "absolute", left: centeredBox.x, top: centeredBox.y, width: centeredBox.w, height: centeredBox.h, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <RenderCueTextLines cues={group.cues} size={fontSize} align="center" maxWidth={centeredBox.w} />
        </div>
      </>
    );
  }

  return (
    <>
      <div style={{ position: "absolute", left: W * 0.07, top: H * 0.07 }}>
        <PopEntrance delay={sceneStartFrame} cfg="bouncy" y={16}>
          <BadgeChip text={counterText} tone="primary" solid mono size={Math.round(Math.min(W, H) * 0.024)} />
        </PopEntrance>
      </div>
      {visualContent}
      <VideoProgressBar />
      {layoutVariant === "hook" ? (
        <SfxSound name="thud" frame={sceneStartFrame} vol={0.7} />
      ) : layoutVariant === "outro" ? (
        <SfxSound name="chime" frame={sceneStartFrame} />
      ) : (
        <SfxSound name="whoosh" frame={sceneStartFrame} vol={0.8} />
      )}
      {pulseTriggerFrames.slice(1).map((triggerTime, i) => (
        <SfxSound key={i} name="pop" frame={triggerTime} rate={1 + (i % 3) * 0.04} vol={0.8} />
      ))}
    </>
  );
};

const EmptyInputNotice: React.FC = () => {
  const { width: W, height: H } = useVideoConfig();
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 40,
        padding: W * 0.08,
      }}
    >
      <PopEntrance delay={0} cfg="bouncy">
        <VectorIcon name="inbox" size={Math.min(W, H) * 0.14} color={theme.colors.primary} />
      </PopEntrance>
      <WordByWordText
        text="input ফোল্ডারে voiceover.srt রাখুন"
        delay={6}
        size={Math.min(W, H) * 0.06}
        align="center"
        maxWidth={W * 0.84}
      />
      <PopEntrance delay={20}>
        <BadgeChip text="npm run prepare-video" tone="accent" mono size={Math.round(Math.min(W, H) * 0.035)} />
      </PopEntrance>
    </div>
  );
};

/* ---------- ৪. এক্সপোর্ট ফাংশন ---------- */

/**
 * পুরো SRT সাবটাইটেল থেকে তাৎক্ষণিক অটো-ড্রাফট সিন তৈরি করে
 */
export const generateAutoDraftScenes = (): CalculatedVideoScene[] => {
  if (!HAS_SUBTITLE_CUES) {
    return buildVideoScenes([{ id: "empty-srt-notice", start: 0, component: EmptyInputNotice }]);
  }
  const groupedCues = groupSubtitleCues();
  return buildVideoScenes(
    groupedCues.map((group, index) => {
      const SceneComponent: React.FC = () => <AutoDraftScene group={group} totalScenes={groupedCues.length} />;
      SceneComponent.displayName = `AutoDraftScene${index + 1}`;
      return {
        id: `auto-scene-${index + 1}`,
        start: index === 0 ? 0 : group.cues[0].start,
        component: SceneComponent,
      };
    }),
  );
};

/** ব্যাকওয়ার্ড কম্প্যাটিবিলিটি রি-এক্সপোর্ট */
export const autoScenes = generateAutoDraftScenes;
