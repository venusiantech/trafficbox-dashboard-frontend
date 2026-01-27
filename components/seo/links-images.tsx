"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link2, ExternalLink, CheckCircle2, XCircle, Loader2, AlertCircle } from "lucide-react";
import type { Links, Images } from "./types";

interface LinksImagesProps {
  links: Links;
  images: Images;
}

export function LinksImages({ links, images }: LinksImagesProps) {
  const altTextCoverage = images.total > 0 ? (images.with_alt / images.total) * 100 : 0;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold">Links & Images</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Links Analysis */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium text-muted-foreground">Links Analysis</h4>
              <Badge className="text-xs border">{links.total} Total</Badge>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
                <div className="p-2 rounded-lg bg-primary-500/10 flex-shrink-0">
                  <Link2 className="w-5 h-5 text-primary-500" />
                </div>
                <div className="min-w-0">
                  <p className="text-xl font-bold text-primary-500">{links.internal}</p>
                  <p className="text-xs text-muted-foreground">Internal</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
                <div className="p-2 rounded-lg bg-primary-500/10 flex-shrink-0">
                  <ExternalLink className="w-5 h-5 text-primary-500" />
                </div>
                <div className="min-w-0">
                  <p className="text-xl font-bold text-primary-500">{links.external}</p>
                  <p className="text-xs text-muted-foreground">External</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
                <div className="p-2 rounded-lg bg-primary-500/10 flex-shrink-0">
                  <CheckCircle2 className="w-5 h-5 text-primary-500" />
                </div>
                <div className="min-w-0">
                  <p className="text-xl font-bold text-primary-500">{links.dofollow || 0}</p>
                  <p className="text-xs text-muted-foreground">Dofollow</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
                <div className="p-2 rounded-lg bg-slate-500/10 flex-shrink-0">
                  <XCircle className="w-5 h-5 text-slate-500" />
                </div>
                <div className="min-w-0">
                  <p className="text-xl font-bold text-slate-500">{links.nofollow || 0}</p>
                  <p className="text-xs text-muted-foreground">Nofollow</p>
                </div>
              </div>
            </div>

            {links.broken > 0 && (
              <div className="flex items-center gap-2 p-3 bg-red-500/10 rounded-lg border border-red-500/20">
                <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                <span className="text-sm font-medium text-red-500">{links.broken} Broken Links Found</span>
              </div>
            )}

            {links.issues && links.issues.length > 0 && (
              <div className="space-y-1">
                {links.issues.map((issue, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm text-slate-600">
                    <span className="text-slate-500 mt-0.5">•</span>
                    <span>{issue}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Images Analysis */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium text-muted-foreground">Images Analysis</h4>
              <Badge className="text-xs border">{images.total} Total</Badge>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
                <div className="p-2 rounded-lg bg-primary-500/10 flex-shrink-0">
                  <CheckCircle2 className="w-5 h-5 text-primary-500" />
                </div>
                <div className="min-w-0">
                  <p className="text-xl font-bold text-primary-500">{images.with_alt}</p>
                  <p className="text-xs text-muted-foreground">With Alt Text</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
                <div className="p-2 rounded-lg bg-red-500/10 flex-shrink-0">
                  <XCircle className="w-5 h-5 text-red-500" />
                </div>
                <div className="min-w-0">
                  <p className="text-xl font-bold text-red-500">{images.without_alt}</p>
                  <p className="text-xs text-muted-foreground">Missing Alt Text</p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Alt Text Coverage</span>
                <span className="font-semibold text-primary-500">
                  {altTextCoverage.toFixed(0)}%
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary-500/10">
                  <Loader2 className="w-5 h-5 text-primary-500" />
                </div>
                <span className="text-sm font-medium">Lazy Loaded</span>
              </div>
              <Badge className="font-semibold border">{images.lazy_loaded || 0}</Badge>
            </div>

            {images.issues && images.issues.length > 0 && (
              <div className="space-y-1">
                {images.issues.map((issue, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm text-slate-600">
                    <span className="text-slate-500 mt-0.5">•</span>
                    <span>{issue}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
