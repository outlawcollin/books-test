import type { BookData } from "@/lib/types";
import { BOOK_CHARACTERS } from "@/lib/characters";
import { BOOK_DESCRIPTIONS } from "@/lib/descriptions";

interface GutenbergAuthor {
  name: string;
  birth_year: number | null;
  death_year: number | null;
}

interface GutenbergBook {
  id: number;
  title: string;
  authors: GutenbergAuthor[];
  subjects: string[];
  formats: Record<string, string>;
}

interface GutenbergResponse {
  count: number;
  results: GutenbergBook[];
}

const SPINE_COLORS = [
  "#6b1d1d", "#8b6914", "#1a4a6b", "#4a6741", "#5c3d6e",
  "#1a1a2e", "#73433d", "#2d5a4a", "#6e5c3d", "#3d4a6e",
  "#8b4513", "#2e4a1a", "#6b4a1a", "#1a6b5a", "#4a1a6b",
  "#3d6e5c", "#6e3d4a", "#4a6e3d", "#5c6e3d", "#3d5c6e",
  "#7a3b3b", "#3b5a7a", "#5a7a3b", "#7a5a3b", "#3b7a5a",
];

/** Flip "Austen, Jane" → "Jane Austen" */
function flipAuthorName(name: string): string {
  const parts = name.split(", ");
  if (parts.length === 2) {
    return `${parts[1]} ${parts[0]}`;
  }
  return name;
}

export async function fetchGutenbergBooks(count: number): Promise<BookData[]> {
  const url = `https://gutendex.com/books?languages=en&sort=popular&page=1`;
  const res = await fetch(url, { next: { revalidate: 86400 } });

  if (!res.ok) {
    console.error("Gutendex fetch failed:", res.status);
    return [];
  }

  const data: GutenbergResponse = await res.json();
  // Skip books without a cover image so every shelf slot has art
  const withCovers = data.results.filter((b) => b.formats["image/jpeg"]);
  const books = withCovers.slice(0, count);

  return Promise.all(
    books.map(async (book, i): Promise<BookData> => {
      const author = book.authors[0]
        ? flipAuthorName(book.authors[0].name)
        : "Unknown";

      // Proxy covers through /api/cover — tries full-res first, falls back to medium-res
      const fullRes = `https://www.gutenberg.org/files/${book.id}/${book.id}-h/images/cover.jpg`;
      const mediumRes = book.formats["image/jpeg"] || undefined;
      const coverImage = mediumRes
        ? `/api/cover?url=${encodeURIComponent(fullRes)}&fallback=${encodeURIComponent(mediumRes)}`
        : `/api/cover?url=${encodeURIComponent(fullRes)}`;
      const spineColor = SPINE_COLORS[i % SPINE_COLORS.length];

      // Derive a rough published year from author death year
      const authorObj = book.authors[0];
      let publishedYear: string | undefined;
      if (authorObj?.death_year && authorObj?.birth_year) {
        // Rough midpoint of career
        const midCareer = Math.round(
          authorObj.birth_year + (authorObj.death_year - authorObj.birth_year) * 0.6
        );
        publishedYear = String(midCareer);
      }

      const description = BOOK_DESCRIPTIONS[String(book.id)];

      return {
        id: String(book.id),
        title: book.title,
        author,
        coverImage,
        spineColor,
        description,
        publishedYear,
        chapters: [],
        characters: BOOK_CHARACTERS[String(book.id)] || [],
        communityRewrites: [],
      };
    })
  );
}
