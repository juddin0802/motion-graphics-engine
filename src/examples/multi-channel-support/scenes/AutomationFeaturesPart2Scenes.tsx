import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { theme, withAlpha } from "../../../video-theme";
import { at, cueStart } from "../../../srt-timing";
import { useAbs } from "../../../lib/scene-context";
import { Icon } from "../../../lib/vector-icons";
import { FeatureHeader } from "../automation-feature-badges";
import { Abs, Avatar, Bubble, Chip, Float, Glass, NNode, Pop, Sfx, Wire, useP } from "../../../lib/motion-ui-components";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/* ---------- F5: Conversation memory (cue 21–22): মেমোরি নোড ---------- */
export const F5: React.FC = () => {
  const f = useAbs();
  const t0 = f(cueStart(21));
  const tHist = f(at(21, "customer's chat"));
  const tMem = f(at(21, "মনে রাখে"));
  const tAgent = f(at(21, "তাই বারবার"));
  const tNo = f(at(22, "করতে হয় না"));
  const AG: [number, number] = [1230, 560], MEM: [number, number] = [1230, 830];
  return (
    <>
      <FeatureHeader idx={5} delay={t0} />
      <Glass x={120} y={380} w={640} h={590} delay={tHist}>
        <div style={{ padding: "26px 30px", display: "flex", flexDirection: "column", gap: 22 }}>
          <Chip text="Chat history" tone="dim" icon="inbox" size={26} />
          <Bubble text="আপনাদের service কী কী?" delay={tHist + 8} side="in" size={30} maxW={430} />
          <Bubble text="জি, service-এর তালিকা পাঠাচ্ছি।" delay={tHist + 14} side="out" tone="primary" size={30} maxW={440} />
          <Bubble text="price কত?" delay={tHist + 20} side="in" size={30} maxW={430} />
        </div>
      </Glass>
      <Wire from={[760, 700]} to={[MEM[0] - 65, MEM[1]]} delay={tMem - 8} tone="accent" pulse={{ start: tMem + 4, period: 36, loop: true }} />
      <NNode cx={MEM[0]} cy={MEM[1]} icon="db" label="Simple Memory" tone="accent" delay={tMem} size={130} activeFrom={tMem + 8} />
      <Wire from={[MEM[0], MEM[1] - 65]} to={[AG[0], AG[1] + 90]} delay={tAgent - 6} vertical dashed tone="accent" pulse={{ start: tAgent + 6, period: 34, loop: true }} />
      <NNode cx={AG[0]} cy={AG[1]} icon="bot" label="AI Agent" tone="primary" delay={tAgent} size={180} activeFrom={tAgent + 8} float={4} labelSize={32} labelAbove />
      {/* একই প্রশ্ন বারবার নয় */}
      <Abs x={1520} y={470}>
        <Pop delay={tAgent + 6} cfg="snappy" y={16}><Chip text="একই প্রশ্ন বারবার" tone="dim" icon="repeat" size={28} /></Pop>
      </Abs>
      <Abs x={1520} y={470} style={{ pointerEvents: "none" }}>
        <div style={{ position: "absolute", left: 10, top: 31, height: 5, borderRadius: 5, background: theme.colors.danger, boxShadow: `0 0 14px ${theme.colors.danger}`,
          width: interpolate(useCurrentFrame(), [tNo, tNo + 14], [0, 330], { ...clamp, easing: theme.ease.out }) }} />
      </Abs>
      <Abs x={1520} y={590}>
        <Pop delay={tNo + 10} cfg="bouncy" y={16}><Chip text="আগেরটা মনে আছে" tone="accent" icon="check" size={28} /></Pop>
      </Abs>
      <Sfx name="pop" frame={tHist} />
      <Sfx name="pop" frame={tMem} rate={1.05} />
      <Sfx name="click" frame={tNo} />
    </>
  );
};

