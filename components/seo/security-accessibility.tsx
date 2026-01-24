"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Security, Accessibility as AccessibilityType } from "./types";

interface SecurityAccessibilityProps {
  security: Security;
  accessibility: AccessibilityType;
}

export function SecurityAccessibility({ security, accessibility }: SecurityAccessibilityProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold">Security & Accessibility</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Security</h4>
              <Badge
                className={cn(
                  "border",
                  security.score >= 80
                    ? "bg-emerald-500/10 text-emerald-500"
                    : security.score >= 60
                    ? "bg-amber-500/10 text-amber-500"
                    : "bg-red-500/10 text-red-500"
                )}
              >
                {security.score}%
              </Badge>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Security Score</span>
                <span className="font-medium">{security.score}%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className={cn(
                    "h-2 rounded-full transition-all",
                    security.score >= 80
                      ? "bg-emerald-500"
                      : security.score >= 60
                      ? "bg-amber-500"
                      : "bg-red-500"
                  )}
                  style={{ width: `${security.score}%` }}
                />
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
              <div
                className={cn(
                  "w-3 h-3 rounded-full",
                  security.https ? "bg-emerald-500" : "bg-red-500"
                )}
              />
              <div>
                <p className="text-sm font-medium">HTTPS</p>
                <p className="text-xs text-muted-foreground">
                  {security.https ? "Secure connection enabled" : "Not using HTTPS"}
                </p>
              </div>
            </div>

            {security.issues.length > 0 && (
              <ul className="list-disc list-inside text-sm text-amber-600">
                {security.issues.map((issue, i) => (
                  <li key={i}>{issue}</li>
                ))}
              </ul>
            )}
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Accessibility</h4>
              <Badge
                className={cn(
                  "border",
                  accessibility.score >= 80
                    ? "bg-emerald-500/10 text-emerald-500"
                    : accessibility.score >= 60
                    ? "bg-amber-500/10 text-amber-500"
                    : "bg-red-500/10 text-red-500"
                )}
              >
                {accessibility.score}%
              </Badge>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Accessibility Score</span>
                <span className="font-medium">{accessibility.score}%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className={cn(
                    "h-2 rounded-full transition-all",
                    accessibility.score >= 80
                      ? "bg-emerald-500"
                      : accessibility.score >= 60
                      ? "bg-amber-500"
                      : "bg-red-500"
                  )}
                  style={{ width: `${accessibility.score}%` }}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-muted/50 rounded-lg text-center">
                <p className="text-xl font-bold">{accessibility.aria_labels}</p>
                <p className="text-xs text-muted-foreground">ARIA Labels</p>
              </div>
              <div className="p-3 bg-muted/50 rounded-lg text-center">
                <p className="text-xl font-bold">{accessibility.alt_text_coverage}%</p>
                <p className="text-xs text-muted-foreground">Alt Text Coverage</p>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-medium text-muted-foreground">Semantic HTML Elements</p>
              <div className="flex flex-wrap gap-2">
                {Object.entries(accessibility.semantic_html).map(([tag, count]) => (
                  <Badge key={tag} color="secondary" className="text-xs">
                    &lt;{tag}&gt; × {count}
                  </Badge>
                ))}
              </div>
            </div>

            {accessibility.issues.length > 0 && (
              <ul className="list-disc list-inside text-sm text-amber-600">
                {accessibility.issues.map((issue, i) => (
                  <li key={i}>{issue}</li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
