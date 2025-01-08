"use client";
import { ResourceError } from "@/components/error/resource-error";
import ProfileView from "@/components/profile/Profile";
import { useToast } from "@/hooks/use-toast";
import useUserInfo from "@/hooks/use-userinfo";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import React from "react";

export default function ProfilePage() {
  const session = useSession();
  const { toast } = useToast();
  const userInfo = useQuery({
    queryKey: ["user", session.data?.userId],
    queryFn: async () => {
      try {
        const response = await fetch(
          `/api/user/get?userId=${session.data?.userId}`
        );
        const data = await response.json();
        console.log(data)
        return data.user;
      } catch (err) {
        console.error(err);
        toast({
          title: "Error Loading Profile.",
          description: "Try Again!",
        });
      }
    },
    staleTime:Infinity
  });

  if (userInfo.isError) {
    return (
      <ResourceError
        message="error loading profile"
        onRetry={userInfo.refetch}
      />
    );
  }
  return (
    <ProfileView
      username={userInfo.data?.username}
      employeeId={userInfo.data?.employeeId}
      email={userInfo.data?.email}
    />
  );
}
