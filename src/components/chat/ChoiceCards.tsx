"use client";

interface ChoiceCardsProps {
  choices: { category: string; text: string }[];
  onSelect?: (choice: { category: string; text: string }) => void;
}

export default function ChoiceCards({ choices, onSelect }: ChoiceCardsProps) {
  return (
    <div className="relative">
      <div className="flex gap-1 overflow-x-auto">
        {choices.map((c) => (
          <button
            key={c.category}
            onClick={() => onSelect?.(c)}
            className="flex w-[122px] shrink-0 cursor-pointer flex-col gap-1.5 rounded-[20px] bg-[#DCC5B0] p-3 text-left shadow-[0px_4px_32px_rgba(62,39,51,0.04)] transition-opacity hover:opacity-90"
            style={{ height: 173 }}
          >
            <span className="self-start rounded-[4.5px] bg-espresso px-1.5 py-1 font-serif text-xs leading-none text-pure-white">
              {c.category}
            </span>
            <p className="font-serif text-sm leading-[1.5] text-espresso">
              {c.text}
            </p>
          </button>
        ))}
      </div>
      {/* Right fade */}
      <div className="pointer-events-none absolute right-0 top-0 h-[173px] w-[132px] bg-gradient-to-l from-book-background to-transparent" />
    </div>
  );
}
