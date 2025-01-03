import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { NotificationList } from "./NotificationList";
import { useNotifications } from "@/hooks/use-notifications";


export function NotificationPopover() {
  const { notifications, markAsRead } = useNotifications();
  const unreadCount = notifications.filter(n => !n.read).length;
  
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="center" className="w-full p-0">
        <NotificationList
          notifications={notifications}
          onMarkAsRead={markAsRead}
        />
      </PopoverContent>
    </Popover>
  );
}