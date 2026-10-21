/**
 * src/video/scene-plan.ts
 * -------------------------------------------------------------
 * ⭐ Active video scene registration.
 *
 * Runs auto-draft scenes by default once .srt is prepared.
 * AI agents will replace this with custom crafted scenes.
 */
import { generateAutoDraftScenes } from "../lib/auto-draft-scenes";

export const SCENES = generateAutoDraftScenes();
