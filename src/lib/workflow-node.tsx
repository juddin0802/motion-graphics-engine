/**
 * src/lib/workflow-node.tsx
 * -------------------------------------------------------------
 * n8n-স্টাইলের খাঁটি অটোমেশন নোড কম্পোনেন্ট, ডায়নামিক ক্যামেরা জুম/প্যান
 * এবং এনার্জি স্পার্ক কানেক্টিং ওয়্যার।
 */
import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { theme, withAlpha } from "../video-theme";
import { BrandIconBadge, BrandName, LucideIcon, LucideIconName } from "./rich-brand-icons";
import { Pop } from "./motion-ui-components";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

export interface WorkflowNodeProps {
  x: number;
  y: number;
  title: string;
  subtitle?: string;
  brand?: BrandName;
  lucideIcon?: LucideIconName;
  badgeText?: string;
  badgeTone?: "primary" | "accent" | "danger" | "success" | "warning";
  delay?: number;
  activeFrom?: number;
  pulse?: boolean;
  scale?: number;
  isTrigger?: boolean;
  hasInputPort?: boolean;
  hasOutputPort?: boolean;
  portsCountRight?: number;
}

/**
 * খাঁটি n8n স্টাইল্ড নোড কার্ড
 */
export const WorkflowNode: React.FC<WorkflowNodeProps> = ({
  x,
  y,
  title,
  subtitle,
  brand,
  lucideIcon,
  badgeText,
  badgeTone = "primary",
  delay = 0,
  activeFrom,
  pulse = true,
  scale = 1,
  isTrigger = false,
  hasInputPort = true,
  hasOutputPort = true,
  portsCountRight = 1,
}) => {
  const frame = useCurrentFrame();
  const isActive = activeFrom !== undefined ? frame >= activeFrom : frame >= delay + 10;
  const pulseLoop = isActive && pulse ? (frame - (activeFrom || delay)) % 40 : 0;
  const ringScale = pulseLoop > 0 ? 1 + (pulseLoop / 40) * 0.22 : 1;
  const ringOpacity = pulseLoop > 0 ? 1 - pulseLoop / 40 : 0;

  const toneColor =
    badgeTone === "accent"
      ? theme.colors.accent
      : badgeTone === "danger"
      ? theme.colors.danger
      : badgeTone === "success"
      ? "#25D366"
      : badgeTone === "warning"
      ? "#FBBC05"
      : theme.colors.primary;

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `translate(-50%, -50%) scale(${scale})`,
        zIndex: isActive ? 10 : 2,
      }}
    >
      <Pop delay={delay} cfg="bouncy" y={20}>
        {/* একটিভ পালস রিং */}
        {isActive && pulse ? (
          <div
            style={{
              position: "absolute",
              inset: -12,
              borderRadius: 36,
              border: `2px solid ${toneColor}`,
              transform: `scale(${ringScale})`,
              opacity: ringOpacity,
              pointerEvents: "none",
            }}
          />
        ) : null}

        {/* মূল নোড কার্ড */}
        <div
          style={{
            minWidth: 260,
            maxWidth: 340,
            padding: "16px 20px",
            borderRadius: 24,
            background: isActive
              ? `linear-gradient(145deg, rgba(26, 35, 68, 0.95), rgba(12, 17, 34, 0.95))`
              : `linear-gradient(145deg, rgba(18, 24, 48, 0.85), rgba(10, 14, 28, 0.85))`,
            border: `2px solid ${isActive ? toneColor : withAlpha(theme.colors.border, 0.8)}`,
            boxShadow: isActive
              ? `0 0 35px ${withAlpha(toneColor, 0.45)}, 0 20px 40px -15px rgba(0,0,0,0.7)`
              : `0 15px 30px -10px rgba(0,0,0,0.5)`,
            display: "flex",
            alignItems: "center",
            gap: 16,
            backdropFilter: "blur(16px)",
            position: "relative",
          }}
        >
          {/* বাম ইনপুট পোর্ট */}
          {hasInputPort && (
            <div
              style={{
                position: "absolute",
                left: -9,
                top: "50%",
                transform: "translateY(-50%)",
                width: 16,
                height: 16,
                borderRadius: "50%",
                background: "#0E1528",
                border: `3px solid ${isActive ? toneColor : theme.colors.border}`,
                boxShadow: isActive ? `0 0 10px ${toneColor}` : undefined,
              }}
            />
          )}

          {/* ব্র্যান্ড / ভেক্টর আইকন */}
          {brand ? (
            <BrandIconBadge brand={brand} size={56} />
          ) : lucideIcon ? (
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: 16,
                background: withAlpha(toneColor, 0.18),
                border: `2px solid ${withAlpha(toneColor, 0.5)}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: isActive ? `0 0 20px ${withAlpha(toneColor, 0.35)}` : undefined,
              }}
            >
              <LucideIcon name={lucideIcon} size={30} color={toneColor} />
            </div>
          ) : null}

          {/* টাইটেল ও সাবটাইটেল */}
          <div style={{ display: "flex", flexDirection: "column", gap: 4, flex: 1 }}>
            {badgeText && (
              <div
                style={{
                  alignSelf: "flex-start",
                  padding: "2px 8px",
                  borderRadius: 6,
                  background: withAlpha(toneColor, 0.2),
                  color: toneColor,
                  fontFamily: theme.fonts.mono,
                  fontSize: 13,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                {badgeText}
              </div>
            )}
            <div
              style={{
                fontFamily: theme.fonts.display,
                fontSize: 20,
                fontWeight: 700,
                color: theme.colors.text,
                lineHeight: 1.25,
              }}
            >
              {title}
            </div>
            {subtitle && (
              <div
                style={{
                  fontFamily: theme.fonts.mono,
                  fontSize: 14,
                  color: withAlpha(theme.colors.textDim, 0.9),
                }}
              >
                {subtitle}
              </div>
            )}
          </div>

          {/* ডান আউটপুট পোর্টসমূহ */}
          {hasOutputPort &&
            Array.from({ length: portsCountRight }).map((_, i) => {
              const topOffset = portsCountRight === 1 ? "50%" : `${30 + i * 40}%`;
              return (
                <div
                  key={i}
                  style={{
                    position: "absolute",
                    right: -9,
                    top: topOffset,
                    transform: "translateY(-50%)",
                    width: 16,
                    height: 16,
                    borderRadius: "50%",
                    background: "#0E1528",
                    border: `3px solid ${isActive ? toneColor : theme.colors.border}`,
                    boxShadow: isActive ? `0 0 10px ${toneColor}` : undefined,
                  }}
                />
              );
            })}
        </div>
      </Pop>
    </div>
  );
};

/**
 * স্পার্ক ও পালসযুক্ত এনার্জি ওয়্যার কানেক্টর
 */
export const EnergyWire: React.FC<{
  from: [number, number];
  to: [number, number];
  delay?: number;
  tone?: "primary" | "accent" | "danger" | "success";
  pulseStart?: number;
  speed?: number;
  width?: number;
}> = ({
  from,
  to,
  delay = 0,
  tone = "primary",
  pulseStart,
  speed = 30,
  width = 3,
}) => {
  const frame = useCurrentFrame();
  if (frame < delay) return null;

  const color =
    tone === "accent"
      ? theme.colors.accent
      : tone === "danger"
      ? theme.colors.danger
      : tone === "success"
      ? "#25D366"
      : theme.colors.primary;

  const dx = to[0] - from[0];
  const c1x = from[0] + dx * 0.5;
  const c1y = from[1];
  const c2x = from[0] + dx * 0.5;
  const c2y = to[1];

  const path = `M ${from[0]} ${from[1]} C ${c1x} ${c1y}, ${c2x} ${c2y}, ${to[0]} ${to[1]}`;

  // এনার্জি পালস ট্র্যাভেল
  const hasPulse = pulseStart !== undefined && frame >= pulseStart;
  const pulseProg = hasPulse ? ((frame - pulseStart) % speed) / speed : 0;

  return (
    <svg
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        width: 1920,
        height: 1080,
        pointerEvents: "none",
        zIndex: 5,
        overflow: "visible",
      }}
    >
      <defs>
        <filter id={`wire-glow-${tone}`} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* ব্যাকগ্রাউন্ড ওয়্যার লাইন */}
      <path
        d={path}
        fill="none"
        stroke={withAlpha(color, 0.45)}
        strokeWidth={width}
        strokeLinecap="round"
      />

      {/* এনার্জি স্পার্ক প্যাকেট */}
      {hasPulse && (
        <path
          d={path}
          fill="none"
          stroke={color}
          strokeWidth={width + 3}
          strokeLinecap="round"
          strokeDasharray="40 400"
          strokeDashoffset={-pulseProg * 440}
          filter={`url(#wire-glow-${tone})`}
        />
      )}
    </svg>
  );
};

/**
 * ডায়নামিক ক্যামেরা জুম ও প্যান ভিউপোর্ট
 */
export const CameraViewport: React.FC<{
  children: React.ReactNode;
  focusX?: number;
  focusY?: number;
  zoom?: number;
  duration?: number;
}> = ({ children, focusX = 960, focusY = 540, zoom = 1, duration = 15 }) => {
  const frame = useCurrentFrame();
  const currentZoom = interpolate(frame, [0, duration], [1, zoom], {
    ...clamp,
    easing: theme.ease.out,
  });

  const tx = (960 - focusX) * (currentZoom - 1);
  const ty = (540 - focusY) * (currentZoom - 1);

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        transformOrigin: "center center",
        transform: `translate(${tx}px, ${ty}px) scale(${currentZoom})`,
        transition: "transform 0.4s ease-out",
      }}
    >
      {children}
    </div>
  );
};
