import { formatDistanceToNow } from "date-fns";
import { NotificationType, User, Notification } from "@prisma/client";
import { MessageSquare, Calendar, Users, CheckSquare, Bell, Lightbulb } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { NotificationIcon } from "./NotificationIcon";
import { useRouter } from "next/navigation";

const iconMap: Record<NotificationType, typeof MessageSquare> = {
  COMMENT: MessageSquare,
  TASK: CheckSquare,
  TEAM: Users,
  EVENT: Calendar,
  UPDATE: Bell,
  REQUEST: Lightbulb,
};

const typeVariantMap: Record<NotificationType, "default" | "success" | "warning" | "error" | "info"> = {
  COMMENT: "default",
  TASK: "success",
  TEAM: "warning",
  EVENT: "default",
  UPDATE: "info",
  REQUEST: "warning",
};

interface NotificationItemProps {
  notification: Notification & { sender: User; receiver: User };
  onMarkAsRead: (id: number) => void;
}

export function NotificationItem({ notification, onMarkAsRead }: NotificationItemProps) {
  const Icon = iconMap[notification.type];
  const router = useRouter();

  return (
    <div className={cn(
      "group flex items-start gap-4 p-4 hover:bg-muted/50 transition-colors",
      !notification.read && "bg-secondary/40"
    )}>
      <Avatar className="h-8 w-8">
        <AvatarImage src={notification.sender.avatarUrl} />
        <AvatarFallback>{notification.sender.username.slice(0, 2).toUpperCase()}</AvatarFallback>
      </Avatar>

      <div className="flex-1 min-w-0">
        <div className="flex items-center mb-1 gap-2">
          <NotificationIcon 
            icon={Icon} 
            variant={typeVariantMap[notification.type]}
            className=""
          />
          <span className="font-medium text-sm cursor-pointer" onClick={()=>{router.push(notification.actionUrl)}}>{notification.title}</span>
          {notification.requestType && (
            <Badge variant={notification.requestType === "BUG" ? "destructive" : "default"}>
              {notification.requestType}
            </Badge>
          )}
        </div>

        <p className="text-sm text-muted-foreground mb-2">
          {notification.message}
        </p>

        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            By {notification.sender.username} • {formatDistanceToNow(notification.timestamp, { addSuffix: true })}
          </p>
          
          {!notification.read && (
            <Button
              variant="ghost"
              size="sm"
              className="opacity-0 group-hover:opacity-100 transition-opacity text-xs"
              onClick={() => onMarkAsRead(notification.notificationId)}
            >
              Mark as read
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}