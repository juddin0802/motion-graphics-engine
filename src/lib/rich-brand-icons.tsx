/**
 * src/lib/rich-brand-icons.tsx
 * -------------------------------------------------------------
 * সার্বজনীন ব্র্যান্ড ও সার্ভিস আইকন সিস্টেম (Universal Brand & Product Icons)।
 *
 * যেকোনো ভিডিও স্ক্রিপ্টে যদি কোনো সোশ্যাল মিডিয়া, পেমেন্ট গেটওয়ে,
 * গুগল সার্ভিস, ইমেইল বা অটোমেশন টুলের উল্লেখ থাকে, এই লাইব্রেরি স্বয়ংক্রিয়ভাবে
 * তার খাঁটি অফিশিয়াল লোগো, ব্র্যান্ড কালার ও প্রিমিয়াম অ্যানিমেটেড গ্লো প্রদর্শন করে।
 */
import React from "react";
import {
  SiFacebook,
  SiInstagram,
  SiThreads,
  SiYoutube,
  SiTiktok,
  SiPinterest,
  SiReddit,
  SiWhatsapp,
  SiTelegram,
  SiMessenger,
  SiGmail,
  SiGoogledrive,
  SiGoogledocs,
  SiGooglesheets,
  SiGooglecalendar,
  SiGooglecloud,
  SiGooglemeet,
  SiGoogle,
  SiStripe,
  SiPaypal,
  SiPayoneer,
  SiMastercard,
  SiVisa,
  SiN8N,
  SiZapier,
  SiMake,
  SiHubspot,
  SiWordpress,
  SiShopify,
  SiWoocommerce,
  SiNotion,
  SiAirtable,
  SiGithub,
} from "react-icons/si";
import {
  FaLinkedin,
  FaSlack,
  FaAws,
  FaDiscord,
  FaCreditCard,
  FaPaypal,
  FaStripe,
  FaGooglePay,
  FaApplePay,
  FaXTwitter,
  FaEnvelope,
} from "react-icons/fa6";
import { TbBrandOpenai } from "react-icons/tb";
import {
  Bot,
  User,
  Users,
  Clock,
  Check,
  X as LucideX,
  Phone,
  MessageSquare,
  Sparkles,
  Zap,
  Database,
  Globe,
  Share2,
  Workflow,
  FileSpreadsheet,
  Layers,
  ArrowRight,
  TrendingDown,
  ShoppingBag,
  Briefcase,
  Laptop,
  GraduationCap,
  Activity,
  Send,
  GitBranch,
  Repeat,
  Pause,
  Play,
  Hourglass,
  Tag,
  Link as LinkIcon,
  Filter,
  Flame,
  Wallet,
  Mail,
  ShieldCheck,
  Server,
  Cloud,
} from "lucide-react";

export type UniversalBrand =
  // Social Media & Messaging
  | "facebook"
  | "fb"
  | "messenger"
  | "instagram"
  | "ig"
  | "linkedin"
  | "x"
  | "twitter"
  | "threads"
  | "youtube"
  | "yt"
  | "tiktok"
  | "whatsapp"
  | "wa"
  | "telegram"
  | "discord"
  | "slack"
  | "pinterest"
  | "reddit"
  // Google Services & Workspace
  | "google"
  | "gemini"
  | "gmail"
  | "googlesheets"
  | "sheets"
  | "sheet"
  | "googledrive"
  | "drive"
  | "googledocs"
  | "docs"
  | "googlecalendar"
  | "calendar"
  | "googlemeet"
  | "meet"
  | "googlecloud"
  | "gcp"
  // Payment Gateways & Cards
  | "stripe"
  | "paypal"
  | "payoneer"
  | "visa"
  | "mastercard"
  | "card"
  | "creditcard"
  | "googlepay"
  | "applepay"
  | "bkash"
  | "nagad"
  // Email & Communication
  | "email"
  | "mail"
  // Automation, SaaS & Tech
  | "n8n"
  | "zapier"
  | "make"
  | "openai"
  | "chatgpt"
  | "github"
  | "aws"
  | "airtable"
  | "notion"
  | "shopify"
  | "wordpress"
  | "hubspot"
  | "woocommerce";

export interface BrandMeta {
  name: string;
  bg: string;
  text: string;
  glow: string;
  gradient?: string;
  renderIcon: (size: number) => React.ReactNode;
}

