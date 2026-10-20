import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { theme, withAlpha } from "../../../video-theme";
import { at, cueStart, evenly } from "../../../srt-timing";
import { useAbs } from "../../../lib/scene-context";
import { Icon, IconName } from "../../../lib/vector-icons";
import { FEATS } from "../automation-feature-badges";
import { Abs, Chip, Float, Glass, Pop, Sfx, Words, Tone, toneColor, toneSoft, useP } from "../../../lib/motion-ui-components";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/* ---------- Who (cue 32–36): Bento Grid ---------- */
type Item = { text: string; icon: IconName; t: number };
export const Who: React.FC = () => {
  const f = useAbs();
  const t0 = f(cueStart(32));
  const e33 = evenly(33, 2).map((s) => f(s));
  const e34 = evenly(34, 2).map((s) => f(s));
  const e35 = evenly(35, 2).map((s) => f(s));
  const e36 = evenly(36, 3).map((s) => f(s));
  const W = 533, G = 30, X = [130, 130 + W + G, 130 + 2 * (W + G)];
  const cards: { x: number; y: number; w: number; tone: Tone; items: Item[] }[] = [
    { x: X[0], y: 330, w: W, tone: "primary", items: [{ text: "Service business", icon: "briefcase", t: e33[0] }, { text: "Agency", icon: "target", t: e33[1] }] },
    { x: X[1], y: 330, w: W, tone: "accent", items: [{ text: "Freelancer", icon: "laptop", t: e34[0] }, { text: "Consultant", icon: "user", t: e34[1] }] },
    { x: X[2], y: 330, w: W, tone: "primary", items: [{ text: "Online shop", icon: "bag", t: e35[0] }, { text: "E-commerce", icon: "tag", t: e35[1] }] },
    { x: X[0], y: 660, w: W, tone: "accent", items: [{ text: "Coaching center", icon: "cap", t: e36[0] }, { text: "Clinic", icon: "pulse", t: e36[1] }] },
    { x: X[1], y: 660, w: 2 * W + G, tone: "primary", items: [{ text: "অন্যান্য online ভিত্তিক ব্যবসা", icon: "globe", t: e36[2] }] },
  ];
  return (
    <>
      <Abs x={120} y={90}><Words text="এটি কাদের জন্য উপযোগী?" delay={t0} per={5} size={88} grad={[2]} /></Abs>
      {cards.map((c, ci) => (
        <React.Fragment key={ci}>
          <Glass x={c.x} y={c.y} w={c.w} h={290} delay={c.items[0].t - 2} tone={c.tone}>
            <div style={{ padding: "34px 36px", display: "flex", flexDirection: "column", gap: 22 }}>
              {c.items.map((it, k) => (
                <Pop key={k} delay={it.t} cfg="snappy" y={18} x={-20}>
                  <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
                    <div style={{ width: 84, height: 84, borderRadius: 24, background: toneSoft(c.tone), border: `2px solid ${withAlpha(toneColor(c.tone), 0.5)}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <Icon name={it.icon} size={46} color={toneColor(c.tone)} />
                    </div>
                    <div style={{ fontFamily: theme.fonts.display, fontSize: it.text.length > 20 ? 52 : 40, fontWeight: 700, color: theme.colors.text, lineHeight: 1.3, letterSpacing: 0 }}>{it.text}</div>
                  </div>
                </Pop>
              ))}
            </div>
          </Glass>
          <Sfx name="pop" frame={c.items[0].t - 2} rate={1 + ci * 0.03} />
        </React.Fragment>
      ))}
      <Sfx name="whoosh" frame={t0} vol={0.8} />
    </>
  );
};

/* ---------- Why (cue 37–42): Checklist + ring ---------- */
const BENEFITS: { text: string; icon: IconName }[] = [
  { text: "customer দ্রুত উত্তর পাবে", icon: "zap" },
  { text: "একই প্রশ্নের উত্তর বারবার দিতে হবে না", icon: "repeat" },
  { text: "Messenger ও WhatsApp support সহজ হবে", icon: "inbox" },
  { text: "service ও price নিয়ে নির্ভুল তথ্য", icon: "target" },
  { text: "সময় বাঁচবে, manual কাজ কমবে", icon: "hourglass" },
  { text: "চাইলে যেকোনো সময় নিজে দায়িত্ব নেবেন", icon: "userCheck" },
];
export const Why: React.FC = () => {
  const f = useAbs();
  const frame = useCurrentFrame();
  const t0 = f(cueStart(37));
  const ts = [
    f(at(38, "আপনার customer")), f(at(38, "বারবার")), f(at(38, "Messenger")),
    f(at(40, "Service ও price")), f(at(40, "আপনার সময়")), f(at(41, "প্রয়োজনে যেকোনো সময়")),
  ];
  const R = 140, C = 2 * Math.PI * R, seg = C / 6, gapLen = 14;
  return (
    <>
      <Abs x={120} y={170}>
        <Words text="আপনার ব্যবসার জন্য" delay={t0} per={4} size={58} color={theme.colors.textDim} />
        <Words text="কেন এটি গুরুত্বপূর্ণ?" delay={t0 + 10} per={5} size={92} maxWidth={720} grad={[2]} />
      </Abs>
      {/* ছয় অংশের রিং */}
      <Abs x={190} y={560} w={380} h={380}>
        <Pop delay={t0 + 18} cfg="smooth" y={24}>
          <svg width={380} height={380} viewBox="0 0 380 380">
            <g transform="rotate(-90 190 190)">
              {ts.map((t, i) => {
                const p = interpolate(frame, [t + 4, t + 18], [0, 1], { ...clamp, easing: theme.ease.out });
                return (
                  <React.Fragment key={i}>
                    <circle cx={190} cy={190} r={R} fill="none" stroke={theme.colors.border} strokeWidth={26} strokeLinecap="round"
                      strokeDasharray={`${seg - gapLen} ${C}`} strokeDashoffset={-i * seg} />
                    <circle cx={190} cy={190} r={R} fill="none" stroke={i % 2 ? theme.colors.accent : theme.colors.primary} strokeWidth={26} strokeLinecap="round"
                      strokeDasharray={`${(seg - gapLen) * p} ${C}`} strokeDashoffset={-i * seg} />
                  </React.Fragment>
                );
              })}
            </g>
          </svg>
          <Abs x={140} y={140}><Float amp={4} period={70}><Icon name="check" size={100} color={theme.colors.text} stroke={2} /></Float></Abs>
        </Pop>
      </Abs>
      {/* চেকলিস্ট */}
      <Abs x={880} y={104}>
        {BENEFITS.map((b, i) => {
          const t = ts[i];
          const tick = interpolate(frame, [t + 4, t + 14], [0, 1], { ...clamp, easing: theme.ease.out });
          return (
            <Pop key={i} delay={t} cfg="snappy" y={22} x={40} style={{ marginBottom: 22 }}>
              <div style={{ width: 930, height: 118, borderRadius: 30, boxSizing: "border-box", padding: "0 30px", display: "flex", alignItems: "center", gap: 24,
                background: `linear-gradient(160deg, ${theme.colors.panelStrong}, ${theme.colors.panel})`, border: `2px solid ${withAlpha(theme.colors.accent, 0.15 + 0.4 * tick)}` }}>
                <div style={{ width: 66, height: 66, borderRadius: 66, background: withAlpha(theme.colors.accent, 0.18 * tick), border: `3px solid ${withAlpha(theme.colors.accent, 0.4 + 0.6 * tick)}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <svg width={36} height={36} viewBox="0 0 24 24" fill="none" stroke={theme.colors.accent} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 6 9 17l-5-5" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - tick} />
                  </svg>
                </div>
                <div style={{ flex: 1, fontFamily: theme.fonts.display, fontSize: 38, fontWeight: 600, color: theme.colors.text, lineHeight: 1.35, letterSpacing: 0 }}>{b.text}</div>
                <Icon name={b.icon} size={44} color={theme.colors.textDim} />
              </div>
            </Pop>
          );
        })}
      </Abs>
      <Sfx name="whoosh" frame={t0} vol={0.8} />
      {ts.map((t, i) => <Sfx key={i} name="click" frame={t + 4} rate={1 + (i % 3) * 0.04} />)}
    </>
  );
};

/* ---------- Outro (cue 43–45): Recap Grid → CTA ---------- */
export const Outro: React.FC = () => {
  const f = useAbs();
  const frame = useCurrentFrame();
  const t0 = f(cueStart(43));
  const tCta = f(at(43, "pricing ও"));
  const tDM = f(cueStart(44));
  const tThanks = f(cueStart(45));
  const recapOut = interpolate(frame, [tCta - 2, tCta + 10], [0, 1], { ...clamp, easing: theme.ease.in });
  const bp = useP(tDM, "bouncy");
  const shine = interpolate(frame, [tDM + 12, tDM + 40], [-300, 1000], { ...clamp, easing: theme.ease.inOut });
  const glow = 0.5 + 0.5 * Math.sin((frame - tDM) / 12);
  const icons: IconName[] = ["send", "user", "sheet", "globe", "db", "tag", "shuffle", "pause"];
  return (
    <>
      <div style={{ position: "absolute", inset: 0, opacity: 1 - recapOut, transform: `translateY(${-recapOut * 30}px)` }}>
        <Abs x={0} y={170} w={1920} style={{ display: "flex", justifyContent: "center" }}>
          <Words text="এমন automation system" delay={t0} per={4} size={92} align="center" grad={[1, 2]} />
        </Abs>
        {FEATS.map((ft, i) => (
          <Pop key={i} delay={t0 + 10 + i * 3} cfg="snappy" y={30} scale={0.9} style={{ position: "absolute", left: 124 + (i % 4) * 424, top: 440 + Math.floor(i / 4) * 170 }}>
            <div style={{ width: 400, height: 140, borderRadius: 30, display: "flex", alignItems: "center", gap: 20, padding: "0 28px", boxSizing: "border-box",
              background: `linear-gradient(160deg, ${theme.colors.panelStrong}, ${theme.colors.panel})`, border: `2px solid ${theme.colors.border}` }}>
              <Icon name={icons[i]} size={52} color={i % 2 ? theme.colors.accent : theme.colors.primary} />
              <div style={{ fontFamily: theme.fonts.display, fontSize: 32, fontWeight: 600, color: theme.colors.text, lineHeight: 1.3, letterSpacing: 0 }}>{ft.bn}</div>
            </div>
          </Pop>
        ))}
      </div>
      {/* CTA */}
      <Abs x={0} y={150} w={1920} style={{ display: "flex", justifyContent: "center" }}>
        <Words text="pricing ও বিস্তারিত জানতে" delay={tCta + 4} per={4} size={72} color={theme.colors.textDim} align="center" />
      </Abs>
      <Abs x={560} y={360} w={800} h={190} style={{ opacity: frame >= tDM ? Math.min(1, bp * 1.5) : 0, transform: `scale(${0.7 + 0.3 * bp})` }}>
        <div style={{ position: "absolute", inset: 0, borderRadius: 95, overflow: "hidden", background: `linear-gradient(120deg, ${theme.colors.primary}, ${withAlpha(theme.colors.primary, 0.7)})`,
          boxShadow: `0 0 ${60 + glow * 50}px ${theme.colors.glow}, 0 40px 80px -24px ${theme.colors.shadow}`, display: "flex", alignItems: "center", justifyContent: "center", gap: 30 }}>
          <div style={{ position: "absolute", top: 0, bottom: 0, left: shine, width: 120, transform: "skewX(-20deg)", background: withAlpha(theme.colors.white, 0.25) }} />
          <Icon name="chat" size={84} color={theme.colors.white} stroke={1.8} />
          <div style={{ fontFamily: theme.fonts.display, fontSize: 88, fontWeight: 700, color: theme.colors.white, lineHeight: 1.3, letterSpacing: 0 }}>আমাকে DM করুন</div>
        </div>
      </Abs>
      <Abs x={0} y={680} w={1920} style={{ display: "flex", justifyContent: "center" }}>
        <Words text="ধন্যবাদ" delay={tThanks} per={4} size={140} align="center" grad={[0]} />
      </Abs>
      <Sfx name="pop" frame={t0 + 10} />
      <Sfx name="whoosh" frame={tCta} vol={0.8} />
      <Sfx name="chime" frame={tDM} />
      <Sfx name="pop" frame={tThanks} rate={1.05} />
    </>
  );
};

void Chip;
