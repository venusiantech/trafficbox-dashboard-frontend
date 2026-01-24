"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { CheckCircle, XCircle, AlertCircle } from "lucide-react";
import type { MetaInformation as MetaInformationType } from "./types";
import { getStatusColor } from "./seo-utils";

interface MetaInformationProps {
  metaInformation: MetaInformationType;
}

function StatusIcon({ status }: { status: string }) {
  switch (status.toLowerCase()) {
    case "good":
    case "present":
      return <CheckCircle className="w-4 h-4 text-emerald-500" />;
    case "warning":
    case "not_present":
      return <AlertCircle className="w-4 h-4 text-amber-500" />;
    case "error":
      return <XCircle className="w-4 h-4 text-red-500" />;
    default:
      return <AlertCircle className="w-4 h-4 text-blue-500" />;
  }
}

export function MetaInformation({ metaInformation }: MetaInformationProps) {
  const {
    title,
    description,
    keywords,
    canonical,
    open_graph,
    twitter_card,
    viewport,
    charset,
    language,
  } = metaInformation;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold">Meta Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Title Tag */}
        <div className="p-4 rounded-lg border bg-muted/30">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <StatusIcon status={title.status} />
              <span className="font-medium">Title Tag</span>
            </div>
            <Badge className={cn(getStatusColor(title.status))}>
              {title.length} characters
            </Badge>
          </div>
          <p className="text-sm bg-background p-3 rounded border">{title.content || "No title found"}</p>
          {title.recommendations.length > 0 && (
            <ul className="list-disc list-inside text-sm text-amber-600 mt-2">
              {title.recommendations.map((rec, i) => (
                <li key={i}>{rec}</li>
              ))}
            </ul>
          )}
        </div>

        {/* Meta Description */}
        <div className="p-4 rounded-lg border bg-muted/30">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <StatusIcon status={description.status} />
              <span className="font-medium">Meta Description</span>
            </div>
            <Badge className={cn(getStatusColor(description.status))}>
              {description.length} characters
            </Badge>
          </div>
          <p className="text-sm bg-background p-3 rounded border">
            {description.content || "No description found"}
          </p>
          {description.recommendations.length > 0 && (
            <ul className="list-disc list-inside text-sm text-amber-600 mt-2">
              {description.recommendations.map((rec, i) => (
                <li key={i}>{rec}</li>
              ))}
            </ul>
          )}
        </div>

        {/* Two column grid for smaller items */}
        <div className="grid md:grid-cols-2 gap-4">
          {/* Meta Keywords */}
          <div className="p-4 rounded-lg border bg-muted/30">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <StatusIcon status={keywords.status} />
                <span className="font-medium">Meta Keywords</span>
              </div>
              <Badge className={cn(getStatusColor(keywords.status))}>
                {keywords.status.replace(/_/g, " ")}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              {keywords.content || "No keywords specified"}
            </p>
          </div>

          {/* Canonical URL */}
          <div className="p-4 rounded-lg border bg-muted/30">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <StatusIcon status={canonical.status} />
                <span className="font-medium">Canonical URL</span>
              </div>
              <Badge className={cn(getStatusColor(canonical.status))}>
                {canonical.exists ? "Present" : "Missing"}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground break-all">
              {canonical.url || "No canonical URL specified"}
            </p>
          </div>
        </div>

        {/* Social Tags Grid */}
        <div className="grid md:grid-cols-2 gap-4">
          {/* Open Graph */}
          <div className="p-4 rounded-lg border bg-muted/30">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <StatusIcon status={open_graph.status} />
                <span className="font-medium">Open Graph Tags</span>
              </div>
              <Badge className={cn(getStatusColor(open_graph.status))}>
                {open_graph.status}
              </Badge>
            </div>
            {open_graph.missing_tags.length > 0 ? (
              <div className="flex flex-wrap gap-1">
                {open_graph.missing_tags.map((tag, i) => (
                  <Badge key={i} className="text-xs text-amber-600 border-amber-500/30">
                    {tag}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-sm text-emerald-600">All tags present</p>
            )}
          </div>

          {/* Twitter Card */}
          <div className="p-4 rounded-lg border bg-muted/30">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <StatusIcon status={twitter_card.status} />
                <span className="font-medium">Twitter Card Tags</span>
              </div>
              <Badge className={cn(getStatusColor(twitter_card.status))}>
                {twitter_card.status}
              </Badge>
            </div>
            {twitter_card.missing_tags.length > 0 ? (
              <div className="flex flex-wrap gap-1">
                {twitter_card.missing_tags.map((tag, i) => (
                  <Badge key={i} className="text-xs text-amber-600 border-amber-500/30">
                    {tag}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-sm text-emerald-600">All tags present</p>
            )}
          </div>
        </div>

        {/* Technical Meta */}
        <div className="grid md:grid-cols-3 gap-4">
          {/* Viewport */}
          <div className="p-4 rounded-lg border bg-muted/30">
            <div className="flex items-center gap-2 mb-2">
              <StatusIcon status={viewport.status} />
              <span className="font-medium">Viewport</span>
            </div>
            <p className="text-xs font-mono text-muted-foreground break-all">
              {viewport.content || "Not configured"}
            </p>
          </div>

          {/* Charset */}
          <div className="p-4 rounded-lg border bg-muted/30">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-4 h-4 text-emerald-500" />
              <span className="font-medium">Charset</span>
            </div>
            <p className="text-sm font-mono">{charset || "Not specified"}</p>
          </div>

          {/* Language */}
          <div className="p-4 rounded-lg border bg-muted/30">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-4 h-4 text-emerald-500" />
              <span className="font-medium">Language</span>
            </div>
            <p className="text-sm font-mono uppercase">{language || "Not specified"}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
