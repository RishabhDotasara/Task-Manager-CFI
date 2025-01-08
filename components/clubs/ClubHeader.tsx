"use client";
import { Building2, Users, Trophy, Target } from "lucide-react";

interface ClubStatsProps {
  teamCount: number;
  memberCount: number;
  leaderCount?: number;
}

export function ClubHeader({ teamCount, memberCount, leaderCount }: ClubStatsProps) {
  return (
    <div className="flex w-full justify-evenly gap-4">
      <div className="bg-primary/5 p-4 rounded-lg border border-border flex flex-1 items-center gap-4">
        <div className="bg-primary/10 p-3 rounded-full">
          <Building2 className="h-6 w-6 text-primary" />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Total Teams</p>
          <h3 className="text-2xl font-bold">{teamCount}</h3>
        </div>
      </div>
      
      {/* <div className="bg-blue-500/5 p-4 rounded-lg border border-border flex flex-1 items-center gap-4">
        <div className="bg-blue-500/10 p-3 rounded-full">
          <Users className="h-6 w-6 text-blue-500" />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Total Members</p>
          <h3 className="text-2xl font-bold">{memberCount}</h3>
        </div>
      </div> */}

      <div className="bg-amber-500/5 p-4 rounded-lg border border-border flex flex-1 items-center gap-4">
        <div className="bg-amber-500/10 p-3 rounded-full">
          <Trophy className="h-6 w-6 text-amber-500" />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Club Leaders</p>
          <h3 className="text-2xl font-bold">{leaderCount}</h3>
        </div>
      </div>

    </div>
  );
}