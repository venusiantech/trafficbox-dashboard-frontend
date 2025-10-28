"use client"

import Image from "next/image";
import { StatisticsBlock } from "@/components/blocks/statistics-block";
import { BlockBadge, WelcomeBlock } from "@/components/blocks/welcome-block";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import RevinueBarChart from "@/components/revenue-bar-chart";
import DashboardDropdown from "@/components/dashboard-dropdown";
import OverviewChart from "./components/overview-chart";
import CompanyTable from "./components/company-table";
import RecentActivity from "./components/recent-activity";
import MostSales from "./components/most-sales";
import OverviewRadialChart from "./components/overview-radial";
import { useTranslations } from "next-intl";
import { useDashboardStore } from "@/context/dashboardStore";
import { useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";

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
      <div>
        <div className="grid grid-cols-12 items-center gap-5 mb-5">
          <div className="2xl:col-span-3 lg:col-span-4 col-span-12">
            <WelcomeBlock>
              <div className="max-w-[180px] relative z-10">
                <div className="text-xl font-medium text-default-900 dark:text-default-100 mb-2">
                  {t("widget_title")}
                </div>
                <p className="text-sm text-default-800 dark:text-default-100">
                  {t("widget_desc")}
                </p>
              </div>
              <BlockBadge className="end-3">{t("widget_badge")}</BlockBadge>
              <Image
                src="/images/all-img/widget-bg-1.png"
                width={400}
                height={150}
                priority
                alt="Description of the image"
                className="absolute top-0 start-0 w-full h-full object-cover rounded-md"
              />
            </WelcomeBlock>
          </div>
          <div className="2xl:col-span-9 lg:col-span-8 col-span-12">
            <Card>
              <CardContent className="p-4">
                {isLoading ? (
                  <div className="grid md:grid-cols-3 gap-4">
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-20 w-full" />
                  </div>
                ) : (
                  <div className="grid md:grid-cols-3 gap-4">
                    <StatisticsBlock
                      title="Total Campaigns"
                      total={overview?.totalCampaigns?.toString() || "0"}
                      className="bg-info/10 border-none shadow-none"
                    />
                    <StatisticsBlock
                      title="Total Hits"
                      total={overview?.totalHits?.toLocaleString() || "0"}
                      className="bg-warning/10 border-none shadow-none"
                      chartColor="#FB8F65"
                    />
                    <StatisticsBlock
                      title="Total Visits"
                      total={overview?.totalVisits?.toLocaleString() || "0"}
                      className="bg-primary/10 border-none shadow-none"
                      chartColor="#2563eb"
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
        <div className="grid grid-cols-12 gap-5">
          <div className="lg:col-span-8 col-span-12">
            <Card>
              <CardContent className="p-4">
                {isLoading ? (
                  <Skeleton className="h-[400px] w-full" />
                ) : (
                  <RevinueBarChart timeRangeMetrics={overview?.timeRangeMetrics} />
                )}
              </CardContent>
            </Card>
          </div>
          <div className="lg:col-span-4 col-span-12">
            <Card>
              <CardHeader className="flex flex-row items-center">
                <CardTitle className="flex-1">
                  Overview Distribution
                </CardTitle>
                <DashboardDropdown />
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-[373px] w-full" />
                ) : (
                  <OverviewChart 
                    series={[
                      overview?.totalHits || 0,
                      overview?.totalVisits || 0,
                      overview?.totalViews || 0,
                      overview?.uniqueVisitors || 0
                    ]}
                    labels={["Hits", "Visits", "Views", "Unique Visitors"]}
                  />
                )}
              </CardContent>
            </Card>
          </div>
          <div className="lg:col-span-8 col-span-12">
            <Card>
              <CardHeader className="flex flex-row items-center">
                <CardTitle className="flex-1">
                  Campaign Performance
                </CardTitle>
                <DashboardDropdown />
              </CardHeader>
              <CardContent className="p-0">
                {isLoading ? (
                  <div className="p-4">
                    <Skeleton className="h-[400px] w-full" />
                  </div>
                ) : (
                  <CompanyTable data={overview?.campaignPerformance || []} />
                )}
              </CardContent>
            </Card>
          </div>
          <div className="lg:col-span-4 col-span-12">
            <Card>
              <CardHeader className="flex flex-row items-center">
                <CardTitle className="flex-1">
                  Recent Activity
                </CardTitle>
                <DashboardDropdown />
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-3">
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                  </div>
                ) : (
                  <RecentActivity activities={overview?.recentActivity || []} />
                )}
              </CardContent>
            </Card>
          </div>
          <div className="lg:col-span-8 col-span-12">
            {isLoading ? (
              <Card>
                <CardContent className="p-4">
                  <Skeleton className="h-[400px] w-full" />
                </CardContent>
              </Card>
            ) : (
              <MostSales topCountries={overview?.topCountries || []} />
            )}
          </div>
          <div className="lg:col-span-4 col-span-12">
            <Card>
              <CardHeader className="flex flex-row items-center">
                <CardTitle className="flex-1">
                  Visit Conversion Rate
                </CardTitle>
                <DashboardDropdown />
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-[320px] w-full" />
                ) : (
                  <>
                    <OverviewRadialChart series={[conversionRate]} />
                    <div className="bg-default-50 rounded p-4 mt-8 flex justify-between flex-wrap gap-4">
                      <div className="space-y-1">
                        <h4 className="text-default-600 text-xs font-normal">
                          Total Views
                        </h4>
                        <div className="text-sm font-medium text-default-900">
                          {overview?.totalViews?.toLocaleString() || "0"}
                        </div>
                        <div className="text-default-500 text-xs font-normal">
                          All campaigns
                        </div>
                      </div>

                      <div className="space-y-1">
                        <h4 className="text-default-600 text-xs font-normal">
                          Unique Visitors
                        </h4>
                        <div className="text-sm font-medium text-default-900">
                          {overview?.uniqueVisitors?.toLocaleString() || "0"}
                        </div>
                      </div>

                      <div className="space-y-1">
                        <h4 className="text-default-600 text-xs font-normal">
                          Avg Session
                        </h4>
                        <div className="text-sm font-medium text-default-900">
                          {overview?.averageSessionDuration ? `${Math.round(overview.averageSessionDuration)}s` : "0s"}
                        </div>
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