"use client"

import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useSubscriptionStore } from "@/context/subscriptionStore";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { useConfig } from "@/hooks/use-config";
import { cn } from "@/lib/utils";

const SubscriptionInfoStrip = () => {
  const { user } = useAuth();
  const { subscription, isLoading, fetchSubscription } = useSubscriptionStore();
  const router = useRouter();
  const [config] = useConfig();

  useEffect(() => {
    // Always fetch fresh data on mount
    fetchSubscription(true);
  }, [fetchSubscription]);

  if (isLoading) {
    return (
      <div className={cn("w-full bg-secondary/30 dark:bg-secondary/10 xl:ms-[248px]", {
        'xl:ms-[72px]': config.collapsed,
        'xl:ms-0': config.menuHidden || config.layout === "horizontal",
        'xl:ms-28': config.sidebar === 'compact',
        'xl:ms-[300px]': config.sidebar === 'two-column',
      })}>
        <div className="px-4 sm:px-6 py-3 sm:py-4">
          <Skeleton className="h-12 w-full" />
        </div>
      </div>
    );
  }

  // Default values if data is not available
  const currentCampaignCount = subscription?.currentCampaignCount || 0;
  const campaignLimit = subscription?.campaignLimit || 1;
  const remainingVisits = subscription 
    ? subscription.visitsIncluded - subscription.visitsUsed 
    : 0;
  const currentPlanName = subscription?.planName || "free";

  const getPlanStyles = (planName: string) => {
    const planStyles: { [key: string]: { bg: string; border: string; text: string } } = {
      free: {
        bg: "#64748B", // Slate Gray
        border: "2px solid #64748B",
        text: "#ffffff"
      },
      starter: {
        bg: "#B87333", // Rich Bronze
        border: "2px solid #B87333",
        text: "#ffffff"
      },
      growth: {
        bg: "#C0C0C0", // True Silver
        border: "2px solid #C0C0C0",
        text: "#1e293b"
      },
      business: {
        bg: "#FFD700", // Rich Gold
        border: "2px solid #FFD700",
        text: "#1e293b"
      },
      premium: {
        bg: "#5B21B6", // Dark Purple (like logo)
        border: "2px solid #5B21B6",
        text: "#ffffff"
      },
    };
    return planStyles[planName] || planStyles.free;
  };

  const planStyles = getPlanStyles(currentPlanName);

  return (
    <div className={cn("bg-gradient-to-r from-secondary/20 via-secondary/10 to-transparent backdrop-blur-sm xl:ms-[248px]", {
      'xl:ms-[72px]': config.collapsed,
      'xl:ms-0': config.menuHidden || config.layout === "horizontal",
      'xl:ms-28': config.sidebar === 'compact',
      'xl:ms-[300px]': config.sidebar === 'two-column',
    })}>
      <div className="px-3 sm:px-6 xl:px-8 pt-3 ">
        <div className="flex items-center justify-between gap-2 sm:gap-6">
          {/* Left Section - Current Plan Info */}
          <div className="flex items-center gap-4 sm:gap-3 flex-wrap mx-auto">
            {/* Plan Label */}
            <span className="text-[10px] sm:text-xs font-medium text-default-500 uppercase tracking-wider">Plan</span>
            
            {/* Current Plan Badge */}
            <Badge
              className="capitalize font-semibold text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5"
              style={{
                backgroundColor: planStyles.bg,
                border: planStyles.border,
                color: planStyles.text,
              }}
            >
              {currentPlanName}
            </Badge>

            <div className="h-4 w-px bg-default-300/50 hidden sm:block"></div>

            {/* Campaign Limit */}
            <div className="flex items-center gap-1 sm:gap-2">
              <span className="text-[10px] sm:text-xs font-medium text-default-500 uppercase tracking-wider">Campaigns</span>
              <span className="text-xs sm:text-sm font-bold text-default-900 tabular-nums">
                {currentCampaignCount} / {campaignLimit}
              </span>
            </div>

            <div className="h-4 w-px bg-default-300/50 hidden sm:block"></div>

            {/* Remaining Visits */}
            <div className="flex items-center gap-1 sm:gap-2">
              <span className="text-[10px] sm:text-xs font-medium text-default-500 uppercase tracking-wider">Visits</span>
              <span className="text-xs sm:text-sm font-bold text-default-900 tabular-nums">
                {remainingVisits.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionInfoStrip;

