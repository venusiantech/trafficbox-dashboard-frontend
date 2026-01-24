"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Icon } from "@/components/ui/icon";
import { CheckCircle2 } from "lucide-react";
import PageTitle from "@/components/page-title";
import { useSEO } from "@/hooks/use-seo";

export default function CreateSEOAnalysisPage() {
  const { handleCreateAnalysis, isCreating, navigateToList } = useSEO();
  const [domain, setDomain] = useState("");
  const [url, setUrl] = useState("");
  const [isUrlValid, setIsUrlValid] = useState(false);

  // Automatically build full URL from domain
  useEffect(() => {
    if (domain) {
      // Clean domain - remove any https://, http://, and trailing/leading slashes
      let cleanDomain = domain
        .replace(/^https?:\/\//, '')
        .replace(/^\/+|\/+$/g, '')
        .trim();
      
      // Build full URL
      const fullUrl = cleanDomain ? `https://${cleanDomain}/` : "";
      
      // Validate
      let valid = false;
      if (cleanDomain && cleanDomain.includes('.')) {
        try {
          new URL(fullUrl);
          valid = true;
        } catch (error) {
          valid = false;
        }
      }
      
      setIsUrlValid(valid);
      setUrl(fullUrl);
    } else {
      setIsUrlValid(false);
      setUrl("");
    }
  }, [domain]);

  const handleDomainChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDomain(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!url || !isUrlValid) {
      return;
    }

    try {
      await handleCreateAnalysis(url);
    } catch (err) {
      // Error is handled in the hook
    }
  };

  return (
    <div className="space-y-6">
      <PageTitle title="Create SEO Analysis" />

      <Card>
        <CardHeader>
          <CardTitle>Analyze Website SEO</CardTitle>
          <CardDescription>
            Enter a website URL to generate a comprehensive SEO analysis report
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="domain">Website URL *</Label>
              <div className="relative flex items-center border rounded-md overflow-hidden">
                <span className="px-3 py-2 bg-muted text-muted-foreground text-sm font-mono h-10 flex items-center border-r">
                  https://
                </span>
                <Input
                  id="domain"
                  name="domain"
                  type="text"
                  value={domain}
                  onChange={handleDomainChange}
                  placeholder="example.com"
                  className="h-10 font-mono text-sm border-0 focus-visible:ring-0 focus-visible:ring-offset-0 flex-1"
                  disabled={isCreating}
                  required
                />
                <span className="px-3 py-2 bg-muted text-muted-foreground text-sm font-mono h-10 flex items-center border-l">
                  /
                </span>
                {isUrlValid && (
                  <div className="absolute right-12 top-1/2 -translate-y-1/2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  </div>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                Just enter your domain (e.g., example.com). We'll add https:// and / automatically.
              </p>
            </div>

            <div className="bg-muted/50 p-4 rounded-lg space-y-2">
              <h4 className="font-semibold text-sm flex items-center gap-2">
                <Icon icon="heroicons:information-circle" className="w-5 h-5 text-primary" />
                What's included in the analysis:
              </h4>
              <ul className="text-sm text-muted-foreground space-y-1 ml-7">
                <li>• On-page SEO analysis</li>
                <li>• Meta tags evaluation</li>
                <li>• Content quality assessment</li>
                <li>• Technical SEO audit</li>
                <li>• Mobile responsiveness</li>
                <li>• Page speed insights</li>
                <li>• Keyword optimization</li>
                <li>• Actionable recommendations</li>
              </ul>
            </div>

            <div className="flex gap-3">
              <Button
                type="submit"
                disabled={isCreating}
                className="gap-2"
              >
                {isCreating ? (
                  <>
                    <Icon icon="heroicons:arrow-path" className="w-4 h-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Icon icon="heroicons:document-magnifying-glass" className="w-4 h-4" />
                    Generate Report
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={navigateToList}
                disabled={isCreating}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
