"use client";

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// Define subscription types based on API response
export type SubscriptionFeatures = {
  countryTargeting: string;
  trafficSources: string;
  behaviorSettings: string;
  campaignRenewal: string;
  support: string;
  analytics: string;
};

export type Subscription = {
  planName: string;
  status: string;
  visitsIncluded: number;
  visitsUsed: number;
  campaignLimit: number;
  currentCampaignCount: number;
  features: SubscriptionFeatures;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  stripeSubscriptionId?: string;
  stripeCustomerId?: string;
};

export type SubscriptionPlan = {
  planName: string;
  visitsIncluded: number;
  campaignLimit: number;
  price: number;
  features: SubscriptionFeatures;
  description: string;
  recommended?: boolean;
};

// Define subscription store type
interface SubscriptionState {
  subscription: Subscription | null;
  plans: SubscriptionPlan[];
  isLoading: boolean;
  isPlansLoading: boolean;
  error: string | null;
  lastFetchTime: number | null;
  
  // Actions
  fetchSubscription: (force?: boolean) => Promise<void>;
  fetchPlans: () => Promise<void>;
  createCheckoutSession: (planName: string, successUrl?: string, cancelUrl?: string) => Promise<string>;
  upgradeSubscription: (planName: string) => Promise<void>;
  cancelSubscription: (cancelAtPeriodEnd: boolean) => Promise<void>;
  reactivateSubscription: () => Promise<void>;
  canCreateCampaign: () => boolean;
  getUpgradeRecommendation: () => string | null;
  clearError: () => void;
}

export const useSubscriptionStore = create<SubscriptionState>()(
  persist(
    (set: any, get: any) => ({
      subscription: null,
      plans: [],
      isLoading: false,
      isPlansLoading: false,
      error: null,
      lastFetchTime: null,

      // Fetch current subscription
      fetchSubscription: async (force = false) => {
        const state = get();
        
        // Prevent duplicate calls within 10 seconds
        if (!force && state.isLoading) {
          return;
        }
        
        // Use cached data if it's less than 30 seconds old
        if (!force && state.lastFetchTime && (Date.now() - state.lastFetchTime < 30000)) {
          return;
        }
        
        set({ isLoading: true, error: null });
        
        try {
          const response = await fetch('/api/subscription/subscription', {
            credentials: 'include',
            cache: 'no-cache',
          });
          
          const data = await response.json();
          
          if (!response.ok) {
            throw new Error(data.error || 'Failed to fetch subscription');
          }
          
          set({ 
            subscription: data.subscription,
            isLoading: false,
            lastFetchTime: Date.now()
          });
        } catch (error: any) {
          set({ 
            error: error.message || 'Failed to fetch subscription',
            isLoading: false 
          });
          console.error('Error fetching subscription:', error);
        }
      },

      // Fetch all available plans
      fetchPlans: async () => {
        set({ isPlansLoading: true, error: null });
        
        try {
          const response = await fetch('/api/subscription/plans', {
            cache: 'no-cache',
          });
          
          const data = await response.json();
          
          if (!response.ok) {
            throw new Error(data.error || 'Failed to fetch plans');
          }
          
          set({ 
            plans: data.plans,
            isPlansLoading: false 
          });
        } catch (error: any) {
          set({ 
            error: error.message || 'Failed to fetch plans',
            isPlansLoading: false 
          });
          console.error('Error fetching plans:', error);
        }
      },

      // Create checkout session for upgrade
      createCheckoutSession: async (planName: string, successUrl?: string, cancelUrl?: string) => {
        set({ isLoading: true, error: null });
        
        try {
          const origin = typeof window !== 'undefined' ? window.location.origin : '';
          
          const response = await fetch('/api/subscription/checkout', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({
              planName,
              successUrl: successUrl || `${origin}/dashboard/profile?subscription=success`,
              cancelUrl: cancelUrl || `${origin}/dashboard/profile?subscription=canceled`,
            }),
          });
          
          const data = await response.json();
          
          if (!response.ok) {
            throw new Error(data.error || 'Failed to create checkout session');
          }
          
          set({ isLoading: false });
          
          return data.url;
        } catch (error: any) {
          set({ 
            error: error.message || 'Failed to create checkout session',
            isLoading: false 
          });
          console.error('Error creating checkout session:', error);
          throw error;
        }
      },

      // Upgrade existing subscription
      upgradeSubscription: async (planName: string) => {
        set({ isLoading: true, error: null });
        
        try {
          const response = await fetch('/api/subscription/upgrade', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ planName }),
          });
          
          const data = await response.json();
          
          if (!response.ok) {
            throw new Error(data.error || 'Failed to upgrade subscription');
          }
          
          set({ 
            subscription: data.subscription,
            isLoading: false,
            lastFetchTime: Date.now()
          });
        } catch (error: any) {
          set({ 
            error: error.message || 'Failed to upgrade subscription',
            isLoading: false 
          });
          console.error('Error upgrading subscription:', error);
          throw error;
        }
      },

      // Cancel subscription
      cancelSubscription: async (cancelAtPeriodEnd: boolean = true) => {
        set({ isLoading: true, error: null });
        
        try {
          const response = await fetch('/api/subscription/cancel', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ cancelAtPeriodEnd }),
          });
          
          const data = await response.json();
          
          if (!response.ok) {
            throw new Error(data.error || 'Failed to cancel subscription');
          }
          
          set({ 
            subscription: data.subscription,
            isLoading: false,
            lastFetchTime: Date.now()
          });
        } catch (error: any) {
          set({ 
            error: error.message || 'Failed to cancel subscription',
            isLoading: false 
          });
          console.error('Error canceling subscription:', error);
          throw error;
        }
      },

      // Reactivate canceled subscription
      reactivateSubscription: async () => {
        set({ isLoading: true, error: null });
        
        try {
          const response = await fetch('/api/subscription/reactivate', {
            method: 'POST',
            credentials: 'include',
          });
          
          const data = await response.json();
          
          if (!response.ok) {
            throw new Error(data.error || 'Failed to reactivate subscription');
          }
          
          set({ 
            subscription: data.subscription,
            isLoading: false,
            lastFetchTime: Date.now()
          });
        } catch (error: any) {
          set({ 
            error: error.message || 'Failed to reactivate subscription',
            isLoading: false 
          });
          console.error('Error reactivating subscription:', error);
          throw error;
        }
      },

      // Check if user can create a campaign
      canCreateCampaign: () => {
        const { subscription } = get();
        if (!subscription) return false;
        return subscription.currentCampaignCount < subscription.campaignLimit;
      },

      // Get upgrade recommendation
      getUpgradeRecommendation: () => {
        const { subscription } = get();
        if (!subscription) return null;
        
        const planOrder = ['free', 'starter', 'growth', 'business', 'premium'];
        const currentIndex = planOrder.indexOf(subscription.planName);
        
        if (currentIndex < planOrder.length - 1) {
          return planOrder[currentIndex + 1];
        }
        return null;
      },

      // Clear error
      clearError: () => set({ error: null }),
    }),
    {
      name: 'subscription-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state: any) => ({
        subscription: state.subscription,
        plans: state.plans,
        lastFetchTime: state.lastFetchTime,
      }),
    }
  )
);
