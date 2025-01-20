import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import ReloadButton from "../ReloadButton";

interface NotificationHeaderProps {
  unreadCount: number;
  onMarkAllRead: () => void;
  refetch: Function;
  isLoadingNotification: boolean;
}

export function NotificationHeader({
  unreadCount,
  onMarkAllRead,
  refetch,
  isLoadingNotification,
}: NotificationHeaderProps) {
  return (
    <div className="px-4 py-3 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10 border-b">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex gap-2">
            <h2 className="text-sm font-semibold">Notifications</h2>
          </div>
          <p className="text-xs text-muted-foreground">
            {unreadCount
              ? `You have ${unreadCount} unread notification${
                  unreadCount !== 1 ? "s" : ""
                }`
              : "No new notifications"}
          </p>
        </div>
        <div className="flex gap-2">
          {/* {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="text-xs"
              onClick={onMarkAllRead}
            >
              Mark all read
            </Button>
          )} */}
          <ReloadButton onRefetch={refetch} isRefetching={isLoadingNotification}/>
        </div>
      </div>
    </div>
  );
}
