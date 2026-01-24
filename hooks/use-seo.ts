"use client";

import { useSEOStore } from "@/context/seoStore";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

/**
 * Custom hook for SEO operations
 * Provides convenient methods for SEO analysis management
 */
export function useSEO() {
  const router = useRouter();
  const {
    analyses,
    currentAnalysis,
    pagination,
    isLoading,
    isCreating,
    isFetchingDetail,
    error,
    fetchAnalyses,
    fetchAnalysisById,
    createAnalysis,
    clearError,
    clearCurrentAnalysis,
  } = useSEOStore();

  /**
   * Create a new SEO analysis and redirect to list
   */
  const handleCreateAnalysis = async (url: string) => {
    try {
      const analysis = await createAnalysis(url);
      toast.success("SEO Analysis created successfully!");
      
      // Redirect to list page
      const locale = window.location.pathname.split("/")[1];
      router.push(`/${locale}/dashboard/seo/list`);
      
      return analysis;
    } catch (err: any) {
      toast.error(err.message || "Failed to create SEO analysis");
      throw err;
    }
  };

  /**
   * Navigate to analysis detail page
   */
  const navigateToAnalysis = (id: string) => {
    const locale = window.location.pathname.split("/")[1];
    router.push(`/${locale}/dashboard/seo/${id}`);
  };

  /**
   * Navigate to create page
   */
  const navigateToCreate = () => {
    const locale = window.location.pathname.split("/")[1];
    router.push(`/${locale}/dashboard/seo/create`);
  };

  /**
   * Navigate to list page
   */
  const navigateToList = () => {
    const locale = window.location.pathname.split("/")[1];
    router.push(`/${locale}/dashboard/seo/list`);
  };

  /**
   * Load analysis by ID with error handling
   */
  const loadAnalysis = async (id: string) => {
    try {
      await fetchAnalysisById(id);
    } catch (err: any) {
      toast.error(err.message || "Failed to load SEO analysis");
      throw err;
    }
  };

  /**
   * Load analyses list with error handling
   */
  const loadAnalyses = async (page = 1, limit = 20, url?: string, silent = false) => {
    try {
      await fetchAnalyses(page, limit, url, silent);
    } catch (err: any) {
      if (!silent) {
        toast.error(err.message || "Failed to load SEO analyses");
      }
      throw err;
    }
  };

  return {
    // Data
    analyses,
    currentAnalysis,
    pagination,

    // Loading states
    isLoading,
    isCreating,
    isFetchingDetail,
    error,

    // Actions
    handleCreateAnalysis,
    loadAnalysis,
    loadAnalyses,
    navigateToAnalysis,
    navigateToCreate,
    navigateToList,
    clearError,
    clearCurrentAnalysis,
  };
}
