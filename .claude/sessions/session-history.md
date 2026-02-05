# Session History: 3D Bookshelf R3F Migration

**Date**: 2026-02-04
**Branch**: `dev`

## Summary

Migrated the 3D bookshelf from CSS 3D transforms to React Three Fiber (R3F). The app fetches 25 books from the Gutenberg API and renders them as interactive 3D books with scroll-driven navigation.

---

## Major Changes

### 1. Full R3F Migration
- Replaced CSS 3D cuboid pattern with Three.js meshes rendered via R3F v9.5 + Drei v10
- New component architecture:
  - `page.tsx` (Server) -> `BookshelfLoader.tsx` (Client, dynamic import ssr:false) -> `BookshelfCanvas.tsx` (Canvas + lighting) -> `BookshelfScene.tsx` (ScrollControls) -> `BookGroup.tsx` (scroll positioning) -> `Book3D.tsx` (individual book)
- Deleted old CSS components: `Bookshelf.tsx`, `Book3D.module.css`, `Bookshelf.module.css`
- Created shared `BookData` type in `src/lib/types.ts`

### 2. Scroll-Driven Navigation
- Drei `ScrollControls` with `horizontal` for scroll input
- No `<Scroll>` wrapper — `BookGroup` manually positions books in `useFrame`
- `scroll.offset` (0-1) maps to book index, `Math.round()` for snapping
- Active book always centered at X=0 (uses `clamped` not `scrollIndex`)
- Neighbors spread apart via `COVER_SPREAD` to avoid cover rotation clipping
- Tuned: `pages={3}`, `distance={1.5}`, `damping={0.2}`, `maxSpeed={0.1}`

### 3. Book States: Spine & Cover
- Two states: `"spine"` (rotationY = PI/2) and `"cover"` (rotationY = 0)
- Spring animations via `@react-spring/three`
- "Open" state was implemented then removed per user request
- Active book pushes forward on Z-axis (0.8 units)

### 4. CORS Proxy for Cover Images
- Gutenberg.org doesn't serve CORS headers
- Created `/api/cover` Next.js API route to proxy images
- Server-side fallback: tries full-res (`/files/{id}/{id}-h/images/cover.jpg`) first, falls back to medium-res API thumbnail (`/cache/epub/{id}/pg{id}.cover.medium.jpg`)
- Client sends single URL with `?url=FULL&fallback=MEDIUM`

