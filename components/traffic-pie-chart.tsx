"use client"

import { useConfig } from "@/hooks/use-config";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import dynamic from "next/dynamic";
import { useState } from "react";
import { TimeRangeMetric } from "@/context/dashboardStore";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface TrafficPieChartProps {
  height?: number;
  chartType?: "bar" | "area";
  series?: any[];
  chartColors?: string[];
  timeRangeMetrics?: {
    '1m'?: TimeRangeMetric;
    '15m'?: TimeRangeMetric;
    '1h'?: TimeRangeMetric;
    '7d'?: TimeRangeMetric;
    '30d'?: TimeRangeMetric;
  };
}

type TimeRangeKey = '1m' | '15m' | '1h' | '7d' | '30d';

const TrafficPieChart = ({
  height = 350,
  timeRangeMetrics
}: TrafficPieChartProps) => {
  const [selectedTimeRange, setSelectedTimeRange] = useState<TimeRangeKey>('1h');
  const [config] = useConfig();
  const { isRtl } = config;
  const t = useTranslations("AnalyticsDashboard");
  const { theme: mode } = useTheme();

  // Get available time ranges
  const availableTimeRanges = timeRangeMetrics 
    ? Object.keys(timeRangeMetrics).filter(key => timeRangeMetrics[key as TimeRangeKey]) 
    : [];

  // Get data for selected time range
  const selectedData = timeRangeMetrics?.[selectedTimeRange];
  
  // Create pie chart series
  const pieSeries = selectedData ? [
    selectedData.totalHits || 0,
    selectedData.totalVisits || 0,
    selectedData.totalViews || 0,
  ] : [0, 0, 0];

  // Check if all values are zero
  const hasData = pieSeries.some(value => value > 0);

  const chartColors = ["#4669FA", "#0CE7FA", "#FA916B"];
  
  const options: any = {
    chart: {
      toolbar: {
        show: false,
      },
    },
    labels: ["Hits", "Visits", "Views"],
    legend: {
      show: true,
      position: "bottom",
      horizontalAlign: "center",
      fontSize: "12px",
      fontFamily: "Inter",
      markers: {
        width: 10,
        height: 10,
        radius: 12,
      },
      labels: {
        colors: mode === "dark" ? "#CBD5E1" : "#475569",
      },
      itemMargin: {
        horizontal: 10,
        vertical: 8,
      },
    },
    dataLabels: {
      enabled: true,
      formatter: function (val: number, opts: any) {
        const value = opts.w.config.series[opts.seriesIndex];
        return value > 0 ? value.toLocaleString() : '';
      },
      style: {
        fontSize: '12px',
        fontFamily: 'Inter',
        fontWeight: 600,
        colors: ['#fff']
      },
      dropShadow: {
        enabled: false,
      }
    },
    plotOptions: {
      pie: {
        donut: {
          size: '70%',
          labels: {
            show: true,
            name: {
              show: true,
              fontSize: '14px',
              fontFamily: 'Inter',
              color: mode === "dark" ? "#CBD5E1" : "#475569",
            },
            value: {
              show: true,
              fontSize: '24px',
              fontFamily: 'Inter',
              fontWeight: 600,
              color: mode === "dark" ? "#fff" : "#0f172a",
              formatter: function (val: string) {
                return parseInt(val).toLocaleString();
              }
            },
            total: {
              show: true,
              label: 'Total Traffic',
              fontSize: '14px',
              fontFamily: 'Inter',
              color: mode === "dark" ? "#CBD5E1" : "#475569",
              formatter: function (w: any) {
                const total = w.globals.seriesTotals.reduce((a: number, b: number) => a + b, 0);
                return total.toLocaleString();
              }
            }
          }
        }
      }
    },
    colors: chartColors,
    stroke: {
      show: true,
      width: 2,
      colors: [mode === "dark" ? "#0f172a" : "#fff"],
    },
    tooltip: {
      enabled: true,
      y: {
        formatter: function (val: number) {
          return val.toLocaleString();
        },
      },
      theme: mode === "dark" ? "dark" : "light",
    },
    responsive: [
      {
        breakpoint: 600,
        options: {
          legend: {
            position: "bottom",
          },
          plotOptions: {
            pie: {
              donut: {
                size: '65%',
              }
            }
          }
        },
      },
    ],
  };
  // Show message when no data is available
  if (!hasData) {
    return (
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-default-900">Traffic Distribution</h3>
          <Select value={selectedTimeRange} onValueChange={(value) => setSelectedTimeRange(value as TimeRangeKey)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              {availableTimeRanges.map((range) => (
                <SelectItem key={range} value={range}>
                  {timeRangeMetrics?.[range as TimeRangeKey]?.label || range}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center justify-center" style={{ height: `${height}px` }}>
          <div className="text-center">
            <p className="text-sm text-default-600">
              No traffic data available yet
            </p>
            <p className="text-xs text-default-500 mt-1">
              Data will appear here once your campaigns start receiving traffic
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-default-900">Traffic Distribution</h3>
        <Select value={selectedTimeRange} onValueChange={(value) => setSelectedTimeRange(value as TimeRangeKey)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select time range" />
          </SelectTrigger>
          <SelectContent>
            {availableTimeRanges.map((range) => (
              <SelectItem key={range} value={range}>
                {timeRangeMetrics?.[range as TimeRangeKey]?.label || range}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Chart
        key={selectedTimeRange}
        options={options}
        series={pieSeries}
        type="donut"
        height={height}
        width={"100%"}
      />
    </div>
  );
};

export default TrafficPieChart;
