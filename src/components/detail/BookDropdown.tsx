"use client";

import type { BookData } from "@/lib/types";

function ChevronDownIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M6.66699 8.33325L9.7057 11.372C9.86842 11.5347 10.1322 11.5347 10.295 11.372L13.3337 8.33325" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

interface BookDropdownProps {
  book: BookData;
}

export default function BookDropdown({ book }: BookDropdownProps) {
  return (
    <div className="flex w-full items-center gap-3 rounded-[12px] bg-[#ede6de] p-3">
      {/* Book cover thumbnail */}
      {book.coverImage && (
        <img
          src={book.coverImage}
          alt={book.title}
          className="h-12 w-8 shrink-0 rounded-sm object-cover"
        />
      )}

      {/* Title + Author */}
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <p className="truncate font-serif text-sm leading-[1.5] text-ink opacity-80">
          {book.title}
        </p>
        <p className="truncate font-serif text-xs leading-[1.5] text-ink opacity-60">
          {book.author}
        </p>
      </div>

      {/* Chevron */}
      <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#e0d4c8] text-ink">
        <ChevronDownIcon />
      </div>
    </div>
  );
}
