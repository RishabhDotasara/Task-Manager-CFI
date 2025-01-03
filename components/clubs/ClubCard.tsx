import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users, Crown, Calendar } from "lucide-react";
import { format } from "date-fns";
import { Club, User } from "@prisma/client";

interface ClubCardProps {
  club: Club;
  leaders: User[];
  onClick: () => void;
}

export function ClubCard({ club, leaders, onClick }: ClubCardProps) {
  return (
    <Card
      className=" min-w-[400px] hover:shadow-lg transition-shadow cursor-pointer dark:hover:shadow-primary/10"
      onClick={onClick}
    >
      <CardHeader className="flex flex-row items-center gap-4">
        <Avatar className="h-12 w-12">
          <AvatarImage
            src={
              "https://cfi.iitm.ac.in/assets/WebopsandBlockchainLogo-207245f0.png"
            }
            alt={club.clubName}
          />
          <AvatarFallback>
            {club.clubName.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <CardTitle className="flex items-center gap-2 justify-between">
            <span className="truncate max-w-[150px]">
              {club.clubName}
            </span>
            <Badge variant="secondary" className="ml-2 w-fit">
              <Users className="h-3 w-3 mr-1" />
              {leaders.length} Leaders
            </Badge>
          </CardTitle>
        </div>
      </CardHeader>
    </Card>
  );
}
