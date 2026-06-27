"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { AlertCircle, ArrowRight, Loader2, Plus, X } from "lucide-react";
import { getAvailableFormats } from "@/lib/format-config";
import type { ConversionProgressData } from "@/hooks/use-echo";
import { EmptyDropZone } from "./empty-drop-zone";
import { FileRow } from "./file-row";
import { uid, type FileItem } from "./types";

interface UploadZoneProps {
  /** Preferred source MIME type from the hero card selection */
  preferredMime?: string;
  /** Preferred output format from the hero card selection */
  preferredTarget?: string;
  /** Called when a file is dropped and its MIME is auto-detected, so the hero can sync */
  onFileDetected?: (mime: string) => void;
}

export function UploadZone({
  preferredMime,
  preferredTarget,
  onFileDetected,
}: UploadZoneProps) {
  const [fileItems, setFileItems] = useState<FileItem[]>([]);
  const [converting, setConverting] = useState(false);
  const [globalError, setGlobalError] = useState("");

  // ── Add files ─────────────────────────────────────────────────────────────
  const addFiles = useCallback(
    (dropped: File[]) => {
      setGlobalError("");
      const next: FileItem[] = [];
      const skipped: string[] = [];

      for (const file of dropped) {
        const fileMime = file.type ?? "";
        const fileFmts = getAvailableFormats(fileMime);

        // Determine which source MIME to use
        let sourceMime = fileMime;
        if (fileFmts.length === 0) {
          // File MIME unsupported — fall back to hero's preferredMime
          if (preferredMime && getAvailableFormats(preferredMime).length > 0) {
            sourceMime = preferredMime;
          } else {
            skipped.push(file.name);
            continue;
          }
        } else {
          // Notify hero to sync its FROM card to the detected MIME
          onFileDetected?.(fileMime);
        }

        const formats = getAvailableFormats(sourceMime);
        // Use preferredTarget if it's compatible, otherwise first available
        const targetFormat =
          preferredTarget && formats.includes(preferredTarget)
            ? preferredTarget
            : formats[0];

        next.push({
          id: uid(),
          file,
          sourceMime,
          targetFormat,
          status: "pending",
          progress: 0,
          jobId: null,
        });
      }

      if (next.length === 0) {
        setGlobalError(
          skipped.length
            ? `Unsupported format${skipped.length > 1 ? "s" : ""}: ${skipped.join(", ")}`
            : "No supported files found."
        );
        return;
      }
      if (skipped.length) {
        setGlobalError(`Skipped unsupported: ${skipped.join(", ")}`);
      }

      setFileItems((prev) => [...prev, ...next]);
    },
    [preferredMime, preferredTarget, onFileDetected]
  );

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop: addFiles,
    multiple: true,
    noClick: true,
  });

  // ── Handlers ──────────────────────────────────────────────────────────────
  const removeFile = (id: string) =>
    setFileItems((prev) => prev.filter((f) => f.id !== id));

  const changeFormat = (id: string, fmt: string) =>
    setFileItems((prev) =>
      prev.map((f) => (f.id === id ? { ...f, targetFormat: fmt } : f))
    );

  const handleJobUpdate = (id: string, data: ConversionProgressData) => {
    setFileItems((prev) =>
      prev.map((f) => {
        if (f.id !== id) return f;
        return {
          ...f,
          status:
            data.status === "done"
              ? "done"
              : data.status === "failed"
              ? "failed"
              : data.status === "processing"
              ? "processing"
              : "queued",
          progress: data.progress,
          downloadUrl: data.downloadUrl,
          error: data.error,
        };
      })
    );
  };

  const handleConvert = async () => {
    const pending = fileItems.filter(
      (f) => f.status === "pending" && f.targetFormat
    );
    if (!pending.length) return;

    setConverting(true);
    setGlobalError("");

    await Promise.all(
      pending.map(async (item) => {
        setFileItems((prev) =>
          prev.map((f) =>
            f.id === item.id ? { ...f, status: "uploading" } : f
          )
        );

        try {
          const form = new FormData();
          form.append("file", item.file);
          form.append("target_format", item.targetFormat);
          form.append("source_mime", item.sourceMime);

          const res = await fetch("http://localhost:8000/api/convert/upload", {
            method: "POST",
            body: form,
          });
          if (!res.ok) throw new Error(`Server error: ${res.status}`);

          const data = await res.json();
          if (!data.jobId) throw new Error("No job ID returned");

          setFileItems((prev) =>
            prev.map((f) =>
              f.id === item.id
                ? { ...f, status: "queued", jobId: data.jobId, progress: 0 }
                : f
            )
          );
        } catch (err: any) {
          setFileItems((prev) =>
            prev.map((f) =>
              f.id === item.id
                ? {
                    ...f,
                    status: "failed",
                    error: err.message ?? "Upload failed",
                  }
                : f
            )
          );
        }
      })
    );

    setConverting(false);
  };

  const pendingCount = fileItems.filter((f) => f.status === "pending").length;
  const isEmpty = fileItems.length === 0;
  const allSettled =
    fileItems.length > 0 &&
    fileItems.every((f) => f.status === "done" || f.status === "failed");

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div
      {...(isEmpty
        ? {}
        : getRootProps({ onClick: (e) => e.stopPropagation() }))}
      className="w-full space-y-3"
    >
      {/* Global error */}
      {globalError && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-xl border border-destructive/25 bg-destructive/10 text-destructive text-sm">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span className="flex-1">{globalError}</span>
          <button type="button" onClick={() => setGlobalError("")}>
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {isEmpty ? (
        /* ── Empty state ── */
        <EmptyDropZone
          isDragActive={isDragActive}
          onOpen={open}
          getRootProps={getRootProps}
          getInputProps={getInputProps}
        />
      ) : (
        <>
          {/* Hidden dropzone input */}
          <input {...getInputProps()} />

          {/* ── File rows ── */}
          <div className="space-y-2">
            {fileItems.map((item) => (
              <FileRow
                key={item.id}
                item={item}
                converting={converting}
                onRemove={removeFile}
                onFormatChange={changeFormat}
                onJobUpdate={handleJobUpdate}
              />
            ))}
          </div>

          {/* ── Add more zone ── */}
          {!converting && (
            <button
              type="button"
              onClick={open}
              className={`
                w-full flex items-center justify-center gap-2
                px-4 py-3 rounded-xl border border-dashed text-sm
                transition-all duration-200
                ${
                  isDragActive
                    ? "border-red-500/60 bg-red-500/5 text-red-400"
                    : "border-muted-foreground/20 text-muted-foreground hover:border-muted-foreground/40 hover:bg-muted/10 hover:text-foreground"
                }
              `}
            >
              <Plus className="w-4 h-4" />
              {isDragActive ? "Drop to add more files" : "Add more files"}
            </button>
          )}

          {/* ── Action bar ── */}
          <div className="flex items-center justify-between pt-1">
            <button
              type="button"
              onClick={() => {
                setFileItems([]);
                setGlobalError("");
              }}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Clear all
            </button>

            {allSettled ? (
              <button
                type="button"
                onClick={() => {
                  setFileItems([]);
                  setGlobalError("");
                }}
                className="
                  flex items-center gap-2 px-5 py-2 rounded-xl
                  bg-muted hover:bg-muted/80 text-foreground
                  text-sm font-semibold transition-colors
                "
              >
                Convert more files
              </button>
            ) : (
              <button
                type="button"
                onClick={handleConvert}
                disabled={pendingCount === 0 || converting}
                className={`
                  flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white
                  shadow-lg shadow-red-900/20 transition-all duration-150
                  ${
                    pendingCount === 0 || converting
                      ? "bg-red-600/40 cursor-not-allowed"
                      : "bg-red-600 hover:bg-red-700 active:scale-[0.98]"
                  }
                `}
              >
                {converting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Converting…
                  </>
                ) : (
                  <>
                    Convert{" "}
                    {pendingCount > 1 ? `${pendingCount} Files` : "File"}
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}
