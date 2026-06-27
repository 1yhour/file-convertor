// ─── Supported Formats ───────────────────────────────────────────────────────
// Maps MIME types → list of output format extensions the backend can produce.
export const SUPPORTED_FORMATS: Record<string, string[]> = {
  // ── Images ──────────────────────────────────────────────────────────────────
  "image/png":  ["jpg", "jpeg", "webp", "gif", "bmp", "tiff", "pdf", "svg", "ico", "avif"],
  "image/jpeg": ["png", "webp", "gif", "bmp", "tiff", "pdf", "svg", "ico", "avif"],
  "image/jpg":  ["png", "webp", "gif", "bmp", "tiff", "pdf", "svg", "ico", "avif"],
  "image/webp": ["png", "jpg", "jpeg", "gif", "bmp", "tiff", "pdf", "avif"],
  "image/gif":  ["png", "jpg", "jpeg", "webp", "mp4", "apng"],
  "image/bmp":  ["png", "jpg", "jpeg", "webp", "tiff", "pdf"],
  "image/tiff": ["png", "jpg", "jpeg", "webp", "pdf", "bmp"],
  "image/svg+xml": ["png", "jpg", "jpeg", "pdf", "webp"],
  "image/x-icon": ["png", "jpg", "jpeg", "webp", "svg"],
  "image/avif": ["png", "jpg", "jpeg", "webp"],
  "image/heic": ["jpg", "jpeg", "png", "webp"],
  "image/heif": ["jpg", "jpeg", "png", "webp"],

  // ── Videos ──────────────────────────────────────────────────────────────────
  "video/mp4":       ["mp3", "avi", "mov", "webm", "mkv", "flv", "gif", "wav", "ogg"],
  "video/x-msvideo": ["mp4", "mov", "webm", "mkv", "mp3", "wav"],         // avi
  "video/quicktime": ["mp4", "avi", "webm", "mkv", "mp3", "wav"],         // mov
  "video/webm":      ["mp4", "avi", "mov", "mkv", "mp3", "wav"],
  "video/x-matroska":["mp4", "avi", "mov", "webm", "mp3", "wav"],         // mkv
  "video/x-flv":     ["mp4", "avi", "mov", "webm", "mp3"],
  "video/3gpp":      ["mp4", "avi", "webm", "mp3"],
  "video/x-ms-wmv":  ["mp4", "avi", "mov", "webm", "mp3"],
  "video/mpeg":      ["mp4", "avi", "mov", "webm", "mp3"],
  "video/ogg":       ["mp4", "webm", "mp3", "wav"],

  // ── Audio ───────────────────────────────────────────────────────────────────
  "audio/mpeg":  ["wav", "ogg", "aac", "flac", "m4a", "wma", "opus"],    // mp3
  "audio/wav":   ["mp3", "ogg", "aac", "flac", "m4a", "opus"],
  "audio/ogg":   ["mp3", "wav", "aac", "flac", "m4a"],
  "audio/aac":   ["mp3", "wav", "ogg", "flac", "m4a"],
  "audio/flac":  ["mp3", "wav", "ogg", "aac", "m4a"],
  "audio/x-m4a": ["mp3", "wav", "ogg", "aac", "flac"],
  "audio/mp4":   ["mp3", "wav", "ogg", "aac", "flac"],
  "audio/x-ms-wma": ["mp3", "wav", "ogg", "aac", "flac"],
  "audio/opus":  ["mp3", "wav", "ogg", "aac", "flac"],
  "audio/x-aiff":["mp3", "wav", "ogg", "aac", "flac"],
  "audio/webm":  ["mp3", "wav", "ogg", "aac"],

  // ── Documents ───────────────────────────────────────────────────────────────
  "application/pdf": ["jpg", "png", "docx", "txt", "html"],
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": ["pdf", "txt", "html", "odt"],  // docx
  "application/msword": ["pdf", "txt", "html", "docx", "odt"],             // doc
  "application/vnd.oasis.opendocument.text": ["pdf", "docx", "txt", "html"], // odt
  "text/plain":    ["pdf", "html", "docx", "md"],
  "text/html":     ["pdf", "txt", "md", "docx"],
  "text/markdown": ["pdf", "html", "txt", "docx"],
  "text/csv":      ["xlsx", "json", "pdf", "txt"],

  // ── Spreadsheets ────────────────────────────────────────────────────────────
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": ["csv", "pdf", "ods", "txt"],  // xlsx
  "application/vnd.ms-excel": ["xlsx", "csv", "pdf", "ods"],               // xls
  "application/vnd.oasis.opendocument.spreadsheet": ["xlsx", "csv", "pdf"], // ods

  // ── Presentations ───────────────────────────────────────────────────────────
  "application/vnd.openxmlformats-officedocument.presentationml.presentation": ["pdf", "ppt", "odp", "jpg"], // pptx
  "application/vnd.ms-powerpoint": ["pptx", "pdf", "odp"],                 // ppt
  "application/vnd.oasis.opendocument.presentation": ["pptx", "pdf", "ppt"], // odp

  // ── Archives ────────────────────────────────────────────────────────────────
  "application/zip":  ["tar", "tar.gz", "7z", "rar"],
  "application/x-tar": ["zip", "tar.gz", "7z"],
  "application/gzip": ["zip", "tar", "7z"],
  "application/x-7z-compressed": ["zip", "tar", "tar.gz"],
  "application/x-rar-compressed": ["zip", "tar", "7z"],
  "application/vnd.rar":          ["zip", "tar", "7z"],

  // ── Ebooks ──────────────────────────────────────────────────────────────────
  "application/epub+zip": ["pdf", "mobi", "txt"],
  "application/x-mobipocket-ebook": ["epub", "pdf", "txt"],

  // ── Fonts ───────────────────────────────────────────────────────────────────
  "font/ttf":  ["otf", "woff", "woff2"],
  "font/otf":  ["ttf", "woff", "woff2"],
  "font/woff": ["ttf", "otf", "woff2"],
  "font/woff2":["ttf", "otf", "woff"],

  // ── Vector / Design ─────────────────────────────────────────────────────────
  "image/x-xcf": ["png", "jpg", "pdf"],    // GIMP XCF
  "application/x-photoshop": ["png", "jpg", "pdf", "tiff"],  // PSD
  "application/postscript":  ["pdf", "png", "jpg", "svg"],   // AI / EPS
  "image/x-eps":             ["pdf", "png", "jpg", "svg"],
};

