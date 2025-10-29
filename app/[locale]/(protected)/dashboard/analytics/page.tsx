"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import RevinueBarChart from "@/components/revenue-bar-chart";
import DashboardDropdown from "@/components/dashboard-dropdown";
import OverviewChart from "./components/overview-chart";
import CompanyTable from "./components/company-table";
import OverviewRadialChart from "./components/overview-radial";
import WorldMapInteractive from "./components/world-map-interactive";
import MapStatsOverlay from "./components/map-stats-overlay";
import { useTranslations } from "next-intl";
import { useDashboardStore } from "@/context/dashboardStore";
import { useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp, Users, Eye, MousePointerClick, Globe } from "lucide-react";

const DashboardPage = () => {
    const t = useTranslations("AnalyticsDashboard");
    const { overview, metadata, isLoading, error, fetchOverview } = useDashboardStore();

    useEffect(() => {
      fetchOverview();
    }, []);

    // Calculate visit to hit conversion rate
    const conversionRate = overview?.totalHits 
      ? Math.round((overview.totalVisits / overview.totalHits) * 100) 
      : 0;

    if (error) {
      return (
        <div className="flex items-center justify-center min-h-[400px]">
          <Card className="p-6">
            <CardContent>
              <p className="text-destructive text-center">Error: {error}</p>
            </CardContent>
          </Card>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {/* Interactive World Map Section with Stats Overlay */}
        <Card className="overflow-hidden">

          <CardContent className="p-0 relative">
            {isLoading ? (
              <Skeleton className="h-[500px] w-full" />
            ) : (
              <div className="relative h-[500px] bg-default-50 dark:bg-default-900/20">
                <WorldMapInteractive
                  topCountries={overview?.topCountries || []}
                  campaignPerformance={overview?.campaignPerformance || []}
                />
                <MapStatsOverlay
                  stats={[
                    {
                      label: "Active Visitors (Last 1 Min)",
                      value: overview?.timeRangeMetrics?.["1m"]?.uniqueVisitors?.toLocaleString() || "0",
                    },
                    {
                      label: "Active Campaigns",
                      value: overview?.campaignPerformance?.filter(c => c.campaignStatus !== "paused")?.length || 0,
                    },
                    {
                      label: "Active Countries",
                      value: overview?.topCountries?.length || 0,
                    },
                  ]}
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Stats Cards Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {isLoading ? (
            <>
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-32 w-full" />
              ))}
            </>
          ) : (
            <>
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Globe className="w-5 h-5 text-primary" />
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-default-900">
                    {overview?.totalCampaigns || 0}
                  </div>
                  <div className="text-sm text-default-600 mt-1">
                    Total Campaigns
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-2 bg-warning/10 rounded-lg">
                      <MousePointerClick className="w-5 h-5 text-warning" />
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-default-900">
                    {overview?.totalHits?.toLocaleString() || "0"}
                  </div>
                  <div className="text-sm text-default-600 mt-1">
                    Total Hits
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-2 bg-success/10 rounded-lg">
                      <TrendingUp className="w-5 h-5 text-success" />
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-default-900">
                    {overview?.totalVisits?.toLocaleString() || "0"}
                  </div>
                  <div className="text-sm text-default-600 mt-1">
                    Total Visits
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-2 bg-info/10 rounded-lg">
                      <Eye className="w-5 h-5 text-info" />
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-default-900">
                    {overview?.totalViews?.toLocaleString() || "0"}
                  </div>
                  <div className="text-sm text-default-600 mt-1">
                    Total Views
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-2 bg-secondary/10 rounded-lg">
                      <Users className="w-5 h-5 text-secondary" />
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-default-900">
                    {overview?.uniqueVisitors?.toLocaleString() || "0"}
                  </div>
                  <div className="text-sm text-default-600 mt-1">
                    Unique Visitors
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
        {/* Time Range Metrics Chart - Full Width */}
        <Card>
          <CardHeader className="border-b">
            <div className="flex items-center justify-between">
              <CardTitle>Overview</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            {isLoading ? (
              <Skeleton className="h-[400px] w-full" />
            ) : (
              <RevinueBarChart timeRangeMetrics={overview?.timeRangeMetrics} />
            )}
          </CardContent>
        </Card>

        {/* Campaign Performance and Analytics Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Campaign Performance Table - Takes 2 columns */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="border-b">
                <div className="flex items-center justify-between">
                  <CardTitle>Campaign Performance</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {isLoading ? (
                  <div className="p-6">
                    <Skeleton className="h-[400px] w-full" />
                  </div>
                ) : (
                  <CompanyTable data={overview?.campaignPerformance || []} />
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar with Overview Chart and Conversion Metrics */}
          <div className="space-y-6">
            {/* Overview Distribution Chart */}
            <Card>
              <CardHeader className="border-b">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Traffic Distribution</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                {isLoading ? (
                  <Skeleton className="h-[300px] w-full" />
                ) : (
                  <OverviewChart 
                    height={300}
                    series={[
                      overview?.totalHits || 0,
                      overview?.totalVisits || 0,
                      overview?.totalViews || 0,
                      overview?.uniqueVisitors || 0
                    ]}
                    labels={["Hits", "Visits", "Views", "Unique"]}
                  />
                )}
              </CardContent>
            </Card>

            {/* Conversion Rate Card */}
            <Card>
              <CardHeader className="border-b">
                <CardTitle className="text-base">Visit Conversion</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {isLoading ? (
                  <Skeleton className="h-[280px] w-full" />
                ) : (
                  <>
                    <OverviewRadialChart series={[conversionRate]} height={200} />
                    <div className="mt-6 space-y-3">
                      <div className="flex justify-between items-center p-3 bg-primary/5 rounded-lg">
                        <span className="text-sm text-default-600">Total Hits</span>
                        <span className="text-sm font-bold text-default-900">
                          {overview?.totalHits?.toLocaleString() || "0"}
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-success/5 rounded-lg">
                        <span className="text-sm text-default-600">Total Visits</span>
                        <span className="text-sm font-bold text-default-900">
                          {overview?.totalVisits?.toLocaleString() || "0"}
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-info/5 rounded-lg">
                        <span className="text-sm text-default-600">Conversion Rate</span>
                        <span className="text-sm font-bold text-default-900">
                          {conversionRate}%
                        </span>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
}

export default DashboardPage;