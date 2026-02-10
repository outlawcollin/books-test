"use client";

import { useState } from "react";
import type { BookData, DetailTabId } from "@/lib/types";
import DetailTabs from "./detail/DetailTabs";
import PlayBookTab from "./detail/PlayBookTab";
import CommunityRewrites from "./detail/CommunityRewrites";

interface BookDetailPanelProps {
  book: BookData;
}

export default function BookDetailPanel({ book }: BookDetailPanelProps) {
  const [activeTab, setActiveTab] = useState<DetailTabId>("play-book");

  return (
    <div className="flex h-full font-serif text-ink">
      {/* Center column */}
      <div className="flex flex-1 flex-col gap-6 overflow-y-auto px-4 pt-6 pb-4 md:p-6">
        <DetailTabs activeTab={activeTab} onTabChange={setActiveTab} />

        {activeTab === "play-book" && <PlayBookTab book={book} />}

        {activeTab === "build-world" && (
          <div className="flex flex-1 items-center justify-center">
            <p className="font-serif text-base text-ink opacity-50">
              Build on this world — coming soon.
            </p>
          </div>
        )}

        {activeTab === "playthroughs" && (
          <div className="flex flex-1 items-center justify-center">
            <p className="font-serif text-base text-ink opacity-50">
              Your play throughs — coming soon.
            </p>
          </div>
        )}
      </div>

      {/* Divider + Community Rewrites — hidden below lg (1024px) */}
      <div className="w-px shrink-0 self-stretch bg-[rgba(62,39,51,0.12)] hide-below-lg" />
      <CommunityRewrites book={book} className="hide-below-lg" />
    </div>
  );
}
