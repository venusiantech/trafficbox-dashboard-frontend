"use client"

import dynamic from "next/dynamic";
import { useTheme } from "next-themes";
import { TimeRangeMetric } from "@/context/dashboardStore";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface TimeRangeBarChartProps {
  timeRangeMetrics?: {
    '1m'?: TimeRangeMetric;
    '15m'?: TimeRangeMetric;
    '1h'?: TimeRangeMetric;
    '7d'?: TimeRangeMetric;
    '30d'?: TimeRangeMetric;
  };
  className?: string;
}

const TimeRangeBarChart = ({ timeRangeMetrics, className }: TimeRangeBarChartProps) => {
  const { theme: mode } = useTheme();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Prepare data for chart
  const categories = timeRangeMetrics 
    ? ['1m', '15m', '1h', '7d', '30d']
        .filter(key => timeRangeMetrics[key as keyof typeof timeRangeMetrics])
        .map(key => {
          const metric = timeRangeMetrics[key as keyof typeof timeRangeMetrics];
          return metric?.label || key;
        })
    : [];

  const seriesData = timeRangeMetrics
    ? ['1m', '15m', '1h', '7d', '30d']
        .filter(key => timeRangeMetrics[key as keyof typeof timeRangeMetrics])
        .map(key => {
          const metric = timeRangeMetrics[key as keyof typeof timeRangeMetrics];
          return metric?.uniqueVisitors || 0;
        })
    : [];

  // Check if all values are zero
  const hasData = seriesData.some(value => value > 0);
  const maxValue = Math.max(...seriesData, 1);

  const options: any = {
    chart: {
      type: 'line',
      toolbar: {
        show: false,
      },
      sparkline: {
        enabled: false,
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      curve: 'smooth',
      width: 3,
      colors: ['#3b82f6'],
    },
    xaxis: {
      categories: categories,
      labels: {
        style: {
          colors: mode === "dark" ? "#94a3b8" : "#64748b",
          fontSize: isMobile ? '9px' : '11px',
          fontFamily: 'Inter',
          fontWeight: 400,
        },
        rotate: 0,
      },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      min: 0,
      max: maxValue > 0 ? Math.ceil(maxValue * 1.2) : 10,
      tickAmount: 5,
      forceNiceScale: true,
      labels: {
        style: {
          colors: mode === "dark" ? "#94a3b8" : "#64748b",
          fontSize: isMobile ? '9px' : '11px',
          fontFamily: 'Inter',
        },
        formatter: function (val: number) {
          return val.toString();
        },
      },
    },
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'light',
        type: 'vertical',
        shadeIntensity: 1,
        gradientToColors: ['#dbeafe'],
        inverseColors: false,
        opacityFrom: 0.8,
        opacityTo: 0.2,
        stops: [0, 100],
      },
    },
    colors: ['#3b82f6'],
    markers: {
      size: isMobile ? 4 : 5,
      colors: ['#3b82f6'],
      strokeColors: '#fff',
      strokeWidth: isMobile ? 1.5 : 2,
      hover: {
        size: isMobile ? 6 : 7,
      },
    },
    grid: {
      show: true,
      borderColor: mode === "dark" ? "#1e293b" : "#e2e8f0",
      strokeDashArray: 0,
      xaxis: {
        lines: {
          show: false,
        },
      },
      yaxis: {
        lines: {
          show: true,
        },
      },
      padding: {
        top: 0,
        right: 4,
        bottom: 0,
        left: 0,
      },
    },
    tooltip: {
      enabled: true,
      theme: mode === "dark" ? "dark" : "light",
      style: {
        fontSize: '12px',
        fontFamily: 'Inter',
      },
      y: {
        formatter: function (val: number) {
          return `${val.toLocaleString()} active users`;
        },
      },
    },
  };

  if (!hasData) {
    return (
      <div className={cn("absolute bottom-2 left-2 sm:bottom-4 sm:left-4 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 shadow-lg border border-default-200 rounded-lg p-2 sm:p-4 w-[calc(100%-1rem)] sm:w-[400px]", className)}>
        <div className="text-[10px] sm:text-xs text-default-600 uppercase tracking-wide mb-1 font-semibold">
          Active Users Per Time Range
        </div>
        <div className="text-xs sm:text-sm text-default-500 text-center py-2 sm:py-4">
          No data available
        </div>
      </div>
    );
  }

  return (
    <div className={cn("absolute bottom-2 left-2 sm:bottom-4 sm:left-4 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 shadow-lg border border-default-200 rounded-lg p-2 w-[calc(100%-1rem)] sm:w-[420px]", className)}>
      <div className="text-[10px] sm:text-xs text-default-600 uppercase tracking-wide mb-1 sm:m-2 font-semibold">
        Active Users Per Time Range
      </div>
      <Chart
        options={options}
        series={[{ name: 'Active Users', data: seriesData }]}
        type="line"
        height={isMobile ? 160 : 220}
        width="100%"
      />
    </div>
  );
};

export default TimeRangeBarChart;

