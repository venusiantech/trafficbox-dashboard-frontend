"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Icon } from "@/components/ui/icon";
import {
  useSubscriptionStore,
  SubscriptionPlan,
} from "@/context/subscriptionStore";
import { Loader2, Check } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface SubscriptionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentPlanName?: string;
  reason?: string;
}

// UI configuration for each plan (visual only)
const planUIConfig: Record<
  string,
  {
    title: string;
    gradient: string;
    buttonClass: string;
    badge?: string;
  }
> = {
  free: {
    title: "ESSENTIAL",
    gradient:
      "from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-900/20",
    buttonClass: "bg-[#1e293b] hover:bg-[#334155] text-white",
  },
  starter: {
    title: "START",
    gradient:
      "from-purple-50 to-purple-100 dark:from-purple-950/30 dark:to-purple-900/20",
    buttonClass: "bg-[#1e293b] hover:bg-[#334155] text-white",
  },
  growth: {
    title: "GROW",
    gradient:
      "from-pink-50 to-orange-100 dark:from-pink-950/30 dark:to-orange-900/20",
    buttonClass: "bg-[#1e293b] hover:bg-[#334155] text-white",
    // badge: "Trusted by early capital"
  },
  business: {
    title: "BUSINESS",
    gradient:
      "from-orange-50 to-orange-100 dark:from-orange-950/30 dark:to-orange-900/20",
    buttonClass: "bg-[#1e293b] hover:bg-[#334155] text-white",
  },
  premium: {
    title: "ELITE",
    gradient:
      "from-yellow-50 to-yellow-100 dark:from-yellow-950/30 dark:to-yellow-900/20",
    buttonClass: "bg-[#1e293b] hover:bg-[#334155] text-white",
  },
};

export function SubscriptionModal({
  open,
  onOpenChange,
  currentPlanName,
  reason,
}: SubscriptionModalProps) {
  const {
    plans,
    fetchPlans,
    createCheckoutSession,
    isPlansLoading,
    isLoading,
  } = useSubscriptionStore();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    // Fetch plans every time modal opens
    if (open) {
      fetchPlans();
    }
  }, [open, fetchPlans]);

  const handleUpgrade = async (planName: string) => {
    if (planName === "free") {
      toast.info("You're already on the free plan");
      return;
    }

    setSelectedPlan(planName);
    setIsProcessing(true);

    try {
      const checkoutUrl = await createCheckoutSession(planName);

      // Redirect to Stripe Checkout
      window.location.href = checkoutUrl;
    } catch (error: any) {
      toast.error(error.message || "Failed to start checkout process");
      setIsProcessing(false);
      setSelectedPlan(null);
    }
  };

  const getFeaturesList = (plan: SubscriptionPlan) => {
    const features = [];

    // Core features from API
    features.push(
      `${plan.campaignLimit === -1 ? "Unlimited" : plan.campaignLimit} Active ${plan.campaignLimit === 1 ? "Campaign" : "Campaigns"}`
    );
    features.push(
      `${(plan.visitsIncluded / 1000).toLocaleString()}K Visits/Month`
    );

    // Add features based on API response
    if (
      plan.features.countryTargeting &&
      plan.features.countryTargeting !== "none"
    ) {
      features.push(`Country Targeting: ${plan.features.countryTargeting}`);
    }

    if (
      plan.features.trafficSources &&
      plan.features.trafficSources !== "none"
    ) {
      features.push(`Traffic Sources: ${plan.features.trafficSources}`);
    }

    if (
      plan.features.behaviorSettings &&
      plan.features.behaviorSettings !== "none"
    ) {
      features.push(`Behavior Settings: ${plan.features.behaviorSettings}`);
    }

    if (plan.features.campaignRenewal) {
      features.push(`Campaign Renewal: ${plan.features.campaignRenewal}`);
    }

    if (plan.features.support) {
      features.push(`Support: ${plan.features.support}`);
    }

    if (plan.features.analytics) {
      features.push(`Analytics: ${plan.features.analytics}`);
    }

    return features;
  };

  const isCurrentPlan = (planName: string) => currentPlanName === planName;
  const isUpgrade = (planName: string) => {
    const planOrder = ["free", "starter", "growth", "business", "premium"];
    const currentIndex = planOrder.indexOf(currentPlanName || "free");
    const targetIndex = planOrder.indexOf(planName);
    return targetIndex > currentIndex;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size="lg" className="max-h-[90vh] overflow-y-auto">
        <DialogHeader className="text-center pb-4">
          <DialogDescription className="text-base text-muted-foreground">
            Choose the plan that best suits your needs and start your journey to
            financial freedom.
          </DialogDescription>
        </DialogHeader>

        {isPlansLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {plans.map((plan: SubscriptionPlan) => {
              const uiConfig = planUIConfig[plan.planName];
              const isCurrent = isCurrentPlan(plan.planName);
              const canUpgrade = isUpgrade(plan.planName);

              // Skip if no UI config (shouldn't happen with API data)
              if (!uiConfig) {
                console.warn(`No UI config for plan: ${plan.planName}`);
                return null;
              }

              return (
                <Card
                  key={plan.planName}
                  className={cn(
                    "relative p-6 border-2 transition-all hover:shadow-xl flex flex-col",
                    isCurrent && "ring-2 ring-primary",
                    plan.recommended &&
                      !isCurrent &&
                      "ring-2 ring-blue-500 shadow-xl scale-105"
                  )}
                >
                  {/* Badge at top */}
                  {uiConfig.badge && !isCurrent && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                      <Badge className="bg-linear-to-r from-pink-500 to-orange-500 text-white px-3 py-1 text-xs">
                        {uiConfig.badge}
                      </Badge>
                    </div>
                  )}

                  {/* Gradient Background */}
                  <div
                    className={cn(
                      "absolute inset-0 rounded-lg bg-linear-to-b opacity-50",
                      uiConfig.gradient
                    )}
                  />

                  {/* Content */}
                  <div className="relative space-y-4 flex flex-col h-full">
                    {/* Plan Title */}
                    <div className="text-center">
                      <h3 className="text-2xl font-bold tracking-wide">
                        {uiConfig.title}
                      </h3>
                    </div>

                    {/* Description from API */}
                    <p className="text-sm text-muted-foreground leading-relaxed min-h-20">
                      {plan.description}
                    </p>

                    {/* Pricing */}
                    <div className="text-center py-3">
                      <div className="flex items-baseline justify-center gap-1">
                        <span className="text-5xl font-bold">
                          ${plan.price.toLocaleString()}
                        </span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        /month
                      </span>
                    </div>

                    {/* Features List from API */}
                    <ul className="space-y-3 grow">
                      {getFeaturesList(plan).map((feature, idx) => (
                        <li
                          key={idx}
                          className="flex items-start gap-2 text-sm"
                        >
                          <Check className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                          <span className="text-muted-foreground leading-snug">
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>

                    {/* CTA Button */}
                    <Button
                      className={cn("w-full mt-4", uiConfig.buttonClass)}
                      onClick={() => handleUpgrade(plan.planName)}
                      disabled={isCurrent || isProcessing}
                    >
                      {isProcessing && selectedPlan === plan.planName ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Processing...
                        </>
                      ) : isCurrent ? (
                        <>
                          <Icon
                            icon="lucide:shopping-cart"
                            className="w-4 h-4 mr-2"
                          />
                          Current Plan
                        </>
                      ) : (
                        <>
                          <Icon
                            icon="lucide:shopping-cart"
                            className="w-4 h-4 mr-2"
                          />
                          Get Started
                        </>
                      )}
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
