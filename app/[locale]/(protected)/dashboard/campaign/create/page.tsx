"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CampaignCreateData } from "@/context/campaignStore";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowDownNarrowWide, Target } from "lucide-react";

import { Slider } from "@/components/ui/slider";
import { toast } from "@/components/ui/use-toast";
import { useTranslations } from "next-intl";
import { useCampaignStore } from "@/context/campaignStore";
import { Info } from "lucide-react";
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import Link from "next/link";


export default function CreateCampaignPage() {
  const t = useTranslations();
  const router = useRouter();
  const { createCampaign, isLoading, error, clearError } = useCampaignStore();


  // Form state
  const [formData, setFormData] = useState<CampaignCreateData>({
    url: "",
    title: "",
    urls: [""],
    languages: "en",
    geo_type: "global",
    size: "eco", // Hardcoded to small
    speed: 200
  });

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle slider changes
  const handleSliderChange = (name: string, value: number[]) => {
    setFormData((prev) => ({ ...prev, [name]: value[0] }));
  };

  // Handle URL array changes
  const handleUrlChange = (index: number, value: string) => {
    const newUrls = [...formData.urls];
    newUrls[index] = value;
    setFormData((prev) => ({ ...prev, urls: newUrls }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Validate required fields
      if (!formData.title) {
        toast({
          title: "Error",
          description: "Title is required",
          variant: "destructive",
        });
        return;
      }

      if (!formData.url) {
        toast({
          title: "Error",
          description: "URL is required",
          variant: "destructive",
        });
        return;
      }
      if (formData.urls.some(url => !url)) {
        toast({
          title: "Error",
          description: "All URL fields must be filled",
          variant: "destructive",
        });
        return;
      }

      // Create campaign
      const campaign = await createCampaign(formData);

      // Show success message
      toast({
        title: "Success",
        description: "Campaign created successfully",
      });

      // Redirect to campaign details page
      router.push(`/${window.location.pathname.split('/')[1]}/dashboard/campaign/${campaign.id}`);
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
          <Info className="h-4 w-4 ml-1 text-gray-400" />
        </TooltipTrigger>
        <TooltipContent>
          <p className="max-w-xs">{content}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );

  return (
    <div>
      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-4">
          <p><Link href={`/${window.location.pathname.split('/')[1]}/dashboard/campaign/list`} className="flex gap-2 text-[#044575]"> <ArrowDownNarrowWide />See all campaigns</Link></p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="flex h-12 w-12 items-center justify-center">
                  <Target className="h-6 w-6 text-purple-600 dark:text-purple-400" fill="#4b139e" stroke="white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Create a new campaign</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Configure the fundamental details of your campaign</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="title" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Campaign Title
                    </Label>
                    <InfoTooltip content="Enter a descriptive name for your campaign" />
                  </div>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Enter campaign title"
                    className="h-11 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    required
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="url" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Main URL
                    </Label>
                    <InfoTooltip content="The primary URL for your campaign" />
                  </div>
                  <Input
                    id="url"
                    name="url"
                    value={formData.url}
                    onChange={handleChange}
                    placeholder="Enter main URL"
                    className="h-11 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    required
                  />
                </div>
              </div>

              <div className="space-y-3 mt-6">
                <div className="flex items-center gap-2">
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Target URLs
                  </Label>
                  <InfoTooltip content="URLs that will receive traffic from this campaign" />
                </div>
                <div className="space-y-3">
                  {formData.urls.map((url, index) => (
                    <div key={index} className="flex gap-3 items-center">
                      <Input
                        value={url}
                        onChange={(e) => handleUrlChange(index, e.target.value)}
                        placeholder="Enter target URL"
                        className="h-11 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 flex-1"
                        required
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4 p-6 mt-6 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="speed" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Page Views per Day
                    </Label>
                    <InfoTooltip content="Number of daily page views for your campaign" />
                  </div>
                  <div className="w-20">
                    <Input
                      id="speed-value"
                      value={formData.speed}
                      onChange={(e) => handleSliderChange("speed", [parseInt(e.target.value) || 0])}
                      className="text-right h-9 text-sm font-mono bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>
                <div className="pt-2">
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
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 pt-1">
                  <span className="font-mono">10</span>
                  <span className="font-mono">2K</span>
                  <span className="font-mono">5K</span>
                  <span className="font-mono">10K</span>
                </div>
              </div>
          </div>
        </Card>

          <div className="flex justify-end space-x-4 pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              className="h-11 px-6 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="h-11 px-8 bg-purple-600 hover:bg-purple-700 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating...
                </div>
              ) : (
                "Create Campaign"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}