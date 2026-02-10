"use client";

interface SuggestionPillsProps {
  suggestions: string[];
  onSelect?: (suggestion: string) => void;
}

export default function SuggestionPills({ suggestions, onSelect }: SuggestionPillsProps) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {suggestions.map((s) => (
        <button
          key={s}
          onClick={() => onSelect?.(s)}
          className="cursor-pointer rounded-full bg-[#DCC5B0] px-6 py-2 font-serif text-sm leading-[20px] text-espresso transition-opacity hover:opacity-80"
        >
          {s}
        </button>
      ))}
    </div>
  );
}
