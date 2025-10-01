"use client";

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { backendURL } from '@/config';

// Define campaign types based on API responses
export type Campaign = {
  _id: string;
  id: string;
  user: string;
  title: string;
  urls: string[];
  duration_min?: number;
  duration_max?: number;
  countries?: string[];
  rule?: string;
  capping_type?: string;
  capping_value?: number;
  max_hits?: number;
  until_date?: string;
  macros?: string;
  popup_macros?: string;
  is_adult: boolean;
  is_coin_mining: boolean;
  state: string;
  spark_traffic_project_id?: string;
  spark_traffic_data?: any;
  is_archived: boolean;
  archived_at?: string;
  delete_eligible: boolean;
  last_sync_at?: string;
  metadata?: any;
  createdAt: string;
  updatedAt: string;
  credit_deduction_enabled?: boolean;
  last_stats_check?: string;
  total_hits_counted?: number;
  total_visits_counted?: number;
  vendorStats?: {
    hits?: any[];
    visits?: any[];
    totalHits?: number;
    totalVisits?: number;
    speed?: number;
  };
  status?: string;
  stats?: {
    totalHits: number;
    totalVisits: number;
    speed: number;
    status: string;
    dailyHits: Array<{ [key: string]: number }>;
    dailyVisits: Array<{ [key: string]: number }>;
  };
};

// Define campaign creation data type
export type CampaignCreateData = {
  url: string;
  title: string;
  urls: string[];
  keywords: string;
  referrers: {
    mode: string;
    urls: string[];
  };
  languages: string;
  bounce_rate: number;
  return_rate: number;
  click_outbound_events: number;
  form_submit_events: number;
  scroll_events: number;
  time_on_page: string;
  desktop_rate: number;
  auto_renew: string;
  geo_type: string;
  geo: { codes: string[] };
  shortener: string;
  rss_feed: string;
  ga_id: string;
  size: string;
  speed: number;
};

// Define campaign store type
interface CampaignState {
  campaigns: Campaign[];
  archivedCampaigns: Campaign[];
  currentCampaign: Campaign | null;
  isLoading: boolean;
  isArchivedLoading: boolean;
  error: string | null;
  
  // Actions
  fetchCampaigns: () => Promise<void>;
  fetchArchivedCampaigns: () => Promise<void>;
  fetchCampaign: (id: string) => Promise<void>;
  createCampaign: (campaignData: CampaignCreateData) => Promise<Campaign>;
  pauseCampaign: (id: string) => Promise<void>;
  resumeCampaign: (id: string) => Promise<void>;
  deleteCampaign: (id: string) => Promise<void>;
  clearError: () => void;
}

