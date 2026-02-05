"use client";

import { ScrollControls } from "@react-three/drei";
import BookGroup from "./BookGroup";
import type { BookData } from "@/lib/types";

interface BookshelfSceneProps {
  books: BookData[];
  onSelectBook?: (book: BookData) => void;
  selectedBook?: BookData | null;
}

export default function BookshelfScene({ books, onSelectBook, selectedBook }: BookshelfSceneProps) {
  return (
    <ScrollControls pages={5} damping={0.2} horizontal>
      {/* No <Scroll> wrapper — BookGroup handles all positioning manually */}
      <BookGroup books={books} onSelectBook={onSelectBook} selectedBook={selectedBook} />
    </ScrollControls>
  );
}
