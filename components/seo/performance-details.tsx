"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { FileText, Image, Code, FileCode } from "lucide-react";
import type { FileSizes, Performance } from "./types";

interface PerformanceDetailsProps {
  fileSizes: FileSizes;
  performance: Performance;
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

function getSavingsPercentage(original: number, optimized: number): number {
  if (original === 0) return 0;
  return Math.round(((original - optimized) / original) * 100);
}

export function PerformanceDetails({ fileSizes, performance }: PerformanceDetailsProps) {
  const savingsPercent = getSavingsPercentage(
    fileSizes.originalResponseBytes,
    fileSizes.optimizedResponseBytes
  );

  const resources = performance?.resources || { scripts: 0, stylesheets: 0, images: 0 };
  const totalResources = resources.scripts + resources.stylesheets + resources.images;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold">Performance Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* File Sizes */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-muted-foreground">Page Size</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg bg-muted/50 border">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Original Size</span>
              </div>
              <p className="text-2xl font-bold">{formatBytes(fileSizes.originalResponseBytes)}</p>
            </div>
            <div className="p-4 rounded-lg bg-muted/50 border">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Optimized Size</span>
              </div>
              <p className="text-2xl font-bold">{formatBytes(fileSizes.optimizedResponseBytes)}</p>
            </div>
            <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm text-emerald-600 dark:text-emerald-400">Potential Savings</span>
              </div>
              <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                {savingsPercent}%
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {formatBytes(fileSizes.originalResponseBytes - fileSizes.optimizedResponseBytes)} saved
              </p>
            </div>
          </div>
        </div>

        {/* Resources */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-muted-foreground">Page Resources</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-lg bg-muted/50 border text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <FileCode className="w-4 h-4 text-blue-500" />
              </div>
              <p className="text-2xl font-bold">{resources.scripts}</p>
              <p className="text-xs text-muted-foreground">Scripts</p>
            </div>
            <div className="p-4 rounded-lg bg-muted/50 border text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Code className="w-4 h-4 text-purple-500" />
              </div>
              <p className="text-2xl font-bold">{resources.stylesheets}</p>
              <p className="text-xs text-muted-foreground">Stylesheets</p>
            </div>
            <div className="p-4 rounded-lg bg-muted/50 border text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Image className="w-4 h-4 text-amber-500" />
              </div>
              <p className="text-2xl font-bold">{resources.images}</p>
              <p className="text-xs text-muted-foreground">Images</p>
            </div>
            <div className="p-4 rounded-lg bg-muted/50 border text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <FileText className="w-4 h-4 text-muted-foreground" />
              </div>
              <p className="text-2xl font-bold">{totalResources}</p>
              <p className="text-xs text-muted-foreground">Total</p>
            </div>
          </div>
        </div>

        {/* Page Load Info */}
        {(performance?.page_load_time_ms > 0 || performance?.page_size_formatted) && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-muted-foreground">Load Metrics</h4>
            <div className="grid grid-cols-2 gap-4">
              {performance.page_load_time_ms > 0 && (
                <div className="p-4 rounded-lg bg-muted/50 border">
                  <p className="text-sm text-muted-foreground mb-1">Page Load Time</p>
                  <p className="text-xl font-bold">{performance.page_load_time_ms} ms</p>
                </div>
              )}
              {performance.page_size_formatted && (
                <div className="p-4 rounded-lg bg-muted/50 border">
                  <p className="text-sm text-muted-foreground mb-1">Page Size</p>
                  <p className="text-xl font-bold">{performance.page_size_formatted}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Performance Score */}
        {performance?.score !== undefined && (
          <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50 border">
            <div
              className={cn(
                "w-12 h-12 rounded-full flex items-center justify-center text-white font-bold",
                performance.score >= 90
                  ? "bg-emerald-500"
                  : performance.score >= 70
                  ? "bg-blue-500"
                  : performance.score >= 50
                  ? "bg-amber-500"
                  : "bg-red-500"
              )}
            >
              {performance.score}
            </div>
            <div>
              <p className="font-medium">Performance Score</p>
              <p className="text-sm text-muted-foreground">
                {performance.score >= 90
                  ? "Excellent performance"
                  : performance.score >= 70
                  ? "Good performance"
                  : performance.score >= 50
                  ? "Needs improvement"
                  : "Poor performance"}
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
