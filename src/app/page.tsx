import BookshelfLoader from "@/components/BookshelfLoader";
import { fetchGutenbergBooks } from "@/lib/gutenberg";

export default async function Home() {
  const books = await fetchGutenbergBooks(25);

  return (
    <BookshelfLoader books={books}>
      <header className="flex shrink-0 flex-col items-center gap-3 px-4 text-center font-serif text-ink">
        <h1 className="text-[32px] leading-normal tracking-[-0.64px]">
          Books you can live.
        </h1>
        <p className="text-lg leading-[1.4]">
          Play as a character in the classics, or add a story of your own.
        </p>
      </header>
    </BookshelfLoader>
  );
}