/* ---------- F6: Smart pricing (cue 23–24): সিদ্ধান্ত গাছ ---------- */
export const F6: React.FC = () => {
  const f = useAbs();
  const frame = useCurrentFrame();
  const t0 = f(cueStart(23));
  const tAsk = f(at(23, "কোনো product"));
  const tDec = f(at(23, "নির্দিষ্ট price"));
  const tNo = f(at(23, "AI বানিয়ে"));
  const tQuote = f(at(24, "প্রয়োজনে quotation"));
  const tSend = f(at(24, "customerকে"));
  const AG: [number, number] = [700, 690], DC: [number, number] = [1050, 690];
  const dp = useP(tDec, "bouncy");
  const ring = frame >= tDec + 6 ? ((frame - tDec - 6) % 50) / 50 : 0;
  return (
    <>
      <FeatureHeader idx={6} delay={t0} />
      <Abs x={110} y={620}><Bubble text="service-এর price কত?" delay={tAsk} side="in" size={30} maxW={330} /></Abs>
      <Wire from={[420, 690]} to={[AG[0] - 90, AG[1]]} delay={tAsk + 8} tone="primary" pulse={{ start: tAsk + 18, period: 30 }} />
      <NNode cx={AG[0]} cy={AG[1]} icon="bot" label="AI Agent" tone="primary" delay={tAsk + 4} size={170} activeFrom={tAsk + 16} float={4} labelAbove />
      <Wire from={[AG[0] + 85, AG[1]]} to={[DC[0] - 70, DC[1]]} delay={tDec - 8} tone="dim" pulse={{ start: tDec + 4, period: 28 }} />
      {/* ডায়মন্ড সিদ্ধান্ত নোড */}
      <Abs x={DC[0] - 70} y={DC[1] - 70} w={140} h={140} style={{ opacity: frame >= tDec ? 1 : 0, transform: `scale(${0.5 + 0.5 * dp})` }}>
        {ring > 0 ? <div style={{ position: "absolute", inset: -ring * 34, transform: "rotate(45deg)", borderRadius: 30 + ring * 20, border: `3px solid ${withAlpha(theme.colors.primary, (1 - ring) * 0.6)}` }} /> : null}
        <div style={{ position: "absolute", inset: 14, transform: "rotate(45deg)", borderRadius: 26, background: `linear-gradient(160deg, ${theme.colors.bgAlt}, ${theme.colors.nodeFill})`,
          border: `3px solid ${theme.colors.primary}`, boxShadow: `0 0 50px ${theme.colors.glow}` }} />
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}><Icon name="tag" size={52} color={theme.colors.primary} /></div>
        <div style={{ position: "absolute", top: 156, left: -80, width: 300, textAlign: "center", fontFamily: theme.fonts.display, fontSize: 28, fontWeight: 600, color: theme.colors.text }}>price নেই?</div>
      </Abs>
      {/* উপরের শাখা: বানিয়ে বলে না */}
      <Wire from={[DC[0] + 70, DC[1] - 10]} to={[1330, 480]} delay={tNo - 6} tone="danger" pulse={{ start: tNo + 6, period: 26 }} />
      <Glass x={1330} y={380} w={520} h={200} delay={tNo} tone="danger">
        <div style={{ display: "flex", alignItems: "center", gap: 24, padding: "30px 34px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <Bubble text="??? টাকা" delay={tNo + 6} side="out" tone="dim" size={30} maxW={260} strike />
            <Chip text="বানিয়ে কিছু বলে না" tone="danger" icon="x" size={26} />
          </div>
        </div>
      </Glass>
      {/* নিচের শাখা: quotation page */}
      <Wire from={[DC[0] + 70, DC[1] + 10]} to={[1330, 830]} delay={tQuote - 6} tone="accent" pulse={{ start: tQuote + 6, period: 30 }} />
      <Glass x={1330} y={700} w={520} h={260} delay={tQuote} tone="accent">
        <div style={{ display: "flex", flexDirection: "column", gap: 20, padding: "30px 34px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <div style={{ width: 84, height: 84, borderRadius: 22, background: theme.colors.accentSoft, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Icon name="link" size={44} color={theme.colors.accent} />
            </div>
            <div style={{ fontFamily: theme.fonts.display, fontSize: 38, fontWeight: 700, color: theme.colors.text, lineHeight: 1.3 }}>Quotation page</div>
          </div>
          <Pop delay={tSend} cfg="bouncy" y={14}><Chip text="customerকে পাঠায়" tone="accent" icon="send" size={28} /></Pop>
        </div>
      </Glass>
      <Sfx name="pop" frame={tAsk} />
      <Sfx name="pop" frame={tDec} rate={1.06} />
      <Sfx name="click" frame={tNo + 8} />
      <Sfx name="pop" frame={tQuote} rate={1.04} />
    </>
  );
};

/* ---------- F7: Same channel reply (cue 25–27): দুই লেন ---------- */
export const F7: React.FC = () => {
  const f = useAbs();
  const t0 = f(cueStart(25));
  const tM = f(at(26, "customer Messenger"));
  const tMr = f(at(26, "Messenger reply"));
  const tW = f(at(26, "WhatsApp message"));
  const tWr = f(at(27, "reply যাবে"));
  const SW: [number, number] = [960, 700];
  const lane = (y: number, name: string, tone: "primary" | "accent", tIn: number, tOut: number, inText: string, outText: string) => (
    <>
      <Glass x={110} y={y - 105} w={1700} h={210} delay={tIn - 4} tone={tone} />
      <Abs x={150} y={y - 78}><Pop delay={tIn} cfg="snappy" y={14}><Chip text={name} tone={tone} icon="bubble" size={26} /></Pop></Abs>
      <Abs x={150} y={y - 22}><Bubble text={inText} delay={tIn + 4} side="in" size={30} maxW={360} /></Abs>
      <Abs x={1330} y={y - 78}><Pop delay={tOut} cfg="snappy" y={14}><Chip text={name} tone={tone} icon="bubble" size={26} /></Pop></Abs>
      <Abs x={1330} y={y - 22}><Bubble text={outText} delay={tOut + 4} side="out" tone={tone} size={30} maxW={420} /></Abs>
      <Wire from={[560, y]} to={[SW[0] - 65, SW[1]]} delay={tIn + 8} tone={tone} pulse={{ start: tIn + 14, period: 32 }} />
      <Wire from={[SW[0] + 65, SW[1]]} to={[1320, y]} delay={tOut - 6} tone={tone} pulse={{ start: tOut, period: 32 }} />
    </>
  );
  return (
    <>
      <FeatureHeader idx={7} delay={t0} />
      {lane(500, "Messenger", "primary", tM, tMr, "Hi, price কত?", "জি, বলছি।")}
      {lane(900, "WhatsApp", "accent", tW, tWr, "Hi, price কত?", "জি, বলছি।")}
      <NNode cx={SW[0]} cy={SW[1]} icon="shuffle" label="Channel Switching" tone="primary" delay={tM + 6} size={140} activeFrom={tMr} float={3} labelW={300} />
      <Sfx name="pop" frame={tM} />
      <Sfx name="click" frame={tMr} />
      <Sfx name="pop" frame={tW} rate={1.06} />
      <Sfx name="click" frame={tWr} rate={1.05} />
    </>
  );
};

/* ---------- F8: Human takeover (cue 28–31): #pause / #resume ---------- */
export const F8: React.FC = () => {
  const f = useAbs();
  const frame = useCurrentFrame();
  const t0 = f(cueStart(28));
  const tOwner = f(at(29, "আপনি যখন"));
  const tPauseCmd = f(at(29, "#pause"));
  const tSwitch = f(at(29, "#pause"));
  const tPanel = f(at(29, "নির্দিষ্ট customer"));
  const tOff = f(at(30, "bot বন্ধ"));
  const tResumeCmd = f(at(30, "#resume"));
  const tOn = f(at(30, "আবার চালু"));
  const tOther = f(at(30, "অন্য customer's"));
  const tRun = f(at(31, "running"));
  const SW: [number, number] = [900, 700];
  const typed = (s: string, start: number) => s.slice(0, Math.max(0, Math.floor((frame - start) / 3)));
  const cmd = frame >= tResumeCmd ? typed("#resume", tResumeCmd + 6) : typed("#pause", tPauseCmd + 6);
  const aOff = frame >= tOff && frame < tOn;
  const bRun = interpolate(frame, [tOther, tOther + 12], [0, 1], clamp);
  const sw = (tone: "danger" | "accent", y: number, label: string, t: number) => (
    <>
      <Wire from={[SW[0] + 75, SW[1]]} to={[1250 - 65, y]} delay={t - 8} tone={tone} pulse={{ start: t + 2, period: 30 }} />
      <NNode cx={1250} cy={y} icon="sheet" label={label} tone={tone} delay={t} size={120} labelW={300} activeFrom={t + 8} />
    </>
  );
  return (
    <>
      <FeatureHeader idx={8} delay={t0} />
      <Glass x={110} y={500} w={520} h={340} delay={tOwner}>
        <div style={{ display: "flex", alignItems: "center", gap: 18, padding: "26px 30px" }}>
          <Avatar size={68} tone="accent" icon="userCheck" />
          <div style={{ fontFamily: theme.fonts.display, fontSize: 36, fontWeight: 700, color: theme.colors.text }}>আপনি</div>
        </div>
        <div style={{ margin: "10px 30px", height: 96, borderRadius: 20, background: theme.colors.bgAlt, border: `2px solid ${theme.colors.border}`, display: "flex", alignItems: "center", padding: "0 26px",
          fontFamily: theme.fonts.mono, fontSize: 40, fontWeight: 700, color: cmd.includes("resume") ? theme.colors.accent : theme.colors.danger }}>
          {cmd}<span style={{ width: 4, height: 46, marginLeft: 6, background: theme.colors.text, opacity: Math.floor(frame / 8) % 2 ? 0 : 1 }} />
        </div>
        <div style={{ margin: "18px 30px 0", fontFamily: theme.fonts.display, fontSize: 26, color: theme.colors.textDim }}>নিজে reply করতে চাইলে</div>
      </Glass>
      <Wire from={[630, 670]} to={[SW[0] - 75, SW[1]]} delay={tSwitch - 8} tone="primary" pulse={{ start: tSwitch + 4, period: 30 }} />
      <NNode cx={SW[0]} cy={SW[1]} icon="branch" label="Switch Between Human and Agent" tone="primary" delay={tSwitch} size={150} labelW={340} activeFrom={tSwitch + 10} float={3} />
      {sw("danger", 500, "Set Status to PAUSED", tPanel)}
      {sw("accent", 700, "Set Status to ACTIVE", tResumeCmd + 4)}
      <NNode cx={1250} cy={900} icon="sheet" label="Check Agent Status" tone="dim" delay={tPanel + 6} size={120} labelW={300} />
      <Abs x={1005} y={540} style={{ fontFamily: theme.fonts.mono, fontSize: 22, color: theme.colors.danger, fontWeight: 600 }}>
        <Pop delay={tPanel} y={8}>Pause</Pop>
      </Abs>
      <Abs x={1005} y={640} style={{ fontFamily: theme.fonts.mono, fontSize: 22, color: theme.colors.accent, fontWeight: 600 }}>
        <Pop delay={tResumeCmd + 4} y={8}>Resume</Pop>
      </Abs>
      {/* Customer প্যানেল */}
      <Glass x={1520} y={430} w={340} h={460} delay={tPanel + 4}>
        <div style={{ padding: "26px 24px", display: "flex", flexDirection: "column", gap: 26 }}>
          {[{ n: "Customer A", on: !aOff }, { n: "Customer B", on: true }].map((c, i) => (
            <div key={i} style={{ padding: 20, borderRadius: 24, background: theme.colors.panel, border: `2px solid ${i === 1 ? withAlpha(theme.colors.accent, 0.3 + 0.5 * bRun) : theme.colors.border}` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 14 }}>
                <Avatar size={56} tone={c.on ? "accent" : "danger"} />
                <div style={{ fontFamily: theme.fonts.display, fontSize: 26, fontWeight: 700, color: theme.colors.text, whiteSpace: "nowrap" }}>{c.n}</div>
              </div>
              <Chip text={c.on ? "bot ON" : "bot OFF"} tone={c.on ? "accent" : "danger"} icon={c.on ? "play" : "pause"} size={24} />
              {i === 1 && frame >= tRun ? (
                <Float amp={0} period={40}><div style={{ marginTop: 12, fontFamily: theme.fonts.mono, fontSize: 22, color: theme.colors.accent, fontWeight: 600 }}>running</div></Float>
              ) : null}
            </div>
          ))}
        </div>
      </Glass>
      <Sfx name="pop" frame={tOwner} />
      <Sfx name="pop" frame={tSwitch} rate={1.05} />
      <Sfx name="click" frame={tOff} />
      <Sfx name="click" frame={tOn} rate={1.08} />
    </>
  );
};

void Icon; void useP;
