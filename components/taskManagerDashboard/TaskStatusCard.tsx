import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Task } from "@prisma/client";
import { CheckCircle2, Clock, AlertCircle } from "lucide-react";

interface TaskStatusCardProps {
  status: string;
  count: number;
  icon: React.ReactNode;
  description: string;
}

const TaskStatusCard = ({ status, count, icon, description }: TaskStatusCardProps) => {
  return (
    <Card className="relative overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {status}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-2xl font-bold">{count}</div>
            <p className="text-xs text-muted-foreground mt-1">{description}</p>
          </div>
          <div className="h-12 w-12 flex items-center justify-center rounded-full bg-background">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TaskStatusCard;