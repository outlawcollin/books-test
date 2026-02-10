"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import type { ChatSession, ChatMessage, BookData } from "@/lib/types";
import ChatBubble from "./ChatBubble";
import ChatInput from "./ChatInput";
import EndBookScreen from "./EndBookScreen";

function ShareIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M9.99999 3.125V12.5M9.99999 3.125L13.75 6.875M9.99999 3.125L6.25 6.875M16.875 10.625V16.0417C16.875 16.5019 16.5019 16.875 16.0417 16.875H3.95833C3.4981 16.875 3.125 16.5019 3.125 16.0417V10.625" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

interface ChatPanelProps {
  session: ChatSession;
  book: BookData;
  onClose: (action: "finish" | "rewrite", premise?: string) => void;
}

export default function ChatPanel({ session, book, onClose }: ChatPanelProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<ChatMessage[]>(session.messages);
  const [showEndScreen, setShowEndScreen] = useState(false);

  const handleSend = useCallback((text: string) => {
    const msg: ChatMessage = {
      id: `player-${Date.now()}`,
      type: "player",
      text,
    };
    setMessages((prev) => [...prev, msg]);
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages.length]);

  if (showEndScreen) {
    return (
      <EndBookScreen
        book={book}
        onKeepPlaying={() => setShowEndScreen(false)}
        onFinish={() => onClose("finish")}
        onSelectRewrite={(premise) => onClose("rewrite", premise)}
      />
    );
  }

  return (
    <div className="mx-auto flex flex-1 flex-col h-full max-w-lg">
      {/* Header */}
      <div className="flex flex-col gap-6 px-4 pt-6 md:px-6 md:pt-6">
        <div className="flex items-center gap-3">
          <div className="flex flex-1 items-center gap-2">
            {session.characterAvatar ? (
              <img
                src={session.characterAvatar}
                alt={session.characterName}
                className="size-5 rounded-full border border-[rgba(255,255,255,0.24)] object-cover shadow-[0px_4px_32px_rgba(62,39,51,0.04)] max-lg:size-9"
              />
            ) : (
              <div className="flex size-5 items-center justify-center rounded-full bg-ink max-lg:size-9">
                <span className="font-sans text-xs text-white max-lg:text-sm">
                  {session.characterName[0]}
                </span>
              </div>
            )}
            <p className="font-serif text-sm leading-[1.5] text-ink opacity-80 max-lg:hidden">
              Playing as
            </p>
            <p className="font-serif text-sm leading-[1.5] text-ink opacity-80">
              {session.characterName}
            </p>
          </div>
          <div className="flex items-center gap-1.5">
            <button className="flex size-9 cursor-pointer items-center justify-center rounded-full border border-[rgba(62,39,51,0.12)] text-ink transition-colors hover:bg-cta/30">
              <ShareIcon />
            </button>
            <button
              onClick={() => setShowEndScreen(true)}
              className="cursor-pointer rounded-full border border-[rgba(62,39,51,0.12)] px-4 py-2 font-serif text-sm leading-[1.4] text-ink transition-colors hover:bg-cta/30"
            >
              Close book
            </button>
          </div>
        </div>
        <div className="h-px w-full bg-[rgba(62,39,51,0.12)]" />
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex flex-1 flex-col gap-6 overflow-y-auto px-4 py-6 md:px-6 max-md:pb-24">
        <div className="mx-auto flex w-full max-w-[500px] flex-col gap-6">
          {messages.map((msg) => (
            <ChatBubble
              key={msg.id}
              message={msg}
              storyInput={session.storyInput}
              playerAvatar={session.characterAvatar}
            />
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="px-4 py-4 md:px-6 max-md:fixed max-md:bottom-0 max-md:left-0 max-md:right-0 max-md:z-20 max-md:border-t max-md:border-[rgba(62,39,51,0.12)] max-md:bg-book-background">
        <div className="mx-auto max-w-[500px]">
          <ChatInput characterAvatar={session.characterAvatar} onSend={handleSend} />
        </div>
      </div>
    </div>
  );
}
