"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CampaignCreateData } from "@/context/campaignStore";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Check, ChevronsUpDown, Globe, Target, Users, Settings, RefreshCw, Info as InfoIcon } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { toast } from "@/components/ui/use-toast";
import { useTranslations } from "next-intl";
import { useCampaignStore } from "@/context/campaignStore";
import PageTitle from "@/components/page-title";
import { Info } from "lucide-react";
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { countries } from "@/lib/data";

export default function CreateCampaignPage() {
  const t = useTranslations();
  const router = useRouter();
  const { createCampaign, isLoading, error, clearError } = useCampaignStore();


  // Form state
  const [formData, setFormData] = useState<CampaignCreateData>({
    url: "trafficboxes.com",
    title: "",
    urls: [""],
    keywords: "",
    referrers: {
      mode: "basic", // Hardcoded to basic mode
      urls: [""]
    },
    languages: "en",
    bounce_rate: 0,
    return_rate: 0,
    click_outbound_events: 0,
    form_submit_events: 0,
    scroll_events: 0,
    time_on_page: "30sec",
    desktop_rate: 50,
    auto_renew: "false",
    geo_type: "global",
    geo: [],
    shortener: "",
    rss_feed: "",
    ga_id: "",
    size: "eco", // Hardcoded to small
    speed: 200
  });

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle select changes
  const handleSelectChange = (name: string, value: string) => {
    if (name === "geo_type") {
      // Reset geo value based on geo_type
      if (value === "global") {
        setFormData((prev) => ({ ...prev, geo_type: value, geo: [] }));
      } else if (value === "countries") {
        setFormData((prev) => ({ ...prev, geo_type: value, geo: [{ country: countries[0].value, percent: 1.0 }] }));
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Handle multi-select for geo codes
  const handleGeoCodesChange = (values: string[]) => {
    const totalPercent = 1.0;
    const percentPerCountry = totalPercent / values.length;
    
    setFormData((prev) => ({
      ...prev,
      geo: values.map(country => ({ country, percent: percentPerCountry }))
    }));
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

  // Add new URL field
  const addUrlField = () => {
    setFormData((prev) => ({ ...prev, urls: [...prev.urls, ""] }));
  };

  // Remove URL field
  const removeUrlField = (index: number) => {
    if (formData.urls.length > 1) {
      const newUrls = [...formData.urls];
      newUrls.splice(index, 1);
      setFormData((prev) => ({ ...prev, urls: newUrls }));
    }
  };

  // Handle referrer URL array changes
  const handleReferrerUrlChange = (index: number, value: string) => {
    const newReferrerUrls = [...formData.referrers.urls];
    newReferrerUrls[index] = value;
    setFormData((prev) => ({
      ...prev,
      referrers: { ...prev.referrers, urls: newReferrerUrls }
    }));
  };

  // Add new referrer URL field
  const addReferrerUrlField = () => {
    setFormData((prev) => ({
      ...prev,
      referrers: {
        ...prev.referrers,
        urls: [...prev.referrers.urls, ""]
      }
    }));
  };

  // Remove referrer URL field
  const removeReferrerUrlField = (index: number) => {
    if (formData.referrers.urls.length > 1) {
      const newReferrerUrls = [...formData.referrers.urls];
      newReferrerUrls.splice(index, 1);
      setFormData((prev) => ({
        ...prev,
        referrers: { ...prev.referrers, urls: newReferrerUrls }
      }));
    }
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-8">
          <PageTitle title={t("Menu.create_campaign")} />
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
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Basic Information</h3>
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
                      />
                      {formData.urls.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => removeUrlField(index)}
                          className="h-11 w-11 shrink-0 border-gray-200 dark:border-gray-700 hover:bg-red-50 dark:hover:bg-red-900/20 hover:border-red-300 dark:hover:border-red-600 transition-all duration-200"
                        >
                          <span className="sr-only">Remove</span>
                          <span className="h-4 w-4">✕</span>
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addUrlField}
                    className="h-10 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200"
                  >
                    Add URL
                  </Button>
                </div>
              </div>

              <div className="space-y-3 mt-6">
                <div className="flex items-center gap-2">
                  <Label htmlFor="keywords" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Keywords
                  </Label>
                  <InfoTooltip content="Comma-separated keywords relevant to your campaign" />
                </div>
                <Input
                  id="keywords"
                  name="keywords"
                  value={formData.keywords}
                  onChange={handleChange}
                  placeholder="Enter keywords (comma separated)"
                  className="h-11 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
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

          {/* Advanced Information */}
          <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="p-8">
              <div className="flex items-center gap-4 mb-8">
                <div className="flex h-12 w-12 items-center justify-center">
                  <Settings className="h-6 w-6 text-purple-600 dark:text-purple-400" fill="#4b139e" stroke="white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Advanced Settings</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Fine-tune your campaign with advanced configuration options</p>
                </div>
              </div>

              <Accordion type="multiple" className="w-full space-y-4">
                {/* Referrers */}
                <AccordionItem value="referrers" className="border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800">
                  <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg">
                    <div className="flex items-center gap-3 text-left">
                      <div className="flex h-10 w-10 items-center justify-center">
                        <Globe className="h-5 w-5 text-purple-600 dark:text-purple-400" fill="#4b139e" stroke="white" />
                      </div>
                      <div>
                        <h4 className="text-base font-semibold text-gray-900 dark:text-gray-100">Referrers</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Configure traffic sources and origins</p>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-6">
                    <div className="space-y-4 pt-2">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Define the sources of your traffic. Enter one URL per line. Traffic from these sources will be simulated.
                      </p>

                      <div className="space-y-3">
                        <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Referrer URLs</Label>
                        {formData.referrers.urls.map((url, index) => (
                          <div key={index} className="flex gap-3 items-center">
                            <Input
                              value={url}
                              onChange={(e) => handleReferrerUrlChange(index, e.target.value)}
                              placeholder="Enter referrer URL"
                              className="h-10 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 flex-1"
                            />
                            {formData.referrers.urls.length > 1 && (
                              <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                onClick={() => removeReferrerUrlField(index)}
                                className="h-10 w-10 shrink-0 border-gray-200 dark:border-gray-700 hover:bg-red-50 dark:hover:bg-red-900/20 hover:border-red-300 dark:hover:border-red-600 transition-all duration-200"
                              >
                                <span className="sr-only">Remove</span>
                                <span className="h-4 w-4">✕</span>
                              </Button>
                            )}
                          </div>
                        ))}
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={addReferrerUrlField}
                          className="h-9 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200"
                        >
                          Add Referrer URL
                        </Button>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* Traffic Settings */}
                <AccordionItem value="traffic" className="border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800">
                  <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg">
                    <div className="flex items-center gap-3 text-left">
                      <div className="flex h-10 w-10 items-center justify-center">
                        <Target className="h-5 w-5 text-purple-600 dark:text-purple-400" fill="#4b139e" stroke="white" />
                      </div>
                      <div>
                        <h4 className="text-base font-semibold text-gray-900 dark:text-gray-100">Traffic Settings</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Configure traffic volume and geographic distribution</p>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-6">
                    <div className="space-y-6 pt-2">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <Label htmlFor="geo_type" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                              Geography Type
                            </Label>
                            <InfoTooltip content="Level of geographic targeting" />
                          </div>
                          <Select
                            value={formData.geo_type}
                            onValueChange={(value) => handleSelectChange("geo_type", value)}
                          >
                            <SelectTrigger id="geo_type" className="h-10 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-purple-500">
                              <SelectValue placeholder="Select geo type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="global">Global</SelectItem>
                              <SelectItem value="countries">Countries</SelectItem>
                            </SelectContent>
                          </Select>
                          {formData.geo_type === "global" && (
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Global targeting does not require specific location selection.</p>
                          )}
                        </div> */}

                        {/* {formData.geo_type === "countries" && (
                          <div className="space-y-3">
                            <div className="flex items-center gap-2">
                              <Label htmlFor="geo" className="text-sm font-medium text-gray-700 dark:text-gray-300">Select Countries</Label>
                              <InfoTooltip content="Target specific countries for your traffic" />
                            </div>
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button
                                  variant="outline"
                                  role="combobox"
                                  className="w-full h-10 justify-between border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200"
                                >
                                  {formData.geo.length > 0
                                    ? `${formData.geo.length} countries selected`
                                    : "Select countries"}
                                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-full p-0">
                                <Command>
                                  <CommandInput placeholder="Search countries..." />
                                  <CommandEmpty>No country found.</CommandEmpty>
                                  <CommandGroup className="max-h-64 overflow-auto">
                                    {countries.map((country: { value: string; label: string }) => {
                                      const isSelected = formData.geo.some(geo => geo.country === country.value);
                                      return (
                                        <CommandItem
                                          key={country.value}
                                          value={country.value}
                                          onSelect={() => {
                                            const currentCountries = formData.geo.map(geo => geo.country);
                                            const updatedCountries = currentCountries.includes(country.value)
                                              ? currentCountries.filter(code => code !== country.value)
                                              : [...currentCountries, country.value];
                                            handleGeoCodesChange(updatedCountries);
                                          }}
                                        >
                                          <Check
                                            className={`mr-2 h-4 w-4 ${isSelected ? "opacity-100" : "opacity-0"}`}
                                          />
                                          {country.label}
                                        </CommandItem>
                                      );
                                    })}
                                  </CommandGroup>
                                </Command>
                              </PopoverContent>
                            </Popover>
                          </div>
                        )} */}

                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              <Label htmlFor="desktop_rate" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                Desktop Rate (%)
                              </Label>
                              <InfoTooltip content="Percentage of traffic from desktop devices" />
                            </div>
                            <div className="w-16">
                              <Input
                                id="desktop-rate-value"
                                value={formData.desktop_rate}
                                onChange={(e) => handleSliderChange("desktop_rate", [parseInt(e.target.value) || 0])}
                                className="text-right h-9 text-sm font-mono bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-purple-500"
                              />
                            </div>
                          </div>
                          <div className="pt-2">
                            <Slider
                              id="desktop_rate"
                              min={0}
                              max={100}
                              step={1}
                              value={[formData.desktop_rate]}
                              onValueChange={(value) => handleSliderChange("desktop_rate", value)}
                              className="w-full"
                            />
                          </div>
                          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 pt-1">
                            <span className="font-mono">0%</span>
                            <span className="font-mono">50%</span>
                            <span className="font-mono">100%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* Behavior Settings */}
                <AccordionItem value="behavior" className="border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800">
                  <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg">
                    <div className="flex items-center gap-3 text-left">
                      <div className="flex h-10 w-10 items-center justify-center">
                        <Users className="h-5 w-5 text-purple-600 dark:text-purple-400" fill="#4b139e" stroke="white" />
                      </div>
                      <div>
                        <h4 className="text-base font-semibold text-gray-900 dark:text-gray-100">Behavior Settings</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Configure visitor interaction patterns</p>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-6">
                    <div className="space-y-6 pt-2">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              <Label htmlFor="bounce_rate" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                Bounce Rate (%)
                              </Label>
                              <InfoTooltip content="Percentage of visitors who leave after viewing only one page" />
                            </div>
                            <div className="w-16">
                              <Input
                                id="bounce-rate-value"
                                value={formData.bounce_rate}
                                onChange={(e) => handleSliderChange("bounce_rate", [parseInt(e.target.value) || 0])}
                                className="text-right h-9 text-sm font-mono bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-green-500"
                              />
                            </div>
                          </div>
                          <div className="pt-2">
                            <Slider
                              id="bounce_rate"
                              min={0}
                              max={100}
                              step={1}
                              value={[formData.bounce_rate]}
                              onValueChange={(value) => handleSliderChange("bounce_rate", value)}
                              className="w-full"
                            />
                          </div>
                          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 pt-1">
                            <span className="font-mono">0%</span>
                            <span className="font-mono">50%</span>
                            <span className="font-mono">100%</span>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              <Label htmlFor="return_rate" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                Return Rate (%)
                              </Label>
                              <InfoTooltip content="Percentage of visitors who return to your site" />
                            </div>
                            <div className="w-16">
                              <Input
                                id="return-rate-value"
                                value={formData.return_rate}
                                onChange={(e) => handleSliderChange("return_rate", [parseInt(e.target.value) || 0])}
                                className="text-right h-9 text-sm font-mono bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-green-500"
                              />
                            </div>
                          </div>
                          <div className="pt-2">
                            <Slider
                              id="return_rate"
                              min={0}
                              max={100}
                              step={1}
                              value={[formData.return_rate]}
                              onValueChange={(value) => handleSliderChange("return_rate", value)}
                              className="w-full"
                            />
                          </div>
                          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 pt-1">
                            <span className="font-mono">0%</span>
                            <span className="font-mono">50%</span>
                            <span className="font-mono">100%</span>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              <Label htmlFor="click_outbound_events" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                Outbound Click Events
                              </Label>
                              <InfoTooltip content="Number of clicks to external links" />
                            </div>
                            <div className="w-16">
                              <Input
                                id="click-events-value"
                                value={formData.click_outbound_events}
                                onChange={(e) => handleSliderChange("click_outbound_events", [parseInt(e.target.value) || 0])}
                                className="text-right h-9 text-sm font-mono bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-green-500"
                              />
                            </div>
                          </div>
                          <div className="pt-2">
                            <Slider
                              id="click_outbound_events"
                              min={0}
                              max={10}
                              step={1}
                              value={[formData.click_outbound_events]}
                              onValueChange={(value) => handleSliderChange("click_outbound_events", value)}
                              className="w-full"
                            />
                          </div>
                          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 pt-1">
                            <span className="font-mono">0</span>
                            <span className="font-mono">5</span>
                            <span className="font-mono">10</span>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              <Label htmlFor="form_submit_events" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                Form Submit Events
                              </Label>
                              <InfoTooltip content="Number of form submissions per visit" />
                            </div>
                            <div className="w-16">
                              <Input
                                id="form-submit-value"
                                value={formData.form_submit_events}
                                onChange={(e) => handleSliderChange("form_submit_events", [parseInt(e.target.value) || 0])}
                                className="text-right h-9 text-sm font-mono bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-green-500"
                              />
                            </div>
                          </div>
                          <div className="pt-2">
                            <Slider
                              id="form_submit_events"
                              min={0}
                              max={5}
                              step={1}
                              value={[formData.form_submit_events]}
                              onValueChange={(value) => handleSliderChange("form_submit_events", value)}
                              className="w-full"
                            />
                          </div>
                          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 pt-1">
                            <span className="font-mono">0</span>
                            <span className="font-mono">2</span>
                            <span className="font-mono">5</span>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              <Label htmlFor="scroll_events" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                Scroll Events
                              </Label>
                              <InfoTooltip content="Number of significant scroll actions per visit" />
                            </div>
                            <div className="w-16">
                              <Input
                                id="scroll-events-value"
                                value={formData.scroll_events}
                                onChange={(e) => handleSliderChange("scroll_events", [parseInt(e.target.value) || 0])}
                                className="text-right h-9 text-sm font-mono bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-green-500"
                              />
                            </div>
                          </div>
                          <div className="pt-2">
                            <Slider
                              id="scroll_events"
                              min={0}
                              max={10}
                              step={1}
                              value={[formData.scroll_events]}
                              onValueChange={(value) => handleSliderChange("scroll_events", value)}
                              className="w-full"
                            />
                          </div>
                          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 pt-1">
                            <span className="font-mono">0</span>
                            <span className="font-mono">5</span>
                            <span className="font-mono">10</span>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <Label htmlFor="time_on_page" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                              Time on Page
                            </Label>
                            <InfoTooltip content="Average time visitors spend on your page" />
                          </div>
                          <Select
                            value={formData.time_on_page}
                            onValueChange={(value) => handleSelectChange("time_on_page", value)}
                          >
                            <SelectTrigger id="time_on_page" className="h-10 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-green-500">
                              <SelectValue placeholder="Select time" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="2sec">2 seconds</SelectItem>
                              <SelectItem value="5sec">5 seconds</SelectItem>
                              <SelectItem value="10sec">10 seconds</SelectItem>
                              <SelectItem value="30sec">30 seconds</SelectItem>
                              <SelectItem value="1min">1 minute</SelectItem>
                              <SelectItem value="2min">2 minutes</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* Campaign Settings */}
                <AccordionItem value="campaign-settings" className="border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800">
                  <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg">
                    <div className="flex items-center gap-3 text-left">
                      <div className="flex h-10 w-10 items-center justify-center">
                        <Settings className="h-5 w-5 text-purple-600 dark:text-purple-400" fill="#4b139e" stroke="white" />
                      </div>
                      <div>
                        <h4 className="text-base font-semibold text-gray-900 dark:text-gray-100">Campaign Settings</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Additional campaign configuration options</p>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-6">
                    <div className="space-y-6 pt-2">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <Label htmlFor="shortener" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                              URL Shortener
                            </Label>
                            <InfoTooltip content="Optional URL shortener service" />
                          </div>
                          <Input
                            id="shortener"
                            name="shortener"
                            value={formData.shortener}
                            onChange={handleChange}
                            placeholder="Enter URL shortener"
                            className="h-10 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                          />
                        </div>

                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <Label htmlFor="rss_feed" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                              RSS Feed
                            </Label>
                            <InfoTooltip content="Optional RSS feed URL" />
                          </div>
                          <Input
                            id="rss_feed"
                            name="rss_feed"
                            value={formData.rss_feed}
                            onChange={handleChange}
                            placeholder="Enter RSS feed URL"
                            className="h-10 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                          />
                        </div>

                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <Label htmlFor="ga_id" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                              Google Analytics ID
                            </Label>
                            <InfoTooltip content="Optional Google Analytics tracking ID" />
                          </div>
                          <Input
                            id="ga_id"
                            name="ga_id"
                            value={formData.ga_id}
                            onChange={handleChange}
                            placeholder="Enter Google Analytics ID"
                            className="h-10 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                          />
                        </div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* Auto Renew Setting */}
                <AccordionItem value="auto-renew" className="border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800">
                  <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg">
                    <div className="flex items-center gap-3 text-left">
                      <div className="flex h-10 w-10 items-center justify-center">
                        <RefreshCw className="h-5 w-5 text-purple-600 dark:text-purple-400" fill="#4b139e" stroke="white" />
                      </div>
                      <div>
                        <h4 className="text-base font-semibold text-gray-900 dark:text-gray-100">Campaign Renewal</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Configure automatic campaign renewal</p>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-6">
                    <div className="space-y-4 pt-2">
                      <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center gap-3">
                          <Switch
                            id="auto_renew"
                            checked={formData.auto_renew === "true"}
                            onCheckedChange={(checked) =>
                              handleSelectChange("auto_renew", checked ? "true" : "false")
                            }
                            className="data-[state=checked]:bg-teal-500"
                          />
                          <div>
                            <Label htmlFor="auto_renew" className="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer">
                              Auto Renew Campaign
                            </Label>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Automatically renew when campaign expires</p>
                          </div>
                        </div>
                        <InfoTooltip content="When enabled, your campaign will automatically renew when it expires" />
                      </div>

                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Enabling auto-renewal ensures your campaign continues without interruption.
                        You can disable this setting at any time from the campaign details page.
                      </p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
            </Accordion>
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