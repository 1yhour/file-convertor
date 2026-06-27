"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { Search, ChevronRight, X, Check } from "lucide-react";
import {
  MIME_CATEGORIES,
  SUPPORTED_FORMATS,
  mimeToLabel,
  type MimeCategory,
} from "@/lib/format-config";

interface MimeFormatSelectorProps {
  /** Currently selected MIME type */
  value: string;
  /** Callback when user picks a MIME type */
  onChange: (mime: string) => void;
  /** Optional placeholder text for the trigger button */
  placeholder?: string;
}

export function MimeFormatSelector({
  value,
  onChange,
  placeholder = "Select type…",
}: MimeFormatSelectorProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<MimeCategory>(
    MIME_CATEGORIES[0]
  );

  const containerRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  // ── Filter logic ────────────────────────────────────────────────────────────
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

  // ── Keep active category in sync after filtering ─────────────────────────
  useEffect(() => {
    if (filteredCategories.length > 0) {
      const still = filteredCategories.find(
        (c) => c.label === activeCategory.label
      );
      if (!still) setActiveCategory(filteredCategories[0]);
    }
  }, [filteredCategories]);

  // ── Close on outside click ───────────────────────────────────────────────
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // ── Focus search on open ─────────────────────────────────────────────────
  useEffect(() => {
    if (open) {
      setTimeout(() => searchRef.current?.focus(), 50);
    } else {
      setSearch("");
    }
  }, [open]);

  // ── Derived display label for trigger ───────────────────────────────────
  const triggerLabel = value
    ? `${mimeToLabel(value)} — ${value}`
    : placeholder;

  const currentMimes = filteredCategories.find(
    (c) => c.label === activeCategory.label
  )?.mimes ?? [];

  return (
    <div ref={containerRef} className="relative w-full">
      {/* ── Trigger ─────────────────────────────────────────────────────── */}
      <button
        id="mime-selector-trigger"
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`
          w-full flex items-center justify-between gap-2 px-3 py-2.5
          rounded-lg border text-sm font-medium transition-all duration-200
          bg-card text-foreground
          hover:border-primary/60 hover:bg-accent/30
          focus:outline-none focus:ring-2 focus:ring-ring
          ${open ? "border-primary/70 ring-2 ring-ring/40" : "border-border"}
        `}
      >
        <span className={value ? "text-foreground" : "text-muted-foreground"}>
          {triggerLabel}
        </span>
        <div className="flex items-center gap-1 shrink-0">
          {value && (
            <span
              role="button"
              tabIndex={0}
              onClick={(e) => {
                e.stopPropagation();
                onChange("");
              }}
              onKeyDown={(e) => e.key === "Enter" && onChange("")}
              className="p-0.5 rounded hover:bg-muted cursor-pointer"
            >
              <X className="w-3.5 h-3.5 text-muted-foreground" />
            </span>
          )}
          <ChevronRight
            className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${
              open ? "rotate-90" : ""
            }`}
          />
        </div>
      </button>

      {/* ── Dropdown panel ──────────────────────────────────────────────── */}
      {open && (
        <div
          className="
            absolute z-50 mt-2 left-0 right-0
            bg-popover border border-border rounded-xl shadow-xl
            overflow-hidden flex flex-col

          "
          style={{ maxHeight: "420px" }}
        >
          {/* Search bar */}
          <div className="flex items-center gap-2 px-3 py-2.5 border-b border-border bg-muted/40">
            <Search className="w-4 h-4 text-muted-foreground shrink-0" />
            <input
              ref={searchRef}
              type="text"
              placeholder="Search format or MIME type…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="
                flex-1 bg-transparent text-sm outline-none
                placeholder:text-muted-foreground text-foreground
              "
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="p-0.5 hover:bg-muted rounded"
              >
                <X className="w-3.5 h-3.5 text-muted-foreground" />
              </button>
            )}
          </div>

          {/* Two-column body */}
          <div className="flex flex-1 overflow-hidden" style={{ minHeight: 0 }}>
            {/* Category sidebar */}
            <aside className="w-40 shrink-0 border-r border-border overflow-y-auto bg-muted/20">
              {filteredCategories.map((cat) => (
                <button
                  key={cat.label}
                  type="button"
                  onClick={() => setActiveCategory(cat)}
                  className={`
                    w-full flex items-center gap-2 px-3 py-2 text-sm font-medium
                    transition-colors duration-100 text-left
                    ${
                      activeCategory.label === cat.label
                        ? "bg-primary/10 text-primary border-r-2 border-primary"
                        : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                    }
                  `}
                >
                  <span className="text-base leading-none">{cat.icon}</span>
                  <span className="truncate">{cat.label}</span>
                  <ChevronRight className="w-3.5 h-3.5 ml-auto opacity-50 shrink-0" />
                </button>
              ))}
              {filteredCategories.length === 0 && (
                <p className="px-3 py-4 text-xs text-muted-foreground text-center">
                  No results
                </p>
              )}
            </aside>

            {/* Format grid */}
            <div className="flex-1 overflow-y-auto p-3">
              {currentMimes.length > 0 ? (
                <div className="grid grid-cols-3 gap-1.5">
                  {currentMimes.map((mime) => {
                    const isSelected = value === mime;
                    const label = mimeToLabel(mime);
                    const outputCount = SUPPORTED_FORMATS[mime]?.length ?? 0;
                    return (
                      <button
                        key={mime}
                        type="button"
                        title={mime}
                        onClick={() => {
                          onChange(mime);
                          setOpen(false);
                        }}
                        className={`
                          relative flex flex-col items-center justify-center gap-1
                          rounded-lg border px-2 py-2.5 text-center
                          text-xs font-semibold cursor-pointer
                          transition-all duration-150 select-none
                          ${
                            isSelected
                              ? "border-primary bg-primary/10 text-primary shadow-sm"
                              : "border-border bg-card text-foreground hover:border-primary/50 hover:bg-accent/30"
                          }
                        `}
                      >
                        {isSelected && (
                          <Check className="absolute top-1 right-1 w-3 h-3 text-primary" />
                        )}
                        <span className="font-bold tracking-wide">{label}</span>
                        <span className="text-[10px] font-normal text-muted-foreground leading-tight">
                          → {outputCount} format{outputCount !== 1 ? "s" : ""}
                        </span>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-sm text-muted-foreground py-8">
                  No formats found
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
