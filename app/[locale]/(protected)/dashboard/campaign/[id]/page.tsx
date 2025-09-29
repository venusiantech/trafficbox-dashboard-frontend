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
      
      {/* Campaign Overview Card */}
      <Card className="p-6 border-l-4 border-blue-500 shadow-md">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="bg-blue-100 p-2 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium">Campaign Overview</h3>
          </div>
          <Badge className={`${getStatusColor(currentCampaign.state)} px-3 py-1 text-sm font-medium rounded-full`}>
            {currentCampaign.state.toUpperCase()}
          </Badge>
        </div>
        
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="text-sm font-medium text-gray-500 mb-2">Campaign ID</h4>
            <p className="font-mono text-sm break-all">{currentCampaign._id}</p>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="text-sm font-medium text-gray-500 mb-2">Project ID</h4>
            <p className="font-mono text-sm">{currentCampaign.spark_traffic_project_id || "N/A"}</p>
          </div>
        </div>
        
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="text-sm font-medium text-gray-500 mb-2">Created</h4>
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p>{formatDate(currentCampaign.createdAt)}</p>
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="text-sm font-medium text-gray-500 mb-2">Updated</h4>
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <p>{formatDate(currentCampaign.updatedAt)}</p>
            </div>
          </div>
          
          {currentCampaign.is_archived && currentCampaign.archived_at && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-sm font-medium text-gray-500 mb-2">Archived</h4>
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                </svg>
                <p>{formatDate(currentCampaign.archived_at)}</p>
              </div>
            </div>
          )}
        </div>
      </Card>
      
      {/* Target URLs Card */}
      <Card className="p-6 border-l-4 border-green-500 shadow-md">
        <div className="flex items-center space-x-2 mb-4">
          <div className="bg-green-100 p-2 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
          </div>
          <h3 className="text-lg font-medium">Target URLs</h3>
        </div>
        
        <ul className="space-y-2">
          {currentCampaign.urls.map((url, index) => (
            <li key={index} className="bg-gray-50 p-3 rounded-lg flex items-center">
              <div className="bg-green-100 p-1 rounded-full mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </div>
              <a href={url.startsWith('http') ? url : `https://${url}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline truncate">
                {url}
              </a>
            </li>
          ))}
        </ul>
      </Card>
      
      {/* Campaign Configuration Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Duration & Geography */}
        <Card className="p-6 border-l-4 border-purple-500 shadow-md">
          <div className="flex items-center space-x-2 mb-4">
            <div className="bg-purple-100 p-2 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium">Duration & Geography</h3>
          </div>
          
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-sm font-medium text-gray-500 mb-2">Duration Range</h4>
              <div className="flex items-center space-x-2">
                <div className="flex-1 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-sm">Min: {currentCampaign.duration_min || "N/A"} minutes</span>
                </div>
                <div className="flex-1 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-sm">Max: {currentCampaign.duration_max || "N/A"} minutes</span>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-sm font-medium text-gray-500 mb-2">Geography</h4>
              <div className="space-y-2">
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-sm font-medium mr-2">Countries:</span>
                  <span className="text-sm">
                    {currentCampaign.countries && currentCampaign.countries.length > 0
                      ? currentCampaign.countries.join(", ")
                      : "All Countries"}
                  </span>
                </div>
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <span className="text-sm font-medium mr-2">Rule:</span>
                  <span className="text-sm">{currentCampaign.rule || "N/A"}</span>
                </div>
              </div>
            </div>
          </div>
        </Card>
        
        {/* Content & Status Settings */}
        <Card className="p-6 border-l-4 border-amber-500 shadow-md">
          <div className="flex items-center space-x-2 mb-4">
            <div className="bg-amber-100 p-2 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium">Content & Status</h3>
          </div>
          
          <div className="grid grid-cols-1 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-sm font-medium text-gray-500 mb-2">Content Settings</h4>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center">
                  <div className={`h-4 w-4 rounded-full mr-2 ${currentCampaign.is_adult ? 'bg-red-400' : 'bg-gray-300'}`}></div>
                  <span className="text-sm font-medium mr-2">Adult Content:</span>
                  <span className="text-sm">{currentCampaign.is_adult ? "Yes" : "No"}</span>
                </div>
                <div className="flex items-center">
                  <div className={`h-4 w-4 rounded-full mr-2 ${currentCampaign.is_coin_mining ? 'bg-red-400' : 'bg-gray-300'}`}></div>
                  <span className="text-sm font-medium mr-2">Coin Mining:</span>
                  <span className="text-sm">{currentCampaign.is_coin_mining ? "Yes" : "No"}</span>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-sm font-medium text-gray-500 mb-2">Status Information</h4>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center">
                  <div className={`h-4 w-4 rounded-full mr-2 ${currentCampaign.is_archived ? 'bg-amber-400' : 'bg-gray-300'}`}></div>
                  <span className="text-sm font-medium mr-2">Archived:</span>
                  <span className="text-sm">{currentCampaign.is_archived ? "Yes" : "No"}</span>
                </div>
                <div className="flex items-center">
                  <div className={`h-4 w-4 rounded-full mr-2 ${currentCampaign.delete_eligible ? 'bg-amber-400' : 'bg-gray-300'}`}></div>
                  <span className="text-sm font-medium mr-2">Delete Eligible:</span>
                  <span className="text-sm">{currentCampaign.delete_eligible ? "Yes" : "No"}</span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
