import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select";
  import { Skeleton } from "@/components/ui/skeleton";
  
  interface TaskStatusProps {
    status: string;
    isLoading: boolean;
    onStatusChange: (value: string) => void;
  }
  
  export function TaskStatus({ status, isLoading, onStatusChange }: TaskStatusProps) {
    if (isLoading) {
      return <Skeleton className="h-10 w-[180px]" />;
    }
  
    return (
      <Select onValueChange={onStatusChange} defaultValue={status}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="PENDING">
            <span className="bg-red-500 text-white px-2 py-1 rounded-sm">
              Pending
            </span>
          </SelectItem>
          <SelectItem value="INPROGRESS">
            <span className="bg-yellow-500 text-white px-2 py-1 rounded-sm">
              In Progress
            </span>
          </SelectItem>
          <SelectItem value="COMPLETED">
            <span className="bg-green-500 text-white px-2 py-1 rounded-sm">
              Completed
            </span>
          </SelectItem>
        </SelectContent>
      </Select>
    );
  }