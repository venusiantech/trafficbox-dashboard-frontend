"use client"

import { memo, useState, useEffect, useRef, useCallback } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  Annotation
} from "react-simple-maps";
import { useTheme } from "next-themes";
import { countryCoordinates, countryNames } from "@/lib/countries";

const geoUrl = "/maps/world-countries.json";

// Calculate optimal viewport based on highlighted countries
const calculateOptimalViewport = (countries: string[]) => {
  // Default viewport for full world map
  const defaultViewport = {
    center: [15, 30] as [number, number],
    scale: 170
  };

  if (countries.length === 0) {
    return defaultViewport;
  }

  // Get valid coordinates for all highlighted countries
  const coordinates = countries
    .map(code => countryCoordinates[code])
    .filter(Boolean) as [number, number][];

  if (coordinates.length === 0) {
    return defaultViewport;
  }

  // Calculate bounding box
  const lngs = coordinates.map(coord => coord[0]);
  const lats = coordinates.map(coord => coord[1]);
  
  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);

  // Calculate center point
  const centerLng = (minLng + maxLng) / 2 - 30;
  const centerLat = (minLat + maxLat) / 2;

  // Calculate spread (how far apart the countries are)
  const lngSpread = Math.abs(maxLng - minLng);
  const latSpread = Math.abs(maxLat - minLat);
  const maxSpread = Math.max(lngSpread, latSpread);

  // Calculate scale based on spread
  // Smaller spread = higher scale (zoom in more)
  // Larger spread = lower scale (zoom out to fit all)
  let scale: number;
  
  if (maxSpread < 5) {
    // Very close countries (e.g., neighboring European countries)
    scale = 1200;
  } else if (maxSpread < 15) {
    // Regional (e.g., countries in same region)
    scale = 800;
  } else if (maxSpread < 30) {
    // Multi-regional (e.g., Europe + Middle East)
    scale = 550;
  } else if (maxSpread < 60) {
    // Continental spread
    scale = 400;
  } else if (maxSpread < 100) {
    // Multi-continental (e.g., US + Europe)
    scale = 280;
  } else {
    // Global spread - keep it closer to default
    scale = 220;
  }

  return {
    center: [centerLng, centerLat] as [number, number],
    scale
  };
};

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

