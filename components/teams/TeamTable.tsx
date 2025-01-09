import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Team, User } from "@prisma/client";
import { ChevronLeft, ChevronRight } from "lucide-react";
import TeamTableRow from "./TeamTableRow";
import TeamTableRowSkeleton from "./TeamTableRowSkeleton";

import { ColumnDef } from "@tanstack/react-table"
import { Dispatch, SetStateAction } from "react";
import { TeamTableSearch } from "./TeamTableSearch";

interface TeamTableProps {
  teams: Team[] & {leaders:User[], members:User[]};
  onEdit: (team: Team) => void;
  onDelete: (teamId: string) => void;
  isDeleting: boolean;
  isLoading: boolean;
  userId: string;
  limit:number;
  currentPage:number;
  setCurrentPage:Dispatch<SetStateAction<number>>
}

export function TeamTable({
  teams,
  onEdit,
  onDelete,
  isDeleting,
  isLoading,
  userId,
  setCurrentPage,
  currentPage,
  limit
}: TeamTableProps) {
  return (
    <div className="space-y-4">
      
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Team Name</TableHead>
            <TableHead>Members</TableHead>
            <TableHead>Leaders</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <>
              <TeamTableRowSkeleton />
              <TeamTableRowSkeleton />
              <TeamTableRowSkeleton />
            </>
          ) : (
            teams.map((team:any) => (
              <TeamTableRow 
                isLoading={false} 
                team={team} 
                onEdit={onEdit} 
                key={team.teamId} 
                userId={userId}
              />
            ))
          )}
          {!isLoading && teams.length === 0 && (
            <TableRow>
              <TableCell colSpan={4} className="text-center">
                You are not a leader of any team.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      
      <div className="flex items-center justify-end space-x-2">
        <Button
          variant="outline"
          size="sm"
          className="h-8 w-8 p-0"
          disabled={currentPage < 2}
          onClick={() => setCurrentPage((prev) => prev - 1)}
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="sr-only">Previous page</span>
        </Button> 
        <Button
          variant="outline"
          size="sm"
          className="h-8 w-8 p-0"
          disabled={teams.length < limit}
          onClick={() => setCurrentPage((prev) => prev + 1)}
        >
          <ChevronRight className="h-4 w-4" />
          <span className="sr-only">Next page</span>
        </Button>
      </div>
    </div>
  );
}