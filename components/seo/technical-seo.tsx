"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { TechnicalSEO as TechnicalSEOType, URLAnalysis } from "./types";

interface TechnicalSEOProps {
  technicalSEO: TechnicalSEOType;
  urlAnalysis: URLAnalysis;
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

export function TechnicalSEO({ technicalSEO, urlAnalysis }: TechnicalSEOProps) {
  const { ssl, structured_data, status_code, redirects, score } = technicalSEO;

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-500";
    if (score >= 60) return "text-amber-500";
    return "text-red-500";
  };

  return (
    <Card className="border-slate-200">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-semibold text-slate-900">Technical SEO</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-6">
          {/* Left Column - Technical SEO Metrics */}
          <div className="space-y-3">
            <MetricRow
              label="SSL/HTTPS"
              value={<YesNoBadge value={ssl.enabled} />}
            />
            <MetricRow
              label="Status Code"
              value={
                <span className={cn("text-sm font-medium", status_code === 200 ? "text-emerald-500" : "text-red-500")}>
                  {status_code}
                </span>
              }
            />
            <MetricRow
              label="Redirects"
              value={<span className="text-sm text-slate-700">{redirects}</span>}
            />
            <MetricRow
              label="Structured Data"
              value={<YesNoBadge value={structured_data.exists} />}
            />
            {structured_data.exists && structured_data.count > 0 && (
              <MetricRow
                label="Structured Data Types"
                value={<span className="text-sm text-slate-700">{structured_data.count}</span>}
              />
            )}
            <MetricRow
              label="URL Length"
              value={<span className="text-sm text-slate-700">{urlAnalysis.length}</span>}
            />
            <MetricRow
              label="URL Depth"
              value={<span className="text-sm text-slate-700">{urlAnalysis.depth}</span>}
            />
            <MetricRow
              label="Technical SEO Score"
              value={<span className={cn("text-sm font-medium", getScoreColor(score))}>{score}</span>}
            />
          </div>

          {/* Right Column - URL Analysis */}
          <div className="space-y-3">
            <MetricRow
              label="Is Readable"
              value={<YesNoBadge value={urlAnalysis.is_readable} />}
            />
            <MetricRow
              label="Has Keywords"
              value={<YesNoBadge value={urlAnalysis.has_keywords} />}
            />
            <MetricRow
              label="Uses Hyphens"
              value={<YesNoBadge value={urlAnalysis.uses_hyphens} />}
            />
            <MetricRow
              label="No Underscores"
              value={<YesNoBadge value={!urlAnalysis.uses_underscores} warn={urlAnalysis.uses_underscores} />}
            />
            <MetricRow
              label="Clean URL"
              value={<YesNoBadge value={!urlAnalysis.has_parameters} />}
            />
            {structured_data.types.length > 0 && (
              <div className="pt-2">
                <p className="text-xs font-medium text-slate-500 mb-2">Structured Data Types:</p>
                <div className="flex flex-wrap gap-1.5">
                  {structured_data.types.map((type, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200"
                    >
                      {type}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {urlAnalysis.issues.length > 0 && (
              <div className="pt-2">
                <p className="text-xs font-medium text-slate-500 mb-2">Issues:</p>
                <ul className="space-y-1">
                  {urlAnalysis.issues.map((issue, i) => (
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
