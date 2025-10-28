"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";

export type RecentActivityData = {
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
}

interface RecentActivityProps {
  activities?: RecentActivityData[];
}

const getInitials = (name: string) => {
  const words = name.split(' ');
  return words.length > 1 
    ? `${words[0][0]}${words[1][0]}`.toUpperCase()
    : name.substring(0, 2).toUpperCase();
}

const RecentActivity = ({ activities = [] }: RecentActivityProps) => {
  if (activities.length === 0) {
    return (
      <div className="text-center py-8 text-default-600">
        No recent activity
      </div>
    );
  }

  return (
    <ul className="space-y-3 h-full max-h-[550px] overflow-y-auto">
      {activities.map((item) => (
        <li
          className="flex items-center gap-3 border-b border-default-100 dark:border-default-300 last:border-b-0 pb-3 last:pb-0"
          key={item._id}
        >
          <div className="flex-1 text-start overflow-hidden">
            <div className="text-sm text-default-900 font-medium overflow-hidden text-ellipsis whitespace-nowrap">
              {item.campaign.title}
            </div>
            <div className="text-xs text-default-600">
              {item.hits} hits • {item.visits} visits
            </div>
          </div>
          <div className="flex-none">
            <div className="text-xs font-light text-default-400 dark:text-default-600">
              {formatDistanceToNow(new Date(item.timestamp), { addSuffix: true })}
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default RecentActivity;