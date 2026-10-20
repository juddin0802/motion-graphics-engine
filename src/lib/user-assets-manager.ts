/**
 * src/lib/user-assets-manager.ts
 * -------------------------------------------------------------
 * input/assets/ ফোল্ডারে ইউজারের রাখা ছবি বা লোগো সহজে ও নিরাপদে ব্যবহার করার হেল্পার।
 *
 * 💡 ব্যবহারবিধি:
 * ১. আপনার ছবি বা লোগো (যেমন: client-logo.png) input/assets/ ফোল্ডারে রাখুন।
 * ২. টার্মিনালে চালান: npm run prepare-video
 * ৩. সিনে ব্যবহার করুন:
 *    <Img src={getUserAssetUrl("client-logo.png")} />
 */
import { staticFile } from "remotion";
import { ASSETS } from "../generated/assets";

/**
 * নির্দিষ্ট নামের কোনো অ্যাসেট input/assets/ ফোল্ডারে বিদ্যমান কি না যাচাই করে।
 * @example if (hasUserAsset("brand.png")) { ... }
 */
export const hasUserAsset = (fileName: string): boolean =>
  (ASSETS as readonly string[]).includes(fileName);
export const hasAsset = hasUserAsset;

/**
 * কোনো ইমেজ বা লোগোর Remotion static URL রিটার্ন করে।
 * @param fileName - ফাইলের নাম (যেমন: "logo.png" বা "icons/facebook.svg")
 * @throws ফাইলটি না পাওয়া গেলে স্পষ্টভাবে এরর প্রদর্শন করে।
 */
export const getUserAssetUrl = (fileName: string): string => {
  if (!hasUserAsset(fileName)) {
    throw new Error(
      `[Asset Manager] অ্যাসেট "${fileName}" পাওয়া যায়নি! input/assets/ ফোল্ডারে ফাইলটি রেখে 'npm run prepare-video' চালান। বর্তমান অ্যাসেট তালিকা: ${
        ASSETS.join(", ") || "(খালি)"
      }`,
    );
  }
  return staticFile(`assets/${fileName}`);
};
export const asset = getUserAssetUrl;

/** বর্তমান প্রজেক্টে বিদ্যমান সব অ্যাসেটের নামের তালিকা */
export const ALL_USER_ASSETS: readonly string[] = ASSETS;
export const ALL_ASSETS = ALL_USER_ASSETS;
