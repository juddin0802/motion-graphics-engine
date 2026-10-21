/**
 * src/lib/auto-draft-scenes.tsx
 * -------------------------------------------------------------
 * সার্বজনীন ভিজ্যুয়াল-ফার্স্ট মোশন গ্রাফিক্স ড্রাফট ইঞ্জিন (Visual-First Motion Graphics Engine)।
 *
 * 🎯 মূল বৈশিষ্ট্য:
 * ১. প্রতিটি সিনের জন্য ১০০% ইউনিক ভিজ্যুয়াল (Zero Repetition)।
 * ২. কোনো পাওয়ারপয়েন্ট স্লাইড বা বড় টেক্সট বক্স নেই; স্ক্রিনের ৯৫% স্থান জুড়ে থাকবে
 *    পূর্ণাঙ্গ ভিজ্যুয়াল ইন্টারফেস, n8n ওয়ার্কফ্লো নোড, ডাটা টেবিল ও কানেক্টিং ওয়্যার।
 * ৩. সেন্ট্রাল অটোমেশন নোড থেকে ৫টি সোশ্যাল প্ল্যাটফর্মে নিখুঁতভাবে কানেক্টেড বাঁকানো ওয়্যার,
 *    যেখানে কোনো তার শূন্যে ঝুলবে না (Pixel-Perfect Target Ports)।
 * ৪. নিচে মিনিমাল গ্লাস ক্যাপসুল সাবটাইটেল বার।
 */
import React, { useContext } from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { CUES, type Cue } from "../generated/cues";
import { theme, createColorWithAlpha } from "../video-theme";
import { FRAME_RATE, HAS_SUBTITLE_CUES } from "../srt-timing";
import { SceneContext, useAbsoluteSecondsToSceneFrames } from "./scene-context";
import { VectorIcon } from "./vector-icons";
import { buildVideoScenes, type CalculatedVideoScene } from "./video-scene-builder";
import { BadgeChip, PopEntrance, SfxSound, WordByWordText } from "./motion-ui-components";
import { BrandIconBadge } from "./rich-brand-icons";

const CLAMP_SETTINGS = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/* ---------- ১. SRT লাইন গ্রুপ করার নিয়ম ---------- */
const GROUPING_CRITERIA = {
  maxCuesPerScene: 3,
  maxSecondsPerScene: 9,
  breakSilenceSeconds: 0.7,
  tinyCueThresholdSeconds: 0.6,
};

export type SubtitleCueGroup = { index: number; cues: Cue[] };

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

/* ---------- ২. মিনিমাল বটম সাবটাইটেল বার ---------- */
const SleekBottomSubtitleBar: React.FC<{ cues: Cue[] }> = ({ cues }) => {
  const { width: W } = useVideoConfig();
  const getSceneFrame = useAbsoluteSecondsToSceneFrames();
  const currentFrame = useCurrentFrame();

  const activeCue =
    cues.find((c) => {
      const start = getSceneFrame(c.start);
      const end = getSceneFrame(c.end);
      return currentFrame >= start && currentFrame <= end;
    }) || cues[0];

  const cleanedText = activeCue ? activeCue.text.replace(/\s+/g, " ").trim() : "";
  const startFrame = activeCue ? getSceneFrame(activeCue.start) : 0;
  const wordsArray = cleanedText.split(" ");
  const framesPerWord = Math.max(
    3,
    Math.min(
      7,
      Math.round(((activeCue?.end || 1) - (activeCue?.start || 0)) * FRAME_RATE * 0.75 / Math.max(1, wordsArray.length))
    )
  );

  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 34,
        display: "flex",
        justifyContent: "center",
        zIndex: 50,
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          maxWidth: W * 0.78,
          padding: "10px 26px",
          borderRadius: 9999,
          background: "rgba(10, 16, 32, 0.85)",
          backdropFilter: "blur(16px)",
          border: `1.5px solid ${createColorWithAlpha(theme.colors.border, 0.8)}`,
          boxShadow: `0 12px 32px -8px ${theme.colors.shadow}`,
          display: "flex",
          alignItems: "center",
          gap: 14,
        }}
      >
        <div
          style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: theme.colors.accent,
            boxShadow: `0 0 10px ${theme.colors.accent}`,
            flexShrink: 0,
          }}
        />
        <WordByWordText
          text={cleanedText}
          delay={startFrame}
          per={framesPerWord}
          size={21}
          color={theme.colors.text}
          align="center"
          maxWidth={W * 0.72}
          lineHeight={1.3}
        />
      </div>
    </div>
  );
};

/* ---------- ৩. ১১টি সম্পূর্ণ ইউনিক ভিজ্যুয়াল সিন কম্পোনেন্ট ---------- */

/**
 * সিন ১: হুক ও ফ্যাটিগ (সমস্যা: সময় অপচয় ও কাজের চাপ)
 */
const VisualHookFatigue: React.FC<{ delay: number }> = ({ delay }) => {
  const brands = ["facebook", "instagram", "linkedin", "x", "threads"];

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 34,
        paddingBottom: 50,
      }}
    >
      <PopEntrance delay={delay} cfg="bouncy">
        <BadgeChip text="SOCIAL MEDIA AUTOMATION" tone="accent" solid size={20} />
      </PopEntrance>

      <PopEntrance
        delay={delay + 6}
        cfg="smooth"
        style={{
          width: 880,
          padding: "36px 44px",
          borderRadius: 24,
          background: "linear-gradient(145deg, rgba(30, 41, 59, 0.75), rgba(15, 23, 42, 0.9))",
          backdropFilter: "blur(20px)",
          border: `1.5px solid ${createColorWithAlpha(theme.colors.danger, 0.45)}`,
          boxShadow: `0 24px 60px -12px ${createColorWithAlpha(theme.colors.danger, 0.3)}`,
          display: "flex",
          alignItems: "center",
          gap: 28,
        }}
      >
        <div
          style={{
            width: 76,
            height: 76,
            borderRadius: 22,
            background: "rgba(244, 63, 94, 0.15)",
            border: "2px solid rgba(244, 63, 94, 0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <VectorIcon name="clock" size={40} color="#F43F5E" />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <div style={{ fontFamily: theme.fonts.display, fontSize: 32, fontWeight: 700, color: theme.colors.text }}>
            প্রতিদিন ম্যানুয়াল পোস্টিং ও সময়ের অপচয়
          </div>
          <div style={{ fontFamily: theme.fonts.mono, fontSize: 17, color: theme.colors.textDim }}>
            5 Separate Platforms • Inconsistent Formats • 15+ Hours Lost Weekly
          </div>
        </div>
      </PopEntrance>

      <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
        {brands.map((b, i) => (
          <PopEntrance key={b} delay={delay + 14 + i * 4} cfg="bouncy" scale={0.6}>
            <BrandIconBadge brand={b} size={64} />
          </PopEntrance>
        ))}
      </div>
    </div>
  );
};

