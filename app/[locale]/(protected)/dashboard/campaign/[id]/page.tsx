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
      
      <Card className="p-6">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Campaign Details</h3>
            <Badge className={getStatusColor(currentCampaign.state)}>
              {currentCampaign.state.toUpperCase()}
            </Badge>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium text-gray-500">Campaign ID</h4>
              <p>{currentCampaign._id}</p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-500">Project ID</h4>
              <p>{currentCampaign.spark_traffic_project_id || "N/A"}</p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-500">Created At</h4>
              <p>{formatDate(currentCampaign.createdAt)}</p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-500">Updated At</h4>
              <p>{formatDate(currentCampaign.updatedAt)}</p>
            </div>
            
            {currentCampaign.is_archived && currentCampaign.archived_at && (
              <div>
                <h4 className="text-sm font-medium text-gray-500">Archived At</h4>
                <p>{formatDate(currentCampaign.archived_at)}</p>
              </div>
            )}
          </div>
          
          <Separator />
          
          <div>
            <h3 className="text-lg font-medium mb-4">Target URLs</h3>
            <ul className="space-y-2">
              {currentCampaign.urls.map((url, index) => (
                <li key={index} className="bg-gray-50 p-2 rounded">
                  <a href={url.startsWith('http') ? url : `https://${url}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    {url}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          <Separator />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-lg font-medium mb-4">Duration</h3>
              <div className="space-y-2">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Minimum Duration</h4>
                  <p>{currentCampaign.duration_min || "N/A"} minutes</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Maximum Duration</h4>
                  <p>{currentCampaign.duration_max || "N/A"} minutes</p>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-4">Geography</h3>
              <div className="space-y-2">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Countries</h4>
                  <p>
                    {currentCampaign.countries && currentCampaign.countries.length > 0
                      ? currentCampaign.countries.join(", ")
                      : "All Countries"}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Rule</h4>
                  <p>{currentCampaign.rule || "N/A"}</p>
                </div>
              </div>
            </div>
          </div>
          
          <Separator />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-lg font-medium mb-4">Content Settings</h3>
              <div className="space-y-2">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Adult Content</h4>
                  <p>{currentCampaign.is_adult ? "Yes" : "No"}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Coin Mining</h4>
                  <p>{currentCampaign.is_coin_mining ? "Yes" : "No"}</p>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-4">Status</h3>
              <div className="space-y-2">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Archived</h4>
                  <p>{currentCampaign.is_archived ? "Yes" : "No"}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Delete Eligible</h4>
                  <p>{currentCampaign.delete_eligible ? "Yes" : "No"}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
