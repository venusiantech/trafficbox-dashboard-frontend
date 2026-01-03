"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Loader2 } from "lucide-react";
import { useSubscriptionStore } from "@/context/subscriptionStore";

export default function SubscriptionSuccessPage() {
  const router = useRouter();
  const { fetchSubscription } = useSubscriptionStore();

  useEffect(() => {
    // Refresh subscription data
    fetchSubscription(true);

    // Redirect to profile after 5 seconds
    const timer = setTimeout(() => {
      router.push('/dashboard/profile');
    }, 5000);

    return () => clearTimeout(timer);
  }, [fetchSubscription, router]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardContent className="pt-6">
          <div className="text-center space-y-6">
            <div className="flex justify-center">
              <div className="rounded-full bg-green-100 dark:bg-green-900/20 p-3">
                <CheckCircle className="w-16 h-16 text-green-600 dark:text-green-400" />
              </div>
            </div>

            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-green-600 dark:text-green-400">
                🎉 Payment Successful!
              </h1>
              <p className="text-muted-foreground">
                Your subscription has been upgraded successfully.
              </p>
            </div>

            <div className="p-4 bg-muted rounded-lg space-y-2 text-sm">
              <div className="flex items-center gap-2 justify-center text-primary">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Syncing your subscription...</span>
              </div>
              <p className="text-muted-foreground text-xs">
                You'll be redirected to your profile in a few seconds
              </p>
            </div>

            <div className="space-y-2">
              <Button 
                className="w-full" 
                color="primary"
                onClick={() => router.push('/dashboard/profile')}
              >
                Go to Profile
              </Button>
              <Button 
                className="w-full border border-default-300" 
                color="default"
                onClick={() => router.push('/dashboard/campaign/create')}
              >
                Create Campaign
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
