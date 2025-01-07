import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface NotificationIconProps {
  icon: LucideIcon;
  className?: string;
  variant?: "default" | "success" | "warning" | "error";
}

const variantStyles = {
  default: "text-primary bg-primary/10",
  success: "text-green-500 bg-green-500/10",
  warning: "text-yellow-500 bg-yellow-500/10",
  error: "text-red-500 bg-red-500/10",
};

export function NotificationIcon({ 
  icon: Icon, 
  className, 
  variant = "default" 
}: NotificationIconProps) {
  return (
    <div className={cn(
      "p-2 rounded-full",
      variantStyles[variant],
      className
    )}>
      <Icon className="h-4 w-4" />
    </div>
  );
}