import { notificationAtom } from "@/states/notificationAtom";

import { useState } from "react";
import { useRecoilState } from "recoil";

export function useNotifications() {
  const [notifications, setNotifications] = useRecoilState(notificationAtom);

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
  };
}
