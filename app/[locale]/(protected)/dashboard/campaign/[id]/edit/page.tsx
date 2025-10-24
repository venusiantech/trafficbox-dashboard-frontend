"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { useCampaignStore, CampaignModifyData } from "@/context/campaignStore";
import PageTitle from "@/components/page-title";
import Loader from "@/components/loader";
import { ArrowLeft, Save, Plus, Trash2, X } from "lucide-react";
import { countries } from "@/lib/data";

type CountryAllocation = {
  country: string;
  percent: number;
};

export default function EditCampaignPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { fetchCampaign, modifyCampaign, currentCampaign, isLoading, error } = useCampaignStore();
  const [isSaving, setIsSaving] = useState(false);

  // Form state with extended fields
  const [formData, setFormData] = useState({
    title: "",
    urls: [""],
    geo_type: "global" as "global" | "countries",
    countries: [] as CountryAllocation[],
    speed: 200,
    keywords: "",
    time_on_page: "30sec",
    desktop_rate: 50,
    bounce_rate: 0,
  });

  // Load campaign data
  useEffect(() => {
    if (params.id) {
      fetchCampaign(params.id);
    }
  }, [params.id, fetchCampaign]);

  // Populate form when campaign loads
  useEffect(() => {
    if (currentCampaign) {
      // Parse countries data
      let parsedCountries: CountryAllocation[] = [];
      let geoType: "global" | "countries" = "global";
      
      if (currentCampaign.countries && currentCampaign.countries.length > 0) {
        geoType = "countries";
        // Handle both old and new format
        if (typeof currentCampaign.countries[0] === 'string') {
          // Old format: convert to new format with equal distribution
          const equalPercent = 1.0 / currentCampaign.countries.length;
          parsedCountries = (currentCampaign.countries as string[]).map(c => ({
            country: c,
            percent: equalPercent
          }));
        } else {
          // New format: use as is
          parsedCountries = currentCampaign.countries as CountryAllocation[];
        }
      }

      // Parse URLs from object format
      const urlValues = currentCampaign.urls ? Object.values(currentCampaign.urls) : [];
      const parsedUrls = urlValues.length > 0 ? urlValues : [""];

      setFormData({
        title: currentCampaign.title || "",
        urls: parsedUrls,
        geo_type: geoType,
        countries: parsedCountries,
        speed: currentCampaign.vendorStats?.speed || 200,
        keywords: "",
        time_on_page: "30sec",
        desktop_rate: 50,
        bounce_rate: 0,
      });
    }
  }, [currentCampaign]);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle number input changes
  const handleNumberChange = (name: string, value: string) => {
    const numValue = parseInt(value) || 0;
    setFormData((prev) => ({ ...prev, [name]: numValue }));
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
    const newUrls = formData.urls.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, urls: newUrls }));
  };

  // Country management
  const addCountry = () => {
    const availableCountries = countries.filter(
      (c) => !formData.countries.some((fc) => fc.country === c.value)
    );
    
    if (availableCountries.length > 0) {
      const newCountry: CountryAllocation = {
        country: availableCountries[0].value,
        percent: 0
      };
      
      const newCountries = [...formData.countries, newCountry];
      const redistributed = redistributePercentages(newCountries);
      setFormData((prev) => ({ ...prev, countries: redistributed }));
    }
  };

  const removeCountry = (index: number) => {
    const newCountries = formData.countries.filter((_, i) => i !== index);
    if (newCountries.length > 0) {
      const redistributed = redistributePercentages(newCountries);
      setFormData((prev) => ({ ...prev, countries: redistributed }));
    } else {
      setFormData((prev) => ({ ...prev, countries: [] }));
    }
  };

  const handleCountryChange = (index: number, country: string) => {
    const newCountries = [...formData.countries];
    newCountries[index].country = country;
    setFormData((prev) => ({ ...prev, countries: newCountries }));
  };

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

  // Redistribute percentages to sum to 1.0
  const redistributePercentages = (countryList: CountryAllocation[]) => {
    const equalPercent = 1.0 / countryList.length;
    const redistributed = countryList.map(c => ({
      ...c,
      percent: equalPercent
    }));
    return redistributed;
  };

  const handleGeoTypeChange = (value: string) => {
    const newGeoType = value as "global" | "countries";
    setFormData((prev) => ({ ...prev, geo_type: newGeoType }));
    
    // Initialize with one country if switching to countries mode
    if (newGeoType === "countries" && formData.countries.length === 0) {
      setFormData((prev) => ({
        ...prev,
        countries: [{ country: "US", percent: 1.0 }]
      }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate
    if (!formData.title.trim()) {
      toast.error("Campaign title is required");
      return;
    }

    setIsSaving(true);
    
    try {
      // Prepare modify data
      const modifyData: CampaignModifyData = {
        title: formData.title,
        speed: formData.speed,
        keywords: formData.keywords,
        time_on_page: formData.time_on_page,
        desktop_rate: formData.desktop_rate,
        bounce_rate: formData.bounce_rate,
      };

      // Add urls if provided
      if (formData.urls.length > 0 && formData.urls[0]) {
        modifyData.urls = formData.urls;
      }

      // Add countries if in country mode
      if (formData.geo_type === "countries" && formData.countries.length > 0) {
        modifyData.countries = formData.countries;
      }

      await modifyCampaign(params.id, modifyData);
      toast.success("Campaign updated successfully!");
      router.push(`/dashboard/campaign/${params.id}`);
    } catch (error: any) {
      toast.error(error.message || "Failed to update campaign");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  if (isLoading && !currentCampaign) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader />
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
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Edit Campaign</h1>
            <p className="text-sm text-gray-500 mt-1">{currentCampaign.title}</p>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card className="border-0 shadow-sm">
          <div className="p-8 space-y-6">
            {/* Section Header */}
            <div className="space-y-1">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Basic Information</h3>
              <p className="text-sm text-gray-500">Update your campaign details</p>
            </div>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">
                  Campaign Title <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter campaign title"
                  required
                />
              </div>

              {/* URLs Section */}
              <div className="space-y-3">
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Target URLs <span className="text-red-500">*</span>
                </Label>
                <div className="space-y-2">
                  {formData.urls.map((url, index) => (
                    <div key={index} className="flex gap-2 items-center group">
                      <Input
                        value={url}
                        onChange={(e) => handleUrlChange(index, e.target.value)}
                        placeholder="https://example.com"
                        className="flex-1 transition-all duration-200"
                      />
                      {formData.urls.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeUrl(index)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-50 hover:text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addUrl}
                  className="w-full border-dashed hover:border-solid transition-all duration-200"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Another URL
                </Button>
              </div>

              <div className="space-y-2">
                <Label htmlFor="keywords">
                  Keywords
                  <span className="text-sm text-gray-500 ml-2">(comma separated)</span>
                </Label>
                <Input
                  id="keywords"
                  name="keywords"
                  value={formData.keywords}
                  onChange={handleChange}
                  placeholder="e.g., traffic, marketing, ads"
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Geographic Targeting */}
        <Card className="border-0 shadow-sm">
          <div className="p-8 space-y-6">
            <div className="space-y-1">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Geographic Targeting</h3>
              <p className="text-sm text-gray-500">Define where your traffic comes from</p>
            </div>
              
            <div className="space-y-6">
              <div className="space-y-3">
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Targeting Type</Label>
                <Select value={formData.geo_type} onValueChange={handleGeoTypeChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="global">🌍 Global (All Countries)</SelectItem>
                    <SelectItem value="countries">🎯 Specific Countries</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {formData.geo_type === "countries" && (
                <div className="space-y-4 animate-in fade-in duration-300">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Country Distribution</Label>
                    <span className="text-xs text-gray-500">
                      Total: <span className="font-semibold text-gray-900 dark:text-white">{Math.round(formData.countries.reduce((sum, c) => sum + c.percent, 0) * 100)}%</span>
                    </span>
                  </div>
                  
                  <div className="space-y-3">
                    {formData.countries.map((countryAlloc, index) => {
                      const displayPercent = Math.round(countryAlloc.percent * 100);
                      
                      return (
                        <div 
                          key={index} 
                          className="space-y-3 p-5 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-300 group"
                        >
                          <div className="flex items-center gap-3">
                            <Select 
                              value={countryAlloc.country}
                              onValueChange={(value) => handleCountryChange(index, value)}
                            >
                              <SelectTrigger className="flex-1">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {countries.map((country) => (
                                  <SelectItem 
                                    key={country.value} 
                                    value={country.value}
                                    disabled={formData.countries.some(c => c.country === country.value && c.country !== countryAlloc.country)}
                                  >
                                    {country.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            
                            <div className="flex items-center gap-2 min-w-[80px] justify-end">
                              <span className="text-2xl font-bold text-gray-900 dark:text-white tabular-nums transition-all duration-300">
                                {displayPercent}%
                              </span>
                            </div>
                            
                            {formData.countries.length > 1 && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => removeCountry(index)}
                                className="opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20"
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-3 px-1">
                            <Slider
                              value={[displayPercent]}
                              onValueChange={(value) => handlePercentChange(index, value[0])}
                              max={100}
                              step={1}
                              className="flex-1 transition-all duration-300"
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {formData.countries.length < countries.length && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addCountry}
                      className="w-full border-dashed hover:border-solid transition-all duration-200"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Country
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* Traffic Settings */}
        <Card className="border-0 shadow-sm">
          <div className="p-8 space-y-6">
            <div className="space-y-1">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Traffic Settings</h3>
              <p className="text-sm text-gray-500">Configure traffic behavior and patterns</p>
            </div>
              
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="speed">
                  Speed (hits per day)
                </Label>
                <Input
                  id="speed"
                  name="speed"
                  type="number"
                  min="1"
                  max="10000"
                  value={formData.speed}
                  onChange={(e) => handleNumberChange("speed", e.target.value)}
                  placeholder="200"
                />
                <p className="text-xs text-gray-500">Number of hits per day</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="time_on_page">
                  Time on Page
                </Label>
                <Input
                  id="time_on_page"
                  name="time_on_page"
                  value={formData.time_on_page}
                  onChange={handleChange}
                  placeholder="30sec"
                />
                <p className="text-xs text-gray-500">e.g., 30sec, 1min, 2min</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="desktop_rate">
                  Desktop Rate (%)
                </Label>
                <Input
                  id="desktop_rate"
                  name="desktop_rate"
                  type="number"
                  min="0"
                  max="100"
                  value={formData.desktop_rate}
                  onChange={(e) => handleNumberChange("desktop_rate", e.target.value)}
                  placeholder="50"
                />
                <p className="text-xs text-gray-500">Percentage of desktop traffic (0-100)</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bounce_rate">
                  Bounce Rate (%)
                </Label>
                <Input
                  id="bounce_rate"
                  name="bounce_rate"
                  type="number"
                  min="0"
                  max="100"
                  value={formData.bounce_rate}
                  onChange={(e) => handleNumberChange("bounce_rate", e.target.value)}
                  placeholder="0"
                />
                <p className="text-xs text-gray-500">Percentage of visitors that bounce (0-100)</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Current Campaign Stats */}
        <Card className="border-0 shadow-sm bg-gray-50 dark:bg-gray-900">
          <div className="p-6">
            <h3 className="text-sm font-semibold mb-4 text-gray-700 dark:text-gray-300">Current Campaign Statistics</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-1">
                <span className="text-xs text-gray-500">Status</span>
                <p className="text-sm font-semibold capitalize">{currentCampaign?.state}</p>
              </div>
              <div className="space-y-1">
                <span className="text-xs text-gray-500">Total Hits</span>
                <p className="text-sm font-semibold">
                  {currentCampaign?.stats?.totalHits || currentCampaign?.vendorStats?.totalHits || 0}
                </p>
              </div>
              <div className="space-y-1">
                <span className="text-xs text-gray-500">Total Visits</span>
                <p className="text-sm font-semibold">
                  {currentCampaign?.stats?.totalVisits || currentCampaign?.vendorStats?.totalVisits || 0}
                </p>
              </div>
              <div className="space-y-1">
                <span className="text-xs text-gray-500">Created</span>
                <p className="text-sm font-semibold">
                  {currentCampaign && new Date(currentCampaign.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Action Buttons */}
        <Card className="border-0 shadow-sm">
          <div className="p-6">
            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={isSaving}
                className="px-6"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSaving}
                className="px-8"
              >
                {isSaving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Saving Changes...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </div>
        </Card>
      </form>
    </div>
  );
}
