"use client";

interface CharacterPickerProps {
  characters: string[];
  selectedIndex: number | null;
  onSelect: (index: number) => void;
  onAddPersona?: () => void;
}

function CheckBadge() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <path fillRule="evenodd" clipRule="evenodd" d="M16.0003 2.66675C8.63653 2.66675 2.66699 8.63628 2.66699 16.0001C2.66699 23.3639 8.63653 29.3334 16.0003 29.3334C23.3641 29.3334 29.3337 23.3639 29.3337 16.0001C29.3337 8.63628 23.3641 2.66675 16.0003 2.66675ZM21.0323 13.5111C21.4986 12.9412 21.4146 12.1011 20.8446 11.6348C20.2747 11.1685 19.4347 11.2525 18.9684 11.8225L13.9013 18.0155L12.2765 16.3906C11.7558 15.8699 10.9115 15.8699 10.3908 16.3906C9.87015 16.9113 9.87015 17.7556 10.3908 18.2763L13.0575 20.9429C13.3239 21.2093 13.6905 21.3506 14.0667 21.3318C14.443 21.313 14.7937 21.136 15.0323 20.8444L21.0323 13.5111Z" fill="currentColor" />
      <path d="M20.8446 11.6348C21.4146 12.1011 21.4986 12.9412 21.0323 13.5111L15.0323 20.8444C14.7937 21.136 14.443 21.313 14.0667 21.3318C13.6905 21.3506 13.3239 21.2093 13.0575 20.9429L10.3908 18.2763C9.87015 17.7556 9.87015 16.9113 10.3908 16.3906C10.9115 15.8699 11.7558 15.8699 12.2765 16.3906L13.9013 18.0155L18.9684 11.8225C19.4347 11.2525 20.2747 11.1685 20.8446 11.6348Z" fill="white" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 20 20" fill="none">
      <path d="M9.99967 3.33325V9.99992M9.99967 9.99992V16.6666M9.99967 9.99992H3.33301M9.99967 9.99992H16.6663" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export default function CharacterPicker({
  characters,
  selectedIndex,
  onSelect,
  onAddPersona,
}: CharacterPickerProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <p className="font-serif text-base leading-[1.5] text-ink opacity-80">
          Who do you want to play as?
        </p>
        <p className="font-serif text-sm leading-[1.5] text-ink opacity-60">
          Pick a book persona or your own.
        </p>
      </div>

      <div className="relative">
        <div className="flex gap-4 overflow-x-auto">
          {/* Persona add button */}
          <div className="flex shrink-0 flex-col items-center gap-1.5">
            <button
              onClick={onAddPersona}
              className="flex size-[92px] cursor-pointer items-center justify-center rounded-full border-[1.5px] border-dashed border-[rgba(62,39,51,0.42)] text-ink"
            >
              <PlusIcon />
            </button>
            <span className="font-serif text-sm leading-[1.5] text-ink opacity-80">
              Persona
            </span>
          </div>

          {/* Divider */}
          <div className="my-auto h-[92px] w-px shrink-0 bg-[rgba(62,39,51,0.15)]" />

          {/* Character circles */}
          {characters.map((name, i) => {
            const isSelected = selectedIndex === i;
            return (
              <button
                key={i}
                onClick={() => onSelect(i)}
                className="flex shrink-0 cursor-pointer flex-col items-center gap-1.5"
              >
                <div className="relative">
                  <img
                    src={`https://api.dicebear.com/9.x/adventurer/svg?seed=${encodeURIComponent(name)}&size=184`}
                    alt={name}
                    className={`size-[92px] rounded-full bg-ink object-cover shadow-[0px_4px_32px_rgba(62,39,51,0.04)] ${
                      isSelected
                        ? "border-[1.5px] border-dark-sage"
                        : "border-[1.5px] border-[rgba(255,255,255,0.24)]"
                    }`}
                  />
                  {isSelected && (
                    <span className="absolute -right-px -top-px text-dark-sage">
                      <CheckBadge />
                    </span>
                  )}
                </div>
                <span className="font-serif text-sm leading-[1.5] text-ink opacity-80">
                  {name}
                </span>
              </button>
            );
          })}
        </div>

        {/* Right fade gradient */}
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-book-background to-transparent" />
      </div>
    </div>
  );
}
