"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import type { Recommendation, Issues } from "./types";
import { getPriorityColor } from "./seo-utils";

interface RecommendationsProps {
  recommendations: Recommendation[];
  issues?: Issues;
}

function PriorityBadge({ priority }: { priority: string }) {
  const colors = {
    critical: "bg-red-500 text-white",
    high: "bg-amber-500 text-white",
    medium: "bg-blue-500 text-white",
    low: "bg-slate-500 text-white",
  };
  return (
    <Badge className={cn("text-xs font-medium capitalize", colors[priority as keyof typeof colors] || colors.low)}>
      {priority}
    </Badge>
  );
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
        <Card className="border-slate-200">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-semibold text-slate-900">Issues Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {hasCriticalIssues && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-red-500">
                      Critical ({issues.critical.length})
                    </span>
                  </div>
                  <div className="space-y-1">
                    {issues.critical.map((issue, i) => (
                      <div key={i} className="text-sm text-slate-600 pl-4">
                        <span className="font-medium capitalize text-slate-700">{issue.type}:</span>{" "}
                        {issue.message}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {hasWarnings && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-amber-500">
                      Warnings ({issues.warnings.length})
                    </span>
                  </div>
                  <div className="space-y-1">
                    {issues.warnings.map((issue, i) => (
                      <div key={i} className="text-sm text-slate-600 pl-4">
                        <span className="font-medium capitalize text-slate-700">{issue.type}:</span>{" "}
                        {issue.message}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {hasNotices && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-blue-500">
                      Notices ({issues.notices.length})
                    </span>
                  </div>
                  <div className="space-y-1">
                    {issues.notices.map((issue, i) => (
                      <div key={i} className="text-sm text-slate-600 pl-4">
                        <span className="font-medium capitalize text-slate-700">{issue.type}:</span>{" "}
                        {issue.message}
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
      <Card className="border-slate-200">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <CardTitle className="text-xl font-semibold text-slate-900">Recommendations</CardTitle>
            <div className="flex gap-2 flex-wrap">
              {criticalCount > 0 && (
                <Badge className="text-xs bg-red-500 text-white">
                  {criticalCount} Critical
                </Badge>
              )}
              {highCount > 0 && (
                <Badge className="text-xs bg-amber-500 text-white">
                  {highCount} High
                </Badge>
              )}
              {mediumCount > 0 && (
                <Badge className="text-xs bg-blue-500 text-white">
                  {mediumCount} Medium
                </Badge>
              )}
              {lowCount > 0 && (
                <Badge className="text-xs bg-slate-500 text-white">
                  {lowCount} Low
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {sortedRecs.length === 0 ? (
            <div className="flex items-center justify-center py-12 text-center">
              <div>
                <p className="text-base font-medium text-slate-900">Great job!</p>
                <p className="text-sm text-slate-500 mt-1">No recommendations at this time.</p>
              </div>
            </div>
          ) : (
            <div className="rounded-lg border border-slate-200 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50">
                    <TableHead className="text-slate-900 font-semibold text-xs">Priority</TableHead>
                    <TableHead className="text-slate-900 font-semibold text-xs">Category</TableHead>
                    <TableHead className="text-slate-900 font-semibold text-xs">Issue</TableHead>
                    <TableHead className="text-slate-900 font-semibold text-xs">Recommendation</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedRecs.map((rec, index) => (
                    <TableRow key={index} className="hover:bg-slate-50/50">
                      <TableCell className="py-3">
                        <PriorityBadge priority={rec.priority} />
                      </TableCell>
                      <TableCell className="text-sm text-slate-700 capitalize py-3">
                        {rec.category}
                      </TableCell>
                      <TableCell className="text-sm text-slate-700 py-3">
                        <div>
                          <div className="font-medium">{rec.issue}</div>
                          {rec.impact && (
                            <div className="text-xs text-slate-500 mt-1">{rec.impact}</div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-slate-600 py-3">
                        {rec.recommendation}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
