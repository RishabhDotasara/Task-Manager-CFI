import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Club, User } from "@prisma/client";
import { ClubAvatar } from "./ClubAvatar";
import { ClubStats } from "./ClubStats";


interface ClubCardProps {
  club: Club
  onClick: () => void;
}

export function ClubCard({ club, onClick }: ClubCardProps) {
  return (
    <Card
      className="w-full min-w-[280px] max-w-[400px] hover:shadow-lg transition-all duration-300 cursor-pointer dark:hover:shadow-primary/10 hover:scale-[1.02]"
      onClick={onClick}
    >
      <CardHeader className="flex flex-row items-center gap-4">
        <ClubAvatar name={club.clubName} />
        
        <div className="flex-1 min-w-0">
          <CardTitle className="flex flex-col sm:flex-row sm:items-center gap-2 justify-between">
            <span className="truncate" title={club.clubName}>
              {club.clubName}
            </span>
          </CardTitle>
        </div>
      </CardHeader>

      {/* {club.description && (
        <CardContent>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {club.description}
          </p>
        </CardContent>
      )} */}
    </Card>
  );
}