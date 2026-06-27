"use client";

import { useConvertProgress } from "@/hooks/use-echo";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Loader2,
  CheckCircle2,
  XCircle,
  Download,
  ArrowLeft,
} from "lucide-react";

interface ProgressCardProps {
  jobId: string;
  onReset: () => void;
}

export function ProgressCard({ jobId, onReset }: ProgressCardProps) {
  const data = useConvertProgress(jobId);

  if (!data) {
    return (
      <Card className="w-full max-w-xl mx-auto shadow-sm">
        <CardContent className="p-8 flex flex-col items-center justify-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Connecting to server...</p>
        </CardContent>
      </Card>
    );
  }

  const { status, progress, downloadUrl, error } = data;

  return (
    <Card className="w-full max-w-xl mx-auto shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <span>Conversion Status</span>
        </CardTitle>
        <CardDescription>Job ID: {jobId}</CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-8">
        <div className="flex flex-col items-center justify-center space-y-4 py-4">
          {status === "queued" && (
            <>
              <Loader2 className="w-12 h-12 animate-spin text-primary/60" />
              <p className="text-lg font-medium text-muted-foreground">Waiting in queue...</p>
            </>
          )}

          {status === "processing" && (
            <>
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
              <div className="w-full space-y-2 text-center">
                <p className="text-lg font-medium">Processing File</p>
                <Progress value={progress} className="h-2 w-full" />
                <p className="text-sm text-muted-foreground">{progress}% Complete</p>
              </div>
            </>
          )}

          {status === "done" && (
            <>
              <CheckCircle2 className="w-16 h-16 text-green-500 animate-in zoom-in" />
              <p className="text-xl font-semibold text-green-600">Conversion Complete!</p>
            </>
          )}

          {status === "failed" && (
            <>
              <XCircle className="w-16 h-16 text-destructive animate-in zoom-in" />
              <p className="text-xl font-semibold text-destructive">Conversion Failed</p>
              {error && <p className="text-sm text-muted-foreground text-center">{error}</p>}
            </>
          )}
        </div>
      </CardContent>

      <CardFooter className="flex justify-between bg-muted/20 px-6 py-4">
        <Button variant="ghost" onClick={onReset} className="text-muted-foreground hover:text-foreground">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Convert Another
        </Button>
        
        {status === "done" && downloadUrl && (
          <Button asChild className="gap-2">
            <a href={downloadUrl} target="_blank" rel="noopener noreferrer">
              <Download className="w-4 h-4" />
              Download Result
            </a>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
