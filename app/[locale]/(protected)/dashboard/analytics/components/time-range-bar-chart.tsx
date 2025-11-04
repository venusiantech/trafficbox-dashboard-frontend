"use client"

import dynamic from "next/dynamic";
import { useTheme } from "next-themes";
import { TimeRangeMetric } from "@/context/dashboardStore";
import { cn } from "@/lib/utils";

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
      type: 'bar',
      toolbar: {
        show: false,
      },
      sparkline: {
        enabled: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '50%',
        borderRadius: 0,
        dataLabels: {
          position: 'top',
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: false,
      width: 0,
    },
    xaxis: {
      categories: categories,
      labels: {
        style: {
          colors: mode === "dark" ? "#94a3b8" : "#64748b",
          fontSize: '11px',
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
      labels: {
        style: {
          colors: mode === "dark" ? "#94a3b8" : "#64748b",
          fontSize: '11px',
          fontFamily: 'Inter',
        },
        formatter: function (val: number) {
          return val.toString();
        },
      },
      max: maxValue > 0 ? Math.ceil(maxValue * 1.2) : 10,
      tickAmount: 5,
    },
    fill: {
      opacity: 1,
      colors: ['#3b82f6'],
    },
    colors: ['#3b82f6'],
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
      <div className={cn("absolute bottom-4 left-4 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 shadow-lg border border-default-200 rounded-lg p-4 w-[400px]", className)}>
        <div className="text-xs text-default-600 uppercase tracking-wide mb-1 font-semibold">
          Active Users Per Time Range
          
        </div>
        <div className="text-sm text-default-500 text-center py-4">
          No data available
        </div>
      </div>
    );
  }

  return (
    <div className={cn("absolute bottom-4 left-4 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 shadow-lg border border-default-200 rounded-lg p-2 w-[420px]", className)}>
      <div className="text-xs text-default-600 uppercase tracking-wide m-2 font-semibold">
        Active Users Per Time Range
      </div>
      <Chart
        options={options}
        series={[{ name: 'Active Users', data: seriesData }]}
        type="bar"
        height={220}
        width="100%"
      />
    </div>
  );
};

export default TimeRangeBarChart;

