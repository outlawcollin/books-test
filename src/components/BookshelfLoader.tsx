"use client";

import { useState, useCallback, useEffect } from "react";
import dynamic from "next/dynamic";
import type { BookData } from "@/lib/types";
import BookInfoOverlay from "./BookInfoOverlay";
import BookDetailPanel from "./BookDetailPanel";

const BookshelfCanvas = dynamic(
  () => import("@/components/BookshelfCanvas"),
  {
    ssr: false,
    loading: () => (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#fbf9f7",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#3e2733",
          fontFamily: "var(--font-libre-baskerville), serif",
          fontSize: 14,
          opacity: 0.6,
        }}
      >
        Loading bookshelf...
      </div>
    ),
  }
);

interface BookshelfLoaderProps {
  books: BookData[];
}

export default function BookshelfLoader({ books }: BookshelfLoaderProps) {
  const [selectedBook, setSelectedBook] = useState<BookData | null>(null);

  const handleSelectBook = useCallback((book: BookData) => {
    setSelectedBook(book);
  }, []);

  const handleBack = useCallback(() => {
    setSelectedBook(null);
  }, []);

  // ESC key to close detail panel
  useEffect(() => {
    if (!selectedBook) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedBook(null);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [selectedBook]);

  return (
    <div style={{
      width: "100dvw",
      height: "100dvh",
      position: "relative",
      overflow: "hidden",
      background: "#fbf9f7",
    }}>
      {/* Canvas — always mounted */}
      <BookshelfCanvas
        books={books}
        onSelectBook={handleSelectBook}
        selectedBook={selectedBook}
      />

      {/* DOM overlay — fades in when a book is selected */}
      {selectedBook && (
        <div style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          pointerEvents: "none",
        }}>
          {/* Left column: text (3D book visible through canvas below) */}
          <BookInfoOverlay book={selectedBook} onBack={handleBack} />
          {/* Divider */}
          <div style={{ width: 1, background: "rgba(62, 39, 51, 0.12)", flexShrink: 0 }} />
          {/* Right column: detail panel */}
          <div style={{ flex: 1, pointerEvents: "auto", overflow: "hidden", background: "#fbf9f7" }}>
            <BookDetailPanel book={selectedBook} />
          </div>
        </div>
      )}
    </div>
  );
}
