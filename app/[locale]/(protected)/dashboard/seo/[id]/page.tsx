"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Loader2, AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

import {
  OverallScoreCard,
  LighthouseScores,
  CoreWebVitals,
  MetaInformation,
  ContentAnalysis,
  Recommendations,
  TechnicalSEO,
  LinksImages,
  SecurityAccessibility,
  MobileAnalysis,
  Screenshots,
  PerformanceDetails,
} from "@/components/seo";
import { useSEO } from "@/hooks/use-seo";
import { useSEOStore } from "@/context/seoStore";
import { generateSEOPDF } from "@/lib/seo-pdf-generator";
import { toast } from "sonner";
import { format } from "date-fns";

function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-[180px] w-full rounded-lg" />
      <Skeleton className="h-[120px] w-full rounded-lg" />
      <div className="grid md:grid-cols-2 gap-6">
        <Skeleton className="h-[200px] w-full rounded-lg" />
        <Skeleton className="h-[200px] w-full rounded-lg" />
      </div>
      <Skeleton className="h-[300px] w-full rounded-lg" />
      <Skeleton className="h-[200px] w-full rounded-lg" />
      <Skeleton className="h-[250px] w-full rounded-lg" />
    </div>
  );
}

function SectionDivider({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-4 pt-4">
      <Separator className="flex-1" />
      <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
        {title}
      </span>
      <Separator className="flex-1" />
    </div>
  );
}

export default function SEOAnalysisPage() {
  const params = useParams();
  const id = params?.id as string;

  const { currentAnalysis, isFetchingDetail, error } = useSEO();
  const { fetchAnalysisById } = useSEOStore();
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const handleDownloadPDF = async () => {
    if (!currentAnalysis) {
      toast.error("No analysis data available");
      return;
    }

    setIsGeneratingPDF(true);
    try {
      const pdfBlob = await generateSEOPDF(currentAnalysis, {
        title: "SEO Analysis Report",
        url: currentAnalysis.url,
        date: format(new Date(currentAnalysis.createdAt), "PPP"),
      });

      // Create download link
      const url = URL.createObjectURL(pdfBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `seo-analysis-${currentAnalysis.url.replace(/[^a-z0-9]/gi, "-")}-${Date.now()}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success("PDF downloaded successfully");
    } catch (error: any) {
      console.error("Error generating PDF:", error);
      toast.error(error.message || "Failed to generate PDF");
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchAnalysisById(id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (isFetchingDetail) {
    return (
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex items-center gap-3">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="text-lg font-medium">Loading SEO Analysis...</span>
        </div>
        <LoadingSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-6">
        <Alert color="destructive" variant="soft">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription className="flex items-center justify-between">
            <span>{error}</span>
            <Button variant="outline" size="sm" onClick={() => id && fetchAnalysisById(id)}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!currentAnalysis) {
    return (
      <div className="container mx-auto py-6">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>No Data</AlertTitle>
          <AlertDescription>No SEO analysis data found for this ID.</AlertDescription>
        </Alert>
      </div>
    );
  }

  // Extract the full report data from nested structure
  const fullReportData = currentAnalysis.data?.fullReportJson?.data;

  if (!fullReportData) {
    return (
      <div className="container mx-auto py-6">
        <Alert color="destructive" variant="soft">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Invalid Data</AlertTitle>
          <AlertDescription>
            The SEO analysis data structure is invalid or incomplete.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="mx-auto py-6 space-y-6">
      {/* 1. Overall Score & Summary */}
      <OverallScoreCard
        totalScore={fullReportData.overall_score.total}
        grade={currentAnalysis.grade}
        scoreStatus={currentAnalysis.scoreStatus}
        url={currentAnalysis.url}
        processingTime={currentAnalysis.processingTime}
        createdAt={currentAnalysis.createdAt}
        analysisId={currentAnalysis.analysisId}
        scores={currentAnalysis.scores}
        onDownloadPDF={handleDownloadPDF}
        isGeneratingPDF={isGeneratingPDF}
      />

      {/* 3. Lighthouse Scores */}
      <LighthouseScores lighthouseScores={currentAnalysis.lighthouseScores} />

      <SectionDivider title="Performance" />

      {/* 4. Core Web Vitals */}
      <CoreWebVitals metrics={currentAnalysis.metrics} />

      {/* 5. Performance Details (file sizes, resources, etc.) */}
      <PerformanceDetails 
        fileSizes={currentAnalysis.fileSizes}
        performance={fullReportData.performance}
      />

      <SectionDivider title="Content & SEO" />

      {/* 6. Meta Information */}
      <MetaInformation metaInformation={fullReportData.meta_information} />

      {/* 7. Content Analysis & Headings */}
      <ContentAnalysis
        contentAnalysis={fullReportData.content_analysis}
        headings={fullReportData.headings}
      />

      {/* 8. Links & Images */}
      <LinksImages links={fullReportData.links} images={fullReportData.images} />

      <SectionDivider title="Technical" />

      {/* 9. Technical SEO & URL Analysis */}
      <TechnicalSEO
        technicalSEO={fullReportData.technical_seo}
        urlAnalysis={fullReportData.url_analysis}
      />

      {/* 10. Security & Accessibility */}
      <SecurityAccessibility
        security={fullReportData.security}
        accessibility={fullReportData.accessibility}
      />

      {/* 11. Mobile Analysis */}
      <MobileAnalysis mobile={fullReportData.mobile} />

      <SectionDivider title="Screenshots" />

      {/* 12. Screenshots */}
      <Screenshots
        finalScreenshot={
          fullReportData.performance?.lighthouse?.core_web_vitals?.["final-screenshot"]?.details
            ?.data
        }
        screenshotTimeline={
          fullReportData.performance?.lighthouse?.core_web_vitals?.["screenshot-thumbnails"]
            ?.details?.items?.map((item: any) => ({
              timing: item.timing,
              timestamp: item.timestamp,
              data: item.data,
            })) || []
        }
        // Fallback to old structure
        lighthouseScreenshot={currentAnalysis.data.lighthouseScreenshot}
        additionalImages={currentAnalysis.data.additionalImages}
      />

      <SectionDivider title="Recommendations" />

      {/* 13. Recommendations & Issues */}
      <Recommendations
        recommendations={fullReportData.recommendations}
        issues={fullReportData.issues}
      />
    </div>
  );
}
