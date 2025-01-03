"use client";
import React, { Suspense, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { useToast } from "@/hooks/use-toast";
import { useRecoilState, useSetRecoilState } from "recoil";
import { userAtom } from "@/states/userAtom";
import { teamAtom } from "@/states/teamAtom";
import { Bell, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ModeToggle } from "@/components/theme-toggle";
import { NavigationLinks } from "@/components/layout/navigation-links";
import { TeamSelector } from "@/components/layout/team-selector";
import { UserMenu } from "@/components/layout/user-menu";
import { useQuery } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools/build/modern/production.js";
import { Team, User } from "@prisma/client";
import { permissionAtom } from "@/states/permissionAtom";
import { getDynamicPermissions } from "@/permissionManager/permissions";
import { NotificationPopover } from "@/components/notifications/NotificationPopOver";
import { notificationAtom } from "@/states/notificationAtom";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = useSession();
  const router = useRouter();
  const { toast } = useToast();
  const [teams, setTeams] = useState<Team[] | null>(null);
  const setUser = useSetRecoilState(userAtom);
  const [currentTeam, setCurrentTeam] = useRecoilState(teamAtom);
  const [isLoading, setIsLoading] = useState(false);
  const [permission, setPermissions] = useRecoilState(permissionAtom);
  const [notifications, setNotifications] = useRecoilState(notificationAtom)
 
  //also fetch the user and store the permissions in the permissionsAtom
  const fetchUser = async () => {
    try {
      const response = await fetch(
        `/api/user/get?userId=${session.data?.userId}`
      );
      const data: {
        user: { permissions: string[]; teams: Team[]; teamLeader: Team[] };
      } = await response.json();
      if (data.user) {
        console.log(data);
        const generatedPermissions = await getDynamicPermissions(
          data.user.teams,
          data.user.teamLeader
        );
        console.log("Generated Permissions: ", generatedPermissions);
        setPermissions([
          ...data.user.permissions,
          ...(generatedPermissions || []),
        ]);
        setTeams(data.user.teams);
        if (data.user.teams.length > 0) {
          setCurrentTeam(data.user.teams[0].teamId);
        }
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

  const fetchNotifications = async ()=>{
    try 
    {
      const response = await fetch(`/api/notification/getAll?userId=${session.data?.userId}`);
      const data = await response.json()
      setNotifications(data.notifications)
      return data.notifications
    }
    catch(err)
    {
      console.log(err)
      toast({
        title:"Error Fetching Notifications!",
        description:"Try Again!",
        variant:"destructive"
      })
    }
  }

  const userQuery = useQuery({
    queryKey: ["user", session.data?.userId],
    queryFn: fetchUser,
    staleTime: 1000 * 60 * 5,
    refetchInterval: 1000 * 60 * 5,
  });

  const notificationsQuery = useQuery({
    queryKey:['notifications', session.data?.userId],
    queryFn:fetchNotifications,
    staleTime: 5 * 60 * 1000,
    refetchInterval: 5 * 60 * 1000,
    
  })

  useEffect(() => {
    if (session.status === "unauthenticated") {
      router.push("/auth/signin");
      toast({
        title: "Please Login Again!",
        description: "Session Expired!",
      });
    }
  }, [session.status]);

  useEffect(() => {
    // @ts-ignore
    window.toggleDevtools = () => setShowDevtools((old) => !old);
  }, []);

  const handleLogOut = async () => {
    try {
      await signOut({ redirect: false });
      router.push("/auth/signin");
      toast({
        title: "Logged Out",
        description: "You have successfully logged out.",
      });
    } catch (error) {
      toast({
        title: "Logout Failed",
        description: "Something went wrong while logging out. Try Again!",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
        {/* Sidebar */}
        <div className="hidden border-r bg-background md:block">
          <div className="flex h-full max-h-screen flex-col gap-2">
            <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
              {!userQuery.isError && (
                <TeamSelector
                  teams={teams || []}
                  currentTeam={currentTeam}
                  onTeamChange={setCurrentTeam}
                />
              )}
              {userQuery.isError && (
                <Button
                  variant={"outline"}
                  className="w-full mr-2"
                  onClick={() => {
                    userQuery.refetch();
                  }}
                >
                  Try Again!
                </Button>
              )}
              <div className="p-2">
                <NotificationPopover />
              </div>
            </div>
            <div className="flex-1 px-2 lg:px-4">
              <NavigationLinks />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-col">
          <header className="flex h-14 items-center gap-4 border-b bg-background px-4 lg:h-[60px] lg:px-6">
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="shrink-0 md:hidden"
                >
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle navigation menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="flex flex-col bg-background">
                <div className="flex gap-2 items-center">
                  <TeamSelector
                    teams={teams || []}
                    currentTeam={currentTeam}
                    onTeamChange={setCurrentTeam}
                  />

                  <NotificationPopover />
                </div>
                <NavigationLinks className="mt-4" iconClassName="h-5 w-5" />
              </SheetContent>
            </Sheet>
            <div className="w-full flex-1">
              <ModeToggle />
            </div>
            <UserMenu onLogout={handleLogOut} />
          </header>
          <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 bg-background">
            <div className="flex flex-1 justify-center rounded-lg shadow-sm">
              {children}
            </div>
          </main>
        </div>
      </div>
      {process.env.NODE_ENV === "development" && (
        <ReactQueryDevtools initialIsOpen />
      )}
    </>
  );
}
