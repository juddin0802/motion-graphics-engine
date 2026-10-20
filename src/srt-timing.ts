/**
 * src/srt-timing.ts
 * -------------------------------------------------------------
 * সাবটাইটেল (SRT) ফাইল থেকে ভিডিওর টাইমিং হিসাব করার ইঞ্জিন।
 *
 * ⚠️ ভিডিওর সময় কখনোই কোনো সংখ্যা হাতে লিখে বসাবেন না!
 * সব সময় SRT থেকে `getCueStartTime(n)` বা `getWordTimeInCue(n, "শব্দ")` দিয়ে নিবেন।
 * এতে ভয়েসওভার একটু দ্রুত বা ধীরে হলেও ভিডিওর সিন হুবহু তাল মিলিয়ে চলবে।
 */
import { CUES } from "./generated/cues";
import { FPS, VIDEO_END_PADDING_SECONDS } from "./video-config";
import { theme } from "./video-theme";

/** ভিডিওর ফ্রেম রেট (প্রতি সেকেন্ডে ফ্রেম সংখ্যা) */
export const FRAME_RATE: number = theme.video.fps;
export const FPS_ALIAS: number = FRAME_RATE;
export { FRAME_RATE as FPS };

/**
 * কথা শুরু হওয়ার কত ফ্রেম আগে স্ক্রিনে ভিজ্যুয়াল এলিমেন্ট প্রবেশ করবে (রুল: ৪–৬ ফ্রেম)।
 * এতে দর্শকের ব্রেইন ভিজ্যুয়াল দেখে নেওয়ার পরেই ভয়েসের শব্দ কানে পৌঁছায়, যা দেখতে প্রিমিয়াম লাগে।
 */
export const SPEECH_LEAD_FRAMES: number = 5;
export { SPEECH_LEAD_FRAMES as LEAD };

/** SRT ফাইলে কোনো বৈধ লাইন আছে কি না */
export const HAS_SUBTITLE_CUES: boolean = CUES.length > 0;
export { HAS_SUBTITLE_CUES as HAS_CUES };

/**
 * নির্দিষ্ট ক্রমিক নম্বরের SRT লাইন (Cue) সংগ্রহ করে।
 * @param cueNumber - SRT লাইনের ১-ভিত্তিক ক্রমিক নম্বর
 * @throws নম্বরটি SRT-তে না থাকলে পরিষ্কার নির্দেশনা সম্বলিত এরর দেয়।
 */
export const getCue = (cueNumber: number) => {
  const targetCue = CUES[cueNumber - 1];
  if (!targetCue || targetCue.n !== cueNumber) {
    throw new Error(
      `[SRT Timing Error] SRT ফাইলে cue নম্বর ${cueNumber} পাওয়া যায়নি (ফাইলে মোট cue আছে: ${CUES.length} টি)। ` +
        `সম্ভবত নতুন SRT ফাইলের সাথে পুরনো সিন চালানো হচ্ছে। অনুগ্রহ করে নতুন SRT অনুযায়ী সিন কোড আপডেট করুন।`,
    );
  }
  return targetCue;
};
export { getCue as cue };

/**
 * একটি SRT লাইনের কথা কখন শুরু হচ্ছে তার সময় (সেকেন্ডে)।
 * @example const startTime = getCueStartTime(4); // ৪ নম্বর লাইনের শুরুর সেকেন্ড
 */
export const getCueStartTime = (cueNumber: number): number => getCue(cueNumber).start;
export { getCueStartTime as cueStart };

/**
 * একটি SRT লাইনের কথা কখন শেষ হচ্ছে তার সময় (সেকেন্ডে)।
 */
export const getCueEndTime = (cueNumber: number): number => getCue(cueNumber).end;
export { getCueEndTime as cueEnd };

/**
 * একটি SRT লাইনের মোট স্থায়ীত্বকাল (সেকেন্ডে)।
 */
