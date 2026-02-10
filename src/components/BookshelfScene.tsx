"use client";

import { ScrollControls } from "@react-three/drei";
import BookGroup from "./BookGroup";
import type { BookData } from "@/lib/types";

interface BookshelfSceneProps {
  books: BookData[];
  onSelectBook?: (book: BookData) => void;
  selectedBook?: BookData | null;
  spacerCenterY?: number | null;
}

export default function BookshelfScene({ books, onSelectBook, selectedBook, spacerCenterY }: BookshelfSceneProps) {
  return (
    <ScrollControls key={books.length} pages={Math.max(2, Math.ceil(books.length * 0.4))} damping={0.25} horizontal enabled={!selectedBook}>
      {/* No <Scroll> wrapper — BookGroup handles all positioning manually */}
      <BookGroup books={books} onSelectBook={onSelectBook} selectedBook={selectedBook} spacerCenterY={spacerCenterY} />
    </ScrollControls>
  );
}
