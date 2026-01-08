"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";
import { useCampaignStore, CampaignModifyData } from "@/context/campaignStore";
import { ArrowLeft, Save, Plus, X, Loader2, Pencil, Globe, Link as LinkIcon, TrendingUp, Info, Check } from "lucide-react";
import { countries } from "@/lib/data";
import { StatisticsBlock } from "@/components/blocks/statistics-block";
import { useTranslations } from "next-intl";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type CountryAllocation = {
  country: string;
  percent: number;
};

export default function EditCampaignPage({ params }: { params: { id: string } }) {
  const t = useTranslations("AnalyticsDashboard");
  const router = useRouter();
  const { fetchCampaign, modifyCampaign, currentCampaign, isLoading, error } = useCampaignStore();
  const [isSaving, setIsSaving] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [countryPopoverOpen, setCountryPopoverOpen] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    urls: [""],
    geo_type: "global" as "global" | "countries",
    countries: [] as CountryAllocation[],
    speed: 200,
    keywords: "",
    bounce_rate: 0,
  });

  // Load campaign data
  useEffect(() => {
    if (params.id) {
      setIsInitialLoad(true);
      fetchCampaign(params.id).finally(() => {
        setIsInitialLoad(false);
      });
    }
  }, [params.id, fetchCampaign]);

  // Populate form when campaign loads
  useEffect(() => {
    if (currentCampaign) {
      let parsedCountries: CountryAllocation[] = [];
      let geoType: "global" | "countries" = "global";

      if (currentCampaign.countries && currentCampaign.countries.length > 0) {
        geoType = "countries";
        if (typeof currentCampaign.countries[0] === 'string') {
          const equalPercent = 1.0 / currentCampaign.countries.length;
          parsedCountries = (currentCampaign.countries as string[]).map(c => ({
            country: c,
            percent: equalPercent
          }));
        } else {
          parsedCountries = currentCampaign.countries as CountryAllocation[];
        }
      }

      const urlValues = currentCampaign.urls ? Object.values(currentCampaign.urls) : [];
      const parsedUrls = urlValues.length > 0 ? urlValues : [""];

      setFormData({
        title: currentCampaign.title || "",
        urls: parsedUrls,
        geo_type: geoType,
        countries: parsedCountries,
        speed: currentCampaign.stats?.speed || 200,
        keywords: "",
        bounce_rate: 0,
      });
    }
  }, [currentCampaign]);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle slider changes
  const handleSliderChange = (name: string, value: number[]) => {
    setFormData((prev) => ({ ...prev, [name]: value[0] }));
  };

  // URL management
  const handleUrlChange = (index: number, value: string) => {
    const newUrls = [...formData.urls];
    newUrls[index] = value;
    setFormData((prev) => ({ ...prev, urls: newUrls }));
  };

  const addUrl = () => {
    setFormData((prev) => ({ ...prev, urls: [...prev.urls, ""] }));
  };

  const removeUrl = (index: number) => {
    if (formData.urls.length > 1) {
      const newUrls = formData.urls.filter((_, i) => i !== index);
      setFormData((prev) => ({ ...prev, urls: newUrls }));
    }
  };

  // Country management - simplified
  const handleGeoCodesChange = (values: string[]) => {
    if (values.length === 0) {
      setFormData((prev) => ({ ...prev, geo_type: "global", countries: [] }));
      return;
    }
    
    // Keep existing percentages for countries that are still selected
    const existingCountries = formData.countries.filter(c => values.includes(c.country));
    const newCountries = values.filter(v => !formData.countries.some(c => c.country === v));
    
    // Calculate total existing percentage
    const existingTotal = existingCountries.reduce((sum, c) => sum + c.percent, 0);
    
    // Distribute remaining percentage equally among new countries
    const remainingPercent = 1.0 - existingTotal;
    const percentPerNewCountry = newCountries.length > 0 ? remainingPercent / newCountries.length : 0;
    
    // Combine existing and new countries
    const updatedCountries = [
      ...existingCountries,
      ...newCountries.map(country => ({ country, percent: percentPerNewCountry }))
    ];
    
    // Normalize to ensure total is 1.0
    const total = updatedCountries.reduce((sum, c) => sum + c.percent, 0);
    if (total > 0) {
      const normalized = updatedCountries.map(c => ({
        ...c,
        percent: c.percent / total
      }));
      setFormData((prev) => ({
        ...prev,
        geo_type: "countries",
        countries: normalized
      }));
    } else {
      // If total is 0, distribute equally
      const equalPercent = 1.0 / updatedCountries.length;
      setFormData((prev) => ({
        ...prev,
        geo_type: "countries",
        countries: updatedCountries.map(c => ({ ...c, percent: equalPercent }))
      }));
    }
  };

  // Handle percentage change for a specific country
  const handlePercentChange = (index: number, percent: number) => {
    const newCountries = [...formData.countries];
    const newPercent = percent / 100; // Convert from percentage to decimal
    
    // Update the changed country
    newCountries[index].percent = newPercent;
    
    // If we have other countries, adjust them proportionally
    if (newCountries.length > 1) {
      const otherCountries = newCountries.filter((_, i) => i !== index);
      const otherTotal = otherCountries.reduce((sum, c) => sum + c.percent, 0);
      
      // Calculate how much we need to take from others
      const remaining = 1.0 - newPercent;
      
      if (remaining >= 0 && otherTotal > 0) {
        // Redistribute the remaining percentage proportionally among other countries
        otherCountries.forEach((country) => {
          const countryIndex = newCountries.findIndex(c => c.country === country.country);
          if (countryIndex !== -1) {
            const proportion = country.percent / otherTotal;
            newCountries[countryIndex].percent = remaining * proportion;
          }
        });
      } else if (remaining < 0) {
        // If the new percent exceeds 100%, cap it and zero out others
        newCountries[index].percent = 1.0;
        newCountries.forEach((_, i) => {
          if (i !== index) {
            newCountries[i].percent = 0;
          }
        });
      }
    } else {
      // Only one country, cap at 100%
      newCountries[index].percent = Math.min(newPercent, 1.0);
    }
    
    setFormData((prev) => ({ ...prev, countries: newCountries }));
  };

  const selectedCountryCodes = formData.countries.map(c => c.country);

  const handleGeoTypeChange = (value: string) => {
    const newGeoType = value as "global" | "countries";
    setFormData((prev) => ({ ...prev, geo_type: newGeoType }));

    if (newGeoType === "global") {
      setFormData((prev) => ({ ...prev, countries: [] }));
    } else if (formData.countries.length === 0) {
      setFormData((prev) => ({
        ...prev,
        countries: [{ country: "US", percent: 1.0 }]
      }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast.error("Campaign title is required");
      return;
    }

    setIsSaving(true);

    try {
      const reqBody: any = {
        url: formData.urls[0] || "",
        title: formData.title,
        urls: formData.urls.filter(url => url.trim()),
        keywords: formData.keywords,
        referrers: {
          mode: "basic",
          urls: []
        },
        languages: "en",
        bounce_rate: formData.bounce_rate,
        return_rate: 10,
        click_outbound_events: 5,
        form_submit_events: 2,
        scroll_events: 3,
        time_on_page: "30sec",
        desktop_rate: 50,
        auto_renew: "true",
        geo_type: formData.geo_type,
        shortener: "",
        rss_feed: "",
        ga_id: "",
        size: "standard",
        speed: formData.speed,
      };

      if (formData.geo_type === "countries" && formData.countries.length > 0) {
        reqBody.geo = formData.countries.map(c => ({
          country: c.country,
          percent: c.percent
        }));
      }

      await modifyCampaign(params.id, reqBody);
      toast.success("Campaign updated successfully!");
      router.push(`/${window.location.pathname.split('/')[1]}/dashboard/campaign/${params.id}`);
    } catch (error: any) {
      toast.error(error.message || "Failed to update campaign");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  // Tooltip component
  const InfoTooltip = ({ content }: { content: string }) => (
    <div className="group relative">
      <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
      <div className="absolute left-0 top-6 z-10 hidden group-hover:block w-48 p-2 bg-popover border rounded-md shadow-md text-xs">
        {content}
      </div>
    </div>
  );

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
      case 'created':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'paused':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'archived':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
    }
  };

  if (isLoading || isInitialLoad || (!currentCampaign && !error)) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-purple-600 dark:text-purple-400" />
          <p className="text-sm text-gray-600 dark:text-gray-400">Loading campaign data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 mb-4">{error}</p>
        <Button onClick={() => router.back()}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Go Back
        </Button>
      </div>
    );
  }

  if (!currentCampaign) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 mb-4">Campaign not found</p>
        <Button onClick={() => router.back()}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleCancel}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-2.5">
            <Pencil className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            <div>
              <h1 className="text-xl font-semibold">Edit Campaign</h1>
              <p className="text-sm text-muted-foreground">{currentCampaign.title}</p>
            </div>
          </div>
        </div>
        <Badge className={getStatusColor(currentCampaign.state)}>
          {currentCampaign.state.toUpperCase()}
        </Badge>
      </div>

      {/* Statistics at Top */}
      <Card className="p-6">
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-1">Campaign Statistics</h3>
          <p className="text-sm text-muted-foreground">Current performance metrics</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatisticsBlock
            title={t("total_hits")}
            total={currentCampaign.stats?.totalHits || currentCampaign.vendorStats?.totalHits || currentCampaign.total_hits_counted || 0}
            className="bg-info/10 border-none shadow-none"
            chartColor="#00EBFF"
          />
          <StatisticsBlock
            title={t("total_visits")}
            total={currentCampaign.stats?.totalVisits || currentCampaign.vendorStats?.totalVisits || currentCampaign.total_visits_counted || 0}
            className="bg-warning/10 border-none shadow-none"
            chartColor="#FB8F65"
          />
          <StatisticsBlock
            title={t("speed")}
            total={currentCampaign.stats?.speed || currentCampaign.vendorStats?.speed || 0}
            className="bg-primary/10 border-none shadow-none"
            chartColor="#2563eb"
          />
        </div>
      </Card>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information and Traffic Settings Side by Side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Basic Information - Left */}
          <Card className="p-5 md:p-6">
            <div className="flex items-center gap-2.5 mb-6">
              <Pencil className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              <div>
                <h3 className="text-lg font-semibold">Basic Information</h3>
                <p className="text-sm text-muted-foreground">Update your campaign details</p>
              </div>
            </div>
            
            <div className="space-y-8">
              {/* Campaign Title */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-1.5">
                  <Label htmlFor="title" className="text-sm font-medium">
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
                  className="h-9"
                  required
                />
              </div>

              {/* URLs Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-1.5">
                  <Label className="text-sm font-medium">
                    Target URLs
                  </Label>
                  <InfoTooltip content="URLs that will receive traffic from this campaign" />
                </div>
                <div className="space-y-3">
                  {formData.urls.map((url, index) => (
                    <div key={index} className="flex gap-2 items-center">
                      <div className="flex-1 relative">
                        <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          value={url}
                          onChange={(e) => handleUrlChange(index, e.target.value)}
                          placeholder="https://example.com"
                          className="h-9 pl-9 font-mono text-sm"
                          required={index === 0}
                        />
                      </div>
                      {formData.urls.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeUrl(index)}
                          className="h-9 w-9 text-muted-foreground hover:text-destructive"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
                {/* <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addUrl}
                  className="w-full border-dashed mt-2"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Another URL
                </Button> */}
              </div>
            </div>
          </Card>

          {/* Traffic Settings - Right */}
          <Card className="p-5 md:p-6">
            <div className="flex items-center gap-2.5 mb-6">
              <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
              <div>
                <h3 className="text-lg font-semibold">Traffic Settings</h3>
                <p className="text-sm text-muted-foreground">Configure traffic behavior and patterns</p>
              </div>
            </div>

            <div className="space-y-8">
              {/* Page Views per Day - Slider */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Label htmlFor="speed" className="text-sm font-medium">
                      Page Views per Day
                    </Label>
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

              {/* Bounce Rate */}
              <div className="space-y-1.5">
                <Label htmlFor="bounce_rate" className="text-sm font-medium">
                  Bounce Rate (%)
                </Label>
                <Input
                  id="bounce_rate"
                  name="bounce_rate"
                  type="number"
                  min="0"
                  max="100"
                  value={formData.bounce_rate}
                  onChange={(e) => setFormData(prev => ({ ...prev, bounce_rate: parseInt(e.target.value) || 0 }))}
                  placeholder="0"
                  className="h-9"
                />
                <p className="text-xs text-muted-foreground">Percentage of visitors that bounce (0-100)</p>
              </div>

              {/* Keywords */}
              <div className="space-y-1.5">
                <Label htmlFor="keywords" className="text-sm font-medium">
                  Keywords
                  <span className="text-xs text-muted-foreground ml-2">(comma separated, optional)</span>
                </Label>
                <Input
                  id="keywords"
                  name="keywords"
                  value={formData.keywords}
                  onChange={handleChange}
                  placeholder="e.g., traffic, marketing, ads"
                  className="h-9"
                />
              </div>
            </div>
          </Card>
        </div>

        {/* Geographic Targeting */}
        <Card className="p-5 md:p-6">
          <div className="flex items-center gap-2.5 mb-6">
            <Globe className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <div>
              <h3 className="text-lg font-semibold">Geographic Targeting</h3>
              <p className="text-sm text-muted-foreground">Define where your traffic comes from</p>
            </div>
          </div>

          {formData.geo_type === "countries" && selectedCountryCodes.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column - Selection Controls */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Targeting Type</Label>
                  <Select value={formData.geo_type} onValueChange={handleGeoTypeChange}>
                    <SelectTrigger className="w-full h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="global">🌍 Global (All Countries)</SelectItem>
                      <SelectItem value="countries">🎯 Specific Countries</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Select Countries</Label>
                  <Popover open={countryPopoverOpen} onOpenChange={setCountryPopoverOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        className="w-full justify-between h-9 font-normal"
                      >
                        {selectedCountryCodes.length > 0
                          ? `${selectedCountryCodes.length} countr${selectedCountryCodes.length === 1 ? 'y' : 'ies'} selected`
                          : "Select countries..."}
                        <X className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[400px] p-0" align="start">
                      <Command>
                        <CommandInput placeholder="Search countries..." />
                        <CommandList>
                          <CommandEmpty>No country found.</CommandEmpty>
                          <CommandGroup>
                            {countries.map((country) => {
                              const isSelected = selectedCountryCodes.includes(country.value);
                              return (
                                <CommandItem
                                  key={country.value}
                                  onSelect={() => {
                                    if (isSelected) {
                                      handleGeoCodesChange(selectedCountryCodes.filter(c => c !== country.value));
                                    } else {
                                      handleGeoCodesChange([...selectedCountryCodes, country.value]);
                                    }
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      isSelected ? "opacity-100" : "opacity-0"
                                    )}
                                  />
                                  {country.label}
                                </CommandItem>
                              );
                            })}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              {/* Right Column - Country Distribution */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">Country Distribution</Label>
                  <span className="text-xs text-muted-foreground">
                    Total: <span className="font-semibold">{Math.round(formData.countries.reduce((sum, c) => sum + c.percent, 0) * 100)}%</span>
                  </span>
                </div>
                
                <div className="space-y-4">
                  {formData.countries.map((countryAlloc, idx) => {
                    const countryLabel = countries.find(c => c.value === countryAlloc.country)?.label || countryAlloc.country;
                    const displayPercent = Math.round(countryAlloc.percent * 100);
                    
                    return (
                      <div 
                        key={idx} 
                        className="p-4 border border-border rounded-lg bg-muted/30 space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">{countryLabel}</span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                const newCountries = formData.countries.filter((_, i) => i !== idx);
                                if (newCountries.length > 0) {
                                  // Redistribute percentages
                                  const total = newCountries.reduce((sum, c) => sum + c.percent, 0);
                                  const normalized = newCountries.map(c => ({
                                    ...c,
                                    percent: total > 0 ? c.percent / total : 1.0 / newCountries.length
                                  }));
                                  setFormData(prev => ({ ...prev, countries: normalized }));
                                } else {
                                  setFormData(prev => ({ ...prev, geo_type: "global", countries: [] }));
                                }
                              }}
                              className="h-6 w-6 text-muted-foreground hover:text-destructive"
                            >
                              <X className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-7 bg-background rounded-md flex items-center justify-center border">
                              <span className="text-sm font-mono font-medium">{displayPercent}%</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="px-1">
                          <Slider
                            value={[displayPercent]}
                            onValueChange={(value) => handlePercentChange(idx, value[0])}
                            max={100}
                            min={0}
                            step={1}
                            className="w-full"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Targeting Type</Label>
                <Select value={formData.geo_type} onValueChange={handleGeoTypeChange}>
                  <SelectTrigger className="w-full h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="global">🌍 Global (All Countries)</SelectItem>
                    <SelectItem value="countries">🎯 Specific Countries</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {formData.geo_type === "countries" && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Select Countries</Label>
                  <Popover open={countryPopoverOpen} onOpenChange={setCountryPopoverOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        className="w-full justify-between h-9 font-normal"
                      >
                        {selectedCountryCodes.length > 0
                          ? `${selectedCountryCodes.length} countr${selectedCountryCodes.length === 1 ? 'y' : 'ies'} selected`
                          : "Select countries..."}
                        <X className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[400px] p-0" align="start">
                      <Command>
                        <CommandInput placeholder="Search countries..." />
                        <CommandList>
                          <CommandEmpty>No country found.</CommandEmpty>
                          <CommandGroup>
                            {countries.map((country) => {
                              const isSelected = selectedCountryCodes.includes(country.value);
                              return (
                                <CommandItem
                                  key={country.value}
                                  onSelect={() => {
                                    if (isSelected) {
                                      handleGeoCodesChange(selectedCountryCodes.filter(c => c !== country.value));
                                    } else {
                                      handleGeoCodesChange([...selectedCountryCodes, country.value]);
                                    }
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      isSelected ? "opacity-100" : "opacity-0"
                                    )}
                                  />
                                  {country.label}
                                </CommandItem>
                              );
                            })}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>
              )}
            </div>
          )}
        </Card>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            disabled={isSaving}
            className="h-9 px-4"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSaving}
            className="h-9 px-6 bg-purple-600 hover:bg-purple-700 text-white"
          >
            {isSaving ? (
              <div className="flex items-center gap-2">
                <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Saving...</span>
              </div>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
