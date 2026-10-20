// এই ফাইলটি scripts/prepare-video.mjs দিয়ে স্বয়ংক্রিয়ভাবে তৈরি হয়েছে।
// সরাসরি এডিট করবেন না। input-content/voiceover.srt আপডেট করে 'npm run prepare-video' চালান।

export type Cue = {
  /** সাবটাইটেল লাইনের ক্রমিক নম্বর (১ থেকে শুরু) */
  n: number;
  /** লাইন শুরুর সময় (সেকেন্ডে) */
  start: number;
  /** লাইন শেষের সময় (সেকেন্ডে) */
  end: number;
  /** লাইনে উচ্চারিত পাঠ্য/টেক্সট */
  text: string;
};

export const CUES: Cue[] = [
  {
    "n": 1,
    "start": 0.24,
    "end": 1.16,
    "text": "আপনি ঘুমিয়ে আছেন,"
  },
  {
    "n": 2,
    "start": 2.14,
    "end": 3.48,
    "text": "বন্ধুদের সাথে আড্ডা দিচ্ছেন"
  },
  {
    "n": 3,
    "start": 4.08,
    "end": 5.34,
    "text": "কিংবা travel করছেন।"
  },
  {
    "n": 4,
    "start": 6.22,
    "end": 10.54,
    "text": "এদিকে একজন customer আপনাকে message দিয়ে দ্রুত reply না পেয়ে চলে গেল অন্য কারোর"
  },
  {
    "n": 5,
    "start": 10.54,
    "end": 10.82,
    "text": "কাছে।"
  },
  {
    "n": 6,
    "start": 11.6,
    "end": 16.239,
    "text": "নিশ্চয়ই এমন অভিজ্ঞতার সম্মুখীন হয়ে আপনারাও অনেক সময় সম্ভাব্য customer এবং"
  },
  {
    "n": 7,
    "start": 16.239,
    "end": 17.5,
    "text": "ব্যবসার revenue হারিয়েছেন।"
  },
  {
    "n": 8,
    "start": 18.34,
    "end": 21.74,
    "text": "এই সমস্যার সমাধানে তৈরি করেছি Multi-Channel Support Automation।"
  },
  {
    "n": 9,
    "start": 22.46,
    "end": 27.68,
    "text": "একটি AI agent যা Facebook Messenger ও WhatsApp আপনার হয়ে customer's message's"
  },
  {
    "n": 10,
    "start": 27.7,
    "end": 29.96,
    "text": "উত্তর দেবে। এমনকি আপনি ব্যস্ত থাকলেও।"
  },
  {
    "n": 11,
    "start": 30.62,
    "end": 31.66,
    "text": "কী কী feature আছে এর মধ্যে?"
  },
  {
    "n": 12,
    "start": 32.659,
    "end": 33.54,
    "text": "Automatic replies,"
  },
  {
    "n": 13,
    "start": 34.18,
    "end": 37.06,
    "text": "এটা Messenger ও WhatsApp স্বয়ংক্রিয়ভাবে reply করে।"
  },
  {
    "n": 14,
    "start": 37.82,
    "end": 38.84,
    "text": "Personalized messaging,"
  },
  {
    "n": 15,
    "start": 39.56,
    "end": 43.88,
    "text": "Messenger বা WhatsApp নতুন message এলেই AI সেটি detect করে এবং customer's নাম"
  },
  {
    "n": 16,
    "start": 43.88,
    "end": 46.34,
    "text": "collect করে personalized message লিখে reply দেয়।"
  },
  {
    "n": 17,
    "start": 47.2,
    "end": 48.06,
    "text": "Accurate information,"
  },
  {
    "n": 18,
    "start": 48.72,
    "end": 52.94,
    "text": "কোনো প্রকার অনুমান ছাড়াই Google Sheet থেকে service's তথ্য ও price এবং customer"
  },
  {
    "n": 19,
    "start": 52.94,
    "end": 58.52,
    "text": "message's ধরন দেখে AI উত্তর দেয়। Multi-language support, customer যে ভাষায়"
  },
  {
    "n": 20,
    "start": 58.52,
    "end": 61.72,
    "text": "message করবেন, AI সেই ভাষাতেই reply দিবে।"
  },
  {
    "n": 21,
    "start": 62.62,
    "end": 68.1,
    "text": "Conversation memory, customer's chat history মনে রাখে। তাই বারবার একই প্রশ্ন"
  },
  {
    "n": 22,
    "start": 68.1,
    "end": 68.7,
    "text": "করতে হয় না।"
  },
  {
    "n": 23,
    "start": 69.56,
    "end": 75.02,
    "text": "Smart pricing, কোনো product বা service's নির্দিষ্ট price না থাকলে AI বানিয়ে কিছু"
  },
  {
    "n": 24,
    "start": 75.02,
    "end": 79.5,
    "text": "বলে না। প্রয়োজনে quotation জন্য customerকে নির্দিষ্ট page পাঠায়।"
  },
  {
    "n": 25,
    "start": 80.42,
    "end": 81.4,
    "text": "Same channel reply,"
  },
  {
    "n": 26,
    "start": 82.02,
    "end": 86.92,
    "text": "customer Messenger message দিলে Messenger reply যাবে। WhatsApp message দিলে WhatsApp"
  },
  {
    "n": 27,
    "start": 86.92,
    "end": 87.6,
    "text": "reply যাবে।"
  },
  {
    "n": 28,
    "start": 88.42,
    "end": 89.18,
    "text": "Human takeover,"
  },
  {
    "n": 29,
    "start": 89.82,
    "end": 94.78,
    "text": "আপনি যখন নিজে customerকে reply করতে চাইবেন, #pause লিখে নির্দিষ্ট customer"
  },
  {
    "n": 30,
    "start": 94.78,
    "end": 100.82,
    "text": "জন্য bot বন্ধ করুন আর #resume লিখে আবার চালু করুন। অন্য customer's chat"
  },
  {
    "n": 31,
    "start": 100.82,
    "end": 102.06,
    "text": "স্বাভাবিকভাবেই running থাকবে।"
  },
  {
    "n": 32,
    "start": 103.2,
    "end": 104.48,
    "text": "এটি কাদের জন্য উপযোগী?"
  },
  {
    "n": 33,
    "start": 105.16,
    "end": 106.66,
    "text": "Service business ও agency,"
  },
  {
    "n": 34,
    "start": 107.36,
    "end": 108.78,
    "text": "freelancer ও consultant,"
  },
  {
    "n": 35,
    "start": 109.44,
    "end": 110.98,
    "text": "online shop ও e-commerce,"
  },
  {
    "n": 36,
    "start": 111.6,
    "end": 115.3,
    "text": "coaching center ও clinic, অন্যান্য online ভিত্তিক ব্যবসা।"
  },
  {
    "n": 37,
    "start": 116.26,
    "end": 118.3,
    "text": "আপনার ব্যবসার জন্য কেন এটি গুরুত্বপূর্ণ?"
  },
  {
    "n": 38,
    "start": 119.22,
    "end": 124.6,
    "text": "আপনার customer দ্রুত উত্তর পাবে। বারবার একই প্রশ্নের উত্তর দিতে হবে না। Messenger"
  },
  {
    "n": 39,
    "start": 124.6,
    "end": 126.7,
    "text": "ও WhatsApp support management সহজ হবে।"
  },
  {
    "n": 40,
    "start": 127.42,
    "end": 132.68,
    "text": "Service ও price সম্পর্কে নির্ভুল তথ্য দেওয়া সহজ হবে। আপনার সময় বাঁচবে এবং"
  },
  {
    "n": 41,
    "start": 132.68,
    "end": 137.78,
    "text": "manual কাজ কমবে। প্রয়োজনে যেকোনো সময় আপনি নিজে conversation দায়িত্ব নিতে"
  },
  {
    "n": 42,
    "start": 137.78,
    "end": 138.16,
    "text": "পারবেন।"
  },
  {
    "n": 43,
    "start": 139.14,
    "end": 144,
    "text": "আপনার ব্যবসার জন্য এমন automation system তৈরি করতে চাইলে pricing ও বিস্তারিত জানতে"
  },
  {
    "n": 44,
    "start": 144,
    "end": 144.88,
    "text": "আমাকে DM করুন।"
  },
  {
    "n": 45,
    "start": 145.66,
    "end": 146.14,
    "text": "ধন্যবাদ।"
  }
];
