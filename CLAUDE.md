# Project: 3D Bookshelf

## Important: Always Check Docs
Always use Context7 or other MCP tools to check the relevant documentation before making changes. Do not guess at API behavior — look it up first.

## How Things Work
See [CLIENT_HANDOFF.md](./CLIENT_HANDOFF.md) for detailed documentation on:
- How the Gutenberg API populates the shelf
- How character images are mapped (8 silhouette archetypes)
- How a client can upload books and get automatic character mapping
- How clicking rewrites in the sidebar populates the AU input
- How the chat system and story input modes work

## Stack
- Next.js 16 (App Router)
- React 19
- TypeScript 5
- Three.js + React Three Fiber (@react-three/fiber v9.5)
- @react-three/drei v10 (ScrollControls, useTexture, Text, ContactShadows, Bvh, PerformanceMonitor, Environment)
- @react-spring/three (spring animations for book rotation)
- Tailwind CSS v4 (via PostCSS)

## Architecture

### Core 3D Pipeline
- `src/app/page.tsx` — Server component, fetches Gutenberg data
- `src/app/api/cover/route.ts` — CORS proxy for Gutenberg cover images (with server-side fallback)
- `src/components/BookshelfLoader.tsx` — Client wrapper with dynamic import (ssr: false), manages all top-level state
- `src/components/BookshelfCanvas.tsx` — R3F Canvas, camera, lighting, ContactShadows, Bvh, Environment
- `src/components/BookshelfScene.tsx` — ScrollControls wrapper (dynamic pages, damping=0.25, horizontal)
- `src/components/BookGroup.tsx` — Book positioning, scroll-driven state, detail transition animation
- `src/components/Book3D.tsx` — Procedural 3D book (meshes + spring animations + bookmark ribbon + "my copy" tape)

### Detail Panel
- `src/components/BookDetailPanel.tsx` — Detail view container with tab routing + community rewrites sidebar
- `src/components/BookInfoOverlay.tsx` — Left column: book title, author, description, cover (desktop only)
- `src/components/detail/DetailTabs.tsx` — Tab switcher (Play Book, AU this!, Playthroughs)
- `src/components/detail/PlayBookTab.tsx` — Character + story mode + input selection → start chat
- `src/components/detail/BuildWorldTab.tsx` — Rewrite builder: character + premise + quick-select pills → start chat
- `src/components/detail/PlaythroughsTab.tsx` — Saved playthroughs list
- `src/components/detail/CommunityRewrites.tsx` — Right sidebar with community rewrite cards (desktop only)
- `src/components/detail/CharacterPicker.tsx` — Horizontal scrollable character avatar picker
- `src/components/detail/PersonaModal.tsx` — Custom persona creation modal
- `src/components/detail/SelectionCard.tsx` — Reusable selection card component
- `src/components/detail/BookDropdown.tsx` — Book action dropdown (mobile header)
- `src/components/detail/ShareModal.tsx` — Share functionality

### Chat System
- `src/components/chat/ChatPanel.tsx` — Main chat interface with message list + input
- `src/components/chat/ChatBubble.tsx` — Message bubbles (narrator, NPC with avatar, player)
- `src/components/chat/ChatInput.tsx` — Auto-growing textarea input
- `src/components/chat/ChatHeader.tsx` — Chat header bar
- `src/components/chat/SuggestionPills.tsx` — TapTale mode: 3 quick-choice pills
- `src/components/chat/ChoiceCards.tsx` — CardTale mode: 4 rich category cards
- `src/components/chat/EndBookScreen.tsx` — End-of-book screen with keep/finish/rewrite paths

### Data Layer
- `src/lib/types.ts` — Shared types (BookData, ChatSession, ChatMessage, RewriteData, Playthrough, etc.)
- `src/lib/gutenberg.ts` — Gutenberg API fetch + BookData construction
- `src/lib/characters.ts` — Static character lists per book (by Gutenberg ID)
- `src/lib/character-avatars.ts` — Character → silhouette image mapping (8 archetypes + keyword fallback)
- `src/lib/descriptions.ts` — Book descriptions
- `src/lib/rewrites.ts` — Community rewrites + quick-select pill labels (by Gutenberg ID)
- `src/lib/playthroughs.ts` — Mock playthrough data
- `src/lib/mock-chat.ts` — Mock chat messages
- `src/lib/tokens/colors.ts` — Design color tokens

### Navigation & Modals
- `src/components/ShelfNav.tsx` — Bottom dock: All Books, In Progress, My Copies tabs + Add Book
- `src/components/AddBookModal.tsx` — Upload/URL book addition modal

## 3D Approach
- **Procedural geometry** — books built from BoxGeometry meshes (front cover, back cover, spine, pages block, page edges)
- **Textures** — Gutenberg cover images loaded via `useTexture`, proxied through `/api/cover` for CORS
- **Animations** — @react-spring/three for smooth rotation transitions (spine ↔ cover)
- **States**: spine (default, rotationY = PI/2) → cover (scroll-activated, rotationY = 0)
- **Scroll-driven** navigation via Drei ScrollControls (horizontal)
- **Positioning** — Snapped `(i - clamped)` so active book is always centered at X=0
- **Performance** — React.memo on Book3D, shared materials at module level, memoized geometries, Bvh firstHitOnly
- **Visual details** — Bookmark ribbon (books with playthroughs), "my copy" tape (uploaded books), cloth grain + page line bump maps, clearcoat on covers, studio environment map

## SSR Strategy
`next/dynamic` with `ssr: false` must be used in a Client Component (BookshelfLoader), not directly in Server Components (Next.js 16 restriction).

## Tailwind v4 Convention
Use `max-md:` for mobile-only styles. Keep base classes = desktop. Never use conflicting base + responsive utilities on the same property (e.g. `flex-col md:flex-row` is broken in v4).

## Dev Commands
- `npm run dev` - Start dev server
- `npm run build` - Production build
- `npm run lint` - Run ESLint
