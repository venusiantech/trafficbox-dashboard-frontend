"use client"

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface MapStatsOverlayProps {
  stats: Array<{
    label: string;
    value: string | number;
    change?: string;
    trend?: "up" | "down";
  }>;
  className?: string;
}

const MapStatsOverlay = ({ stats, className }: MapStatsOverlayProps) => {
  return (
    <>
      <h2 className="text-xl z-10 absolute top-4 left-6 border-b-2 border-dashed text-default-900">Realtime Overview</h2>
    <div className={cn("absolute bottom-4 left-4 z-10 space-y-3", className)}>
      {stats.map((stat, index) => (
        <Card
          key={index}
          className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 shadow-lg border-default-200"
        >
          <CardContent className="p-4">
            <div className="text-xs text-default-600 uppercase tracking-wide mb-1 font-medium">
              {stat.label}
            </div>
            <div className="text-3xl font-bold text-default-900">
              {stat.value}
            </div>
            {stat.change && (
              <div className={cn(
                "text-xs mt-1 font-medium",
                stat.trend === "up" ? "text-success" : "text-destructive"
              )}>
                {stat.change}
              </div>
            )}
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
};

export default MapStatsOverlay;

