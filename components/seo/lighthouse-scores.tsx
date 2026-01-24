"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { LighthouseScores as LighthouseScoresType } from "./types";
import { getScoreTextColor, getScoreStrokeColor } from "./seo-utils";

interface LighthouseScoresProps {
  lighthouseScores: LighthouseScoresType;
}

function ScoreRing({ score, label }: { score: number | null; label: string }) {
  if (score === null) return null;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-20 h-20">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            className="text-muted/20"
          />
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            strokeWidth="8"
            strokeDasharray={`${(score / 100) * 251} 251`}
            strokeLinecap="round"
            className={getScoreStrokeColor(score)}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={cn("text-xl font-bold", getScoreTextColor(score))}>{score}</span>
        </div>
      </div>
      <span className="text-sm font-medium text-center">{label}</span>
    </div>
  );
}

export function LighthouseScores({ lighthouseScores }: LighthouseScoresProps) {
  const scores = [
    { score: lighthouseScores.performance, label: "Performance" },
    { score: lighthouseScores.accessibility, label: "Accessibility" },
    { score: lighthouseScores.bestPractices, label: "Best Practices" },
    { score: lighthouseScores.seo, label: "SEO" },
    { score: lighthouseScores.pwa, label: "PWA" },
  ].filter((item) => item.score !== null);

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold">Lighthouse Scores</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap justify-center gap-6 md:gap-10">
          {scores.map(({ score, label }) => (
            <ScoreRing key={label} score={score} label={label} />
          ))}
        </div>
        <div className="flex justify-center gap-6 mt-4 text-xs">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <span>0-49</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-amber-500" />
            <span>50-89</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-emerald-500" />
            <span>90-100</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
