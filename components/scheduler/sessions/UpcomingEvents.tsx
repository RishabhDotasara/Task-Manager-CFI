import ReloadButton from "@/components/ReloadButton";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { teamAtom } from "@/states/teamAtom";
import { Session } from "@prisma/client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import {
  CalendarIcon,
  MapPinIcon,
  Pencil,
  Trash,
  Users2,
  VideoIcon,
} from "lucide-react";
import { useRecoilValue } from "recoil";
import { EventCardSkeleton } from "./EventCardSkeleton";
import { Button } from "@/components/ui/button";
import { EventUpdationForm } from "./EventUpdationForm";
import { useState } from "react";
import { EventUpdationDialog } from "./EventUpdationDialog";
import { hasPermission, permissions } from "@/permissionManager/permissions";
import { permissionAtom } from "@/states/permissionAtom";
import { DeletionConfirmationDialog } from "@/components/deleteDialog";
import { useSession } from "next-auth/react";

export function EventCard({ event }: { event: Session }) {
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const userPermissions = useRecoilValue(permissionAtom);
  const { toast } = useToast();
  const currentTeamId = useRecoilValue(teamAtom);
  const queryClient = useQueryClient();
  const session = useSession();

  const deleteEventMutation = useMutation({
    mutationKey: ["delete", event.sessionId],
    mutationFn: async () => {
      const response = await fetch("/api/session/delete", {
        method: "DELETE",
        body: JSON.stringify({
          sessionId: event.sessionId,
          creatorId: session.data?.userId,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
    },
    onSettled: () => {
      toast({
        title: "Event Deleted!",
        description: "Refresh to see changes!",
      });
      queryClient.invalidateQueries({
        queryKey: ["sessions", `teamId:${currentTeamId}`],
      });
    },
    onError: () => {
      toast({
        title: "Error Deleting Event",
        description: "Try Again!",
        variant: "destructive",
      });
    },
  });

  return (
    <Card className="group relative overflow-hidden border-none bg-gradient-to-br from-white to-gray-50 shadow-md transition-all duration-300 hover:shadow-xl dark:from-background dark:to-muted flex flex-col justify-between">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100 " />

      <CardHeader className="space-y-3 pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="line-clamp-1 text-foreground">
            {event.title}
          </CardTitle>
          <Badge
            variant={event.eventType === "ONLINE" ? "default" : "secondary"}
            className={cn(
              "px-4 py-1 text-xs font-medium tracking-wide transition-colors",
              event.eventType === "ONLINE"
                ? "bg-green-500/90 hover:bg-green-200"
                : "bg-secondary hover:bg-secondary/80"
            )}
          >
            {event.eventType === "ONLINE" ? "Online" : "In Person"}
          </Badge>
        </div>
        <p className="relative">
          <span
            className={cn(
              "text-sm text-muted-foreground relative line-clamp-2"
            )}
          >
            {event.description}
          </span>
        </p>
      </CardHeader>

      <CardContent className="space-y-3 pb-5">
        <EventUpdationDialog
          event={event}
          onOpenChange={setUpdateDialogOpen}
          open={updateDialogOpen}
        />
        <div className="space-y-2.5">
          <div className="flex items-center text-sm text-muted-foreground">
            <CalendarIcon className="mr-2.5 h-4 w-4" />
            <span>
              {format(event.date, "PPP")} ·{" "}
              <span className="font-medium text-foreground">
                {event.startTime} - {event.endTime}
              </span>
            </span>
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <MapPinIcon className="mr-2.5 h-4 w-4" />
            <span className="line-clamp-1">{event.location}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="relative flex items-center justify-end gap-2 ">
        {hasPermission(
          userPermissions,
          permissions.session.update(currentTeamId)
        ) && (
          <Button
            size={"sm"}
            variant={"outline"}
            className=""
            onClick={() => {
              setUpdateDialogOpen(true);
            }}
          >
            <Pencil />
          </Button>
        )}
        {hasPermission(
          userPermissions,
          permissions.session.delete(currentTeamId)
        ) && (
          <DeletionConfirmationDialog
            onConfirm={() => {
              deleteEventMutation.mutate();
            }}
            title={"Delete Event"}
            isPending={deleteEventMutation.isPending}
            description={"Are you sure you want to delete this event?"}
          />
        )}
      </CardFooter>
    </Card>
  );
}
export function UpcomingEvents() {
  const currentTeamId = useRecoilValue(teamAtom);
  const { toast } = useToast();

  const getSessionQuery = useQuery({
    queryKey: ["sessions", `teamId:${currentTeamId}`],
    queryFn: async () => {
      try {
        const response = await fetch(
          "/api/session/getAll?teamId=" + currentTeamId
        );
        const data = await response.json();
        return data.sessions;
      } catch (err) {
        toast({
          title: "Error fetching sessions",
          description: "Try Again!",
          variant: "destructive",
        });
      }
    },
    staleTime: 5 * 60 * 1000,
    enabled: Boolean(currentTeamId),
  });

  if (getSessionQuery.isLoading) {
    <div className="space-y-4">
      <EventCardSkeleton />
      <EventCardSkeleton />
      <EventCardSkeleton />
    </div>;
  }

  if (!currentTeamId) {
    return <h1 className="text-muted-foreground">No Team Selected</h1>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <h3 className="text-xl font-semibold">Upcoming Events</h3>
        <ReloadButton
          onRefetch={getSessionQuery.refetch}
          isRefetching={getSessionQuery.isRefetching}
        />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {getSessionQuery.data?.map((event: Session) => (
          <EventCard key={event.sessionId} event={event} />
        ))}
        {getSessionQuery.data?.length === 0 && (
          <h1 className="text-muted-foreground">No Upcoming Events</h1>
        )}
      </div>
    </div>
  );
}
