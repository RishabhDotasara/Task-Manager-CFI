"use client";
import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Plus, Search, Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Club, User } from "@prisma/client";
import { ClubCard } from "@/components/clubs/ClubCard";
import { CreateClubDialog } from "@/components/clubs/CreateClubDialog";
import { EditClubSection } from "@/components/clubs/ClubDialog";

export default function ClubsPage() {
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedClub, setSelectedClub] = useState<
    (Club & { clubLeads: string[] }) | undefined
  >();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch clubs
  const { data: clubs, isLoading: isLoadingClubs } = useQuery({
    queryKey: ["clubs", "all"],
    queryFn: async () => {
      const response = await fetch("/api/clubs/getAll");
      if (!response.ok) throw new Error("Failed to fetch clubs");
      const data = await response.json();
      console.log(data.clubs)
      return data.clubs;
    },
  });

  // Fetch users for leader selection
  const { data: users } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const response = await fetch("/api/user/getAll");
      if (!response.ok) throw new Error("Failed to fetch users");
      const dat = await response.json();
      return dat.users;
    },
  });

  const userOptions =
    users?.map((user: User) => ({
      value: user.userId,
      label: `${user.username} (${user.email})`,
    })) ?? [];

  useEffect(()=>{
    console.log(selectedClub)
  },[selectedClub])

  // Create/Update club mutation
  const clubMutation = useMutation({
    mutationFn: async (data: Partial<Club>) => {
      const response = await fetch(
        selectedClub ? `/api/clubs/${selectedClub.clubId}` : "/api/clubs",
        {
          method: selectedClub ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );
      if (!response.ok) throw new Error("Failed to save club");
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: `Club ${selectedClub ? "updated" : "created"} successfully`,
      });
      setDialogOpen(false);
      setSelectedClub(undefined);
      queryClient.invalidateQueries({ queryKey: ["clubs"] });
    },
    onError: () => {
      toast({
        title: `Failed to ${selectedClub ? "update" : "create"} club`,
        variant: "destructive",
      });
    },
  });

  const filteredClubs = clubs?.filter((club: Club) =>
    club.clubName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <div className="container mx-auto py-8 px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Clubs Management</h1>
          <CreateClubDialog />
        </div>

        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            className="pl-10"
            placeholder="Search clubs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {isLoadingClubs ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-[200px] rounded-lg" />
            ))}
          </div>
        ) : (
            <div className="flex flex-wrap gap-6">
            {filteredClubs?.map((club: Club & {clubLeads:string[]}) => (
              <ClubCard
              key={club.clubId}
              club={club}
              leaders={club.clubLeads} 
              onClick={() => {
                setSelectedClub({ ...club}); // Add actual clubLeads data
                setDialogOpen(true);
              }}
              />
            ))}
            </div>
        )}
      </div>

      {selectedClub && <EditClubSection
        club={selectedClub as Club & { clubLeads: string[] }}
        onClose={() => setSelectedClub(undefined)}
        userOptions={userOptions}
        isOpen={!!selectedClub}
      />}
    </>
  );
}
