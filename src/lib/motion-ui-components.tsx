/**
 * src/lib/motion-ui-components.tsx
 * -------------------------------------------------------------
 * রিইউজেবল মোশন গ্রাফিক্স UI কম্পোনেন্ট লাইব্রেরি।
 *
 * ⚠️ বাংলা টেক্সট অ্যানিমেশনের গুরুত্বপূর্ণ নিয়ম:
 * ১. বাংলা অক্ষর ভেঙে টাইপ করবেন না। যুক্তাক্ষর বা কার-চিহ্ন ভেঙে যেতে পারে।
 * ২. টেক্সট ভাঙতে হলে সবসময় স্পেস (" ") দিয়ে শব্দ ধরে ধরে ভাঙবেন (Words কম্পোনেন্ট)।
 * ৩. letterSpacing সবসময় ০ রাখবেন।
 */
import React, { useEffect, useState } from "react";
import {
  AbsoluteFill,
  Audio,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useDelayRender,
  useVideoConfig,
} from "remotion";
import { createColorWithAlpha, theme } from "../video-theme";
import { FRAME_RATE } from "../srt-timing";
import { SFX_SOUND_ENABLED } from "../video-config";
import { VectorIcon, type IconName } from "./vector-icons";

export type Tone = "primary" | "accent" | "dim" | "danger" | "warning";

export const getToneColor = (t: Tone): string =>
  t === "primary"
    ? theme.colors.primary
    : t === "accent"
      ? theme.colors.accent
      : t === "danger"
        ? theme.colors.danger
        : t === "warning"
          ? "#F59E0B"
          : theme.colors.textDim;
export const toneColor = getToneColor;

export const getToneSoftBackground = (t: Tone): string =>
  t === "primary"
    ? "rgba(108, 124, 255, 0.16)"
    : t === "accent"
      ? "rgba(52, 211, 153, 0.16)"
      : t === "danger"
        ? "rgba(244, 63, 94, 0.16)"
        : t === "warning"
          ? "rgba(245, 158, 11, 0.16)"
          : "rgba(255, 255, 255, 0.08)";
export const toneSoft = getToneSoftBackground;

const CLAMP_SETTINGS = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/* ---------- ১. ফন্ট লোডার ---------- */
const BENGALI_UNICODE_RANGE =
  "U+0951-0952,U+0964-0965,U+0980-09FE,U+1CD0,U+1CD2,U+1CD5-1CD6,U+1CD8,U+1CE1,U+1CEA,U+1CED,U+1CF2,U+1CF5-1CF7,U+200C-200D,U+20B9,U+25CC,U+A8F1";
const LATIN_UNICODE_RANGE =
  "U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD";

const LOCAL_FONT_FACES = [400, 500, 600, 700]
  .flatMap((weight) => [
    { family: "Hind Siliguri", file: `hind-siliguri-bengali-${weight}-normal.woff2`, weight: String(weight), range: BENGALI_UNICODE_RANGE },
    { family: "Hind Siliguri", file: `hind-siliguri-latin-${weight}-normal.woff2`, weight: String(weight), range: LATIN_UNICODE_RANGE },
  ])
  .concat([600, 700].map((weight) => ({
    family: "JetBrains Mono",
    file: `jetbrains-mono-latin-${weight}-normal.woff2`,
    weight: String(weight),
    range: LATIN_UNICODE_RANGE,
  })));

/**
 * অফলাইনে বাংলা ও ইংরেজি ফন্ট লোড নিশ্চিত করার কম্পোনেন্ট
 */
export const FontLoader: React.FC = () => {
  const { delayRender, continueRender } = useDelayRender();
  const [renderHandle] = useState(() => delayRender("custom-fonts-loader"));

  useEffect(() => {
    Promise.all(
      LOCAL_FONT_FACES.map(async (fontConfig) => {
        const fontFace = new FontFace(
          fontConfig.family,
          `url(${staticFile(`fonts/${fontConfig.file}`)}) format('woff2')`,
          { weight: fontConfig.weight, unicodeRange: fontConfig.range },
        );
        await fontFace.load();
        (document.fonts as unknown as { add: (f: FontFace) => void }).add(fontFace);
      }),
    )
      .then(() => continueRender(renderHandle))
      .catch(() => continueRender(renderHandle));
  }, [renderHandle, continueRender]);

  return null;
};

