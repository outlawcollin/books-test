"use client";

import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";

/* ── Types ─────────────────────────────────────────────────────────────────── */

export interface Persona {
  id: string;
  name: string;
  avatar: string;
}

/* ── Persona data ──────────────────────────────────────────────────────────── */

const PERSONAS: Persona[] = [
  { id: "daera", name: "Daera", avatar: "/personas/daera.png" },
  { id: "pam", name: "Pam", avatar: "/personas/pam.png" },
  { id: "toru", name: "Toru", avatar: "/personas/toru.png" },
];

/* ── Icons ─────────────────────────────────────────────────────────────────── */

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M15 9L9 15M15 15L9 9M21.25 12C21.25 17.1086 17.1086 21.25 12 21.25C6.89137 21.25 2.75 17.1086 2.75 12C2.75 6.89137 6.89137 2.75 12 2.75C17.1086 2.75 21.25 6.89137 21.25 12Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none">
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
      <path d="M20 20L16 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

/* ── Component ─────────────────────────────────────────────────────────────── */

interface PersonaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect?: (persona: Persona) => void;
}

export default function PersonaModal({
  isOpen,
  onClose,
  onSelect,
}: PersonaModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  const filteredPersonas = useMemo(() => {
    if (!searchQuery.trim()) return PERSONAS;
    const q = searchQuery.toLowerCase();
    return PERSONAS.filter((p) => p.name.toLowerCase().includes(q));
  }, [searchQuery]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    },
    [onClose]
  );

  const handleBackdropClick = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (event.target === event.currentTarget) onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, handleKeyDown]);

  useEffect(() => {
    if (isOpen && modalRef.current) {
      modalRef.current.focus();
    }
  }, [isOpen]);

  const handleClose = () => {
    setSearchQuery("");
    setHoveredId(null);
    onClose();
  };

  const handleSelect = (persona: Persona) => {
    onSelect?.(persona);
    handleClose();
  };

  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-[12px]"
      style={{ backgroundColor: "rgba(244, 240, 233, 0.72)" }}
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="persona-modal-title"
    >
      <div
        ref={modalRef}
        className="relative mx-4 flex w-full max-w-[460px] flex-col overflow-hidden rounded-[44px] border border-[rgba(62,39,51,0.12)] bg-book-background p-5 outline-none"
        style={{
          maxHeight: "80vh",
          boxShadow: "0px 4px 70px rgba(0, 0, 0, 0.45)",
        }}
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2
            id="persona-modal-title"
            className="font-serif text-[20px] leading-[1.3] text-ink"
          >
            Choose a persona
          </h2>
          <button
            onClick={handleClose}
            className="flex size-[38px] cursor-pointer items-center justify-center rounded-full border border-[rgba(101,46,31,0.12)] text-espresso transition-colors hover:bg-cta/30"
            aria-label="Close modal"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Search bar */}
        <div className="mt-5 flex items-center gap-2 rounded-[12px] bg-espresso/[0.06] px-3.5 py-3">
          <SearchIcon className="shrink-0 text-espresso" />
          <input
            type="text"
            placeholder="Search Personas"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent font-serif text-sm leading-[1.3] text-espresso outline-none placeholder:text-espresso/70"
          />
        </div>

        {/* Persona list */}
        <div className="relative mt-3 min-h-0 flex-1 overflow-y-auto">
          <div className="flex flex-col">
            {filteredPersonas.length === 0 ? (
              <div className="flex items-center justify-center py-12">
                <p className="font-serif text-sm text-espresso/50">
                  No results found.
                </p>
              </div>
            ) : (
              filteredPersonas.map((persona) => {
                const isHovered = persona.id === hoveredId;

                return (
                  <button
                    key={persona.id}
                    onClick={() => handleSelect(persona)}
                    onMouseEnter={() => setHoveredId(persona.id)}
                    onMouseLeave={() => setHoveredId(null)}
                    className={`flex w-full cursor-pointer items-center gap-3 rounded-[12px] p-3 transition-colors duration-150 ${
                      isHovered ? "bg-cta/15" : "bg-transparent"
                    }`}
                  >
                    {/* Avatar */}
                    <div className="relative size-[52px] shrink-0 overflow-hidden rounded-full bg-espresso/10">
                      <Image
                        src={persona.avatar}
                        alt={persona.name}
                        fill
                        className="object-cover"
                        sizes="52px"
                      />
                    </div>

                    {/* Name */}
                    <span className="flex-1 text-left font-serif text-[16px] leading-[1.2] text-espresso">
                      {persona.name}
                    </span>

                    {/* Select indicator */}
                    {isHovered && (
                      <span className="shrink-0 rounded-full bg-cta/30 px-4 py-1.5 font-serif text-xs text-espresso">
                        Select
                      </span>
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
