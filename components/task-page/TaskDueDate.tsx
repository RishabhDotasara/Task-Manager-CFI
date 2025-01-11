import { CalendarIcon, ClockIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "../ui/badge";

interface TaskDueDateProps {
  deadline: Date;
  isLoading: boolean;
}

export function TaskDueDate({ deadline, isLoading }: TaskDueDateProps) {
  const daysLeft = Math.ceil(
    (new Date(deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );

  if (isLoading) {
    return <Skeleton className="h-4 w-full" />;
  }

  const isOverdue = new Date(deadline).getTime() - Date.now() < 0;  

  return (
    <div className="flex gap-2 items-center text-sm text-muted-foreground">
      <div className="flex gap-2 items-center">
        <CalendarIcon className="w-4" />
        <span>Due: {!isOverdue ? new Date(deadline).toLocaleDateString() : "Overdue"}</span>
      </div>
      <div className="flex gap-2 items-center">
        <ClockIcon className="h-4 w-4" />
        <span>Days Left: {daysLeft > 0 ? daysLeft : 0} day(s)</span>
      </div>
     {isOverdue && <div>
        <Badge variant={"destructive"}>
          Overdue
        </Badge>
      </div>}
    </div>
  );
}