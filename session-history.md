# Session History — Feb 3, 2026

## 1. Gutenberg API Integration
- Created `src/lib/gutenberg.ts` to fetch 25 popular English books from the Gutendex API (`gutendex.com/books`)
- Updated `src/app/page.tsx` to an async Server Component that fetches at build time (1-day revalidation)
- Replaced the hardcoded 5-book sample data
- Author names flipped from "Last, First" → "First Last"
- Deterministic spine colors assigned from a curated palette
- Cover images mapped from `formats["image/jpeg"]`

## 2. High-Res Cover Images
- Gutendex API returns ~14KB medium thumbnails (`cover.medium.jpg`)
- Discovered full-res covers at `/files/{id}/{id}-h/images/cover.jpg` (130–635KB)
- Added `coverImageFallback` prop to `BookData`, `Bookshelf`, and `Book3D`
- Created `CoverImage` component with `onError` fallback from full-res → medium

## 3. Spine Text Truncation
- Switched `.spineText` from `transform: rotate(90deg)` to `writing-mode: vertical-lr`
- Added `max-height`, `overflow: hidden`, `text-overflow: ellipsis`
- Text now truncates with ellipsis when it exceeds the book height

## 4. Realistic Cover Shadows (Tympanus-inspired)
- Added `box-shadow: inset 4px 0 10px rgba(0,0,0,0.1)` to `.cover` for spine bleed
- Added `.cover::before` — 1px spine-edge line
- Updated `.cover::after` — combined spine darkening gradient (0–18px) with center gloss highlight

## 5. Drop Shadow Behind Book
- Tried pseudo-element on `.bookContainer` — caused white mask artifact
- Scraped Tympanus CSS: they put `box-shadow` directly on `.bk-back` (back cover face)
- Applied `box-shadow: 10px 10px 30px rgba(0,0,0,0.3)` on `.back` face
- Spine view showed the shadow as a flat line — reverted to no shadow (kept cover shadows only)

## 6. Transition Glitch Investigation (reverted)
- User reported stutter/glitch when cycling between books
- Identified root cause: flex centering repositions the 360px book every frame as the slot width animates (400px → 80px)
- Attempted fix 1: absolute positioning — broke click handling and caused overlap
- Attempted fix 2: removed slot width transitions — made animation worse
- Also tried: `will-change` on base `.book`, `box-shadow` transitions on `.back`
- **All attempts reverted** — back to pre-audit state

## 7. Shorter Animation Durations
- Reduced all transitions from `2s` to `1.2s` (inspired by Emil Kowalski's animation tips article)
- Applied across both `Book3D.module.css` and `Bookshelf.module.css`

## 8. Scale Experiment (reverted)
- Tried `scale(1.5)` on active book cover with widened slot (580px)
- Reverted back to `scale(1.05)` with 400px slot

## 9. Arrow Key Navigation
- Added `useEffect` keydown listener in `Bookshelf.tsx`
- Left/right arrow keys cycle through books
- Closes open book when navigating, clamps at first/last book

## Files Modified This Session
- `src/lib/gutenberg.ts` (new)
- `src/app/page.tsx`
- `src/components/Bookshelf.tsx`
- `src/components/Bookshelf.module.css`
- `src/components/Book3D.tsx`
- `src/components/Book3D.module.css`
