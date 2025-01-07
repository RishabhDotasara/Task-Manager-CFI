import { ScrollArea } from "@/components/ui/scroll-area";

import { Notification } from "@prisma/client";
import { Bell } from "lucide-react";
import { NotificationHeader } from "./NotificationHeader";
import { NotificationItem } from "./NotificationItem";

interface NotificationListProps {
  notifications: Notification[];
  onMarkAsRead: (id: number) => void;
  onMarkAllRead: () => void;
  refetch:Function,
  isLoadingNotification:boolean
}

export function NotificationList({ 
  notifications, 
  onMarkAsRead,
  onMarkAllRead,
  refetch,
  isLoadingNotification
}: NotificationListProps) {
  const unreadCount = notifications ? notifications.filter(n => !n.read).length  : 0;
  
  return (
    <div className="w-full max-w-md min-w-xl ">
      <NotificationHeader 
        unreadCount={unreadCount}
        onMarkAllRead={onMarkAllRead}
        refetch={refetch}
        isLoadingNotification={isLoadingNotification}
      />
      
      <ScrollArea className="h-[32rem] ">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-32 text-center p-4">
            <Bell className="h-8 w-8 text-muted-foreground/50 mb-2" />
            <p className="text-sm text-muted-foreground">No Unread notifications yet</p>
          </div>
        ) : (
          <div className="divide-y">
            {notifications.map((notification) => (
              <NotificationItem
                key={notification.notificationId}
                notification={notification}
                onMarkAsRead={onMarkAsRead}
              />
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}