"use client";

import { useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Badge } from "@/components/ui/badge";
import PageTitle from "@/components/page-title";
import Loader from "@/components/loader";
import { formatDistanceToNow } from "date-fns";
import { useSEO } from "@/hooks/use-seo";
import { getSEOStatusColor } from "@/components/seo/seo-utils";
import { useSEOStore } from "@/context/seoStore";

export default function SEOListPage() {
  const { analyses, pagination, isLoading, navigateToAnalysis, navigateToCreate } = useSEO();
  const { fetchAnalyses } = useSEOStore();

  useEffect(() => {
    fetchAnalyses(1, 20);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePageChange = (page: number) => {
    fetchAnalyses(page, 20);
  };

  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch {
      return dateString;
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <PageTitle title="SEO Analysis Reports" />
        <Button onClick={navigateToCreate} className="gap-2">
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
            <Button onClick={navigateToCreate} className="gap-2">
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
                  onClick={() => navigateToAnalysis(analysis._id)}
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
                        <Badge color={getSEOStatusColor(analysis.status)} className="capitalize">
                          {analysis.status}
                        </Badge>
                      </div>

                      <Button
                        variant="ghost"
                        size="sm"
                        className="mt-2 gap-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigateToAnalysis(analysis._id);
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
            {pagination && pagination.totalPages > 1 && (
              <div className="flex items-center justify-between mt-6 pt-6 border-t">
                <p className="text-sm text-muted-foreground">
                  Showing {analyses.length} of {pagination.totalResults || 0} results
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                    disabled={pagination.currentPage === 1}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(pagination.currentPage + 1)}
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
