"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Mobile } from "./types";

interface MobileAnalysisProps {
  mobile: Mobile;
}

function MetricRow({ label, value, valueColor }: { label: string; value: React.ReactNode; valueColor?: string }) {
  return (
    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
      <span className="text-sm text-slate-700">{label}</span>
      <span className={cn("text-sm font-medium", valueColor)}>{value}</span>
    </div>
  );
}

function YesNoBadge({ value, warn = false }: { value: boolean; warn?: boolean }) {
  if (warn && !value) {
    return (
      <Badge className="text-xs font-medium bg-amber-500 text-white">
        No
      </Badge>
    );
  }
  return (
    <Badge
      className={cn(
        "text-xs font-medium",
        value
          ? "bg-emerald-500 text-white"
          : "bg-red-500 text-white"
      )}
    >
      {value ? "Yes" : "No"}
    </Badge>
  );
}

export function MobileAnalysis({ mobile }: MobileAnalysisProps) {
  const { viewport_configured, responsive_design, media_queries, is_mobile_friendly, score } = mobile;

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-500";
    if (score >= 60) return "text-amber-500";
    return "text-red-500";
  };

  return (
    <Card className="border-slate-200">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-semibold text-slate-900">Mobile Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-6">
          {/* Left Column - Mobile Metrics */}
          <div className="space-y-3">
            <MetricRow
              label="Mobile Friendly"
              value={<YesNoBadge value={is_mobile_friendly} />}
            />
            <MetricRow
              label="Viewport Configured"
              value={<YesNoBadge value={viewport_configured} />}
            />
            <MetricRow
              label="Responsive Design"
              value={<YesNoBadge value={responsive_design} warn={!responsive_design} />}
            />
            <MetricRow
              label="Media Queries"
              value={<span className="text-sm text-slate-700">{media_queries}</span>}
            />
            <MetricRow
              label="Mobile Score"
              value={<span className={cn("text-sm font-medium", getScoreColor(score))}>{score}</span>}
            />
          </div>

          {/* Right Column - Empty or can be used for additional info */}
          <div className="space-y-3">
            {is_mobile_friendly && (
              <div className="p-3 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                <p className="text-sm text-emerald-700 font-medium">
                  ✓ This page is optimized for mobile devices
                </p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
