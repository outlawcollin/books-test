"use client";

import type { ChatMessage } from "@/lib/types";
import { getCharacterAvatar } from "@/lib/character-avatars";
import SuggestionPills from "./SuggestionPills";
import ChoiceCards from "./ChoiceCards";

interface ChatBubbleProps {
  message: ChatMessage;
  storyInput: "text" | "taptale" | "cardtale";
  playerAvatar?: string;
}

export default function ChatBubble({ message, storyInput, playerAvatar }: ChatBubbleProps) {
  if (message.type === "narrator") {
    return (
      <div className="px-[42px] py-3">
        <p className="text-center font-serif text-sm leading-normal text-ink">
          {message.text}
        </p>
      </div>
    );
  }

  if (message.type === "player") {
    return (
      <div className="flex items-start justify-end gap-1.5 max-lg:pl-[50px]">
        <div className="flex max-w-[400px] items-start gap-1.5">
          <div className="overflow-hidden rounded-tl-[20px] rounded-tr-[4px] rounded-bl-[20px] rounded-br-[20px] border border-[rgba(62,39,51,0.12)] bg-white px-4 py-3">
            <p className="font-serif text-sm leading-[1.4] text-[#131313]">
              {message.text}
            </p>
          </div>
          {playerAvatar ? (
            <img
              src={playerAvatar}
              alt="You"
              className="size-8 shrink-0 rounded-full border border-[rgba(255,255,255,0.24)] object-cover shadow-[0px_4px_32px_rgba(62,39,51,0.04)]"
            />
          ) : (
            <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-ink">
              <span className="font-sans text-sm text-white">Y</span>
            </div>
          )}
        </div>
      </div>
    );
  }

  // NPC
  const npcAvatar = message.characterName
    ? getCharacterAvatar(message.characterName)
    : undefined;

  return (
    <div className="flex items-start gap-1.5 max-lg:pr-[50px]">
      <div className="flex max-w-[400px] items-start gap-1.5">
        <div className="shrink-0 pt-1">
          <img
            src={npcAvatar}
            alt={message.characterName ?? "NPC"}
            className="size-8 rounded-full border border-[rgba(255,255,255,0.24)] object-cover shadow-[0px_4px_32px_rgba(62,39,51,0.04)]"
          />
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-1.5">
          {message.characterName && (
            <p className="font-serif text-[10px] leading-normal text-ink">
              {message.characterName}
            </p>
          )}
          <div className="rounded-tl-[4px] rounded-tr-[20px] rounded-bl-[20px] rounded-br-[20px] border border-[rgba(62,39,51,0.12)] px-4 py-3">
            <p className="font-serif text-sm leading-[1.4] text-ink">
              {message.text}
            </p>
          </div>
          {storyInput === "taptale" && message.suggestions && (
            <SuggestionPills suggestions={message.suggestions} />
          )}
          {storyInput === "cardtale" && message.choices && (
            <ChoiceCards choices={message.choices} />
          )}
        </div>
      </div>
    </div>
  );
}
