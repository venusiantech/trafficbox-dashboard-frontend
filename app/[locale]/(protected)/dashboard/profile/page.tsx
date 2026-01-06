"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Icon } from "@/components/ui/icon";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import PageTitle from "@/components/page-title";
import Loader from "@/components/loader";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import { useSubscriptionStore } from "@/context/subscriptionStore";
import { SubscriptionModal } from "@/components/subscription-modal";
import { SubscriptionCard } from "@/components/subscription-card";

interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  dob?: string;
  role: string;
  credits: number;
  availableHits: number;
  createdAt: string;
  updatedAt: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  
  const { 
    subscription, 
    fetchSubscription, 
    cancelSubscription, 
    reactivateSubscription,
    isLoading: isSubscriptionLoading 
  } = useSubscriptionStore();

  useEffect(() => {
    fetchProfile();
    fetchSubscription();
    
    // Handle subscription success/cancel from URL params
    const subscriptionStatus = searchParams.get('subscription');
    if (subscriptionStatus === 'success') {
      toast.success('🎉 Subscription upgraded successfully!');
      // Refresh subscription data
      setTimeout(() => {
        fetchSubscription(true);
      }, 2000);
      
      // Clean URL
      window.history.replaceState({}, '', window.location.pathname);
    } else if (subscriptionStatus === 'canceled') {
      toast.info('Subscription upgrade was canceled. You can try again anytime.');
      // Clean URL
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, [searchParams]);

  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch("/api/user/me");
      
      if (!response.ok) {
        throw new Error("Failed to fetch profile");
      }
      
      const data = await response.json();
      setProfile(data);
    } catch (err: any) {
      console.error("Error fetching profile:", err);
      setError(err.message || "Failed to load profile");
      toast.error("Failed to load profile");
    } finally {
      setIsLoading(false);
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };

  // Get user initials
  const getInitials = () => {
    if (!profile) return "U";
    return `${profile.firstName?.charAt(0) || ""}${profile.lastName?.charAt(0) || ""}`;
  };

  // Get full name
  const getFullName = () => {
    if (!profile) return "Guest User";
    return `${profile.firstName || ""} ${profile.lastName || ""}`.trim();
  };

  // Handle cancel subscription
  const handleCancelSubscription = async () => {
    try {
      await cancelSubscription(true);
      toast.success("Subscription will be canceled at the end of the billing period");
      setShowCancelDialog(false);
    } catch (error: any) {
      toast.error(error.message || "Failed to cancel subscription");
    }
  };

  // Handle reactivate subscription
  const handleReactivateSubscription = async () => {
    try {
      await reactivateSubscription();
      toast.success("Subscription reactivated successfully!");
    } catch (error: any) {
      toast.error(error.message || "Failed to reactivate subscription");
    }
  };

  if (isLoading && isSubscriptionLoading) {
    return <Loader />;
  }

  if (error || !profile) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <Icon icon="heroicons:exclamation-circle" className="w-16 h-16 text-red-600 mb-4" />
        <h2 className="text-2xl font-semibold text-red-600">Error</h2>
        <p className="text-gray-600">{error || "Failed to load profile"}</p>
        <Button onClick={() => fetchProfile()} className="mt-4">
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageTitle title="Profile" />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium text-2xl">
                {getInitials()}
              </div>
              <div className="flex-1">
                <CardTitle className="text-2xl">{getFullName()}</CardTitle>
                <CardDescription className="text-base mt-1">{profile.email}</CardDescription>
                <div className="mt-2">
                  <Badge className="capitalize">
                    {profile.role}
                  </Badge>
                </div>
              </div>
            </div>
          </CardHeader>
          <Separator />
          <CardContent className="pt-6">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Icon icon="heroicons:user" className="w-4 h-4" />
                    <span>First Name</span>
                  </div>
                  <p className="text-base font-medium">{profile.firstName}</p>
                </div>
                
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Icon icon="heroicons:user" className="w-4 h-4" />
                    <span>Last Name</span>
                  </div>
                  <p className="text-base font-medium">{profile.lastName}</p>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Icon icon="heroicons:envelope" className="w-4 h-4" />
                    <span>Email Address</span>
                  </div>
                  <p className="text-base font-medium">{profile.email}</p>
                </div>

               { profile.dob && <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Icon icon="heroicons:cake" className="w-4 h-4" />
                    <span>Date of Birth</span>
                  </div>
                  <p className="text-base font-medium">{formatDate(profile.dob)}</p>
                </div>}

                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Icon icon="heroicons:calendar" className="w-4 h-4" />
                    <span>Member Since</span>
                  </div>
                  <p className="text-base font-medium">{formatDate(profile.createdAt)}</p>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Icon icon="heroicons:clock" className="w-4 h-4" />
                    <span>Last Updated</span>
                  </div>
                  <p className="text-base font-medium">{formatDate(profile.updatedAt)}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Account Information Card */}
        <div className="space-y-6">
          {/* Subscription Card */}
          <SubscriptionCard
            subscription={subscription}
            isLoading={isSubscriptionLoading}
            onUpgrade={() => setShowUpgradeModal(true)}
            onCancel={() => setShowCancelDialog(true)}
            onReactivate={handleReactivateSubscription}
          />

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                className="w-full justify-start border border-default-300" 
                color="default"
                onClick={() => router.push(`/${window.location.pathname.split('/')[1]}/dashboard/campaign/list`)}
              >
                <Icon icon="heroicons:folder-open" className="w-4 h-4 mr-2" />
                View Your Campaigns
              </Button>
              <Button 
                className="w-full justify-start border border-default-300" 
                color="default"
                onClick={() => router.push(`/${window.location.pathname.split('/')[1]}/dashboard/campaign/create`)}
              >
                <Icon icon="heroicons:plus-circle" className="w-4 h-4 mr-2" />
                Create New Campaign
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Subscription Upgrade Modal */}
      <SubscriptionModal
        open={showUpgradeModal}
        onOpenChange={setShowUpgradeModal}
        currentPlanName={subscription?.planName}
      />

      {/* Cancel Subscription Confirmation Dialog */}
      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Subscription?</AlertDialogTitle>
            <AlertDialogDescription>
              Your subscription will remain active until the end of your current billing period ({subscription?.currentPeriodEnd ? new Date(subscription.currentPeriodEnd).toLocaleDateString() : 'the end of the period'}). After that, you'll be moved to the Free plan.
              <br /><br />
              You can reactivate your subscription anytime before the period ends.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep Subscription</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleCancelSubscription}
              className="bg-destructive hover:bg-destructive/90"
            >
              Cancel Subscription
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