// ─── Category Registry ───────────────────────────────────────────────────────
// Groups MIME types into human-readable categories for the picker UI.
export interface MimeCategory {
  label: string;
  icon: string;   // emoji icon
  mimes: string[];
}

export const MIME_CATEGORIES: MimeCategory[] = [
  {
    label: "Image",
    icon: "🖼️",
    mimes: [
      "image/png", "image/jpeg", "image/jpg", "image/webp", "image/gif",
      "image/bmp", "image/tiff", "image/svg+xml", "image/x-icon",
      "image/avif", "image/heic", "image/heif",
    ],
  },
  {
    label: "Video",
    icon: "🎬",
    mimes: [
      "video/mp4", "video/x-msvideo", "video/quicktime", "video/webm",
      "video/x-matroska", "video/x-flv", "video/3gpp", "video/x-ms-wmv",
      "video/mpeg", "video/ogg",
    ],
  },
  {
    label: "Audio",
    icon: "🎵",
    mimes: [
      "audio/mpeg", "audio/wav", "audio/ogg", "audio/aac", "audio/flac",
      "audio/x-m4a", "audio/mp4", "audio/x-ms-wma", "audio/opus",
      "audio/x-aiff", "audio/webm",
    ],
  },
  {
    label: "Document",
    icon: "📄",
    mimes: [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/msword",
      "application/vnd.oasis.opendocument.text",
      "text/plain", "text/html", "text/markdown", "text/csv",
    ],
  },
  {
    label: "Spreadsheet",
    icon: "📊",
    mimes: [
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-excel",
      "application/vnd.oasis.opendocument.spreadsheet",
    ],
  },
  {
    label: "Presentation",
    icon: "📑",
    mimes: [
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      "application/vnd.ms-powerpoint",
      "application/vnd.oasis.opendocument.presentation",
    ],
  },
  {
    label: "Archive",
    icon: "🗜️",
    mimes: [
      "application/zip", "application/x-tar", "application/gzip",
      "application/x-7z-compressed", "application/x-rar-compressed",
      "application/vnd.rar",
    ],
  },
  {
    label: "Ebook",
    icon: "📚",
    mimes: [
      "application/epub+zip",
      "application/x-mobipocket-ebook",
    ],
  },
  {
    label: "Font",
    icon: "🔤",
    mimes: ["font/ttf", "font/otf", "font/woff", "font/woff2"],
  },
  {
    label: "Design / Vector",
    icon: "🎨",
    mimes: [
      "image/x-xcf", "application/x-photoshop",
      "application/postscript", "image/x-eps",
    ],
  },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Human-friendly label for a MIME type, e.g. "image/png" → "PNG" */
export function mimeToLabel(mime: string): string {
  const ext = mime.split("/")[1] ?? mime;
  // Clean up vendor prefixes
  return ext
    .replace(/^x-/, "")
    .replace(/^vnd\./, "")
    .replace(/openxmlformats-officedocument\.(wordprocessingml|spreadsheetml|presentationml)\..+/, (_, t) =>
      t === "wordprocessingml" ? "DOCX" : t === "spreadsheetml" ? "XLSX" : "PPTX"
    )
    .replace(/ms-/, "")
    .replace(/oasis\.opendocument\.(.+)/, (_, t) =>
      t === "text" ? "ODT" : t === "spreadsheet" ? "ODS" : "ODP"
    )
    .replace(/x-/, "")
    .replace(/epub\+zip/, "EPUB")
    .replace(/mobipocket-ebook/, "MOBI")
    .toUpperCase()
    .slice(0, 8); // cap length
}

/** Returns the category label for a given MIME type. */
export function getCategoryForMime(mime: string): string | undefined {
  return MIME_CATEGORIES.find((c) => c.mimes.includes(mime))?.label;
}

/** Returns available conversion targets based on MIME type. */
export function getAvailableFormats(mimeType: string): string[] {
  return SUPPORTED_FORMATS[mimeType] || [];
}

/** Validates if the file is supported. */
export function isFormatSupported(mimeType: string): boolean {
  return mimeType in SUPPORTED_FORMATS;
}

/** All registered MIME types (flat list). */
export const ALL_MIME_TYPES = Object.keys(SUPPORTED_FORMATS);
