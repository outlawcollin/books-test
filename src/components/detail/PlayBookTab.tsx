"use client";

import { useState } from "react";
import type { BookData } from "@/lib/types";
import CharacterPicker from "./CharacterPicker";
import SelectionCard from "./SelectionCard";

interface PlayBookTabProps {
  book: BookData;
  onAddPersona?: () => void;
}

export default function PlayBookTab({ book, onAddPersona }: PlayBookTabProps) {
  const characters = book.characters?.length
    ? book.characters
    : ["Protagonist", "Narrator", "Companion", "Rival", "Mentor"];

  const [selectedCharacter, setSelectedCharacter] = useState<number | null>(0);
  const [storyMode, setStoryMode] = useState<string>("book-arc");
  const [storyInput, setStoryInput] = useState<string>("text");

  return (
    <div className="flex flex-1 flex-col gap-6 max-md:pb-24">
      {/* Character Picker */}
      <CharacterPicker
        characters={characters}
        selectedIndex={selectedCharacter}
        onSelect={setSelectedCharacter}
        onAddPersona={onAddPersona}
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
        <div className="flex gap-1 max-md:flex-col">
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
        <div className="flex gap-1 max-md:flex-col">
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
      <div className="max-md:fixed max-md:bottom-0 max-md:left-0 max-md:right-0 max-md:z-20 max-md:border-t max-md:border-[rgba(62,39,51,0.12)] max-md:bg-book-background max-md:p-4">
        <button className="w-full cursor-pointer rounded-[44px] bg-dark-sage px-5 py-4 font-serif text-base text-pure-white transition-opacity hover:opacity-90">
          Dive in!
        </button>
      </div>
    </div>
  );
}