### 5. Visual Polish
- Light mode background (#ffffff)
- `ContactShadows` from Drei for subtle depth (opacity 0.3, blur 2)
- Scrollbars hidden globally (`scrollbar-width: none !important`)
- Viewport locked with `100dvh` + `overflow: hidden` on html/body
- Mobile touch scroll enabled with `touchAction: "pan-x"`

---

## Key Bugs Fixed

| Bug | Root Cause | Fix |
|-----|-----------|-----|
| `ssr: false` crash | Can't use `next/dynamic` ssr:false in Server Components (Next.js 16) | Created `BookshelfLoader` client wrapper |
| Turbopack panics | Cache corruption after dependency changes | Delete `.next/` and restart |
| Books smashed together | BOOK_SPACING too small, wrong rotation values | Rewrote spacing + rotation logic |
| 25 texture errors | `try/catch` swallows Suspense promises from `useTexture` | Added `TextureErrorBoundary` class component |
| 25 CORS errors | Gutenberg doesn't serve CORS headers | Created `/api/cover` proxy route |
| Scroll broken | `<Scroll>` wrapper fights with manual positioning | Removed `<Scroll>`, manual `useFrame` positioning |
| Cover clips neighbors | 1.6-wide cover rotates through 0.65-spaced books | Added `COVER_SPREAD` offset for neighbors |
| Vertical page jump | `100vh` + no overflow lock | `100dvh` + `overflow: hidden` on html/body |
| Full-res cover 404s | Guessed URL doesn't exist for all books | Server-side fallback in proxy |
| Scroll jumps 2 books | `pages={3}` too sensitive for 25 books | Increased to `pages={5}` (see scroll tuning below) |

---

## Scroll Tuning Journey

Multiple iterations were attempted to get the scroll feel right:

1. **`pages={3} distance={1.5} damping={0.2} maxSpeed={0.1}`** — `maxSpeed={0.1}` caused autonomous drift after releasing scroll. Removed `maxSpeed` and `distance`.
2. **`pages={4} damping={0.15}`** — Still occasionally jumped 2 books due to `Math.round()` with no hysteresis.
3. **Hysteresis approach** — Required scrollIndex to move 0.65 past current book before switching. Felt "two-step" and unnatural. Reverted.
4. **Continuous positioning `(i - scrollIndex)`** — Used raw float for X positioning instead of snapped integer. Felt fluid but caused active book to drift left of center at higher scroll positions (damping never perfectly settles on integers). Reverted.
5. **Final: `pages={5} damping={0.2}` with snapped `(i - clamped)` positioning** — Back to the original simple `Math.round()` + snapped centering. `pages={5}` (up from 3) gives more scroll travel per book, so each wheel tick produces ~0.25 scrollIndex change — well under the 0.5 needed to cross a `Math.round` boundary.

### Key lesson
- Snapped positioning `(i - clamped)` is essential for keeping the active book locked to screen center
- Continuous positioning looks good in theory but breaks centering in practice
- The 2-book jump was best solved by simply increasing `pages` (more scroll travel = less delta per tick), not by adding complexity to the snapping logic

---

## Current Constants (BookGroup.tsx)

```
BOOK_SPACING = 0.85
COVER_SPREAD = 0.8
LERP_SPEED = 0.08
```

## Current ScrollControls (BookshelfScene.tsx)

```
pages={5} damping={0.2} horizontal
```

---

## Files Modified/Created

### New Files
- `src/lib/types.ts` — BookData interface
- `src/components/BookshelfLoader.tsx` — Client wrapper for dynamic import
- `src/components/BookshelfCanvas.tsx` — R3F Canvas + lighting + ContactShadows
- `src/components/BookshelfScene.tsx` — ScrollControls wrapper
- `src/components/BookGroup.tsx` — Scroll-driven positioning + state
- `src/components/Book3D.tsx` — Procedural 3D book with springs
- `src/app/api/cover/route.ts` — CORS proxy with fallback

### Modified Files
- `src/app/page.tsx` — Uses BookshelfLoader, light background
- `src/app/layout.tsx` — Added Libre Baskerville font
- `src/app/globals.css` — dvh viewport, hidden scrollbars, removed dark mode
- `src/lib/gutenberg.ts` — Cover URLs routed through proxy with fallback
- `CLAUDE.md` — Updated for R3F architecture
- `package.json` — Added @react-three/fiber, @react-three/drei, @react-spring/three, three

### Deleted Files
- `src/components/Bookshelf.tsx`
- `src/components/Book3D.module.css`
- `src/components/Bookshelf.module.css`

---

---

## Session 2 — Book Detail Transition (2026-02-04)

### Summary
Implemented the book detail view with a single persistent canvas architecture and animated transitions. The exit animation (back to shelf) works perfectly. The enter animation is not properly aligned and not fluid — needs further iteration.

### Architecture Change: Single Persistent Canvas
- Previously had two separate canvases (shelf + detail). Replaced with one always-mounted canvas, DOM overlay on top.
- `BookshelfLoader.tsx` renders `BookshelfCanvas` always, with a `position: absolute` overlay when `selectedBook` is set.
- `BookInfoOverlay.tsx` takes the left 33% with a transparent spacer where the 3D book shows through the canvas.
- `BookDetailPanel.tsx` takes the right 67% with an opaque `#fbf9f7` background to prevent 3D bleed-through.
- Deleted `DetailBook3D.tsx` (was a separate canvas for detail view).

### Transition Animation
- **Exit (back to shelf): Works perfectly.** `LERP_SPEED = 0.08` for position, `0.1` for scale/opacity restore. Do NOT change this.
- **Enter (click book to detail): Not properly aligned, not fluid.** Needs further work.
- Non-selected books exit left/right correctly (`i < selectedIndex ? -OFFSCREEN_X : OFFSCREEN_X`).

### Enter Animation Attempts
| Approach | Result |
|----------|--------|
| Lerp at `0.06` | Too slow |
| Lerp at `0.1` | Too fast, glitchy |
| `react-spring` (`useSpring`) for selected book | All books flew off the page. Reverted. |
| Lerp at `0.07` (current) | Still not properly aligned, not fluid |

### Position Attempts for `DETAIL_X`
| Value | Result |
|-------|--------|
| `-2.0` | Overlapped detail panel |
| `-2.2` | Used with react-spring, broke |
| `-2.4` (current) | Alignment still off |

### Key Insight
The enter animation fundamentally feels different from exit because lerp's exponential decay starts fast and slows — entering detail starts with a jarring jump. May need a different easing approach (e.g., ease-in curve, or delay-based ramping) rather than just tuning the lerp factor.

### Current Constants (BookGroup.tsx)
```
BOOK_SPACING = 0.85
COVER_SPREAD = 0.8
LERP_SPEED = 0.08       (shelf + exit — perfect)
ENTER_LERP_SPEED = 0.07 (enter detail — needs work)
DETAIL_X = -2.4
DETAIL_Z = 0.3
DETAIL_SCALE = 0.5
OFFSCREEN_X = 10
```

### Files Modified
- `src/components/BookGroup.tsx` — Transition logic, enter/exit animations
- `src/components/BookshelfLoader.tsx` — Single canvas + DOM overlay architecture
- `src/components/BookInfoOverlay.tsx` — Left 33% overlay with transparent spacer
- `src/components/BookDetailPanel.tsx` — Right panel (unchanged)
- `src/components/BookshelfCanvas.tsx` — Threads `selectedBook` prop
- `src/components/BookshelfScene.tsx` — Threads `selectedBook` prop

### Files Deleted
- `src/components/DetailBook3D.tsx`

---

## Next Steps
- Fix enter animation alignment and fluidity (consider non-lerp easing)
- Test on mobile (horizontal swipe)
- Performance profiling with 25+ books
- Potential: environment map or better lighting for more realism
