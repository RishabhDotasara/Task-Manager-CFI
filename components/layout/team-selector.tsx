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
import { Team } from "@prisma/client";

interface TeamSelectorProps {
  teams: Team[];
  currentTeam: string;
  onTeamChange: (teamId: string) => void;
}

export function TeamSelector({ teams, currentTeam, onTeamChange }: TeamSelectorProps) {
  return (
    <Select onValueChange={onTeamChange} value={currentTeam}>
      <SelectTrigger className="w-[180px]">
          <SelectValue placeholder={teams ? "Select a Team" : "Loading Teams..."} />
        </SelectTrigger>
        <SelectContent >
          <SelectGroup>
            <SelectLabel>Select Team</SelectLabel>
            {teams && teams.map((team:any)=>{
              return (
                <SelectItem value={team.teamId} key={team.teamId}>{team.name}</SelectItem>
              )
            })}
            {teams && teams.length == 0 && <SelectItem value="No Teams Found!">No Teams Found!</SelectItem>}
            
          </SelectGroup>
        </SelectContent>
    </Select>
  );
}