"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useSession } from "next-auth/react";
import { Cross, Loader, X } from "lucide-react";
import { Task, User } from "@prisma/client";
import { useToast } from "@/hooks/use-toast";
import TaskDialog from "@/components/add-task";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRecoilState, useRecoilValue } from "recoil";
import { teamAtom } from "@/states/teamAtom";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { ResourceError } from "@/components/error/resource-error";
import { UserSession } from "@/app/api/auth/[...nextauth]/route";
import { Session } from "next-auth";
import { hasPermission, permissions } from "@/permissionManager/permissions";
import HasPermission from "@/components/permissions/HasPermission";
import { permissionAtom } from "@/states/permissionAtom";

const statusColors = {
  PENDING: "bg-red-500 text-white",
  INPROGRESS: "bg-yellow-500 text-white",
  COMPLETED: "bg-green-500 text-white",
};

const chartColors = {
  PENDING: "#f87171",
  INPROGRESS: "#facc15",
  COMPLETED: "#4ade80",
};

const deadlineRanges = {
  all: "All",
  today: "Due Today",
  week: "Due This Week",
  overdue: "Overdue",
};

export default function HomePage() {
  const session = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [userToFilter, setUserToFilter] = useState("");
  const [statusToFilter, setStatusToFilter] = useState("");
  const [deadlineFilter, setDeadlineFilter] = useState("all");
  const [currentTeamId, setCurrentTeamId] = useRecoilState(teamAtom);
  const userPermissions = useRecoilValue(permissionAtom)

  const fetchTasks = async () => {
    try {
      console.log(session);
      const urls = [
        `/api/task/getAll?teamId=${currentTeamId}`,
        `/api/task/getAll?assigneeId=${session.data?.userId}&teamId=${currentTeamId}`,
      ];
      const response = await fetch(
        (await hasPermission(
          userPermissions,
          permissions.task.readAll(currentTeamId)
        ))
          ? urls[0]
          : urls[1]
      );
      //set all filters to default
      setUserToFilter("");
      setStatusToFilter("");
      setDeadlineFilter("all");
      const data = await response.json();
      setFilteredTasks(Array.isArray(data) ? data : []);
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error("Error fetching tasks:", error);
      toast({
        title: "Error, please reload the page.",
      });
    }
  };

  const filterTasks = async () => {
    try {
      if (!tasksQuery.data) return;
      let filtered = [...tasksQuery.data] as Task[];

      // User filter
      if (userToFilter) {
        filtered = filtered.filter(
          (task: Task) => task.assigneeId === userToFilter
        );
      }

      // Status filter
      if (statusToFilter) {
        filtered = filtered.filter(
          (task: Task) => task.status === statusToFilter
        );
      }

      // Deadline filter
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const weekEnd = new Date(today);
      weekEnd.setDate(weekEnd.getDate() + 7);

      switch (deadlineFilter) {
        case "today":
          filtered = filtered.filter((task: Task) => {
            const deadline = new Date(task.deadline);
            return (
              deadline >= today &&
              deadline < new Date(today.getTime() + 24 * 60 * 60 * 1000)
            );
          });
          break;
        case "week":
          filtered = filtered.filter((task: Task) => {
            const deadline = new Date(task.deadline);
            return deadline >= today && deadline <= weekEnd;
          });
          break;
        case "overdue":
          filtered = filtered.filter(
            (task: Task) => new Date(task.deadline) < today
          );
          break;
        case "future":
          filtered = filtered.filter(
            (task: Task) => new Date(task.deadline) > weekEnd
          );
          break;
      }

      setFilteredTasks(filtered);
    } catch (err) {
      console.log("Error");
      toast({
        title: "Error, Please Refresh The Page.",
        variant: "destructive",
      });
    }
  };

  const tasksQuery = useQuery({
    queryKey: ["tasks", currentTeamId],
    queryFn: fetchTasks,
    enabled:
      session.status === "authenticated" && Boolean(currentTeamId.length > 2),
    staleTime: 2 * 60 * 1000,
  });

  const getUsers = async () => {
    // if (session.data?.role == Role.MEMBER) return;
    try {
      const response = await fetch("/api/users/getAll?teamId=" + currentTeamId);
      if (response.ok) {
        const data = await response.json();
        return data.users;
      }
    } catch (err) {
      console.log(err);
      toast({
        title: "Error Fetching Users",
        variant: "destructive",
      });
    }
  };

  const usersQuery = useQuery({
    queryKey: ["users", currentTeamId],
    queryFn: getUsers,
    enabled: Boolean(tasksQuery.data),
    staleTime: 10 * 60 * 1000,
  });

  useEffect(() => {
    filterTasks();
  }, [userToFilter, statusToFilter, deadlineFilter, tasksQuery.data]);

  const chartData = useMemo(() => {
    return [
      {
        status: "PENDING",
        count: filteredTasks.filter((task: Task) => task.status === "PENDING")
          .length,
      },
      {
        status: "INPROGRESS",
        count: filteredTasks.filter(
          (task: Task) => task.status === "INPROGRESS"
        ).length,
      },
      {
        status: "COMPLETED",
        count: filteredTasks.filter((task: Task) => task.status === "COMPLETED")
          .length,
      },
    ];
  }, [filteredTasks]);

  const clearFilters = () => {
    setUserToFilter("");
    setStatusToFilter("");
    setDeadlineFilter("all");
  };

  if (tasksQuery.isError) {
    return (
      <ResourceError
        onRetry={() => {
          tasksQuery.refetch();
        }}
      />
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Your Tasks</h1>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="h-fit">
          <CardHeader>
            <CardTitle>Task Overview</CardTitle>

            <CardDescription>
              Your current tasks and their statuses
            </CardDescription>
          
              {(session.status == "authenticated" && hasPermission(userPermissions, permissions.task.create(currentTeamId))) && (
                <TaskDialog
                  trigger={<Button variant="outline">Add Task</Button>}
                  triggerFunc={fetchTasks}
                  tasks={tasksQuery.data as Task[]}
                  all={usersQuery.data || []}
                />
              )}
           
          </CardHeader>
          <CardContent>
            {tasksQuery.isLoading ? (
              <Skeleton className="w-full h-[300px]" />
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <XAxis dataKey="status" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count">
                    {chartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={
                          chartColors[entry.status as keyof typeof chartColors]
                        }
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Task List</CardTitle>
            <CardDescription>Tasks To Work On</CardDescription>
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                
                  {hasPermission(userPermissions, permissions.task.readAll(currentTeamId)) && session.status == "authenticated" && (
                    <Select
                      onValueChange={(value) => setUserToFilter(value)}
                      value={userToFilter}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filter by user" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Assigned To</SelectLabel>
                          {(usersQuery.data || []).map((user: User) => (
                            <SelectItem key={user.userId} value={user.userId}>
                              {user.username} | {user.employeeId.toUpperCase()}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  )}
                

                <Select
                  onValueChange={(value) => setStatusToFilter(value)}
                  value={statusToFilter}
                >
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

                <Select
                  onValueChange={(value) => setDeadlineFilter(value)}
                  value={deadlineFilter}
                >
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

                {(userToFilter ||
                  statusToFilter ||
                  deadlineFilter !== "all") && (
                  <Button
                    variant="outline"
                    onClick={clearFilters}
                    className="flex items-center gap-2"
                  >
                    <X className="h-4 w-4" />
                    Clear Filters
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[300px] w-full rounded-md border overflow-y-auto p-2">
              {tasksQuery.isLoading ? (
                <div className="space-y-2">
                  {[...Array(5)].map((_, index) => (
                    <Skeleton key={index} className="w-full h-16" />
                  ))}
                </div>
              ) : (
                <ul className="space-y-4 overflow-auto">
                  {filteredTasks.length === 0 && (
                    <div className="text-center text-muted-foreground py-8">
                      No tasks match the selected filters
                    </div>
                  )}
                  {filteredTasks.map((task: Task) => (
                    <li
                      key={task.taskId}
                      className="flex items-center justify-between p-2 bg-accent rounded-lg"
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
                              (new Date(task.deadline).getTime() -
                                new Date().getTime()) /
                                (1000 * 60 * 60 * 24)
                            )}{" "}
                            day(s)
                          </span>
                        </p>
                      </div>
                      <Badge
                        className={
                          statusColors[task.status as keyof typeof statusColors]
                        }
                      >
                        {task.status}
                      </Badge>
                    </li>
                  ))}
                </ul>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