export const BRAND_REGISTRY: Record<string, BrandMeta> = {
  // Social Media
  facebook: {
    name: "Facebook",
    bg: "#1877F2",
    text: "#FFFFFF",
    glow: "rgba(24, 119, 242, 0.6)",
    gradient: "linear-gradient(135deg, #1877F2, #0C63D4)",
    renderIcon: (s) => <SiFacebook size={s} color="#FFFFFF" />,
  },
  messenger: {
    name: "Messenger",
    bg: "#0084FF",
    text: "#FFFFFF",
    glow: "rgba(0, 132, 255, 0.65)",
    gradient: "linear-gradient(135deg, #00C6FF, #0078FF)",
    renderIcon: (s) => <SiMessenger size={s} color="#FFFFFF" />,
  },
  instagram: {
    name: "Instagram",
    bg: "#E1306C",
    text: "#FFFFFF",
    glow: "rgba(225, 48, 108, 0.6)",
    gradient: "linear-gradient(135deg, #833AB4 0%, #FD1D1D 50%, #FCB045 100%)",
    renderIcon: (s) => <SiInstagram size={s} color="#FFFFFF" />,
  },
  linkedin: {
    name: "LinkedIn",
    bg: "#0A66C2",
    text: "#FFFFFF",
    glow: "rgba(10, 102, 194, 0.6)",
    gradient: "linear-gradient(135deg, #0A66C2, #004182)",
    renderIcon: (s) => <FaLinkedin size={s} color="#FFFFFF" />,
  },
  x: {
    name: "X",
    bg: "#000000",
    text: "#FFFFFF",
    glow: "rgba(255, 255, 255, 0.35)",
    gradient: "linear-gradient(135deg, #1A1A1A, #000000)",
    renderIcon: (s) => <FaXTwitter size={s} color="#FFFFFF" />,
  },
  threads: {
    name: "Threads",
    bg: "#101010",
    text: "#FFFFFF",
    glow: "rgba(255, 255, 255, 0.35)",
    gradient: "linear-gradient(135deg, #222222, #000000)",
    renderIcon: (s) => <SiThreads size={s} color="#FFFFFF" />,
  },
  youtube: {
    name: "YouTube",
    bg: "#FF0000",
    text: "#FFFFFF",
    glow: "rgba(255, 0, 0, 0.6)",
    gradient: "linear-gradient(135deg, #FF0000, #C40000)",
    renderIcon: (s) => <SiYoutube size={s} color="#FFFFFF" />,
  },
  tiktok: {
    name: "TikTok",
    bg: "#010101",
    text: "#FFFFFF",
    glow: "rgba(238, 29, 82, 0.55)",
    gradient: "linear-gradient(135deg, #25F4EE 0%, #010101 50%, #FE2C55 100%)",
    renderIcon: (s) => <SiTiktok size={s} color="#FFFFFF" />,
  },
  whatsapp: {
    name: "WhatsApp",
    bg: "#25D366",
    text: "#FFFFFF",
    glow: "rgba(37, 211, 102, 0.65)",
    gradient: "linear-gradient(135deg, #25D366, #128C7E)",
    renderIcon: (s) => <SiWhatsapp size={s} color="#FFFFFF" />,
  },
  telegram: {
    name: "Telegram",
    bg: "#26A5E4",
    text: "#FFFFFF",
    glow: "rgba(38, 165, 228, 0.6)",
    gradient: "linear-gradient(135deg, #26A5E4, #0088CC)",
    renderIcon: (s) => <SiTelegram size={s} color="#FFFFFF" />,
  },
  discord: {
    name: "Discord",
    bg: "#5865F2",
    text: "#FFFFFF",
    glow: "rgba(88, 101, 242, 0.6)",
    gradient: "linear-gradient(135deg, #5865F2, #4752C4)",
    renderIcon: (s) => <FaDiscord size={s} color="#FFFFFF" />,
  },
  slack: {
    name: "Slack",
    bg: "#4A154B",
    text: "#FFFFFF",
    glow: "rgba(224, 30, 90, 0.5)",
    gradient: "linear-gradient(135deg, #611f69, #4a154b)",
    renderIcon: (s) => <FaSlack size={s} color="#FFFFFF" />,
  },
  pinterest: {
    name: "Pinterest",
    bg: "#BD081C",
    text: "#FFFFFF",
    glow: "rgba(189, 8, 28, 0.6)",
    renderIcon: (s) => <SiPinterest size={s} color="#FFFFFF" />,
  },
  reddit: {
    name: "Reddit",
    bg: "#FF4500",
    text: "#FFFFFF",
    glow: "rgba(255, 69, 0, 0.6)",
    renderIcon: (s) => <SiReddit size={s} color="#FFFFFF" />,
  },

  // Google Ecosystem
  google: {
    name: "Google",
    bg: "#4285F4",
    text: "#FFFFFF",
    glow: "rgba(66, 133, 244, 0.6)",
    gradient:
      "linear-gradient(135deg, #4285F4 25%, #34A853 50%, #FBBC05 75%, #EA4335 100%)",
    renderIcon: (s) => <SiGoogle size={s} color="#FFFFFF" />,
  },
  gemini: {
    name: "Google Gemini",
    bg: "#1A73E8",
    text: "#FFFFFF",
    glow: "rgba(66, 133, 244, 0.7)",
    gradient: "linear-gradient(135deg, #4285F4 0%, #9B72CB 50%, #D96570 100%)",
    renderIcon: (s) => <Sparkles size={s} color="#FFFFFF" strokeWidth={2.2} />,
  },
  gmail: {
    name: "Gmail",
    bg: "#EA4335",
    text: "#FFFFFF",
    glow: "rgba(234, 67, 53, 0.6)",
    gradient: "linear-gradient(135deg, #EA4335, #C5221F)",
    renderIcon: (s) => <SiGmail size={s} color="#FFFFFF" />,
  },
  googlesheets: {
    name: "Google Sheets",
    bg: "#0F9D58",
    text: "#FFFFFF",
    glow: "rgba(15, 157, 88, 0.65)",
    gradient: "linear-gradient(135deg, #34A853, #0F9D58)",
    renderIcon: (s) => <SiGooglesheets size={s} color="#FFFFFF" />,
  },
  googledrive: {
    name: "Google Drive",
    bg: "#4285F4",
    text: "#FFFFFF",
    glow: "rgba(66, 133, 244, 0.6)",
    gradient: "linear-gradient(135deg, #FFBA00, #00AC47 50%, #0066DA 100%)",
    renderIcon: (s) => <SiGoogledrive size={s} color="#FFFFFF" />,
  },
  googledocs: {
    name: "Google Docs",
    bg: "#4285F4",
    text: "#FFFFFF",
    glow: "rgba(66, 133, 244, 0.6)",
    renderIcon: (s) => <SiGoogledocs size={s} color="#FFFFFF" />,
  },
  googlecalendar: {
    name: "Google Calendar",
    bg: "#4285F4",
    text: "#FFFFFF",
    glow: "rgba(66, 133, 244, 0.6)",
    renderIcon: (s) => <SiGooglecalendar size={s} color="#FFFFFF" />,
  },
  googlemeet: {
    name: "Google Meet",
    bg: "#00897B",
    text: "#FFFFFF",
    glow: "rgba(0, 137, 123, 0.6)",
    renderIcon: (s) => <SiGooglemeet size={s} color="#FFFFFF" />,
  },
  googlecloud: {
    name: "Google Cloud",
    bg: "#4285F4",
    text: "#FFFFFF",
    glow: "rgba(66, 133, 244, 0.6)",
    renderIcon: (s) => <SiGooglecloud size={s} color="#FFFFFF" />,
  },

  // Payments & Cards
  stripe: {
    name: "Stripe",
    bg: "#635BFF",
    text: "#FFFFFF",
    glow: "rgba(99, 91, 255, 0.7)",
    gradient: "linear-gradient(135deg, #7A73FF, #635BFF)",
    renderIcon: (s) => <SiStripe size={s} color="#FFFFFF" />,
  },
  paypal: {
    name: "PayPal",
    bg: "#003087",
    text: "#FFFFFF",
    glow: "rgba(0, 48, 135, 0.7)",
    gradient: "linear-gradient(135deg, #0079C1, #00457C)",
    renderIcon: (s) => <FaPaypal size={s} color="#FFFFFF" />,
  },
  payoneer: {
    name: "Payoneer",
    bg: "#FF4800",
    text: "#FFFFFF",
    glow: "rgba(255, 72, 0, 0.7)",
    gradient: "linear-gradient(135deg, #FF6A00, #FF3D00)",
    renderIcon: (s) => <SiPayoneer size={s} color="#FFFFFF" />,
  },
  visa: {
    name: "Visa",
    bg: "#1A1F71",
    text: "#FFFFFF",
    glow: "rgba(26, 31, 113, 0.7)",
    gradient: "linear-gradient(135deg, #253B80, #1A1F71)",
    renderIcon: (s) => <SiVisa size={s} color="#FFFFFF" />,
  },
  mastercard: {
    name: "Mastercard",
    bg: "#EB001B",
    text: "#FFFFFF",
    glow: "rgba(235, 0, 27, 0.6)",
    gradient: "linear-gradient(135deg, #EB001B, #F79E1B)",
    renderIcon: (s) => <SiMastercard size={s} color="#FFFFFF" />,
  },
  card: {
    name: "Credit Card",
    bg: "#3B82F6",
    text: "#FFFFFF",
    glow: "rgba(59, 130, 246, 0.6)",
    gradient: "linear-gradient(135deg, #3B82F6, #1D4ED8)",
    renderIcon: (s) => <FaCreditCard size={s} color="#FFFFFF" />,
  },
  googlepay: {
    name: "Google Pay",
    bg: "#202124",
    text: "#FFFFFF",
    glow: "rgba(66, 133, 244, 0.5)",
    renderIcon: (s) => <FaGooglePay size={s * 1.3} color="#FFFFFF" />,
  },
  applepay: {
    name: "Apple Pay",
    bg: "#000000",
    text: "#FFFFFF",
    glow: "rgba(255, 255, 255, 0.4)",
    renderIcon: (s) => <FaApplePay size={s * 1.3} color="#FFFFFF" />,
  },
  bkash: {
    name: "bKash",
    bg: "#E2136E",
    text: "#FFFFFF",
    glow: "rgba(226, 19, 110, 0.75)",
    gradient: "linear-gradient(135deg, #E2136E 0%, #C00A58 100%)",
    renderIcon: (s) => (
      <svg
        width={s}
        height={s}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ display: "block" }}
      >
        {/* bKash Official Origami Bird Facets */}
        {/* Head / Beak */}
        <polygon points="62,18 94,22 68,36" fill="#FFFFFF" />
        {/* Top Wing */}
        <polygon points="43,8 62,18 45,42" fill="#FFFFFF" opacity={0.92} />
        {/* Rear Wing Fold */}
        <polygon points="43,8 32,32 45,42" fill="#FFFFFF" opacity={0.75} />
        {/* Main Chest Body */}
        <polygon
          points="45,42 68,36 41,74 30,52"
          fill="#FFFFFF"
          opacity={0.97}
        />
        {/* Tail Segment */}
        <polygon
          points="30,52 8,76 22,80 41,74"
          fill="#FFFFFF"
          opacity={0.85}
        />
      </svg>
    ),
  },
  nagad: {
    name: "Nagad",
    bg: "#F7941D",
    text: "#FFFFFF",
    glow: "rgba(247, 148, 29, 0.75)",
    gradient: "linear-gradient(135deg, #F7941D 0%, #E65100 100%)",
    renderIcon: (s) => (
      <svg
        width={s}
        height={s}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ display: "block" }}
      >
        {/* Nagad Signature Curved Dynamic Swirl */}
        <path
          d="M50 10C65 24 82 42 78 66C74 84 52 92 36 84C22 74 20 54 30 40C36 30 46 22 50 10Z"
          fill="#FFFFFF"
        />
        <circle cx="48" cy="56" r="11" fill="#F7941D" />
        <path
          d="M62 60C58 72 44 76 34 70"
          stroke="#F7941D"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  rocket: {
    name: "Rocket",
    bg: "#8C3494",
    text: "#FFFFFF",
    glow: "rgba(140, 52, 148, 0.75)",
    gradient: "linear-gradient(135deg, #9C27B0, #6A1B9A)",
    renderIcon: (s) => (
      <svg
        width={s}
        height={s}
        viewBox="0 0 24 24"
        fill="none"
        stroke="#FFFFFF"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
        <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
        <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
        <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
      </svg>
    ),
  },

  // Email & Communication
  email: {
    name: "Email",
    bg: "#EA4335",
    text: "#FFFFFF",
    glow: "rgba(234, 67, 53, 0.55)",
    gradient: "linear-gradient(135deg, #4F46E5, #3B82F6)",
    renderIcon: (s) => <FaEnvelope size={s} color="#FFFFFF" />,
  },

  // Automation & SaaS
  n8n: {
    name: "n8n",
    bg: "#EA4B71",
    text: "#FFFFFF",
    glow: "rgba(234, 75, 113, 0.7)",
    gradient: "linear-gradient(135deg, #FF6D5A, #EA4B71)",
    renderIcon: (s) => <SiN8N size={s} color="#FFFFFF" />,
  },
  zapier: {
    name: "Zapier",
    bg: "#FF4A00",
    text: "#FFFFFF",
    glow: "rgba(255, 74, 0, 0.7)",
    gradient: "linear-gradient(135deg, #FF6E30, #FF4A00)",
    renderIcon: (s) => <SiZapier size={s} color="#FFFFFF" />,
  },
  make: {
    name: "Make",
    bg: "#6D3BF5",
    text: "#FFFFFF",
    glow: "rgba(109, 59, 245, 0.7)",
    gradient: "linear-gradient(135deg, #8B5CF6, #6D3BF5)",
    renderIcon: (s) => <SiMake size={s} color="#FFFFFF" />,
  },
  openai: {
    name: "OpenAI",
    bg: "#10A37F",
    text: "#FFFFFF",
    glow: "rgba(16, 163, 127, 0.7)",
    gradient: "linear-gradient(135deg, #10A37F, #0E8568)",
    renderIcon: (s) => <TbBrandOpenai size={s} color="#FFFFFF" />,
  },
  github: {
    name: "GitHub",
    bg: "#24292E",
    text: "#FFFFFF",
    glow: "rgba(255, 255, 255, 0.35)",
    gradient: "linear-gradient(135deg, #333333, #181818)",
    renderIcon: (s) => <SiGithub size={s} color="#FFFFFF" />,
  },
  aws: {
    name: "AWS",
    bg: "#FF9900",
    text: "#FFFFFF",
    glow: "rgba(255, 153, 0, 0.65)",
    gradient: "linear-gradient(135deg, #FF9900, #E68A00)",
    renderIcon: (s) => <FaAws size={s} color="#FFFFFF" />,
  },
  airtable: {
    name: "Airtable",
    bg: "#18BFFF",
    text: "#FFFFFF",
    glow: "rgba(24, 191, 255, 0.65)",
    gradient: "linear-gradient(135deg, #18BFFF, #009BD6)",
    renderIcon: (s) => <SiAirtable size={s} color="#FFFFFF" />,
  },
  notion: {
    name: "Notion",
    bg: "#000000",
    text: "#FFFFFF",
    glow: "rgba(255, 255, 255, 0.4)",
    renderIcon: (s) => <SiNotion size={s} color="#FFFFFF" />,
  },
  shopify: {
    name: "Shopify",
    bg: "#95BF47",
    text: "#FFFFFF",
    glow: "rgba(149, 191, 71, 0.65)",
    gradient: "linear-gradient(135deg, #95BF47, #7AB55C)",
    renderIcon: (s) => <SiShopify size={s} color="#FFFFFF" />,
  },
  wordpress: {
    name: "WordPress",
    bg: "#21759B",
    text: "#FFFFFF",
    glow: "rgba(33, 117, 155, 0.65)",
    renderIcon: (s) => <SiWordpress size={s} color="#FFFFFF" />,
  },
  hubspot: {
    name: "HubSpot",
    bg: "#FF7A59",
    text: "#FFFFFF",
    glow: "rgba(255, 122, 89, 0.65)",
    renderIcon: (s) => <SiHubspot size={s} color="#FFFFFF" />,
  },
  woocommerce: {
    name: "WooCommerce",
    bg: "#96588A",
    text: "#FFFFFF",
    glow: "rgba(150, 88, 138, 0.65)",
    renderIcon: (s) => <SiWoocommerce size={s} color="#FFFFFF" />,
  },
};

