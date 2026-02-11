"use client";

import { useState } from "react";
import type { BookData, ChatSession, StoryInputMode } from "@/lib/types";
import { BOOK_CHAT_MESSAGES } from "@/lib/mock-chat";
import { getCharacterAvatar } from "@/lib/character-avatars";
import CharacterPicker from "./CharacterPicker";
import SelectionCard from "./SelectionCard";
import PersonaModal, { type Persona } from "./PersonaModal";

interface PlayBookTabProps {
  book: BookData;
  onStartChat?: (session: ChatSession) => void;
}

export default function PlayBookTab({ book, onStartChat }: PlayBookTabProps) {
  const [personaModalOpen, setPersonaModalOpen] = useState(false);
  const [selectedPersona, setSelectedPersona] = useState<Persona | null>(null);
  const characters = book.characters?.length
    ? book.characters
    : ["Protagonist", "Narrator", "Companion", "Rival", "Mentor"];

  const [selectedCharacter, setSelectedCharacter] = useState<number | null>(null);
  const [storyMode, setStoryMode] = useState<string | null>(null);
  const [storyInput, setStoryInput] = useState<string | null>(null);

  const hasCharacter = selectedCharacter !== null || selectedPersona !== null;
  const isReady = hasCharacter && storyMode !== null && storyInput !== null;

  return (
    <div className="flex flex-1 flex-col gap-6 max-md:pb-24">
      {/* Character Picker */}
      <CharacterPicker
        characters={characters}
        selectedIndex={selectedCharacter}
        onSelect={(i) => { setSelectedCharacter(i); setSelectedPersona(null); }}
        onAddPersona={() => setPersonaModalOpen(true)}
        persona={selectedPersona}
      />

      {/* Story Mode */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <p className="font-serif text-base leading-[1.5] text-ink opacity-80">
            Story mode
          </p>
          <p className="font-serif text-sm leading-[1.5] text-ink opacity-60">
            Select the storytelling style.
          </p>
        </div>
        <div className="flex gap-1 max-lg:flex-col">
          <SelectionCard
            title="Book arc"
            subtitle="Follow the story's narrative"
            selected={storyMode === "book-arc"}
            onClick={() => setStoryMode("book-arc")}
          />
          <SelectionCard
            title="Anything goes"
            subtitle="Free-form roleplay"
            selected={storyMode === "anything-goes"}
            onClick={() => setStoryMode("anything-goes")}
          />
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
          />
          <SelectionCard
            title="TapTale"
            subtitle="Three quick options"
            selected={storyInput === "taptale"}
            onClick={() => setStoryInput("taptale")}
            checkPosition="bottom-right"
          />
          <SelectionCard
            title="CardTale"
            subtitle="Four rich categories"
            selected={storyInput === "cardtale"}
            onClick={() => setStoryInput("cardtale")}
            checkPosition="bottom-right"
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
            const characterName = selectedPersona
              ? selectedPersona.name
              : characters[selectedCharacter!];
            const characterAvatar = selectedPersona?.avatar
              ?? getCharacterAvatar(characterName);
            onStartChat({
              bookId: book.id,
              characterName,
              characterAvatar,
              storyMode: storyMode!,
              storyInput: storyInput as StoryInputMode,
              messages: BOOK_CHAT_MESSAGES[book.id] ?? [],
            });
          }}
          className={`w-full rounded-[44px] px-5 py-4 font-serif text-base transition-opacity ${
            isReady
              ? "cursor-pointer bg-dark-sage text-pure-white hover:opacity-90"
              : "cursor-not-allowed bg-dark-sage/40 text-pure-white/60"
          }`}
        >
          Dive in!
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
