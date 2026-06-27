"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import { useConvertProgress, type ConversionProgressData } from "@/hooks/use-echo";

/**
 * Headless component — mounts once per active job and propagates
 * real-time WebSocket progress updates up to the parent via `onUpdate`.
 */
export function FileJobTracker({
  jobId,
  onUpdate,
}: {
  jobId: string;
  onUpdate: (data: ConversionProgressData) => void;
}) {
  const data = useConvertProgress(jobId);

  // Keep a stable ref so the effect never goes stale
  const cbRef = useRef(onUpdate);
  useLayoutEffect(() => {
    cbRef.current = onUpdate;
  });

  useEffect(() => {
    if (data) cbRef.current(data);
  }, [data]);

  return null;
}
