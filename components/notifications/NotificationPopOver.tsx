import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { useNotifications } from "@/hooks/use-notifications";
import { NotificationList } from "./NotificationList";
import { ResourceError } from "../error/resource-error";

export function NotificationPopover() {
  const {
    notifications,
    markAsRead,
    markAllAsRead,
    isError,
    refetch,
    isLoading: isLoadingNotifications,
  } = useNotifications();
  const unreadCount = notifications
    ? notifications.filter((n) => !n.read).length
    : 0;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="relative hover:bg-background"
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-xs font-medium text-white flex items-center justify-center ring-2 ring-background">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="center"
        className="w-full min-w-[400px] p-0 mr-4 h-fit"
        sideOffset={8}
      >
        {!isError && (
          <NotificationList
            refetch={refetch}
            isLoadingNotification={isLoadingNotifications}
            notifications={notifications || []}
            onMarkAsRead={markAsRead}
            onMarkAllRead={markAllAsRead}
          />
        )}
        {isError && (
          <ResourceError
            onRetry={() => {
              refetch();
            }}
          />
        )}
      </PopoverContent>
    </Popover>
  );
}
