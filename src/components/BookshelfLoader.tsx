"use client";

import { type ReactNode, useState, useCallback, useEffect } from "react";
import dynamic from "next/dynamic";
import type { BookData, TabId, DetailTabId, ChatSession } from "@/lib/types";
import BookInfoOverlay from "./BookInfoOverlay";
import BookDetailPanel from "./BookDetailPanel";
import BookDropdown from "./detail/BookDropdown";
import ShelfNav from "./ShelfNav";
import AddBookModal, { type WebBook } from "./AddBookModal";
import ChatPanel from "./chat/ChatPanel";


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
  const [chatSession, setChatSession] = useState<ChatSession | null>(null);
  const [initialDetailTab, setInitialDetailTab] = useState<DetailTabId | undefined>();
  const [initialPremise, setInitialPremise] = useState<string | undefined>();
  const [spacerCenterY, setSpacerCenterY] = useState<number | null>(null);
  const [localBooks, setLocalBooks] = useState<BookData[]>([]);

  const handleSelectBook = useCallback((book: BookData) => {
    setSelectedBook(book);
  }, []);

  const handleBackToShelf = useCallback(() => {
    setChatSession(null);
    setSelectedBook(null);
  }, []);

  const handleBack = useCallback(() => {
    if (chatSession) {
      setChatSession(null);
      return;
    }
    setSelectedBook(null);
  }, [chatSession]);

  const handleChatClose = useCallback((action: "finish" | "rewrite", premise?: string) => {
    setChatSession(null);
    if (action === "rewrite" && premise) {
      setInitialDetailTab("build-world");
      setInitialPremise(premise);
    } else if (action === "finish") {
      setInitialDetailTab("playthroughs");
      setInitialPremise(undefined);
    } else {
      setInitialDetailTab(undefined);
      setInitialPremise(undefined);
    }
  }, []);

  const handleStartChat = useCallback((session: ChatSession) => {
    setChatSession(session);
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
      // Add the finished book to the shelf as a real BookData
      const SPINE_COLORS = ["#6b1d1d", "#8b6914", "#1a4a6b", "#4a6741", "#5c3d6e", "#73433d", "#2d5a4a"];
      setLocalBooks((prev) => [{
        id: `local-${book.id}`,
        title: book.title,
        author: book.source,
        spineColor: SPINE_COLORS[Math.floor(Math.random() * SPINE_COLORS.length)],
        isMyCopy: true,
      }, ...prev]);
    }, 3000);
  }, []);

  // ESC key to close detail panel or chat
  useEffect(() => {
    if (!selectedBook) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleBack();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [selectedBook, handleBack]);

  return (
    <main className="relative h-dvh w-dvw overflow-hidden bg-book-background">

      {/* Canvas — full viewport, filtered by active tab */}
      {(() => {
        const allBooks = [...localBooks, ...books];
        let filtered =
          activeTab === "my-copies" ? allBooks.filter((b) => b.isMyCopy) :
          activeTab === "in-progress" ? allBooks.filter((b) => b.hasPlaythrough) :
          allBooks;

        // Prepend loading placeholders so BookGroup positions them at center,
        // pushing existing books to the right
        if (activeTab === "my-copies" && uploadingBooks.length > 0) {
          const loadingBooks: BookData[] = uploadingBooks.map((wb) => ({
            id: `loading-${wb.id}`,
            title: wb.title,
            author: wb.source,
            isMyCopy: true,
            isLoading: true,
            spineColor: "#d4cec6",
          }));
          filtered = [...loadingBooks, ...filtered];
        }

        return (
          <BookshelfCanvas
            books={filtered}
            onSelectBook={handleSelectBook}
            selectedBook={selectedBook}
            spacerCenterY={spacerCenterY}
          />
        );
      })()}

      {/* Empty tab message — overlay so canvas stays mounted */}
      {(() => {
        if (activeTab === "all-books" || selectedBook) return null;
        const allBooks = [...localBooks, ...books];
        const filtered =
          activeTab === "my-copies" ? allBooks.filter((b) => b.isMyCopy) :
          allBooks.filter((b) => b.hasPlaythrough);
        if (filtered.length > 0 || uploadingBooks.length > 0) return null;
        return (
          <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
            <p className="font-serif text-base text-ink opacity-50">
              {EMPTY_MESSAGES[activeTab]}
            </p>
          </div>
        );
      })()}

      {/* Upload shimmer overlay — shows while a book is being added */}
      {activeTab === "my-copies" && uploadingBooks.length > 0 && (
        <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
          {uploadingBooks.map((book) => (
            <div
              key={book.id}
              className="flex aspect-[2/3] w-[200px] flex-col items-center justify-center rounded-sm border border-espresso/10 overflow-hidden text-center px-4"
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
      )}

      {/* Hero heading — floating overlay at top (hidden in detail view) */}
      {!selectedBook && (
        <div className="pointer-events-none absolute inset-x-0 top-0 pt-6 md:pt-14">
          {children}
        </div>
      )}

      {/* Bottom navigation — floating overlay at bottom (hidden in detail view) */}
      {!selectedBook && (
        <div className="absolute inset-x-0 bottom-0 pb-[env(safe-area-inset-bottom)] md:pb-8">
          <ShelfNav
            activeTab={activeTab}
            onTabChange={setActiveTab}
            onAddBook={handleAddBook}
          />
        </div>
      )}

      {/* Detail overlay — fixed to cover entire viewport */}
      {selectedBook && (
        <div className="fixed inset-0 z-10 flex md:pointer-events-none max-md:flex-col max-md:overflow-y-auto max-md:bg-book-background">
          {/* Mobile header: back button + book dropdown (hidden in chat) */}
          {!chatSession && (
            <div className="shrink-0 border-b border-[rgba(62,39,51,0.12)] p-4 md:hidden" style={{ pointerEvents: "auto" }}>
              <button
                onClick={handleBack}
                className="mb-4 flex size-[38px] cursor-pointer items-center justify-center rounded-full border border-[rgba(101,46,31,0.12)] text-espresso"
                aria-label="Go back"
              >
                <ArrowLeftIcon />
              </button>
              <BookDropdown book={selectedBook} />
            </div>
          )}

          {/* Left info column + divider (hidden on mobile) */}
          <BookInfoOverlay book={selectedBook} onBack={handleBackToShelf} onSpacerMeasure={setSpacerCenterY} className="max-md:hidden" />
          <div className="w-px shrink-0 bg-[rgba(62,39,51,0.12)] max-md:hidden" />

          {/* Content panel — swaps between detail tabs and chat */}
          <div
            className="flex-1 overflow-hidden bg-book-background"
            style={{ pointerEvents: "auto" }}
          >
            {chatSession ? (
              <ChatPanel session={chatSession} book={selectedBook} onClose={handleChatClose} />
            ) : (
              <BookDetailPanel
                book={selectedBook}
                onStartChat={handleStartChat}
                initialTab={initialDetailTab}
                initialPremise={initialPremise}
              />
            )}
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