/* ---------- ২. মোশন হুক ও পপ এন্ট্রান্স ---------- */

export const useSpringProgress = (delayFrames: number, configPreset: keyof typeof theme.spring = "snappy") => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({
    frame: Math.max(0, frame - delayFrames),
    fps,
    config: theme.spring[configPreset],
  });
};
export const useP = useSpringProgress;

/**
 * পপ ও স্মুথ স্প্রিং এন্ট্রান্স অ্যানিমেশন
 */
export const PopEntrance: React.FC<{
  delay?: number;
  cfg?: keyof typeof theme.spring;
  y?: number;
  x?: number;
  scale?: number;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}> = ({ delay = 0, cfg = "smooth", y = 36, x = 0, scale = 0.94, style, children }) => {
  const frame = useCurrentFrame();
  const progress = useSpringProgress(delay, cfg);
  const isVisible = frame >= delay;

  return (
    <div
      style={{
        opacity: isVisible ? interpolate(progress, [0, 0.55], [0, 1], CLAMP_SETTINGS) : 0,
        transform: `translate(${(1 - progress) * x}px, ${(1 - progress) * y}px) scale(${scale + (1 - scale) * progress})`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};
export const Pop = PopEntrance;

/**
 * নিঃশ্বাস নেওয়ার মতো মৃদু ভাসমান অ্যানিমেশন (Breathing Micro-motion)
 */
export const FloatAnimation: React.FC<{
  amp?: number;
  period?: number;
  phase?: number;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}> = ({ amp = 4, period = 60, phase = 0, style, children }) => {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        transform: `translateY(${Math.sin((frame / period) * Math.PI * 2 + phase) * amp}px)`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};
export const Float = FloatAnimation;

/* ---------- ৩. শব্দ ধরে টেক্সট অ্যানিমেশন (Bangla Safe) ---------- */

/**
 * শব্দ ধরে ধরে অ্যানিমেট হওয়া টেক্সট রিভিল কম্পোনেন্ট
 */
export const WordByWordText: React.FC<{
  text: string;
  delay?: number;
  per?: number;
  size?: number;
  weight?: number;
  color?: string;
  hl?: number[];
  hlColor?: string;
  grad?: number[];
  align?: "left" | "center";
  gap?: number;
  lineHeight?: number;
  maxWidth?: number;
  style?: React.CSSProperties;
  mono?: boolean;
}> = ({
  text,
  delay = 0,
  per = 4,
  size = 80,
  weight = theme.weight.heavy,
  color = theme.colors.text,
  hl = [],
  hlColor = theme.colors.accent,
  grad = [],
  align = "left",
  gap = 18,
  lineHeight = 1.4,
  maxWidth,
  style,
  mono,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        columnGap: gap,
        rowGap: 0,
        maxWidth,
        justifyContent: align === "center" ? "center" : "flex-start",
        fontFamily: mono ? theme.fonts.mono : theme.fonts.display,
        fontSize: size,
        fontWeight: weight,
        lineHeight,
        letterSpacing: 0,
        color,
        ...style,
      }}
    >
      {text.split(" ").map((word, wordIndex) => {
        const wordProgress = spring({
          frame: Math.max(0, frame - delay - wordIndex * per),
          fps,
          config: theme.spring.snappy,
        });
        const isGradient = grad.includes(wordIndex);

        return (
          <span
            key={wordIndex}
            style={{
              display: "inline-block",
              opacity: frame >= delay + wordIndex * per ? interpolate(wordProgress, [0, 0.6], [0, 1], CLAMP_SETTINGS) : 0,
              transform: `translateY(${(1 - wordProgress) * 34}px) scale(${0.92 + 0.08 * wordProgress})`,
              filter: `blur(${(1 - wordProgress) * 6}px)`,
              color: hl.includes(wordIndex) ? hlColor : isGradient ? "transparent" : undefined,
              background: isGradient
                ? `linear-gradient(90deg, ${theme.colors.primary}, ${theme.colors.accent})`
                : undefined,
              WebkitBackgroundClip: isGradient ? "text" : undefined,
              backgroundClip: isGradient ? "text" : undefined,
              paddingBottom: isGradient ? 6 : 0,
            }}
          >
            {word}
          </span>
        );
      })}
    </div>
  );
};
export const Words = WordByWordText;

/**
 * হাইলাইট সুইপ: টেক্সটের পেছনে কালার বার বাম থেকে ডানে প্রসারিত হয়
 */
export const HighlightSweep: React.FC<{
  delay: number;
  color?: string;
  children: React.ReactNode;
  pad?: number;
}> = ({ delay, color = theme.colors.primarySoft, children, pad = 10 }) => {
  const frame = useCurrentFrame();
  const sweepProgress = interpolate(frame, [delay, delay + 14], [0, 1], {
    ...CLAMP_SETTINGS,
    easing: theme.ease.out,
  });

  return (
    <span style={{ position: "relative", display: "inline-block", zIndex: 0, padding: `0 ${pad}px` }}>
      <span
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: "12%",
          bottom: "6%",
          borderRadius: 14,
          background: color,
          transformOrigin: "left center",
          transform: `scaleX(${sweepProgress})`,
          zIndex: -1,
        }}
      />
      {children}
    </span>
  );
};
export const HL = HighlightSweep;

