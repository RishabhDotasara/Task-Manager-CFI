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
import { Club, Team, User } from "@prisma/client";
import { permissionAtom } from "@/states/permissionAtom";
import { getDynamicPermissions } from "@/permissionManager/permissions";
import { NotificationPopover } from "@/components/notifications/NotificationPopOver";
import { notificationAtom } from "@/states/notificationAtom";
import { clubAtom } from "@/states/clubAtoms";
import useUserInfo from "@/hooks/use-userinfo";
import NotLoggedInMessage from "@/components/not-loggedin";

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
  const [notifications, setNotifications] = useRecoilState(notificationAtom);
  const [userClubs, setuserClubs] = useRecoilState(clubAtom);
  const UserInfoQuery = useUserInfo()
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  useEffect(() => {
    if (session.status === "unauthenticated") {
      setIsLoggedIn(false);
    }
  }, [session.status]);
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    
  useEffect(() => {
    if (UserInfoQuery.data)
    {
      UserInfoQuery.data && setTeams(UserInfoQuery.data.teams)
      // UserInfoQuery.data && setCurrentTeam(UserInfoQuery.data.teams[0].teamId)
    }
  }, [UserInfoQuery.isLoading]);

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

  if (!isLoggedIn)
  {
    return (
      <NotLoggedInMessage/>
    )
  }


  return (
    <>
      <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
        {/* Sidebar */}
        <div className="hidden border-r bg-background md:block">
          <div className="flex h-full max-h-screen flex-col gap-2">
            <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
              {!UserInfoQuery.isError && (
                <TeamSelector
                  teams={teams || []}
                  currentTeam={currentTeam}
                  onTeamChange={setCurrentTeam}
                  fetchQuery={UserInfoQuery}
                />
              )}
              {UserInfoQuery.isError && (
                <Button
                  variant={"outline"}
                  className="w-full mr-2"
                  onClick={() => {
                    UserInfoQuery.refetch();
                  }}
                >
                  Try Again!
                </Button>
              )}
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
                    fetchQuery={UserInfoQuery}
                  />

              
                </div>
                <NavigationLinks className="mt-4" iconClassName="h-5 w-5" />
              </SheetContent>
            </Sheet>
            <div className="w-full flex-1 flex gap-2">
              <ModeToggle />
              <NotificationPopover />
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
      {
        process.env.NODE_ENV === "development" && (
          <ReactQueryDevtools initialIsOpen />
        )
      }
    </>
  );
}
