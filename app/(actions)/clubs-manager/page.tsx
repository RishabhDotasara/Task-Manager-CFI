"use client";
import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Plus, Search, Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Club, User } from "@prisma/client";
import { ClubCard } from "@/components/clubs/ClubCard";
import { CreateClubDialog } from "@/components/clubs/CreateClubDialog";
import { EditClubSection } from "@/components/clubs/ClubDialog";
import { useRouter } from "next/navigation";
import { hasPermission, permissions } from "@/permissionManager/permissions";
import { useRecoilState, useRecoilValue } from "recoil";
import { permissionAtom } from "@/states/permissionAtom";
import ReloadButton from "@/components/ReloadButton";
import { clubAtom } from "@/states/clubAtoms";
import useUserInfo from "@/hooks/use-userinfo";

export default function ClubsPage() {
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const userPermissions = useRecoilValue(permissionAtom);
  const [clubs,setClubs] = useRecoilState(clubAtom)
  const UserInfo = useUserInfo()
  
  const filteredClubs = clubs?.filter((club: Club) =>
    club.clubName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <div className="container mx-auto py-8 px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Your Clubs</h1>
          <div className="flex items-center gap-2">
            {hasPermission(userPermissions, permissions.club.create) && (
              <CreateClubDialog />
            )}
            <ReloadButton
              onRefetch={UserInfo.refetch}
              isRefetching={UserInfo.isRefetching}
              tooltipText="Refresh Clubs Data"
            />
          </div>
        </div>

        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            className="pl-10"
            placeholder="Search clubs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {UserInfo.isLoading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-[200px] rounded-lg" />
            ))}
          </div>
        ) : (
          <div className="flex flex-wrap gap-6">
            {filteredClubs?.length == 0 && <h1 className="text-muted-foreground">You aren't a leader of any Club.</h1>}
            {filteredClubs?.map((club: Club) => (
              <ClubCard
                key={club.clubId}
                club={club}
                onClick={()=>{
                  router.push("/clubs-manager/club/"+club.clubId)
                }}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
