"use client";

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// Define notification types based on API response
export type NotificationType = 
  | 'contact_us_submitted' 
  | 'custom_plan_request_submitted'
  | 'custom_plan_request_approved'
  | 'custom_plan_request_rejected'
  | 'custom_plan_assigned_payment_pending'
  | 'subscription_upgraded'
  | 'subscription_cancelled'
  | 'campaign_created'
  | 'campaign_paused'
  | 'campaign_completed';

export type Notification = {
  _id: string;
  user: string;
  type: NotificationType;
  title: string;
  message: string;
  relatedId?: string;
  relatedModel?: string;
  actionUrl?: string;
  actionLabel?: string;
  metadata?: {
    amount?: number;
    currency?: string;
    visitsIncluded?: number;
    campaignLimit?: number;
    durationDays?: number;
    checkoutSessionId?: string;
    paymentLinkId?: string;
  };
  isRead: boolean;
  readAt?: string;
  createdAt: string;
  updatedAt: string;
};

export type NotificationPagination = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

// Define notification store type
interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  pagination: NotificationPagination | null;
  isLoading: boolean;
  error: string | null;
  lastFetchTime: number | null;
  
  // Actions
  fetchNotifications: (page?: number, limit?: number, isRead?: boolean) => Promise<void>;
  fetchUnreadCount: () => Promise<void>;
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  clearError: () => void;
  clearNotifications: () => void;
}

export const useNotificationStore = create<NotificationState>()(
  persist<NotificationState>(
    (set, get) => ({
      notifications: [],
      unreadCount: 0,
      pagination: null,
      isLoading: false,
      error: null,
      lastFetchTime: null,

      // Fetch notifications
      fetchNotifications: async (page = 1, limit = 20, isRead?: boolean) => {
        set({ isLoading: true, error: null });
        
        try {
          const params = new URLSearchParams({
            page: page.toString(),
            limit: limit.toString(),
          });
          
          if (isRead !== undefined) {
            params.append('isRead', isRead.toString());
          }

          const response = await fetch(`/api/notifications?${params.toString()}`, {
            credentials: 'include',
            cache: 'no-store',
          });
          
          const data = await response.json();
          
          if (!response.ok) {
            throw new Error(data.error || 'Failed to fetch notifications');
          }
          
          set({ 
            notifications: data.notifications || [],
            unreadCount: data.unreadCount || 0,
            pagination: data.pagination || null,
            isLoading: false,
            lastFetchTime: Date.now()
          });
        } catch (error: any) {
          set({ 
            error: error.message || 'Failed to fetch notifications',
            isLoading: false 
          });
          console.error('Error fetching notifications:', error);
        }
      },

      // Fetch unread count
      fetchUnreadCount: async () => {
        try {
          const response = await fetch('/api/notifications/unread-count', {
            credentials: 'include',
            cache: 'no-store',
          });
          
          const data = await response.json();
          
          if (!response.ok) {
            throw new Error(data.error || 'Failed to fetch unread count');
          }
          
          set({ unreadCount: data.unreadCount || 0 });
        } catch (error: any) {
          console.error('Error fetching unread count:', error);
        }
      },

      // Mark notification as read
      markAsRead: async (notificationId: string) => {
        try {
          const response = await fetch(`/api/notifications/${notificationId}/read`, {
            method: 'PUT',
            credentials: 'include',
          });
          
          const data = await response.json();
          
          if (!response.ok) {
            throw new Error(data.error || 'Failed to mark notification as read');
          }
          
          // Update local state
          const { notifications, unreadCount } = get();
          const updatedNotifications = notifications.map(notif => 
            notif._id === notificationId 
              ? { ...notif, isRead: true, readAt: data.notification.readAt }
              : notif
          );
          
          set({ 
            notifications: updatedNotifications,
            unreadCount: Math.max(0, unreadCount - 1)
          });
        } catch (error: any) {
          console.error('Error marking notification as read:', error);
          throw error;
        }
      },

      // Mark all notifications as read
      markAllAsRead: async () => {
        try {
          const response = await fetch('/api/notifications/read-all', {
            method: 'PUT',
            credentials: 'include',
          });
          
          const data = await response.json();
          
          if (!response.ok) {
            throw new Error(data.error || 'Failed to mark all notifications as read');
          }
          
          // Update local state
          const { notifications } = get();
          const updatedNotifications = notifications.map(notif => 
            ({ ...notif, isRead: true, readAt: new Date().toISOString() })
          );
          
          set({ 
            notifications: updatedNotifications,
            unreadCount: 0
          });
        } catch (error: any) {
          console.error('Error marking all notifications as read:', error);
          throw error;
        }
      },

      // Clear error
      clearError: () => set({ error: null }),

      // Clear notifications data (for logout)
      clearNotifications: () => set({ 
        notifications: [],
        unreadCount: 0,
        pagination: null,
        error: null,
        lastFetchTime: null 
      }),
    }),
    {
      name: 'notification-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