// Aliases
BRAND_REGISTRY["fb"] = BRAND_REGISTRY["facebook"];
BRAND_REGISTRY["ig"] = BRAND_REGISTRY["instagram"];
BRAND_REGISTRY["twitter"] = BRAND_REGISTRY["x"];
BRAND_REGISTRY["yt"] = BRAND_REGISTRY["youtube"];
BRAND_REGISTRY["wa"] = BRAND_REGISTRY["whatsapp"];
BRAND_REGISTRY["sheets"] = BRAND_REGISTRY["googlesheets"];
BRAND_REGISTRY["sheet"] = BRAND_REGISTRY["googlesheets"];
BRAND_REGISTRY["drive"] = BRAND_REGISTRY["googledrive"];
BRAND_REGISTRY["docs"] = BRAND_REGISTRY["googledocs"];
BRAND_REGISTRY["calendar"] = BRAND_REGISTRY["googlecalendar"];
BRAND_REGISTRY["meet"] = BRAND_REGISTRY["googlemeet"];
BRAND_REGISTRY["gcp"] = BRAND_REGISTRY["googlecloud"];

// Bangladeshi MFS & Payments
BRAND_REGISTRY["bkash"] = BRAND_REGISTRY["bkash"];
BRAND_REGISTRY["bikash"] = BRAND_REGISTRY["bkash"];
BRAND_REGISTRY["b-kash"] = BRAND_REGISTRY["bkash"];
BRAND_REGISTRY["বিকাশ"] = BRAND_REGISTRY["bkash"];
BRAND_REGISTRY["বিকাশে"] = BRAND_REGISTRY["bkash"];