export const AbsoluteBox: React.FC<{
  x: number;
  y: number;
  w?: number;
  h?: number;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}> = ({ x, y, w, h, style, children }) => (
  <div style={{ position: "absolute", left: x, top: y, width: w, height: h, ...style }}>{children}</div>
);
export const Abs = AbsoluteBox;

/* ---------- ৪. গ্লাস কার্ড ও ব্যাজ ---------- */

export const GlassCard: React.FC<{
  x: number;
  y: number;
  w: number;
  h: number;
  delay?: number;
  tone?: Tone | null;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  pop?: boolean;
  radius?: number;
}> = ({ x, y, w, h, delay = 0, tone = null, style, children, pop = true, radius = theme.radius.card }) => {
  const cardStyle: React.CSSProperties = {
    position: "absolute",
    left: x,
    top: y,
    width: w,
    height: h,
    borderRadius: radius,
    boxSizing: "border-box",
    background: `linear-gradient(160deg, ${theme.colors.panelStrong}, ${theme.colors.panel})`,
    border: `2px solid ${tone ? createColorWithAlpha(getToneColor(tone), 0.45) : theme.colors.border}`,
    boxShadow: `0 40px 80px -24px ${theme.colors.shadow}`,
    ...style,
  };
  return pop ? <Pop delay={delay} style={cardStyle}>{children}</Pop> : <div style={cardStyle}>{children}</div>;
};
export const Glass = GlassCard;

export const BadgeChip: React.FC<{
  text: string;
  tone?: Tone;
  icon?: IconName;
  size?: number;
  mono?: boolean;
  solid?: boolean;
}> = ({ text, tone = "primary", icon, size = 28, mono, solid }) => (
  <div
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 12,
      padding: `${size * 0.28}px ${size * 0.7}px`,
      borderRadius: theme.radius.pill,
      background: solid ? getToneColor(tone) : getToneSoftBackground(tone),
      border: `2px solid ${createColorWithAlpha(getToneColor(tone), 0.5)}`,
      color: solid ? theme.colors.bg : getToneColor(tone),
      fontFamily: mono ? theme.fonts.mono : theme.fonts.display,
      fontSize: size,
      fontWeight: theme.weight.strong,
      lineHeight: 1.3,
      letterSpacing: 0,
      whiteSpace: "nowrap",
    }}
  >
    {icon ? <VectorIcon name={icon} size={size * 1.1} color={solid ? theme.colors.bg : getToneColor(tone)} /> : null}
    {text}
  </div>
);
export const Chip = BadgeChip;

