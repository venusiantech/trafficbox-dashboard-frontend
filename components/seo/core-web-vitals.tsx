"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Metrics } from "./types";
import { getMetricStatus, getStatusColor } from "./seo-utils";

interface CoreWebVitalsProps {
  metrics: Metrics;
}

interface VitalConfig {
  key: keyof Metrics;
  label: string;
  shortLabel: string;
  unit: string;
  thresholds: { good: number; needsImprovement: number };
  format: (value: number) => string;
}

const vitalsConfig: VitalConfig[] = [
  {
    key: "firstContentfulPaint",
    label: "First Contentful Paint",
    shortLabel: "FCP",
    unit: "s",
    thresholds: { good: 1800, needsImprovement: 3000 },
    format: (v) => (v / 1000).toFixed(2),
  },
  {
    key: "largestContentfulPaint",
    label: "Largest Contentful Paint",
    shortLabel: "LCP",
    unit: "s",
    thresholds: { good: 2500, needsImprovement: 4000 },
    format: (v) => (v / 1000).toFixed(2),
  },
  {
    key: "totalBlockingTime",
    label: "Total Blocking Time",
    shortLabel: "TBT",
    unit: "ms",
    thresholds: { good: 200, needsImprovement: 600 },
    format: (v) => Math.round(v).toString(),
  },
  {
    key: "cumulativeLayoutShift",
    label: "Cumulative Layout Shift",
    shortLabel: "CLS",
    unit: "",
    thresholds: { good: 0.1, needsImprovement: 0.25 },
    format: (v) => v.toFixed(3),
  },
  {
    key: "speedIndex",
    label: "Speed Index",
    shortLabel: "SI",
    unit: "s",
    thresholds: { good: 3400, needsImprovement: 5800 },
    format: (v) => (v / 1000).toFixed(2),
  },
  {
    key: "timeToInteractive",
    label: "Time to Interactive",
    shortLabel: "TTI",
    unit: "s",
    thresholds: { good: 3800, needsImprovement: 7300 },
    format: (v) => (v / 1000).toFixed(2),
  },
];

export function CoreWebVitals({ metrics }: CoreWebVitalsProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold">Core Web Vitals</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {vitalsConfig.map((vital) => {
            const value = metrics[vital.key];
            const status = getMetricStatus(
              value,
              vital.thresholds.good,
              vital.thresholds.needsImprovement
            );
            const statusString =
              status === "good"
                ? "good"
                : status === "needs-improvement"
                ? "needs-improvement"
                : status === "poor"
                ? "poor"
                : "N/A";

            return (
              <div
                key={vital.key}
                className="flex flex-col items-center p-4 rounded-lg border bg-muted/30"
              >
                <div className="text-center mb-2">
                  <p className="text-xs text-muted-foreground mb-1">{vital.shortLabel}</p>
                  <p className="text-lg font-bold">
                    {value !== null ? `${vital.format(value)}${vital.unit}` : "N/A"}
                  </p>
                </div>
                <Badge className={cn(getStatusColor(statusString))}>
                  {statusString.replace("-", " ")}
                </Badge>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}