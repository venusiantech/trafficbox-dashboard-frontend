"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import PageTitle from "@/components/page-title";
import Loader from "@/components/loader";
import { formatDistanceToNow } from "date-fns";

interface SEOAnalysis {
  _id: string;
  url: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export default function SEOListPage() {
  const router = useRouter();
  const [analyses, setAnalyses] = useState<SEOAnalysis[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalResults: 0,
    limit: 20,
  });

  useEffect(() => {
    fetchAnalyses();
  }, []);

  const fetchAnalyses = async (page = 1) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/seo/analysis?page=${page}&limit=20`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch analyses");
      }

      setAnalyses(data.data || []);
      if (data.pagination) {
        setPagination(data.pagination);
      }
    } catch (err: any) {
      console.error("Error fetching analyses:", err);
      toast.error(err.message || "Failed to load SEO analyses");
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewAnalysis = (analysisId: string) => {
    const locale = window.location.pathname.split('/')[1];
    router.push(`/${locale}/dashboard/seo/${analysisId}`);
  };

  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch {
      return dateString;
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <PageTitle title="SEO Analysis Reports" />
        <Button
          onClick={() => {
            const locale = window.location.pathname.split('/')[1];
            router.push(`/${locale}/dashboard/seo/create`);
          }}
          className="gap-2"
        >
          <Icon icon="heroicons:plus" className="w-4 h-4" />
          New Analysis
        </Button>
      </div>

      {analyses.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center mb-4">
              <Icon icon="heroicons:document-magnifying-glass" className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No SEO Analyses Yet</h3>
            <p className="text-muted-foreground mb-6 text-center max-w-md">
              Start analyzing websites to improve their SEO performance
            </p>
            <Button
              onClick={() => {
                const locale = window.location.pathname.split('/')[1];
                router.push(`/${locale}/dashboard/seo/create`);
              }}
              className="gap-2"
            >
              <Icon icon="heroicons:plus" className="w-4 h-4" />
              Create First Analysis
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-6">
            <div className="space-y-3">
              {analyses.map((analysis) => (
                <div
                  key={analysis._id}
                  className="group relative rounded-lg border p-4 transition-all hover:shadow-md hover:bg-muted/50 cursor-pointer"
                  onClick={() => handleViewAnalysis(analysis._id)}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-none h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Icon icon="heroicons:document-chart-bar" className="w-6 h-6 text-primary" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-base leading-tight truncate">
                            {analysis.url}
                          </h4>
                          <p className="text-xs text-muted-foreground mt-1">
                            Created {formatDate(analysis.createdAt)}
                          </p>
                        </div>
                        <Badge color={getStatusColor(analysis.status)} className="capitalize">
                          {analysis.status}
                        </Badge>
                      </div>

                      <Button
                        variant="ghost"
                        size="sm"
                        className="mt-2 gap-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewAnalysis(analysis._id);
                        }}
                      >
                        <Icon icon="heroicons:eye" className="w-4 h-4" />
                        View Report
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-between mt-6 pt-6 border-t">
                <p className="text-sm text-muted-foreground">
                  Showing {analyses.length} of {pagination.totalResults} results
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fetchAnalyses(pagination.currentPage - 1)}
                    disabled={pagination.currentPage === 1}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fetchAnalyses(pagination.currentPage + 1)}
                    disabled={pagination.currentPage === pagination.totalPages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