export const UserAvatar: React.FC<{ size?: number; tone?: Tone; icon?: IconName }> = ({
  size = 72,
  tone = "primary",
  icon = "user",
}) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: size,
      background: getToneSoftBackground(tone),
      border: `2px solid ${createColorWithAlpha(getToneColor(tone), 0.55)}`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
    }}
  >
    <VectorIcon name={icon} size={size * 0.52} color={getToneColor(tone)} />
  </div>
);
export const Avatar = UserAvatar;

export const ChatBubble: React.FC<{
  text: string;
  delay: number;
  side?: "in" | "out";
  tone?: Tone;
  size?: number;
  maxW?: number;
  strike?: boolean;
  mono?: boolean;
}> = ({ text, delay, side = "in", tone = "dim", size = 30, maxW = 520, strike, mono }) => {
  const isSolid = tone !== "dim";
  return (
    <Pop
      delay={delay}
      cfg="snappy"
      y={22}
      x={side === "in" ? -26 : 26}
      scale={0.9}
      style={{
        alignSelf: side === "in" ? "flex-start" : "flex-end",
        transformOrigin: side === "in" ? "left bottom" : "right bottom",
      }}
    >
      <div
        style={{
          maxWidth: maxW,
          padding: `${size * 0.5}px ${size * 0.8}px`,
          boxSizing: "border-box",
          borderRadius: theme.radius.bubble,
          borderBottomLeftRadius: side === "in" ? 8 : theme.radius.bubble,
          borderBottomRightRadius: side === "out" ? 8 : theme.radius.bubble,
          background: isSolid ? getToneSoftBackground(tone) : theme.colors.panelStrong,
          border: `2px solid ${isSolid ? createColorWithAlpha(getToneColor(tone), 0.5) : theme.colors.border}`,
          color: isSolid ? getToneColor(tone) : theme.colors.text,
          fontFamily: mono ? theme.fonts.mono : theme.fonts.display,
          fontSize: size,
          fontWeight: theme.weight.strong,
          lineHeight: 1.45,
          letterSpacing: 0,
          textDecoration: strike ? "line-through" : undefined,
          textDecorationColor: strike ? theme.colors.danger : undefined,
          textDecorationThickness: strike ? 4 : undefined,
        }}
      >
        {text}
      </div>
    </Pop>
  );
};
export const Bubble = ChatBubble;

export const TypingIndicator: React.FC<{ delay: number; tone?: Tone }> = ({ delay, tone = "dim" }) => {
  const frame = useCurrentFrame();
  return (
    <Pop delay={delay} cfg="snappy" y={14} style={{ alignSelf: "flex-start" }}>
      <div
        style={{
          display: "flex",
          gap: 10,
          padding: "22px 28px",
          borderRadius: 24,
          borderBottomLeftRadius: 8,
          background: theme.colors.panelStrong,
          border: `2px solid ${theme.colors.border}`,
        }}
      >
        {[0, 1, 2].map((dotIndex) => (
          <div
            key={dotIndex}
            style={{
              width: 14,
              height: 14,
              borderRadius: 14,
              background: getToneColor(tone),
              opacity: 0.45 + 0.55 * Math.max(0, Math.sin(((frame - dotIndex * 5) / 12) * Math.PI)),
              transform: `translateY(${-Math.max(0, Math.sin(((frame - dotIndex * 5) / 12) * Math.PI)) * 6}px)`,
            }}
          />
        ))}
      </div>
    </Pop>
  );
};
export const Typing = TypingIndicator;

/* ---------- ৫. অটোমেশন ও ওয়ার্কফ্লো নোড (n8n স্টাইল) ---------- */

