"use client";

import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";

/* ── Types ─────────────────────────────────────────────────────────────────── */

export interface WebBook {
  id: string;
  title: string;
  source: string;
  timeAgo: string;
  coverUrl?: string;
}

/* ── Mock data — swap with real API results ────────────────────────────────── */

const MOCK_BOOKS: WebBook[] = [
  { id: "1", title: "Infection", source: "wattpad.com", timeAgo: "9d ago", coverUrl: "/icons/modal/placeholder-cover.jpg" },
  { id: "2", title: "The Last Horizon", source: "royalroad.com", timeAgo: "2d ago" },
  { id: "3", title: "Midnight Library", source: "gutenberg.org", timeAgo: "12d ago" },
  { id: "4", title: "Echoes of Tomorrow", source: "wattpad.com", timeAgo: "5d ago" },
  { id: "5", title: "Iron Flame", source: "archive.org", timeAgo: "1d ago" },
  { id: "6", title: "The Binding", source: "royalroad.com", timeAgo: "3w ago" },
];

/* ── Icons (inlined for color toggling) ────────────────────────────────────── */

function UploadIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M9.99999 3.125V12.5M9.99999 3.125L13.75 6.875M9.99999 3.125L6.25 6.875M16.875 10.625V16.0417C16.875 16.5019 16.5019 16.875 16.0417 16.875H3.95833C3.4981 16.875 3.125 16.5019 3.125 16.0417V10.625" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function LinkIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M8.12458 4.60305L8.92999 3.79764C10.938 1.78962 14.1936 1.78962 16.2017 3.79764C18.2097 5.80566 18.2097 9.0613 16.2017 11.0693L15.3945 11.8765M4.60673 8.1209L3.79703 8.9306C1.78901 10.9386 1.78901 14.1943 3.79703 16.2023C5.80505 18.2103 9.06069 18.2103 11.0687 16.2023L11.8725 15.3985M7.91602 12.0833L12.0827 7.91663" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M15 9L9 15M15 15L9 9M21.25 12C21.25 17.1086 17.1086 21.25 12 21.25C6.89137 21.25 2.75 17.1086 2.75 12C2.75 6.89137 6.89137 2.75 12 2.75C17.1086 2.75 21.25 6.89137 21.25 12Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none">
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
      <path d="M20 20L16 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="26" height="26" viewBox="0 0 32 32" fill="none">
      <path fillRule="evenodd" clipRule="evenodd" d="M16 0C24.8366 0 32 7.16344 32 16C32 24.8366 24.8366 32 16 32C7.16344 32 0 24.8366 0 16C0 7.16344 7.16344 0 16 0ZM25.8604 9.3916C25.4334 8.28717 24.1545 7.72398 23.0039 8.13379C21.2395 8.76233 19.5746 9.9508 18.1348 11.2207C15.8372 13.2471 13.8578 15.6316 12.0498 18.0977C11.5472 17.5641 11.0635 17.159 10.6074 16.8525C9.8933 16.3727 9.08834 16.032 8.22168 16C6.99463 16.0002 6 16.9558 6 18.1338C6.00015 19.1998 6.81474 20.0828 7.87891 20.2412C8.0768 20.3382 8.95217 20.8594 10.1816 22.9248C10.5722 23.5809 11.295 23.9902 12.082 24C12.8689 24.0098 13.6026 23.6185 14.0107 22.9727C14.328 22.4728 14.6648 21.9855 15.0049 21.501C16.8017 18.9409 18.7896 16.4377 21.1416 14.3633C22.4038 13.25 23.5953 12.5981 24.5303 11.9971C25.6888 11.2522 26.2872 10.4961 25.8604 9.3916Z" fill="currentColor" />
      <path d="M25.8604 9.3916C25.4334 8.28717 24.1545 7.72398 23.0039 8.13379C21.2395 8.76233 19.5746 9.9508 18.1348 11.2207C15.8372 13.2471 13.8578 15.6316 12.0498 18.0977C11.5472 17.5641 11.0635 17.159 10.6074 16.8525C9.8933 16.3727 9.08834 16.032 8.22168 16C6.99463 16.0002 6 16.9558 6 18.1338C6.00015 19.1998 6.81474 20.0828 7.87891 20.2412C8.0768 20.3382 8.95217 20.8594 10.1816 22.9248C10.5722 23.5809 11.295 23.9902 12.082 24C12.8689 24.0098 13.6026 23.6185 14.0107 22.9727C14.328 22.4728 14.6648 21.9855 15.0049 21.501C16.8017 18.9409 18.7896 16.4377 21.1416 14.3633C22.4038 13.25 23.5953 12.5981 24.5303 11.9971C25.6888 11.2522 26.2872 10.4961 25.8604 9.3916Z" fill="var(--color-book-background)" />
    </svg>
  );
}

/* ── Component ─────────────────────────────────────────────────────────────── */

interface AddBookModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect?: (book: WebBook) => void;
  books?: WebBook[];
}

