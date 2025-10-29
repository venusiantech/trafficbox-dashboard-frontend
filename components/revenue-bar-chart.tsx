"use client"

import { useConfig } from "@/hooks/use-config";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import dynamic from "next/dynamic";
import { TimeRangeMetric } from "@/context/dashboardStore";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface RevenueBarChartProps {
  height?: number;
  chartType?: "bar" | "area";
  series?: any[];
  chartColors?: string[];
  timeRangeMetrics?: {
    '15m': TimeRangeMetric;
    '1h': TimeRangeMetric;
    '7d': TimeRangeMetric;
    '30d': TimeRangeMetric;
  };
}

const defaultSeries = [{
  name: "Hits",
  data: [0, 0, 0, 0],
},
{
  name: "Visits",
  data: [0, 0, 0, 0],
},
{
  name: "Views",
  data: [0, 0, 0, 0],
}]

const RevenueBarChart = ({
  height = 400,
  chartType = "bar",
  series,
  chartColors = ["#4669FA", "#0CE7FA", "#FA916B"],
  timeRangeMetrics

}: RevenueBarChartProps) => {
  // Transform timeRangeMetrics into chart series
  const chartSeries = series || (timeRangeMetrics ? [
    {
      name: "Hits",
      data: [
        timeRangeMetrics['15m']?.totalHits || 0,
        timeRangeMetrics['1h']?.totalHits || 0,
        timeRangeMetrics['7d']?.totalHits || 0,
        timeRangeMetrics['30d']?.totalHits || 0,
      ],
    },
    {
      name: "Visits",
      data: [
        timeRangeMetrics['15m']?.totalVisits || 0,
        timeRangeMetrics['1h']?.totalVisits || 0,
        timeRangeMetrics['7d']?.totalVisits || 0,
        timeRangeMetrics['30d']?.totalVisits || 0,
      ],
    },
    {
      name: "Views",
      data: [
        timeRangeMetrics['15m']?.totalViews || 0,
        timeRangeMetrics['1h']?.totalViews || 0,
        timeRangeMetrics['7d']?.totalViews || 0,
        timeRangeMetrics['30d']?.totalViews || 0,
      ],
    }
  ] : defaultSeries);

  // Check if all values are zero
  const hasData = chartSeries.some(series => 
    series.data.some((value: number) => value > 0)
  );

  const [config] = useConfig();
  const { isRtl } = config;
  const t = useTranslations("AnalyticsDashboard");
  const { theme: mode } = useTheme();
  const options: any = {
    chart: {
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        endingShape: "rounded",
        columnWidth: "45%",
      },
    },
    legend: {
      show: true,
      position: "top",
      horizontalAlign: "right",
      fontSize: "12px",
      fontFamily: "Inter",
      offsetY: -30,
      markers: {
        width: 8,
        height: 8,
        offsetY: -1,
        offsetX: -5,
        radius: 12,
      },
      labels: {
        colors: mode === "dark" ? "#CBD5E1" : "#475569",
      },
      itemMargin: {
        horizontal: 18,
        vertical: 0,
      },
    },
    title: {
      text: `${t("revenue_report")}`,
      align: "left",
      offsetY: 13,
      offsetX: isRtl ? "0%" : 0,
      floating: false,
      style: {
        fontSize: "20px",
        fontWeight: "500",
        fontFamily: "Inter",
        color: mode === "dark" ? "#fff" : "#0f172a",
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 2,
      colors: ["transparent"],
    },
    yaxis: {
      labels: {
        style: {
          colors: mode === "dark" ? "#CBD5E1" : "#475569",
          fontFamily: "Inter",
        },
      },
    },
    xaxis: {
      categories: timeRangeMetrics ? [
        timeRangeMetrics['15m']?.label || "15 Minutes",
        timeRangeMetrics['1h']?.label || "1 Hour",
        timeRangeMetrics['7d']?.label || "7 Days",
        timeRangeMetrics['30d']?.label || "30 Days",
      ] : [
        "15 Minutes",
        "1 Hour",
        "7 Days",
        "30 Days",
      ],
      labels: {
        style: {
          colors: mode === "dark" ? "#CBD5E1" : "#475569",
          fontFamily: "Inter",
        },
      },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },

    fill: {
      opacity: 1,
    },
    tooltip: {
      y: {
        formatter: function (val: number) {
          return val.toLocaleString();
        },
      },
    },
    colors: chartColors,
    grid: {
      show: false,
      borderColor: mode === "dark" ? "#334155" : "#E2E8F0",
      strokeDashArray: 10,
      position: "back",
    },
    responsive: [
      {
        breakpoint: 600,
        options: {
          legend: {
            position: "bottom",
            offsetY: 8,
            horizontalAlign: "center",
          },
          plotOptions: {
            bar: {
              columnWidth: "80%",
            },
          },
        },
      },
    ],
  };
  // Show message when no data is available
  if (!hasData) {
    return (
      <div className="flex items-center justify-center" style={{ height: `${height}px` }}>
        <div className="text-center">
          <div className="text-lg font-medium text-default-900 mb-2">
            {t("revenue_report")}
          </div>
          <p className="text-sm text-default-600">
            No traffic data available yet
          </p>
          <p className="text-xs text-default-500 mt-1">
            Data will appear here once your campaigns start receiving traffic
          </p>
        </div>
      </div>
    );
  }

  return (
    <Chart
      options={options}
      series={chartSeries}
      type={chartType}
      height={height}
      width={"100%"}
    />
  );
};

export default RevenueBarChart;
