"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { toast } from "@/components/ui/use-toast";
import { useTranslations } from "next-intl";
import { useCampaignStore } from "@/context/campaignStore";
import PageTitle from "@/components/page-title";
import Loader from "@/components/loader";

export default function CampaignDetailPage({ params }: { params: { id: string } }) {
  const t = useTranslations();
  const router = useRouter();
  const { fetchCampaign, pauseCampaign, deleteCampaign, currentCampaign, isLoading, error } = useCampaignStore();
  const [isPauseDialogOpen, setIsPauseDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  useEffect(() => {
    if (params.id) {
      fetchCampaign(params.id);
    }
  }, [params.id, fetchCampaign]);

  // Handle pause campaign
  const handlePauseCampaign = async () => {
    try {
      await pauseCampaign(params.id);
      
      toast({
        title: "Success",
        description: "Campaign paused successfully",
      });
      
      setIsPauseDialogOpen(false);
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to pause campaign",
        variant: "destructive",
      });
    }
  };

  // Handle delete campaign
  const handleDeleteCampaign = async () => {
    try {
      await deleteCampaign(params.id);
      
      toast({
        title: "Success",
        description: "Campaign archived successfully. Will be permanently deleted after 7 days.",
      });
      
      setIsDeleteDialogOpen(false);
      
      // Redirect to campaigns list
      router.push(`/${window.location.pathname.split('/')[1]}/dashboard/campaign/list`);
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to delete campaign",
        variant: "destructive",
      });
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <h2 className="text-2xl font-semibold text-red-600">Error</h2>
        <p className="text-gray-600">{error}</p>
        <Button onClick={() => router.back()} className="mt-4">
          Go Back
        </Button>
      </div>
    );
  }

  if (!currentCampaign) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <h2 className="text-2xl font-semibold">Campaign not found</h2>
        <p className="text-gray-600">The campaign you are looking for does not exist.</p>
        <Button onClick={() => router.push(`/${window.location.pathname.split('/')[1]}/dashboard/campaign/list`)} className="mt-4">
          View All Campaigns
        </Button>
      </div>
    );
  }

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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <PageTitle title={currentCampaign.title} />
        
        <div className="flex space-x-2">
          {currentCampaign.state !== 'paused' && currentCampaign.state !== 'archived' && (
            <AlertDialog open={isPauseDialogOpen} onOpenChange={setIsPauseDialogOpen}>
              <AlertDialogTrigger asChild>
                <Button variant="outline">Pause Campaign</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Pause Campaign</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to pause this campaign? You can resume it later.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handlePauseCampaign}>
                    Pause
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
          
          {currentCampaign.state !== 'archived' && (
            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
              <AlertDialogTrigger asChild>
                <Button variant="default">Delete Campaign</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Campaign</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete this campaign? It will be archived and permanently deleted after 7 days.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeleteCampaign} className="bg-red-600">
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </div>
      
      {/* Campaign Overview */}
      <Card className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold">Campaign Overview</h3>
          <Badge className={getStatusColor(currentCampaign.state)}>
            {currentCampaign.state.toUpperCase()}
          </Badge>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Campaign ID</p>
            <p className="font-mono text-sm mt-1 break-all">{currentCampaign._id}</p>
          </div>
          
          <div>
            <p className="text-sm text-gray-500">Project ID</p>
            <p className="font-mono text-sm mt-1">{currentCampaign.spark_traffic_project_id || "N/A"}</p>
          </div>
          
          <div>
            <p className="text-sm text-gray-500">Created</p>
            <p className="text-sm mt-1">{formatDate(currentCampaign.createdAt)}</p>
          </div>
          
          <div>
            <p className="text-sm text-gray-500">Last Updated</p>
            <p className="text-sm mt-1">{formatDate(currentCampaign.updatedAt)}</p>
          </div>

          {currentCampaign.last_stats_check && (
            <div>
              <p className="text-sm text-gray-500">Last Stats Check</p>
              <p className="text-sm mt-1">{formatDate(currentCampaign.last_stats_check)}</p>
            </div>
          )}
          
          {currentCampaign.is_archived && currentCampaign.archived_at && (
            <div>
              <p className="text-sm text-gray-500">Archived At</p>
              <p className="text-sm mt-1">{formatDate(currentCampaign.archived_at)}</p>
            </div>
          )}
        </div>
      </Card>

      {/* Statistics */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Statistics</h3>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-500 mb-1">Total Hits</p>
            <p className="text-2xl font-semibold">{currentCampaign.vendorStats?.totalHits || currentCampaign.total_hits_counted || 0}</p>
          </div>
          
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-500 mb-1">Total Visits</p>
            <p className="text-2xl font-semibold">{currentCampaign.vendorStats?.totalVisits || currentCampaign.total_visits_counted || 0}</p>
          </div>
          
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-500 mb-1">Speed</p>
            <p className="text-2xl font-semibold">{currentCampaign.vendorStats?.speed || 0}</p>
          </div>
        </div>
      </Card>
      
      {/* Target URLs */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Target URLs</h3>
        
        <div className="space-y-2">
          {currentCampaign.urls.map((url, index) => (
            <div key={index} className="p-3 bg-gray-50 rounded-lg">
              <a 
                href={url.startsWith('http') ? url : `https://${url}`} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-blue-600 hover:underline text-sm break-all"
              >
                {url}
              </a>
            </div>
          ))}
        </div>
      </Card>
      
      {/* Campaign Configuration */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Duration & Geography */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Duration & Geography</h3>
          
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500 mb-2">Duration</p>
              <div className="flex gap-4 text-sm">
                <span>Min: {currentCampaign.duration_min || "N/A"} min</span>
                <span>Max: {currentCampaign.duration_max || "N/A"} min</span>
              </div>
            </div>
            
            <Separator />
            
            <div>
              <p className="text-sm text-gray-500 mb-2">Countries</p>
              <p className="text-sm">
                {currentCampaign.countries && currentCampaign.countries.length > 0
                  ? currentCampaign.countries.join(", ")
                  : "All Countries"}
              </p>
            </div>
            
            <div>
              <p className="text-sm text-gray-500 mb-2">Rule</p>
              <p className="text-sm">{currentCampaign.rule || "N/A"}</p>
            </div>

            {currentCampaign.macros && (
              <div>
                <p className="text-sm text-gray-500 mb-2">Macros</p>
                <p className="text-sm font-mono">{currentCampaign.macros}</p>
              </div>
            )}
          </div>
        </Card>
        
        {/* Settings */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Settings</h3>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-gray-500">Adult Content</span>
              <span className="text-sm font-medium">{currentCampaign.is_adult ? "Yes" : "No"}</span>
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-gray-500">Coin Mining</span>
              <span className="text-sm font-medium">{currentCampaign.is_coin_mining ? "Yes" : "No"}</span>
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-gray-500">Archived</span>
              <span className="text-sm font-medium">{currentCampaign.is_archived ? "Yes" : "No"}</span>
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-gray-500">Delete Eligible</span>
              <span className="text-sm font-medium">{currentCampaign.delete_eligible ? "Yes" : "No"}</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
