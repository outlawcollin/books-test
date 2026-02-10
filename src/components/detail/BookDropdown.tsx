"use client";

import type { BookData } from "@/lib/types";

interface BookDropdownProps {
  book: BookData;
}

export default function BookDropdown({ book }: BookDropdownProps) {
  return (
    <div className="flex w-full items-start gap-3 rounded-[12px] bg-[#ede6de] p-3">
      {/* Book cover thumbnail */}
      {book.coverImage && (
        <img
          src={book.coverImage}
          alt={book.title}
          className="h-12 w-8 shrink-0 rounded-sm object-cover"
        />
      )}

      {/* Title + Description + Metadata */}
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <p className="font-serif text-sm leading-[1.5] text-ink underline">
          {book.title}
        </p>

        {book.description && (
          <p className="line-clamp-3 font-serif text-xs leading-[1.5] text-ink">
            {book.description}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5">
          <span className="font-serif text-xs leading-[1.5] text-ink opacity-60">
            {book.author}
          </span>
          {book.publishedYear && (
            <>
              <span className="size-1 shrink-0 rounded-full bg-ink opacity-60" />
              <span className="font-serif text-xs leading-[1.5] text-ink opacity-60">
                First published {book.publishedYear}
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
