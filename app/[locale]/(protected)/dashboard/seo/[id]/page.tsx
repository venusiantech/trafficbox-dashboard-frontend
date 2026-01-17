"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import PageTitle from "@/components/page-title";
import Loader from "@/components/loader";
import { formatDistanceToNow } from "date-fns";

interface SEOAnalysisDetail {
  _id: string;
  user: string;
  url: string;
  status: string;
  analysis?: any; // The full SEO analysis data
  createdAt: string;
  updatedAt: string;
}

export default function SEOAnalysisDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [analysis, setAnalysis] = useState<SEOAnalysisDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      fetchAnalysis(params.id as string);
    }
  }, [params.id]);

  const fetchAnalysis = async (id: string) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/seo/analysis/${id}`);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to fetch analysis");
      }

      setAnalysis(result.data);
    } catch (err: any) {
      console.error("Error fetching analysis:", err);
      toast.error(err.message || "Failed to load SEO analysis");
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch {
      return new Date(dateString).toLocaleDateString();
    }
  };

  const getStatusColor = (status: string): "success" | "warning" | "destructive" | "secondary" | "default" => {
    const colors: { [key: string]: "success" | "warning" | "destructive" | "secondary" | "default" } = {
      completed: "success",
      processing: "warning",
      failed: "destructive",
      pending: "secondary",
    };
    return colors[status] || "default";
  };

  if (isLoading) {
    return <Loader />;
  }

  if (!analysis) {
    return (
      <div className="space-y-6">
        <PageTitle title="SEO Analysis" />
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Icon icon="heroicons:exclamation-circle" className="w-16 h-16 text-destructive mb-4" />
            <h3 className="text-xl font-semibold mb-2">Analysis Not Found</h3>
            <p className="text-muted-foreground mb-6">
              The requested SEO analysis could not be found
            </p>
            <Button
              onClick={() => {
                const locale = window.location.pathname.split('/')[1];
                router.push(`/${locale}/dashboard/seo/list`);
              }}
            >
              Back to Reports
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <PageTitle title="SEO Analysis Report" />
        <Button
          variant="outline"
          onClick={() => {
            const locale = window.location.pathname.split('/')[1];
            router.push(`/${locale}/dashboard/seo/list`);
          }}
          className="gap-2"
        >
          <Icon icon="heroicons:arrow-left" className="w-4 h-4" />
          Back to Reports
        </Button>
      </div>

      {/* Header Card */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-xl mb-2">{analysis.url}</CardTitle>
              <CardDescription>
                Created {formatDate(analysis.createdAt)}
              </CardDescription>
            </div>
            <Badge color={getStatusColor(analysis.status)} className="capitalize">
              {analysis.status}
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Analysis Content */}
      {analysis.status === "processing" ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Icon icon="heroicons:arrow-path" className="w-16 h-16 text-primary mb-4 animate-spin" />
            <h3 className="text-xl font-semibold mb-2">Analysis In Progress</h3>
            <p className="text-muted-foreground text-center max-w-md">
              Your SEO analysis is being processed. This usually takes a few minutes.
              Please check back soon.
            </p>
            <Button
              onClick={() => fetchAnalysis(params.id as string)}
              variant="outline"
              className="mt-6 gap-2"
            >
              <Icon icon="heroicons:arrow-path" className="w-4 h-4" />
              Refresh
            </Button>
          </CardContent>
        </Card>
      ) : analysis.status === "failed" ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Icon icon="heroicons:x-circle" className="w-16 h-16 text-destructive mb-4" />
            <h3 className="text-xl font-semibold mb-2">Analysis Failed</h3>
            <p className="text-muted-foreground text-center max-w-md">
              We couldn't complete the analysis for this URL. Please try again or contact support.
            </p>
          </CardContent>
        </Card>
      ) : analysis.analysis ? (
        <Card>
          <CardHeader>
            <CardTitle>Analysis Results</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-muted p-4 rounded-lg overflow-auto max-h-[600px] text-sm">
              {JSON.stringify(analysis.analysis, null, 2)}
            </pre>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Icon icon="heroicons:document" className="w-16 h-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Analysis Data</h3>
            <p className="text-muted-foreground">
              Analysis data is not available yet
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
