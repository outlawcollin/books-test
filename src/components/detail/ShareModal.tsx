"use client";

import { useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
}

function CloseIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M15 9L9 15M15 15L9 9M21.25 12C21.25 17.1086 17.1086 21.25 12 21.25C6.89137 21.25 2.75 17.1086 2.75 12C2.75 6.89137 6.89137 2.75 12 2.75C17.1086 2.75 21.25 6.89137 21.25 12Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function LinkIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M8.33333 10.8333C8.69321 11.3118 9.14778 11.7077 9.66855 11.9987C10.1893 12.2897 10.7642 12.4693 11.3563 12.5259C11.9483 12.5824 12.5454 12.5147 13.1088 12.3274C13.6721 12.1401 14.1892 11.8373 14.6267 11.4383L17.1267 9.10499C17.9106 8.24999 18.3369 7.13166 18.3199 5.97666C18.303 4.82166 17.8441 3.71666 17.0358 2.88499C16.2275 2.05333 15.1367 1.57666 13.9817 1.55499C12.8266 1.53333 11.7134 1.96833 10.87 2.75999L9.61667 3.93833" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M11.6667 9.16667C11.3068 8.68817 10.8522 8.29233 10.3315 8.00133C9.81071 7.71033 9.23581 7.53067 8.64375 7.47413C8.05169 7.41758 7.45461 7.4853 6.89125 7.67261C6.32789 7.85993 5.81081 8.16271 5.37333 8.56167L2.87333 10.895C2.08944 11.75 1.66312 12.8683 1.68008 14.0233C1.69704 15.1783 2.15589 16.2833 2.96422 17.115C3.77255 17.9467 4.86333 18.4233 6.01833 18.445C7.17333 18.4667 8.28661 18.0317 9.13 17.24L10.375 16.0617" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function ShareIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M9.99999 3.125V12.5M9.99999 3.125L13.75 6.875M9.99999 3.125L6.25 6.875M16.875 10.625V16.0417C16.875 16.5019 16.5019 16.875 16.0417 16.875H3.95833C3.4981 16.875 3.125 16.5019 3.125 16.0417V10.625" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export default function ShareModal({ isOpen, onClose, title = "Share" }: ShareModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = "hidden";
    modalRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [isOpen, handleClose]);

  if (!isOpen) return null;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
    } catch {
      // fallback — clipboard API may fail in some contexts
    }
    handleClose();
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title, url: window.location.href });
      } catch {
        // user cancelled
      }
    }
    handleClose();
  };

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: "rgba(244, 240, 233, 0.72)" }}
      onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
    >
      <div
        ref={modalRef}
        tabIndex={-1}
        className="relative flex w-full max-w-[340px] flex-col gap-4 rounded-[28px] border border-[rgba(62,39,51,0.12)] bg-book-background p-6 shadow-[0px_4px_32px_rgba(62,39,51,0.04)] outline-none backdrop-blur-[12px]"
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <p className="font-serif text-base leading-[1.5] text-ink opacity-80">{title}</p>
          <button
            onClick={handleClose}
            className="flex size-[38px] cursor-pointer items-center justify-center rounded-full border border-[rgba(101,46,31,0.12)] text-espresso transition-colors hover:bg-cta/30"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Share options */}
        <div className="flex flex-col gap-2">
          <button
            onClick={handleCopyLink}
            className="flex cursor-pointer items-center gap-3 rounded-[16px] px-4 py-3 font-serif text-sm text-ink transition-colors hover:bg-cta/15"
          >
            <span className="flex size-10 items-center justify-center rounded-full bg-espresso/[0.06]">
              <LinkIcon />
            </span>
            Copy link
          </button>
          {typeof navigator !== "undefined" && "share" in navigator && (
            <button
              onClick={handleNativeShare}
              className="flex cursor-pointer items-center gap-3 rounded-[16px] px-4 py-3 font-serif text-sm text-ink transition-colors hover:bg-cta/15"
            >
              <span className="flex size-10 items-center justify-center rounded-full bg-espresso/[0.06]">
                <ShareIcon />
              </span>
              Share via...
            </button>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
}
