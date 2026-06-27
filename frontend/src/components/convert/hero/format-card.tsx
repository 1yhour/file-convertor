"use client";

import { ChevronDown } from "lucide-react";

interface FormatCardProps {
  /** E.g. "WAV", "PDF", "MP3" */
  label: string;
  /** Tailwind text color class */
  colorClass?: string;
  side: "from" | "to";
  /** True when the user has explicitly selected this format (stops animation) */
  isLocked?: boolean;
  onClick?: () => void;
}

/** The dark rounded card that displays a format (FROM or TO side). */
export function FormatCard({
  label,
  colorClass = "text-zinc-300",
  side,
  isLocked = false,
  onClick,
}: FormatCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={side === "from" ? "Click to change source format" : "Click to change target format"}
      className={`
        w-28 h-28 rounded-2xl flex flex-col items-center justify-center gap-2
        border shadow-xl cursor-pointer group
        transition-all duration-200
        ${
          side === "from"
            ? "bg-zinc-800/70 border-zinc-700/50 hover:border-zinc-500/60 hover:bg-zinc-800"
            : "bg-zinc-900/80 border-zinc-700/30 ring-1 ring-red-500/10 hover:border-red-700/40 hover:ring-red-500/20"
        }
        ${isLocked ? "ring-2 ring-red-500/40" : ""}
      `}
    >
      {/* File icon */}
      <svg
        width="32"
        height="38"
        viewBox="0 0 36 44"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="opacity-90"
      >
        <path
          d="M4 0H22L36 14V40C36 42.2 34.2 44 32 44H4C1.8 44 0 42.2 0 40V4C0 1.8 1.8 0 4 0Z"
          fill="currentColor"
          className={`${colorClass} opacity-20`}
        />
        <path
          d="M22 0L36 14H26C23.8 14 22 12.2 22 10V0Z"
          fill="currentColor"
          className={`${colorClass} opacity-35`}
        />
        <rect
          x="7" y="22" width="22" height="2" rx="1"
          fill="currentColor"
          className={`${colorClass} opacity-45`}
        />
        <rect
          x="7" y="28" width="15" height="2" rx="1"
          fill="currentColor"
          className={`${colorClass} opacity-45`}
        />
      </svg>

      {/* Label */}
      <p className={`text-xs font-extrabold tracking-widest ${colorClass}`}>
        {label}
      </p>

      {/* Chevron — indicates clickability */}
      <ChevronDown
        className={`
          w-3.5 h-3.5 opacity-30 group-hover:opacity-70
          transition-opacity duration-150
          ${colorClass}
        `}
      />
    </button>
  );
}
