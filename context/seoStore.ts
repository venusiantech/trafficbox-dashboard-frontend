"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { SEOAnalysisResponse, SEOAnalysisData } from "@/components/seo/types";

// SEO Analysis list item type
export interface SEOAnalysisListItem {
  _id: string;
  id: string;
  url: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  totalScore?: number;
  grade?: string;
}

// Pagination type
export interface Pagination {
  currentPage: number;
  totalPages: number;
  totalResults: number;
  limit: number;
}

// SEO Store State
interface SEOState {
  // Data
  analyses: SEOAnalysisListItem[];
  currentAnalysis: SEOAnalysisData | null;
  pagination: Pagination | null;

  // Loading states
  isLoading: boolean;
  isCreating: boolean;
  isFetchingDetail: boolean;
  error: string | null;

  // Actions
  fetchAnalyses: (page?: number, limit?: number, url?: string, silent?: boolean) => Promise<void>;
  fetchAnalysisById: (id: string) => Promise<void>;
  createAnalysis: (url: string) => Promise<SEOAnalysisListItem>;
  clearError: () => void;
  clearCurrentAnalysis: () => void;
}

export const useSEOStore = create<SEOState>()(
  persist(
    (set, get) => ({
      // Initial state
      analyses: [],
      currentAnalysis: null,
      pagination: null,
      isLoading: false,
      isCreating: false,
      isFetchingDetail: false,
      error: null,

      // Fetch SEO analyses list
      fetchAnalyses: async (page = 1, limit = 20, url, silent = false) => {
        if (!silent) {
          set({ isLoading: true, error: null });
        }

        try {
          let queryString = `?page=${page}&limit=${limit}`;
          if (url) {
            queryString += `&url=${encodeURIComponent(url)}`;
          }

          const response = await fetch(`/api/seo/analysis${queryString}`, {
            credentials: "include",
            cache: "no-store",
          });

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.error || data.message || "Failed to fetch SEO analyses");
          }

          set({
            analyses: data.data || [],
            pagination: data.pagination || null,
            isLoading: false,
          });
        } catch (err: any) {
          if (!silent) {
            set({
              error: err.message || "Failed to fetch SEO analyses",
              isLoading: false,
            });
          }
        }
      },

      // Fetch single SEO analysis by ID
      fetchAnalysisById: async (id: string) => {
        set({ isFetchingDetail: true, error: null });

        try {
          const response = await fetch(`/api/seo/analysis/${id}`, {
            credentials: "include",
            cache: "no-store",
          });

          const result: SEOAnalysisResponse = await response.json();

          if (!response.ok) {
            throw new Error(result.error || "Failed to fetch SEO analysis");
          }

          if (result.status === "error") {
            throw new Error(result.error || "SEO analysis failed");
          }

          set({
            currentAnalysis: result.data,
            isFetchingDetail: false,
          });
        } catch (err: any) {
          set({
            error: err.message || "Failed to fetch SEO analysis",
            isFetchingDetail: false,
          });
        }
      },

      // Create new SEO analysis
      createAnalysis: async (url: string) => {
        set({ isCreating: true, error: null });

        try {
          const response = await fetch("/api/seo/analysis", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({ url }),
          });

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.error || "Failed to create SEO analysis");
          }

          // Add new analysis to list if it's returned
          if (data.data) {
            set((state) => ({
              analyses: [data.data, ...state.analyses],
              isCreating: false,
            }));
            return data.data;
          }

          set({ isCreating: false });
          throw new Error("Failed to create SEO analysis: No data returned");
        } catch (err: any) {
          set({
            error: err.message || "Failed to create SEO analysis",
            isCreating: false,
          });
          throw err;
        }
      },

      // Clear error
      clearError: () => {
        set({ error: null });
      },

      // Clear current analysis
      clearCurrentAnalysis: () => {
        set({ currentAnalysis: null });
      },
    }),
    {
      name: "seo-store",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        analyses: state.analyses,
        pagination: state.pagination,
        // Don't persist loading states or errors
      }),
    }
  )
);
