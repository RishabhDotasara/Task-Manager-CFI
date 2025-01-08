import { notificationAtom } from "@/states/notificationAtom";

import { useState } from "react";
import { useRecoilState } from "recoil";
import { useToast } from "./use-toast";
import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";

export function useNotifications() {
  const [notifications, setNotifications] = useRecoilState(notificationAtom);
  const {toast} = useToast()
  const session = useSession()

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

  const notificationsQuery = useQuery({
      queryKey:['notifications', session.data?.userId],
      queryFn:fetchNotifications,
      refetchInterval: 5 * 60 * 1000,
      staleTime: 5 * 60 * 1000
    })

  const markAsRead = async (id: number) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.notificationId === id
          ? { ...notification, read: true }
          : notification
      )
    );
    try {
      const response = await fetch(`/api/notification/markRead?notId=${id}`, {
        method:"PUT"
      })
      const data = response.json()
      return "Success"
    } catch (err) {
      console.log(err);
    }
  };

  return {
    notifications,
    markAsRead,
    isError: notificationsQuery.isError,
    refetch: notificationsQuery.refetch,
    isLoading: notificationsQuery.isRefetching
  };
}
