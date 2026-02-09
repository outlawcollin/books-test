"use client";

interface SelectionCardProps {
  title: string;
  subtitle: string;
  selected?: boolean;
  onClick?: () => void;
  className?: string;
  checkPosition?: "inline" | "bottom-right";
}

function CheckIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <path fillRule="evenodd" clipRule="evenodd" d="M16.0003 2.66675C8.63653 2.66675 2.66699 8.63628 2.66699 16.0001C2.66699 23.3639 8.63653 29.3334 16.0003 29.3334C23.3641 29.3334 29.3337 23.3639 29.3337 16.0001C29.3337 8.63628 23.3641 2.66675 16.0003 2.66675ZM21.0323 13.5111C21.4986 12.9412 21.4146 12.1011 20.8446 11.6348C20.2747 11.1685 19.4347 11.2525 18.9684 11.8225L13.9013 18.0155L12.2765 16.3906C11.7558 15.8699 10.9115 15.8699 10.3908 16.3906C9.87015 16.9113 9.87015 17.7556 10.3908 18.2763L13.0575 20.9429C13.3239 21.2093 13.6905 21.3506 14.0667 21.3318C14.443 21.313 14.7937 21.136 15.0323 20.8444L21.0323 13.5111Z" fill="currentColor" />
      <path d="M20.8446 11.6348C21.4146 12.1011 21.4986 12.9412 21.0323 13.5111L15.0323 20.8444C14.7937 21.136 14.443 21.313 14.0667 21.3318C13.6905 21.3506 13.3239 21.2093 13.0575 20.9429L10.3908 18.2763C9.87015 17.7556 9.87015 16.9113 10.3908 16.3906C10.9115 15.8699 11.7558 15.8699 12.2765 16.3906L13.9013 18.0155L18.9684 11.8225C19.4347 11.2525 20.2747 11.1685 20.8446 11.6348Z" fill="white" />
    </svg>
  );
}

export default function SelectionCard({
  title,
  subtitle,
  selected = false,
  onClick,
  className = "",
  checkPosition = "inline",
}: SelectionCardProps) {
  const isInline = checkPosition === "inline";

  return (
    <button
      onClick={onClick}
      className={`relative flex flex-1 cursor-pointer ${isInline ? "items-center gap-0.5" : "flex-col gap-0.5"} rounded-[20px] bg-white p-4 text-left font-serif transition-colors ${
        selected
          ? "border-[1.5px] border-dark-sage"
          : "border-[1.5px] border-[rgba(62,39,51,0.12)]"
      } ${className}`}
    >
      <div className="flex flex-1 flex-col gap-0.5">
        <p className="text-base leading-[1.5] text-ink opacity-80">{title}</p>
        <p className="text-sm leading-[1.5] text-ink opacity-60">{subtitle}</p>
      </div>
      {selected && isInline && (
        <span className="shrink-0 text-dark-sage">
          <CheckIcon />
        </span>
      )}
      {selected && !isInline && (
        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-dark-sage">
          <CheckIcon />
        </span>
      )}
    </button>
  );
}
