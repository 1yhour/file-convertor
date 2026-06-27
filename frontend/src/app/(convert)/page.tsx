"use client";

import { useCallback, useState } from "react";
import { FormatPairHero } from "@/components/convert/hero/format-pair-hero";
import { UploadZone } from "@/components/convert/upload-zone/upload-zone";

const FEATURE_TAGS = ["Images", "Videos", "Audio", "Documents", "Archives", "Fonts"];

export default function ConvertPage() {
  // ── Shared format selection state ──────────────────────────────────────
  // Lifted here so hero cards and upload zone stay in sync.
  const [selectedMime, setSelectedMime] = useState("");
  const [selectedTarget, setSelectedTarget] = useState("");

  /** Hero FROM card picked a source MIME → clear target (may be incompatible) */
  const handleMimeChange = useCallback((mime: string) => {
    setSelectedMime(mime);
    setSelectedTarget("");
  }, []);

  /** Upload zone detected a file's MIME → sync hero cards */
  const handleFileDetected = useCallback((mime: string) => {
    setSelectedMime(mime);
    setSelectedTarget("");
  }, []);

  /** Reset animation */
  const handleReset = useCallback(() => {
    setSelectedMime("");
    setSelectedTarget("");
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <div className="relative bg-zinc-950 pt-16 pb-36 px-6 overflow-hidden">
        {/* Ambient glows */}
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-32 right-1/4 w-[480px] h-[480px] bg-red-700/8 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-0 w-[320px] h-[320px] bg-red-900/6 rounded-full blur-2xl" />
        </div>

        <div className="relative max-w-5xl mx-auto flex flex-col lg:flex-row items-center lg:items-start gap-12">
          {/* Left: headline & copy */}
          <div className="flex-1 text-center lg:text-left space-y-5 pt-2">
            <h1 className="text-5xl font-extrabold text-white tracking-tight leading-[1.1]">
              Convert Any File
            </h1>
            <p className="text-base text-zinc-400 max-w-md leading-relaxed">
              Drop a file and pick what to turn it into. Handles 50+ formats
              across images, audio, video, documents, archives, and more —
              straight from your browser.
            </p>

            {/* Category pills */}
            <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
              {FEATURE_TAGS.map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-1 rounded-full text-xs font-medium bg-zinc-800 text-zinc-400 border border-zinc-700/50"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Right: interactive format pair hero */}
          <div className="shrink-0 flex items-center justify-center lg:pt-4">
            <FormatPairHero
              selectedMime={selectedMime}
              selectedTarget={selectedTarget}
              onMimeChange={handleMimeChange}
              onTargetChange={setSelectedTarget}
              onReset={handleReset}
            />
          </div>
        </div>
      </div>

      {/* ── Upload zone — overlaps hero bottom ─────────────────────────── */}
      <div className="relative max-w-2xl mx-auto px-4 -mt-20 pb-24 z-10">
        <div className="rounded-2xl border border-border bg-card/90 backdrop-blur-sm shadow-2xl p-6">
          <UploadZone
            preferredMime={selectedMime}
            preferredTarget={selectedTarget}
            onFileDetected={handleFileDetected}
          />
        </div>
      </div>
    </div>
  );
}