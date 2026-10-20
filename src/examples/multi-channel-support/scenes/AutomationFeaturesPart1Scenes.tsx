import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { theme, withAlpha } from "../../../video-theme";
import { at, cueStart } from "../../../srt-timing";
import { useAbs } from "../../../lib/scene-context";
import { Icon } from "../../../lib/vector-icons";
import { FeatureHeader } from "../automation-feature-badges";
import { Abs, Bubble, Chip, Glass, NNode, Pop, Sfx, Wire, useP } from "../../../lib/motion-ui-components";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/* ---------- F1: Automatic replies (cue 12–13): পাইপলাইন ---------- */
export const F1: React.FC = () => {
  const f = useAbs();
  const t0 = f(cueStart(12));
  const tHook = f(at(13, "Messenger ও WhatsApp"));
  const tAgent = f(at(13, "স্বয়ংক্রিয়ভাবে"));
  const tSend = f(at(13, "reply করে"));
  const FB: [number, number] = [300, 560], WA: [number, number] = [300, 840];
  const AG: [number, number] = [790, 700], SW: [number, number] = [1240, 700];
  const SF: [number, number] = [1650, 560], SWA: [number, number] = [1650, 840];
  return (
    <>
      <FeatureHeader idx={1} delay={t0} />
      <NNode cx={FB[0]} cy={FB[1]} icon="webhook" label="Facebook Webhook" tone="primary" delay={tHook} size={130} activeFrom={tHook + 10} />
      <NNode cx={WA[0]} cy={WA[1]} icon="webhook" label="WhatsApp Webhook" tone="accent" delay={tHook + 5} size={130} activeFrom={tHook + 15} />
      <Wire from={[FB[0] + 65, FB[1]]} to={[AG[0] - 90, AG[1]]} delay={tAgent - 8} tone="primary" pulse={{ start: tAgent + 4, period: 36, loop: true }} />
      <Wire from={[WA[0] + 65, WA[1]]} to={[AG[0] - 90, AG[1]]} delay={tAgent - 6} tone="accent" pulse={{ start: tAgent + 12, period: 36, loop: true }} />
      <NNode cx={AG[0]} cy={AG[1]} icon="bot" label="AI Agent" tone="primary" delay={tAgent} size={180} activeFrom={tAgent + 8} float={4} labelSize={32} />
      <Wire from={[AG[0] + 90, AG[1]]} to={[SW[0] - 65, SW[1]]} delay={tSend - 10} tone="primary" pulse={{ start: tSend + 2, period: 30, loop: true }} />
      <NNode cx={SW[0]} cy={SW[1]} icon="shuffle" label="Channel Switching" tone="dim" delay={tSend - 6} size={130} activeFrom={tSend + 6} />
      <Wire from={[SW[0] + 65, SW[1]]} to={[SF[0] - 65, SF[1]]} delay={tSend} tone="primary" pulse={{ start: tSend + 14, period: 34, loop: true }} />
      <Wire from={[SW[0] + 65, SW[1]]} to={[SWA[0] - 65, SWA[1]]} delay={tSend + 2} tone="accent" pulse={{ start: tSend + 20, period: 34, loop: true }} />
      <NNode cx={SF[0]} cy={SF[1]} icon="send" label="Send Replies to FB Messenger" tone="primary" delay={tSend + 6} size={130} labelW={300} activeFrom={tSend + 20} />
      <NNode cx={SWA[0]} cy={SWA[1]} icon="send" label="Send replies to WhatsApp" tone="accent" delay={tSend + 10} size={130} labelW={300} activeFrom={tSend + 24} />
      <Sfx name="pop" frame={tHook} />
      <Sfx name="pop" frame={tAgent} rate={1.05} />
      <Sfx name="click" frame={tSend + 6} />
    </>
  );
};

