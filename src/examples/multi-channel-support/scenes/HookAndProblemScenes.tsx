import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { theme, withAlpha } from "../../../video-theme";
import { at, cueStart, evenly } from "../../../srt-timing";
import { useAbs } from "../../../lib/scene-context";
import { Icon, IconName } from "../../../lib/vector-icons";
import { Abs, Avatar, Bubble, Chip, Float, Glass, NNode, Pop, Sfx, Typing, Wire, Words, HL, useP } from "../../../lib/motion-ui-components";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/* ---------- ১. Hook (cue 1–3): Kinetic Typography ---------- */
export const Hook: React.FC = () => {
  const f = useAbs();
  const frame = useCurrentFrame();
  const beats: { cue: number; words: string; icon: IconName; hl: number; tone: "primary" | "accent" }[] = [
    { cue: 1, words: "আপনি ঘুমিয়ে আছেন,", icon: "moon", hl: 1, tone: "primary" },
    { cue: 2, words: "বন্ধুদের সাথে আড্ডা দিচ্ছেন", icon: "chat", hl: 2, tone: "accent" },
    { cue: 3, words: "কিংবা travel করছেন।", icon: "plane", hl: 1, tone: "primary" },
  ];
  return (
    <>
      {beats.map((b, i) => {
        const start = f(cueStart(b.cue));
        const nextStart = i + 1 < beats.length ? f(cueStart(beats[i + 1].cue)) : 99999;
        const dim = interpolate(frame, [nextStart, nextStart + 10], [1, 0.3], clamp);
        const yy = 250 + i * 190;
        // আইকন মেডালিয়ন
        const pin = useP(start, "bouncy");
        const out = interpolate(frame, [nextStart - 6, nextStart + 3], [1, 0], { ...clamp, easing: theme.ease.in });
        const c = b.tone === "primary" ? theme.colors.primary : theme.colors.accent;
        return (
          <React.Fragment key={b.cue}>
            <Abs x={120} y={yy} style={{ opacity: dim, width: 1050 }}>
              <Words text={b.words} delay={start} per={4} size={86} hl={[b.hl]} hlColor={c} maxWidth={1050} />
            </Abs>
            <Abs x={1220} y={150} w={560} h={560} style={{
              opacity: frame >= start ? Math.min(1, pin * 1.5) * out : 0,
              transform: `scale(${(0.6 + 0.4 * pin) * (0.9 + 0.1 * out)})`,
            }}>
              <div style={{ position: "absolute", inset: 60, borderRadius: 999, background: withAlpha(c, 0.12), border: `3px solid ${withAlpha(c, 0.5)}`,
                boxShadow: `0 0 120px ${withAlpha(c, 0.35)}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Float amp={8} period={70}><Icon name={b.icon} size={230} color={c} stroke={1.5} /></Float>
              </div>
              {[0, 1, 2].map((k) => {
                const a = ((frame * 1.6 + k * 120) * Math.PI) / 180;
                return <div key={k} style={{ position: "absolute", left: 280 + Math.cos(a) * 250 - 9, top: 280 + Math.sin(a) * 250 - 9, width: 18, height: 18, borderRadius: 18,
                  background: c, opacity: 0.85, boxShadow: `0 0 18px ${c}` }} />;
              })}
            </Abs>
            {i === 0 ? <Sfx name="thud" frame={start} /> : <Sfx name="pop" frame={start} rate={1 + i * 0.05} />}
          </React.Fragment>
        );
      })}
    </>
  );
};

/* ---------- ২. Problem 1 (cue 4–5): Glossy UI Mockup ---------- */
export const Problem1: React.FC = () => {
  const f = useAbs();
  const frame = useCurrentFrame();
  const tChat = f(at(4, "এদিকে"));
  const tMsg = f(at(4, "message দিয়ে"));
  const tWait = f(at(4, "দ্রুত reply না পেয়ে"));
  const tLeave = f(at(4, "চলে গেল"));
  const tCard = f(at(4, "অন্য কারোর"));
  // অবতার চ্যাট থেকে কার্ডে যায়
  const m = interpolate(frame, [tLeave, tLeave + 26], [0, 1], { ...clamp, easing: theme.ease.inOut });
  const ax = 200 + (1160 - 200) * m;
  const ay = 226 + (700 - 226) * m - Math.sin(m * Math.PI) * 120;
  const chatDim = interpolate(frame, [tLeave + 10, tLeave + 30], [1, 0.4], clamp);
  const ring = frame - tWait;
  return (
    <>
      <Glass x={130} y={170} w={800} h={740} delay={tChat} style={{ opacity: chatDim }}>
        <div style={{ height: 112, borderBottom: `2px solid ${theme.colors.border}`, display: "flex", alignItems: "center", padding: "0 34px", gap: 20 }}>
          <div style={{ width: 72 }} />
          <div style={{ fontFamily: theme.fonts.display, fontSize: 34, fontWeight: theme.weight.strong, color: theme.colors.text }}>Customer</div>
          <div style={{ width: 14, height: 14, borderRadius: 14, background: theme.colors.accent, boxShadow: `0 0 14px ${theme.colors.accent}` }} />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 22, padding: "34px 34px" }}>
          <Bubble text="Hi, price কত?" delay={tMsg} side="in" tone="primary" maxW={560} />
          <Bubble text="কেউ আছেন?" delay={tWait} side="in" tone="primary" maxW={560} />
          <Pop delay={tWait + 8} cfg="snappy" y={18} style={{ alignSelf: "flex-end", marginTop: 40 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "20px 28px", borderRadius: 24, borderBottomRightRadius: 8,
              border: `3px dashed ${withAlpha(theme.colors.danger, 0.6)}`, color: theme.colors.danger, fontFamily: theme.fonts.display, fontSize: 30, fontWeight: theme.weight.strong }}>
              <Icon name="clock" size={36} color={theme.colors.danger} />
              reply নেই
            </div>
          </Pop>
        </div>
      </Glass>
      {/* চ্যাট হেডারের অবতার (যাত্রা শুরু হলে এটাই সরে যায়) */}
      <Abs x={m === 0 ? 164 : ax - 36} y={m === 0 ? 190 : ay - 36} style={{ opacity: frame >= tChat + 6 ? 1 : 0, zIndex: 5 }}>
        <Avatar size={72} tone={m > 0 ? "danger" : "primary"} />
      </Abs>
      {/* ঘড়ির রিং: অপেক্ষা */}
      {frame >= tWait ? (
        <Abs x={1010} y={190} w={110} h={110} style={{ opacity: interpolate(frame, [tLeave, tLeave + 10], [1, 0], clamp) }}>
          <svg width={110} height={110} viewBox="0 0 110 110">
            <circle cx={55} cy={55} r={46} fill="none" stroke={theme.colors.border} strokeWidth={6} />
            <circle cx={55} cy={55} r={46} fill="none" stroke={theme.colors.danger} strokeWidth={6} strokeLinecap="round"
              strokeDasharray={`${Math.min(ring * 4, 230)} 400`} transform="rotate(-90 55 55)" />
          </svg>
          <Abs x={31} y={31}><Icon name="hourglass" size={48} color={theme.colors.danger} /></Abs>
        </Abs>
      ) : null}
      <Abs x={1010} y={330}>
        <Words text="দ্রুত reply না পেয়ে" delay={tWait} per={4} size={70} hl={[1]} hlColor={theme.colors.danger} maxWidth={820} />
        <Words text="চলে গেল" delay={tLeave} per={4} size={92} color={theme.colors.danger} style={{ marginTop: 6 }} />
      </Abs>
      <Glass x={1010} y={580} w={780} h={250} delay={tCard} tone={m > 0.95 ? "danger" : null}>
        <div style={{ display: "flex", alignItems: "center", gap: 28, padding: "40px 44px" }}>
          <div style={{ width: 120, height: 120, borderRadius: 30, background: theme.colors.panelStrong, border: `2px solid ${theme.colors.border}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon name="briefcase" size={62} color={theme.colors.textDim} />
          </div>
          <div>
            <div style={{ fontFamily: theme.fonts.display, fontSize: 46, fontWeight: theme.weight.heavy, color: theme.colors.text, lineHeight: 1.4 }}>অন্য কারোর কাছে</div>
            <Chip text="customer চলে গেছে" tone="danger" size={26} icon="x" />
          </div>
        </div>
      </Glass>
      <Sfx name="pop" frame={tChat} />
      <Sfx name="whoosh" frame={tLeave} rate={1.1} vol={0.8} />
    </>
  );
};

/* ---------- ৩. Problem 2 (cue 6–7): Statement + falling curve ---------- */
export const Problem2: React.FC = () => {
  const f = useAbs();
  const frame = useCurrentFrame();
  const tCust = f(at(6, "সম্ভাব্য customer"));
  const tRev = f(at(7, "ব্যবসার revenue"));
  const tLost = f(at(7, "হারিয়েছেন"));
  const drawP = interpolate(frame, [tRev + 6, tRev + 52], [0, 1], { ...clamp, easing: theme.ease.inOut });
  const dotP = useP(tRev + 52, "bouncy");
  const path = "M 70 400 C 190 380, 250 200, 380 170 S 600 250, 730 430";
  return (
    <>
      <Abs x={120} y={230}>
        <Words text="এমন অভিজ্ঞতা" delay={f(cueStart(6))} per={4} size={50} color={theme.colors.textDim} />
      </Abs>
      <Abs x={120} y={330}>
        <Words text="সম্ভাব্য customer" delay={tCust} per={4} size={96} />
        <Words text="ও ব্যবসার revenue" delay={tRev} per={4} size={96} hl={[2]} hlColor={theme.colors.primary} />
        <div style={{ marginTop: 10 }}>
          <Words text="হারিয়েছেন" delay={tLost} per={4} size={120} color={theme.colors.danger} />
        </div>
      </Abs>
      {/* ঝরে পড়া customer অবতার */}
      {[0, 1, 2, 3, 4].map((i) => {
        const out = interpolate(frame, [tLost + i * 4, tLost + i * 4 + 20], [0, 1], { ...clamp, easing: theme.ease.in });
        return (
          <Abs key={i} x={1010 + i * 96} y={170} style={{ transform: `translate(${out * 30}px, ${out * 70}px)`, opacity: 1 - out }}>
            <Pop delay={f(cueStart(6)) + 6 + i * 4} cfg="snappy" y={20}><Avatar size={76} tone={out > 0 ? "danger" : "primary"} /></Pop>
          </Abs>
        );
      })}
      <Glass x={1000} y={300} w={800} h={560} delay={f(cueStart(6)) + 14}>
        <Abs x={34} y={30}><Chip text="Revenue" tone="primary" icon="trendDown" size={28} /></Abs>
        <svg width={800} height={560} style={{ position: "absolute", left: 0, top: 0 }}>
          {[1, 2, 3, 4].map((k) => <line key={k} x1={50} x2={750} y1={90 + k * 90} y2={90 + k * 90} stroke={theme.colors.border} strokeWidth={2} strokeDasharray="8 10" />)}
          <path d={path} transform="translate(0,60)" fill="none" stroke={theme.colors.danger} strokeWidth={8} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - drawP} />
          <circle cx={730} cy={490} r={14 * dotP} fill={theme.colors.danger} style={{ filter: `drop-shadow(0 0 14px ${theme.colors.danger})` }} opacity={drawP >= 1 ? 1 : 0} />
        </svg>
      </Glass>
      <Sfx name="pop" frame={tCust} />
      <Sfx name="whoosh" frame={tLost} rate={0.9} vol={0.8} />
    </>
  );
};

/* ---------- ৪. Title (cue 8): Kinetic Typography + লোগো রিভিল ---------- */
export const Title: React.FC = () => {
  const f = useAbs();
  const frame = useCurrentFrame();
  const t0 = f(cueStart(8));
  const tMain = f(at(8, "Multi-Channel"));
  const mark = useP(t0 + 6, "bouncy");
  return (
    <>
      <Abs x={0} y={180} w={1920} style={{ display: "flex", justifyContent: "center" }}>
        <Words text="এই সমস্যার সমাধানে তৈরি করেছি" delay={t0} per={4} size={54} color={theme.colors.textDim} align="center" />
      </Abs>
      <Abs x={860} y={290} w={200} h={200} style={{ opacity: Math.min(1, mark * 1.4), transform: `scale(${0.5 + 0.5 * mark})` }}>
        <div style={{ position: "absolute", inset: 0, borderRadius: 60, background: `linear-gradient(150deg, ${theme.colors.primary}, ${withAlpha(theme.colors.primary, 0.55)})`,
          boxShadow: `0 0 90px ${theme.colors.glow}`, display: "flex", alignItems: "center", justifyContent: "center", transform: `rotate(${(1 - mark) * -90}deg)` }}>
          <Icon name="bot" size={110} color={theme.colors.white} stroke={1.8} />
        </div>
        {[0, 1].map((k) => {
          const a = ((frame * 2.2 + k * 180) * Math.PI) / 180;
          return <div key={k} style={{ position: "absolute", left: 100 + Math.cos(a) * 128 - 11, top: 100 + Math.sin(a) * 128 - 11, width: 22, height: 22, borderRadius: 22,
            background: k ? theme.colors.accent : theme.colors.white, boxShadow: `0 0 20px ${k ? theme.colors.accent : theme.colors.white}` }} />;
        })}
      </Abs>
      <Abs x={0} y={540} w={1920} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <Words text="Multi-Channel Support" delay={tMain} per={5} size={124} align="center" lineHeight={1.25} gap={30} />
        <Words text="Automation" delay={tMain + 12} per={5} size={140} align="center" lineHeight={1.25} grad={[0]} />
      </Abs>
      <Abs x={560} y={880} w={800} style={{ display: "flex", justifyContent: "center" }}>
        <Pop delay={tMain + 30} cfg="smooth" y={20}>
          <div style={{ height: 8, width: 520, borderRadius: 8, background: `linear-gradient(90deg, ${theme.colors.primary}, ${theme.colors.accent})`, boxShadow: `0 0 40px ${theme.colors.glow}` }} />
        </Pop>
      </Abs>
      <Sfx name="chime" frame={t0 + 6} />
      <Sfx name="whoosh" frame={tMain} vol={0.9} />
    </>
  );
};

/* ---------- ৫. Hub (cue 9–10): Hub-and-Spoke ---------- */
export const Hub: React.FC = () => {
  const f = useAbs();
  const frame = useCurrentFrame();
  const tAgent = f(at(9, "AI agent"));
  const tCh = f(at(9, "Facebook Messenger"));
  const tMsg = f(at(9, "customer's"));
  const tReply = f(at(10, "উত্তর দেবে"));
  const tBusy = f(at(10, "এমনকি"));
  const AG: [number, number] = [960, 660];
  const MS: [number, number] = [420, 660];
  const WA: [number, number] = [1500, 660];
  return (
    <>
      <Abs x={0} y={110} w={1920} style={{ display: "flex", justifyContent: "center" }}>
        <Words text="একটি AI agent" delay={tAgent - 6} per={5} size={110} align="center" grad={[1, 2]} />
      </Abs>
      <Abs x={0} y={290} w={1920} style={{ display: "flex", justifyContent: "center" }}>
        <Words text="আপনার হয়ে উত্তর দেবে" delay={tReply} per={4} size={56} color={theme.colors.textDim} align="center" />
      </Abs>
      {/* ঘূর্ণায়মান হাব রিং */}
      <Abs x={AG[0] - 190} y={AG[1] - 190} w={380} h={380} style={{ opacity: frame >= tAgent ? 1 : 0, transform: `rotate(${frame * 0.8}deg)` }}>
        <svg width={380} height={380}><circle cx={190} cy={190} r={176} fill="none" stroke={withAlpha(theme.colors.primary, 0.4)} strokeWidth={3} strokeDasharray="4 16" strokeLinecap="round" /></svg>
      </Abs>
      <Wire from={[MS[0] + 90, MS[1] - 14]} to={[AG[0] - 120, AG[1] - 14]} delay={tCh + 6} pulse={{ start: tMsg + 8, period: 40, loop: true }} tone="primary" />
      <Wire from={[AG[0] - 120, AG[1] + 14]} to={[MS[0] + 90, MS[1] + 14]} delay={tCh + 8} pulse={{ start: tReply + 6, period: 40, loop: true }} tone="accent" />
      <Wire from={[WA[0] - 90, WA[1] - 14]} to={[AG[0] + 120, AG[1] - 14]} delay={tCh + 10} pulse={{ start: tMsg + 14, period: 40, loop: true }} tone="primary" />
      <Wire from={[AG[0] + 120, AG[1] + 14]} to={[WA[0] - 90, WA[1] + 14]} delay={tCh + 12} pulse={{ start: tReply + 12, period: 40, loop: true }} tone="accent" />
      <NNode cx={AG[0]} cy={AG[1]} size={240} icon="bot" label="AI Agent" tone="primary" delay={tAgent} activeFrom={tAgent + 6} float={5} labelSize={38} />
      <NNode cx={MS[0]} cy={MS[1]} size={180} icon="bubble" label="Messenger" labelSize={32} tone="primary" delay={tCh} float={4} />
      <NNode cx={WA[0]} cy={WA[1]} size={180} labelSize={32} icon="bubble" label="WhatsApp" tone="accent" delay={tCh + 4} float={4} />
      <Abs x={MS[0] - 150} y={430}><Bubble text="price কত?" delay={tMsg} side="in" tone="dim" size={30} maxW={300} /></Abs>
      <Abs x={WA[0] - 150} y={430}><Bubble text="Hi, কেউ আছেন?" delay={tMsg + 6} side="in" tone="dim" size={30} maxW={320} /></Abs>
      <Abs x={560} y={940} w={800} style={{ display: "flex", justifyContent: "center" }}>
        <Pop delay={tBusy} cfg="snappy" y={20}><Chip text="আপনি ব্যস্ত, তবু reply যাচ্ছে" tone="accent" icon="clock" size={32} /></Pop>
      </Abs>
      <Sfx name="whoosh" frame={tAgent - 6} vol={0.8} />
      <Sfx name="pop" frame={tAgent} />
      <Sfx name="pop" frame={tCh} rate={1.06} />
    </>
  );
};

/* ---------- ৬. Feature intro (cue 11): Statement Card ---------- */
export const FeatIntro: React.FC = () => {
  const f = useAbs();
  const t0 = f(cueStart(11));
  const icons: IconName[] = ["send", "user", "sheet", "globe", "db", "tag", "shuffle", "pause"];
  return (
    <>
      <Abs x={0} y={250} w={1920} style={{ display: "flex", justifyContent: "center" }}>
        <Words text="কী কী feature আছে?" delay={t0} per={5} size={120} align="center" grad={[1]} />
      </Abs>
      <Abs x={276} y={560} w={1400} h={170} style={{ display: "flex", gap: 24 }}>
        {icons.map((ic, i) => (
          <Pop key={i} delay={t0 + 12 + i * 3} cfg="bouncy" y={40} scale={0.7}>
            <Float amp={5} period={70} phase={i * 0.7}>
              <div style={{ width: 150, height: 150, borderRadius: 36, background: `linear-gradient(160deg, ${theme.colors.panelStrong}, ${theme.colors.panel})`,
                border: `2px solid ${theme.colors.border}`, boxShadow: `0 30px 60px -20px ${theme.colors.shadow}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon name={ic} size={70} color={i % 2 ? theme.colors.accent : theme.colors.primary} stroke={1.7} />
              </div>
            </Float>
          </Pop>
        ))}
      </Abs>
      <Abs x={0} y={770} w={1920} style={{ display: "flex", justifyContent: "center" }}>
        <Pop delay={t0 + 40} cfg="smooth" y={16}><div style={{ fontFamily: theme.fonts.mono, fontSize: 34, fontWeight: 600, color: theme.colors.textDim, letterSpacing: 0 }}>01 — 08</div></Pop>
      </Abs>
      <Sfx name="whoosh" frame={t0} vol={0.8} />
      <Sfx name="pop" frame={t0 + 12} />
    </>
  );
};

// ব্যবহার না হওয়া import এড়াতে
void HL; void NNode; void Typing; void evenly;
