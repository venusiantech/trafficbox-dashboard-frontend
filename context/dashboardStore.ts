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
  averageBounceRate: number;
  averageSessionDuration: number;
  topCountries: Array<{
    country: string;
    count: number;
    percentage: number;
  }>;
  recentActivity: Array<{
    _id: string;
    campaign: {
      _id: string;
      title: string;
    };
    timestamp: string;
    hits: number;
    visits: number;
    speed: number;
    projectStatus: string;
  }>;
  campaignPerformance: Array<{
    campaignId: string;
    title: string;
    sparkTrafficProjectId?: string;
    hits: number;
    visits: number;
    views: number;
    uniqueVisitors: number;
    speed: number;
    bounceRate: number;
    sessionDuration: number;
    lastUpdated: string;
    projectStatus: string;
  }>;
  timeRangeMetrics: {
    '15m': TimeRangeMetric;
    '1h': TimeRangeMetric;
    '7d': TimeRangeMetric;
    '30d': TimeRangeMetric;
  };
};

export type TimeRangeMetric = {
  totalHits: number;
  totalVisits: number;
  totalViews: number;
  uniqueVisitors: number;
  avgSpeed: number;
  avgBounceRate: number;
  lastUpdated: string;
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
  
  // Actions
  fetchOverview: () => Promise<void>;
  clearError: () => void;
}

export const useDashboardStore = create<DashboardState>()(
  persist(
    (set, get) => ({
      overview: null,
      metadata: null,
      isLoading: false,
      error: null,

      // Fetch dashboard overview
      fetchOverview: async () => {
        set({ isLoading: true, error: null });
        
        try {
          const response = await fetch('/api/alpha-dashboard/overview', {
            credentials: 'include',
          });
          
          const data = await response.json();
          
          if (!response.ok) {
            throw new Error(data.message || data.error || "Failed to fetch dashboard overview");
          }
          
          set({ 
            overview: data.overview,
            metadata: data.metadata,
            isLoading: false 
          });
        } catch (err: any) {
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
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ 
        overview: state.overview,
        metadata: state.metadata 
      }),
    }
  )
);

