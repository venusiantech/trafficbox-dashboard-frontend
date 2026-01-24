"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Mobile } from "./types";

interface MobileAnalysisProps {
  mobile: Mobile;
}

export function MobileAnalysis({ mobile }: MobileAnalysisProps) {
  const { viewport_configured, responsive_design, media_queries, is_mobile_friendly, score } = mobile;

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">Mobile Analysis</CardTitle>
          <Badge
            className={cn(
              "border",
              score >= 80
                ? "bg-emerald-500/10 text-emerald-500"
                : score >= 60
                ? "bg-amber-500/10 text-amber-500"
                : "bg-red-500/10 text-red-500"
            )}
          >
            Score: {score}%
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>Mobile Score</span>
            <span className="font-medium">{score}%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div
              className={cn(
                "h-2 rounded-full transition-all",
                score >= 80 ? "bg-emerald-500" : score >= 60 ? "bg-amber-500" : "bg-red-500"
              )}
              style={{ width: `${score}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
            <div className={cn("w-3 h-3 rounded-full flex-shrink-0", viewport_configured ? "bg-emerald-500" : "bg-red-500")} />
            <div>
              <p className="text-sm font-medium">Viewport</p>
              <p className="text-xs text-muted-foreground">{viewport_configured ? "Configured" : "Not Set"}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
            <div className={cn("w-3 h-3 rounded-full flex-shrink-0", responsive_design ? "bg-emerald-500" : "bg-red-500")} />
            <div>
              <p className="text-sm font-medium">Responsive</p>
              <p className="text-xs text-muted-foreground">{responsive_design ? "Yes" : "No"}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
            <div className="w-6 h-6 flex items-center justify-center text-primary font-bold text-sm flex-shrink-0 bg-primary/10 rounded">
              {media_queries}
            </div>
            <div>
              <p className="text-sm font-medium">Media Queries</p>
              <p className="text-xs text-muted-foreground">Found</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
            <div className={cn("w-3 h-3 rounded-full flex-shrink-0", is_mobile_friendly ? "bg-emerald-500" : "bg-red-500")} />
            <div>
              <p className="text-sm font-medium">Mobile Friendly</p>
              <p className="text-xs text-muted-foreground">{is_mobile_friendly ? "Yes" : "No"}</p>
            </div>
          </div>
        </div>

        {is_mobile_friendly && (
          <div className="flex items-center gap-2 p-3 bg-emerald-500/10 rounded-lg text-emerald-600">
            <span className="text-sm font-medium">✓ This page is optimized for mobile devices</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
