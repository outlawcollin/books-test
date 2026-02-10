"use client";

import { useState } from "react";
import type { BookData, DetailTabId, ChatSession } from "@/lib/types";
import DetailTabs from "./detail/DetailTabs";
import PlayBookTab from "./detail/PlayBookTab";
import BuildWorldTab from "./detail/BuildWorldTab";
import PlaythroughsTab from "./detail/PlaythroughsTab";
import CommunityRewrites from "./detail/CommunityRewrites";

interface BookDetailPanelProps {
  book: BookData;
  onStartChat?: (session: ChatSession) => void;
  initialTab?: DetailTabId;
  initialPremise?: string;
}

export default function BookDetailPanel({ book, onStartChat, initialTab, initialPremise }: BookDetailPanelProps) {
  const [activeTab, setActiveTab] = useState<DetailTabId>(initialTab ?? "play-book");
  return (
    <div className="flex h-full font-serif text-ink">
      {/* Center column */}
      <div className="flex flex-1 flex-col gap-6 overflow-y-auto px-4 pt-6 pb-4 md:p-6">
        <DetailTabs activeTab={activeTab} onTabChange={setActiveTab} />

        {activeTab === "play-book" && <PlayBookTab book={book} onStartChat={onStartChat} />}

        {activeTab === "build-world" && <BuildWorldTab book={book} onStartChat={onStartChat} initialPremise={initialPremise} />}

        {activeTab === "playthroughs" && <PlaythroughsTab book={book} />}
      </div>

      {/* Divider + Community Rewrites */}
      <div className="w-px shrink-0 self-stretch bg-[rgba(62,39,51,0.12)] hide-below-lg" />
      <CommunityRewrites book={book} className="hide-below-lg" />
    </div>
  );
}
