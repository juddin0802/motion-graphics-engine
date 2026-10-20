/**
 * src/video-config.ts
 * -------------------------------------------------------------
 * পুরো ভিডিও প্রজেক্টের কেন্দ্রীয় কনফিগারেশন ও সেটিংস।
 *
 * 💡 বিগিনার গাইড:
 * আপনি যদি ভিডিওর সাইজ (YouTube Landscape নাকি Reels/Shorts) বদলাতে চান,
 * কিংবা সাউন্ড ইফেক্ট বা অডিওর সেটিংস পরিবর্তন করতে চান, তবে শুধু এই ফাইলটির
 * সংশ্লিষ্ট মান (Value) পরিবর্তন করুন। কোড এডিট করতে হবে না।
 */

/**
 * ভিডিওর ফরম্যাট ও অ্যাসপেক্ট রেশিও:
 * - "landscape" : ১৯২০ × ১০৮০ (YouTube, Facebook লং ভিডিও, প্রেজেন্টেশন) [ডিফল্ট]
 * - "reel"      : ১০৮০ × ১৯২০ (Facebook/Instagram Reels, YouTube Shorts, TikTok)
 * - "square"    : ১০৮০ × ১০৮০ (Instagram Post, LinkedIn স্কয়ার ভিডিও)
 */
export const VIDEO_FORMAT: "landscape" | "reel" | "square" = "landscape";

/** ভিডিওর ফ্রেম রেট (Frames Per Second)। সাধারণ ভিডিওর জন্য ৩০, অতি মসৃণ মোশনের জন্য ৬০। */
export const VIDEO_FRAME_RATE: number = 30;

/** ব্যাকওয়ার্ড কম্প্যাটিবিলিটি সংক্ষেপ */
export const FPS: number = VIDEO_FRAME_RATE;

/** শেষ কথা শেষ হওয়ার পর ভিডিওটি কত সেকেন্ড অতিরিক্ত স্থায়ী হবে (হঠাৎ কেটে যাওয়া বন্ধ করতে)। */
export const VIDEO_END_PADDING_SECONDS: number = 1.0;
export const END_PADDING_SEC: number = VIDEO_END_PADDING_SECONDS;

/** Remotion Studio প্রিভিউ মোডে ভয়েসওভার অডিও চালু থাকবে কি না (true = চালু, false = বন্ধ)। */
export const VOICEOVER_ENABLED_IN_PREVIEW: boolean = true;
export const VOICEOVER_IN_PREVIEW: boolean = VOICEOVER_ENABLED_IN_PREVIEW;

/**
 * চূড়ান্ত MP4 রেন্ডার ফাইলে ভয়েসওভার অডিও যুক্ত থাকবে কি না।
 * true  = ভয়েস + সাউন্ড ইফেক্ট দুটোই চূড়ান্ত ভিডিও ফাইলে রেন্ডার হবে।
 * false = শুধু মোশন গ্রাফিক্স ও SFX রেন্ডার হবে (যদি পরে Premiere Pro বা CapCut-এ আলাদা ভয়েস লাগাতে চান)।
 */
export const VOICEOVER_ENABLED_IN_RENDER: boolean = true;
export const VOICEOVER_IN_RENDER: boolean = VOICEOVER_ENABLED_IN_RENDER;

/** সাউন্ড ইফেক্ট (SFX: Whoosh, Pop, Click, Chime ইত্যাদি) চালু বা বন্ধ রাখার মাস্টার সুইচ। */
export const SFX_SOUND_ENABLED: boolean = true;
export const SFX_ENABLED: boolean = SFX_SOUND_ENABLED;
