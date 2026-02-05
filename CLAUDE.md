# Project: 3D Bookshelf

## Important: Always Check Docs
Always use Context7 or other MCP tools to check the relevant documentation before making changes. Do not guess at API behavior — look it up first.

## Stack
- Next.js 16 (App Router)
- React 19
- TypeScript 5
- Three.js + React Three Fiber (@react-three/fiber v9.5)
- @react-three/drei v10 (ScrollControls, useTexture, Text, ContactShadows, Bvh, PerformanceMonitor)
- @react-spring/three (spring animations for book rotation)
- Tailwind CSS v4 (via PostCSS)

## Architecture
- `src/app/page.tsx` - Server component, fetches Gutenberg data
- `src/app/api/cover/route.ts` - CORS proxy for Gutenberg cover images (with server-side fallback)
- `src/lib/gutenberg.ts` - Gutenberg API integration
- `src/lib/types.ts` - Shared TypeScript types (BookData)
- `src/components/BookshelfLoader.tsx` - Client wrapper with dynamic import (ssr: false)
- `src/components/BookshelfCanvas.tsx` - R3F Canvas, camera, lighting, ContactShadows, Bvh
- `src/components/BookshelfScene.tsx` - ScrollControls wrapper (pages=5, damping=0.2, horizontal)
- `src/components/BookGroup.tsx` - Book positioning, scroll-driven state management
- `src/components/Book3D.tsx` - Procedural 3D book (group of meshes with spring animations)

## 3D Approach
- **Procedural geometry** — books built from BoxGeometry meshes (front cover, back cover, spine, pages block, page edges)
- **Textures** — Gutenberg cover images loaded via `useTexture`, proxied through `/api/cover` for CORS
- **Animations** — @react-spring/three for smooth rotation transitions (spine ↔ cover)
- **States**: spine (default, rotationY = PI/2) → cover (scroll-activated, rotationY = 0)
- **Scroll-driven** navigation via Drei ScrollControls (horizontal)
- **Positioning** — Snapped `(i - clamped)` so active book is always centered at X=0
- **Performance** — React.memo on Book3D, shared materials at module level, memoized geometries, Bvh firstHitOnly

## SSR Strategy
`next/dynamic` with `ssr: false` must be used in a Client Component (BookshelfLoader), not directly in Server Components (Next.js 16 restriction).

## Dev Commands
- `npm run dev` - Start dev server
- `npm run build` - Production build
- `npm run lint` - Run ESLint
