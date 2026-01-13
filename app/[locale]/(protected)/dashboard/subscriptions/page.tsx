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
  const [showCardSelection, setShowCardSelection] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState<any[]>([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('');
  const [upgradingToPlan, setUpgradingToPlan] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
    fetchPaymentMethods();
    
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

  const fetchPaymentMethods = async () => {
    try {
      const response = await fetch("/api/subscription/payment-methods");
      if (!response.ok) throw new Error("Failed to fetch payment methods");
      
      const data = await response.json();
      setPaymentMethods(data.paymentMethods || []);
      
      // Auto-select default payment method
      const defaultMethod = data.paymentMethods?.find((pm: any) => pm.isDefault);
      if (defaultMethod) {
        setSelectedPaymentMethod(defaultMethod.id);
      }
    } catch (err: any) {
      console.error("Error fetching payment methods:", err);
    }
  };

  const formatCardDisplay = (card: any) => {
    return `${card.brand.toUpperCase()} •••• ${card.last4}`;
  };

  const handleUpgradeClick = async (planName: string) => {
    // If user has multiple cards, show selection modal
    if (paymentMethods.length > 1) {
      setUpgradingToPlan(planName);
      setShowCardSelection(true);
      return;
    }

    // If no payment method, prompt to add one
    if (paymentMethods.length === 0) {
      await handleUpgrade(planName);
      // toast.error("Please add a payment method first");
      // return;
    }

    // Single card - proceed directly
    await handleUpgrade(planName, paymentMethods[0].id);
  };

  const handleUpgrade = async (planName: string, paymentMethodId?: string) => {
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
            successUrl: `https://app.trafficboxes.com/en/dashboard/subscription/success`,
            cancelUrl: `https://app.trafficboxes.com/en/dashboard/subscription/cancel`,
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
      const requestBody: any = { planName };
      if (paymentMethodId) {
        requestBody.paymentMethodId = paymentMethodId;
      }

      const response = await fetch("/api/subscription/upgrade", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
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

  const handleConfirmUpgradeWithCard = async () => {
    if (!selectedPaymentMethod) {
      toast.error("Please select a payment method");
      return;
    }
    if (upgradingToPlan) {
      setShowCardSelection(false);
      await handleUpgrade(upgradingToPlan, selectedPaymentMethod);
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
      custom: "destructive",
    };
    return colors[planName] || "default";
  };

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
      custom: {
        bg: "#5B21B6", // Dark Purple (like logo)
        border: "2px solid #5B21B6",
        text: "#ffffff"
      },
    };
    return planStyles[planName] || planStyles.free;
  };

  const getPlanGradient = (planName: string) => {
    const gradients: { [key: string]: string } = {
      free: "linear-gradient(135deg, rgba(100, 116, 139, 0.08) 0%, rgba(100, 116, 139, 0.02) 100%)",
      starter: "linear-gradient(135deg, rgba(184, 115, 51, 0.12) 0%, rgba(184, 115, 51, 0.03) 100%)",
      growth: "linear-gradient(135deg, rgba(192, 192, 192, 0.15) 0%, rgba(192, 192, 192, 0.04) 100%)",
      business: "linear-gradient(135deg, rgba(255, 215, 0, 0.18) 0%, rgba(255, 215, 0, 0.04) 100%)",
      custom: "linear-gradient(135deg, rgba(91, 33, 182, 0.20) 0%, rgba(91, 33, 182, 0.05) 100%)",
    };
    return gradients[planName] || gradients.free;
  };

  const isPlanHigher = (planA: string, planB: string) => {
    const hierarchy = ["free", "starter", "growth", "business", "custom"];
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
                  <Badge 
                    className="capitalize font-semibold"
                    style={{
                      backgroundColor: getPlanStyles(subscription.planName).bg,
                      border: getPlanStyles(subscription.planName).border,
                      color: getPlanStyles(subscription.planName).text,
                    }}
                  >
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
              const isCustom = plan.planName === "custom";

              return (
                <Card
                  key={plan.planName}
                  className={`relative overflow-hidden ${isCurrentPlan ? 'ring-2 ring-offset-2' : 'border'}`}
                  style={{
                    background: getPlanGradient(plan.planName),
                    borderColor: isCurrentPlan ? getPlanStyles(plan.planName).bg : '#e5e7eb',
                    '--tw-ring-color': getPlanStyles(plan.planName).bg,
                  } as React.CSSProperties}
                >
                  <CardHeader className="pb-4 relative z-[1]">
                    <CardTitle className="text-lg capitalize font-bold">
                      {plan.planName}
                    </CardTitle>
                    <div className="mt-2">
                      {isCustom ? (
                        <span className="text-3xl font-bold">$-.--</span>
                      ) : (
                        <>
                          <span className="text-3xl font-bold">{formatCurrency(plan.price)}</span>
                          {plan.price > 0 && <span className="text-muted-foreground">/month</span>}
                        </>
                      )}
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
                      {isCustom ? (
                        <Button 
                          className="w-full gap-2"
                          asChild
                        >
                          <a href="/subscription/custom-contact" target="_blank" rel="noopener noreferrer">
                            <Icon icon="heroicons:envelope" className="w-4 h-4" />
                            Contact Us
                          </a>
                        </Button>
                      ) : isCurrentPlan ? (
                        <Button className="w-full" disabled>
                          Current Plan
                        </Button>
                      ) : canUpgrade ? (
                        <>
                          <Button
                            className="w-full gap-2"
                            onClick={() => handleUpgradeClick(plan.planName)}
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

      {/* Card Selection Dialog */}
      <AlertDialog open={showCardSelection} onOpenChange={setShowCardSelection}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Choose Payment Method</AlertDialogTitle>
            <AlertDialogDescription>
              Select which card you'd like to use for this upgrade.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="space-y-3 my-4">
            {paymentMethods.map((pm) => (
              <Card 
                key={pm.id} 
                className={`cursor-pointer transition-all ${
                  selectedPaymentMethod === pm.id 
                    ? 'ring-2 ring-primary' 
                    : 'hover:border-primary'
                }`}
                onClick={() => setSelectedPaymentMethod(pm.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={pm.id}
                      checked={selectedPaymentMethod === pm.id}
                      onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                      className="w-4 h-4"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Icon icon="heroicons:credit-card" className="w-5 h-5" />
                        <span className="font-medium">
                          {pm.card ? formatCardDisplay(pm.card) : pm.type}
                        </span>
                        {pm.isDefault && (
                          <Badge color="success" className="text-xs">
                            Default
                          </Badge>
                        )}
                      </div>
                      {pm.card && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Expires {pm.card.expMonth}/{pm.card.expYear}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => {
              setShowCardSelection(false);
              setUpgradingToPlan(null);
            }}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmUpgradeWithCard}
              disabled={actionLoading || !selectedPaymentMethod}
              className="bg-primary hover:bg-primary/90"
            >
              {actionLoading ? "Processing..." : "Confirm Upgrade"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

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

