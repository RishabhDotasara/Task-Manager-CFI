import { Users, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ClubStatsProps {
  leaderCount: number;
  memberCount?: number;
  foundedDate?: Date;
}

export function ClubStats({ leaderCount, memberCount, foundedDate }: ClubStatsProps) {
  return (
    <div className="flex flex-wrap gap-2 mt-2">
      <Badge variant="secondary" className="w-fit">
        <Users className="h-3 w-3 mr-1" />
        {leaderCount} Leader{leaderCount !== 1 ? 's' : ''}
      </Badge>
      
      {memberCount && (
        <Badge variant="outline" className="w-fit">
          <Users className="h-3 w-3 mr-1" />
          {memberCount} Member{memberCount !== 1 ? 's' : ''}
        </Badge>
      )}
      
      {foundedDate && (
        <Badge variant="outline" className="w-fit">
          <Calendar className="h-3 w-3 mr-1" />
          Since {new Date(foundedDate).getFullYear()}
        </Badge>
      )}
    </div>
  );
}