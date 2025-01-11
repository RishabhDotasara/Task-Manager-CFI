import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Task } from "@prisma/client";
import Link from "next/link";

interface TaskListProps {
  tasks: Task[];
  isLoading: boolean;
}

const statusColors = {
  PENDING: "bg-red-500 text-white",
  INPROGRESS: "bg-yellow-500 text-white",
  COMPLETED: "bg-green-500 text-white",
};

export default function TaskList({ tasks, isLoading }: TaskListProps) {
  return (
    <ScrollArea className="h-[400px] w-full rounded-md border overflow-y-auto p-2">
      {isLoading ? (
        <div className="space-y-2">
          {[...Array(5)].map((_, index) => (
            <Skeleton key={index} className="w-full h-16" />
          ))}
        </div>
      ) : (
        <ul className="space-y-4 overflow-auto">
          {tasks.length === 0 && (
            <div className="text-center text-muted-foreground py-8">
              No tasks match the selected filters
            </div>
          )}
          {!tasks && (
            <div  className="text-center text-muted-foreground py-8">
              Select a Team to view Tasks
            </div>
          )}
          {tasks.map((task: Task) => (
            <li
              key={task.taskId}
              className="flex items-center justify-between p-4 bg-accent rounded-lg hover:bg-accent/80 transition-colors"
            >
              <div>
                <Link
                  href={`/task-manager/task/${task.taskId}`}
                  className="font-semibold hover:underline"
                >
                  {task.title}
                </Link>
                <p className="text-sm text-muted-foreground">
                  <span className="mr-8">
                    Assigned to: {(task as any).assignee.username}
                  </span>
                  <span>
                    Time Left:{" "}
                    {Math.ceil(
                      (new Date(task.deadline).getTime() - new Date().getTime()) /
                        (1000 * 60 * 60 * 24)
                    )}{" "}
                    day(s)
                  </span>
                </p>
              </div>
              <Badge className={statusColors[task.status as keyof typeof statusColors]}>
                {task.status}
              </Badge>
            </li>
          ))}
        </ul>
      )}
    </ScrollArea>
  );
}