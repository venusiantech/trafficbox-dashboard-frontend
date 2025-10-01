"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTranslations } from "next-intl";
import { useCampaignStore } from "@/context/campaignStore";
import PageTitle from "@/components/page-title";
import Loader from "@/components/loader";

export default function CampaignsListPage() {
  const t = useTranslations();
  const router = useRouter();
  const { fetchCampaigns, fetchArchivedCampaigns, campaigns, archivedCampaigns, isLoading, isArchivedLoading, error } = useCampaignStore();
  const [activeTab, setActiveTab] = useState("active");

  useEffect(() => {
    fetchCampaigns();
  }, [fetchCampaigns]);

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  // Determine campaign status color
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
      case 'created':
        return 'bg-green-100 text-green-800';
      case 'paused':
        return 'bg-yellow-100 text-yellow-800';
      case 'archived':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Handle view campaign details
  const handleViewCampaign = (id: string) => {
    router.push(`/${window.location.pathname.split('/')[1]}/dashboard/campaign/${id}`);
  };

  // Create new campaign
  const handleCreateCampaign = () => {
    router.push(`/${window.location.pathname.split('/')[1]}/dashboard/campaign/create`);
  };

  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    if (value === "archived" && archivedCampaigns.length === 0) {
      fetchArchivedCampaigns();
    }
  };

  // Campaign table component
  const CampaignTable = ({ campaigns, showActions = true }: { campaigns: any[], showActions?: boolean }) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Title</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Total Hits</TableHead>
          <TableHead>Total Visits</TableHead>
          <TableHead>Speed</TableHead>
          <TableHead>URLs</TableHead>
          <TableHead>Created</TableHead>
          {showActions && <TableHead className="text-right">Actions</TableHead>}
        </TableRow>
      </TableHeader>
      <TableBody>
        {campaigns.map((campaign) => (
          <TableRow key={campaign.id}>
            <TableCell className="font-medium">{campaign.title}</TableCell>
            <TableCell>
              <Badge className={getStatusColor(campaign.state)}>
                {campaign.state.toUpperCase()}
              </Badge>
            </TableCell>
            <TableCell className="text-center">
              <span className="font-mono text-sm">
                {campaign.stats?.totalHits || campaign.vendorStats?.totalHits || campaign.total_hits_counted || 0}
              </span>
            </TableCell>
            <TableCell className="text-center">
              <span className="font-mono text-sm">
                {campaign.stats?.totalVisits || campaign.vendorStats?.totalVisits || campaign.total_visits_counted || 0}
              </span>
            </TableCell>
            <TableCell className="text-center">
              <span className="font-mono text-sm">
                {campaign.stats?.speed || campaign.vendorStats?.speed || 0}
              </span>
            </TableCell>
            <TableCell className="lowercase">
              {campaign.urls && campaign.urls.length > 0 ? (
                <span title={campaign.urls.join(", ")}>
                  {campaign.urls[0].length > 30
                    ? campaign.urls[0].substring(0, 30) + "..."
                    : campaign.urls[0]}
                  {campaign.urls.length > 1 && ` (+${campaign.urls.length - 1} more)`}
                </span>
              ) : (
                "N/A"
              )}
            </TableCell>
            <TableCell>{formatDate(campaign.createdAt)}</TableCell>
            {showActions && (
              <TableCell className="text-right">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleViewCampaign(campaign.id)}
                >
                  View
                </Button>
              </TableCell>
            )}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  if (isLoading && campaigns.length === 0) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <h2 className="text-2xl font-semibold text-red-600">Error</h2>
        <p className="text-gray-600">{error}</p>
        <Button onClick={() => fetchCampaigns()} className="mt-4">
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <PageTitle title={t("Menu.campaigns")} />
        
        <Button onClick={handleCreateCampaign}>
          Create Campaign
        </Button>
      </div>
      
      <Tabs defaultValue="active" onValueChange={handleTabChange}>
        <TabsList className="flex w-full">
          <TabsTrigger value="active">Active Campaigns</TabsTrigger>
          <TabsTrigger value="archived">Archived Campaigns</TabsTrigger>
        </TabsList>
        
        <TabsContent value="active">
          <Card>
            {campaigns.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-8">
                <h2 className="text-xl font-semibold">No campaigns found</h2>
                <p className="text-gray-600 mb-4">You haven't created any campaigns yet.</p>
                <Button onClick={handleCreateCampaign}>
                  Create Your First Campaign
                </Button>
              </div>
            ) : (
              <CampaignTable campaigns={campaigns} />
            )}
          </Card>
        </TabsContent>
        
        <TabsContent value="archived">
          <Card>
            {isArchivedLoading ? (
              <div className="flex flex-col items-center justify-center p-8">
                <Loader />
                <p className="text-gray-600 mt-4">Loading archived campaigns...</p>
              </div>
            ) : archivedCampaigns.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-8">
                <h2 className="text-xl font-semibold">No archived campaigns found</h2>
                <p className="text-gray-600 mb-4">You don't have any archived campaigns.</p>
              </div>
            ) : (
              <CampaignTable campaigns={archivedCampaigns} showActions={false} />
            )}
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
