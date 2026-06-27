"use client";

import { useEffect, useRef, useState } from "react";
import { RotateCcw } from "lucide-react";
import { getAvailableFormats, mimeToLabel } from "@/lib/format-config";
import { FormatCard } from "./format-card";
import { FormatCardMimeDropdown } from "./format-card-mime-dropdown";
import { FormatOutputDropdown } from "./format-output-dropdown";

// ── Animated pairs shown when nothing is selected ─────────────────────────
const FORMAT_PAIRS = [
  { from: "WAV",  to: "MP3",  fromColor: "text-emerald-400", toColor: "text-emerald-300" },
  { from: "PDF",  to: "DOCX", fromColor: "text-orange-400",  toColor: "text-blue-400"    },
  { from: "PNG",  to: "JPG",  fromColor: "text-sky-400",     toColor: "text-sky-300"     },
  { from: "MP4",  to: "GIF",  fromColor: "text-violet-400",  toColor: "text-pink-400"    },
  { from: "DOCX", to: "PDF",  fromColor: "text-blue-400",    toColor: "text-orange-400"  },
  { from: "HEIC", to: "JPG",  fromColor: "text-sky-400",     toColor: "text-yellow-400"  },
];

export interface FormatPairHeroProps {
  /** Currently selected source MIME (from page state) */
  selectedMime: string;
  /** Currently selected output format (from page state) */
  selectedTarget: string;
  /** Called when user picks a source MIME from the FROM card dropdown */
  onMimeChange: (mime: string) => void;
  /** Called when user picks an output format from the TO card dropdown */
  onTargetChange: (fmt: string) => void;
  /** Called when user clicks the reset button to resume animation */
  onReset: () => void;
}

export function FormatPairHero({
  selectedMime,
  selectedTarget,
  onMimeChange,
  onTargetChange,
  onReset,
}: FormatPairHeroProps) {
  const [pairIndex, setPairIndex] = useState(0);
  const [visible, setVisible] = useState(true);
  const [fromOpen, setFromOpen] = useState(false);
  const [toOpen, setToOpen] = useState(false);

  const fromRef = useRef<HTMLDivElement>(null);
  const toRef = useRef<HTMLDivElement>(null);

  const isLocked = !!selectedMime;
  const availableTargets = selectedMime ? getAvailableFormats(selectedMime) : [];

  // ── Cycling animation — paused when user has locked a MIME ──────────────
  useEffect(() => {
    if (isLocked) return;
    const id = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setPairIndex((i) => (i + 1) % FORMAT_PAIRS.length);
        setVisible(true);
      }, 350);
    }, 3000);
    return () => clearInterval(id);
  }, [isLocked]);

  // ── Close dropdowns on outside click ────────────────────────────────────
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (fromRef.current && !fromRef.current.contains(e.target as Node))
        setFromOpen(false);
      if (toRef.current && !toRef.current.contains(e.target as Node))
        setToOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // ── Derive display labels ─────────────────────────────────────────────────
  const pair = FORMAT_PAIRS[pairIndex];

  const fromLabel = isLocked ? mimeToLabel(selectedMime) : pair.from;
  const fromColor = isLocked ? "text-red-400" : pair.fromColor;

  const toLabel = selectedTarget
    ? selectedTarget.toUpperCase()
    : isLocked && availableTargets.length > 0
    ? availableTargets[0].toUpperCase()
    : pair.to;
  const toColor =
    selectedTarget || isLocked ? "text-red-300" : pair.toColor;

  return (
    <div className="flex flex-col items-center gap-3">
      <div
        className="flex items-center gap-5"
        style={{
          opacity: visible ? 1 : 0,
          transition: "opacity 0.3s ease",
        }}
      >
        {/* ── FROM card ── */}
        <div ref={fromRef} className="relative">
          <FormatCard
            label={fromLabel}
            colorClass={fromColor}
            side="from"
            isLocked={isLocked}
            onClick={() => {
              setFromOpen((v) => !v);
              setToOpen(false);
            }}
          />
          {fromOpen && (
            <FormatCardMimeDropdown
              onSelect={(mime) => {
                onMimeChange(mime);
                setFromOpen(false);
              }}
              onClose={() => setFromOpen(false)}
            />
          )}
        </div>

        {/* ── Arrow connector ── */}
        <div className="flex items-center">
          <div className="h-px w-5 bg-red-500/30" />
          <div className="w-8 h-8 rounded-full bg-red-600/15 border border-red-500/30 flex items-center justify-center">
            <span className="text-red-400/80 text-[9px] font-bold tracking-widest">
              TO
            </span>
          </div>
          <div className="h-px w-5 bg-red-500/30" />
        </div>

        {/* ── TO card ── */}
        <div ref={toRef} className="relative">
          <FormatCard
            label={toLabel}
            colorClass={toColor}
            side="to"
            isLocked={!!selectedTarget}
            onClick={() => {
              if (!isLocked) return; // need a source MIME first
              setToOpen((v) => !v);
              setFromOpen(false);
            }}
          />
          {toOpen && isLocked && (
            <FormatOutputDropdown
              formats={availableTargets}
              value={selectedTarget}
              onChange={(fmt) => {
                onTargetChange(fmt);
                setToOpen(false);
              }}
              onClose={() => setToOpen(false)}
            />
          )}
        </div>
      </div>

      {/* ── Reset button — shown when animation is locked ── */}
      {isLocked && (
        <button
          type="button"
          onClick={onReset}
          className="
            flex items-center gap-1.5 px-3 py-1 rounded-full
            text-[11px] text-zinc-500 hover:text-zinc-300
            border border-zinc-700/50 hover:border-zinc-600
            transition-all duration-150
          "
        >
          <RotateCcw className="w-3 h-3" />
          Reset
        </button>
      )}

      {/* Hint shown when source is selected but target is not explicitly set */}
      {isLocked && !selectedTarget && (
        <p className="text-[11px] text-zinc-600 text-center">
          Click the right card to choose output format
        </p>
      )}
    </div>
  );
}