BRAND_REGISTRY["nagad"] = BRAND_REGISTRY["nagad"];
BRAND_REGISTRY["nogod"] = BRAND_REGISTRY["nagad"];
BRAND_REGISTRY["নগদ"] = BRAND_REGISTRY["nagad"];
BRAND_REGISTRY["নগদে"] = BRAND_REGISTRY["nagad"];

BRAND_REGISTRY["rocket"] = BRAND_REGISTRY["rocket"];
BRAND_REGISTRY["roket"] = BRAND_REGISTRY["rocket"];
BRAND_REGISTRY["রকেট"] = BRAND_REGISTRY["rocket"];
BRAND_REGISTRY["রকেটে"] = BRAND_REGISTRY["rocket"];

// International Payments & Cards
BRAND_REGISTRY["stripe"] = BRAND_REGISTRY["stripe"];
BRAND_REGISTRY["স্ট্রাইপ"] = BRAND_REGISTRY["stripe"];
BRAND_REGISTRY["paypal"] = BRAND_REGISTRY["paypal"];
BRAND_REGISTRY["পেপাল"] = BRAND_REGISTRY["paypal"];
BRAND_REGISTRY["payoneer"] = BRAND_REGISTRY["payoneer"];
BRAND_REGISTRY["পেওনার"] = BRAND_REGISTRY["payoneer"];
BRAND_REGISTRY["পেওনিয়ার"] = BRAND_REGISTRY["payoneer"];
BRAND_REGISTRY["visa"] = BRAND_REGISTRY["visa"];
BRAND_REGISTRY["ভিসা"] = BRAND_REGISTRY["visa"];
BRAND_REGISTRY["mastercard"] = BRAND_REGISTRY["mastercard"];
BRAND_REGISTRY["মাস্টারকার্ড"] = BRAND_REGISTRY["mastercard"];
BRAND_REGISTRY["card"] = BRAND_REGISTRY["card"];
BRAND_REGISTRY["কার্ড"] = BRAND_REGISTRY["card"];
BRAND_REGISTRY["ক্রেডিট কার্ড"] = BRAND_REGISTRY["card"];