export const useCampaignStore = create<CampaignState>()(
  persist(
    (set, get) => ({
      campaigns: [],
      archivedCampaigns: [],
      currentCampaign: null,
      isLoading: false,
      isArchivedLoading: false,
      error: null,

      // Fetch all campaigns
      fetchCampaigns: async () => {
        set({ isLoading: true, error: null });
        
        try {
          const response = await fetch(`/api/campaigns`, {
            credentials: 'include',
          });
          
          const data = await response.json();
          
          if (!response.ok) {
            throw new Error(data.message || "Failed to fetch campaigns");
          }
          
          set({ 
            campaigns: data.campaigns || (data.campaign ? [data.campaign] : []),
            isLoading: false 
          });
        } catch (err: any) {
          set({ error: err.message || "Failed to fetch campaigns", isLoading: false });
        }
      },

      // Fetch archived campaigns
      fetchArchivedCampaigns: async () => {
        set({ isArchivedLoading: true, error: null });
        
        try {
          const response = await fetch('/api/campaigns/archived', {
            credentials: 'include',
          });
          
          const data = await response.json();
          
          if (!response.ok) {
            throw new Error(data.message || "Failed to fetch archived campaigns");
          }
          
          set({ 
            archivedCampaigns: data.campaigns || [],
            isArchivedLoading: false 
          });
        } catch (err: any) {
          set({ error: err.message || "Failed to fetch archived campaigns", isArchivedLoading: false });
        }
      },

      // Fetch single campaign by ID
      fetchCampaign: async (id: string) => {
        set({ isLoading: true, error: null });
        
        try {
          const response = await fetch(`/api/campaigns/${id}`, {
            credentials: 'include',
          });
          
          const data = await response.json();
          
          if (!response.ok) {
            throw new Error(data.message || "Failed to fetch campaign");
          }
          
          set({ 
            currentCampaign: data.campaign || (data.id ? data : null),
            isLoading: false 
          });
        } catch (err: any) {
          set({ error: err.message || "Failed to fetch campaign", isLoading: false });
        }
      },

      // Create new campaign
      createCampaign: async (campaignData: CampaignCreateData) => {
        set({ isLoading: true, error: null });
        
        try {
          const response = await fetch(`/api/campaigns`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: 'include',
            body: JSON.stringify(campaignData),
          });
          
          const data = await response.json();
          
          if (!response.ok) {
            throw new Error(data.message || "Failed to create campaign");
          }
          
          const campaign = data.campaign || (data.id ? data : null);
          
          if (!campaign) {
            throw new Error("Failed to create campaign: No campaign data returned");
          }
          
          // Add new campaign to list
          set(state => ({ 
            campaigns: [campaign, ...state.campaigns],
            currentCampaign: campaign,
            isLoading: false 
          }));
          
          return campaign;
        } catch (err: any) {
          set({ error: err.message || "Failed to create campaign", isLoading: false });
          throw err;
        }
      },

      // Pause campaign
      pauseCampaign: async (id: string) => {
        set({ isLoading: true, error: null });
        
        try {
          const response = await fetch(`/api/campaigns/${id}/pause`, {
            method: "POST",
            credentials: 'include',
          });
          
          const data = await response.json();
          
          if (!response.ok) {
            throw new Error(data.message || "Failed to pause campaign");
          }
          
          const updatedCampaign = data.campaign || (data.id ? data : null);
          
          // Update campaign in list and current campaign if it's the same
          set(state => ({
            campaigns: state.campaigns.map(campaign => 
              campaign.id === id ? 
                updatedCampaign || { ...campaign, state: 'paused', is_archived: true } 
                : campaign
            ),
            currentCampaign: state.currentCampaign?.id === id ? 
              updatedCampaign || { ...state.currentCampaign, state: 'paused', is_archived: true } 
              : state.currentCampaign,
            isLoading: false
          }));
        } catch (err: any) {
          set({ error: err.message || "Failed to pause campaign", isLoading: false });
        }
      },

      // Resume campaign
      resumeCampaign: async (id: string) => {
        set({ isLoading: true, error: null });
        
        try {
          const response = await fetch(`/api/campaigns/${id}/resume`, {
            method: "POST",
            credentials: 'include',
          });
          
          const data = await response.json();
          
          if (!response.ok) {
            throw new Error(data.message || "Failed to resume campaign");
          }
          
          const updatedCampaign = data.campaign || (data.id ? data : null);
          
          set((state) => ({
            campaigns: state.campaigns.map(campaign => 
              campaign.id === id ? 
                updatedCampaign || { ...campaign, state: 'active' } 
                : campaign
            ),
            currentCampaign: state.currentCampaign?.id === id ? 
              updatedCampaign || { ...state.currentCampaign, state: 'active' } 
              : state.currentCampaign,
            isLoading: false
          }));
        } catch (err: any) {
          set({ error: err.message || "Failed to resume campaign", isLoading: false });
        }
      },

      // Delete campaign
      deleteCampaign: async (id: string) => {
        set({ isLoading: true, error: null });
        
        try {
          const response = await fetch(`/api/campaigns/${id}`, {
            method: "DELETE",
            credentials: 'include',
          });
          
          const data = await response.json();
          
          if (!response.ok) {
            throw new Error(data.message || "Failed to delete campaign");
          }
          
          const updatedCampaign = data.campaign || (data.id ? data : null);
          
          // Update campaign in list and current campaign if it's the same
          set(state => ({
            campaigns: state.campaigns.map(campaign => 
              campaign.id === id ? 
                updatedCampaign || { ...campaign, state: 'archived', is_archived: true } 
                : campaign
            ),
            currentCampaign: state.currentCampaign?.id === id ? 
              updatedCampaign || { ...state.currentCampaign, state: 'archived', is_archived: true } 
              : state.currentCampaign,
            isLoading: false
          }));
        } catch (err: any) {
          set({ error: err.message || "Failed to delete campaign", isLoading: false });
        }
      },

      // Clear error
      clearError: () => set({ error: null }),
    }),
    {
      name: 'campaign-storage', // name of the item in storage
      storage: createJSONStorage(() => localStorage), // use localStorage
      partialize: (state) => ({ campaigns: state.campaigns }), // only persist campaigns data
    }
  )
);