/* ---------- F2: Personalized messaging (cue 14–16): জিগজ্যাগ + ফোন ---------- */
export const F2: React.FC = () => {
  const f = useAbs();
  const t0 = f(cueStart(14));
  const tWeb = f(cueStart(15));
  const tName = f(at(15, "customer's নাম"));
  const tSet = f(at(16, "collect করে"));
  const tAI = f(at(16, "personalized message"));
  const tReply = f(at(16, "reply দেয়"));
  const WB: [number, number] = [260, 540], GN: [number, number] = [660, 540], SD: [number, number] = [1060, 540], AG: [number, number] = [1060, 850];
  return (
    <>
      <FeatureHeader idx={2} delay={t0} />
      <NNode cx={WB[0]} cy={WB[1]} icon="webhook" label="Webhook" sub="নতুন message" tone="primary" delay={tWeb} size={130} activeFrom={tWeb + 8} />
      <Wire from={[WB[0] + 65, WB[1]]} to={[GN[0] - 65, GN[1]]} delay={tName - 8} tone="primary" pulse={{ start: tName + 2, period: 30 }} />
      <NNode cx={GN[0]} cy={GN[1]} icon="user" label="Get Customer Name" tone="accent" delay={tName} size={130} activeFrom={tName + 10} />
      <Wire from={[GN[0] + 65, GN[1]]} to={[SD[0] - 65, SD[1]]} delay={tSet - 8} tone="accent" pulse={{ start: tSet + 2, period: 30 }} />
      <NNode cx={SD[0]} cy={SD[1]} icon="edit" label="Set Messenger / WhatsApp Data" tone="dim" delay={tSet} size={130} labelW={330} activeFrom={tSet + 10} />
      <Wire from={[SD[0], SD[1] + 65]} to={[AG[0], AG[1] - 90]} delay={tAI - 8} vertical tone="primary" pulse={{ start: tAI + 2, period: 30 }} />
      <NNode cx={AG[0]} cy={AG[1]} icon="bot" label="AI Agent" tone="primary" delay={tAI} size={170} activeFrom={tAI + 8} float={4} labelAbove={false} />
      <Wire from={[AG[0] + 85, AG[1]]} to={[1440, 800]} delay={tReply - 8} tone="primary" pulse={{ start: tReply, period: 28 }} />
      {/* চ্যাট কার্ড */}
      <Glass x={1440} y={390} w={400} h={600} delay={tWeb}>
        <div style={{ display: "flex", flexDirection: "column", gap: 20, padding: 28, paddingTop: 34 }}>
          <Bubble text="Hi" delay={tWeb + 6} side="in" size={30} maxW={300} />
          <Pop delay={tSet + 2} cfg="snappy" y={14} style={{ alignSelf: "center" }}><Chip text="নাম: Rahim" tone="accent" icon="user" size={26} /></Pop>
          <Bubble text="Hi Rahim, কীভাবে সাহায্য করতে পারি?" delay={tReply} side="out" tone="primary" size={30} maxW={320} />
        </div>
      </Glass>
      <Sfx name="pop" frame={tWeb} />
      <Sfx name="pop" frame={tName} rate={1.05} />
      <Sfx name="click" frame={tReply} />
    </>
  );
};

