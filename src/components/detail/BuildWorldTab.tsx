"use client";

import { useState } from "react";
import type { BookData, ChatSession, StoryInputMode, RewriteData } from "@/lib/types";
import { BOOK_CHAT_MESSAGES } from "@/lib/mock-chat";
import { BOOK_REWRITES } from "@/lib/rewrites";
import CharacterPicker from "./CharacterPicker";
import SelectionCard from "./SelectionCard";
import PersonaModal, { type Persona } from "./PersonaModal";

interface BuildWorldTabProps {
  book: BookData;
  onStartChat?: (session: ChatSession) => void;
  initialRewrite?: RewriteData;
  onClearRewrite?: () => void;
}

const closePillIcon = (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path d="M6.45801 6.45825L13.5413 13.5416M13.5413 6.45825L6.45801 13.5416" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

function findCharacterIndex(characters: string[], name?: string): number | null {
  if (!name) return null;
  const idx = characters.findIndex((c) => c === name);
  return idx >= 0 ? idx : null;
}

export default function BuildWorldTab({ book, onStartChat, initialRewrite, onClearRewrite }: BuildWorldTabProps) {
  const suggestions = BOOK_REWRITES[book.id] ?? [];
  const characters = book.characters?.length
    ? book.characters
    : ["Protagonist", "Narrator", "Companion", "Rival", "Mentor"];

  const [personaModalOpen, setPersonaModalOpen] = useState(false);
  const [selectedPersona, setSelectedPersona] = useState<Persona | null>(null);
  const [selectedCharacter, setSelectedCharacter] = useState<number | null>(
    findCharacterIndex(characters, initialRewrite?.characterName)
  );
  const [selectedPill, setSelectedPill] = useState<number | null>(null);
  const [storyInput, setStoryInput] = useState<string | null>(
    initialRewrite?.storyInput ?? null
  );
  const [premiseText, setPremiseText] = useState(initialRewrite?.premise ?? "");
  const [activeRewrite, setActiveRewrite] = useState<RewriteData | null>(initialRewrite ?? null);

  const hasCharacter = selectedCharacter !== null || selectedPersona !== null;
  const isReady = hasCharacter && storyInput !== null;

  const coverSrc = book.coverImage || book.coverImageFallback;

  const clearRewrite = () => {
    setActiveRewrite(null);
    setPremiseText("");
    setSelectedCharacter(null);
    setSelectedPersona(null);
    setStoryInput(null);
    setSelectedPill(null);
    onClearRewrite?.();
  };

  return (
    <div className="flex flex-1 flex-col gap-6 max-md:pb-24">
      {/* Character Picker */}
      <CharacterPicker
        characters={characters}
        selectedIndex={selectedCharacter}
        onSelect={(i) => { setSelectedCharacter(i); setSelectedPersona(null); }}
        onAddPersona={() => setPersonaModalOpen(true)}
        persona={selectedPersona}
        color="purple"
      />

      {/* Premise section */}
      <div className="flex flex-1 flex-col gap-4">
        <div className="flex flex-col gap-1">
          <p className="font-serif text-base leading-[1.5] text-ink opacity-80">
            How will you rewrite this story?
          </p>
          <p className="font-serif text-sm leading-[1.5] text-ink opacity-60">
            Leave your mark.
          </p>
        </div>

        {/* Textarea card */}
        <div className="flex flex-1 flex-col justify-between rounded-[20px] border border-[rgba(62,39,51,0.12)] bg-white/60 p-5">
          {/* Cover card + textarea row (desktop: side-by-side, mobile: stacked) */}
          <div className="flex flex-1 flex-col gap-4">
            {/* Mini rewrite cover card */}
            {activeRewrite && coverSrc && (
              <div className="relative inline-block self-start">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={coverSrc}
                  alt={book.title}
                  className="h-[110px] w-[80px] rounded-sm border border-ink/8 object-cover shadow-sm"
                  style={{ backgroundColor: book.spineColor ?? "#1a1a2e" }}
                />
                <button
                  onClick={clearRewrite}
                  className="absolute -right-2 -top-2 flex size-6 cursor-pointer items-center justify-center rounded-full bg-ink text-pure-white shadow-sm transition-opacity hover:opacity-80"
                  aria-label="Clear rewrite"
                >
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M3 3L9 9M9 3L3 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </button>
              </div>
            )}

            <textarea
              value={premiseText}
              onChange={(e) => setPremiseText(e.target.value)}
              placeholder="Happy ending? Everyone's a robot?... Up to you."
              className="flex-1 resize-none bg-transparent font-serif text-base leading-[1.3] text-ink outline-none placeholder:text-ink/60"
              rows={4}
            />
          </div>

          <div className="flex flex-col gap-3 pt-4">
            <p className="font-serif text-sm leading-[1.5] text-ink opacity-60">
              Quick select:
            </p>
            <div
              className="relative"
              style={{ maskImage: "linear-gradient(to right, transparent, black 24px, black calc(100% - 24px), transparent)", WebkitMaskImage: "linear-gradient(to right, transparent, black 24px, black calc(100% - 24px), transparent)" }}
            >
              <div className="flex gap-1.5 flex-nowrap overflow-x-auto scrollbar-hide">
                {suggestions.map((label, i) => {
                  const isSelected = selectedPill === i;
                  return (
                    <button
                      key={i}
                      onClick={() => setSelectedPill(isSelected ? null : i)}
                      style={{ transition: "background-color 200ms ease-out, color 200ms ease-out" }}
                      className={`flex shrink-0 cursor-pointer items-center gap-2 whitespace-nowrap rounded-full pl-6 pr-2 py-2 font-serif text-sm leading-[20px] ${
                        isSelected
                          ? "bg-[#6b2e63] text-white"
                          : "bg-espresso/[0.06] text-espresso"
                      }`}
                    >
                      {label}
                      <span className={`inline-flex overflow-hidden transition-all duration-200 ease-out will-change-[transform,opacity,width] ${
                        isSelected ? "w-5 opacity-100 scale-100" : "w-0 opacity-0 scale-50"
                      }`}>
                        {closePillIcon}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Story Input */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <p className="font-serif text-base leading-[1.5] text-ink opacity-80">
            Story input
          </p>
          <p className="font-serif text-sm leading-[1.5] text-ink opacity-60">
            Select how to progress through the story.
          </p>
        </div>
        <div className="flex gap-1 max-lg:flex-col">
          <SelectionCard
            title="Text"
            subtitle="Type freely"
            selected={storyInput === "text"}
            onClick={() => setStoryInput("text")}
            checkPosition="bottom-right"
            color="purple"
          />
          <SelectionCard
            title="TapTale"
            subtitle="Three quick options"
            selected={storyInput === "taptale"}
            onClick={() => setStoryInput("taptale")}
            checkPosition="bottom-right"
            color="purple"
          />
          <SelectionCard
            title="CardTale"
            subtitle="Four rich categories"
            selected={storyInput === "cardtale"}
            onClick={() => setStoryInput("cardtale")}
            checkPosition="bottom-right"
            color="purple"
          />
        </div>
      </div>

      {/* Spacer pushes CTA to bottom */}
      <div className="flex-1 max-md:hidden" />

      {/* CTA — fixed at bottom on mobile */}
      <div className="max-md:fixed max-md:bottom-0 max-md:left-0 max-md:right-0 max-md:z-20 max-md:border-t max-md:border-[rgba(62,39,51,0.12)] max-md:bg-book-background max-md:px-4 max-md:pt-4 max-md:pb-4">
        <button
          disabled={!isReady}
          onClick={() => {
            if (!isReady || !onStartChat) return;
            const premise = premiseText.trim() || (selectedPill !== null ? suggestions[selectedPill] : undefined);
            const characterName = selectedPersona
              ? selectedPersona.name
              : characters[selectedCharacter!];
            const characterAvatar = selectedPersona?.avatar
              ?? `https://api.dicebear.com/9.x/adventurer/svg?seed=${encodeURIComponent(characterName)}&size=184`;
            onStartChat({
              bookId: book.id,
              characterName,
              characterAvatar,
              storyMode: "anything-goes",
              storyInput: storyInput as StoryInputMode,
              premise,
              messages: BOOK_CHAT_MESSAGES[book.id] ?? [],
            });
          }}
          className={`w-full rounded-[44px] px-5 py-4 font-serif text-base transition-opacity ${
            isReady
              ? "cursor-pointer bg-[#6b2e63] text-pure-white hover:opacity-90"
              : "cursor-not-allowed bg-[#6b2e63]/40 text-pure-white/60"
          }`}
        >
          AU this!
        </button>
      </div>
      <PersonaModal
        isOpen={personaModalOpen}
        onClose={() => setPersonaModalOpen(false)}
        onSelect={(p) => { setSelectedPersona(p); setSelectedCharacter(null); }}
      />
    </div>
  );
}
