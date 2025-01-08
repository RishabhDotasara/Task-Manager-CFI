"use client";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Club, Team } from "@prisma/client";
import ReloadButton from "../ReloadButton";
import { UseQueryResult } from "@tanstack/react-query";

interface TeamSelectorProps {
  teams: Team[];
  currentTeam: string;
  onTeamChange: (teamId: string) => void;
  fetchQuery: UseQueryResult<
    | {
        permissions: string[];
        teams: Team[];
        teamLeader: Team[];
        clubLead: Club[];
      }
    | undefined,
    Error
  >;
}

export function TeamSelector({
  teams,
  currentTeam,
  onTeamChange,
  fetchQuery,
}: TeamSelectorProps) {
  return (
    <div className="flex gap-2">
      <Select onValueChange={onTeamChange} value={currentTeam}>
        <SelectTrigger className="w-[180px]">
          <SelectValue
            placeholder={fetchQuery.isLoading || fetchQuery.isRefetching ? "Loading Teams..." : "Select a Team"}
          />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Select Team</SelectLabel>
            {teams &&
              teams.map((team: any) => {
                return (
                  <SelectItem value={team.teamId} key={team.teamId}>
                    {team.name}
                  </SelectItem>
                );
              })}
            {teams && teams.length == 0 && (
              <SelectItem value="No Teams Found!">No Teams Found!</SelectItem>
            )}
          </SelectGroup>
        </SelectContent>
      </Select>
      <ReloadButton
        isRefetching={fetchQuery.isRefetching}
        onRefetch={fetchQuery.refetch}
      />
    </div>
  );
}
