"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, Search, X } from "lucide-react";

interface OutputFormatSelectorProps {
  /** Available output format extensions, e.g. ["mp3", "wav", "ogg"] */
  formats: string[];
  value: string;
  onChange: (fmt: string) => void;
  disabled?: boolean;
}

export function OutputFormatSelector({
  formats,
  value,
  onChange,
  disabled = false,
}: OutputFormatSelectorProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const filtered = search.trim()
    ? formats.filter((f) => f.toLowerCase().includes(search.toLowerCase()))
    : formats;

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Focus search on open
  useEffect(() => {
    if (open) {
      setSearch("");
      setTimeout(() => searchRef.current?.focus(), 60);
    }
  }, [open]);

  return (
    <div ref={containerRef} className="relative">
      {/* ── Trigger ── */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setOpen((v) => !v)}
        className={`
          flex items-center gap-1 px-2.5 py-1 rounded-lg border text-xs font-bold
          uppercase tracking-wide transition-all duration-150
          ${disabled
            ? "opacity-40 cursor-not-allowed border-border bg-muted/50 text-muted-foreground"
            : open
              ? "border-red-500/60 bg-red-600/10 text-foreground cursor-pointer"
              : "border-border bg-card text-foreground hover:border-muted-foreground/50 hover:bg-muted/30 cursor-pointer"
          }
        `}
      >
        <span>{value || "—"}</span>
        <ChevronDown
          className={`w-3 h-3 text-muted-foreground/70 transition-transform duration-150 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* ── Dropdown ── */}
      {open && (
        <div
          className="
            absolute z-[60] mt-1.5 right-0 w-56
            bg-popover border border-border rounded-xl shadow-2xl overflow-hidden

          "
        >
          {/* Search bar */}
          <div className="flex items-center gap-2 px-3 py-2 border-b border-border bg-muted/30">
            <Search className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
            <input
              ref={searchRef}
              type="text"
              placeholder="Search format…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 bg-transparent text-xs outline-none text-foreground placeholder:text-muted-foreground"
            />
            {search && (
              <button type="button" onClick={() => setSearch("")}>
                <X className="w-3 h-3 text-muted-foreground" />
              </button>
            )}
          </div>

          {/* Format grid */}
          <div className="p-2 max-h-44 overflow-y-auto">
            {filtered.length > 0 ? (
              <div className="grid grid-cols-4 gap-1">
                {filtered.map((fmt) => (
                  <button
                    key={fmt}
                    type="button"
                    onClick={() => {
                      onChange(fmt);
                      setOpen(false);
                    }}
                    className={`
                      py-1.5 rounded text-[10px] font-bold uppercase tracking-wide
                      border transition-all duration-100
                      ${
                        value === fmt
                          ? "border-red-500/70 bg-red-600/10 text-red-500 dark:text-red-400"
                          : "border-border hover:border-muted-foreground/50 text-foreground hover:bg-muted/40"
                      }
                    `}
                  >
                    {fmt.toUpperCase()}
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-center text-xs text-muted-foreground py-4">
                No formats found
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
