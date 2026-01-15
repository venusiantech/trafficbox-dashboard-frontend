"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Icon } from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import { useNotificationStore, Notification } from "@/context/notificationStore";
import { formatDistanceToNow } from "date-fns";
import Loader from "@/components/loader";
import { toast } from "sonner";

export default function NotificationsPage() {
  const {
    notifications,
    pagination,
    isLoading,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
  } = useNotificationStore();

  useEffect(() => {
    // Fetch all notifications and mark them as read automatically
    const loadNotifications = async () => {
      await fetchNotifications(1, 50);
      // Automatically mark all as read when page opens
      const unreadNotifications = notifications.filter(n => !n.isRead);
      if (unreadNotifications.length > 0) {
        await markAllAsRead();
      }
    };
    
    loadNotifications();
  }, []);

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await markAsRead(notificationId);
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  const getNotificationIcon = (type: string) => {
    const iconMap: { [key: string]: { icon: string; bgColor: string; iconColor: string } } = {
      contact_us_submitted: { 
        icon: "heroicons:envelope", 
        bgColor: " dark:bg-blue-900/30", 
        iconColor: "text-blue-600 dark:text-blue-400" 
      },
      custom_plan_request_submitted: { 
        icon: "heroicons:document-text", 
        bgColor: " dark:bg-purple-900/30", 
        iconColor: "text-purple-600 dark:text-purple-400" 
      },
      custom_plan_request_approved: { 
        icon: "heroicons:check-circle", 
        bgColor: "dark:bg-green-900/30", 
        iconColor: "text-green-600 dark:text-green-400" 
      },
      custom_plan_request_rejected: { 
        icon: "heroicons:x-circle", 
        bgColor: " dark:bg-red-900/30", 
        iconColor: "text-red-600 dark:text-red-400" 
      },
      subscription_upgraded: { 
        icon: "heroicons:arrow-trending-up", 
        bgColor: " dark:bg-emerald-900/30", 
        iconColor: "text-emerald-600 dark:text-emerald-400" 
      },
      subscription_cancelled: { 
        icon: "heroicons:x-mark", 
        bgColor: " dark:bg-orange-900/30", 
        iconColor: "text-orange-600 dark:text-orange-400" 
      },
      campaign_created: { 
        icon: "heroicons:sparkles", 
        bgColor: " dark:bg-indigo-900/30", 
        iconColor: "text-indigo-600 dark:text-indigo-400" 
      },
      campaign_paused: { 
        icon: "heroicons:pause-circle", 
        bgColor: " dark:bg-amber-900/30", 
        iconColor: "text-amber-600 dark:text-amber-400" 
      },
      campaign_completed: { 
        icon: "heroicons:check-badge", 
        bgColor: " dark:bg-teal-900/30", 
        iconColor: "text-teal-600 dark:text-teal-400" 
      },
    };
    return iconMap[type] || { 
      icon: "heroicons:bell", 
      bgColor: "bg-gray-100 dark:bg-gray-900/30", 
      iconColor: "text-gray-600 dark:text-gray-400" 
    };
  };

  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch {
      return dateString;
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-medium text-default-800 capitalize ml-2 ">Notifications</h1>
          <p className="text-muted-foreground mt-1 ml-2">
            Stay updated with all your account activities
          </p>
        </div>
        {notifications.length > 0 && (
          <Badge color="secondary" className="text-sm px-3 py-1 mr-2">
            {pagination?.total || notifications.length} Total
          </Badge>
        )}
      </div>

      <Card className="bg-card border border-border">
        <CardContent className="p-6">

          {/* Notifications List */}
          <div className="space-y-3">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-primary/10 rounded-full blur-2xl" />
                  <div className="relative h-20 w-20 rounded-full bg-muted flex items-center justify-center">
                    <Icon icon="heroicons:bell-slash" className="w-10 h-10 text-muted-foreground" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-2">No notifications</h3>
                <p className="text-sm text-muted-foreground max-w-sm">
                  You don't have any notifications yet. We'll notify you when something important happens.
                </p>
              </div>
            ) : (
              notifications.map((notification) => {
                const iconInfo = getNotificationIcon(notification.type);
                return (
                  <div
                    key={notification._id}
                    className="group relative rounded-lg border p-4 transition-all hover:shadow-md bg-card hover:bg-muted/50"
                  >
                    <div className="flex items-start gap-4">
                      {/* Icon */}
                      <div className={`flex-none ${iconInfo.bgColor} h-12 w-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110`}>
                        <Icon icon={iconInfo.icon} className={`w-6 h-6 ${iconInfo.iconColor}`} />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h4 className="font-semibold text-base leading-tight">
                            {notification.title}
                          </h4>
                          <span className="text-xs text-muted-foreground whitespace-nowrap flex items-center gap-1">
                            <Icon icon="heroicons:clock" className="w-3 h-3" />
                            {formatDate(notification.createdAt)}
                          </span>
                        </div>
                        
                        <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
                          {notification.message}
                        </p>
                        
                        {/* <Badge variant="secondary" className="text-xs font-normal capitalize">
                          {notification.type.replace(/_/g, " ")}
                        </Badge> */}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

