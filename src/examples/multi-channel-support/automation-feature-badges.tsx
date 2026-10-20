import React from "react";
import { useCurrentFrame } from "remotion";
import { theme, withAlpha } from "../../video-theme";
import { Chip, Pop, Words } from "../../lib/motion-ui-components";

export const FEATS = [
  { en: "Automatic replies", bn: "স্বয়ংক্রিয় রিপ্লাই" },
  { en: "Personalized messaging", bn: "পার্সোনালাইজড মেসেজ" },
  { en: "Accurate information", bn: "নির্ভুল তথ্য" },
  { en: "Multi-language support", bn: "যেকোনো ভাষায় সাপোর্ট" },
  { en: "Conversation memory", bn: "চ্যাটের মেমোরি" },
  { en: "Smart pricing", bn: "স্মার্ট প্রাইসিং" },
  { en: "Same channel reply", bn: "একই চ্যানেলে রিপ্লাই" },
  { en: "Human takeover", bn: "নিজে দায়িত্ব নিন" },
];

export const FeatureHeader: React.FC<{ idx: number; delay?: number }> = ({ idx, delay = 0 }) => {
  const frame = useCurrentFrame();
  const f = FEATS[idx - 1];
  return (
    <>
      <div style={{ position: "absolute", left: 120, top: 62, display: "flex", gap: 16, alignItems: "center" }}>
        <Pop delay={delay} cfg="bouncy" y={16}><Chip text={`${String(idx).padStart(2, "0")} / 08`} tone="primary" solid mono size={26} /></Pop>
        <Pop delay={delay + 4} cfg="snappy" y={16}><Chip text={f.en} tone="dim" size={26} /></Pop>
      </div>
      <div style={{ position: "absolute", left: 120, top: 126 }}>
        <Words text={f.bn} delay={delay + 6} per={5} size={92} gap={22} />
      </div>
      {/* ডানদিকের প্রগ্রেস ডট */}
      <div style={{ position: "absolute", right: 120, top: 84, display: "flex", gap: 12, alignItems: "center" }}>
        {FEATS.map((_, i) => {
          const cur = i + 1 === idx;
          const done = i + 1 < idx;
          return (
            <Pop key={i} delay={delay + 2 + i} cfg="snappy" y={10} scale={0.5}>
              <div style={{
                width: cur ? 52 : 16, height: 16, borderRadius: 16,
                background: cur ? theme.colors.primary : done ? theme.colors.accent : withAlpha(theme.colors.textDim, 0.35),
                boxShadow: cur ? `0 0 24px ${theme.colors.glow}` : undefined,
                opacity: frame >= 0 ? 1 : 0,
              }} />
            </Pop>
          );
        })}
      </div>
    </>
  );
};
