import { CalendarIcon, ClockIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

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

  return (
    <div className="flex gap-2 items-center text-sm text-muted-foreground">
      <div className="flex gap-2 items-center">
        <CalendarIcon className="w-4" />
        <span>Due: {new Date(deadline).toLocaleDateString()}</span>
      </div>
      <div className="flex gap-2 items-center">
        <ClockIcon className="h-4 w-4" />
        <span>Days Left: {daysLeft} day(s)</span>
      </div>
    </div>
  );
}