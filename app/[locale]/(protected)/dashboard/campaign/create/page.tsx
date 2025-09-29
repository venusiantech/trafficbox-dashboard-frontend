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
import { Check, ChevronsUpDown } from "lucide-react";
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

export default function CreateCampaignPage() {
  const t = useTranslations();
  const router = useRouter();
  const { createCampaign, isLoading, error, clearError } = useCampaignStore();

  // Countries list for selection
  const countries = [
    { value: "US", label: "United States" },
    { value: "UK", label: "United Kingdom" },
    { value: "CA", label: "Canada" },
    { value: "AU", label: "Australia" },
    { value: "DE", label: "Germany" },
    { value: "FR", label: "France" },
    { value: "IN", label: "India" },
    { value: "BR", label: "Brazil" }
  ];

  // Cities list for city selection
  const cities = [
    { value: "NYC", label: "New York" },
    { value: "LON", label: "London" },
    { value: "PAR", label: "Paris" },
    { value: "TKY", label: "Tokyo" },
    { value: "SYD", label: "Sydney" },
    { value: "BER", label: "Berlin" },
    { value: "TOR", label: "Toronto" },
    { value: "SIN", label: "Singapore" }
  ];

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
    geo: { codes: [] },
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
        setFormData((prev) => ({ ...prev, geo_type: value, geo: { codes: [] } }));
      } else if (value === "countries") {
        setFormData((prev) => ({ ...prev, geo_type: value, geo: { codes: [countries[0].value] } }));
      } else if (value === "cities") {
        setFormData((prev) => ({ ...prev, geo_type: value, geo: { codes: [cities[0].value] } }));
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Handle multi-select for geo codes
  const handleGeoCodesChange = (values: string[]) => {
    setFormData((prev) => ({
      ...prev,
      geo: {
        ...prev.geo,
        codes: values
      }
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
      router.push(`/${window.location.pathname.split('/')[1]}/dashboard/campaign/${campaign._id}`);
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
    <div className="space-y-6">
      <PageTitle title={t("Menu.create_campaign")} />

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card className="p-6">
          <div className="space-y-4">
            <div className="flex items-center">
              <h3 className="text-lg font-medium">Basic Information</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center">
                  <Label htmlFor="title">
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
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center">
                  <Label htmlFor="url">
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
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center">

                <Label>
                  Target URLs
                </Label>
                <InfoTooltip content="URLs that will receive traffic from this campaign" />
              </div>
              {formData.urls.map((url, index) => (
                <div key={index} className="flex gap-2 items-center">
                  <Input
                    value={url}
                    onChange={(e) => handleUrlChange(index, e.target.value)}
                    placeholder="Enter target URL"
                    className="flex-1"
                  />
                  {formData.urls.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => removeUrlField(index)}
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
              >
                Add URL
              </Button>
            </div>

            <div className="space-y-2">
              <div className="flex items-center">

                <Label htmlFor="keywords">
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
              />
            </div>
            <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="flex item-center">
                          <Label htmlFor="speed">
                            Page Views per Day
                          </Label>
                          <InfoTooltip content="Number of daily page views for your campaign" />
                        </div>
                        <div className="w-16">
                          <Input
                            id="speed-value"
                            value={formData.speed}
                            onChange={(e) => handleSliderChange("speed", [parseInt(e.target.value) || 0])}
                            className="text-right"
                          />
                        </div>
                      </div>
                      <div className="pt-4">
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
                      <div className="flex justify-between text-xs text-gray-500 pt-1">
                        <span>10</span>
                        <span>2K</span>
                        <span>5K</span>
                        <span>10K</span>
                      </div>
                    </div>
                  </div>
          </div>
        </Card>

        {/* Advanced Information */}
        <Card className="p-6">
          <div className="space-y-6">
            <div className="flex items-center">
              <h3 className="text-lg font-medium">Advanced Information</h3>
              <InfoTooltip content="Advanced configuration options for your campaign" />
            </div>

            <Accordion type="multiple" className="w-full">
              {/* Referrers */}
              <AccordionItem value="referrers">
                <AccordionTrigger className="text-left">
                  <div className="flex items-center">
                    <h4 className="text-base font-medium">Referrers</h4>
                    <InfoTooltip content="Configure where your traffic appears to come from" />
                  </div>
                </AccordionTrigger>
                <AccordionContent className="space-y-4">
                  {/* Referrer mode is hardcoded to "basic" */}

                  <div className="space-y-2">
                    <Label>Referrer URLs</Label>
                    {formData.referrers.urls.map((url, index) => (
                      <div key={index} className="flex gap-2 items-center">
                        <Input
                          value={url}
                          onChange={(e) => handleReferrerUrlChange(index, e.target.value)}
                          placeholder="Enter referrer URL"
                          className="flex-1"
                        />
                        {formData.referrers.urls.length > 1 && (
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() => removeReferrerUrlField(index)}
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
                    >
                      Add Referrer URL
                    </Button>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Traffic Settings */}
              <AccordionItem value="traffic">
                <AccordionTrigger className="text-left">
                  <div className="flex items-center">
                    <h4 className="text-base font-medium">Traffic Settings</h4>
                    <InfoTooltip content="Configure traffic volume and distribution" />
                  </div>
                </AccordionTrigger>
                <AccordionContent className="space-y-6">

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* <div className="space-y-2">
                      <div className="flex items-center">
                        <Label htmlFor="geo_type">
                          Geography Type
                        </Label>
                        <InfoTooltip content="Level of geographic targeting" />
                      </div>
                      <Select
                        value={formData.geo_type}
                        onValueChange={(value) => handleSelectChange("geo_type", value)}
                      >
                        <SelectTrigger id="geo_type">
                          <SelectValue placeholder="Select geo type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="global">Global</SelectItem>
                          <SelectItem value="countries">Countries</SelectItem>
                          <SelectItem value="cities">Cities</SelectItem>
                        </SelectContent>
                      </Select>
                      {formData.geo_type === "global" && (
                        <p className="text-xs text-gray-500 mt-1">Global targeting does not require specific location selection.</p>
                      )}
                    </div> */}

                    {/* {formData.geo_type !== "global" && (
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <Label htmlFor="geo">
                            {formData.geo_type === "countries" ? "Select Country" : "Select City"}
                          </Label>
                          <InfoTooltip content={`Target ${formData.geo_type === "countries" ? "country" : "city"} for your traffic`} />
                        </div>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              role="combobox"
                              className="w-full justify-between"
                            >
                              {formData.geo.codes.length > 0
                                ? `${formData.geo.codes.length} ${formData.geo_type === "countries" ? "countries" : "cities"} selected`
                                : `Select ${formData.geo_type === "countries" ? "countries" : "cities"}`}
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-full p-0">
                            <Command>
                              <CommandInput placeholder={`Search ${formData.geo_type === "countries" ? "countries" : "cities"}...`} />
                              <CommandEmpty>No {formData.geo_type === "countries" ? "country" : "city"} found.</CommandEmpty>
                              <CommandGroup>
                                {formData.geo_type === "countries" ? (
                                  countries.map(country => (
                                    <CommandItem
                                      key={country.value}
                                      value={country.value}
                                      onSelect={() => {
                                        const currentCodes = formData.geo.codes || [];
                                        const updatedCodes = currentCodes.includes(country.value)
                                          ? currentCodes.filter(code => code !== country.value)
                                          : [...currentCodes, country.value];
                                        handleGeoCodesChange(updatedCodes);
                                      }}
                                    >
                                      <Check
                                        className={`mr-2 h-4 w-4 ${formData.geo.codes.includes(country.value) ? "opacity-100" : "opacity-0"
                                          }`}
                                      />
                                      {country.label}
                                    </CommandItem>
                                  ))
                                ) : (
                                  cities.map(city => (
                                    <CommandItem
                                      key={city.value}
                                      value={city.value}
                                      onSelect={() => {
                                        const currentCodes = formData.geo.codes || [];
                                        const updatedCodes = currentCodes.includes(city.value)
                                          ? currentCodes.filter(code => code !== city.value)
                                          : [...currentCodes, city.value];
                                        handleGeoCodesChange(updatedCodes);
                                      }}
                                    >
                                      <Check
                                        className={`mr-2 h-4 w-4 ${formData.geo.codes.includes(city.value) ? "opacity-100" : "opacity-0"
                                          }`}
                                      />
                                      {city.label}
                                    </CommandItem>
                                  ))
                                )}
                              </CommandGroup>
                            </Command>
                          </PopoverContent>
                        </Popover>
                      </div>
                    )} */}

                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <Label htmlFor="desktop_rate">
                            Desktop Rate (%)
                          </Label>
                          <InfoTooltip content="Percentage of traffic from desktop devices" />
                        </div>
                        <div className="w-16">
                          <Input
                            id="desktop-rate-value"
                            value={formData.desktop_rate}
                            onChange={(e) => handleSliderChange("desktop_rate", [parseInt(e.target.value) || 0])}
                            className="text-right"
                          />
                        </div>
                      </div>
                      <div className="pt-4">
                        <Slider
                          id="desktop_rate"
                          min={0}
                          max={100}
                          step={1}
                          value={[formData.desktop_rate]}
                          onValueChange={(value) => handleSliderChange("desktop_rate", value)}
                        />
                      </div>
                      <div className="flex justify-between text-xs text-gray-500 pt-1">
                        <span>0%</span>
                        <span>50%</span>
                        <span>100%</span>
                      </div>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Behavior Settings */}
              <AccordionItem value="behavior">
                <AccordionTrigger className="text-left">
                  <div className="flex items-center">
                    <h4 className="text-base font-medium">Behavior Settings</h4>
                    <InfoTooltip content="Configure how visitors interact with your site" />
                  </div>
                </AccordionTrigger>
                <AccordionContent className="space-y-6">

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">

                          <Label htmlFor="bounce_rate">
                            Bounce Rate (%)
                          </Label>
                          <InfoTooltip content="Percentage of visitors who leave after viewing only one page" />
                        </div>
                        <div className="w-16">
                          <Input
                            id="bounce-rate-value"
                            value={formData.bounce_rate}
                            onChange={(e) => handleSliderChange("bounce_rate", [parseInt(e.target.value) || 0])}
                            className="text-right"
                          />
                        </div>
                      </div>
                      <div className="pt-4">
                        <Slider
                          id="bounce_rate"
                          min={0}
                          max={100}
                          step={1}
                          value={[formData.bounce_rate]}
                          onValueChange={(value) => handleSliderChange("bounce_rate", value)}
                        />
                      </div>
                      <div className="flex justify-between text-xs text-gray-500 pt-1">
                        <span>0%</span>
                        <span>50%</span>
                        <span>100%</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <Label htmlFor="return_rate">
                            Return Rate (%)
                          </Label>
                          <InfoTooltip content="Percentage of visitors who return to your site" />
                        </div>
                        <div className="w-16">
                          <Input
                            id="return-rate-value"
                            value={formData.return_rate}
                            onChange={(e) => handleSliderChange("return_rate", [parseInt(e.target.value) || 0])}
                            className="text-right"
                          />
                        </div>
                      </div>
                      <div className="pt-4">
                        <Slider
                          id="return_rate"
                          min={0}
                          max={100}
                          step={1}
                          value={[formData.return_rate]}
                          onValueChange={(value) => handleSliderChange("return_rate", value)}
                        />
                      </div>
                      <div className="flex justify-between text-xs text-gray-500 pt-1">
                        <span>0%</span>
                        <span>50%</span>
                        <span>100%</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">

                          <Label htmlFor="click_outbound_events">
                            Outbound Click Events
                          </Label>
                          <InfoTooltip content="Number of clicks to external links" />
                        </div>
                        <div className="w-16">
                          <Input
                            id="click-events-value"
                            value={formData.click_outbound_events}
                            onChange={(e) => handleSliderChange("click_outbound_events", [parseInt(e.target.value) || 0])}
                            className="text-right"
                          />
                        </div>
                      </div>
                      <div className="pt-4">
                        <Slider
                          id="click_outbound_events"
                          min={0}
                          max={10}
                          step={1}
                          value={[formData.click_outbound_events]}
                          onValueChange={(value) => handleSliderChange("click_outbound_events", value)}
                        />
                      </div>
                      <div className="flex justify-between text-xs text-gray-500 pt-1">
                        <span>0</span>
                        <span>5</span>
                        <span>10</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <Label htmlFor="form_submit_events">
                            Form Submit Events
                          </Label>
                          <InfoTooltip content="Number of form submissions per visit" />
                        </div>
                        <div className="w-16">
                          <Input
                            id="form-submit-value"
                            value={formData.form_submit_events}
                            onChange={(e) => handleSliderChange("form_submit_events", [parseInt(e.target.value) || 0])}
                            className="text-right"
                          />
                        </div>
                      </div>
                      <div className="pt-4">
                        <Slider
                          id="form_submit_events"
                          min={0}
                          max={5}
                          step={1}
                          value={[formData.form_submit_events]}
                          onValueChange={(value) => handleSliderChange("form_submit_events", value)}
                        />
                      </div>
                      <div className="flex justify-between text-xs text-gray-500 pt-1">
                        <span>0</span>
                        <span>2</span>
                        <span>5</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">

                          <Label htmlFor="scroll_events">
                            Scroll Events
                          </Label>
                          <InfoTooltip content="Number of significant scroll actions per visit" />
                        </div>
                        <div className="w-16">
                          <Input
                            id="scroll-events-value"
                            value={formData.scroll_events}
                            onChange={(e) => handleSliderChange("scroll_events", [parseInt(e.target.value) || 0])}
                            className="text-right"
                          />
                        </div>
                      </div>
                      <div className="pt-4">
                        <Slider
                          id="scroll_events"
                          min={0}
                          max={10}
                          step={1}
                          value={[formData.scroll_events]}
                          onValueChange={(value) => handleSliderChange("scroll_events", value)}
                        />
                      </div>
                      <div className="flex justify-between text-xs text-gray-500 pt-1">
                        <span>0</span>
                        <span>5</span>
                        <span>10</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center">
                        <Label htmlFor="time_on_page">
                          Time on Page
                        </Label>
                        <InfoTooltip content="Average time visitors spend on your page" />
                      </div>
                      <Select
                        value={formData.time_on_page}
                        onValueChange={(value) => handleSelectChange("time_on_page", value)}
                      >
                        <SelectTrigger id="time_on_page">
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
                </AccordionContent>
              </AccordionItem>

              {/* Campaign Settings */}
              <AccordionItem value="campaign-settings">
                <AccordionTrigger className="text-left">
                  <div className="flex items-center">
                    <h4 className="text-base font-medium">Campaign Settings</h4>
                    <InfoTooltip content="Additional campaign configuration options" />
                  </div>
                </AccordionTrigger>
                <AccordionContent className="space-y-6">

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Campaign size is hardcoded to "small" */}

                    {/* Auto renew moved to separate card */}

                    <div className="space-y-2">
                      <div className="flex items-center">
                        <Label htmlFor="shortener">
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
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center">
                        <Label htmlFor="rss_feed">
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
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center">
                        <Label htmlFor="ga_id">
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
                      />
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Auto Renew Setting */}
              <AccordionItem value="auto-renew">
                <AccordionTrigger className="text-left">
                  <div className="flex items-center">
                    <h4 className="text-base font-medium">Campaign Renewal</h4>
                    <InfoTooltip content="Configure automatic campaign renewal" />
                  </div>
                </AccordionTrigger>
                <AccordionContent className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Switch
                      id="auto_renew"
                      checked={formData.auto_renew === "true"}
                      onCheckedChange={(checked) =>
                        handleSelectChange("auto_renew", checked ? "true" : "false")
                      }
                    />
                    <div className="flex items-center">
                      <Label htmlFor="auto_renew" className="text-base">
                        Auto Renew Campaign
                      </Label>
                      <InfoTooltip content="When enabled, your campaign will automatically renew when it expires" />
                    </div>
                  </div>

                  <p className="text-sm text-gray-500">
                    Enabling auto-renewal ensures your campaign continues without interruption.
                    You can disable this setting at any time from the campaign details page.
                  </p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </Card>

        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Creating..." : "Create Campaign"}
          </Button>
        </div>
      </form>
    </div>
  );
}