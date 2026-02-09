"use client";

import type { BookData } from "@/lib/types";

interface BookInfoOverlayProps {
  book: BookData;
  onBack: () => void;
  className?: string;
}

function ArrowLeftIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M9.66782 18.082L4.37493 12.7892C3.9844 12.3986 3.9844 11.7655 4.37492 11.3749L9.66782 6.08203M4.91782 12.082H19.9178" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function BookInfoOverlay({ book, onBack, className }: BookInfoOverlayProps) {
  return (
    <div
      className={`flex min-w-0 flex-1 max-w-[400px] flex-col items-center justify-center gap-6 overflow-hidden px-8 py-12 font-serif text-ink ${className || ""}`}
      style={{ pointerEvents: "none" }}
    >
      {/* Back button — "back" + "esc" appear on hover */}
      <div
        className="group absolute left-0 top-0 flex items-center gap-3 p-6"
        style={{ pointerEvents: "auto" }}
      >
        <button
          onClick={onBack}
          className="flex size-[38px] cursor-pointer items-center justify-center rounded-full border border-[rgba(101,46,31,0.12)] text-espresso transition-colors hover:bg-cta/30"
          aria-label="Go back"
        >
          <ArrowLeftIcon />
        </button>
        <div className="flex items-center gap-1.5 opacity-0 transition-opacity group-hover:opacity-100">
          <span className="text-xs leading-[1.5] text-espresso opacity-80">back</span>
          <span className="rounded-[4.5px] bg-espresso px-1.5 py-1 font-mono text-xs leading-none tracking-tight text-pure-white">
            esc
          </span>
        </div>
      </div>

      {/* Spacer — 3D book is visible through canvas below */}
      <div className="h-[220px] w-[180px] shrink-0" />

      {/* Book info */}
      <div className="flex max-w-[396px] flex-col items-center gap-4">
        <h1 className="w-full text-center text-4xl font-normal leading-[1.1] tracking-[-0.72px]">
          {book.title}
        </h1>

        {book.description && (
          <p className="line-clamp-3 max-w-[340px] text-center text-base leading-[1.5]">
            {book.description}
          </p>
        )}

        <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5 text-xs opacity-80">
          <span>{book.author}</span>
          {book.publishedYear && (
            <>
              <span className="size-1 shrink-0 rounded-full bg-ink opacity-60" />
              <span>First published {book.publishedYear}</span>
            </>
          )}
          {book.origin && (
            <>
              <span className="size-1 shrink-0 rounded-full bg-ink opacity-60" />
              <span>{book.origin}</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
