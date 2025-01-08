"use client";
import { Team, User } from "@prisma/client";
import { useQueryClient } from "@tanstack/react-query";
import { 
  Users, 
  Shield, 
  UserPlus, 
  Settings,
  BarChart,
  Calendar,
  MessageSquare
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TeamTable } from "@/components/teams/TeamTable";
import { Button } from "@/components/ui/button";
import { CreateTeamDialog } from "../teams/CreateTeamDialog";

interface TeamSectionProps {
  teams: Team[];
  isLoading: boolean;
  onEdit: (team: Team) => void;
  onDelete: (id: string) => void;
  isDeleting: boolean;
  userId?: string;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  limit: number;
  clubId:string
}

export function TeamSection({
  teams,
  isLoading,
  onEdit,
  onDelete,
  isDeleting,
  userId,
  currentPage,
  setCurrentPage,
  limit,
  clubId
}: TeamSectionProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Team Management
            </CardTitle>
            <CardDescription>Manage your club's teams and members</CardDescription>
          </div>
          <div className="flex gap-2">
            {/* <Button variant="outline" size="sm">
              <Calendar className="h-4 w-4 mr-2" />
              Schedule
            </Button>
            <Button variant="outline" size="sm">
              <MessageSquare className="h-4 w-4 mr-2" />
              Chat
            </Button>
            <Button variant="outline" size="sm">
              <BarChart className="h-4 w-4 mr-2" />
              Analytics
            </Button> */}
            <CreateTeamDialog clubId={clubId}/>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* <div className="flex justify-between items-center mb-6">
          <div className="flex gap-2">
            <Button variant="default">
              <UserPlus className="h-4 w-4 mr-2" />
              Add Member
            </Button>
            <Button variant="secondary">
              <Shield className="h-4 w-4 mr-2" />
              Permissions
            </Button>
          </div>
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
        </div> */}
        <TeamTable
          isLoading={isLoading}
          teams={teams}
          onEdit={onEdit}
          onDelete={onDelete}
          isDeleting={isDeleting}
          userId={userId || ""}
          setCurrentPage={setCurrentPage}
          limit={limit}
          currentPage={currentPage}
        />
      </CardContent>
    </Card>
  );
}