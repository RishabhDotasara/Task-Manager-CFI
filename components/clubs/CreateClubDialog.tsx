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
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useState } from "react";

interface CreateTeamDialogProps {}

export function CreateClubDialog({}: CreateTeamDialogProps) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [creatingClubName, setcreatingClubName] = useState("");

  const handleCreateTeam = async () => {
    const response = await fetch("/api/clubs/create", {
      method: "POST",
      body: JSON.stringify({ name: creatingClubName }),
    });
  };

  const createClubMutation = useMutation({
    mutationKey: ["createTeam"],
    mutationFn: handleCreateTeam,
    onSuccess: () => {
      toast({
        title: "Club created!",
        description: "Changes will be reflected on UI.",
      });
      setcreatingClubName("");
      setOpen(false);
      queryClient.invalidateQueries({ queryKey: ["teams", "all"] });
    },
    onError: (err) => {
      console.log(err);
      toast({ title: "Failed to create club", variant: "destructive" });
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Add New Club</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Club</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Club Name
            </Label>
            <Input
              id="name"
              className="col-span-3"
              value={creatingClubName}
              onChange={(e) => setcreatingClubName(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            onClick={() => {
              createClubMutation.mutate();
            }}
            disabled={createClubMutation.isPending || creatingClubName.length < 2}
          >
            Create Club
            {createClubMutation.isPending && (
              <Loader2 className="ml-2 h-4 w-4 animate-spin" />
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
