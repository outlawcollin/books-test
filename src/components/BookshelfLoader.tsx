"use client";

import { type ReactNode, useState, useCallback, useEffect } from "react";
import dynamic from "next/dynamic";
import type { BookData, TabId } from "@/lib/types";
import BookInfoOverlay from "./BookInfoOverlay";
import BookDetailPanel from "./BookDetailPanel";
import BookDropdown from "./detail/BookDropdown";
import ShelfNav from "./ShelfNav";
import AddBookModal, { type WebBook } from "./AddBookModal";

const BookshelfCanvas = dynamic(
  () => import("@/components/BookshelfCanvas"),
  {
    ssr: false,
    loading: () => (
      <div className="flex size-full items-center justify-center gap-[3px] animate-pulse">
        <div className="w-5 h-[340px] rounded-sm bg-ink/[0.07]" />
        <div className="w-6 h-[360px] rounded-sm bg-ink/10" />
        <div className="w-5 h-[350px] rounded-sm bg-ink/[0.07]" />
        <div className="w-6 h-[355px] rounded-sm bg-ink/10" />
        <div className="w-[220px] h-[380px] rounded-sm bg-ink/[0.07]" />
        <div className="w-5 h-[360px] rounded-sm bg-ink/10" />
        <div className="w-6 h-[345px] rounded-sm bg-ink/[0.07]" />
        <div className="w-5 h-[355px] rounded-sm bg-ink/10" />
        <div className="w-6 h-[350px] rounded-sm bg-ink/[0.07]" />
      </div>
    ),
  }
);

const EMPTY_MESSAGES: Record<Exclude<TabId, "all-books">, string> = {
  "in-progress": "No books in progress yet.",
  "my-copies": "No uploaded copies yet.",
};

function ArrowLeftIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M9.66782 18.082L4.37493 12.7892C3.9844 12.3986 3.9844 11.7655 4.37492 11.3749L9.66782 6.08203M4.91782 12.082H19.9178" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

interface BookshelfLoaderProps {
  books: BookData[];
  children?: ReactNode;
}

export default function BookshelfLoader({
  books,
  children,
}: BookshelfLoaderProps) {
  const [selectedBook, setSelectedBook] = useState<BookData | null>(null);
  const [activeTab, setActiveTab] = useState<TabId>("all-books");
  const [addBookOpen, setAddBookOpen] = useState(false);
  const [uploadingBooks, setUploadingBooks] = useState<WebBook[]>([]);

  const handleSelectBook = useCallback((book: BookData) => {
    setSelectedBook(book);
  }, []);

  const handleBack = useCallback(() => {
    setSelectedBook(null);
  }, []);

  const handleAddBook = useCallback(() => {
    setAddBookOpen(true);
  }, []);

  const handleBookAdded = useCallback((book: WebBook) => {
    setAddBookOpen(false);
    setActiveTab("my-copies");
    setUploadingBooks((prev) => [...prev, book]);
    setTimeout(() => {
      setUploadingBooks((prev) => prev.filter((b) => b.id !== book.id));
    }, 3000);
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
    <main className="relative h-dvh w-dvw overflow-hidden bg-book-background">
      {/* Canvas — full viewport */}
      {activeTab === "all-books" ? (
        <BookshelfCanvas
          books={books}
          onSelectBook={handleSelectBook}
          selectedBook={selectedBook}
        />
      ) : activeTab === "my-copies" && uploadingBooks.length > 0 ? (
        <div className="flex size-full items-center justify-center">
          <div className="flex flex-col items-center gap-6">
            {uploadingBooks.map((book) => (
              <div
                key={book.id}
                className="flex h-[480px] w-[320px] items-center justify-center rounded-sm border border-espresso/10 overflow-hidden"
                style={{
                  background: "linear-gradient(110deg, var(--color-book-background) 30%, rgba(255,255,255,0.5) 50%, var(--color-book-background) 70%)",
                  backgroundSize: "200% 100%",
                  animation: "shimmer-line 2s ease-in-out infinite",
                }}
              >
                <p className="font-serif text-sm text-ink/70">
                  Uploading &ldquo;{book.title}&rdquo;&hellip;
                </p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex size-full items-center justify-center">
          <p className="font-serif text-base text-ink opacity-50">
            {EMPTY_MESSAGES[activeTab]}
          </p>
        </div>
      )}

      {/* Hero heading — floating overlay at top */}
      <div className="pointer-events-none absolute inset-x-0 top-0 pt-6 md:pt-14">
        {children}
      </div>

      {/* Bottom navigation — floating overlay at bottom */}
      <div className="absolute inset-x-0 bottom-0 pb-4 md:pb-8">
        <ShelfNav
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onAddBook={handleAddBook}
        />
      </div>

      {/* Detail overlay — fixed to cover entire viewport */}
      {selectedBook && (
        <div className="fixed inset-0 z-10 flex overflow-x-hidden md:pointer-events-none max-md:flex-col max-md:overflow-y-auto max-md:bg-book-background">
          {/* Mobile header: back button + book dropdown */}
          <div className="shrink-0 px-4 pt-4 md:hidden" style={{ pointerEvents: "auto" }}>
            {/* <button
              onClick={handleBack}
              className="mb-4 flex size-[38px] cursor-pointer items-center justify-center rounded-full border border-[rgba(101,46,31,0.12)] text-espresso"
              aria-label="Go back"
            >
              <ArrowLeftIcon />
            </button> */}
            <BookDropdown book={selectedBook} />
          </div>

          {/* Left info column + divider (hidden on mobile) */}
          <BookInfoOverlay book={selectedBook} onBack={handleBack} className="max-md:hidden" />
          <div className="w-px shrink-0 bg-[rgba(62,39,51,0.12)] max-md:hidden" />

          {/* Content panel */}
          <div
            className="md:flex-1 md:overflow-hidden bg-book-background"
            style={{ pointerEvents: "auto" }}
          >
            <BookDetailPanel book={selectedBook} />
          </div>
        </div>
      )}

      {/* Add a book modal */}
      <AddBookModal
        isOpen={addBookOpen}
        onClose={() => setAddBookOpen(false)}
        onSelect={handleBookAdded}
      />
    </main>
  );
}
