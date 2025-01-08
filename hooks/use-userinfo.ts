import { getDynamicPermissions } from '@/permissionManager/permissions';
import { permissionAtom } from '@/states/permissionAtom';
import { Club, Team } from '@prisma/client';
import { useSession } from 'next-auth/react';
import React from 'react'
import { useRecoilState } from 'recoil';
import { useToast } from './use-toast';
import { useQuery } from '@tanstack/react-query';
import { clubAtom } from '@/states/clubAtoms';

export default function useUserInfo() {
    const session = useSession()
    const [permissions, setPermissions] = useRecoilState(permissionAtom)
    const {toast} = useToast()
    const [club, setClubs] = useRecoilState(clubAtom)

     const fetchUser = async () => {
        try {
          const response = await fetch(
            `/api/user/get?userId=${session.data?.userId}`
          );
          const data: {
            user: {
              permissions: string[];
              teams: Team[];
              teamLeader: Team[];
              clubLead: Club[];
            };
          } = await response.json();
          if (data.user) {
            const teamLeaderPermissions: any[] = [];
            data.user.clubLead.map((club: Club) => {
              teamLeaderPermissions.push(...club.teams);
            });
            // console.log(teamLeaderPermissions)
            
            const generatedPermissions = await getDynamicPermissions(
              data.user.teams,
              [...data.user.teamLeader],
              teamLeaderPermissions
            );
            console.log("Generated Permissions: ", generatedPermissions);
            setPermissions([
              ...data.user.permissions,
              ...(generatedPermissions || []),
            ]);
            setClubs(data.user.clubLead)
            
            return data.user;
          }
        } catch (err) {
          console.log("Error Fetching User Profile!", err);
          toast({
            title: "Error Fetching User Profile",
            description: "Slow Internet Maybe!",
          });
        }
      };

      const userQuery = useQuery({
          queryKey: ["user", session.data?.userId],
          queryFn: fetchUser,
          staleTime: 1000 * 60 * 5,
          refetchInterval: 1000 * 60 * 5,
        });

  return (
    userQuery
  )
}
