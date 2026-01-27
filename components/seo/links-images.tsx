"use client";

import { Card, CardContent } from "@/components/ui/card";
import type { Links, Images } from "./types";

interface LinksImagesProps {
  links: Links;
  images: Images;
}

export function LinksImages({ links, images }: LinksImagesProps) {
  const altTextCoverage = images.total > 0 ? (images.with_alt / images.total) * 100 : 0;

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6 sm:p-8">
        <div className="flex items-start gap-4 mb-6">
          <div className="w-1 h-8 bg-purple-600 rounded-full" />
          <h2 className="text-2xl font-semibold text-gray-800">Links & Images</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Links Analysis */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-800 mb-4">Links Analysis</h3>
            
            <div className="space-y-3">
              <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Total Links</span>
                  <span className="text-lg font-bold text-gray-800">{links.total}</span>
                </div>
              </div>
              
              <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Internal</span>
                  <span className="text-lg font-bold text-purple-600">{links.internal}</span>
                </div>
              </div>
              
              <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">External</span>
                  <span className="text-lg font-bold text-purple-600">{links.external}</span>
                </div>
              </div>
              
              <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Dofollow</span>
                  <span className="text-lg font-bold text-purple-600">{links.dofollow || 0}</span>
                </div>
              </div>
              
              <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Nofollow</span>
                  <span className="text-lg font-bold text-gray-600">{links.nofollow || 0}</span>
                </div>
              </div>
              
              {links.broken > 0 && (
                <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Broken Links</span>
                    <span className="text-lg font-bold text-gray-600">{links.broken}</span>
                  </div>
                </div>
              )}
            </div>

            {links.issues && links.issues.length > 0 && (
              <div className="mt-4 space-y-2">
                <h4 className="text-sm font-medium text-gray-700">Issues</h4>
                <div className="space-y-1">
                  {links.issues.map((issue, i) => (
                    <div key={i} className="text-sm text-gray-600">
                      • {issue}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Images Analysis */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-800 mb-4">Images Analysis</h3>
            
            <div className="space-y-3">
              <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Total Images</span>
                  <span className="text-lg font-bold text-gray-800">{images.total}</span>
                </div>
              </div>
              
              <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">With Alt Text</span>
                  <span className="text-lg font-bold text-purple-600">{images.with_alt}</span>
                </div>
              </div>
              
              <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Without Alt Text</span>
                  <span className="text-lg font-bold text-gray-600">{images.without_alt}</span>
                </div>
              </div>
              
              <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Alt Text Coverage</span>
                  <span className="text-lg font-bold text-purple-600">
                    {altTextCoverage.toFixed(0)}%
                  </span>
                </div>
              </div>
              
              <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Lazy Loaded</span>
                  <span className="text-lg font-bold text-purple-600">{images.lazy_loaded || 0}</span>
                </div>
              </div>
            </div>

            {images.issues && images.issues.length > 0 && (
              <div className="mt-4 space-y-2">
                <h4 className="text-sm font-medium text-gray-700">Issues</h4>
                <div className="space-y-1">
                  {images.issues.map((issue, i) => (
                    <div key={i} className="text-sm text-gray-600">
                      • {issue}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