const WorldMapInteractive = ({ topCountries = [], campaignPerformance = [] }: WorldMapInteractiveProps) => {
  const { theme: mode } = useTheme();
  
  // State for viewport with initial default values
  const [viewport, setViewport] = useState({
    center: [0, 30] as [number, number],
    scale: 170
  });
  
  // State to track if map has loaded
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  
  // Animation frame reference
  const animationFrameRef = useRef<number | null>(null);
  
  // Ref to track current viewport for animation start point
  const currentViewportRef = useRef({ center: [0, 30] as [number, number], scale: 170 });

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

  // Smooth animation function using easing
  const animateViewport = useCallback((
    startCenter: [number, number],
    startScale: number,
    endCenter: [number, number],
    endScale: number,
    duration: number = 1500
  ) => {
    // Cancel any existing animation
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    const startTime = performance.now();

    // Easing function (ease-in-out cubic)
    const easeInOutCubic = (t: number): number => {
      return t < 0.5
        ? 4 * t * t * t
        : 1 - Math.pow(-2 * t + 2, 3) / 2;
    };

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeInOutCubic(progress);

      // Interpolate center coordinates
      const currentCenter: [number, number] = [
        startCenter[0] + (endCenter[0] - startCenter[0]) * eased,
        startCenter[1] + (endCenter[1] - startCenter[1]) * eased,
      ];

      // Interpolate scale
      const currentScale = startScale + (endScale - startScale) * eased;

      setViewport({
        center: currentCenter,
        scale: currentScale,
      });
      
      // Update ref to track current position
      currentViewportRef.current = {
        center: currentCenter,
        scale: currentScale,
      };

      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(animate);
      } else {
        animationFrameRef.current = null;
      }
    };

    animationFrameRef.current = requestAnimationFrame(animate);
  }, []);

  // Update ref whenever viewport changes (for tracking)
  useEffect(() => {
    currentViewportRef.current = viewport;
  }, [viewport]);

  // Calculate optimal viewport after map loads and when countries change
  useEffect(() => {
    // Wait for map to load first
    if (!isMapLoaded) {
      // Small delay to ensure map is rendered
      const timer = setTimeout(() => {
        setIsMapLoaded(true);
      }, 300);
      return () => clearTimeout(timer);
    }

    // After map is loaded, calculate and animate to optimal viewport
    if (isMapLoaded && topCountries.length > 0) {
      const optimalViewport = calculateOptimalViewport(topCountries);
      
      // Small delay for smooth animation start
      const animateTimer = setTimeout(() => {
        // Use ref to get current viewport (avoids stale closure)
        const startViewport = currentViewportRef.current;
        animateViewport(
          startViewport.center,
          startViewport.scale,
          optimalViewport.center,
          optimalViewport.scale,
          1500
        );
      }, 200);
      
      return () => {
        clearTimeout(animateTimer);
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
          animationFrameRef.current = null;
        }
      };
    } else if (isMapLoaded && topCountries.length === 0) {
      // Reset to default if no countries
      const startViewport = currentViewportRef.current;
      animateViewport(
        startViewport.center,
        startViewport.scale,
        [0, 30],
        170,
        1500
      );
    }
  }, [topCountries, isMapLoaded, animateViewport]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <div className="w-full h-full">
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{
          scale: viewport.scale,
          center: viewport.center
        }}
        className="w-full h-full"
      >
        <Geographies geography={geoUrl}>
          {({ geographies }: { geographies: any[] }) => {
            // Add null/undefined check to prevent runtime errors
            if (!geographies || !Array.isArray(geographies) || geographies.length === 0) {
              return null;
            }
            
            return geographies.map((geo: any) => {
              // Add safety check for geo properties
              if (!geo || !geo.properties) {
                return null;
              }
              
              const countryCode = geo.properties.ISO_A2;
              const isActive = topCountries.includes(countryCode);
              
              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill={
                    isActive
                      ? mode === "dark"
                        ? "#334155"
                        : "#334155"
                      : mode === "dark"
                      ? "#1e293b"
                      : "#e2e8f0"
                  }
                  stroke={mode === "dark" ? "#1e293b" : "#cbd5e1"}
                  strokeWidth={0.5}
                  style={{
                    default: { 
                      outline: "none",
                      transition: "fill 0.6s ease-out"
                    },
                    hover: {
                      fill: isActive
                        ? mode === "dark"
                          ? "#475569"
                          : "#475569"
                        : mode === "dark"
                        ? "#334155"
                        : "#cbd5e1",
                      outline: "none",
                      cursor: "pointer",
                      transition: "fill 0.3s ease-out"
                    },
                    pressed: { 
                      outline: "none",
                      transition: "fill 0.2s ease-out"
                    },
                  }}
                />
              );
            });
          }}
        </Geographies>
        
        {/* Render markers for countries with activity */}
        {Object.entries(countryActivity).map(([country, activity]) => {
          const coordinates = countryCoordinates[country];
          if (!coordinates) return null;

          // Calculate marker size based on activity (reduced size range)
          const totalActivity = activity.hits + activity.visits;
          const size = Math.min(Math.max(totalActivity / 20, 4), 12);

          return (
            <Marker key={country} coordinates={coordinates}>
              <g>
                {/* Outer glow */}
                <circle
                  r={size + 2}
                  fill="#334155"
                  fillOpacity={0.3}
                  className="animate-pulse"
                />
                {/* Main marker */}
                <circle
                  r={size}
                  fill="#334155"
                  fillOpacity={0.9}
                  stroke="#fff"
                  strokeWidth={1.5}
                />
                {/* Inner highlight */}
                <circle
                  r={size / 2.5}
                  fill="#475569"
                  fillOpacity={0.8}
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
              dy={-35}
              connectorProps={{
                stroke: mode === "dark" ? "#475569" : "#334155",
                strokeWidth: 1.5,
                strokeLinecap: "round"
              }}
            >
              <g>
                {/* Background rectangle for better text visibility */}
                <rect
                  x={-countryName.length * 5}
                  y={-10}
                  width={countryName.length * 10}
                  height={20}
                  fill={mode === "dark" ? "#1e293b" : "#ffffff"}
                  fillOpacity={0.9}
                  rx={4}
                  stroke={mode === "dark" ? "#334155" : "#475569"}
                  strokeWidth={1}
                />
                {/* Text with better styling */}
                <text
                  x={0}
                  y={0}
                  textAnchor="middle"
                  alignmentBaseline="middle"
                  fill={mode === "dark" ? "#e2e8f0" : "#1e293b"}
                  fontSize={12}
                  fontWeight={600}
                  style={{
                    pointerEvents: "none",
                    userSelect: "none",
                  }}
                >
                  {countryName}
                </text>
              </g>
            </Annotation>
          );
        })}
      </ComposableMap>
    </div>
  );
};

export default memo(WorldMapInteractive);