export const WorkflowNode: React.FC<{
  cx: number;
  cy: number;
  icon: IconName;
  label: string;
  sub?: string;
  tone?: Tone;
  size?: number;
  delay: number;
  activeFrom?: number;
  labelW?: number;
  ports?: boolean;
  float?: number;
  labelSize?: number;
  labelAbove?: boolean;
}> = ({
  cx,
  cy,
  icon,
  label,
  sub,
  tone = "dim",
  size = 140,
  delay,
  activeFrom,
  labelW = 300,
  ports = true,
  float = 0,
  labelSize = 28,
  labelAbove,
}) => {
  const frame = useCurrentFrame();
  const activation =
    activeFrom === undefined
      ? 0
      : interpolate(frame, [activeFrom, activeFrom + 10], [0, 1], { ...CLAMP_SETTINGS, easing: theme.ease.out });
  const nodeColor = getToneColor(tone === "dim" ? "primary" : tone);
  const ringColor = activation > 0 ? nodeColor : theme.colors.border;
  const pulsePhase = activation > 0 ? (frame - (activeFrom ?? 0)) % 45 : 0;

  return (
    <div style={{ position: "absolute", left: cx - size / 2, top: cy - size / 2, width: size, height: size }}>
      <Pop delay={delay} cfg="bouncy" y={26} scale={0.7} style={{ width: size, height: size }}>
        <FloatAnimation amp={float} period={80} phase={cx / 300}>
          <div style={{ position: "relative", width: size, height: size }}>
            {activation > 0 ? (
              <div
                style={{
                  position: "absolute",
                  inset: -(pulsePhase / 45) * 34,
                  borderRadius: theme.radius.node + (pulsePhase / 45) * 30,
                  border: `3px solid ${createColorWithAlpha(nodeColor, (1 - pulsePhase / 45) * 0.6 * activation)}`,
                }}
              />
            ) : null}
            <div
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: theme.radius.node,
                boxSizing: "border-box",
                background: `linear-gradient(160deg, ${theme.colors.bgAlt}, ${theme.colors.nodeFill})`,
                border: `3px solid ${activation > 0 ? createColorWithAlpha(ringColor, 0.4 + 0.6 * activation) : theme.colors.border}`,
                boxShadow:
                  activation > 0
                    ? `0 0 ${60 * activation}px ${createColorWithAlpha(nodeColor, 0.35 * activation)}, 0 30px 60px -20px ${theme.colors.shadow}`
                    : `0 30px 60px -20px ${theme.colors.shadow}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <VectorIcon name={icon} size={size * 0.46} color={tone === "dim" ? theme.colors.text : getToneColor(tone)} stroke={1.7} />
            </div>
            {ports ? (
              <>
                <div
                  style={{
                    position: "absolute",
                    left: -9,
                    top: size / 2 - 9,
                    width: 18,
                    height: 18,
                    borderRadius: 18,
                    background: theme.colors.bg,
                    border: `3px solid ${theme.colors.textDim}`,
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    right: -9,
                    top: size / 2 - 9,
                    width: 18,
                    height: 18,
                    borderRadius: 18,
                    background: theme.colors.bg,
                    border: `3px solid ${theme.colors.textDim}`,
                  }}
                />
              </>
            ) : null}
            <div
              style={{
                position: "absolute",
                left: size / 2 - labelW / 2,
                width: labelW,
                textAlign: "center",
                ...(labelAbove ? { bottom: size + 16 } : { top: size + 16 }),
                fontFamily: theme.fonts.display,
                fontSize: labelSize,
                fontWeight: theme.weight.strong,
                color: theme.colors.text,
                lineHeight: 1.3,
                letterSpacing: 0,
              }}
            >
              {label}
              {sub ? (
                <div style={{ fontSize: labelSize * 0.76, fontWeight: theme.weight.body, color: theme.colors.textDim }}>
                  {sub}
                </div>
              ) : null}
            </div>
          </div>
        </FloatAnimation>
      </Pop>
    </div>
  );
};
export const NNode = WorkflowNode;

type Point2D = [number, number];
const calculateBezierPoint = (p0: Point2D, p1: Point2D, p2: Point2D, p3: Point2D, t: number): Point2D => {
  const u = 1 - t;
  return [
    u * u * u * p0[0] + 3 * u * u * t * p1[0] + 3 * u * t * t * p2[0] + t * t * t * p3[0],
    u * u * u * p0[1] + 3 * u * u * t * p1[1] + 3 * u * t * t * p2[1] + t * t * t * p3[1],
  ];
};

export const ConnectingWire: React.FC<{
  from: Point2D;
  to: Point2D;
  delay: number;
  tone?: Tone;
  draw?: number;
  dashed?: boolean;
  vertical?: boolean;
  pulse?: { start: number; period?: number; loop?: boolean };
  width?: number;
  bend?: number;
}> = ({ from, to, delay, tone = "dim", draw = 18, dashed, vertical, pulse, width = 4, bend }) => {
  const frame = useCurrentFrame();
  const drawProgress = interpolate(frame, [delay, delay + draw], [0, 1], {
    ...CLAMP_SETTINGS,
    easing: theme.ease.out,
  });
  const bendDistance =
    bend ?? (vertical ? Math.max(50, Math.abs(to[1] - from[1]) * 0.5) : Math.max(60, Math.abs(to[0] - from[0]) * 0.5));
  const controlPoint1: Point2D = vertical ? [from[0], from[1] + bendDistance] : [from[0] + bendDistance, from[1]];
  const controlPoint2: Point2D = vertical ? [to[0], to[1] - bendDistance] : [to[0] - bendDistance, to[1]];
  const pathD = `M ${from[0]} ${from[1]} C ${controlPoint1[0]} ${controlPoint1[1]}, ${controlPoint2[0]} ${controlPoint2[1]}, ${to[0]} ${to[1]}`;
  const wireColor = getToneColor(tone);

  let pulseDot: Point2D | null = null;
  let pulseDotAlpha = 0;
  if (pulse && frame >= pulse.start) {
    const period = pulse.period ?? 36;
    const rawProgress = (frame - pulse.start) / period;
    const progressTime = pulse.loop ? rawProgress % 1 : Math.min(1, rawProgress);
    pulseDot = calculateBezierPoint(from, controlPoint1, controlPoint2, to, theme.ease.inOut(progressTime));
    pulseDotAlpha = pulse.loop ? 1 : interpolate(rawProgress, [0, 0.08, 0.92, 1], [0, 1, 1, 0], CLAMP_SETTINGS);
  }

  return (
    <svg
      width={theme.video.width}
      height={theme.video.height}
      style={{ position: "absolute", left: 0, top: 0, overflow: "visible", pointerEvents: "none" }}
    >
      <path
        d={pathD}
        fill="none"
        stroke={createColorWithAlpha(theme.colors.textDim, 0.55)}
        strokeWidth={width}
        strokeLinecap="round"
        pathLength={1}
        strokeDasharray={dashed ? "0.012 0.018" : 1}
        strokeDashoffset={dashed ? 0 : 1 - drawProgress}
        style={dashed ? { opacity: drawProgress } : undefined}
      />
      {pulseDot ? (
        <circle
          cx={pulseDot[0]}
          cy={pulseDot[1]}
          r={9}
          fill={wireColor}
          opacity={pulseDotAlpha}
          style={{ filter: `drop-shadow(0 0 10px ${wireColor})` }}
        />
      ) : null}
    </svg>
  );
};
export const Wire = ConnectingWire;

/* ---------- ৬. সাউন্ড ইফেক্ট (SFX) ---------- */

export type SfxSoundName = "pop" | "click" | "whoosh" | "swipe" | "chime" | "thud";
export type SfxName = SfxSoundName;

const SFX_BASE_VOLUMES: Record<SfxSoundName, number> = {
  pop: 0.3,
  click: 0.35,
  whoosh: 0.24,
  swipe: 0.24,
  chime: 0.28,
  thud: 0.3,
};

/**
 * সাউন্ড ইফেক্ট কম্পোনেন্ট। config.ts-এর SFX_SOUND_ENABLED অনুযায়ী চালু বা বন্ধ থাকে।
 */
export const SfxSound: React.FC<{
  name: SfxSoundName;
  frame: number;
  rate?: number;
  vol?: number;
}> = ({ name, frame, rate = 1, vol = 1 }) =>
  SFX_SOUND_ENABLED ? (
    <Sequence from={Math.max(0, Math.round(frame) - 1)} durationInFrames={FRAME_RATE} layout="none">
      <Audio
        src={staticFile(`sound-effects/${name}.wav`)}
        volume={Math.min(0.35, SFX_BASE_VOLUMES[name] * vol)}
        playbackRate={rate}
      />
    </Sequence>
  ) : null;
export const Sfx = SfxSound;

/* ---------- ৭. গ্লোবাল ৫-লেয়ার ব্যাকগ্রাউন্ড ও পোস্ট-প্রসেসিং ---------- */

/**
 * ব্যাকগ্রাউন্ড মেশ (কখনোই ফ্ল্যাট সলিড ব্যাকগ্রাউন্ড ব্যবহার করবেন না)
 */
export const BackgroundMesh: React.FC = () => {
  const frame = useCurrentFrame();
  const drift1 = Math.sin(frame / 55) * 60;
  const drift2 = Math.cos(frame / 70) * 50;

  return (
    <AbsoluteFill style={{ background: theme.colors.bg }}>
      <div
        style={{
          position: "absolute",
          width: 1300,
          height: 1300,
          borderRadius: "50%",
          top: -560,
          left: -320 + drift1,
          background: `radial-gradient(circle, ${createColorWithAlpha(theme.colors.primary, 0.26)}, transparent 62%)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 1000,
          height: 1000,
          borderRadius: "50%",
          bottom: -460,
          right: -260 - drift2,
          background: `radial-gradient(circle, ${createColorWithAlpha(theme.colors.accent, 0.15)}, transparent 65%)`,
        }}
      />
      <AbsoluteFill
        style={{
          backgroundImage: `radial-gradient(${createColorWithAlpha(theme.colors.white, 0.07)} 2px, transparent 2px)`,
          backgroundSize: "56px 56px",
          backgroundPosition: `${(frame * 0.25) % 56}px ${(frame * 0.15) % 56}px`,
          maskImage: "radial-gradient(ellipse at center, black 30%, transparent 78%)",
          WebkitMaskImage: "radial-gradient(ellipse at center, black 30%, transparent 78%)",
        }}
      />
    </AbsoluteFill>
  );
};
export const BgMesh = BackgroundMesh;