/* ---------- F3: Accurate information (cue 17–19): Sheet + Agent ---------- */
export const F3: React.FC = () => {
  const f = useAbs();
  const frame = useCurrentFrame();
  const t0 = f(cueStart(17));
  const tGuess = f(at(18, "কোনো প্রকার অনুমান"));
  const tSheet = f(at(18, "Google Sheet"));
  const tRows = f(at(18, "service"));
  const tAI = f(at(19, "AI উত্তর"));
  const TL: [number, number] = [840, 700], AG: [number, number] = [1250, 700];
  const widths = [0.62, 0.8, 0.5, 0.72];
  return (
    <>
      <FeatureHeader idx={3} delay={t0} />
      <Abs x={130} y={420}>
        <Pop delay={tGuess} cfg="snappy" y={16}><Chip text="অনুমান" tone="danger" icon="x" size={32} /></Pop>
      </Abs>
      <Abs x={130} y={420} style={{ pointerEvents: "none" }}>
        <div style={{ position: "absolute", left: 14, top: 29, height: 5, borderRadius: 5, background: theme.colors.danger,
          width: interpolate(frame, [tGuess + 14, tGuess + 26], [0, 200], { ...clamp, easing: theme.ease.out }) }} />
      </Abs>
      <Glass x={130} y={510} w={520} h={470} delay={tSheet}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "26px 30px", borderBottom: `2px solid ${theme.colors.border}` }}>
          <Icon name="sheet" size={40} color={theme.colors.accent} />
          <div style={{ fontFamily: theme.fonts.display, fontSize: 32, fontWeight: 700, color: theme.colors.text }}>Google Sheet</div>
        </div>
        <div style={{ padding: "24px 30px", display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ display: "flex", gap: 20, fontFamily: theme.fonts.mono, fontSize: 24, fontWeight: 600, color: theme.colors.textDim }}>
            <div style={{ flex: 1.6 }}>Service</div><div style={{ flex: 1 }}>Price</div>
          </div>
          {widths.map((w, i) => {
            const hit = interpolate(frame, [tRows + i * 8, tRows + i * 8 + 10], [0, 1], clamp);
            return (
              <div key={i} style={{ display: "flex", gap: 20, alignItems: "center", padding: "10px 12px", borderRadius: 16, background: withAlpha(theme.colors.accent, 0.16 * hit), border: `2px solid ${withAlpha(theme.colors.accent, 0.5 * hit)}` }}>
                <div style={{ flex: 1.6, height: 18, borderRadius: 9, background: withAlpha(theme.colors.textDim, 0.45), width: `${w * 100}%` }} />
                <div style={{ flex: 1, height: 18, borderRadius: 9, background: withAlpha(theme.colors.accent, 0.35 + 0.4 * hit) }} />
              </div>
            );
          })}
        </div>
      </Glass>
      <Wire from={[650, 760]} to={[TL[0] - 65, TL[1]]} delay={tSheet + 12} tone="accent" pulse={{ start: tRows + 6, period: 34, loop: true }} />
      <NNode cx={TL[0]} cy={TL[1]} icon="sheet" label="Get Service Data" tone="accent" delay={tSheet + 8} size={130} activeFrom={tRows} />
      <Wire from={[TL[0] + 65, TL[1]]} to={[AG[0] - 90, AG[1]]} delay={tAI - 10} tone="accent" pulse={{ start: tAI, period: 30, loop: true }} />
      <NNode cx={AG[0]} cy={AG[1]} icon="bot" label="AI Agent" tone="primary" delay={tAI - 4} size={180} activeFrom={tAI + 4} float={4} labelSize={32} />
      <Wire from={[AG[0] + 90, AG[1]]} to={[1530, 700]} delay={tAI + 6} tone="primary" />
      <Glass x={1530} y={540} w={310} h={320} delay={tAI + 10} tone="primary">
        <div style={{ display: "flex", flexDirection: "column", gap: 18, padding: 26 }}>
          <Bubble text="service ও price" delay={tAI + 16} side="out" tone="primary" size={28} maxW={260} />
          <Pop delay={tAI + 26} cfg="bouncy" y={10}><Chip text="নির্ভুল" tone="accent" icon="check" size={28} /></Pop>
        </div>
      </Glass>
      <Sfx name="click" frame={tGuess} />
      <Sfx name="pop" frame={tSheet} />
      <Sfx name="pop" frame={tAI} rate={1.06} />
    </>
  );
};

/* ---------- F4: Multi-language support (cue 19–20): স্প্লিট স্ক্রিন ---------- */
export const F4: React.FC = () => {
  const f = useAbs();
  const t0 = f(at(19, "Multi-language support"));
  const tLang = f(at(19, "customer যে ভাষায়"));
  const tAI = f(at(20, "AI সেই"));
  const tRep = f(at(20, "reply দিবে"));
  const AG: [number, number] = [960, 700];
  const card = (x: number, tag: string, inText: string, outText: string, d: number, tone: "primary" | "accent") => (
    <>
      <Glass x={x} y={390} w={680} h={560} delay={d} tone={tone}>
        <div style={{ padding: "30px 34px", display: "flex", flexDirection: "column", gap: 26 }}>
          <Chip text={tag} tone={tone} icon="globe" size={28} />
          <Bubble text={inText} delay={tLang + (tone === "primary" ? 0 : 6)} side="in" size={32} maxW={520} />
          <Bubble text={outText} delay={tRep + (tone === "primary" ? 0 : 6)} side="out" tone={tone} size={32} maxW={520} />
        </div>
      </Glass>
    </>
  );
  return (
    <>
      <FeatureHeader idx={4} delay={t0} />
      {card(110, "English", "Hello, what do you offer?", "Hi! Happy to help you.", t0 + 10, "primary")}
      {card(1130, "বাংলা", "হ্যালো, আপনারা কী দেন?", "জি, অবশ্যই! বলুন।", t0 + 16, "accent")}
      <Wire from={[790, AG[1]]} to={[AG[0] - 75, AG[1]]} delay={t0 + 24} tone="primary" pulse={{ start: tAI, period: 26, loop: true }} />
      <Wire from={[AG[0] + 75, AG[1]]} to={[1130, AG[1]]} delay={t0 + 26} tone="accent" pulse={{ start: tAI + 4, period: 26, loop: true }} />
      <NNode cx={AG[0]} cy={AG[1]} icon="bot" label="AI Agent" tone="primary" delay={t0 + 20} size={150} activeFrom={tAI} float={4} labelAbove />
      <Sfx name="pop" frame={t0 + 10} />
      <Sfx name="pop" frame={t0 + 20} rate={1.07} />
      <Sfx name="click" frame={tRep} />
    </>
  );
};

void useP;
