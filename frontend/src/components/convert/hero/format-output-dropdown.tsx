"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Search, X } from "lucide-react";

interface FormatOutputDropdownProps {
  /** Available output extensions, e.g. ["mp3", "wav", "ogg"] */
  formats: string[];
  /** Currently selected output format */
  value: string;
  onChange: (fmt: string) => void;
  onClose: () => void;
}

/**
 * Grid-style format picker shown when the TO card is clicked.
 * Renders as an absolutely positioned dropdown (right-aligned) below the card.
 */
export function FormatOutputDropdown({
  formats,
  value,
  onChange,
  onClose,
}: FormatOutputDropdownProps) {
  const [search, setSearch] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setTimeout(() => searchRef.current?.focus(), 60);
  }, []);

  const filtered = search.trim()
    ? formats.filter((f) => f.toLowerCase().includes(search.toLowerCase()))
    : formats;

  return (
    <div
      className="
        absolute z-[200] top-full right-0 mt-2 w-64
        bg-popover border border-border rounded-xl shadow-2xl overflow-hidden

      "
    >
      {/* Search */}
      <div className="flex items-center gap-2 px-3 py-2.5 border-b border-border bg-muted/30">
        <Search className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
        <input
          ref={searchRef}
          type="text"
          placeholder="Search output format…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 bg-transparent text-xs outline-none text-foreground placeholder:text-muted-foreground"
        />
        <button type="button" onClick={search ? () => setSearch("") : onClose}>
          <X className="w-3 h-3 text-muted-foreground" />
        </button>
      </div>

      {/* Format grid */}
      <div className="p-2.5 max-h-52 overflow-y-auto">
        {filtered.length > 0 ? (
          <div className="grid grid-cols-4 gap-1">
            {filtered.map((fmt) => {
              const isSelected = fmt === value;
              return (
                <button
                  key={fmt}
                  type="button"
                  onClick={() => {
                    onChange(fmt);
                    onClose();
                  }}
                  className={`
                    relative flex items-center justify-center py-1.5 rounded-lg border
                    text-[10px] font-bold uppercase tracking-wide
                    transition-all duration-100
                    ${
                      isSelected
                        ? "border-red-500/70 bg-red-600/10 text-red-400"
                        : "border-border text-foreground hover:border-red-500/40 hover:bg-red-500/5 hover:text-red-400"
                    }
                  `}
                >
                  {isSelected && (
                    <Check className="absolute top-0.5 right-0.5 w-2.5 h-2.5 text-red-400" />
                  )}
                  {fmt.toUpperCase()}
                </button>
              );
            })}
          </div>
        ) : (
          <p className="text-center text-xs text-muted-foreground py-6">
            No formats found
          </p>
        )}
      </div>
    </div>
  );
}
