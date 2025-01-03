import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Club } from "@prisma/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useState } from "react";

interface CreateTeamDialogProps {}

export function CreateTeamDialog({}: CreateTeamDialogProps) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [creatingTeamName, setCreatingTeamName] = useState("");
  const [selectedClub, setSelectedClub] = useState("");

  const handleCreateTeam = async () => {
    const response = await fetch("/api/teams/create", {
      method: "POST",
      body: JSON.stringify({ 
        name: creatingTeamName,
        clubId: selectedClub 
      }),
    });
  };

  const createTeamMutation = useMutation({
    mutationKey: ["createTeam"],
    mutationFn: handleCreateTeam,
    onSuccess: () => {
      toast({
        title: "Team created!",
        description: "Changes will be reflected on UI.",
      });
      setCreatingTeamName("");
      setSelectedClub("");
      setOpen(false);
      queryClient.invalidateQueries({ queryKey: ["teams", "all"] });
    },
    onError: (err) => {
      console.log(err);
      toast({ title: "Failed to create team", variant: "destructive" });
    },
  });

  const fetchAllClubs = async () => {
    try {
      const response = await fetch("/api/clubs/getAll");
      const data = await response.json(); 
      console.log(data)
      return data.clubs;
    } catch(err) {
      console.log(err);
      toast({ title: "Failed to fetch clubs", variant: "destructive" });
    }
  };

  const fetchAllClubsQuery = useQuery({
    queryKey: ["clubs", "all"],
    queryFn: fetchAllClubs,
    staleTime: 1000 * 60 * 5,
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default">Add New Team</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Team</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Team Name
            </Label>
            <Input
              id="name"
              className="col-span-3"
              value={creatingTeamName}
              onChange={(e) => setCreatingTeamName(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="club" className="text-right">
              Club
            </Label>
            <Select
              value={selectedClub}
              onValueChange={setSelectedClub}
              disabled={fetchAllClubsQuery.isLoading}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select a club" />
              </SelectTrigger>
              <SelectContent>
                {fetchAllClubsQuery.data?.map((club:Club) => (
                  <SelectItem key={club.clubId} value={club.clubId}>
                    {club.clubName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button
            onClick={() => {
              createTeamMutation.mutate();
            }}
            disabled={createTeamMutation.isPending || !selectedClub || !creatingTeamName.trim()}
          >
            Create Team
            {createTeamMutation.isPending && (
              <Loader2 className="ml-2 h-4 w-4 animate-spin" />
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}