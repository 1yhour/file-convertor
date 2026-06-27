import { useEffect, useState } from "react";
import Echo from "laravel-echo";
import Pusher from "pusher-js";

// Make Pusher available globally for Laravel Echo
if (typeof window !== "undefined") {
  (window as any).Pusher = Pusher;
}

// We'll keep a single instance of Echo to avoid multiple connections
let echoInstance: Echo<"reverb"> | null = null;

const getEcho = () => {
  if (typeof window === "undefined") return null;

  if (!echoInstance) {
    echoInstance = new Echo({
      broadcaster: "reverb",
      key: process.env.NEXT_PUBLIC_REVERB_APP_KEY,
      wsHost: process.env.NEXT_PUBLIC_REVERB_HOST,
      wsPort: process.env.NEXT_PUBLIC_REVERB_PORT ? Number(process.env.NEXT_PUBLIC_REVERB_PORT) : 8080,
      wssPort: process.env.NEXT_PUBLIC_REVERB_PORT ? Number(process.env.NEXT_PUBLIC_REVERB_PORT) : 443,
      forceTLS: (process.env.NEXT_PUBLIC_REVERB_SCHEME ?? "https") === "https",
      enabledTransports: ["ws", "wss"],
    });
  }
  return echoInstance;
};

export type JobStatus = "queued" | "processing" | "done" | "failed";

export interface ConversionProgressData {
  jobId: string;
  status: JobStatus;
  progress: number;
  downloadUrl?: string;
  error?: string;
}

export function useConvertProgress(jobId: string | null) {
  const [data, setData] = useState<ConversionProgressData | null>(null);

  useEffect(() => {
    if (!jobId) return;
    
    // Set initial state
    setData({ jobId, status: "queued", progress: 0 });

    const echo = getEcho();
    if (!echo) return;

    // Listen on a public channel unique to the job.
    // For guest users, this avoids 403 /broadcasting/auth errors.
    const channel = echo.channel(`job.${jobId}`);

    channel.listen("ConvertProgressUpdated", (e: any) => {
      // Expecting backend event to structure data appropriately
      setData((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          status: e.status ?? prev.status,
          progress: e.progress ?? prev.progress,
          downloadUrl: e.downloadUrl ?? prev.downloadUrl,
          error: e.error ?? prev.error,
        };
      });
    });

    return () => {
      channel.stopListening("ConvertProgressUpdated");
      echo.leaveChannel(`job.${jobId}`);
    };
  }, [jobId]);

  return data;
}
