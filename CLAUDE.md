# Project: 3D Bookshelf

## Stack
- Next.js 16 (App Router)
- React 19
- TypeScript 5
- Tailwind CSS v4 (via PostCSS)
- CSS Modules for 3D transform styles

## Architecture
- `src/components/` - Reusable components
- `src/app/` - Next.js app router pages
- `public/covers/` - Book cover images

## Styling Approach
- **CSS Modules** (`.module.css`) for complex 3D transforms and animations
- **Tailwind** for layout and utility classes
- CSS custom properties (`--book-width`, `--book-depth`, etc.) for configurable book dimensions

## Key Component: Book3D
Follows the Tympanus Codrops 6-face cuboid pattern:
- Each book is a CSS 3D rectangular prism with `transform-style: preserve-3d`
- Faces: front cover, back cover, spine, pages (edge), top, bottom
- States: spine-visible (default), cover-visible (first click), open (second click)
- Reusable: just pass `coverImage`, `title`, `author` props

## Dev Commands
- `npm run dev` - Start dev server
- `npm run build` - Production build
- `npm run lint` - Run ESLint
