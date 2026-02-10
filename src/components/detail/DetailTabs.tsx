"use client";

import type { DetailTabId } from "@/lib/types";

interface DetailTabsProps {
  activeTab: DetailTabId;
  onTabChange: (tab: DetailTabId) => void;
}

function HorizonIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M10.0003 2.29175V3.14959M3.14847 10.2084H2.29199M16.8522 10.2084H17.7087M14.8448 5.15964L15.4504 4.55306M2.29199 13.5417H17.7087M5.62533 16.8751H14.3753M5.15592 5.15964L4.55029 4.55306M6.45866 10.2084V10.0057C6.45866 8.04659 8.04432 6.45841 10.0003 6.45841C11.9563 6.45841 13.542 8.04659 13.542 10.0057V10.2084" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function MagicEditIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M3.96297 4.29816C3.87537 4.12295 3.62533 4.12295 3.53773 4.29816L2.99339 5.38683C2.97039 5.43284 2.93308 5.47014 2.88708 5.49315L1.7984 6.03748C1.62319 6.12509 1.62319 6.37512 1.7984 6.46273L2.88708 7.00707C2.93308 7.03007 2.97039 7.06738 2.99339 7.11338L3.53773 8.20206C3.62533 8.37727 3.87537 8.37727 3.96297 8.20206L4.50731 7.11338C4.53032 7.06738 4.56762 7.03007 4.61362 7.00707L5.7023 6.46273C5.87751 6.37512 5.87751 6.12509 5.7023 6.03748L4.61362 5.49315C4.56762 5.47014 4.53032 5.43284 4.50731 5.38683L3.96297 4.29816Z" fill="currentColor" />
      <path d="M7.72072 1.80296C7.62991 1.62134 7.37074 1.62135 7.27993 1.80296L6.87998 2.60287C6.85613 2.65056 6.81747 2.68922 6.76978 2.71307L5.96987 3.11302C5.78826 3.20383 5.78826 3.463 5.96987 3.55381L6.76978 3.95376C6.81747 3.97761 6.85613 4.01627 6.87998 4.06396L7.27993 4.86387C7.37074 5.04548 7.62991 5.04548 7.72072 4.86387L8.12067 4.06396C8.14452 4.01627 8.18318 3.97761 8.23087 3.95376L9.03078 3.55381C9.2124 3.463 9.2124 3.20383 9.03078 3.11302L8.23087 2.71307C8.18318 2.68922 8.14452 2.65056 8.12067 2.60287L7.72072 1.80296Z" fill="currentColor" />
      <path d="M15.6296 12.6315C15.542 12.4563 15.292 12.4563 15.2044 12.6315L14.66 13.7202C14.637 13.7662 14.5997 13.8035 14.5537 13.8265L13.4651 14.3708C13.2899 14.4584 13.2899 14.7084 13.4651 14.796L14.5537 15.3404C14.5997 15.3634 14.637 15.4007 14.66 15.4467L15.2044 16.5353C15.292 16.7106 15.542 16.7105 15.6296 16.5353L16.1739 15.4467C16.1969 15.4007 16.2343 15.3634 16.2803 15.3404L17.3689 14.796C17.5441 14.7084 17.5441 14.4584 17.3689 14.3708L16.2803 13.8265C16.2343 13.8035 16.1969 13.7662 16.1739 13.7202L15.6296 12.6315Z" fill="currentColor" />
      <path d="M14.3393 3.50604L16.4941 5.66086C16.8195 5.9863 16.8195 6.51394 16.4941 6.83937L6.70241 16.631C6.54613 16.7873 6.33417 16.8751 6.11316 16.8751H3.125V13.887C3.125 13.6659 3.2128 13.454 3.36908 13.2977L13.1607 3.50604C13.4862 3.1806 14.0138 3.1806 14.3393 3.50604Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function BookmarkIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M16.0413 16.5632V3.29175C16.0413 2.73946 15.5936 2.29175 15.0413 2.29175H4.95801C4.40572 2.29175 3.95801 2.73946 3.95801 3.29175V16.5632C3.95801 17.3639 4.85215 17.8399 5.5164 17.3928L9.44128 14.7509C9.77887 14.5237 10.2205 14.5237 10.5581 14.7509L14.4829 17.3928C15.1472 17.8399 16.0413 17.3639 16.0413 16.5632Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const TABS: { id: DetailTabId; label: string; Icon: () => React.JSX.Element }[] = [
  { id: "play-book", label: "Play book", Icon: HorizonIcon },
  { id: "build-world", label: "Build on this world", Icon: MagicEditIcon },
  { id: "playthroughs", label: "Your play throughs", Icon: BookmarkIcon },
];

export default function DetailTabs({ activeTab, onTabChange }: DetailTabsProps) {
  return (
    <div className="flex flex-col gap-6">
      <div className="relative">
        <div className="flex gap-2 overflow-x-auto">
          {TABS.map(({ id, label, Icon }) => {
            const isActive = activeTab === id;
            return (
              <button
                key={id}
                onClick={() => onTabChange(id)}
                className={`flex shrink-0 cursor-pointer items-center gap-1.5 rounded-full px-4 py-2 font-serif text-sm leading-[1.5] transition-colors ${
                  isActive
                    ? id === "build-world"
                      ? "bg-[#6b2e63] text-pure-white"
                      : id === "playthroughs"
                        ? "bg-ink text-pure-white"
                        : "bg-dark-sage text-pure-white"
                    : "text-ink hover:bg-cta/30"
                }`}
              >
                <Icon />
                {label}
              </button>
            );
          })}
        </div>
        {/* Right fade gradient */}
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-book-background to-transparent" />
      </div>
      <div className="h-px w-full bg-[rgba(62,39,51,0.12)]" />
    </div>
  );
}
