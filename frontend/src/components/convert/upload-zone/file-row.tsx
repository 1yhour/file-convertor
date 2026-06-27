"use client";

import { CheckCircle2, Download, Loader2, X, XCircle } from "lucide-react";
import { getCategoryForMime, getAvailableFormats } from "@/lib/format-config";
import { Progress } from "@/components/ui/progress";
import { OutputFormatSelector } from "../output-format-selector";
import { FileJobTracker } from "./file-job-tracker";
import {
  BADGE_COLORS,
  formatSize,
  getFileExt,
  type FileItem,
} from "./types";
import type { ConversionProgressData } from "@/hooks/use-echo";

// ── Badge color helper ────────────────────────────────────────────────────────
function getBadgeColor(mime: string) {
  const cat = getCategoryForMime(mime);
  return BADGE_COLORS[cat ?? ""] ?? "bg-slate-500";
}

// ── Status badge ─────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: FileItem["status"] }) {
  if (status === "pending") return null;

  const variants: Record<
    string,
    { icon: React.ReactNode; label: string; cls: string }
  > = {
    uploading: {
      icon: <Loader2 className="w-3 h-3 animate-spin" />,
      label: "Uploading",
      cls: "text-sky-400",
    },
    queued: {
      icon: <Loader2 className="w-3 h-3 animate-spin" />,
      label: "Queued",
      cls: "text-amber-400",
    },
    processing: {
      icon: <Loader2 className="w-3 h-3 animate-spin" />,
      label: "Converting",
      cls: "text-blue-400",
    },
    done: {
      icon: <CheckCircle2 className="w-3 h-3" />,
      label: "Done",
      cls: "text-emerald-400",
    },
    failed: {
      icon: <XCircle className="w-3 h-3" />,
      label: "Failed",
      cls: "text-red-400",
    },
  };

  const v = variants[status];
  if (!v) return null;
  return (
    <span className={`flex items-center gap-1 text-[11px] font-medium ${v.cls}`}>
      {v.icon}
      {v.label}
    </span>
  );
}

// ── File row ─────────────────────────────────────────────────────────────────
interface FileRowProps {
  item: FileItem;
  converting: boolean;
  onRemove: (id: string) => void;
  onFormatChange: (id: string, fmt: string) => void;
  onJobUpdate: (id: string, data: ConversionProgressData) => void;
}

export function FileRow({
  item,
  converting,
  onRemove,
  onFormatChange,
  onJobUpdate,
}: FileRowProps) {
  const formats = getAvailableFormats(item.sourceMime);
  const badgeColor = getBadgeColor(item.sourceMime);
  const ext = getFileExt(item.file.name);

  const isPending = item.status === "pending";
  const isActive = ["uploading", "queued", "processing"].includes(item.status);
  const isDone = item.status === "done";
  const isFailed = item.status === "failed";

  return (
    <>
      {/* Headless job tracker — mounts only when a jobId exists */}
      {item.jobId && (
        <FileJobTracker
          jobId={item.jobId}
          onUpdate={(data) => onJobUpdate(item.id, data)}
        />
      )}

      <div
        className={`
          group flex items-center gap-3 px-4 py-3.5 rounded-xl border
          transition-all duration-200
          ${isDone
            ? "border-emerald-800/30 bg-emerald-950/20"
            : isFailed
            ? "border-red-800/30 bg-red-950/20"
            : "border-border bg-card hover:border-muted-foreground/25"
          }
        `}
      >
        {/* ── Type badge ── */}
        <div
          className={`
            w-11 h-11 rounded-lg shrink-0 flex items-center justify-center
            text-[11px] font-extrabold text-white tracking-wide
            ${badgeColor}
          `}
        >
          {ext.slice(0, 4)}
        </div>

        {/* ── File info ── */}
        <div className="flex-1 min-w-0 space-y-0.5">
          <p className="text-sm font-medium truncate leading-snug">
            {item.file.name}
          </p>
          <div className="flex items-center gap-2.5">
            <span className="text-xs text-muted-foreground">
              {formatSize(item.file.size)}
            </span>
            <StatusBadge status={item.status} />
          </div>
          {isActive && (
            <div className="pt-1.5 pr-1">
              <Progress value={item.progress} className="h-1" />
            </div>
          )}
          {isFailed && item.error && (
            <p className="text-[11px] text-red-400 truncate">{item.error}</p>
          )}
        </div>

        {/* ── Right controls ── */}
        <div className="shrink-0 flex items-center gap-2">
          {isDone && item.downloadUrl ? (
            <a
              href={item.downloadUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="
                flex items-center gap-1.5 px-3 py-1.5 rounded-lg
                bg-emerald-600 hover:bg-emerald-700 text-white
                text-xs font-semibold transition-colors duration-150
              "
            >
              <Download className="w-3.5 h-3.5" />
              Download
            </a>
          ) : (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span>to</span>
              <OutputFormatSelector
                formats={formats}
                value={item.targetFormat}
                onChange={(fmt) => onFormatChange(item.id, fmt)}
                disabled={!isPending || converting}
              />
            </div>
          )}

          {/* Remove button — visible on hover for pending files only */}
          {isPending && !converting && (
            <button
              type="button"
              title="Remove"
              onClick={() => onRemove(item.id)}
              className="
                p-1.5 rounded-lg opacity-0 group-hover:opacity-100
                text-muted-foreground hover:text-foreground hover:bg-muted
                transition-all duration-150
              "
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </>
  );
}
