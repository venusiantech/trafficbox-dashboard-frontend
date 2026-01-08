"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CampaignCreateData } from "@/context/campaignStore";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {PlusCircle, Info } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { toast } from "@/components/ui/use-toast";
import { useTranslations } from "next-intl";
import { useCampaignStore } from "@/context/campaignStore";
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import Link from "next/link";
import CampaignFAQ from "@/components/campaign-faq";

export default function CreateCampaignPage() {
  const t = useTranslations();
  const router = useRouter();
  const { createCampaign, isLoading } = useCampaignStore();

  // Form state
  const [formData, setFormData] = useState<CampaignCreateData>({
    url: "",
    title: "",
    urls: [""],
    languages: "en",
    geo_type: "global",
    size: "eco",
    speed: 200
  });

  // Automatically set target URLs to match Main URL
  useEffect(() => {
    if (formData.url) {
      setFormData((prev) => ({
        ...prev,
        urls: [formData.url]
      }));
    }
  }, [formData.url]);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle slider changes
  const handleSliderChange = (name: string, value: number[]) => {
    setFormData((prev) => ({ ...prev, [name]: value[0] }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Validate required fields
      if (!formData.title?.trim()) {
        toast({
          title: "Error",
          description: "Campaign title is required",
          variant: "destructive",
        });
        return;
      }

      if (!formData.url?.trim()) {
        toast({
          title: "Error",
          description: "Main URL is required",
          variant: "destructive",
        });
        return;
      }

      // Create campaign with Main URL as target URL
      const campaign = await createCampaign({
        ...formData,
        urls: [formData.url]
      });

      toast({
        title: "Success",
        description: "Campaign created successfully",
      });

      // Redirect to campaign details page
      const locale = window.location.pathname.split('/')[1];
      router.push(`/${locale}/dashboard/campaign/${campaign.id}`);
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to create campaign",
        variant: "destructive",
      });
    }
  };

  // Tooltip component for info icons
  const InfoTooltip = ({ content }: { content: string }) => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-xs max-w-xs">{content}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );

  const locale = typeof window !== 'undefined' ? window.location.pathname.split('/')[1] : 'en';

  return (
    <div className="flex-1">
      <div className="max-w-7xl mx-auto">
        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
          {/* Form - Left Side */}
          <div className="lg:col-span-3">
            <form onSubmit={handleSubmit} className="space-y-6">
              <Card className="p-5 md:p-6">
                {/* Header */}
                <div className="mb-6">
                  <div className="flex items-center gap-2.5">
                  <PlusCircle className="h-5 w-5 text-purple-600" />
                    <div>
                      <h1 className="text-xl font-semibold">Create a New Campaign</h1>
                    </div>
                  </div>
                </div>

                <div className="space-y-8 mt-8">
                  {/* Campaign Title */}
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-1.5">
                      <h6 className="text-sm font-medium">
                        Campaign Title
                      </h6>
                      <InfoTooltip content="Enter a descriptive name for your campaign" />
                    </div>
                    <Input
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      placeholder="Enter campaign title"
                      className="h-9"
                      required
                    />
                  </div>

                  {/* Main URL */}
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-1.5">
                      <h6 className="text-sm font-medium">
                        Main URL
                      </h6>
                      <InfoTooltip content="The primary URL for your campaign. This will also be used as the target URL." />
                    </div>
                    <Input
                      id="url"
                      name="url"
                      type="url"
                      value={formData.url}
                      onChange={handleChange}
                      placeholder="https://example.com"
                      className="h-9 font-mono text-sm"
                      required
                    />
                  </div>

                  {/* Page Views per Day */}
                  <div className="space-y-3 pt-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <h6 className="text-sm font-medium">
                          Page Views per Day
                        </h6>
                        <InfoTooltip content="Number of daily page views for your campaign" />
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-7 bg-muted rounded-md flex items-center justify-center">
                          <span className="text-sm font-mono font-medium">{formData.speed}</span>
                        </div>
                      </div>
                    </div>
                    <div className="px-1">
                      <Slider
                        id="speed"
                        min={10}
                        max={10000}
                        step={10}
                        value={[formData.speed]}
                        onValueChange={(value) => handleSliderChange("speed", value)}
                        className="w-full"
                      />
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground px-1">
                      <span>10</span>
                      <span>2K</span>
                      <span>5K</span>
                      <span>10K</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-start gap-6 mt-10">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.back()}
                    className="h-9 px-4"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="h-9 px-6 bg-default hover:bg-default-700 text-white"
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Creating...</span>
                      </div>
                    ) : (
                      "Create Campaign"
                    )}
                  </Button>
                </div>
              </Card>
            </form>
          </div>

          {/* FAQ - Right Side */}
          <div className="lg:col-span-2">
            <CampaignFAQ />
          </div>
        </div>
      </div>
    </div>
  );
}
