"use client";

import dynamic from "next/dynamic";
import type { BookData } from "@/lib/types";

const MiniBookCanvas = dynamic(() => import("../detail/MiniBookCanvas"), { ssr: false });

interface EndBookScreenProps {
  book: BookData;
  onKeepPlaying: () => void;
  onFinish: () => void;
  onSelectRewrite: (premise: string) => void;
}

export default function EndBookScreen({ book, onKeepPlaying, onFinish, onSelectRewrite }: EndBookScreenProps) {
  const rewrites = book.communityRewrites?.length
    ? book.communityRewrites
    : [
        { premise: "Set in modern-day New York City." },
        { premise: "Retold from the antagonist's perspective." },
        { premise: "A comedy where everything goes right." },
      ];

  const displayRewrites = rewrites.slice(0, 3);

  return (
    <div className="flex size-full flex-col items-center justify-center p-6 md:p-[52px] max-md:overflow-y-auto max-md:justify-start max-md:pt-10">
      <div className="flex w-full max-w-[400px] flex-col items-center gap-6">
        {/* Heading + subtitle + buttons */}
        <div className="flex w-full flex-col items-center gap-6">
          <h2 className="text-center font-serif text-4xl leading-[1.3] tracking-[-0.72px] text-ink">
            Close the book
            <br />
            (for now)?
          </h2>
          <p className="text-center font-serif text-base leading-[1.5] text-ink">
            The story remembers where you left it.
          </p>
          <div className="flex w-full items-center gap-3">
            <button
              onClick={onKeepPlaying}
              className="cursor-pointer rounded-full border border-[rgba(62,39,51,0.12)] px-6 py-4 font-serif text-sm leading-[1.4] text-ink transition-colors hover:bg-cta/30"
            >
              Keep playing
            </button>
            <button
              onClick={onFinish}
              className="flex-1 cursor-pointer rounded-full bg-ink px-6 py-4 font-serif text-sm leading-[1.4] text-pure-white transition-opacity hover:opacity-90"
            >
              Finish
            </button>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px w-full bg-[rgba(62,39,51,0.12)]" />

        {/* Rewrite paths */}
        <div className="flex w-full flex-col items-center gap-6 font-serif">
          <p className="text-center text-base leading-[1.5] text-ink/70">
            Or take a different path...
          </p>
          <div className="flex items-start justify-center gap-6 max-md:grid max-md:grid-cols-2 max-md:gap-4">
            {displayRewrites.map((rewrite, i) => (
              <button
                key={i}
                onClick={() => onSelectRewrite(rewrite.premise)}
                className="flex w-[172px] cursor-pointer flex-col items-center gap-3 text-center max-md:w-auto"
              >
                <MiniBookCanvas book={book} />
                <p className="text-xs leading-[1.3] text-pure-black">
                  {rewrite.premise}
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
