"use client";

import React, { useState } from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { Team, User } from "@prisma/client";
import TeamTableRowSkeleton from "./TeamTableRowSkeleton";
import { TeamMembersDialog } from "./TeamMembersDialog";
import { DeleteTeamDialog } from "./DeleteTeamDialog";
import { useDeleteTeam } from "@/hooks/useDeleteTeam";
import { useSession } from "next-auth/react";
import { hasPermission, permissions } from "@/permissionManager/permissions";
import { useRecoilValue } from "recoil";
import { permissionAtom } from "@/states/permissionAtom";

type RowProps = {
  team: Team & { leaders: User[]; members: User[] };
  onEdit: (team: Team) => void;
  isLoading?: boolean;
  userId: string;
};

export default function TeamTableRow({
  team,
  onEdit,
  isLoading = false,
  userId,
}: RowProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isMembersDialogOpen, setIsMembersDialogOpen] = useState(false);
  const deleteTeamMutation = useDeleteTeam();
  const session = useSession();
  const userPermissions = useRecoilValue(permissionAtom)

  if (deleteTeamMutation.isSuccess) {
    return <TeamTableRowSkeleton />;
  }

  return (
    <>
      {team && team.members && team.leaders && <TableRow>
        <TableCell>{team.name}</TableCell>
        <TableCell>{team.members?.length} members</TableCell>
        <TableCell>{team.leaders?.length} leaders</TableCell>
        <TableCell>
          <div className="flex space-x-2">
            <TeamMembersDialog
              team={team}
              isOpen={isMembersDialogOpen}
              onOpenChange={setIsMembersDialogOpen}
            />

            {(              hasPermission(userPermissions, permissions.team.update(team.teamId))) && (
              <Button
                variant="outline"
                size="icon"
                onClick={() => onEdit(team)}
              >
                <Pencil className="h-4 w-4" />
              </Button>
            )}

            {hasPermission(userPermissions, permissions.team.delete(team.teamId)) && (
              <DeleteTeamDialog
                teamName={team.name}
                isOpen={isDeleteDialogOpen}
                onOpenChange={setIsDeleteDialogOpen}
                onDelete={() => deleteTeamMutation.mutate(team.teamId)}
                isDeleting={deleteTeamMutation.isPending}
              />
            )}
          </div>
        </TableCell>
      </TableRow>}
    </>
  );
}
