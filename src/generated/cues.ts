// Generated automatically by scripts/prepare-video.mjs
// Do not edit directly. Update your .srt file in input-content/ and run 'npm run prepare-video'.

export type Cue = {
  /** Subtitle cue line number (1-based) */
  n: number;
  /** Start time in seconds */
  start: number;
  /** End time in seconds */
  end: number;
  /** Spoken text */
  text: string;
};

export const CUES: Cue[] = [
  {
    "n": 1,
    "start": 0.08,
    "end": 5.38,
    "text": "প্রতিদিন social media নিয়মিত post করতে চান? কিন্তু topic নির্বাচন থেকে শুরু করে"
  },
  {
    "n": 2,
    "start": 5.38,
    "end": 11.32,
    "text": "প্রতিটি platform জন্য আলাদা content লিখতে গিয়েই অনেক সময় চলে যায়। একই post সব"
  },
  {
    "n": 3,
    "start": 11.32,
    "end": 16.92,
    "text": "platform ব্যবহার করলে content মান ঠিক রাখা কঠিন। আবার প্রতিটি platform জন্য"
  },
  {
    "n": 4,
    "start": 16.94,
    "end": 22.58,
    "text": "আলাদাভাবে লিখতে গেলে কাজের চাপ বেড়ে যায়। ফলে ব্যস্ততার সময় নিয়মিত post করা আর"
  },
  {
    "n": 5,
    "start": 22.58,
    "end": 29,
    "text": "হয়ে ওঠে না। এই সমস্যার সমাধানে আমি তৈরি করেছি social media post automation। এটি"
  },
  {
    "n": 6,
    "start": 29,
    "end": 34,
    "text": "প্রতিদিন নির্দিষ্ট সময়ে আপনার content calendar থেকে একটি topic নিয়ে প্রতিটি"
  },
  {
    "n": 7,
    "start": 34,
    "end": 40.04,
    "text": "social media platform জন্য আলাদা post তৈরি করে রাখে। ফলে প্রতিদিন নতুন করে বসে সব"
  },
  {
    "n": 8,
    "start": 40.04,
    "end": 45.1,
    "text": "post লেখার পরিবর্তে আপনি তৈরি হওয়া content review ও approve করার দিকে মনোযোগ"
  },
  {
    "n": 9,
    "start": 45.1,
    "end": 51.22,
    "text": "দিতে পারেন। এটি যেভাবে কাজ করে। content calendar থেকে পরবর্তী ready topic নির্বাচন"
  },
  {
    "n": 10,
    "start": 51.22,
    "end": 57.08,
    "text": "করে। একই topic যেন একাধিকবার process না হয় সেজন্য শুরুতেই status processing করে"
  },
  {
    "n": 11,
    "start": 57.08,
    "end": 63.02,
    "text": "দেয়। AI আপনার দেওয়া topic ও নির্দেশনা অনুযায়ী প্রতিটি platform জন্য আলাদা post"
  },
  {
    "n": 12,
    "start": 63.02,
    "end": 69.1,
    "text": "লেখে। একটি post copy করে অন্য platform ব্যবহার করা হয় না। প্রতিটি post সংশ্লিষ্ট"
  },
  {
    "n": 13,
    "start": 69.1,
    "end": 75.24,
    "text": "platform tone, লেখার ধরন ও character limit অনুসরণ করে তৈরি হয়। আপনার brief"
  },
  {
    "n": 14,
    "start": 75.24,
    "end": 81.88,
    "text": "উল্লেখ নেই এমন পরিসংখ্যান, customer story বা সংখ্যা AI নিজে থেকে যোগ করে না। তৈরি"
  },
  {
    "n": 15,
    "start": 81.88,
    "end": 88,
    "text": "হওয়া post গুলো media URL, schedule ও approval status সহ Google Sheets save হয়।"
  },
  {
    "n": 16,
    "start": 88,
    "end": 93.98,
    "text": "সব post সফলভাবে save হলে topic status written হয়ে যায়। কোন error হলে failed"
  },
  {
    "n": 17,
    "start": 93.98,
    "end": 100.68,
    "text": "status ও error তথ্য record করা হয়। সমস্যা সমাধানের পর status আবার ready করলে topic"
  },
  {
    "n": 18,
    "start": 100.68,
    "end": 105.48,
    "text": "পুনরায় process করা যায়। প্রয়োজন অনুযায়ী system নতুন social media platform"
  },
  {
    "n": 19,
    "start": 105.48,
    "end": 110.66,
    "text": "যুক্ত করা যায়। পুরো process চলে daily schedule trigger থেকে শুরু করে topic"
  },
  {
    "n": 20,
    "start": 110.66,
    "end": 116.02,
    "text": "নির্বাচন, AI দিয়ে post তৈরি, Google Sheets save এবং status update করার"
  },
  {
    "n": 21,
    "start": 116.02,
    "end": 122.18,
    "text": "মাধ্যমে। এরপর post গুলো আপনার review জন্য প্রস্তুত থাকে। সবচেয়ে গুরুত্বপূর্ণ বিষয়"
  },
  {
    "n": 22,
    "start": 122.18,
    "end": 128.06,
    "text": "হলো প্রতিটি post status শুরুতে pending থাকে। আপনি review করে approve না করা"
  },
  {
    "n": 23,
    "start": 128.06,
    "end": 134,
    "text": "পর্যন্ত কোন post publish হয় না। অর্থাৎ content লেখার কাজ automation করবে। কিন্তু"
  },
  {
    "n": 24,
    "start": 134,
    "end": 140.46,
    "text": "কি publish হবে সেই সিদ্ধান্ত আপনারই থাকবে। এই automation digital marketing agency,"
  },
  {
    "n": 25,
    "start": 140.46,
    "end": 146.44,
    "text": "SaaS founder, freelancer, consultant, online shop এবং নিয়মিত social media post"
  },
  {
    "n": 26,
    "start": 146.44,
    "end": 152.32,
    "text": "করতে হয় এমন যেকোনো ব্যবসার জন্য উপযোগী। আপনার ব্যবসার জন্য এমন automation setup"
  },
  {
    "n": 27,
    "start": 152.32,
    "end": 155.9,
    "text": "করতে চাইলে pricing ও বিস্তারিত জানতে আমাকে DM করুন।"
  }
];
