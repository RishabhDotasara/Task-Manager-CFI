import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Crown, Loader2, X } from "lucide-react";
import { Club, User } from "@prisma/client";
import { SearchableMultiSelect } from "@/components/ui/searchable-multi-select";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cn } from "@/lib/utils";

interface EditClubSectionProps {
  club: Club & { clubLeads: User[] };
  onClose: () => void;
  userOptions: { value: string; label: string }[];
  isOpen: boolean;
}

export function EditClubSection({
  club,
  onClose,
  userOptions,
  isOpen,
}: EditClubSectionProps) {

  const [editedClub, setEditedClub] = useState<
    Omit<Club, "clubLeads"> & { clubLeads: string[] }
  >(club);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const clubMutation = useMutation({
    mutationFn: async (data: Partial<Club>) => {
      const response = await fetch(`/api/clubs/update`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to update club");
      return response.json();
      console.log(data);
    },
    onSuccess: () => {
      toast({ title: "Club updated successfully" });
      queryClient.invalidateQueries({ queryKey: ["clubs"] });
      onClose();
    },
    onError: () => {
      toast({ title: "Failed to update club", variant: "destructive" });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    clubMutation.mutate(editedClub);
  };

  return (
    <div
      className={cn(
        "fixed top-0 right-0 w-96 h-full bg-background border-l border-border shadow-lg transform transition-transform duration-300 ease-in-out z-50",
        isOpen ? "translate-x-0" : "translate-x-full"
      )}
    >
      <div className="p-6 h-full overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Edit Club</h2>
          <Button variant="ghost" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Club Name</Label>
            <Input
              id="name"
              value={editedClub.clubName}
              onChange={(e) =>
                setEditedClub({ ...editedClub, clubName: e.target.value })
              }
              placeholder="Enter club name"
            />
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Crown className="h-4 w-4" />
              Club Leaders
            </Label>
            <SearchableMultiSelect
              options={userOptions}
              value={club.clubLeads.map((lead:User)=>lead.userId)}
              onValueChange={(value) =>
                setEditedClub({ ...editedClub, clubLeads: value })
              }
              placeholder="Select club leaders"
            />
            <div>
              <Label>Current Leaders</Label>
              <ul>
                {club.clubLeads.map((lead: User) => (
                  <li key={lead.userId} className="text-sm">
                    {lead.username}
                  </li>
                ))}
              </ul>
        
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose} type="button">
              Cancel
            </Button>
            <Button type="submit" disabled={clubMutation.isPending}>
              {clubMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Update Club
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