// Social Media Bengali Aliases
BRAND_REGISTRY["ফেসবুক"] = BRAND_REGISTRY["facebook"];
BRAND_REGISTRY["ইনস্টাগ্রাম"] = BRAND_REGISTRY["instagram"];
BRAND_REGISTRY["লিংকডইন"] = BRAND_REGISTRY["linkedin"];
BRAND_REGISTRY["টুইটার"] = BRAND_REGISTRY["x"];
BRAND_REGISTRY["ইউটিউব"] = BRAND_REGISTRY["youtube"];
BRAND_REGISTRY["টিকটক"] = BRAND_REGISTRY["tiktok"];
BRAND_REGISTRY["হোয়াটসঅ্যাপ"] = BRAND_REGISTRY["whatsapp"];
BRAND_REGISTRY["টেলিগ্রাম"] = BRAND_REGISTRY["telegram"];
BRAND_REGISTRY["গুগল"] = BRAND_REGISTRY["google"];
BRAND_REGISTRY["জিমেইল"] = BRAND_REGISTRY["gmail"];
BRAND_REGISTRY["ইমেইল"] = BRAND_REGISTRY["email"];

/**
 * যেকোনো ব্র্যান্ড বা সার্ভিসের নাম (ইংরেজি বা বাংলা) দিলে মেটাডেটা রিটার্ন করে
 */
