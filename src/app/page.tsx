import BookshelfLoader from "@/components/BookshelfLoader";
import { fetchGutenbergBooks } from "@/lib/gutenberg";

export default async function Home() {
  const books = await fetchGutenbergBooks(25);

  return (
    <main
      style={{
        height: "100dvh",
        background: "#fbf9f7",
        overflow: "hidden",
      }}
    >
      <BookshelfLoader books={books} />
    </main>
  );
}
