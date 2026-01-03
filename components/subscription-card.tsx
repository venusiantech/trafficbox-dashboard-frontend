"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Icon } from "@/components/ui/icon";
import { Subscription } from "@/context/subscriptionStore";
import { AlertCircle, CheckCircle, Crown, Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface SubscriptionCardProps {
  subscription: Subscription | null;
  isLoading?: boolean;
  onUpgrade?: () => void;
  onCancel?: () => void;
  onReactivate?: () => void;
}

export function SubscriptionCard({
  subscription,
  isLoading = false,
  onUpgrade,
  onCancel,
  onReactivate,
}: SubscriptionCardProps) {
  if (!subscription && !isLoading) {
    return null;
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Crown className="w-5 h-5" />
            Subscription
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!subscription) return null;

  const campaignPercent = subscription.campaignLimit > 0 
    ? (subscription.currentCampaignCount / subscription.campaignLimit) * 100 
    : 0;
  
  const visitsPercent = subscription.visitsIncluded > 0 
    ? (subscription.visitsUsed / subscription.visitsIncluded) * 100 
    : 0;

  const isPaidPlan = subscription.planName !== 'free';
  const isNearLimit = campaignPercent >= 80 || visitsPercent >= 80;
  const isAtLimit = campaignPercent >= 100;
  const isCanceled = subscription.cancelAtPeriodEnd;

  const getStatusBadge = () => {
    if (isCanceled) {
      return <Badge color="destructive" className="gap-1"><AlertCircle className="w-3 h-3" />Canceling</Badge>;
    }
    if (subscription.status === 'active') {
      return <Badge color="success" className="gap-1 bg-green-500"><CheckCircle className="w-3 h-3" />Active</Badge>;
    }
    if (subscription.status === 'past_due') {
      return <Badge color="destructive" className="gap-1"><AlertCircle className="w-3 h-3" />Past Due</Badge>;
    }
    return <Badge color="secondary">{subscription.status}</Badge>;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  };

  return (
    <Card className={cn(
      "transition-all",
      isPaidPlan && "border-primary/50 shadow-md"
    )}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Crown className="w-5 h-5 text-primary" />
            Subscription
          </CardTitle>
          {getStatusBadge()}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Plan Name */}
        <div>
          <p className="text-sm text-muted-foreground mb-1">Current Plan</p>
          <p className="text-2xl font-bold capitalize">{subscription.planName}</p>
        </div>

        {/* Campaign Usage */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Campaigns</span>
            <span className="font-medium">
              {subscription.currentCampaignCount} / {subscription.campaignLimit}
            </span>
          </div>
          <Progress 
            value={campaignPercent} 
            color={isAtLimit ? "destructive" : "primary"}
            size="sm"
          />
          {isAtLimit && (
            <p className="text-xs text-red-600 dark:text-red-400 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              Campaign limit reached
            </p>
          )}
        </div>

        {/* Visits Usage */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Visits This Period</span>
            <span className="font-medium">
              {subscription.visitsUsed.toLocaleString()} / {subscription.visitsIncluded.toLocaleString()}
            </span>
          </div>
          <Progress 
            value={visitsPercent} 
            color={visitsPercent >= 100 ? "destructive" : "primary"}
            size="sm"
          />
        </div>

        {/* Billing Period */}
        {isPaidPlan && (
          <div className="pt-4 border-t space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Billing Period</span>
              <span className="text-xs">
                {formatDate(subscription.currentPeriodStart)} - {formatDate(subscription.currentPeriodEnd)}
              </span>
            </div>
          </div>
        )}

        {/* Cancellation Notice */}
        {isCanceled && (
          <div className="p-3 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg">
            <div className="flex items-start gap-2">
              <Info className="w-4 h-4 text-orange-600 dark:text-orange-400 mt-0.5" />
              <div className="text-xs text-orange-800 dark:text-orange-200">
                <p className="font-medium mb-1">Subscription Canceling</p>
                <p>Your subscription will remain active until {formatDate(subscription.currentPeriodEnd)}, then you'll be moved to the Free plan.</p>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-2 pt-4">
          {isCanceled ? (
            <Button 
              className="w-full" 
              onClick={onReactivate}
            >
              <Icon icon="heroicons:arrow-path" className="w-4 h-4 mr-2" />
              Reactivate Subscription
            </Button>
          ) : (
            <>
              {(isNearLimit || subscription.planName === 'free') && onUpgrade && (
                <Button 
                  className="w-full" 
                  onClick={onUpgrade}
                >
                  <Icon icon="heroicons:arrow-trending-up" className="w-4 h-4 mr-2" />
                  {subscription.planName === 'free' ? 'Upgrade Now' : 'Upgrade Plan'}
                </Button>
              )}
              
              {isPaidPlan && onCancel && !isCanceled && (
                <Button 
                  className="w-full border border-default-300" 
                  onClick={onCancel}
                  color="default"
                >
                  <Icon icon="heroicons:x-circle" className="w-4 h-4 mr-2" />
                  Cancel Subscription
                </Button>
              )}
            </>
          )}
        </div>

        {/* Info Note */}
        {!isPaidPlan && (
          <div className="pt-4 border-t">
            <p className="text-xs text-muted-foreground">
              Upgrade to unlock more campaigns, visits, and advanced features.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
