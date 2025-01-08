import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X } from "lucide-react";
import { User } from "@prisma/client";

interface TaskFiltersProps {
  users: User[];
  userToFilter: string;
  statusToFilter: string;
  deadlineFilter: string;
  onUserFilterChange: (value: string) => void;
  onStatusFilterChange: (value: string) => void;
  onDeadlineFilterChange: (value: string) => void;
  onClearFilters: () => void;
  showUserFilter: boolean;
}

const statusColors = {
  PENDING: "bg-red-500 text-white",
  INPROGRESS: "bg-yellow-500 text-white",
  COMPLETED: "bg-green-500 text-white",
};

const deadlineRanges = {
  all: "All",
  today: "Due Today",
  week: "Due This Week",
  overdue: "Overdue",
};

export default function TaskFilters({
  users,
  userToFilter,
  statusToFilter,
  deadlineFilter,
  onUserFilterChange,
  onStatusFilterChange,
  onDeadlineFilterChange,
  onClearFilters,
  showUserFilter,
}: TaskFiltersProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {showUserFilter && (
        <Select onValueChange={onUserFilterChange} value={userToFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by user" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Assigned To</SelectLabel>
              {users.map((user: User) => (
                <SelectItem key={user.userId} value={user.userId}>
                  {user.username} | {user.employeeId.toUpperCase()}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      )}

      <Select onValueChange={onStatusFilterChange} value={statusToFilter}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Filter by status" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Status</SelectLabel>
            {Object.keys(statusColors).map((status) => (
              <SelectItem key={status} value={status}>
                {status}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>

      <Select onValueChange={onDeadlineFilterChange} value={deadlineFilter}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Filter by deadline" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Deadline</SelectLabel>
            {Object.entries(deadlineRanges).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>

      {(userToFilter || statusToFilter || deadlineFilter !== "all") && (
        <Button
          variant="outline"
          onClick={onClearFilters}
          className="flex items-center gap-2"
        >
          <X className="h-4 w-4" />
          Clear Filters
        </Button>
      )}
    </div>
  );
}