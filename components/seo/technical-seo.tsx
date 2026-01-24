"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { TechnicalSEO as TechnicalSEOType, URLAnalysis } from "./types";

interface TechnicalSEOProps {
  technicalSEO: TechnicalSEOType;
  urlAnalysis: URLAnalysis;
}

export function TechnicalSEO({ technicalSEO, urlAnalysis }: TechnicalSEOProps) {
  const { ssl, structured_data, status_code, redirects, score } = technicalSEO;

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">Technical SEO</CardTitle>
          <Badge
            className={cn(
              "border",
              score >= 80
                ? "bg-emerald-500/10 text-emerald-500"
                : score >= 60
                ? "bg-amber-500/10 text-amber-500"
                : "bg-red-500/10 text-red-500"
            )}
          >
            Score: {score}%
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
            <div
              className={cn(
                "w-3 h-3 rounded-full",
                ssl.enabled ? "bg-emerald-500" : "bg-red-500"
              )}
            />
            <div>
              <p className="text-sm font-medium">SSL/HTTPS</p>
              <p className="text-xs text-muted-foreground">
                {ssl.enabled ? "Enabled" : "Disabled"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
            <Badge
              className={cn(
                "border",
                status_code === 200
                  ? "bg-emerald-500/10 text-emerald-500"
                  : "bg-red-500/10 text-red-500"
              )}
            >
              {status_code}
            </Badge>
            <div>
              <p className="text-sm font-medium">Status Code</p>
              <p className="text-xs text-muted-foreground">HTTP Response</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
            <div
              className={cn(
                "w-3 h-3 rounded-full",
                redirects === 0 ? "bg-emerald-500" : "bg-amber-500"
              )}
            />
            <div>
              <p className="text-sm font-medium">{redirects} Redirects</p>
              <p className="text-xs text-muted-foreground">Redirect Chain</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
            <div
              className={cn(
                "w-3 h-3 rounded-full",
                structured_data.exists ? "bg-emerald-500" : "bg-amber-500"
              )}
            />
            <div>
              <p className="text-sm font-medium">Structured Data</p>
              <p className="text-xs text-muted-foreground">
                {structured_data.count} types found
              </p>
            </div>
          </div>
        </div>

        {structured_data.types.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium">Structured Data Types</p>
            <div className="flex flex-wrap gap-2">
              {structured_data.types.map((type, i) => (
                <Badge key={i} color="secondary">
                  {type}
                </Badge>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-3">
          <p className="text-sm font-medium">URL Analysis</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="p-3 bg-muted/50 rounded-lg text-center">
              <p className="text-xl font-bold">{urlAnalysis.length}</p>
              <p className="text-xs text-muted-foreground">Characters</p>
            </div>
            <div className="p-3 bg-muted/50 rounded-lg text-center">
              <p className="text-xl font-bold">{urlAnalysis.depth}</p>
              <p className="text-xs text-muted-foreground">Depth Level</p>
            </div>
            <div className="p-3 bg-muted/50 rounded-lg text-center">
              <div
                className={cn(
                  "w-3 h-3 rounded-full mx-auto mb-1",
                  urlAnalysis.is_readable ? "bg-emerald-500" : "bg-red-500"
                )}
              />
              <p className="text-xs text-muted-foreground">Readable</p>
            </div>
            <div className="p-3 bg-muted/50 rounded-lg text-center">
              <div
                className={cn(
                  "w-3 h-3 rounded-full mx-auto mb-1",
                  urlAnalysis.has_keywords ? "bg-emerald-500" : "bg-amber-500"
                )}
              />
              <p className="text-xs text-muted-foreground">Has Keywords</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Badge
              className={cn(
                "border",
                urlAnalysis.uses_hyphens
                  ? "bg-emerald-500/10 text-emerald-500"
                  : "bg-slate-500/10"
              )}
            >
              {urlAnalysis.uses_hyphens ? "✓" : "✗"} Uses Hyphens
            </Badge>
            <Badge
              className={cn(
                "border",
                !urlAnalysis.uses_underscores
                  ? "bg-emerald-500/10 text-emerald-500"
                  : "bg-amber-500/10 text-amber-500"
              )}
            >
              {!urlAnalysis.uses_underscores ? "✓" : "✗"} No Underscores
            </Badge>
            <Badge
              className={cn(
                "border",
                !urlAnalysis.has_parameters
                  ? "bg-emerald-500/10 text-emerald-500"
                  : "bg-amber-500/10 text-amber-500"
              )}
            >
              {!urlAnalysis.has_parameters ? "✓" : "✗"} Clean URL
            </Badge>
          </div>

          {urlAnalysis.issues.length > 0 && (
            <ul className="list-disc list-inside text-sm text-amber-600">
              {urlAnalysis.issues.map((issue, i) => (
                <li key={i}>{issue}</li>
              ))}
            </ul>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
