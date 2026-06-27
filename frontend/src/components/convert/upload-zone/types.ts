// ── Shared types & utilities for the upload-zone components ─────────────────

export interface FileItem {
  id: string;
  file: File;
  sourceMime: string;
  targetFormat: string;
  status:
    | "pending"
    | "uploading"
    | "queued"
    | "processing"
    | "done"
    | "failed";
  progress: number;
  jobId: string | null;
  downloadUrl?: string;
  error?: string;
}

export const BADGE_COLORS: Record<string, string> = {
  Image: "bg-sky-500",
  Video: "bg-violet-500",
  Audio: "bg-emerald-500",
  Document: "bg-amber-500",
  Spreadsheet: "bg-teal-500",
  Presentation: "bg-orange-500",
  Archive: "bg-slate-500",
  Ebook: "bg-rose-500",
  Font: "bg-indigo-500",
  "Design / Vector": "bg-pink-500",
};

export function uid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

export function getFileExt(filename: string) {
  const parts = filename.split(".");
  return parts.length > 1
    ? parts[parts.length - 1].toUpperCase().slice(0, 5)
    : "FILE";
}
