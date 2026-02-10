"use client";

import dynamic from "next/dynamic";
import type { BookData } from "@/lib/types";

const MiniBookCanvas = dynamic(() => import("./MiniBookCanvas"), { ssr: false });

interface CommunityRewritesProps {
  book: BookData;
  className?: string;
}

function InfoCircleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M8.95866 9.16675H10.0003L10.0003 13.5417M17.7087 10.0001C17.7087 14.2573 14.2575 17.7084 10.0003 17.7084C5.74313 17.7084 2.29199 14.2573 2.29199 10.0001C2.29199 5.74289 5.74313 2.29175 10.0003 2.29175C14.2575 2.29175 17.7087 5.74289 17.7087 10.0001Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="9.45801" y="6.125" width="1.08333" height="1.08333" rx="0.541667" fill="currentColor" stroke="currentColor" strokeWidth="0.25" />
    </svg>
  );
}

export default function CommunityRewrites({ book, className }: CommunityRewritesProps) {
  const rewrites = book.communityRewrites?.length
    ? book.communityRewrites
    : [
        { premise: "Set in modern-day New York City." },
        { premise: "Retold from the antagonist's perspective." },
        { premise: "A comedy where everything goes right." },
        { premise: "Reimagined as a sci-fi thriller." },
      ];

  return (
    <div className={`relative flex h-full max-w-[224px] min-w-[180px] flex-col items-center ${className || ""}`}>
      {/* Pill header — outside scroll area so tooltip isn't clipped */}
      <div className="relative z-10 flex w-full shrink-0 flex-col items-center">
        <div className="flex w-full items-center justify-center bg-book-background px-6 pb-2 pt-6">
          <div className="group relative flex items-center gap-1.5 font-serif text-sm leading-[1.5] text-ink">
            Rewrites
            <span className="opacity-50 group-hover:opacity-100">
              <InfoCircleIcon />
            </span>
            <span className="pointer-events-none invisible absolute left-1/2 top-full z-10 mt-1 w-[160px] -translate-x-1/2 rounded-lg bg-book-background px-3 py-2 text-center font-serif text-xs leading-[1.4] text-espresso drop-shadow-[0_4px_12px_rgba(0,0,0,0.25)] group-hover:visible">
              Community-created alternate versions of this story
            </span>
          </div>
        </div>
        {/* Gradient overlays scroll content */}
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-3 translate-y-full bg-gradient-to-b from-book-background to-transparent" />
      </div>

      {/* Scrollable content */}
      <div className="w-full flex-1 overflow-y-auto">
        <div className="flex flex-col items-center gap-6 px-6 pb-6 pt-3">
          {rewrites.map((rewrite, i) => (
            <div
              key={i}
              className="flex w-[172px] cursor-pointer flex-col items-center gap-3 text-center"
            >
              <MiniBookCanvas book={book} />
              <p className="text-xs leading-[1.4] text-pure-black">
                {rewrite.premise}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
