"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { MetaInformation as MetaInformationType } from "./types";

interface MetaInformationProps {
  metaInformation: MetaInformationType;
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
    <Card className="border-slate-200">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-semibold text-slate-900">Meta Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Title Tag and Meta Description - Side by side on desktop */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Title Tag */}
          <div className="p-5 rounded-lg border border-slate-200 bg-white">
            <h3 className="text-sm font-semibold text-slate-900 mb-3">Title Tag</h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-slate-600 mb-1">Content:</p>
                <p className="text-sm text-slate-900 leading-relaxed">
                  {title.content || "No title found"}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-600">Length: <span className="text-slate-900 font-medium">{title.length} characters</span></p>
              </div>
              {title.recommendations.length > 0 && (
                <div className="pt-2 border-t border-slate-100">
                  <p className="text-xs font-medium text-slate-500 mb-1.5">Recommendations:</p>
                  <ul className="space-y-1">
                    {title.recommendations.map((rec, i) => (
                      <li key={i} className="text-xs text-slate-400 list-disc list-inside">
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Meta Description */}
          <div className="p-5 rounded-lg border border-slate-200 bg-white">
            <h3 className="text-sm font-semibold text-slate-900 mb-3">Meta Description</h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-slate-600 mb-1">Content:</p>
                <p className="text-sm text-slate-900 leading-relaxed">
                  {description.content || "No description found"}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-600">Length: <span className="text-slate-900 font-medium">{description.length} characters</span></p>
              </div>
              {description.recommendations.length > 0 && (
                <div className="pt-2 border-t border-slate-100">
                  <p className="text-xs font-medium text-slate-500 mb-1.5">Recommendations:</p>
                  <ul className="space-y-1">
                    {description.recommendations.map((rec, i) => (
                      <li key={i} className="text-xs text-slate-400 list-disc list-inside">
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Meta Keywords and Canonical URL - Side by side */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Meta Keywords */}
          <div className="p-5 rounded-lg border border-slate-200 bg-white">
            <h3 className="text-sm font-semibold text-slate-900 mb-3">Meta Keywords</h3>
            <p className="text-sm text-slate-600">
              {keywords.content || "No keywords specified"}
            </p>
          </div>

          {/* Canonical URL */}
          <div className="p-5 rounded-lg border border-slate-200 bg-white">
            <h3 className="text-sm font-semibold text-slate-900 mb-3">Canonical URL</h3>
            <p className="text-sm text-slate-600 break-all">
              {canonical.url || "No canonical URL specified"}
            </p>
          </div>
        </div>

        {/* Open Graph and Twitter Card - Side by side */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Open Graph */}
          <div className="p-5 rounded-lg border border-slate-200 bg-white">
            <h3 className="text-sm font-semibold text-slate-900 mb-3">Open Graph</h3>
            {open_graph.missing_tags.length > 0 ? (
              <div>
                <p className="text-xs font-medium text-slate-500 mb-2">Missing Tags:</p>
                <div className="flex flex-wrap gap-1.5">
                  {open_graph.missing_tags.map((tag, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-sm text-slate-600">All tags present</p>
            )}
          </div>

          {/* Twitter Card */}
          <div className="p-5 rounded-lg border border-slate-200 bg-white">
            <h3 className="text-sm font-semibold text-slate-900 mb-3">Twitter Card</h3>
            {twitter_card.missing_tags.length > 0 ? (
              <div>
                <p className="text-xs font-medium text-slate-500 mb-2">Missing Tags:</p>
                <div className="flex flex-wrap gap-1.5">
                  {twitter_card.missing_tags.map((tag, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-sm text-slate-600">All tags present</p>
            )}
          </div>
        </div>

        {/* Technical Meta - Three columns */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Viewport */}
          <div className="p-5 rounded-lg border border-slate-200 bg-white">
            <h3 className="text-sm font-semibold text-slate-900 mb-3">Viewport</h3>
            <p className="text-xs font-mono text-slate-600 break-all">
              {viewport.content || "Not configured"}
            </p>
          </div>

          {/* Charset */}
          <div className="p-5 rounded-lg border border-slate-200 bg-white">
            <h3 className="text-sm font-semibold text-slate-900 mb-3">Charset</h3>
            <p className="text-sm font-mono text-slate-600">{charset || "Not specified"}</p>
          </div>

          {/* Language */}
          <div className="p-5 rounded-lg border border-slate-200 bg-white">
            <h3 className="text-sm font-semibold text-slate-900 mb-3">Language</h3>
            <p className="text-sm font-mono uppercase text-slate-600">{language || "Not specified"}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
