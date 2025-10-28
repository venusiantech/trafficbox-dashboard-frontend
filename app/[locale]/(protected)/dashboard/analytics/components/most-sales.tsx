"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import world from "./world-map.json";
import { VectorMap } from "@south-paw/react-vector-maps";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

export type TopCountryData = {
  country: string;
  count: number;
  percentage: number;
}

interface MostSalesProps {
  topCountries?: TopCountryData[];
}

const getCountryColor = (index: number) => {
  const colors = [
    "bg-primary/70 ring-primary/30",
    "bg-success/70 ring-success/30",
    "bg-info/70 ring-info/30",
    "bg-warning/70 ring-warning/30",
    "bg-secondary/70 ring-secondary/30",
  ];
  return colors[index % colors.length];
}

const MostSales = ({ topCountries = [] }: MostSalesProps) => {
  const [filterMap, setFilterMap] = useState("global");
  const t = useTranslations("AnalyticsDashboard");

  const totalVisits = topCountries.reduce((sum, country) => sum + country.count, 0);

  // Show message when no data is available
  if (topCountries.length === 0) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center">
          <CardTitle className="flex-1">Top Countries by Traffic</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-default-600">
            <p className="text-lg mb-2">No geographic data available</p>
            <p className="text-sm">Traffic data from different countries will appear here once available.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center">
        <CardTitle className="flex-1">Top Countries by Traffic</CardTitle>
        <div className="border border-default-200 dark:border-default-300 rounded p-1 flex items-center bg-background">
          <span
            className={cn(
              "flex-1 text-sm font-normal px-3 py-1 transition-all duration-150 rounded cursor-pointer",
              {
                "bg-default-900 text-primary-foreground dark:bg-default-300 dark:text-foreground":
                  filterMap === "global",
              }
            )}
            onClick={() => setFilterMap("global")}
          >
            Global
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="md:flex items-center gap-6">
          <div className="flex-none">
            <h4 className="text-default-600 text-sm font-normal mb-1.5">
              Total Visits from Top Countries
            </h4>
            <div className="text-lg font-medium mb-1.5 text-default-900">
              {totalVisits.toLocaleString()}
            </div>
            <div className="text-xs font-light text-default-600 mb-4">
              Across {topCountries.length} countries
            </div>
            <ul className="bg-default-50 rounded p-4 min-w-[184px] space-y-4 mt-4">
              {topCountries.slice(0, 6).map((item, i) => (
                <li
                  key={i}
                  className="flex justify-between items-center text-xs text-default-600"
                >
                  <span className="flex gap-2 items-center">
                    <span
                      className={`inline-flex h-1.5 w-1.5 bg-primary-500 ring-opacity-25 rounded-full ring-4 ${getCountryColor(i)}`}
                    ></span>
                    <span className="font-medium">{item.country}</span>
                  </span>
                  <div className="text-right">
                    <div className="font-medium">{item.count.toLocaleString()}</div>
                    <div className="text-[10px] text-default-500">{item.percentage.toFixed(1)}%</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex-1">
            <VectorMap {...world} className="dashcode-app-vmap" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MostSales;
