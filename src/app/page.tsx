import Bookshelf from "@/components/Bookshelf";
import { fetchGutenbergBooks } from "@/lib/gutenberg";

export default async function Home() {
  const books = await fetchGutenbergBooks(25);

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#ffffff",
        overflowX: "hidden",
      }}
    >
      <Bookshelf books={books} />
    </main>
  );
}
