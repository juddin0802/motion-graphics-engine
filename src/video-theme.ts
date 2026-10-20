/**
 * src/video-theme.ts
 * -------------------------------------------------------------
 * ভিডিওর ভিজ্যুয়াল ডিজাইন সিস্টেম (রং, টাইপোগ্রাফি, স্প্রিং ফিজিক্স ও অ্যানিমেশন কার্ভ)।
 *
 * 🎨 বিগিনার গাইড (কালার স্কিম বা রঙ পরিবর্তন):
 * নতুন ভিডিওর জন্য কালার স্কিম বদলাতে চাইলে নিচের `BASE_PALETTE` ব্লকের HEX কোডগুলো
 * পরিবর্তন করলেই হবে। পুরো ভিডিওর প্যানেল, গ্লো ও গ্রেডিয়েন্ট নিজে থেকেই মানানসই হয়ে যাবে।
 */
import { Easing } from "remotion";
import { FPS, VIDEO_FORMAT } from "./video-config";

/** ভিডিও সাইজের ডাইমেনশন (প্রস্থ × উচ্চতা পিক্সেল) */
const ASPECT_RATIO_DIMENSIONS = {
  landscape: { width: 1920, height: 1080 },
  reel: { width: 1080, height: 1920 },
  square: { width: 1080, height: 1080 },
} as const;

/**
 * হেক্স কালার কোডকে RGB কম্পোনেন্টে রূপান্তর করে।
 */
export const hexToRgbComponents = (hexColor: string): [number, number, number] => {
  const cleanHex = hexColor.replace("#", "");
  return [0, 2, 4].map((index) => parseInt(cleanHex.slice(index, index + 2), 16)) as [number, number, number];
};

/**
 * যেকোনো হেক্স কালারের সাথে স্বচ্ছতা (Alpha / Opacity: 0.0 থেকে 1.0) যুক্ত করে RGBA স্ট্রিং তৈরি করে।
 * @example createColorWithAlpha("#6C7CFF", 0.5) => "rgba(108, 124, 255, 0.5)"
 */
export const createColorWithAlpha = (hexColor: string, alphaOpacity: number): string => {
  const [r, g, b] = hexToRgbComponents(hexColor);
  return `rgba(${r}, ${g}, ${b}, ${alphaOpacity})`;
};
export const withAlpha = createColorWithAlpha;

/**
 * ⬇️ নতুন ভিডিওর মূল কালার প্যালেট (শুধু এই কোডগুলো পরিবর্তন করুন) ⬇️
 */
export const BASE_PALETTE = {
  /** মূল ব্যাকগ্রাউন্ড কালার (সাধারণত খুব গাঢ় নীল বা কালো) */
  bg: "#0B1020",
  /** সাব-প্যানেল বা অল্টারনেট ব্যাকগ্রাউন্ড */
  bgAlt: "#121A33",
  /** হিরো কালার (যে রঙে চোখ আটকে যায়, যেমন ব্র্যান্ডের প্রধান রং) */
  primary: "#6C7CFF",
  /** অ্যাকসেন্ট কালার (গুরুত্বপূর্ণ হাইলাইট, ব্যাজ, টিকচিহ্নের রং) */
  accent: "#2DE2C5",
  /** প্রধান লেখার রং (উজ্জ্বল সাদাটে) */
  text: "#F2F5FF",
  /** কম গুরুত্বপূর্ণ ও বর্ণনামূলক লেখার রং */
  textDim: "#9AA6C8",
  /** সতর্কবার্তা বা নেগেটিভ পয়েন্ট বোঝানোর রং */
  danger: "#FF6B7A",
  /** পিওর সাদা */
  white: "#FFFFFF",
  /** পিওর কালো */
  black: "#000000",
};

/**
 * পুরো ভিডিও প্রজেক্টের থিম অবজেক্ট।
 * কোনো কম্পোনেন্টের ভেতর সরাসরি হার্ডকোডেড HEX কোড লিখবেন না; এখান থেকে ব্যবহার করবেন।
 */
export const theme = {
  colors: {
    ...BASE_PALETTE,
    panel: createColorWithAlpha(BASE_PALETTE.white, 0.055),
    panelStrong: createColorWithAlpha(BASE_PALETTE.white, 0.1),
    border: createColorWithAlpha(BASE_PALETTE.white, 0.12),
    primarySoft: createColorWithAlpha(BASE_PALETTE.primary, 0.18),
    accentSoft: createColorWithAlpha(BASE_PALETTE.accent, 0.16),
    dangerSoft: createColorWithAlpha(BASE_PALETTE.danger, 0.16),
    glow: createColorWithAlpha(BASE_PALETTE.primary, 0.45),
    glowAccent: createColorWithAlpha(BASE_PALETTE.accent, 0.4),
    shadow: createColorWithAlpha("#03060F", 0.6),
    nodeFill: "#171F3D",
  },
  fonts: {
    /** বাংলা ও সাধারণ টাইটেলের জন্য মূল ডিসপ্লে ফন্ট (Hind Siliguri) */
    display: "'Hind Siliguri', sans-serif",
    /** কোড, নম্বর বা কাউন্টারের জন্য মনোস্পেস ফন্ট */
    mono: "'JetBrains Mono', 'Hind Siliguri', monospace",
  },
  weight: {
    body: 500,
    strong: 600,
    heavy: 700,
  },
  radius: {
    card: 28,
    node: 26,
    pill: 999,
    bubble: 24,
  },
  /** অ্যানিমেশনের মোশন কার্ভ (লিনিয়ার ইন্টারপোলেশন কখনোই ব্যবহার করবেন না) */
  ease: {
    out: Easing.bezier(0.16, 1, 0.3, 1),
    inOut: Easing.bezier(0.83, 0, 0.17, 1),
    in: Easing.bezier(0.7, 0, 0.84, 0),
  },
  /** প্রফেশনাল স্প্রিং ফিজিক্স প্রিসেট */
  spring: {
    /** ঝটপট ও প্রফেশনাল এন্ট্রান্স */
    snappy: { damping: 14, stiffness: 160, mass: 0.6 },
    /** মসৃণ ও শান্ত ফ্লোট */
    smooth: { damping: 20, stiffness: 90, mass: 1 },
    /** আনন্দদায়ক বাউন্স (আইকন, ব্যাজ, সিগনেচার এলিমেন্ট) */
    bouncy: { damping: 11, stiffness: 170, mass: 0.7 },
  },
  /** ভিডিওর চূড়ান্ত রেজোলিউশন ও ফ্রেম রেট */
  video: {
    ...ASPECT_RATIO_DIMENSIONS[VIDEO_FORMAT],
    fps: FPS,
  },
} as const;

export type ThemeColorName = keyof typeof theme.colors;
export type ThemeColor = ThemeColorName;
export const videoTheme = theme;
