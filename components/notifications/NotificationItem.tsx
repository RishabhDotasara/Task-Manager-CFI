import { formatDistanceToNow } from "date-fns";
import {
  MessageSquare,
  Calendar,
  Users,
  CheckSquare,
  Bell,
  Lightbulb,
  User2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Notification, NotificationType, User } from "@prisma/client";

const iconMap: Record<NotificationType, React.ComponentType<any>> = {
  COMMENT: MessageSquare,
  TASK: CheckSquare,
  TEAM: Users,
  EVENT: Calendar,
  UPDATE: Bell,
  REQUEST: Lightbulb,
};

interface NotificationItemProps {
  notification: Notification & { sender: User; receiver: User };
  onMarkAsRead: (id: number) => void;
}

export function NotificationItem({
  notification,
  onMarkAsRead,
}: NotificationItemProps) {
  const Icon = iconMap[notification.type];

  // const getActionURL = async (task:string)=>{
  //   const urlMap: Record<NotificationType, string> = {
  //     COMMENT : `/task-manager/task/${teamId}`,
  //     TEAM: "",
  //     EVENT: "",
  //     UPDATE: "",
  //     REQUEST: "",
  //     TASK: `/task-manager/task/${teamId}`
  //   }
  // }
  return (
    <div
      className={cn(
        "flex items-start gap-4 p-4 transition-colors",
        !notification.read && "bg-secondary/40"
      )}
    >
      <div className="relative">
        <User2 className="h-10 w-10 rounded-full" />
        <div className="absolute -bottom-1 -right-1 p-1 bg-background rounded-full">
          <Icon className="w-4 h-4 text-primary" />
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="w-full">
            <div className="flex items-center gap-2  ">
              <div className="flex justify-between w-full items-center mb-2 ">
                <p className="font-medium text-sm">{notification.title}</p>
                <time className="text-xs text-muted-foreground whitespace-nowrap">
                  {formatDistanceToNow(notification.timestamp, {
                    addSuffix: true,
                  })}
                </time>
              </div>
              {notification.requestType && (
                <Badge
                  variant={
                    notification.requestType === "BUG"
                      ? "destructive"
                      : "default"
                  }
                >
                  {notification.requestType}
                </Badge>
              )}
            </div>
            <p className="text-muted-foreground text-sm w-full ">
              {notification.message}
            </p>
            <p className="text-muted-foreground text-xs w-full mt-2">
              - By {notification.sender.username}
            </p>
          </div>
        </div>

        <div className="mt-2 flex items-center gap-2">
          {/* <Button
            variant="outline"
            size="sm"
            className="text-xs"
            onClick={() => (window.location.href = notification.actionUrl)}
          >
            View Details
          </Button> */}
          {!notification.read && (
            <Button
              variant="ghost"
              size="sm"
              className="text-xs"
              onClick={() => onMarkAsRead(notification.notificationId)}
            >
              Mark as Read
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
