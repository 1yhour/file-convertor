"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronRight, Search, X } from "lucide-react";
import {
  MIME_CATEGORIES,
  SUPPORTED_FORMATS,
  mimeToLabel,
  type MimeCategory,
} from "@/lib/format-config";

interface FormatCardMimeDropdownProps {
  /** Called when the user picks a MIME type */
  onSelect: (mime: string) => void;
  /** Called to close the dropdown without selection */
  onClose: () => void;
}

/**
 * Two-panel MIME picker shown when the FROM card is clicked.
 * Renders as an absolutely positioned dropdown below the card.
 */
export function FormatCardMimeDropdown({
  onSelect,
  onClose,
}: FormatCardMimeDropdownProps) {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<MimeCategory>(
    MIME_CATEGORIES[0]
  );
  const searchRef = useRef<HTMLInputElement>(null);

  // Auto-focus search
  useEffect(() => {
    setTimeout(() => searchRef.current?.focus(), 60);
  }, []);

  // Filter categories by search query
  const filteredCategories = useMemo(() => {
    if (!search.trim()) return MIME_CATEGORIES;
    const q = search.toLowerCase();
    return MIME_CATEGORIES.map((cat) => ({
      ...cat,
      mimes: cat.mimes.filter(
        (m) =>
          m.toLowerCase().includes(q) ||
          mimeToLabel(m).toLowerCase().includes(q)
      ),
    })).filter((cat) => cat.mimes.length > 0);
  }, [search]);

  // Keep active category valid after filtering
  useEffect(() => {
    if (
      filteredCategories.length > 0 &&
      !filteredCategories.find((c) => c.label === activeCategory.label)
    ) {
      setActiveCategory(filteredCategories[0]);
    }
  }, [filteredCategories, activeCategory.label]);

  const currentMimes =
    filteredCategories.find((c) => c.label === activeCategory.label)?.mimes ??
    [];

  return (
    <div
      className="
        absolute z-[200] top-full left-0 mt-2
        bg-popover border border-border rounded-xl shadow-2xl overflow-hidden
        flex flex-col

      "
      style={{ width: 420, maxHeight: 360 }}
    >
      {/* Search bar */}
      <div className="flex items-center gap-2 px-3 py-2.5 border-b border-border bg-muted/30">
        <Search className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
        <input
          ref={searchRef}
          type="text"
          placeholder="Search format…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 bg-transparent text-xs outline-none text-foreground placeholder:text-muted-foreground"
        />
        {search ? (
          <button type="button" onClick={() => setSearch("")}>
            <X className="w-3 h-3 text-muted-foreground" />
          </button>
        ) : (
          <button type="button" onClick={onClose}>
            <X className="w-3 h-3 text-muted-foreground" />
          </button>
        )}
      </div>

      {/* Two-column body */}
      <div className="flex flex-1 overflow-hidden" style={{ minHeight: 0 }}>
        {/* Category sidebar */}
        <aside className="w-36 shrink-0 border-r border-border overflow-y-auto bg-muted/10">
          {filteredCategories.map((cat) => (
            <button
              key={cat.label}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`
                w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-left
                transition-colors duration-100
                ${
                  activeCategory.label === cat.label
                    ? "bg-primary/10 text-primary border-r-2 border-primary"
                    : "text-muted-foreground hover:bg-accent/40 hover:text-foreground"
                }
              `}
            >
              <span className="text-sm">{cat.icon}</span>
              <span className="truncate">{cat.label}</span>
              <ChevronRight className="w-3 h-3 ml-auto opacity-40 shrink-0" />
            </button>
          ))}
          {filteredCategories.length === 0 && (
            <p className="px-3 py-4 text-[11px] text-muted-foreground text-center">
              No results
            </p>
          )}
        </aside>

        {/* Format grid */}
        <div className="flex-1 overflow-y-auto p-2.5">
          {currentMimes.length > 0 ? (
            <div className="grid grid-cols-3 gap-1.5">
              {currentMimes.map((mime) => {
                const label = mimeToLabel(mime);
                const outCount = SUPPORTED_FORMATS[mime]?.length ?? 0;
                return (
                  <button
                    key={mime}
                    type="button"
                    title={mime}
                    onClick={() => onSelect(mime)}
                    className="
                      flex flex-col items-center gap-0.5 rounded-lg border border-border
                      px-2 py-2.5 text-center
                      text-[11px] font-bold tracking-wide text-foreground
                      hover:border-red-500/50 hover:bg-red-500/5 hover:text-red-400
                      transition-all duration-100
                    "
                  >
                    <span>{label}</span>
                    <span className="text-[9px] font-normal text-muted-foreground">
                      → {outCount} format{outCount !== 1 ? "s" : ""}
                    </span>
                  </button>
                );
              })}
            </div>
          ) : (
            <p className="text-center text-xs text-muted-foreground py-8">
              No formats found
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