export default function AddBookModal({
  isOpen,
  onClose,
  onSelect,
  books = MOCK_BOOKS,
}: AddBookModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredBooks = useMemo(() => {
    if (!searchQuery.trim()) return books;
    const q = searchQuery.toLowerCase();
    return books.filter(
      (b) =>
        b.title.toLowerCase().includes(q) ||
        b.source.toLowerCase().includes(q)
    );
  }, [books, searchQuery]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    },
    [onClose]
  );

  const handleBackdropClick = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (event.target === event.currentTarget) onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, handleKeyDown]);

  useEffect(() => {
    if (isOpen && modalRef.current) {
      modalRef.current.focus();
    }
  }, [isOpen]);

  const handleClose = () => {
    setSearchQuery("");
    setSelectedId(null);
    setHoveredId(null);
    onClose();
  };

  const handleSelect = (book: WebBook) => {
    setSelectedId(book.id);
    onSelect?.(book);
  };

  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-[12px]"
      style={{ backgroundColor: "rgba(244, 240, 233, 0.72)" }}
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-book-title"
    >
      <div
        ref={modalRef}
        className="relative mx-4 flex w-full max-w-[460px] flex-col overflow-hidden rounded-[44px] border border-[rgba(62,39,51,0.12)] bg-book-background p-5"
        style={{
          maxHeight: "70vh",
          boxShadow: "0px 4px 70px rgba(0, 0, 0, 0.45)",
        }}
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2
            id="add-book-title"
            className="font-serif text-[20px] leading-[1.3] text-ink"
          >
            Add a book
          </h2>
          <button
            onClick={handleClose}
            className="flex size-[38px] cursor-pointer items-center justify-center rounded-full border border-[rgba(101,46,31,0.12)] text-espresso transition-colors hover:bg-cta/30"
            aria-label="Close modal"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".txt,.pdf,.epub"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              const book: WebBook = {
                id: crypto.randomUUID(),
                title: file.name.replace(/\.[^.]+$/, ""),
                source: "upload",
                timeAgo: "just now",
              };
              onSelect?.(book);
              handleClose();
            }
            e.target.value = "";
          }}
        />

        {/* Action cards */}
        <div className="mt-5 flex gap-2">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex h-[144px] flex-1 cursor-pointer flex-col items-center justify-center gap-2.5 rounded-[12px] border border-dashed border-[rgba(101,46,31,0.24)] p-5 text-center text-espresso transition-colors hover:bg-cta/10"
          >
            <UploadIcon />
            <span className="font-serif text-sm leading-normal">
              Upload a book
            </span>
            <span className="font-serif text-xs leading-[1.4] opacity-60">
              Drop a .txt, .pdf or epub file here, or click to browse. 50MB Max.
            </span>
          </button>
          <button className="flex h-[144px] flex-1 cursor-pointer flex-col items-center justify-center gap-2.5 rounded-[12px] border border-solid border-[rgba(101,46,31,0.24)] p-5 text-center text-espresso transition-colors hover:bg-cta/10">
            <LinkIcon />
            <span className="font-serif text-sm leading-normal">
              Add from URL
            </span>
            <span className="font-serif text-xs leading-[1.4] opacity-60">
              Add the URL of any web page to extract it&apos;s contents as a book.
            </span>
          </button>
        </div>

        {/* Search bar */}
        <div className="mt-5 flex items-center gap-2 rounded-[12px] bg-espresso/[0.06] px-3.5 py-3">
          <SearchIcon className="shrink-0 text-espresso" />
          <input
            type="text"
            placeholder="Search Web Books"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent font-serif text-sm leading-[1.3] text-espresso outline-none placeholder:text-espresso/70"
          />
        </div>

        {/* Book list (scrollable) */}
        <div className="relative mt-3 min-h-0 flex-1 overflow-y-auto">
          <div className="flex flex-col">
            {filteredBooks.length === 0 ? (
              <div className="flex items-center justify-center py-12">
                <p className="font-serif text-sm text-espresso/50">
                  No results found.
                </p>
              </div>
            ) : (
              filteredBooks.map((book) => {
                const isSelected = book.id === selectedId;
                const isHovered = book.id === hoveredId;

                return (
                  <button
                    key={book.id}
                    onClick={() => handleSelect(book)}
                    onMouseEnter={() => setHoveredId(book.id)}
                    onMouseLeave={() => setHoveredId(null)}
                    className={`flex w-full cursor-pointer items-center gap-3 rounded-[12px] p-3 transition-colors duration-150 ${
                      isHovered ? "bg-cta/15" : "bg-transparent"
                    }`}
                  >
                    {/* Cover thumbnail */}
                    <div
                      className="relative h-[64px] w-[43px] shrink-0 overflow-hidden rounded-[2px] border border-[rgba(0,0,0,0.12)] bg-espresso/10"
                      style={{ boxShadow: "0px 4px 32px rgba(62, 39, 51, 0.04)" }}
                    >
                      {book.coverUrl ? (
                        <Image
                          src={book.coverUrl}
                          alt={book.title}
                          fill
                          className="object-cover"
                          sizes="43px"
                        />
                      ) : (
                        <div className="flex size-full items-center justify-center font-serif text-xs text-espresso/40">
                          {book.title.charAt(0)}
                        </div>
                      )}
                    </div>

                    {/* Title + source */}
                    <div className="flex flex-1 flex-col items-start gap-1">
                      <span className="font-serif text-[16px] leading-[1.2] text-espresso">
                        {book.title}
                      </span>
                      <span className="font-serif text-xs leading-[1.2] text-espresso/60">
                        {book.source} · {book.timeAgo}
                      </span>
                    </div>

                    {/* Select / Selected indicator */}
                    {isSelected ? (
                      <CheckIcon className="shrink-0 text-espresso" />
                    ) : isHovered ? (
                      <span className="shrink-0 rounded-full bg-cta/30 px-4 py-1.5 font-serif text-xs text-espresso">
                        Select
                      </span>
                    ) : null}
                  </button>
                );
              })
            )}
          </div>

          {/* Bottom fade */}
          <div className="pointer-events-none sticky bottom-0 left-0 right-0 h-[85px] bg-gradient-to-t from-book-background to-transparent" />
        </div>
      </div>
    </div>,
    document.body
  );
}
