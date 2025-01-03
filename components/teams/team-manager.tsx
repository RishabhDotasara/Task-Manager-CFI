"use client";
import { useEffect, useState } from "react";
import { Loader } from "lucide-react";
import { Team, User } from "@prisma/client";
import { useToast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TeamForm } from "@/components/teams/TeamForm";
import { CreateTeamDialog } from "@/components/teams/CreateTeamDialog";
import { TeamTable } from "@/components/teams/TeamTable";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { ResourceError } from "../error/resource-error";
import { hasPermission, permissions } from "@/permissionManager/permissions";
import { useRecoilValue } from "recoil";
import { permissionAtom } from "@/states/permissionAtom";
import { CreateClubDialog } from "../clubs/CreateClubDialog";

const limit = 5;

export default function TeamManagementPage() {
  const userPermissions = useRecoilValue(permissionAtom);
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const session = useSession();
  const { toast } = useToast();
  const [page, setPage] = useState(1);

  const queryClient = useQueryClient();

  const handleUpdateTeam = async (data: any) => {
    const response = await fetch("/api/teams/update", {
      method: "POST",
      body: JSON.stringify({ ...data, teamId: editingTeam?.teamId }),
    });
  };

  const handleDeleteTeam = async (teamId: string) => {
    try {
      setIsDeleting(true);
      const response = await fetch(`/api/teams/delete?teamId=${teamId}`);
      if (response.ok) {
        toast({ title: "Team Deleted!" });
      }
    } catch (err) {
      console.error(err);
      toast({
        title: "Failed to delete team",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const fetchTeams = async () => {
    try {
      setIsLoading(true);
      const urls = {
        leader: `/api/teams/get-teams-by-leader?leaderId=${session.data?.userId}&page=${page}&limit=${limit}`,
        admin: `/api/teams/getAll?page=${page}&limit=${limit}`,
      };
      const response = await fetch(
        hasPermission(userPermissions, permissions.team.readAll)
          ? urls.admin
          : urls.leader
      );
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        return data.teams;
      }
    } catch (err) {
      console.error(err);
      toast({
        title: "Failed to fetch teams",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/user/getAll");
      if (response.ok) {
        const data = await response.json();
        return data;
      }
    } catch (err) {
      console.error(err);
      toast({
        title: "Failed to fetch users",
        variant: "destructive",
      });
    }
  };

  const fetchTeamsQuery = useQuery({
    queryKey: ["teams", "all", page],
    queryFn: fetchTeams,
    staleTime: 5 * 60 * 1000,
    enabled: Boolean(session.data?.userId) && Boolean(page),
  });

  const allUsersQuery = useQuery({
    queryKey: ["users", "all"],
    queryFn: fetchUsers,
    staleTime: 5 * 60 * 1000,
    enabled: Boolean(fetchTeamsQuery.data),
  });

  const updateTeamMutation = useMutation({
    mutationKey: ["updateTeam", editingTeam?.teamId],
    mutationFn: handleUpdateTeam,
    onMutate: () => {
      setIsUpdating(true);
    },
    onSuccess: () => {
      toast({ title: "Team Updated!" });
      setEditingTeam(null);
      queryClient.invalidateQueries({ queryKey: ["teams", "all"] });
      setIsUpdating(false);
    },
    onError: () => {
      toast({ title: "Failed to update team", variant: "destructive" });
      setIsUpdating(false);
    },
  });

  if (fetchTeamsQuery.isError) {
    return (
      <ResourceError
        onRetry={() => {
          fetchTeamsQuery.refetch();
        }}
      />
    );
  }

  return (
    <div className="container mx-auto p-4">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Team Management</CardTitle>
          <CardDescription>Manage your organization's teams</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Existing Teams</h2>
            <div className="flex gap-4">
              {hasPermission(userPermissions, permissions.team.create) && (
                <CreateClubDialog />
              )}
              {hasPermission(userPermissions, permissions.team.create) && (
                <CreateTeamDialog />
              )}
            </div>
          </div>
          <TeamTable
            isLoading={fetchTeamsQuery.isLoading}
            teams={fetchTeamsQuery.data || []}
            onEdit={setEditingTeam}
            onDelete={handleDeleteTeam}
            isDeleting={isDeleting}
            userId={session.data?.userId}
            setCurrentPage={setPage}
            limit={limit}
            currentPage={page}
          />
        </CardContent>
      </Card>

      {editingTeam && (
        <Card>
          <CardHeader>
            <CardTitle>Edit Team: {editingTeam.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <TeamForm
              onSubmit={updateTeamMutation.mutate}
              teamData={editingTeam}
              users={allUsersQuery.data || []}
              disabled={isUpdating}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
