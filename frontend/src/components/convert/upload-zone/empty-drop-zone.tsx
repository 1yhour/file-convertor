"use client";

import { UploadCloud } from "lucide-react";

interface EmptyDropZoneProps {
  isDragActive: boolean;
  onOpen: () => void;
  getRootProps: () => React.HTMLAttributes<HTMLElement>;
  getInputProps: () => React.InputHTMLAttributes<HTMLInputElement>;
}

export function EmptyDropZone({
  isDragActive,
  onOpen,
  getRootProps,
  getInputProps,
}: EmptyDropZoneProps) {
  return (
    <div
      {...getRootProps()}
      className={`
        rounded-2xl border-2 border-dashed p-14 text-center
        transition-all duration-200 cursor-default select-none
        ${
          isDragActive
            ? "border-red-500/60 bg-red-500/5 scale-[1.01]"
            : "border-muted-foreground/20 hover:border-muted-foreground/35 hover:bg-muted/10"
        }
      `}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center gap-5">
        {/* Icon */}
        <div
          className={`
            w-16 h-16 rounded-2xl flex items-center justify-center
            transition-colors duration-200
            ${isDragActive ? "bg-red-500/15" : "bg-muted/60"}
          `}
        >
          <UploadCloud
            className={`w-8 h-8 transition-colors ${
              isDragActive ? "text-red-400" : "text-muted-foreground"
            }`}
          />
        </div>

        {/* Text */}
        <div className="space-y-1.5">
          <p className="text-base font-semibold text-foreground">
            {isDragActive
              ? "Drop files here"
              : "Select your file here to get started"}
          </p>
          <p className="text-sm text-muted-foreground">
            {isDragActive ? "Release to add" : "or drop your files here"}
          </p>
        </div>

        {/* CTA */}
        {!isDragActive && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onOpen();
            }}
            className="
              flex items-center gap-2 px-5 py-2.5 rounded-xl
              bg-red-600 hover:bg-red-700 active:scale-95
              text-white text-sm font-semibold
              shadow-lg shadow-red-900/20
              transition-all duration-150
            "
          >
            <UploadCloud className="w-4 h-4" />
            Select File
          </button>
        )}
      </div>
    </div>
  );
}
