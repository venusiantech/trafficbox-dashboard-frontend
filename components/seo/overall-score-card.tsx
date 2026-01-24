"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Download, Loader2 } from "lucide-react";
import { getScoreColor, getScoreBgColor, getScoreTextColor, getGradeBadgeColor } from "./seo-utils";
import type { SEOScores } from "./types";

interface OverallScoreCardProps {
  totalScore: number;
  grade: string;
  scoreStatus: string;
  url: string;
  processingTime: number;
  createdAt: string;
  analysisId?: string;
  scores: SEOScores;
  onDownloadPDF?: () => void;
  isGeneratingPDF?: boolean;
}

export function OverallScoreCard({
  totalScore,
  grade,
  scoreStatus,
  url,
  processingTime,
  createdAt,
  analysisId,
  scores,
  onDownloadPDF,
  isGeneratingPDF = false,
}: OverallScoreCardProps) {
  const formattedDate = new Date(createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  const domain = url ? new URL(url).hostname : "";

  const categoryConfig = [
    { key: "meta" as const, label: "Meta" },
    { key: "content" as const, label: "Content" },
    { key: "technical" as const, label: "Technical" },
    { key: "performance" as const, label: "Performance" },
    { key: "mobile" as const, label: "Mobile" },
    { key: "security" as const, label: "Security" },
    { key: "accessibility" as const, label: "Accessibility" },
  ];

  return (
    <div className="space-y-6">
      {/* SEO Analysis Report Header Card */}
      <Card className="overflow-hidden">
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="flex-1 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-1 h-6 bg-purple-600 rounded-full flex-shrink-0" />
                <h2 className="text-lg sm:text-xl font-semibold text-gray-800">SEO Analysis Report</h2>
              </div>
              
              <div className="space-y-3 sm:space-y-4 text-sm sm:text-base ml-4">
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                  <span className="font-medium text-gray-600 min-w-[80px]">URL:</span>
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline break-all"
                  >
                    {url}
                  </a>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                  <span className="font-medium text-gray-600 min-w-[80px]">Domain:</span>
                  <span className="text-gray-700 break-all">{domain}</span>
                </div>
                {analysisId && (
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                    <span className="font-medium text-gray-600 min-w-[80px]">Analysis ID:</span>
                    <span className="px-2 py-1 bg-blue-50 border border-blue-200 rounded text-blue-700 font-mono text-xs break-all inline-block">
                      {analysisId}
                    </span>
                  </div>
                )}
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                  <span className="font-medium text-gray-600 min-w-[80px]">Generated:</span>
                  <span className="text-gray-700">{formattedDate}</span>
                </div>
              </div>
            </div>
            
            {onDownloadPDF && (
              <Button
                onClick={onDownloadPDF}
                disabled={isGeneratingPDF}
                className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white gap-2 flex-shrink-0"
              >
                {isGeneratingPDF ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    Download PDF
                  </>
                )}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Overall Score Card with Category Scores */}
      <Card className="overflow-hidden">
        <CardContent className="p-6">
          <div className="flex items-start gap-3 mb-6">
            <div className="w-1 h-6 bg-purple-600 rounded-full" />
            <h2 className="text-xl font-semibold text-gray-800">Overall Score</h2>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Side - Overall Score */}
            <div className="w-full lg:w-[30%] my-auto text-center space-y-4">
              <div className="text-6xl font-bold text-gray-800">{totalScore}</div>
              
              <div className="px-3 py-1.5 bg-gray-100 rounded-lg inline-block">
                <span className="text-sm font-semibold text-gray-700">Grade: {grade}</span>
              </div>
              
              <p className="text-sm text-gray-500 capitalize">
                {scoreStatus.replace(/_/g, " ")}
              </p>
            </div>

            {/* Right Side - Category Scores Grid */}
            <div className="w-full lg:w-[70%]">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {categoryConfig.map(({ key, label }) => {
                  const score = scores[key];
                  return (
                    <div
                      key={key}
                      className="p-4 bg-white border border-gray-200 rounded-lg space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">{label}</span>
                        <span className={cn("text-sm font-bold", getScoreTextColor(score))}>
                          {score}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={cn("h-2 rounded-full transition-all", getScoreBgColor(score))}
                          style={{ width: `${score}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
