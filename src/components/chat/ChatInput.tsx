"use client";

import { useState, useRef, useCallback } from "react";

function ArrowTopIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M5.75 9.74997L11.2929 4.20708C11.6834 3.81655 12.3166 3.81655 12.7071 4.20708L18.25 9.74997M12 4.74997V20.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

interface ChatInputProps {
  characterAvatar?: string;
  onSend?: (text: string) => void;
}

export default function ChatInput({ characterAvatar, onSend }: ChatInputProps) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const autoResize = useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, []);

  const handleSubmit = () => {
    const trimmed = value.trim();
    if (!trimmed) return;
    onSend?.(trimmed);
    setValue("");
    // Reset height after clearing
    requestAnimationFrame(() => {
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    });
  };

  return (
    <div className="flex flex-col gap-3 items-center">
      <div className="flex w-full items-end justify-center gap-1.5">
        <div className="flex flex-1 items-start gap-2 overflow-hidden rounded-[22px] border border-ink py-1.5 pl-1.5 pr-3">
          {characterAvatar ? (
            <img
              src={characterAvatar}
              alt=""
              className="size-8 shrink-0 rounded-full border border-[rgba(255,255,255,0.24)] object-cover shadow-[0px_4px_32px_rgba(62,39,51,0.04)]"
            />
          ) : (
            <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-ink">
              <span className="font-sans text-sm text-white">Y</span>
            </div>
          )}
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => { setValue(e.target.value); autoResize(); }}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSubmit(); } }}
            placeholder="Say or do something..."
            rows={1}
            className="max-h-32 flex-1 resize-none bg-transparent py-[6px] font-serif text-sm leading-[1.4] text-ink outline-none placeholder:text-ink placeholder:opacity-70"
          />
        </div>
        <button
          onClick={handleSubmit}
          className={`flex size-[44px] shrink-0 cursor-pointer items-center justify-center rounded-full border border-ink transition-colors hover:opacity-90 ${
            value.trim() ? "bg-ink text-white" : "text-ink"
          }`}
        >
          <ArrowTopIcon />
        </button>
      </div>
      <p className="font-serif text-[10px] leading-normal text-ink opacity-60 text-center">
        This is A.I. and not a real person. Treat everything it says as fiction.
      </p>
    </div>
  );
}
