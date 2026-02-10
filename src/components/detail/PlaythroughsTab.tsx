"use client";

import { useState } from "react";
import type { BookData, Playthrough } from "@/lib/types";
import { BOOK_PLAYTHROUGHS } from "@/lib/playthroughs";
import ShareModal from "./ShareModal";

interface PlaythroughsTabProps {
  book: BookData;
}

function ShareIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M9.99999 3.125V12.5M9.99999 3.125L13.75 6.875M9.99999 3.125L6.25 6.875M16.875 10.625V16.0417C16.875 16.5019 16.5019 16.875 16.0417 16.875H3.95833C3.4981 16.875 3.125 16.5019 3.125 16.0417V10.625" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function PlaythroughRow({
  playthrough,
  onShare,
}: {
  playthrough: Playthrough;
  onShare: (p: Playthrough) => void;
}) {
  return (
    <div className="flex items-center gap-3">
      {/* Info */}
      <div className="flex flex-1 flex-col gap-1">
        {/* Row 1: Playing as */}
        <div className="flex items-center gap-2">
          <p className="font-serif text-sm leading-[1.5] text-ink opacity-80">Playing as</p>
          <p className="font-serif text-sm leading-[1.5] text-ink opacity-80">
            {playthrough.characterName}
          </p>
        </div>

        {/* Row 2: Type badge + timestamp */}
        <div className="flex items-center gap-3">
          <span className={`rounded-[4.5px] px-1.5 py-1 font-serif text-xs leading-none text-white ${
            playthrough.type === "normal" ? "bg-dark-sage" : "bg-[#6b2e63]"
          }`}>
            {playthrough.type === "normal" ? "Normal" : "Rewrite"}
          </span>
          <span className="size-1 rounded-full bg-ink opacity-40" />
          <p className="font-serif text-xs leading-[1.5] text-ink opacity-60">
            {playthrough.timestamp}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex shrink-0 items-center gap-1.5">
        <button
          onClick={() => onShare(playthrough)}
          className="flex size-9 cursor-pointer items-center justify-center rounded-full border border-[rgba(62,39,51,0.12)] text-ink transition-colors hover:bg-cta/30"
        >
          <ShareIcon />
        </button>
        <button className="cursor-pointer rounded-full border border-[rgba(62,39,51,0.12)] px-4 py-2 font-serif text-sm leading-[1.4] text-ink transition-colors hover:bg-cta/30">
          Continue
        </button>
      </div>
    </div>
  );
}

export default function PlaythroughsTab({ book }: PlaythroughsTabProps) {
  const playthroughs = BOOK_PLAYTHROUGHS[book.id] ?? [];
  const [shareTarget, setShareTarget] = useState<Playthrough | null>(null);

  if (playthroughs.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <p className="font-serif text-base text-ink opacity-50">
          No play throughs yet. Dive into a story to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col">
      {playthroughs.map((pt, i) => (
        <div key={pt.id}>
          <PlaythroughRow playthrough={pt} onShare={setShareTarget} />
          {i < playthroughs.length - 1 && (
            <div className="my-6 h-px w-full bg-[rgba(62,39,51,0.12)]" />
          )}
        </div>
      ))}
      <ShareModal
        isOpen={shareTarget !== null}
        onClose={() => setShareTarget(null)}
        title={shareTarget ? `Share — ${shareTarget.characterName}` : "Share"}
      />
    </div>
  );
}
