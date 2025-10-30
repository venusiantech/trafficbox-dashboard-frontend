"use client"

import { useTheme } from "next-themes";
import dynamic from "next/dynamic";
import { colors } from "@/lib/colors";

// Dynamically import Chart with SSR disabled
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface OverviewRadialChartProps {
  height?: number;
  series?: number[];
  chartType?: "donut" | "pie" | "radialBar";
  labels?: string[];
  chartColor?: string[];
  label?: string;
}
const OverviewRadialChart = ({
  height = 320,
  series = [67],
  chartType = "radialBar",
  chartColor=["#2563eb"],
  label = "Conversion Rate",
}: OverviewRadialChartProps) => {

  const {theme:mode} = useTheme();

  const options:any = {
    chart: {
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      radialBar: {
        startAngle: -135,
        endAngle: 135,
        hollow: {
          margin: 0,
          size: "70%",
        },
        track: {
          background: mode === 'dark' ? colors["default-800"] : "#e2e8f0",
          strokeWidth: "100%",
        },
        dataLabels: {
          name: {
            offsetY: -10,
            fontSize: "16px",
            fontWeight: 500,
            fontFamily: "Inter",
            color: mode === 'light' ? colors["default-600"] : colors["default-300"]
          },
          value: {
            offsetY: 10,
            fontSize: "36px",
            fontWeight: 700,
            fontFamily: "Inter",
            color: mode === 'light' ? colors["default"] : "#f1f5f9",
            formatter: function (val: number) {
              return val + "%";
            }
          },
          total: {
            show: true,
            label: label,
            fontSize: "16px",
            fontWeight: 500,
            fontFamily: "Inter",
            color: mode === 'light' ? colors["default-600"] : colors["default-300"],
            formatter: function (w: any) {
              // Return the actual value from series
              return w.globals.seriesTotals[0] + "%";
            }
          }
        }
      }
    },
    fill: {
      type: "gradient",
      gradient: {
        shade: mode === "dark" ? "light" : "dark",
        type: "horizontal",
        shadeIntensity: 0.5,
        gradientToColors: undefined,
        inverseColors: true,
        opacityFrom: 1,
        opacityTo: 1,
        stops: [0, 100],
      },
    },
    stroke: {
      lineCap: "round",
    },
    colors: chartColor,
  };

  return (
    <div>
      <Chart series={series} options={options} type={chartType} height={height} />
    </div>
  );
};

export default OverviewRadialChart;