export const getBrandMeta = (name: string): BrandMeta => {
  const rawKey = name.trim().toLowerCase();
  if (BRAND_REGISTRY[rawKey]) return BRAND_REGISTRY[rawKey];
  const cleanedKey = rawKey.replace(/[^a-z0-9]/g, "");
  return (
    BRAND_REGISTRY[cleanedKey] || {
      name: name,
      bg: "#6C7CFF",
      text: "#FFFFFF",
      glow: "rgba(108, 124, 255, 0.6)",
      renderIcon: (s) => <Sparkles size={s} color="#FFFFFF" />,
    }
  );
};

/**
 * প্রিমিয়াম ব্র্যান্ড আইকন ব্যাজ
 */
export const BrandIconBadge: React.FC<{
  brand: string;
  size?: number;
  iconSize?: number;
  shape?: "circle" | "rounded";
  glow?: boolean;
  style?: React.CSSProperties;
}> = ({
  brand,
  size = 64,
  iconSize,
  shape = "rounded",
  glow = true,
  style,
}) => {
  const meta = getBrandMeta(brand);
  const actualIconSize = iconSize || Math.round(size * 0.52);

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: shape === "circle" ? "50%" : Math.round(size * 0.28),
        background: meta.gradient || meta.bg,
        boxShadow: glow
          ? `0 0 ${Math.round(size * 0.45)}px ${meta.glow}`
          : undefined,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        ...style,
      }}
    >
      {meta.renderIcon(actualIconSize)}
    </div>
  );
};

