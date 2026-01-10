"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { XCircle } from "lucide-react";
import Image from "next/image";

export default function SubscriptionCancelPage() {
  const router = useRouter();

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
                    Your subscription upgrade was canceled. No charges were made.
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
          <Card className="border-2 shadow-xl">
            <CardContent className="p-6 md:p-8 flex flex-col items-center justify-center min-h-[400px] text-center space-y-6">
              {/* Cancel Icon */}
              <div className="flex justify-center">
                <div className="rounded-full p-4 md:p-5">
                  <XCircle className="w-16 h-16 md:w-20 md:h-20 text-red-600 dark:text-red-400" />
                </div>
              </div>

              {/* Payment Status */}
              <div className="space-y-3">
                <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                  Payment canceled
                </h1>
                <p className="text-muted-foreground text-sm md:text-base">
                  Your subscription upgrade was canceled. No charges were made.
                </p>
              </div>

              {/* Info Message */}
              <div className="w-full p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">
                  You can try upgrading again anytime. Your current plan remains active.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="w-full space-x-3 flex justify-center pt-2">
                <Button 
                  className="w-full bg-default hover:bg-default/90 text-white" 
                  onClick={() => router.push('/en/dashboard/profile')}
                >
                  Back to Profile
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
            * No charges were made. You can retry the payment anytime.
          </p>
        </div>
      </div>
    </div>
  );
}
