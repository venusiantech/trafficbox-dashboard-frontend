"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTranslations } from "next-intl";
import { useCampaignStore } from "@/context/campaignStore";
import PageTitle from "@/components/page-title";
import Loader from "@/components/loader";
import { toast } from "sonner";
import { Play, Clock, ExternalLink } from "lucide-react";

// Dummy data generator for charts
const generateDummyChartData = () => {
  const points = 20;
  return Array.from({ length: points }, (_, i) => ({
    x: i,
    y: Math.floor(Math.random() * 100) + 20
  }));
};

// Simple SVG Area Chart Component
const MiniAreaChart = ({ data, color = "#60a5fa" }: { data: any[], color?: string }) => {
  const width = 280;
  const height = 40;
  const padding = 5;
  
  const maxY = Math.max(...data.map(d => d.y));
  const minY = Math.min(...data.map(d => d.y));
  const rangeY = maxY - minY || 1;
  
  const points = data.map((point, i) => {
    const x = padding + (i / (data.length - 1)) * (width - 2 * padding);
    const y = height - padding - ((point.y - minY) / rangeY) * (height - 2 * padding);
    return `${x},${y}`;
  }).join(' ');
  
  const areaPoints = `${padding},${height} ${points} ${width - padding},${height}`;
  
  return (
    <svg width={width} height={height} className="w-full h-10">
      <defs>
        <linearGradient id={`gradient-${color}`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.5" />
          <stop offset="100%" stopColor={color} stopOpacity="0.1" />
        </linearGradient>
      </defs>
      <polygon 
        points={areaPoints} 
        fill={`url(#gradient-${color})`}
        stroke="none"
      />
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="2"
      />
    </svg>
  );
};


export default function CampaignsListPage() {
  const t = useTranslations();
  const router = useRouter();
  const { 
    fetchCampaigns, 
    fetchArchivedCampaigns, 
    campaigns, 
    archivedCampaigns, 
    isLoading, 
    isArchivedLoading, 
    error,
    pauseCampaign,
    resumeCampaign,
    deleteCampaign,
    restoreCampaign
  } = useCampaignStore();
  const [activeTab, setActiveTab] = useState("active");
  const [processingCampaignId, setProcessingCampaignId] = useState<string | null>(null);
  const [chartData, setChartData] = useState<Record<string, any[]>>({});

  useEffect(() => {
    fetchCampaigns();
    
    // Generate dummy chart data for each campaign
    const dummyData: Record<string, any[]> = {};
    campaigns.forEach(campaign => {
      dummyData[campaign.id] = generateDummyChartData();
    });
    setChartData(dummyData);
  }, [fetchCampaigns]);

  // Update chart data when campaigns change
  useEffect(() => {
    const dummyData: Record<string, any[]> = {};
    campaigns.forEach(campaign => {
      if (!chartData[campaign.id]) {
        dummyData[campaign.id] = generateDummyChartData();
      } else {
        dummyData[campaign.id] = chartData[campaign.id];
      }
    });
    setChartData(dummyData);
  }, [campaigns]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const handleViewCampaign = (id: string) => {
    router.push(`/${window.location.pathname.split('/')[1]}/dashboard/campaign/${id}`);
  };

  const handleCreateCampaign = () => {
    router.push(`/${window.location.pathname.split('/')[1]}/dashboard/campaign/create`);
  };

  const handleResumeCampaign = async (id: string) => {
    setProcessingCampaignId(id);
    try {
      await resumeCampaign(id);
      toast.success("Campaign resumed successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to resume campaign");
    } finally {
      setProcessingCampaignId(null);
    }
  };

  const handlePauseCampaign = async (id: string) => {
    setProcessingCampaignId(id);
    try {
      await pauseCampaign(id);
      toast.success("Campaign paused successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to pause campaign");
    } finally {
      setProcessingCampaignId(null);
    }
  };

  const handleArchiveCampaign = async (id: string) => {
    setProcessingCampaignId(id);
    try {
      await deleteCampaign(id);
      toast.success("Campaign archived successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to archive campaign");
    } finally {
      setProcessingCampaignId(null);
    }
  };

  const handleRestoreCampaign = async (id: string) => {
    setProcessingCampaignId(id);
    try {
      await restoreCampaign(id);
      toast.success("Campaign restored successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to restore campaign");
    } finally {
      setProcessingCampaignId(null);
    }
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    if (tab === "archived" && archivedCampaigns.length === 0) {
      fetchArchivedCampaigns();
    }
  };

  const CampaignCard = ({ campaign, isArchived = false }: { campaign: any, isArchived?: boolean }) => {
    const isPaused = campaign.state === 'paused';
    const isActive = campaign.state === 'active' || campaign.state === 'created';
    const urlValues: string[] = campaign.urls ? Object.values(campaign.urls) : [];
    const displayUrl = urlValues.length > 0 ? urlValues[0] : 'N/A';
    const totalHits = campaign.stats?.totalHits || campaign.vendorStats?.totalHits || 0;
    const totalVisits = campaign.stats?.totalVisits || campaign.vendorStats?.totalVisits || 0;
    const formattedHits = totalHits >= 1000 ? `${(totalHits / 1000).toFixed(0)}K` : totalHits;
    const formattedVisits = totalVisits >= 1000 ? `${(totalVisits / 1000).toFixed(0)}K` : totalVisits;
    const hitsDelta = totalHits > 0 ? `+${Math.floor(totalHits * 0.15)}` : '+0';

    return (
      <Card className={`overflow-hidden transition-all`}>
        <div className="p-5">
          {/* Top Header Row */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 
                  className="text-sm font-semibold text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer transition-colors truncate"
                  onClick={() => handleViewCampaign(campaign.id)}
                >
                  {campaign.title}
                </h3>
                {isPaused && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded text-[10px] font-semibold flex-shrink-0">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-600 dark:bg-amber-500"></div>
                    Paused
                  </span>
                )}
              </div>
              <div className="text-[10px] text-gray-400 dark:text-gray-500">
                {campaign.id.toUpperCase()} • {formatDate(campaign.createdAt)}
              </div>
            </div>

            {/* Top Right Stats */}
            <div className="flex items-center gap-6 ml-4 flex-shrink-0">
              <div className="text-right">
                <div className="text-[10px] text-gray-400 dark:text-gray-500 mb-0.5 font-medium">Hits</div>
                <div className="flex items-baseline gap-1">
                  <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">{formattedHits}</span>
                  <span className="text-[9px] text-green-600 dark:text-green-400 font-semibold">{hitsDelta}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-[10px] text-gray-400 dark:text-gray-500 mb-0.5 font-medium">Visits</div>
                <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">{formattedVisits}</span>
              </div>
            </div>
          </div>

          {/* URL Section with Icon */}
          <div className="mb-4 flex items-center gap-2 min-w-0">
            <a 
              href={displayUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors truncate group"
            >
              <span className="truncate">{displayUrl}</span>
              <ExternalLink className="w-3.5 h-3.5 flex-shrink-0 opacity-50 group-hover:opacity-100 transition-opacity" />
            </a>
            {campaign.spark_traffic_data?.referrer === 'google' && (
              <div className="flex items-center gap-1 ml-2 flex-shrink-0">
                <svg className="w-3 h-3" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
              </div>
            )}
          </div>

          {/* Chart Section */}
          <div className="mb-4 -mx-5 px-5">
            <div className="mb-2">
              <MiniAreaChart data={chartData[campaign.id] || []} />
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[10px] text-gray-400 dark:text-gray-500">24 Sep</span>
              <div className="flex items-center gap-1.5">
                <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-blue-500 animate-pulse' : 'bg-gray-300 dark:bg-gray-600'}`}></div>
                <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                  {isActive ? 'Live' : 'Offline'}
                </span>
              </div>
              <span className="text-[10px] text-gray-400 dark:text-gray-500">24 Oct</span>
            </div>
          </div>

          {/* Bottom Section: Time Stats + Actions */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-3 text-xs">
              <Clock className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500 flex-shrink-0" />
              <div className="flex gap-4">
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Min</span>
                  <span className="ml-1 font-semibold text-gray-900 dark:text-gray-100">16 min</span>
                </div>
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Max</span>
                  <span className="ml-1 font-semibold text-gray-900 dark:text-gray-100">1 min</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              {isPaused && (
                <Button
                  size="sm"
                  className="bg-green-600 hover:bg-green-700 text-white h-7 text-xs px-3"
                  onClick={() => handleResumeCampaign(campaign.id)}
                  disabled={processingCampaignId === campaign.id}
                >
                  <Play className="w-3 h-3 mr-1" />
                  Resume
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleViewCampaign(campaign.id)}
                className="h-7 text-xs px-3 font-medium border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                Settings
              </Button>
            </div>
          </div>
        </div>
      </Card>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  const displayCampaigns = activeTab === "active" ? campaigns : archivedCampaigns;
  const displayLoading = activeTab === "active" ? isLoading : isArchivedLoading;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <PageTitle title="Campaigns" />
        <Button onClick={handleCreateCampaign}>
          Create Campaign
        </Button>
      </div>

      {/* Tabs - Modern minimal design */}
      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <TabsList className="bg-transparent border-b border-gray-200 dark:border-gray-700 p-0 h-auto gap-0 rounded-none">
          <TabsTrigger 
            value="active"
            className="bg-transparent border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent data-[state=active]:text-gray-900 dark:data-[state=active]:text-gray-100 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 rounded-none px-0 py-3 mr-6 font-medium text-sm shadow-none"
          >
            Active Campaigns ({campaigns.length})
          </TabsTrigger>
          <TabsTrigger 
            value="archived"
            className="bg-transparent border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent data-[state=active]:text-gray-900 dark:data-[state=active]:text-gray-100 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 rounded-none px-0 py-3 mr-6 font-medium text-sm shadow-none"
          >
            Archived ({archivedCampaigns.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="mt-4">
          {displayLoading ? (
            <div className="flex items-center justify-center h-64">
              <Loader />
            </div>
          ) : displayCampaigns.length === 0 ? (
            <Card className="p-12 text-center border-gray-200">
              <p className="text-gray-500 mb-4">No campaigns found</p>
              <Button onClick={handleCreateCampaign}>
                Create Your First Campaign
              </Button>
            </Card>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {displayCampaigns.map((campaign) => (
                <CampaignCard key={campaign.id} campaign={campaign} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="archived" className="mt-4">
          {displayLoading ? (
            <div className="flex items-center justify-center h-64">
              <Loader />
            </div>
          ) : displayCampaigns.length === 0 ? (
            <Card className="p-12 text-center border-gray-200">
              <p className="text-gray-500">No archived campaigns</p>
            </Card>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {displayCampaigns.map((campaign) => (
                <CampaignCard key={campaign.id} campaign={campaign} isArchived />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
