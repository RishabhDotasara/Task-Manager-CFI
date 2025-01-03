import { ScrollArea } from "@/components/ui/scroll-area";
import { NotificationItem } from "./NotificationItem";
import { Notification } from "@prisma/client";


interface NotificationListProps {
  notifications: Notification[];
  onMarkAsRead: (id: number) => void;
}

export function NotificationList({ notifications, onMarkAsRead }: NotificationListProps) {
  const unreadCount = notifications.filter(n => !n.read).length;
  
  return (
    <div className="w-full max-w-sm">
      <div className="flex items-center justify-between px-4 py-2 border-b">
        <div>
          <h2 className="font-semibold">Notifications</h2>
          <p className="text-sm text-muted-foreground">
            You have {unreadCount} unread notifications
          </p>
        </div>
      </div>
      
      <ScrollArea className="h-[32rem]">
        {notifications.length === 0 ? (
          <div className="p-4 text-center text-muted-foreground">
            No notifications yet
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