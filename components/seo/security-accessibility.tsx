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
import type { Security, Accessibility as AccessibilityType } from "./types";

interface SecurityAccessibilityProps {
  security: Security;
  accessibility: AccessibilityType;
}

function MetricRow({ label, value, valueColor }: { label: string; value: React.ReactNode; valueColor?: string }) {
  return (
    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
      <span className="text-sm text-slate-700">{label}</span>
      <span className={cn("text-sm font-medium", valueColor)}>{value}</span>
    </div>
  );
}

function YesNoBadge({ value }: { value: boolean }) {
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

export function SecurityAccessibility({ security, accessibility }: SecurityAccessibilityProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-500";
    if (score >= 60) return "text-amber-500";
    return "text-red-500";
  };

  const semanticHtmlEntries = Object.entries(accessibility.semantic_html).filter(([_, count]) => count > 0);

  return (
    <Card className="border-slate-200">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-semibold text-slate-900">Security & Accessibility</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-6">
          {/* Left Column - Security */}
          <div className="space-y-3">
            <MetricRow
              label="HTTPS"
              value={<YesNoBadge value={security.https} />}
            />
            <MetricRow
              label="Security Score"
              value={<span className={cn("text-sm font-medium", getScoreColor(security.score))}>{security.score}</span>}
            />
            {semanticHtmlEntries.length > 0 && (
              <div className="pt-2">
                <p className="text-xs font-medium text-slate-500 mb-2">Semantic HTML Elements:</p>
                <div className="rounded-lg border border-slate-200 overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-slate-50">
                        <TableHead className="text-slate-900 font-semibold text-xs h-8 py-1">Element</TableHead>
                        <TableHead className="text-slate-900 font-semibold text-xs h-8 py-1 text-right">Count</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {semanticHtmlEntries.map(([tag, count]) => (
                        <TableRow key={tag} className="hover:bg-slate-50/50">
                          <TableCell className="text-xs text-slate-700 py-2">
                            &lt;{tag}&gt;
                          </TableCell>
                          <TableCell className="text-xs text-slate-700 text-right py-2">
                            {count}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}
            {security.issues.length > 0 && (
              <div className="pt-2">
                <p className="text-xs font-medium text-slate-500 mb-2">Issues:</p>
                <ul className="space-y-1">
                  {security.issues.map((issue, i) => (
                    <li key={i} className="text-xs text-slate-600 list-disc list-inside">
                      {issue}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Right Column - Accessibility */}
          <div className="space-y-3">
            <MetricRow
              label="ARIA Labels"
              value={<span className="text-sm text-slate-700">{accessibility.aria_labels}</span>}
            />
            <MetricRow
              label="Alt Text Coverage"
              value={<span className="text-sm text-slate-700">{accessibility.alt_text_coverage}%</span>}
            />
            <MetricRow
              label="Form Labels"
              value={<span className="text-sm text-slate-700">{accessibility.form_labels}</span>}
            />
            <MetricRow
              label="Accessibility Score"
              value={<span className={cn("text-sm font-medium", getScoreColor(accessibility.score))}>{accessibility.score}</span>}
            />
            {accessibility.issues.length > 0 && (
              <div className="pt-2">
                <p className="text-xs font-medium text-slate-500 mb-2">Issues:</p>
                <ul className="space-y-1">
                  {accessibility.issues.map((issue, i) => (
                    <li key={i} className="text-xs text-slate-600 list-disc list-inside">
                      {issue}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
