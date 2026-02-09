/**
 * Color Tokens — Character.ai Brand Guidelines v1.0
 *
 * Source: Figma Brand Guidelines (pages 126, 129)
 * Figma variables use "Primary/*" and "Secondary/*" naming.
 *
 * Usage:
 *   CSS/Tailwind → use the class utilities (e.g. `bg-pure-white`, `text-default-blue`)
 *   JS/Three.js  → import from this file (e.g. `primary.defaultBlue`)
 */

// ─── Primary / Digital Palette ───────────────────────────────────────────────
// Core brand colors for backgrounds, text, buttons, and interactions.
// "Digital" variants are opacity overlays baked into solid hex values.

export const primary = {
  /** #ffffff — Base white */
  pureWhite: '#ffffff',
  /** #f2f2f2 — Pure white + 5% black overlay */
  pureWhiteDigital1: '#f2f2f2',
  /** #d9d9d9 — Pure white + 15% black overlay */
  pureWhiteDigital2: '#d9d9d9',
  /** #bfbfbf — Pure white + 25% black overlay */
  pureWhiteDigital3: '#bfbfbf',

  /** #e5dfeb — Warm neutral with a lavender undertone */
  offWhite: '#e5dfeb',
  /** #dad4df — Off white + 5% black overlay */
  offWhiteDigital1: '#dad4df',
  /** #c3bec8 — Off white + 15% black overlay */
  offWhiteDigital2: '#c3bec8',
  /** #aca7b0 — Off white + 25% black overlay */
  offWhiteDigital3: '#aca7b0',

  /** #000000 — Base black */
  pureBlack: '#000000',
  /** #0d0d0d — Pure black + 5% white overlay */
  pureBlackDigital1: '#0d0d0d',
  /** #262626 — Pure black + 15% white overlay */
  pureBlackDigital2: '#262626',
  /** #404040 — Pure black + 25% white overlay */
  pureBlackDigital3: '#404040',

  /** #195eff — Brand blue — the main character */
  defaultBlue: '#195eff',

  /** #f4f0e9 — Warm cream background for the bookshelf */
  bookBackground: '#f4f0e9',

  /** #c9ae94 — Warm tan for CTA buttons */
  cta: '#c9ae94',
} as const;

// ─── Secondary Palette ───────────────────────────────────────────────────────
// Personality colors for app icons, tags, merch, and social.
// Use with intention, not impulse. Default Blue is the hero.

export const secondary = {
  // Row 1 — Pastels / Light
  /** #fff59e — Slippery Butter */
  butter: '#fff59e',
  /** #aed900 — Wired Lime */
  lime: '#aed900',
  /** #abf5ed — Icy Sky */
  sky: '#abf5ed',
  /** #df91f2 — Lowkey Lavender */
  lavender: '#df91f2',
  /** #ffadd2 — IRL Rose */
  rose: '#ffadd2',

  // Row 2 — Vivid
  /** #ffe600 — Gold Rush */
  gold: '#ffe600',
  /** #00d973 — Lucky Emerald */
  emerald: '#00d973',
  /** #00d9d9 — Refresh Cyan */
  cyan: '#00d9d9',
  /** #ae00d9 — Alt Violet */
  violet: '#ae00d9',
  /** #ff4dc9 — Hot Pink */
  hotPink: '#ff4dc9',

  // Row 3 — Warm / Muted
  /** #f28500 — Toasty Amber */
  amber: '#f28500',
  /** #65a98f — Dark Sage */
  darkSage: '#65a98f',
  /** #7db4ff — Cloudy Blue */
  cornflower: '#7db4ff',
  /** #6b2e63 — Pinned Purple */
  plum: '#6b2e63',
  /** #d90082 — Hyperlink Magenta */
  magenta: '#d90082',

  // Row 4 — Deep / Dark
  /** #d90000 — Cached Crimson */
  crimson: '#d90000',
  /** #2b9247 — Midnight Forest */
  forest: '#2b9247',
  /** #3e2733 — Quill Ink */
  ink: '#3e2733',
  /** #652e1f — Lock-in Espresso */
  espresso: '#652e1f',
} as const;

// ─── Combined Export ─────────────────────────────────────────────────────────

export const colors = { ...primary, ...secondary } as const;

export type PrimaryColor = keyof typeof primary;
export type SecondaryColor = keyof typeof secondary;
export type Color = keyof typeof colors;
