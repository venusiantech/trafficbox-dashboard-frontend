"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Icon } from "@/components/ui/icon";
import Loader from "@/components/loader";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Subscription {
  planName: string;
  status: string;
  visitsIncluded: number;
  visitsUsed: number;
  campaignLimit: number;
  currentCampaignCount: number;
  features: {
    countryTargeting: string;
    trafficSources: string;
    behaviorSettings: string;
    campaignRenewal: string;
    support: string;
    analytics: string;
  };
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
}

interface Plan {
  planName: string;
  visitsIncluded: number;
  campaignLimit: number;
  price: number;
  features: {
    countryTargeting: string;
    trafficSources: string;
    behaviorSettings: string;
    campaignRenewal: string;
    support: string;
    analytics: string;
  };
  description: string;
}

export default function SubscriptionsPage() {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
    
    // Handle Stripe checkout success/cancel redirects
    const urlParams = new URLSearchParams(window.location.search);
    const upgradeStatus = urlParams.get('upgrade');
    
    if (upgradeStatus === 'success') {
      toast.success('🎉 Subscription upgraded successfully!');
      // Clean URL
      window.history.replaceState({}, '', window.location.pathname);
    } else if (upgradeStatus === 'cancel') {
      toast.info('Subscription upgrade was canceled. You can try again anytime.');
      // Clean URL
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const [subRes, plansRes] = await Promise.all([
        fetch("/api/subscription/subscription"),
        fetch("/api/subscription/plans"),
      ]);

      if (!subRes.ok || !plansRes.ok) {
        throw new Error("Failed to fetch subscription data");
      }

      const [subData, plansData] = await Promise.all([
        subRes.json(),
        plansRes.json(),
      ]);

      if (subData.ok) setSubscription(subData.subscription);
      if (plansData.ok) setPlans(plansData.plans);
    } catch (err: any) {
      console.error("Error fetching subscription data:", err);
      setError(err.message || "Failed to load subscription data");
      toast.error("Failed to load subscription data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpgrade = async (planName: string) => {
    try {
      setActionLoading(true);
      setSelectedPlan(planName);

      // ✅ CORRECT FLOW: Free users → /checkout, Paid users → /upgrade
      if (subscription?.planName === "free") {
        // Free plan users: Create Stripe checkout session
        toast.info("Redirecting to secure checkout...");
        
        const response = await fetch("/api/subscription/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            planName,
            successUrl: `${window.location.origin}${window.location.pathname}?upgrade=success`,
            cancelUrl: `${window.location.origin}${window.location.pathname}?upgrade=cancel`,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to create checkout session");
        }

        // Redirect to Stripe checkout page
        window.location.href = data.url;
      } else {
        // Existing paid users: Instant upgrade
        const response = await fetch("/api/subscription/upgrade", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ planName }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to upgrade subscription");
        }

        toast.success(`🎉 Successfully upgraded to ${planName} plan!`);
        fetchData();
      }
    } catch (err: any) {
      console.error("Upgrade error:", err);
      toast.error(err.message || "Failed to upgrade subscription");
      setActionLoading(false);
      setSelectedPlan(null);
    }
    // Note: Don't clear loading state here for free users as they're being redirected
    if (subscription?.planName !== "free") {
      setActionLoading(false);
      setSelectedPlan(null);
    }
  };

  const handleCancel = async () => {
    try {
      setActionLoading(true);

      const response = await fetch("/api/subscription/cancel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cancelAtPeriodEnd: true }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to cancel subscription");
      }

      toast.success("Subscription will be canceled at the end of billing period");
      setShowCancelDialog(false);
      fetchData();
    } catch (err: any) {
      toast.error(err.message || "Failed to cancel subscription");
    } finally {
      setActionLoading(false);
    }
  };

  const handleReactivate = async () => {
    try {
      setActionLoading(true);

      const response = await fetch("/api/subscription/reactivate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to reactivate subscription");
      }

      toast.success("Subscription reactivated successfully!");
      fetchData();
    } catch (err: any) {
      toast.error(err.message || "Failed to reactivate subscription");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDowngrade = async (planName: string) => {
    try {
      setActionLoading(true);
      setSelectedPlan(planName);

      const response = await fetch("/api/subscription/downgrade", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planName }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to downgrade subscription");
      }

      toast.success("Subscription will be downgraded at the end of billing period");
      fetchData();
    } catch (err: any) {
      toast.error(err.message || "Failed to downgrade subscription");
    } finally {
      setActionLoading(false);
      setSelectedPlan(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const getUsagePercentage = (used: number, total: number) => {
    return Math.min((used / total) * 100, 100);
  };

  const getPlanColor = (planName: string) => {
    const colors: { [key: string]: string } = {
      free: "default",
      starter: "info",
      growth: "success",
      business: "warning",
      premium: "destructive",
    };
    return colors[planName] || "default";
  };

  const isPlanHigher = (planA: string, planB: string) => {
    const hierarchy = ["free", "starter", "growth", "business", "premium"];
    return hierarchy.indexOf(planA) > hierarchy.indexOf(planB);
  };

  if (isLoading) {
    return <Loader />;
  }

  if (error || !subscription) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="h-16 w-16 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
          <Icon icon="heroicons:exclamation-circle" className="w-8 h-8 text-destructive" />
        </div>
        <h3 className="text-lg font-semibold text-destructive mb-1">Error Loading Subscription</h3>
        <p className="text-muted-foreground text-sm mb-4">{error}</p>
        <Button onClick={() => fetchData()} variant="outline" size="sm">
          <Icon icon="heroicons:arrow-path" className="w-4 h-4 mr-2" />
          Retry
        </Button>
      </div>
    );
  }

  const visitsPercentage = getUsagePercentage(subscription.visitsUsed, subscription.visitsIncluded);
  const campaignsPercentage = getUsagePercentage(subscription.currentCampaignCount, subscription.campaignLimit);

  return (
    <div className="space-y-6">
      {/* <PageTitle title="My Subscriptions" /> */}

      {/* Current Plan Overview */}
      <div className="space-y-6">
        {/* Current Plan Card */}
        <Card>
          <CardHeader className="border-b">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl capitalize flex items-center gap-2">
                  {subscription.planName} Plan
                  <Badge color={getPlanColor(subscription.planName) as any} className="capitalize">
                    {subscription.status}
                  </Badge>
                </CardTitle>
                <CardDescription className="mt-1">
                  {subscription.cancelAtPeriodEnd ? (
                    <span className="text-destructive font-medium">
                      Cancels on {formatDate(subscription.currentPeriodEnd)}
                    </span>
                  ) : subscription.planName !== "free" ? (
                    <>Next billing: {formatDate(subscription.currentPeriodEnd)}</>
                  ) : (
                    <>Active until {formatDate(subscription.currentPeriodEnd)}</>
                  )}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-6">
              {/* Usage Statistics */}
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Visits Usage</span>
                    <span className="text-sm text-muted-foreground">
                      {subscription.visitsUsed.toLocaleString()} / {subscription.visitsIncluded.toLocaleString()}
                    </span>
                  </div>
                  <Progress value={visitsPercentage} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-1">
                    {(100 - visitsPercentage).toFixed(1)}% remaining
                  </p>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Active Campaigns</span>
                    <span className="text-sm text-muted-foreground">
                      {subscription.currentCampaignCount} / {subscription.campaignLimit}
                    </span>
                  </div>
                  <Progress value={campaignsPercentage} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-1">
                    {subscription.campaignLimit - subscription.currentCampaignCount} slots available
                  </p>
                </div>
              </div>

              {/* Features */}
              <div>
                <h4 className="font-semibold mb-3">Current Features</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {Object.entries(subscription.features).map(([key, value]) => (
                    <div key={key} className="flex items-start gap-2">
                      <Icon icon="heroicons:check-circle" className="w-5 h-5 text-success mt-0.5" />
                      <div>
                        <p className="text-sm font-medium capitalize">{key.replace(/([A-Z])/g, ' $1')}</p>
                        <p className="text-xs text-muted-foreground capitalize">{value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 pt-4 border-t">
                {subscription.cancelAtPeriodEnd ? (
                  <Button
                    onClick={handleReactivate}
                    disabled={actionLoading}
                    className="gap-2"
                  >
                    <Icon icon="heroicons:arrow-path" className="w-4 h-4" />
                    Reactivate Subscription
                  </Button>
                ) : subscription.planName !== "free" ? (
                  <Button
                    onClick={() => setShowCancelDialog(true)}
                    variant="outline"
                    color="destructive"
                    disabled={actionLoading}
                    className="gap-2"
                  >
                    <Icon icon="heroicons:x-circle" className="w-4 h-4" />
                    Cancel Subscription
                  </Button>
                ) : null}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Available Plans */}
      <Card>
        <CardHeader className="border-b">
          <CardTitle className="text-xl">Available Plans</CardTitle>
          <CardDescription>Choose the plan that best fits your needs</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {plans.map((plan) => {
              const isCurrentPlan = plan.planName === subscription.planName;
              const canUpgrade = isPlanHigher(plan.planName, subscription.planName);

              return (
                <Card
                  key={plan.planName}
                  className={`relative ${isCurrentPlan ? 'border-primary border-2' : ''}`}
                >
                  {isCurrentPlan && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <Badge color="primary">Current Plan</Badge>
                    </div>
                  )}

                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg capitalize">{plan.planName}</CardTitle>
                    <div className="mt-2">
                      <span className="text-3xl font-bold">{formatCurrency(plan.price)}</span>
                      {plan.price > 0 && <span className="text-muted-foreground">/month</span>}
                    </div>
                    <CardDescription className="text-xs mt-2">{plan.description}</CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Icon icon="heroicons:check" className="w-4 h-4 text-success" />
                        <span>{plan.visitsIncluded.toLocaleString()} visits/month</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Icon icon="heroicons:check" className="w-4 h-4 text-success" />
                        <span>{plan.campaignLimit} campaigns</span>
                      </div>
                    </div>

                    <div className="pt-4">
                      {isCurrentPlan ? (
                        <Button className="w-full" disabled>
                          Current Plan
                        </Button>
                      ) : canUpgrade ? (
                        <>
                          <Button
                            className="w-full gap-2"
                            onClick={() => handleUpgrade(plan.planName)}
                            disabled={actionLoading}
                          >
                            {actionLoading && selectedPlan === plan.planName ? (
                              <>
                                <Icon icon="heroicons:arrow-path" className="w-4 h-4 animate-spin" />
                                {subscription?.planName === "free" ? "Redirecting..." : "Processing..."}
                              </>
                            ) : (
                              <>
                                <Icon icon="heroicons:arrow-up" className="w-4 h-4" />
                                {subscription?.planName === "free" ? "Subscribe Now" : "Upgrade"}
                              </>
                            )}
                          </Button>
                          {subscription?.planName === "free" && (
                            <p className="text-xs text-muted-foreground text-center mt-2">
                              Secure checkout via Stripe
                            </p>
                          )}
                        </>
                      ) : plan.planName === "free" ? (
                        <Button className="w-full" variant="outline" disabled>
                          Free Plan
                        </Button>
                      ) : (
                        <Button 
                          className="w-full gap-2" 
                          variant="outline"
                          onClick={() => handleDowngrade(plan.planName)}
                          disabled={actionLoading}
                        >
                          {actionLoading && selectedPlan === plan.planName ? (
                            <>
                              <Icon icon="heroicons:arrow-path" className="w-4 h-4 animate-spin" />
                              Processing...
                            </>
                          ) : (
                            <>
                              <Icon icon="heroicons:arrow-down" className="w-4 h-4" />
                              Downgrade
                            </>
                          )}
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Cancel Confirmation Dialog */}
      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Subscription?</AlertDialogTitle>
            <AlertDialogDescription>
              Your subscription will remain active until {subscription.currentPeriodEnd ? formatDate(subscription.currentPeriodEnd) : 'the end of the billing period'}. 
              After that, you'll be moved to the Free plan.
              <br /><br />
              You can reactivate your subscription anytime before the period ends.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep Subscription</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCancel}
              className="bg-destructive hover:bg-destructive/90"
              disabled={actionLoading}
            >
              {actionLoading ? "Canceling..." : "Cancel Subscription"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