export const getCueDuration = (cueNumber: number): number => {
  const c = getCue(cueNumber);
  return c.end - c.start;
};
export { getCueDuration as cueDur };

/**
 * একটি SRT লাইনের ভেতরের নির্দিষ্ট কোনো শব্দ বা বাক্যাংশ কখন উচ্চারিত হচ্ছে তার সুনির্দিষ্ট সময়।
 * লাইনের অক্ষরের আনুপাতিক অবস্থান বিবেচনা করে মিলি-সেকেন্ড পারফেক্ট সময় নির্ধারণ করে।
 *
 * @param cueNumber - SRT লাইনের ক্রমিক নম্বর
 * @param searchPhrase - লাইনে হুবহু যে শব্দটি খোঁজা হচ্ছে
 * @param occurrenceIndex - একই শব্দ একাধিকবার থাকলে কত নম্বরটা (০ = প্রথমটি)
 * @throws শব্দটি না মিললে স্পষ্ট এরর দেয় যাতে ভুল টাইমিং লুকিয়ে না থাকে।
 *
 * @example const wordTime = getWordTimeInCue(19, "Multi-language");
 */
export const getWordTimeInCue = (cueNumber: number, searchPhrase: string, occurrenceIndex: number = 0): number => {
  const targetCue = getCue(cueNumber);
  let foundIndex = -1;
  let searchFrom = 0;
  for (let k = 0; k <= occurrenceIndex; k++) {
    foundIndex = targetCue.text.indexOf(searchPhrase, searchFrom);
    if (foundIndex < 0) {
      throw new Error(`[SRT Timing Error] cue ${cueNumber}-এর টেক্সটে "${searchPhrase}" পাওয়া যায়নি! লাইনের টেক্সট: "${targetCue.text}"`);
    }
    searchFrom = foundIndex + 1;
  }
  return targetCue.start + ((targetCue.end - targetCue.start) * foundIndex) / targetCue.text.length;
};
export { getWordTimeInCue as at };

/**
 * একটি SRT লাইনের মধ্যে একাধিক আইটেমকে সমান সময়ের ব্যবধানে ভাগ করে সময়গুলোর অ্যারে দেয়।
 * (যেমন এক লাইনে ৩টি ফিচার বা ব্র্যান্ডের নাম বললে প্রতিটির সময় সমান ভাগে দেয়)।
 *
 * @param cueNumber - SRT লাইনের ক্রমিক নম্বর
 * @param numberOfItems - মোট কয়টি আইটেম ভাগ করবেন
 */
export const evenlyDistributeInCue = (cueNumber: number, numberOfItems: number): number[] => {
  const targetCue = getCue(cueNumber);
  const duration = targetCue.end - targetCue.start;
  return Array.from({ length: numberOfItems }, (_, i) => targetCue.start + (duration * i) / numberOfItems);
};
export { evenlyDistributeInCue as evenly };

/**
 * সেকেন্ডকে ফ্রেম সংখ্যায় রূপান্তর করে (Remotion-এর ফ্রেমভিত্তিক গণনার জন্য)।
 * @example convertSecondsToFrames(2.5) => 75 (যদি FPS = 30 হয়)
 */
export const convertSecondsToFrames = (seconds: number): number => Math.round(seconds * FRAME_RATE);
export { convertSecondsToFrames as frames };

/**
 * পুরো ভিডিওটির মোট ফ্রেম সংখ্যা (সর্বশেষ SRT কথার সাথে প্যাডিং যুক্ত করে)।
 */
export const TOTAL_VIDEO_FRAMES: number = HAS_SUBTITLE_CUES
  ? Math.ceil((CUES[CUES.length - 1].end + VIDEO_END_PADDING_SECONDS) * FRAME_RATE)
  : 5 * FRAME_RATE;
export { TOTAL_VIDEO_FRAMES as TOTAL_FRAMES };
