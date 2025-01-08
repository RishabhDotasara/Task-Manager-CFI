"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useSession } from "next-auth/react";
import { AlertCircle, CheckCircle2, Clock, Cross, Loader, X } from "lucide-react";
import { Task, User } from "@prisma/client";
import { useToast } from "@/hooks/use-toast";
import TaskDialog from "@/components/add-task";
import { Button } from "@/components/ui/button";
import { useRecoilState, useRecoilValue } from "recoil";
import { teamAtom } from "@/states/teamAtom";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ResourceError } from "@/components/error/resource-error";
import { UserSession } from "@/app/api/auth/[...nextauth]/route";
import { Session } from "next-auth";
import { hasPermission, permissions } from "@/permissionManager/permissions";
import HasPermission from "@/components/permissions/HasPermission";
import { permissionAtom } from "@/states/permissionAtom";
import TaskStatusCard from "@/components/taskManagerDashboard/TaskStatusCard";
import TaskFilters from "@/components/taskManagerDashboard/TaskFilters";
import TaskList from "@/components/taskManagerDashboard/TaskList";
import ReloadButton from "@/components/ReloadButton";

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
  const queryClient = useQueryClient()

  const fetchTasks = async () => {
    try {
      console.log(session);
      const urls = [
        `/api/task/getAll?teamId=${currentTeamId}`,
        `/api/task/getAll?assigneeId=${session.data?.userId}&teamId=${currentTeamId}`,
      ];
      const response = await fetch(urls[0]);
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


  const clearFilters = () => {
    setUserToFilter("");
    setStatusToFilter("");
    setDeadlineFilter("all");
  };

  const taskStats = {
    pending: filteredTasks.filter((task: Task) => task.status === "PENDING").length,
    inProgress: filteredTasks.filter((task: Task) => task.status === "INPROGRESS").length,
    completed: filteredTasks.filter((task: Task) => task.status === "COMPLETED").length,
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
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Your Tasks</h1>
        <div className="flex gap-2 items-center">
        {session.status === "authenticated" &&
          hasPermission(userPermissions, permissions.task.create(currentTeamId)) && (
            <TaskDialog
              trigger={<Button>Add Task</Button>}
              triggerFunc={fetchTasks}
              tasks={tasksQuery.data as Task[]}
              all={usersQuery.data || []}
            />
          )}
        <ReloadButton onRefetch={tasksQuery.refetch} isRefetching={tasksQuery.isRefetching}/>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <TaskStatusCard
          status="Pending Tasks"
          count={taskStats.pending}
          icon={<AlertCircle className="h-6 w-6 text-red-500" />}
          description="Tasks waiting to be started"
        />
        <TaskStatusCard
          status="In Progress"
          count={taskStats.inProgress}
          icon={<Clock className="h-6 w-6 text-yellow-500" />}
          description="Tasks currently being worked on"
        />
        <TaskStatusCard
          status="Completed"
          count={taskStats.completed}
          icon={<CheckCircle2 className="h-6 w-6 text-green-500" />}
          description="Successfully completed tasks"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Task List</CardTitle>
          <CardDescription>Manage and track your tasks</CardDescription>
          <TaskFilters
            users={usersQuery.data || []}
            userToFilter={userToFilter}
            statusToFilter={statusToFilter}
            deadlineFilter={deadlineFilter}
            onUserFilterChange={setUserToFilter}
            onStatusFilterChange={setStatusToFilter}
            onDeadlineFilterChange={setDeadlineFilter}
            onClearFilters={clearFilters}
            showUserFilter={
              session.status === "authenticated" &&
              hasPermission(userPermissions, permissions.task.readAll(currentTeamId))
            }
          />
        </CardHeader>
        <CardContent>
          <TaskList tasks={filteredTasks} isLoading={tasksQuery.isLoading} />
        </CardContent>
      </Card>
    </div>
  );
}