/**
 * সিন ২: সমাধান ওভারভিউ (ম্যানুয়াল বনাম অটোমেশন কম্প্যারিজন)
 */
const VisualSolutionComparison: React.FC<{ delay: number }> = ({ delay }) => {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 40,
        padding: "0 100px",
        paddingBottom: 50,
      }}
    >
      {/* বাম পাশ: ম্যানুয়াল সমস্যা */}
      <PopEntrance
        delay={delay}
        cfg="smooth"
        style={{
          flex: 1,
          padding: "36px",
          borderRadius: 22,
          background: "rgba(30, 41, 59, 0.5)",
          border: "1.5px solid rgba(244, 63, 94, 0.35)",
          display: "flex",
          flexDirection: "column",
          gap: 20,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <BadgeChip text="MANUAL WAY" tone="danger" mono size={14} />
          <div style={{ fontFamily: theme.fonts.display, fontSize: 24, fontWeight: 700, color: theme.colors.text }}>
            একই পোস্ট সব জায়গায়
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {["কন্টেন্টের গুণগত মান কমে যায়", "আলাদা লিখতে গিয়ে কাজের চাপ দ্বিগুণ", "ব্যস্ততায় নিয়মিত পোস্ট বন্ধ হয়ে যায়"].map(
            (t, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <VectorIcon name="x" size={20} color="#F43F5E" />
                <span style={{ fontFamily: theme.fonts.display, fontSize: 18, color: theme.colors.textDim }}>{t}</span>
              </div>
            )
          )}
        </div>
      </PopEntrance>

      {/* ডান পাশ: অটোমেশন সমাধান */}
      <PopEntrance
        delay={delay + 8}
        cfg="smooth"
        style={{
          flex: 1,
          padding: "36px",
          borderRadius: 22,
          background: "rgba(16, 24, 44, 0.95)",
          border: `2px solid ${theme.colors.accent}`,
          boxShadow: `0 0 45px ${createColorWithAlpha(theme.colors.accent, 0.35)}`,
          display: "flex",
          flexDirection: "column",
          gap: 20,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <BadgeChip text="THE AUTOMATION SYSTEM" tone="accent" solid mono size={14} />
          <div style={{ fontFamily: theme.fonts.display, fontSize: 24, fontWeight: 700, color: theme.colors.text }}>
            ১টি টপিক ➔ ৫টি পারফেক্ট পোস্ট
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {[
            "ক্যালেন্ডার থেকে স্বয়ংক্রিয় টপিক পিক",
            "প্রতিটি প্ল্যাটফর্মের টোন অনুযায়ী AI রাইটিং",
            "১০০% মানুষের নিয়ন্ত্রণে শিডিউলিং ও পাবলিশ",
          ].map((t, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <VectorIcon name="check" size={20} color={theme.colors.accent} />
              <span style={{ fontFamily: theme.fonts.display, fontSize: 18, color: theme.colors.text, fontWeight: 600 }}>
                {t}
              </span>
            </div>
          ))}
        </div>
      </PopEntrance>
    </div>
  );
};

/**
 * সিন ৩: কন্টেন্ট ক্যালেন্ডার ইন্টারফেস (Google Sheets Table ➔ Trigger Node)
 */
const VisualContentCalendarScene: React.FC<{ delay: number }> = ({ delay }) => {
  const frame = useCurrentFrame();

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 50,
        padding: "0 80px",
        paddingBottom: 40,
      }}
    >
      {/* গুগল শিট কন্টেন্ট ক্যালেন্ডার টেবিল */}
      <PopEntrance
        delay={delay}
        cfg="smooth"
        style={{
          width: 960,
          borderRadius: 22,
          background: "rgba(15, 23, 42, 0.9)",
          backdropFilter: "blur(24px)",
          border: `1.5px solid ${createColorWithAlpha(theme.colors.border, 0.9)}`,
          boxShadow: `0 30px 70px -15px ${theme.colors.shadow}`,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            padding: "16px 26px",
            background: "rgba(255,255,255,0.04)",
            borderBottom: `1.5px solid ${theme.colors.border}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <BrandIconBadge brand="googlesheets" size={38} />
            <div>
              <div style={{ fontFamily: theme.fonts.display, fontSize: 20, fontWeight: 700, color: theme.colors.text }}>
                Content Calendar 2026
              </div>
              <div style={{ fontFamily: theme.fonts.mono, fontSize: 13, color: theme.colors.textDim }}>
                Auto-Synced Topic Source
              </div>
            </div>
          </div>
          <BadgeChip text="LIVE GOOGLE SHEET" tone="accent" mono size={16} />
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.2fr 3.2fr 1.6fr 1.8fr",
            padding: "12px 26px",
            background: "rgba(255,255,255,0.02)",
            borderBottom: `1px solid ${theme.colors.border}`,
            fontFamily: theme.fonts.mono,
            fontSize: 13,
            color: theme.colors.textDim,
            textTransform: "uppercase",
            letterSpacing: "0.06em",
          }}
        >
          <div>Scheduled Time</div>
          <div>Topic Idea</div>
          <div>Target Platforms</div>
          <div>Status</div>
        </div>

        {/* রো ১ */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.2fr 3.2fr 1.6fr 1.8fr",
            padding: "16px 26px",
            borderBottom: `1px solid rgba(255,255,255,0.05)`,
            fontFamily: theme.fonts.display,
            fontSize: 16,
            color: theme.colors.textDim,
            alignItems: "center",
          }}
        >
          <div style={{ fontFamily: theme.fonts.mono, fontSize: 14 }}>09:00 AM</div>
          <div>5 AI Growth Hacks for 2026</div>
          <div style={{ display: "flex", gap: 6 }}>
            <BrandIconBadge brand="linkedin" size={24} glow={false} />
            <BrandIconBadge brand="x" size={24} glow={false} />
          </div>
          <div style={{ color: theme.colors.textDim, fontFamily: theme.fonts.mono, fontSize: 13 }}>COMPLETED</div>
        </div>

        {/* রো ২: অ্যাক্টিভ ট্রিগার রো */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.2fr 3.2fr 1.6fr 1.8fr",
            padding: "18px 26px",
            background: "rgba(52, 211, 153, 0.12)",
            borderLeft: `4px solid ${theme.colors.accent}`,
            borderBottom: `1px solid rgba(255,255,255,0.05)`,
            fontFamily: theme.fonts.display,
            fontSize: 18,
            fontWeight: 700,
            color: theme.colors.text,
            alignItems: "center",
          }}
        >
          <div style={{ fontFamily: theme.fonts.mono, fontSize: 15, color: theme.colors.accent }}>02:00 PM (NOW)</div>
          <div>Social Media Automation with n8n</div>
          <div style={{ display: "flex", gap: 6 }}>
            <BrandIconBadge brand="facebook" size={24} glow={false} />
            <BrandIconBadge brand="instagram" size={24} glow={false} />
            <BrandIconBadge brand="linkedin" size={24} glow={false} />
            <BrandIconBadge brand="x" size={24} glow={false} />
            <BrandIconBadge brand="threads" size={24} glow={false} />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div
              style={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: theme.colors.accent,
                boxShadow: `0 0 12px ${theme.colors.accent}`,
              }}
            />
            <span style={{ color: theme.colors.accent, fontFamily: theme.fonts.mono, fontSize: 14 }}>TRIGGER READY</span>
          </div>
        </div>

        {/* রো ৩ */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.2fr 3.2fr 1.6fr 1.8fr",
            padding: "16px 26px",
            fontFamily: theme.fonts.display,
            fontSize: 16,
            color: theme.colors.textDim,
            alignItems: "center",
          }}
        >
          <div style={{ fontFamily: theme.fonts.mono, fontSize: 14 }}>Tomorrow 10:00 AM</div>
          <div>Scaling Client Reach 10x Without Ads</div>
          <div style={{ display: "flex", gap: 6 }}>
            <BrandIconBadge brand="facebook" size={24} glow={false} />
            <BrandIconBadge brand="instagram" size={24} glow={false} />
          </div>
          <div style={{ color: theme.colors.textDim, fontFamily: theme.fonts.mono, fontSize: 13 }}>SCHEDULED</div>
        </div>
      </PopEntrance>

      {/* কানেক্টিং ওয়্যার ও মুভিং ডট */}
      <div style={{ display: "flex", alignItems: "center", position: "relative" }}>
        <div
          style={{
            width: 70,
            height: 3,
            background: `linear-gradient(90deg, ${theme.colors.accent}, ${theme.colors.primary})`,
            boxShadow: `0 0 10px ${theme.colors.accent}`,
          }}
        />
        <div
          style={{
            position: "absolute",
            left: `${((frame * 2.5) % 70)}px`,
            top: -4,
            width: 11,
            height: 11,
            borderRadius: "50%",
            background: "#FFFFFF",
            boxShadow: `0 0 12px ${theme.colors.accent}`,
          }}
        />
      </div>

      {/* রিসিভিং অটোমেশন ট্রিগার নোড */}
      <PopEntrance delay={delay + 10} cfg="bouncy">
        <div
          style={{
            width: 320,
            padding: "26px",
            borderRadius: 22,
            background: "rgba(20, 28, 48, 0.95)",
            border: `2px solid ${theme.colors.primary}`,
            boxShadow: `0 0 35px ${createColorWithAlpha(theme.colors.primary, 0.45)}`,
            display: "flex",
            flexDirection: "column",
            gap: 14,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <BrandIconBadge brand="n8n" size={46} />
            <div>
              <div style={{ fontFamily: theme.fonts.mono, fontSize: 12, color: theme.colors.primary, fontWeight: 700 }}>
                SCHEDULE TRIGGER
              </div>
              <div style={{ fontFamily: theme.fonts.display, fontSize: 19, fontWeight: 700, color: theme.colors.text }}>
                Daily Topic Extractor
              </div>
            </div>
          </div>
          <div style={{ fontFamily: theme.fonts.mono, fontSize: 13, color: theme.colors.textDim }}>
            Status: <span style={{ color: theme.colors.accent }}>Extracting Row 2 Topic</span>
          </div>
        </div>
      </PopEntrance>
    </div>
  );
};

/**
 * সিন ৪: স্টেপ ১ - টপিক সিলেকশন ও নোড পাইপলাইন (Node 01 -> Node 02)
 */
const VisualTopicExtractorPipeline: React.FC<{ delay: number }> = ({ delay }) => {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 40,
        padding: "0 100px",
        paddingBottom: 40,
      }}
    >
      {/* নোড ০১: ডেইলি শিডিউল ট্রিগার */}
      <PopEntrance delay={delay} cfg="bouncy">
        <div
          style={{
            width: 380,
            padding: "32px",
            borderRadius: 24,
            background: "rgba(16, 24, 44, 0.95)",
            border: `2px solid ${theme.colors.primary}`,
            boxShadow: `0 0 35px ${createColorWithAlpha(theme.colors.primary, 0.35)}`,
            display: "flex",
            flexDirection: "column",
            gap: 14,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <BrandIconBadge brand="n8n" size={48} />
            <BadgeChip text="STEP 01" tone="primary" mono size={14} />
          </div>
          <div style={{ fontFamily: theme.fonts.display, fontSize: 22, fontWeight: 700, color: theme.colors.text }}>
            01B - Daily Draft Trigger
          </div>
          <div style={{ fontFamily: theme.fonts.mono, fontSize: 14, color: theme.colors.textDim }}>
            Runs Every Day at 09:00 AM
          </div>
        </div>
      </PopEntrance>

      {/* কানেক্টিং ওয়্যার */}
      <div
        style={{
          width: 80,
          height: 3,
          background: `linear-gradient(90deg, ${theme.colors.primary}, ${theme.colors.accent})`,
          boxShadow: `0 0 10px ${theme.colors.accent}`,
        }}
      />

      {/* নোড ০২: রিড রেডি টপিক */}
      <PopEntrance delay={delay + 8} cfg="bouncy">
        <div
          style={{
            width: 440,
            padding: "32px",
            borderRadius: 24,
            background: "rgba(16, 24, 44, 0.95)",
            border: `2px solid ${theme.colors.accent}`,
            boxShadow: `0 0 45px ${createColorWithAlpha(theme.colors.accent, 0.4)}`,
            display: "flex",
            flexDirection: "column",
            gap: 14,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <BrandIconBadge brand="googlesheets" size={48} />
            <BadgeChip text="READ CALENDAR" tone="accent" mono size={14} />
          </div>
          <div style={{ fontFamily: theme.fonts.display, fontSize: 22, fontWeight: 700, color: theme.colors.text }}>
            02 - Get Next Ready Topic
          </div>
          <div
            style={{
              padding: "10px 14px",
              borderRadius: 10,
              background: "rgba(255,255,255,0.04)",
              fontFamily: theme.fonts.mono,
              fontSize: 13,
              color: theme.colors.accent,
            }}
          >
            Query: status == 'ready' LIMIT 1
          </div>
        </div>
      </PopEntrance>
    </div>
  );
};

/**
 * সিন ৫: স্ট্যাটাস প্রসেসিং ও জেমিনি AI এজেন্ট (Node 03 & Node 04)
 */
const VisualGeminiAIAgent: React.FC<{ delay: number }> = ({ delay }) => {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 36,
        padding: "0 80px",
        paddingBottom: 40,
      }}
    >
      {/* নোড ০৩: মার্ক প্রসেসিং */}
      <PopEntrance delay={delay} cfg="bouncy">
        <div
          style={{
            width: 360,
            padding: "30px",
            borderRadius: 22,
            background: "rgba(16, 24, 44, 0.95)",
            border: "2px solid #F59E0B",
            boxShadow: "0 0 35px rgba(245, 158, 11, 0.35)",
            display: "flex",
            flexDirection: "column",
            gap: 14,
          }}
        >
          <BadgeChip text="PREVENT DUPLICATES" tone="warning" mono size={13} />
          <div style={{ fontFamily: theme.fonts.display, fontSize: 22, fontWeight: 700, color: theme.colors.text }}>
            03 - Mark Topic Processing
          </div>
          <div style={{ fontFamily: theme.fonts.mono, fontSize: 14, color: "#F59E0B" }}>
            Status updated to 'processing'
          </div>
        </div>
      </PopEntrance>

      <div
        style={{
          width: 60,
          height: 3,
          background: "linear-gradient(90deg, #F59E0B, #6366F1)",
          boxShadow: "0 0 10px #6366F1",
        }}
      />

      {/* নোড ০৪: জেমিনি ১.৫ ফ্ল্যাশ এআই এজেন্ট */}
      <PopEntrance delay={delay + 8} cfg="bouncy">
        <div
          style={{
            width: 460,
            padding: "32px",
            borderRadius: 24,
            background: "rgba(16, 24, 44, 0.98)",
            border: `2.5px solid ${theme.colors.accent}`,
            boxShadow: `0 0 50px ${createColorWithAlpha(theme.colors.accent, 0.45)}`,
            display: "flex",
            flexDirection: "column",
            gap: 16,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <BrandIconBadge brand="gemini" size={54} />
            <BadgeChip text="AI AGENT MODEL" tone="accent" mono size={14} />
          </div>
          <div>
            <div style={{ fontFamily: theme.fonts.display, fontSize: 24, fontWeight: 700, color: theme.colors.text }}>
              04 - Generate Social Posts
            </div>
            <div style={{ fontFamily: theme.fonts.mono, fontSize: 14, color: theme.colors.accent }}>
              Gemini 1.5 Flash • Context Aware
            </div>
          </div>
          <div style={{ fontFamily: theme.fonts.display, fontSize: 16, color: theme.colors.textDim, lineHeight: 1.4 }}>
            টপিক ও নির্দেশনা অনুযায়ী ৫টি প্ল্যাটফর্মের জন্য সম্পূর্ণ আলাদা কনটেন্ট ড্রাফট করছে
          </div>
        </div>
      </PopEntrance>
    </div>
  );
};

/**
 * সিন ৬: প্ল্যাটফর্ম স্পেসিফিক ফরম্যাটিং ও ক্যারেক্টার লিমিট
 */
const VisualPlatformFormatRules: React.FC<{ delay: number }> = ({ delay }) => {
  const rules = [
    { brand: "linkedin", name: "LinkedIn", rule: "3,000 Chars • Professional Tone • Bullet Takeaways" },
    { brand: "x", name: "X (Twitter)", rule: "280 Chars • High-Impact Hook • Punchy Thread" },
    { brand: "instagram", name: "Instagram", rule: "Visual Hook • Storytelling Caption • 15 Niche Tags" },
    { brand: "facebook", name: "Facebook", rule: "Conversational Angle • Question for Discussion" },
    { brand: "threads", name: "Threads", rule: "Casual Thought • 500 Chars Limit" },
  ];

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 20,
        paddingBottom: 40,
      }}
    >
      <PopEntrance delay={delay} cfg="bouncy">
        <BadgeChip text="NO COPY-PASTE • PLATFORM OPTIMIZATION" tone="accent" solid size={18} />
      </PopEntrance>

      <div style={{ display: "flex", flexDirection: "column", gap: 12, width: 880 }}>
        {rules.map((r, i) => (
          <PopEntrance
            key={r.brand}
            delay={delay + 4 + i * 4}
            cfg="smooth"
            x={30}
            style={{
              padding: "16px 24px",
              borderRadius: 16,
              background: "rgba(16, 24, 44, 0.88)",
              border: `1.5px solid ${theme.colors.border}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <BrandIconBadge brand={r.brand} size={38} />
              <div style={{ fontFamily: theme.fonts.display, fontSize: 18, fontWeight: 700, color: theme.colors.text }}>
                {r.name}
              </div>
            </div>
            <div style={{ fontFamily: theme.fonts.mono, fontSize: 14, color: theme.colors.accent }}>
              {r.rule}
            </div>
          </PopEntrance>
        ))}
      </div>
    </div>
  );
};