/**
 * কালার গ্রেড ওভারলে (সব অ্যাসেট ও গ্রাফিক্সকে একই ভিজ্যুয়াল টোনে একীভূত করে)
 */
export const ColorGradeOverlay: React.FC = () => (
  <AbsoluteFill style={{ pointerEvents: "none" }}>
    <AbsoluteFill style={{ backgroundColor: theme.colors.primary, mixBlendMode: "soft-light", opacity: 0.18 }} />
    <AbsoluteFill
      style={{
        background: `linear-gradient(180deg, ${createColorWithAlpha(theme.colors.black, 0.1)}, transparent 28%, transparent 72%, ${createColorWithAlpha(theme.colors.black, 0.2)})`,
      }}
    />
  </AbsoluteFill>
);
export const Grade = ColorGradeOverlay;

/**
 * প্রসিডিউরাল ফিল্ম গ্রেইন (কোনো বাহ্যিক ফাইল ছাড়াই হালকা টেক্সচার দেয়)
 */
export const FilmGrainOverlay: React.FC = () => {
  const frame = useCurrentFrame();
  const noiseSvg = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='220' height='220' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E")`;
  return (
    <AbsoluteFill
      style={{
        pointerEvents: "none",
        backgroundImage: noiseSvg,
        backgroundSize: "220px",
        backgroundPosition: `${(frame * 7) % 220}px ${(frame * 13) % 220}px`,
        opacity: 0.05,
        mixBlendMode: "overlay",
      }}
    />
  );
};
export const Grain = FilmGrainOverlay;

/**
 * ভিনিয়েট ওভারলে (ভিডিওর চারপাশের কিনারে সিনেমাটিক ছায়া তৈরি করে মনোযোগ কেন্দ্রে ধরে রাখে)
 */
export const VignetteOverlay: React.FC = () => (
  <AbsoluteFill
    style={{
      pointerEvents: "none",
      background: `radial-gradient(ellipse at center, transparent 56%, ${createColorWithAlpha(theme.colors.black, 0.3)} 100%)`,
    }}
  />
);
export const Vignette = VignetteOverlay;
