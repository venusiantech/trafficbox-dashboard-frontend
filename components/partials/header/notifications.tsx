"use client";

import { useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Link } from '@/i18n/routing';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Icon } from "@/components/ui/icon";
import { useNotificationStore } from "@/context/notificationStore";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";

const Notifications = () => {
    const { 
        notifications, 
        unreadCount, 
        isLoading,
        fetchNotifications,
        fetchUnreadCount,
        markAsRead,
        markAllAsRead 
    } = useNotificationStore();

    useEffect(() => {
        // Fetch notifications on mount
        fetchNotifications(1, 10);
        
        // Poll for unread count every 30 seconds
        const interval = setInterval(() => {
            fetchUnreadCount();
        }, 30000);

        return () => clearInterval(interval);
    }, []);

    const handleNotificationClick = async (notificationId: string, isRead: boolean) => {
        if (!isRead) {
            try {
                await markAsRead(notificationId);
            } catch (error) {
                console.error("Failed to mark notification as read:", error);
            }
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            await markAllAsRead();
        } catch (error) {
            console.error("Failed to mark all as read:", error);
        }
    };

  const getNotificationIcon = (type: string) => {
    const iconMap: { [key: string]: string } = {
      contact_us_submitted: "heroicons:envelope",
      custom_plan_request_submitted: "heroicons:document-text",
      custom_plan_request_approved: "heroicons:check-circle",
      custom_plan_request_rejected: "heroicons:x-circle",
      custom_plan_assigned_payment_pending: "heroicons:credit-card",
      subscription_upgraded: "heroicons:arrow-trending-up",
      subscription_cancelled: "heroicons:x-mark",
      campaign_created: "heroicons:sparkles",
      campaign_paused: "heroicons:pause",
      campaign_completed: "heroicons:check-badge",
    };
    return iconMap[type] || "heroicons:bell";
  };

    const formatDate = (dateString: string) => {
        try {
            return formatDistanceToNow(new Date(dateString), { addSuffix: true });
        } catch {
            return dateString;
        }
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button type="button" className="relative hidden focus:ring-none focus:outline-hidden md:h-8 md:w-8 md:bg-secondary text-secondary-foreground rounded-full md:flex flex-col items-center justify-center cursor-pointer">
                    <Icon icon="heroicons-outline:bell" className="animate-tada h-5 w-5" />
                    {unreadCount > 0 && (
                        <Badge className="w-4 h-4 p-0 text-[8px] rounded-full font-semibold items-center justify-center absolute left-[calc(100%-12px)] bottom-[calc(100%-10px)]" color="destructive">
                            {unreadCount > 9 ? '9+' : unreadCount}
                        </Badge>
                    )}
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                align="end"
                className="z-999 mx-4 lg:w-[380px] p-0">
                <DropdownMenuLabel>
                    <div className="flex justify-between items-center px-4 py-3 border-b border-default-100">
                        <div className="text-sm text-default-800 font-medium">
                            Notifications
                        </div>
                        <div className="flex items-center gap-2">
                            {unreadCount > 0 && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={handleMarkAllAsRead}
                                    className="text-xs h-auto py-1 px-2"
                                >
                                    Mark all read
                                </Button>
                            )}
                            <Link href="/dashboard/notifications" className="text-xs text-primary underline">
                                View all
                            </Link>
                        </div>
                    </div>
                </DropdownMenuLabel>
                <div className="h-[300px] xl:h-[400px]">
                    <ScrollArea className="h-full">
                        {isLoading ? (
                            <div className="flex items-center justify-center h-full">
                                <Icon icon="heroicons:arrow-path" className="w-6 h-6 animate-spin text-muted-foreground" />
                            </div>
                        ) : notifications.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-center p-4">
                                <Icon icon="heroicons:bell-slash" className="w-12 h-12 text-muted-foreground mb-2" />
                                <p className="text-sm text-muted-foreground">No notifications yet</p>
                            </div>
                        ) : (
                            notifications.map((item) => (
                                <DropdownMenuItem
                                    key={item._id}
                                    onClick={() => handleNotificationClick(item._id, item.isRead)}
                                    className={`flex gap-3 py-3 px-4 cursor-pointer group ${
                                        !item.isRead ? 'bg-muted/50' : ''
                                    }`}
                                >
                                    <div className="flex items-start gap-3 flex-1">
                                        <div className="flex-none">
                                            <Avatar className="h-9 w-9">
                                                <AvatarFallback className="bg-primary/10">
                                                    <Icon 
                                                        icon={getNotificationIcon(item.type)} 
                                                        className="w-5 h-5 text-primary" 
                                                    />
                                                </AvatarFallback>
                                            </Avatar>
                                        </div>
                                        <div className="flex-1 flex flex-col gap-1 min-w-0">
                                            <div className="text-sm text-default-700 dark:group-hover:text-default-900 font-medium line-clamp-1">
                                                {item.title}
                                            </div>
                                            <div className="text-xs text-default-600 dark:group-hover:text-default-700 font-normal line-clamp-2 whitespace-pre-line">
                                                {item.message}
                                            </div>
                                            {item.actionUrl && item.actionLabel && (
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        window.open(item.actionUrl, '_blank');
                                                    }}
                                                    className="text-xs text-primary hover:underline text-left flex items-center gap-1 mt-1"
                                                >
                                                    <Icon icon="heroicons:arrow-top-right-on-square" className="w-3 h-3" />
                                                    {item.actionLabel}
                                                </button>
                                            )}
                                            <div className="text-default-400 dark:group-hover:text-default-500 text-xs">
                                                {formatDate(item.createdAt)}
                                            </div>
                                        </div>
                                    </div>
                                    {!item.isRead && (
                                        <div className="flex-none">
                                            <span className="h-[10px] w-[10px] bg-primary border border-primary-foreground rounded-full inline-block" />
                                        </div>
                                    )}
                                </DropdownMenuItem>
                            ))
                        )}
                    </ScrollArea>
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default Notifications;