/**
 * সিন ৭: গুগল শিটে সেভ ও স্ট্যাটাস আপডেট (Node 06 & Written Status)
 */
const VisualSaveToSheets: React.FC<{ delay: number }> = ({ delay }) => {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 40,
        padding: "0 90px",
        paddingBottom: 40,
      }}
    >
      <PopEntrance delay={delay} cfg="bouncy">
        <div
          style={{
            width: 420,
            padding: "32px",
            borderRadius: 24,
            background: "rgba(16, 24, 44, 0.95)",
            border: `2px solid ${theme.colors.primary}`,
            boxShadow: `0 0 40px ${createColorWithAlpha(theme.colors.primary, 0.35)}`,
            display: "flex",
            flexDirection: "column",
            gap: 16,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <BrandIconBadge brand="googlesheets" size={50} />
            <div>
              <div style={{ fontFamily: theme.fonts.display, fontSize: 22, fontWeight: 700, color: theme.colors.text }}>
                06 - Save Social Posts
              </div>
              <div style={{ fontFamily: theme.fonts.mono, fontSize: 13, color: theme.colors.textDim }}>
                Batch Write to Calendar
              </div>
            </div>
          </div>
          <div style={{ fontFamily: theme.fonts.display, fontSize: 16, color: theme.colors.textDim, lineHeight: 1.5 }}>
            তৈরি হওয়া পোস্টগুলো Media URL, Schedule ও Approval Status সহ গুগল শিটে স্বয়ংক্রিয়ভাবে সেভ হয়।
          </div>
          <BadgeChip text="STATUS ➔ WRITTEN" tone="accent" mono size={15} />
        </div>
      </PopEntrance>

      <div
        style={{
          width: 70,
          height: 3,
          background: `linear-gradient(90deg, ${theme.colors.primary}, ${theme.colors.accent})`,
          boxShadow: `0 0 10px ${theme.colors.accent}`,
        }}
      />

      {/* লাইভ আপডেটেড টেবিল প্রিভিউ */}
      <PopEntrance delay={delay + 8} cfg="smooth" style={{ width: 560 }}>
        <div
          style={{
            padding: "24px",
            borderRadius: 20,
            background: "rgba(15, 23, 42, 0.95)",
            border: `1.5px solid ${theme.colors.accent}`,
            boxShadow: `0 0 35px ${createColorWithAlpha(theme.colors.accent, 0.3)}`,
            display: "flex",
            flexDirection: "column",
            gap: 14,
          }}
        >
          <div style={{ fontFamily: theme.fonts.mono, fontSize: 13, color: theme.colors.accent, fontWeight: 700 }}>
            LIVE SPREADSHEET UPDATE
          </div>
          <div
            style={{
              padding: "14px 18px",
              borderRadius: 12,
              background: "rgba(52, 211, 153, 0.12)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div style={{ fontFamily: theme.fonts.display, fontSize: 17, color: theme.colors.text, fontWeight: 600 }}>
              Social Media Automation with n8n
            </div>
            <div
              style={{
                padding: "4px 10px",
                borderRadius: 6,
                background: theme.colors.accent,
                color: "#052e16",
                fontFamily: theme.fonts.mono,
                fontSize: 13,
                fontWeight: 800,
              }}
            >
              WRITTEN
            </div>
          </div>
          <div style={{ fontFamily: theme.fonts.mono, fontSize: 13, color: theme.colors.textDim }}>
            5 Platform Drafts Saved • Ready for Human Review
          </div>
        </div>
      </PopEntrance>
    </div>
  );
};

/**
 * সিন ৮: এরর হ্যান্ডলিং ও নতুন প্ল্যাটফর্ম এক্সটেনসিবিলিটি (Node 10 Error & Add Platforms)
 */
const VisualErrorAndExtensibility: React.FC<{ delay: number }> = ({ delay }) => {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 40,
        padding: "0 100px",
        paddingBottom: 40,
      }}
    >
      {/* সেইফটি এরর হ্যান্ডলিং */}
      <PopEntrance delay={delay} cfg="smooth" style={{ flex: 1 }}>
        <div
          style={{
            padding: "32px",
            borderRadius: 22,
            background: "rgba(16, 24, 44, 0.95)",
            border: "1.5px solid rgba(245, 158, 11, 0.4)",
            display: "flex",
            flexDirection: "column",
            gap: 16,
          }}
        >
          <BadgeChip text="FAIL-SAFE ARCHITECTURE" tone="warning" mono size={14} />
          <div style={{ fontFamily: theme.fonts.display, fontSize: 24, fontWeight: 700, color: theme.colors.text }}>
            10 - Error Catch & Record
          </div>
          <div style={{ fontFamily: theme.fonts.display, fontSize: 16, color: theme.colors.textDim, lineHeight: 1.5 }}>
            কোনো সাময়িক এরর হলে স্ট্যাটাস failed মার্ক হয় এবং লগ রেকর্ড থাকে। ফিক্স করে স্ট্যাটাস ready করলেই রি-প্রসেস হয়।
          </div>
        </div>
      </PopEntrance>

      {/* এক্সটেনসিবল আর্কিটেকচার */}
      <PopEntrance delay={delay + 8} cfg="smooth" style={{ flex: 1 }}>
        <div
          style={{
            padding: "32px",
            borderRadius: 22,
            background: "rgba(16, 24, 44, 0.95)",
            border: `2px solid ${theme.colors.accent}`,
            boxShadow: `0 0 40px ${createColorWithAlpha(theme.colors.accent, 0.3)}`,
            display: "flex",
            flexDirection: "column",
            gap: 16,
          }}
        >
          <BadgeChip text="MODULAR & EXPANDABLE" tone="accent" mono size={14} />
          <div style={{ fontFamily: theme.fonts.display, fontSize: 24, fontWeight: 700, color: theme.colors.text }}>
            যে কোনো নতুন প্ল্যাটফর্ম যুক্ত করুন
          </div>
          <div style={{ display: "flex", gap: 12, alignItems: "center", paddingTop: 6 }}>
            <BrandIconBadge brand="youtube" size={44} />
            <BrandIconBadge brand="tiktok" size={44} />
            <BrandIconBadge brand="pinterest" size={44} />
            <div
              style={{
                padding: "8px 16px",
                borderRadius: 12,
                background: "rgba(255,255,255,0.06)",
                fontFamily: theme.fonts.mono,
                fontSize: 14,
                color: theme.colors.accent,
                fontWeight: 700,
              }}
            >
              + ADD ANY PLATFORM
            </div>
          </div>
        </div>
      </PopEntrance>
    </div>
  );
};

