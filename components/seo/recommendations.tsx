"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { AlertTriangle, AlertCircle, Info, Lightbulb, ArrowRight } from "lucide-react";
import type { Recommendation, Issues } from "./types";
import { getPriorityColor, getPriorityBorderColor } from "./seo-utils";

interface RecommendationsProps {
  recommendations: Recommendation[];
  issues?: Issues;
}

export function Recommendations({ recommendations, issues }: RecommendationsProps) {
  const sortedRecs = [...recommendations].sort((a, b) => {
    const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
    return (
      (priorityOrder[a.priority as keyof typeof priorityOrder] ?? 4) -
      (priorityOrder[b.priority as keyof typeof priorityOrder] ?? 4)
    );
  });

  const criticalCount = recommendations.filter((r) => r.priority === "critical").length;
  const highCount = recommendations.filter((r) => r.priority === "high").length;
  const mediumCount = recommendations.filter((r) => r.priority === "medium").length;
  const lowCount = recommendations.filter((r) => r.priority === "low").length;

  const hasCriticalIssues = issues?.critical && issues.critical.length > 0;
  const hasWarnings = issues?.warnings && issues.warnings.length > 0;
  const hasNotices = issues?.notices && issues.notices.length > 0;
  const hasAnyIssues = hasCriticalIssues || hasWarnings || hasNotices;

  return (
    <div className="space-y-6">
      {/* Issues Summary */}
      {hasAnyIssues && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold">Issues Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              {/* Critical Issues */}
              {hasCriticalIssues && (
                <div className="p-4 rounded-lg bg-red-500/5 border border-red-500/20">
                  <div className="flex items-center gap-2 mb-3">
                    <AlertCircle className="w-5 h-5 text-red-500" />
                    <span className="font-medium text-red-500">
                      Critical ({issues.critical.length})
                    </span>
                  </div>
                  <div className="space-y-2">
                    {issues.critical.map((issue, i) => (
                      <div key={i} className="text-sm">
                        <span className="font-medium capitalize">{issue.type}:</span>{" "}
                        <span className="text-muted-foreground">{issue.message}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Warnings */}
              {hasWarnings && (
                <div className="p-4 rounded-lg bg-amber-500/5 border border-amber-500/20">
                  <div className="flex items-center gap-2 mb-3">
                    <AlertTriangle className="w-5 h-5 text-amber-500" />
                    <span className="font-medium text-amber-500">
                      Warnings ({issues.warnings.length})
                    </span>
                  </div>
                  <div className="space-y-2">
                    {issues.warnings.map((issue, i) => (
                      <div key={i} className="text-sm">
                        <span className="font-medium capitalize">{issue.type}:</span>{" "}
                        <span className="text-muted-foreground">{issue.message}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Notices */}
              {hasNotices && (
                <div className="p-4 rounded-lg bg-blue-500/5 border border-blue-500/20">
                  <div className="flex items-center gap-2 mb-3">
                    <Info className="w-5 h-5 text-blue-500" />
                    <span className="font-medium text-blue-500">
                      Notices ({issues.notices.length})
                    </span>
                  </div>
                  <div className="space-y-2">
                    {issues.notices.map((issue, i) => (
                      <div key={i} className="text-sm">
                        <span className="font-medium capitalize">{issue.type}:</span>{" "}
                        <span className="text-muted-foreground">{issue.message}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recommendations */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <CardTitle className="text-lg font-semibold">Recommendations</CardTitle>
            <div className="flex gap-2 flex-wrap">
              {criticalCount > 0 && (
                <Badge className="border bg-red-500/10 text-red-500">
                  {criticalCount} Critical
                </Badge>
              )}
              {highCount > 0 && (
                <Badge className="border bg-amber-500/10 text-amber-500">
                  {highCount} High
                </Badge>
              )}
              {mediumCount > 0 && (
                <Badge className="border bg-blue-500/10 text-blue-500">
                  {mediumCount} Medium
                </Badge>
              )}
              {lowCount > 0 && (
                <Badge className="border bg-slate-500/10 text-slate-500">
                  {lowCount} Low
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {sortedRecs.length === 0 ? (
            <div className="flex items-center justify-center py-8 text-center">
              <div>
                <p className="text-lg font-medium">Great job!</p>
                <p className="text-sm text-muted-foreground">No recommendations at this time.</p>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {sortedRecs.map((rec, index) => (
                <div
                  key={index}
                  className={cn(
                    "p-4 rounded-lg border border-l-4 bg-muted/30",
                    getPriorityBorderColor(rec.priority)
                  )}
                >
                  <div className="flex items-start gap-3">
                    <Lightbulb className="w-5 h-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge className={cn("text-xs capitalize border", getPriorityColor(rec.priority))}>
                          {rec.priority}
                        </Badge>
                        <Badge className="text-xs capitalize border">
                          {rec.category}
                        </Badge>
                        <span className="font-medium">{rec.issue}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{rec.impact}</p>
                      <div className="flex items-start gap-2 p-3 rounded bg-background border">
                        <ArrowRight className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        <p className="text-sm">{rec.recommendation}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
