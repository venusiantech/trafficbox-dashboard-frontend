"use client";

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// Define dashboard types based on API response
export type DashboardOverview = {
  totalCampaigns: number;
  totalHits: number;
  totalVisits: number;
  totalViews: number;
  uniqueVisitors: number;
  averageSpeed: number;
  topCountries: string[]; // Changed to array of country codes
  campaignPerformance: Array<{
    campaignId: string;
    title: string;
    projectId: string; // Changed from sparkTrafficProjectId
    hits: number;
    visits: number;
    views: number;
    uniqueVisitors: number;
    speed: number;
    lastUpdated: string;
    campaignStatus: string; // Changed from projectStatus
    geoType: string;
    countries: string[];
  }>;
  timeRangeMetrics: {
    '1m'?: TimeRangeMetric;
    '15m': TimeRangeMetric;
    '1h': TimeRangeMetric;
    '7d': TimeRangeMetric;
    '30d': TimeRangeMetric;
  };
};

export type TimeRangeMetric = {
  label: string;
  totalHits: number;
  totalVisits: number;
  totalViews: number;
  uniqueVisitors: number;
  avgSpeed: number;
  avgBounceRate: number;
  lastUpdated: string;
  campaignsCount: number;
};

export type DashboardMetadata = {
  dataCollectedFrom: number;
  lastCalculated: string;
  userType: string;
};

// Define dashboard store type
interface DashboardState {
  overview: DashboardOverview | null;
  metadata: DashboardMetadata | null;
  isLoading: boolean;
  error: string | null;
  lastFetchTime: number | null;
  
  // Actions
  fetchOverview: (force?: boolean) => Promise<void>;
  clearError: () => void;
}

export const useDashboardStore = create<DashboardState>()(
  persist(
    (set, get) => ({
      overview: null,
      metadata: null,
      isLoading: false,
      error: null,
      lastFetchTime: null,

      // Fetch dashboard overview
      fetchOverview: async (force = false) => {
        const state = get();
        
        // Prevent duplicate calls within 5 seconds
        if (!force && state.isLoading) {
          return;
        }
        
        // Use cached data if it's less than 30 seconds old
        if (!force && state.lastFetchTime && (Date.now() - state.lastFetchTime < 30000)) {
          return;
        }
        
        set({ isLoading: true, error: null });
        
        try {
          const response = await fetch('/api/alpha-dashboard/overview', {
            credentials: 'include',
            cache: 'no-cache',
          });
          
          const data = await response.json();
          
          if (!response.ok) {
            throw new Error(data.message || data.error || "Failed to fetch dashboard overview");
          }
          
          set({ 
            overview: data.overview,
            metadata: data.metadata,
            isLoading: false,
            lastFetchTime: Date.now(),
          });
        } catch (err: any) {
          console.error('Dashboard fetch error:', err);
          set({ 
            error: err.message || "Failed to fetch dashboard overview", 
            isLoading: false 
          });
        }
      },

      // Clear error
      clearError: () => set({ error: null }),
    }),
    {
      name: 'dashboard-storage',
      storage: createJSONStorage(() => {
        // Only use localStorage in browser environment
        if (typeof window !== 'undefined') {
          return localStorage;
        }
        // Return a no-op storage for SSR
        return {
          getItem: () => null,
          setItem: () => {},
          removeItem: () => {},
        };
      }),
      partialize: (state) => ({ 
        overview: state.overview,
        metadata: state.metadata,
        // Don't persist lastFetchTime, isLoading, or error
      }),
      skipHydration: true, // Skip hydration during SSR
    }
  )
);