/**
 * সিন ৯: সেন্ট্রাল পাবলিশিং আর্কিটেকচার ও ৫টি নিখুঁত কানেক্টেড ওয়্যার (Pixel-Perfect Target Ports)
 */
const VisualConnectedPublishingHub: React.FC<{ delay: number }> = ({ delay }) => {
  const frame = useCurrentFrame();

  // ৫টি প্ল্যাটফর্মের সুনির্দিষ্ট কার্ডের মাপ ও অবস্থান
  const cardHeight = 84;
  const cardGap = 16;
  const startTop = 198;

  const platforms = [
    { brand: "facebook", name: "Facebook", tone: "Optimized for Community Reach", top: startTop, centerY: startTop + cardHeight / 2 },
    { brand: "instagram", name: "Instagram", tone: "Engaging Visual Hook & Hashtags", top: startTop + (cardHeight + cardGap) * 1, centerY: startTop + (cardHeight + cardGap) * 1 + cardHeight / 2 },
    { brand: "linkedin", name: "LinkedIn", tone: "Structured Professional Article", top: startTop + (cardHeight + cardGap) * 2, centerY: startTop + (cardHeight + cardGap) * 2 + cardHeight / 2 },
    { brand: "x", name: "X (Twitter)", tone: "Punchy High-Impact Thread Hook", top: startTop + (cardHeight + cardGap) * 3, centerY: startTop + (cardHeight + cardGap) * 3 + cardHeight / 2 },
    { brand: "threads", name: "Threads", tone: "Conversational Casual Tone", top: startTop + (cardHeight + cardGap) * 4, centerY: startTop + (cardHeight + cardGap) * 4 + cardHeight / 2 },
  ];

  // বাম ট্রিগার নোডের মাপ ও আউটপুট পোর্টের এক্স্যাক্ট স্থানাঙ্ক
  const triggerNode = { x: 140, y: 300, w: 420, h: 280 };
  const triggerPortX = triggerNode.x + triggerNode.w; // 560
  const triggerPortY = triggerNode.y + triggerNode.h / 2; // 440
  const targetPortX = 1140;

  return (
    <div style={{ position: "absolute", inset: 0 }}>
      {/* ব্যাকগ্রাউন্ড কানেক্টিং ওয়্যার ও ট্রাভেলিং এনার্জি স্পার্কস (১০০% পোর্টের সাথে সংযুক্ত) */}
      <svg
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          zIndex: 5,
        }}
      >
        <defs>
          <linearGradient id="hubWireGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={theme.colors.accent} stopOpacity={0.9} />
            <stop offset="100%" stopColor={theme.colors.primary} stopOpacity={0.9} />
          </linearGradient>
        </defs>
        {platforms.map((p, i) => {
          // নিখুঁত বেজিয়ার কার্ভ যা বাম পোর্ট থেকে ডানের প্রতিটি কার্ডের ইনপুট পোর্টে সরাসরি সংযোগ করে
          const pathD = `M ${triggerPortX} ${triggerPortY} C 850 ${triggerPortY}, 850 ${p.centerY}, ${targetPortX} ${p.centerY}`;
          const sparkOffset = ((frame - delay) * 0.025 + i * 0.2) % 1;
          const strokeProgress = interpolate(frame, [delay + 4, delay + 24], [0, 1], CLAMP_SETTINGS);

          return (
            <g key={i}>
              {/* মেইন কানেক্টিং ওয়্যার */}
              <path
                d={pathD}
                fill="none"
                stroke="url(#hubWireGrad)"
                strokeWidth={3}
                strokeDasharray="8 6"
                opacity={strokeProgress * 0.9}
                style={{ filter: `drop-shadow(0 0 10px ${theme.colors.accent})` }}
              />
              {/* ওয়্যারের উপর দিয়ে অবিরাম ছুটে চলা এনার্জি বুলেট */}
              {strokeProgress > 0.8 && (
                <circle
                  r={5}
                  fill="#FFFFFF"
                  style={{
                    filter: `drop-shadow(0 0 12px ${theme.colors.accent})`,
                    offsetPath: `path("${pathD}")`,
                    offsetDistance: `${sparkOffset * 100}%`,
                  }}
                />
              )}
            </g>
          );
        })}
      </svg>

      {/* বাম পাশ: সেন্ট্রাল অটোমেশন ট্রিগার নোড */}
      <div style={{ position: "absolute", left: triggerNode.x, top: triggerNode.y, width: triggerNode.w, zIndex: 10 }}>
        <PopEntrance delay={delay} cfg="bouncy">
          <div
            style={{
              padding: "36px 32px",
              borderRadius: 24,
              background: "rgba(16, 24, 44, 0.95)",
              border: `2.5px solid ${theme.colors.accent}`,
              boxShadow: `0 0 50px ${createColorWithAlpha(theme.colors.accent, 0.45)}`,
              display: "flex",
              flexDirection: "column",
              gap: 16,
              position: "relative",
            }}
          >
            {/* আউটপুট পোর্ট ডট */}
            <div
              style={{
                position: "absolute",
                right: -10,
                top: "50%",
                transform: "translateY(-50%)",
                width: 20,
                height: 20,
                borderRadius: "50%",
                background: theme.colors.accent,
                boxShadow: `0 0 14px ${theme.colors.accent}`,
                border: "3px solid #0E1528",
              }}
            />
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <BrandIconBadge brand="n8n" size={56} />
              <div>
                <div style={{ fontFamily: theme.fonts.mono, fontSize: 13, color: theme.colors.accent, fontWeight: 700 }}>
                  AUTOMATION TRIGGER
                </div>
                <div style={{ fontFamily: theme.fonts.display, fontSize: 24, fontWeight: 700, color: theme.colors.text }}>
                  Multi-Platform Engine
                </div>
              </div>
            </div>
            <div style={{ fontFamily: theme.fonts.display, fontSize: 16, color: theme.colors.textDim, lineHeight: 1.4 }}>
              ১টি টপিক থেকে ৫টি আলাদা ফরম্যাটে কনভার্ট করে একযোগে ডিস্ট্রিবিউট করছে
            </div>
            <BadgeChip text="5-CHANNEL AUTO GENERATION" tone="accent" mono size={15} />
          </div>
        </PopEntrance>
      </div>

      {/* ডান পাশ: ৫টি সংযুক্ত সোশ্যাল মিডিয়া কার্ড (প্রতিটির সাথে এক্স্যাক্ট ওয়্যার কানেকশন) */}
      <div style={{ position: "absolute", left: targetPortX, top: 0, width: 640, height: 1080, zIndex: 10 }}>
        {platforms.map((p, i) => (
          <PopEntrance
            key={p.brand}
            delay={delay + 6 + i * 4}
            cfg="smooth"
            x={40}
            style={{
              position: "absolute",
              left: 0,
              top: p.top,
              width: "100%",
              height: cardHeight,
              boxSizing: "border-box",
              padding: "16px 24px",
              borderRadius: 18,
              background: "rgba(15, 23, 42, 0.9)",
              backdropFilter: "blur(16px)",
              border: `1.5px solid ${createColorWithAlpha(theme.colors.border, 0.85)}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            {/* ইনপুট পোর্ট ডট (ওয়্যারটি ঠিক এই পয়েন্টে যুক্ত হয়) */}
            <div
              style={{
                position: "absolute",
                left: -8,
                top: "50%",
                transform: "translateY(-50%)",
                width: 16,
                height: 16,
                borderRadius: "50%",
                background: theme.colors.primary,
                boxShadow: `0 0 10px ${theme.colors.primary}`,
                border: "2px solid #0E1528",
              }}
            />
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <BrandIconBadge brand={p.brand} size={44} />
              <div>
                <div style={{ fontFamily: theme.fonts.display, fontSize: 19, fontWeight: 700, color: theme.colors.text }}>
                  {p.name}
                </div>
                <div style={{ fontFamily: theme.fonts.mono, fontSize: 13, color: theme.colors.textDim }}>
                  {p.tone}
                </div>
              </div>
            </div>
            <div
              style={{
                padding: "6px 12px",
                borderRadius: 8,
                background: "rgba(52, 211, 153, 0.15)",
                color: theme.colors.accent,
                fontFamily: theme.fonts.mono,
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: "0.05em",
              }}
            >
              READY TO POST
            </div>
          </PopEntrance>
        ))}
      </div>
    </div>
  );
};

/**
 * সিন ১০: হিউম্যান কন্ট্রোল ও ১-ক্লিক অ্যাপ্রুভাল গেটওয়ে (Pending -> Approved)
 */
const VisualHumanApprovalGate: React.FC<{ delay: number }> = ({ delay }) => {
  const frame = useCurrentFrame();
  const isApproved = frame >= delay + 30;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        paddingBottom: 40,
      }}
    >
      <PopEntrance
        delay={delay}
        cfg="smooth"
        style={{
          width: 880,
          borderRadius: 24,
          background: "rgba(16, 24, 44, 0.95)",
          backdropFilter: "blur(24px)",
          border: `2px solid ${isApproved ? theme.colors.accent : theme.colors.border}`,
          boxShadow: isApproved
            ? `0 0 60px ${createColorWithAlpha(theme.colors.accent, 0.4)}`
            : `0 30px 70px -15px ${theme.colors.shadow}`,
          padding: "36px 44px",
          display: "flex",
          flexDirection: "column",
          gap: 24,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <BrandIconBadge brand="linkedin" size={50} />
            <div>
              <div style={{ fontFamily: theme.fonts.display, fontSize: 24, fontWeight: 700, color: theme.colors.text }}>
                LinkedIn Post Review
              </div>
              <div style={{ fontFamily: theme.fonts.mono, fontSize: 14, color: theme.colors.textDim }}>
                Drafted by AI • Awaiting 1-Click Approval
              </div>
            </div>
          </div>
          <BadgeChip
            text={isApproved ? "APPROVED" : "PENDING REVIEW"}
            tone={isApproved ? "accent" : "warning"}
            mono
            size={18}
          />
        </div>

        <div
          style={{
            padding: "20px 24px",
            borderRadius: 16,
            background: "rgba(255, 255, 255, 0.04)",
            border: `1.5px solid ${theme.colors.border}`,
            fontFamily: theme.fonts.display,
            fontSize: 18,
            color: theme.colors.text,
            lineHeight: 1.6,
          }}
        >
          🚀 5 AI Automation Frameworks that cut manual repetitive work by 80%. Here is the exact breakdown...
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 8 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <VectorIcon name="check" size={24} color={isApproved ? theme.colors.accent : theme.colors.textDim} />
            <span style={{ fontFamily: theme.fonts.mono, fontSize: 15, color: theme.colors.textDim }}>
              Human In The Loop • You have 100% Final Control
            </span>
          </div>

          <div
            style={{
              padding: "10px 26px",
              borderRadius: 12,
              background: isApproved ? theme.colors.accent : "rgba(255,255,255,0.1)",
              color: isApproved ? "#052e16" : "#FFFFFF",
              fontFamily: theme.fonts.mono,
              fontSize: 15,
              fontWeight: 800,
              display: "flex",
              alignItems: "center",
              gap: 8,
              transition: "all 0.3s ease",
            }}
          >
            {isApproved ? "READY TO PUBLISH" : "CLICK TO APPROVE"}
          </div>
        </div>
      </PopEntrance>
    </div>
  );
};

/**
 * সিন ১১: টার্গেট অডিয়েন্স ও হাই-টেক CTA বাটন
 */
const VisualBentoAudienceAndCta: React.FC<{ delay: number }> = ({ delay }) => {
  const audiences = [
    { title: "Agency Owners", desc: "Scale Client Deliverables" },
    { title: "Content Creators", desc: "Never Miss a Daily Post" },
    { title: "SaaS & Founders", desc: "Automate Brand Presence" },
    { title: "Digital Marketers", desc: "Save 15+ Hours Weekly" },
  ];

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 36,
        paddingBottom: 40,
      }}
    >
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, width: 840 }}>
        {audiences.map((a, i) => (
          <PopEntrance
            key={i}
            delay={delay + i * 4}
            cfg="smooth"
            style={{
              padding: "20px 24px",
              borderRadius: 18,
              background: "rgba(255,255,255,0.04)",
              backdropFilter: "blur(16px)",
              border: `1.5px solid ${theme.colors.border}`,
              display: "flex",
              alignItems: "center",
              gap: 16,
            }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                background: "rgba(108, 124, 255, 0.15)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: theme.colors.primary,
              }}
            >
              <VectorIcon name="check" size={22} color={theme.colors.primary} />
            </div>
            <div>
              <div style={{ fontFamily: theme.fonts.display, fontSize: 20, fontWeight: 700, color: theme.colors.text }}>
                {a.title}
              </div>
              <div style={{ fontFamily: theme.fonts.mono, fontSize: 13, color: theme.colors.textDim }}>
                {a.desc}
              </div>
            </div>
          </PopEntrance>
        ))}
      </div>

      <PopEntrance delay={delay + 18} cfg="bouncy" scale={0.85}>
        <div
          style={{
            padding: "20px 48px",
            borderRadius: 9999,
            background: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.accent})`,
            boxShadow: `0 0 45px ${createColorWithAlpha(theme.colors.accent, 0.55)}`,
            fontFamily: theme.fonts.display,
            fontSize: 26,
            fontWeight: 800,
            color: "#0B0F19",
            display: "flex",
            alignItems: "center",
            gap: 14,
          }}
        >
          <VectorIcon name="send" size={24} color="#0B0F19" />
          <span>আপনার ব্যবসার জন্য অটোমেশন সেটআপ করতে DM করুন</span>
        </div>
      </PopEntrance>
    </div>
  );
};

/* ---------- ৪. মেইন অটো-ড্রাফট সিন রাউটার (১০০% ইউনিক সিন ম্যাপিং) ---------- */
const AutoDraftScene: React.FC<{ group: SubtitleCueGroup; totalScenes: number }> = ({ group, totalScenes }) => {
  const getSceneFrame = useAbsoluteSecondsToSceneFrames();
  const sceneStartFrame = getSceneFrame(group.cues[0].start);

  // প্রতিটি কিউয়ের বিষয়বস্তু অনুযায়ী ১১টি সম্পূর্ণ পৃথক ও ইউনিক দৃশ্যে ম্যাপিং
  let sceneVisual: React.ReactNode;
  const cueN = group.cues[0]?.n || 1;

  if (cueN <= 2) {
    // কিউ ১-২: সমস্যা ও ফ্যাটিগ (ক্লক ও পোস্টের জটলা)
    sceneVisual = <VisualHookFatigue delay={sceneStartFrame} />;
  } else if (cueN <= 5) {
    // কিউ ৩-৫: সমাধান উপস্থাপন (ম্যানুয়াল বনাম অটোমেশন কম্প্যারিজন)
    sceneVisual = <VisualSolutionComparison delay={sceneStartFrame} />;
  } else if (cueN <= 7) {
    // কিউ ৬-৭: কন্টেন্ট ক্যালেন্ডার শিট টেবিল থেকে লাইভ ডাটা পিক
    sceneVisual = <VisualContentCalendarScene delay={sceneStartFrame} />;
  } else if (cueN <= 10) {
    // কিউ ৮-১০: শিডিউল ট্রিগার ও টপিক এক্সট্র্যাক্টর পাইপলাইন নোডস
    sceneVisual = <VisualTopicExtractorPipeline delay={sceneStartFrame} />;
  } else if (cueN <= 12) {
    // কিউ ১১-১২: জেমিনি ১.৫ ফ্ল্যাশ এআই এজেন্ট প্রসেসিং
    sceneVisual = <VisualGeminiAIAgent delay={sceneStartFrame} />;
  } else if (cueN <= 14) {
    // কিউ ১৩-১৪: প্রতিটি সোশ্যাল প্ল্যাটফর্মের টোন ও ক্যারেক্টার লিমিট
    sceneVisual = <VisualPlatformFormatRules delay={sceneStartFrame} />;
  } else if (cueN <= 16) {
    // কিউ ১৫-১৬: গুগল শিটে সেভ ও স্ট্যাটাস WRITTEN আপডেট
    sceneVisual = <VisualSaveToSheets delay={sceneStartFrame} />;
  } else if (cueN <= 18) {
    // কিউ ১৭-১৮: এরর হ্যান্ডলিং ও নতুন প্ল্যাটফর্ম এক্সটেনসিবিলিটি
    sceneVisual = <VisualErrorAndExtensibility delay={sceneStartFrame} />;
  } else if (cueN <= 21) {
    // কিউ ১৯-২১: সেন্ট্রাল ইঞ্জিন থেকে ৫টি সোশ্যাল প্ল্যাটফর্মে ওয়্যার কানেকশন
    sceneVisual = <VisualConnectedPublishingHub delay={sceneStartFrame} />;
  } else if (cueN <= 24) {
    // কিউ ২২-২৪: হিউম্যান ইন দ্য লুপ ও ১-ক্লিক অ্যাপ্রুভাল গেটওয়ে
    sceneVisual = <VisualHumanApprovalGate delay={sceneStartFrame} />;
  } else {
    // কিউ ২৫-২৭: টার্গেট অডিয়েন্স বেন্টো ও হাই-টেক CTA বাটন
    sceneVisual = <VisualBentoAudienceAndCta delay={sceneStartFrame} />;
  }

  return (
    <>
      {/* মূল ভিজ্যুয়াল মোশন গ্রাফিক্স (৯৫% স্ক্রিন জুড়ে) */}
      {sceneVisual}

      {/* নিচে মিনিমাল সাবটাইটেল ক্যাপসুল বার */}
      <SleekBottomSubtitleBar cues={group.cues} />

      {/* সাউন্ড ইফেক্টস */}
      <SfxSound name="whoosh" frame={sceneStartFrame} vol={0.65} />
      <SfxSound name="pop" frame={sceneStartFrame + 10} vol={0.7} />
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
        gap: 32,
      }}
    >
      <VectorIcon name="inbox" size={80} color={theme.colors.primary} />
      <div style={{ fontFamily: theme.fonts.display, fontSize: 36, color: theme.colors.text }}>
        input-content ফোল্ডারে voiceover.srt ও অডিও ফাইল দিন
      </div>
      <BadgeChip text="npm run prepare-new-video" tone="accent" mono size={24} />
    </div>
  );
};

/* ---------- ৫. এক্সপোর্ট ফাংশন ---------- */
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

export const autoScenes = generateAutoDraftScenes;
