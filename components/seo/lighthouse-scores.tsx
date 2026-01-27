"use client";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { LighthouseScores as LighthouseScoresType } from "./types";
import { getScoreTextColor } from "./seo-utils";

interface LighthouseScoresProps {
  lighthouseScores: LighthouseScoresType;
}

export function LighthouseScores({ lighthouseScores }: LighthouseScoresProps) {
  const scores = [
    { score: lighthouseScores.performance, label: "Performance" },
    { score: lighthouseScores.accessibility, label: "Accessibility" },
    { score: lighthouseScores.bestPractices, label: "Best Practices" },
    { score: lighthouseScores.seo, label: "SEO" },
    { score: lighthouseScores.pwa, label: "PWA" },
  ].filter((item): item is { score: number; label: string } => item.score !== null);

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6 sm:p-8">
        <div className="flex items-start gap-4 mb-6">
          <div className="w-1 h-8 bg-purple-600 rounded-full" />
          <h2 className="text-2xl font-semibold text-gray-800">Lighthouse Scores</h2>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {scores.map(({ score, label }) => (
            <div
              key={label}
              className="p-4 bg-gray-50 border border-gray-200 rounded-lg"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">{label}</span>
                <span className={cn("text-lg font-bold", getScoreTextColor(score))}>
                  {score}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
