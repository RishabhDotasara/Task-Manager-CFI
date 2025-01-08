"use client";
import { EditClubSection } from "@/components/clubs/ClubDialog";
import { ClubHeader } from "@/components/clubs/ClubHeader";
import { TeamSection } from "@/components/clubs/TeamSection";
import { TeamForm } from "@/components/teams/TeamForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import useAllUsersQuery from "@/hooks/use-allusers";
import { useToast } from "@/hooks/use-toast";
import { Team, User } from "@prisma/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Settings2, Sheet, Sparkles, Users } from "lucide-react";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function ClubInfo() {
  const { id } = useParams();
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);
  const { toast } = useToast();
  const session = useSession();
  const limit = 5;
  const [page, setPage] = useState(1);
  const [isDeleting, setIsDeleting] = useState(false);
  const queryClient = useQueryClient();
  const [isUpdating, setIsUpdating] = useState(false);
  const { allUsersQuery } = useAllUsersQuery();

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

  const handleUpdateTeam = async (data: any) => {
    console.log(data);

    const oldMembers = editingTeam?.members.map(
      (member: User) => member.userId
    );
    const oldLeaders = editingTeam?.leaders.map(
      (leader: User) => leader.userId
    );
    const newMembers = data.members.map((memberId: string) => {
      if (!oldMembers?.includes(memberId)) {
        return memberId;
      }
    });
    const newLeaders = data.leaders.map((leaderId: string) => {
      if (!oldLeaders?.includes(leaderId)) {
        return leaderId;
      }
    });

    const response = await fetch("/api/teams/update", {
      method: "POST",
      body: JSON.stringify({
        ...data,
        teamId: editingTeam?.teamId,
        newMembers,
        newLeaders,
        promoterId: session.data?.userId,
      }),
    });
  };

  const updateTeamMutation = useMutation({
    mutationKey: ["updateTeam", editingTeam?.teamId],
    mutationFn: handleUpdateTeam,
    onMutate: () => {
      setIsUpdating(true);
    },
    onSuccess: () => {
      toast({ title: "Team Updated!" });
      setEditingTeam(null);
      queryClient.invalidateQueries({ queryKey: ["teams", `clubId:${id}`] });
      setIsUpdating(false);
    },
    onError: () => {
      toast({ title: "Failed to update team", variant: "destructive" });
      setIsUpdating(false);
    },
  });

  const fetchClubQuery = useQuery({
    queryKey:['club',id],
    queryFn: async ()=>{
      try 
      {
         const response = await fetch(`/api/clubs/get?clubId=${id}`)
         const data = await response.json()
         console.log(data)
         return data.club
      }
      catch(err)
      {
        console.log(err)
        toast({
          title:"Error Fetching Club Details.",
          description:'Refresh the Page!',
          variant:"destructive"
        })
      }
    },
    staleTime:10 * 60 * 1000
  })

  const fetchClubTeamsQuery = useQuery({
    queryKey: ["teams", `clubId:${id}`, page],
    queryFn: async () => {
      try {
        const response = await fetch(
          `/api/teams/get-teams-by-club?clubId=${id}&page=${page}&limit=${limit}`
        );
        const data = await response.json();
        return data.teams;
      } catch (err) {
        console.log(err);
        toast({
          title: "Error Fetching Club Teams",
          variant: "destructive",
          description: "Try Again!",
        });
      }
    },
    staleTime:10*60*1000,
    enabled: Boolean(page) || Boolean(limit)
  });


  useEffect(() => {
    console.log(editingTeam);
  }, [editingTeam]);

  return (
    <div className="container mx-auto p-4 space-y-6">
      <ClubHeader 
        teamCount={fetchClubTeamsQuery.data?.length || 0}
        memberCount={120}
        leaderCount={fetchClubQuery.data?.clubLeads.length}
      />

      <Tabs defaultValue="teams" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="teams" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Teams
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings2 className="h-4 w-4" />
            Club Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="teams" className="mt-6">
          <TeamSection
            teams={fetchClubTeamsQuery.data || []}
            isLoading={fetchClubTeamsQuery.isLoading}
            onEdit={setEditingTeam}
            onDelete={handleDeleteTeam}
            isDeleting={isDeleting}
            userId={session.data?.userId}
            currentPage={page}
            setCurrentPage={setPage}
            limit={limit}
            clubId={id as string}
            onRefetch={fetchClubTeamsQuery.refetch}
            isRefetching={fetchClubTeamsQuery.isRefetching}
          />
        </TabsContent>

        <TabsContent value="settings" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="bg-primary/10 p-2 rounded-full">
                  <Sparkles className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle>Club Settings</CardTitle>
                  <CardDescription>
                    Manage your club's details and leadership
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <EditClubSection
               club={fetchClubQuery.data}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {editingTeam && (
        <Card>
          <CardHeader>
            <CardTitle>Edit Team: {editingTeam?.name}</CardTitle>
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
