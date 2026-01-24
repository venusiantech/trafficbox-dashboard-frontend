"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { FileText, Clock, Hash, TrendingUp } from "lucide-react";
import type { ContentAnalysis as ContentAnalysisType, Headings } from "./types";
import { getDifficultyColor, getScoreTextColor } from "./seo-utils";

interface ContentAnalysisProps {
  contentAnalysis: ContentAnalysisType;
  headings: Headings;
}

export function ContentAnalysis({ contentAnalysis, headings }: ContentAnalysisProps) {
  const { word_count, character_count, readability, top_keywords, reading_time_minutes, score } =
    contentAnalysis;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold">Content Analysis</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
            <div className="p-2 rounded-lg bg-blue-500/10 flex-shrink-0">
              <FileText className="w-5 h-5 text-blue-500" />
            </div>
            <div className="min-w-0">
              <p className="text-xl md:text-2xl font-bold">{word_count.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">Words</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
            <div className="p-2 rounded-lg bg-purple-500/10 flex-shrink-0">
              <Hash className="w-5 h-5 text-purple-500" />
            </div>
            <div className="min-w-0">
              <p className="text-xl md:text-2xl font-bold">{character_count.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">Characters</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
            <div className="p-2 rounded-lg bg-amber-500/10 flex-shrink-0">
              <Clock className="w-5 h-5 text-amber-500" />
            </div>
            <div className="min-w-0">
              <p className="text-xl md:text-2xl font-bold">{reading_time_minutes}</p>
              <p className="text-xs text-muted-foreground">Min Read</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
            <div className="p-2 rounded-lg bg-emerald-500/10 flex-shrink-0">
              <TrendingUp className="w-5 h-5 text-emerald-500" />
            </div>
            <div className="min-w-0">
              <p className={cn("text-xl md:text-2xl font-bold", getScoreTextColor(score))}>{score}%</p>
              <p className="text-xs text-muted-foreground">Content Score</p>
            </div>
          </div>
        </div>

        {/* Readability Section */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-muted-foreground">Readability</h4>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 sm:gap-6 p-4 bg-muted/50 rounded-lg">
            <div className="flex-1 border-b sm:border-b-0 sm:border-r border-border pb-4 sm:pb-0 sm:pr-6">
              <p className="text-xs text-muted-foreground mb-1">Flesch Reading Ease</p>
              <p className="text-xl sm:text-2xl font-bold">{readability.flesch_reading_ease.toFixed(1)}</p>
            </div>
            <div className="flex-1 border-b sm:border-b-0 sm:border-r border-border pb-4 sm:pb-0 sm:pr-6">
              <p className="text-xs text-muted-foreground mb-1">Flesch-Kincaid Grade</p>
              <p className="text-xl sm:text-2xl font-bold">{readability.flesch_kincaid_grade.toFixed(1)}</p>
            </div>
            <div className="flex-1">
              <p className="text-xs text-muted-foreground mb-1">Difficulty</p>
              <Badge className={cn("mt-1 capitalize", getDifficultyColor(readability.difficulty))}>
                {readability.difficulty.replace(/_/g, " ")}
              </Badge>
            </div>
          </div>
        </div>

        {/* Top Keywords */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-muted-foreground">Top Keywords</h4>
          <div className="flex flex-wrap gap-2">
            {top_keywords.map((kw, i) => (
              <div
                key={i}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20"
              >
                <span className="font-medium capitalize text-sm">{kw.keyword}</span>
                <span className="text-xs text-muted-foreground">
                  ({kw.count}x, {kw.density.toFixed(2)}%)
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Heading Structure */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-muted-foreground">Heading Structure</h4>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {[
              { label: "H1", count: headings.h1_count, warn: headings.h1_count !== 1 },
              { label: "H2", count: headings.h2_count },
              { label: "H3", count: headings.h3_count },
              { label: "H4", count: headings.h4_count },
              { label: "H5", count: headings.h5_count },
              { label: "H6", count: headings.h6_count },
            ].map((h) => (
              <div
                key={h.label}
                className={cn(
                  "text-center py-3 rounded-lg border",
                  h.warn
                    ? "border-amber-500 bg-amber-500/10"
                    : "border-border bg-muted/50"
                )}
              >
                <p className="text-xs text-muted-foreground uppercase">{h.label}</p>
                <p className="text-lg sm:text-xl font-bold">{h.count}</p>
              </div>
            ))}
          </div>
          {headings.issues.length > 0 && (
            <ul className="list-disc list-inside text-sm text-amber-600 mt-2">
              {headings.issues.map((issue, i) => (
                <li key={i}>{issue}</li>
              ))}
            </ul>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
