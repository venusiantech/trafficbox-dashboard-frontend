"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "@/components/ui/use-toast";
import { useTranslations } from "next-intl";
import { useCampaignStore } from "@/context/campaignStore";
import PageTitle from "@/components/page-title";
import Loader from "@/components/loader";
import { Campaign } from "@/context/campaignStore";

export default function CampaignsListPage() {
  const t = useTranslations();
  const router = useRouter();
  const { fetchCampaigns, campaigns, isLoading, error } = useCampaignStore();

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

  if (isLoading) {
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
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>URLs</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {campaigns.map((campaign) => (
                <TableRow key={campaign._id}>
                  <TableCell className="font-medium">{campaign.title}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(campaign.state)}>
                      {campaign.state.toUpperCase()}
                    </Badge>
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
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewCampaign(campaign._id)}
                    >
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>
    </div>
  );
}
