# Client Handoff: How Things Work

## 1. Gutenberg API — Populating the Shelf

Books come from the [Gutendex API](https://gutendex.com), a free REST API for Project Gutenberg.

**Flow:**
1. `src/app/page.tsx` (Server Component) calls `fetchGutenbergBooks(25)` at build/request time.
2. `src/lib/gutenberg.ts` fetches `https://gutendex.com/books?languages=en&sort=popular&page=1`.
3. Books without a JPEG cover are filtered out.
4. For each book, the function constructs a `BookData` object with:
   - **Cover image**: proxied through `/api/cover?url=...&fallback=...` (CORS workaround). Tries full-res first (`/files/{id}/{id}-h/images/cover.jpg`), falls back to the Gutendex-provided medium-res URL.
   - **Spine color**: assigned round-robin from a 25-color palette.
   - **Author name**: flipped from "Lastname, Firstname" → "Firstname Lastname".
   - **Published year**: estimated from author birth/death years (midpoint of career).
   - **Characters**: looked up from `src/lib/characters.ts` (static map by Gutenberg book ID). Falls back to generic ["Protagonist", "Narrator", "Companion", "Rival", "Mentor"].
   - **Community rewrites**: looked up from `src/lib/rewrites.ts` (static map by Gutenberg book ID).
   - **Description**: looked up from `src/lib/descriptions.ts`.
   - **hasPlaythrough**: hardcoded for demo (books at index 0, 2, 4).
   - **isMyCopy**: `false` for all Gutenberg books.
5. The `BookData[]` array is passed as props to `BookshelfLoader.tsx` (Client Component), which renders the 3D shelf.

**Cache**: Gutendex responses are cached for 24 hours (`next: { revalidate: 86400 }`).

**Adding new books to Gutenberg data**: Add entries to `characters.ts`, `descriptions.ts`, `rewrites.ts`, and `character-avatars.ts` keyed by Gutenberg book ID (string). Books without entries gracefully fall back to defaults.

---

## 2. Character Image Mapping — 8 Silhouette Archetypes

Characters are displayed as silhouette avatar images throughout the app (character picker, chat bubbles, playthroughs).

**Image files**: `public/images/book_characters/` — 8 PNG silhouettes:
- `young-man.png` — Generic young male characters
- `young-woman.png` — Generic young female characters
- `older-man.png` — Authority figures, professors, fathers, kings
- `older-woman.png` — Matrons, governesses, aunts, grandmothers
- `warrior.png` — Fighters, soldiers, knights, musketeers
- `monster.png` — Creatures, beasts, monsters
- `child.png` — Children, small characters
- `mysterious.png` — Ghosts, witches, spirits, cats, narrators

**Mapping system** (`src/lib/character-avatars.ts`):

Two-layer lookup via `getCharacterAvatar(name: string) → string`:

1. **Explicit map** (`CHARACTER_AVATAR_MAP`): 135+ named characters mapped to their archetype. Every character from `characters.ts` has an entry. Example: `"Captain Ahab" → "/images/book_characters/older-man.png"`.

2. **Keyword fallback** (`FALLBACK_KEYWORDS`): Regex patterns for unmapped characters. Example: if name matches `/knight|warrior|soldier/i` → `warrior.png`.

3. **Default**: If nothing matches → `young-man.png`.

**To add a new book's characters**:
1. Add the character list to `src/lib/characters.ts` (keyed by book ID).
2. Add explicit avatar mappings to `CHARACTER_AVATAR_MAP` in `src/lib/character-avatars.ts`.
3. The keyword fallback handles most generic character names automatically.

---

## 3. Upload Flow — Adding Books from Client

Users can add books via the "Add a book" modal (`AddBookModal.tsx`), accessible from the bottom dock's "+" button.

**Upload options**:
- **File upload**: .txt, .pdf, .epub (50MB max). Creates a `WebBook` from the filename.
- **URL import**: Paste a URL to extract contents (UI placeholder, not yet wired to backend).
- **Web search**: Search mock web book results (mock data in `MOCK_BOOKS`).

**Flow after selection**:
1. `handleBookAdded(book: WebBook)` in `BookshelfLoader.tsx` fires.
2. Switches to "My Copies" tab.
3. Creates a loading placeholder (`isLoading: true`) prepended to the book array → renders as an invisible position holder in the 3D scene with a shimmer overlay.
4. After 3 seconds (simulated upload), the placeholder is removed and a real `BookData` is prepended to `localBooks` state with `isMyCopy: true`.
5. The book appears on the shelf with a "my copy" tape motif (Canvas2D texture on the spine).

**Character mapping for uploaded books**: Uploaded books currently get generic characters ["Protagonist", "Narrator", "Companion", "Rival", "Mentor"] since they have no entry in `characters.ts`. The keyword fallback in `character-avatars.ts` handles these generic names. To add real character support for uploaded books, a backend would need to extract character names from the text and match them to archetypes.

**State**: `localBooks` is ephemeral (in-memory `useState`). Books are lost on page refresh. A real implementation would persist to a database.

---

## 4. Rewrite Population — Sidebar → AU Input

The "AU this!" tab lets users create alternate universe rewrites. Community rewrites from the sidebar can pre-populate the input.

**Data flow**:

```
CommunityRewrites (sidebar)
  → onSelectRewrite(rewrite: RewriteData)
  → BookDetailPanel.handleSidebarRewrite()
    → setSelectedRewrite(rewrite)
    → setActiveTab("build-world")
  → BuildWorldTab receives initialRewrite prop
    → Pre-fills: character, premise text, story input mode
    → Shows mini cover card with X to clear
```

**RewriteData shape** (`src/lib/types.ts`):
```ts
interface RewriteData {
  premise: string;          // "The Creature writes a memoir..."
  coverUrl?: string;        // Optional cover image URL
  characterName?: string;   // "The Creature" — auto-selects in character picker
  storyInput?: StoryInputMode; // "text" | "taptale" | "cardtale"
}
```

**Clearing a rewrite**: The X button on the mini cover card calls `clearRewrite()` which:
1. Clears all local BuildWorldTab state (premise, character, story input, selected pill).
2. Calls `onClearRewrite()` → clears parent's `selectedRewrite` in BookDetailPanel.
3. This prevents the rewrite from re-appearing when switching tabs.

**Quick-select pills**: 10 premise suggestions shown below the textarea. Book-specific suggestions come from `BOOK_REWRITES` in `rewrites.ts`. If fewer than 10 exist, generic suggestions ("Happy Ending", "Everyone's A Robot", etc.) pad the list. On mobile, capped at 6 visible.

**From EndBookScreen**: When a chat ends, users can choose "Start a rewrite" which routes back to the detail panel with a pre-selected rewrite via `handleChatClose("rewrite", rewrite)` in BookshelfLoader.

---

## 5. Chat System — Story Input Modes

After selecting a character and story input mode, users enter the chat via the "Dive in!" (Play Book) or "AU this!" (Build World) CTA.

**ChatSession** is created in the tab component and passed to `BookshelfLoader` → `ChatPanel`.

**Three input modes** (`StoryInputMode`):
- **Text** — Free-form textarea. User types anything.
- **TapTale** — NPC messages include `suggestions: string[]` (3 quick-choice pills). User taps one.
- **CardTale** — NPC messages include `choices: { category: string; text: string }[]` (4 rich category cards).

**Message types** (`ChatMessage.type`):
- `"narrator"` — Centered italic text, no avatar.
- `"npc"` — Left-aligned bubble with character silhouette avatar (from `getCharacterAvatar`).
- `"player"` — Right-aligned bubble with player avatar (from persona or default "Y" circle).

**End-of-book flow**: `EndBookScreen.tsx` offers three paths:
1. **Keep playing** — Dismisses end screen, returns to chat.
2. **Finish** — Routes to Playthroughs tab (`handleChatClose("finish")`).
3. **Start a rewrite** — Routes to AU tab with pre-filled rewrite (`handleChatClose("rewrite", rewrite)`).

---

## 6. Known Dead Code

These exist in the codebase but are not actively used:

| Item | Location | Notes |
|---|---|---|
| `BookInterior.tsx` | `src/components/` | Unused component (not imported anywhere). Was likely an early prototype. |
| ~31 color token exports | `src/lib/tokens/colors.ts` | `butter`, `lime`, `sky`, `lavender`, `rose`, `gold`, `emerald`, etc. — defined but never referenced. |
| ~40 CSS custom properties | `src/app/globals.css` | Matching unused color tokens (e.g., `--color-butter`, `--color-lime`). Design system palette reserved for future use. |
| `.scrollbar-hide` utility | `src/app/globals.css` | Was used during horizontal-scroll pills phase, now pills wrap instead. |

---

## 7. Shelf Tabs & Filtering

The bottom dock (`ShelfNav.tsx`) has three tabs that filter which books appear on the 3D shelf:

- **All Books** — Shows `[...localBooks, ...gutenbergBooks]` (uploaded books first).
- **In Progress** — Filters to `hasPlaythrough === true`.
- **My Copies** — Filters to `isMyCopy === true` (uploaded books only).

Filtering happens in `BookshelfLoader.tsx`. The 3D canvas always stays mounted — switching tabs just changes the `books` array prop. `ScrollControls` remounts via `key={books.length}` to recalculate scroll range.

Empty tabs show an overlay message ("No books in progress yet." / "No uploaded copies yet.") over the mounted canvas.
