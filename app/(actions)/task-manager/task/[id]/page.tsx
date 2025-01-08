"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useToast } from "@/hooks/use-toast";
import { Comment, Status, Task } from "@prisma/client";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Skeleton } from "@/components/ui/skeleton";
import { TaskHeader } from "@/components/task-page/TaskHeader";
import { TaskDueDate } from "@/components/task-page/TaskDueDate";
import { TaskStatus } from "@/components/task-page/TaskStatus";
import { CommentList } from "@/components/task-page/CommentList";
import { CommentForm } from "@/components/task-page/CommentForm";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ResourceError } from "@/components/error/resource-error";
import { Button } from "@/components/ui/button";
import { useRecoilValue } from "recoil";
import { teamAtom } from "@/states/teamAtom";
import ReloadButton from "@/components/ReloadButton";

export default function TaskDetails() {
  const [newComment, setNewComment] = useState("");
  const [isAddingComment, setIsAddingComment] = useState(false);
  const [status, setStatus] = useState<Status>("PENDING");
  // const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const { toast } = useToast();
  const session = useSession();
  const { id: taskId } = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const currentTeamId = useRecoilValue(teamAtom);

  const getTask = async () => {
    try {
      const response = await fetch(`/api/task/get?taskId=${taskId}`);
      if (response.ok) {
        const taskData = await response.json();
        setComments(taskData.comments);
        return taskData;
      }
    } catch (err) {
      toast({
        title: "Error fetching task details",
        variant: "destructive",
      });
    }
  };

  const taskQuery = useQuery({
    queryKey: ["task", taskId],
    queryFn: getTask,
    enabled: !!taskId,
    staleTime: 1000 * 60 * 1,
  });

  const handleCommentSubmit = async () => {
    if (newComment.trim() === "") {
      toast({
        title: "Invalid Comment!",
        variant: "destructive",
      });
      return;
    }

    const response = await fetch("/api/task/comment/create", {
      method: "POST",
      body: JSON.stringify({
        authorId: session.data?.userId,
        taskId: taskQuery.data?.taskId,
        content: newComment.trim(),
      }),
    });

    const data = await response.json();
    console.log(data);
    setNewComment("");

    return data;
  };

  const addCommentMutation = useMutation({
    mutationKey: ["comment", "add"],
    mutationFn: handleCommentSubmit,
    onMutate: () => {
      setIsAddingComment(true);
    },
    onError: (err) => {
      console.log(err);
      toast({ title: "Error while Commenting!" });
    },
    onSettled: (data: any) => {
      setComments([...comments, data?.comment]);
      toast({ title: "Comment Added!" });
      setIsAddingComment(false);
    },
  });

  const handleStatusChange = async (value: string) => {
    const response = await fetch("/api/task/status", {
      method: "POST",
      body: JSON.stringify({ taskId: taskQuery.data?.taskId, status: value }),
    });
  };

  const changeTaskStatusMutation = useMutation({
    mutationKey: ["changeStatus", taskQuery.data?.taskId],
    mutationFn: handleStatusChange,
    onMutate: () => {
      toast({
        title: "Updating...",
      });
    },
    onError: (err) => {
      console.log(err);
      toast({
        title: "Error",
        description: "Error changing task status!",
        action: (
          <Button variant={"outline"} onClick={() => {}}>
            Try Again!
          </Button>
        ),
      });
    },
    onSuccess: () => {
      toast({
        title: "Status Updated!",
      });
      queryClient.invalidateQueries({ queryKey: ["tasks", currentTeamId] });
    },
  });

  const handleDeleteTask = async () => {
    const response = await fetch("/api/task/delete", {
      method: "POST",
      body: JSON.stringify({ taskId: taskQuery.data?.taskId }),
    });
  };

  const deleteTaskMutation = useMutation({
    mutationKey: ["task", taskQuery.data?.taskId],
    mutationFn: handleDeleteTask,
    onMutate: () => {
      setIsDeleting(true);
    },
    onError: (err) => {
      console.log(err);
      toast({ title: "Error while deleting task!" });
    },
    onSuccess: () => {
      toast({ title: "Task Deleted!" });
      queryClient.invalidateQueries({ queryKey: ["tasks", currentTeamId] });
      router.push("/task-manager");
    },
  });

  if (taskQuery.isError) {
    return (
      <ResourceError
        onRetry={() => {
          taskQuery.refetch();
        }}
      />
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <Card>
        <CardHeader>
          <TaskHeader
            title={taskQuery.data?.title || ""}
            isLoading={taskQuery.isLoading}
            isDeleting={isDeleting}
            onDelete={deleteTaskMutation.mutate}
            onRefetch={taskQuery.refetch}
            isRefetching={taskQuery.isRefetching}
          />
          <TaskDueDate
            deadline={taskQuery.data?.deadline as Date}
            isLoading={taskQuery.isLoading}
          />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">Description</h3>
              {taskQuery.isLoading ? (
                <Skeleton className="h-20 w-full" />
              ) : (
                <p className="text-muted-foreground">
                  {taskQuery.data?.description}
                </p>
              )}
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Status</h3>
              <TaskStatus
                status={taskQuery.data?.status as string}
                isLoading={taskQuery.isLoading}
                onStatusChange={changeTaskStatusMutation.mutate}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Comments</CardTitle>
          
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <CommentList comments={comments} isLoading={taskQuery.isLoading} />
          </div>
        </CardContent>
        <CardFooter>
          <CommentForm
            value={newComment}
            onChange={setNewComment}
            onSubmit={addCommentMutation.mutate}
            isLoading={taskQuery.isLoading}
            isSubmitting={isAddingComment}
          />
        </CardFooter>
      </Card>
    </div>
  );
}