export type LucideIconName =
  | "bot"
  | "user"
  | "users"
  | "clock"
  | "check"
  | "x"
  | "phone"
  | "chat"
  | "sparkles"
  | "zap"
  | "db"
  | "globe"
  | "share"
  | "workflow"
  | "sheet"
  | "layers"
  | "arrowRight"
  | "trendDown"
  | "bag"
  | "briefcase"
  | "laptop"
  | "cap"
  | "pulse"
  | "send"
  | "branch"
  | "repeat"
  | "pause"
  | "play"
  | "hourglass"
  | "tag"
  | "link"
  | "filter"
  | "flame"
  | "wallet"
  | "mail"
  | "shield"
  | "server"
  | "cloud";

export type BrandName = UniversalBrand | string;

const LUCIDE_COMPONENTS: Record<LucideIconName, React.ComponentType<any>> = {
  bot: Bot,
  user: User,
  users: Users,
  clock: Clock,
  check: Check,
  x: LucideX,
  phone: Phone,
  chat: MessageSquare,
  sparkles: Sparkles,
  zap: Zap,
  db: Database,
  globe: Globe,
  share: Share2,
  workflow: Workflow,
  sheet: FileSpreadsheet,
  layers: Layers,
  arrowRight: ArrowRight,
  trendDown: TrendingDown,
  bag: ShoppingBag,
  briefcase: Briefcase,
  laptop: Laptop,
  cap: GraduationCap,
  pulse: Activity,
  send: Send,
  branch: GitBranch,
  repeat: Repeat,
  pause: Pause,
  play: Play,
  hourglass: Hourglass,
  tag: Tag,
  link: LinkIcon,
  filter: Filter,
  flame: Flame,
  wallet: Wallet,
  mail: Mail,
  shield: ShieldCheck,
  server: Server,
  cloud: Cloud,
};

/**
 * Lucide React ভেক্টর আইকন কম্পোনেন্ট
 */
export const LucideIcon: React.FC<{
  name: LucideIconName;
  size?: number;
  color?: string;
  stroke?: number;
  style?: React.CSSProperties;
}> = ({ name, size = 32, color = "#FFFFFF", stroke = 2, style }) => {
  const Comp = LUCIDE_COMPONENTS[name] || Bot;
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        ...style,
      }}
    >
      <Comp size={size} color={color} strokeWidth={stroke} />
    </div>
  );
};
