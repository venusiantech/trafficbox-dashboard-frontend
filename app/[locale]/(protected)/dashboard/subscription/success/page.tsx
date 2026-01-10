"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Loader2 } from "lucide-react";
import { useSubscriptionStore } from "@/context/subscriptionStore";
import Image from "next/image";

export default function SubscriptionSuccessPage() {
  const router = useRouter();
  const { fetchSubscription } = useSubscriptionStore();

  useEffect(() => {
    // Refresh subscription data
    fetchSubscription(true);

    // Redirect to profile after 5 seconds
    const timer = setTimeout(() => {
      router.push('/en/dashboard/profile');
    }, 5000);

    return () => clearTimeout(timer);
  }, [fetchSubscription, router]);

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-200px)] p-4 md:p-6 lg:p-8">
      <div className="w-full max-w-4xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 ">
          {/* Left Card - Title and Payment Logos */}
          <div className="border-4 border-r-0 h-[70%] my-auto">
            <CardContent className="p-6 md:p-8 h-full flex flex-col justify-between">
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                    Deposit funds
                  </h2>
                  <p className="text-muted-foreground text-sm md:text-base">
                    Your subscription payment has been processed successfully
                  </p>
                </div>
              </div>
              
              {/* Payment Provider Logos */}
              <div className="space-y-4 pt-8">
                <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">
                  Secure Payment Partners
                </p>
                <div className="flex flex-wrap">
                  <div>
                      <Image src="/images/logo/stripe.png" alt="stripe" width={80} height={50} />
                  </div>
                </div>
              </div>
            </CardContent>
          </div>

          {/* Right Card - Payment Status */}
          <Card className="border-2">
            <CardContent className="p-6 md:p-8 flex flex-col items-center justify-center min-h-[400px] text-center space-y-6">
              {/* Success Icon */}
              <div className="flex justify-center">
                <div className="rounded-full p-4 md:p-5">
                  <CheckCircle className="w-16 h-16 md:w-20 md:h-20 text-green-600 dark:text-green-400" />
                </div>
              </div>

              {/* Payment Status */}
              <div className="space-y-3">
                <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                  Payment successful
                </h1>
                <p className="text-muted-foreground text-sm md:text-base">
                  Your subscription has been upgraded successfully
                </p>
              </div>

              {/* Syncing Status */}
              <div className="w-full p-4 bg-muted rounded-lg space-y-2">
                <div className="flex items-center gap-2 justify-center text-primary">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm">Syncing your subscription...</span>
                </div>
                <p className="text-muted-foreground text-xs">
                  You'll be redirected automatically in a few seconds
                </p>
              </div>

              {/* Action Buttons */}
              <div className="w-full space-x-3 flex justify-center pt-2">
                <Button 
                  className="w-full bg-default hover:bg-default/90 text-white" 
                  onClick={() => router.push('/en/dashboard/profile')}
                >
                  Close
                </Button>
                <Button 
                  variant="outline"
                  className="w-full" 
                  onClick={() => router.push('/en/dashboard/subscriptions')}
                >
                  My subsctiption
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Disclaimer */}
        <div className="mt-4 text-center">
          <p className="text-xs text-muted-foreground">
            * A charge may be levied on the transaction as per your payment provider's terms.
          </p>
        </div>
      </div>
    </div>
  );
}
