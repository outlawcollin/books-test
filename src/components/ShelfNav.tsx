"use client";

import type { TabId } from "@/lib/types";
import {
  AllBooksIcon,
  InProgressIcon,
  MyCopiesIcon,
  AddBookIcon,
} from "./icons";

interface ShelfNavProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
  onAddBook: () => void;
}

const tabs: { id: TabId; label: string; icon: typeof AllBooksIcon }[] = [
  { id: "all-books", label: "All books", icon: AllBooksIcon },
  { id: "in-progress", label: "In-progress", icon: InProgressIcon },
  { id: "my-copies", label: "My copies", icon: MyCopiesIcon },
];

export default function ShelfNav({
  activeTab,
  onTabChange,
  onAddBook,
}: ShelfNavProps) {
  return (
    <nav className="flex shrink-0 flex-col items-center gap-6 w-full pb-6 px-4">
      {/* Divider */}
      <div className="h-px w-full max-w-[561px] bg-[rgba(62,39,51,0.12)]" />

      {/* Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {tabs.map(({ id, label, icon: Icon }) => {
          const isActive = activeTab === id;

          return (
            <button
              key={id}
              onClick={() => onTabChange(id)}
              className={`
                flex items-center gap-1.5 rounded-full px-4 py-2
                font-serif text-sm leading-normal
                transition-colors duration-150
                ${
                  isActive
                    ? "bg-espresso text-pure-white cursor-pointer"
                    : "text-ink cursor-pointer hover:bg-cta/30"
                }
              `}
            >
              <Icon className="size-5 shrink-0" />
              {label}
            </button>
          );
        })}

        {/* Add a book — always a button, never active */}
        <button
          onClick={onAddBook}
          className="
            flex items-center gap-1.5 rounded-full px-4 py-2
            border border-dashed border-ink
            font-serif text-sm leading-normal text-ink
            transition-colors duration-150
            cursor-pointer hover:bg-cta/30
          "
        >
          <AddBookIcon className="size-5 shrink-0" />
          Add a book
        </button>
      </div>
    </nav>
  );
}
