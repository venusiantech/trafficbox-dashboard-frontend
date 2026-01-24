"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/components/ui/dialog";
import { Camera, Play, Clock } from "lucide-react";
import type { ScreenshotTimelineItem } from "./types";

interface ScreenshotsProps {
  finalScreenshot?: string;
  screenshotTimeline?: ScreenshotTimelineItem[];
  // Fallback for old data structure
  lighthouseScreenshot?: string;
  additionalImages?: Array<{ signedUrl: string }>;
}

function formatTiming(timing: number): string {
  if (timing < 1000) {
    return `${timing}ms`;
  }
  return `${(timing / 1000).toFixed(2)}s`;
}

export function Screenshots({
  finalScreenshot,
  screenshotTimeline,
  lighthouseScreenshot,
  additionalImages,
}: ScreenshotsProps) {
  // Use new structure if available, otherwise fall back to old structure
  const finalImage = finalScreenshot || lighthouseScreenshot;
  const timeline = screenshotTimeline
    ? [...screenshotTimeline].sort((a, b) => a.timing - b.timing)
    : additionalImages?.map((img, index) => ({
        timing: 0,
        timestamp: 0,
        data: img.signedUrl,
      })) || [];

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold">Page Screenshots</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Final Screenshot */}
        {finalImage && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Camera className="w-4 h-4" />
              <span>Final Screenshot</span>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <div className="relative group cursor-pointer overflow-hidden rounded-lg border bg-muted/50 max-w-md">
                  <img
                    src={finalImage}
                    alt="Final Screenshot"
                    className="w-full h-auto max-h-[200px] object-contain"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="text-white text-sm font-medium">Click to enlarge</span>
                  </div>
                </div>
              </DialogTrigger>
              <DialogContent className="max-w-3xl">
                <DialogTitle className="sr-only">Final Screenshot</DialogTitle>
                <img src={finalImage} alt="Final Screenshot" className="w-full h-auto" />
              </DialogContent>
            </Dialog>
          </div>
        )}

        {/* Page Load Timeline - Horizontal Scroll with wider aspect ratio */}
        {timeline.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Play className="w-4 h-4" />
              <span>Page Load Timeline ({timeline.length} frames)</span>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2 -mx-2 px-2">
              {timeline.map((item, index) => (
                <Dialog key={index}>
                  <DialogTrigger asChild>
                    <div className="relative group cursor-pointer overflow-hidden rounded-lg border bg-muted/50 flex-shrink-0">
                      <img
                        src={item.data}
                        alt={`Frame at ${formatTiming(item.timing)}`}
                        className="w-[180px] h-[120px] object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="text-white text-xs font-medium">View</span>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent text-white text-xs text-center py-2 font-medium">
                        <div className="flex items-center justify-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{formatTiming(item.timing)}</span>
                        </div>
                      </div>
                    </div>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogTitle className="sr-only">
                      Frame {index + 1} of {timeline.length} - {formatTiming(item.timing)}
                    </DialogTitle>
                    <div className="text-center mb-2 text-sm text-muted-foreground">
                      Frame {index + 1} of {timeline.length} - {formatTiming(item.timing)}
                    </div>
                    <img
                      src={item.data}
                      alt={`Frame at ${formatTiming(item.timing)}`}
                      className="w-full h-auto rounded"
                    />
                  </DialogContent>
                </Dialog>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
