"use client"

import { memo } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  Annotation
} from "react-simple-maps";
import { useTheme } from "next-themes";

const geoUrl = "/maps/world-countries.json";

interface WorldMapInteractiveProps {
  topCountries?: string[];
  campaignPerformance?: Array<{
    campaignId: string;
    title: string;
    countries: string[];
    hits: number;
    visits: number;
  }>;
}

// Country coordinates for markers (approximate capital/center locations)
const countryCoordinates: Record<string, [number, number]> = {
  US: [-95.7129, 37.0902],
  CA: [-106.3468, 56.1304],
  AE: [53.8478, 23.4241],
  IN: [78.9629, 20.5937],
  GB: [-3.4360, 55.3781],
  DE: [10.4515, 51.1657],
  FR: [2.2137, 46.2276],
  AU: [133.7751, -25.2744],
  BR: [-51.9253, -14.2350],
  JP: [138.2529, 36.2048],
  CN: [104.1954, 35.8617],
  RU: [105.3188, 61.5240],
  MX: [-102.5528, 23.6345],
  IT: [12.5674, 41.8719],
  ES: [-3.7492, 40.4637],
};

// Country names mapping
const countryNames: Record<string, string> = {
  US: "United States",
  CA: "Canada",
  AE: "UAE",
  IN: "India",
  GB: "United Kingdom",
  DE: "Germany",
  FR: "France",
  AU: "Australia",
  BR: "Brazil",
  JP: "Japan",
  CN: "China",
  RU: "Russia",
  MX: "Mexico",
  IT: "Italy",
  ES: "Spain",
};

const WorldMapInteractive = ({ topCountries = [], campaignPerformance = [] }: WorldMapInteractiveProps) => {
  const { theme: mode } = useTheme();

  // Calculate country activity from campaign performance
  const countryActivity = topCountries.reduce((acc, country) => {
    const campaigns = campaignPerformance.filter(
      c => c.countries.includes(country) || (c.countries.length === 0 && country)
    );
    const totalHits = campaigns.reduce((sum, c) => sum + c.hits, 0);
    const totalVisits = campaigns.reduce((sum, c) => sum + c.visits, 0);
    
    if (totalHits > 0 || totalVisits > 0) {
      acc[country] = { hits: totalHits, visits: totalVisits };
    }
    return acc;
  }, {} as Record<string, { hits: number; visits: number }>);

  return (
    <div className="w-full h-full">
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{
          scale: 147,
          center: [0, 20]
        }}
        className="w-full h-full"
      >
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map((geo) => {
              const countryCode = geo.properties.ISO_A2;
              const isActive = topCountries.includes(countryCode);
              
              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill={
                    isActive
                      ? mode === "dark"
                        ? "#3b82f6"
                        : "#60a5fa"
                      : mode === "dark"
                      ? "#334155"
                      : "#e2e8f0"
                  }
                  stroke={mode === "dark" ? "#1e293b" : "#cbd5e1"}
                  strokeWidth={0.5}
                  style={{
                    default: { outline: "none" },
                    hover: {
                      fill: isActive
                        ? mode === "dark"
                          ? "#2563eb"
                          : "#3b82f6"
                        : mode === "dark"
                        ? "#475569"
                        : "#cbd5e1",
                      outline: "none",
                      cursor: "pointer",
                    },
                    pressed: { outline: "none" },
                  }}
                />
              );
            })
          }
        </Geographies>
        
        {/* Render markers for countries with activity */}
        {Object.entries(countryActivity).map(([country, activity]) => {
          const coordinates = countryCoordinates[country];
          if (!coordinates) return null;

          // Calculate marker size based on activity
          const totalActivity = activity.hits + activity.visits;
          const size = Math.min(Math.max(totalActivity / 10, 8), 40);

          return (
            <Marker key={country} coordinates={coordinates}>
              <g>
                {/* Outer glow */}
                <circle
                  r={size + 4}
                  fill="#3b82f6"
                  fillOpacity={0.2}
                  className="animate-pulse"
                />
                {/* Main marker */}
                <circle
                  r={size}
                  fill="#3b82f6"
                  fillOpacity={0.8}
                  stroke="#fff"
                  strokeWidth={2}
                />
                {/* Inner highlight */}
                <circle
                  r={size / 2}
                  fill="#60a5fa"
                  fillOpacity={0.6}
                />
              </g>
            </Marker>
          );
        })}

        {/* Render country name annotations */}
        {topCountries.map((country) => {
          const coordinates = countryCoordinates[country];
          const countryName = countryNames[country] || country;
          if (!coordinates) return null;

          return (
            <Annotation
              key={`label-${country}`}
              subject={coordinates}
              dx={0}
              dy={-20}
              connectorProps={{
                stroke: mode === "dark" ? "#60a5fa" : "#3b82f6",
                strokeWidth: 1,
                strokeLinecap: "round"
              }}
            >
              <text
                x={0}
                textAnchor="middle"
                alignmentBaseline="middle"
                fill= "#e2e8f0"
                fontSize={16}
                fontWeight={600}
                style={{
                  pointerEvents: "none",
                  userSelect: "none",
                }}
              >
                {countryName}
              </text>
            </Annotation>
          );
        })}
      </ComposableMap>
    </div>
  );
};

export default memo(WorldMapInteractive);

